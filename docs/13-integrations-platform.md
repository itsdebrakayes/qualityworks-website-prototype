---
title: "13 · Integrations, platform and launch readiness"
summary: "Status of every external integration, the CMS decision, privacy/security, performance, hosting, migration, redirects and launch risks."
---

# Integrations, platform and launch readiness

Sources: the live-site audit (17 Nov 2026), QM-112 v0.5 §2 and §4, QM-103 hosting research (rev. 17 Nov 2026), and the Platform Decision Brief (12 Nov 2026). **Measured** means a test was executed in this project. **Preliminary** means desk research or an assumption.

## 1. External integrations

| System | Real integration in prototype? | Approved sandbox credentials? | Tests executed | Evidence collected | Still blocked |
|---|---|---|---|---|---|
| **HubSpot forms / CRM** | **No.** The contact form simulates submission; no network request is made (verified, QA-22). The live site's forms are **WPForms + reCAPTCHA**; HubSpot is loaded for tracking, chat (portal 4917853) and a meetings link | **No** | Front-end validation and states only (QA-18–QA-22) | Screenshots of each state; 0 outbound POSTs | Form IDs, CRM field mapping, recipient, thank-you flow, spam protection. **Blocked by sandbox access** (QM-112 §7.12 target 20 Nov 2026) |
| **BambooHR careers** | **No.** Links hand off to `qualityworksconsulting.bamboohr.com/careers`. The public list endpoint was read once manually (`totalCount: 0`, 17 Nov 2026) | Not needed for the public list; **no admin access** | Fixture states (QA-27) | 0-roles snapshot; fixture screenshots | Confirmation of current embed/link method and job URLs from the recruiting owner. **Not tested** live |
| **Agents as a Service marketplace** | **No.** 8-agent snapshot plus link-out | No API known | Catalog filter (manual) | Snapshot with provenance | Whether an approved catalog API exists; label definitions (Q-21) |
| **QualityWatcher AI (qualitywatcher.ai)** | Link-out only | No | HTTP probe of 4 tool URLs (17 Nov) | 3 redirect to sign-in; 1 returns 404 | Product-owner confirmation of access model and screenshots |
| **QualityWatcher Test Management, Posture, Clutch** | Link-out only | n/a | Link check (QA-03) | 123 external URLs open safely | Relationship/ownership statements |
| **WordPress content** | One-off read of the public REST API (12 posts) + parse of 17 rendered case-study pages | No admin access | Migration scripts run; parser defect found and fixed | Snapshots in `src/data/migrated/` | Admin export, media/PDF inventory, plugin inventory (QM-112 §7.12) |
| **Analytics (GA4 G-ETXQ16JZXL, Meta pixel, HubSpot tracking)** | **No** tags in the prototype | No | None | Tag IDs observed on live site | Owner, event catalogue, consent model. **Not tested** |
| **Cookie consent** | No | n/a | None | — | Requirement and tool decision |
| **reCAPTCHA / spam protection** | No | No | None | — | Tool choice (QM-112 6.3). **Not tested** |
| **Site search** | No | n/a | None | — | Q-09 |
| **Maturity self-assessment tool** | No (link to live tool) | n/a | None | — | Migrate/rebuild/retire decision |
| **Embedded media (Data Quality video, VocalVideo testimonial)** | No | n/a | None | — | Re-host/caption decision |

**Rule applied:** no part of the prototype claims that a submission reached HubSpot or BambooHR.

## 2. Platform and hosting (preliminary)
- **Prototype architecture:** static site (Astro), no server runtime and no database. This determines hosting fit.
- **QM-103 shortlist for this architecture:** **Netlify** (Git deploys, deploy previews, rollback; Pro US$240/yr base with unlimited members) and **Cloudflare Pages** (free tier within limits). Vercel is a candidate if a server-rendered framework is chosen; Render, or a VPS, if a persistent backend is needed. These are **QM-103 desk-research figures, not quotes or approvals.**
- **Current host:** plan and invoice unverified. The “about US$90/month” figure is a planning clue only (QM-103 §3.7).
- The Platform Decision Brief (12 Nov) proposed testing Framer and Base44. QM-103 (rev. 16–17 Nov) later superseded AI-builder evaluation with a code-first direction. The prototype follows the code-first direction; the platform decision itself remains **open** (QM-112 7.5).

## 3. CMS: unresolved selection
QM-112 §2.6 compares retaining **WordPress** against adopting a **headless CMS**; neither is approved.

| Factor | Retain WordPress (as headless source or theme) | Headless CMS (e.g. Sanity, Contentful, Strapi, Decap) |
|---|---|---|
| Editing | Familiar to marketing; existing content in place | Structured fields match the prototype schemas; training needed |
| Fit with this prototype | Use the REST/GraphQL API as data source; Beaver Builder case-study bodies must be restructured anyway | Map `src/data/types.ts` schemas 1:1 to content models |
| Roles/approval (QM-112 8.1–8.2) | Plugins needed for editorial workflow | Most offer draft/preview/roles natively (plan-dependent) |
| Migration | Lowest for posts; case studies need re-entry | Export/import for all content |
| Ops/security | Plugin and core updates; hosting for PHP | SaaS fee or self-hosting; fewer moving parts on the web host |

**How each content type would be managed (any CMS):**

| Content | Editor action | Source of truth | Prototype schema |
|---|---|---|---|
| Blog posts | Draft to review to publish; dates, author, category, SEO fields | CMS | `Article` |
| Case studies | Structured fields + metric source + **client disclosure approval flag** (hidden until approved) | CMS | `CaseStudy` |
| Events | Start/end/time zone/venue/registration; phase derived automatically | CMS | `EventRecord` |
| Careers | Not edited on the site; read from BambooHR | BambooHR | `Job` |
| Agent catalog | Not edited on the site; marketplace API or link-out | Marketplace | `AgentRecord` |
| Service/industry/product pages | Structured page fields | CMS | `Service`, `Industry`, `Product` |
| Navigation, global CTAs, claims register | Developer-maintained or CMS singleton | Repo or CMS | `navigation.ts`, `site.ts`, `claims.ts` |

## 4. Privacy and security considerations (preliminary)
- The prototype has no secrets or credentials in source, and contains no customer or applicant data. Contact submissions are never transmitted.
- Production needs:
  - HTTPS everywhere, plus HSTS.
  - A Content Security Policy that allows only approved third parties (HubSpot, GA4, consent tool).
  - Consent before analytics or marketing tags.
  - Spam protection on forms.
  - No PII in analytics events or error logs (QM-112 6.5, 10.2).
  - Least-privilege CMS roles.
  - Security headers.
  - Dependency updates.
  - A pre-launch vulnerability scan (QM-112 4.6). **None of this has been tested.**

## 5. Performance (measured locally; not production)
`scripts/perf-local.mjs`, 18 Nov 2026, local `astro preview`, 390×844 viewport:

| Page | Unthrottled LCP | Slow-4G + 4× CPU LCP | CLS | Transfer |
|---|---|---|---|---|
| Home | 148 ms | 780 ms | 0 | 100 KB |
| Test Automation | 68 ms | 608 ms | 0.002 | 63 KB |
| QualityWatcher AI | 112 ms | 736 ms | 0 | 63 KB |
| Case studies | 80 ms | 616 ms | 0.001 | 333–692 KB (images) |
| Contact | 108 ms | 708 ms | 0 | 61 KB |
| “More QA, Not Less” article | 72 ms | 688 ms | 0.001 | 150 KB |

These figures are **within the QM-112 4.3 proposed targets in a local lab setting only.** They exclude CDN, third-party tags (HubSpot, GA4, consent), real network conditions and field data. INP was not measured. A production baseline needs Lighthouse/CrUX on the chosen host with the approved tags.

## 6. Hosting assumptions
The static output can be served from any static host. Previews and rollback are assumed from the QM-103 shortlist, not tested. DNS, email and domain dependencies on the current host are **unknown**.

## 7. Content migration
| Item | State |
|---|---|
| Posts | 12/99 migrated via REST API (titles, dates, author, categories, tags, images, body); 87 remain |
| Case studies | 17/17 parsed from rendered pages (Beaver Builder bodies are not in the API); a truncation defect was fixed 18 Nov |
| Pages | 11 services + 5 industries structured fully; 9 + 5 summary records |
| Media | 29 featured images mirrored and resized; PDFs/downloads not inventoried |
| Editorial corrections | 39 logged corrections applied at build time (doc 11) |

## 8. URL redirects
- See doc 06.
- New in this round: case studies move from `/case-study/{slug}/` to **`/case-studies/{slug}/`**. That needs 17 one-to-one **301** redirects. **Not configured**: there is no server in the prototype.
- `/blog/?_blog_categories=` needs parameter mapping.

## 9. Launch risks
| Risk | Impact | Mitigation |
|---|---|---|
| HubSpot routing unverified | Lost leads | Sandbox test with CRM owner before launch (QM-112 7.12) |
| Unapproved claims or client names published | Legal/reputational | Release gate drops unverified stats; client-disclosure flag; Janique sign-off |
| URL changes without 301s | Lost search equity | Redirect map + crawl test (QM-112 9.5, 11.5) |
| Analytics/consent gap at cutover | Reporting loss or privacy breach | Event catalogue + consent tool before launch |
| CMS chosen late | Rework of templates | Schemas already CMS-agnostic; decide before build |
| Single maintainer / no company repo | Bus factor | Establish company repo and CI first |
| Third-party scripts degrade performance | Slower pages | Measure with tags on preview host |
