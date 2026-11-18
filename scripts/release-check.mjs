/**
 * RELEASE GATE (review round 1, item 5). Run via `npm run build:release`.
 * 1. Removes review-only routes from the release output (/prototype/, /design-system/).
 * 2. Scans every remaining page for review-only markers and explicit release blockers.
 * Exit 1 while anything remains. This gate is EXPECTED TO FAIL until the blockers listed in
 * docs/12-release-cleanup.md are resolved — a failing gate is the correct, honest state today.
 *
 * RUN BY: `npm run build:release` (QW_RELEASE=true astro build --outDir dist-release, then
 *   gen-redirects, then this script). Takes no arguments; always works on dist-release/.
 * SIDE EFFECT: deletes dist-release/prototype/ and dist-release/design-system/ (review-only routes).
 * OUTPUT: "Release gate: N finding(s) across M type(s)", then one line per finding type with a count
 *   and up to four example routes. Exit 1 if anything was found, else 0.
 *
 * TWO KINDS OF FINDING
 *   MARKER   text or markup that only review builds should contain (MARKERS below). Each one means
 *            a REVIEW-only element was not gated with REVIEW / rn() from src/lib/release.ts.
 *   BLOCKER  an explicit `data-release-blocker="reason"` attribute: a known placeholder that must be
 *            replaced before launch (CONTRIBUTING.md §6). The reason text is reported.
 *
 * HOW TO EXTEND: when you add review-only UI with a distinctive label, add a [label, regex] pair
 *   to MARKERS so the gate notices if it ever leaks into a release build.
 */
import { readFileSync, readdirSync, statSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const out = new URL('../dist-release/', import.meta.url).pathname;
// Review-only routes are removed from the release output before scanning.
for (const r of ['prototype', 'design-system']) if (existsSync(join(out, r))) rmSync(join(out, r), { recursive: true });

// [label shown in the report, regex tested against each page's HTML (scripts/styles removed)].
// Matching is case-sensitive unless the regex has the `i` flag.
const MARKERS = [
  ['Prototype bar', /Prototype · QM-113/],
  ['“(proposed page)” label', /proposed page/i],
  ['“Details pending” badge', /Details pending/],
  ['“Date to be confirmed”', /Date to be confirmed/],
  ['Claim annotations / register', /class="claim-ref"|claims register|\/prototype\/claims/i],
  ['PRISM illustrative sample', /Illustrative sample/i],
  ['Fixture content', /\[Fixture\]|badge--fixture|Illustrative fixture/i],
  ['Review annotations', /data-review-note|Review annotations|Review hub/],
  ['Prototype-only controls', /Prototype control|name="simulate"|name="jobstate"/],
  ['Internal source notes', /Migrated from WordPress post|as published on qualityworkscg\.com/i],
  // Review builds are always noindex, nofollow (BaseLayout); release builds use the production directive.
  ['Prototype noindex', /<meta name="robots" content="noindex, nofollow"/],
];
// Each finding: [kind ('MARKER' | 'BLOCKER'), label or blocker reason, route].
const findings = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (f.endsWith('.html')) {
  const route = '/' + p.slice(out.length).replace(/index\.html$/, '');
  // Ignore CSS and JS (selectors/handlers are not visible content); scan markup and text.
  const html = readFileSync(p, 'utf8').replace(/<(style|script)[\s\S]*?<\/\1>/g, '');
  for (const [label, re] of MARKERS) if (re.test(html)) findings.push(['MARKER', label, route]);
  for (const m of html.matchAll(/data-release-blocker="([^"]+)"/g)) findings.push(['BLOCKER', m[1], route]);
} } })(out);

// Group identical kind+label pairs so the report lists each problem once with its routes.
const group = new Map();
for (const [kind, label, route] of findings) { const k = `${kind} | ${label}`; group.set(k, [...(group.get(k) ?? []), route]); }
console.log(`Release gate: ${findings.length} finding(s) across ${group.size} type(s)`);
for (const [k, routes] of [...group].sort()) console.log(`  ${k}  (${routes.length}): ${routes.slice(0, 4).join(', ')}${routes.length > 4 ? ', …' : ''}`);
process.exit(findings.length ? 1 : 0);
