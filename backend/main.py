from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

origin_url = os.getenv("ORIGIN_URL")

if origin_url is None:
    raise HTTPException(status_code=500, detail="Missing ORIGIN_URL environment variable")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class ResearchInput(BaseModel):
    query: str

@app.post('/api/v1/research')
async def start_research(body: ResearchInput) -> str:
    query = body.query
    print(f"QUERY: {query}")
    return query