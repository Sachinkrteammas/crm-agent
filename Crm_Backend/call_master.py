# Crm_Backend/call_master.py
import json
import logging
import os
from http.client import HTTPException
from io import BytesIO

import httpx
from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import APIRouter, Query, Depends, Body,HTTPException
from sqlalchemy import text
from typing import List, Dict, Optional, Any

from starlette.responses import StreamingResponse

from schemas import *
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from models import AlertMechanisms, AlertScheduler, CallFlow, SmsLogHistory, WhatsAppLogHistory, EmailLogHistory
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from database import get_engine, get_db
from database import SessionLocal
router = APIRouter(tags=["Call Master"])

@router.get("/call-master/{client_id}", response_model=List[Dict])
def get_call_master_data(
    client_id: int,
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
    Category1: Optional[str] = Query(None),
    Category2: Optional[str] = Query(None),
    Category3: Optional[str] = Query(None),
    Category4: Optional[str] = Query(None),
    Category5: Optional[str] = Query(None),
):
    engine = get_engine()
    with engine.connect() as conn:
        # Step 1: Fetch field mappings
        field_meta_query = """
            SELECT fieldNumber, FieldName 
            FROM field_master 
            WHERE client_id = :client_id 
              AND (FieldStatus IS NULL OR FieldStatus != 'D')
            ORDER BY fieldNumber
        """
        field_meta = conn.execute(text(field_meta_query), {"client_id": client_id}).mappings().all()

        # Early return if no fields configured
        if not field_meta:
            return []

        # Build column list
        field_map = {f["fieldNumber"]: f["FieldName"] for f in field_meta}
        columns = [f"field{fnum}" for fnum in field_map]
        columns += ["CallDate", "Category1", "Category2", "Category3", "Category4", "Category5"]

        # Step 2: WHERE clause setup
        where_clauses = ["client_id = :client_id"]
        params = {"client_id": client_id}

        if from_date:
            where_clauses.append("CallDate >= :from_date")
            params["from_date"] = from_date
        if to_date:
            where_clauses.append("CallDate <= :to_date")
            params["to_date"] = to_date

        # Optional category filters (OR inside group)
        category_conditions = []
        for i, val in enumerate([Category1, Category2, Category3, Category4, Category5], start=1):
            if val:
                category_conditions.append(f"Category{i} = :Category{i}")
                params[f"Category{i}"] = val

        if category_conditions:
            where_clauses.append(f"({' OR '.join(category_conditions)})")

        where_clause = " AND ".join(where_clauses)
        select_cols = ", ".join(columns)

        # Step 3: Execute final query
        query = f"SELECT {select_cols} FROM call_master WHERE {where_clause}"
        result = conn.execute(text(query), params).mappings().all()

        # Step 4: Format response
        response = []
        for row in result:
            record = {}
            for fnum, label in field_map.items():
                record[label] = row.get(f"field{fnum}")
            record.update({
                "CallDate": row.get("CallDate"),
                "Category1": row.get("Category1"),
                "Category2": row.get("Category2"),
                "Category3": row.get("Category3"),
                "Category4": row.get("Category4"),
                "Category5": row.get("Category5"),
            })
            response.append(record)

        return response


@router.get("/csat-report/{client_id}", response_model=List[Dict])
def get_csat_report(
    client_id: int,
    from_date: str = Query(...),
    to_date: str = Query(...),
):
    query = text("""
        SELECT vl.*, vcl.user, vu.full_name
        FROM csat_data vl
        INNER JOIN vicidial_closer_log vcl ON vl.uniqueid = vcl.uniqueid
        INNER JOIN vicidial_users vu ON vcl.user = vu.user
        WHERE vl.dtmf < 4
          AND vl.client_id = :client_id
          AND DATE(vl.call_date) BETWEEN :from_date AND :to_date
    """)

    try:
        engine = get_engine()
        with engine.connect() as conn:
            result = conn.execute(query, {
                "client_id": client_id,
                "from_date": from_date,
                "to_date": to_date,
            }).mappings().all()

        return [dict(row) for row in result]

    except SQLAlchemyError as e:
        print("SQLAlchemy Error:", str(e))  # Good for local debugging
        raise HTTPException(status_code=500, detail="Database query failed.")

from datetime import datetime
@router.get("/priority_calls", response_model=List[Dict[str, Any]])
def get_priority_calls(
    client_id: int = Query(...),
    start_time: str = Query(...),
    end_time: str = Query(...),
    db: Session = Depends(get_db)
):
    try:
        # Convert to date objects
        start_date = datetime.strptime(start_time, "%Y-%m-%d").date()
        end_date = datetime.strptime(end_time, "%Y-%m-%d").date()

        # Raw SQL query
        sql = text("""
            SELECT *
            FROM vicidial_list
            WHERE vendor_lead_code = :client_id
              AND DATE(entry_date) BETWEEN :start_date AND :end_date
        """)

        result = db.execute(sql, {
            "client_id": client_id,
            "start_date": start_date,
            "end_date": end_date
        })

        # Convert SQLAlchemy Row to dict using .mappings()
        return [dict(row) for row in result.mappings().all()]

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")



# CLIENT_ID = 301  # replace with real auth-based value

@router.get("/types", response_model=List[TypeItem])
def get_types(
        CLIENT_ID: int = Query(...), db: Session = Depends(get_db)):
    sql = text("""
        SELECT DISTINCT CampaignParentName AS id,
               CampaignParentName AS name
        FROM ob_campaign
        WHERE ClientId = :cid AND CampaignStatus = 'A'
        ORDER BY CampaignParentName
    """)
    rows = db.execute(sql, {"cid": CLIENT_ID}).fetchall()
    return [dict(r) for r in rows]

@router.get("/campaigns", response_model=List[CampaignItem])
def get_campaigns(
        CLIENT_ID: int = Query(...), type: str = Query(...), db: Session = Depends(get_db)):
    sql = text("""
        SELECT id, CampaignName
        FROM ob_campaign
        WHERE ClientId = :cid
          AND CampaignParentName = :type
          AND CampaignStatus = 'A'
    """)
    rows = db.execute(sql, {"cid": CLIENT_ID, "type": type}).fetchall()
    return [dict(r) for r in rows]

@router.get("/allocations", response_model=List[AllocationItem])
def get_allocations(
        CLIENT_ID: int = Query(...), campaign: int = Query(...), db: Session = Depends(get_db)):
    sql = text("""
        SELECT id, AllocationName
        FROM ob_allocation_name
        WHERE ClientId = :cid
          AND CampaignId = :camp
    """)
    rows = db.execute(sql, {"cid": CLIENT_ID, "camp": campaign}).fetchall()
    return [dict(r) for r in rows]

@router.get("/outcalls", response_model=List[OutcallItem])
def get_outcalls(
    CLIENT_ID: int = Query(...),
    campaignType: Optional[str] = None,
    campaign: Optional[int] = None,
    allocation: Optional[int] = None,
    scenario: Optional[str] = None,
    subScenario1: Optional[str] = None,
    subScenario2: Optional[str] = None,
    subScenario3: Optional[str] = None,
    msisdn: Optional[str] = None,
    startDate: Optional[str] = None,
    endDate: Optional[str] = None,
    db: Session = Depends(get_db)
):
    base_sql = [
        "SELECT o.id, o.Category1 AS scenario, o.Category2 AS subScenario1,",
        "       o.MSISDN AS contactNumber, c.CampaignParentName AS campaignType, c.CampaignName AS campaignName",
        "FROM call_master_out o",
        "JOIN ob_campaign c ON o.AllocationId = c.id",
        "WHERE o.ClientId = :cid"
    ]
    params = {"cid": CLIENT_ID}
    if campaignType:
        base_sql.append("AND c.CampaignParentName = :ctype")
        params["ctype"] = campaignType
    if campaign:
        base_sql.append("AND o.campaign_id = :camp")
        params["camp"] = campaign
    if allocation:
        base_sql.append("AND o.AllocationId = :alloc")
        params["alloc"] = allocation
    if scenario:
        base_sql.append("AND o.Category1 = :scn")
        params["scn"] = scenario
    if subScenario1:
        base_sql.append("AND o.Category2 = :sub1")
        params["sub1"] = subScenario1
    if subScenario2:
        base_sql.append("AND o.Category3 = :sub2")
        params["sub2"] = subScenario2

    if subScenario3:
        base_sql.append("AND o.Category4 = :sub3")
        params["sub3"] = subScenario3
    if msisdn:
        base_sql.append("AND o.MSISDN LIKE :msisdn")
        params["msisdn"] = f"%{msisdn}%"
    if startDate:
        base_sql.append("AND DATE(o.CallDate) >= :sd")
        params["sd"] = startDate
    if endDate:
        base_sql.append("AND DATE(o.CallDate) <= :ed")
        params["ed"] = endDate
    base_sql.append("ORDER BY o.CallDate DESC LIMIT 100")

    sql = text("\n".join(base_sql))
    rows = db.execute(sql, params).fetchall()
    return [dict(r) for r in rows]


@router.get("/download_excel_raw")
def download_excel_raw(
        client_id: int,
        from_date: date = Query(...),
        to_date: date = Query(...),
        db=Depends(get_db),
        db2=Depends(get_db),
        db3=Depends(get_db),
):
    # Step 1: Client Info
    client_result = db.execute(text("""
        SELECT company_name, reg_office_address1, phone_no, email, auth_person
        FROM registration_master
        WHERE company_id = :client_id
    """), {"client_id": client_id}).fetchone()

    balance_result = db.execute(text("""
        SELECT * FROM balance_master
        WHERE client_id = :client_id
        LIMIT 1
    """), {"client_id": client_id}).fetchone()

    plan_result = None
    if balance_result and balance_result.PlanId:
        plan_result = db.execute(text("""
            SELECT * FROM plan_master
            WHERE Id = :plan_id
            LIMIT 1
        """), {"plan_id": balance_result.PlanId}).fetchone()

    used_amount = sum([
        balance_result[key] if key in balance_result and balance_result[key] else 0
        for key in [
            "TinAmount", "TinAmountNight", "TouAmount", "TMinAmount",
            "TMouAmount", "TvfAmount", "TsmAmount", "TemAmount",
            "TivAmount", "TWhatsAppAmount", "TBoatAmount"
        ]
    ]) if balance_result else 0

    # Step 2: Call log data from vicidial DB
    call_data = db2.execute(text(f"""
        SELECT 
            IF(t3.talk_sec IS NULL, t2.length_in_sec, t3.talk_sec) AS length_in_sec,
            t2.phone_number,
            t2.call_date,
            t2.user
        FROM vicidial_closer_log t2
        LEFT JOIN vicidial_agent_log t3 ON t2.uniqueid = t3.uniqueid AND t2.user = t3.user
        WHERE t2.user != 'VDCL'
          AND DATE(t2.call_date) BETWEEN :from_date AND :to_date
    """), {"from_date": from_date, "to_date": to_date}).fetchall()

    multilang_call_data = db2.execute(text(f"""
        SELECT 
            IF(t3.talk_sec IS NULL, t2.length_in_sec, t3.talk_sec) AS length_in_sec,
            t2.phone_number,
            t2.call_date,
            t2.user
        FROM vicidial_closer_log t2
        LEFT JOIN vicidial_agent_log t3 ON t2.uniqueid = t3.uniqueid AND t2.user = t3.user
        WHERE t2.user != 'VDCL'
          AND t2.campaign_id IN ('ML01', 'ML02', 'ML03')  -- replace with your actual multi-language campaign_ids
          AND DATE(t2.call_date) BETWEEN :from_date AND :to_date
    """), {"from_date": from_date, "to_date": to_date}).fetchall()

    # --- OUTBOUND (Vicidial Log) Section ---
    outbound_data = db2.execute(text(f"""
            SELECT 
                (va.talk_sec - va.dead_sec) AS length_in_sec,
                v.phone_number,
                v.call_date,
                v.user
            FROM vicidial_log v
            JOIN vicidial_agent_log va ON v.uniqueid = va.uniqueid
            WHERE (va.talk_sec - va.dead_sec) != 0
              AND v.user != 'VDAD'
              AND DATE(v.call_date) BETWEEN :from_date AND :to_date
        """), {"client_id": client_id, "from_date": from_date, "to_date": to_date}).fetchall()

    query = text("""
                SELECT 
                    t2.list_id,
                    t2.call_date AS CallDate,
                    FROM_UNIXTIME(t2.start_epoch) AS StartTime,
                    FROM_UNIXTIME(t2.end_epoch) AS Endtime,
                    LEFT(t2.phone_number,10) AS PhoneNumber,
                    t2.user AS Agent,
                    vu.full_name as full_name,
                    IF(t2.user='VDAD','Not Connected','Connected') calltype,
                    t2.status as status,
                    IF(t2.list_id='998','Mannual','Auto') dialmode,
                    t2.campaign_id as campaign_id,
                    t2.lead_id as lead_id,
                    t2.length_in_sec AS LengthInSec,
                    SEC_TO_TIME(t2.length_in_sec) AS LengthInMin,
                    t2.length_in_sec AS CallDuration,
                    t2.status AS CallStatus,
                    t3.pause_sec AS PauseSec,
                    t3.wait_sec AS WaitSec,
                    t3.talk_sec AS TalkSec,
                    t3.dispo_sec AS DispoSec
                FROM vicidial_log t2
                LEFT JOIN vicidial_agent_log t3 ON t2.uniqueid = t3.uniqueid
                LEFT JOIN vicidial_users vu ON t2.user = vu.user
                WHERE DATE(t2.call_date) BETWEEN :from_date AND :to_date
                  AND t2.campaign_id = 'dialdesk'
                  AND t2.lead_id IS NOT NULL
            """)

    ab_data = db2.execute(query, {"from_date": from_date, "to_date": to_date}).fetchall()

    sms_query = text("""
        SELECT 
            DATE_FORMAT(CallDate,'%d %b %y') AS CallDate1,
            CallDate,
            CallTime,
            CallFrom,
            Unit,
            AlertTo
        FROM billing_master
        WHERE clientId = :client_id
          AND DedType = 'SMS'
          AND DATE(CallDate) BETWEEN :from_date AND :to_date
    """)

    sms_data = db.execute(sms_query, {
        "client_id": client_id,
        "from_date": from_date,
        "to_date": to_date
    }).fetchall()

    email_query = text("""
        SELECT 
            DATE_FORMAT(CallDate,'%d %b %y') AS CallDate1,
            CallDate,
            CallTime,
            CallFrom,
            Unit
        FROM billing_master
        WHERE clientId = :client_id
          AND DedType = 'Email'
          AND DATE(CallDate) BETWEEN :from_date AND :to_date
    """)

    email_data = db.execute(email_query, {
        "client_id": client_id,
        "from_date": from_date,
        "to_date": to_date
    }).fetchall()

    rx_query = text("""
        SELECT 
            DATE_FORMAT(call_time,'%d %b %y') AS CallDate1,
            call_time AS CallDate,
            TIME(call_time) AS CallTime,
            1 AS Unit,
            source_number AS CallFrom
        FROM rx_log
        WHERE clientId = :client_id
          AND DATE(call_time) BETWEEN :from_date AND :to_date
    """)

    rx_data = db3.execute(rx_query, {
        "client_id": client_id,
        "from_date": from_date,
        "to_date": to_date
    }).fetchall()

    total_talk_time = 0
    total_pulse = 0
    total_rate = 0.0

    total_talk_time2 = 0
    total_pulse2 = 0
    total_rate2 = 0.0

    total_talk_time3 = 0
    total_pulse3 = 0
    total_rate3 = 0.0

    total_talk_time4 = 0
    total_pulse4 = 0
    total_rate4 = 0.0

    total_pulse5 = 0
    total_rate5 = 0.0

    total_pulse6 = 0
    total_rate6 = 0.0

    total_pulse7 = 0
    total_rate7 = 0.0

    # Step 3: Build HTML for Excel
    html = f"""
    <html><head><meta http-equiv="Content-Type" content="application/vnd.ms-excel; charset=utf-8" /></head><body>
    <table border='0' width='600' cellpadding='2' cellspacing='2'>
        <tr><td colspan='6' align='center'>
            <img src='http://dialdesk.co.in/dialdesk/app/webroot/billing_statement/logo.jpg' height='80'><br>
            <strong style='font-size:16pt;'>A UNIT OF ISPARK DATA CONNECT PVT LTD</strong>
        </td></tr>
    </table>

    <table border='1' width='600' cellpadding='2' cellspacing='2'>
        <tr><td colspan='7' style='font-size:15pt;background-color:#607d8b;color:#fff;'>Client Details</td></tr>
        <tr><th>Company</th><th colspan='3'>Address</th><th>Mobile No</th><th>Email</th><th>Authorised Person</th></tr>
        <tr>
            <td>{client_result.company_name if client_result else ''}</td>
            <td colspan='3'>{client_result.reg_office_address1 if client_result else ''}</td>
            <td>{client_result.phone_no if client_result else ''}</td>
            <td>{client_result.email if client_result else ''}</td>
            <td>{client_result.auth_person if client_result else ''}</td>
        </tr>
    </table>

    <table><tr><td>&nbsp;</td></tr></table>

    <table border='1' width='600' cellpadding='2' cellspacing='2'>
        <tr><td colspan='5' style='font-size:15pt;background-color:#607d8b;color:#fff;'>Plan Details</td></tr>
        <tr><th>Plan Name</th><th>Start Date</th><th>End Date</th><th>Validity</th><th>Used</th></tr>
        <tr>
            <td>{plan_result.PlanName if plan_result else ''}</td>
            <td>{balance_result.start_date if balance_result else ''}</td>
            <td>{balance_result.end_date if balance_result else ''}</td>
            <td>{f"{plan_result.RentalPeriod} {plan_result.PeriodType}" if plan_result else ''}</td>
            <td>{used_amount}</td>
        </tr>
    </table>

    <table><tr><td>&nbsp;</td></tr></table>



    <table border='1' width='600' cellpadding='2' cellspacing='2'>
        <tr><td colspan='7' style='font-size:15pt;background-color:#607d8b;color:#fff;'>{client_result.company_name if client_result else ''} (INBOUND)</td></tr>
        <tr><th>Date</th><th>Time</th><th>Call From</th><th>Agent</th><th>Talk Time</th><th>Pulse</th><th>Rate</th></tr>
    """

    for row in call_data:
        dt = row.call_date
        talk_time = int(row.length_in_sec)
        pulse = (talk_time // 60) + (1 if talk_time % 60 else 0)
        rate = pulse * 0.5  # Replace with actual rate

        total_talk_time += talk_time
        total_pulse += pulse
        total_rate += rate  # Example rate, replace with actual
        html += f"<tr><td>{dt.date()}</td><td>{dt.time()}</td><td>{row.phone_number}</td><td>{row.user}</td><td>{talk_time}</td><td>{pulse}</td><td>{rate:.2f}</td></tr>"

    html += f"""
        <tr style='font-weight:bold; background-color:#e0e0e0;'>
            <td colspan='4' align='right'>Total</td>
            <td>{total_talk_time}</td>
            <td>{total_pulse}</td>
            <td>{total_rate:.2f}</td>
        </tr>
    """

    html += """
        <table><tr><td>&nbsp;</td></tr></table>

        <table border='1' width='600' cellpadding='2' cellspacing='2'>
            <tr><td colspan='7' style='font-size:15pt;background-color:#607d8b;color:#fff;'>""" + \
            f"""{client_result.company_name if client_result else ''} (Multi Language INBOUND)</td></tr>
            <tr><th>Date</th><th>Time</th><th>Call From</th><th>Agent</th><th>Talk Time</th><th>Pulse</th><th>Rate</th></tr>
        """

    for row in multilang_call_data:
        dt = row.call_date
        talk_time = int(row.length_in_sec)
        pulse = (talk_time // 60) + (1 if talk_time % 60 else 0)
        rate = pulse * 0.5  # Adjust if multi-lang rate is different

        total_talk_time2 += talk_time
        total_pulse2 += pulse
        total_rate2 += rate

        html += f"<tr><td>{dt.date()}</td><td>{dt.time()}</td><td>{row.phone_number}</td><td>{row.user}</td><td>{talk_time}</td><td>{pulse}</td><td>{rate:.2f}</td></tr>"

    html += f"""
            <tr style='font-weight:bold; background-color:#e0e0e0;'>
                <td colspan='4' align='right'>Total</td>
                <td>{total_talk_time2}</td>
                <td>{total_pulse2}</td>
                <td>{total_rate2:.2f}</td>
            </tr>
        """

    html += f"""
        <table><tr><td>&nbsp;</td></tr></table>
        <table border="1" width="600" cellpadding="2" cellspacing="2" style="font-size:11pt;">
            <tr><td colspan="7" style="font-size:15pt;background-color:#607d8b;color:#fff;">{client_result.company_name if client_result else ''} (OUTBOUND)</td></tr>
            <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Call From</th>
                <th>Agent</th>
                <th>Talk Time</th>
                <th>Pulse</th>
                <th>Rate</th>
            </tr>
        """

    for row in outbound_data:
        dt = row.call_date
        talk_time = int(row.length_in_sec)
        pulse = (talk_time // 60) + (1 if talk_time % 60 else 0)
        rate = pulse * 0.5  # You can replace with actual per-minute rate

        total_talk_time3 += talk_time
        total_pulse3 += pulse
        total_rate3 += rate

        html += f"<tr><td>{dt.date()}</td><td>{dt.time()}</td><td>{row.phone_number}</td><td>{row.user}</td><td>{talk_time}</td><td>{pulse}</td><td>{rate:.2f}</td></tr>"

    html += f"""
            <tr style='font-weight:bold; background-color:#e0e0e0;'>
                <td colspan='4' align='right'>Total</td>
                <td>{total_talk_time3}</td>
                <td>{total_pulse3}</td>
                <td>{total_rate3:.2f}</td>
            </tr>
        """

    html += f"""
        <table><tr><td>&nbsp;</td></tr></table>
        <table border="1" width="600" cellpadding="2" cellspacing="2" style="font-size:11pt;">
            <tr><td colspan="7" style="font-size:15pt;background-color:#607d8b;color:#fff;">{client_result.company_name if client_result else ''} (OUTBOUND ABANDCALL)</td></tr>
            <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Call From</th>
                <th>Agent</th>
                <th>Talk Time</th>
                <th>Pulse</th>
                <th>Rate</th>
            </tr>
    """

    for row in ab_data:
        call_date = row.CallDate
        talk_time = int(row.TalkSec) if row.TalkSec else 0
        pulse = (talk_time // 60) + (1 if talk_time % 60 else 0)
        rate = pulse * 0.5  # You can replace this with actual billing logic

        total_talk_time4 += talk_time
        total_pulse4 += pulse
        total_rate4 += rate

        html += f"""
            <tr>
                <td>{call_date.date()}</td>
                <td>{call_date.time()}</td>
                <td>{row.PhoneNumber}</td>
                <td>{row.Agent}</td>
                <td>{talk_time}</td>
                <td>{pulse}</td>
                <td>{rate:.2f}</td>
            </tr>
        """

    html += f"""
            <tr style='font-weight:bold; background-color:#e0e0e0;'>
                <td colspan='4' align='right'>Total</td>
                <td>{total_talk_time4}</td>
                <td>{total_pulse4}</td>
                <td>{total_rate4:.2f}</td>
            </tr>
        """

    html += f"""
        <table><tr><td>&nbsp;</td></tr></table>
        <table border="1" width="600" cellpadding="2" cellspacing="2" style="font-size:11pt;">
            <tr><td colspan="7" style="font-size:15pt;background-color:#607d8b;color:#fff;">{client_result.company_name if client_result else ''} (SMS)</td></tr>
            <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Call From</th>
                <th>Alert To</th>
                <th>Pulse</th>
                <th>Rate</th>
            </tr>
    """

    for row in sms_data:
        pulse = int(row.Unit) if row.Unit else 0
        rate = pulse * 0.2  # Set your actual rate here

        total_pulse5 += pulse
        total_rate5 += rate

        html += f"""
            <tr>
                <td>{row.CallDate1}</td>
                <td>{row.CallTime}</td>
                <td>{row.CallFrom}</td>
                <td>{row.AlertTo}</td>
                <td>{pulse}</td>
                <td>{rate:.2f}</td>
            </tr>
        """

    html += f"""
            <tr style='font-weight:bold; background-color:#e0e0e0;'>
                <td colspan='4' align='right'>Total</td>
                <td>{total_pulse5}</td>
                <td>{total_rate5:.2f}</td>
            </tr>
        """

    html += f"""
        <table><tr><td>&nbsp;</td></tr></table>
        <table border="1" width="600" cellpadding="2" cellspacing="2" style="font-size:11pt;">
            <tr><td colspan="6" style="font-size:15pt;background-color:#607d8b;color:#fff;">{client_result.company_name if client_result else ''} (EMAIL)</td></tr>
            <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Call From</th>
                <th>Pulse</th>
                <th>Rate</th>
            </tr>
    """

    for row in email_data:
        pulse = int(row.Unit) if row.Unit else 0
        rate = pulse * 0.25  # Replace with actual per-email rate

        total_pulse6 += pulse
        total_rate6 += rate

        html += f"""
            <tr>
                <td>{row.CallDate1}</td>
                <td>{row.CallTime}</td>
                <td>{row.CallFrom}</td>
                <td>{pulse}</td>
                <td>{rate:.2f}</td>
            </tr>
        """

    html += f"""
            <tr style='font-weight:bold; background-color:#e0e0e0;'>
                <td colspan='4' align='right'>Total</td>
                <td>{total_pulse6}</td>
                <td>{total_rate6:.2f}</td>
            </tr>
        """

    html += f"""
        <table><tr><td>&nbsp;</td></tr></table>
        <table border="1" width="600" cellpadding="2" cellspacing="2" style="font-size:11pt;">
            <tr><td colspan="6" style="font-size:15pt;background-color:#607d8b;color:#fff;">{client_result.company_name if client_result else ''} (RX LOG)</td></tr>
            <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Call From</th>
                <th>Pulse</th>
                <th>Rate</th>
            </tr>
    """

    for row in rx_data:
        pulse = 1
        rate = pulse * 0.20  # Adjust this rate as per your business logic

        total_pulse7 += pulse
        total_rate7 += rate

        html += f"""
            <tr>
                <td>{row.CallDate1}</td>
                <td>{row.CallTime}</td>
                <td>{row.CallFrom}</td>
                <td>{pulse}</td>
                <td>{rate:.2f}</td>
            </tr>
        """

    html += f"""
            <tr style='font-weight:bold; background-color:#e0e0e0;'>
                <td colspan='4' align='right'>Total</td>
                <td>{total_pulse7}</td>
                <td>{total_rate7:.2f}</td>
            </tr>
        """

    # === 1️⃣ Get dynamic rates with fallback ===
    rate_icb = plan_result.InboundRate if plan_result and hasattr(plan_result, "InboundRate") else 0.5
    rate_multilang = plan_result.MultiLangInboundRate if plan_result and hasattr(plan_result,
                                                                                 "MultiLangInboundRate") else 0.5
    rate_ocb = plan_result.OutboundRate if plan_result and hasattr(plan_result, "OutboundRate") else 0.5
    rate_abcb = plan_result.AbandCallRate if plan_result and hasattr(plan_result, "AbandCallRate") else 0.5
    rate_sms = plan_result.SMSRate if plan_result and hasattr(plan_result, "SMSRate") else 0.2
    rate_email = plan_result.EmailRate if plan_result and hasattr(plan_result, "EmailRate") else 0.25
    rate_rx = plan_result.RXRate if plan_result and hasattr(plan_result, "RXRate") else 0.2

    # === 2️⃣ Recalculate final amounts ===
    amount_icb = total_pulse * rate_icb
    amount_multilang = total_pulse2 * rate_multilang
    amount_ocb = total_pulse3 * rate_ocb
    amount_abcb = total_pulse4 * rate_abcb
    amount_sms = total_pulse5 * rate_sms
    amount_email = total_pulse6 * rate_email
    amount_rx = total_pulse7 * rate_rx

    grand_total = amount_icb + amount_multilang + amount_ocb + amount_abcb + amount_sms + amount_email + amount_rx

    # === 3️⃣ Append Summary Table ===
    html += f"""
    <table><tr><td>&nbsp;</td></tr></table>
    <table border='1' width='600' cellpadding='2' cellspacing='2' style='font-size:11pt;'>
        <tr>
            <td colspan='4' style='font-size:15pt;background-color:#607d8b;color:#fff;'>Summary</td>
        </tr>
        <tr>
            <th>Description</th>
            <th>Pulse/Unit</th>
            <th>Rate</th>
            <th>Amount</th>
        </tr>
        <tr><td>ICB</td><td>{total_pulse}</td><td>{rate_icb:.2f}</td><td>{amount_icb:.2f}</td></tr>
        <tr><td>ICB Multi Language</td><td>{total_pulse2}</td><td>{rate_multilang:.2f}</td><td>{amount_multilang:.2f}</td></tr>
        <tr><td>OCB</td><td>{total_pulse3}</td><td>{rate_ocb:.2f}</td><td>{amount_ocb:.2f}</td></tr>
        <tr><td>ABCB</td><td>{total_pulse4}</td><td>{rate_abcb:.2f}</td><td>{amount_abcb:.2f}</td></tr>
        <tr><td>SMS</td><td>{total_pulse5}</td><td>{rate_sms:.2f}</td><td>{amount_sms:.2f}</td></tr>
        <tr><td>Email</td><td>{total_pulse6}</td><td>{rate_email:.2f}</td><td>{amount_email:.2f}</td></tr>
        <tr><td>RX/IVR</td><td>{total_pulse7}</td><td>{rate_rx:.2f}</td><td>{amount_rx:.2f}</td></tr>
        <tr style='font-weight:bold; background-color:#e0e0e0;'>
            <td colspan='3' align='right'>Grand Total</td>
            <td>{grand_total:.2f}</td>
        </tr>
    </table>
    """


    html += "</table></body></html>"

    # Step 4: Return as Excel
    buffer = BytesIO(html.encode('utf-8'))
    filename = f"statement_{datetime.now().strftime('%d_%m_%y_%H_%M_%S')}.xls"
    headers = {
        "Content-Disposition": f"attachment; filename={filename}",
        "Pragma": "no-cache",
        "Expires": "0"
    }

    return StreamingResponse(buffer, media_type="application/vnd.ms-excel", headers=headers)



@router.get("/fields/{client_id}")
def get_fields_for_client(client_id: int, db: Session = Depends(get_db)):

    sql_fields = text("""
        SELECT id, FieldName, FieldType, FieldValidation,
               RequiredCheck, Priority, fieldNumber
        FROM field_master
        WHERE ClientId = :client_id
          AND (FieldStatus = 1 OR FieldStatus IS NULL)
        ORDER BY Priority ASC
    """)
    fields_result = db.execute(sql_fields, {"client_id": client_id})
    fields = [dict(row) for row in fields_result.mappings().all()]

    if not fields:
        raise HTTPException(status_code=404, detail="No fields found for this client_id")

    # 2. Collect dropdown field IDs
    dropdown_field_ids = [
        field['id']
        for field in fields
        if field.get('FieldType') and field['FieldType'].lower() == 'dropdown'
    ]

    dropdown_values_map: Dict[int, List[str]] = {}
    if dropdown_field_ids:
        sql_dropdown_values = text("""
            SELECT FieldId, FieldValueName
            FROM field_master_value
            WHERE ClientId = :client_id
              AND FieldId IN :field_ids
            ORDER BY id ASC
        """).bindparams(field_ids=tuple(dropdown_field_ids))

        dropdown_values_result = db.execute(
            sql_dropdown_values, {"client_id": client_id}
        )

        for row in dropdown_values_result.mappings().all():
            field_id = row['FieldId']
            value_name = row['FieldValueName']
            dropdown_values_map.setdefault(field_id, []).append(value_name)

    # 3. Attach dropdown options
    for field in fields:
        if field.get('FieldType') and field['FieldType'].lower() == 'dropdown':
            field['options'] = dropdown_values_map.get(field['id'], [])

    return fields









# @router.post("/call_tag/{client_id}")
# async def save_call_master(client_id: int, payload: dict = Body(...), db: Session = Depends(get_db)):
#     # 1️⃣ Fetch FieldNames ordered by fieldNumber for this client
#     field_query = text("""
#             SELECT FieldName, fieldNumber
#             FROM field_master
#             WHERE ClientId = :client_id AND FieldStatus = 1
#             ORDER BY fieldNumber
#         """)
#     result = db.execute(field_query, {"client_id": client_id})
#     fields = result.mappings().all()
#
#     # 2️⃣ Map payload values to Field1, Field2, Field3, ...
#     field_column_mapping = {}
#     for row in fields:
#         field_name = row["FieldName"]
#         field_number = row["fieldNumber"]
#         value = payload.get(field_name, None)
#         field_column_mapping[f"Field{field_number}"] = value
#
#     # 3️⃣ Prepare insert statement
#     columns = ', '.join(["`ClientId`"] + [f"`{col}`" for col in field_column_mapping.keys()])
#     placeholders = ', '.join([":ClientId"] + [f":{col}" for col in field_column_mapping.keys()])
#
#     param_payload = {"ClientId": client_id}
#     param_payload.update(field_column_mapping)
#
#     sql = text(f"""
#             INSERT INTO call_master ({columns})
#             VALUES ({placeholders})
#         """)
#
#     db.execute(sql, param_payload)
#     db.commit()
#
#     return {"message": "Data saved successfully."}

# @router.post("/call_tag/{client_id}")
# async def save_call_master(client_id: int, payload: dict = Body(...), db: Session = Depends(get_db)):
#     # 1️⃣ Fetch FieldNames ordered by fieldNumber for this client
#     field_query = text("""
#         SELECT FieldName, fieldNumber
#         FROM field_master
#         WHERE ClientId = :client_id AND (FieldStatus = 1 OR FieldStatus IS NULL)
#         ORDER BY fieldNumber
#     """)
#     result = db.execute(field_query, {"client_id": client_id})
#     fields = result.mappings().all()
#
#     if not fields:
#         raise HTTPException(status_code=404, detail="No fields configured for this client")
#
#     # 2️⃣ Map payload values to Field1, Field2, Field3, ...
#     field_column_mapping = {}
#     for row in fields:
#         field_name = row["FieldName"].strip()  # handle trailing spaces like "Name "
#         field_number = row["fieldNumber"]
#         value = payload.get(field_name) or payload.get(field_name.strip())
#         field_column_mapping[f"Field{field_number}"] = value
#
#     # 3️⃣ Prepare insert statement
#     columns = ', '.join(["`ClientId`"] + [f"`{col}`" for col in field_column_mapping.keys()])
#     placeholders = ', '.join([":ClientId"] + [f":{col}" for col in field_column_mapping.keys()])
#
#     param_payload = {"ClientId": client_id}
#     param_payload.update(field_column_mapping)
#
#     sql = text(f"""
#         INSERT INTO call_master ({columns})
#         VALUES ({placeholders})
#     """)
#     db.execute(sql, param_payload)
#     db.commit()
#
#     return {"message": "Data saved successfully."}



@router.post("/call_master/initial-input/{client_id}")
def insert_call_master(
    client_id: int,
    payload: dict = Body(...),
    db: Session = Depends(get_db)
):
    # 1️⃣ Validate required fields
    required_fields = ["MSISDN", "LeadId", "AgentId"]
    for field in required_fields:
        if not payload.get(field):
            raise HTTPException(status_code=400, detail=f"{field} is required")

    # 2️⃣ Get next SrNo and SrNo2
    srno_query = text("""
        SELECT 
            COALESCE(MAX(SrNo), 0) AS last_srno,
            COALESCE(MAX(SrNo2), 0) AS last_srno2
        FROM call_master
        WHERE ClientId = :client_id
    """)

    result = db.execute(srno_query, {"client_id": client_id}).fetchone()

    next_srno = result.last_srno + 1
    next_srno2 = result.last_srno2 + 1

    # 3️⃣ Auto-generate CallDate (current timestamp)
    call_date = datetime.now()

    # 4️⃣ Insert data
    insert_query = text("""
        INSERT INTO call_master 
        (ClientId, MSISDN, LeadId, AgentId, SrNo, SrNo2, CallDate, CallType)
        VALUES 
        (:ClientId, :MSISDN, :LeadId, :AgentId, :SrNo, :SrNo2, :CallDate, :CallType)
    """)

    db.execute(insert_query, {
        "ClientId": client_id,
        "MSISDN": payload["MSISDN"],
        "LeadId": payload["LeadId"],
        "AgentId": payload["AgentId"],
        "SrNo": next_srno,
        "SrNo2": next_srno2,
        "CallDate": call_date,
        "CallType": "Inbound"
    })

    db.commit()

    return {
        "message": "Inserted successfully",
        "SrNo": next_srno,
        "SrNo2": next_srno2
    }



@router.get("/latest-call-id")
def get_latest_call_id(
    client_id: int = Query(...),
    agent_id: int = Query(...),
    db: Session = Depends(get_db)
):
    query = text("""
        SELECT id
        FROM call_master
        WHERE ClientId = :client_id
          AND AgentId = :agent_id
          AND Category1 IS NULL
        ORDER BY id DESC
        LIMIT 1
    """)

    result = db.execute(query, {
        "client_id": client_id,
        "agent_id": agent_id
    }).fetchone()

    if not result:
        raise HTTPException(
            status_code=404,
            detail="No matching record found"
        )

    return {
        "latest_id": result.id
    }



# @router.post("/call_tag/{client_id}")
# async def save_call_master(client_id: int, payload: dict = Body(...), db: Session = Depends(get_db)):
#     # 1️⃣ Fetch configured fields
#     srno_query = text("""
#             SELECT COALESCE(MAX(SrNo), 0) AS last_srno,
#                    COALESCE(MAX(SrNo2), 0) AS last_srno2
#             FROM call_master
#             WHERE ClientId = :client_id
#         """)
#     sr_result = db.execute(srno_query, {"client_id": client_id}).fetchone()
#     next_srno = sr_result.last_srno + 1
#     next_srno2 = sr_result.last_srno2 + 1


#     field_query = text("""
#         SELECT FieldName, fieldNumber
#         FROM field_master
#         WHERE ClientId = :client_id AND (FieldStatus = 1 OR FieldStatus IS NULL)
#         ORDER BY fieldNumber
#     """)
#     result = db.execute(field_query, {"client_id": client_id})
#     fields = result.mappings().all()

#     if not fields:
#         raise HTTPException(status_code=404, detail="No fields configured for this client")

#     # 2️⃣ Map dynamic fields
#     field_column_mapping = {}
#     for row in fields:
#         field_name = row["FieldName"].strip()
#         field_number = row["fieldNumber"]
#         value = payload.get(field_name) or payload.get(field_name.strip())
#         field_column_mapping[f"Field{field_number}"] = value

#     # 3️⃣ Add scenario (category) mappings
#     category_mapping = {
#         "Category1": payload.get("Scenario"),
#         "Category2": payload.get("Scenario1"),
#         "Category3": payload.get("Scenario2"),
#         "Category4": payload.get("Scenario3"),
#         "Category5": payload.get("Scenario4"),
#     }

#     extra_fields = {
#         "LeadId": payload.get("LeadId"),
#         "AgentId": payload.get("AgentId"),
#         "CallType": payload.get("CallType", "Inbound"),
#         "CallDate": payload.get("CallDate"),  # Should be yyyy-mm-dd
#         "SrNo": next_srno,
#         "SrNo2": next_srno2,
#         "MSISDN": payload.get("MSISDN"),
#         "callcreated": payload.get("callcreated"),

#     }

#     # 4️⃣ Combine all fields
#     all_columns = ["ClientId"] + list(extra_fields.keys()) + list(category_mapping.keys()) + list(field_column_mapping.keys())
#     columns = ', '.join([f"`{col}`" for col in all_columns])
#     placeholders = ', '.join([f":{col}" for col in all_columns])

#     param_payload = {"ClientId": client_id}
#     param_payload.update(extra_fields)
#     param_payload.update(category_mapping)
#     param_payload.update(field_column_mapping)

#     sql = text(f"""
#         INSERT INTO call_master ({columns})
#         VALUES ({placeholders})
#     """)

#     db.execute(sql, param_payload)
#     db.commit()

#     return {"message": "Data saved successfully."}



@router.post("/call_tag/{client_id}")
async def save_call_master(
    client_id: int,
    payload: dict = Body(...),
    db: Session = Depends(get_db)
):
    record_id = payload.get("Id")

    if not record_id:
        raise HTTPException(status_code=400, detail="Id is required")

    # 1️⃣ Check if row exists
    check_query = text("""
        SELECT Id FROM call_master
        WHERE Id = :id AND ClientId = :client_id
        LIMIT 1
    """)
    existing = db.execute(check_query, {
        "id": record_id,
        "client_id": client_id
    }).fetchone()

    if not existing:
        raise HTTPException(status_code=404, detail="Record not found")

    # 2️⃣ Fetch dynamic fields
    field_query = text("""
        SELECT FieldName, fieldNumber
        FROM field_master
        WHERE ClientId = :client_id AND (FieldStatus = 1 OR FieldStatus IS NULL)
        ORDER BY fieldNumber
    """)
    fields = db.execute(field_query, {"client_id": client_id}).mappings().all()

    # 3️⃣ Map dynamic fields
    field_column_mapping = {}
    for row in fields:
        field_name = row["FieldName"].strip()
        field_number = row["fieldNumber"]
        if field_name in payload:
            field_column_mapping[f"Field{field_number}"] = payload.get(field_name)

    # 4️⃣ Category mapping
    category_mapping = {
        "Category1": payload.get("Scenario"),
        "Category2": payload.get("Scenario1"),
        "Category3": payload.get("Scenario2"),
        "Category4": payload.get("Scenario3"),
        "Category5": payload.get("Scenario4"),
    }

    # 5️⃣ Extra fields (only update if present)
    extra_fields = {}

    if "AgentId" in payload:
        extra_fields["AgentId"] = payload.get("AgentId")

    if "CallType" in payload:
        extra_fields["CallType"] = payload.get("CallType")

    if "MSISDN" in payload:
        extra_fields["MSISDN"] = payload.get("MSISDN")

    if "callcreated" in payload:
        extra_fields["callcreated"] = payload.get("callcreated")

    # 6️⃣ Merge all update fields
    update_fields = {}
    update_fields.update(extra_fields)
    update_fields.update(category_mapping)
    update_fields.update(field_column_mapping)

    # ❗ Remove None values (important for partial update)
    update_fields = {k: v for k, v in update_fields.items() if v is not None}

    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update")

    # 7️⃣ Build dynamic SET clause
    set_clause = ", ".join([f"`{k}` = :{k}" for k in update_fields.keys()])

    update_query = text(f"""
        UPDATE call_master
        SET {set_clause}
        WHERE id = :id AND ClientId = :client_id
    """)

    update_fields["id"] = record_id
    update_fields["client_id"] = client_id

    db.execute(update_query, update_fields)
    db.commit()

    return {"message": "Data updated successfully"}




@router.get("/get_client_id/{vendor_id}")
def get_client_id(vendor_id: str, db: Session = Depends(get_db)):
    """
    API to fetch client_id using vendor_id (did_number)
    """
    print(f"Looking up vendor_id: {vendor_id}", flush=True)

    sql_query = text("""
        SELECT client_id
        FROM did_master
        WHERE TRIM(CAST(did_number AS CHAR)) = TRIM(:vendor_id)
        LIMIT 1
    """)

    result = db.execute(sql_query, {"vendor_id": vendor_id}).fetchone()

    if not result:
        raise HTTPException(status_code=404, detail="Client ID not found for this vendor_id")

    client_id = result[0]  # fetchone() returns tuple

    return {"client_id": client_id}


@router.post("/alert_mechanisms/{client_id}/{phone}")
async def create_alert_schedule_from_mechanisms(client_id: int, phone: str, db: Session = Depends(get_db)):

    mechanisms = db.query(AlertMechanisms).filter(AlertMechanisms.client_id == client_id).all()

    if not mechanisms:
        raise HTTPException(status_code=404, detail="No alert mechanisms found for this client")

    for mech in mechanisms:

        # 🔍 Check duplicate
        existing = db.query(AlertScheduler).filter(
            AlertScheduler.client_id == mech.client_id,
            AlertScheduler.alert_category == mech.alert_category,
            AlertScheduler.template_name == mech.template_name,
            AlertScheduler.template_text == mech.template_text,
            AlertScheduler.scenario1 == mech.scenario1,
            AlertScheduler.scenario2 == mech.scenario2,
            AlertScheduler.scenario3 == mech.scenario3,
            AlertScheduler.scenario4 == mech.scenario4,
            AlertScheduler.scenario5 == mech.scenario5,
        ).first()

        if existing:
            continue  # 🔥 Skip inserting duplicate entry

        phone_to_use = phone if mech.alert_category == "caller" else mech.phone

        new_schedule = AlertScheduler(
            client_id=mech.client_id,
            alert_category=mech.alert_category,
            alert_on=mech.alert_on,
            template_name=mech.template_name,
            template_text=mech.template_text,
            scenario1=mech.scenario1,
            scenario2=mech.scenario2,
            scenario3=mech.scenario3,
            scenario4=mech.scenario4,
            scenario5=mech.scenario5,
            person_name=mech.person_name,
            phone=phone_to_use,
            email=mech.email,
            tat=mech.tat,
            sms_status=False,
            email_status=False,
            whatsapp_status=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            created_by=mech.created_by,
            updated_by=mech.updated_by
        )

        db.add(new_schedule)

    db.commit()

    return {"status": "success", "message": "Alert schedules created successfully"}


WHATSAPP_API_URL = "http://192.168.10.33:3001/api/send-text"


# def send_email(to_email: str, subject: str, body: str):
#     sender_email = "sachinkr78276438@gmail.com"
#     sender_password = "efsn ryss yjin kwgr"   # Gmail App Password only
#
#     smtp_server = "smtp.gmail.com"
#     smtp_port = 587
#
#     try:
#         msg = MIMEMultipart()
#         msg["From"] = sender_email
#         msg["To"] = to_email
#         msg["Subject"] = subject
#
#         msg.attach(MIMEText(body, "html"))  # or "plain"
#
#         server = smtplib.SMTP(smtp_server, smtp_port)
#         server.starttls()  # Secure connection
#         server.login(sender_email, sender_password)
#         server.sendmail(sender_email, to_email, msg.as_string())
#         server.quit()
#
#         return {"status": "success", "message": "Email sent successfully"}
#
#     except Exception as e:
#         return {"status": "failed", "error": str(e)}


import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

SMTP_CONFIG = {
    "host": "email.teammas.co.in",
    "port": 25,
    "username": "ispark@teammas.co.in",
    "password": "sa3d3fd%YdT@4b",
    "use_tls": False
}


def send_email(to_email: str, subject: str, body: str, smtp_config: dict):
    try:
        msg = MIMEMultipart()
        msg["From"] = smtp_config["username"]
        msg["To"] = to_email
        msg["Subject"] = subject

        msg.attach(MIMEText(body, "html"))

        server = smtplib.SMTP(smtp_config["host"], smtp_config["port"])

        if smtp_config.get("use_tls"):
            server.starttls()

        server.login(
            smtp_config["username"],
            smtp_config["password"]
        )

        server.sendmail(
            smtp_config["username"],
            to_email,
            msg.as_string()
        )

        server.quit()

        return {
            "status": "success",
            "message": "Email sent successfully"
        }

    except Exception as e:
        return {
            "status": "failed",
            "error": str(e)
        }

import requests
import json


def send_sms(phone: str, message: str, template_id: str):
    try:
        # ---- Normalize mobile number (same as PHP) ----
        phone = str(phone)
        phone = phone[-10:]  # last 10 digits

        if len(phone) < 11:
            phone = "91" + phone

        payload = {
            "username": "mascallnet.trans",
            "password": "COjap",
            "unicode": "False",
            "from": "Ispark",
            "to": phone,
            "dltContentId": template_id,
            "text": message
        }



        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }

        response = requests.post(
            "https://api.smartping.ai/fe/api/v1/send",
            data=payload,
            headers=headers,
            timeout=10
        )

        # API usually returns text / JSON
        response_text = response.text

        # ---- Decide success ----
        if response.status_code == 200:
            return {
                "status": "success",
                "response": response_text
            }
        else:
            return {
                "status": "failed",
                "http_status": response.status_code,
                "response": response_text
            }

    except Exception as e:
        return {
            "status": "failed",
            "error": str(e)
        }





@router.get("/alert_scheduler/run/{client_id}")
async def trigger_alerts(client_id: int, db: Session = Depends(get_db)):
    """
    Trigger alerts for given client:
    - Simulated SMS and Email
    - Real WhatsApp message via local API
    """

    alerts = db.query(AlertScheduler).filter(AlertScheduler.client_id == client_id).all()

    mechanisms = db.query(AlertMechanisms).filter(AlertMechanisms.client_id == client_id).first()
    print(mechanisms,"mechanisms===")
    if not alerts:
        raise HTTPException(status_code=404, detail="No alerts found for this client")

    sms_list, email_list, whatsapp_list = [], [], []

    for alert in alerts:
        updated = False
        alert_responses = {}

        # ✅ Simulate SMS
        if alert.alert_on in ["SMS", "All"] and alert.phone and not alert.sms_status:
            sms_response = send_sms(
                phone=alert.phone,
                message=alert.template_text or "No message content",
                template_id="1707176439618550283"
            )

            status = sms_response.get("status", "")

            # Update status ONLY if success
            #alert.sms_status = True if status.lower() == "success" else False
            if status == "success":
                alert.sms_status = True

                sms_log = SmsLogHistory(
                    alert_id=alert.id,
                    client_id=alert.client_id,
                    phone=alert.phone,
                    message=alert.template_text,
                    template_id="1707176439618550283",
                    provider_status="success",
                    provider_response=json.dumps(sms_response)
                )
                db.add(sms_log)

            else:
                alert.sms_status = False

            # Save response as VARCHAR / TEXT
            alert.sms_response = json.dumps(sms_response)

            updated = True

            sms_list.append({
                "id": alert.id,
                "phone": alert.phone,
                "message": alert.template_text,
                "response": sms_response
            })

            alert_responses["sms"] = sms_response

        if alert.alert_on in ["Email", "All"] and alert.email and not alert.email_status:
            email_response = send_email(
                to_email=alert.email,
                subject=alert.template_name or "Alert Notification",
                body=alert.template_text or "No message content",
                smtp_config = SMTP_CONFIG
            )

            # Prevent KeyError – safely read status
            status = email_response.get("status", "")

            # Save status
            if status.lower() == "success":
                alert.email_status = True
                # Email Log history
                email_log = EmailLogHistory(
                    alert_id=alert.id,
                    client_id=alert.client_id,
                    email=alert.email,
                    subject=alert.template_name,
                    body=alert.template_text,
                    provider_status="success",
                    provider_response=json.dumps(email_response)
                )
                db.add(email_log)

            else:
                alert.email_status = False

            alert.email_response = json.dumps(email_response)
            updated = True

            email_list.append({
                "id": alert.id,
                "email": alert.email,
                "subject": alert.template_name,
                "body": alert.template_text,
                "response": email_response
            })

        # ✅ Real WhatsApp API call
        if alert.alert_on in ["WhatsApp", "All"] and alert.phone:
            print(mechanisms.WHATSAPP_API_KEY,"====WHATSAPP_API_KEY")
            if not alert.whatsapp_status:
                payload = {
                    "sessionId": mechanisms.WHATSAPP_SESSION_ID,
                    "number": alert.phone if str(alert.phone).startswith("91") else f"9178274643803",
                    "message": alert.template_text or "No message content"
                }
                headers = {
                    "accept": "*/*",
                    "x-api-key": mechanisms.WHATSAPP_API_KEY,
                    "Content-Type": "application/json"
                }

                try:
                    print(payload,"payload=====")
                    # Directly create an async client and call WhatsApp API
                    async with httpx.AsyncClient(timeout=10) as client:
                        response = await client.post(WHATSAPP_API_URL, json=payload, headers=headers)
                        # data = response.json()

                        response_text = response.text
                        print("WhatsApp API response text:", response_text)
                        try:
                            data = response.json()
                        except Exception:
                            data = {"error": "Invalid JSON", "raw": response_text}

                    if response.status_code == 200:
                        alert.whatsapp_status = True
                        alert.whatsapp_response = data
                        #log history save
                        whatsapp_log = WhatsAppLogHistory(
                            alert_id=alert.id,
                            client_id=alert.client_id,
                            phone=alert.phone,
                            message=alert.template_text,
                            provider_status="success",
                            provider_response=json.dumps(data)
                        )
                        db.add(whatsapp_log)


                        whatsapp_list.append({
                            "id": alert.id,
                            "phone": alert.phone,
                            "message": alert.template_text,
                            "response": data
                        })
                    else:
                        alert.whatsapp_status = False
                        alert.whatsapp_response = f"Failed: {data}"
                    updated = True

                except Exception as e:
                    alert.whatsapp_status = False
                    alert.whatsapp_response = f"Error: {str(e)}"

                alert_responses["whatsapp"] = alert.whatsapp_response

        # ✅ Save DB changes for updated alerts
        if updated:
            alert.updated_at = datetime.utcnow()
            db.add(alert)

    # ✅ Commit all DB updates once
    db.commit()

    return {
        "status": "success",
        "client_id": client_id,
        "total_sms_sent": len(sms_list),
        "total_email_sent": len(email_list),
        "total_whatsapp_sent": len(whatsapp_list),
        "sms_list": sms_list,
        "email_list": email_list,
        "whatsapp_list": whatsapp_list
    }





############################# Process Update start #########################

@router.get("/process-update")
def get_process_updates(
    client_id: int,
    db: Session = Depends(get_db)
):
    sql = text("""
        SELECT 
            id,
            date_time,
            company_name,
            process_update,
            type,
            read_status
        FROM process_update
        WHERE clientId = :client_id
        ORDER BY date_time DESC
    """)

    results = db.execute(sql, {"client_id": client_id}).fetchall()  # 👈 ALL ROWS

    return {
        "success": True,
        "count": len(results),
        "data": [
            {
                "id": r.id,
                "date": r.date_time,
                "client": r.company_name,
                "remarks": r.process_update,
                "type": r.type,
                "read_status": r.read_status
            }
            for r in results
        ]
    }



@router.post("/process-read")
def insert_process_read(
    payload: ProcessReadRequest,
    db: Session = Depends(get_db)
):
    # 🔹 Get agent details
    agent_query = text("""
        SELECT id, displayname
        FROM agent_master
        WHERE id = :agent_id
    """)

    agent = db.execute(
        agent_query,
        {"agent_id": payload.agent_id}
    ).mappings().fetchone()

    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    # 🔹 Insert into process_read
    insert_query = text("""
        INSERT INTO process_read
        (process_id, read_id, read_name, created_at)
        VALUES (:process_id, :read_id, :read_name, :created_at)
    """)

    db.execute(insert_query, {
        "process_id": payload.process_id,
        "read_id": agent["id"],
        "read_name": agent["displayname"],
        "created_at": datetime.now()
    })

    db.commit()

    return {
        "success": True,
        "message": "Process marked as read"
    }


############################# Process Update end #########################

############################# Call history start #########################

@router.post("/call-history")
def call_history(
    clientId: int,
    agent_id: int,
    db: Session = Depends(get_db)
):
    query = text("""
        SELECT *
        FROM call_master
        WHERE ClientId = :clientId
          AND AgentId = :agent_id
        ORDER BY CallDate DESC
        LIMIT 10
    """)

    rows = db.execute(
        query,
        {"clientId": clientId, "agent_id": agent_id}
    ).mappings().all()

    if not rows:
        raise HTTPException(status_code=404, detail="No call history found")

    # Fetch dynamic field mapping
    field_query = text("""
        SELECT FieldName, fieldNumber
        FROM field_master
        WHERE ClientId = :clientId
          AND (FieldStatus = 1 OR FieldStatus IS NULL)
        ORDER BY fieldNumber
    """)

    fields = db.execute(field_query, {"clientId": clientId}).mappings().all()

    # Create mapping: Field1 → Mobile Number
    field_map = {
        f"Field{row['fieldNumber']}": row["FieldName"].strip()
        for row in fields
    }

    data = []

    for index, row in enumerate(rows, start=1):
        record = {
            "Row No.": index,
            "IN CALL ID": row["SrNo"],
            "CALL FROM": row["MSISDN"],
            "Scenarios": row["Category1"],
            "Sub Scenarios 1": row["Category2"],
            "Sub Scenarios 2": row["Category3"],
            "Sub Scenarios 3": row["Category4"],
            "Sub Scenarios 4": row["Category5"],
        }

        # Add dynamic fields
        for field_key, field_label in field_map.items():
            record[field_label] = row.get(field_key)

            # "Mobile Number": row["Field1"],
            # "First Name": row["Field2"],
            # "Last Name": row["Field3"],
            # "Address": row["Field4"],
            # "State": row["Field5"],
            # "District/Area": row["Field6"],
            # "Pin Code": row["Field7"],
            # "Customer type": row["Field9"],
            # "Date of Purchase": row["Field10"],
            # "Dealer contact number": row["Field11"],
            # "Dealer shop Name": row["Field12"],
            # "Product Model Name": row["Field13"],
            # "Not Serviceable Area PIN Code": row["Field14"],
            # "Remark": row["Field15"],
            # "CRM Issue": row["Category4"],
            # "19 digit Sr. NO.": row["Field16"],
            # "Invoice Date": row["Field17"],
            # "Invoice No.": row["Field18"],
            # "Email ID": row["Field19"],

        # Continue remaining fields
        record.update({
            "Call Action": row["CloseLoopCate1"],
            "Call Sub Action": row["CloseLoopCate2"],
            "Call Action Remarks": row["closelooping_remarks"],
            "Closer Date": row["CloseLoopingDate"],
            "Follow Up Date": row["FollowupDate"],
            "Call Date": row["CallDate"],
            "Tat": row["tat"],
            "Due Date": row["duedate"],
            "Call Created": row["callcreated"],
            "Agent Id": row["AgentId"],
            "Call Status": row["CloseLoopStatus"],
            "Return AWB": row["Ret_AWBNo"],
            "Return Token": row["Ret_TokenNumber"],
            "Pickup Date": row["Ret_PikupDate"],
            "Forword AWB": row["AWBNo"],
            "Forword Token": row["TokenNumber"],
            "Pickup Date (Forword)": row["OtherDate"],
        })       

        data.append(record)

        
    return {
        "status": "success",
        "total_records": len(data),
        "data": data
    }



############################# Call history end #########################


##########################

def get_resolution(db: Session, payload):
    parts = []

    if payload.scenario1:
        parts.append(payload.scenario1)

    if payload.scenario2:
        parts.append(payload.scenario2.split("@@")[-1])

    if payload.scenario3:
        parts.append(payload.scenario3.split("@@")[-1])

    if payload.scenario4:
        parts.append(payload.scenario4.split("@@")[-1])

    if payload.scenario5:
        parts.append(payload.scenario5.split("@@")[-1])

    scenario_key = ",".join(parts)

    lang_filter = ""
    if payload.language == "Hi":
        lang_filter = " AND language='Hi'"

    sql = text(f"""
        SELECT resolution
        FROM call_flow
        WHERE
          CONCAT(
            category,
            IF(type IS NOT NULL AND type!='', CONCAT(',',type), ''),
            IF(subtype IS NOT NULL AND subtype!='', CONCAT(',',subtype), ''),
            IF(subtype1 IS NOT NULL AND subtype1!='', CONCAT(',',subtype1), ''),
            IF(subtype2 IS NOT NULL AND subtype2!='', CONCAT(',',subtype2), '')
          ) = :scenario_key
          AND client_id = :client_id
          {lang_filter}
        LIMIT 1
    """)

    result = db.execute(
        sql,
        {
            "scenario_key": scenario_key,
            "client_id": payload.client_id,
        },
    ).fetchone()

    # fallback
    if not result:
        fallback_sql = text(f"""
            SELECT resolution
            FROM call_flow
            WHERE client_id = :client_id
            {lang_filter}
            LIMIT 1
        """)
        result = db.execute(
            fallback_sql,
            {"client_id": payload.client_id},
        ).fetchone()

    return result[0] if result else ""


@router.post("/get-fetch_resolution")
def fetch_resolution(payload: ResolutionRequest, db: Session = Depends(get_db)):
    resolution = get_resolution(db, payload)
    return {
        "resolution": resolution
    }

############################

class TrainingHubRequest(BaseModel):
    client_id: int


@router.post("/trainning_hub")
def trainning_hub(payload: TrainingHubRequest, db: Session = Depends(get_db)):
    try:
        client_id = payload.client_id

        query = text("""
            SELECT field1 
            FROM training_master 
            WHERE ClientId = :client_id
        """)

        result = db.execute(query, {"client_id": client_id}).fetchall()

        TRAINING_FILE_BASE_URL = os.getenv("TRAINING_FILE_BASE_URL")

        # ✅ Format Response
        data = []
        for row in result:
            file_name = row[0]

            file_url = f"{TRAINING_FILE_BASE_URL}/client_{client_id}/{file_name}"

            data.append({
                "file_name": file_name,
                "file_url": file_url
            })

        return {
            "status": "success",
            "client_id": client_id,
            "count": len(data),
            "data": data
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }




# Runs trigger_alerts() every 1 minute.

def run_alert_scheduler_job():
    db: Session = SessionLocal()
    try:
        client_ids = db.query(AlertScheduler.client_id).distinct().all()
        client_ids = [c[0] for c in client_ids if c[0]]

        import asyncio
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        for client_id in client_ids:
            print(f"🔁 Running alert scheduler for client {client_id}")
            try:
                loop.run_until_complete(trigger_alerts(client_id, db))
            except Exception as e:
                print(f"⚠️ Error processing client {client_id}: {e}")

        loop.close()
    except Exception as e:
        print(f"Scheduler error: {e}")
    finally:
        db.close()

# Scheduler setup
scheduler = BackgroundScheduler()
scheduler.add_job(run_alert_scheduler_job, "interval", minutes=1)
scheduler.start()

@router.on_event("shutdown")
def shutdown_event():
    scheduler.shutdown()