import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import ORIGIN_URL
from app.routers import reports
from app.core.socket import sio
import app.sockets.research

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://af-deep-research.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get( 
    "/health",
    status_code=200,
    tags=["health"],
    summary="Return 200 if the app is up."
)
async def check_health():
    return {"status": "ok"}

app.include_router(reports.router)

socket_app = socketio.ASGIApp(sio, socketio_path="/ws/socket.io")
app.mount("/ws", socket_app)
