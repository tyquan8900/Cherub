# CISM Reasoning Engine

A question-centered CISM study engine designed to train exam reasoning, not rote memorization.

## Exam weighting
- Domain 1 — Information Security Governance: 17%
- Domain 2 — Information Security Risk Management: 20%
- Domain 3 — Information Security Program: 33%
- Domain 4 — Incident Management: 30%

## Training model
1. Hard scenario question
2. Learner answer
3. Confidence rating
4. Learner reasoning
5. Distractor elimination
6. Answer reveal
7. Why each option wins or loses
8. Map to the relevant CISM concept/domain
9. Adaptive fresh retest

## Study schedule
- Week 1: mandatory 150-question cold pre-assessment; resumable
- Week 2: resumable Hard / Harder / adaptive checkpoints every 2–3 days
- Weeks 3–6: one fresh 150-question full exam each week in one continuous sitting
- Short adaptive sessions continue between full exams

## Run
Requires Python 3.11+.

```bash
python main.py
```

This is an independent study tool. It should use original scenarios rather than reproduce copyrighted ISACA exam questions or proprietary question-bank content.
