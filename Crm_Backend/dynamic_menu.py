# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from sqlalchemy import text
# from database import get_db


# router = APIRouter()

# # Helper to build tree structure
# def build_menu_tree(rows):
#     """Build nested menu structure ordered by priority"""
#     tree = []
#     lookup = {row["id"]: {**row, "children": []} for row in rows}

#     for row in rows:
#         if row["parent_id"]:
#             parent = lookup.get(row["parent_id"])
#             if parent:
#                 parent["children"].append(lookup[row["id"]])
#         else:
#             tree.append(lookup[row["id"]])

#     # sort children by priority
#     def sort_children(node):
#         node["children"] = sorted(
#             node["children"], 
#             key=lambda x: (x.get("priority") is None, x.get("priority") or 0)
#         )
#         for child in node["children"]:
#             sort_children(child)

#     for item in tree:
#         sort_children(item)

#     return tree


# @router.get("/dynamic-menu/{company_id}")
# def get_dynamic_menu(company_id: int, db: Session = Depends(get_db)):
#     # 1. Get allowed pages from logincreation_master
#     rights_query = text("""
#         SELECT user_right FROM logincreation_master WHERE create_id = :company_id
#     """)
#     rights_row = db.execute(rights_query, {"company_id": company_id}).mappings().first()

#     if not rights_row or not rights_row["user_right"]:
#         raise HTTPException(status_code=404, detail="No menu rights found for this company")

#     allowed_ids = [int(x) for x in rights_row["user_right"].split(",") if x.strip().isdigit()]

#     if not allowed_ids:
#         raise HTTPException(status_code=403, detail="No valid page access")

#     # 2. Fetch pages from pages_master based on allowed_ids
#     query = text(f"""
#         SELECT id, page_name, page_url, parent_id, priority
#         FROM pages_master
#         WHERE id IN :ids
#         ORDER BY priority ASC
#     """)
#     rows = db.execute(query, {"ids": tuple(allowed_ids)}).mappings().all()

#     if not rows:
#         raise HTTPException(status_code=404, detail="No pages found for given rights")

#     # 3. Build tree
#     return build_menu_tree(rows)






 # Routes Used Here Pages in Prefix..///
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db

router = APIRouter(prefix="/pages", tags=["Pages"])

def build_menu_tree(rows):
    tree = []
    lookup = {row["id"]: {**row, "children": []} for row in rows}

    for row in rows:
        if row["parent_id"]:
            parent = lookup.get(row["parent_id"])
            if parent:
                parent["children"].append(lookup[row["id"]])
        else:
            tree.append(lookup[row["id"]])

    # sort by priority safely
    def sort_children(node):
        node["children"] = sorted(
            node["children"], 
            key=lambda x: x.get("priority") if x.get("priority") is not None else 0
        )
        for child in node["children"]:
            sort_children(child)

    for item in tree:
        sort_children(item)

    return tree


# @router.get("/dynamic-menu/{company_id}")
# def get_dynamic_menu(company_id: int, db: Session = Depends(get_db)):
#     # 1. Get allowed pages from logincreation_master
#     rights_query = text("""
#         SELECT user_right FROM logincreation_master WHERE create_id = :company_id
#     """)
#     rights_row = db.execute(rights_query, {"company_id": company_id}).mappings().first()

#     if not rights_row or not rights_row["user_right"]:
#         raise HTTPException(status_code=404, detail="No menu rights found for this company")

#     allowed_ids = [int(x) for x in rights_row["user_right"].split(",") if x.strip().isdigit()]

#     if not allowed_ids:
#         raise HTTPException(status_code=403, detail="No valid page access")

#     # 2. Fetch pages from pages_master based on allowed_ids
#     query = text(f"""
#         SELECT id, page_name, page_url, parent_id, priority
#         FROM pages_master
#         WHERE id IN :ids
#         ORDER BY priority ASC
#     """)
#     rows = db.execute(query, {"ids": tuple(allowed_ids)}).mappings().all()

#     if not rows:
#         raise HTTPException(status_code=404, detail="No pages found for given rights")

#     # 3. Build tree
#     return build_menu_tree(rows)




# @router.get("/dynamic-menu/{company_id}")
# def get_dynamic_menu(company_id: int, db: Session = Depends(get_db)):
#     # 🔹 Super-Admin: bypass rights, show ALL menus
#     if company_id == 0:   # 👈 special marker for superadmin
#         query = text("""
#             SELECT id, page_name, page_url, parent_id, priority
#             FROM pages_master
#             ORDER BY priority ASC
#         """)
#         rows = db.execute(query).mappings().all()
#         return build_menu_tree(rows)

#     # 🔹 Client: existing logic (unchanged)
#     rights_query = text("""
#         SELECT user_right FROM logincreation_master WHERE create_id = :company_id
#     """)
#     rights_row = db.execute(rights_query, {"company_id": company_id}).mappings().first()

#     if not rights_row or not rights_row["user_right"]:
#         raise HTTPException(status_code=404, detail="No menu rights found for this company")

#     allowed_ids = [int(x) for x in rights_row["user_right"].split(",") if x.strip().isdigit()]

#     if not allowed_ids:
#         raise HTTPException(status_code=403, detail="No valid page access")

#     query = text("""
#         SELECT id, page_name, page_url, parent_id, priority
#         FROM pages_master
#         WHERE id IN :ids
#         ORDER BY priority ASC
#     """)
#     rows = db.execute(query, {"ids": tuple(allowed_ids)}).mappings().all()

#     if not rows:
#         raise HTTPException(status_code=404, detail="No pages found for given rights")

#     return build_menu_tree(rows)




# Its Working For Super Admin with (companyId = 0) and Working For client with Company_id
@router.get("/dynamic-menu/{company_id}")
def get_dynamic_menu(company_id: int, db: Session = Depends(get_db)):
    """
    Get menu items:
      - Super Admin (company_id=0) → return ALL pages (flat, no tree).
      - Client → return only allowed pages (tree structure).
    """
    # ✅ Case 1: Super Admin (companyId = 0)
    if company_id == 0:
        query = text("""
            SELECT id, page_name, page_url, parent_id, priority
            FROM pages_master
            ORDER BY priority ASC
        """)
        rows = db.execute(query).mappings().all()

        if not rows:
            raise HTTPException(status_code=404, detail="No pages found")

        # Super Admin gets FLAT list (no parent-child nesting)
        return [dict(row) for row in rows]

    # ✅ Case 2: Client (companyId > 0)
    rights_query = text("""
        SELECT user_right FROM logincreation_master WHERE create_id = :company_id
    """)
    rights_row = db.execute(rights_query, {"company_id": company_id}).mappings().first()

    if not rights_row or not rights_row["user_right"]:
        raise HTTPException(status_code=404, detail="No menu rights found for this company")

    allowed_ids = [int(x) for x in rights_row["user_right"].split(",") if x.strip().isdigit()]
    if not allowed_ids:
        raise HTTPException(status_code=403, detail="No valid page access")

    # Ensure tuple format
    ids_tuple = tuple(allowed_ids) if len(allowed_ids) > 1 else (allowed_ids[0],)

    query = text("""
        SELECT id, page_name, page_url, parent_id, priority
        FROM pages_master
        WHERE id IN :ids
        ORDER BY priority ASC
    """)
    rows = db.execute(query, {"ids": ids_tuple}).mappings().all()

    if not rows:
        raise HTTPException(status_code=404, detail="No pages found for given rights")

    return build_menu_tree(rows)
