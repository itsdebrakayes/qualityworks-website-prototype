# Audit helper (QM-113 discovery): extract per-page SEO/heading/CTA/form data from saved HTML.
# Usage: python3 -I scripts/extract.py <pages-dir> <out.json>
#
# WHAT: one-off discovery tool used to audit the live site. For every saved HTML page in <pages-dir>
#   it records the SEO and structure facts the audit needed, and writes them all to <out.json>.
#
# OUTPUT: a JSON object keyed by file name (without .html). Per page:
#   title, desc (meta description), canonical, robots, og (has og:title), jsonld (list of @type
#   values, or 'parse-error'), h (h1-h3 tags and text, after removing the global header/footer),
#   ctas (up to 25 unique button-like links as [text, href]), forms (form labels/field names,
#   iframes, 'hubspot-embed'), external (up to 20 off-site links and document downloads),
#   widgets (Beaver Builder / plugin widgets detected by class names), imgs and imgs_noalt counts.
#
# REQUIRES: Python 3 with BeautifulSoup (bs4). Run with -I (isolated mode) as in the usage line; the
#   input pages are downloaded HTML. The output is discovery/audit evidence (README: "audit helpers"), not site data.
#
# GOTCHA: selectors such as #fl-main-content, .fl-page-header and .fl-button are specific to the
#   old WordPress theme (Beaver Builder); the script is not meant for the new site.
import sys, os, json, re
from bs4 import BeautifulSoup
d = sys.argv[1]; out = {}
for fn in sorted(os.listdir(d)):
    s = BeautifulSoup(open(os.path.join(d,fn),encoding='utf-8',errors='ignore').read(), 'html.parser')
    r = {}
    r['title'] = s.title.get_text(strip=True) if s.title else ''
    m = s.find('meta', attrs={'name':'description'}); r['desc'] = m['content'] if m and m.get('content') else ''
    c = s.find('link', rel='canonical'); r['canonical'] = c['href'] if c else ''
    rb = s.find('meta', attrs={'name':'robots'}); r['robots']= rb['content'] if rb else ''
    r['og'] = bool(s.find('meta', property='og:title'))
    r['jsonld'] = []
    for sc in s.find_all('script', type='application/ld+json'):
        try:
            j = json.loads(sc.string or '{}'); g = j.get('@graph',[j]) if isinstance(j,dict) else j
            r['jsonld'] += [x.get('@type') for x in g if isinstance(x,dict)]
        except Exception: r['jsonld'].append('parse-error')
    # Main content area: Beaver Builder's main wrapper, else <main>, else the whole body.
    main = s.find(id='fl-main-content') or s.find('main') or s.body
    # (No-op loop left over from development: it does nothing.)
    for t in main.find_all(['header','footer']):
        pass
    # strip global header/footer
    for sel in ['footer','[data-type="header"]','[data-type="footer"]','.fl-page-header','.pp-offcanvas-content','.uabb-creative-menu']:
        for t in s.select(sel): t.decompose()
    # Re-select the main area after the global chrome was removed.
    main = s.find(id='fl-main-content') or s.body
    r['h'] = [(t.name, re.sub(r'\s+',' ',t.get_text(' ',strip=True))[:110]) for t in main.find_all(['h1','h2','h3'])]
    # Button-like links and buttons; text trimmed to 50 characters, duplicates removed in order.
    btns=[]
    for a in main.select('a.fl-button, a.button, a[class*=btn], a[class*=button], button, input[type=submit]'):
        txt = re.sub(r'\s+',' ',a.get_text(' ',strip=True) or a.get('value','')); 
        if txt: btns.append((txt[:50], a.get('href','')))
    r['ctas'] = list(dict.fromkeys(btns))[:25]
    # Forms: prefer visible <label> text; otherwise field names/placeholders (hidden inputs skipped).
    r['forms'] = []
    for f in main.find_all(['form','iframe']):
        if f.name=='iframe': r['forms'].append('iframe:'+ (f.get('src') or f.get('data-src') or '')[:100]); continue
        fields=[ (l.get_text(strip=True)) for l in f.find_all('label')] or [i.get('name') or i.get('placeholder') for i in f.find_all(['input','textarea','select']) if i.get('type')!='hidden']
        r['forms'].append('form:'+', '.join(x for x in fields if x)[:300])
    # HubSpot forms are injected by script; detect them by their embed code.
    if 'hbspt' in str(main) or 'hsforms' in str(main): r['forms'].append('hubspot-embed')
    # Off-site links (anything not on qualityworkscg.com) and links to PDF/Word/PowerPoint files.
    ext = set()
    for a in main.find_all('a', href=True):
        h=a['href']
        if h.startswith('http') and 'qualityworkscg.com' not in h: ext.add(h[:90])
        if re.search(r'\.(pdf|docx?|pptx?)$', h): ext.add('DOWNLOAD:'+h[:90])
    r['external'] = sorted(ext)[:20]
    cls = str(main)
    # Widget detection: (name, regex over the main HTML); a name is listed when its regex matches.
    r['widgets'] = [w for w,p in [('accordion','fl-accordion'),('tabs','fl-tabs'),('slider','slick|swiper|fl-slider|owl-'),('video','<video|youtube|vimeo|wistia'),('counter','fl-number'),('testimonials','fl-testimonials'),('posts-grid','fl-post-grid|fl-post-feed'),('lottie','lottie'),('modal','modal|popup')] if re.search(p, cls)]
    r['imgs'] = len(main.find_all('img')); r['imgs_noalt'] = len([i for i in main.find_all('img') if not i.get('alt')])
    out[fn[:-5]] = r
json.dump(out, open(sys.argv[2],'w'), indent=1)
