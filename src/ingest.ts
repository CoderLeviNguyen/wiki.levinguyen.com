import {createHash} from 'node:crypto';
import {fingerprint, type RecordData} from './registry.js';

export interface AtomicCandidate {
 claim_text:string;
 scope?: {population?:string; dose?:string; jurisdiction?:string; effective_date?:string; outcome?:string};
}
export interface IngestEnvelope {
 source:{title:string;url?:string;retrieved_at:string;raw_text:string};
 candidates:AtomicCandidate[];
}
export interface ExistingClaim {claim_id:string;claim_text:string}
export function planIngest(input:IngestEnvelope, existing:ExistingClaim[]=[]){
 const errors:string[]=[];
 if(!input||!input.source||typeof input.source.raw_text!=='string'||!input.source.raw_text.trim())errors.push('source.raw_text required');
 if(!input?.source?.title||!input?.source?.retrieved_at)errors.push('source title and retrieved_at required');
 if(!Array.isArray(input?.candidates)||input.candidates.length===0)errors.push('atomic candidates required: do not invent claims from unparsed source');
 const raw=input?.source?.raw_text??'';
 const sourceHash=createHash('sha256').update(raw,'utf8').digest('hex');
 const seen=new Map<string,number>();
 const claims=(Array.isArray(input?.candidates)?input.candidates:[]).map((c,i)=>{
  const claimText=typeof c?.claim_text==='string'?c.claim_text.trim():'';
  if(claimText.length<5)errors.push('candidate '+(i+1)+': claim_text too short');
  const fp=fingerprint(claimText);
  if(seen.has(fp))errors.push('candidate '+(i+1)+': duplicate of candidate '+seen.get(fp));
  seen.set(fp,i+1);
  const matches=existing.filter(e=>fingerprint(e.claim_text)===fp).map(e=>e.claim_id);
  const scope=c.scope??{};
  const needsScope= !scope.outcome;
  return {candidate_index:i+1,claim_text:claimText,fingerprint:fp,scope,
   exact_duplicate_ids:matches,status:'PENDING',publication_status:'PRIVATE',
   decision:matches.length?'REVIEW_DUPLICATE':needsScope?'REVIEW_SCOPE':'PENDING_EVIDENCE',
   evidence_ids:[],review_ids:[]};
 });
 return {mode:'DRY_RUN',source_sha256:sourceHash,source_title:input?.source?.title??null,
  candidate_count:claims.length,claims,errors,write_allowed:false};
}
