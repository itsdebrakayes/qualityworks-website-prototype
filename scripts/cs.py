# Audit helper: parse case-study sections from rendered pages + REST metadata.
# Usage: python3 -I scripts/cs.py <pages-dir> <cs.json from REST> <out.json>
#
# WHAT: builds the raw case-study snapshot. WordPress keeps case-study bodies in Beaver Builder
#   layouts (content.rendered is empty), so the sections are read from the saved public pages and
#   combined with metadata from the WordPress REST API.
#
# INPUTS
#   <pages-dir>  folder of saved rendered pages named "case-study__{slug}.html" (other files ignored).
#   <cs.json>    JSON array of case-study posts from the WordPress REST API, fetched with _embed so
#                each post includes its featured media (image URL and alt text).
#   <out.json>   output path; overwritten.
#
# OUTPUT: a JSON array, one object per page: slug, title, date (YYYY-MM-DD), excerpt, image, alt,
#   plus whichever sections were found: customer, challenge, approach, outcome. The result is
#   stored as src/data/migrated/case-studies.wp-snapshot.json, which src/data/caseStudies.ts reads
#   (CONTRIBUTING.md 4.2). Never edit that snapshot by hand; re-run this script instead.
#
# REQUIRES: Python 3 with BeautifulSoup (bs4). Run with -I (isolated mode) as in the usage line;
#   the input pages are downloaded HTML.
#
# GOTCHAS
#   - Sections are recognised only by the exact heading texts in `keys` below. A page that uses a
#     different heading loses that section silently.
#   - The parser can capture the old site's related-links strip at the end of a section;
#     caseStudies.ts strips known titles from the end of approach/outcome to compensate.
import sys,os,re,json
from bs4 import BeautifulSoup
d=sys.argv[1]; api={p['slug']:p for p in json.load(open(sys.argv[2]))}; out=[]
# d = pages folder; api = REST posts keyed by slug; out = collected records.
for fn in sorted(os.listdir(d)):
  if not fn.startswith('case-study__'): continue
  # Slug = file name minus the 12-character 'case-study__' prefix and the '.html' suffix.
  slug=fn[12:-5]; s=BeautifulSoup(open(os.path.join(d,fn)).read(),'html.parser')
  # Remove non-content markup and the site header/footer (Beaver Builder marks them with data-type).
  for t in s(['script','style','noscript','svg','footer','nav']): t.decompose()
  for t in s.select('[data-type=header],[data-type=footer]'): t.decompose()
  # One entry per visible text line, in page order.
  lines=[l for l in s.body.get_text('\n',strip=True).split('\n')]
  sec={}; cur=None
  # Section heading text on the live pages -> schema field. Several spellings map to the same field.
  keys={'The Customer':'customer','The Challenge':'challenge','Our Solution':'approach','The Solution':'approach','The Result':'outcome','The Results':'outcome','Results':'outcome'}
  # Walk the lines: a heading line switches the current section; a closing marker (Read More, Related,
  # Get In Touch, Let's Talk with any apostrophe, Other Case Studies, Ready to...) ends it; other lines
  # are appended to the current section.
  for l in lines:
    if l in keys: cur=keys[l]; sec.setdefault(cur,[]); continue
    if re.match(r'^(Read More|Related|Get In Touch|Let.s Talk|Other Case Studies|Ready to)',l): cur=None
    if cur: sec[cur].append(l)
  # dedupe tab labels: keep longest occurrence
  # (Note: the line below simply joins each section's lines with spaces; no de-duplication is done.)
  res={k:' '.join(v) for k,v in sec.items()}
  # Featured image and alt text from the embedded REST data; missing media leaves both empty.
  p=api.get(slug,{}); img=''
  try: img=p['_embedded']['wp:featuredmedia'][0]['source_url']; alt=p['_embedded']['wp:featuredmedia'][0].get('alt_text','')
  except Exception: alt=''
  # Title and excerpt are rendered HTML in the REST API, so they are converted to plain text.
  out.append(dict(slug=slug,title=BeautifulSoup(p.get('title',{}).get('rendered',''),'html.parser').get_text(),date=p.get('date','')[:10],excerpt=BeautifulSoup(p.get('excerpt',{}).get('rendered',''),'html.parser').get_text().strip(),image=img,alt=alt,**res))
json.dump(out,open(sys.argv[3],'w'),indent=1)
