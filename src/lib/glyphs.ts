/**
 * GLYPH NORMALISATION (typography QA rule BR-17).
 * Red Hat Display does not contain some characters found in migrated WordPress content, which made
 * single characters render in a fallback font. These rules keep meaning but stay inside the brand
 * font. Every rule is listed in docs/04-content-schemas.md for content-owner sign-off.
 */
const SUP: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
const ARROW_SVG = '<svg class="inline-arrow" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="visually-hidden">to</span>';

export function normalizeText(s: string): string {
  return s
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => [...m].map((c) => SUP[c]).join(''))
    .replace(/\s*→\s*/g, ' to ')
    .replace(/≈\s*/g, 'approximately ')
    .replace(/\s*≠\s*/g, ' is not ')
    .replace(/\p{Extended_Pictographic}️?\s*/gu, '');
}

export function normalizeHtml(html: string): string {
  return html
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => `<sup>${[...m].map((c) => SUP[c]).join('')}</sup>`)
    .replace(/\s*→\s*/g, ` ${ARROW_SVG} `)
    .replace(/≈\s*/g, 'approximately ')
    .replace(/\s*≠\s*/g, ' is not ')
    .replace(/\p{Extended_Pictographic}️?\s*/gu, '');
}

/** Heading hygiene for migrated HTML: no level may skip (h2→h4 becomes h2→h3). Headings never nest. */
export function normalizeHeadings(html: string, start = 2): string {
  let prev = start - 1;
  let open = start;
  return html.replace(/<(\/?)h([1-6])(\s[^>]*)?>/gi, (_m, close: string, lvl: string, attrs = '') => {
    if (close) return `</h${open}>`;
    open = Math.max(start, Math.min(+lvl, prev + 1));
    prev = open;
    return `<h${open}${attrs}>`;
  });
}

/** External links in migrated HTML open in a new tab with an accessible notice. */
export function normalizeLinks(html: string, isBuilt: (path: string) => boolean = () => true): string {
  return html
    // Legacy case-study paths move to the standardised /case-studies/{slug}/ pattern.
    .replace(/href="(?:https?:\/\/(?:www\.)?qualityworkscg\.com)?\/case-study\/([^"]+)"/gi, 'href="/case-studies/$1"')
    // Internal absolute links become root-relative so they work on any host (and in the prototype).
    .replace(/href="https?:\/\/(?:www\.)?qualityworkscg\.com(\/[^"]*)?"/gi, (m, path) => (isBuilt(path || '/') ? `href="${path || '/'}"` : m)).replace(/<a\s+([^>]*?)href="(https?:\/\/(?!(?:www\.)?qualityworkscg\.com\/(?:services|industries|case-study|engagement-models)\/)[^"]+)"([^>]*)>([\s\S]*?)<\/a>/gi, (_m, pre, href, post, text) => {
    const attrs = `${pre}${post}`.replace(/\s*(target|rel)="[^"]*"/gi, '');
    return `<a ${attrs.trim()} href="${href}" target="_blank" rel="noopener">${text}<span class="visually-hidden"> (opens in a new tab)</span></a>`.replace('<a  ', '<a ');
  });
}
