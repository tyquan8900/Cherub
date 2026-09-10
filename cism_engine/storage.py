from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict


DEFAULT_STATE: Dict[str, Any] = {
    "sessions": [],
    "question_stats": {},
    "domain_stats": {str(i): {"attempted": 0, "correct": 0, "confidence_sum": 0} for i in range(1, 5)},
    "current_session": None,
}


class ProgressStore:
    def __init__(self, path: str = "data/progress.json") -> None:
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        if not self.path.exists():
            self.save(DEFAULT_STATE.copy())

    def load(self) -> Dict[str, Any]:
        try:
            return json.loads(self.path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            return DEFAULT_STATE.copy()

    def save(self, state: Dict[str, Any]) -> None:
        self.path.write_text(json.dumps(state, indent=2), encoding="utf-8")

    def record_attempt(self, question_id: str, domain: int, correct: bool, confidence: int) -> None:
        state = self.load()
        qstats = state.setdefault("question_stats", {}).setdefault(
            question_id,
            {"attempted": 0, "correct": 0, "confidence_sum": 0},
        )
        qstats["attempted"] += 1
        qstats["correct"] += int(correct)
        qstats["confidence_sum"] += confidence

        dstats = state.setdefault("domain_stats", {}).setdefault(
            str(domain), {"attempted": 0, "correct": 0, "confidence_sum": 0}
        )
        dstats["attempted"] += 1
        dstats["correct"] += int(correct)
        dstats["confidence_sum"] += confidence
        self.save(state)

    def start_session(self, session: Dict[str, Any]) -> None:
        state = self.load()
        state["current_session"] = session
        self.save(state)

    def update_current_session(self, session: Dict[str, Any]) -> None:
        state = self.load()
        state["current_session"] = session
        self.save(state)

    def complete_current_session(self) -> None:
        state = self.load()
        current = state.get("current_session")
        if current:
            state.setdefault("sessions", []).append(current)
            state["current_session"] = None
            self.save(state)
