/**
 * LOCAL performance smoke measurement (not a production or field measurement).
 * Serves the built prototype from `astro preview` on localhost and records, per page: LCP, CLS,
 * DOMContentLoaded, total transferred bytes and request count, unthrottled and with a simulated
 * slow-4G / 4× CPU profile. Results go to qa-output/perf-local.json.
 *
 * USAGE: npm run build && npx astro preview --port 4321 &  then  node scripts/perf-local.mjs
 * ENV: QA_BASE  base URL of the running preview (default http://localhost:4321).
 * REQUIRES: Playwright with Chromium installed on the machine (loaded with require('playwright');
 *   it is not in package.json, see README).
 * OUTPUT: one console line per profile and route, and qa-output/perf-local.json
 *   { runAt, base, viewport, note, results: [{ profile, route, lcpMs, cls, dclMs, kb, requests }] }.
 *   docs/13-integrations-platform.md quotes a run of this script.
 *
 * WHY "smoke" only: localhost has no real network or CDN, so numbers show relative weight and
 *   regressions, not Core Web Vitals field data. Do not report them as production performance.
 *
 * HOW TO EXTEND: add routes to `routes` or another entry to `profiles` (download/upload in bytes per
 *   second, latency in ms, CPU slowdown factor; null = no throttling).
 */
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
const require = createRequire(import.meta.url);
// createRequire lets this ES module load the machine-installed (CommonJS) Playwright package.
const { chromium } = require('playwright');
const BASE = process.env.QA_BASE ?? 'http://localhost:4321';
// A representative sample: home, a service, a product page, a listing, the form page and a long article.
const routes = ['/', '/services/test-automation/', '/qualitywatcher-ai-tools/', '/case-studies/', '/contact-us/', '/more-qa-not-less-closing-the-verification-gap-in-ai-accelerated-software-delivery/'];
// Throttling profiles. Slow-4G here = 1.6 Mbit/s down, 750 kbit/s up (converted to bytes/s), 150 ms
// latency, plus 4x CPU slowdown.
const profiles = { unthrottled: null, 'slow-4g-4x-cpu': { download: (1.6 * 1024 * 1024) / 8, upload: (750 * 1024) / 8, latency: 150, cpu: 4 } };
const browser = await chromium.launch();
const out = [];
// Every route under every profile, each in a fresh browser context (cold cache) at a 390x844 phone viewport.
for (const [name, prof] of Object.entries(profiles)) for (const r of routes) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  // Apply network and CPU throttling through the Chrome DevTools Protocol.
  if (prof) { await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', { offline: false, downloadThroughput: prof.download, uploadThroughput: prof.upload, latency: prof.latency }); await cdp.send('Emulation.setCPUThrottlingRate', { rate: prof.cpu }); }
  // Before any page script runs, start PerformanceObservers: LCP keeps the latest candidate's time;
  // CLS sums layout shifts not caused by recent user input (buffered: also count earlier entries).
  await page.addInitScript(() => {
    window.__lcp = 0; window.__cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(BASE + r, { waitUntil: 'load', timeout: 90000 });
  // Give late LCP candidates and layout shifts 1.5 s to arrive after the load event.
  await page.waitForTimeout(1500);
  // Collect metrics: total transferred bytes = all resources + the HTML document; requests counts
  // resources plus the document itself.
  const m = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const res = performance.getEntriesByType('resource');
    const bytes = res.reduce((a, e) => a + (e.transferSize || 0), 0) + (nav.transferSize || 0);
    return { lcpMs: Math.round(window.__lcp), cls: +window.__cls.toFixed(3), dclMs: Math.round(nav.domContentLoadedEventEnd), kb: Math.round(bytes / 1024), requests: res.length + 1 };
  });
  out.push({ profile: name, route: r, ...m });
  console.log(name.padEnd(16), r.slice(0, 45).padEnd(46), JSON.stringify(m));
  await ctx.close();
}
await browser.close();
mkdirSync(new URL('../qa-output/', import.meta.url), { recursive: true });
writeFileSync(new URL('../qa-output/perf-local.json', import.meta.url), JSON.stringify({ runAt: new Date().toISOString(), base: BASE, viewport: '390x844', note: 'Local preview server; not production, not field data', results: out }, null, 1));
