from fastapi import APIRouter, Depends, Query, HTTPException, Body
from typing import Optional, List
from datetime import datetime
import re
from sqlalchemy import text
from sqlalchemy.orm import Session
from database import get_db

router = APIRouter()


# ---------------- /campaigns ----------------
@router.get("/campaigns", response_model=List[dict])
def get_campaigns(
    CLIENT_ID: Optional[int] = Query(None),
    campaignType: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = """
        SELECT
            c.id,
            c.ClientId,
            c.campaign_id,
            c.CampaignName,
            c.CampaignParentName AS Type,
            c.campaign_description,
            c.CreationDate,
            c.CampaignStatus,
            ct.CampaignType AS Type1,
            c.Field1, c.Field2, c.Field3, c.Field4, c.Field5,
            c.Field6, c.Field7, c.Field8, c.Field9, c.Field10,
            c.Field11, c.Field12, c.Field13, c.Field14, c.Field15,
            c.Field16, c.Field17, c.Field18, c.Field19, c.Field20
        FROM ob_campaign c
        LEFT JOIN ob_campaign_type ct
            ON c.campaign_id = ct.Id
    """
    params = {}
    conditions = []
    if CLIENT_ID:
        conditions.append("c.ClientId = :ClientId AND c.CampaignStatus = 'A'")
        params["ClientId"] = CLIENT_ID
    if campaignType:
        conditions.append("c.CampaignParentName = :ctype")
        params["ctype"] = campaignType
    if conditions:
        query += " WHERE " + " AND ".join(conditions)
    query += " ORDER BY c.CreationDate DESC"

    rows = db.execute(text(query), params).mappings().all()

    campaigns = []
    for row in rows:
        fields = []
        for i in range(1, 21):
            value = row.get(f"Field{i}")
            if value and value != "\\N":
                fields.append(value)
        campaigns.append({
            "id": row["id"],
            "ClientId": row["ClientId"],
            "campaign_id": row["campaign_id"],
            "CampaignName": row["CampaignName"],
            "Description": row["campaign_description"],
            "Type": row["Type"],
            "CreationDate": row["CreationDate"],
            "Fields": fields,
            "Status": row["CampaignStatus"]
        })

    return campaigns


# ---------------- /allocations ----------------
@router.get("/allocations", response_model=List[dict])
def get_allocations(
    CLIENT_ID: int = Query(...),
    campaign: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    sql = """
        SELECT id, AllocationName AS name
        FROM ob_allocation_name
        WHERE ClientId = :cid
          AND AllocationStatus = 'A'
    """
    params = {"cid": CLIENT_ID}
    if campaign:
        sql += " AND CampaignId = :camp"
        params["camp"] = campaign

    rows = db.execute(text(sql), params).mappings().all()
    return [dict(r) for r in rows]


# ---------------- /label1 ----------------
@router.get("/label1")
def get_label1_ecr(
    Client: int = Query(...),
    CampaignId: int = Query(...),
    db: Session = Depends(get_db),
):
    query = text("""
        SELECT id, ecrName
        FROM obecr_master
        WHERE Client = :client
        AND CampaignId = :campaign
        AND Label = '1'
        ORDER BY ecrName
    """)

    result = db.execute(
        query,
        {"client": Client, "campaign": CampaignId}
    ).fetchall()

    return [{"id": row.id, "ecrName": row.ecrName} for row in result]


# ---------------- /label2 ----------------
@router.get("/label2")
def get_label2_ecr(
    Client: int = Query(...),
    CampaignId: int = Query(...),
    parent_id: int = Query(...),
    db: Session = Depends(get_db),
):
    query = text("""
        SELECT id, ecrName
        FROM obecr_master
        WHERE Client = :client
        AND CampaignId = :campaign
        AND parent_id = :parent
        AND Label = '2'
        ORDER BY ecrName
    """)

    result = db.execute(
        query,
        {"client": Client, "campaign": CampaignId, "parent": parent_id}
    ).fetchall()

    return [{"id": row.id, "ecrName": row.ecrName} for row in result]


# ---------------- /label3 ----------------
@router.get("/label3")
def get_label3_ecr(
    Client: int = Query(...),
    CampaignId: int = Query(...),
    parent_id: int = Query(...),
    db: Session = Depends(get_db),
):
    query = text("""
        SELECT id, ecrName
        FROM obecr_master
        WHERE Client = :client
        AND CampaignId = :campaign
        AND parent_id = :parent
        AND Label = '3'
        ORDER BY ecrName
    """)

    result = db.execute(
        query,
        {"client": Client, "campaign": CampaignId, "parent": parent_id}
    ).fetchall()

    return [{"id": row.id, "ecrName": row.ecrName} for row in result]


# ---------------- /label4 ----------------
@router.get("/label4")
def get_label4_ecr(
    Client: int = Query(...),
    CampaignId: int = Query(...),
    parent_id: int = Query(...),
    db: Session = Depends(get_db),
):
    query = text("""
        SELECT id, ecrName
        FROM obecr_master
        WHERE Client = :client
        AND CampaignId = :campaign
        AND parent_id = :parent
        AND Label = '4'
        ORDER BY ecrName
    """)

    result = db.execute(
        query,
        {"client": Client, "campaign": CampaignId, "parent": parent_id}
    ).fetchall()

    return [{"id": row.id, "ecrName": row.ecrName} for row in result]


# ---------------- /label5 ----------------
@router.get("/label5")
def get_label5_ecr(
    Client: int = Query(...),
    CampaignId: int = Query(...),
    parent_id: int = Query(...),
    db: Session = Depends(get_db),
):
    query = text("""
        SELECT id, ecrName
        FROM obecr_master
        WHERE Client = :client
        AND CampaignId = :campaign
        AND parent_id = :parent
        AND Label = '5'
        ORDER BY ecrName
    """)

    result = db.execute(
        query,
        {"client": Client, "campaign": CampaignId, "parent": parent_id}
    ).fetchall()

    return [{"id": row.id, "ecrName": row.ecrName} for row in result]


# ---------------- /obfield_master ----------------
@router.get("/obfield_master", response_model=List[dict])
def get_ob_fields(
    ClientId: int = Query(...),
    CampaignId: int = Query(...),
    db: Session = Depends(get_db),
):
    query = text("""
        SELECT f.id, f.FieldName, f.FieldType, v.FieldValueName
        FROM obfield_master f
        LEFT JOIN obfield_master_value v
            ON f.id = v.FieldId
            AND f.ClientId = v.ClientId
        WHERE f.ClientId = :client_id
        AND f.CampaignId = :campaign_id
    """)

    rows = db.execute(query, {
        "client_id": ClientId,
        "campaign_id": CampaignId
    }).fetchall()

    fields_dict = {}

    for row in rows:
        if row.id not in fields_dict:
            fields_dict[row.id] = {
                "id": row.id,
                "FieldName": row.FieldName,
                "FieldType": row.FieldType,
                "values": []
            }

        if row.FieldValueName:
            fields_dict[row.id]["values"].append(row.FieldValueName)

    return list(fields_dict.values())


# ---------------- /ob_campaign_data ----------------
@router.get("/ob_campaign_data", response_model=List[dict])
def get_ob_campaign_data(
    AllocationId: int = Query(...),
    AgentId: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    if AgentId is not None:
        query = text("""
            SELECT *
            FROM ob_campaign_data
            WHERE AllocationId = :allocation_id
              AND (AgentId = :agent_id OR AgentId IS NULL)
            ORDER BY id DESC
        """)
        params = {"allocation_id": AllocationId, "agent_id": AgentId}
    else:
        query = text("""
            SELECT *
            FROM ob_campaign_data
            WHERE AllocationId = :allocation_id
            ORDER BY id DESC
        """)
        params = {"allocation_id": AllocationId}

    rows = db.execute(
        query,
        params
    ).mappings().all()

    return [dict(r) for r in rows]


# ---------------- /select_ob_campaign_data ----------------
@router.post("/select_ob_campaign_data")
def select_ob_campaign_data(
    data: dict = Body(...),
    db: Session = Depends(get_db),
):
    data_id = data.get("DataId")
    agent_id = data.get("AgentId")
    if not data_id or not agent_id:
        raise HTTPException(status_code=400, detail="DataId and AgentId are required")

    query = text("""
        UPDATE ob_campaign_data
        SET AgentId = :agent_id
        WHERE id = :data_id
    """)
    db.execute(query, {"data_id": data_id, "agent_id": agent_id})
    db.commit()

    return {"success": True, "DataId": data_id, "AgentId": agent_id}


# ---------------- /find_by_phone ----------------
@router.get("/find_by_phone")
def find_by_phone(
    ClientId: int = Query(...),
    CampaignId: int = Query(...),
    phone: str = Query(...),
    AgentId: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    query = text("""
        SELECT ocd.*
        FROM ob_campaign_data ocd
        JOIN ob_allocation_name a ON a.id = ocd.AllocationId
        WHERE a.CampaignId = :campaign_id
          AND a.ClientId = :client_id
          AND (ocd.AgentId IS NULL OR ocd.AgentId = :agent_id)
        ORDER BY ocd.id DESC
        LIMIT 500
    """)
    rows = db.execute(
        query,
        {
            "campaign_id": CampaignId,
            "client_id": ClientId,
            "agent_id": AgentId,
        },
    ).mappings().all()

    phone_digits = re.sub(r"\D", "", phone)
    if phone_digits.startswith("91") and len(phone_digits) == 12:
        phone_digits = phone_digits[2:]

    for row in rows:
        record = dict(row)
        for i in range(1, 21):
            value = record.get(f"Field{i}")
            if value is None:
                continue
            raw = re.sub(r"\D", "", str(value))
            if raw.startswith("91") and len(raw) == 12:
                raw = raw[2:]
            if raw == phone_digits:
                return {"AllocationId": record["AllocationId"], "record": record}

    raise HTTPException(status_code=404, detail="No data found for phone number")


# ---------------- /save-tagging ----------------
@router.post("/save-tagging")
def save_tagging(
    ClientId: int = Query(...),
    CampaignId: int = Query(...),
    data: dict = Body(...),
    db: Session = Depends(get_db),
):
    try:
        # Fetch fieldName + fieldNumber mapping
        field_query = text("""
            SELECT fieldName, fieldNumber
            FROM obfield_master
            WHERE ClientId = :ClientId
            AND CampaignId = :CampaignId
        """)

        results = db.execute(field_query, {
            "ClientId": ClientId,
            "CampaignId": CampaignId
        }).fetchall()

        # Create mapping dictionary
        # Example: {"Customer Name": 1, "Order ID": 2}
        field_map = {row[0]: row[1] for row in results}

        dynamic_columns = []
        dynamic_values = {}

        # Match incoming keys with DB fieldName
        for input_key, input_value in data.items():
            if input_key in field_map:
                field_number = field_map[input_key]
                column_name = f"Field{field_number}"

                dynamic_columns.append(column_name)
                dynamic_values[column_name] = input_value

        srno_query = text("""
            SELECT COALESCE(MAX(SrNo), 0) AS last_srno
            FROM call_master_out
            WHERE ClientId = :ClientId
        """)
        result = db.execute(srno_query, {"ClientId": ClientId}).fetchone()
        next_srno = result.last_srno + 1

        # Static columns
        base_columns = [
            "SrNo",
            "ClientId",
            "AllocationId",
            "DataId",
            "AgentId",
            "MSISDN",
            "Category1",
            "Category2",
            "Category3",
            "Category4",
            "Category5",
            "CallDate",
            "CallType",
            "TagType",
            "callcreated"
        ]

        all_columns = base_columns + dynamic_columns

        columns_str = ", ".join(all_columns)
        values_str = ", ".join([f":{col}" for col in all_columns])

        insert_query = text(f"""
            INSERT INTO call_master_out ({columns_str})
            VALUES ({values_str})
        """)

        final_values = {
            "SrNo": next_srno,
            "ClientId": ClientId,
            "AllocationId": data.get("AllocationId"),
            "DataId": data.get("DataId"),
            "AgentId": data.get("AgentId"),
            "MSISDN": data.get("MSISDN") or None,
            "Category1": data.get("Scenario"),
            "Category2": data.get("SubScenario1"),
            "Category3": data.get("SubScenario2"),
            "Category4": data.get("SubScenario3"),
            "Category5": data.get("SubScenario4"),
            "CallDate": datetime.now(),
            "CallType": "Outbound",
            "TagType": data.get("TagType") or "Manual",
            "callcreated": data.get("callcreated")
        }

        final_values.update(dynamic_values)

        db.execute(insert_query, final_values)

        # Mark the source record as called in ob_campaign_data
        data_id = data.get("DataId")
        if data_id:
            update_data_query = text("""
                UPDATE ob_campaign_data
                SET DataStatus = 'call'
                  , CallDate = :call_date
                WHERE id = :data_id
            """)
            db.execute(
                update_data_query,
                {"data_id": data_id, "call_date": datetime.now()}
            )

        db.commit()

        return {
            "message": "Tagging saved successfully",
            "dynamic_fields_saved": dynamic_columns
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))