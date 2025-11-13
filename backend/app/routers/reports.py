from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from dotenv import load_dotenv
from bson import ObjectId
from app.core.database import reports_collection


load_dotenv()

DAILY_LIMIT = 3

router = APIRouter(prefix='/api/v1/reports', tags=['Reports'])

@router.get("/")
async def get_reports():
    try:
        cursor = reports_collection.find({})
        reports = []
        for r in cursor:
            r["_id"] = str(r["_id"]) 
            reports.append(r)
        return reports
    except Exception:
        raise HTTPException(status_code=500, detail="Could not get reports")


@router.get("/limit")
async def get_report_limit():
    now = datetime.now(timezone.utc)
    start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)

    try:
        count_today = reports_collection.count_documents({
            "createdAt": {"$gte": start_of_day}
        })
    except Exception as err:
        raise HTTPException(status_code=500, detail=f'Could not count reports. {err}')

    return {
        "limit": DAILY_LIMIT,
        "used": count_today,
        "remaining": max(0, DAILY_LIMIT - count_today)
    }

@router.get("/{reportId}")
async def get_report(reportId: str):
    try:
        oid = ObjectId(reportId)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid report ID")

    report = reports_collection.find_one({"_id": oid})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report["_id"] = str(report["_id"])
    return report

@router.delete("/{reportId}")
async def delete_report(reportId: str):
    try:
        oid = ObjectId(reportId)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid report ID")

    result = reports_collection.delete_one({"_id": oid})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")

    return {"message": "Report deleted successfully", "reportId": reportId}
