# Cherub

Cherub is a static, local-first reasoning and study application designed to run anywhere a modern browser can open HTML.

## Why this build

Cherub no longer requires Python or a local web server for normal use. The complete browser app lives in `index.html` and can be opened directly as a file or hosted with GitHub Pages.

## Current capabilities

- Single-file HTML/JavaScript browser app
- Works on desktop and mobile browsers
- 150-question cold assessment mode
- 150-question full exam mode
- 20-question adaptive practice mode
- Four weighted study domains
- Confidence scoring from 1–5
- Optional learner reasoning capture
- Answer reveal with rationale
- Distractor explanations
- Concept tags
- Adaptive weak-area selection
- Per-domain accuracy dashboard
- Resumable assessment/adaptive sessions
- Browser-local saved progress using `localStorage`

## Privacy

Personal answers, confidence ratings, reasoning notes, and progress are stored only in the browser's local storage. They are not written back into this repository.

If the repository is made public, the source code and built-in study questions/explanations will be public, but a user's personal progress will not be.

## Run anywhere

### Direct HTML

Download `index.html` and open it in a modern browser. No installation, Python runtime, administrator access, or server is required.

### GitHub Pages

Once this repository is renamed to `Cherub`, made public, and GitHub Pages is enabled from the `main` branch root, the app can be opened at:

```text
https://tyquan8900.github.io/Cherub/
```

## Repository transition

The original Python implementation remains in the repository for now as development/reference code. `index.html` is the portable edition intended for iPhone, personal computers, and environments where only static HTML files can be opened.

## Content integrity

Cherub is an independent study tool. Its scenarios should remain original and should not reproduce proprietary exam questions or commercial question-bank content.
