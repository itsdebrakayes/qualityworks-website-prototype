---
title: "04 · Content schemas and data boundaries"
summary: "Schemas, validation, publication state, source of truth and mock-data boundaries."
---

# Content schemas and data boundaries

TypeScript definitions: `src/data/types.ts`. Every record carries **`provenance { source, approval, sourceUrl, retrievedAt, note }`**.

| `source` | Meaning | Examples |
|---|---|---|
| `wordpress-migrated` | Pulled from WordPress (REST API or rendered page) | Articles, case studies |
| `live-site-copy` | Copied from a live page and structured by hand | Services, industries, testimonials |
| `external-platform` | Owned by another platform | Agent catalog, QualityWatcher tools, BambooHR |
| `structured-code` | Maintained in the repo | Navigation, global CTAs |
| `proposed-copy` | New prototype copy; needs approval | Buyer considerations, some FAQs, public-sector page |
| `fixture` | Fictional; for interaction demos only; **must never ship** | Fixture jobs, 2 fixture events, PRISM whitepaper card |

`approval` is one of `published-live` (on the live site today; needs re-approval) · `pending-approval` · `approved` (none yet) · `fixture` · `not-verified`.

**Recommended production ownership:** a headless CMS for services, industries, case studies, articles, events and leadership; external APIs for jobs (BambooHR) and the agent catalog (marketplace); repo for navigation, CTAs and the claims register. The CMS choice is open (Q-04). Schemas are CMS-agnostic.

## 1. Services (`Service`, `src/data/services.ts`)
| Field | Req. | Rules |
|---|---|---|
| `slug`, `path` | Yes | `path` must equal the legacy URL where one exists |
| `name`, `kind` (`service`/`engagement-model`/`assessment`/`program`), `pathway` (`quality`/`build`/`ai`), `group` | Yes | `group` must match a nav group heading |
| `cardSummary` (at most  140 chars), `buyerProblem` (at most  100), `heroTitle`, `heroLede` | Yes | Answer-first; no unverifiable superlatives |
| `primaryCta` | Yes | Internal route or `external:true` + `handoffNote` |
| `secondaryCta`, `challenge`, `process[]`, `considerations[]`, `faqs[]` | – | FAQ answers must be factual; FAQPage schema only when shown |
| `capabilities[]` | Yes | at least  1 |
| `relatedCaseStudies[]`, `relatedProducts[]`, `relatedIndustries[]` | – | Must reference existing slugs (build fails otherwise) |
| `claims[]` | – | Claim IDs from the register |
| `personas {primary, secondary}`, `seo {title, description}` | Yes | Unique title/description |
| `contentDepth` | Yes | `summary` triggers a visible migration notice |

## 2. Products (`Product`) and QualityWatcher tools (`QwTool`)
Product: `slug, path, name, tagline, summary, kind (internal-page/external-platform/framework), status (available/external/information-only/awaiting-product-owner), externalUrl, accent, provenance`.
QwTool: `id, name, description, ctaLabel, ctaHref, observedStatus (requires-sign-in/not-found-404/available/not-verified), observedAt, provenance`. **Rule:** a tool whose status is not `available` or `requires-sign-in` renders no CTA.

## 3. Agent catalog (`AgentRecord`) — source of truth: marketplace
`id, name, role, category, description, businessFunction, availabilityStatus (ready-now/quick-launch/custom-build/unknown), integrations[], pricingInterval, price, setupFee, ctaLabel, ctaDestination, lastUpdated, provenance`.
- The prototype holds an **8-record snapshot** of public records (17 Nov 2026). `integrations` are empty because the catalog does not publish them. Values are **not invented**.
- **Prices are stored but deliberately not displayed** on the corporate site. Two sources of price would drift. Production should either read an approved marketplace API at build time or link out (recommended).
- Validation: `ctaDestination` must be on `agents.qualityworkscg.com`; `lastUpdated` within 7 days or the record is hidden.

## 4. Case studies (`CaseStudy`)
`id, slug, title, client, clientDisclosureApproved (true/false/null), industry, serviceTags[], summary, customer, challenge, contribution, approach, outcome, metrics[{value, label, metricSource, context}], date, image, altText, relatedSolution, cta, provenance`.
- **Publication rule:** `clientDisclosureApproved !== true` means production shows an anonymised client name (“A US water utility”). In the prototype every record is `null` (unknown) and the detail page says so.
- **Metric rule:** every metric needs `metricSource` (URL or document) and `context`. Metrics without a baseline say “As published; baseline not stated”.
- Migration: the body is in Beaver Builder; parsed from rendered pages into `case-studies.wp-snapshot.json`; taxonomy curated in `caseStudies.ts`.

## 5. Articles (`Article`)
`id, slug, title, type (blog/whitepaper/guide/news/event-recap), author, publishedAt, updatedAt, excerpt, metaDescription, categories[], tags[], image, imageAlt, bodyHtml, href, provenance`.
- Source: WordPress REST API via `npm run migrate:wordpress`. Slugs are unchanged and served at `/{slug}/`.
- Sanitising: scripts, styles and inline attributes are removed; H1 is demoted to H2; iframes are replaced with a visible migration note; heading levels are normalised to avoid skips; external links get `target=_blank rel=noopener` plus an accessible notice. **Facts and wording are unchanged.**

## 6. Events (`EventRecord`)
`id, slug, title, summary, startDate, endDate (ISO + offset), timeZone (IANA), venueType (in-person/online/hybrid), venue, registrationUrl, status (scheduled/cancelled/postponed), featuredImage, imageAlt, description, speaker, provenance`.
- **Derived phase:** `cancelled` if status says so; `date-tbc` if dates are missing; otherwise `past` if `endDate < now`, else `upcoming`. Registration renders **only** for `upcoming`. Static builds must rebuild daily (or compute at request time) so an expired event never shows as open.

## 7. Jobs (`Job`) — source of truth: BambooHR
`id, title, department, location, workModel, employmentType, postedAt, closesAt, applicationUrl, provenance`.
- Observed `GET https://qualityworksconsulting.bamboohr.com/careers/list` returned `{"meta":{"totalCount":0}}`. The careers page defaults to that real state. Fixtures are behind a labelled control.
- States: available, none, expired (`closesAt` passed means no apply link), unavailable (API error, linking to the BambooHR careers page). The corporate site never collects résumés.

## 8. Team / leadership (`Person`)
`id, name, role, bio, photo, photoAlt, links[], provenance`. Only the CEO profile (public on live site) is included; other leadership needs approved bios/photos.

## 9. Global navigation and CTAs
`NavItem {id, label, href, groups[{heading, links[{label, href, description, external, status}]}], feature}` in `src/data/navigation.ts`. Header, mobile drawer and footer all render from it. `status:'proposed'` marks items not in the live navigation (shown with a gold dot in review mode). Global CTAs live in `src/data/site.ts` (`ctas`).

## 10. Claims register (`Claim`, `src/data/claims.ts`)
`id, statement, value, context, sourceUrl, evidence, approval, owner`. `StatBlock` throws at build time if a stat has no claim. View at `/prototype/claims/`.

## 11. Glyph normalisation rules (typography QA)
Applied in `src/lib/glyphs.ts` to migrated text (snapshot files stay raw for traceability). **Needs content-owner sign-off:**
superscript digits become `<sup>` digits · ` › ` becomes an SVG arrow + “to” · the approximately-equal sign (U+2248) becomes “approximately” · the not-equal sign (U+2260) becomes “is not” · decorative emoji are removed.

## 12. Mock-data boundary summary
| Data | Real / snapshot | Fictional |
|---|---|---|
| Services, industries (live), testimonials, claims | Live copy (re-approval needed) | — |
| Case studies (17), articles (12) | WordPress snapshot | — |
| Agent catalog (8) | Marketplace snapshot | — |
| Events | PNSQC, BOW (date TBC), NTC 2025 (dates illustrative) | 2 labelled fixtures |
| Jobs | BambooHR = 0 | 3 labelled fixtures |
| Proposed pages copy (public sector, SMB, considerations, some FAQs) | — | Proposed copy (not fictional facts) |
| PRISM whitepaper card | Title real | Date and asset placeholder (fixture) |
| Contact submission | — | Simulated outcome (no network) |
