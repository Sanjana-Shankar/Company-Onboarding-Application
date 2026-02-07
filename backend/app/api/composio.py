from fastapi import APIRouter, HTTPException, Body
import httpx
import asyncio
from app.core.config import settings

router = APIRouter(prefix="/composio", tags=["composio"])

@router.get("/health")
def composio_config_check():
    return {
        "has_api_key": bool(settings.COMPOSIO_API_KEY),
        "has_gmail_auth_config_id": bool(settings.COMPOSIO_GMAIL_AUTH_CONFIG_ID),
        "callback_url": settings.COMPOSIO_CALLBACK_URL,
    }

@router.post("/gmail/connect")
async def gmail_connect():
    user_id = "user_123"  # TODO: replace with real logged-in user id later

    payload = {
        "user_id": user_id,
        "auth_config_id": settings.COMPOSIO_GMAIL_AUTH_CONFIG_ID,
        "callback_url": settings.COMPOSIO_CALLBACK_URL,
    }

    headers = {
        "x-api-key": settings.COMPOSIO_API_KEY.strip(),
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(
            "https://backend.composio.dev/api/v3/connected_accounts/link",
            json=payload,
            headers=headers,
        )

    if r.status_code >= 400:
        raise HTTPException(status_code=r.status_code, detail=r.text)

    return r.json()

@router.post("/finalize")
async def finalize(payload: dict = Body(...)):
    connected_account_id = payload.get("connected_account_id")
    if not connected_account_id:
        raise HTTPException(status_code=400, detail="connected_account_id is required")

    headers = {
        "x-api-key": settings.COMPOSIO_API_KEY.strip(),
        "Content-Type": "application/json",
    }

    url = f"https://backend.composio.dev/api/v3/connected_accounts/{connected_account_id}"

    async with httpx.AsyncClient(timeout=30) as client:
        # poll a few times because OAuth completion can take a moment
        for _ in range(20):
            r = await client.get(url, headers=headers)
            if r.status_code >= 400:
                raise HTTPException(status_code=r.status_code, detail=r.text)

            acc = r.json()
            state = (acc.get("status") or acc.get("lifecycle") or "").upper()
            if state in ("ACTIVE", "CONNECTED", "READY"):
                return {"status": state, "connected_account": acc}

            await asyncio.sleep(1)

    raise HTTPException(status_code=408, detail="Timed out waiting for connection to become active")
