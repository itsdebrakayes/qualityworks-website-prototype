# Audit helper (QM-113 discovery): extract per-page SEO/heading/CTA/form data from saved HTML.
# Usage: python3 -I scripts/extract.py <pages-dir> <out.json>
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
    main = s.find(id='fl-main-content') or s.find('main') or s.body
    for t in main.find_all(['header','footer']):
        pass
    # strip global header/footer
    for sel in ['footer','[data-type="header"]','[data-type="footer"]','.fl-page-header','.pp-offcanvas-content','.uabb-creative-menu']:
        for t in s.select(sel): t.decompose()
    main = s.find(id='fl-main-content') or s.body
    r['h'] = [(t.name, re.sub(r'\s+',' ',t.get_text(' ',strip=True))[:110]) for t in main.find_all(['h1','h2','h3'])]
    btns=[]
    for a in main.select('a.fl-button, a.button, a[class*=btn], a[class*=button], button, input[type=submit]'):
        txt = re.sub(r'\s+',' ',a.get_text(' ',strip=True) or a.get('value','')); 
        if txt: btns.append((txt[:50], a.get('href','')))
    r['ctas'] = list(dict.fromkeys(btns))[:25]
    r['forms'] = []
    for f in main.find_all(['form','iframe']):
        if f.name=='iframe': r['forms'].append('iframe:'+ (f.get('src') or f.get('data-src') or '')[:100]); continue
        fields=[ (l.get_text(strip=True)) for l in f.find_all('label')] or [i.get('name') or i.get('placeholder') for i in f.find_all(['input','textarea','select']) if i.get('type')!='hidden']
        r['forms'].append('form:'+', '.join(x for x in fields if x)[:300])
    if 'hbspt' in str(main) or 'hsforms' in str(main): r['forms'].append('hubspot-embed')
    ext = set()
    for a in main.find_all('a', href=True):
        h=a['href']
        if h.startswith('http') and 'qualityworkscg.com' not in h: ext.add(h[:90])
        if re.search(r'\.(pdf|docx?|pptx?)$', h): ext.add('DOWNLOAD:'+h[:90])
    r['external'] = sorted(ext)[:20]
    cls = str(main)
    r['widgets'] = [w for w,p in [('accordion','fl-accordion'),('tabs','fl-tabs'),('slider','slick|swiper|fl-slider|owl-'),('video','<video|youtube|vimeo|wistia'),('counter','fl-number'),('testimonials','fl-testimonials'),('posts-grid','fl-post-grid|fl-post-feed'),('lottie','lottie'),('modal','modal|popup')] if re.search(p, cls)]
    r['imgs'] = len(main.find_all('img')); r['imgs_noalt'] = len([i for i in main.find_all('img') if not i.get('alt')])
    out[fn[:-5]] = r
json.dump(out, open(sys.argv[2],'w'), indent=1)
