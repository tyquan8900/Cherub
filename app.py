from __future__ import annotations

import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

from cism_engine.config import DOMAINS, STUDY_PLAN
from cism_engine.question_bank import all_questions
from cism_engine.session import SessionEngine
from cism_engine.storage import ProgressStore

HOST = "127.0.0.1"
PORT = 8080
STATIC = Path(__file__).parent / "web"
store = ProgressStore()
engine = SessionEngine(store)


def public_question(q):
    return {
        "id": q.id,
        "domain": q.domain,
        "domain_name": DOMAINS[q.domain]["name"],
        "difficulty": q.difficulty,
        "stem": q.stem,
        "options": q.options,
        "concepts": q.concepts,
    }


def lookup(qid):
    for q in all_questions():
        if q.id == qid:
            return q
    return None


class Handler(BaseHTTPRequestHandler):
    def _json(self, payload, status=200):
        data = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _body(self):
        n = int(self.headers.get("Content-Length", "0"))
        return json.loads(self.rfile.read(n) or b"{}")

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/status":
            state = store.load()
            self._json({"domains": DOMAINS, "study_plan": STUDY_PLAN, "state": state})
            return
        if path == "/api/current":
            state = store.load()
            session = state.get("current_session")
            if not session:
                self._json({"session": None})
                return
            idx = session.get("current_index", 0)
            q = lookup(session["question_ids"][idx]) if idx < len(session["question_ids"]) else None
            self._json({"session": session, "question": public_question(q) if q else None})
            return
        target = "index.html" if path in ("", "/") else path.lstrip("/")
        f = (STATIC / target).resolve()
        if STATIC.resolve() not in f.parents and f != STATIC.resolve():
            self.send_error(403); return
        if not f.exists() or not f.is_file():
            self.send_error(404); return
        content = f.read_bytes()
        typ = "text/html" if f.suffix == ".html" else "text/css" if f.suffix == ".css" else "application/javascript"
        self.send_response(200); self.send_header("Content-Type", typ); self.send_header("Content-Length", str(len(content))); self.end_headers(); self.wfile.write(content)

    def do_POST(self):
        path = urlparse(self.path).path
        body = self._body()
        if path == "/api/start":
            mode = body.get("mode", "adaptive")
            if mode == "preassessment":
                qs, resumable = engine.build_exam(150), True
            elif mode == "full_exam":
                qs, resumable = engine.build_exam(150), False
            else:
                qs, resumable = engine.build_adaptive(int(body.get("total", 20))), True
            session = engine.begin(mode, qs, resumable)
            self._json({"session": session, "question": public_question(qs[0])})
            return
        if path == "/api/answer":
            state = store.load(); session = state.get("current_session")
            if not session:
                self._json({"error": "No active session"}, 400); return
            idx = session.get("current_index", 0)
            if idx >= len(session["question_ids"]):
                self._json({"error": "Session complete"}, 400); return
            q = lookup(session["question_ids"][idx])
            if not q:
                self._json({"error": "Question not found"}, 404); return
            confidence = max(1, min(5, int(body.get("confidence", 3))))
            record = engine.answer(session, q, body.get("choice", ""), confidence, body.get("reasoning", ""))
            reveal = {
                "record": record,
                "answer": q.answer,
                "rationale": q.rationale,
                "distractors": q.distractors,
                "concepts": q.concepts,
                "score": engine.score(session),
                "complete": session.get("complete", False),
            }
            if not session.get("complete"):
                nq = lookup(session["question_ids"][session["current_index"]])
                reveal["next_question"] = public_question(nq)
            self._json(reveal)
            return
        self._json({"error": "Not found"}, 404)


if __name__ == "__main__":
    print(f"CISM Reasoning Engine: http://{HOST}:{PORT}")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
