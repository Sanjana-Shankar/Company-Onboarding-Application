# backend/app/main.py
from fastapi import FastAPI
from app.api import chat, onboarding, feedback, health, composio
from app.core.config import settings

app = FastAPI(title="Onboarding AI")

app.include_router(health.router)
app.include_router(composio.router) 
#app.include_router(chat.router, prefix="/chat")
#app.include_router(onboarding.router, prefix="/onboarding")
#app.include_router(feedback.router, prefix="/feedback")

# optional: sanity check at startup
@app.get("/health/config")
def config_health():
    return {"gmail_auth_config_id_set": bool(settings.COMPOSIO_GMAIL_AUTH_CONFIG_ID)}
