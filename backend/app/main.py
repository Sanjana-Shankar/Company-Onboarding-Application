# backend/app/main.py
from fastapi import FastAPI
from app.api import chat, onboarding, feedback, health

app = FastAPI(title="Onboarding AI")

app.include_router(health.router)
app.include_router(chat.router, prefix="/chat")
app.include_router(onboarding.router, prefix="/onboarding")
app.include_router(feedback.router, prefix="/feedback")