---
title: "09 · Assumptions, open questions and dependencies"
summary: "Prioritised decisions needed from stakeholders before development."
---

# Assumptions, open questions and production dependencies

## 1. Assumptions made (to be confirmed)
| ID | Assumption | Why |
|---|---|---|
| AS-1 | The live header structure approximates QM-41; top-level labels are *Solutions, Products & Innovations, Who We Help, Results, Resources, Company* | QM-41 inaccessible |
| AS-2 | Existing URLs must be preserved (incl. `/services/` despite the “Solutions” label) | SEO risk; brief §10 |
| AS-3 | Prototype stack: **Astro 5 (static), TypeScript data files, plain CSS with custom properties**; no framework had been approved | No repo or technical decision found. Components are framework-neutral HTML/CSS/JS and port easily to Next.js, Nuxt or a CMS theme |
| AS-4 | Red Hat Display is the approved corporate typeface (Typekit `area-normal` and `nexa-rust` are loaded but not visibly used) | Computed styles |
| AS-5 | Text published on the live site may be shown in the prototype but is **not approved** for the rebuild | Brief §9 |
| AS-6 | Agents marketplace and qualitywatcher.ai remain separate platforms; the corporate site links to them | Separate codebases observed |

## 2. Open questions, prioritised

| Priority | ID | Question | Owner | Blocks |
|---|---|---|---|---|
| **P1** | Q-01 | Provide access to **QM-41** and **QM-113** (Jira). QM-112 v0.5 and QM-103 were read on 18 Nov 2026 | PM | Nav labels |
| **P1** | Q-02 | Approve or correct claims **C01–C04** (90%, $30M, 80%, 16+): definition, sample, period | Leadership | Homepage stats |
| **P1** | Q-03 | Form backend: keep **WPForms** behaviour, move to **HubSpot Forms**, or other? Who receives leads? reCAPTCHA vs. alternative? | Marketing / IT | Contact integration |
| **P1** | Q-05 | Client disclosure approval for each of the 17 named case-study clients and 3 testimonial authors | Marketing / Legal | Case studies, testimonials |
| **P1** | Q-06 | QualityWatcher AI tools: current access model (sign-in only? free tier?), Schema-to-API status, approved screenshots | QW product owner | QW page |
| **P1** | Q-07 | Public-sector evidence: WBE/MBE/WOSB certificates (issuer, number, expiry), NAICS codes, contract vehicles, capability statement PDF. Confirm how to describe the U.S. Navy challenge prize | Leadership / BD | Public-sector page |
| **P1** | Q-08 | Correct phone numbers (A-06, A-07) | Operations | Header/footer/contact |
| **P1** | Q-21 | Review round 1 approvals: service rename “AI-powered testing”; corrected award name in the published Navy post title; article wording edits R-03–R-20; PRISM topic “AI-Augmented Testing”; “Book a consultation” | Janique | Release |
| **P1** | Q-22 | WSSC pilot report (methodology, sample) if any WSSC figure should be reinstated | Marketing / WSSC | Case study |
| **P1** | Q-23 | iPipelines: client disclosure decision; if not approved, rename the slug (currently contains the client name) and add a 301 | Marketing / Legal | Case study URL |
| P2 | Q-24 | Gartner forecast: supply verified wording and date, or delete the orphaned reference entry in “More QA, Not Less” | Content | Article |
| P2 | Q-25 | Agents marketplace: definitions of Ready now / Quick launch / Custom build and what Guided Preview shows | AaaS owner | AaaS page |
| P2 | Q-26 | “Black-owned, woman-led”: approved capitalisation and placement | Janique | About/Home |
| P2 | Q-27 | Company repository and preview host for the handoff (README “Not yet established”) | Technical lead | Handoff |
| P2 | Q-04 | Choose CMS (headless vs. WordPress-as-headless) and owner for each content type | Dev lead | Data integration |
| P2 | Q-09 | Site search: required at launch? (Pagefind static search recommended) | PM | Header |
| P2 | Q-10 | Analytics and consent: GA4, Meta pixel, HubSpot tracking/chat; cookie-consent requirement and regions | Marketing / Legal | Launch |
| P2 | Q-11 | Category/tag archives: keep (noindex) or redirect | SEO | Redirect map |
| P2 | Q-12 | PRISM: publish dimension list? Engagement model? Whitepaper file and gating | PRISM owner | PRISM page |
| P2 | Q-13 | Agents as a Service: approve corporate page; is there a marketplace API for catalog data; should prices ever appear on the corporate site? | AaaS owner | AaaS page |
| P2 | Q-14 | Add AI Test Squad, Digital & Agile, AI Governance to navigation (currently orphan/landing pages)? | PM | Nav |
| P2 | Q-15 | Approve proposed pages: Products overview, Public Sector, SMB, Resources hub, Events | PM | IA |
| P2 | Q-16 | Maturity self-assessment tool: migrate, rebuild, or retire | Product | `/maturity-assessments/` |
| P3 | Q-17 | Leadership bios/photos; “How we protect your data” copy; community logos | HR / Security | About |
| P3 | Q-18 | Glyph normalisation rules (doc 04 §11) acceptable for migrated articles? | Content | Articles |
| P3 | Q-19 | Response-time commitment for inquiries (deliberately omitted) | Sales | Contact |
| P3 | Q-20 | Event dates for BOW Growth Conference 2026 and NTC 2025 | Marketing | Events |

## 3. Production dependencies (not done in the prototype)
| ID | Dependency |
|---|---|
| D-01 | Hosting choice (QM-103 conditional research not reviewed). Static output deploys to any host or CDN |
| D-02 | CMS setup and full content migration (99 posts, 17 case studies, 9 summary service pages, 5 summary industry pages) |
| D-03 | Form endpoint + CRM integration + spam protection; authorised test access |
| D-04 | BambooHR job list integration (public list endpoint) with caching and error fallback |
| D-05 | Agent catalog API or link-out decision |
| D-06 | Redirect map, sitemap generation, Search Console resubmission |
| D-07 | Consent management + analytics |
| D-08 | Site search |
| D-09 | Manual accessibility testing with screen readers (NVDA, VoiceOver iOS/macOS) and a keyboard-only pass |
| D-10 | Approved photography and product screenshots (replace migrated stock images) |
| D-11 | Daily rebuild (or SSR) so event and job states stay current |
