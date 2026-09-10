# Cherub Mastery Engine

Cherub is a browser-based CISM reasoning and mastery engine using the locked v6 dashboard design.

## Operational flow

1. Week 1 mandatory 150-question cold pre-test.
   - Current weighting: D1 17%, D2 20%, D3 33%, D4 30%.
   - Domain labels and answers are hidden during the cold test.
   - Progress autosaves after every submitted answer.
   - The pre-test is resumable.
2. Post-pre-test diagnostic.
   - Cherub Training Score (200-800 presentation scale; not an official ISACA scaled score).
   - Domain, topic, relationship, confidence, reasoning, elimination, and misconception analysis.
3. Week 2 adaptive Hard/Harder practice.
   - 20-question sessions prioritize weaker domains and relationships.
   - Immediate explanation after each adaptive question.
4. Weeks 3-6 full exams.
   - One separate fresh 150-question bank for each week.
   - One sitting, no resume.
   - Answers remain hidden until completion.
5. Study Map, Progress, Schedule, Notes, Resources, Settings, backup/import/export are active.

## Update model

`index.html` keeps the approved v6 visual design and loads `js/app.js`.

`js/app.js` is a stable bootstrap loader. It fetches `data/manifest.json` with `no-store`, loads the current runtime using the manifest version, and checks for updates every five minutes and when the tab becomes active again.

Study progress is stored separately in browser storage, so application/content updates do not overwrite the learner's history. JSON export/import provides a backup and migration path.

## Files

- `index.html` - locked v6 interface
- `js/app.js` - version-aware loader
- `js/runtime.js` - exam, adaptive, scoring, map, progress, notes, schedule, and settings engine
- `js/repair.js` - hardened browser controls and backup handling
- `js/health.js` - startup health checks
- `data/manifest.json` - current app/content version
- `data/blueprint.json` - domain weighting
- `data/concepts.json` - concept registry
- `data/relationships.json` - relationship map
- `data/index-map.json` - index-driven connection map
- `data/glossary.json` - normalized terminology
- `data/acronyms.json` - acronym normalization
- `data/misconceptions.json` - reasoning error taxonomy
- `data/source-references.json` - source/scoping manifest
- `data/test-plan.json` - six-week workflow and readiness rules

## Readiness rule

Cherub's internal target is at least 600 in every domain, with a preferred 650-700 range. This is a private training/readiness metric and does not reproduce ISACA's proprietary scoring scale.

## Source policy

Licensed manual pages, recordings, and proprietary question text should not be committed to the repository. Cherub stores transformed study structures, mappings, summaries, metadata, and original questions.