from llm_agents.translator import run_translator
from llm_agents.report_builder import report_builder, run_builder
from llm_agents.scraper import run_scraper, scraper
from llm_agents.web_searcher import get_web_searcher_input, run_web_search, web_searcher
from models import CustomEvents, Statuses
from llm_agents.queries_generator import (
    queries_generator,
    run_queires_generator,
)
import socketio
from fastapi import FastAPI
from agents import Runner, trace
from dotenv import load_dotenv
from pymongo import MongoClient
import os
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# uv run python -m uvicorn main:app --reload

ORIGIN_URL=os.getenv("ORIGIN_URL")
MONGO_URI=os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client['deep-research']
collection=db['reports']

sio = socketio.AsyncServer(
    async_mode="asgi", cors_allowed_origins=[ORIGIN_URL]
)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[ORIGIN_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
socket_app = socketio.ASGIApp(sio, socketio_path="/ws/socket.io")
app.mount("/ws", socket_app)


@app.get("/api/v1/hello")
async def hello():
    return {"message": "hello world"}

@app.get("/api/v1/reports")
async def get_reports():
    cursor = collection.find({})
    reports = []
    for r in cursor:
        r["_id"] = str(r["_id"]) 
        reports.append(r)
    return reports

@app.get("/api/v1/reports/{reportId}")
async def get_report(reportId: str):
    try:
        oid = ObjectId(reportId)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid report ID")

    report = collection.find_one({"_id": oid})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report["_id"] = str(report["_id"])
    return report

@app.delete("/api/v1/reports/{reportId}")
async def delete_report(reportId: str):
    try:
        oid = ObjectId(reportId)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid report ID")

    result = collection.delete_one({"_id": oid})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")

    return {"message": "Report deleted successfully", "reportId": reportId}


@sio.on("connect", namespace="/ws")
async def connect(sid, environ):
    print(f"Client connected to /ws namespace: {sid}")
    await update_status(Statuses.READY, sid, "")


@sio.on("disconnect", namespace="/ws")
async def disconnect(sid):
    print(f"Client disconnected from /ws namespace: {sid}")


async def update_status(status: Statuses, sid: str, model: str):
    await sio.emit(
        CustomEvents.STATUS_UPDATE.value,
        {"status": status.value, "model": model},
        namespace="/ws",
        to=sid,
    )


@sio.on(CustomEvents.QUERY.value, namespace="/ws")
async def start_research(sid, query, language="English"):
    try:
        with trace("Deep Research"):
            ctx = {"sid": sid, "sio":sio}
            
            # generate queries
            await update_status(
                Statuses.VERIFYING_INPUT, sid, queries_generator.model.model
            )
            queries_output = await run_queires_generator(query, context=ctx)
            await sio.emit(
                CustomEvents.QUERIES_GENERATED.value,
                {
                    "queries": {
                        "queries": [q.model_dump() for q in queries_output.queries],
                        "explanation": queries_output.explanation,
                    }
                },
                namespace="/ws",
                to=sid,
            )

            # #search web for links
            await update_status(Statuses.SEARCHING_WEB, sid, web_searcher.model)
            urls = await run_web_search(queries_output.explanation, queries_output)
            await sio.emit(
                CustomEvents.URLS_GENERATED.value,
                {"searchResults": urls},
                namespace="/ws",
                to=sid,
            )

            # scrape links for data
            await update_status(Statuses.SCRAPING_DATA, sid, scraper.model)
            summaries = await run_scraper(query, urls)

            # build report
            await update_status(
                Statuses.GENERATING_REPORT, sid, report_builder.model.model
            )
            report = await run_builder(query, summaries)

            if language != "English":
                # translate report
                report = await run_translator(language=language, report=report)

            
            report_doc = report.model_dump()
            report_doc["createdAt"] = datetime.now(timezone.utc)
            result = collection.insert_one(report_doc)

            await update_status(Statuses.COMPLETE, sid, "")
            await sio.emit(
                CustomEvents.REPORT_GENERATED.value,
                {"reportId": str(result.inserted_id)},
                namespace="/ws",
                to=sid,
            )
    except Exception as e:
        print(f"ERROR: {e}")

        error = "Server error"

        if "rate_limit_exceeded" in str(e):
            error = "Rate limit reached for gpt-4o-mini. Plaease wait and try again."

        await sio.emit(
            CustomEvents.ERROR.value, {"error": error}, namespace="/ws", to=sid
        )
