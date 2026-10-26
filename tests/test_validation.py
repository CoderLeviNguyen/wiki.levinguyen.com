import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1]/"scripts"/"validate.py"
spec = importlib.util.spec_from_file_location("validate", SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class ValidationTests(unittest.TestCase):
    def test_empty_registry_passes(self):
        self.assertEqual(module.validate(), [])
    def test_invalid_public_claim_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root/"schemas").mkdir()
            for f in (module.ROOT/"schemas").glob("*.schema.json"):
                (root/"schemas"/f.name).write_bytes(f.read_bytes())
            for kind in module.KINDS:
                (root/"data"/kind).mkdir(parents=True)
            claim = {"claim_id":"FOOD-000001","revision":1,"claim_text":"A test claim","domain":"food","status":"PENDING","evidence_ids":[],"source_ids":[],"review_ids":[],"publication_status":"PUBLIC"}
            (root/"data"/"claims"/"test.json").write_text(json.dumps(claim),encoding="utf-8")
            self.assertTrue(any("PUBLIC requires VERIFIED" in e for e in module.validate(root)))
