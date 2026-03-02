from datetime import datetime, date, timedelta
from decimal import Decimal
from typing import Optional, List, Literal

from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    message: str
    access_token: str
    role: str
    username: Optional[str] = None
    company_id: Optional[int] = None
    auth_person: Optional[str] = None
    displayname: Optional[str] = None
    id: Optional[int] = None


class ProcessReadRequest(BaseModel):
    agent_id: int
    process_id: int


class CallMasterRecord(BaseModel):
    Id: int
    client_id: int
    DeptId: Optional[int] = None
    UserType: Optional[str] = None
    RefrenceId: Optional[int] = None
    ContactId: Optional[int] = None
    SubTagType: Optional[str] = None
    TagStatus: Optional[int] = None
    campaign_id: Optional[int] = None
    SrNo: Optional[int] = None
    MSISDN: Optional[int] = None
    Subject: Optional[str] = None
    AgentId: Optional[int] = None
    priority: Optional[str] = None
    CallDate: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_tat_defined: Optional[bool] = None
    tat: Optional[str] = None
    tat_status: Optional[int] = None
    tat_date: Optional[datetime] = None
    Category1: Optional[str] = None
    Category2: Optional[str] = None
    Category3: Optional[str] = None
    Category4: Optional[str] = None
    Category5: Optional[str] = None
    Field1: Optional[str] = None
    Field2: Optional[str] = None
    Field3: Optional[str] = None
    Field4: Optional[str] = None
    Field5: Optional[str] = None
    Field6: Optional[str] = None
    Field7: Optional[str] = None
    Field8: Optional[str] = None
    Field9: Optional[str] = None
    Field10: Optional[str] = None
    Field11: Optional[str] = None
    Field12: Optional[str] = None
    Field13: Optional[str] = None
    Field14: Optional[str] = None
    Field15: Optional[str] = None
    Field16: Optional[str] = None
    Field17: Optional[str] = None
    Field18: Optional[str] = None
    Field19: Optional[str] = None
    Field20: Optional[str] = None
    Field21: Optional[str] = None
    Field22: Optional[str] = None
    Field23: Optional[str] = None
    Field24: Optional[str] = None
    Field25: Optional[str] = None
    Field26: Optional[str] = None
    Field27: Optional[str] = None
    Field28: Optional[str] = None
    Field29: Optional[str] = None
    Field30: Optional[str] = None
    Field31: Optional[str] = None
    Field32: Optional[str] = None
    Field33: Optional[str] = None
    Field34: Optional[str] = None
    Field35: Optional[str] = None
    Field36: Optional[str] = None
    Field37: Optional[str] = None
    Field38: Optional[str] = None
    Field39: Optional[str] = None
    Field40: Optional[str] = None
    Field41: Optional[str] = None
    Field42: Optional[str] = None
    Field43: Optional[str] = None
    Field44: Optional[str] = None
    Field45: Optional[str] = None
    Field46: Optional[str] = None
    Field47: Optional[str] = None
    Field48: Optional[str] = None
    Field49: Optional[str] = None
    Field50: Optional[str] = None
    LeadId: Optional[int] = None
    close_loop: Optional[str] = None
    CloseLoopCate1: Optional[str] = None
    CloseLoopCate2: Optional[str] = None
    CloseLoopingDate: Optional[str] = None
    FollowupDate: Optional[str] = None
    closelooping_remarks: Optional[str] = None
    CloseLoopStatus: Optional[str] = None
    UpdateDate: Optional[datetime] = None
    emailSend: Optional[str] = None
    smsSend: Optional[str] = None
    escalation_no: Optional[int] = None
    escalation_status: Optional[str] = None
    CallType: Optional[str] = None
    TagType: Optional[str] = None
    Escalation: Optional[str] = None
    Escalation_date: Optional[str] = None
    Escalation1: Optional[str] = None
    Escalation1_date: Optional[str] = None
    Escalation2: Optional[str] = None
    Escalation2_date: Optional[str] = None
    Escalation3: Optional[str] = None
    Escalation3_date: Optional[str] = None
    duedate: Optional[str] = None
    callcreated: Optional[str] = None
    MailStatus: Optional[str] = None
    MailDateTime: Optional[str] = None
    CField1: Optional[str] = None
    CField2: Optional[str] = None
    CField3: Optional[str] = None
    CField4: Optional[str] = None
    CField5: Optional[str] = None
    CField6: Optional[str] = None
    CField7: Optional[str] = None
    CField8: Optional[str] = None
    CField9: Optional[str] = None
    CField10: Optional[str] = None
    CField11: Optional[str] = None
    CField12: Optional[str] = None
    CField13: Optional[str] = None
    CField14: Optional[str] = None
    CField15: Optional[str] = None
    CField16: Optional[str] = None
    CField17: Optional[str] = None
    CField18: Optional[str] = None
    CField19: Optional[str] = None
    CField20: Optional[str] = None
    CField21: Optional[str] = None
    CField22: Optional[str] = None
    CField23: Optional[str] = None
    CField24: Optional[str] = None
    CField25: Optional[str] = None
    CField26: Optional[str] = None
    CField27: Optional[str] = None
    CField28: Optional[str] = None
    CField29: Optional[str] = None
    CField30: Optional[str] = None
    CFieldUpdate: Optional[str] = None
    AbandLeadId: Optional[str] = None
    AbandStatus: Optional[str] = None
    AbandDate: Optional[str] = None
    Urandom: Optional[str] = None
    OrderNo: Optional[str] = None
    AWBNo: Optional[str] = None
    CCRCRDREF: Optional[str] = None
    DestinationArea: Optional[str] = None
    DestinationLocation: Optional[str] = None
    TokenNumber: Optional[str] = None
    AreaCode: Optional[str] = None
    AreaPincode: Optional[str] = None
    AreaPlace: Optional[str] = None
    AreaAddress: Optional[str] = None
    AreaServiceCenterCode: Optional[str] = None
    Ret_AWBNo: Optional[str] = None
    Ret_CCRCRDREF: Optional[str] = None
    Ret_DestinationArea: Optional[str] = None
    Ret_DestinationLocation: Optional[str] = None
    Ret_TokenNumber: Optional[str] = None
    Ret_PikupDate: Optional[str] = None
    OtherStatus: Optional[str] = None
    OtherId: Optional[str] = None
    OtherDate: Optional[str] = None
    OtherDiscription: Optional[str] = None
    CaseCloseBy: Optional[str] = None
    response_time: Optional[str] = None
    cat1: Optional[str] = None
    cat2: Optional[str] = None
    cat3: Optional[str] = None
    cat4: Optional[str] = None
    cat5: Optional[str] = None



class CDRReportRequest(BaseModel):
    from_date: date
    to_date: date
    company_id: int
    category: Optional[str] = "All"

class CDRReportResponse(BaseModel):
    uniqueid: Optional[str]
    parked_time: Optional[timedelta]
    campaign_id: Optional[str]

    call20: Optional[int]
    call60: Optional[int]
    call90: Optional[int]
    agent: Optional[str]
    full_name: Optional[str]
    leadid: Optional[int]
    phone_number: Optional[str]
    call_date: Optional[date]  # <- fix
    queuetime: Optional[timedelta]  # <- fix
    queue_start: Optional[datetime]  # <- fix
    start_time: Optional[datetime]  # <- fix
    end_time: Optional[datetime]
    call_duration: Optional[timedelta]
    call_duration1: Optional[Decimal]
    wrap_end_time: Optional[datetime]
    wrap_time: Optional[timedelta]  # <- fix
    sub_status: Optional[str]
    status: Optional[str]
    term_reason: Optional[str]
    xfercallid: Optional[int]

    Category1: Optional[str]
    Category2: Optional[str]
    Category3: Optional[str]
    Category4: Optional[str]
    Category5: Optional[str]
    Source: Optional[str]
    Recording: Optional[str]


class OBCDRReportRequest(BaseModel):
    from_date: date
    to_date: date
    company_id: int


class OBCDReportRow(BaseModel):
    user: Optional[str]
    lead_id: Optional[int]
    phone_number: Optional[str]
    call_date: Optional[str]
    campaign_id: Optional[str]
    status: Optional[str]
    term_reason: Optional[str]
    sub_status: Optional[str]
    length_in_sec: Optional[int]
    queue_seconds: Optional[int]
    talk_seconds: Optional[int]
    full_name: Optional[str]
    Category1: Optional[str]
    Category2: Optional[str]
    Category3: Optional[str]
    Category4: Optional[str]
    Category5: Optional[str]
    Source: Optional[str]
    Recording: Optional[str]



class OBSharedCDRReportRow(BaseModel):
    CallDate: Optional[str]
    StartTime: Optional[str]
    Endtime: Optional[str]
    PhoneNumber: Optional[str]
    Agent: Optional[str]
    FullName: Optional[str]
    CallType: Optional[str]
    Status: Optional[str]
    DialMode: Optional[str]
    CampaignID: Optional[str]
    LeadID: Optional[int]
    LengthInSec: Optional[int]
    LengthInMin: Optional[str]
    TermReason: Optional[str]
    CallDuration: Optional[int]
    CallStatus: Optional[str]
    PauseSec: Optional[int]
    WaitSec: Optional[int]
    TalkSec: Optional[int]
    DispoSec: Optional[int]
    Category1: Optional[str]
    Category2: Optional[str]
    Category3: Optional[str]
    Category4: Optional[str]
    Category5: Optional[str]
    Recording: Optional[str]



class IVRFunnelReportRequest(BaseModel):
    from_date: date
    to_date: date
    company_id: int

class DashboardReq(BaseModel):
    company_id: int
    view_type: Optional[str] = "Today"
    from_date: Optional[date] = None
    to_date:   Optional[date] = None


class DashboardDay(BaseModel):
    Total:    int
    Answered: int
    Abandon:  int
    gdate:    str

class DashboardFullResp(BaseModel):
    days:             List[DashboardDay]
    total_tagged:     int
    total_abandon_cb: int


class ActiveServicesRequest(BaseModel):
    company_id: int


class ActiveService(BaseModel):
    plan_name: str
    period_type: str
    credit_value: float
    subscription_value: float
    inbound_call_day_charge: float
    inbound_call_night_charge: float
    outbound_call_charge: float
    sms_charge: float
    email_charge: float


class CallAnalysisRequest(BaseModel):
    company_id: int
    view_type: Literal["Today", "Yesterday", "Weekly", "Monthly", "Custom"] = "Today"
    from_date: date | None = None
    to_date: date | None = None

class CallAnalysisResponse(BaseModel):
    answered: int
    abandon: int

class CallDistributionResponse(BaseModel):
    date: str
    Answered: float
    Abandon: float



class TicketCaseBreakdown(BaseModel):
    name: str
    Enquiry: int
    Complaint: int
    BulkOrder: int
    Request: int
    Other: int

class TicketTATBreakdown(BaseModel):
    name: str
    InTAT: int
    OutOfTAT: int

class TicketCaseAnalysisResponse(BaseModel):
    cases: List[TicketCaseBreakdown]
    open_tat: List[TicketTATBreakdown]
    close_tat: List[TicketTATBreakdown]



class TicketSourceResponse(BaseModel):
    source: str
    total: int
    open: int
    close: int
    as_on_date: str


class TypeItem(BaseModel):
    id: str
    name: str
    class Config: orm_mode = True

class CampaignItem(BaseModel):
    id: int
    CampaignName: str
    class Config: orm_mode = True

class AllocationItem(BaseModel):
    id: int
    AllocationName: str
    class Config: orm_mode = True

class OutcallItem(BaseModel):
    id: int
    callFrom: Optional[str]
    scenario: Optional[str]
    subScenario1: Optional[str]
    name: Optional[str]
    contactNumber: Optional[str]
    class Config: orm_mode = True


class ResolutionRequest(BaseModel):
    client_id: int
    language: Optional[str] = "En"

    scenario1: Optional[str] = None
    scenario2: Optional[str] = None
    scenario3: Optional[str] = None
    scenario4: Optional[str] = None
    scenario5: Optional[str] = None