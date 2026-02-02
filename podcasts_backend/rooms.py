from pydantic import BaseModel, Optional, List
from datetime import datetime
from fastapi import APIRouter


router = APIRouter()

class Participant(BaseModel):
    id: int
    name: str
    email: Optional[str] = None

class Room(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    image: Optional[str] = None
    created_at: datetime
    is_active : bool = False 
    host : Participant
    participants : List[Participant] = [host]


rooms = []

@router.get('/create-room')
def create_room(room: Room):
    rooms.append(room)
    return room

@router.get('/get-rooms')
def get_rooms():
    return rooms

@router.get('/get-room/{room_id}')
def get_room(room_id: int):
    return next((room for room in rooms if room.id == room_id), None)