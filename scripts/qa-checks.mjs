/**
 * QM-113 automated QA suite. Run against a built + previewed site:
 *   npm run build && npx astro preview --port 4321 &  then  npm run qa:checks
 * Writes qa-output/results.json (consumed by docs/07-qa-testing-summary.md) and evidence screenshots.
 * Uses the pre-installed Playwright (require('playwright')) and axe-core.
 *
 * RUN BY: `npm run qa:checks` (this script, then scripts/qa-report.mjs, which turns results.json into
 *   docs/07-qa-testing-summary.md).
 * ENV: QA_BASE  base URL of the running preview (default http://localhost:4321).
 * INPUTS: the built site in dist/ (used to list every route and to resolve asset links) and the same
 *   site served at QA_BASE; node_modules/axe-core/axe.min.js (devDependency).
 * OUTPUTS: qa-output/results.json ({ runAt, base, routes, externalLinks, results[] }) and PNG
 *   evidence in qa-output/evidence/. Console: one PASS/FAIL/BLOCK line per check plus a summary.
 *   The script does not set a failing exit code; read the summary or docs/07.
 *
 * WHAT IS CHECKED (ids QA-01 … QA-32; QM-112 mapping lives in qa-report.mjs)
 *   1 static per-page checks (headings, links, alt, titles, JSON-LD)   2 horizontal overflow at five
 *   widths + screenshots   3 axe-core WCAG A/AA   4 every glyph rendered in a brand font (Montserrat / Lato)
 *   5 desktop mega-menu (mouse + keyboard + active state)   6 mobile drawer   7 homepage CTAs
 *   8 contact form states   9 case-study filters   10 resource filters   11 event states
 *   12 careers states   13 FAQ accordion + reduced motion   then runtime errors and Blocked items.
 *
 * RULES (CONTRIBUTING.md §7): a check is Pass only when the behaviour is really exercised in the
 *   browser. Simulated behaviour must say so in `issue`. A check that cannot run (no access) records
 *   pass = null, which reports Blocked, never Pass.
 *
 * HOW TO ADD A CHECK (CONTRIBUTING.md 4.9): add a block that drives the page, then call
 *   rec(id, ac, area, expected, pass, actual, evidence, issue), and map the id in qa-report.mjs.
 *
 * GOTCHA: many checks depend on exact selectors, ids and copy in the components (e.g.
 *   #menu-solutions, [data-drawer-open], #cf-email, "Thank you, Test"). Renaming them in a component
 *   breaks the matching check; update both together.
 */
import { createRequire } from 'node:module';
import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

// Where the site is served, where results go, and the built output used for the route inventory.
const BASE = process.env.QA_BASE ?? 'http://localhost:4321';
const OUT = new URL('../qa-output/', import.meta.url).pathname;
const DIST = new URL('../dist/', import.meta.url).pathname;
mkdirSync(join(OUT, 'evidence'), { recursive: true });
// axe-core source, injected into each audited page as a script tag.
const AXE = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const results = [];
/**
 * Record one check result and print it.
 * @param id       check id, e.g. 'QA-07-360' (suffixes allowed; qa-report maps the base id).
 * @param ac       requirement label shown in the console/results (e.g. 'BR-12 A11y').
 * @param area     page or component under test.
 * @param expected the expected behaviour, in words.
 * @param pass     true = Pass, false = Fail, null = Blocked (could not be tested).
 * @param actual   what was observed.
 * @param evidence screenshot path or other evidence (optional).
 * @param issue    open issue / caveat, e.g. "Mocked: …" (optional).
 */
const rec = (id, ac, area, expected, pass, actual, evidence = '', issue = '') => {
  results.push({ id, ac, area, expected, actual, status: pass === null ? 'Blocked' : pass ? 'Pass' : 'Fail', evidence, issue });
  console.log(`${pass === null ? 'BLOCK' : pass ? 'PASS ' : 'FAIL '} ${id} ${area}: ${actual}`);
};

// ---- route inventory from dist
// Every directory containing an index.html is a route ('/about-us/', …), sorted for stable output.
const routes = [];
(function walk(dir) { for (const f of readdirSync(dir)) { const p = join(dir, f); if (statSync(p).isDirectory()) walk(p); else if (f === 'index.html') routes.push('/' + p.slice(DIST.length).replace(/index\.html$/, '')); } })(DIST);
routes.sort();
const routeSet = new Set(routes);

// One shared desktop page (1440x900) for most checks; uncaught page errors are collected for QA-30.
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const consoleErrors = [];
page.on('pageerror', (e) => consoleErrors.push(e.message));

// ---- 1. Per-page static checks (headings, titles, alt, links, JSON-LD)
// Accumulators: title/description -> routes (to find duplicates) and one issue list per check.
const titles = new Map(); const descs = new Map();
const brokenLinks = []; const placeholderLinks = []; const legacyCaseLinks = []; const headingIssues = []; const altIssues = []; const extIssues = []; const ldIssues = [];
const externalLinks = new Set();
for (const r of routes) {
  await page.goto(BASE + r, { waitUntil: 'domcontentloaded' });
  const info = await page.evaluate(() => {
    const hs = [...document.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6')].map((h) => +h.tagName[1]);
    const h1s = document.querySelectorAll('h1').length;
    const links = [...document.querySelectorAll('a[href]')].map((a) => ({ href: a.getAttribute('href'), target: a.target, rel: a.rel, text: a.textContent.trim() }));
    const imgs = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).map((i) => i.src);
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { JSON.parse(s.textContent); return 'ok'; } catch { return 'bad'; } });
    return { title: document.title, desc: document.querySelector('meta[name=description]')?.content ?? '', canonical: document.querySelector('link[rel=canonical]')?.href ?? '', hs, h1s, links, imgs, ld };
  });
  // Exactly one h1; then within <main>, a heading may go at most one level deeper than the previous
  // one (going back up any number of levels is fine). Only the first skip per page is reported.
  if (info.h1s !== 1) headingIssues.push(`${r}: ${info.h1s} h1`);
  for (let i = 1; i < info.hs.length; i++) if (info.hs[i] - info.hs[i - 1] > 1) { headingIssues.push(`${r}: h${info.hs[i - 1]}→h${info.hs[i]}`); break; }
  if (info.imgs.length) altIssues.push(`${r}: ${info.imgs.length}`);
  if (info.ld.includes('bad')) ldIssues.push(r);
  if (!info.canonical) ldIssues.push(`${r}: no canonical`);
  titles.set(info.title, [...(titles.get(info.title) ?? []), r]);
  descs.set(info.desc, [...(descs.get(info.desc) ?? []), r]);
  // Classify every link: placeholders ('#', empty, javascript:) and legacy /case-study/ paths are
  // errors; mailto/tel and in-page anchors are skipped; absolute http(s) links are external and must
  // open in a new tab with rel=noopener; everything else must resolve to a built route or a file in dist/.
  for (const l of info.links) {
    const h = l.href;
    if (h === '#' || h.trim() === '' || /^javascript:/i.test(h)) { placeholderLinks.push(`${r} → "${h}" (${l.text.slice(0, 40)})`); continue; }
    if (/^\/case-study\//.test(h)) legacyCaseLinks.push(`${r} → ${h}`);
    if (/^(mailto|tel):/.test(h) || h.startsWith('#')) continue;
    if (/^https?:/.test(h)) { externalLinks.add(h); if (l.target !== '_blank' || !l.rel.includes('noopener')) extIssues.push(`${r} → ${h}`); continue; }
    const path = h.split('#')[0].split('?')[0];
    if (!path) continue;
    const norm = path.endsWith('/') ? path : path + '/';
    if (!routeSet.has(norm) && !existsSync(join(DIST, path))) brokenLinks.push(`${r} → ${h}`);
  }
}
// Duplicates: any title or non-empty description shared by more than one route.
const dupTitles = [...titles].filter(([, v]) => v.length > 1);
const dupDescs = [...descs].filter(([k, v]) => v.length > 1 && k);
rec('QA-01', 'BR-10 SEO', `All ${routes.length} routes`, 'Exactly one H1 per page and no skipped heading levels', headingIssues.length === 0, headingIssues.length ? headingIssues.join('; ') : `${routes.length} pages: 1 H1 each, no level skips`, 'qa-output/results.json', headingIssues.length ? 'See list' : '');
rec('QA-02', 'BR-11/13 Links', 'All internal links', 'Every internal href resolves to a built route or asset', brokenLinks.length === 0, brokenLinks.length ? `${brokenLinks.length} broken: ${brokenLinks.slice(0, 6).join('; ')}` : 'No broken internal links', 'qa-output/results.json');
rec('QA-02B', 'QM-112 1.4 / AC-INV-02', 'All links and CTAs', 'No placeholder destinations ("#", empty, javascript:) and no legacy /case-study/ links', placeholderLinks.length === 0 && legacyCaseLinks.length === 0, `placeholder links: ${placeholderLinks.length}${placeholderLinks.length ? ' ' + placeholderLinks.slice(0, 4).join('; ') : ''}; legacy case-study links: ${legacyCaseLinks.length}`, 'qa-output/results.json');
rec('QA-03', 'BR-13 External hand-off', 'External links', 'Every external link opens in a new tab with rel=noopener', extIssues.length === 0, extIssues.length ? extIssues.slice(0, 5).join('; ') : `${externalLinks.size} unique external URLs, all target=_blank rel=noopener`, '');
rec('QA-04', 'BR-12 A11y', 'Images', 'Every <img> has an alt attribute (empty for decorative)', altIssues.length === 0, altIssues.length ? altIssues.join('; ') : 'All images have alt', '');
rec('QA-05', 'BR-10 SEO', 'Titles & descriptions', 'Unique <title> and meta description per page', dupTitles.length === 0 && dupDescs.length === 0, `Duplicate titles: ${dupTitles.length}; duplicate descriptions: ${dupDescs.length}${dupDescs.length ? ' (' + dupDescs.map(([, v]) => v.join(',')).join(' | ') + ')' : ''}`, '');
rec('QA-06', 'BR-10 SEO', 'Structured data', 'All JSON-LD parses; canonical present', ldIssues.length === 0, ldIssues.length ? ldIssues.join('; ') : 'All JSON-LD valid JSON; canonical on every page', '');

// ---- 2. Overflow at breakpoints (+ 200% zoom approximation = 640 CSS px)
// Key routes get screenshots at each width and are also audited with axe below.
const keyRoutes = ['/', '/services/', '/services/test-automation/', '/qualitywatcher-ai-tools/', '/products/agents-as-a-service/', '/products/prism/', '/industries/public-sector/', '/case-studies/', '/case-studies/jmmb-group-leverages-automation-best-practices/', '/resources/', '/more-qa-not-less-closing-the-verification-gap-in-ai-accelerated-software-delivery/', '/events/', '/contact-us/', '/careers/', '/about-us/', '/design-system/'];
// 640px stands in for 200% zoom of a 1280px window. Overflow = document scrollWidth larger than the
// viewport. Before screenshots, lazy images are forced to load and .reveal content is made visible.
for (const w of [360, 640, 768, 1024, 1440]) {
  const p = await browser.newPage({ viewport: { width: w, height: 900 } });
  const bad = [];
  for (const r of routes) {
    await p.goto(BASE + r, { waitUntil: 'domcontentloaded' });
    const sw = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (sw > 0) bad.push(`${r} (+${sw}px)`);
    if (keyRoutes.includes(r) && [360, 768, 1024, 1440].includes(w)) {
      await p.evaluate(() => { document.querySelectorAll('img[loading=lazy]').forEach((i) => (i.loading = 'eager')); document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-visible')); });
      await p.waitForLoadState('networkidle');
      const name = (r === '/' ? 'home' : r.replace(/^\/|\/$/g, '').replace(/\//g, '__')).slice(0, 60);
      await p.screenshot({ path: join(OUT, 'evidence', `${w}-${name}.png`), fullPage: w !== 1440 || ['/', '/case-studies/'].includes(r) });
    }
  }
  rec(`QA-07-${w}`, 'BR-11 Responsive', `All routes @${w}px${w === 640 ? ' (approx. 200% zoom of 1280)' : ''}`, 'No horizontal scrolling', bad.length === 0, bad.length ? bad.join('; ') : `${routes.length} routes, no horizontal overflow`, `qa-output/evidence/${w}-*.png`);
  await p.close();
}

// ---- 3. axe-core (WCAG 2.x A/AA rules incl. colour contrast)
// Key routes plus four more pages; WCAG 2.0/2.1 A and AA plus WCAG 2.2 AA rule tags.
const axeFindings = [];
for (const r of keyRoutes.concat(['/industries/', '/products/', '/blog/', '/events/pnsqc-2026/'])) {
  await page.goto(BASE + r, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-visible')));
  await page.waitForTimeout(800);
  await page.addScriptTag({ content: AXE });
  const res = await page.evaluate(async () => { const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }); return r.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, sample: v.nodes[0]?.target?.join(' ') })); });
  for (const v of res) axeFindings.push(`${r}: ${v.id} (${v.impact}, ${v.n}) e.g. ${v.sample}`);
}
rec('QA-08', 'BR-12 A11y', '20 key pages (axe-core 4.10, WCAG 2.2 A/AA tags)', 'No automated WCAG A/AA violations incl. colour contrast', axeFindings.length === 0, axeFindings.length ? axeFindings.slice(0, 10).join(' | ') : '0 violations on 20 pages', '', 'Automated checks cover ~30–40% of WCAG; manual screen-reader testing still required');

// ---- 4. Typography: every rendered glyph comes from Montserrat (display) or Lato (body)
// Uses the DevTools Protocol (CSS.getPlatformFontsForNode) to ask Chromium which font actually drew the
// glyphs of every element; any family other than Montserrat / Lato is a finding. Code samples
// (code, pre, kbd, samp subtrees) are skipped: they deliberately use the system monospace stack
// (--font-code). Elements that cannot be queried are skipped (the empty catch).
const fontFindings = [];
const cdp = await ctx.newCDPSession(page);
await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
for (const r of ['/', '/services/test-automation/', '/qualitywatcher-ai-tools/', '/case-studies/fintech-legacy-platform-modernization/', '/case-studies/', '/contact-us/', '/products/prism/', '/more-qa-not-less-closing-the-verification-gap-in-ai-accelerated-software-delivery/']) {
  await page.goto(BASE + r, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const { root } = await cdp.send('DOM.getDocument', { depth: -1, pierce: false });
  const nodes = [];
  (function walk(n) { if (['CODE', 'PRE', 'KBD', 'SAMP'].includes(n.nodeName)) return; if (n.nodeType === 1 && !['SCRIPT', 'STYLE', 'HEAD', 'svg', 'NOSCRIPT', 'TITLE'].includes(n.nodeName)) nodes.push(n.nodeId); (n.children ?? []).forEach(walk); })(root);
  const used = new Map();
  for (const id of nodes) {
    try {
      const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId: id });
      for (const f of fonts) if (f.glyphCount > 0) used.set(f.familyName, (used.get(f.familyName) ?? 0) + f.glyphCount);
    } catch {}
  }
  const off = [...used].filter(([fam]) => !/^(Montserrat|Lato)\b/.test(fam));
  if (off.length) fontFindings.push(`${r}: ${off.map(([f, n]) => `${f}×${n}`).join(', ')}`);
}
rec('QA-09', 'BR-17 Typography', '8 representative pages, every text node', 'All glyphs rendered in Montserrat / Lato (no fallback font for any character; code samples excluded)', fontFindings.length === 0, fontFindings.length ? fontFindings.join(' | ') : 'All glyphs on 8 pages rendered by Montserrat/Lato (via CDP CSS.getPlatformFontsForNode)', '');

// ---- 5. Desktop mega-menu behaviour
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
const trig = page.locator('[data-menu-trigger][aria-controls="menu-solutions"]');
const panel = page.locator('#menu-solutions');
const tb = await trig.boundingBox();
// Hover the Solutions trigger and wait past the open delay.
await page.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2);
await page.waitForTimeout(250);
const openOnHover = await panel.isVisible();
// move slowly down into the panel to a link far away (diagonal path)
const target = page.locator('#menu-solutions a', { hasText: 'Data Quality' });
const lb = await target.boundingBox();
await page.mouse.move(lb.x + lb.width / 2, lb.y + lb.height / 2, { steps: 25 });
await page.waitForTimeout(400);
const staysOpen = await panel.isVisible();
await page.screenshot({ path: join(OUT, 'evidence', 'nav-mega-solutions-hover.png') });
rec('QA-10', 'BR-5 Header', 'Desktop dropdown (mouse)', 'Hover opens Solutions; moving diagonally into the panel keeps it open', openOnHover && staysOpen, `open on hover: ${openOnHover}; still open after 25-step move to far link: ${staysOpen}`, 'qa-output/evidence/nav-mega-solutions-hover.png');
// Move the pointer below the panel and wait longer than the close delay.
const pb = await panel.boundingBox();
await page.mouse.move(pb.x + 20, Math.min(pb.y + pb.height + 60, 880), { steps: 5 }); await page.waitForTimeout(450);
const closesOnLeave = !(await panel.isVisible());
rec('QA-11', 'BR-5 Header', 'Desktop dropdown (mouse leave)', 'Panel closes ~280ms after the pointer leaves', closesOnLeave, `closed after leave: ${closesOnLeave}`);
// keyboard
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await trig.focus(); await page.keyboard.press('Enter');
const kbOpen = (await trig.getAttribute('aria-expanded')) === 'true' && await panel.isVisible();
await page.keyboard.press('Escape');
const kbClosed = !(await panel.isVisible()) && (await page.evaluate(() => document.activeElement?.getAttribute('aria-controls'))) === 'menu-solutions';
await trig.focus(); await page.keyboard.press('ArrowDown');
const firstFocused = await page.evaluate(() => document.activeElement?.closest('#menu-solutions') !== null);
// Forty Tabs is more than the number of links in the panel, so focus must have left it by now.
let tabOut = true; for (let i = 0; i < 40; i++) await page.keyboard.press('Tab');
tabOut = !(await panel.isVisible());
rec('QA-12', 'BR-5/12 Keyboard', 'Desktop dropdown (keyboard)', 'Enter opens (aria-expanded=true); Esc closes and returns focus; ArrowDown moves into menu; tabbing out closes', kbOpen && kbClosed && firstFocused && tabOut, `enter-open:${kbOpen} esc-close+focus:${kbClosed} arrow-into:${firstFocused} tab-out-closes:${tabOut}`);
// active state
await page.goto(BASE + '/services/test-automation/', { waitUntil: 'networkidle' });
const active = await page.evaluate(() => [...document.querySelectorAll('.primary-nav__item.is-active .primary-nav__trigger')].map((b) => b.textContent.trim()));
const curLink = await page.evaluate(() => document.querySelector('#menu-solutions a[aria-current="page"]')?.textContent.trim());
rec('QA-13', 'BR-5 Header', 'Active page indication', 'Current section highlighted; current link has aria-current=page', active.length === 1 && active[0].startsWith('Solutions') && !!curLink, `active: ${active.join(',')}; aria-current link: ${curLink}`);

// ---- 6. Mobile drawer
// Phone-sized touch context for the drawer.
const m = await browser.newPage({ viewport: { width: 360, height: 780 }, hasTouch: true, isMobile: true });
await m.goto(BASE + '/case-studies/', { waitUntil: 'networkidle' });
const menuBtn = m.locator('[data-drawer-open]');
await menuBtn.click();
const drawerOpen = await m.locator('#mobile-nav').evaluate((d) => d.open);
const focusInDrawer = await m.evaluate(() => !!document.activeElement?.closest('#mobile-nav'));
await m.screenshot({ path: join(OUT, 'evidence', 'nav-mobile-drawer-open.png') });
const drawerHrefs = await m.evaluate(() => [...document.querySelectorAll('#mobile-nav a[href]')].map((a) => a.getAttribute('href')));
const desktopHrefs = await m.evaluate(() => [...document.querySelectorAll('.primary-nav a[href]')].map((a) => a.getAttribute('href')));
// Every destination in the desktop menu must also be reachable from the drawer (same data source).
const missing = [...new Set(desktopHrefs)].filter((h) => !drawerHrefs.includes(h));
const drawerTexts = await m.evaluate(() => [...document.querySelectorAll('#mobile-nav a')].map((a) => a.textContent.trim()));
const namedOk = ['Case Studies', 'Resource Hub'].every((t) => drawerTexts.some((x) => x.startsWith(t)));
// focus containment: tab many times, focus must stay in dialog
for (let i = 0; i < 60; i++) await m.keyboard.press('Tab');
const contained = await m.evaluate(() => !!document.activeElement?.closest('#mobile-nav') || document.activeElement === document.body);
await m.keyboard.press('Escape');
const closed = !(await m.locator('#mobile-nav').evaluate((d) => d.open));
const focusBack = await m.evaluate(() => document.activeElement?.hasAttribute('data-drawer-open'));
rec('QA-14', 'BR-5 Mobile nav', 'Mobile drawer @360px', 'Menu opens a modal drawer; focus moves in; all desktop destinations present, incl. Case Studies and Resource Hub by name; focus contained; Esc closes and returns focus to Menu', drawerOpen && focusInDrawer && missing.length === 0 && namedOk && contained && closed && focusBack, `open:${drawerOpen} focus-in:${focusInDrawer} missing-destinations:${missing.length} 'Case Studies'+'Resource Hub' listed:${namedOk} contained:${contained} esc-close:${closed} focus-return:${focusBack}`, 'qa-output/evidence/nav-mobile-drawer-open.png');
await menuBtn.click();
await m.locator('#mobile-nav [aria-controls="m-products"]').click();
const accOpen = (await m.locator('#mobile-nav [aria-controls="m-products"]').getAttribute('aria-expanded')) === 'true' && await m.locator('#m-products').isVisible();
await m.locator('#mobile-nav a', { hasText: 'QualityWatcher AI' }).first().click();
await m.waitForLoadState('domcontentloaded');
rec('QA-15', 'BR-5 Mobile nav', 'Drawer accordion + navigation', 'Section expands (aria-expanded) and a link navigates', accOpen && m.url().endsWith('/qualitywatcher-ai-tools/'), `expanded:${accOpen} url:${m.url().replace(BASE, '')}`);
await m.close();

// ---- 7. Homepage CTAs and pathways
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
const heroCtas = await page.$$eval('.home-hero__ctas a', (as) => as.map((a) => a.getAttribute('href')));
const pathwayHrefs = await page.$$eval('.pathway a', (as) => as.map((a) => a.getAttribute('href')));
const pathwaysAboveFold = await page.$$eval('.pathway', (as) => as.every((a) => a.getBoundingClientRect().top < 900));
rec('QA-16', 'BR-7.1', 'Homepage hero', 'Two hero CTAs to different approved destinations; three pathway cards start above the fold at 1440×900', heroCtas.length === 2 && heroCtas[0] !== heroCtas[1] && pathwayHrefs.length === 3 && pathwaysAboveFold, `CTAs: ${heroCtas.join(' | ')}; pathways: ${pathwayHrefs.join(' | ')}; above fold: ${pathwaysAboveFold}`, 'qa-output/evidence/1440-home.png');
const svcLinks = await page.$$eval('.way__links a', (as) => as.map((a) => a.getAttribute('href')));
rec('QA-17', 'BR-7.1', 'Homepage service links', 'Service links route to the matching service detail pages', svcLinks.every((h) => routeSet.has(h)), `${svcLinks.length} links, all resolve`);

// ---- 8. Contact form states
const cf = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await cf.goto(BASE + '/contact-us/', { waitUntil: 'networkidle' });
// Any non-GET request during the form tests would mean real submission; the form must only simulate.
// The form's prototype "simulate" radios choose the outcome (error/success) shown below.
let netCalls = 0; cf.on('request', (rq) => { if (rq.method() !== 'GET') netCalls++; });
await cf.click('[data-submit]');
const summaryCount = await cf.$$eval('[data-summary-list] li', (l) => l.length);
const summaryFocused = await cf.evaluate(() => document.activeElement?.hasAttribute('data-summary'));
const invalidCount = await cf.$$eval('[aria-invalid="true"]', (l) => l.length);
await cf.screenshot({ path: join(OUT, 'evidence', 'form-missing-required.png'), fullPage: true });
rec('QA-18', 'BR-7.12', 'Contact form — empty submit', 'Error summary lists all 6 required problems, receives focus; fields marked aria-invalid', summaryCount === 6 && summaryFocused && invalidCount === 6, `summary items:${summaryCount} focused:${summaryFocused} aria-invalid:${invalidCount}`, 'qa-output/evidence/form-missing-required.png');
// Fill the required fields with obvious fixture values, then an invalid email to test inline errors.
await cf.fill('#cf-firstName', 'Test'); await cf.fill('#cf-lastName', 'Fixture'); await cf.fill('#cf-company', 'Example Co (fixture)'); await cf.fill('#cf-jobTitle', 'QA Lead');
await cf.fill('#cf-email', 'not-an-email'); await cf.locator('#cf-email').blur();
const emailMsg = await cf.textContent('#cf-email-error span');
const emailDesc = await cf.getAttribute('#cf-email', 'aria-describedby');
rec('QA-19', 'BR-7.12', 'Contact form — invalid email', 'Inline error with format guidance, programmatically associated', /format/.test(emailMsg ?? '') && emailDesc === 'cf-email-error', `message: "${emailMsg}"; aria-describedby=${emailDesc}`);
await cf.fill('#cf-email', 'test.fixture@example.com');
await cf.click('[data-submit]');
const consentOnly = await cf.$$eval('[data-summary-list] li', (l) => l.map((x) => x.textContent));
rec('QA-20', 'BR-7.12', 'Contact form — consent', 'Submission blocked until privacy policy accepted', consentOnly.length === 1 && /privacy/i.test(consentOnly[0]), `remaining errors: ${consentOnly.join('; ')}`);
await cf.check('#cf-privacy');
await cf.check('input[name="simulate"][value="error"]');
await cf.click('[data-submit]');
const busy = await cf.getAttribute('[data-submit]', 'aria-busy');
await cf.screenshot({ path: join(OUT, 'evidence', 'form-loading.png') });
await cf.waitForSelector('[data-result-error]:not([hidden])');
const errFocused = await cf.evaluate(() => document.activeElement?.hasAttribute('data-result-error'));
const valuesKept = (await cf.inputValue('#cf-email')) === 'test.fixture@example.com';
await cf.screenshot({ path: join(OUT, 'evidence', 'form-server-error.png'), fullPage: true });
rec('QA-21', 'BR-7.12', 'Contact form — loading + error', 'Button shows busy state; simulated server error is announced (role=alert), focused, and values are kept', busy === 'true' && errFocused && valuesKept, `aria-busy:${busy} error-focused:${errFocused} values-kept:${valuesKept}`, 'qa-output/evidence/form-server-error.png');
await cf.check('input[name="simulate"][value="success"]');
await cf.click('[data-submit]');
await cf.waitForSelector('[data-result-success]:not([hidden])');
const successText = await cf.textContent('[data-result-success]');
await cf.screenshot({ path: join(OUT, 'evidence', 'form-success.png'), fullPage: true });
rec('QA-22', 'BR-7.12', 'Contact form — success', 'Success message shown, focused, names the email; no network submission occurs', /Thank you, Test/.test(successText) && netCalls === 0, `success shown; non-GET requests during test: ${netCalls}`, 'qa-output/evidence/form-success.png', 'Mocked: HubSpot/WPForms integration not tested (no authorised test access)');
await cf.close();

// ---- 9. Case-study filters
const cs = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await cs.goto(BASE + '/case-studies/', { waitUntil: 'networkidle' });
// Count of visible case-study cards (hidden ones carry the hidden attribute set by src/lib/filters.ts).
const vis = () => cs.$$eval('#cs-results > article:not([hidden])', (l) => l.length);
const all = await vis();
await cs.selectOption('#cs-filter-industry', 'finance-banking');
const fin = await vis();
await cs.selectOption('#cs-filter-service', 'test-automation');
const combo = await vis();
const urlState = cs.url();
// Healthcare + Test Automation has no matching case study, so the empty state must appear.
await cs.selectOption('#cs-filter-industry', 'healthcare');
const none = await vis();
const emptyShown = await cs.isVisible('#cs-empty');
await cs.screenshot({ path: join(OUT, 'evidence', 'case-studies-no-results.png') });
await cs.click('[data-filter-clear]');
const cleared = await vis();
const countText = await cs.textContent('[data-filter-count]');
rec('QA-23', 'BR-7.8', 'Case-study filters', 'Industry, service and combined filters narrow results; impossible combination shows empty state; Clear restores all; state kept in URL', fin < all && combo <= fin && combo > 0 && none === 0 && emptyShown && cleared === all && /industry=finance-banking/.test(urlState), `all:${all} finance:${fin} finance+automation:${combo} healthcare+automation:${none} (empty state:${emptyShown}) cleared:${cleared}; live text "${countText}"`, 'qa-output/evidence/case-studies-no-results.png');
await cs.click('.proto-states summary');
await cs.click('[data-sim="loading"]');
const loadingVisible = await cs.isVisible('#cs-loading');
await cs.waitForTimeout(1700);
await cs.click('[data-sim="error"]');
const errVisible = await cs.isVisible('#cs-error');
rec('QA-24', 'BR-7.8', 'Case-study loading/error', 'Loading skeleton and data-error alert with retry are demonstrable', loadingVisible && errVisible, `loading:${loadingVisible} error:${errVisible}`, '', 'Mocked: data is static; states are simulated');
await cs.close();

// ---- 10. Resources filter
const rs = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await rs.goto(BASE + '/resources/', { waitUntil: 'networkidle' });
const rAll = await rs.$$eval('#res-results > *:not([hidden])', (l) => l.length);
await rs.click('[data-chip-filter="type"] [data-value="event"]');
const rEv = await rs.$$eval('#res-results > *:not([hidden])', (l) => l.length);
await rs.selectOption('#res-topic', 'AI');
const rNone = await rs.isVisible('#res-empty');
rec('QA-25', 'BR-7.9', 'Resource hub filters', 'Type chips (aria-pressed) and topic filter combine; empty state on no match', rEv > 0 && rEv < rAll && rNone, `all:${rAll} events:${rEv} events+AI empty:${rNone}`);
await rs.close();

// ---- 11. Events: no registration for past / cancelled / TBC
const evBad = [];
// Past (PNSQC, NTC), cancelled (fixture) and date-TBC (BOW) events: no link whose text mentions 'register'.
for (const slug of ['pnsqc-2026', 'ntc-2025', 'fixture-cancelled-meetup', 'bow-growth-conference-2026']) {
  await page.goto(`${BASE}/events/${slug}/`, { waitUntil: 'domcontentloaded' });
  const reg = await page.$$eval('main a', (as) => as.filter((a) => /register/i.test(a.textContent)).length);
  if (reg) evBad.push(slug);
}
await page.goto(`${BASE}/events/fixture-agentic-qa-webinar/`);
const upcomingReg = await page.$$eval('main .demo-reg button[disabled]', (b) => b.length);
rec('QA-26', 'BR-7.11', 'Event states', 'Past, cancelled and date-TBC events never offer registration; the upcoming fixture shows a disabled, labelled demo control (no placeholder link)', evBad.length === 0 && upcomingReg === 1, `violations:${evBad.join(',') || 'none'}; upcoming fixture demo control:${upcomingReg}`, '', 'Live homepage currently promotes past PNSQC 2026 as next event (audit C-03)');

// ---- 12. Careers states
const ca = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await ca.goto(BASE + '/careers/', { waitUntil: 'networkidle' });
// Default state is the real BambooHR result (0 roles); the radios switch to fixture states.
const emptyDefault = await ca.isVisible('[data-state="live"] .empty');
await ca.check('input[name="jobstate"][value="jobs"]');
const applyLinks = await ca.$$eval('[data-state="jobs"] a', (as) => as.map((a) => a.href));
const closedShown = await ca.isVisible('.job--expired .job__closed');
await ca.check('input[name="jobstate"][value="down"]');
const downShown = await ca.isVisible('[data-state="down"] .alert');
const fileInputs = await ca.$$eval('input[type=file]', (l) => l.length);
rec('QA-27', 'BR-7.13', 'Careers / BambooHR', 'No-open-roles (real), roles-available, expired and service-unavailable states; apply links hand off to BambooHR; no résumé upload', emptyDefault && applyLinks.every((h) => h.includes('bamboohr.com')) && applyLinks.length === 2 && closedShown && downShown && fileInputs === 0, `empty:${emptyDefault} apply→bamboohr:${applyLinks.length} expired:${closedShown} unavailable:${downShown} file inputs:${fileInputs}`, '', 'BambooHR API read not integrated (snapshot 0 roles, 2026-11-17)');
await ca.close();

// ---- 13. Accordion + reduced motion
await page.goto(BASE + '/services/test-automation/', { waitUntil: 'networkidle' });
const det = page.locator('.faq__item').nth(1);
await det.locator('summary').focus(); await page.keyboard.press('Enter');
const faqOpen = await det.evaluate((d) => d.open);
rec('QA-28', 'BR-8 Accordion', 'FAQ accordion', 'Keyboard toggles; expanded state exposed natively by <details>', faqOpen, `second item open after Enter: ${faqOpen}`);
const rm = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
await rm.goto(BASE + '/', { waitUntil: 'networkidle' });
const op = await rm.$eval('.reveal', (e) => getComputedStyle(e).opacity);
rec('QA-29', 'BR-11 Reduced motion', 'Reveal animations', 'With prefers-reduced-motion, content is fully visible without animation', op === '1', `opacity of first .reveal: ${op}`);
await rm.close();

rec('QA-30', 'Runtime', 'All QA pages', 'No uncaught JavaScript errors', consoleErrors.length === 0, consoleErrors.length ? consoleErrors.slice(0, 3).join(' | ') : 'No page errors');

// ---- Blocked / not automatable
// pass = null: these cannot be tested here, so they are recorded as Blocked, never as Pass.
rec('QA-31', 'BR-7.12', 'HubSpot / CRM submission', 'Leads reach CRM', null, 'Not tested — no authorised test access; form is simulated', '', 'Dependency D-03');
rec('QA-32', 'BR-12', 'Screen reader walkthrough (NVDA/VoiceOver)', 'Journeys usable with AT', null, 'Not performed in this environment', '', 'Schedule manual AT test before build sign-off');

// Results file read by scripts/qa-report.mjs.
writeFileSync(join(OUT, 'results.json'), JSON.stringify({ runAt: new Date().toISOString(), base: BASE, routes: routes.length, externalLinks: [...externalLinks].sort(), results }, null, 1));
await browser.close();
const fails = results.filter((r) => r.status === 'Fail').length;
console.log(`\n${results.length} checks: ${results.filter((r) => r.status === 'Pass').length} pass, ${fails} fail, ${results.filter((r) => r.status === 'Blocked').length} blocked`);
