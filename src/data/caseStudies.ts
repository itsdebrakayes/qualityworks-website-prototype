import raw from './migrated/case-studies.wp-snapshot.json';
import type { CaseStudy } from './types';
import { localMedia } from '../lib/media';
import { normalizeText } from '../lib/glyphs';
import { applyCorrections } from './corrections';
import { caseStudyAlt } from './altText';

/**
 * Case studies = WordPress snapshot (parsed from rendered public pages; Beaver Builder stores
 * the body outside `content.rendered`) + curated taxonomy below.
 *
 * Client names are shown because they are published on the live site today, but
 * `clientDisclosureApproved` is `null` (unknown) for every record: disclosure approval must be
 * confirmed per client before the rebuild launches.
 * Metrics are quoted exactly as published; `context` records what is (not) known about measurement.
 */
type Curated = Pick<CaseStudy, 'client' | 'industry' | 'serviceTags' | 'relatedSolution' | 'metrics'> & { contribution: string };

const m = (value: string, label: string, context: string) => ({ value, label, context });

const curated: Record<string, Curated> = {
  'ai-powered-test-case-generation-wssc': { client: 'Washington Suburban Sanitary Commission (WSSC)', industry: 'public-sector', serviceTags: ['test-automation', 'ai-service'], relatedSolution: 'qualitywatcher-ai-tools', contribution: 'Piloted AI-powered test case generation with the WSSC QA team.', metrics: [] /* R-25–R-27: figures removed pending the WSSC pilot report */ },
  'accelerating-confidence-qa-modernization-for-wisyncos-digital-ecosystem': { client: 'Wisynco Group Limited', industry: 'retail', serviceTags: ['test-automation', 'full-stack-testing'], relatedSolution: 'test-automation', contribution: 'QA modernization and automation across D365 ERP, CRM and supply chain systems.', metrics: [m('94.5%', 'Core D365 workflows automated', 'Against an original target; see source.'), m('100%', 'Functional CRM test coverage', 'As published.'), m('100%', 'QA team trained on automation', 'As published.')] },
  'ipipelines-legacy-platform-modernization': { client: 'Financial technology firm (name not approved for disclosure)', industry: 'finance-banking', serviceTags: ['test-automation', 'api-cloud-services-testing'], relatedSolution: 'test-automation', contribution: 'Established QA practices and automation for a legacy platform modernization over 8 months.', metrics: [m('90%+', 'Automation coverage', 'As published.'), m('80%+', 'Reduction in manual tester hours', 'As published.')] },
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

const clean = (s?: string) => normalizeText(s ?? '').replace(/\s*Want to work with us\?[\s\S]*$/, '').replace(/^\s*–?\s*Case Study\s*–\s*/, '').replace(/\s+/g, ' ').trim();
const firstSentences = (s: string, n = 2) => (s.match(/[^.!?]+[.!?]+/g) ?? [s]).slice(0, n).join(' ').trim();

export const caseStudies: CaseStudy[] = (raw as any[])
  .map((r) => {
    const c = curated[r.slug];
    const url = `https://qualityworkscg.com/case-study/${r.slug}/`; // live source URL (evidence)
    const fix = (field: string, v: string) => applyCorrections(`case-study:${r.slug}`, field, v ?? '');
    return {
      id: `cs-${r.slug}`,
      slug: r.slug,
      title: r.title,
      client: c.client,
      clientDisclosureApproved: null,
      industry: c.industry,
      serviceTags: c.serviceTags,
      summary: normalizeText(fix('excerpt', r.excerpt)) || firstSentences(clean(r.challenge), 1),
      customer: fix('customer', clean(r.customer)),
      challenge: fix('challenge', clean(r.challenge)),
      contribution: c.contribution,
      approach: fix('approach', clean(r.approach)),
      outcome: fix('outcome', clean(r.outcome)),
      metrics: c.metrics.map((x) => ({ ...x, metricSource: url })),
      date: r.date,
      image: localMedia(r.image),
      altText: caseStudyAlt[r.slug] ?? r.alt ?? '',
      relatedSolution: c.relatedSolution,
      cta: { label: 'Discuss a similar challenge', href: '/contact-us/' },
      provenance: { source: 'wordpress-migrated' as const, approval: 'published-live' as const, sourceUrl: url, retrievedAt: '2026-11-17', note: 'Client disclosure approval not verified.' },
    } satisfies CaseStudy;
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export const caseStudyBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug);
