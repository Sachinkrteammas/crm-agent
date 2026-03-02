from sqlalchemy import create_engine, text
from passlib.context import CryptContext

# DB Setup
engine = create_engine(
    "mysql+pymysql://root:vicidialnow@192.168.11.236/db_dialdesk?charset=utf8mb4"
)

# Bcrypt setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Fetch and hash all
with engine.connect() as conn:
    result = conn.execute(text("SELECT id, password FROM tbl_user"))
    for row in result.mappings():
        plain_pw = row["password"]

        # Only hash if password exists and not empty
        if plain_pw:
            hashed_pw = pwd_context.hash(plain_pw)

            # ✅ Update hash_password column (not overwriting password)
            update_stmt = text("""
                UPDATE tbl_user 
                SET hash_password = :hpw 
                WHERE id = :id
            """)
            conn.execute(update_stmt, {"hpw": hashed_pw, "id": row["id"]})

    conn.commit()

print("✅ Password migration completed. Hashed values stored in hash_password column.")
