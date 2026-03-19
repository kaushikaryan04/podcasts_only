"""Tests for podcast backend API."""
import pytest
from fastapi.testclient import TestClient

from main import app, room_db

client = TestClient(app)


def test_root():
    r = client.get("/")
    assert r.status_code == 200
    data = r.json()
    assert "message" in data
    assert "Podcasts" in data["message"]


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_create_room():
    r = client.post("/rooms")
    assert r.status_code == 200
    data = r.json()
    assert "room_id" in data
    assert len(data["room_id"]) == 36  # UUID format


def test_list_rooms():
    r = client.post("/rooms")
    assert r.status_code == 200
    room_id = r.json()["room_id"]
    r = client.get("/rooms")
    assert r.status_code == 200
    data = r.json()
    assert "rooms" in data
    ids = [x["room_id"] for x in data["rooms"]]
    assert room_id in ids


def test_get_room():
    r = client.post("/rooms")
    assert r.status_code == 200
    room_id = r.json()["room_id"]
    r = client.get(f"/rooms/{room_id}")
    assert r.status_code == 200
    data = r.json()
    assert data["room_id"] == room_id
    assert "participants" in data
    assert data["participants"] == []


def test_get_room_not_found():
    r = client.get("/rooms/nonexistent-room-id-12345")
    assert r.status_code == 404


def test_recordings_empty():
    r = client.get("/recordings")
    assert r.status_code == 200
    data = r.json()
    assert "recordings" in data


def test_get_recording_not_found():
    r = client.get("/recordings/nonexistent-recording-id")
    assert r.status_code == 404


def test_whip_room_missing_room_id():
    r = client.post(
        "/whip/room",
        content=b"v=0\r\n",
        headers={"Content-Type": "application/sdp"},
    )
    assert r.status_code == 400


def test_whip_room_missing_peer_id():
    r = client.post("/rooms")
    assert r.status_code == 200
    room_id = r.json()["room_id"]
    r = client.post(
        f"/whip/room?room_id={room_id}",
        content=b"v=0\r\n",
        headers={"Content-Type": "application/sdp"},
    )
    assert r.status_code == 400


def test_whip_room_room_not_found():
    r = client.post(
        "/whip/room?room_id=nonexistent&peer_id=1",
        content=b"v=0\r\n",
        headers={"Content-Type": "application/sdp"},
    )
    assert r.status_code == 404


def test_whip_wrong_content_type():
    r = client.post("/whip", content=b"", headers={"Content-Type": "text/plain"})
    assert r.status_code == 415


def test_whip_empty_body():
    r = client.post("/whip", content=b"", headers={"Content-Type": "application/sdp"})
    assert r.status_code == 400
