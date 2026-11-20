/**
 * ARTICLES / RESOURCES: migrated WordPress posts plus labelled fixture resources.
 *
 * WHAT: builds the typed `Article[]` the blog, resource hub, homepage and article pages render.
 *   Source text comes from src/data/migrated/articles.wp-snapshot.json (written by
 *   `npm run migrate:wordpress`, scripts/migrate-wordpress.mjs) and is never edited by hand.
 *
 * PIPELINE per migrated post (build time, in this order):
 *   1. applyCorrections() from corrections.ts: logged editorial fixes (review rounds 1–2). A
 *      correction that no longer matches throws and fails the build.
 *   2. Glyph normalisation (src/lib/glyphs.ts) so every character exists in the brand font.
 *   3. Body HTML only: heading-level repair, then link rewriting (internal absolute links become
 *      root-relative when the target is built; external links open in a new tab).
 *   4. Derived fields: `type` (news vs blog), local mirrored `image` (src/lib/media.ts), rewritten
 *      alt text (altText.ts) and `provenance`.
 *
 * EXPORTS AND CONSUMERS
 *   articles       migrated + fixtures (fixtures removed in release builds), newest first.
 *                  Used by src/pages/resources/index.astro.
 *   blogPosts      migrated posts only (snapshot order). Used by src/pages/[slug].astro (one page
 *                  per post at /{slug}/), src/pages/blog/index.astro, the homepage and the design
 *                  system page.
 *   articleBySlug  lookup among migrated posts (not currently imported elsewhere).
 *   contentTypes   resource-hub type chips (src/pages/resources/index.astro).
 *
 * HOW TO EXTEND
 *   - More posts: raise WP_PER_PAGE and re-run the migration; add alt text in altText.ts and, if
 *     needed, corrections in corrections.ts. Never edit the snapshot JSON.
 *   - A new non-WordPress resource (whitepaper, guide): add a record to `fixtures` only if it is
 *     clearly fictional/placeholder (provenance 'fixture'); real resources need a real source.
 *
 * GOTCHAS
 *   - Post slugs are served at the site root (/{slug}/), exactly as on WordPress, so a post slug
 *     must never collide with a page route.
 *   - Spreading `...p` keeps raw snapshot fields (e.g. `source`, `publicationState`) on each record;
 *     only the fields listed below are transformed.
 */
import raw from './migrated/articles.wp-snapshot.json';
import type { Article } from './types';
import { localMedia } from '../lib/media';
import { normalizeHtml, normalizeHeadings, normalizeLinks, normalizeText } from '../lib/glyphs';
import { applyCorrections, corrections } from './corrections';
import { articleAlt } from './altText';
/**
 * Apply corrections to a list field (currently `tags`). The list is joined with "|" so a single
 * correction can match one item, then split again. Lists with no correction targeting them are
 * returned untouched (no join/split round trip). Gotcha: a list item that itself contains "|"
 * would be split in two.
 */
const applyCorrectionsList = (target: string, field: string, list: string[]) =>
  corrections.some((c) => c.target === target && c.field === field) ? applyCorrections(target, field, list.join('|')).split('|') : list;

// Every migrated post slug, used to decide whether an internal link target exists in this build.
const migratedSlugs = new Set((raw as any[]).map((p) => p.slug));
// Internal links whose target exists in this build become root-relative; links to posts that are
// not yet migrated keep the live absolute URL (they will resolve once all 99 posts are migrated).
// builtPath(path): true when a root-relative path will exist in this build. The path is reduced to its
// first segment (query/hash and surrounding slashes removed). Single-segment paths must be a migrated
// post or one of the listed top-level routes; the root and multi-segment paths (e.g. /services/x/)
// are assumed to exist. Passed to normalizeLinks() in src/lib/glyphs.ts.
const builtPath = (path: string) => {
  const seg = path.split(/[?#]/)[0].replace(/^\/|\/$/g, '');
  return !seg.includes('/') && seg.length > 0 ? migratedSlugs.has(seg) || ['contact-us', 'careers', 'about-us', 'blog', 'case-studies', 'industries', 'services', 'maturity-assessments', 'innovation-tourism', 'qualitywatcher-ai-tools', 'privacy-policy', 'terms-conditions', 'engagement-models'].includes(seg) : true;
};

/**
 * Posts that are whitepapers, with the cover used on cards. "More QA, Not Less" exists as a whitepaper document
 * (shared drive: QualityWorks_More_QA_Not_Less_Whitepaper.docx) and its live banner says "This whitepaper
 * explores…". The cover is the banner's title panel, cropped to 16:9 so cards show the full title
 * (public/media/more-qa-not-less-whitepaper-cover.webp, cropped from qualityworks_more_qa_not_less_featured.jpg).
 */
const WHITEPAPERS: Record<string, { cover: string }> = {
  'more-qa-not-less-closing-the-verification-gap-in-ai-accelerated-software-delivery': { cover: '/media/more-qa-not-less-whitepaper-cover.webp' },
};

/** WordPress posts (migrated snapshot) + clearly labelled fixtures for content types with no live data. */
const migrated: Article[] = (raw as any[]).map((p) => ({
  ...p,
  title: normalizeText(applyCorrections(`article:${p.slug}`, 'title', p.title)),
  excerpt: normalizeText(applyCorrections(`article:${p.slug}`, 'excerpt', p.excerpt)),
  bodyHtml: normalizeLinks(normalizeHeadings(normalizeHtml(applyCorrections(`article:${p.slug}`, 'bodyHtml', p.bodyHtml))), builtPath),
  tags: applyCorrectionsList(`article:${p.slug}`, 'tags', p.tags),
  // News: WordPress category 'News', or a company-news slug prefix. Everything else is a blog post.
  // Whitepapers published as posts (WHITEPAPERS above) are typed 'whitepaper' so the resource hub files them correctly.
  type: WHITEPAPERS[p.slug] ? 'whitepaper' : p.categories.includes('News') || /^(qualityworks-wins|announcing)/.test(p.slug) ? 'news' : 'blog',
  // Local mirrored copy in public/media/ when present (scripts/fetch-media.sh), else the live URL.
  image: WHITEPAPERS[p.slug]?.cover ?? localMedia(p.image),
  // Alt text rewritten after viewing each image (src/data/altText.ts). Audit item A11Y-03.
  imageAlt: articleAlt[p.slug] ?? p.imageAlt ?? '',
  // Published on the live site today; still needs re-approval before reuse in the rebuild.
  provenance: { source: 'wordpress-migrated', approval: 'published-live', sourceUrl: p.source.url, retrievedAt: p.source.retrievedAt },
}));

// FIXTURES: illustrative resource cards for content types with no live data. Provenance 'fixture';
// removed from release builds below. The PRISM whitepaper title is real; it is not released yet ("Coming soon")
// and links to the PRISM product page because no downloadable asset was found (docs/04 §12).
const fixtures: Article[] = [
  {
    id: 'fixture-whitepaper-prism', slug: 'prism-whitepaper', title: 'PRISM™: The AI Output Quality Standard (whitepaper)', type: 'whitepaper',
    // Not released yet, so it is never backdated: the card shows "Coming soon" and the sort date is a
    // placeholder in the future (31 Dec 2026). Replace both with the real release date once it is set.
    author: 'QualityWorks Consulting Group', publishedAt: '2026-12-31', updatedAt: '2026-12-31', comingSoon: true,
    excerpt: 'The homepage advertises a “New whitepaper” for PRISM™, but no downloadable asset was found. This card shows how a gated or ungated whitepaper would appear once the file and landing page are approved.',
    metaDescription: null, categories: ['AI'], tags: ['PRISM'], image: null, imageAlt: '', href: '/products/prism/',
    provenance: { source: 'fixture', approval: 'fixture', note: 'Placeholder for a real asset. Title is real; not yet released (no release date approved).' },
  },
];

// Release builds (QW_RELEASE=true) must not contain fixtures; see src/lib/release.ts and CONTRIBUTING.md §6.
import { RELEASE } from '../lib/release';
/** All resources for listings: migrated posts plus (review builds only) fixtures, sorted newest first by publishedAt. */
export const articles: Article[] = [...migrated, ...(RELEASE ? [] : fixtures)].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
/** Migrated WordPress posts only (never fixtures); one /{slug}/ page is generated per entry. */
export const blogPosts = migrated;
/** Find a migrated post by its WordPress slug; undefined when not found. Fixtures are not searched. */
export const articleBySlug = (slug: string) => migrated.find((a) => a.slug === slug);
/**
 * Resource-hub type filter chips: id is matched against the item's type on the resources page,
 * label is the chip text. 'event' covers EventRecords from events.ts (not an Article type).
 * `as const` keeps the ids as literal types.
 */
export const contentTypes = [
  { id: 'blog', label: 'Articles' },
  { id: 'news', label: 'News & awards' },
  { id: 'whitepaper', label: 'Whitepapers' },
  { id: 'event', label: 'Events' },
] as const;
