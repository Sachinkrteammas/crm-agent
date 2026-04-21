from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db

router = APIRouter()


@router.get("/realtime-agents")
def get_realtime_agents(campaign_id: str = "Dialdesk", db: Session = Depends(get_db)):
    query = text("""
        SELECT 
            vu.full_name,
            vu.user,
            va.closer_campaigns,
            va.campaign_id,
            va.calls_today,
            va.last_call_time,
            va.status,
            va.pause_code
        FROM vicidial_live_agents va
        JOIN vicidial_users vu 
            ON va.user = vu.user
        WHERE va.campaign_id = :campaign_id
    """)

    result = db.execute(query, {"campaign_id": campaign_id}).mappings().all()
    return {"agents": [dict(row) for row in result]}