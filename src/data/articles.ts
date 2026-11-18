import raw from './migrated/articles.wp-snapshot.json';
import type { Article } from './types';
import { localMedia } from '../lib/media';
import { normalizeHtml, normalizeHeadings, normalizeLinks, normalizeText } from '../lib/glyphs';
import { applyCorrections, corrections } from './corrections';
import { articleAlt } from './altText';
const applyCorrectionsList = (target: string, field: string, list: string[]) =>
  corrections.some((c) => c.target === target && c.field === field) ? applyCorrections(target, field, list.join('|')).split('|') : list;

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
  title: normalizeText(applyCorrections(`article:${p.slug}`, 'title', p.title)),
  excerpt: normalizeText(applyCorrections(`article:${p.slug}`, 'excerpt', p.excerpt)),
  bodyHtml: normalizeLinks(normalizeHeadings(normalizeHtml(applyCorrections(`article:${p.slug}`, 'bodyHtml', p.bodyHtml))), builtPath),
  tags: applyCorrectionsList(`article:${p.slug}`, 'tags', p.tags),
  type: p.categories.includes('News') || /^(qualityworks-wins|announcing)/.test(p.slug) ? 'news' : 'blog',
  image: localMedia(p.image),
  // Alt text rewritten after viewing each image (src/data/altText.ts). Audit item A11Y-03.
  imageAlt: articleAlt[p.slug] ?? p.imageAlt ?? '',
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

import { RELEASE } from '../lib/release';
export const articles: Article[] = [...migrated, ...(RELEASE ? [] : fixtures)].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
export const blogPosts = migrated;
export const articleBySlug = (slug: string) => migrated.find((a) => a.slug === slug);
export const contentTypes = [
  { id: 'blog', label: 'Articles' },
  { id: 'news', label: 'News & awards' },
  { id: 'whitepaper', label: 'Whitepapers' },
  { id: 'event', label: 'Events' },
] as const;
