# Cherub

Cherub is a portable, browser-based study and reasoning application.

## Run anywhere

Cherub is browser based and requires no Python, local server, or administrator rights.

- `index.html` is the standalone study engine.
- `sync.html` is the single-user launcher that loads and saves progress through GitHub.
- `data/progress.json` is the private remote progress store.

## Private GitHub sync

For the current single-user setup, keep the repository private and open `sync.html` when using Cherub.

On each device, enter a fine-grained GitHub personal access token that is restricted to the `tyquan8900/Cherub` repository and grants **Contents: Read and write**. Cherub uses that token in the browser to read and update `data/progress.json` through the GitHub REST API.

The token is never committed to the repository. If **Remember on this device** is disabled, the token is kept only for the browser session. If enabled, it is saved locally on that device.

### Sync behavior

- Opening `sync.html` loads the latest remote progress before launching the study engine.
- Local study changes are checked for sync every 10 seconds.
- A manual **Sync now** button is available.
- Cherub also attempts to sync when the page is hidden or closed.
- The same remote progress can therefore follow the authorized user across devices.
- A GitHub conflict triggers a fresh read and a merge of answer history before retrying the save.

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
├── data/
│   └── progress.json
├── index.html
├── sync.html
├── README.md
└── .gitignore
```

## Content integrity

Cherub uses independently written study scenarios. Proprietary exam questions or commercial question-bank content should not be copied into the repository.
