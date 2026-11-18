/**
 * CASE STUDIES: typed CaseStudy records built from the WordPress snapshot plus curated taxonomy.
 *
 * WHY: the WordPress case-study post type keeps its body in Beaver Builder layouts, so the text was
 *   parsed from the rendered public pages (scripts/cs.py) into
 *   src/data/migrated/case-studies.wp-snapshot.json. That snapshot is never edited by hand; this
 *   module adds what the snapshot cannot provide (client, industry, service tags, metrics with
 *   context) and applies logged corrections at build time. See docs/04-content-schemas.md §4.
 *
 * EXPORTS AND CONSUMERS
 *   caseStudies      all records, newest first. Used by /case-studies/ (list with filters),
 *                    /case-studies/[slug]/ (detail pages), /industries/ and the design-system page.
 *   caseStudyBySlug  lookup by PUBLIC slug. Used by ServiceTemplate, /industries/[slug]/,
 *                    /qualitywatcher-ai-tools/ and the homepage.
 *   publicSlug       legacy WordPress slug to public slug (used internally; same rule as
 *                    scripts/gen-redirects.mjs).
 *
 * HOW TO ADD A CASE STUDY (CONTRIBUTING.md §4.2)
 *   1. Add or re-parse the raw entry in the snapshot JSON with scripts/cs.py.
 *   2. Add a `curated` entry below keyed by its PUBLIC slug: client (or a neutral descriptor),
 *      industry slug (industries.ts), serviceTags (service slugs from services.ts), relatedSolution,
 *      contribution (one sentence) and metrics built with m(value, label, context).
 *   3. Add alt text to caseStudyAlt in altText.ts.
 *   4. If the WordPress slug must not be public, add it to caseStudySlugRenames in redirects.json.
 *
 * GOTCHAS
 *   - Every snapshot record MUST have a curated entry: `c.client` is read without a guard, so a
 *     missing entry throws during the build.
 *   - Wording fixes go in corrections.ts (target `case-study:{public slug}`), never here or in the
 *     snapshot. A correction that stops matching fails the build.
 *   - Metrics are quoted as published; `metricSource` is added automatically (live URL, or a
 *     neutral reference for renamed records whose legacy URL must not be rendered).
 */
import raw from './migrated/case-studies.wp-snapshot.json';
import type { CaseStudy } from './types';
import { localMedia } from '../lib/media';
import { normalizeText } from '../lib/glyphs';
import { applyCorrections } from './corrections';
import { caseStudyAlt } from './altText';
import redirectMap from './redirects.json';

/** Public slug for a WordPress case study (neutral renames from redirects.json; legacy slug never rendered). */
// Legacy WordPress slug -> neutral public slug. redirects.json is the single home for legacy slugs.
const renames = redirectMap.caseStudySlugRenames as Record<string, string>;
/** @returns the neutral public slug for a WordPress slug, or the slug unchanged when it was not renamed. */
export const publicSlug = (sourceSlug: string) => renames[sourceSlug] ?? sourceSlug;

/**
 * Case studies = WordPress snapshot (parsed from rendered public pages; Beaver Builder stores
 * the body outside `content.rendered`) + curated taxonomy below.
 *
 * Client names are shown because they are published on the live site today, but
 * `clientDisclosureApproved` is `null` (unknown) for every record: disclosure approval must be
 * confirmed per client before the rebuild launches.
 * Metrics are quoted exactly as published; `context` records what is (not) known about measurement.
 */
/**
 * Hand-curated fields per case study (everything the rendered-page parser could not supply).
 * `metrics` here have no `metricSource`; it is added in the mapping below.
 */
type Curated = Pick<CaseStudy, 'client' | 'industry' | 'serviceTags' | 'relatedSolution' | 'metrics'> & { contribution: string };

/**
 * Metric shorthand used in `curated`: m(value, label, context). `context` must say what is known about
 * the measurement (period, baseline), or that it is not stated.
 */
const m = (value: string, label: string, context: string) => ({ value, label, context });

// Keyed by PUBLIC slug. Client names are those published on the live site (approval for reuse unknown,
// see clientDisclosureApproved below); unnamed clients use neutral descriptors. Metric values are
// quoted exactly as published on the live case studies (retrieved 2026-11-17).
const curated: Record<string, Curated> = {
  'ai-powered-test-case-generation-wssc': { client: 'Washington Suburban Sanitary Commission (WSSC)', industry: 'public-sector', serviceTags: ['test-automation', 'ai-service'], relatedSolution: 'qualitywatcher-ai-tools', contribution: 'Piloted AI-powered test case generation with the WSSC QA team.', metrics: [] /* R-25–R-27: figures removed pending the WSSC pilot report */ },
  'accelerating-confidence-qa-modernization-for-wisyncos-digital-ecosystem': { client: 'Wisynco Group Limited', industry: 'retail', serviceTags: ['test-automation', 'full-stack-testing'], relatedSolution: 'test-automation', contribution: 'QA modernization and automation across D365 ERP, CRM and supply chain systems.', metrics: [m('94.5%', 'Core D365 workflows automated', 'Against an original target; see source.'), m('100%', 'Functional CRM test coverage', 'As published.'), m('100%', 'QA team trained on automation', 'As published.')] },
  'fintech-legacy-platform-modernization': { client: 'Financial technology firm (name not approved for disclosure)', industry: 'finance-banking', serviceTags: ['test-automation', 'api-cloud-services-testing'], relatedSolution: 'test-automation', contribution: 'Established QA practices and automation for a legacy platform modernization over 8 months.', metrics: [m('90%+', 'Automation coverage', 'As published.'), m('80%+', 'Reduction in manual tester hours', 'As published.')] },
  'transforming-workforce-development-through-modern-technology': { client: 'Knowledge Architects', industry: 'technology', serviceTags: ['custom-software-development', 'full-stack-testing'], relatedSolution: 'custom-software-development', contribution: 'Platform performance and quality improvements for a workforce training platform.', metrics: [m('79% → 98%', 'Application quality', 'Pass rate of test cases, as published.'), m('40%', 'Faster 3D model loading', '5s to 3s.')] },
  'leading-entertainment-platform-with-site-reliability-engineering': { client: 'Fandango', industry: 'media-entertainment', serviceTags: ['non-functional-testing', 'performance-testing'], relatedSolution: 'non-functional-testing', contribution: 'Site reliability engineering and performance testing ahead of peak presales.', metrics: [m('7×', 'Traffic headroom', '85,000+ concurrent users during the Star Wars: The Last Jedi presale.'), m('99.9%', 'Uptime', 'Subsequent releases, as published.')] },
  'social-enterprise-org': { client: 'Shared Harvest', industry: 'social-impact', serviceTags: ['custom-software-development', 'technology-advisory-partnership'], relatedSolution: 'custom-software-development', contribution: 'Designed and built a role-based volunteer matching platform.', metrics: [m('3×', 'Faster application submission', 'As published.'), m('100+', 'Projects posted in the first 6 months', 'As published.')] },
  'financial-best-practices': { client: 'Mid-size financial services organization (unnamed)', industry: 'finance-banking', serviceTags: ['digital-agile-transformation'], relatedSolution: 'digital-agile-transformation', contribution: 'Introduced agile development and QA best practices from ideation to release.', metrics: [m('2 apps in 7 months', 'Release output', 'Previously 18–24 months per solution.')] },
  'address-quality-gaps': { client: 'Legacy.com', industry: 'media-entertainment', serviceTags: ['full-stack-testing', 'test-automation'], relatedSolution: 'full-stack-testing', contribution: 'Streamlined QA through training, automation and a DevOps environment strategy.', metrics: [m('10×', 'Increase in testing speed', 'As published; baseline not stated.')] },
  'jmmb-group-leverages-automation-best-practices': { client: 'JMMB Group', industry: 'finance-banking', serviceTags: ['test-automation', 'consulting-training'], relatedSolution: 'test-automation', contribution: 'Trained the bank’s QA staff and built a data-driven automation framework.', metrics: [m('4 days → 45 min', 'Regression turnaround', 'As published.'), m('30%', 'Reduced workload', 'As published.'), m('25%', 'Shorter release cycle', 'As published.')] },
  'insurance-faster-to-market': { client: 'Sagicor Life Insurance Company', industry: 'insurance', serviceTags: ['maturity-assessments', 'full-stack-testing'], relatedSolution: 'maturity-assessments', contribution: 'TMMi assessment, training material and a revamped test suite.', metrics: [m('15×', 'Speed to market for new solutions', 'As published; baseline not stated.')] },
  'telecom-automation': { client: 'US telecommunications and media company (unnamed)', industry: 'media-entertainment', serviceTags: ['test-automation', 'api-cloud-services-testing'], relatedSolution: 'test-automation', contribution: 'Selected and deployed E2E and visual regression frameworks for reusable UI components.', metrics: [m('~500 h', 'Testing hours saved weekly', 'Across several projects.'), m('2,830+', 'Tests created', 'As published.')] },
  'api-test-automation-for-european-delivery-company': { client: 'DPD', industry: 'logistics', serviceTags: ['api-cloud-services-testing', 'staff-augmentation'], relatedSolution: 'api-cloud-services-testing', contribution: 'Automated test development for new APIs and defect tracking to resolution.', metrics: [] },
  'how-automation-saved-big-bucks-and-drove-faster-app-releases': { client: 'Swagbucks', industry: 'technology', serviceTags: ['test-automation'], relatedSolution: 'test-automation', contribution: 'Full regression, stabilization and an end-to-end automation suite.', metrics: [m('8×', 'Faster releases', 'As published.'), m('32 h', 'Manual testing replaced per cycle (minimum)', 'As published.')] },
  'performance-testing-for-presale-of-star-wars-the-last-jedi': { client: 'Fandango', industry: 'media-entertainment', serviceTags: ['performance-testing', 'non-functional-testing'], relatedSolution: 'non-functional-testing', contribution: 'Full performance test suite across environments ahead of a record presale.', metrics: [m('7×', 'Performance and scalability optimization', '2017 presale, as published.')] },
  'mobile-game-development-creating-legacy': { client: 'BB&T / SunTrust Leadership Institute', industry: 'finance-banking', serviceTags: ['custom-software-development', 'web-mobile-application-testing'], relatedSolution: 'custom-software-development', contribution: 'Redesigned and redeveloped the “Legacy” leadership mobile game in three months.', metrics: [m('3 months', 'Redesign and redevelopment', 'iOS, Android, Windows and macOS.')] },
  'building-a-roadmap-to-continuous-improvement': { client: 'Inland Empire Health Plan (IEHP)', industry: 'healthcare', serviceTags: ['maturity-assessments', 'digital-agile-transformation'], relatedSolution: 'maturity-assessments', contribution: 'Two-week on-site DevOps maturity assessment and three-phase roadmap.', metrics: [] },
  'increasing-regression-test-coverage-by-15x': { client: 'Children’s Miracle Network Hospitals', industry: 'social-impact', serviceTags: ['test-automation', 'full-stack-testing'], relatedSolution: 'full-stack-testing', contribution: 'Automated 13 high-impact applications and integrated them into CI/CD.', metrics: [m('15×', 'Regression test coverage', 'As published.'), m('13', 'Applications fully automated', 'As published.')] },
};

// clean(): normalise glyphs, cut the old site's "Want to work with us?" call-to-action tail, remove a
// leading "Case Study –" label, and collapse whitespace.
const clean = (s?: string) => normalizeText(s ?? '').replace(/\s*Want to work with us\?[\s\S]*$/, '').replace(/^\s*–?\s*Case Study\s*–\s*/, '').replace(/\s+/g, ' ').trim();
// firstSentences(): first n sentences (runs ending in . ! or ?); falls back to the whole string when
// no sentence punctuation is found. Used to derive a summary when WordPress has no excerpt.
const firstSentences = (s: string, n = 2) => (s.match(/[^.!?]+[.!?]+/g) ?? [s]).slice(0, n).join(' ').trim();

// Migration fix: the rendered-page parser captured the old site's related-links strip (other case-study
// titles) at the end of some sections. Strip any trailing run of known case-study titles.
// Longest titles first, so a long title is never partially stripped by a shorter one that it ends with.
const allTitles = (raw as any[]).map((r) => normalizeText(r.title)).sort((a, b) => b.length - a.length);
// Repeatedly remove any known title from the end of the text until nothing more matches.
const stripTitles = (v: string) => {
  let out = v.trim(), changed = true;
  while (changed) { changed = false; for (const t of allTitles) if (out.endsWith(t)) { out = out.slice(0, -t.length).trim(); changed = true; } }
  return out;
};

/** All case studies, mapped from the snapshot and sorted newest first by date. */
export const caseStudies: CaseStudy[] = (raw as any[])
  .map((r) => {
    const slug = publicSlug(r.slug);
    const renamed = slug !== r.slug;
    const c = curated[slug];
    // Live source URL (evidence). Renamed records do not render their legacy URL (it contains a client product name);
    // the legacy URL is kept only in redirects.json and docs/06.
    const url = renamed ? undefined : `https://qualityworkscg.com/case-study/${r.slug}/`;
    // Apply logged corrections for this record and field (keyed by public slug); throws if one no longer matches.
    const fix = (field: string, v: string) => applyCorrections(`case-study:${slug}`, field, v ?? '');
    return {
      id: `cs-${slug}`,
      slug,
      title: r.title,
      client: c.client,
      // Unknown for every record until each client's disclosure approval is confirmed (docs/04 §4).
      clientDisclosureApproved: null,
      industry: c.industry,
      serviceTags: c.serviceTags,
      // Corrected WordPress excerpt; if empty, the first sentence of the challenge.
      summary: normalizeText(fix('excerpt', r.excerpt)) || firstSentences(clean(r.challenge), 1),
      customer: fix('customer', clean(r.customer)),
      challenge: fix('challenge', clean(r.challenge)),
      contribution: c.contribution,
      approach: fix('approach', stripTitles(clean(r.approach))),
      outcome: fix('outcome', stripTitles(clean(r.outcome))),
      metrics: c.metrics.map((x) => ({ ...x, metricSource: url ?? 'Published QualityWorks case study (legacy URL recorded in the redirect map, docs/06)' })),
      date: r.date,
      image: localMedia(r.image),
      altText: caseStudyAlt[slug] ?? r.alt ?? '',
      relatedSolution: c.relatedSolution,
      // Same closing CTA on every case study.
      cta: { label: 'Discuss a similar challenge', href: '/contact-us/' },
      provenance: { source: 'wordpress-migrated' as const, approval: 'published-live' as const, sourceUrl: url, retrievedAt: '2026-11-17', note: renamed ? 'Renamed to a neutral slug (review round 2); client and product not disclosed. Client disclosure approval not verified.' : 'Client disclosure approval not verified.' },
    } satisfies CaseStudy;
  })
  .sort((a, b) => b.date.localeCompare(a.date));

/** Find a case study by PUBLIC slug; undefined when not found. */
export const caseStudyBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug);
