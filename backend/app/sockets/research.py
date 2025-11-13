from llm_agents.translator import run_translator
from llm_agents.report_builder import report_builder, run_builder
from llm_agents.scraper import run_scraper, scraper
from llm_agents.web_searcher import run_web_search, web_searcher
from models import CustomEvents, Statuses
from llm_agents.queries_generator import (
    queries_generator,
    run_queires_generator,
)
from agents import trace
from datetime import datetime, timezone
from app.core.database import reports_collection
from app.core.utils import check_daily_limit, update_status
from app.core.socket import sio


@sio.on("connect", namespace="/ws")
async def connect(sid, environ):
    print(f"Client connected to /ws namespace: {sid}")
    await update_status(sio, Statuses.READY, sid, "")


@sio.on("disconnect", namespace="/ws")
async def disconnect(sid):
    print(f"Client disconnected from /ws namespace: {sid}")


@sio.on(CustomEvents.QUERY.value, namespace="/ws")
async def start_research(sid, query, language="English"):
    if not await check_daily_limit(sio, sid):
        return

    try:
        with trace("Deep Research"):
            ctx = {"sid": sid, "sio": sio}

            # generate queries
            await update_status(
                sio, Statuses.VERIFYING_INPUT, sid, queries_generator.model.model
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
            await update_status(sio, Statuses.SEARCHING_WEB, sid, web_searcher.model)
            urls = await run_web_search(queries_output.explanation, queries_output)
            await sio.emit(
                CustomEvents.URLS_GENERATED.value,
                {"searchResults": urls},
                namespace="/ws",
                to=sid,
            )

            # scrape links for data
            await update_status(sio, Statuses.SCRAPING_DATA, sid, scraper.model)
            summaries = await run_scraper(query, urls)

            # build report
            await update_status(
                sio, Statuses.GENERATING_REPORT, sid, report_builder.model.model
            )
            report = await run_builder(query, summaries)

            if language != "English":
                # translate report
                report = await run_translator(language=language, report=report)

            report_doc = report.model_dump()
            report_doc["createdAt"] = datetime.now(timezone.utc)
            result = reports_collection.insert_one(report_doc)

            await update_status(sio, Statuses.COMPLETE, sid, "")
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
