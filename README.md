# Cherub

Cherub is a portable, browser-based study and reasoning application.

## Run anywhere

Cherub is browser based and requires no Python, local server, or administrator rights.

- `index.html` is the standalone study engine.
- `sync.html` is the authenticated launcher that loads and saves progress through GitHub.
- Each authorized GitHub user has a separate progress file under `users/<github-username>/progress.json`.

## Private GitHub sync

Keep the repository private while using GitHub as the progress backend. Open `sync.html` when using Cherub.

Each authorized user uses their own fine-grained GitHub personal access token restricted to the `tyquan8900/Cherub` repository with **Contents: Read and write**. Cherub authenticates the token, detects the GitHub username, and routes that user to a separate progress file.

Example:

```text
users/
├── tyquan8900/
│   └── progress.json
└── second-github-user/
    └── progress.json
```

The second user's directory and progress file are created automatically the first time that user connects successfully. Users do not share tokens or progress files.

The token is never committed to the repository. If **Remember on this device** is disabled, it is kept only for that browser session. If enabled, it is stored only in that device's browser storage.

### Automatic sync behavior

- Opening `sync.html` authenticates the GitHub user first.
- Cherub loads that user's latest remote progress before launching the study engine.
- If the user's progress file does not exist yet, Cherub creates it automatically.
- Changes are checked every 5 seconds and saved when progress has changed.
- Cross-frame browser storage changes also trigger a sync attempt.
- A manual **Sync now** button remains available.
- Cherub attempts a final sync when the page is hidden or closed.
- GitHub update conflicts trigger a fresh read, answer-history merge, and retry.
- Opening Cherub on another device with the same GitHub user loads the same remote progress.

Do not place a GitHub token, password, API key, or other credential directly in `index.html`, `sync.html`, or any committed file.

## Study features

- Four weighted study domains
- Cold pre-assessment mode
- Full-exam mode
- Adaptive practice weighted toward weaker areas
- Hard / Harder scenario questions
- Confidence tracking
- Learner reasoning capture
- Answer rationales and distractor explanations
- Concept mapping
- Domain-level performance tracking
- Resumable browser sessions

## Repository layout

```text
Cherub/
├── users/
│   └── tyquan8900/
│       └── progress.json
├── index.html
├── sync.html
├── README.md
└── .gitignore
```

Additional user directories are generated automatically on first authenticated use.

## Content integrity

Cherub uses independently written study scenarios. Proprietary exam questions or commercial question-bank content should not be copied into the repository.
