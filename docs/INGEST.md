# Ingest contract — Phase B

One input source may yield many atomic candidates. **A candidate is not verified.**

1. Preserve source title, retrieval timestamp and original UTF-8 text. The engine computes a SHA-256 fingerprint of raw text; it does not fetch or independently verify the source.
2. Supply each proposed claim separately in `candidates[]`; do not merge unrelated drinks, foods, populations or outcomes.
3. Preserve scope fields: population, dose, jurisdiction, effective date and outcome.
4. Compute exact normalized-text duplicate matches. Semantic near-duplicates require a separate human/agent review.
5. Set new candidates to `PENDING` and `PRIVATE`. No automatic evidence, reviews, VERIFIED status or Git writes.
6. Fact-check stage must independently retrieve evidence, capture precise locators, compare support/refutation, and obtain a reviewer decision before publication.

Run `npm run ingest:example` to inspect a dry-run proposal. This is **not** an OCR, search or independent fact-check service.
