/**
 * Content schemas for the QualityWorks prototype (QM-113).
 * Every record carries `provenance` so reviewers and developers can see where it came from
 * and whether it is approved. See docs/04-content-schemas.md for validation rules.
 *
 * WHAT THIS FILE IS
 *   The content model of the whole site, as TypeScript types only (no runtime code). Every data
 *   module in src/data/ is typed by one of these interfaces, and components/pages import them for
 *   their props. Start here to understand the data; docs/04-content-schemas.md explains the
 *   reasoning, the required fields and the production-ownership recommendation (CMS / external
 *   API / repo) for each type.
 *
 * WHY IT EXISTS
 *   CONTRIBUTING.md rule 2: "content is data, not markup". Pages only arrange typed records, and the
 *   schemas are deliberately CMS-agnostic so they can later map onto whichever headless CMS is
 *   chosen (open question Q-04 in docs/04).
 *
 * USED BY
 *   - Data modules: services.ts, products.ts, industries.ts, caseStudies.ts, articles.ts, events.ts,
 *     jobs.ts, team.ts, claims.ts, navigation.ts, site.ts, testimonials.ts.
 *   - Components and pages that type their props with these interfaces (e.g. Button, PageHero,
 *     ServiceCard, ProductCard, CaseStudyCard, ArticleCard, EventCard, FaqAccordion, BaseLayout,
 *     ServiceTemplate, the [slug] routes) and src/lib/schema.ts (Article, FaqItem).
 *
 * HOW TO EXTEND
 *   - Adding an optional field is safe: existing records keep compiling. Document it here with a
 *     doc comment (like every field below) and add a row to docs/04-content-schemas.md.
 *   - Adding a REQUIRED field breaks every record of that type until each one supplies a value. Do
 *     that only when you are ready to fill (or explicitly mark as proposed/fixture) every record.
 *   - Adding a value to a string-union (e.g. a new `ApprovalState`) also needs every `switch`/lookup
 *     that maps those values (badges, labels, release filters) to handle it.
 *
 * GOTCHAS
 *   - Types are erased at build time. Nothing here validates data at runtime: rules such as
 *     "≤ 140 chars" or "must reference an existing slug" are conventions checked by review and QA,
 *     not by the compiler. Unknown related slugs are silently dropped by the templates
 *     (`.map(bySlug).filter(Boolean)`), so check spelling.
 *   - `approval: 'approved'` must only be set when the content owner has actually approved the
 *     record. Approval comes from people (see CONTRIBUTING.md §5), never from code.
 */

/**
 * Where a record's content came from. Drives review labels and release filtering.
 * One value per record; pick the most specific one that is true.
 */
export type SourceSystem =
  | 'wordpress-migrated'   // pulled from the live WordPress site (REST API or rendered page)
  | 'live-site-copy'       // copied verbatim/near-verbatim from a live page, structured by hand
  | 'external-platform'    // owned by another approved platform (BambooHR, Agents marketplace, QualityWatcher)
  | 'structured-code'      // maintained as code/content in the repo (navigation, CTAs)
  | 'proposed-copy'        // new copy written for the prototype; needs content-owner approval
  | 'fixture';             // illustrative/fictional record for interaction demos only

/**
 * Publication / sign-off state of a record.
 * `fixture` records are filtered out of release builds (see events.ts and articles.ts, which use
 * RELEASE from src/lib/release.ts); `not-verified` events are also dropped from release builds.
 * ArticleCard, EventCard and the event detail page check `approval === 'fixture'` to show a
 * FixtureLabel and to suppress structured data.
 */
export type ApprovalState =
  | 'published-live'       // visible on the current public site; re-approval needed before reuse
  | 'pending-approval'     // proposed; awaiting stakeholder sign-off
  | 'approved'             // explicitly approved (none yet in this prototype)
  | 'fixture'              // fictional; must never be released
  | 'not-verified';        // could not be confirmed (e.g. source inaccessible)

/**
 * Traceability block carried by every content record (and optionally by individual FAQ items).
 * Shown to reviewers as `data-review-note` annotations in review builds (e.g. FaqAccordion,
 * ProofBlock) and used by release filters. Helper factories that build it consistently live in the
 * data modules (`live()`, `proposed()`, `observed()`, `p()`).
 */
export interface Provenance {
  /** Required. Origin of the content; see `SourceSystem` for the allowed values. */
  source: SourceSystem;
  /** Required. Sign-off state; see `ApprovalState`. Use 'fixture' together with source 'fixture'. */
  approval: ApprovalState;
  /**
   * Optional. Absolute URL of the page or API the content was taken from (the evidence).
   * Omit for fixtures, and for renamed case studies whose legacy URL must not be rendered.
   */
  sourceUrl?: string;
  /** Optional. Date the source was read, as an ISO date string `YYYY-MM-DD`. */
  retrievedAt?: string;    // ISO date
  /**
   * Optional. Free-text reviewer note: what is unverified, what must happen before launch, or why
   * the record differs from the source. Some templates render it (e.g. ServiceTemplate shows it on
   * `contentDepth: 'summary'` pages), so write it as a complete, neutral sentence.
   */
  note?: string;
}

/**
 * Page-level SEO metadata consumed by BaseLayout.astro (<title>, meta description, robots, OG image).
 * QA-05 fails if two pages share a title or a description.
 */
export interface Seo {
  /** Required. Unique page <title>; aim for 60 characters or fewer, ending "| QualityWorks". */
  title: string;           // unique <title>, ≤ 60 chars preferred
  /** Required. Unique meta description; aim for 120–160 characters, answer-first. */
  description: string;     // meta description, 120–160 chars preferred
  /**
   * Optional. `true` asks for `noindex, follow` in release builds. Review builds are always
   * `noindex, nofollow` regardless of this flag (BaseLayout checks REVIEW first).
   */
  noindex?: boolean;
  /** Optional. Root-relative or absolute image path for Open Graph; BaseLayout falls back to the logo. */
  ogImage?: string;
}

/**
 * A call to action (button or link). Rendered by Button.astro and PageHero; shared global CTAs live
 * in site.ts (`ctas`) so labels and destinations stay consistent.
 */
export interface Cta {
  /** Required. Visible button text. Verb-first, specific ("Talk to an automation expert"). */
  label: string;
  /** Required. Internal root-relative route with trailing slash, or an absolute URL when `external`. */
  href: string;
  /**
   * Optional. `true` when the CTA leaves the corporate site. Button.astro then opens a new tab,
   * adds rel=noopener and an external marker. Pair with `handoffNote`.
   */
  external?: boolean;      // opens a different site/platform: shown with an external marker
  /** Optional. Visual variant: 'primary' (default in Button), 'secondary' (outline) or 'ghost' (text). */
  kind?: 'primary' | 'secondary' | 'ghost';
  /**
   * Optional. Screen-reader description of where an external CTA leads; Button.astro renders it as
   * visually hidden text linked with aria-describedby. Only used when `external` is true.
   */
  handoffNote?: string;    // accessible description of where an external CTA leads
}

/**
 * One link inside a navigation group (desktop mega-menu, mobile drawer and footer all render it).
 * Defined only in src/data/navigation.ts.
 */
export interface NavLink {
  /** Required. Link text as shown in menus. */
  label: string;
  /** Required. Root-relative route with trailing slash, or an absolute URL for external platforms. */
  href: string;
  /** Optional. One-line helper text shown under the label in the desktop mega-menu. */
  description?: string;
  /** Optional. `true` for links to other sites (QualityWatcher, Posture, Clutch); excluded from active-state matching. */
  external?: boolean;
  /**
   * Optional. 'live' (default meaning) = in the current live navigation; 'proposed' = not in the
   * live navigation and awaiting QM-41 sitemap confirmation. Header.astro shows a gold dot for
   * proposed links in review mode only.
   */
  status?: 'live' | 'proposed';   // proposed = not in the current live navigation
}
/**
 * A titled column of links inside a mega-menu panel.
 * Fields: `heading` (required; Service.group values must match one of these headings),
 * `href` (optional overview link for the heading), `links` (required, at least one NavLink).
 */
export interface NavGroup { heading: string; href?: string; links: NavLink[] }
/** A top-level navigation category (Solutions, Products & Innovations, Who We Help, …). */
export interface NavItem {
  /** Required. Stable machine id ('solutions', 'products', …); used for menu ids, footer columns and active-state rules. */
  id: string;
  /** Required. Top-level menu label. */
  label: string;
  /** Optional. Overview page for the category (e.g. /services/); counted by isActive() in navigation.ts. */
  href?: string;                  // overview page, if one exists
  /** Optional. Link columns shown in the mega-menu panel. */
  groups?: NavGroup[];
  /**
   * Optional. Promotional tile in the mega-menu panel: `eyebrow` (small label), `title`, `text`
   * (one or two sentences) and a `cta` (see Cta). All four sub-fields are required when present.
   */
  feature?: { eyebrow: string; title: string; text: string; cta: Cta };
}

/**
 * An entry in the claims register (src/data/claims.ts): any number, award, certification or
 * comparative statement shown on the site. StatBlock throws at build time if a stat references no
 * claim, and ClaimRef throws on an unknown id. Release builds drop StatBlock stats whose claim has
 * any `verification` value.
 */
export interface Claim {
  /** Required. Register id in the form `CNN` (e.g. 'C17'). Never reuse or renumber an id. */
  id: string;
  /** Required. The claim exactly as it is displayed on the page. */
  statement: string;          // as displayed
  /** Required. Short display value ('16+', '80%', 'Award', 'Certification'). */
  value: string;
  /** Required. Measurement context: who/what/when, sample and baseline, or what is NOT known. */
  context: string;            // measurement context (who/what/when)
  /** Required. Absolute URL where the claim was found. */
  sourceUrl: string;
  /** Required. The exact wording found at the source, quoted, so reviewers can compare. */
  evidence: string;           // exact wording found at source
  /** Required. Sign-off state; currently 'published-live' for every claim (found on the live site, not yet re-approved). */
  approval: ApprovalState;
  /** Explicit verification status: 'required-before-launch' claims must not be presented as verified. */
  verification?: 'required-before-launch' | 'source-checked' | 'wording-approval-needed';
  /** Optional. Person or role responsible for confirming the claim. */
  owner?: string;
}

/**
 * The three buyer pathways used on the homepage and to group services:
 * 'quality' (software quality / testing), 'build' (custom software) and 'ai' (AI & agents).
 * The pathway cards themselves are defined in services.ts (`pathways`).
 */
export type Pathway = 'quality' | 'build' | 'ai';

/**
 * One question/answer pair rendered by FaqAccordion. Fields: `q` (required, the question),
 * `a` (required, a factual plain-text answer: it is also emitted as FAQPage JSON-LD by faqLd() in
 * src/lib/schema.ts) and `provenance` (optional; recommended, because FAQ answers are often
 * proposed copy that needs approval).
 */
export interface FaqItem { q: string; a: string; provenance?: Provenance }

/**
 * A service, engagement model, assessment or program page (src/data/services.ts).
 * Rendered by components/templates/ServiceTemplate.astro; listed on /services/ and the homepage.
 * Field rules are in docs/04-content-schemas.md §1.
 */
export interface Service {
  /** Required. URL-safe id, unique across services; used by serviceBySlug() and as a related-service reference. */
  slug: string;
  /** Required. Public route with trailing slash. Must equal the legacy WordPress URL where one exists (SEO continuity). */
  path: string;               // preserved legacy URL where one exists
  /** Required. Display name used in cards, menus and breadcrumbs. */
  name: string;
  /** Required. Offering type; ServiceCard words its link "Explore model" for 'engagement-model', "Explore service" otherwise. */
  kind: 'service' | 'engagement-model' | 'assessment' | 'program';
  /** Required. Buyer pathway the service belongs to (homepage grouping). */
  pathway: Pathway;
  /** Required. Mega-menu group heading this service sits under; must match a NavGroup heading in navigation.ts exactly. */
  group: string;              // solutions mega-menu group
  /** Required. Card text; answer-first, at most about 140 characters. */
  cardSummary: string;
  /** Required. The buyer's problem in one sentence (at most about 100 characters). */
  buyerProblem: string;
  /** Required. Page <h1>. */
  heroTitle: string;
  /** Required. Lead paragraph under the hero title. */
  heroLede: string;
  /** Required. Main CTA; an internal route, or `external: true` plus a `handoffNote`. */
  primaryCta: Cta;
  /** Optional. Second hero CTA (typically a related case study). */
  secondaryCta?: Cta;
  /** Optional. Longer description of the challenge the service addresses. */
  challenge?: string;
  /** Required, at least one entry. What the service includes: each item has a `title` and a `text`. */
  capabilities: { title: string; text: string }[];
  /** Optional. Delivery steps, each with `title` and `text` (rendered by ProcessSteps). */
  process?: { title: string; text: string }[];
  /** Optional. Audience-specific notes, each with `audience` (e.g. 'Engineering leaders') and `text`. Usually proposed copy. */
  considerations?: { audience: string; text: string }[];
  /** Optional. Case study public slugs (see caseStudies.ts). Unknown slugs are silently skipped. */
  relatedCaseStudies?: string[];   // case study slugs
  /** Optional. Product slugs (see products.ts). Unknown slugs are silently skipped. */
  relatedProducts?: string[];      // product slugs
  /** Optional. Industry slugs (see industries.ts). Unknown slugs are silently skipped. */
  relatedIndustries?: string[];
  /** Optional. FAQ items; FAQPage structured data is emitted only because they are shown visibly on the page. */
  faqs?: FaqItem[];
  /** Optional. Claim ids from claims.ts shown on the page as ClaimRef annotations. Unknown ids fail the build. */
  claims?: string[];               // claim ids shown on the page
  /** Required. Icon name from components/Icon.astro (e.g. 'automation', 'layers', 'gauge'). */
  icon: string;
  /** Required. Target personas (from docs/03-page-map-personas.md); shown as "Best for" on the page. */
  personas: { primary: string; secondary: string };
  /** Required. Unique title/description for the page. */
  seo: Seo;
  /**
   * Required. 'full' = structured copy is complete; 'summary' = only a summary was structured, and
   * the template shows a visible migration notice. Summary records are excluded from
   * "related services" and homepage pathway lists.
   */
  contentDepth: 'full' | 'summary';
  /** Required. Where the copy came from and its approval state. */
  provenance: Provenance;
}

/**
 * A product or framework (src/data/products.ts), shown on /products/ and as ProductCard elsewhere.
 * Rules: docs/04-content-schemas.md §2.
 */
export interface Product {
  /** Required. Unique id used by productBySlug() and `relatedProducts` / `products` references. */
  slug: string;
  /** Required. Internal route, or the external URL when the product has no page on this site. */
  path: string;
  /** Required. Display name (keep trademark symbols such as ™ where the brand uses them). */
  name: string;
  /** Required. Short positioning line for cards. */
  tagline: string;
  /** Required. One to three sentences describing what it does and where it lives. */
  summary: string;
  /** Required. 'internal-page' (has a page here), 'external-platform' (lives on another site) or 'framework' (a method, not software). */
  kind: 'internal-page' | 'external-platform' | 'framework';
  /** Required. Availability as shown by the ProductCard status badge. */
  status: 'available' | 'external' | 'information-only' | 'awaiting-product-owner';
  /** Optional. The product's own site, when it has one. */
  externalUrl?: string;
  /** Required. Card accent colour key; ProductCard maps it to a `product-card--{accent}` class (e.g. 'teal', 'green', 'gold', 'slate'). */
  accent: string;
  /** Required. Source and approval state. */
  provenance: Provenance;
}

/**
 * One QualityWatcher AI tool card (products.ts `qwTools`), shown on /qualitywatcher-ai-tools/.
 * Rule (docs/04 §2): a tool whose status is not 'available' or 'requires-sign-in' renders no CTA.
 */
export interface QwTool {
  /** Required. Stable id (kebab-case). */
  id: string;
  /** Required. Tool name as published. */
  name: string;
  /** Required. What the tool does, as published. */
  description: string;
  /** Required. CTA text as published on the live site. */
  ctaLabel: string;
  /** Required. Absolute URL the live CTA points to. */
  ctaHref: string;
  /** Required. What happened when the CTA was probed: sign-in wall, HTTP 404, open, or not checked. */
  observedStatus: 'requires-sign-in' | 'not-found-404' | 'available' | 'not-verified';
  /** Required. ISO date of the probe. Must be re-confirmed by the product owner before launch. */
  observedAt: string;
  /** Required. Source and approval state. */
  provenance: Provenance;
}

/**
 * A public agent record from the Agents as a Service marketplace (products.ts `agentSnapshot`).
 * The marketplace is the source of truth; see docs/04 §3. Values are never invented: unknown data
 * stays empty / 'unknown' / null.
 */
export interface AgentRecord {
  /** Required. Stable id (kebab-case, persona name + role). */
  id: string;
  /** Required. Persona name used in the marketplace ("Kai", "Nia", …). */
  name: string;              // persona name used in the marketplace
  /** Required. Role title as published ("AI Receptionist"). */
  role: string;
  /** Required. Marketplace department/category the agent is listed under. */
  category: string;
  /** Required. One-sentence description as published. */
  description: string;
  /** Required. Business function used for grouping (currently the same value as `category`). */
  businessFunction: string;
  /** Required. Availability label as published; 'unknown' when the card does not say. */
  availabilityStatus: 'ready-now' | 'quick-launch' | 'custom-build' | 'unknown';
  /** Required. Tool integrations. Empty because the public catalog does not publish them: do not invent. */
  integrations: string[];
  /** Required. Billing interval as published, or 'unknown'. */
  pricingInterval: 'monthly' | 'annual' | 'unknown';
  /** Required. Published price, or null if not shown. Stored for traceability but deliberately NOT displayed. */
  price: number | null;
  /** Required. One-off setup fee, or null when the card does not show one (shown only for packages). */
  setupFee: number | null;
  /** Required. CTA text; links out to the marketplace. */
  ctaLabel: string;
  /** Required. CTA URL; per docs/04 it must be on agents.qualityworkscg.com. */
  ctaDestination: string;
  /** Required. ISO date the record was observed. docs/04 proposes hiding records older than 7 days in production; the prototype does not enforce this. */
  lastUpdated: string;
  /** Required. Source and approval state. */
  provenance: Provenance;
}

/**
 * A client case study (src/data/caseStudies.ts): WordPress snapshot text plus curated taxonomy.
 * Rules: docs/04-content-schemas.md §4 (client disclosure and metric context).
 */
export interface CaseStudy {
  /** Required. `cs-{slug}`. */
  id: string;
  /** Required. PUBLIC slug (after neutral renames from redirects.json); the route is /case-studies/{slug}/. */
  slug: string;
  /** Required. Title as published. */
  title: string;
  /** Required. Client name as published, or a neutral descriptor when the name must not be disclosed. */
  client: string;
  /**
   * Required. true = client approved naming; false = must be anonymised; null = unknown (not verified).
   * Every prototype record is null; production must show an anonymised descriptor unless this is true.
   */
  clientDisclosureApproved: boolean | null;   // null = unknown (not verified)
  /** Required. Industry slug from industries.ts (drives the industry filter and card label). */
  industry: string;                            // industry slug
  /** Required. Service slugs from services.ts (drives the service filter). */
  serviceTags: string[];                       // service slugs
  /** Required. One- or two-sentence card summary. */
  summary: string;
  /** Optional. "About the client" section text. */
  customer?: string;
  /** Required. The client's challenge. */
  challenge: string;
  /** Required. One sentence: what QualityWorks contributed (curated, not migrated). */
  contribution: string;
  /** Required. How the work was done. */
  approach: string;
  /** Required. Results as published. */
  outcome: string;
  /**
   * Required (may be empty). Headline metrics. Each needs `value`, `label`, `metricSource` (URL or
   * document reference) and `context` (what is known about measurement; say "baseline not stated"
   * when it is not).
   */
  metrics: { value: string; label: string; metricSource: string; context: string }[];
  /** Required. Publication date (ISO `YYYY-MM-DD`); list pages sort newest first. */
  date: string;
  /** Required. Local mirrored image path (/media/…), the original URL, or null when there is none. */
  image: string | null;
  /** Required. Alt text describing the image (from altText.ts); empty only if the image is decorative. */
  altText: string;
  /** Required. Slug of the service or product page offered as the next step. */
  relatedSolution: string;
  /** Required. Closing call to action. */
  cta: Cta;
  /** Required. Source and approval state. */
  provenance: Provenance;
}

/**
 * A resource: migrated blog/news post or a fixture resource card (src/data/articles.ts).
 * Rules: docs/04-content-schemas.md §5.
 */
export interface Article {
  /** Required. `wp-post-{id}` for migrated posts, `fixture-…` for fixtures. */
  id: string;
  /** Required. URL slug; migrated posts keep their WordPress slug and are served at /{slug}/. */
  slug: string;
  /** Required. Headline (after corrections and glyph normalisation). */
  title: string;
  /** Required. Resource type; drives labels, filters and the schema.org type (NewsArticle vs BlogPosting). */
  type: 'blog' | 'whitepaper' | 'guide' | 'news' | 'event-recap';
  /** Required. Author display name. */
  author: string;
  /** Required. ISO date `YYYY-MM-DD`; lists sort by it, newest first. */
  publishedAt: string;
  /** Required. ISO date of last modification (used as dateModified in JSON-LD). */
  updatedAt: string;
  /** Required. Card/listing summary. */
  excerpt: string;
  /** Required. Yoast meta description from WordPress, or null when none was set. */
  metaDescription: string | null;
  /** Required (may be empty). WordPress category names; 'News' marks a post as type 'news'. */
  categories: string[];
  /** Required (may be empty). WordPress tag names (used by the topic filter). */
  tags: string[];
  /** Required. Local mirrored image path, original URL, or null. */
  image: string | null;
  /** Required. Alt text for `image` (empty string when there is no image). */
  imageAlt: string;
  /** Optional. Sanitised article body HTML (migrated posts only). Rendered with set:html. */
  bodyHtml?: string;
  /** Optional. Destination for non-article resources (e.g. a whitepaper card linking to a product page). */
  href?: string;              // for non-article resources
  /** Required. Source and approval state ('fixture' records are excluded from release builds). */
  provenance: Provenance;
}

/**
 * An event or speaking engagement (src/data/events.ts). Its display phase (upcoming / past /
 * cancelled / date-tbc) is DERIVED from these fields by eventPhase(); never store it.
 * Rules: docs/04-content-schemas.md §6.
 */
export interface EventRecord {
  /** Required. Stable id. */
  id: string;
  /** Required. URL slug; the route is /events/{slug}/. */
  slug: string;
  /** Required. Event name; fixtures must start with "[Fixture]". */
  title: string;
  /** Required. One-sentence summary (also the page meta description, truncated to 155 characters). */
  summary: string;
  /** Required. ISO datetime WITH offset (e.g. '2026-10-12T08:00:00-07:00'), or '' when the date is not confirmed. */
  startDate: string;          // ISO datetime with offset
  /** Required. ISO datetime with offset, or '' when not confirmed. Past/upcoming is decided by this value. */
  endDate: string;
  /** Required. IANA time zone (e.g. 'America/Los_Angeles') used to format the displayed date. */
  timeZone: string;           // IANA
  /** Required. Attendance format. */
  venueType: 'in-person' | 'online' | 'hybrid';
  /** Optional. Venue or city. */
  venue?: string;
  /** Optional. Absolute registration URL. Only rendered while the event is upcoming. */
  registrationUrl?: string;
  /** Fixture events only: shows a disabled, labelled demo registration control instead of a link. */
  demoRegistration?: boolean;
  /** Required. Organiser status. 'cancelled' overrides the date-derived phase. */
  status: 'scheduled' | 'cancelled' | 'postponed';
  /** Optional. Image path. */
  featuredImage?: string;
  /** Optional. Alt text for `featuredImage` (required in practice whenever an image is set). */
  imageAlt?: string;
  /** Required. Body text for the event detail page. */
  description: string;
  /** Optional. Speaker name(s). */
  speaker?: string;
  /** Required. Source and approval state ('fixture' and 'not-verified' events are excluded from release builds). */
  provenance: Provenance;
}

/**
 * A job vacancy (src/data/jobs.ts). BambooHR is the source of truth; the corporate site never
 * collects résumés. Rules: docs/04-content-schemas.md §7.
 */
export interface Job {
  /** Required. Stable id. */
  id: string;
  /** Required. Job title; fixtures must start with "[Fixture]". */
  title: string;
  /** Required. Department / team name. */
  department: string;
  /** Required. Location text as published. */
  location: string;
  /** Required. Working arrangement. */
  workModel: 'remote' | 'hybrid' | 'on-site';
  /** Required. Free text as published ('Full-time', 'Contract', …). */
  employmentType: string;
  /** Required. ISO date posted. */
  postedAt: string;
  /** Optional. ISO date (YYYY-MM-DD) applications close; after the end of that day isExpired() hides the apply link. */
  closesAt?: string;
  /** Required. BambooHR hosted application URL (hand-off; never a form on this site). */
  applicationUrl: string;     // BambooHR hosted application
  /** Required. Source and approval state. */
  provenance: Provenance;
}

/**
 * A leadership/team profile (src/data/team.ts). Only profiles that are public on the live site are
 * included; others need approved bios and photos first.
 */
export interface Person {
  /** Required. Stable id (kebab-case name). */
  id: string;
  /** Required. Full name. */
  name: string;
  /** Required. Job title. */
  role: string;
  /** Required. Approved biography text. */
  bio: string;
  /** Optional. Root-relative photo path (under public/). */
  photo?: string;
  /** Optional. Alt text for `photo`; required in practice whenever a photo is set. */
  photoAlt?: string;
  /** Optional. Profile links, each with a `label` and an absolute `href`. */
  links?: { label: string; href: string }[];
  /** Required. Source and approval state. */
  provenance: Provenance;
}

/**
 * An industry or audience page (src/data/industries.ts), rendered by pages/industries/[slug].astro.
 */
export interface Industry {
  /** Required. URL-safe id; also used as `CaseStudy.industry`. */
  slug: string;
  /** Required. Route with trailing slash (/industries/{slug}/). */
  path: string;
  /** Required. Display name. */
  name: string;
  /**
   * Required. 'live' = page exists on the current site; 'proposed' = new page not in the live
   * navigation (needs QM-41 approval). Proposed pages show a "proposed page" label in review mode
   * and a release blocker in release builds.
   */
  status: 'live' | 'proposed';
  /** Required. Page <h1>. */
  heroTitle: string;
  /** Required. Lead paragraph; also shown on the /industries/ index. */
  heroLede: string;
  /** Required. The buyer's challenge in this sector. */
  buyerChallenge: string;
  /** Required (may be empty for summary records). Sector-specific considerations, each with `title` and `text`. */
  considerations: { title: string; text: string }[];
  /** Required. Service slugs shown as "Services that apply". Unknown slugs are silently skipped. */
  capabilities: string[];          // service slugs
  /** Optional. Product slugs shown as related products. */
  products?: string[];
  /** Required (may be empty). Case study public slugs shown as evidence. */
  caseStudies: string[];
  /** Optional. Note about supporting evidence (videos, competitions, …). Rendered visibly on the industry page, with a review annotation in review builds. */
  evidenceNote?: string;
  /** Required. Main CTA. */
  primaryCta: Cta;
  /** Required. Target personas (docs/03-page-map-personas.md). */
  personas: { primary: string; secondary: string };
  /** Required. Unique title/description. */
  seo: Seo;
  /** Required. 'summary' shows a visible migration notice (and a release blocker in release builds). */
  contentDepth: 'full' | 'summary';
  /** Required. Source and approval state. */
  provenance: Provenance;
}
