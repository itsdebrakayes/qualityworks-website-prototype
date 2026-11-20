/**
 * Glyph lint: scans every built page's visible text for characters outside the unicode-range of the
 * self-hosted brand fonts (src/fonts.css): Montserrat (display) and Lato (body). A character must be
 * covered by BOTH, because the same text can be set in either face. Any hit would render in a fallback font.
 * Usage: npm run build && node scripts/glyph-lint.mjs   (exit code 1 on findings)
 *
 * WHY: typography QA rule BR-17. A single character missing from the brand font renders in a
 *   different typeface, which looks broken. src/lib/glyphs.ts normalises known cases in migrated
 *   content; this lint catches anything new. QA-09 (scripts/qa-checks.mjs) confirms the result in a
 *   real browser.
 *
 * RUN BY: `npm run build` (last step), so a stray glyph fails the build.
 * INPUTS: src/fonts.css (allowed ranges) and every *.html file under dist/ (hard-coded; the release
 *   output in dist-release/ is not scanned).
 * OUTPUT: a success line and exit 0, or one line per offending character (code point, the character
 *   and up to four files) and exit 1. Writes nothing.
 *
 * HOW TO FIX A FINDING: prefer rewriting the text (or adding a normalisation rule in glyphs.ts, or
 *   using the MetricValue component for arrows). Only widen a unicode-range in fonts.css if the font
 *   file really contains the glyph.
 *
 * GOTCHAS
 *   - Only the normal-style Montserrat and Lato rules are read (italic ranges are ignored).
 *   - Decimal entities (&#8594;) are decoded and checked; named entities (&rarr;) become spaces and
 *     hexadecimal entities are left as plain ASCII text, so neither of those two forms is checked.
 *   - Whitespace characters are never reported.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const css = readFileSync(new URL('../src/fonts.css', import.meta.url), 'utf8');
// Allowed code-point ranges per family, as [start, end] pairs. For every normal-style rule of the family,
// split its unicode-range list on commas; each part is "U+XXXX" or "U+XXXX-YYYY" (hex). slice(2) drops
// "U+", and a single code point becomes a range of one.
const FAMILIES = ['Montserrat', 'Lato'];
const rangesFor = (family) => {
  const out = [];
  const re = new RegExp(`font-family: '${family}';\\s*font-style: normal;[\\s\\S]*?unicode-range: ([^;]+);`, 'g');
  for (const m of css.matchAll(re))
    for (const part of m[1].split(',')) { const [a, b] = part.trim().slice(2).split('-'); out.push([parseInt(a, 16), parseInt(b ?? a, 16)]); }
  if (!out.length) throw new Error(`glyph-lint: no normal-style @font-face rules for ${family} in src/fonts.css`);
  return out;
};
const familyRanges = FAMILIES.map(rangesFor);
// True when the code point is covered by EVERY brand family (headings use one, body text the other).
const ok = (cp) => familyRanges.every((ranges) => ranges.some(([a, b]) => cp >= a && cp <= b));
const dist = new URL('../dist/', import.meta.url).pathname;
// Offending character -> list of files (relative to dist/) where it appears.
const hits = new Map();
// Walk dist/ recursively. For each .html file: drop <script> and <style> blocks (with their content),
// replace every tag with a space, decode decimal numeric entities, blank out named entities, then
// test every remaining non-whitespace character. `for…of` iterates by code point, so characters
// outside the Basic Multilingual Plane (e.g. emoji) are checked as one character.
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (f.endsWith('.html')) {
  const text = readFileSync(p, 'utf8').replace(/<(script|style)[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&[a-z]+;/g, ' ');
  for (const ch of text) { const cp = ch.codePointAt(0); if (!/\s/.test(ch) && !ok(cp)) hits.set(ch, [...(hits.get(ch) ?? []), p.slice(dist.length)]); }
} } })(dist);
if (!hits.size) { console.log('glyph-lint: all visible characters are covered by Montserrat and Lato'); process.exit(0); }
for (const [ch, files] of hits) console.log(`U+${ch.codePointAt(0).toString(16).toUpperCase()} "${ch}" in ${[...new Set(files)].slice(0, 4).join(', ')}`);
process.exit(1);
