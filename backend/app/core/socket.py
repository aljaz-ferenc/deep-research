from fastapi import FastAPI
import socketio
from .config import ORIGIN_URL

sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins="*", 
    logger=True,
    engineio_logger=True  
)

socket_app = socketio.ASGIApp(sio, socketio_path="socket.io")


def mount_socket(app: FastAPI):
    app.mount("/ws", socket_app)
