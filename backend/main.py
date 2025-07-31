import socketio
from fastapi import FastAPI

sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins=["http://localhost:5173"])
app = FastAPI()
socket_app = socketio.ASGIApp(sio, socketio_path="/ws/socket.io")
app.mount("/ws", socket_app)

@app.get('/api/v1/hello')
async def hello():
    return {'message':'hello world'}

@sio.on('connect', namespace='/ws')
async def connect(sid, environ):
    await sio.emit('greeting', {'message':'helooooo'}, namespace='/ws')
    
    print(f"Client connected to /ws namespace: {sid}")

@sio.on('disconnect', namespace='/ws')
async def disconnect(sid):
    print(f"Client disconnected from /ws namespace: {sid}")

@sio.on('query', namespace='/ws')
async def start_research(sid, data):
    print(data)

