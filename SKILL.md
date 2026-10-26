# SKILL — AI-Native Verified Knowledge Wiki

## Trigger
Use when a user supplies text, a screenshot, an image, a document, a URL or a claim for the knowledge wiki.

## Phase 0: Read-only intake
- Read AGENTS.md and schemas/claim.schema.json, source.schema.json, evidence.schema.json, review.schema.json.
- Identify source type and record the original URL, title, capture time and raw content when available.
- Never invent image OCR output or source hashes. For images, transcribe only what can actually be read.

## Phase 1: Atomic extraction
- Extract ONE testable assertion per claim. A single infographic with nine drinks may yield nine or more claims.
- Keep original wording, scope (population, dose, jurisdiction, time), and proposed normalized claim.
- Do not assume the source image proves its own assertions.
- Status defaults to PENDING; publication_status PRIVATE.

## Phase 2: Deduplication
- Read existing claim records and compare normalized assertions plus scope.
- Exact duplicate: propose reuse/link, do not overwrite.
- Near-duplicate or contradictory scope: flag for review, preserve both records pending decision.
- Maintain source references and immutable original provenance.

## Phase 3: Evidence and fact-check
- Independently seek primary sources appropriate to domain: research and clinical guidance for health; official current legislation for legal claims; original documents for project facts.
- For each claim, record source title, URL, access date, precise passage/location, evidence stance SUPPORTS/REFUTES/MIXED/CONTEXT, limitations, and any unresolved conflicts.
- Do not infer causal benefit from correlation or extrapolate beyond the study population.
- Distinguish source reliability from whether the source actually supports the precise claim.
- If sources are unavailable, leave PENDING/INSUFFICIENT_EVIDENCE.
- AI drafts evidence assessments; independent verification/reviewer approval is required for VERIFIED.

## Phase 4: Review and publication gate
- Build source, evidence, claim and review JSON conforming to schemas.
- Verify all cross-file IDs and source attribution, no duplicate IDs, appropriate version/revision, freshness and privacy.
- AI cannot self-approve independent VERIFIED status. A recorded qualified reviewer decision must be real, not simulated.
- Only VERIFIED and CURRENT claims may be proposed for PUBLIC; otherwise PRIVATE.
- Do not publish claims with missing review, material conflicts or expired review dates.

## Phase 5: GitHub write and audit
- Before writes: show proposed files, exact claims, evidence quality, conflicts and validation result.
- After authorization: write via GitHub connector, preferably to a branch/PR; do not replace originals or edit outside this repository.
- Record audit trail in log.md; do not claim tests were executed unless they were.
- Return claim IDs, statuses, evidence citations, commit/PR links and any unresolved checks.

## Output contract
Return a structured report: INPUT, ATOMIC_CLAIMS, DEDUP, EVIDENCE, REVIEW, VALIDATION, GITHUB_CHANGES, OPEN_ISSUES.
All evidence must be sourced; unsupported assertions remain explicitly unverified.

## Standard image-to-verified-knowledge workflow (default)

### One-input operating contract
- User supplies ONE image, screenshot, link, document or text. Treat that as one ingest job with potentially many atomic claims.
- Proceed autonomously through all steps for which tools and permissions are available; ask only for genuinely missing essential information or required approval. Never pretend to have background execution.
- Image reading: transcribe visible text, identify each food/drink/item and its attached claim; record uncertain/illegible sections as UNREADABLE rather than guessing. If the source image is only linked, actually retrieve it before claiming to have read it.
- Preserve original source identity and reference to the image. Store raw bytes only where an authorized tool supports it; otherwise store a durable source URL and metadata. Record SHA-256 only when genuinely calculated.
- An infographic is a source of *claims*, not evidence that those claims are true.

### Atomic claim extraction and decomposition
- Split by subject AND asserted effect. One beverage with two claimed benefits becomes two records. Nine beverages with one benefit each yield at least nine candidates.
- Keep exact original text, normalized assertion, outcome, qualifiers (dose, population, comparison, duration, jurisdiction, effective date) and uncertainty.
- Never add medical benefits, numerical claims or qualifiers absent from source except as explicitly labeled research findings.
- Initially mark every new candidate `PENDING` and `PRIVATE`; retain separate statuses for extraction, fact-check, review, freshness and publication.

### Reuse-first dedup and fact-check
- Before external research, search the GitHub claim registry for exact and semantic matches, including synonyms and scope.
- If an existing claim is independently VERIFIED, CURRENT and equivalent in scope, reuse its existing evidence and review with provenance. Re-check only changed scope, staleness, contradictory evidence or newly material findings.
- For new/unresolved claims, research **each claim independently** with original primary sources where possible, record exact supporting/refuting passages, URLs, access dates, applicability, confidence and limitations.
- Never use the original infographic or another AI answer as independent proof. Distinguish absence of evidence from evidence of absence.
- If evidence is weak or inaccessible, keep `PENDING` / `INSUFFICIENT_EVIDENCE`; if conflicting, use `DISPUTED` or `PARTIALLY_SUPPORTED` as warranted.
- AI's assessment is a proposal. A real independent reviewer approval is required before recording `VERIFIED`; never fabricate approval.

### Per-claim isolation
- Process claims independently. Failure or lack of evidence for one item must not erase valid results for other items.
- Record unresolved work as a per-claim queue for later research or review, with reasons. Do not claim it will run automatically without an actual scheduled agent.

### GitHub record mapping
- Keep one immutable input/source reference and one record per atomic claim.
- Use `data/sources/`, `data/claims/`, `data/evidence/`, `data/reviews/` and `log.md`, with schema-conforming fields only.
- Store raw-input metadata in a separate manifest only when a corresponding schema is available; do not create undocumented fields in strict JSON records.
- Every evidence item references a real source and claim; every review references real evidence; claim IDs and revisions must be unique.
- Append new reviews and revisions instead of overwriting audit history. Do not publish or mark VERIFIED automatically.
- Before GitHub writes, review the intended diff, sensitive data, source provenance, schema fields, cross-references, duplicates and publication eligibility. Use branch/PR for substantial changes.

### Completion report
Return a compact per-claim table with: item, original claim, normalized claim, dedup decision, evidence status, review status, final status and relevant source links.
Also report: input provenance, number of claims extracted, counts by status, unreadable parts, unresolved questions, files/commits actually written, and explicit NOT_CHECKED/NOT_RUN labels.
Never report example figures as actual results.

### Example (illustrative only, not verified)
Image says:
- Green Tea — Helps lower blood pressure
- Beetroot Juice — Improves blood circulation
- Lemon Water — Detoxifies the liver

Produce at least three separate candidate claims. All begin PENDING/PRIVATE. Research each separately, including the meaning and measurability of vague claims such as "detoxifies." Do not conclude any example is VERIFIED from this illustration.

## Verified-only knowledge retention policy (2026-10-26)

- User preference: **delete unverifiable data from the working knowledge base**. Only independently reviewed `VERIFIED`, `CURRENT` claims may be retained as asserted knowledge or synthesized into public wiki pages.
- Unverified, insufficient, unsupported, ambiguous or unreviewed candidate claims must **not** be promoted to `data/claims/`, public wiki pages, `index.md` knowledge listings, or durable research batches as accepted facts.
- When a claim cannot be verified after the available research and review, remove its candidate/intake and unapproved evidence drafts from the active branch. Do not retain indefinite PENDING claim queues unless the user explicitly requests them.
- Do **not** delete an original raw source or falsify an audit trail; immutable originals and Git history are separate from accepted knowledge. A minimal deletion audit may identify removed paths and reason without repeating unverified assertions.
- Process each atomic claim separately: remove only unverified ones, preserve genuinely VERIFIED/CURRENT claims with provenance. Do not turn 'not verified' into 'proven false'.
- If no claims pass, publish no knowledge page for that input. Report counts and deleted paths honestly.
- Never use a citation alone as reviewer approval; independent approval remains required for VERIFIED.
