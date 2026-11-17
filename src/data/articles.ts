import raw from './migrated/articles.wp-snapshot.json';
import type { Article } from './types';
import { localMedia } from '../lib/media';
import { normalizeHtml, normalizeHeadings, normalizeLinks, normalizeText } from '../lib/glyphs';

const migratedSlugs = new Set((raw as any[]).map((p) => p.slug));
// Internal links whose target exists in this build become root-relative; links to posts that are
// not yet migrated keep the live absolute URL (they will resolve once all 99 posts are migrated).
const builtPath = (path: string) => {
  const seg = path.split(/[?#]/)[0].replace(/^\/|\/$/g, '');
  return !seg.includes('/') && seg.length > 0 ? migratedSlugs.has(seg) || ['contact-us', 'careers', 'about-us', 'blog', 'case-studies', 'industries', 'services', 'maturity-assessments', 'innovation-tourism', 'qualitywatcher-ai-tools', 'privacy-policy', 'terms-conditions', 'engagement-models'].includes(seg) : true;
};

/** WordPress posts (migrated snapshot) + clearly labelled fixtures for content types with no live data. */
const migrated: Article[] = (raw as any[]).map((p) => ({
  ...p,
  title: normalizeText(p.title),
  excerpt: normalizeText(p.excerpt),
  bodyHtml: normalizeLinks(normalizeHeadings(normalizeHtml(p.bodyHtml)), builtPath),
  type: p.categories.includes('News') || /^(qualityworks-wins|announcing)/.test(p.slug) ? 'news' : 'blog',
  image: localMedia(p.image),
  // Weak WordPress alt text (e.g. "untitled design 3") is cleared so the image is treated as
  // decorative next to the visible title. Audit item A11Y-03.
  imageAlt: /untitled|featured image|square|^nlp|^smb/i.test(p.imageAlt ?? '') ? '' : p.imageAlt,
  provenance: { source: 'wordpress-migrated', approval: 'published-live', sourceUrl: p.source.url, retrievedAt: p.source.retrievedAt },
}));

const fixtures: Article[] = [
  {
    id: 'fixture-whitepaper-prism', slug: 'prism-whitepaper', title: 'PRISM™: The AI Output Quality Standard (whitepaper)', type: 'whitepaper',
    author: 'QualityWorks Consulting Group', publishedAt: '2026-10-01', updatedAt: '2026-10-01',
    excerpt: 'The homepage advertises a “New whitepaper” for PRISM™, but no downloadable asset was found. This card shows how a gated or ungated whitepaper would appear once the file and landing page are approved.',
    metaDescription: null, categories: ['AI'], tags: ['PRISM'], image: null, imageAlt: '', href: '/products/prism/',
    provenance: { source: 'fixture', approval: 'fixture', note: 'Placeholder for a real asset. Title is real; date is illustrative.' },
  },
];

export const articles: Article[] = [...migrated, ...fixtures].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
export const blogPosts = migrated;
export const articleBySlug = (slug: string) => migrated.find((a) => a.slug === slug);
export const contentTypes = [
  { id: 'blog', label: 'Articles' },
  { id: 'news', label: 'News & awards' },
  { id: 'whitepaper', label: 'Whitepapers' },
  { id: 'event', label: 'Events' },
] as const;
