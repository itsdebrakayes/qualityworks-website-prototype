# QualityWorks corporate website — QM-113 prototype

A code-first, responsive, interactive prototype of the rebuilt **qualityworkscg.com**, for stakeholder review and developer handoff.

> **Not for deployment.** Every page is `noindex`. Forms simulate submission (no network calls). It contains no credentials and no customer data. Fictional records are labelled “Fixture”. Production hosting, CMS and integrations are open decisions (see `docs/09-open-questions.md`).

## Quick start

```bash
npm install
npm run dev          # http://localhost:4321  (live reload)
npm run build        # static site in dist/  (+ glyph lint)
npm run preview      # serve dist/ on http://localhost:4321
```

Requirements: Node 20+ (tested on Node 22).

### QA

```bash
npm run build && npx astro preview --port 4321 &
npm run qa:checks     # Playwright + axe-core; writes qa-output/ and docs/07-qa-testing-summary.md
```

QA uses the Playwright already installed on the machine (`require('playwright')`). `qa-output/evidence/` holds screenshots at 360/768/1024/1440 px for 16 key routes plus interaction-state captures.

### Refresh migrated content

```bash
npm run migrate:wordpress     # public WordPress REST API -> src/data/migrated/articles.wp-snapshot.json
./scripts/fetch-media.sh      # mirror + resize featured images into public/media/
```

## Where to start reviewing

Open **`/prototype/`** (the review hub). It links the six persona journeys, every interaction state, the documents and the claims register. Use **“Review annotations”** in the yellow prototype bar to show claim IDs, proposed navigation items (gold dots) and provenance outlines.

## Stack (assumption AS-3)

No approved framework or starter repository was found, so the prototype uses **Astro 5** (static output), **TypeScript data modules** and **plain CSS with custom properties**. Components are plain semantic HTML plus small vanilla JS modules (about 10 KB), so they port directly to Next.js, Nuxt, or a WordPress/headless CMS theme. Dependencies: `astro` (runtime) and `axe-core` (dev, QA only).

## Structure

```
src/
  styles/tokens.css        design tokens (single source; rendered at /design-system/)
  styles/global.css        base + shared component grammar (buttons, cards, forms, prose)
  fonts.css + public/fonts self-hosted Red Hat Display / Red Hat Mono (OFL)
  data/                    structured content, each record with provenance
    types.ts               schemas
    navigation.ts          ONE nav source -> header, mobile drawer, footer
    site.ts                company facts, global CTAs
    claims.ts              claims register (every number/award)
    services.ts industries.ts products.ts caseStudies.ts articles.ts events.ts jobs.ts team.ts testimonials.ts
    migrated/*.json        raw WordPress snapshots (unchanged for traceability)
  lib/                     schema.org helpers, filters controller, glyph normalisation, media mapping, docs loader
  components/              Header, Footer, PageHero, Button, cards, StatBlock, FaqAccordion, FilterBar,
                           ContactForm, Alert, EmptyState, Skeleton, Wireframe, FixtureLabel, …
  components/templates/    ServiceTemplate (all service / engagement / assessment pages)
  layouts/BaseLayout.astro SEO head, JSON-LD, skip link, prototype bar
  pages/                   routes mirror the live URLs (see docs/06-url-mapping.md)
docs/                      01 audit … 10 acceptance criteria (also rendered at /prototype/{doc}/)
scripts/                   migration, media, QA, report, glyph lint, audit crawl helpers (extract.py, cs.py, text.py)
```

## Documents

| # | Document |
|---|---|
| 01 | Site audit, sources, discrepancies, functionality that must not be lost |
| 02 | Design direction: old vs. new comparison, unified system, tokens, contrast |
| 03 | Page map (QM-112 categories), persona × page table, journeys |
| 04 | Content schemas, provenance, mock-data boundaries, glyph rules |
| 05 | SEO and AEO template requirements |
| 06 | URL mapping and redirects (42/42 page URLs unchanged) |
| 07 | QA testing summary (generated) + manual inspection log |
| 08 | Requirement-to-prototype traceability |
| 09 | Assumptions, prioritised open questions, production dependencies |
| 10 | Example developer acceptance criteria |

## Known limitations

QM-112, QM-41, QM-103 and QM-113 could not be accessed, so QM-112 AC IDs are blank. Twelve of the 99 blog posts are migrated. Nine service pages and five industry pages are summary records. Site search, the maturity self-assessment tool, consent/analytics and all real integrations (form/CRM, BambooHR API, marketplace API) are not implemented. Screen-reader testing has not been done.
