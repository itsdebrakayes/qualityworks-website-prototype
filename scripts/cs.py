# Audit helper: parse case-study sections from rendered pages + REST metadata.
# Usage: python3 -I scripts/cs.py <pages-dir> <cs.json from REST> <out.json>
import sys,os,re,json
from bs4 import BeautifulSoup
d=sys.argv[1]; api={p['slug']:p for p in json.load(open(sys.argv[2]))}; out=[]
for fn in sorted(os.listdir(d)):
  if not fn.startswith('case-study__'): continue
  slug=fn[12:-5]; s=BeautifulSoup(open(os.path.join(d,fn)).read(),'html.parser')
  for t in s(['script','style','noscript','svg','footer','nav']): t.decompose()
  for t in s.select('[data-type=header],[data-type=footer]'): t.decompose()
  lines=[l for l in s.body.get_text('\n',strip=True).split('\n')]
  sec={}; cur=None
  keys={'The Customer':'customer','The Challenge':'challenge','Our Solution':'approach','The Solution':'approach','The Result':'outcome','The Results':'outcome','Results':'outcome'}
  for l in lines:
    if l in keys: cur=keys[l]; sec.setdefault(cur,[]); continue
    if re.match(r'^(Read More|Related|Get In Touch|Let.s Talk|Other Case Studies|Ready to)',l): cur=None
    if cur: sec[cur].append(l)
  # dedupe tab labels: keep longest occurrence
  res={k:' '.join(v)[:1400] for k,v in sec.items()}
  p=api.get(slug,{}); img=''
  try: img=p['_embedded']['wp:featuredmedia'][0]['source_url']; alt=p['_embedded']['wp:featuredmedia'][0].get('alt_text','')
  except Exception: alt=''
  out.append(dict(slug=slug,title=BeautifulSoup(p.get('title',{}).get('rendered',''),'html.parser').get_text(),date=p.get('date','')[:10],excerpt=BeautifulSoup(p.get('excerpt',{}).get('rendered',''),'html.parser').get_text().strip(),image=img,alt=alt,**res))
json.dump(out,open(sys.argv[3],'w'),indent=1)
