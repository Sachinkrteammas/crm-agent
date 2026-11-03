import requests
import time

# Allowed Vendor IDs
ALLOWED_VENDOR_IDS = ["6904381", "5232717", "4845124"]

# External API Config
BASE_URL = "http://15.206.232.1:3000/api/v1"
SUPPORT_USERNAME = "test_support"
SUPPORT_PASSWORD = "Support@123"

# Token cache
_token_cache = {
    "access_token": None,
    "expires_at": 0
}


def get_access_token():
    """Fetch new token or reuse existing if not expired"""
    current_time = time.time()

    if _token_cache["access_token"] and _token_cache["expires_at"] > current_time:
        return _token_cache["access_token"]

    try:
        response = requests.post(
            f"{BASE_URL}/support/login",
            json={"username": SUPPORT_USERNAME, "password": SUPPORT_PASSWORD},
            timeout=10
        )
        response.raise_for_status()
        data = response.json()

        if data.get("data") and data["data"].get("access_token"):
            token = data["data"]["access_token"]
            _token_cache["access_token"] = token
            _token_cache["expires_at"] = current_time + 3500  # ~58 mins
            return token
        else:
            raise Exception("Token not found in response")
    except Exception as e:
        print(f"Login Error: {e}")
        return None


def search_customer(phone_number):
    """Search customer by phone number (handles 10/12 digit formats)"""
    token = get_access_token()
    if not token:
        return None

    headers = {"Authorization": f"Bearer {token}"}

    try:
        clean_phone = "".join(filter(str.isdigit, str(phone_number)))
        search_phone = clean_phone[-10:] if len(clean_phone) > 10 else clean_phone

        response = requests.get(
            f"{BASE_URL}/support/search",
            params={"search": search_phone},
            headers=headers,
            timeout=10
        )
        response.raise_for_status()
        data = response.json()

        if data.get("status") == "success" and data.get("data"):
            customers = data["data"]

            for cust in customers:
                cust_mobile = "".join(filter(str.isdigit, str(cust.get("user_mobile", ""))))
                if cust_mobile[-10:] == search_phone:
                    return cust

            return customers[0]
        return None
    except Exception as e:
        print(f"Search Error: {e}")
        return None


def get_customer_bookings(user_id):
    """Fetch bookings for a given user_id"""
    token = get_access_token()
    if not token:
        return []

    headers = {"Authorization": f"Bearer {token}"}

    try:
        response = requests.get(
            f"{BASE_URL}/support/get-bookings",
            params={"user_id": user_id},
            headers=headers,
            timeout=10
        )
        response.raise_for_status()
        data = response.json()

        if data.get("data") and len(data["data"]) > 0:
            bookings = data["data"][0].get("bookings", [])

            cleaned_bookings = []
            for b in bookings:
                # Extract PNR(s)
                pnrs_raw = b.get("pnrs") or []
                pnr_list = []
                if isinstance(pnrs_raw, list):
                    for p in pnrs_raw:
                        if isinstance(p, dict):
                            pnr_list.append(p.get("pnr"))
                        elif isinstance(p, str):
                            pnr_list.append(p)
                pnr_str = ", ".join([str(x) for x in pnr_list if x])

                # Extract booking_status and normalize
                raw_status = (
                    b.get("booking_status")
                    or b.get("status")
                    or ""
                ).upper().strip()

                # Consider TICKETED and CONFIRMED as SUCCESSFUL
                if raw_status in ("TICKETED", "CONFIRMED", "SUCCESS", "SUCCESSFUL"):
                    display_status = "SUCCESSFUL"
                elif raw_status in ("CANCELLED", "CANCELED"):
                    display_status = "CANCELLED"
                elif raw_status in ("UPCOMING",):
                    display_status = "UPCOMING"
                elif raw_status in ("FAILED", "FAILURE"):
                    display_status = "FAILED"
                elif raw_status in ("PENDING",):
                    display_status = "PENDING"
                else:
                    display_status = raw_status or "-"

                cleaned_bookings.append({
                    "booking_id": b.get("booking_id"),
                    "booking_type": b.get("booking_type"),
                    "module": b.get("module") or "flight",
                    "status": display_status,
                    "raw_status": raw_status,
                    "from_city": b.get("from_city"),
                    "to_city": b.get("to_city"),
                    "departure_date": b.get("departure_date"),
                    "departure_time": b.get("departure_time"),
                    "total_amount": b.get("total_amount"),
                    "currency": b.get("currency"),
                    "flight_no": b.get("flight_no"),
                    "pnr": pnr_str,
                    "pnrs": pnr_list,
                    "passenger_summary": b.get("passenger_summary"),
                    "passengers": b.get("passengers"),
                })
            return cleaned_bookings
        return []
    except Exception as e:
        print(f"Booking Error: {e}")
        return []