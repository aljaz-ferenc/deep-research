from llm_agents.report_builder import report_builder, run_builder
from llm_agents.scraper import run_scraper, scraper
from llm_agents.web_searcher import get_web_searcher_input, run_web_search, web_searcher
from models import CustomEvents, Statuses
from llm_agents.queries_generator import GeneratedQueriesOutput, queries_generator, run_queires_generator
import socketio
from fastapi import FastAPI
from agents import Runner, trace
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
    await update_status(Statuses.READY , sid, '')

@sio.on('disconnect', namespace='/ws')
async def disconnect(sid):
    print(f"Client disconnected from /ws namespace: {sid}")

async def update_status(status: Statuses, sid: str, model: str):
        await sio.emit(CustomEvents.STATUS_UPDATE.value, {'status':status.value, 'model': model}, namespace='/ws', to=sid)


@sio.on(CustomEvents.QUERY.value, namespace='/ws')
async def start_research(sid, query):
    try:
        with trace("Deep Research"):
            #generate queries
            await update_status(Statuses.GENERATING_QUERIES, sid, queries_generator.model.model)
            queries, explanation = await run_queires_generator(query)
            await sio.emit(CustomEvents.QUERIES_GENERATED.value, {'queries':{'queries': queries, 'explanation': explanation}}, namespace='/ws', to=sid)

            # #search web for links
            await update_status(Statuses.SEARCHING_WEB, sid, web_searcher.model)
            urls = await run_web_search(explanation, queries)
            await sio.emit(CustomEvents.URLS_GENERATED.value, {'searchResults': urls}, namespace='/ws', to=sid)

            #scrape links for data
            await update_status(Statuses.SCRAPING_DATA, sid, scraper.model)
            summaries = await run_scraper(query, urls)

            #build report
            await update_status(Statuses.GENERATING_REPORT, sid, report_builder.model.model)
            report = await run_builder(query, summaries)
            await update_status(Statuses.COMPLETE, sid, '')
            await sio.emit(CustomEvents.REPORT_GENERATED.value, {"report": report}, namespace='/ws', to=sid)
    except Exception as e:
        print(f'ERROR: {e}')

        error = 'Server error'

        if("rate_limit_exceeded" in str(e)):
            error = "Rate limit reached for gpt-4o-mini. Plaease wait and try again."

        await sio.emit(CustomEvents.ERROR.value, {"error": error}, namespace='/ws', to=sid)
    
