from models import CustomEvents, Statuses
from llm_agents.queries_generator import queries_generator
import socketio
from fastapi import FastAPI
from agents import Runner
from dotenv import load_dotenv

load_dotenv()

# uv run python -m uvicorn main:app --reload

sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins=["http://localhost:5173"])
app = FastAPI()
socket_app = socketio.ASGIApp(sio, socketio_path="/ws/socket.io")
app.mount("/ws", socket_app)

@app.get('/api/v1/hello')
async def hello():
    return {'message':'hello world'}

@sio.on('connect', namespace='/ws')
async def connect(sid, environ):
    await sio.emit('greeting', {'message':'helooooo'}, namespace='/ws', to=sid)
    
    print(f"Client connected to /ws namespace: {sid}")

@sio.on('disconnect', namespace='/ws')
async def disconnect(sid):
    print(f"Client disconnected from /ws namespace: {sid}")

@sio.on(CustomEvents.QUERY.value, namespace='/ws')
async def start_research(sid, query):
    print(query)
    # run queries agent
    await sio.emit(CustomEvents.STATUS_UPDATE.value, {'status':Statuses.GENERATING_QUERIES.value}, namespace='/ws', to=sid)
    result = await Runner.run(queries_generator, input=query)
    queries = result.final_output
    await sio.emit(CustomEvents.QUERIES_GENERATED.value, {'queries':queries}, namespace='/ws', to=sid)
    print(queries)

