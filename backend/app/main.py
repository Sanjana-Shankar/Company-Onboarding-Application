# backend/app/main.py
from __future__ import annotations
from dotenv import load_dotenv
import os
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel

# IMPORTANT:
# - If you're running with: uvicorn app.main:app
#   then "app" is a top-level package inside backend/
#   so these imports should work.

# If chatbot.py is at backend/chatbot.py, this import works when running from backend/
from app.api.chatbot_agi import initialize_chatbot, handle_user_query

#load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))
#load_dotenv()

app = FastAPI(title="Onboarding AI")

# -----------------------
# Routers
# -----------------------
# Health usually should not have a prefix
#app.include_router(health.router)

# Add prefixes for grouped APIs
#app.include_router(onboarding.router, prefix="/onboarding", tags=["onboarding"])
#app.include_router(feedback.router, prefix="/feedback", tags=["feedback"])


app = FastAPI()
SESSIONS = {}

class Question(BaseModel):
    session_id: str
    user_id: str
    question: str


@app.post("/chatbot/upload")
async def upload(file: UploadFile = File(...)):
    file_bytes = await file.read()
    agent = initialize_chatbot(file_bytes)

    session_id = agent.agent_id
    SESSIONS[session_id] = agent

    return {"session_id": session_id}


@app.post("/chatbot/ask")
async def ask(payload: Question):
    agent = SESSIONS.get(payload.session_id)
    if not agent:
        return {"error": "Invalid session"}

    response = handle_user_query(
        agent,
        payload.user_id,
        payload.question
    )
    return {"answer": response}
