# CISM Reasoning Engine

A private, local-first CISM study application designed to train exam reasoning rather than rote memorization.

## Current capabilities

- Browser-based study interface
- Original CISM-style scenario questions
- Hard / Harder difficulty levels
- Domain weighting:
  - Domain 1 — Information Security Governance: 17%
  - Domain 2 — Information Security Risk Management: 20%
  - Domain 3 — Information Security Program: 33%
  - Domain 4 — Incident Management: 30%
- 150-question cold pre-assessment mode
- 150-question full-exam mode
- Adaptive 20-question checkpoints weighted toward weak domains
- Confidence scoring from 1–5
- Optional learner reasoning capture
- Answer reveal with rationale
- Explanation of why distractors lose
- Concept tags / knowledge-map links
- Persistent local progress in `data/progress.json`
- Resume support for resumable sessions
- Per-domain accuracy dashboard

## Important question-bank status

The engine currently contains 40 unique original hard/harder scenarios (10 per domain). A 150-question session can run now, but until the bank contains at least 150+ unique questions, the session generator will recycle shuffled questions within the same exam.

The target is a substantially larger original bank so every scheduled 150-question exam can be fresh without reproducing copyrighted ISACA or commercial question-bank content.

## Training model

1. Hard scenario
2. Learner answer
3. Confidence rating
4. Learner reasoning
5. Distractor elimination
6. Answer reveal
7. Why each option wins or loses
8. Map to the relevant CISM concept/domain
9. Adaptive retest

## Six-week schedule

- Week 1: mandatory 150-question cold pre-assessment; resumable
- Week 2: resumable Hard / Harder / adaptive checkpoints every 2–3 days
- Weeks 3–6: one fresh 150-question full exam each week in one continuous sitting
- Short adaptive sessions continue between full exams

## Run the browser app

Requires Python 3.11+.

```bash
git clone https://github.com/tyquan8900/Cism.git
cd Cism
python app.py
```

Then open:

```text
http://127.0.0.1:8080
```

No third-party Python packages are required for the current browser application.

## Repository layout

```text
Cism/
├── app.py
├── main.py
├── requirements.txt
├── cism_engine/
│   ├── __init__.py
│   ├── config.py
│   ├── models.py
│   ├── question_bank.py
│   ├── reasoning.py
│   ├── session.py
│   └── storage.py
└── web/
    ├── index.html
    ├── app.js
    └── style.css
```

## Data and privacy

Study progress is stored locally in `data/progress.json`. The `data/` directory should remain uncommitted so personal answers and performance history do not get pushed to GitHub.

## Copyright / exam integrity

This project is an independent study tool. Questions should be original scenarios based on publicly learnable CISM concepts and management reasoning. Do not copy ISACA exam questions or proprietary commercial question-bank content into the repository.
