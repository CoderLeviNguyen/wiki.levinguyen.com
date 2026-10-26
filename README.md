# Verified Knowledge Wiki

AI-native, GitHub-backed knowledge repository for atomic, evidence-traceable claims. Independent of SecondBrain.

**No Python, TypeScript engine or GitHub Actions CI.** AI agents follow [AGENTS.md](AGENTS.md) and [SKILL.md](SKILL.md), using GitHub and research tools to perform intake, claim extraction, deduplication, evidence research, review preparation and versioning.

- `schemas/`: declarative claim, evidence, source and review JSON schemas
- `data/`: future claim/source/evidence/review records
- `log.md`: change/audit log
- `index.md`: knowledge index

This repository does **not** yet contain an automatically running agent, independently verified claims, deployed public website or API. A claim is never VERIFIED just because an AI says it is.
