/**
 * Glyph lint: scans every built page's visible text for characters outside the unicode-range of the
 * self-hosted Red Hat Display/Mono files (src/fonts.css). Any hit would render in a fallback font.
 * Usage: npm run build && node scripts/glyph-lint.mjs   (exit code 1 on findings)
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const css = readFileSync(new URL('../src/fonts.css', import.meta.url), 'utf8');
const ranges = [];
for (const m of css.matchAll(/font-family: 'Red Hat Display';\s*font-style: normal;[\s\S]*?unicode-range: ([^;]+);/g))
  for (const part of m[1].split(',')) { const [a, b] = part.trim().slice(2).split('-'); ranges.push([parseInt(a, 16), parseInt(b ?? a, 16)]); }
const ok = (cp) => ranges.some(([a, b]) => cp >= a && cp <= b);
const dist = new URL('../dist/', import.meta.url).pathname;
const hits = new Map();
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (f.endsWith('.html')) {
  const text = readFileSync(p, 'utf8').replace(/<(script|style)[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&[a-z]+;/g, ' ');
  for (const ch of text) { const cp = ch.codePointAt(0); if (!/\s/.test(ch) && !ok(cp)) hits.set(ch, [...(hits.get(ch) ?? []), p.slice(dist.length)]); }
} } })(dist);
if (!hits.size) { console.log('glyph-lint: all visible characters are covered by Red Hat Display'); process.exit(0); }
for (const [ch, files] of hits) console.log(`U+${ch.codePointAt(0).toString(16).toUpperCase()} "${ch}" in ${[...new Set(files)].slice(0, 4).join(', ')}`);
process.exit(1);
