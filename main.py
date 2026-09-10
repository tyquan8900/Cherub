from cism_engine import LearnerState, Question, evaluate, reveal


def sample_question() -> Question:
    return Question(
        id="D1-DEMO-001",
        domain=1,
        difficulty="hard",
        scenario=(
            "Senior management has approved a major digital transformation. "
            "The information security manager learns that security requirements were not "
            "included during initial business planning. What should the information security "
            "manager do FIRST?"
        ),
        options={
            "A": "Perform a technical vulnerability assessment of the new environment",
            "B": "Determine the business objectives and associated information risk",
            "C": "Purchase additional security controls before implementation",
            "D": "Escalate the omission directly to the board",
        },
        correct_answer="B",
        explanation=(
            "CISM questions generally begin with business objectives and risk before selecting "
            "technical controls. The manager needs to understand what the transformation is "
            "trying to achieve and the risk created by it before recommending treatment."
        ),
        option_explanations={
            "A": "Too technical and premature before business risk is understood.",
            "B": "Best first step: establish business context and risk before treatment decisions.",
            "C": "Controls are selected after risk and requirements are understood.",
            "D": "Escalation may eventually be appropriate, but first establish the risk and its business impact.",
        },
        concepts=["business alignment", "risk-based decision making", "governance"],
    )


def main() -> None:
    state = LearnerState()
    q = sample_question()

    print("CISM REASONING ENGINE — DEMO")
    print("=" * 40)
    print(q.scenario)
    for key, option in q.options.items():
        print(f"{key}. {option}")

    answer = input("\nYour answer (A-D): ")
    confidence = int(input("Confidence (1-5): "))
    reasoning = input("Why did you choose it? ")
    eliminated = input("Which choices did you eliminate? (example A,C): ").split(",")

    attempt = evaluate(q, answer, confidence, reasoning, eliminated)
    state.record(q, attempt)
    print("\n" + reveal(q, attempt))


if __name__ == "__main__":
    main()
