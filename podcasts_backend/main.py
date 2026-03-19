import asyncio
import logging
import os
from typing import List

import fastapi
from fastapi import Request, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from aiortc import RTCPeerConnection, RTCSessionDescription
from aiortc.contrib.media import MediaBlackhole, MediaRecorder

from database import RoomPeerDB

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s"
)
logger = logging.getLogger("podcasts_backend")

app = fastapi.FastAPI(
    title="Podcasts Backend",
    description="Room-based podcast recording and WebRTC audio streaming",
)
room_db = RoomPeerDB()

RECORDINGS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "recordings")
os.makedirs(RECORDINGS_DIR, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

peer_connections: List[RTCPeerConnection] = []
media_sinks: List[object] = []


# ---------- Room API ----------


@app.post("/rooms")
async def create_room():
    """Create a new podcast room. Returns room_id for clients to join."""
    room_id = room_db.initialize_room()
    logger.info("Room created: %s", room_id)
    return {"room_id": room_id}


@app.get("/rooms")
async def list_rooms():
    """List all active rooms with participant count."""
    ids = room_db.list_room_ids()
    rooms = []
    for rid in ids:
        peers = room_db.get_peers_in_room(rid)
        rooms.append(
            {"room_id": rid, "participant_count": len(peers)}
        )
    return {"rooms": rooms}


@app.get("/rooms/{room_id}")
async def get_room(room_id: str):
    """Get room info and list of participants (peer_id, name only)."""
    if not room_db.room_exists(room_id):
        raise HTTPException(status_code=404, detail="Room not found")
    peers = room_db.get_peers_in_room(room_id)
    participants = [{"peer_id": p["peer_id"], "name": p["name"]} for p in peers]
    return {"room_id": room_id, "participants": participants}


# ---------- WHIP (single peer, no room) ----------


@app.post("/whip")
async def whip(request: Request):
    """
    WHIP endpoint: accept SDP offer (audio sendonly), return SDP answer.
    Records to a single WAV file. Use /whip/room for multi-participant rooms.
    """
    content_type = request.headers.get("content-type", "").lower()
    if "application/sdp" not in content_type:
        raise HTTPException(status_code=415, detail="Expected Content-Type application/sdp")

    offer_sdp = await request.body()
    if not offer_sdp:
        raise HTTPException(status_code=400, detail="Empty SDP offer")

    try:
        pc = RTCPeerConnection()
        sink_path = os.path.join(os.path.dirname(__file__), "received_audio.wav")
        sink = MediaRecorder(sink_path, format="wav")
        peer_connections.append(pc)
        media_sinks.append(sink)

        @pc.on("track")
        def on_track(track):
            if track.kind == "audio":
                sink.addTrack(track)
                async def _start():
                    try:
                        await sink.start()
                        logger.info("Recorder started: %s", sink_path)
                    except Exception:
                        logger.exception("Failed to start recorder: %s", sink_path)
                asyncio.create_task(_start())
                logger.info("Audio track added; recording to %s", sink_path)

                @track.on("ended")
                async def on_ended():
                    try:
                        await sink.stop()
                    except Exception:
                        logger.exception("Failed to stop recorder: %s", sink_path)

        offer = RTCSessionDescription(sdp=offer_sdp.decode("utf-8"), type="offer")
        await pc.setRemoteDescription(offer)
        answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        while pc.iceGatheringState != "complete":
            await asyncio.sleep(0.05)
        sdp = pc.localDescription.sdp

        async def watch_connection():
            try:
                while True:
                    if pc.iceConnectionState in ("failed", "closed", "disconnected"):
                        break
                    await asyncio.sleep(1.0)
            finally:
                await pc.close()
                if sink:
                    try:
                        await sink.stop()
                    except Exception:
                        logger.exception("Failed to stop sink: %s", sink_path)
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


# ---------- WHIP with room (multi-participant recording) ----------


@app.post("/whip/room")
async def whip_room(request: Request):
    """
    Join a room with WebRTC. Query params: room_id, peer_id, name.
    Body: SDP offer (application/sdp).
    Records this peer's audio into the room's recording (all participants in one file).
    When the last peer leaves, the recording is finalized and listed under /recordings.
    """
    room_id = request.query_params.get("room_id")
    peer_id = request.query_params.get("peer_id")
    name = request.query_params.get("name") or f"Guest_{peer_id or 'unknown'}"

    if not room_id:
        raise HTTPException(status_code=400, detail="room_id is required")
    if not peer_id:
        raise HTTPException(status_code=400, detail="peer_id is required")
    if not room_db.room_exists(room_id):
        raise HTTPException(status_code=404, detail="Room not found")

    content_type = request.headers.get("content-type", "").lower()
    if "application/sdp" not in content_type:
        raise HTTPException(status_code=415, detail="Expected Content-Type application/sdp")
    offer_sdp = await request.body()
    if not offer_sdp:
        raise HTTPException(status_code=400, detail="Empty SDP offer")

    try:
        pc = RTCPeerConnection()
        recorder = room_db.get_room_recorder(room_id)
        recorder_path = room_db.get_room_recorder_path(room_id)

        if recorder is None:
            safe_room = room_id.replace("-", "_")[:32]
            recorder_path = os.path.join(
                RECORDINGS_DIR, f"room_{safe_room}.webm"
            )
            recorder = MediaRecorder(recorder_path, format="webm")
            room_db.set_room_recorder(room_id, recorder, recorder_path)
            logger.info("Room recorder created: %s", recorder_path)

        room_db.add_peer_to_room(
            room_id, peer_id, name, pc, incoming_track=None, outgoing_track=None
        )

        @pc.on("track")
        def on_track(track):
            if track.kind != "audio":
                return
            rec = room_db.get_room_recorder(room_id)
            peer = room_db.get_peer_by_id(room_id, peer_id)
            if rec and peer is not None:
                peer["incoming_track"] = track
                rec.addTrack(track)
                async def _start():
                    try:
                        await rec.start()
                        logger.info("Room recorder started for room %s", room_id)
                    except Exception:
                        logger.exception("Failed to start room recorder")
                asyncio.create_task(_start())
                logger.info("Peer %s audio added to room %s", peer_id, room_id)

        offer = RTCSessionDescription(sdp=offer_sdp.decode("utf-8"), type="offer")
        await pc.setRemoteDescription(offer)
        answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        while pc.iceGatheringState != "complete":
            await asyncio.sleep(0.05)
        sdp = pc.localDescription.sdp

        async def watch_connection():
            try:
                while True:
                    if pc.iceConnectionState in ("failed", "closed", "disconnected"):
                        break
                    await asyncio.sleep(1.0)
            finally:
                room_db.remove_peer_from_room(room_id, peer_id)
                rec = room_db.get_room_recorder(room_id)
                peers_left = room_db.get_peers_in_room(room_id)
                if rec and len(peers_left) == 0:
                    try:
                        await rec.stop()
                        logger.info("Room recorder stopped for room %s", room_id)
                    except Exception:
                        logger.exception("Failed to stop room recorder")
                    path = room_db.get_room_recorder_path(room_id)
                    if path and os.path.exists(path):
                        rec_id = room_db.add_recording(room_id, path)
                        logger.info("Recording saved: %s -> %s", rec_id, path)
                    room_db.get_room_by_id(room_id)["recorder"] = None
                    room_db.get_room_by_id(room_id)["recorder_path"] = None
                await pc.close()

        asyncio.create_task(watch_connection())
    except Exception as e:
        logger.exception("/whip/room error: %s", e)
        room_db.remove_peer_from_room(room_id, peer_id)
        return Response(content=f"Error: {e}", media_type="text/plain")

    return Response(content=sdp, media_type="application/sdp")


# ---------- Recordings API ----------


@app.get("/recordings")
async def list_recordings():
    """List all saved recordings (from rooms that have ended)."""
    recs = room_db.list_recordings()
    return {"recordings": [{"id": r["id"], "room_id": r["room_id"], "created_at": r["created_at"]} for r in recs]}


@app.get("/recordings/{recording_id}")
async def get_recording(recording_id: str):
    """Get recording metadata."""
    rec = room_db.get_recording(recording_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Recording not found")
    return rec


@app.get("/recordings/{recording_id}/file")
async def download_recording(recording_id: str):
    """Download the recording file."""
    rec = room_db.get_recording(recording_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Recording not found")
    path = rec.get("path")
    if not path or not os.path.isfile(path):
        raise HTTPException(status_code=404, detail="Recording file not found")
    return FileResponse(path, filename=os.path.basename(path))


# ---------- Health ----------


@app.get("/")
def read_root():
    return {"message": "Podcasts Backend", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
