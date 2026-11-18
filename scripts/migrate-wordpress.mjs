/**
 * WordPress -> structured content migration (prototype proof of approach).
 *
 * Reads the PUBLIC WordPress REST API of the existing site (read-only, no auth)
 * and writes a snapshot to src/data/migrated/articles.wp-snapshot.json.
 *
 * - Posts: title, slug (URL preserved at root: /{slug}/), dates, author, categories/tags,
 *   excerpt, featured image + alt text, Yoast meta description, and sanitised body HTML.
 * - Case studies: the custom post type stores its body in Beaver Builder layouts, NOT in
 *   `content.rendered` (verified: empty for 16/17 records). Structured case-study fields were
 *   therefore parsed from the rendered public pages during discovery and saved to
 *   src/data/migrated/case-studies.wp-snapshot.json. Production migration needs a CMS-side
 *   export or manual re-entry into the case-study schema (see docs/04-content-schemas.md).
 *
 * Usage: npm run migrate:wordpress   (requires outbound HTTPS to qualityworkscg.com)
 *
 * ENV: WP_PER_PAGE  number of most recent posts to fetch (default 12). Only ONE page of results is
 *   requested (no pagination), so this is also the total; the WordPress REST API caps per_page at 100.
 *
 * OUTPUT: OVERWRITES src/data/migrated/articles.wp-snapshot.json with an array of post objects
 *   (id, source {system, id, url, retrievedAt}, slug, title, type, author, publishedAt, updatedAt,
 *   excerpt, metaDescription, categories, tags, image, imageAlt, bodyHtml, publicationState).
 *   src/data/articles.ts turns these into Article records (and re-derives `type`).
 *
 * GOTCHAS
 *   - Re-running replaces the snapshot with whatever is live today. Any logged correction in
 *     src/data/corrections.ts whose `find` text changed will then FAIL THE BUILD by design; review
 *     the diff of the snapshot and update corrections before committing.
 *   - New posts need alt text in src/data/altText.ts and mirrored images (scripts/fetch-media.sh).
 *   - "Facts and wording are unchanged": sanitise() only removes markup, never edits text.
 */
import { writeFile } from 'node:fs/promises';

// Public WordPress REST API root of the live site (read-only, no authentication).
const BASE = 'https://qualityworkscg.com/wp-json/wp/v2';
const PER_PAGE = Number(process.env.WP_PER_PAGE ?? 12);

/**
 * Turn a WordPress "rendered" string into plain text: decode the HTML entities WordPress emits for
 * curly quotes, dashes, ampersands, no-break spaces and ellipses, then strip any tags and trim.
 * Note: curly double quotes become straight quotes; single quotes stay curly.
 */
const decode = (s = '') =>
  s.replace(/&#8217;|&rsquo;/g, '’').replace(/&#8216;/g, '‘').replace(/&#8220;|&#8221;/g, '"')
   .replace(/&#8211;/g, '–').replace(/&#8212;/g, '—').replace(/&#038;|&amp;/g, '&')
   .replace(/&nbsp;/g, ' ').replace(/&#8230;|&hellip;/g, '…').replace(/<[^>]+>/g, '').trim();

/**
 * Clean post body HTML for the static site while keeping the text intact (docs/04 §5):
 * remove <script> and <style> blocks; replace <iframe> embeds with a visible migration note;
 * remove class/style/id/data-* and responsive-image attributes; demote <h1> to <h2> (the page title
 * is the only h1); remove empty paragraphs; unwrap bare <span>s. Heading levels are repaired later
 * by normalizeHeadings() in src/lib/glyphs.ts at build time.
 * @param {string} html content.rendered from the REST API.
 * @returns {string} sanitised HTML.
 */
function sanitise(html = '') {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '<p class="migration-note">[Embedded media removed in prototype – verify during migration]</p>')
    .replace(/\s(class|style|id|data-[\w-]+|srcset|sizes|decoding|fetchpriority)="[^"]*"/gi, '')
    .replace(/<h1(\s|>)/gi, '<h2$1').replace(/<\/h1>/gi, '</h2>') // one H1 per page: the article title
    .replace(/<p>\s*(&nbsp;)?\s*<\/p>/gi, '')
    .replace(/<span>([\s\S]*?)<\/span>/gi, '$1');
}

// One request: the newest PER_PAGE posts with author, featured media and terms (categories/tags)
// embedded in the response, so no follow-up requests are needed.
const res = await fetch(`${BASE}/posts?per_page=${PER_PAGE}&_embed=author,wp:featuredmedia,wp:term`);
if (!res.ok) throw new Error(`WordPress API ${res.status}`);
const posts = await res.json();

const articles = posts.map((p) => {
  // Embedded featured image (may be absent) and all terms (categories and tags) flattened into one list.
  const media = p._embedded?.['wp:featuredmedia']?.[0] ?? {};
  const terms = (p._embedded?.['wp:term'] ?? []).flat();
  return {
    id: `wp-post-${p.id}`,
    source: { system: 'wordpress', id: p.id, url: p.link, retrievedAt: new Date().toISOString().slice(0, 10) },
    slug: p.slug,
    title: decode(p.title.rendered),
    type: 'blog',
    author: p._embedded?.author?.[0]?.name ?? 'QualityWorks Consulting Group',
    // Dates trimmed to YYYY-MM-DD.
    publishedAt: p.date.slice(0, 10),
    updatedAt: p.modified.slice(0, 10),
    // WordPress ends auto-excerpts with " […]"; replace that with a single ellipsis character.
    excerpt: decode(p.excerpt.rendered).replace(/\s*\[…\]$/, '…'),
    // Meta description from the Yoast SEO plugin's REST field, when the post has one.
    metaDescription: p.yoast_head_json?.description ?? null,
    categories: [...new Set(terms.filter((t) => t.taxonomy === 'category').map((t) => decode(t.name)))],
    tags: [...new Set(terms.filter((t) => t.taxonomy === 'post_tag').map((t) => decode(t.name)))],
    image: media.source_url ?? null,
    imageAlt: media.alt_text || '',
    bodyHtml: sanitise(p.content.rendered),
    publicationState: 'published-on-live-site',
  };
});

await writeFile(new URL('../src/data/migrated/articles.wp-snapshot.json', import.meta.url), JSON.stringify(articles, null, 1));
console.log(`Wrote ${articles.length} articles`);
