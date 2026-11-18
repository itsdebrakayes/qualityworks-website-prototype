/**
 * GLYPH NORMALISATION (typography QA rule BR-17).
 * Red Hat Display does not contain some characters found in migrated WordPress content, which made
 * single characters render in a fallback font. These rules keep meaning but stay inside the brand
 * font. Every rule is listed in docs/04-content-schemas.md for content-owner sign-off.
 *
 * WHAT ELSE LIVES HERE: two migration-hygiene helpers for WordPress HTML: heading-level repair
 *   (normalizeHeadings) and link rewriting (normalizeLinks).
 *
 * EXPORTS AND CONSUMERS
 *   normalizeText(s)       plain-text fields: article titles/excerpts (articles.ts); case-study
 *                          summary and section text, plus the title list used to strip
 *                          related-links residue (caseStudies.ts).
 *   normalizeHtml(html)    article bodyHtml (articles.ts).
 *   normalizeHeadings(html, start?)  article bodyHtml (articles.ts).
 *   normalizeLinks(html, isBuilt?)   article bodyHtml (articles.ts, with its builtPath predicate).
 *   Order used in articles.ts: corrections first, then normalizeHtml, then normalizeHeadings, then
 *   normalizeLinks.
 *
 * VERIFICATION: scripts/glyph-lint.mjs fails the build if any visible character in dist/ falls
 *   outside the self-hosted font's unicode-range; QA-09 checks rendered fonts in a real browser.
 *
 * HOW TO EXTEND: when glyph-lint reports a new character, add a replacement to BOTH normalizeText
 *   and normalizeHtml (they mirror each other; the HTML version may use markup), then list the new
 *   rule in docs/04-content-schemas.md §11 for sign-off. Never change the snapshot JSON instead:
 *   snapshots stay raw for traceability.
 *
 * GOTCHAS
 *   - These run at build time on migrated text only; hand-written copy in data modules is not
 *     normalised, so type supported characters there (use MetricValue for "A → B" in components).
 *   - Several regexes contain literal non-ASCII characters (superscript digits, U+2192, U+2248,
 *     U+2260, and an invisible U+FE0F). Edit them in a UTF-8-aware editor and do not "clean up"
 *     what looks like an empty spot in the emoji regex.
 */
/** Superscript digit (U+2070, U+00B9, U+00B2, U+00B3, U+2074 to U+2079) to its ASCII digit. */
const SUP: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
/**
 * Inline replacement for the arrow character in HTML: a decorative SVG arrow (aria-hidden, sized by
 * the `.inline-arrow` rule in global.css) followed by visually hidden "to", so screen readers read
 * "A to B" while sighted users still see an arrow.
 */
const ARROW_SVG = '<svg class="inline-arrow" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="visually-hidden">to</span>';

/**
 * Make a plain-text string safe for the brand font (no markup is produced).
 * @param s text to normalise (titles, excerpts, case-study sections).
 * @returns the text with:
 *   - runs of superscript digits turned into ordinary digits (e.g. "10⁵" becomes "105"; plain text
 *     cannot carry <sup>),
 *   - the rightwards arrow U+2192 (with surrounding spaces) replaced by " to ",
 *   - the almost-equal sign U+2248 replaced by "approximately ",
 *   - the not-equal sign U+2260 replaced by " is not ",
 *   - decorative emoji removed.
 */
export function normalizeText(s: string): string {
  return s
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => [...m].map((c) => SUP[c]).join(''))
    .replace(/\s*→\s*/g, ' to ')
    .replace(/≈\s*/g, 'approximately ')
    .replace(/\s*≠\s*/g, ' is not ')
    // Emoji: any Extended_Pictographic code point (needs the `u` flag), an optional invisible
    // U+FE0F variation selector right after it, and trailing whitespace.
    .replace(/\p{Extended_Pictographic}️?\s*/gu, '');
}

/**
 * HTML counterpart of normalizeText(), for article bodies.
 * @param html sanitised WordPress body HTML.
 * @returns the HTML with the same rules as normalizeText(), except that superscript runs become
 *   `<sup>` elements (styled by `.prose sup`) and the arrow becomes ARROW_SVG.
 * Gotcha: it operates on the raw HTML string, so the rules also apply inside attribute values.
 */
export function normalizeHtml(html: string): string {
  return html
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => `<sup>${[...m].map((c) => SUP[c]).join('')}</sup>`)
    .replace(/\s*→\s*/g, ` ${ARROW_SVG} `)
    .replace(/≈\s*/g, 'approximately ')
    .replace(/\s*≠\s*/g, ' is not ')
    // Same emoji rule as normalizeText (the optional U+FE0F is invisible in most editors).
    .replace(/\p{Extended_Pictographic}️?\s*/gu, '');
}

/**
 * Heading hygiene for migrated HTML: no level may skip (h2→h4 becomes h2→h3). Headings never nest.
 *
 * Why: the article page already owns the single <h1> (the title), and QA-01 fails any page with a
 * skipped heading level. WordPress authors often pick heading levels for their look.
 *
 * @param html  body HTML to repair.
 * @param start lowest level allowed (default 2, because the page title is the h1). Any h1 in the
 *   body is demoted to at least this level.
 * @returns HTML where each opening heading is at most one level deeper than the previous heading,
 *   and never shallower than `start`. Attributes on the heading tag are kept.
 *
 * How: one regex pass over opening and closing heading tags. `prev` remembers the last emitted
 * level; `open` is the level of the heading currently open. A closing tag is rewritten to match
 * `open`, which is only correct because headings cannot contain other headings.
 */
export function normalizeHeadings(html: string, start = 2): string {
  let prev = start - 1;
  let open = start;
  // Groups: 1 = "/" for closing tags, 2 = level digit, 3 = optional attributes (starting with whitespace).
  return html.replace(/<(\/?)h([1-6])(\s[^>]*)?>/gi, (_m, close: string, lvl: string, attrs = '') => {
    if (close) return `</h${open}>`;
    // Clamp: no deeper than prev + 1 (no skipped levels), no shallower than `start`.
    open = Math.max(start, Math.min(+lvl, prev + 1));
    prev = open;
    return `<h${open}${attrs}>`;
  });
}

/**
 * External links in migrated HTML open in a new tab with an accessible notice.
 *
 * Three rewrites, applied in order:
 *   1. Legacy case-study links (`/case-study/{slug}`, root-relative or on qualityworkscg.com, with or
 *      without www) move to `/case-studies/{slug}`. Note: the slug is kept as written; neutral
 *      renames from redirects.json are not applied here.
 *   2. Other absolute qualityworkscg.com links become root-relative, but only when `isBuilt(path)`
 *      says the target exists in this build; otherwise the live absolute URL is kept so the link
 *      still works.
 *   3. Every remaining absolute http(s) link is treated as external: existing target/rel
 *      attributes are removed and `target="_blank" rel="noopener"` plus a visually hidden
 *      "(opens in a new tab)" are added (QA-03 checks this on every page). Absolute links to the
 *      live site's /services/, /industries/, /case-study/ and /engagement-models/ sections are
 *      excluded from this step and stay same-tab links.
 *
 * @param html    body HTML.
 * @param isBuilt predicate: does this root-relative path exist in the build? Defaults to "yes".
 *   articles.ts passes `builtPath`, which knows the migrated post slugs and main site sections.
 * @returns the rewritten HTML.
 */
export function normalizeLinks(html: string, isBuilt: (path: string) => boolean = () => true): string {
  return html
    // Legacy case-study paths move to the standardised /case-studies/{slug}/ pattern.
    .replace(/href="(?:https?:\/\/(?:www\.)?qualityworkscg\.com)?\/case-study\/([^"]+)"/gi, 'href="/case-studies/$1"')
    // Internal absolute links become root-relative so they work on any host (and in the prototype).
    // The second regex below (on the same line) captures: pre-href attributes, the absolute href
    // (negative lookahead skips the live-site sections listed above), post-href attributes and the
    // link text (lazy, may span lines).
    .replace(/href="https?:\/\/(?:www\.)?qualityworkscg\.com(\/[^"]*)?"/gi, (m, path) => (isBuilt(path || '/') ? `href="${path || '/'}"` : m)).replace(/<a\s+([^>]*?)href="(https?:\/\/(?!(?:www\.)?qualityworkscg\.com\/(?:services|industries|case-study|engagement-models)\/)[^"]+)"([^>]*)>([\s\S]*?)<\/a>/gi, (_m, pre, href, post, text) => {
    // Drop any target/rel the author set so the attributes are not duplicated.
    const attrs = `${pre}${post}`.replace(/\s*(target|rel)="[^"]*"/gi, '');
    // When the anchor had no other attributes the template yields "<a  href" (two spaces); the
    // trailing .replace collapses that to one space.
    return `<a ${attrs.trim()} href="${href}" target="_blank" rel="noopener">${text}<span class="visually-hidden"> (opens in a new tab)</span></a>`.replace('<a  ', '<a ');
  });
}
