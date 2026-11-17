import { site } from '../data/site';
import type { Article, FaqItem } from '../data/types';

/** Structured data helpers. Only emit schema that matches VISIBLE page content. */
export const organizationLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${site.legacyOrigin}/#organization`,
  name: site.name,
  alternateName: site.shortName,
  url: `${site.legacyOrigin}/`,
  logo: `${site.legacyOrigin}/wp-content/uploads/logo-qualityworks.png`,
  foundingDate: String(site.founded),
  email: site.email,
  telephone: '+1-424-363-7111',
  address: { '@type': 'PostalAddress', addressLocality: 'Los Angeles', addressRegion: 'CA', addressCountry: 'US' },
  sameAs: site.social.map((s) => s.href),
});

/** FAQPage only when the FAQ is rendered visibly on the same page and answers are factual. */
export const faqLd = (items: FaqItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const articleLd = (a: Article) => ({
  '@context': 'https://schema.org',
  '@type': a.type === 'news' ? 'NewsArticle' : 'BlogPosting',
  headline: a.title,
  datePublished: a.publishedAt,
  dateModified: a.updatedAt,
  author: { '@type': 'Person', name: a.author },
  publisher: { '@id': `${site.legacyOrigin}/#organization` },
  mainEntityOfPage: `${site.legacyOrigin}/${a.slug}/`,
  ...(a.image ? { image: new URL(a.image, site.legacyOrigin).toString() } : {}),
});

export const serviceLd = (name: string, description: string, path: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  url: new URL(path, site.legacyOrigin).toString(),
  provider: { '@id': `${site.legacyOrigin}/#organization` },
});
