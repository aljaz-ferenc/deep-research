from datetime import datetime, timezone
from app.core.database import reports_collection
from .config import DAILY_LIMIT
from models import CustomEvents, Statuses

async def check_daily_limit(sio, sid: str) -> bool:
    now = datetime.now(timezone.utc)
    start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
    try:
        count_today = reports_collection.count_documents({"createdAt": {"$gte": start_of_day}})
        if count_today >= DAILY_LIMIT:
            await sio.emit(
                CustomEvents.ERROR.value,
                {"error": "Daily report limit reached"},
                namespace="/ws",
                to=sid
            )
            return False
        return True
    except Exception:
        await sio.emit(
            CustomEvents.ERROR.value,
            {"error": "Could not get report count"},
            namespace="/ws",
            to=sid
        )
        return False
    

async def update_status(sio, status: Statuses, sid: str, model: str):
    await sio.emit(
        CustomEvents.STATUS_UPDATE.value,
        {"status": status.value, "model": model},
        namespace="/ws",
        to=sid,
    )