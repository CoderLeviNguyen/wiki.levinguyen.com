"""Evidence integrity checks. Run with python scripts/validate.py."""
import json
from pathlib import Path
from datetime import datetime, timezone
from collections import Counter
from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parents[1]
KINDS = ("claims", "sources", "evidence", "reviews")
SCHEMA = {"claims":"claim","sources":"source","evidence":"evidence","reviews":"review"}
KEY = {"claims":"claim_id","sources":"source_id","evidence":"evidence_id","reviews":"review_id"}

def validate(root=ROOT):
    errors = []
    rows = {}
    for kind in KINDS:
        schema = json.loads((root/"schemas"/(SCHEMA[kind]+".schema.json")).read_text(encoding="utf-8"))
        Draft202012Validator.check_schema(schema)
        validator = Draft202012Validator(schema, format_checker=FormatChecker())
        rows[kind] = {}
        for path in sorted((root/"data"/kind).rglob("*.json")):
            try:
                obj = json.loads(path.read_text(encoding="utf-8"))
            except (OSError, ValueError) as exc:
                errors.append(f"{path}: invalid JSON: {exc}")
                continue
            for issue in validator.iter_errors(obj):
                errors.append(f"{path}: {issue.message}")
            identifier = obj.get(KEY[kind]) if isinstance(obj, dict) else None
            if identifier:
                if identifier in rows[kind]:
                    errors.append(f"{kind}: duplicate ID {identifier}")
                rows[kind][identifier] = obj
    claims, sources, evidence, reviews = (rows[k] for k in KINDS)
    for eid, e in evidence.items():
        if e.get("source_id") not in sources:
            errors.append(f"{eid}: unknown source")
        if e.get("claim_id") not in claims:
            errors.append(f"{eid}: unknown claim")
    for rid, review in reviews.items():
        if review.get("claim_id") not in claims:
            errors.append(f"{rid}: unknown claim")
        for eid in review.get("evidence_ids", []):
            if eid not in evidence or evidence[eid].get("claim_id") != review.get("claim_id"):
                errors.append(f"{rid}: invalid evidence {eid}")
    for cid, c in claims.items():
        for field, mapping in (("source_ids", sources),("evidence_ids", evidence),("review_ids", reviews)):
            for ref in c.get(field, []):
                if ref not in mapping:
                    errors.append(f"{cid}: unknown {field} {ref}")
        for eid in c.get("evidence_ids", []):
            if eid in evidence and evidence[eid].get("claim_id") != cid:
                errors.append(f"{cid}: evidence belongs to another claim")
        for rid in c.get("review_ids", []):
            if rid in reviews and reviews[rid].get("claim_id") != cid:
                errors.append(f"{cid}: review belongs to another claim")
        if c.get("status") == "VERIFIED":
            approved = any(reviews[r].get("decision") == "VERIFIED" and reviews[r].get("evidence_ids") for r in c.get("review_ids", []) if r in reviews)
            if not (c.get("verified_at") and c.get("evidence_ids") and approved):
                errors.append(f"{cid}: VERIFIED lacks dated evidence-backed approval")
        if c.get("publication_status") == "PUBLIC":
            if c.get("status") != "VERIFIED" or c.get("freshness_status") != "CURRENT":
                errors.append(f"{cid}: PUBLIC requires VERIFIED and CURRENT")
            next_review = c.get("next_review_at")
            if next_review:
                try:
                    due = datetime.fromisoformat(next_review.replace("Z","+00:00"))
                    if due.tzinfo is None or due < datetime.now(timezone.utc):
                        errors.append(f"{cid}: public claim review overdue or timezone missing")
                except ValueError:
                    errors.append(f"{cid}: invalid next_review_at")
    return errors

if __name__ == "__main__":
    problems = validate()
    print(json.dumps({"status":"PASS" if not problems else "FAIL", "errors":problems},ensure_ascii=False,indent=2))
    raise SystemExit(bool(problems))
