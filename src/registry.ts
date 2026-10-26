import {createHash} from 'node:crypto';
import {readFileSync, readdirSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

export type RecordData = Record<string, unknown>;
export const kinds = ['claims','sources','evidence','reviews'] as const;
export type Kind = typeof kinds[number];
const schemaNames: Record<Kind,string> = {claims:'claim',sources:'source',evidence:'evidence',reviews:'review'};
const idNames: Record<Kind,string> = {claims:'claim_id',sources:'source_id',evidence:'evidence_id',reviews:'review_id'};
export const normalize = (text:string):string => text.trim().toLocaleLowerCase('en-US').replace(/\s+/g,' ');
export const fingerprint = (text:string):string => createHash('sha256').update(normalize(text)).digest('hex');
export function loadRecords(root:string, kind:Kind):RecordData[] {
 const dir=join(root,'data',kind); if(!existsSync(dir)) return [];
 const walk=(p:string):string[]=>readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(p,e.name)):e.isFile()&&e.name.endsWith('.json')?[join(p,e.name)]:[]);
 return walk(dir).sort().map(p=>JSON.parse(readFileSync(p,'utf8')) as RecordData);
}
export function validateRegistry(root:string, clock=new Date()):string[] {
 const errors:string[]=[];
 const ajv=new Ajv2020({allErrors:true,strict:false}); addFormats(ajv);
 const maps={} as Record<Kind,Map<string,RecordData>>;
 for(const kind of kinds){
  const schema=JSON.parse(readFileSync(join(root,'schemas',schemaNames[kind]+'.schema.json'),'utf8'));
  const validate=ajv.compile(schema);
  const map=new Map<string,RecordData>(); maps[kind]=map;
  for(const record of loadRecords(root,kind)){
   if(!validate(record)) errors.push(...(validate.errors??[]).map(e=>kind+': '+(e.instancePath||'/')+' '+e.message));
   const id=record[idNames[kind]];
   if(typeof id!=='string'||!id) {errors.push(kind+': missing ID');continue;}
   if(map.has(id)) errors.push(kind+': duplicate ID '+id);
   map.set(id,record);
  }
 }
 const claims=maps.claims,sources=maps.sources,evidence=maps.evidence,reviews=maps.reviews;
 const seen=new Map<string,string>();
 for(const [cid,c] of claims){
  const text=String(c.claim_text??'');const key=fingerprint(text);
  if(seen.has(key))errors.push(cid+': exact duplicate of '+seen.get(key));seen.set(key,cid);
  for(const [field,map] of [['source_ids',sources],['evidence_ids',evidence],['review_ids',reviews]] as const){
   for(const id of Array.isArray(c[field])?c[field]:[])if(!map.has(String(id)))errors.push(cid+': missing '+field+' '+id);
  }
  for(const id of Array.isArray(c.evidence_ids)?c.evidence_ids:[]){
   const e=evidence.get(String(id));if(e&&e.claim_id!==cid)errors.push(cid+': evidence claim mismatch '+id);
  }
  for(const id of Array.isArray(c.review_ids)?c.review_ids:[]){
   const r=reviews.get(String(id));if(r&&r.claim_id!==cid)errors.push(cid+': review claim mismatch '+id);
  }
  if(c.status==='VERIFIED'){
   const approved=(Array.isArray(c.review_ids)?c.review_ids:[]).some(id=>{
    const r=reviews.get(String(id));
    return r?.decision==='VERIFIED'&&Array.isArray(r.evidence_ids)&&r.evidence_ids.length>0&&r.reviewer&&r.reviewed_at;
   });
   if(!c.verified_at||!Array.isArray(c.evidence_ids)||!c.evidence_ids.length||!approved)errors.push(cid+': VERIFIED lacks reviewed evidence');
  }
  if(c.publication_status==='PUBLIC'){
   if(c.status!=='VERIFIED'||c.freshness_status!=='CURRENT')errors.push(cid+': unsafe PUBLIC claim');
   if(typeof c.next_review_at==='string'&&Date.parse(c.next_review_at)<=clock.getTime())errors.push(cid+': review overdue');
  }
 }
 for(const [id,e] of evidence){
  if(!sources.has(String(e.source_id)))errors.push(id+': missing source');
  if(!claims.has(String(e.claim_id)))errors.push(id+': missing claim');
 }
 for(const [id,r] of reviews){
  if(!claims.has(String(r.claim_id)))errors.push(id+': missing claim');
  for(const eid of Array.isArray(r.evidence_ids)?r.evidence_ids:[]){
   const e=evidence.get(String(eid));if(!e||e.claim_id!==r.claim_id)errors.push(id+': invalid evidence '+eid);
  }
 }
 return errors;
}
