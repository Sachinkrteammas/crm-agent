from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Your MySQL connection string
SQL_DB_URL = "mysql+pymysql://root:dial%40mas123@192.168.10.12/db_dialdesk?charset=utf8mb4"
# SQL_DB_URL = "mysql+pymysql://root:vicidialnow@192.168.11.236/db_dialdesk?charset=utf8mb4"



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




SQL_DB_URL5 = "mysql+pymysql://root:vicidialnow@192.168.10.5/asterisk?charset=utf8mb4"

engine5 = create_engine(SQL_DB_URL5)
SessionLocal5 = sessionmaker(bind=engine5)

def get_db5():
    db = SessionLocal5()
    try:
        yield db
    finally:
        db.close()



# ---------- Raw Access (Better than yield-based) ----------
def get_engine():
    return engine


def get_engine5():
    return engine5