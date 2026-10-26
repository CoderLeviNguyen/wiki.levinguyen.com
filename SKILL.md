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

## Facebook verified-image production workflow (approved 2026-10-26)

**Goal:** User provides one image/infographic; AI extracts and verifies its claims and creates a **new Facebook-ready image whose written content is evidence-aligned**. Wiki is the reusable verified knowledge store, not the final deliverable.

### STEP 01 — IMAGE_INTAKE (read only)
- Read image directly, capture original provenance and identify each distinct item, caption and claim.
- Split multiple asserted benefits of one food into separate atomic claims. Do not assume the infographic's headline is true.
- Retain source as immutable input when authorized; do not publish or copy unverified content into accepted Wiki knowledge.

### STEP 02 — WIKI_LOOKUP (reuse first)
- Search verified, current claim registry for matching food, outcome, population, dose and scope.
- Reuse evidence only when claim scope matches and there is no new material contradiction or staleness.
- Otherwise route the claim to STEP 03.

### STEP 03 — WEB_FACT_CHECK
- For each atomic claim, seek authoritative primary guidance and human clinical evidence appropriate to topic (e.g. NCI, NIH, PubMed original papers, WCRF, WHO).
- Record direct source URL/DOI, exact endpoint, population, intervention, duration, design, limitations, conflicts and funding where relevant.
- Distinguish nutrient composition from demonstrated clinical outcomes, association from causation, and animal/in-vitro findings from human evidence.
- No invented citations, reviews, doses or verified status.

### STEP 04 — CLAIM_GATE
- **KEEP:** adequately evidenced, scoped, independently approved VERIFIED/CURRENT claim.
- **REWRITE_AND_RECHECK:** replace exaggerated wording with a narrower, independently evidence-checked statement, including a different relevant property of the same food if necessary. This new claim must pass all gates itself.
- **DROP:** unsupported, unverifiable, contradicted, misleading, or unreviewed claims. Do not keep in accepted knowledge, public Wiki, or final image.
- Item count is flexible: 12 source items may become 6 or fewer. If no claims pass, stop image generation and report why.
- Absence of proof is not proof of falsity. Remove from active candidates per verified-only retention policy, preserving immutable originals and Git history.

### STEP 05 — CONTENT_LOCK (before rendering)
- Produce a stable `CONTENT_LOCK` manifest: source image ID, claim IDs, exact final headline, subtitle, ordered item labels and benefit text, per-item evidence IDs, safety disclaimer, engagement CTA, target audience/language, aspect ratio, image size and generation constraints.
- All factual on-image wording must map to a VERIFIED/CURRENT claim with genuine independent reviewer approval; general disclaimers do not repair unsupported claims.
- For cancer topics, never say a single food prevents/cures/treats cancer unless specific reliable clinical evidence supports precisely that wording. Prefer accurate diet-pattern messages.
- Keep caption/source ledger separate when references cannot fit legibly in image.

### STEP 06 — FACEBOOK_IMAGE
- Generate a **1080×1350 px (4:5)** Facebook image by default; visually distinguish items, use legible typography, accurate illustrations and consistent labels.
- Preserve exact CONTENT_LOCK text, item count and order. Watermark OFF by default.
- Include relevant non-misleading comment CTA and appropriate health disclaimer.
- Image generation must not silently introduce extra factual claims. Do not schedule or publish without separate user authorization.

### STEP 07 — IMAGE_QA_AND_DELIVERY
- Inspect final image against CONTENT_LOCK: every label, claim, item, spelling, illustration, CTA, disclaimer, dimensions and source mapping.
- Correct or regenerate errors before calling the image complete; if correction unavailable, report failure instead of claiming QA passed.
- Return image, Facebook caption draft, traceable source ledger and per-claim verification status.
- Store only independently VERIFIED/CURRENT reusable knowledge in Wiki, with index/log updates; never store dropped claims as accepted facts.

### Integration boundary
- Wiki agent owns extraction, research, source/evidence/review, claim gating and CONTENT_LOCK.
- Image-generation stage owns rendering and visual QA; AutoLV may handle channel scheduling **only with explicit separate authorization**.
- GitHub edits stay in a branch/PR for substantial changes. No Python/TypeScript automation or GitHub Actions is required.
