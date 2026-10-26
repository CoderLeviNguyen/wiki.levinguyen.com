import argparse, hashlib, json, pathlib, re, sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
def norm(s): return re.sub(r'\s+',' ',s.casefold().strip())
def fingerprint(s): return hashlib.sha256(norm(s).encode()).hexdigest()
def load(p): return json.loads(pathlib.Path(p).read_text(encoding='utf-8'))
def records(name): return [load(p) for p in (ROOT/'data'/name).rglob('*.json')]
def lint():
    claims=records('claims'); sources={x['source_id']:x for x in records('sources')}; ev={x['evidence_id']:x for x in records('evidence')}; reviews={x['review_id']:x for x in records('reviews')}
    errors=[]; seen={}
    for c in claims:
        cid=c['claim_id']; f=fingerprint(c['claim_text'])
        if f in seen: errors.append('duplicate '+cid+' '+seen[f])
        seen[f]=cid
        for field,lookup in [('source_ids',sources),('evidence_ids',ev),('review_ids',reviews)]:
            for ref in c.get(field,[]):
                if ref not in lookup: errors.append(cid+' missing '+ref)
        if c['status']=='VERIFIED' and (not c.get('evidence_ids') or not c.get('review_ids') or not c.get('verified_at') or not any(reviews[r].get('decision')=='VERIFIED' for r in c['review_ids'] if r in reviews)): errors.append(cid+' unsupported VERIFIED')
        if c.get('publication_status')=='PUBLIC' and (c['status']!='VERIFIED' or c.get('freshness_status')!='CURRENT'): errors.append(cid+' unsafe publication')
    for e in ev.values():
        if e['source_id'] not in sources: errors.append('orphan evidence '+e['evidence_id'])
    print(json.dumps({'claims':len(claims),'sources':len(sources),'evidence':len(ev),'reviews':len(reviews),'errors':errors},ensure_ascii=False))
    return not errors
def main():
    p=argparse.ArgumentParser(); p.add_argument('action',choices=['lint','ingest','dedup','version']); p.add_argument('--input'); p.add_argument('--dry-run',action='store_true'); a=p.parse_args()
    if a.action=='lint': sys.exit(0 if lint() else 1)
    if not a.input: p.error('--input required')
    item=load(a.input); claim=item.get('claim_text','')
    if not claim: p.error('claim_text required')
    matches=[c['claim_id'] for c in records('claims') if fingerprint(c['claim_text'])==fingerprint(claim)]
    print(json.dumps({'action':a.action,'dry_run':a.dry_run,'fingerprint':fingerprint(claim),'exact_duplicates':matches,'decision':'REVIEW_DUPLICATE' if matches else 'PENDING_REVIEW'},ensure_ascii=False))
    if not a.dry_run: sys.exit('Write disabled: approval and review required')
if __name__=='__main__': main()
