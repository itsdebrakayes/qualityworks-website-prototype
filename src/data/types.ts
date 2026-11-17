/**
 * Content schemas for the QualityWorks prototype (QM-113).
 * Every record carries `provenance` so reviewers and developers can see where it came from
 * and whether it is approved. See docs/04-content-schemas.md for validation rules.
 */

export type SourceSystem =
  | 'wordpress-migrated'   // pulled from the live WordPress site (REST API or rendered page)
  | 'live-site-copy'       // copied verbatim/near-verbatim from a live page, structured by hand
  | 'external-platform'    // owned by another approved platform (BambooHR, Agents marketplace, QualityWatcher)
  | 'structured-code'      // maintained as code/content in the repo (navigation, CTAs)
  | 'proposed-copy'        // new copy written for the prototype; needs content-owner approval
  | 'fixture';             // illustrative/fictional record for interaction demos only

export type ApprovalState =
  | 'published-live'       // visible on the current public site; re-approval needed before reuse
  | 'pending-approval'     // proposed; awaiting stakeholder sign-off
  | 'approved'             // explicitly approved (none yet in this prototype)
  | 'fixture'              // fictional; must never ship
  | 'not-verified';        // could not be confirmed (e.g. source inaccessible)

export interface Provenance {
  source: SourceSystem;
  approval: ApprovalState;
  sourceUrl?: string;
  retrievedAt?: string;    // ISO date
  note?: string;
}

export interface Seo {
  title: string;           // unique <title>, ≤ 60 chars preferred
  description: string;     // meta description, 120–160 chars preferred
  noindex?: boolean;
  ogImage?: string;
}

export interface Cta {
  label: string;
  href: string;
  external?: boolean;      // opens a different site/platform: shown with an external marker
  kind?: 'primary' | 'secondary' | 'ghost';
  handoffNote?: string;    // accessible description of where an external CTA leads
}

export interface NavLink {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
  status?: 'live' | 'proposed';   // proposed = not in the current live navigation
}
export interface NavGroup { heading: string; href?: string; links: NavLink[] }
export interface NavItem {
  id: string;
  label: string;
  href?: string;                  // overview page, if one exists
  groups?: NavGroup[];
  feature?: { eyebrow: string; title: string; text: string; cta: Cta };
}

export interface Claim {
  id: string;
  statement: string;          // as displayed
  value: string;
  context: string;            // measurement context (who/what/when)
  sourceUrl: string;
  evidence: string;           // exact wording found at source
  approval: ApprovalState;
  owner?: string;
}

export type Pathway = 'quality' | 'build' | 'ai';

export interface FaqItem { q: string; a: string; provenance?: Provenance }

export interface Service {
  slug: string;
  path: string;               // preserved legacy URL where one exists
  name: string;
  kind: 'service' | 'engagement-model' | 'assessment' | 'program';
  pathway: Pathway;
  group: string;              // solutions mega-menu group
  cardSummary: string;
  buyerProblem: string;
  heroTitle: string;
  heroLede: string;
  primaryCta: Cta;
  secondaryCta?: Cta;
  challenge?: string;
  capabilities: { title: string; text: string }[];
  process?: { title: string; text: string }[];
  considerations?: { audience: string; text: string }[];
  relatedCaseStudies?: string[];   // case study slugs
  relatedProducts?: string[];      // product slugs
  relatedIndustries?: string[];
  faqs?: FaqItem[];
  claims?: string[];               // claim ids shown on the page
  icon: string;
  personas: { primary: string; secondary: string };
  seo: Seo;
  contentDepth: 'full' | 'summary';
  provenance: Provenance;
}

export interface Product {
  slug: string;
  path: string;
  name: string;
  tagline: string;
  summary: string;
  kind: 'internal-page' | 'external-platform' | 'framework';
  status: 'available' | 'external' | 'information-only' | 'awaiting-product-owner';
  externalUrl?: string;
  accent: string;
  provenance: Provenance;
}

export interface QwTool {
  id: string;
  name: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  observedStatus: 'requires-sign-in' | 'not-found-404' | 'available' | 'not-verified';
  observedAt: string;
  provenance: Provenance;
}

export interface AgentRecord {
  id: string;
  name: string;              // persona name used in the marketplace
  role: string;
  category: string;
  description: string;
  businessFunction: string;
  availabilityStatus: 'ready-now' | 'quick-launch' | 'custom-build' | 'unknown';
  integrations: string[];
  pricingInterval: 'monthly' | 'annual' | 'unknown';
  price: number | null;
  setupFee: number | null;
  ctaLabel: string;
  ctaDestination: string;
  lastUpdated: string;
  provenance: Provenance;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  client: string;
  clientDisclosureApproved: boolean | null;   // null = unknown (not verified)
  industry: string;                            // industry slug
  serviceTags: string[];                       // service slugs
  summary: string;
  customer?: string;
  challenge: string;
  contribution: string;
  approach: string;
  outcome: string;
  metrics: { value: string; label: string; metricSource: string; context: string }[];
  date: string;
  image: string | null;
  altText: string;
  relatedSolution: string;
  cta: Cta;
  provenance: Provenance;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  type: 'blog' | 'whitepaper' | 'guide' | 'news' | 'event-recap';
  author: string;
  publishedAt: string;
  updatedAt: string;
  excerpt: string;
  metaDescription: string | null;
  categories: string[];
  tags: string[];
  image: string | null;
  imageAlt: string;
  bodyHtml?: string;
  href?: string;              // for non-article resources
  provenance: Provenance;
}

export interface EventRecord {
  id: string;
  slug: string;
  title: string;
  summary: string;
  startDate: string;          // ISO datetime with offset
  endDate: string;
  timeZone: string;           // IANA
  venueType: 'in-person' | 'online' | 'hybrid';
  venue?: string;
  registrationUrl?: string;
  status: 'scheduled' | 'cancelled' | 'postponed';
  featuredImage?: string;
  imageAlt?: string;
  description: string;
  speaker?: string;
  provenance: Provenance;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  workModel: 'remote' | 'hybrid' | 'on-site';
  employmentType: string;
  postedAt: string;
  closesAt?: string;
  applicationUrl: string;     // BambooHR hosted application
  provenance: Provenance;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo?: string;
  photoAlt?: string;
  links?: { label: string; href: string }[];
  provenance: Provenance;
}

export interface Industry {
  slug: string;
  path: string;
  name: string;
  status: 'live' | 'proposed';
  heroTitle: string;
  heroLede: string;
  buyerChallenge: string;
  considerations: { title: string; text: string }[];
  capabilities: string[];          // service slugs
  products?: string[];
  caseStudies: string[];
  evidenceNote?: string;
  primaryCta: Cta;
  personas: { primary: string; secondary: string };
  seo: Seo;
  contentDepth: 'full' | 'summary';
  provenance: Provenance;
}
