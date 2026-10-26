import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {planIngest} from '../src/ingest.js';
const source={title:'Source image transcription',retrieved_at:'2026-10-26T00:00:00Z',raw_text:'Green tea lowers blood pressure. Black tea helps sleep.'};
test('one source can create separate atomic candidates without verifying',()=>{
 const result=planIngest({source,candidates:[
  {claim_text:'Green tea lowers blood pressure',scope:{outcome:'blood pressure'}},
  {claim_text:'Black tea helps sleep',scope:{outcome:'sleep'}}]});
 assert.equal(result.candidate_count,2);assert.equal(result.errors.length,0);
 assert.ok(result.claims.every(c=>c.status==='PENDING'&&c.publication_status==='PRIVATE'));
 assert.equal(result.write_allowed,false);
});
test('exact duplicates are flagged, not merged automatically',()=>{
 const result=planIngest({source,candidates:[{claim_text:'Green tea lowers blood pressure',scope:{outcome:'blood pressure'}}]},
 [{claim_id:'CL-1',claim_text:' green  tea lowers blood pressure '}]);
 assert.deepEqual(result.claims[0].exact_duplicate_ids,['CL-1']);
 assert.equal(result.claims[0].decision,'REVIEW_DUPLICATE');
});
test('requires atomic candidates and source provenance',()=>{
 const result=planIngest({source:{title:'',retrieved_at:'',raw_text:''},candidates:[]});
 assert.ok(result.errors.length>=2);
});
