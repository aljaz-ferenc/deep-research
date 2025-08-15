from models import CustomEvents, Statuses

async def update_status(status: Statuses, sid: str, model: str, sio):
    await sio.emit(
        CustomEvents.STATUS_UPDATE.value,
        {"status": status.value, "model": model},
        namespace="/ws",
        to=sid,
    )