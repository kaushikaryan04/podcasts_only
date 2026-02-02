import uuid
from typing import Optional, Dict, List
from aiortc import RTCPeerConnection, RTCAudioTrack
from aiortc.contrib.media import MediaRecorder

"""
this db is temp which will only be used while the app is running
structure of db 

 room_id (key) : {
    "peers": [
        {
            "peer_id": int,
            "name": str,
            "peer_connection": RTCPeerConnection,
            "incoming_track": RTCAudioTrack,  # Audio received from this client
            "outgoing_track": RTCAudioTrack   # Mixed audio to send back (excluding their own)
        }
    ],
    "recorder": MediaRecorder  # Records full mixed audio of all participants
 }
"""

class RoomPeerDB:
    def __init__(self) -> None : 
        self.room_peers_db: Dict[str, Dict] = {}
    
    def initialize_room(self) -> str : 
        """Initialize a new room and return its UUID"""
        room_id = str(uuid.uuid4())
        self.room_peers_db[room_id] = {
            "peers": [],
            "recorder": None  # Will be set up when first peer joins
        }
        return room_id
    
    def add_peer_to_room(self, room_id: str, peer_id: int, name: str, 
                        peer_connection: RTCPeerConnection,
                        incoming_track: Optional[RTCAudioTrack] = None,
                        outgoing_track: Optional[RTCAudioTrack] = None) -> None:
        """Add a peer to a room with their WebRTC connection and tracks"""
        if room_id not in self.room_peers_db:
            raise ValueError(f"Room {room_id} does not exist")
        
        peer_data = {
            "peer_id": peer_id,
            "name": name,
            "peer_connection": peer_connection,
            "incoming_track": incoming_track,
            "outgoing_track": outgoing_track
        }
        self.room_peers_db[room_id]["peers"].append(peer_data)

    def remove_peer_from_room(self, room_id: str, peer_id: int) -> None:
        """Remove a peer from a room"""
        if room_id not in self.room_peers_db:
            return
        self.room_peers_db[room_id]["peers"] = [
            peer for peer in self.room_peers_db[room_id]["peers"] 
            if peer["peer_id"] != peer_id
        ]

    def get_peers_in_room(self, room_id: str) -> List[Dict]:
        """Get all peers in a room"""
        if room_id not in self.room_peers_db:
            return []
        return self.room_peers_db[room_id]["peers"]

    def get_peer_by_id(self, room_id: str, peer_id: int) -> Optional[Dict]:
        """Get a specific peer by ID in a room"""
        if room_id not in self.room_peers_db:
            return None
        return next(
            (peer for peer in self.room_peers_db[room_id]["peers"] 
             if peer["peer_id"] == peer_id), 
            None
        )

    def get_room_by_id(self, room_id: str) -> Optional[Dict]:
        """Get room data by ID"""
        return self.room_peers_db.get(room_id)
    
    def set_room_recorder(self, room_id: str, recorder: MediaRecorder) -> None:
        """Set the MediaRecorder for a room (records all mixed audio)"""
        if room_id not in self.room_peers_db:
            raise ValueError(f"Room {room_id} does not exist")
        self.room_peers_db[room_id]["recorder"] = recorder
    
    def get_room_recorder(self, room_id: str) -> Optional[MediaRecorder]:
        """Get the MediaRecorder for a room"""
        if room_id not in self.room_peers_db:
            return None
        return self.room_peers_db[room_id]["recorder"]
    
    def room_exists(self, room_id: str) -> bool:
        """Check if a room exists"""
        return room_id in self.room_peers_db