from .config import DOMAINS
from .models import Attempt, LearnerState, Question


def evaluate(question: Question, answer: str, confidence: int, reasoning: str, eliminated: list[str]) -> Attempt:
    answer = answer.strip().upper()
    if answer not in question.options:
        raise ValueError("Answer must be one of the available options.")
    if confidence not in range(1, 6):
        raise ValueError("Confidence must be from 1 to 5.")
    return Attempt(
        question_id=question.id,
        selected_answer=answer,
        confidence=confidence,
        reasoning=reasoning.strip(),
        eliminated=[x.strip().upper() for x in eliminated],
        correct=answer == question.correct_answer,
    )


def reveal(question: Question, attempt: Attempt) -> str:
    lines = [
        f"Result: {'CORRECT' if attempt.correct else 'INCORRECT'}",
        f"Correct answer: {question.correct_answer} — {question.options[question.correct_answer]}",
        "",
        question.explanation,
        "",
        "Option analysis:",
    ]
    for key, text in question.options.items():
        lines.append(f"  {key}. {text}")
        lines.append(f"     {question.option_explanations.get(key, '')}")
    lines.extend([
        "",
        f"Map: Domain {question.domain} — {DOMAINS[question.domain]['name']}",
        f"Concepts: {', '.join(question.concepts)}",
    ])
    return "\n".join(lines)


def weakest_domain(state: LearnerState) -> int:
    def score(domain: int) -> float:
        results = state.domain_scores[domain]
        return sum(results) / len(results) if results else 0.0
    return min(DOMAINS, key=score)
