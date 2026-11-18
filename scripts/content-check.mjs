/**
 * content-check.mjs — content compliance scanner (review rounds 1–2; replaces terminology-check.mjs).
 *
 * WHAT IT SCANS
 *   1. Every built HTML page in dist/ (or the directory given as argv[2]):
 *        - visible text (the mobile drawer is part of every page's HTML, so it is included),
 *        - every attribute value (meta description/OG/Twitter tags, alt, title, aria-label, placeholder, value),
 *        - JSON-LD structured data (<script type="application/ld+json">).
 *   2. Source data that feeds the site: src/data/*.ts and src/pages|components|layouts/**\/*.astro.
 *      Raw WordPress snapshots (src/data/migrated/) are NOT scanned: they intentionally keep the original
 *      wording for traceability, and src/data/corrections.ts quotes old wording in its `find` patterns.
 *      src/data/redirects.json is the one sanctioned home for legacy slugs.
 *
 * WHY THE NORMALISATION MATTERS
 *   WordPress content contains non-breaking spaces (U+00A0) and narrow no-break spaces (U+202F).
 *   Round 1's search for "2 weeks to 2 days" missed "2 weeks to 2 days". Every Unicode space is
 *   therefore converted to an ordinary space and HTML entities are decoded before matching.
 *
 * SCOPES IN THE REPORT
 *   marketing — public pages; any hit FAILS the check (exit code 1)
 *   review    — /prototype/* and /design-system/ (they quote findings by design; listed, not failed)
 *   source    — data/component source; any hit FAILS the check
 *
 * Usage: npm run build && node scripts/content-check.mjs [dist]
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, process.argv[2] ?? 'dist');

/** Each rule: id, regex, and a short reason (shown in the report). */
const RULES = [
  // Round 1 terminology
  { id: 'autonomous', re: /\bautonom\w*/gi, why: 'Prohibited term (round 1)' },
  { id: 'ship', re: /\bship(s|ped|ping)?\b/gi, why: 'Prohibited term (round 1)' },
  { id: 'old-award-name', re: /Autonomous Testing Challenge/gi, why: 'Award is the AI Augmented Testing (AIAT) Challenge' },
  { id: 'bracketed-beyond', re: /<\s*beyond the code\s*>/gi, why: 'Angle brackets removed (round 1)' },
  // Round 1–2 statistics and client disclosure
  { id: 'two-weeks-two-days', re: /2 weeks to 2 days|two weeks to (just )?two days/gi, why: 'Unsupported comparison (rounds 1–2)' },
  { id: 'client-product', re: /\bi-?pipelines?\b|laser ?app/gi, why: 'Client/product not approved for disclosure (round 2)' },
  { id: 'partner-3ci', re: /\b3CI\b/g, why: 'Client relationship not approved for disclosure' },
  { id: 'wssc-percent', re: /30–80%|up to 80%|67% of testers/gi, why: 'WSSC figures removed pending report' },
  { id: 'gartner-90', re: /90% of enterprise software engineers/gi, why: 'Unverified third-party statistic' },
  // Round 2 terminology and product claims
  { id: 'the-customer-heading', re: /\bThe customer\b/g, why: 'QualityWorks calls its clients “clients” (round 2)' },
  { id: 'our-customers', re: /value for our customers/gi, why: 'Should read “our clients” (round 2)' },
  { id: 'auto-generated-claim', re: /automatically generated test cases/gi, why: 'Tool output is draft test cases for QA review (round 2)' },
  { id: 'runs-automatically', re: /Runs tests automatically/gi, why: 'Overstated capability (round 2)' },
  { id: 'seamless-40', re: /seamless integration|40\+ CI\/CD/gi, why: 'Unverified integration claim (round 2)' },
  { id: 'cutting-edge', re: /cutting-edge solutions/gi, why: 'Replaced with “new solutions” (round 2)' },
  { id: 'free-consultation', re: /free consultation/gi, why: 'QM-112 2.5: no free-consultation promises without approval' },
];

/** Text deliberately allowed (context explains why). */
const ALLOW = [
  { re: /Hazmat shipping documentation/gi, why: 'Physical logistics term in a migrated industry-ideas article' },
  // Alt text that transcribes words printed inside a published infographic. Changing only the alt text
  // would make it inaccurate for screen-reader users; the image itself needs replacing (open question Q-28).
  { re: /The Four Pillars of Autonomous Quality|Autonomous Execution arranged side by side/gi, why: 'Infographic transcription — image replacement pending (Q-28)' },
];

/** Every Unicode space character (incl. U+00A0 no-break and U+202F narrow no-break), written as escapes. */
const UNICODE_SPACES = new RegExp('[\\s\\u00a0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff]+', 'g');

/** Convert every Unicode space to ' ', decode common entities, collapse whitespace. */
function normalise(s) {
  return s
    .replace(/&nbsp;|&#160;|&#xa0;/gi, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(UNICODE_SPACES, ' ');
}

/** From one HTML file, return the three text channels we care about. */
function channels(html) {
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]).join(' ');
  const body = html.replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ');
  const attrs = [...body.matchAll(/\s(?:content|alt|title|aria-label|placeholder|value)="([^"]*)"/g)].map((m) => m[1]).join(' | ');
  const text = body.replace(/<[^>]+>/g, ' ');
  return { text: normalise(text), attributes: normalise(attrs), jsonLd: normalise(jsonLd) };
}

function scan(label, scope, content, hits) {
  let c = content;
  for (const a of ALLOW) c = c.replace(a.re, ' ');
  for (const r of RULES) for (const m of c.matchAll(r.re)) {
    hits.push({ scope, rule: r.id, why: r.why, where: label, context: c.slice(Math.max(0, m.index - 45), m.index + m[0].length + 45).trim() });
  }
}

const walk = (dir, pred, out = []) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, pred, out); else if (pred(p)) out.push(p);
  }
  return out;
};

const hits = [];
// 1) Built pages
for (const file of walk(DIST, (p) => p.endsWith('.html'))) {
  const route = '/' + relative(DIST, file).replace(/index\.html$/, '');
  const scope = /^\/(prototype|design-system)\//.test(route) ? 'review' : 'marketing';
  const ch = channels(readFileSync(file, 'utf8'));
  for (const [name, content] of Object.entries(ch)) scan(`${route} [${name}]`, scope, content, hits);
}
// 2) Source data and templates
const srcFiles = walk(join(ROOT, 'src'), (p) => /\.(ts|astro)$/.test(p) && !p.includes('/migrated/') && !p.endsWith('corrections.ts'));
for (const file of srcFiles) scan(relative(ROOT, file), 'source', normalise(readFileSync(file, 'utf8')), hits);

// Report
const by = (s) => hits.filter((h) => h.scope === s);
for (const scope of ['marketing', 'source', 'review']) {
  const list = by(scope);
  console.log(`\n${scope.toUpperCase()}: ${list.length} hit(s)${scope === 'review' ? ' (informational — review documents quote findings)' : ''}`);
  for (const h of list.slice(0, scope === 'review' ? 8 : 50)) console.log(`  [${h.rule}] ${h.where}\n      …${h.context}…`);
}
console.log(`\nRules checked: ${RULES.length}. Pages scanned in ${relative(ROOT, DIST)}/, plus ${srcFiles.length} source files.`);
process.exit(by('marketing').length + by('source').length ? 1 : 0);
