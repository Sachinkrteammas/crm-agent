from typing import List

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from database import get_db, get_db3, get_db4
from schemas import LoginRequest, LoginResponse, CallMasterRecord
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from auth_utils import get_current_user
from sqlalchemy import text


router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # 🔹 Try registration_master (login with email)
    query = text("""
        SELECT email, password, company_id, auth_person
        FROM registration_master
        WHERE email = :email
    """)
    result = db.execute(query, {"email": request.email}).mappings().fetchone()
    user_type = "registration"

    # 🔹 If not found, try agent_master (login with username)
    if not result:
        query = text("""
            SELECT id,username, password, displayname
            FROM agent_master
            WHERE username = :username AND status = 'A'
        """)
        result = db.execute(query, {"username": request.email}).mappings().fetchone()
        user_type = "agent"

    # 🔹 Invalid user
    if not result or not verify_password(request.password, result["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # 🔹 Use email for registration, username for agent
    identifier = result["email"] if user_type == "registration" else result["username"]
    token = create_access_token({"sub": identifier, "role": user_type})

    # 🔹 Build common response
    response_data = {
        "message": "Login successful",
        "access_token": token,
        "role": user_type
    }

    # 🔹 Add user-specific fields
    if user_type == "registration":
        response_data["company_id"] = result["company_id"]
        response_data["auth_person"] = result["auth_person"]
        response_data["displayname"] = result["auth_person"]  # ✅ alias to displayname
        response_data["username"] = result["email"]
    elif user_type == "agent":
        response_data["id"] = result["id"]
        response_data["displayname"] = result["displayname"]
        response_data["username"] = result["username"]

    return response_data

@router.get("/auth-person")
def get_auth_person(client_id: int, db: Session = Depends(get_db)):
    query = text("""
        SELECT auth_person
        FROM registration_master
        WHERE company_id = :client_id
    """)
    result = db.execute(query, {"client_id": client_id}).mappings().fetchone()

    if not result:
        raise HTTPException(status_code=404, detail="User not found")

    return {"auth_person": result["auth_person"] or ""}




@router.get("/call-master/", response_model=List[CallMasterRecord])
def get_calls_by_client(client_id: int = Query(...), db: Session = Depends(get_db)):
    try:
        query = text("SELECT * FROM call_master WHERE client_id = :client_id LIMIT 3")
        result = db.execute(query, {"client_id": client_id}).mappings().fetchall()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/profile")
def get_profile(current_user: str = Depends(get_current_user)):
    return {"message": f"Authenticated as {current_user}"}
