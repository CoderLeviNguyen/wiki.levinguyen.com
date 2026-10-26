# Verified Knowledge Wiki

GitHub is the canonical source of truth. Phase A is a TypeScript prototype for atomic claim, evidence, source and review validation.

## Run
```bash
npm install
npm run check
npm run dry-run
```

`npm run check` runs unit tests, TypeScript type-check, JSON Schema validation and registry lint. Ingest/dedup/version are **dry-run only** until an auditable write and review workflow is implemented. No medical or legal claim is automatically verified. Public website and API are not deployed.
