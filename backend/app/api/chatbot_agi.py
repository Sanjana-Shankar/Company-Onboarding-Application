# chatbot.py
from __future__ import annotations
from dotenv import load_dotenv
load_dotenv()
from app.api.intercom import IntercomClient

import time
import re
from dataclasses import dataclass, field
from collections import defaultdict, deque
from difflib import SequenceMatcher
from typing import Deque, Dict, List, Tuple

from app.api.agi_runtime import create_document_agent, extract_document, run_agent
#from app.api.intercom import create_doc_gap, escalate_doc_gap_to_intercom
from app.api.intercom import IntercomClient

# --- Tunables ---
SIMILARITY_THRESHOLD = 0.72       # how similar two queries must be to count as "same issue"
REPEAT_COUNT_THRESHOLD = 3        # how many similar queries trigger onboarding_help
WINDOW_SECONDS = 10 * 60          # lookback window (10 minutes)
MIN_QUERY_LEN = 12               # ignore very short messages for similarity-based escalation

# Optional: keep the old keywords as a *weak* signal, not the primary classifier.
ONBOARDING_KEYWORDS = ["cannot finish", "stuck", "can't complete", "step"]


def initialize_chatbot(file_bytes: bytes):
    agent = create_document_agent()
    extract_document(agent, file_bytes)
    return agent


# ----------------------------
# Similarity + frequency tracker
# ----------------------------

def _normalize(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"\s+", " ", text)
    return text

def _tokenize(text: str) -> List[str]:
    # Simple tokenizer: words/numbers, dropping 1-char tokens.
    return [t for t in re.findall(r"[a-z0-9]+", text.lower()) if len(t) > 1]

def _jaccard(a: List[str], b: List[str]) -> float:
    sa, sb = set(a), set(b)
    if not sa and not sb:
        return 1.0
    if not sa or not sb:
        return 0.0
    return len(sa & sb) / len(sa | sb)

def _similarity(q1: str, q2: str) -> float:
    """
    Combine token Jaccard + character-based similarity.
    This is lightweight and doesn't require embeddings or extra services.
    """
    n1, n2 = _normalize(q1), _normalize(q2)
    t1, t2 = _tokenize(n1), _tokenize(n2)

    jac = _jaccard(t1, t2)
    seq = SequenceMatcher(None, n1, n2).ratio()

    # Weighted blend (tune as needed)
    return 0.6 * jac + 0.4 * seq


@dataclass
class UserQueryHistory:
    # store (timestamp, normalized_text, original_text)
    items: Deque[Tuple[float, str, str]] = field(default_factory=deque)

    def add(self, text: str) -> None:
        now = time.time()
        norm = _normalize(text)
        self.items.append((now, norm, text))
        self._prune(now)

    def _prune(self, now: float) -> None:
        cutoff = now - WINDOW_SECONDS
        while self.items and self.items[0][0] < cutoff:
            self.items.popleft()

    def count_similar(self, text: str) -> int:
        """
        Count how many recent queries are similar to `text`.
        """
        now = time.time()
        self._prune(now)
        if len(text.strip()) < MIN_QUERY_LEN:
            return 0

        count = 0
        for _, _, prev_original in self.items:
            if _similarity(text, prev_original) >= SIMILARITY_THRESHOLD:
                count += 1
        return count


# In-memory store. In production, replace with Redis / DB so it survives restarts.
_QUERY_HISTORY: Dict[str, UserQueryHistory] = defaultdict(UserQueryHistory)


def classify_intent(user_id: str, question: str) -> str:
    """
    Frequency-of-similar-queries classifier.

    Returns:
      - "onboarding_help" if user repeats similar queries enough within the time window
      - otherwise "document_qa"
    """
    hist = _QUERY_HISTORY[user_id]
    similar_count = hist.count_similar(question)

    # Optional: keep keywords as an immediate trigger, but not required.
    q = question.lower()
    keyword_hit = any(k in q for k in ONBOARDING_KEYWORDS)

    # Escalate if repeated similar queries OR keyword hit + repeatiness
    if similar_count >= REPEAT_COUNT_THRESHOLD or (keyword_hit and similar_count >= 2):
        return "onboarding_help"
    return "document_qa"

intercom = IntercomClient()

def escalate_doc_gap_to_intercom(
    question: str,
    sources: list[str],
    confidence: str,
    decision_reason: str,
    signal_count: int = 1
) -> str:
    res = intercom.create_doc_gap(
        question=question,
        signal_count=signal_count,
        sources=sources,
        confidence=confidence,
        decision_reason=decision_reason,
    )  
    return res["conversation_id"]

def handle_user_query(agent, user_id: str, question: str):
    # log the query first (existing behavior)
    _QUERY_HISTORY[user_id].add(question)

    intent = classify_intent(user_id, question)

    # Existing onboarding escalation (unchanged)
    if intent == "onboarding_help":
        # ... existing onboarding code ...
        return "...ticket sent..."

    # Normal document Q&A (this should return a structured result)
    answer = run_agent(agent, question)
    # answer is expected to be an object with .text, .sources (list), .confidence (str), .decision_reason (optional)

    # ---- DOC GAP DECISION POINT ----
    is_doc_gap = (
        (hasattr(answer, "confidence") and getattr(answer, "confidence") == "low")
        or (not getattr(answer, "sources", None))
        or (getattr(answer, "decision_reason", None) == "no_relevant_docs")
    )

    if is_doc_gap:
        # count signals (how many similar queries in window)
        signals = _QUERY_HISTORY[user_id].count_similar(question)

        # Create the Intercom ticket using your Intercom client directly
        try:
            ic = IntercomClient()
            res = ic.create_doc_gap(
                question=question,
                signal_count=signals,
                sources=getattr(answer, "sources", []) or [],
                confidence=getattr(answer, "confidence", "low"),
                decision_reason=getattr(answer, "decision_reason", None),
            )

            conversation_id = res.get("conversation_id")  # created by create_doc_gap
            # Return a helpful testing response containing the conv id
            return (
                "I couldn’t find a clear answer in our documentation. "
                "I’ve flagged this for the docs team so we can improve it. "
                f"(intercom_conversation_id={conversation_id})"
            )

        except Exception as e:
            # Log the error (print/logging depending on your stack) and return fallback message
            # (Do NOT leak stack traces in production responses — this is dev/testing friendly)
            print("Failed to create intercom doc gap:", repr(e))
            return (
                "I couldn’t find a clear answer in our documentation. "
                "I tried to create a ticket for the docs team but it failed."
            )

    # Normal successful answer
    return getattr(answer, "text", str(answer))

'''
def handle_user_query(agent, user_id: str, question: str):
    _QUERY_HISTORY[user_id].add(question)

    intent = classify_intent(user_id, question)

    # Existing onboarding escalation
    if intent == "onboarding_help":
        ...
        return "...ticket sent..."

    # Normal document Q&A
    answer = run_agent(agent, question)

    # ---- DOC GAP DECISION POINT ----
    is_doc_gap = (
        answer.confidence == "low"
        or not answer.sources
        or answer.decision_reason == "no_relevant_docs"
    )

    if is_doc_gap:
        conversation_id = escalate_doc_gap_to_intercom(
            question=question,
            sources=answer.sources,
            confidence=answer.confidence,
            decision_reason=answer.decision_reason,
            signal_count=_QUERY_HISTORY[user_id].count_similar(question),
        )

        return (
            "I couldn’t find a clear answer in our documentation. "
            "I’ve flagged this for the docs team so we can improve it."
        )

    return answer.text
'''

def extract_step_number(text: str) -> str:
    match = re.search(r"step\s*(\d+)", text.lower())
    return match.group(1) if match else "unknown"