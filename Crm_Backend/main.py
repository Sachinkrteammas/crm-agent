from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from assist_service import assist_router
from auth import router as auth_router
from reports import router as reports_router
from core_api import router as core_api
from call_master import router as call_master_router
from dashboard import router as dashboard_router
from agents import router as agents_router
from real_time_agents import router as real_time_agents_router
from plan import router as plan_router
from company import router as company_router





app = FastAPI(title="CRM Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(reports_router, prefix="/report", tags=["Reports"])
app.include_router(core_api, prefix="/core_api", tags=["core_api"])
app.include_router(call_master_router, prefix="/call", tags=["Call Master"])
app.include_router(dashboard_router, prefix="/dashboard", tags=["Home2"])
app.include_router(agents_router, prefix="/agents", tags=["Agents"])
app.include_router(real_time_agents_router, prefix="/real_time_agents", tags=["Real Time Agents"])
app.include_router(plan_router, prefix="/plan", tags=["Plan Management"])
app.include_router(company_router, prefix="/company", tags=["Company Management"])



app.include_router(assist_router, prefix="", tags=["Assist Router"])
