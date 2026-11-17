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
 */
import { writeFile } from 'node:fs/promises';

const BASE = 'https://qualityworkscg.com/wp-json/wp/v2';
const PER_PAGE = Number(process.env.WP_PER_PAGE ?? 12);

const decode = (s = '') =>
  s.replace(/&#8217;|&rsquo;/g, '’').replace(/&#8216;/g, '‘').replace(/&#8220;|&#8221;/g, '"')
   .replace(/&#8211;/g, '–').replace(/&#8212;/g, '—').replace(/&#038;|&amp;/g, '&')
   .replace(/&nbsp;/g, ' ').replace(/&#8230;|&hellip;/g, '…').replace(/<[^>]+>/g, '').trim();

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

const res = await fetch(`${BASE}/posts?per_page=${PER_PAGE}&_embed=author,wp:featuredmedia,wp:term`);
if (!res.ok) throw new Error(`WordPress API ${res.status}`);
const posts = await res.json();

const articles = posts.map((p) => {
  const media = p._embedded?.['wp:featuredmedia']?.[0] ?? {};
  const terms = (p._embedded?.['wp:term'] ?? []).flat();
  return {
    id: `wp-post-${p.id}`,
    source: { system: 'wordpress', id: p.id, url: p.link, retrievedAt: new Date().toISOString().slice(0, 10) },
    slug: p.slug,
    title: decode(p.title.rendered),
    type: 'blog',
    author: p._embedded?.author?.[0]?.name ?? 'QualityWorks Consulting Group',
    publishedAt: p.date.slice(0, 10),
    updatedAt: p.modified.slice(0, 10),
    excerpt: decode(p.excerpt.rendered).replace(/\s*\[…\]$/, '…'),
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
