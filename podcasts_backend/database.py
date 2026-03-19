import uuid
from datetime import datetime
from typing import Optional, Dict, List, Any, Union
from aiortc import RTCPeerConnection, MediaStreamTrack
from aiortc.contrib.media import MediaRecorder

"""
In-memory DB for rooms, peers, and recordings.
room_id (key): {
    "peers": [{"peer_id", "name", "peer_connection", "incoming_track", "outgoing_track"}],
    "recorder": MediaRecorder,
    "recorder_path": str,
}
recordings: [{"id", "room_id", "path", "created_at"}]
"""


class RoomPeerDB:
    def __init__(self) -> None:
        self.room_peers_db: Dict[str, Dict] = {}
        self.recordings: List[Dict[str, Any]] = []

    def initialize_room(self) -> str:
        room_id = str(uuid.uuid4())
        self.room_peers_db[room_id] = {
            "peers": [],
            "recorder": None,
            "recorder_path": None,
        }
        return room_id

    def add_peer_to_room(
        self,
        room_id: str,
        peer_id: Union[str, int],
        name: str,
        peer_connection: RTCPeerConnection,
        incoming_track: Optional[MediaStreamTrack] = None,
        outgoing_track: Optional[MediaStreamTrack] = None,
    ) -> None:
        if room_id not in self.room_peers_db:
            raise ValueError(f"Room {room_id} does not exist")
        peer_data = {
            "peer_id": peer_id,
            "name": name,
            "peer_connection": peer_connection,
            "incoming_track": incoming_track,
            "outgoing_track": outgoing_track,
        }
        self.room_peers_db[room_id]["peers"].append(peer_data)

    def remove_peer_from_room(self, room_id: str, peer_id: Union[str, int]) -> None:
        if room_id not in self.room_peers_db:
            return
        self.room_peers_db[room_id]["peers"] = [
            p for p in self.room_peers_db[room_id]["peers"] if p["peer_id"] != peer_id
        ]

    def get_peers_in_room(self, room_id: str) -> List[Dict]:
        if room_id not in self.room_peers_db:
            return []
        return self.room_peers_db[room_id]["peers"]

    def get_peer_by_id(
        self, room_id: str, peer_id: Union[str, int]
    ) -> Optional[Dict]:
        if room_id not in self.room_peers_db:
            return None
        return next(
            (
                p
                for p in self.room_peers_db[room_id]["peers"]
                if p["peer_id"] == peer_id
            ),
            None,
        )

    def get_room_by_id(self, room_id: str) -> Optional[Dict]:
        return self.room_peers_db.get(room_id)

    def set_room_recorder(
        self, room_id: str, recorder: MediaRecorder, path: str
    ) -> None:
        if room_id not in self.room_peers_db:
            raise ValueError(f"Room {room_id} does not exist")
        self.room_peers_db[room_id]["recorder"] = recorder
        self.room_peers_db[room_id]["recorder_path"] = path

    def get_room_recorder(self, room_id: str) -> Optional[MediaRecorder]:
        if room_id not in self.room_peers_db:
            return None
        return self.room_peers_db[room_id].get("recorder")

    def get_room_recorder_path(self, room_id: str) -> Optional[str]:
        if room_id not in self.room_peers_db:
            return None
        return self.room_peers_db[room_id].get("recorder_path")

    def room_exists(self, room_id: str) -> bool:
        return room_id in self.room_peers_db

    def list_room_ids(self) -> List[str]:
        return list(self.room_peers_db.keys())

    def add_recording(self, room_id: str, path: str) -> str:
        rec_id = str(uuid.uuid4())
        self.recordings.append(
            {
                "id": rec_id,
                "room_id": room_id,
                "path": path,
                "created_at": datetime.utcnow().isoformat() + "Z",
            }
        )
        return rec_id

    def get_recording(self, recording_id: str) -> Optional[Dict]:
        return next((r for r in self.recordings if r["id"] == recording_id), None)

    def get_recordings_for_room(self, room_id: str) -> List[Dict]:
        return [r for r in self.recordings if r["room_id"] == room_id]

    def list_recordings(self) -> List[Dict]:
        return list(self.recordings)