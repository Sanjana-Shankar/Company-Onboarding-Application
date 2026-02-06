# backend/app/main.py
from fastapi import FastAPI, UploadFile, File
from app.api import chat, onboarding, feedback, health
from pydantic import BaseModel
from chatbot import initialize_chatbot, handle_user_query


app = FastAPI(title="Onboarding AI")

app.include_router(health.router)
app.include_router(chat.router, prefix="/chat")
app.include_router(onboarding.router, prefix="/onboarding")
app.include_router(feedback.router, prefix="/feedback")

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
