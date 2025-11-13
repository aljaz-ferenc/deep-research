import os

ORIGIN_URL=os.getenv("ORIGIN_URL")
MONGO_URI=os.getenv("MONGO_URI")

if not ORIGIN_URL or not MONGO_URI:
    raise Exception("Missing ORIGIN_URL or MONGO_URI")