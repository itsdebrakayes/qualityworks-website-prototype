---
title: "14 · Review resolution report (round 2)"
summary: "Johnny's second review: each finding, the affected page, the exact correction, verification evidence and approval status."
---

# Review resolution report: round 2

**Input:** “QM-113 — Round 2 Final Corrections” (18 Nov 2026), derived from Johnny's second AI review. The review document itself was not provided; findings are taken from the brief.
**Verification:** `npm run check:content` (new scanner, below), `npm run build` (corrections fail the build if they stop matching), `npm run qa:checks` (doc 07), `npm run build:release` (doc 12), and a manual look at rendered desktop and mobile pages.

## Why round 1 missed the fintech text
Round 1 searched the built pages for “2 weeks” with an ordinary space. WordPress had stored the excerpt as “2&#x202F;weeks to 2&#x202F;days”, with **narrow no-break spaces (U+202F)**. The round 1 search also stripped HTML tags, so it never looked at attribute text such as the meta description. Both gaps are closed by `scripts/content-check.mjs`, which:
- normalises every Unicode space and decodes HTML entities;
- scans **visible text, every attribute** (meta/OG/Twitter descriptions, alt, title, aria-label) and **JSON-LD**;
- scans the **source data and templates** (`src/**/*.ts`, `src/**/*.astro`), excluding only the raw WordPress snapshots (kept unedited for traceability) and `corrections.ts` (which quotes old wording in its `find` patterns);
- reports **review pages separately**, because the review docs quote findings by design.

It replaces round 1's `terminology-check.mjs`.

## A. Fintech case study (brief §1)

| # | Original finding | Affected page | Exact correction | Verification | Approval status |
|---|---|---|---|---|---|
| 1.1 | Summary named the client's product and repeated “2 weeks to 2 days” | Fintech case-study detail page (summary + meta description), case-study cards | Summary replaced with the review's wording: “Discover how QualityWorks helped a financial technology firm modernize a legacy platform with 90%+ automation coverage and 80%+ fewer manual tester hours.” (**R-50**). Meta description now uses the full sentence instead of a truncated one | `check:content`: rule `two-weeks-two-days` = 0, `client-product` = 0 (marketing + source) | Wording supplied by review; Janique to confirm |
| 1.2 | “upgrade their legacy Laser App platform” | Same page, “The client” section | Now “upgrade their legacy platform” (**R-51**) | `client-product` = 0 | Janique to confirm |
| 1.3 | Remove every reference to the client's product | Whole project | Product name removed from rendered pages, metadata, cards, alt text, JSON-LD, data modules, templates, scripts and review docs. The legacy URL (which contains the name) is recorded **only** in `src/data/redirects.json` and the redirect table in doc 06, because the 301 needs the old address. The raw WordPress snapshot keeps the original wording by design and never renders | `check:content` marketing 0 / source 0. `grep -ri` over `src/`, `scripts/`, `docs/`: only `redirects.json`, the snapshot JSON and doc 06 §5 | **Disclosure permission not documented**: the client stays anonymous until Marketing/Legal approve (Q-23) |
| 1.4 | Rename the route to a neutral slug | `/case-studies/fintech-legacy-platform-modernization/` | Public slug set through `redirects.json` (`publicSlug()` in `caseStudies.ts`). All internal links (homepage, Test Automation and API & Cloud services, Finance & Banking industry page, QA scripts) updated | QA-02 (0 broken links), QA-02B (0 legacy links) | — |
| 1.5 | Document the 301 | Legacy `/case-study/…` and the round-1 prototype `/case-studies/…` URL | `scripts/gen-redirects.mjs` writes `dist/_redirects` (18 rules, Netlify/Cloudflare format) on every build. Doc 06 §5 records the mapping | File generated; **redirects are NOT working**: no host is configured and the prototype viewer cannot run them | **Pending** (hosting decision, QM-103) |
| 1.6 | Keep 90%+ and 80%+ only with valid source and release qualification | Fintech metrics | Unchanged metrics with “As published” context. The source now reads “Published QualityWorks case study (legacy URL recorded in the redirect map)” instead of linking a URL that contains the product name | Visual check of the detail page | Metric approval pending (claims process) |

## B. Client terminology (brief §2)

| # | Original finding | Affected page | Exact correction | Verification | Approval status |
|---|---|---|---|---|---|
| 2.1 | “The customer” heading | WSSC, fintech and **all other** case-study detail pages (one shared template) | Section heading is now “The client” | `the-customer-heading` rule = 0 | — |
| 2.2 | “creating the highest value for our customers” | About Us (core values) | “…for our clients.” | `our-customers` rule = 0 | — |
| 2.3 | Other uses of “customer” for QualityWorks' own clients | Whole project | Reviewed every “customer” in source. Remaining uses describe **clients' end customers** (e.g. “devices your customers actually use”, “Protect customer data”, “experiences customers trust”), plus the Agents marketplace's “Customer Success” department name. These are left unchanged, as the brief instructs | Manual review of `grep -rn customer src/` | — |

## C. Tool and product claims (brief §3)

| # | Original finding | Affected page | Exact correction | Verification | Approval status |
|---|---|---|---|---|---|
| 3.1 | “The AI tool automatically generated test cases from requirement documents” | WSSC case study, “Our solution” | “The AI tool generated draft test cases from requirement documents for QA engineers to review.” (**R-52**) | `auto-generated-claim` = 0 | Janique to confirm |
| 3.2 | “Runs tests automatically with self-healing selectors” | Navy news post | “Runs tests with self-healing selectors” (**R-53**, supersedes R-04) | `runs-automatically` = 0 | Janique to confirm (published post wording) |
| 3.3 | “seamless integration across 40+ CI/CD…” | Navy news post | “with integrations for CI/CD, project management and cloud tools.” (**R-54**). **“40+” removed**; no product-owner verification exists | `seamless-40` = 0 | Product owner may reinstate “40+” with evidence |
| 3.4 | “cutting-edge solutions” | Navy news post | “new solutions” (**R-55**) | `cutting-edge` = 0 | Janique to confirm |
| 3.5 | (Found by the new scanner) “Schedule a free consultation with Stacy Kirk” | “Determined Testers…” blog post | “Schedule a consultation with Stacy Kirk” (**R-56**, QM-112 2.5) | `free-consultation` = 0 | Janique to confirm |
| 3.6 | (Found by the new scanner) the prohibited term inside an infographic's alt text | “QA is changing…” article | **Not changed.** The alt text accurately transcribes words printed in the image; editing only the alt would mislead screen-reader users. Allow-listed in the scanner with this reason | Listed in `content-check.mjs` ALLOW | **Marketing to replace or re-export the image (Q-28)** |

All six corrections are in `src/data/corrections.ts` (the migrated-content corrections layer, same as R-03–R-21) with before, after, reason and note.

## D. Verification evidence (brief §4)

| Channel | Scope | Result |
|---|---|---|
| Visible text of every page (desktop markup; the mobile drawer is in the same HTML) | 101 pages | 0 marketing hits for all 16 rules |
| Attributes (meta description, OG/Twitter, alt, title, aria-label, placeholder, value) | 101 pages | 0 marketing hits |
| JSON-LD structured data | 101 pages | 0 marketing hits |
| Source data + templates (`src/**/*.ts`, `src/**/*.astro`) | 82 files | 0 hits |
| Release build (`dist-release/`) | release pages | 0 hits |
| Review docs (`/prototype/*`) | 16 pages | Hits are quotations of the findings in docs 01, 02, 08, 11 and 14 (informational) |
| Navigation labels | header, drawer, footer | Same data source; covered by the page scan |

## E. Decisions still with Janique (brief §5, not fabricated)

| Item | Status |
|---|---|
| Red Hat Display / Red Hat Mono vs the approved brand-kit fonts | **Pending.** The brand-kit HTML document has not been supplied to the project; fonts follow the live site |
| Corporate repository and hosting | **Pending.** Code is in `itsdebrakayes/qualityworks-website-prototype` (personal, private). No company repo; no host approved (QM-103) |
| Service terminology changes (e.g. “AI-powered testing”) | **Pending approval** (round 1 A3) |
| Migrated-article wording (R-01–R-39, R-50–R-56) | **Pending approval** |
| “Black-owned, woman-led” capitalisation | **Pending** (C14, `wording-approval-needed`) |
| C02–C04, C14 and C16 claim wording | **Pending.** C02–C04 `required-before-launch`; C14 wording; C16 (3.5× capacity) method not published |

## F. Final QA (brief §6)
See doc 07 for the regenerated automated results, and §G for the rendered-page check. Review hub, claim annotations, accessibility evidence, traceability matrix (doc 08), release gate (doc 12) and the sandbox-blocked indicators (QA-31, QA-32) are unchanged and still present.

Final run (18 Nov 2026, after the documentation pass and code fixes below):

| Check | Result |
|---|---|
| `npm run build` | 101 pages; 18 redirect rules written (pending host); glyph lint clean; data integrity check clean |
| `npm run check:content` | Marketing 0 · source 0 · review docs informational only |
| `npm run qa:checks` (Playwright + axe) | 37 checks: 35 pass, 0 fail, 2 blocked (QA-31 HubSpot, QA-32 screen reader: no access in this environment) |
| `npm run build:release` | Fails by design: 31 launch blockers across 15 types (doc 12). No new blockers |
| Release `/case-studies/` | Empty state “Clear filters” works; no script errors |

**Code fixes made during the round-2 documentation review** (found by reading every file, none changes approved copy):
- `/case-studies/` release build: the review-only simulation buttons were looked up with a non-null assertion, which threw and disabled “Clear filters”. Now guarded.
- FAQPage JSON-LD now carries only `published-live` or `approved` answers. Pending answers still show on the page but are no longer sent to search engines as accepted answers (QualityWatcher AI: 1 of 4; Agents as a Service: 2 of 4).
- A `<!-- PROTOTYPE -->` HTML comment that was visible in page source is now a build-time comment.
- New `src/data/integrity.ts`: the build fails if any record references an unknown service, industry, product or case-study slug (previously dropped silently).
- Migrated article links to renamed case-study slugs now point straight at the new slug (via `src/data/redirects.json`).
- CtaBand heading ids are unique per instance; the mobile drawer no longer closes on a click inside its own padding; the release stat filter keeps `source-checked` claims; unused imports removed.
- Codebase documentation: detailed README and CONTRIBUTING; every component, page, data module, script and stylesheet has a header comment and inline comments. A strip-comments comparison confirmed the commenting pass changed no code, and a normalised comparison of the built HTML confirmed no rendered change.

## G. Rendered-page check
Desktop (1440 px) and mobile (390 px) screenshots and text assertions for the fintech case study, WSSC case study, About Us and the US Navy post: corrected wording present, no horizontal scroll. Recorded in doc 07's manual log as MQ-21 to MQ-24.
