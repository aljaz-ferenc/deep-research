import os
from dotenv import load_dotenv

load_dotenv()

ORIGIN_URL = os.getenv("ORIGIN_URL")
MONGO_URI = os.getenv("MONGO_URI")
DAILY_LIMIT = 3

if not ORIGIN_URL or not MONGO_URI:
    raise Exception("Missing ORIGIN_URL or MONGO_URI")
