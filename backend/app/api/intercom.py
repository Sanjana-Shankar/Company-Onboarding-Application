#intercom.py
import os
import requests
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
load_dotenv()


class IntercomClient:
    def __init__(self):
        # Use one consistent env name
        self.token = os.getenv("INTERCOM_ACCESS_TOKEN")
        if not self.token:
            raise RuntimeError("Missing INTERCOM_ACCESS_TOKEN")

        self.base = os.getenv("INTERCOM_API_BASE", "https://api.intercom.io").rstrip("/")
        self.from_type = os.getenv("INTERCOM_FROM_TYPE")
        self.from_id = os.getenv("INTERCOM_FROM_ID")

        if not self.from_type or not self.from_id:
            raise RuntimeError("Missing INTERCOM_FROM_TYPE or INTERCOM_FROM_ID")

        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        })

    def _extract_conversation_id(self, resp: Dict[str, Any]) -> str:
        # In your successful curl, response was a user_message with conversation_id
        cid = resp.get("conversation_id")
        if cid:
            return str(cid)

        # Fallbacks (some endpoints return conversation object with id)
        if resp.get("type") == "conversation" and resp.get("id"):
            return str(resp["id"])

        # Sometimes message objects include a nested conversation
        conv = resp.get("conversation")
        if isinstance(conv, dict) and conv.get("id"):
            return str(conv["id"])

        return ""

    def create_doc_gap(
        self,
        question: str,
        signal_count: int,
        sources: List[str],
        confidence: str,
        decision_reason: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Creates an Intercom conversation/message to escalate a doc gap.

        signal_count = how many times this issue was detected (downvotes or 'stuck' signals).
        """
        url = f"{self.base}/conversations"

        lines = [
            "🚨 Doc gap detected",
            "",
            f"Question: {question}",
            f"Triggered by: {signal_count} signals",
            f"Agent confidence: {confidence}",
        ]
        if decision_reason:
            lines += ["", f"Reason: {decision_reason}"]

        lines += [
            "",
            "Sources tried:",
            *[f"- {s}" for s in sources[:5]],
        ]

        payload = {
            "from": {"type": self.from_type, "id": self.from_id},
            "body": "\n".join(lines),
        }

        r = self.session.post(url, json=payload, timeout=15)
        try:
            r.raise_for_status()
        except requests.HTTPError as e:
            # Attach Intercom error payload (super helpful in hacks)
            raise RuntimeError(f"Intercom error {r.status_code}: {r.text}") from e

        raw = r.json()
        return {
            "raw": raw,
            "conversation_id": self._extract_conversation_id(raw),
        }
