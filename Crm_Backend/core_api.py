# Crm_Backend/core_api.py

from fastapi import APIRouter, Query
from sqlalchemy import text
from database import get_engine

# Import integration service
from customer_integration import (
    ALLOWED_VENDOR_IDS,
    search_customer,
    search_customer_by_query,
    get_customer_bookings,
)

router = APIRouter(tags=["core_api"])

def fetch_categories(query: str, params: dict):
    engine = get_engine()
    with engine.connect() as conn:
        result = conn.execute(text(query), params).mappings()
        return [{"id": row["id"], "ecrName": row["ecrName"]} for row in result]

@router.get("/categories/level1")
def get_level1(client_id: int = 348):
    query = "SELECT id, ecrName FROM ecr_master WHERE Label = 1 AND Client = :client_id ORDER BY ecrName"
    return fetch_categories(query, {"client_id": client_id})

@router.get("/categories/level2/{parent_id}")
def get_level2(parent_id: int, client_id: int = 348):
    query = "SELECT id, ecrName FROM ecr_master WHERE Label = 2 AND parent_id = :parent_id AND Client = :client_id ORDER BY ecrName"
    return fetch_categories(query, {"parent_id": parent_id, "client_id": client_id})

@router.get("/categories/level3/{parent_id}")
def get_level3(parent_id: int, client_id: int = 348):
    query = "SELECT id, ecrName FROM ecr_master WHERE Label = 3 AND parent_id = :parent_id AND Client = :client_id ORDER BY ecrName"
    return fetch_categories(query, {"parent_id": parent_id, "client_id": client_id})

@router.get("/categories/level4/{parent_id}")
def get_level4(parent_id: int, client_id: int = 348):
    query = "SELECT id, ecrName FROM ecr_master WHERE Label = 4 AND parent_id = :parent_id AND Client = :client_id ORDER BY ecrName"
    return fetch_categories(query, {"parent_id": parent_id, "client_id": client_id})

@router.get("/categories/level5/{parent_id}")
def get_level5(parent_id: int, client_id: int = 348):
    query = "SELECT id, ecrName FROM ecr_master WHERE Label = 5 AND parent_id = :parent_id AND Client = :client_id ORDER BY ecrName"
    return fetch_categories(query, {"parent_id": parent_id, "client_id": client_id})


def _build_customer_response(customer, bookings):
    user_details = customer.get("userDetails", {}) or {}
    return {
        "status": "success",
        "customer": {
            "first_name": customer.get("first_name"),
            "last_name": customer.get("last_name"),
            # Email fallback: agar email null hai toh communication_email use karein
            "email": customer.get("email") or user_details.get("communication_email"),
            "phone": customer.get("user_mobile"),
            "dob": customer.get("dob"),
            "gender": customer.get("gender"),
            "address": user_details.get("address"),
            "city": user_details.get("city"),
            "state": user_details.get("state"),
            "pincode": user_details.get("pincode"),
        },
        "bookings": bookings,
    }


# ==========================================
# INTEGRATION ENDPOINTS (allowed vendors only)
# ==========================================
@router.get("/customer-integration")
def customer_integration(
    phone_number: str = Query(...),
    vendor_id: str = Query(...),
    inOUT: str = Query(...),
):
    # 1. Validate Conditions
    if inOUT.upper() != "IN":
        return {"status": "skipped", "message": "Not an inbound call"}

    if vendor_id not in ALLOWED_VENDOR_IDS:
        return {"status": "skipped", "message": "Vendor not allowed"}

    # 2. Search Customer (by caller number)
    customer = search_customer(phone_number)

    if not customer:
        return {"status": "not_found", "message": "Customer not found in Support System"}

    # 3. Get Bookings
    user_id = customer.get("id")
    bookings = get_customer_bookings(user_id) if user_id else []

    # 4. Return Clean Data
    return _build_customer_response(customer, bookings)


@router.get("/customer-integration/manual-search")
def customer_integration_manual_search(
    query: str = Query(..., min_length=1),
    vendor_id: str = Query(...),
):
    """Manual search for allowed vendors by RMN / Email / Booking ID etc."""
    if vendor_id not in ALLOWED_VENDOR_IDS:
        return {"status": "skipped", "message": "Vendor not allowed"}

    q = str(query).strip()
    if not q:
        return {"status": "not_found", "message": "Search value is required"}

    digits_only = "".join(filter(str.isdigit, q))
    is_phone = ("@" not in q) and len(digits_only) >= 10 and len(digits_only) == len(q.replace("+", "").replace(" ", "").replace("-", ""))

    customer = search_customer_by_query(q, is_phone=is_phone)
    if not customer:
        return {"status": "not_found", "message": "Customer not found in Support System"}

    user_id = customer.get("id")
    bookings = get_customer_bookings(user_id) if user_id else []
    return _build_customer_response(customer, bookings)