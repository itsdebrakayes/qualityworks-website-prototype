/**
 * CROSS-REFERENCE INTEGRITY CHECK: fails the build when a data record points at a slug that does
 * not exist.
 *
 * WHY: templates resolve related records with `.map(bySlug).filter(Boolean)`, which silently drops an
 *   unknown slug. A typo (or a renamed slug, see src/data/redirects.json) would make a related card
 *   vanish without any warning. This module turns that silent drop into a build error that names the
 *   record, the field and the bad slug (docs/04-content-schemas.md §1).
 *
 * HOW IT RUNS: the check executes once when this module is first imported. BaseLayout imports it, so
 *   every `npm run build` / `npm run dev` page render triggers it before any HTML is written.
 *
 * HOW TO EXTEND: when you add a new field that holds slugs of another collection, add one `check()`
 *   line below for it.
 */
import { services } from './services';
import { industries } from './industries';
import { caseStudies } from './caseStudies';
import { products } from './products';

const serviceSlugs = new Set(services.map((s) => s.slug));
const industrySlugs = new Set(industries.map((i) => i.slug));
const caseSlugs = new Set(caseStudies.map((c) => c.slug));
const productSlugs = new Set(products.map((p) => p.slug));

const problems: string[] = [];
/** Record every slug in `slugs` that is missing from `known`. */
const check = (owner: string, field: string, slugs: readonly string[] | undefined, known: Set<string>) => {
  for (const slug of slugs ?? []) if (!known.has(slug)) problems.push(`${owner} → ${field}: unknown slug "${slug}"`);
};

for (const s of services) {
  check(`service:${s.slug}`, 'relatedCaseStudies', s.relatedCaseStudies, caseSlugs);
  check(`service:${s.slug}`, 'relatedProducts', s.relatedProducts, productSlugs);
  check(`service:${s.slug}`, 'relatedIndustries', s.relatedIndustries, industrySlugs);
}
for (const i of industries) {
  check(`industry:${i.slug}`, 'capabilities', i.capabilities, serviceSlugs);
  check(`industry:${i.slug}`, 'products', i.products, productSlugs);
  check(`industry:${i.slug}`, 'caseStudies', i.caseStudies, caseSlugs);
}
for (const c of caseStudies) {
  check(`case-study:${c.slug}`, 'industry', [c.industry], industrySlugs);
  check(`case-study:${c.slug}`, 'serviceTags', c.serviceTags, serviceSlugs);
}

if (problems.length) {
  throw new Error(`Data integrity check failed (src/data/integrity.ts):\n  - ${problems.join('\n  - ')}`);
}

/** Exported so importing modules can reference it; true whenever the build got this far. */
export const integrityChecked = true;
