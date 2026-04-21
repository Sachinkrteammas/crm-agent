from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime
from database import get_db
from typing import Dict

router = APIRouter()

@router.get("/clients-rights")
def get_all_clients_rights(db: Session = Depends(get_db)):
    """
    Fetch all companies (company_id, company_name) as dictionary list
    """
    query = text("SELECT company_id, company_name FROM registration_master where status = 'A' ")
    result = db.execute(query).fetchall()

    return [{"company_id": row[0], "company_name": row[1]} for row in result]


@router.get("/agent-clients-rights")
def get_agent_clients_rights(
    agent_id: int,
    db: Session = Depends(get_db)
):
    # 1️⃣ Get ClientRights
    rights_query = text("""
        SELECT ClientRights 
        FROM agent_master 
        WHERE id = :agent_id
    """)
    result = db.execute(rights_query, {"agent_id": agent_id}).fetchone()

    if not result or not result[0]:
        raise HTTPException(status_code=404, detail="No client rights found")

    # 2️⃣ Convert "13,103,241..." → list
    client_ids = [int(x.strip()) for x in result[0].split(",") if x.strip()]

    if not client_ids:
        return []

    # 3️⃣ Fetch matching companies
    company_query = text(f"""
        SELECT company_id, company_name
        FROM registration_master
        WHERE status = 'A'
        AND company_id IN :client_ids
    """)

    companies = db.execute(company_query, {"client_ids": tuple(client_ids)}).fetchall()

    return [
        {"company_id": row[0], "company_name": row[1]}
        for row in companies
    ]


@router.get("/clients-rights/{company_id}")
def get_client_right(company_id: int, db: Session = Depends(get_db)):
    """
    Fetch single company by company_id as dictionary
    """
    query = text(
        "SELECT company_id, company_name FROM registration_master WHERE company_id = :company_id"
    )
    result = db.execute(query, {"company_id": company_id}).fetchone()

    if not result:
        raise HTTPException(status_code=404, detail="Company not found")

    return {"company_id": result[0], "company_name": result[1]}


@router.post("/save")
def create_agent(agent: dict, db: Session = Depends(get_db)):
    try:
        query = text("""
            INSERT INTO agent_master
            (displayname, username, password, processname, workmode, dateOfBirth, 
             dateofjoining, agentType, address, state, city, gender, versant, 
             email, contactNo, languages, ClientRights, createdate)
            VALUES 
            (:displayname, :username, :password, :processname, :workmode, :dateOfBirth,
             :dateofjoining, :agentType, :address, :state, :city, :gender, :versant, 
             :email, :contactNo, :languages, :ClientRights, :createdate)
        """)

        db.execute(query, {
            **agent,
            "languages": ",".join(agent.get("languages", [])),
            "ClientRights": ",".join(agent.get("ClientRights", [])),
            "createdate": datetime.now()
        })
        db.commit()
        return {"status": "success", "agent": agent}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/list")
def list_agents(db: Session = Depends(get_db)):
    query = text("SELECT * FROM agent_master ORDER BY createdate DESC")
    result = db.execute(query).fetchall()

    agents = []
    for row in result:
        agents.append(dict(row._mapping))  # convert Row -> dict
    return agents


@router.put("/{agent_id}")
def update_agent(agent_id: int, agent: dict, db: Session = Depends(get_db)):
    try:
        query = text("""
            UPDATE agent_master
            SET displayname=:displayname, username=:username, password=:password,
                processname=:processname, workmode=:workmode, dateOfBirth=:dateOfBirth,
                dateofjoining=:dateofjoining, agentType=:agentType, address=:address,
                state=:state, city=:city, gender=:gender, versant=:versant,
                email=:email, contactNo=:contactNo,
                languages=:languages, ClientRights=:ClientRights
            WHERE id=:id
        """)

        db.execute(query, {
            **agent,
            "id": agent_id,
            "languages": ",".join(agent.get("languages", [])),
            "ClientRights": ",".join(agent.get("ClientRights", [])),
        })
        db.commit()
        return {"status": "success", "agent_id": agent_id, "agent": agent}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{agent_id}")
def delete_agent(agent_id: int, db: Session = Depends(get_db)):
    try:
        query = text("DELETE FROM agent_master WHERE id = :id")
        result = db.execute(query, {"id": agent_id})

        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Agent not found")

        db.commit()
        return {"status": "success", "deleted_id": agent_id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))