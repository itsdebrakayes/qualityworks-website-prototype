/**
 * LOCAL performance smoke measurement (not a production or field measurement).
 * Serves the built prototype from `astro preview` on localhost and records, per page: LCP, CLS,
 * DOMContentLoaded, total transferred bytes and request count, unthrottled and with a simulated
 * slow-4G / 4× CPU profile. Results go to qa-output/perf-local.json.
 */
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const BASE = process.env.QA_BASE ?? 'http://localhost:4321';
const routes = ['/', '/services/test-automation/', '/qualitywatcher-ai-tools/', '/case-studies/', '/contact-us/', '/more-qa-not-less-closing-the-verification-gap-in-ai-accelerated-software-delivery/'];
const profiles = { unthrottled: null, 'slow-4g-4x-cpu': { download: (1.6 * 1024 * 1024) / 8, upload: (750 * 1024) / 8, latency: 150, cpu: 4 } };
const browser = await chromium.launch();
const out = [];
for (const [name, prof] of Object.entries(profiles)) for (const r of routes) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  if (prof) { await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', { offline: false, downloadThroughput: prof.download, uploadThroughput: prof.upload, latency: prof.latency }); await cdp.send('Emulation.setCPUThrottlingRate', { rate: prof.cpu }); }
  await page.addInitScript(() => {
    window.__lcp = 0; window.__cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(BASE + r, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(1500);
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
