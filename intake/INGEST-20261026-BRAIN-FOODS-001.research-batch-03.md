# Brain Foods — Research batch 03: direct PubMed cross-check (2026-10-26)

**Scope:** Independent web verification of bibliographic records and PubMed abstracts. **Not** independent human approval. No claims are VERIFIED/PUBLIC.

## New and corroborated sources

| PMID | DOI | Type and outcome | Relevant claims |
|---|---|---|---|
| 39296505 | Check PubMed record | 2024 systematic review/meta-analysis of 5 RCTs, 928 adults: pooled cognition SMD 0.27 (95% CI -0.65 to 1.19), p=0.57; no statistically significant overall effect | BF-01, BF-02, BF-07, BF-09, BF-11, broad nut claims |
| 34132152 | 10.1080/07853890.2021.1925955 | Walnut review: 5 cognition RCTs had no significant effect on overall cognition, some subdomain/subgroup signals; observational studies found associations; no definitive causal conclusion | BF-01, BF-02 |
| 37375715 | 10.3390/nu15122811 | Raisin RCT: 80 people aged >70; 50 g/day for 6 months; improvements on some cognitive tests, not direct calmness endpoint | BF-03, BF-04 |
| 38943918 | 10.1016/j.foodchem.2024.140211 | Pistachio 28 g/day for 28 days, uncontrolled pilot in overweight young adults; attention and mood improvements; cannot establish causal general benefit | BF-09, BF-10 |
| 41691115 | 10.1038/s41430-026-01705-6 | Almond randomized crossover: 43 recruited, 34 completed, 50 g/day for 5 months; no significant cognition effect | BF-07, BF-08 |
| 41850683 | 10.1016/j.tjnut.2026.101484 | Almond open-label RCT: 60 adults with prediabetes, 24 weeks; improvements in executive function and processing speed; funded by Almond Board of California; not direct evidence of improved learning | BF-07, BF-08 |
| 42559168 | 10.3389/fnut.2026.1733218 | Dates crossover RCT: 35 healthy adults; no significant overall cognition indices; different variety-specific mood effects; fatigue not directly established | BF-05, BF-06 |
| 28663041 | 10.1016/j.ijdevneu.2017.06.006 | Cashew maternal intake in animal offspring: reflex and memory effects; not evidence of human brain development | BF-11 |
| 37296019 | See PubMed | Mixed nuts 60 g/day trial including walnuts, pistachios, cashews and hazelnuts; cannot isolate effects of a single nut | BF-09, BF-11 |

## URLs consulted
- https://pubmed.ncbi.nlm.nih.gov/39296505/
- https://pubmed.ncbi.nlm.nih.gov/34132152/
- https://pubmed.ncbi.nlm.nih.gov/37375715/
- https://pubmed.ncbi.nlm.nih.gov/38943918/
- https://pubmed.ncbi.nlm.nih.gov/41691115/
- https://pubmed.ncbi.nlm.nih.gov/41850683/
- https://pubmed.ncbi.nlm.nih.gov/42559168/
- https://pubmed.ncbi.nlm.nih.gov/28663041/
- https://pubmed.ncbi.nlm.nih.gov/37296019/

## Evidence-to-claim triage
- **BF-01 / BF-02 (walnuts): MIXED.** Overall RCT results null; some favorable subdomain and observational signals. No generalized verified improvement.
- **BF-03 (raisins concentration): INDIRECT.** Cognitive improvements in an older-adult study are not necessarily concentration.
- **BF-04 (raisins calmness): INSUFFICIENT_DIRECT_EVIDENCE.**
- **BF-05 (dates energy): NUTRIENT/ENERGY CONTENT is distinct from demonstrated functional benefit. Further nutrition source needed.**
- **BF-06 (dates fatigue): INSUFFICIENT_DIRECT_EVIDENCE.**
- **BF-07 / BF-08 (almonds): MIXED/ENDPOINT_MISMATCH.** Conflicting 2026 RCTs on cognitive domains; learning specifically not established.
- **BF-09 (pistachios focus): PRELIMINARY, uncontrolled pilot only.**
- **BF-10 (pistachios alertness): NOT_DIRECTLY_ESTABLISHED.**
- **BF-11 (cashews development): ANIMAL_ONLY and mixed-nut studies; no direct human proof.**
- **BF-12 (cashews mental strength): VAGUE, NO_OPERATIONAL_ENDPOINT.**
- **BF-13 (dried apricots brain health): VAGUE, NO_DIRECT_HUMAN_ENDPOINT.**
- **BF-14 (dried apricots prevent oxidative stress): In vitro antioxidant properties cannot prove prevention in humans.**

## Schema integrity and next actions
- `schemas/source.schema.json` requires a genuine 64-character SHA-256. Do not fabricate hash values from URL or DOI. Capture actual source bytes or a fixed abstract snapshot and calculate SHA-256 before creating strict source records.
- `schemas/evidence.schema.json` requires claim/source IDs and locators; `schemas/review.schema.json` requires a genuine reviewer identity. Do not fabricate independent review.
- Keep this batch as auditable **research notes**, not schema-valid `data/sources` or approved `data/reviews`.
- All claim status **PENDING**, publication **PRIVATE**. Further full-text appraisal, exact outcome mapping and independent review required.
