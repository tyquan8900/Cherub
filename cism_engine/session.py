from __future__ import annotations

import random
from dataclasses import asdict
from datetime import datetime, timezone
from typing import Dict, List

from .config import DOMAINS
from .question_bank import Question, all_questions
from .storage import ProgressStore


class SessionEngine:
    def __init__(self, store: ProgressStore | None = None) -> None:
        self.store = store or ProgressStore()

    def _weighted_counts(self, total: int) -> Dict[int, int]:
        raw = {d: total * cfg["weight"] for d, cfg in DOMAINS.items()}
        counts = {d: int(v) for d, v in raw.items()}
        remainder = total - sum(counts.values())
        order = sorted(raw, key=lambda d: raw[d] - counts[d], reverse=True)
        for d in order[:remainder]:
            counts[d] += 1
        return counts

    def _sample_domain(self, pool: List[Question], count: int, rng: random.Random) -> List[Question]:
        if not pool or count <= 0:
            return []
        if count <= len(pool):
            return rng.sample(pool, count)
        # Allow a large exam immediately while the original bank is still growing.
        # Repeated concepts are shuffled; generated variants will replace this fallback over time.
        out: List[Question] = []
        while len(out) < count:
            cycle = list(pool)
            rng.shuffle(cycle)
            out.extend(cycle)
        return out[:count]

    def build_exam(self, total: int = 150, seed: int | None = None) -> List[Question]:
        rng = random.Random(seed)
        counts = self._weighted_counts(total)
        bank = all_questions()
        selected: List[Question] = []
        for domain, count in counts.items():
            selected.extend(self._sample_domain([q for q in bank if q.domain == domain], count, rng))
        rng.shuffle(selected)
        return selected

    def weakest_domains(self) -> List[int]:
        state = self.store.load()
        scored = []
        for domain in DOMAINS:
            stats = state.get("domain_stats", {}).get(str(domain), {})
            attempted = stats.get("attempted", 0)
            correct = stats.get("correct", 0)
            accuracy = correct / attempted if attempted else 0.0
            scored.append((accuracy, attempted, domain))
        return [d for _, _, d in sorted(scored)]

    def build_adaptive(self, total: int = 20, seed: int | None = None) -> List[Question]:
        rng = random.Random(seed)
        bank = all_questions()
        weak_order = self.weakest_domains()
        weights = {weak_order[0]: 4, weak_order[1]: 3, weak_order[2]: 2, weak_order[3]: 1}
        domains = list(weights)
        choices: List[Question] = []
        seen = set()
        for _ in range(total):
            domain = rng.choices(domains, weights=[weights[d] for d in domains], k=1)[0]
            candidates = [q for q in bank if q.domain == domain and q.id not in seen]
            if not candidates:
                candidates = [q for q in bank if q.domain == domain]
            q = rng.choice(candidates)
            seen.add(q.id)
            choices.append(q)
        return choices

    def begin(self, mode: str, questions: List[Question], resumable: bool) -> Dict:
        now = datetime.now(timezone.utc).isoformat()
        session = {
            "id": now,
            "mode": mode,
            "resumable": resumable,
            "started_at": now,
            "question_ids": [q.id for q in questions],
            "current_index": 0,
            "answers": [],
            "complete": False,
        }
        self.store.start_session(session)
        return session

    def answer(self, session: Dict, question: Question, choice: str, confidence: int, reasoning: str = "") -> Dict:
        choice = choice.upper().strip()
        correct = choice == question.answer
        record = {
            "question_id": question.id,
            "choice": choice,
            "correct": correct,
            "confidence": confidence,
            "reasoning": reasoning,
            "domain": question.domain,
        }
        session.setdefault("answers", []).append(record)
        session["current_index"] = len(session["answers"])
        self.store.record_attempt(question.id, question.domain, correct, confidence)
        if session["current_index"] >= len(session["question_ids"]):
            session["complete"] = True
            session["completed_at"] = datetime.now(timezone.utc).isoformat()
            self.store.update_current_session(session)
            self.store.complete_current_session()
        else:
            self.store.update_current_session(session)
        return record

    @staticmethod
    def score(session: Dict) -> Dict:
        answers = session.get("answers", [])
        total = len(answers)
        correct = sum(1 for a in answers if a.get("correct"))
        domains = {}
        for d in DOMAINS:
            rows = [a for a in answers if a.get("domain") == d]
            domains[d] = {
                "attempted": len(rows),
                "correct": sum(1 for a in rows if a.get("correct")),
                "accuracy": (sum(1 for a in rows if a.get("correct")) / len(rows)) if rows else None,
            }
        return {"attempted": total, "correct": correct, "accuracy": correct / total if total else 0.0, "domains": domains}
