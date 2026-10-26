import importlib.util, pathlib, unittest
p=pathlib.Path(__file__).resolve().parents[1]/'scripts'/'wiki.py'
s=importlib.util.spec_from_file_location('wiki',p); m=importlib.util.module_from_spec(s); s.loader.exec_module(m)
class WikiTests(unittest.TestCase):
 def test_same_claim(self): self.assertEqual(m.fingerprint(' GREEN  Tea '),m.fingerprint('green tea'))
 def test_distinct_scope(self): self.assertNotEqual(m.fingerprint('tea 1g'),m.fingerprint('tea 2g'))
 def test_schema_files(self):
  for name in ('claim','source','evidence','review'): self.assertEqual(m.load(m.ROOT/'schemas'/(name+'.schema.json'))['type'],'object')
 def test_empty_lint(self): self.assertTrue(m.lint())
