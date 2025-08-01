from turtle import up
from llm_agents.web_searcher import web_searcher
from models import CustomEvents, Statuses
from llm_agents.queries_generator import GeneratedQueriesOutput, queries_generator
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
    print(f"Client connected to /ws namespace: {sid}")

@sio.on('disconnect', namespace='/ws')
async def disconnect(sid):
    print(f"Client disconnected from /ws namespace: {sid}")

async def update_status(status: Statuses, sid: str):
        await sio.emit(CustomEvents.STATUS_UPDATE.value, {'status':status.value}, namespace='/ws', to=sid)


@sio.on(CustomEvents.QUERY.value, namespace='/ws')
async def start_research(sid, query):
    print(query)
    # run queries agent
    await update_status(Statuses.GENERATING_QUERIES, sid)
    generated_queries_result = await Runner.run(queries_generator, input=query)
    print(generated_queries_result.final_output)
    output: GeneratedQueriesOutput = generated_queries_result.final_output
    queries = [q.model_dump() for q in output.queries]
    explanation = output.explanation
    await sio.emit(CustomEvents.QUERIES_GENERATED.value, {'queries':{'queries': queries, 'explanation': explanation}}, namespace='/ws', to=sid)

    # # run web search agent
    await update_status(Statuses.SEARCHING_WEB, sid)

    input = [
    {
        "role": "user",
        "content":
            "Here is an explanation of what the research is about:\n\n"
            f"{explanation}\n\n"
            "Here are the queries:\n" +
            "\n".join(f"{q['id']}. {q['query']}" for q in queries) +
            "\n\nFor each query, return a URL that answers it. Respond with a list of query_id and url."
    }
]

    web_search_result = await Runner.run(web_searcher, input=input)
    urls = [q.model_dump() for q in web_search_result.final_output]
    await sio.emit(CustomEvents.URLS_GENERATED.value, {'searchResults': urls}, namespace='/ws', to=sid)
    await update_status(Statuses.SCRAPING_DATA, sid)
    # print(urls)

