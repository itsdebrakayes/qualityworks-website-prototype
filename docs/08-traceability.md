---
title: "08 · Requirement-to-prototype traceability"
summary: "Each brief requirement mapped to the prototype screen, implementation and evidence."
---

# Requirement-to-prototype traceability

**QM-112 AC IDs could not be retrieved** (document returned 401). Requirements are identified by **QM-113 brief section (`BR-x.y`)**. The *QM-112 AC* column is left for the BA to complete. *Evidence* refers to QA test IDs in doc 07 and screenshots in `qa-output/evidence/`.

| Req ID | Requirement (brief) | QM-112 AC | Prototype screen | Implementation | Status | Evidence |
|---|---|---|---|---|---|---|
| BR-4 | Site audit + inventory table | _tbd_ | /prototype/01-audit/ | docs/01-audit.md | Done (QM-112/QM-41 not verified) | Crawl scripts in `scripts/` |
| BR-3 | Unified design direction, tokens | _tbd_ | /design-system/, /prototype/02-design-direction/ | tokens.css, global.css | Done | QA-08, QA-09 |
| BR-5 | Global header: logo, mega-menu, CTA, active state, keyboard, mobile from same data, no disappearing dropdown | _tbd_ | All pages | Header.astro, navigation.ts | Done | QA-10–QA-15 |
| BR-5 | Global footer, same everywhere | _tbd_ | All pages | Footer.astro (derived from navigation.ts) | Done | QA-02 |
| BR-6 | Personas, journeys, per-page persona/CTA | _tbd_ | /prototype/03-page-map-personas/ | Page header comments + doc 03 | Done | Journeys clickable |
| BR-7.1 | Homepage sections, two CTAs to different destinations, three pathways, featured content with fallback, traceable numbers, mobile | _tbd_ | / | pages/index.astro | Done | QA-16, QA-17, QA-07 |
| BR-7.2 | Solutions overview w/ problem, value, icon, CTA | _tbd_ | /services/ | ServiceCard, problem guide table | Done | QA-02 |
| BR-7.3 | Reusable service template (hero…FAQ, conversion) | _tbd_ | /services/test-automation/ (+16) | ServiceTemplate.astro | Done (11 full, 9 summary records) | QA-01, QA-28 |
| BR-7.4 | QualityWatcher AI: product-forward, tool status confirmed, human review, FAQ | _tbd_ | /qualitywatcher-ai-tools/ | qwTools with observed status | Done; tool availability **owner to confirm** | QA-03 |
| BR-7.5 | Agents as a Service: what/problems/vs consulting/catalog/steps/hand-off; data model | _tbd_ | /products/agents-as-a-service/ | AgentRecord snapshot, comparison, filter | Done (prices intentionally hidden) | doc 04 §3 |
| BR-7.6 | PRISM template without assumed capabilities | _tbd_ | /products/prism/ | Wireframe modules + decisions | Done (content blocked on owner) | — |
| BR-7.7 | Industry/audience templates, not name-swaps; public sector, enterprise, SMB | _tbd_ | /industries/*, public-sector, small-business | industries.ts | Done (5 full, 5 summary) | — |
| BR-7.8 | Case-study list + filters (industry, service, combined, clear, no results, loading/error) + detail | _tbd_ | /case-studies/, /case-study/* | FilterBar + lib/filters.ts | Done (loading/error **simulated**) | QA-23, QA-24 |
| BR-7.9 | Resource hub with consistent cards and filters | _tbd_ | /resources/, /blog/ | ArticleCard, EventCard, chips | Done | QA-25 |
| BR-7.10 | Article template: author, dates, image, headings, references, related, CTA, share metadata, canonical | _tbd_ | /{post-slug}/ (12) | pages/[slug].astro, migrate-wordpress.mjs | Done | QA-01, QA-06 |
| BR-7.11 | Events list/detail; upcoming/past/cancelled distinct; no expired registration | _tbd_ | /events/, /events/* | eventPhase(), canRegister() | Done | QA-26 |
| BR-7.12 | Contact: fields, required, accessible errors, empty/invalid/missing/loading/success/error/consent; no real submission | _tbd_ | /contact-us/ | ContactForm.astro | Done (**mocked** submission) | QA-18–QA-22 |
| BR-7.13 | Careers + BambooHR hand-off; available/none/expired/unavailable; no résumés | _tbd_ | /careers/ | jobs.ts, state control | Done (API not integrated) | QA-27 |
| BR-7.14 | Company/About with approved content only | _tbd_ | /about-us/ | team.ts + wireframes for missing | Done (leadership blocked) | — |
| BR-8 | Component system + shared tokens | _tbd_ | /design-system/ | 28 inventory entries | Done | — |
| BR-9 | Structured content schemas, provenance, mock boundaries | _tbd_ | /prototype/04-content-schemas/ | types.ts, provenance on every record | Done | Review annotations toggle |
| BR-10 | SEO & AEO per template; URL mapping | _tbd_ | /prototype/05-seo-aeo/, /prototype/06-url-mapping/ | BaseLayout, lib/schema.ts | Done | QA-01, QA-05, QA-06 |
| BR-11 | Responsive 360/768/1024/1440, 200% zoom, reduced motion | _tbd_ | All | fluid tokens; `min-width:0` grid rule | Done | QA-07-*, QA-29 |
| BR-12 | WCAG 2.2 AA fundamentals | _tbd_ | All | semantic HTML, focus, labels, live regions | Automated pass; **manual AT pending** | QA-08, QA-12, QA-14, QA-32 |
| BR-13 | Functional interactions; no decorative dead buttons | _tbd_ | All | — | Done | QA-02, QA-10–QA-29 |
| BR-14 | Code-first, maintainable, no credentials, build docs | _tbd_ | repo | Astro 5 static, README | Done | `npm run build` |
| BR-15/17 | QA summary, typography to the last character | _tbd_ | /prototype/07-qa-testing-summary/ | qa-checks.mjs, glyph normalisation | Done | QA-09 |
| BR-16 | Developer story examples (not Jira tickets) | _tbd_ | /prototype/10-acceptance-criteria/ | docs/10 | Done | — |
| BR-19 | Open questions, assumptions | _tbd_ | /prototype/09-open-questions/ | docs/09 | Done | — |
