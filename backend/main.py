from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# Allow React frontend to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase connection
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

# Route 1 — Get all districts
@app.get("/districts")
def get_districts():
    result = supabase.table("districts").select("*").execute()
    return result.data

# Route 2 — Get latest risk scores
@app.get("/risk-scores")
def get_risk_scores():
    result = supabase.table("risk_scores")\
        .select("*, districts(district_name, state_name, latitude, longitude)")\
        .order("recorded_at", desc=True)\
        .limit(50)\
        .execute()
    return result.data

# Route 3 — Get risk score for one district
@app.get("/risk-scores/{district_id}")
def get_district_risk(district_id: int):
    result = supabase.table("risk_scores")\
        .select("*")\
        .eq("district_id", district_id)\
        .order("recorded_at", desc=True)\
        .limit(10)\
        .execute()
    return result.data

# Route 4 — Health check
@app.get("/")
def root():
    return {"message": "ClimateGuard API is running 🚀"}