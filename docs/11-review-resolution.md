---
title: "11 · Review resolution report (round 1)"
summary: "Every finding from Johnny's AI review, the correction made, where, how it was verified, and what needs Janique or external access."
---

# Review resolution report: round 1

**Input:** the correction brief derived from Johnny's AI review of the prototype (received 18 Nov 2026). The original review document itself was not provided; findings are taken from that brief, section by section.
**Verification run:** 18 Nov 2026 (doc 07 lists the automated results).

**Status key:**
- **Fixed + verified**: changed and confirmed by an executed check.
- **Fixed, needs approval**: changed, but the wording or decision needs Janique.
- **Blocked**: needs external access or a decision.
- **Partly**: some sub-items remain open.

## A. Terminology and award naming (brief §1)

| # | Finding | Correction made | Location | Verification | Needs Janique / access |
|---|---|---|---|---|---|
| A1 | Award named incorrectly | Now “First Prize, U.S. Navy AI Augmented Testing (AIAT) Challenge”, with “Administered by PEO MLB with Palmetto Tech Bridge”. Name taken from the body of QualityWorks' own news post. Shown **only in the Recognition section**, linked to that post; claim C10 updated | `pages/index.astro`, `data/claims.ts` (C10), `data/industries.ts` | `check:terms`: “Autonomous Testing Challenge” = 0 on marketing pages | **Approval:** the published post title is corrected in display (R-01, R-02, R-32); the WordPress source still has the old title. Issuer confirmation not obtained |
| A2 | Hero phrase | “…from AI-powered testing to custom apps to AI agents that take work off your team’s plate.” | `pages/index.astro` | Visual (`home-360`, `1440-home`) | Wording approval |
| A3 | “AI-powered & autonomous testing” | Renamed **“AI-powered testing”** | `data/services.ts` pathway (homepage hero card and “Three ways”) | `check:terms` 0 | **Service rename flagged for Janique's confirmation** |
| A4 | “Autonomous regression testing” | “AI-assisted regression testing” | `pages/index.astro` | `check:terms` 0 | Wording approval |
| A5 | “Ship with confidence” (×2) | “Release with confidence”. One data source renders both instances (hero card + “Three ways” card) | `data/services.ts` | `check:terms` 0 | — |
| A6 | “Tell us what you’re trying to ship” | “Tell us what you’re trying to launch.” | `pages/index.astro` | `check:terms` 0 | — |
| A7 | Other “autonomous”/“ship” in our copy | 20 corrections to migrated articles and a case study: R-03–R-21, R-33–R-35. Plus “release fast” (custom software), PRISM topic “Autonomous Testing” to “AI-Augmented Testing”, and internal docs. Retained, with reason: “Hazmat shipping documentation” (a logistics term in an industry-ideas article) | `data/corrections.ts`, `data/services.ts`, `pages/products/prism.astro` | `npm run check:terms`: **0 hits on marketing pages**. 1 hit on a review-only doc page that quotes the old wording | **Approval:** article wording edits change published posts (R-07–R-20); PRISM topic rename |

## B. Statistical claims (brief §2)

| # | Finding | Correction made | Location | Verification | Needs Janique / access |
|---|---|---|---|---|---|
| B1 | WSSC “30–80%” / “up to 80%” | **Removed everywhere** (card metric, detail metrics, summary, solution and result text, a 67%/50% survey line). No WSSC report with methodology is available, so the brief's fallback (remove) was applied. R-25–R-27, R-37, R-39 | `data/caseStudies.ts`, `data/corrections.ts` | grep of built site: 0 occurrences | **External:** WSSC pilot report if the figure should return |
| B2 | iPipelines “2 weeks to 2 days” | Metric removed; comparison and its “two weeks per cycle” baseline removed from text (R-28, R-29, R-38); derived “85% reduction” strip removed (R-30). Client shown as “Financial technology firm (name not approved for disclosure)”; “3CI” relationship removed (R-31) | same | grep: 0 occurrences of “2 weeks/two weeks/3CI” | **Approval:** client disclosure. The URL slug still contains “ipipelines”; rename + 301 is recommended if disclosure is not approved |
| B3 | Gartner “90% of enterprise software engineers…” | Primary source returned HTTP 403 to verification, so the statistic was removed from 2 sentences, the “Key findings” card and the card excerpt (R-22–R-24, R-36). Reference-list entry kept so footnote numbering stays intact | “More QA, Not Less” article | grep: 0 occurrences | **Approval:** editor to decide on the orphaned reference entry or supply verified wording/date |
| B4 | C02–C04 context | Annotations kept. Each now has `verification: 'required-before-launch'` and explicit “measurement context requires verification before launch; not independently verified” text. The homepage footnote says the same. Release builds drop these stats | `data/claims.ts`, `pages/index.astro`, `StatBlock.astro`, `/prototype/claims/` | Review build shows the footnote; release gate homepage shows C01 only | **Approval:** definitions, sample and period for 90%, $30M, 80% |
| B5 | “average per client” attachment | Checked against the live homepage counters: 90% to “(avg. per client)”; $30M to no label (aggregate); 80% to “(avg. per client)”. The prototype matches; recorded in each claim's context | `data/claims.ts` | Manual comparison with live HTML | — |
| B6 | “Black-owned, woman-led” wording | C14 now records `wording-approval-needed`. The live page uses lowercase “black-owned”; the prototype capitalises “Black”. Not treated as approved | `data/claims.ts` | Claims register shows the status | **Approval:** exact wording and whether it appears on the homepage |
| B7 | No invented references/permissions | No figures, testimonials, permissions or approval records were added. All edits are removals or neutral rewording | — | Code review | — |
| B8 | “Book a free consultation” (QM-112 2.5) | Found during traceability; changed to “Book a consultation” on 2 services (R-46) | `data/services.ts` | grep: 0 | Wording approval |

## C. Content and navigation (brief §3)

| # | Finding | Correction made | Location | Verification | Needs Janique / access |
|---|---|---|---|---|---|
| C1 | Angle brackets around “beyond the code” | Emphasised text, no brackets | `pages/index.astro` | `check:terms` rule “angle-brackets-beyond” = 0; visual | — |
| C2 | “Where’s Stacy?” as main heading | Heading “Events & speaking” with subheading “Where’s Stacy?” (homepage); events page eyebrow “Resources” | `pages/index.astro`, `pages/events/index.astro`, `SectionHeading.astro` (`subheading` prop) | Visual (`sec-events`) | — |
| C3 | QualityWatcher naming overlap | One name per destination: **QualityWatcher AI** (our page, linking to qualitywatcher.ai) and **QualityWatcher Test Management** (qualitywatcher.com). Different destinations, so both are kept, with the distinction stated in descriptions | `navigation.ts`, `products.ts`, QW page | QA-15 navigates via the new label | **Approval:** product owner names (R-41) |
| C4 | Mobile nav missing Resource Hub and Case Studies | Drawer lists every group link by name, incl. “Case Studies” and “Resource Hub”. Generic “overview” link only when the section page isn't already listed | `Header.astro` | QA-14: both labels present; all desktop destinations present | — |
| C5 | Case-study URLs | Standardised to `/case-studies/{slug}/` in routes, cards, service CTAs and migrated article links. 17 legacy 301s **recorded, not configured** | `pages/case-studies/[slug].astro`, `CaseStudyCard.astro`, `services.ts`, `lib/glyphs.ts`, doc 06 | QA-02B: 0 legacy `/case-study/` links; QA-02: 0 broken | **Access:** hosting for redirects |
| C6 | Agents as a Service labels | Legend explains Ready now / Quick launch / Custom build as marketplace listing labels (undefined by the marketplace), and Guided Preview as a walkthrough, **not** a live deployment or trial. Steps note: nothing deploys at checkout | `pages/products/agents-as-a-service.astro` | Visual (`sec-aaas`) | **Access:** AaaS owner for label definitions (Q-21) |
| C7 | Placeholder `#` destinations | Fixture event registration `#fixture-registration` replaced by a disabled, labelled demo control; QA now fails on any `#`/empty/javascript: link | `events.ts`, `events/[slug].astro`, `EventCard.astro`, `qa-checks.mjs` | QA-02B: 0 placeholder links | — |

## D. Accessibility and responsive (brief §4)

| # | Finding | Correction made | Location | Verification | Needs Janique / access |
|---|---|---|---|---|---|
| D1 | Alt text | All 17 case-study and 12 article images were **viewed and given written alt text** (images containing text carry that text). Case-study card images no longer use empty alt. Logos now carry the link name in `alt` instead of `aria-label` | `data/altText.ts`, `CaseStudyCard.astro`, `Header.astro`, `Footer.astro` | QA-04 (all `<img>` have alt), visual spot check | Alt copy approval |
| D2 | Keyboard, focus, headings, skip link, labels, validation, touch targets, contrast | Re-tested | site-wide | QA-01, 08, 12, 14, 18–21 pass; axe-core 0 violations on 20 pages | — |
| D3 | Visual inspection at 360/768/1024/1440 | Inspected homepage, mega-menu, mobile drawer, product pages, case studies, contact, review tools | `qa-output/evidence/` | Found and fixed: case-study text cut at 1,400 chars and scraped related-titles appended (R-47); WSSC survey figure | — |
| D4 | No compliance claim | Doc 07 and doc 08 record tests, limitations and outstanding checks. **Screen-reader test (QA-32) and non-Chromium browsers not done** | docs 07, 08 | — | **Access:** testers with NVDA/VoiceOver, Safari/Firefox |

## E. Review tooling separation (brief §5)

| # | Finding | Correction made | Location | Verification | Needs Janique / access |
|---|---|---|---|---|---|
| E1 | Review tooling must not reach a release | Review/release build modes; release gate script; cleanup checklist. Review hub and annotations **unchanged** for Janique | `lib/release.ts`, `scripts/release-check.mjs`, doc 12 | `build:release` gate: 0 leaked review markers; 31 genuine blockers listed; **fails as designed** | Owners listed in doc 12 §2 |

## F. Handoff documentation (brief §6–7)

| # | Finding | Correction made | Location | Verification | Needs Janique / access |
|---|---|---|---|---|---|
| F1 | Developer README | Rewritten: architecture, deps, structure, setup, commands, build, routes, config, design system, components, fixtures, limitations. Repository/branch: **Not yet established**, with handoff steps | `README.md` | — | **Access:** company repository |
| F2 | QM-112 traceability matrix | Built from **QM-112 v0.5** (now readable): system requirements 1.1–12.5, NFR 4.1–4.12, AC-INV…AC-HND, with strict status values | doc 08 | — | QM-41 still inaccessible |
| F3 | Integration, CMS, privacy, performance, hosting, migration, redirects, risks | New document; local performance **measured** and labelled non-production | doc 13 | `perf-local.mjs` | Sandbox access (HubSpot), recruiting owner, CMS decision |

## G. Final QA (brief §8)
See doc 07. Summary of checks run after these changes:
1. `check:terms`: 0 prohibited terms or old award names on marketing pages.
2. Numerical claims: each remaining figure is in the claims register or a case-study metric with source and context; C02–C04 flagged; unsupported figures removed.
3. Navigation parity desktop / mobile: QA-14.
4. Buttons, forms, mock states, filters, menus, links, keyboard: QA-02–QA-30.
5. Rendered appearance: screenshots at 4 widths plus a section review. Defects found were fixed (B1 survey line, R-47 parser).
6. Review controls present in the review build; absent from release (gate).
7. Design system and buyer-path structure unchanged (shared components; QA-16 pathways).

## H. Corrections ledger (needs Janique's approval)
Every build-time edit to migrated content is listed in `src/data/corrections.ts` with id, target, field, before/after pattern, reason and note: **R-01–R-39**. Code-level copy changes are A2–A6, B8 and C1–C3 above. R-47 is a migration fix (parser cap removed, scraped titles stripped) and changes no wording.
