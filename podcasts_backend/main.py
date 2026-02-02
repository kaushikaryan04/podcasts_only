import fastapi 
import uvicorn
import asyncio
import logging
import os
import logging
from typing import List

from database import RoomPeerDB


from fastapi import Request, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.concurrency import run_in_threadpool

# WebRTC primitives from aiortc. RTCPeerConnection is the core WebRTC object and
# RTCSessionDescription holds the SDP (offer/answer). MediaBlackhole discards
# incoming media (useful when we only need to receive audio but not store/play it).
from aiortc import RTCPeerConnection, RTCSessionDescription
from aiortc.contrib.media import MediaBlackhole, MediaRecorder

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("podcasts_backend")

app = fastapi.FastAPI()
room_db = RoomPeerDB()#temp db for testing users and rooms

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("FastAPI app initialized; CORS enabled for all origins (dev mode)")

# Keep references to active peer connections and media sinks so they are not
# garbage-collected while still in use. In production, you might attach these to
# a room/session manager and implement timeouts.
peer_connections: List[RTCPeerConnection] = []
media_sinks: List[object] = []  # MediaBlackhole or MediaRecorder


@app.post("/multiple-whip")
async def multiple_whip(request: Request):
    """
    This endpoint is used to create a new room and add a peer to it.
    """
    room_id = request.query_params.get("room_id")
    if not room_id:
        # for testing we will work in this condition by making a new room_id 
        room_id = room_db.initialize_room()
        logger.info(f"New room created: {room_id}")
        peer_id = request.query_params.get("peer_id")

        peer_data = {
            "peer_id": peer_id,
            "name": request.query_params.get("name") or f"Guest {peer_id}",
            "peer_connection": None,
            "incoming_track": None,
            "outgoing_track": None
        }
        raise HTTPException(status_code=400, detail="Room ID is required")
    if not room_db.room_exists(room_id):
        raise HTTPException(status_code=404, detail="Room not found")
    recorder = room_db.get_room_recorder(room_id)
    if not recorder:
        raise HTTPException(status_code=500, detail="Recorder not found")
    return recorder
    

@app.post("/whip")
async def whip(request: Request):
    """
    Minimal WHIP-like endpoint that accepts a WebRTC SDP offer (audio sendonly)
    and returns an SDP answer. The client posts the offer with
    Content-Type: application/sdp and receives the answer as application/sdp.

    Flow:
    1) Read offer SDP from request body and validate content type
    2) Create RTCPeerConnection and a MediaBlackhole to consume incoming audio
    3) Set remote description from the offer
    4) Create local answer, set it as local description
    5) Wait for ICE gathering to complete so the answer includes candidates
    6) Return the SDP answer. A background task watches the connection and
       performs cleanup when it ends.
    """
    # Log request arrival
    logger.info("/whip %s from %s", request.method, request.client.host if request.client else "unknown")
    # Expect Content-Type: application/sdp with SDP offer in body
    content_type = request.headers.get("content-type", "").lower()
    if "application/sdp" not in content_type:
        logger.warning("Bad Content-Type: %s", content_type)
        raise HTTPException(status_code=415, detail="Expected Content-Type application/sdp")

    offer_sdp = await request.body()
    if not offer_sdp:
        logger.warning("Empty request body")
        raise HTTPException(status_code=400, detail="Empty SDP offer")
    logger.info("Received offer SDP bytes: %d", len(offer_sdp))
    
    try:

        pc = RTCPeerConnection()
        # Option A: discard audio (default previously)
        # sink = MediaBlackhole()
        # Option B: record audio to a WAV file so you can listen later.
        # On macOS you can play it with: afplay /tmp/received_audio.wav
        sink_path = os.path.join(os.path.dirname(__file__), "received_audio.wav")
        sink = MediaRecorder(sink_path, format="wav")

        # Keep references until closed
        peer_connections.append(pc)
        media_sinks.append(sink)

        @pc.on("track")
        def on_track(track):
            # Called when the remote peer starts sending a track. We only expect
            # audio here; attach it to the blackhole sink.
            if track.kind == "audio":
                sink.addTrack(track)
                # Start the recorder asynchronously so we don't block the handler.
                # If using MediaBlackhole, start() is a no-op but harmless.
                async def _start_sink():
                    try:
                        await sink.start()
                        logger.info("Recorder started: %s", sink_path)
                    except Exception:
                        logger.exception("Failed to start recorder for %s", sink_path)
                asyncio.create_task(_start_sink())
                logger.info("Audio track added; recording to %s", sink_path)

            @track.on("ended")
            async def on_ended():
                # Stop the sink when the media track ends.
                try:
                    await sink.stop()
                except Exception:
                    logger.exception("Failed to stop recorder for %s", sink_path)
                # Log file size for confirmation
                try:
                    if os.path.exists(sink_path):
                        size = os.path.getsize(sink_path)
                        logger.info("Track ended; sink stopped. File saved: %s (%d bytes)", sink_path, size)
                    else:
                        logger.warning("Track ended; expected file not found: %s", sink_path)
                except Exception:
                    logger.exception("Error checking saved file: %s", sink_path)

        # Set remote description
        offer = RTCSessionDescription(sdp=offer_sdp.decode("utf-8"), type="offer")
        await pc.setRemoteDescription(offer)
        logger.info("Remote description set")

        # Create and set local answer
        answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        logger.info("Local answer created")

        # Wait for ICE gathering to complete so answer contains candidates
        async def ice_gathering_complete():
            while pc.iceGatheringState != "complete":
                await asyncio.sleep(0.05)

        await ice_gathering_complete()
        logger.info("ICE gathering complete: %s", pc.iceGatheringState)

        # Return the SDP answer
        sdp = pc.localDescription.sdp
        logger.info("Returning answer SDP bytes: %d", len(sdp))

        # Schedule cleanup when connection state becomes closed/failed/disconnected.
        # This avoids leaking peer connections if the client disconnects abruptly.
        async def watch_connection():
            try:
                while True:
                    state = pc.iceConnectionState
                    if state in ("failed", "closed", "disconnected"):
                        break
                    await asyncio.sleep(1.0)
            finally:
                await pc.close()
                if sink:
                    try:
                        await sink.stop()
                    except Exception:
                        logger.exception("Failed to stop sink during cleanup: %s", sink_path)
                    try:
                        if os.path.exists(sink_path):
                            size = os.path.getsize(sink_path)
                            logger.info("Cleanup complete. File at %s size=%d bytes", sink_path, size)
                    except Exception:
                        logger.exception("Error checking file size during cleanup: %s", sink_path)
                    # Remove from stores
                    try:
                        peer_connections.remove(pc)
                    except ValueError:
                        pass
                    try:
                        media_sinks.remove(sink)
                    except ValueError:
                        pass

        asyncio.create_task(watch_connection())

    except Exception as e:
        logger.exception("/whip error: %s", e)
        return Response(content=f"Error: {e}", media_type="text/plain")

    return Response(content=sdp, media_type="application/sdp")

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}



