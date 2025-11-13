import os
from dotenv import load_dotenv

load_dotenv()

ORIGIN_URL = os.getenv("ORIGIN_URL")
MONGO_URI = os.getenv("MONGO_URI")
DAILY_LIMIT = 3
NUM_OF_QUERIES=os.getenv("NUM_OF_QUERIES")
REPORT_WORD_COUNT=os.getenv("REPORT_WORD_COUNT")

if not ORIGIN_URL or not MONGO_URI or not DAILY_LIMIT or not NUM_OF_QUERIES or not REPORT_WORD_COUNT:
    raise Exception("Missing environment variables in config.py")
