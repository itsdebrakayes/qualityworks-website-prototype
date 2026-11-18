# QualityWorks corporate website — QM-113 prototype (developer handoff)

Clickable, code-first prototype of the rebuilt **qualityworkscg.com** for Janique's review and later developer handoff.

> **Non-production.** No production deployment is authorised (QM-112 AC-HND-01, QM-103 §6). The default build is a **review build**: every page is `noindex`, forms simulate submission and send nothing, fictional records are labelled “Fixture”, and review tooling is switched on. A separate **release build** strips the review tooling and acts as a gate. It is designed to fail until the open items in `docs/12-release-cleanup.md` are closed.

## Repository and branch

| Item | Status |
|---|---|
| Repository | **https://github.com/itsdebrakayes/qualityworks-website-prototype** (private, personal account of the prototype author) |
| Branch | `main`: full commit history of the prototype |
| Review copy | Private Claude Artifact (link held by the project owner), built from `dist/` with relative links |
| Corporate repository | **Not yet established.** No QualityWorks organisation repository has been created or confirmed |

**Moving to a company repository later:**
1. Create an empty repository in the QualityWorks GitHub organisation (owner: technical lead, per QM-103 §2.1).
2. Either transfer this repository to the organisation (GitHub Settings → Transfer ownership), or push it: `git remote add company <company-repo-url> && git push company main`.
3. Protect `main`, require review, and add CI that runs `npm ci && npm run build && npm run check:terms` (and `npm run qa:checks` against a preview server).
4. Connect a preview host from the QM-103 shortlist (Netlify or Cloudflare Pages for this static build). Do not connect production DNS.

## Stack and architecture

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Astro 5.18.2**, static output (`output: 'static'`) | No server runtime. Every route is prebuilt HTML |
| Language | TypeScript (data, helpers), `.astro` components, plain CSS with custom properties | No CSS framework |
| Client JS | ≈10 KB of small modules: menus, filters, contact form, careers/agents toggles | Each page works without JavaScript except those interactions |
| Content | Typed TypeScript modules in `src/data/` + raw WordPress snapshots in `src/data/migrated/` | CMS-agnostic; see `docs/04-content-schemas.md` |
| Fonts | Red Hat Display / Red Hat Mono, self-hosted woff2 (OFL) | Matches the live site |
| Runtime deps | `astro` | |
| Dev deps | `axe-core@4.10` (QA only) | Playwright is used from the machine install, not package.json |
| Node | 20+ (built and tested on 22.23) | |

Framework choice is a prototype assumption (no approved framework existed). The components are framework-neutral HTML/CSS/JS and port to Next.js, Nuxt or a CMS theme.

## Local setup and commands

```bash
npm install
npm run dev               # http://localhost:4321 with live reload
npm run build             # REVIEW build to dist/ (+ glyph lint)
npm run preview           # serve dist/ on http://localhost:4321
npm run build:release     # RELEASE build to dist-release/ + release gate (currently fails by design)
npm run check:terms       # prohibited-terminology scan of dist/
npm run qa:checks         # Playwright + axe QA; writes qa-output/ and docs/07 (needs preview running)
node scripts/perf-local.mjs   # local performance smoke test (needs preview running)
npm run migrate:wordpress     # refresh article snapshot from the public WordPress REST API
./scripts/fetch-media.sh      # mirror + resize featured images into public/media/
```

### Build process
1. `astro build` renders every route in `src/pages/` from the data modules.
2. During the build, `src/data/corrections.ts` applies logged editorial corrections to migrated content. **The build fails if a correction no longer matches its source text.**
3. `scripts/glyph-lint.mjs` fails the build if any visible character falls outside the brand font's character set (it would render in a fallback font).

### Configuration
| Setting | Where | Effect |
|---|---|---|
| `QW_RELEASE=true` | env var (`build:release`) | Release mode: no prototype bar, claim annotations, proposed-page labels, fixtures, simulation controls, “Date to be confirmed” events, PRISM sample or unverified statistics. Robots switch from `noindex` to the production directive |
| `site`, `trailingSlash: 'always'` | `astro.config.mjs` | URL format matches WordPress |
| rehype external-link plugin | `astro.config.mjs` | Markdown docs open external links safely |
| Canonical origin | `src/data/site.ts` (`legacyOrigin`) | `https://qualityworkscg.com` |

## Routes

| Route | Template / file | Data |
|---|---|---|
| `/` | `pages/index.astro` | services pathways, products, case studies, articles, events, claims |
| `/services/`, `/services/{slug}/`, `/engagement-models/…`, `/maturity-assessments/`, `/innovation-tourism/` | `components/templates/ServiceTemplate.astro` | `data/services.ts` |
| `/products/`, `/qualitywatcher-ai-tools/`, `/products/agents-as-a-service/`, `/products/prism/` | product pages | `data/products.ts` |
| `/industries/`, `/industries/{slug}/` | `pages/industries/[slug].astro` | `data/industries.ts` |
| `/case-studies/`, `/case-studies/{slug}/` | list + detail | `data/caseStudies.ts` (legacy `/case-study/{slug}/` needs 301s, not configured) |
| `/resources/`, `/blog/`, `/{post-slug}/` | hub, blog list, article | `data/articles.ts` (root-level slugs preserved) |
| `/events/`, `/events/{slug}/` | list + detail | `data/events.ts` |
| `/about-us/`, `/careers/`, `/contact-us/`, `/privacy-policy/`, `/terms-conditions/`, `/thank-you/`, 404 | company pages | `data/site.ts`, `team.ts`, `jobs.ts` |
| `/prototype/…`, `/design-system/` | **review-only** (removed from release builds) | `docs/*.md`, tokens |

## Design system
- Tokens live in `src/styles/tokens.css` (single source; rendered live at `/design-system/`). This covers colour (logo teal `#289DAD`, interactive teal `#1B7480`, logo green `#8FC640`, ink/slate neutrals), type scale, spacing, radius, elevation, motion, and the surface themes `surface-dark`, `surface-product`, `surface-tint` and `surface-alt`.
- Shared grammar lives in `src/styles/global.css`: buttons, cards, badges, forms, prose and focus styles.
- Decisions and contrast ratios are in `docs/02-design-direction.md`.

## Reusable components (`src/components/`)
Header (mega-menu plus mobile drawer from `navigation.ts`), Footer, PageHero, Button, SectionHeading, ServiceCard, ProductCard, CaseStudyCard, ArticleCard, EventCard, StatBlock (refuses a stat without a claim), ClaimRef, ProofBlock, FaqAccordion, FilterBar (+ `lib/filters.ts`), EmptyState, Skeleton, Alert, ContactForm, CtaBand, Breadcrumbs, ProcessSteps, Wireframe, FixtureLabel, MetricValue, LegalStub, ProtoBar. The full inventory is at `/design-system/`.

## Fixtures and mock boundaries
| Fictional or simulated | Where | Release build |
|---|---|---|
| 3 fixture vacancies, BambooHR-unavailable state | `data/jobs.ts`, careers state control | removed |
| 2 fixture events (upcoming with demo registration, cancelled) | `data/events.ts` | removed |
| PRISM whitepaper card | `data/articles.ts` | removed |
| Contact submission outcome (success/error) | `ContactForm.astro` simulation control | removed; form shows an error, never a false success, until an endpoint exists |
| Case-study loading/error states | `/case-studies/` prototype control | removed |
| QualityWatcher interface preview | `/qualitywatcher-ai-tools/` | release blocker |

Real-data snapshots (not fictional, but not live): 12 WordPress posts, 17 case studies, an 8-agent marketplace snapshot, and BambooHR showing 0 open roles (17 Nov 2026).

## Review tooling (non-production)
- **Review hub** (`/prototype/`): journeys, interaction states, documents, claims register.
- **Review annotations** toggle (yellow bar): claim IDs (C01–C19), proposed nav items and provenance outlines.

Both are excluded from release builds, and `scripts/release-check.mjs` fails a release that still contains any of them. See `docs/12-release-cleanup.md`.

## Quality checks
| Script | What it proves |
|---|---|
| `glyph-lint.mjs` | Every visible character is covered by the brand font |
| `terminology-check.mjs` | No “autonomous”, “ship”, old award name or bracketed “&lt;beyond the code&gt;” on marketing pages |
| `qa-checks.mjs` | 37 browser checks: links, headings, overflow at 360/640/768/1024/1440, axe-core, fonts, menus, mobile drawer, forms, filters, events, careers |
| `release-check.mjs` | Release build contains no review markers and lists open release blockers |
| `perf-local.mjs` | Local LCP/CLS/transfer smoke test (not production data) |

## Known limitations
- No real integrations: HubSpot, BambooHR API, marketplace API, analytics and consent are **not implemented or tested** (see `docs/13-integrations-platform.md`).
- CMS not selected (WordPress vs headless, per QM-112 §2.6). Content is file-based.
- 12 of 99 blog posts migrated. 9 service pages and 5 industry pages are summary records. Site search and the maturity self-assessment tool are not rebuilt.
- QM-41 (approved sitemap) was not accessible. Navigation mirrors the live header plus proposed items.
- Screen-reader testing has not been performed. Accessibility results come from automated checks and manual visual review only.
