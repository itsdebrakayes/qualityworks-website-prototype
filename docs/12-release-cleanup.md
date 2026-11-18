---
title: "12 · Review tooling and release cleanup"
summary: "How review-only content is isolated from a release build, the cleanup checklist and the current release-gate result."
---

# Review tooling and release cleanup

The Review hub and Review annotations stay **fully operational** for Janique's review. None of the internal review information has been removed from the review build. Separation is enforced by build mode, not by deleting content.

| Build | Command | Purpose |
|---|---|---|
| **Review** (default) | `npm run build` | Everything visible for review; every page `noindex` |
| **Release candidate** | `npm run build:release` | `QW_RELEASE=true`: review tooling stripped, review routes deleted, then `scripts/release-check.mjs` scans the output and **fails** while any marker or blocker remains |

## 1. What release mode removes automatically (`src/lib/release.ts`)

| Review-only item (from the review brief) | Where | Release behaviour | Verified by gate |
|---|---|---|---|
| “Prototype · QM-113” bar + Review hub link + annotations toggle | `ProtoBar.astro` via `BaseLayout` | Not rendered | Yes: “Prototype bar” marker = 0 |
| Review hub, docs, claims register, design system | `/prototype/*`, `/design-system/` | Routes deleted from `dist-release/` | Yes |
| Claim annotations (C01–C19) | `ClaimRef.astro` | Not rendered | Yes |
| Claim-register notes and internal sources | homepage stat footnote, article “Migrated from WordPress…” note, `data-review-note` attributes | Not rendered (`REVIEW &&`, `rn()`) | Yes |
| “(proposed page)” labels | Header proposed dots; industry eyebrow | Not rendered | Partly: alert text on the 2 proposed pages is still present **as a release blocker** |
| “Details pending” | `ProductCard` (PRISM) | Shows “Framework” | Yes |
| “Date to be confirmed” | Events without confirmed dates (BOW 2026) and events with unverified dates (NTC 2025) | Excluded from the release build | Yes |
| “Illustrative sample” PRISM score | Homepage products band | Not rendered | Yes |
| Unverified statistics (C02–C04) | `StatBlock` | Dropped while `verification: 'required-before-launch'` | Yes (homepage shows only C01) |
| Fixture vacancies, fixture events, PRISM whitepaper card | `jobs.ts`, `events.ts`, `articles.ts` | Excluded | Yes |
| Simulation controls (contact outcome, careers states, case-study loading/error) | components | Not rendered | Yes |
| Robots `noindex, nofollow` | `BaseLayout` | Switches to the page's production directive | Yes |

## 2. Release blockers that need people, not code
These are deliberately **kept** in the release build with a `data-release-blocker` marker, so the gate fails until someone supplies content or makes a decision:

| Blocker | Pages | Owner | Needed |
|---|---|---|---|
| Contact form has no approved endpoint | `/contact-us/` | Marketing/CRM owner | HubSpot form IDs + sandbox test (QM-112 6.4). Until then the form shows an error, never a false success |
| PRISM content missing (6 modules) | `/products/prism/` | PRISM owner | Dimension list, method, sample scorecard, audience/engagement, whitepaper |
| About page content missing (3 modules) | `/about-us/` | HR / Security / Marketing | Leadership bios, data-protection copy, community logos |
| QualityWatcher illustrative mock | `/qualitywatcher-ai-tools/` | QW product owner | Approved screenshots |
| QualityWatcher access model unresolved | `/qualitywatcher-ai-tools/` | QW product owner | Sign-in vs free tier; Schema-to-API status |
| Proposed routes | `/industries/public-sector/`, `/industries/small-business/` | PM (QM-41) | Sitemap approval |
| Summary records | 11 service/engagement pages, 5 industry pages | Content | Full copy migration |

## 3. Current release-gate result (18 Nov 2026)

```
Release gate: 31 finding(s) across 15 type(s)
  BLOCKER | contact-form: no approved HubSpot endpoint; submission is simulated  (1)
  BLOCKER | content-missing: … (8 modules on /about-us/ and /products/prism/)
  BLOCKER | illustrative-mock: replace with approved product screenshots  (1)
  BLOCKER | proposed-route: awaiting QM-41 approval  (2)
  BLOCKER | summary-record: full service copy not migrated  (11)
  BLOCKER | summary-record: industry copy not migrated  (5)
  BLOCKER | unresolved: QualityWatcher access model  (1)
  MARKER  | “(proposed page)” label  (2)  <--  text inside the proposed-route blocker alerts
```

**Result: FAIL, as intended.** No review-only marker leaks outside the listed blockers.

## 4. Cleanup checklist before any release
- [ ] All section 2 blockers resolved and `npm run build:release` exits 0
- [ ] Claims C01–C19 approved or removed; `verification` cleared only with recorded evidence
- [ ] Client disclosure approved per case study (`clientDisclosureApproved: true`), or the name anonymised
- [ ] Editorial corrections R-01–R-39 and R-46 approved by Janique (doc 11)
- [ ] 301 redirects configured and crawl-tested (doc 06)
- [ ] Analytics + consent implemented; HubSpot and BambooHR tested in sandbox
- [ ] `npm run check:terms` and `npm run qa:checks` pass on the release candidate
- [ ] Human release approval recorded (QM-112 12.3); results logged in QualityWatcher (QM-112 12.2)
