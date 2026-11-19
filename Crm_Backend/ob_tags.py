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


# ---------------- /mapple_customer_details ----------------
# Mapple campaigns display a fixed, read-only set of customer details.
# The order below is the order shown to the agent.
MAPLE_DETAIL_LABELS = {
    "MAPLE000": [
        "Customer Number",
        "Customer Name",
        "Device Modle",
        "Purchase Date",
        "IMEI",
        "1st Year Buy Back Value",
        "2nd Year Buy Back Value",
        "Store",
        "Elegibility Period",
        "Current EUP Status",
    ],
    "MAPLEBB0": [
        "Contact No",
        "Customer Name",
        "Price",
        "Email Address",
        "Device Model",
        "Purchase Date",
        "IMEI",
        "Store",
    ],
}


def _normalise_campaign_key(name: Optional[str]) -> str:
    return re.sub(r"[^A-Z0-9]", "", (name or "").upper())


def _phone_digits(value: Optional[str]) -> str:
    digits = re.sub(r"\D", "", str(value or ""))
    if digits.startswith("91") and len(digits) == 12:
        digits = digits[2:]
    return digits[-10:] if len(digits) > 10 else digits


DEVICE_KEYWORDS = (
    "iphone",
    "ipad",
    "macbook",
    "oneplus",
    "samsung",
    "galaxy",
    "redmi",
    "realme",
    "vivo",
    "oppo",
    "pixel",
    "moto",
    "nothing",
    "nord",
    "infinix",
    "iqoo",
)

SALUTATIONS = {"mr", "mr.", "mrs", "mrs.", "ms", "ms.", "dr", "dr."}


def _field_items(record: dict):
    return [(i, str(record.get(f"Field{i}") or "").strip()) for i in range(1, 26)]


def _first(*values) -> str:
    for value in values:
        if value is not None and str(value).strip() != "":
            return str(value).strip()
    return ""


def _join_name(*values) -> str:
    parts = []
    for value in values:
        part = str(value or "").strip()
        if not part or part.lower() in SALUTATIONS:
            continue
        if part.lower() not in " ".join(parts).lower():
            parts.append(part)
    return " ".join(parts)


def _is_email(value: str) -> bool:
    return bool(re.match(r"^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$", value))


def _is_imei(value: str) -> bool:
    return value.isdigit() and len(value) == 15


def _is_imei_fallback(value: str) -> bool:
    return value.isdigit() and 14 <= len(value) <= 17


def _is_date(value: str) -> bool:
    return bool(
        re.match(r"^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}$", value)
        or re.match(r"^\d{4}-\d{1,2}-\d{1,2}$", value)
    )


def _is_store(value: str) -> bool:
    return value.lower().startswith("store")


def _is_quotation(value: str) -> bool:
    if not re.match(r"^[A-Za-z0-9]+$", value) or len(value) < 8:
        return False
    # A plain 10 digit number is a phone number, not a quotation id.
    if value.isdigit() and len(value) == 10:
        return False
    return len(re.sub(r"\D", "", value)) >= 4


def _find(record: dict, predicate) -> str:
    for _, value in _field_items(record):
        if value and predicate(value):
            return value
    return ""


def _find_device(record: dict) -> str:
    best, best_score = "", 0
    for _, value in _field_items(record):
        low = value.lower()
        # Skip composite summary fields such as the Field19 quotation text.
        if (
            not value
            or "|" in value
            or "quotation" in low
            or len(value) > 60
            or not any(keyword in low for keyword in DEVICE_KEYWORDS)
        ):
            continue
        score = (2 if re.search(r"\d", value) else 0) + (
            1 if len(value.split()) >= 2 else 0
        )
        if score > best_score:
            best, best_score = value, score
    return best


def _find_purchase_date(record: dict) -> str:
    for number in (25, 8, 6):
        value = str(record.get(f"Field{number}") or "").strip()
        if _is_date(value):
            return value
    value = _find(record, _is_date)
    if value:
        return value
    match = re.search(r"Bought Date:\s*([^|]+)", str(record.get("Field19") or ""))
    return match.group(1).strip() if match else ""


def _date_key(key) -> str:
    return re.sub(r"[^a-z0-9]", "", str(key or "").lower())


# Entry/update columns that can stand in for a missing purchase date.
# ob_campaign_data has no created_at; its upload timestamp is CreationDate.
ENTRY_DATE_KEYS = {
    _date_key(k)
    for k in (
        "modify_date", "modifydate", "modified_date", "modifieddate",
        "mod_date", "moddate", "modify_dt", "modifydatetime",
        "updated_date", "updatedate", "updated_at", "updatedat",
        "last_modified", "lastmodified",
        "created_at", "createdat", "created_date", "createddate",
        "creation_date", "creationdate", "created", "createdon",
        "entry_date", "entrydate", "inserted_at", "insertedat",
        "upload_date", "uploaddate", "added_on", "addedon", "timestamp",
    )
}


def _format_display_date(value) -> str:
    """Turn a date/datetime into a plain date for display; leave dates as-is."""
    text_value = str(value or "").strip()
    if not text_value or _is_date(text_value):
        return text_value
    for fmt in (
        "%Y-%m-%d %H:%M:%S.%f",
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%dT%H:%M:%S.%f",
        "%Y-%m-%dT%H:%M:%S",
        "%d-%m-%Y %H:%M:%S",
        "%d/%m/%Y %H:%M:%S",
    ):
        try:
            return datetime.strptime(text_value, fmt).strftime("%d-%m-%Y")
        except ValueError:
            continue
    try:
        return datetime.fromisoformat(text_value.replace("Z", "+00:00")).strftime("%d-%m-%Y")
    except ValueError:
        return text_value


def _find_modify_date(record: dict, mapple: dict) -> str:
    for source in (record, mapple):
        if not source:
            continue
        # direct/common keys first
        for key in ("modify_date", "ModifyDate", "modifyDate", "modified_date", "ModifiedDate",
                    "updated_date", "UpdatedDate", "mod_date", "ModDate", "created_at",
                    "created_date", "CreatedDate", "creation_date", "CreationDate",
                    "updated_at", "UpdatedAt", "entry_date", "EntryDate",
                    "inserted_at", "upload_date", "added_on"):
            value = str(source.get(key) or "").strip()
            if value:
                return value
        # case-insensitive scan for any modify/update/entry-like date key
        for key, raw in source.items():
            if raw is None:
                continue
            k = _date_key(key)
            if (
                k in ENTRY_DATE_KEYS
                or ("modif" in k and "date" in k)
                or (k.startswith("mod") and "date" in k)
                or ("creat" in k and ("date" in k or k.endswith("at")))
                or ("entry" in k and "date" in k)
            ):
                value = str(raw).strip()
                if value:
                    return value
    return ""


def _find_price(record: dict, mapple: dict) -> str:
    def fmt(v: str) -> str:
        v = str(v or "").strip()
        if not v:
            return ""
        if "₹" in v:
            m = re.search(r"₹\s*[0-9,]+(?:\.\d+)?", v)
            return m.group(0).replace(" ", "") if m else v
        if re.match(r"^[0-9,]+(?:\.\d{1,2})?$", v):
            return f"₹{v}"
        return v

    # 1) explicit named keys
    for source in (record, mapple):
        if not source:
            continue
        for key in ("price", "Price", "amount", "Amount", "premium", "Premium",
                    "plan_price", "PlanPrice", "buyback_price", "BuyBackPrice"):
            value = str(source.get(key) or "").strip()
            if value:
                return fmt(value)
        for key, raw in source.items():
            if raw is None:
                continue
            k = str(key).strip().lower()
            if "price" in k or "amount" in k:
                value = str(raw).strip()
                if value and not _is_imei_fallback(value):
                    return fmt(value)

    # 2) composite/text values that explicitly label price (record fields + mapple text fields)
    def iter_text_values():
        for _, value in _field_items(record):
            if value:
                yield value
        for source in (record, mapple):
            if not source:
                continue
            for key, raw in source.items():
                if raw is None:
                    continue
                if str(key).startswith("Field"):
                    continue
                value = str(raw).strip()
                if value:
                    yield value

    for value in iter_text_values():
        if len(value) < 3:
            continue
        m = re.search(r"(?:Price|Amount|Premium)\s*[:\-]?\s*(₹\s*[0-9,]+|[0-9,]{2,7})", value, re.I)
        if m:
            return fmt(m.group(1))
        if "₹" in value:
            m2 = re.search(r"₹\s*[0-9,]+(?:\.\d+)?", value)
            if m2:
                return m2.group(0).replace(" ", "")

    # 3) mapple extra columns (common place for amounts/prices), prefer later extras
    for key in ("extra_column12", "extra_column11", "extra_column10", "extra_column9",
                "extra_column8", "extra_column7", "extra_column4"):
        value = str(mapple.get(key) or "").strip()
        if value and re.match(r"^[0-9,]{3,7}(?:\.\d{1,2})?$", value):
            return fmt(value)

    # 4) standalone reasonable amount from record fields (avoid phone/imei/quotation-like IDs)
    candidates = []
    for idx, value in _field_items(record):
        if not value:
            continue
        if not re.match(r"^[0-9,]{3,7}(?:\.\d{1,2})?$", value):
            continue
        digits = re.sub(r"\D", "", value)
        if len(digits) == 10 or _is_imei_fallback(digits):
            continue
        if _is_quotation(value):
            continue
        # prefer mid-sized amounts (prices) over tiny/huge numbers
        score = 0
        if 3 <= len(digits) <= 6:
            score += 3
        if idx >= 15:
            score += 1
        candidates.append((score, idx, value))
    if candidates:
        candidates.sort(key=lambda x: (-x[0], x[1]))
        return fmt(candidates[0][2])

    return ""


def _record_values(name: str, record: dict, mapple: dict) -> dict:
    def pick(*numbers) -> str:
        for number in numbers:
            value = str(record.get(f"Field{number}") or "").strip()
            if value:
                return value
        return ""

    phone = _first(_phone_digits(pick(1)) or pick(1), mapple.get("phone_number"))
    email = _first(_find(record, _is_email), mapple.get("email"))
    device = _first(_find_device(record), mapple.get("extra_column5"))
    store = _first(_find(record, _is_store), mapple.get("address1"))
    purchase_date = _first(_find_purchase_date(record), mapple.get("extra_column6"))

    quotation = ""
    for number in (20, 18):
        value = str(record.get(f"Field{number}") or "").strip()
        if value and _is_quotation(value):
            quotation = value
            break
    quotation = _first(quotation, _find(record, _is_quotation), mapple.get("extra_column2"))

    imei = _first(
        _find(record, _is_imei),
        _find(record, lambda v: _is_imei_fallback(v) and v != quotation),
        mapple.get("extra_column3"),
    )

    if name == "MAPLEBB0":
        # Most MapleBB0 uploads keep the name in F4 (first) + F5 (last),
        # some use F2 for the full name.
        first = pick(4)
        last = pick(5)
        if first and not _is_email(first) and not _is_store(first) and not _is_store(last):
            customer_name = _join_name(first, last)
        else:
            customer_name = pick(2)
        customer_name = _first(customer_name, mapple.get("title"))

        # Some uploads carry no purchase date at all. Fall back to the
        # modification/upload (entry) timestamp instead of showing it blank.
        modify_date = _first(
            _format_display_date(purchase_date),
            _format_display_date(_find_modify_date(record, mapple)),
        )
        price = _first(_find_price(record, mapple), quotation)

        return {
            "Contact No": phone,
            "Customer Name": customer_name,
            "Price": price,
            "Email Address": email,
            "Device Model": device,
            "Purchase Date": modify_date,
            "IMEI": imei,
            "Store": store,
        }

    # Older Maple000 uploads (the ones that use F18/F20 for the quotation)
    # do not carry the EUP columns at all; F13 there is a PIN code.
    eup_layout = bool(pick(16) or pick(17))

    def numeric(number) -> str:
        value = pick(number)
        return value if re.match(r"^\d+(\.\d+)?$", value) else ""

    return {
        "Customer Number": phone,
        "Customer Name": _first(
            pick(2),
            _join_name(pick(3), pick(5)),
            mapple.get("title"),
            _join_name(mapple.get("first_name"), mapple.get("last_name")),
        ),
        "Device Modle": device,
        "Purchase Date": purchase_date,
        "IMEI": imei,
        "1st Year Buy Back Value": _first(
            numeric(13) if eup_layout else "", mapple.get("postal_code")
        ),
        "2nd Year Buy Back Value": _first(
            numeric(15) if eup_layout else "", mapple.get("gender")
        ),
        "Store": store,
        "Elegibility Period": _first(
            pick(16) if eup_layout else "", mapple.get("date_of_birth")
        ),
        "Current EUP Status": _first(
            pick(18) if eup_layout else "", mapple.get("security_phrase")
        ),
    }


@router.get("/mapple_customer_details")
def get_mapple_customer_details(
    ClientId: int = Query(...),
    CampaignId: int = Query(...),
    DataId: Optional[int] = Query(None),
    phone: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    campaign = db.execute(
        text("SELECT CampaignName FROM ob_campaign WHERE id = :cid LIMIT 1"),
        {"cid": CampaignId},
    ).mappings().first()

    campaign_key = _normalise_campaign_key(
        campaign["CampaignName"] if campaign else None
    )
    labels = MAPLE_DETAIL_LABELS.get(campaign_key)
    if not labels:
        return {"campaign": None, "matched": False, "fields": []}

    record = {}
    if DataId:
        row = db.execute(
            text("""
                SELECT ocd.*
                FROM ob_campaign_data ocd
                LEFT JOIN ob_allocation_name a ON a.id = ocd.AllocationId
                WHERE ocd.id = :data_id
                  AND (a.CampaignId = :campaign_id OR a.id IS NULL)
                LIMIT 1
            """),
            {"data_id": DataId, "campaign_id": CampaignId},
        ).mappings().first()
        if row:
            record = dict(row)

    digits = _phone_digits(record.get("Field1") or phone)
    mapple = {}
    if digits:
        row = db.execute(
            text("""
                SELECT *
                FROM mapple_data
                WHERE client_id = :client_id
                  AND RIGHT(REPLACE(REPLACE(REPLACE(phone_number, ' ', ''), '-', ''), '+', ''), 10) = :digits
                ORDER BY (campaign_id = :campaign_id) DESC, id DESC
                LIMIT 1
            """),
            {"client_id": ClientId, "campaign_id": CampaignId, "digits": digits},
        ).mappings().first()
        if row:
            mapple = dict(row)

    values = _record_values(campaign_key, record, mapple)

    return {
        "campaign": campaign["CampaignName"],
        "matched": bool(record or mapple),
        "fields": [{"label": label, "value": values.get(label, "")} for label in labels],
    }


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
    ClientId: Optional[int] = Query(None),
    CampaignId: Optional[str] = Query(None),
    phone: Optional[str] = Query(None),
    AgentId: Optional[int] = Query(None),
    source_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    if not source_id and not CampaignId:
        raise HTTPException(status_code=422, detail="CampaignId is required when source_id is not provided")

    if source_id:
        query = text("""
            SELECT ocd.*,
                   a.CampaignId AS _resolved_campaign_id,
                   a.ClientId AS _resolved_client_id
            FROM ob_campaign_data ocd
            LEFT JOIN ob_allocation_name a ON a.id = ocd.AllocationId
            WHERE ocd.id = :source_id
        """)
        row = db.execute(
            query,
            {"source_id": source_id},
        ).mappings().first()
        if not row:
            raise HTTPException(status_code=404, detail="No data found for source id")
        record = dict(row)
        resolved_campaign_id = record.pop("_resolved_campaign_id", None)
        resolved_client_id = record.pop("_resolved_client_id", None)
        return {
            "AllocationId": record["AllocationId"],
            "record": record,
            "CampaignId": resolved_campaign_id,
            "ClientId": resolved_client_id or ClientId,
        }

    # Resolve campaign by id or by CampaignName, and derive its ClientId
    campaign_ref = str(CampaignId).strip()
    campaign_row = None

    if campaign_ref.isdigit():
        campaign_row = db.execute(
            text("SELECT id, ClientId FROM ob_campaign WHERE id = :cid LIMIT 1"),
            {"cid": int(campaign_ref)},
        ).mappings().first()

    if not campaign_row:
        campaign_row = db.execute(
            text("""
                SELECT id, ClientId
                FROM ob_campaign
                WHERE LOWER(TRIM(CampaignName)) = LOWER(:name)
                   OR LOWER(REPLACE(TRIM(CampaignName), '_', ' ')) = LOWER(REPLACE(:name, '_', ' '))
                   AND CampaignStatus = 'A'
                ORDER BY id
                LIMIT 1
            """),
            {"name": campaign_ref},
        ).mappings().first()

    if campaign_row:
        campaign_id = campaign_row["id"]
        campaign_client_id = campaign_row["ClientId"]
    else:
        campaign_id = int(campaign_ref) if campaign_ref.isdigit() else None
        campaign_client_id = None

    if campaign_id is None:
        raise HTTPException(status_code=404, detail="No data found for campaign")

    phone_digits = _phone_digits(phone)
    if not phone_digits:
        raise HTTPException(status_code=422, detail="A valid phone number is required")

    # Match on the normalised last 10 digits so stored values with a 91/+91
    # prefix, spaces, dashes or brackets still resolve to the dialled number.
    query = text("""
        SELECT ocd.*
        FROM ob_campaign_data ocd
        JOIN ob_allocation_name a ON a.id = ocd.AllocationId
        WHERE a.CampaignId = :campaign_id
          AND RIGHT(
                REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                  ocd.Field1, ' ', ''), '-', ''), '+', ''), '(', ''), ')', ''),
                10
              ) = :digits
        ORDER BY ocd.id DESC
        LIMIT 5
    """)
    # query = text("""
    #     SELECT ocd.*
    #     FROM ob_campaign_data ocd
    #     JOIN ob_allocation_name a ON a.id = ocd.AllocationId
    #     WHERE a.CampaignId = :campaign_id
    #       AND (ocd.AgentId IS NULL OR ocd.AgentId = :agent_id)
    #     ORDER BY ocd.id DESC
    #     LIMIT 5000
    # """)
    rows = db.execute(
        query,
        {
            "campaign_id": campaign_id,
            "digits": phone_digits,
        },
    ).mappings().all()

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
                return {
                    "AllocationId": record["AllocationId"],
                    "record": record,
                    "CampaignId": campaign_id,
                    "ClientId": campaign_client_id or ClientId,
                }

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