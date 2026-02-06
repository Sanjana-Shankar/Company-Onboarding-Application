from fastapi import APIRouter, HTTPException
import httpx
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
    user_id = "user_123"  # TODO: replace with real logged-in user id

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
        # IMPORTANT: return the real status + body from Composio for debugging
        raise HTTPException(status_code=r.status_code, detail=r.text)

    return r.json()
