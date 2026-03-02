# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
# from typing import Optional
# from database import get_engine4

# router = APIRouter()

# # ✅ Request Body for create/edit
# class PlanCreateRequest(BaseModel):
#     planName: str
#     PlanType: Optional[str] = None
#     setupCost: Optional[float] = 0.0
#     rentalAmount: Optional[float] = 0.0
#     balance: Optional[float] = 0.0
#     periodType: Optional[str] = None
#     creditValue: Optional[float] = 0.0
#     creditValuePerMode: Optional[float] = 0.0
#     inboundChargeDay: Optional[float] = 0.0
#     inboundChargeNight: Optional[float] = 0.0
#     outboundCallCharge: Optional[float] = 0.0
#     missCallCharge: Optional[float] = 0.0
#     vfoCharge: Optional[float] = 0.0
#     smsCharge: Optional[float] = 0.0
#     emailCharge: Optional[float] = 0.0
#     noOfUsers: Optional[int] = 0
#     chargePerExtraUser: Optional[float] = 0.0
#     ivrCharge: Optional[float] = 0.0
#     ibPulse: Optional[int] = 0
#     pulseDay: Optional[str] = None
#     ratePerPulseDay: Optional[float] = 0.0
#     pulseNight: Optional[str] = None
#     ratePerPulseNight: Optional[float] = 0.0
#     multiIBCharges: Optional[float] = 0.0
#     multiOBCharges: Optional[float] = 0.0
#     multiLiveChat: Optional[float] = 0.0
#     whatsappMessageCharge: Optional[float] = 0.0
#     pulseIBMulti: Optional[int] = 0
#     ratePerPulseIBMulti: Optional[float] = 0.0
#     pulseOBMulti: Optional[int] = 0
#     ratePerPulseOBMulti: Optional[float] = 0.0
#     firstMinute: Optional[int] = 0
#     ibCallCharge: Optional[float] = 0.0
#     obCallCharge: Optional[float] = 0.0

# # ✅ CREATE PLAN
# # @router.post("/create_plan")
# # def create_plan(plan: PlanCreateRequest):

# @router.post("/create_plan")
# def create_plan(plan: PlanCreateRequest):
#     print("✅ CREATE PLAN Payload Received:", plan.dict())  # DEBUG: prints payload
#     conn = None
#     cursor = None
#     try:
#         conn = get_engine4().raw_connection()
#         cursor = conn.cursor()
#         sql = """
#         INSERT INTO plan_master (
#             PlanName, PlanType, SetupCost, RentalAmount, Balance, PeriodType, CreditValue, CreditValuePerMode,
#             InboundCallCharge, InboundCallChargeNight, OutboundCallCharge,
#             MissCallCharge, VFOCallCharge, SMSCharge, EmailCharge,
#             NoOfFreeUser, ChargePerExtraUser, IVR_Charge,
#             ib_pulse_sec, pulse_day_shift, rate_per_pulse_day_shift,
#             pulse_night_shift, rate_per_pulse_night_shift,
#             MultiIBCharges, MultiOBCharges, MultiLiveChat, whatsapp_message_charge,
#             pulse_ib_multi, rate_per_pulse_ib_multi,
#             pulse_ob_multi, rate_per_pulse_ob_multi,
#             first_minute, IB_Call_Charge, OB_Call_Charge, createdate
#         ) VALUES (
#             %s,%s,%s,%s,%s,%s,%s,%s,
#             %s,%s,%s,
#             %s,%s,%s,%s,
#             %s,%s,%s,
#             %s,%s,%s,
#             %s,%s,
#             %s,%s,%s,%s,
#             %s,%s,
#             %s,%s,
#             %s,%s,%s, NOW()
#         )
#         """
#         values = (
#             plan.planName, plan.PlanType, plan.setupCost, plan.rentalAmount, plan.balance,
#             plan.periodType, plan.creditValue, plan.creditValuePerMode,
#             plan.inboundChargeDay, plan.inboundChargeNight, plan.outboundCallCharge,
#             plan.missCallCharge, plan.vfoCharge, plan.smsCharge, plan.emailCharge,
#             plan.noOfUsers, plan.chargePerExtraUser, plan.ivrCharge,
#             plan.ibPulse, plan.pulseDay, plan.ratePerPulseDay,
#             plan.pulseNight, plan.ratePerPulseNight,
#             plan.multiIBCharges, plan.multiOBCharges, plan.multiLiveChat, plan.whatsappMessageCharge,
#             plan.pulseIBMulti, plan.ratePerPulseIBMulti,
#             plan.pulseOBMulti, plan.ratePerPulseOBMulti,
#             plan.firstMinute, plan.ibCallCharge, plan.obCallCharge
#         )
#         cursor.execute(sql, values)
#         conn.commit()
#         print("✅ Plan inserted successfully, ID:", cursor.lastrowid)  # DEBUG
#         return {"status": "success", "message": "Plan created successfully!", "plan_id": cursor.lastrowid}
#     except Exception as e:
#         print("❌ DB Error:", str(e))  # DEBUG
#         raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")
#     finally:
#         if cursor: cursor.close()
#         if conn: conn.close()


#     conn = None
#     cursor = None
#     try:
#         conn = get_engine4().raw_connection()
#         cursor = conn.cursor()
#         sql = """
#         INSERT INTO plan_master (
#             PlanName, PlanType, SetupCost, RentalAmount, Balance, PeriodType, CreditValue, CreditValuePerMode,
#             InboundCallCharge, InboundCallChargeNight, OutboundCallCharge,
#             MissCallCharge, VFOCallCharge, SMSCharge, EmailCharge,
#             NoOfFreeUser, ChargePerExtraUser, IVR_Charge,
#             ib_pulse_sec, pulse_day_shift, rate_per_pulse_day_shift,
#             pulse_night_shift, rate_per_pulse_night_shift,
#             MultiIBCharges, MultiOBCharges, MultiLiveChat, whatsapp_message_charge,
#             pulse_ib_multi, rate_per_pulse_ib_multi,
#             pulse_ob_multi, rate_per_pulse_ob_multi,
#             first_minute, IB_Call_Charge, OB_Call_Charge, createdate
#         ) VALUES (
#             %s,%s,%s,%s,%s,%s,%s,%s,
#             %s,%s,%s,
#             %s,%s,%s,%s,
#             %s,%s,%s,
#             %s,%s,%s,
#             %s,%s,
#             %s,%s,%s,%s,
#             %s,%s,
#             %s,%s,
#             %s,%s,%s, NOW()
#         )
#         """
#         values = (
#             plan.planName, plan.PlanType, plan.setupCost, plan.rentalAmount, plan.balance,
#             plan.periodType, plan.creditValue, plan.creditValuePerMode,
#             plan.inboundChargeDay, plan.inboundChargeNight, plan.outboundCallCharge,
#             plan.missCallCharge, plan.vfoCharge, plan.smsCharge, plan.emailCharge,
#             plan.noOfUsers, plan.chargePerExtraUser, plan.ivrCharge,
#             plan.ibPulse, plan.pulseDay, plan.ratePerPulseDay,
#             plan.pulseNight, plan.ratePerPulseNight,
#             plan.multiIBCharges, plan.multiOBCharges, plan.multiLiveChat, plan.whatsappMessageCharge,
#             plan.pulseIBMulti, plan.ratePerPulseIBMulti,
#             plan.pulseOBMulti, plan.ratePerPulseOBMulti,
#             plan.firstMinute, plan.ibCallCharge, plan.obCallCharge
#         )
#         cursor.execute(sql, values)
#         conn.commit()
#         return {"status": "success", "message": "Plan created successfully!", "plan_id": cursor.lastrowid}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")
#     finally:
#         if cursor: cursor.close()
#         if conn: conn.close()

# # ✅ GET ALL PLANS
# @router.get("/plans")
# def get_plans():
#     conn = None
#     cursor = None
#     try:
#         conn = get_engine4().raw_connection()
#         cursor = conn.cursor()
#         cursor.execute("SELECT * FROM plan_master ORDER BY id DESC")
#         rows = cursor.fetchall()
#         columns = [col[0] for col in cursor.description]
#         plans = [dict(zip(columns, row)) for row in rows]
#         return {"status": "success", "plans": plans}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")
#     finally:
#         if cursor: cursor.close()
#         if conn: conn.close()

# # ✅ GET PLAN BY ID
# @router.get("/plan/{plan_id}")
# def get_plan(plan_id: int):
#     conn = None
#     cursor = None
#     try:
#         conn = get_engine4().raw_connection()
#         cursor = conn.cursor()
#         cursor.execute("SELECT * FROM plan_master WHERE id=%s", (plan_id,))
#         row = cursor.fetchone()
#         if not row:
#             raise HTTPException(status_code=404, detail="Plan not found")
#         columns = [col[0] for col in cursor.description]
#         plan = dict(zip(columns, row))
#         return {"status": "success", "plan": plan}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")
#     finally:
#         if cursor: cursor.close()
#         if conn: conn.close()

# # ✅ UPDATE PLAN
# # @router.put("/plan/{plan_id}")
# # def update_plan(plan_id: int, plan: PlanCreateRequest):


# @router.put("/plan/{plan_id}")
# def update_plan(plan_id: int, plan: PlanCreateRequest):
#     print(f"✅ UPDATE PLAN Payload for ID {plan_id}:", plan.dict())  # DEBUG
#     conn = None
#     cursor = None
#     try:
#         conn = get_engine4().raw_connection()
#         cursor = conn.cursor()
#         sql = """
#         UPDATE plan_master SET
#             PlanName=%s, PlanType=%s, SetupCost=%s, RentalAmount=%s, Balance=%s,
#             PeriodType=%s, CreditValue=%s, CreditValuePerMode=%s,
#             InboundCallCharge=%s, InboundCallChargeNight=%s, OutboundCallCharge=%s,
#             MissCallCharge=%s, VFOCallCharge=%s, SMSCharge=%s, EmailCharge=%s,
#             NoOfFreeUser=%s, ChargePerExtraUser=%s, IVR_Charge=%s,
#             ib_pulse_sec=%s, pulse_day_shift=%s, rate_per_pulse_day_shift=%s,
#             pulse_night_shift=%s, rate_per_pulse_night_shift=%s,
#             MultiIBCharges=%s, MultiOBCharges=%s, MultiLiveChat=%s, whatsapp_message_charge=%s,
#             pulse_ib_multi=%s, rate_per_pulse_ib_multi=%s,
#             pulse_ob_multi=%s, rate_per_pulse_ob_multi=%s,
#             first_minute=%s, IB_Call_Charge=%s, OB_Call_Charge=%s
#         WHERE id=%s
#         """
#         values = (
#             plan.planName, plan.PlanType, plan.setupCost, plan.rentalAmount, plan.balance,
#             plan.periodType, plan.creditValue, plan.creditValuePerMode,
#             plan.inboundChargeDay, plan.inboundChargeNight, plan.outboundCallCharge,
#             plan.missCallCharge, plan.vfoCharge, plan.smsCharge, plan.emailCharge,
#             plan.noOfUsers, plan.chargePerExtraUser, plan.ivrCharge,
#             plan.ibPulse, plan.pulseDay, plan.ratePerPulseDay,
#             plan.pulseNight, plan.ratePerPulseNight,
#             plan.multiIBCharges, plan.multiOBCharges, plan.multiLiveChat, plan.whatsappMessageCharge,
#             plan.pulseIBMulti, plan.ratePerPulseIBMulti,
#             plan.pulseOBMulti, plan.ratePerPulseOBMulti,
#             plan.firstMinute, plan.ibCallCharge, plan.obCallCharge,
#             plan_id
#         )
#         cursor.execute(sql, values)
#         conn.commit()
#         print("✅ Rows updated:", cursor.rowcount)  # DEBUG
#         if cursor.rowcount == 0:
#             raise HTTPException(status_code=404, detail="Plan not found")
#         return {"status": "success", "message": "Plan updated successfully!"}
#     except Exception as e:
#         print("❌ DB Error:", str(e))  # DEBUG
#         raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")
#     finally:
#         if cursor: cursor.close()
#         if conn: conn.close()

#     conn = None
#     cursor = None
#     try:
#         conn = get_engine4().raw_connection()
#         cursor = conn.cursor()
#         sql = """
#         UPDATE plan_master SET
#             PlanName=%s, PlanType=%s, SetupCost=%s, RentalAmount=%s, Balance=%s,
#             PeriodType=%s, CreditValue=%s, CreditValuePerMode=%s,
#             InboundCallCharge=%s, InboundCallChargeNight=%s, OutboundCallCharge=%s,
#             MissCallCharge=%s, VFOCallCharge=%s, SMSCharge=%s, EmailCharge=%s,
#             NoOfFreeUser=%s, ChargePerExtraUser=%s, IVR_Charge=%s,
#             ib_pulse_sec=%s, pulse_day_shift=%s, rate_per_pulse_day_shift=%s,
#             pulse_night_shift=%s, rate_per_pulse_night_shift=%s,
#             MultiIBCharges=%s, MultiOBCharges=%s, MultiLiveChat=%s, whatsapp_message_charge=%s,
#             pulse_ib_multi=%s, rate_per_pulse_ib_multi=%s,
#             pulse_ob_multi=%s, rate_per_pulse_ob_multi=%s,
#             first_minute=%s, IB_Call_Charge=%s, OB_Call_Charge=%s
#         WHERE id=%s
#         """
#         values = (
#             plan.planName, plan.PlanType, plan.setupCost, plan.rentalAmount, plan.balance,
#             plan.periodType, plan.creditValue, plan.creditValuePerMode,
#             plan.inboundChargeDay, plan.inboundChargeNight, plan.outboundCallCharge,
#             plan.missCallCharge, plan.vfoCharge, plan.smsCharge, plan.emailCharge,
#             plan.noOfUsers, plan.chargePerExtraUser, plan.ivrCharge,
#             plan.ibPulse, plan.pulseDay, plan.ratePerPulseDay,
#             plan.pulseNight, plan.ratePerPulseNight,
#             plan.multiIBCharges, plan.multiOBCharges, plan.multiLiveChat, plan.whatsappMessageCharge,
#             plan.pulseIBMulti, plan.ratePerPulseIBMulti,
#             plan.pulseOBMulti, plan.ratePerPulseOBMulti,
#             plan.firstMinute, plan.ibCallCharge, plan.obCallCharge,
#             plan_id
#         )
#         cursor.execute(sql, values)
#         conn.commit()
#         if cursor.rowcount == 0:
#             raise HTTPException(status_code=404, detail="Plan not found")
#         return {"status": "success", "message": "Plan updated successfully!"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")
#     finally:
#         if cursor: cursor.close()
#         if conn: conn.close()

# # ✅ DELETE PLAN
# @router.delete("/plan/{plan_id}")
# def delete_plan(plan_id: int):
#     conn = None
#     cursor = None
#     try:
#         conn = get_engine4().raw_connection()
#         cursor = conn.cursor()
#         cursor.execute("DELETE FROM plan_master WHERE id=%s", (plan_id,))
#         conn.commit()
#         if cursor.rowcount == 0:
#             raise HTTPException(status_code=404, detail="Plan not found")
#         return {"status": "success", "message": "Plan deleted successfully!"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")
#     finally:
#         if cursor: cursor.close()
#         if conn: conn.close()








from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from database import get_engine4

router = APIRouter()

# ✅ Request Body for create/edit
class PlanCreateRequest(BaseModel):
    planName: str
    PlanType: Optional[str] = None
    setupCost: Optional[float] = 0.0
    rentalAmount: Optional[float] = 0.0
    balance: Optional[float] = 0.0
    periodType: Optional[str] = None
    creditValue: Optional[float] = 0.0
    creditValuePerMode: Optional[float] = 0.0
    inboundChargeDay: Optional[float] = 0.0
    inboundChargeNight: Optional[float] = 0.0
    outboundCallCharge: Optional[float] = 0.0
    missCallCharge: Optional[float] = 0.0
    vfoCharge: Optional[float] = 0.0
    smsCharge: Optional[float] = 0.0
    emailCharge: Optional[float] = 0.0
    noOfUsers: Optional[int] = 0
    chargePerExtraUser: Optional[float] = 0.0
    ivrCharge: Optional[float] = 0.0
    ibPulse: Optional[int] = 0
    pulseDay: Optional[str] = None
    ratePerPulseDay: Optional[float] = 0.0
    pulseNight: Optional[str] = None
    ratePerPulseNight: Optional[float] = 0.0
    multiIBCharges: Optional[float] = 0.0
    multiOBCharges: Optional[float] = 0.0
    multiLiveChat: Optional[float] = 0.0
    whatsappMessageCharge: Optional[float] = 0.0
    pulseIBMulti: Optional[int] = 0
    ratePerPulseIBMulti: Optional[float] = 0.0
    pulseOBMulti: Optional[int] = 0
    ratePerPulseOBMulti: Optional[float] = 0.0
    firstMinute: Optional[int] = 0
    ibCallCharge: Optional[float] = 0.0
    obCallCharge: Optional[float] = 0.0


# ✅ CREATE PLAN
@router.post("/create_plan")
def create_plan(plan: PlanCreateRequest):
    print("✅ CREATE PLAN Payload Received:", plan.dict())  # DEBUG
    conn = None
    cursor = None
    try:
        conn = get_engine4().raw_connection()
        cursor = conn.cursor()
        sql = """
        INSERT INTO plan_master (
            PlanName, PlanType, SetupCost, RentalAmount, Balance, PeriodType, CreditValue, CreditValuePerMode,
            InboundCallCharge, InboundCallChargeNight, OutboundCallCharge,
            MissCallCharge, VFOCallCharge, SMSCharge, EmailCharge,
            NoOfFreeUser, ChargePerExtraUser, IVR_Charge,
            ib_pulse_sec, pulse_day_shift, rate_per_pulse_day_shift,
            pulse_night_shift, rate_per_pulse_night_shift,
            MultiIBCharges, MultiOBCharges, MultiLiveChat, whatsapp_message_charge,
            pulse_ib_multi, rate_per_pulse_ib_multi,
            pulse_ob_multi, rate_per_pulse_ob_multi,
            first_minute, IB_Call_Charge, OB_Call_Charge, createdate
        ) VALUES (
            %s,%s,%s,%s,%s,%s,%s,%s,
            %s,%s,%s,
            %s,%s,%s,%s,
            %s,%s,%s,
            %s,%s,%s,
            %s,%s,
            %s,%s,%s,%s,
            %s,%s,
            %s,%s,
            %s,%s,%s, NOW()
        )
        """
        values = (
            plan.planName, plan.PlanType, plan.setupCost, plan.rentalAmount, plan.balance,
            plan.periodType, plan.creditValue, plan.creditValuePerMode,
            plan.inboundChargeDay, plan.inboundChargeNight, plan.outboundCallCharge,
            plan.missCallCharge, plan.vfoCharge, plan.smsCharge, plan.emailCharge,
            plan.noOfUsers, plan.chargePerExtraUser, plan.ivrCharge,
            plan.ibPulse, plan.pulseDay, plan.ratePerPulseDay,
            plan.pulseNight, plan.ratePerPulseNight,
            plan.multiIBCharges, plan.multiOBCharges, plan.multiLiveChat, plan.whatsappMessageCharge,
            plan.pulseIBMulti, plan.ratePerPulseIBMulti,
            plan.pulseOBMulti, plan.ratePerPulseOBMulti,
            plan.firstMinute, plan.ibCallCharge, plan.obCallCharge
        )
        cursor.execute(sql, values)
        conn.commit()
        print("✅ Plan inserted successfully, ID:", cursor.lastrowid)
        return {"status": "success", "message": "Plan created successfully!", "plan_id": cursor.lastrowid}
    except Exception as e:
        print("❌ DB Error:", str(e))
        raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")
    finally:
        if cursor: cursor.close()
        if conn: conn.close()


# ✅ GET ALL PLANS
@router.get("/plans")
def get_plans():
    conn = None
    cursor = None
    try:
        conn = get_engine4().raw_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM plan_master ORDER BY id DESC")
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        plans = [dict(zip(columns, row)) for row in rows]
        return {"status": "success", "plans": plans}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")
    finally:
        if cursor: cursor.close()
        if conn: conn.close()


# ✅ GET PLAN BY ID
@router.get("/plan/{plan_id}")
def get_plan(plan_id: int):
    conn = None
    cursor = None
    try:
        conn = get_engine4().raw_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM plan_master WHERE id=%s", (plan_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Plan not found")
        columns = [col[0] for col in cursor.description]
        plan = dict(zip(columns, row))
        return {"status": "success", "plan": plan}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")
    finally:
        if cursor: cursor.close()
        if conn: conn.close()


# ✅ UPDATE PLAN
@router.put("/plan/{plan_id}")
def update_plan(plan_id: int, plan: PlanCreateRequest):
    print(f"✅ UPDATE PLAN Payload for ID {plan_id}:", plan.dict())
    conn = None
    cursor = None
    try:
        conn = get_engine4().raw_connection()
        cursor = conn.cursor()
        sql = """
        UPDATE plan_master SET
            PlanName=%s, PlanType=%s, SetupCost=%s, RentalAmount=%s, Balance=%s,
            PeriodType=%s, CreditValue=%s, CreditValuePerMode=%s,
            InboundCallCharge=%s, InboundCallChargeNight=%s, OutboundCallCharge=%s,
            MissCallCharge=%s, VFOCallCharge=%s, SMSCharge=%s, EmailCharge=%s,
            NoOfFreeUser=%s, ChargePerExtraUser=%s, IVR_Charge=%s,
            ib_pulse_sec=%s, pulse_day_shift=%s, rate_per_pulse_day_shift=%s,
            pulse_night_shift=%s, rate_per_pulse_night_shift=%s,
            MultiIBCharges=%s, MultiOBCharges=%s, MultiLiveChat=%s, whatsapp_message_charge=%s,
            pulse_ib_multi=%s, rate_per_pulse_ib_multi=%s,
            pulse_ob_multi=%s, rate_per_pulse_ob_multi=%s,
            first_minute=%s, IB_Call_Charge=%s, OB_Call_Charge=%s
        WHERE id=%s
        """
        values = (
            plan.planName, plan.PlanType, plan.setupCost, plan.rentalAmount, plan.balance,
            plan.periodType, plan.creditValue, plan.creditValuePerMode,
            plan.inboundChargeDay, plan.inboundChargeNight, plan.outboundCallCharge,
            plan.missCallCharge, plan.vfoCharge, plan.smsCharge, plan.emailCharge,
            plan.noOfUsers, plan.chargePerExtraUser, plan.ivrCharge,
            plan.ibPulse, plan.pulseDay, plan.ratePerPulseDay,
            plan.pulseNight, plan.ratePerPulseNight,
            plan.multiIBCharges, plan.multiOBCharges, plan.multiLiveChat, plan.whatsappMessageCharge,
            plan.pulseIBMulti, plan.ratePerPulseIBMulti,
            plan.pulseOBMulti, plan.ratePerPulseOBMulti,
            plan.firstMinute, plan.ibCallCharge, plan.obCallCharge,
            plan_id
        )
        cursor.execute(sql, values)
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Plan not found")
        return {"status": "success", "message": "Plan updated successfully!"}
    except Exception as e:
        print("❌ DB Error:", str(e))
        raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")
    finally:
        if cursor: cursor.close()
        if conn: conn.close()


# ✅ DELETE PLAN
@router.delete("/plan/{plan_id}")
def delete_plan(plan_id: int):
    conn = None
    cursor = None
    try:
        conn = get_engine4().raw_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM plan_master WHERE id=%s", (plan_id,))
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Plan not found")
        return {"status": "success", "message": "Plan deleted successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

