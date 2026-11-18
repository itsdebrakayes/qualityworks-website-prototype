---
title: "08 · QM-112 requirements-to-test traceability"
summary: "Every QM-112 v0.5 requirement and acceptance criterion mapped to the prototype, its test and its real status."
---

# QM-112 requirements-to-test traceability

**Source:** QM-112 *Software Requirements Specification v0.5* (Google Doc, read 18 Nov 2026). Priorities come from QM-112 §6.1. QM-112 gives no explicit priority for the non-functional requirements; they are shown as “Not stated”. **QM-41** (approved sitemap) was still not accessible.

**Status values (strict):**
- **Implemented**: built in the prototype *and* exercised by a test that passed.
- **Mocked**: the behaviour is demonstrated with simulated or fixture data; the real integration does not exist.
- **Untested**: built, but no executed test yet.
- **Blocked**: needs access, a decision or content the project does not have.
- **Not implemented**: not built in the prototype.
- **Process**: a project/organisational requirement, not a website feature.

None of these means *production verified*.

*Evidence* refers to QA test IDs in doc 07 (`qa-output/results.json`, screenshots in `qa-output/evidence/`).

## A. Functional requirements (QM-112 §3)

| Requirement ID | Priority | Requirement | Implemented screen/component | Test steps | Expected result | Actual result | Evidence | Status |
|---|---|---|---|---|---|---|---|---|
| 1.1 | Must | Approved QM-41 navigation with Home, Solutions, Products and Innovations, Who We Help, Results, Resources, Company | `Header.astro`, `navigation.ts` | Compare menu labels with QM-41 | Labels/routes match QM-41 | Seven categories present (Home = logo). QM-41 unavailable, so the comparison could not be made; structure mirrors the live header plus items marked *proposed* | QA-13, `navigation.ts` | **Blocked** (QM-41 access) |
| 1.2 | Must | Solutions makes choosing between quality / build / AI easy | Solutions mega-menu (3 groups), `/services/` problem guide | Open Solutions menu; open `/services/` | 3 labelled groups; guide table | As expected | QA-10, `nav-mega-solutions-hover.png` | **Implemented** |
| 1.3 | Must | Menus work by keyboard, mouse, touch; must not disappear mid-selection | Header mega-menu + mobile drawer | Hover diagonal path; Enter/Esc/ArrowDown/Tab; 360px drawer | Stays open; keyboard operable; focus contained and returned | All passed | QA-10–QA-15 | **Implemented** |
| 1.4 | Must | Every option goes to the correct approved page; no broken/hardcoded links | `navigation.ts` (single source) | Crawl all 96 routes; check for placeholder links | 0 broken, 0 `#` links | 0 broken, 0 placeholder, 0 legacy `/case-study/` links | QA-02, QA-02B | **Implemented** (correctness vs QM-41 Blocked) |
| 2.1 | Must | Homepage introduces three clear pathways | Homepage hero cards + “Three ways” section | Load `/` at 1440×900 | 3 pathway cards visible above the fold | As expected | QA-16 | **Implemented** |
| 2.2 | Must | Service pages: problem, service, evidence, industries, next step | `ServiceTemplate.astro` | Open `/services/test-automation/` etc. | All sections present | 11 full records pass visually; 9 summary records show a migration notice | 1440-services__test-automation.png | **Implemented** (11) / **Not implemented** (9 summary) |
| 2.3 | Must | Consulting CTAs reach the correct inquiry form | Service CTAs to `/contact-us/` | Link crawl | All resolve to `/contact-us/` (or approved HubSpot meeting link) | As expected | QA-02, QA-17 | **Implemented** |
| 2.4 | Must | Marketing can update text, images, search info without code | — | — | CMS editing | No CMS; content is in code | — | **Not implemented** (CMS undecided) |
| 2.5 | Must | No free consultations, guarantees or numbers unless approved | Claims register, `StatBlock`, corrections layer | grep for “free consultation”, “guarantee”, “free trial”; release build | None present; unapproved numbers flagged | Two “Book a free consultation” CTAs (copied from the live site) changed to “Book a consultation” (R-46); no guarantees found; numbers annotated C01–C19; release build drops unverified stats | `claims.ts`, release gate | **Untested** (marketing approval of remaining claims) |
| 3.1 | Must | Products have their own pages, not presented as consulting | `/products/`, QualityWatcher AI, Agents as a Service, PRISM | Visit product pages | Distinct product surface and status badges | As expected | 1440-products__*.png | **Implemented** |
| 3.2 | Must | Accurate approved product names, no exaggeration | Product pages; naming fixed (QualityWatcher AI / QualityWatcher Test Management) | Review copy | Owner-approved names | Names consistent; **owner approval not obtained** | doc 11 R-41 | **Blocked** (product owner) |
| 3.3 | Must | Agent catalog visible; correct setup/purchase path; no unconfirmed checkout | `/products/agents-as-a-service/` | Filter catalog; follow CTA | Snapshot + hand-off to marketplace; no on-site checkout | As expected; labels legend added | screenshots; doc 11 R-45 | **Mocked** (snapshot, no API) |
| 3.4 | Must | No demo/trial/purchase/capability unless confirmed | QW tools status badges, AaaS legend | Probe tool links | Unavailable tools disabled | 3 tools need sign-in; Schema to API 404 (CTA disabled) | doc 01 P-03 | **Blocked** (product owner confirmation) |
| 4.1 | Must | Content for enterprise, public sector, growing tech, QA teams | Industry pages incl. proposed Public Sector and SMB | Visit pages | Audience-specific content | 5 full, 5 summary; 2 proposed pages need QM-41 | 1440-industries__public-sector.png | **Untested** (approval) |
| 4.2 | Must | Client stories/awards/results stored structurally | `CaseStudy`, `Claim` schemas | Inspect data | Structured records | 17 structured case studies; claims register | `types.ts` | **Implemented** (file-based) |
| 4.3 | Must | Industries and services visible per story, linked to service pages | Case-study detail facts | Open a detail page | Industry + service links | As expected | 1440-case-studies__jmmb….png | **Implemented** |
| 4.4 | Must | Every numerical client result has source + approval | Case-study metrics (`metricSource`, `context`), corrections R-25–R-31 | Scan for unsupported figures | Figures sourced or removed | Unsupported WSSC/iPipelines/Gartner figures removed; remaining figures sourced to live pages, **not approved** | doc 11 §B | **Blocked** (client/marketing approval) |
| 4.5 | Must (Should for combined filters) | No-results explanation + clear filters | `/case-studies/` FilterBar | Healthcare + Test Automation; Clear | Empty state; reset to 17 | As expected | QA-23, case-studies-no-results.png | **Implemented** |
| 5.1 | Must | Retain blog; preserve article URLs | `/{slug}/` article route | Crawl 12 migrated posts | Same slugs | 12/99 migrated with unchanged URLs | doc 06 | **Implemented** (12) / **Not implemented** (87) |
| 5.2 | Must | Separate content types | `Article.type`, events, case studies | Resource hub type chips | Types filter correctly | As expected; campaign landing pages not built | QA-25 | **Implemented** (landing pages Not implemented) |
| 5.3 | Must | Editors record title, author, dates, category, images, downloads, SEO | `Article` schema | — | Editor UI | Schema only; no editor | doc 04 | **Not implemented** (CMS) |
| 5.4 | Must (advanced Should) | Browse/filter; pagination; no-results message | `/resources/`, `/blog/` | Filter types/topics | Correct counts; empty state | Filters pass; **pagination not built** (12 posts) | QA-25 | **Implemented** (filters) / **Not implemented** (pagination) |
| 5.5 | Must | Events show accurate dates; past is not upcoming | `eventPhase()`, EventCard | Load past/cancelled/TBC/upcoming | No registration on past/cancelled/TBC | As expected | QA-26 | **Implemented** |
| 5.6 | Must | Images/downloads remain accessible; drafts not public | Media mirror | — | — | 29 images mirrored; PDFs not inventoried; no drafts system | — | **Untested** |
| 5.7 | Must | Full articles retained on own site | Article template | Open an article | Full body on site | As expected | 1440-more-qa….png | **Implemented** |
| 6.1 | Must | Inventory current forms and destinations before development | Audit doc 01 §3 | — | Complete form inventory | Footer + contact WPForms recorded; HubSpot form IDs unknown | doc 01 | **Blocked** (HubSpot admin) |
| 6.2 | Must | Required info, plain-language errors, success/failure, no silent discard | `ContactForm.astro` | Empty submit; bad email; consent; loading; error; success | Error summary, inline errors, busy state, no false success | All states pass (simulated). Release build shows an error rather than a fake success | QA-18–QA-22 | **Mocked** |
| 6.3 | Must | Privacy notice + consent; bot protection | Consent checkbox | Submit without consent | Blocked | Consent enforced; **bot protection not implemented** | QA-20 | **Implemented** (consent) / **Not implemented** (anti-spam) |
| 6.4 | Must | Deliver securely to correct HubSpot record | — | Sample HubSpot submission | Record in HubSpot | No integration; no sandbox credentials | QA-31 | **Blocked by sandbox access** |
| 6.5 | Must | Error reports don't expose personal data | — | — | — | No error reporting exists | — | **Not implemented** |
| 6.6 | Must | Testing uses sample data and test form | QA uses fixture data; no network calls | QA-22 asserts 0 POST requests | No live inquiries | 0 non-GET requests | QA-22 | **Implemented** (for prototype) |
| 7.1 | Must | Document current careers/BambooHR behaviour | doc 01 §3, `jobs.ts` | Probe BambooHR list endpoint | Behaviour recorded | Embed + `/careers/list` returns 0 roles | doc 01 | **Implemented** (documentation) |
| 7.2 | Must | Show/link approved vacancies; correct BambooHR destination | `/careers/` | Switch to roles state; inspect apply links | Links to BambooHR | Pass with fixture vacancies | QA-27 | **Mocked** |
| 7.3 | Must | Tell applicants they're leaving; data stays in ATS | Apply buttons + note | Inspect | External marker + note; no file upload | As expected | QA-27 | **Implemented** |
| 7.4 | Must | Clear message if BambooHR unavailable | Careers unavailable state | Switch state | Warning + direct link | As expected (simulated) | QA-27 | **Mocked** |
| 8.1–8.5 | Must | CMS roles, drafts, preview, approve, publish, restore, export, no public drafts | — | — | — | No CMS selected | doc 13 §3 | **Not implemented** |
| 9.1 | Must | Preserve URLs; editable titles/descriptions | `seo` fields; URL map | Crawl titles/descriptions | Unique per page | 0 duplicates; 42/42 page URLs preserved; case studies moved to `/case-studies/` (301s required) | QA-05, doc 06 | **Implemented** (editing Not implemented) |
| 9.2 | Must | Structured data matching visible content | `lib/schema.ts` | Parse JSON-LD | Valid; only visible content | Valid on all pages; not validated with Google Rich Results | QA-06 | **Implemented** |
| 9.3 | Must | Correct sitemap; no indexing of drafts/tests | Review build `noindex`; release robots | Inspect meta | Prototype noindex | Prototype noindex; **XML sitemap not generated** | release gate | **Not implemented** (sitemap) |
| 9.4 | Must | Related content interlinks | `related*` fields | Visual review | Service / case / industry links | As expected | screenshots | **Implemented** |
| 9.5 | Must | Pre-launch check for missing pages, broken links, redirect chains | QA-02 link check | Crawl | 0 broken | 0 broken internally; redirects not configured | QA-02 | **Untested** (redirects) |
| 10.1–10.4 | Should (Must for privacy) | Identify/measure analytics without PII or duplicates | — | — | — | Current tags identified (GA4, Meta pixel, HubSpot) in audit; nothing implemented | doc 01 §3 | **Not implemented** |
| 11.1 | Must | URL inventory and destinations | doc 06 | — | Every URL mapped | 42 pages + 17 case studies + patterns mapped; 87 posts not individually listed | doc 06 | **Untested** |
| 11.2 | Must | Keep URLs; redirect changed ones | doc 06 | — | 301 plan | Plan written; **no redirects configured** | doc 06 | **Not implemented** |
| 11.3–11.5 | Must | Accurate migration, comparison, backup, pre-launch link tests | Migration scripts | Re-parse and compare | Accurate copy | Parser truncation defect found and fixed; corrections layer logged; no backup process | doc 11 R-47 | **Untested** |
| 12.1 | Must | Separate dev/test/production environments | — | — | — | Only local preview + private Artifact | — | **Not implemented** |
| 12.2 | Must | Private preview identifying the version; results in QualityWatcher | Artifact versions; QA results | — | Version shown; results in QualityWatcher | Results are in repo docs, **not in QualityWatcher** | doc 07 | **Not implemented** (QualityWatcher logging) |
| 12.3 | Must | Human reviewer approves release; AI review alone insufficient | Release gate + doc 12 | Run `build:release` | Gate fails until human sign-off items close | Gate fails with 31 findings (expected) | doc 12 | **Implemented** (gate) / **Process** (approval) |
| 12.4 | Must | No indexing of test pages; no fictitious data into live systems | noindex; simulated form | QA-22 | 0 outbound submissions | As expected | QA-22 | **Implemented** |
| 12.5 | Must | Backups, change record, post-release check, rollback | Git history | — | — | Git history only | — | **Not implemented** |

## B. Non-functional requirements (QM-112 §4)

| Requirement ID | Priority | Requirement | Implemented screen/component | Test steps | Expected result | Actual result | Evidence | Status |
|---|---|---|---|---|---|---|---|---|
| 4.1 | Not stated | WCAG 2.2 AA (keyboard, labels, contrast, reflow) | All templates | axe-core on 20 pages; keyboard tests; manual visual review | 0 automated violations; keyboard operable | 0 violations; keyboard tests pass; **screen-reader test not done** | QA-08, QA-12, QA-14, QA-32 | **Untested** (manual AT pending) |
| 4.2 | Not stated | Chrome, Safari, Firefox, Edge; desktop/tablet/mobile | Responsive layouts | Chromium at 360/640/768/1024/1440 | No overflow | Pass in Chromium only | QA-07-* | **Untested** (Safari, Firefox, Edge) |
| 4.3 | Not stated | LCP at most  2.5 s, INP at most  200 ms, minimal CLS | Static pages | `perf-local.mjs`, slow-4G + 4× CPU, 390px | Within targets | Local LCP 0.61–0.78 s, CLS at most  0.002; INP not measured; **not production/field data** | qa-output/perf-local.json | **Untested** (production) |
| 4.4 | Not stated | 99.9% availability | — | — | — | Host not chosen | — | **Not implemented** |
| 4.5 | Not stated | Capacity under agreed load | — | — | — | No traffic baseline; no load test | — | **Not implemented** |
| 4.6 | Not stated | Encryption, strong admin auth, no secrets, vuln testing | Static build, no secrets | grep for keys | None | No credentials in repo; no security testing | — | **Untested** |
| 4.7 | Not stated | Privacy and consent | Contact consent | QA-20 | Consent required | Form consent only; no cookie consent | QA-20 | **Not implemented** (cookie consent) |
| 4.8 | Not stated | Backup RPO 24 h / RTO 4 h (proposed) | — | — | — | — | — | **Not implemented** |
| 4.9 | Not stated | Maintainable; company retains source | README, git, zip | — | Source exportable | Source zip + local git; **no company repo** | README | **Blocked** (repository) |
| 4.10 | Not stated | Sustainable cost | doc 13 (QM-103 summary) | — | Costed option | Static build fits $0–$240/yr hosting tiers (QM-103); budget unapproved | doc 13 | **Blocked** (budget) |
| 4.11 | Not stated | Monitoring and error reporting | — | — | — | — | — | **Not implemented** |
| 4.12 | Not stated | Accurate content; alt text; sourced claims | Claims register, corrections layer, alt text audit | Terminology scan; image audit | 0 prohibited terms; meaningful alt | 0 terms on marketing pages; 29 images given written alt text; claims flagged | QA-04, check:terms | **Untested** (marketing approval) |

## C. Page-level acceptance criteria (QM-112 §9)

| AC ID | Priority | Prototype coverage | Evidence | Status |
|---|---|---|---|---|
| AC-INV-01 | Must | Inventory of 42 pages (title, H1, sections count, CTAs, forms, meta) in doc 01; owner/last-checked not recorded; no per-page screenshots of the live site beyond 6 | doc 01 | **Untested** (incomplete fields) |
| AC-INV-02 | Must | CTA label to destination captured; placeholder CTAs eliminated in prototype | doc 01, QA-02B | **Implemented** (prototype) |
| AC-INV-03 | Must | Provenance on every record (source, approval, URL, date) | `types.ts`, doc 04 | **Implemented** (file-based) |
| AC-INV-04 | Must | Sources of truth + fixtures labelled; loading/error/empty states | doc 04, QA-23–27 | **Mocked** |
| AC-INV-05 | Must | Keep/Improve/Merge decisions; 301 map | docs 01, 06 | **Untested** (approval) |
| AC-GLO-01 | Must | One header/footer/type/tokens across legacy, QualityWatcher and AI/agent pages | `/design-system/`, QA-09 | **Implemented** |
| AC-GLO-02 | Must | Approved routes; dropdown behaviour; current state; mobile open/close/escape | QA-10–QA-15 | **Implemented** (QM-41 match Blocked) |
| AC-GLO-03 | Must | Names, focus, touch targets, headings; screen-reader smoke test | QA-01, QA-04, QA-08, QA-32 | **Untested** (screen reader) |
| AC-GLO-04 | Must | 360/768/1024/1440, 200% zoom, reduced motion | QA-07-*, QA-29 | **Implemented** (200% zoom approximated at 640px) |
| AC-GLO-05 | Must | Primary/secondary CTA per page; no unapproved promises; analytics event names | doc 03; analytics not defined | **Untested** |
| AC-HOM-01 | Must | Hero copy + two CTAs with distinct working destinations | QA-16 | **Implemented** (copy approval pending) |
| AC-HOM-02 | Must | Three pathways + verifiable trust evidence with ledger | QA-16, claims register | **Implemented** / claims **Blocked** (approval) |
| AC-HOM-03 | Should | Featured insights with fallback | Homepage insights/events fallback | **Implemented** (file-based) |
| AC-SRV-01 | Must | Services index maps observed categories | `/services/` | **Implemented** |
| AC-SRV-02 | Must | Service detail modules + unique metadata | ServiceTemplate, QA-05 | **Implemented** (11 full) |
| AC-SRV-03 | Must | AI solutions / Agents as a Service journey without implying marketplace is the same site | AI service FAQ/compare table, AaaS hand-off notes | **Implemented** |
| AC-PRD-01 | Must | Product pages distinct; owner-approved names and CTAs | Product pages | **Blocked** (owner approval) |
| AC-PRD-02 | Must | QW tools: availability, CTA, verified target | Tool status badges; 404 tool disabled | **Implemented** (status observed 17 Nov; owner confirmation Blocked) |
| AC-PRD-03 | Must | Marketplace journey distinguished; catalog fields from API or fixture | AaaS page, `AgentRecord` | **Mocked** |
| AC-PRD-04 | Must | PRISM confirmed with owner; illustrative panels labelled | PRISM wireframes | **Blocked** (owner) |
| AC-IND-01 | Must | Separate enterprise / public sector / SMB journeys | Industry + audience pages | **Untested** (QM-41 approval) |
| AC-IND-02 | Must | Case-study schema; unapproved metrics hidden | `CaseStudy` schema; release drops nothing yet; disclosure null | **Blocked** (client approval) |
| AC-IND-03 | Should | Filters: combined, reset, no-result, mobile | QA-23 | **Implemented** |
| AC-RES-01 | Must | Resource types/fields; no implied downloads | Resource hub; PRISM card labelled fixture | **Implemented** |
| AC-RES-02 | Must | Blog detail template features | Article template | **Implemented** |
| AC-RES-03 | Must | Downloads with metadata; gated forms need HubSpot | — | **Not implemented** |
| AC-RES-04 | Must | Events: dates, tz, venue, state, fallback | QA-26 | **Implemented** |
| AC-FRM-01 | Must | Field spec incl. CRM mapping | Field list in doc 13; CRM mapping unknown | **Blocked** (HubSpot) |
| AC-FRM-02 | Must | Validation, double-submit, states, consent, bot protection; sandbox test | QA-18–QA-22, QA-31 | **Mocked** / **Blocked by sandbox access** |
| AC-FRM-03 | Must | Consistent contacts; analytics without PII | Phone discrepancies A-06/A-07 open | **Blocked** (operations) |
| AC-CAR-01 | Must | Job source identified; fields; confirmed live jobs | `jobs.ts` | **Mocked** |
| AC-CAR-02 | Must | Available/none/expired/return; hand-off visible | QA-27 | **Mocked** |
| AC-SEO-01 | Must | Titles, descriptions, canonical, H1, OG, sitemap, robots | QA-01, QA-05, QA-06; sitemap missing | **Implemented** (sitemap Not implemented) |
| AC-SEO-02 | Must | Valid structured data only where supported | QA-06 | **Implemented** |
| AC-SEO-03 | Must | Redirect maintenance, status codes, no chains | doc 06 plan | **Not implemented** |
| AC-SEO-04 | Should | Search/filter spec | Filters done; site search deferred (Q-09) | **Not implemented** (search) |
| AC-SEO-05 | Must | Editorial roles and lifecycle | — | **Not implemented** (CMS) |
| AC-OPS-01 | Must | Analytics event catalogue | — | **Not implemented** |
| AC-OPS-02 | Must | HTTPS, secrets, spam defence, CSP, consent; test keys only | No secrets; no live data | **Untested** |
| AC-OPS-03 | Must | Lighthouse/CWV baselines + targets | perf-local (local only) | **Untested** (production) |
| AC-OPS-04 | Must | Per-page evidence: route, screenshots, checks, owner, date, env, status | doc 07 + evidence folder; owner per test not recorded | **Untested** (owner field) |
| AC-HND-01 | Must | Clickable non-production prototype + repo handoff where approved | Artifact, zip, README | **Implemented** (repo Blocked) |
| AC-HND-02 | Must | Dev tickets reference page/AC; created only after review | No tickets created (doc 10 examples only) | **Process** |
| AC-HND-03 | Must | Traceability ledger with statuses | This document | **Implemented** |
