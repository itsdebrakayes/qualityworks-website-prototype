---
title: "05 · SEO and AEO template requirements"
summary: "Per-template metadata, structured data, indexing and answer-engine rules."
---

# SEO and AEO template requirements

## 1. Global rules (implemented in `BaseLayout.astro`)
- Unique `<title>` (at most  60 chars where possible) and meta description (120–160 chars). QA-05 checks for duplicates across all 84 routes.
- `rel=canonical` = `https://qualityworkscg.com` + preserved path (trailing slash kept, matching WordPress).
- One `<h1>` per page and no skipped levels (QA-01). Decorative headings are not used for styling.
- Open Graph (`og:type/title/description/url/image/site_name`) and Twitter card on every page; articles add `article:published_time`, `modified_time`, `author`, `section`.
- **Prototype is `noindex, nofollow`.** The intended production directive per page is emitted as `<meta name="qw:production-robots">` so it can be reviewed.
- Breadcrumbs: visible trail plus `BreadcrumbList` JSON-LD from the **same** data.
- Images: descriptive `alt` for content images; `alt=""` for decorative card thumbnails next to a visible title; explicit `width`/`height`; `loading="lazy"` below the fold.
- Performance: static HTML, self-hosted variable fonts (one preloaded), ~10 KB JS for menus/filters/forms, no third-party scripts in the prototype. Production analytics must load after consent.
- XML sitemap: all `index` pages; exclude `/thank-you/`, `/prototype/*`, `/design-system/`, 404 and fixture routes.

## 2. Per template

| Template | Title pattern | Structured data (only when visibly supported) | Indexing | Breadcrumb | Notes |
|---|---|---|---|---|---|
| Home | `QualityWorks Consulting Group \| Software Quality, Custom Software & AI` | `Organization` (name, url, logo, founding date, email, phone, sameAs) | index | — | One H1 (“Engineered for Excellence”); 3 pathways as crawlable links |
| Solutions overview | `Solutions: … \| QualityWorks` | BreadcrumbList | index | Yes | Problem-to-service table = answer-first content |
| Service detail | `{Service} Services \| QualityWorks` | `Service` (provider = Organization), `FAQPage` if FAQ shown | index | Yes | “At a glance” states problem + audience in text |
| Product (QW, AaaS, PRISM) | `{Product}: {what it does} \| QualityWorks` | `FAQPage` if FAQ shown. **No `SoftwareApplication`/`Offer`/rating** until pricing and availability are approved | index (PRISM: index after owner content) | Yes | Availability stated as observed, never assumed |
| Industry | `Software Quality for {Industry} \| QualityWorks` | BreadcrumbList | index; proposed pages: noindex until approved | Yes | Each page has unique challenge copy |
| Case-study list | `Case Studies: … \| QualityWorks` | BreadcrumbList | index | Yes | Filtered states use `?industry=` query; canonical stays on the base URL |
| Case-study detail | `{Title} \| QualityWorks Case Study` | BreadcrumbList (Article optional after client approval) | index only if `clientDisclosureApproved` | Yes | Metrics in text with context |
| Resources / Blog list | `Blog: … \| QualityWorks` | BreadcrumbList | index; paginated pages self-canonical | Yes | |
| Article | `{Title} \| QualityWorks` | `BlogPosting` / `NewsArticle` (headline, dates, author Person, publisher) | index | Yes | Updated date shown when different |
| Events list/detail | `{Event} \| QualityWorks Events` | `Event` with `eventStatus` (Scheduled/Cancelled) and attendance mode, only with confirmed dates | index; fixtures noindex | Yes | Past events stay as archive (no registration) |
| Contact / Careers / About | as built | Organization (home only) | index | Yes | `JobPosting` only when BambooHR jobs are live and complete |
| Legal, thank-you, 404 | | none | thank-you & 404 noindex | | |

## 3. Answer Engine Optimization (AEO)
1. **Answer-first openings.** Every service/product hero lede states *what it is, for whom, outcome* in one or two sentences. The “At a glance” box repeats problem and audience as plain text.
2. **Consistent entity naming.** “QualityWorks Consulting Group” (organization), “QualityWorks” (short), “QualityWatcher AI” (AI tools, qualitywatcher.ai), “QualityWatcher” (test management, qualitywatcher.com), “Agents as a Service”, “PRISM™ (Performance & Reasoning Intelligence Scoring Method)”. One name per thing; navigation, headings and schema use the same names.
3. **Explicit relationships.** Service / industry / case study / product links are data-driven (`related*` fields), so each topic page links to its evidence and neighbours with descriptive anchor text (no “click here”).
4. **Factual FAQs only**, written from verified copy. Each FAQ item carries provenance; `FAQPage` markup is emitted only on pages that show the FAQ.
5. **Traceable claims.** Numbers appear as text (not images) with a claim ID, measurement context and source URL in the register.
6. **Disambiguation content.** The products overview, the AaaS-vs-custom comparison table and the solutions problem-guide answer the questions AI assistants are asked (“Which QualityWorks product…?”, “Do I need a custom agent?”).
7. **Author and date metadata** on all articles (visible and in schema).
8. **No** fabricated reviews, `AggregateRating`, unsupported awards, FAQ stuffing or availability claims.
