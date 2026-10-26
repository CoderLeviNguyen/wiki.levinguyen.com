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
