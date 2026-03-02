


from fastapi import APIRouter, Form, File, UploadFile, HTTPException
from typing import Optional, List
import os, shutil
from database import get_engine4

router = APIRouter()

# # ---------------- OTP Storage ----------------
# otp_store: Dict[str, str] = {}  # stores OTPs temporarily
# password_store: Dict[str, str] = {}  # stores default password after OTP verification

# # ---------------- Send OTP ----------------
# @router.post("/send-otp")
# async def send_otp(mobile: str = Form(...)):
#     mobile = mobile.strip()
#     if not mobile.isdigit() or len(mobile) != 10:
#         raise HTTPException(status_code=400, detail="Invalid mobile number")

#     otp = str(randint(100000, 999999))
#     otp_store[mobile] = otp

#     # In production, integrate SMS API here
#     print(f"OTP for {mobile} is {otp}")  # For testing

#     return {"success": True, "message": "OTP sent successfully"}

# # ---------------- Verify OTP ----------------
# @router.post("/verify-otp")
# async def verify_otp(mobile: str = Form(...), otp: str = Form(...)):
#     mobile = mobile.strip()
#     otp = otp.strip()

#     stored_otp = otp_store.get(mobile)
#     if not stored_otp:
#         raise HTTPException(status_code=400, detail="No OTP sent for this mobile number")

#     if stored_otp != otp:
#         return {"success": False, "message": "Invalid OTP"}

#     # OTP correct → set default password
#     password_store[mobile] = "123456"

#     # Remove OTP from store
#     otp_store.pop(mobile, None)

#     return {"success": True, "message": "OTP verified successfully, password set to 123456"}

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ---------------- Helper Functions ----------------
def save_file(file: Optional[UploadFile], field_name: str) -> str:
    if file:
        file_path = os.path.join(UPLOAD_DIR, f"{field_name}_{file.filename}")
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        return file_path
    return ""

def save_multiple_files(files: Optional[List[UploadFile]], prefix: str) -> str:
    if not files:
        return ""
    paths = [save_file(file, f"{prefix}_{idx}") for idx, file in enumerate(files)]
    return ",".join(paths) if paths else ""

# ---------------- Company Registration ----------------
# @router.post("/register")
# async def register_company(
#     companyName: str = Form(...),
#     regAddress1: str = Form(...),
#     regAddress2: Optional[str] = Form(None),
#     city: str = Form(...),
#     state: str = Form(...),
#     gst: Optional[str] = Form(None),
#     pincode: str = Form(...),
#     authorisedPerson: str = Form(...),
#     designation: str = Form(...),
#     mobile: str = Form(...),
#     email: str = Form(...),
#     password: str = Form(...),
#     confirmPassword: str = Form(...),
#     commAddress1: Optional[str] = Form(None),
#     commAddress2: Optional[str] = Form(None),
#     commCity: Optional[str] = Form(None),
#     commState: Optional[str] = Form(None),
#     commPincode: Optional[str] = Form(None),
#     contactPerson1: str = Form(...),
#     designation1: str = Form(...),
#     mobile1: str = Form(...),
#     email1: str = Form(...),
#     contactPerson2: Optional[str] = Form(None),
#     designation2: Optional[str] = Form(None),
#     mobile2: Optional[str] = Form(None),
#     email2: Optional[str] = Form(None),
#     contactPerson3: Optional[str] = Form(None),
#     designation3: Optional[str] = Form(None),
#     mobile3: Optional[str] = Form(None),
#     email3: Optional[str] = Form(None),
#     incorporationCertificate: UploadFile = File(...),
#     panCard: UploadFile = File(...),
#     authorizedAddressProof: Optional[UploadFile] = File(None),
#     otherDocuments: Optional[List[UploadFile]] = File(None),
#     billingAddressProof: Optional[UploadFile] = File(None),
#     authorizedId: Optional[UploadFile] = File(None),
#     companyLogo: Optional[UploadFile] = File(None),
#     termsAccepted: bool = Form(...),
# ):
#     if not termsAccepted:
#         raise HTTPException(status_code=400, detail="You must accept the terms to register.")
#     if password != confirmPassword:
#         raise HTTPException(status_code=400, detail="Password and Confirm Password do not match.")

#     # ---------------- Save Files ----------------
#     incorporation_path = save_file(incorporationCertificate, "incorporation")
#     pan_path = save_file(panCard, "pan")
#     auth_addr_path = save_file(authorizedAddressProof, "auth_address")
#     billing_path = save_file(billingAddressProof, "billing")
#     auth_id_path = save_file(authorizedId, "auth_id")
#     logo_path = save_file(companyLogo, "logo")
#     other_docs_combined = save_multiple_files(otherDocuments, "other")

#     # ---------------- Database Insert ----------------
#     conn = None
#     cursor = None
#     try:
#         conn = get_engine4().raw_connection()
#         cursor = conn.cursor()

#         # Check duplicates
#         cursor.execute("""
#             SELECT company_id FROM registration_master 
#             WHERE gst_no = %(gst)s OR phone_no = %(mobile)s OR email = %(email)s
#         """, {"gst": gst or "", "mobile": mobile, "email": email})
#         duplicate = cursor.fetchone()
#         if duplicate:
#             raise HTTPException(status_code=400, detail="Company already exists with this GST, Mobile, or Email.")

#         # Insert using named placeholders
#         sql = """
#         INSERT INTO registration_master (
#             create_date, company_name, reg_office_address1, reg_office_address2,
#             city, state, pincode, gst_no,
#             auth_person, designation, phone_no, email, password,
#             comm_address1, comm_address2, comm_city, comm_state, comm_pincode,
#             contact_person1, cp1_designation, cp1_phone, cp1_email,
#             contact_person2, cp2_designation, cp2_phone, cp2_email,
#             contact_person3, cp3_designation, cp3_phone, cp3_email,
#             incorporation_certificate, pancard, auth_person_address_prof,
#             bill_address_prof, authorized_id_prof, company_logo, other_documents,
#             status
#         ) VALUES (
#             NOW(), %(company_name)s, %(reg1)s, %(reg2)s, %(city)s, %(state)s, %(pincode)s, %(gst)s,
#             %(auth_person)s, %(designation)s, %(phone)s, %(email)s, %(password)s,
#             %(comm1)s, %(comm2)s, %(comm_city)s, %(comm_state)s, %(comm_pincode)s,
#             %(cp1)s, %(cp1d)s, %(cp1p)s, %(cp1e)s,
#             %(cp2)s, %(cp2d)s, %(cp2p)s, %(cp2e)s,
#             %(cp3)s, %(cp3d)s, %(cp3p)s, %(cp3e)s,
#             %(incorp)s, %(pancard)s, %(auth_addr)s, %(billing)s, %(auth_id)s, %(logo)s, %(other_docs)s,
#             %(status)s
#         )
#         """

#         values = {
#             "company_name": companyName,
#             "reg1": regAddress1,
#             "reg2": regAddress2 or "",
#             "city": city,
#             "state": state,
#             "pincode": pincode,
#             "gst": gst or "",
#             "auth_person": authorisedPerson,
#             "designation": designation,
#             "phone": mobile,
#             "email": email,
#             "password": password,
#             "comm1": commAddress1 or "",
#             "comm2": commAddress2 or "",
#             "comm_city": commCity or "",
#             "comm_state": commState or "",
#             "comm_pincode": commPincode or "",
#             "cp1": contactPerson1,
#             "cp1d": designation1,
#             "cp1p": mobile1,
#             "cp1e": email1,
#             "cp2": contactPerson2 or "",
#             "cp2d": designation2 or "",
#             "cp2p": mobile2 or "",
#             "cp2e": email2 or "",
#             "cp3": contactPerson3 or "",
#             "cp3d": designation3 or "",
#             "cp3p": mobile3 or "",
#             "cp3e": email3 or "",
#             "incorp": incorporation_path,
#             "pancard": pan_path,
#             "auth_addr": auth_addr_path,
#             "billing": billing_path,
#             "auth_id": auth_id_path,
#             "logo": logo_path,
#             "other_docs": other_docs_combined,
#             "status": "active",
#         }

#         cursor.execute(sql, values)
#         conn.commit()

#         return {"status": "success", "message": "Company registered successfully!"}

#     except HTTPException:
#         raise
#     except Exception as e:
#         print("❌ DB Error:", str(e))
#         raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")
#     finally:
#         if cursor: cursor.close()
#         if conn: conn.close()


# ---------------- Company Registration ----------------
@router.post("/register")
async def register_company(
    companyName: str = Form(...),
    regAddress1: str = Form(...),
    regAddress2: Optional[str] = Form(None),
    city: str = Form(...),
    state: str = Form(...),
    gst: Optional[str] = Form(None),
    pincode: str = Form(...),
    authorisedPerson: str = Form(...),
    designation: str = Form(...),
    mobile: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    confirmPassword: str = Form(...),
    commAddress1: Optional[str] = Form(None),
    commAddress2: Optional[str] = Form(None),
    commCity: Optional[str] = Form(None),
    commState: Optional[str] = Form(None),
    commPincode: Optional[str] = Form(None),
    contactPerson1: str = Form(...),
    designation1: str = Form(...),
    mobile1: str = Form(...),
    email1: str = Form(...),
    contactPerson2: Optional[str] = Form(None),
    designation2: Optional[str] = Form(None),
    mobile2: Optional[str] = Form(None),
    email2: Optional[str] = Form(None),
    contactPerson3: Optional[str] = Form(None),
    designation3: Optional[str] = Form(None),
    mobile3: Optional[str] = Form(None),
    email3: Optional[str] = Form(None),
    incorporationCertificate: UploadFile = File(...),
    panCard: UploadFile = File(...),
    authorizedAddressProof: Optional[UploadFile] = File(None),
    otherDocuments: Optional[List[UploadFile]] = File(None),
    billingAddressProof: Optional[UploadFile] = File(None),
    authorizedId: Optional[UploadFile] = File(None),
    companyLogo: Optional[UploadFile] = File(None),
    termsAccepted: bool = Form(...),
):
    if not termsAccepted:
        raise HTTPException(status_code=400, detail="You must accept the terms to register.")
    if password != confirmPassword:
        raise HTTPException(status_code=400, detail="Password and Confirm Password do not match.")

    # ---------------- Save Files ----------------
    incorporation_path = save_file(incorporationCertificate, "incorporation")
    pan_path = save_file(panCard, "pan")
    auth_addr_path = save_file(authorizedAddressProof, "auth_address")
    billing_path = save_file(billingAddressProof, "billing")
    auth_id_path = save_file(authorizedId, "auth_id")
    logo_path = save_file(companyLogo, "logo")
    other_docs_combined = save_multiple_files(otherDocuments, "other")

    # ---------------- Database Insert ----------------
    conn = None
    cursor = None
    try:
        conn = get_engine4().raw_connection()
        cursor = conn.cursor()

        # ✅ Dynamic duplicate check
        check_query = "SELECT company_id FROM registration_master WHERE "
        conditions = []
        params = {}

        if gst:
            conditions.append("gst_no = %(gst)s")
            params["gst"] = gst
        if mobile:
            conditions.append("phone_no = %(mobile)s")
            params["mobile"] = mobile
        if email:
            conditions.append("email = %(email)s")
            params["email"] = email

        if conditions:
            check_query += " OR ".join(conditions)
            cursor.execute(check_query, params)
            duplicate = cursor.fetchone()
            if duplicate:
                raise HTTPException(
                    status_code=400,
                    detail="Company already exists with this GST, Mobile, or Email."
                )

        # ✅ Insert new record
        sql = """
        INSERT INTO registration_master (
            create_date, company_name, reg_office_address1, reg_office_address2,
            city, state, pincode, gst_no,
            auth_person, designation, phone_no, email, password,
            comm_address1, comm_address2, comm_city, comm_state, comm_pincode,
            contact_person1, cp1_designation, cp1_phone, cp1_email,
            contact_person2, cp2_designation, cp2_phone, cp2_email,
            contact_person3, cp3_designation, cp3_phone, cp3_email,
            incorporation_certificate, pancard, auth_person_address_prof,
            bill_address_prof, authorized_id_prof, company_logo, other_documents,
            status
        ) VALUES (
            NOW(), %(company_name)s, %(reg1)s, %(reg2)s, %(city)s, %(state)s, %(pincode)s, %(gst)s,
            %(auth_person)s, %(designation)s, %(phone)s, %(email)s, %(password)s,
            %(comm1)s, %(comm2)s, %(comm_city)s, %(comm_state)s, %(comm_pincode)s,
            %(cp1)s, %(cp1d)s, %(cp1p)s, %(cp1e)s,
            %(cp2)s, %(cp2d)s, %(cp2p)s, %(cp2e)s,
            %(cp3)s, %(cp3d)s, %(cp3p)s, %(cp3e)s,
            %(incorp)s, %(pancard)s, %(auth_addr)s, %(billing)s, %(auth_id)s, %(logo)s, %(other_docs)s,
            %(status)s
        )
        """

        values = {
            "company_name": companyName,
            "reg1": regAddress1,
            "reg2": regAddress2 or "",
            "city": city,
            "state": state,
            "pincode": pincode,
            "gst": gst or "",
            "auth_person": authorisedPerson,
            "designation": designation,
            "phone": mobile,
            "email": email,
            "password": password,
            "comm1": commAddress1 or "",
            "comm2": commAddress2 or "",
            "comm_city": commCity or "",
            "comm_state": commState or "",
            "comm_pincode": commPincode or "",
            "cp1": contactPerson1,
            "cp1d": designation1,
            "cp1p": mobile1,
            "cp1e": email1,
            "cp2": contactPerson2 or "",
            "cp2d": designation2 or "",
            "cp2p": mobile2 or "",
            "cp2e": email2 or "",
            "cp3": contactPerson3 or "",
            "cp3d": designation3 or "",
            "cp3p": mobile3 or "",
            "cp3e": email3 or "",
            "incorp": incorporation_path,
            "pancard": pan_path,
            "auth_addr": auth_addr_path,
            "billing": billing_path,
            "auth_id": auth_id_path,
            "logo": logo_path,
            "other_docs": other_docs_combined,
            "status": "active",
        }

        cursor.execute(sql, values)
        conn.commit()

        return {"status": "success", "message": "Company registered successfully!"}

    except HTTPException:
        raise
    except Exception as e:
        print("❌ DB Error:", str(e))
        raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")
    finally:
        if cursor: cursor.close()
        if conn: conn.close()


# ---------------- Get Company List (All Fields) ----------------
@router.get("/list")
async def list_companies():
    conn = None
    cursor = None
    try:
        conn = get_engine4().raw_connection()
        cursor = conn.cursor()

        # Fetch all columns
        cursor.execute("SELECT * FROM registration_master ORDER BY create_date DESC")
        rows = cursor.fetchall()

        # Convert rows to list of dictionaries
        companies = []
        columns = [col[0] for col in cursor.description]
        for row in rows:
            companies.append(dict(zip(columns, row)))

        return {"status": "success", "data": companies}

    except Exception as e:
        print("❌ DB Error:", str(e))
        raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")
    finally:
        if cursor: cursor.close()
        if conn: conn.close()


# ---------------- Get Single Company ----------------
@router.get("/get/{company_id}")
async def get_company(company_id: int):
    conn = None
    cursor = None
    try:
        conn = get_engine4().raw_connection()
        cursor = conn.cursor()

        # Fetch all columns for this company
        cursor.execute("SELECT * FROM registration_master WHERE company_id = %s", (company_id,))
        row = cursor.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Company not found.")

        columns = [col[0] for col in cursor.description]
        company = dict(zip(columns, row))

        return {"status": "success", "data": company}

    except Exception as e:
        print("❌ DB Error:", str(e))
        raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")
    finally:
        if cursor: cursor.close()
        if conn: conn.close()



# from fastapi import APIRouter, Form, UploadFile, File, HTTPException
# from typing import Optional, List

# router = APIRouter()




# from fastapi import APIRouter, Form, File, UploadFile, HTTPException
# from typing import Optional, List
# from database import get_engine4
# from utils import save_file, save_multiple_files  # your file helpers

# router = APIRouter()

@router.put("/update/{company_id}")
async def update_company(
    company_id: int,
    companyName: Optional[str] = Form(None),
    regAddress1: Optional[str] = Form(None),
    regAddress2: Optional[str] = Form(None),
    city: Optional[str] = Form(None),
    state: Optional[str] = Form(None),
    gst: Optional[str] = Form(None),
    pincode: Optional[str] = Form(None),
    authorisedPerson: Optional[str] = Form(None),
    designation: Optional[str] = Form(None),
    mobile: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    password: Optional[str] = Form(None),
    confirmPassword: Optional[str] = Form(None),
    commAddress1: Optional[str] = Form(None),
    commAddress2: Optional[str] = Form(None),
    commCity: Optional[str] = Form(None),
    commState: Optional[str] = Form(None),
    commPincode: Optional[str] = Form(None),
    contactPerson1: Optional[str] = Form(None),
    designation1: Optional[str] = Form(None),
    mobile1: Optional[str] = Form(None),
    email1: Optional[str] = Form(None),
    contactPerson2: Optional[str] = Form(None),
    designation2: Optional[str] = Form(None),
    mobile2: Optional[str] = Form(None),
    email2: Optional[str] = Form(None),
    contactPerson3: Optional[str] = Form(None),
    designation3: Optional[str] = Form(None),
    mobile3: Optional[str] = Form(None),
    email3: Optional[str] = Form(None),
    incorporationCertificate: Optional[UploadFile] = File(None),
    panCard: Optional[UploadFile] = File(None),
    authorizedAddressProof: Optional[UploadFile] = File(None),
    otherDocuments: Optional[List[UploadFile]] = File(None),
    billingAddressProof: Optional[UploadFile] = File(None),
    authorizedId: Optional[UploadFile] = File(None),
    companyLogo: Optional[UploadFile] = File(None),
):
    try:
        # Password match check
        if password and confirmPassword and password != confirmPassword:
            raise HTTPException(status_code=400, detail="Password and Confirm Password do not match.")

        # Save files
        incorporation_path = save_file(incorporationCertificate, "incorporation") if incorporationCertificate else None
        pan_path = save_file(panCard, "pan") if panCard else None
        auth_addr_path = save_file(authorizedAddressProof, "auth_address") if authorizedAddressProof else None
        billing_path = save_file(billingAddressProof, "billing") if billingAddressProof else None
        auth_id_path = save_file(authorizedId, "auth_id") if authorizedId else None
        logo_path = save_file(companyLogo, "logo") if companyLogo else None
        other_docs_combined = save_multiple_files(otherDocuments, "other") if otherDocuments else None

        # Build update fields dynamically
        fields = {}
        if companyName: fields["company_name"] = companyName
        if regAddress1: fields["reg_office_address1"] = regAddress1
        if regAddress2: fields["reg_office_address2"] = regAddress2
        if city: fields["city"] = city
        if state: fields["state"] = state
        if gst: fields["gst_no"] = gst
        if pincode: fields["pincode"] = pincode
        if authorisedPerson: fields["auth_person"] = authorisedPerson
        if designation: fields["designation"] = designation
        if mobile: fields["phone_no"] = mobile
        if email: fields["email"] = email
        if password: fields["password"] = password
        if commAddress1: fields["comm_address1"] = commAddress1
        if commAddress2: fields["comm_address2"] = commAddress2
        if commCity: fields["comm_city"] = commCity
        if commState: fields["comm_state"] = commState
        if commPincode: fields["comm_pincode"] = commPincode
        if contactPerson1: fields["contact_person1"] = contactPerson1
        if designation1: fields["cp1_designation"] = designation1
        if mobile1: fields["cp1_phone"] = mobile1
        if email1: fields["cp1_email"] = email1
        if contactPerson2: fields["contact_person2"] = contactPerson2
        if designation2: fields["cp2_designation"] = designation2
        if mobile2: fields["cp2_phone"] = mobile2
        if email2: fields["cp2_email"] = email2
        if contactPerson3: fields["contact_person3"] = contactPerson3
        if designation3: fields["cp3_designation"] = designation3
        if mobile3: fields["cp3_phone"] = mobile3
        if email3: fields["cp3_email"] = email3

        if incorporation_path: fields["incorporation_certificate"] = incorporation_path
        if pan_path: fields["pancard"] = pan_path
        if auth_addr_path: fields["auth_person_address_prof"] = auth_addr_path
        if billing_path: fields["bill_address_prof"] = billing_path
        if auth_id_path: fields["authorized_id_prof"] = auth_id_path
        if logo_path: fields["company_logo"] = logo_path
        if other_docs_combined: fields["other_documents"] = other_docs_combined

        if not fields:
            raise HTTPException(status_code=400, detail="No fields provided to update.")

        # Build SQL
        set_clause = ", ".join([f"{k} = %({k})s" for k in fields.keys()])
        sql = f"UPDATE registration_master SET {set_clause} WHERE company_id = %(company_id)s"
        fields["company_id"] = company_id

        conn = get_engine4().raw_connection()
        cursor = conn.cursor()
        cursor.execute(sql, fields)
        conn.commit()

        return {"status": "success", "message": "Company updated successfully!"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")
    finally:
        try: cursor.close()
        except: pass
        try: conn.close()
        except: pass


# @router.post("/update/{company_id}")
# async def update_company(
#     company_id: int,
#     companyName: Optional[str] = Form(None),
#     regAddress1: Optional[str] = Form(None),
#     regAddress2: Optional[str] = Form(None),
#     city: Optional[str] = Form(None),
#     state: Optional[str] = Form(None),
#     gst: Optional[str] = Form(None),
#     pincode: Optional[str] = Form(None),
#     authorisedPerson: Optional[str] = Form(None),
#     designation: Optional[str] = Form(None),
#     mobile: Optional[str] = Form(None),
#     email: Optional[str] = Form(None),
#     password: Optional[str] = Form(None),
#     confirmPassword: Optional[str] = Form(None),
#     commAddress1: Optional[str] = Form(None),
#     commAddress2: Optional[str] = Form(None),
#     commCity: Optional[str] = Form(None),
#     commState: Optional[str] = Form(None),
#     commPincode: Optional[str] = Form(None),
#     contactPerson1: Optional[str] = Form(None),
#     designation1: Optional[str] = Form(None),
#     mobile1: Optional[str] = Form(None),
#     email1: Optional[str] = Form(None),
#     contactPerson2: Optional[str] = Form(None),
#     designation2: Optional[str] = Form(None),
#     mobile2: Optional[str] = Form(None),
#     email2: Optional[str] = Form(None),
#     contactPerson3: Optional[str] = Form(None),
#     designation3: Optional[str] = Form(None),
#     mobile3: Optional[str] = Form(None),
#     email3: Optional[str] = Form(None),
#     incorporationCertificate: Optional[UploadFile] = File(None),
#     panCard: Optional[UploadFile] = File(None),
#     authorizedAddressProof: Optional[UploadFile] = File(None),
#     otherDocuments: Optional[List[UploadFile]] = File(None),
#     billingAddressProof: Optional[UploadFile] = File(None),
#     authorizedId: Optional[UploadFile] = File(None),
#     companyLogo: Optional[UploadFile] = File(None),
# ):
#     try:
#         # Password check
#         if password and confirmPassword and password != confirmPassword:
#             raise HTTPException(status_code=400, detail="Password and Confirm Password do not match.")

#         # --- Save files if uploaded ---
#         incorporation_path = save_file(incorporationCertificate, "incorporation") if incorporationCertificate else None
#         pan_path = save_file(panCard, "pan") if panCard else None
#         auth_addr_path = save_file(authorizedAddressProof, "auth_address") if authorizedAddressProof else None
#         billing_path = save_file(billingAddressProof, "billing") if billingAddressProof else None
#         auth_id_path = save_file(authorizedId, "auth_id") if authorizedId else None
#         logo_path = save_file(companyLogo, "logo") if companyLogo else None
#         other_docs_combined = save_multiple_files(otherDocuments, "other") if otherDocuments else None

#         # --- Build fields dynamically ---
#         fields = {}
#         if companyName: fields["company_name"] = companyName
#         if regAddress1: fields["reg_office_address1"] = regAddress1
#         if regAddress2: fields["reg_office_address2"] = regAddress2
#         if city: fields["city"] = city
#         if state: fields["state"] = state
#         if gst: fields["gst_no"] = gst
#         if pincode: fields["pincode"] = pincode
#         if authorisedPerson: fields["auth_person"] = authorisedPerson
#         if designation: fields["designation"] = designation
#         if mobile: fields["phone_no"] = mobile
#         if email: fields["email"] = email
#         if password: fields["password"] = password
#         if commAddress1: fields["comm_address1"] = commAddress1
#         if commAddress2: fields["comm_address2"] = commAddress2
#         if commCity: fields["comm_city"] = commCity
#         if commState: fields["comm_state"] = commState
#         if commPincode: fields["comm_pincode"] = commPincode
#         if contactPerson1: fields["contact_person1"] = contactPerson1
#         if designation1: fields["cp1_designation"] = designation1
#         if mobile1: fields["cp1_phone"] = mobile1
#         if email1: fields["cp1_email"] = email1
#         if contactPerson2: fields["contact_person2"] = contactPerson2
#         if designation2: fields["cp2_designation"] = designation2
#         if mobile2: fields["cp2_phone"] = mobile2
#         if email2: fields["cp2_email"] = email2
#         if contactPerson3: fields["contact_person3"] = contactPerson3
#         if designation3: fields["cp3_designation"] = designation3
#         if mobile3: fields["cp3_phone"] = mobile3
#         if email3: fields["cp3_email"] = email3

#         if incorporation_path: fields["incorporation_certificate"] = incorporation_path
#         if pan_path: fields["pancard"] = pan_path
#         if auth_addr_path: fields["auth_person_address_prof"] = auth_addr_path
#         if billing_path: fields["bill_address_prof"] = billing_path
#         if auth_id_path: fields["authorized_id_prof"] = auth_id_path
#         if logo_path: fields["company_logo"] = logo_path
#         if other_docs_combined: fields["other_documents"] = other_docs_combined

#         if not fields:
#             raise HTTPException(status_code=400, detail="No fields provided to update.")

#         # --- Build SQL dynamically ---
#         set_clause = ", ".join([f"{key} = %({key})s" for key in fields.keys()])
#         sql = f"UPDATE registration_master SET {set_clause} WHERE company_id = %(company_id)s"
#         fields["company_id"] = company_id

#         conn = get_engine4().raw_connection()
#         cursor = conn.cursor()
#         cursor.execute(sql, fields)
#         conn.commit()

#         return {"status": "success", "message": "Company updated successfully!"}

#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")
#     finally:
#         try: cursor.close()
#         except: pass
#         try: conn.close()
#         except: pass


