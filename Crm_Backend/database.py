from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Your MySQL connection string
# SQL_DB_URL = "mysql+pymysql://root:dial%40mas123@192.168.10.12/db_dialdesk?charset=utf8mb4"
SQL_DB_URL = "mysql+pymysql://root:vicidialnow@192.168.11.236/db_dialdesk?charset=utf8mb4"



# SQLAlchemy engine with echo for debugging
engine = create_engine(SQL_DB_URL, echo=True)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base for potential future models
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



SQL_DB_URL2 = "mysql+pymysql://root:vicidialnow@192.168.11.236/db_dialdesk?charset=utf8mb4"
engine2 = create_engine(SQL_DB_URL2)
SessionLocal2 = sessionmaker(bind=engine2)

def get_db2():
    db = SessionLocal2()
    try:
        yield db
    finally:
        db.close()

SQL_DB_URL3 = "mysql+pymysql://root:vicidialnow@192.168.11.236/db_dialdesk?charset=utf8mb4"

engine3 = create_engine(SQL_DB_URL3)
SessionLocal3 = sessionmaker(bind=engine3)

def get_db3():
    db = SessionLocal3()
    try:
        yield db
    finally:
        db.close()



SQL_DB_URL4 = "mysql+pymysql://root:vicidialnow@192.168.11.236/db_dialdesk?charset=utf8mb4"

engine4 = create_engine(SQL_DB_URL4)
SessionLocal4 = sessionmaker(bind=engine4)

def get_db4():
    db = SessionLocal4()
    try:
        yield db
    finally:
        db.close()



# ---------- Raw Access (Better than yield-based) ----------
def get_engine():
    return engine

def get_engine2():
    return engine2


def get_engine3():
    return engine3

def get_engine4():
    return engine4