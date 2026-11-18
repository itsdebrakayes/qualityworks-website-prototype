/**
 * STRUCTURED DATA (schema.org JSON-LD) builders.
 *
 * WHY: search engines and answer engines read JSON-LD, and structured data that does not match the
 *   visible page can be ignored or penalised. Rule for this file: only emit schema that matches VISIBLE page content
 *   (e.g. FAQPage only where the FAQ is rendered on the same page). See docs/05-seo-aeo.md.
 *
 * EXPORTS AND CONSUMERS (each returns a plain object; pages pass it to BaseLayout's `jsonLd` prop,
 * which serialises it into <script type="application/ld+json">):
 *   organizationLd()                         src/pages/index.astro (homepage only)
 *   faqLd(items)                             ServiceTemplate (when the service has faqs),
 *                                            /qualitywatcher-ai-tools/, /products/agents-as-a-service/
 *   articleLd(article)                       src/pages/[slug].astro (migrated posts)
 *   serviceLd(name, description, path)       components/templates/ServiceTemplate.astro
 *   BaseLayout itself adds BreadcrumbList when breadcrumbs are passed.
 *
 * URLS: every absolute URL is built on `site.legacyOrigin` (https://qualityworkscg.com), the
 *   canonical production origin, not on the prototype host, so the markup is already correct for
 *   launch. Organization and Service/Article nodes are linked by the shared
 *   `{origin}/#organization` @id.
 *
 * VERIFICATION: QA-06 (scripts/qa-checks.mjs) checks that every JSON-LD block parses;
 *   scripts/content-check.mjs scans JSON-LD for prohibited wording.
 *
 * HOW TO EXTEND: add a new builder that takes typed data (from src/data/types.ts) and returns a
 *   plain object with '@context' and '@type'; reference the organisation by its @id instead of
 *   repeating it. Then pass it via `jsonLd={[…]}` on the page that visibly shows that content.
 */
import { site } from '../data/site';
import type { Article, FaqItem } from '../data/types';

/** Structured data helpers. Only emit schema that matches VISIBLE page content. */
/**
 * Organization node for QualityWorks (name, logo, founding year, contact, social profiles).
 * Values come from src/data/site.ts except the telephone and address, which are written here and
 * must be kept in step with the headquarters entry in site.offices.
 * @returns schema.org Organization object.
 */
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
  // Social profile URLs from site.social; schema.org uses sameAs to tie the entity to them.
  sameAs: site.social.map((s) => s.href),
});

/**
 * FAQPage only when the FAQ is rendered visibly on the same page and answers are factual.
 * @param items the same FaqItem list the page renders with FaqAccordion (do not pass a subset or
 *   different wording: the markup must match what users see).
 * @returns schema.org FAQPage object with one Question/Answer per item (answer text is plain text).
 */
export const faqLd = (items: FaqItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

/**
 * Article node for a migrated post.
 * @param a the Article record rendered on the page.
 * @returns NewsArticle when `a.type === 'news'`, otherwise BlogPosting; includes dates, author,
 *   publisher (by @id), the canonical page URL on the legacy origin (root-level slug, as on
 *   WordPress), and `image` only when the article has one (the spread adds nothing otherwise).
 */
export const articleLd = (a: Article) => ({
  '@context': 'https://schema.org',
  '@type': a.type === 'news' ? 'NewsArticle' : 'BlogPosting',
  headline: a.title,
  datePublished: a.publishedAt,
  dateModified: a.updatedAt,
  author: { '@type': 'Person', name: a.author },
  publisher: { '@id': `${site.legacyOrigin}/#organization` },
  mainEntityOfPage: `${site.legacyOrigin}/${a.slug}/`,
  // new URL() resolves both root-relative (/media/…) and absolute image paths against the origin.
  ...(a.image ? { image: new URL(a.image, site.legacyOrigin).toString() } : {}),
});

/**
 * Service node for a service/engagement page.
 * @param name        service name as shown on the page.
 * @param description visible summary (ServiceTemplate passes `seo.description`).
 * @param path        root-relative route, resolved against the legacy origin.
 * @returns schema.org Service object with QualityWorks as provider (by @id).
 */
export const serviceLd = (name: string, description: string, path: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  url: new URL(path, site.legacyOrigin).toString(),
  provider: { '@id': `${site.legacyOrigin}/#organization` },
});
