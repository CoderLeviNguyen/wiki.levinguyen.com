import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {fingerprint,validateRegistry} from '../src/registry.js';
test('normalizes whitespace and case',()=>assert.equal(fingerprint(' GREEN  Tea '),fingerprint('green tea')));
test('does not collapse dose differences',()=>assert.notEqual(fingerprint('tea 1g'),fingerprint('tea 2g')));
test('empty registry passes',()=>assert.deepEqual(validateRegistry(resolve('.')),[]));
test('rejects public unverified claim',()=>{
 const dir=mkdtempSync(join(tmpdir(),'wiki-test-'));
 try{
  mkdirSync(join(dir,'schemas'));for(const name of ['claim','source','evidence','review'])writeFileSync(join(dir,'schemas',name+'.schema.json'),readFileSync(resolve('schemas',name+'.schema.json')));
  for(const kind of ['claims','sources','evidence','reviews'])mkdirSync(join(dir,'data',kind),{recursive:true});
  writeFileSync(join(dir,'data','claims','a.json'),JSON.stringify({claim_id:'FOOD-000001',revision:1,claim_text:'A test claim',domain:'food',status:'PENDING',evidence_ids:[],source_ids:[],review_ids:[],publication_status:'PUBLIC'}));
  assert.ok(validateRegistry(dir).some(e=>e.includes('unsafe PUBLIC')));
 }finally{rmSync(dir,{recursive:true,force:true});}
});
