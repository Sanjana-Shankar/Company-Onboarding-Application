# agi_runtime.py
from __future__ import annotations

import os
import time
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

import requests

BASE_URL = os.getenv("AGI_BASE_URL", "https://api.agi.tech/v1")
DEFAULT_AGENT_NAME = os.getenv("AGI_AGENT_NAME", "agi-0")

POLL_INTERVAL_SECONDS = float(os.getenv("AGI_POLL_INTERVAL_SECONDS", "1.0"))
STATUS_TIMEOUT_SECONDS = float(os.getenv("AGI_TIMEOUT_SECONDS", "90"))

class AGIError(RuntimeError):
    pass

@dataclass
class AGIAgentSession:
    session_id: str
    agent_name: str = DEFAULT_AGENT_NAME
    vnc_url: Optional[str] = None
    document_text: str = ""
    api_key: str = field(default="", repr=False)

    def delete(self) -> None:
        if not self.session_id:
            return
        _request("DELETE", f"/sessions/{self.session_id}", api_key=self.api_key)

def _get_api_key(explicit_api_key: Optional[str] = None) -> str:
    api_key = explicit_api_key or os.getenv("AGI_API_KEY")
    if not api_key:
        raise AGIError("AGI_API_KEY not set (export AGI_API_KEY or pass api_key=).")
    return api_key

def _request(method: str, path: str, api_key: str, json: Optional[Dict[str, Any]] = None, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    url = f"{BASE_URL}{path}"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    resp = requests.request(method, url, headers=headers, json=json, params=params, timeout=60)
    if resp.status_code >= 400:
        raise AGIError(f"AGI API error {resp.status_code}: {resp.text}")
    if not resp.text or not resp.text.strip():
        return {}
    return resp.json()

def create_document_agent(agent_name: str = DEFAULT_AGENT_NAME, api_key: Optional[str] = None) -> AGIAgentSession:
    key = _get_api_key(api_key)
    data = _request("POST", "/sessions", api_key=key, json={"agent_name": agent_name})
    # Quickstart shows 'session_id' in response.
    session_id = data.get("session_id") or data.get("id") or data.get("sessionId")
    if not session_id:
        raise AGIError(f"Unexpected create session response: {data}")
    vnc = data.get("vnc_url") or data.get("vncUrl")
    return AGIAgentSession(session_id=session_id, agent_name=agent_name, vnc_url=vnc, api_key=key)

def extract_document(agent: AGIAgentSession, file_bytes: bytes) -> None:
    """
    Best-effort local extraction (PDF -> text). Keeps result in agent.document_text.
    This text will be included in the message sent to the agent.
    """
    text = ""
    try:
        from pypdf import PdfReader
        import io
        reader = PdfReader(io.BytesIO(file_bytes))
        pages: List[str] = []
        for p in reader.pages:
            pt = p.extract_text() or ""
            if pt.strip():
                pages.append(pt)
        text = "\n\n".join(pages).strip()
    except Exception:
        # fallback: silent, keep text empty
        text = ""
    # Bound the size to avoid huge payloads
    max_chars = int(os.getenv("AGI_MAX_DOC_CHARS", "20000"))
    if len(text) > max_chars:
        text = text[:max_chars] + "\n\n[TRUNCATED]"
    agent.document_text = text

'''
def run_agent(agent: AGIAgentSession, prompt: str) -> str:
    """
    Flow:
      1) POST /sessions/{id}/message  with the prompt (and doc context if available)
      2) Poll /sessions/{id}/status until status == "finished" or "error" or timeout
      3) GET /sessions/{id}/messages?after_id=0 and return the first DONE message content
      4) (caller may call agent.delete() or we can auto-delete here)
    """
    if agent.document_text and agent.document_text.strip():
        full_message = (
            "You are an assistant answering user questions using the document below.\n\n"
            "DOCUMENT CONTEXT:\n"
            f"{agent.document_text}\n\n"
            "USER QUESTION:\n"
            f"{prompt}\n\n"
            "Answer concisely and, when relevant, quote short snippets from the document."
        )
    else:
        full_message = prompt

    # Send message to start the task
    _request("POST", f"/sessions/{agent.session_id}/message", api_key=agent.api_key, json={"message": full_message})

    # Poll status endpoint (Quickstart shows /sessions/{id}/status)
    deadline = time.time() + STATUS_TIMEOUT_SECONDS
    while time.time() < deadline:
        status_obj = _request("GET", f"/sessions/{agent.session_id}/status", api_key=agent.api_key)
        status = (status_obj.get("status") or "").lower()
        # status commonly: "running", "finished", "error", etc.
        if status == "finished":
            break
        if status == "error":
            raise AGIError(f"AGI session ended with error: {status_obj}")
        time.sleep(POLL_INTERVAL_SECONDS)
    else:
        raise AGIError("Timed out waiting for AGI session to finish.")

    # Fetch messages and return the first DONE content
    messages_obj = _request("GET", f"/sessions/{agent.session_id}/messages", api_key=agent.api_key, params={"after_id": 0})
    messages = messages_obj.get("messages", []) or []
    # Look for type == "DONE"
    for m in messages:
        if (m.get("type") or "").upper() == "DONE":
            content = m.get("content")
            if isinstance(content, (dict, list)):
                import json as _json
                return _json.dumps(content, ensure_ascii=False)
            return str(content)
    # If no DONE message found, return a reasonable fallback
    raise AGIError("No DONE message found in AGI messages.")
'''
'''
def run_agent(agent: AGIAgentSession, prompt: str) -> str:
    if agent.document_text.strip():
        full_message = (
            "You are answering questions using the following document context.\n\n"
            "DOCUMENT CONTEXT:\n"
            f"{agent.document_text}\n\n"
            "QUESTION:\n"
            f"{prompt}\n\n"
            "Answer succinctly and cite snippets from the context when possible."
        )
    else:
        full_message = prompt

    # 1) Send message (start work)
    resp = _request(
        "POST",
        f"/sessions/{agent.session_id}/message",
        api_key=agent.api_key,
        json={"message": full_message},
    )

    after_id = 0
    deadline = time.time() + STATUS_TIMEOUT_SECONDS

    terminal_statuses = {"finished", "completed", "complete", "done", "succeeded", "success", "error", "failed"}

    last_status_obj = None

    while time.time() < deadline:
        # 2) Check messages first (DONE is the strongest signal)
        msg_obj = _request(
            "GET",
            f"/sessions/{agent.session_id}/messages",
            api_key=agent.api_key,
            params={"after_id": after_id, "sanitize": True},
        )
        messages = msg_obj.get("messages", []) or []

        for m in messages:
            mid = m.get("id", 0) or 0
            after_id = max(after_id, mid)
            mtype = (m.get("type") or "").upper()
            content = m.get("content")

            if mtype == "ERROR":
                raise AGIError(f"AGI ERROR message: {content}")

            if mtype == "DONE":
                if isinstance(content, (dict, list)):
                    import json as _json
                    return _json.dumps(content, ensure_ascii=False)
                return str(content)

        # 3) Poll status too (for early error detection)
        last_status_obj = _request(
            "GET",
            f"/sessions/{agent.session_id}/status",
            api_key=agent.api_key,
        )
        status = (last_status_obj.get("status") or "").lower()

        if status in {"error", "failed"}:
            raise AGIError(f"AGI status indicates failure: {last_status_obj}")

        # If status looks terminal but no DONE message yet, keep polling briefly
        if status in terminal_statuses and status not in {"error", "failed"}:
            # allow a couple extra polls for DONE to appear
            time.sleep(POLL_INTERVAL_SECONDS)
        else:
            time.sleep(POLL_INTERVAL_SECONDS)

    raise AGIError(
        "Timed out waiting for AGI session to finish. "
        f"Last status payload: {last_status_obj}"
    )
'''
def run_agent(agent: AGIAgentSession, prompt: str) -> str:
    """
    Sends a message to an existing session and returns:
      - DONE content when available
      - If status becomes waiting_for_input, returns the latest assistant message (clarification request)
    """

    # --- Build full_message (THIS fixes your NameError) ---
    if getattr(agent, "document_text", "").strip():
        full_message = (
            "You are answering questions using the following document context.\n\n"
            "DOCUMENT CONTEXT:\n"
            f"{agent.document_text}\n\n"
            "QUESTION:\n"
            f"{prompt}\n\n"
            "If you need more info, ask a single clarification question."
        )
    else:
        full_message = prompt

    # 1) Send message to start/continue the session
    _request(
        "POST",
        f"/sessions/{agent.session_id}/message",
        api_key=agent.api_key,
        json={"message": full_message},
    )

    after_id = 0
    deadline = time.time() + STATUS_TIMEOUT_SECONDS
    last_status_obj = None
    last_non_done_text = None

    while time.time() < deadline:
        # 2) Read messages (DONE is the strongest completion signal)
        msg_obj = _request(
            "GET",
            f"/sessions/{agent.session_id}/messages",
            api_key=agent.api_key,
            params={"after_id": after_id, "sanitize": True},
        )
        messages = msg_obj.get("messages", []) or []

        for m in messages:
            mid = m.get("id", 0) or 0
            after_id = max(after_id, mid)

            mtype = (m.get("type") or "").upper()
            content = m.get("content")

            if mtype == "ERROR":
                raise AGIError(f"AGI ERROR message: {content}")

            if mtype == "DONE":
                if isinstance(content, (dict, list)):
                    import json as _json
                    return _json.dumps(content, ensure_ascii=False)
                return str(content)

            # Keep last assistant text in case we hit waiting_for_input
            if isinstance(content, str) and content.strip():
                last_non_done_text = content.strip()

        # 3) Check status (useful for detecting waiting_for_input)
        last_status_obj = _request(
            "GET",
            f"/sessions/{agent.session_id}/status",
            api_key=agent.api_key,
        )
        status = (last_status_obj.get("status") or "").lower()

        if status in {"error", "failed"}:
            raise AGIError(f"AGI status indicates failure: {last_status_obj}")

        if status == "waiting_for_input":
            # The agent is asking a follow-up. Return it to the user instead of timing out.
            if last_non_done_text:
                return last_non_done_text
            return "The assistant needs more information. Please rephrase or provide more details."

        time.sleep(POLL_INTERVAL_SECONDS)

    raise AGIError(
        "Timed out waiting for AGI session to finish. "
        f"Last status payload: {last_status_obj}"
    )


def generate_id():
    import uuid
    return str(uuid.uuid4())[:8]

