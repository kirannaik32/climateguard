import requests
import os
from supabase import create_client
from dotenv import load_dotenv
from datetime import date

load_dotenv()

# Connect to Supabase
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase = create_client(url, key)

# Districts list
districts = [
    {"district_name": "Bengaluru",   "state_name": "Karnataka",    "latitude": 12.97, "longitude": 77.59},
    {"district_name": "Chennai",     "state_name": "Tamil Nadu",   "latitude": 13.08, "longitude": 80.27},
    {"district_name": "Mumbai",      "state_name": "Maharashtra",  "latitude": 19.07,