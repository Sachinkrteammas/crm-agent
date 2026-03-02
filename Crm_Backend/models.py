from sqlalchemy import Column, Integer, String, DateTime, Text, Enum, Boolean, TIMESTAMP
from database import Base
from datetime import datetime
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))

    created_by = Column(String(100), nullable=True)
    updated_by = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)



class AlertMechanisms(Base):
    __tablename__ = "alert_mechanisms"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, nullable=False)
    alert_category = Column(Enum('caller', 'internal', 'escalation'), nullable=False)
    alert_on = Column(Enum('SMS', 'Email', 'WhatsApp', 'All'), nullable=False, default='All')
    template_name = Column(String(255), nullable=False)
    template_text = Column(Text, nullable=False)
    scenario1 = Column(String(255))
    scenario2 = Column(String(255))
    scenario3 = Column(String(255))
    scenario4 = Column(String(255))
    scenario5 = Column(String(255))
    person_name = Column(String(255))
    phone = Column(String(20))
    email = Column(String(255))
    tat = Column(Integer)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    created_by = Column(Integer)
    updated_by = Column(Integer)
    WHATSAPP_API_KEY = Column(String(255), default=None)
    WHATSAPP_SESSION_ID = Column(String(255), default=None)


class AlertScheduler(Base):
    __tablename__ = "alert_scheduler"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, nullable=False)
    alert_category = Column(Enum('caller', 'internal', 'escalation'), nullable=False)
    alert_on = Column(Enum('SMS', 'Email', 'WhatsApp', 'All'), nullable=False, default='All')
    template_name = Column(String(255), nullable=False)
    template_text = Column(Text, nullable=False)
    scenario1 = Column(String(255))
    scenario2 = Column(String(255))
    scenario3 = Column(String(255))
    scenario4 = Column(String(255))
    scenario5 = Column(String(255))
    person_name = Column(String(255))
    phone = Column(String(20))
    email = Column(String(255))
    tat = Column(Integer)
    sms_status = Column(Boolean, default=False)
    email_status = Column(Boolean, default=False)
    whatsapp_status = Column(Boolean, default=False)
    sms_response = Column(String(1000))
    email_response = Column(String(1000))
    whatsapp_response = Column(String(1000))
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    created_by = Column(Integer)
    updated_by = Column(Integer)


class CallFlow(Base):
    __tablename__ = "call_flow"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, index=True)
    language = Column(String(10))
    category = Column(String(255))
    type = Column(String(255))
    subtype = Column(String(255))
    subtype1 = Column(String(255))
    subtype2 = Column(String(255))
    resolution = Column(Text)



class SmsLogHistory(Base):
    __tablename__ = "sms_log_history"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(Integer, nullable=False)
    client_id = Column(Integer, nullable=False)

    phone = Column(String(20), nullable=False)
    message = Column(Text, nullable=False)

    template_id = Column(String(100))
    provider_status = Column(String(50))
    provider_response = Column(Text)

    created_at = Column(TIMESTAMP, server_default=func.now())


class EmailLogHistory(Base):
    __tablename__ = "email_log_history"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(Integer, nullable=False)
    client_id = Column(Integer, nullable=False)

    email = Column(String(255), nullable=False)
    subject = Column(String(255))
    body = Column(Text)

    provider_status = Column(String(50))
    provider_response = Column(Text)

    created_at = Column(TIMESTAMP, server_default=func.now())


class WhatsAppLogHistory(Base):
    __tablename__ = "whatsapp_log_history"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(Integer, nullable=False)
    client_id = Column(Integer, nullable=False)

    phone = Column(String(20), nullable=False)
    message = Column(Text)

    provider_status = Column(String(50))
    provider_response = Column(Text)

    created_at = Column(TIMESTAMP, server_default=func.now())
