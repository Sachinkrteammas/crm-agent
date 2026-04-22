from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv


load_dotenv()

SQL_DB_URL = os.getenv("SQL_DB_URL")




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



SQL_DB_URL5 = os.getenv("SQL_DB_URL5")


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