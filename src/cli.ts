import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fingerprint,loadRecords,validateRegistry} from './registry.js';
const args=process.argv.slice(2);const action=args[0];const root=resolve('.');
if(action==='lint'){
 const errors=validateRegistry(root);
 console.log(JSON.stringify({status:errors.length?'FAIL':'PASS',errors},null,2));
 if(errors.length)process.exitCode=1;
}else if(['ingest','dedup','version'].includes(action)){
 const index=args.indexOf('--input');if(index<0||!args[index+1])throw Error('--input required');
 const item=JSON.parse(readFileSync(resolve(args[index+1]),'utf8')) as {claim_text?:string};
 if(typeof item.claim_text!=='string'||item.claim_text.trim().length<5)throw Error('claim_text required');
 const matches=loadRecords(root,'claims').filter(c=>typeof c.claim_text==='string'&&fingerprint(c.claim_text)===fingerprint(item.claim_text!)).map(c=>c.claim_id);
 console.log(JSON.stringify({action,dry_run:args.includes('--dry-run'),fingerprint:fingerprint(item.claim_text),exact_duplicates:matches,decision:matches.length?'REVIEW_DUPLICATE':'PENDING_REVIEW'},null,2));
 if(!args.includes('--dry-run'))throw Error('Writes disabled pending evidence review and versioning implementation');
}else throw Error('Usage: lint | ingest|dedup|version --input FILE --dry-run');
