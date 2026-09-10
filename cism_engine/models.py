from dataclasses import dataclass, field
from typing import Dict, List


@dataclass
class Question:
    id: str
    domain: int
    difficulty: str
    scenario: str
    options: Dict[str, str]
    correct_answer: str
    explanation: str
    option_explanations: Dict[str, str]
    concepts: List[str] = field(default_factory=list)


@dataclass
class Attempt:
    question_id: str
    selected_answer: str
    confidence: int
    reasoning: str
    eliminated: List[str]
    correct: bool


@dataclass
class LearnerState:
    attempts: List[Attempt] = field(default_factory=list)
    domain_scores: Dict[int, List[bool]] = field(
        default_factory=lambda: {1: [], 2: [], 3: [], 4: []}
    )

    def record(self, question: Question, attempt: Attempt) -> None:
        self.attempts.append(attempt)
        self.domain_scores[question.domain].append(attempt.correct)
