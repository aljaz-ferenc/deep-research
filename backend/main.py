from llm_agents.report_builder import report_builder
from llm_agents.scraper import scraper
from llm_agents.web_searcher import web_searcher
from models import CustomEvents, Statuses
from llm_agents.queries_generator import GeneratedQueriesOutput, queries_generator
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
    # print(query)
    # run queries agent
    with trace("Deep Research"):
        await update_status(Statuses.GENERATING_QUERIES, sid, queries_generator.model.model)
        generated_queries_result = await Runner.run(queries_generator, input=query)
        # print(generated_queries_result.final_output)
        output: GeneratedQueriesOutput = generated_queries_result.final_output
        queries = [q.model_dump() for q in output.queries]
        explanation = output.explanation
        await sio.emit(CustomEvents.QUERIES_GENERATED.value, {'queries':{'queries': queries, 'explanation': explanation}}, namespace='/ws', to=sid)

        # # run web search agent
        await update_status(Statuses.SEARCHING_WEB, sid, web_searcher.model)

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
        await update_status(Statuses.SCRAPING_DATA, sid, scraper.model)

        summaries=f"Original query: {query}\n\n"
        
        for index, url in enumerate(urls):
            print(url['url'])
            scrape_result = await Runner.run(scraper, input=url['url'])
            summaries += f"{index + 1}. {scrape_result.final_output}\n Source: {url['url']}\n\n"


        report_builder_input = (
            f"Original query form the user: {query}\n"
            f"Summaries: {summaries}"
        )

        print('REPORT_BUILDER_INPUT: ', report_builder_input)
        print('SUMMARIES: ', summaries)
        
        await update_status(Statuses.GENERATING_REPORT, sid, report_builder.model)
        report_result = await Runner.run(report_builder, input=report_builder_input)
        report = report_result.final_output
        print(report)

        await update_status(Statuses.COMPLETE, sid, '')
        await sio.emit(CustomEvents.REPORT_GENERATED.value, {"report": report}, namespace='/ws', to=sid)

    
