/**
 * Terminology check (review round 1, items 1 & 8.1). Scans visible text of every built page for
 * prohibited marketing terms. Review-only routes (/prototype/, /design-system/) are reported
 * separately because they quote the old wording when documenting corrections.
 * Usage: npm run build && node scripts/terminology-check.mjs   (exit 1 on marketing-page hits)
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const dist = new URL('../dist/', import.meta.url).pathname;
const RULES = [
  { id: 'autonomous', re: /\bautonom\w*/gi },
  { id: 'ship', re: /\bship(s|ped|ping)?\b/gi },
  { id: 'old-award-name', re: /Autonomous Testing Challenge/gi },
  { id: 'angle-brackets-beyond', re: /<\s*beyond the code\s*>/gi },
];
// Retained on purpose: physical logistics term inside a migrated industry-ideas article.
const ALLOW = [/Hazmat shipping documentation/i];
const hits = { marketing: [], review: [] };
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (f.endsWith('.html')) {
  const route = '/' + p.slice(dist.length).replace(/index\.html$/, '');
  let text = readFileSync(p, 'utf8').replace(/<(script|style)[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#\d+;|&[a-z]+;/g, ' ');
  for (const a of ALLOW) text = text.replace(a, '');
  for (const r of RULES) for (const m of text.matchAll(r.re)) {
    const ctx = text.slice(Math.max(0, m.index - 50), m.index + 50).replace(/\s+/g, ' ');
    (/^\/(prototype|design-system)\//.test(route) ? hits.review : hits.marketing).push(`${r.id} | ${route} | …${ctx}…`);
  }
} } })(dist);
console.log(`Marketing pages: ${hits.marketing.length} hit(s)`); hits.marketing.forEach((h) => console.log('  ' + h));
console.log(`Review-only pages (informational): ${hits.review.length} hit(s)`);
process.exit(hits.marketing.length ? 1 : 0);
