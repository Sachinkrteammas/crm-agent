from typing import List, Dict, Any
from sqlalchemy import bindparam
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from database import get_db, get_db2, get_db3, get_db4
from schemas import *
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from auth_utils import get_current_user
from sqlalchemy import text


router = APIRouter()




# @router.post("/cdr_report", response_model=List[CDRReportResponse])
# def get_cdr_report(request: CDRReportRequest, db: Session = Depends(get_db), db2: Session = Depends(get_db2)):
#     # Step 1: Get campaign ID from registration_master
#     campaign_query = text("SELECT campaignid FROM registration_master WHERE company_id = :company_id")
#     campaign_result = db.execute(campaign_query, {"company_id": request.company_id}).mappings().fetchone()
#
#     if not campaign_result:
#         raise HTTPException(status_code=404, detail="Company ID not found")
#
#     raw_campaign = campaign_result["campaignid"]
#     campaign_list = [c.strip().strip("'") for c in raw_campaign.split(",")]
#
#     # Step 2: Build report query
#     report_query = f"""
#         SELECT
#             t2.uniqueid,
#             SEC_TO_TIME(t6.p) AS parked_time,
#             t2.campaign_id,
#             IF(queue_seconds <= 20, 1, 0) AS call20,
#             IF(queue_seconds <= 60, 1, 0) AS call60,
#             IF(queue_seconds <= 90, 1, 0) AS call90,
#             t2.user AS agent,
#             vc.full_name,
#             t2.lead_id AS leadid,
#             RIGHT(phone_number, 10) AS phone_number,
#             DATE(call_date) AS call_date,
#             SEC_TO_TIME(queue_seconds) AS queuetime,
#             IF(queue_seconds = 0, FROM_UNIXTIME(t2.start_epoch), FROM_UNIXTIME(t2.start_epoch - queue_seconds)) AS queue_start,
#             FROM_UNIXTIME(t2.start_epoch) AS start_time,
#             FROM_UNIXTIME(t2.end_epoch) AS end_time,
#             SEC_TO_TIME(IF(t3.talk_sec IS NULL, t2.length_in_sec, t3.talk_sec)) AS call_duration,
#             IF(t3.talk_sec IS NULL, t2.length_in_sec, t3.talk_sec) AS call_duration1,
#             FROM_UNIXTIME(t2.end_epoch + TIME_TO_SEC(
#                 IF(t3.dispo_sec IS NULL, SEC_TO_TIME(0),
#                     IF(t3.sub_status = 'LOGIN' OR t3.sub_status = 'Feed' OR t3.talk_sec = t3.dispo_sec OR t3.talk_sec = 0,
#                         SEC_TO_TIME(1),
#                         IF(t3.dispo_sec > 100, SEC_TO_TIME(t3.dispo_sec - (t3.dispo_sec / 100) * 100), SEC_TO_TIME(t3.dispo_sec))
#                     )
#                 )
#             )) AS wrap_end_time,
#             IF(t3.dispo_sec IS NULL, SEC_TO_TIME(0),
#                 IF(t3.sub_status = 'LOGIN' OR t3.sub_status = 'Feed' OR t3.talk_sec = t3.dispo_sec OR t3.talk_sec = 0,
#                     SEC_TO_TIME(1),
#                     IF(t3.dispo_sec > 100, SEC_TO_TIME(t3.dispo_sec - (t3.dispo_sec / 100) * 100), SEC_TO_TIME(t3.dispo_sec))
#                 )
#             ) AS wrap_time,
#             t3.sub_status,
#             t2.status,
#             t2.term_reason,
#             t2.xfercallid
#         FROM asterisk.vicidial_closer_log t2
#         LEFT JOIN vicidial_agent_log t3 ON t2.uniqueid = t3.uniqueid AND t2.user = t3.user
#         LEFT JOIN (
#             SELECT uniqueid, SUM(parked_sec) AS p
#             FROM park_log
#             WHERE STATUS = 'GRABBED' AND DATE(parked_time) BETWEEN :from_date AND :to_date
#             GROUP BY uniqueid
#         ) t6 ON t2.uniqueid = t6.uniqueid
#         LEFT JOIN vicidial_users vc ON t2.user = vc.user
#         WHERE DATE(t2.call_date) BETWEEN :from_date AND :to_date
#         AND t2.campaign_id IN :campaign_ids
#         AND t2.lead_id IS NOT NULL
#     """
#
#     # Execute main report query
#     result = db2.execute(text(report_query), {
#         "from_date": request.from_date,
#         "to_date": request.to_date,
#         "campaign_ids": tuple(campaign_list)
#     }).mappings().fetchall()
#
#     enriched_result = []
#
#     if result:
#         # Fetch scenario tagging from call_master
#         scenario_query = text("""
#             SELECT *
#             FROM call_master cm
#             WHERE DATE(cm.calldate) BETWEEN :from_date AND :to_date
#         """)
#         scenario_data = db.execute(scenario_query, {
#             "from_date": request.from_date,
#             "to_date": request.to_date
#         }).mappings().fetchall()
#
#         scenario_map = {str(row["LeadId"]): row for row in scenario_data if row["LeadId"]}
#
#         # Enrich each row with scenario data if LeadId matches
#         for row in result:
#             lead_id = str(row.get("leadid"))
#             scenario = scenario_map.get(lead_id)
#             enriched_row = dict(row)
#
#             if scenario:
#                 enriched_row.update({
#                     "Category1": scenario.get("Category1"),
#                     "Category2": scenario.get("Category2"),
#                     "Category3": scenario.get("Category3"),
#                     "Category4": scenario.get("Category4"),
#                     "Category5": scenario.get("Category5"),
#                     "source": scenario.get("Source"),
#                     "recording": scenario.get("Recording")
#                 })
#             else:
#                 enriched_row.update({
#                     "Category1": None,
#                     "Category2": None,
#                     "Category3": None,
#                     "Category4": None,
#                     "Category5": None,
#                     "source": None,
#                     "recording": None
#                 })
#
#             enriched_result.append(enriched_row)
#
#     return enriched_result




@router.post("/cdr_report", response_model=List[CDRReportResponse])
def get_cdr_report(request: CDRReportRequest, db: Session = Depends(get_db4), db2: Session = Depends(get_db2)):

    # -----------------------------------------------------------------
    # 1. Campaign ID resolution (matches PHP logic with All + category)
    # -----------------------------------------------------------------
    category_qry = ""
    if request.category and request.category != "All":
        category_qry = f"AND client_category = '{request.category}'"

    if request.company_id == "All":
        db.execute(text("SET SESSION group_concat_max_len = 20000"))
        campaign_sql = f"""
            SELECT GROUP_CONCAT(campaignid) AS campaign_id
            FROM registration_master
            WHERE status='A' AND is_dd_client='1' {category_qry}
        """
        campaign_result = db.execute(text(campaign_sql)).mappings().fetchone()
        if not campaign_result or not campaign_result["campaign_id"]:
            raise HTTPException(status_code=404, detail="No campaigns found")
        raw_campaign = campaign_result["campaign_id"]
    else:
        campaign_sql = f"""
            SELECT campaignid
            FROM registration_master
            WHERE company_id = :company_id {category_qry}
        """
        campaign_result = db.execute(text(campaign_sql), {"company_id": request.company_id}).mappings().fetchone()
        if not campaign_result:
            raise HTTPException(status_code=404, detail="Category Not Match")
        raw_campaign = campaign_result["campaignid"]

    # Convert campaign list
    campaign_list = [c.strip().strip("'") for c in raw_campaign.split(",")]

    # -----------------------------------------------------------------
    # 2. Main CDR Query (same as PHP $qry)
    # -----------------------------------------------------------------
    report_query = f"""
        SELECT 
            t2.uniqueid,
            SEC_TO_TIME(t6.p) AS parked_time,
            t2.campaign_id,
            IF(queue_seconds <= 20, 1, 0) AS call20,
            IF(queue_seconds <= 60, 1, 0) AS call60,
            IF(queue_seconds <= 90, 1, 0) AS call90,
            t2.user AS agent,
            vc.full_name,
            t2.lead_id AS leadid,
            RIGHT(phone_number, 10) AS phone_number,
            phone_number AS full_phone_number,
            DATE(call_date) AS call_date,
            SEC_TO_TIME(queue_seconds) AS queuetime,
            IF(queue_seconds = 0, FROM_UNIXTIME(t2.start_epoch), FROM_UNIXTIME(t2.start_epoch - queue_seconds)) AS queue_start,
            FROM_UNIXTIME(t2.start_epoch) AS start_time,
            FROM_UNIXTIME(t2.end_epoch) AS end_time,
            SEC_TO_TIME(IF(t3.talk_sec IS NULL, t2.length_in_sec, t3.talk_sec)) AS call_duration,
            IF(t3.talk_sec IS NULL, t2.length_in_sec, t3.talk_sec) AS call_duration1,
            FROM_UNIXTIME(t2.end_epoch + TIME_TO_SEC(
                IF(t3.dispo_sec IS NULL, SEC_TO_TIME(0),
                    IF(t3.sub_status = 'LOGIN' OR t3.sub_status = 'Feed' OR t3.talk_sec = t3.dispo_sec OR t3.talk_sec = 0,
                        SEC_TO_TIME(1),
                        IF(t3.dispo_sec > 100, SEC_TO_TIME(t3.dispo_sec - (t3.dispo_sec / 100) * 100), SEC_TO_TIME(t3.dispo_sec))
                    )
                )
            )) AS wrap_end_time,
            IF(t3.dispo_sec IS NULL, SEC_TO_TIME(0),
                IF(t3.sub_status = 'LOGIN' OR t3.sub_status = 'Feed' OR t3.talk_sec = t3.dispo_sec OR t3.talk_sec = 0,
                    SEC_TO_TIME(1),
                    IF(t3.dispo_sec > 100, SEC_TO_TIME(t3.dispo_sec - (t3.dispo_sec / 100) * 100), SEC_TO_TIME(t3.dispo_sec))
                )
            ) AS wrap_time,
            t3.sub_status,
            t2.status,
            t2.term_reason,
            t2.xfercallid
        FROM asterisk.vicidial_closer_log t2
        LEFT JOIN vicidial_agent_log t3 
            ON t2.uniqueid = t3.uniqueid AND t2.user = t3.user
        LEFT JOIN (
            SELECT uniqueid, SUM(parked_sec) AS p 
            FROM park_log 
            WHERE STATUS = 'GRABBED' AND DATE(parked_time) BETWEEN :from_date AND :to_date 
            GROUP BY uniqueid
        ) t6 ON t2.uniqueid = t6.uniqueid
        LEFT JOIN vicidial_users vc ON t2.user = vc.user
        WHERE DATE(t2.call_date) BETWEEN :from_date AND :to_date 
        AND t2.campaign_id IN :campaign_ids 
        AND t2.lead_id IS NOT NULL
    """

    cdr_rows = db2.execute(
        text(report_query),
        {"from_date": request.from_date, "to_date": request.to_date, "campaign_ids": tuple(campaign_list)}
    ).mappings().fetchall()

    # -----------------------------------------------------------------
    # 3. Scenario/Category data (two queries, same as PHP)
    # -----------------------------------------------------------------
    scenario_query1 = text("""
        SELECT * FROM call_master cm
        WHERE DATE(cm.calldate) BETWEEN :from_date AND :to_date
    """)
    scenario_data1 = db.execute(scenario_query1, {
        "from_date": request.from_date,
        "to_date": request.to_date
    }).mappings().fetchall()

    # Missed tagging query (hardcoded)
    scenario_query2 = text("""
        SELECT * FROM call_master cm
        WHERE DATE(cm.calldate) BETWEEN '2025-03-15' AND '2025-03-30'
    """)
    scenario_data2 = db.execute(scenario_query2).mappings().fetchall()

    # Merge into map by LeadId
    scenario_map = {}
    for row in scenario_data1 + scenario_data2:
        lead_id = str(row.get("LeadId"))
        if lead_id and lead_id not in scenario_map:
            scenario_map[lead_id] = row

    # -----------------------------------------------------------------
    # 4. Enrich rows with Category1-5
    # -----------------------------------------------------------------
    enriched_result = []
    for row in cdr_rows:
        enriched_row = dict(row)
        lead_id = str(row.get("leadid"))

        scenario = scenario_map.get(lead_id)
        if scenario:
            enriched_row.update({
                "Category1": scenario.get("Category1"),
                "Category2": scenario.get("Category2"),
                "Category3": scenario.get("Category3"),
                "Category4": scenario.get("Category4"),
                "Category5": scenario.get("Category5"),
                "Source": scenario.get("Source"),
                "Recording": scenario.get("Recording")
            })
        else:
            enriched_row.update({
                "Category1": None,
                "Category2": None,
                "Category3": None,
                "Category4": None,
                "Category5": None,
                "Source": None,
                "Recording": None
            })

        enriched_result.append(enriched_row)

    return enriched_result




# @router.post("/ob_cdr_report")
# def get_ob_cdr_report(request: OBCDRReportRequest, db: Session = Depends(get_db), db2: Session = Depends(get_db2)):
#     # Step 1: Get campaign ID from registration_master
#     campaign_query = text("SELECT campaignid FROM registration_master WHERE company_id = :company_id")
#     campaign_result = db.execute(campaign_query, {"company_id": request.company_id}).mappings().fetchone()
#
#     if not campaign_result:
#         raise HTTPException(status_code=404, detail="Company ID not found")
#
#     raw_campaign = campaign_result["campaignid"]
#     campaign_list = [c.strip().strip("'") for c in raw_campaign.split(",")]
#
#     if not campaign_list:
#         raise HTTPException(status_code=404, detail="No campaigns found for this company")
#
#     # Step 2: Prepare condition for campaign_id filtering
#     campaign_condition = "t2.campaign_id IN :campaign_ids"
#
#     # Step 3: Build query using the provided qry with parameter placeholders
#     report_query = text(f"""
#         SELECT
#             SEC_TO_TIME(t6.`p`) AS ParkedTime,
#             t2.user AS Agent,
#             t2.lead_id AS LeadId,
#             RIGHT(phone_number,10) AS PhoneNumber,
#             DATE(call_date) AS CallDate,
#             SEC_TO_TIME(queue_seconds) AS Queuetime,
#             IF(queue_seconds='0', FROM_UNIXTIME(t2.start_epoch), FROM_UNIXTIME(t2.start_epoch - queue_seconds)) AS QueueStart,
#             FROM_UNIXTIME(t2.start_epoch) AS StartTime,
#             FROM_UNIXTIME(t2.end_epoch) AS Endtime,
#             SEC_TO_TIME(IF(t3.`talk_sec` IS NULL, t2.length_in_sec, t3.`talk_sec`)) AS CallDuration,
#             IF(t3.`talk_sec` IS NULL, t2.length_in_sec, t3.`talk_sec`) AS CallDuration1,
#             FROM_UNIXTIME(t2.end_epoch + TIME_TO_SEC(
#                 IF(t3.dispo_sec IS NULL, SEC_TO_TIME(0),
#                     IF(t3.sub_status='LOGIN' OR t3.sub_status='Feed' OR t3.talk_sec=t3.dispo_sec OR t3.talk_sec=0,
#                         SEC_TO_TIME(1),
#                         IF(t3.dispo_sec>100, SEC_TO_TIME(t3.dispo_sec-(t3.dispo_sec/100)*100), SEC_TO_TIME(t3.dispo_sec))
#                     )
#                 )
#             )) AS WrapEndTime,
#             IF(t3.dispo_sec IS NULL, SEC_TO_TIME(0),
#                 IF(t3.sub_status='LOGIN' OR t3.sub_status='Feed' OR t3.talk_sec=t3.dispo_sec OR t3.talk_sec=0,
#                     SEC_TO_TIME(1),
#                     IF(t3.dispo_sec>100, SEC_TO_TIME(t3.dispo_sec-(t3.dispo_sec/100)*100), SEC_TO_TIME(t3.dispo_sec))
#                 )
#             ) AS WrapTime
#         FROM asterisk.vicidial_closer_log t2
#         LEFT JOIN vicidial_agent_log t3 ON t2.uniqueid=t3.uniqueid AND t2.user=t3.user
#         LEFT JOIN (
#             SELECT uniqueid, SUM(parked_sec) p FROM park_log
#             WHERE STATUS='GRABBED' AND DATE(parked_time) BETWEEN :from_date AND :to_date
#             GROUP BY uniqueid
#         ) t6 ON t2.uniqueid=t6.uniqueid
#         WHERE DATE(t2.call_date) BETWEEN :from_date AND :to_date
#         AND DATE(t2.call_date) BETWEEN DATE_SUB(CURDATE(), INTERVAL 3 MONTH) AND CURDATE()
#         AND {campaign_condition}
#         AND t2.lead_id IS NOT NULL
#     """)
#
#     # Step 4: Execute query and fetch results
#     result = db2.execute(report_query, {
#         "from_date": request.from_date,
#         "to_date": request.to_date,
#         "campaign_ids": tuple(campaign_list)
#     }).mappings().fetchall()
#
#     # Step 5: Return raw result without response_model
#     return [dict(row) for row in result]




@router.post("/ob_cdr_report", response_model=List[OBCDReportRow])
def get_ob_cdr_report(
    request: OBCDRReportRequest,
    db: Session = Depends(get_db4),   # main DB
    db2: Session = Depends(get_db2),  # vicidial
    db3: Session = Depends(get_db3)   # call_master_out DB
):
    # Step 1: Get campaign IDs
    campaign_query = text("SELECT campaignid FROM registration_master WHERE company_id = :company_id")
    campaign_result = db.execute(campaign_query, {"company_id": request.company_id}).mappings().fetchone()
    if not campaign_result:
        raise HTTPException(status_code=404, detail="Company ID not found")

    raw_campaign = campaign_result["campaignid"]
    campaign_list = [c.strip().strip("'") for c in raw_campaign.split(",") if c.strip()]

    if not campaign_list:
        raise HTTPException(status_code=404, detail="No campaigns found for this company")

    # Step 2: Main Vicidial query (expanded)
    report_query = text("""
        SELECT 
            t2.uniqueid,
            t2.user AS Agent,
            vu.full_name,
            t2.lead_id AS LeadId,
            RIGHT(t2.phone_number,10) AS PhoneNumber,
            DATE(t2.call_date) AS CallDate,
            FROM_UNIXTIME(t2.start_epoch) AS StartTime,
            FROM_UNIXTIME(t2.end_epoch) AS Endtime,
            t2.length_in_sec AS CallDuration,
            SEC_TO_TIME(t2.length_in_sec) AS CallDurationFmt,
            IF(t2.user='VDAD','Not Connected','Connected') AS Scenario,
            IF(t2.list_id='998','Manual','Auto') AS DialMode,
            t3.dispo_sec AS WrapTime
        FROM asterisk.vicidial_log t2
        LEFT JOIN vicidial_agent_log t3 ON t2.uniqueid=t3.uniqueid
        LEFT JOIN vicidial_users vu ON t2.user=vu.user
        WHERE DATE(t2.call_date) BETWEEN :from_date AND :to_date
        AND t2.campaign_id IN :campaign_ids
        AND t2.lead_id IS NOT NULL
    """)

    vicidial_rows = db2.execute(report_query, {
        "from_date": request.from_date,
        "to_date": request.to_date,
        "campaign_ids": tuple(campaign_list)
    }).mappings().fetchall()

    # Step 3: Sub Scenario categories
    category_query = text("""
        SELECT cm.LiveUniqueId, cm.LiveLeadId,
               cm.Category1, cm.Category2, cm.Category3, cm.Category4
        FROM call_master_out cm
        LEFT JOIN ob_campaign_data ocd ON cm.DataId = ocd.id
        WHERE DATE(cm.calldate) BETWEEN :from_date AND :to_date
    """)
    category_rows = db.execute(category_query, {
        "from_date": request.from_date,
        "to_date": request.to_date
    }).mappings().fetchall()

    # Build category map (uniqueid → categories)
    category_map = {}
    for row in category_rows:
        if row["LiveUniqueId"]:
            category_map[row["LiveUniqueId"]] = row
        elif row.get("LiveLeadId"):
            category_map[row["LiveLeadId"]] = row

    # Step 4: Merge recording + categories into Vicidial data
    host = "yourdomain.com"  # 🔁 Replace with your domain
    final_data = []
    for row in vicidial_rows:
        row_dict = dict(row)

        # Recording URL
        row_dict["Recording"] = (
            f"https://{host}/download-recording/download.php?"
            f"mode=DD&filename={row['LeadId']}&agent={row['Agent']}"
            f"&dater={row['CallDate']}&phno={row['PhoneNumber']}"
        )

        # Attach Sub Scenarios (if exists)
        categories = category_map.get(row["uniqueid"], {})
        row_dict["SubScenario1"] = categories.get("Category1")
        row_dict["SubScenario2"] = categories.get("Category2")
        row_dict["SubScenario3"] = categories.get("Category3")
        row_dict["SubScenario4"] = categories.get("Category4")

        final_data.append(row_dict)

    return final_data




# @router.post("/ob_shared_cdr_report")
# def get_ob_shared_cdr_report(request: OBCDRReportRequest, db: Session = Depends(get_db), db2: Session = Depends(get_db2)):
#     # Step 1: Get campaign ID from registration_master
#     campaign_query = text("SELECT campaignid FROM registration_master WHERE company_id = :company_id")
#     campaign_result = db.execute(campaign_query, {"company_id": request.company_id}).mappings().fetchone()
#
#     if not campaign_result:
#         raise HTTPException(status_code=404, detail="Company ID not found")
#
#     raw_campaign = campaign_result["campaignid"]
#     campaign_list = [c.strip().strip("'") for c in raw_campaign.split(",")]
#
#     if not campaign_list:
#         raise HTTPException(status_code=404, detail="No campaigns found for this company")
#
#     # Step 2: Prepare campaign filter condition
#     campaign_condition = "t2.campaign_id IN :campaign_ids"
#
#     # Step 3: Build and parameterize query
#     report_query = text(f"""
#         SELECT
#             DATE(t2.call_date) AS CallDate,
#             FROM_UNIXTIME(t2.start_epoch) AS StartTime,
#             FROM_UNIXTIME(t2.end_epoch) AS Endtime,
#             LEFT(t2.phone_number, 10) AS PhoneNumber,
#             t2.user AS Agent,
#             vu.full_name AS FullName,
#             IF(t2.user = 'VDAD', 'Not Connected', 'Connected') AS CallType,
#             t2.status AS Status,
#             IF(t2.list_id = '998', 'Manual', 'Auto') AS DialMode,
#             t2.campaign_id AS CampaignID,
#             t2.lead_id AS LeadID,
#             t2.length_in_sec AS LengthInSec,
#             SEC_TO_TIME(t2.length_in_sec) AS LengthInMin,
#             t2.term_reason AS TermReason,
#             t2.length_in_sec AS CallDuration,
#             t2.status AS CallStatus,
#             t3.pause_sec AS PauseSec,
#             t3.wait_sec AS WaitSec,
#             t3.talk_sec AS TalkSec,
#             t3.dispo_sec AS DispoSec
#         FROM asterisk.vicidial_log t2
#         LEFT JOIN vicidial_agent_log t3 ON t2.uniqueid = t3.uniqueid
#         LEFT JOIN vicidial_users vu ON t2.user = vu.user
#         WHERE DATE(t2.call_date) BETWEEN :from_date AND :to_date
#         AND {campaign_condition}
#         AND t2.lead_id IS NOT NULL
#     """)
#
#     # Step 4: Execute and fetch
#     result = db2.execute(report_query, {
#         "from_date": request.from_date,
#         "to_date": request.to_date,
#         "campaign_ids": tuple(campaign_list)
#     }).mappings().fetchall()
#
#     # Step 5: Return raw list of dicts
#     return [dict(row) for row in result]



@router.post("/ob_shared_cdr_report")
def get_ob_shared_cdr_report(
    request: OBCDRReportRequest,
    db: Session = Depends(get_db4),   # main DB
    db2: Session = Depends(get_db2)   # vicidial DB
):
    from_dt = request.from_date
    to_dt = request.to_date

    # Step 1: Get GroupId (or fallback to campaignid)
    client_query = text("""
        SELECT campaignid, GroupId
        FROM registration_master
        WHERE company_id = :company_id
    """)
    client_row = db.execute(client_query, {"company_id": request.company_id}).mappings().first()
    campaign_id = client_row["GroupId"] or client_row["campaignid"]

    # Step 2: Get vicidial call details
    cdr_query = text("""
        SELECT 
            DATE(t2.call_date) AS call_date,
            FROM_UNIXTIME(t2.start_epoch) AS start_time,
            FROM_UNIXTIME(t2.end_epoch) AS end_time,
            t2.phone_number,
            t2.user AS agent_id,
            t4.full_name AS agent_name,
            IF(t2.user='VDAD','Not Connected','Connected') AS call_type,
            t2.status AS call_status,
            IF(t2.list_id='998','Mannual','Auto') AS dial_mode,
            t2.uniqueid,
            t2.lead_id,
            t3.talk_sec,
            t3.wait_sec,
            t3.pause_sec,
            t3.dispo_sec,
            t2.term_reason
        FROM vicidial_log t2
        LEFT JOIN vicidial_agent_log t3 ON t2.uniqueid = t3.uniqueid
        LEFT JOIN vicidial_users t4 ON t2.user = t4.user
        WHERE t2.campaign_id = :campaign_id
          AND DATE(t2.call_date) BETWEEN :from_dt AND :to_dt
    """)
    cdr_rows = db2.execute(cdr_query, {
        "campaign_id": campaign_id,
        "from_dt": from_dt,
        "to_dt": to_dt
    }).mappings().all()

    # Step 3: Abandoned call master lookup (for ClientName)
    aband_query = text("""
        SELECT PhoneNo, DATE(Callbackdate) AS CallDate, CompanyName
        FROM aband_call_master
        WHERE ClientId = :client_id
          AND DATE(Callbackdate) BETWEEN :from_dt AND :to_dt
    """)
    aband_rows = db.execute(aband_query, {
        "client_id": request.company_id,
        "from_dt": from_dt,
        "to_dt": to_dt
    }).mappings().all()
    aband_map = {(row["PhoneNo"], str(row["CallDate"])): row["CompanyName"] for row in aband_rows}

    # Step 4: Call master lookup (for SubScenarios)
    call_master_query = text("""
        SELECT LeadId, Category1, Category2, Category3, Category4
        FROM call_master
        WHERE ClientId = :client_id
          AND DATE(CallDate) BETWEEN :from_dt AND :to_dt
    """)
    call_master_rows = db.execute(call_master_query, {
        "client_id": request.company_id,
        "from_dt": from_dt,
        "to_dt": to_dt
    }).mappings().all()
    call_master_map = {row["LeadId"]: row for row in call_master_rows}

    # Step 5: Format output
    response_data = []
    for row in cdr_rows:
        lead_id = row["lead_id"]
        cm = call_master_map.get(lead_id)

        record = {
            "CallDate": row["call_date"],
            "StartTime": row["start_time"],
            "Endtime": row["end_time"],
            "CustomerNumber": row["phone_number"],
            "AgentID": row["agent_id"],
            "AgentName": row["agent_name"],
            "CallType": row["call_type"],                 # Connected / Not Connected
            "SystemDisposition": row["call_status"],      # vicidial status
            "DialingMode": row["dial_mode"],              # Auto / Mannual
            "ClientName": aband_map.get((row["phone_number"], str(row["call_date"]))),
            "LeadID": lead_id,
            "ACHT": (row["talk_sec"] or 0) + (row["dispo_sec"] or 0),
            "TalkTime": row["talk_sec"],
            "WaitTime": row["wait_sec"],
            "PauseTime": row["pause_sec"],                # ✅ added PauseSec
            "DispoTime": row["dispo_sec"],
            "DisconnectedBy": row["term_reason"],
            "Scenario": row["call_type"],                 # ✅ fixed Scenario
            "SubScenario1": cm["Category1"] if cm else None,
            "SubScenario2": cm["Category2"] if cm else None,
            "SubScenario3": cm["Category3"] if cm else None,
            "SubScenario4": cm["Category4"] if cm else None,
            "Recording": f"https://yourserver.com/download-recording/download.php"
                         f"?mode=DD&filename={lead_id}&agent={row['agent_id']}"
                         f"&dater={row['call_date']}&phno={row['phone_number']}"
        }
        response_data.append(record)

    return {"status": "success", "data": response_data}





# @router.post("/ivr_report")
# def get_ivr_report(
#     request: OBCDRReportRequest,  # reuse your schema expecting from_date, to_date, company_id
#     db: Session = Depends(get_db2)
# ):
#     """
#     Returns IVR report for the requested company_id and date range.
#     """
#
#     # Step 1: Build the query with clear field mapping
#     report_query = text("""
#         SELECT
#             il.*,
#             DATE_FORMAT(start_time, '%d-%b-%y') AS Dater,
#             DATE_FORMAT(start_time, '%d-%b-%y %H:%i:%s') AS StartDate,
#             DATE_FORMAT(end_time, '%d-%b-%y %H:%i:%s') AS EndDate
#         FROM ivr_log il
#         WHERE client_id = :client_id
#         AND DATE(start_time) BETWEEN :from_date AND :to_date
#     """)
#
#     # Step 2: Execute and fetch
#     result = db.execute(report_query, {
#         "client_id": request.company_id,
#         "from_date": request.from_date,
#         "to_date": request.to_date
#     }).mappings().fetchall()
#
#     # Step 3: Return raw list of dicts
#     return [dict(row) for row in result]





@router.post("/ivr_report")
def get_ivr_report(
    request: OBCDRReportRequest,
    db4: Session = Depends(get_db4)
) -> List[Dict[str, Any]]:
    """
    Returns IVR report formatted like the PHP ivr_log report.
    """

    query = text("""
        SELECT
            il.call_type,
            il.from_source,
            il.duration,
            il.outcome,
            il.opt,
            DATE_FORMAT(il.start_time, '%d-%b-%y') AS date,
            DATE_FORMAT(il.start_time, '%d-%b-%y %H:%i:%s') AS start_time,
            DATE_FORMAT(il.end_time, '%d-%b-%y %H:%i:%s') AS end_time
        FROM ivr_log il
        WHERE il.client_id = :client_id
        AND DATE(il.start_time) BETWEEN :from_date AND :to_date
        ORDER BY il.start_time ASC
    """)

    rows = db4.execute(query, {
        "client_id": request.company_id,
        "from_date": request.from_date,
        "to_date": request.to_date
    }).mappings().all()

    result = []
    for row in rows:
        r = dict(row)

        # FROM = last 10 digits of from_source
        from_number = str(r.get("from_source", "")).strip()
        r["from"] = from_number[-10:] if len(from_number) >= 10 else from_number
        del r["from_source"]

        # Default outcome
        if not r.get("outcome"):
            r["outcome"] = "No Input"

        # Rename keys to match report table
        formatted = {
            "date": r["date"],
            "call_type": r["call_type"],
            "from": r["from"],
            "start_time": r["start_time"],
            "end_time": r["end_time"],
            "duration": r["duration"],
            "outcome": r["outcome"],
            "opt": r.get("opt", "")
        }
        result.append(formatted)

    return result



# @router.post("/ivr_funnel_report")
# def get_ivr_funnel_report(
#     request: IVRFunnelReportRequest,
#     db: Session = Depends(get_db2)
# ):
#     try:
#         # Core Query
#         report_query = text("""
#             SELECT
#                 uniqueid,
#                 user,
#                 status,
#                 xfercallid,
#                 DATE_FORMAT(call_date, '%Y-%m-%d') as call_date
#             FROM vicidial_closer_log vcl
#             WHERE DATE(call_date) BETWEEN :from_date AND :to_date
#         """)
#
#         results = db.execute(report_query, {
#             "from_date": request.from_date,
#             "to_date": request.to_date,
#         }).mappings().fetchall()
#
#         return [dict(row) for row in results]
#
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))



@router.post("/ivr_funnel_report")
def get_ivr_funnel_report(
    request: IVRFunnelReportRequest,
    db2: Session = Depends(get_db2)
):
    try:
        # Step 1 – fetch closer log
        qry_closer_log = text("""
            SELECT uniqueid, user, status, xfercallid
            FROM vicidial_closer_log vcl
            WHERE DATE(call_date) BETWEEN :from_date AND :to_date
        """)
        cdr_results = db2.execute(qry_closer_log, {
            "from_date": request.from_date,
            "to_date": request.to_date,
        }).mappings().fetchall()
        cdr_map = {row["uniqueid"]: row for row in cdr_results}

        # Step 2 – fetch IVR log
        qry_ivr = text("""
            SELECT ivl.uniqueid, ivl.outcome,
                   DATE_FORMAT(ivl.start_time, '%b-%y') AS month
            FROM ivr_log ivl
            WHERE ivl.client_id = :client_id
              AND DATE(ivl.start_time) BETWEEN :from_date AND :to_date
        """)
        ivr_results = db2.execute(qry_ivr, {
            "client_id": request.company_id,
            "from_date": request.from_date,
            "to_date": request.to_date,
        }).mappings().fetchall()

        # Step 3 – process monthly counters
        record_list, month_list = {}, set()
        for row in ivr_results:
            month = row["month"]
            outcome = row["outcome"]
            uid = row["uniqueid"]
            cdr = cdr_map.get(uid, {})

            if month not in record_list:
                record_list[month] = {
                    "Total IVR calls": 0,
                    "Total IVR Closed Calls": 0,
                    "Transferred from IVR to queue": 0,
                    "Customer dropped calls before queue": 0,
                    "Customer dropped calls in queue": 0,
                    "Customers abandoned in queue": 0,
                    "Customers transferred/connected to agent": 0,
                    "Customers transferred from agent to CSAT IVR": 0,
                }
            rec = record_list[month]
            rec["Total IVR calls"] += 1
            month_list.add(month)

            # Closed vs Forward
            if outcome != "TransferredtoAgent":
                rec["Total IVR Closed Calls"] += 1
            else:
                rec["Transferred from IVR to queue"] += 1

            # Dropped before queue
            if outcome == "TransferredtoAgent" and not cdr:
                rec["Customer dropped calls before queue"] += 1

            # Queue outcomes
            if cdr.get("status") == "TIMEOT":
                rec["Customers abandoned in queue"] += 1
            elif str(cdr.get("user", "")).lower() == "vdcl":
                rec["Customer dropped calls in queue"] += 1
            elif cdr.get("user") and str(cdr["user"]).lower() != "vdcl":
                rec["Customers transferred/connected to agent"] += 1
            elif cdr.get("user"):
                rec["Customer dropped calls in queue"] += 1

            # CSAT
            if cdr.get("xfercallid"):
                rec["Customers transferred from agent to CSAT IVR"] += 1

        # Step 4 – return JSON in proper order
        return [
            {
                "Month": month,
                "Total IVR calls": rec["Total IVR calls"],
                "Total IVR Closed Calls": rec["Total IVR Closed Calls"],
                "Transferred from IVR to queue": rec["Transferred from IVR to queue"],
                "Customer dropped calls before queue": rec["Customer dropped calls before queue"],
                "Customer dropped calls in queue": rec["Customer dropped calls in queue"],
                "Customers abandoned in queue": rec["Customers abandoned in queue"],
                "Customers transferred/connected to agent": rec["Customers transferred/connected to agent"],
                "Customers transferred from agent to CSAT IVR": rec["Customers transferred from agent to CSAT IVR"],
            }
            for month, rec in sorted(record_list.items())
        ]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

