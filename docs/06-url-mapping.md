---
title: "06 · URL mapping and redirects"
summary: "Which addresses stay, which are new, and which need approved 301s."
---

# URL mapping and redirect strategy

**Principle:** preserve every indexed URL. The prototype keeps the WordPress path structure: trailing slash, `/services/…`, `/industries/…`, `/case-study/{slug}/` and root-level blog slugs. **All 42 live page URLs, all 17 case-study URLs and the 12 migrated post URLs resolve unchanged in the prototype build** (verified against `dist/`). No redirect is required for the proposed information architecture.

## 1. Pages (42 / 42 unchanged)

| Existing URL | New URL | Status | Redirect |
|---|---|---|---|
| `/` | `/` | Unchanged (built in prototype) | None |
| `/about-us/` | `/about-us/` | Unchanged (built in prototype) | None |
| `/blog/` | `/blog/` | Unchanged (built in prototype) | None |
| `/careers/` | `/careers/` | Unchanged (built in prototype) | None |
| `/case-studies/` | `/case-studies/` | Unchanged (built in prototype) | None |
| `/contact-us/` | `/contact-us/` | Unchanged (built in prototype) | None |
| `/engagement-models/` | `/engagement-models/` | Unchanged (built in prototype) | None |
| `/engagement-models/consulting-training/` | `/engagement-models/consulting-training/` | Unchanged (built in prototype) | None |
| `/engagement-models/dedicated-teams/` | `/engagement-models/dedicated-teams/` | Unchanged (built in prototype) | None |
| `/engagement-models/staff-augmentation/` | `/engagement-models/staff-augmentation/` | Unchanged (built in prototype) | None |
| `/industries/` | `/industries/` | Unchanged (built in prototype) | None |
| `/industries/finance-banking/` | `/industries/finance-banking/` | Unchanged (built in prototype) | None |
| `/industries/healthcare/` | `/industries/healthcare/` | Unchanged (built in prototype) | None |
| `/industries/insurance/` | `/industries/insurance/` | Unchanged (built in prototype) | None |
| `/industries/logistics/` | `/industries/logistics/` | Unchanged (built in prototype) | None |
| `/industries/media-entertainment/` | `/industries/media-entertainment/` | Unchanged (built in prototype) | None |
| `/industries/retail/` | `/industries/retail/` | Unchanged (built in prototype) | None |
| `/industries/social-impact/` | `/industries/social-impact/` | Unchanged (built in prototype) | None |
| `/industries/technology/` | `/industries/technology/` | Unchanged (built in prototype) | None |
| `/innovation-tourism/` | `/innovation-tourism/` | Unchanged (built in prototype) | None |
| `/maturity-assessments/` | `/maturity-assessments/` | Unchanged (built in prototype) | None |
| `/privacy-policy/` | `/privacy-policy/` | Unchanged (built in prototype) | None |
| `/qualitywatcher-ai-tools/` | `/qualitywatcher-ai-tools/` | Unchanged (built in prototype) | None |
| `/services/` | `/services/` | Unchanged (built in prototype) | None |
| `/services/accessibility/` | `/services/accessibility/` | Unchanged (built in prototype) | None |
| `/services/ai-governance/` | `/services/ai-governance/` | Unchanged (built in prototype) | None |
| `/services/ai-service/` | `/services/ai-service/` | Unchanged (built in prototype) | None |
| `/services/ai-test-squad/` | `/services/ai-test-squad/` | Unchanged (built in prototype) | None |
| `/services/api-cloud-services-testing/` | `/services/api-cloud-services-testing/` | Unchanged (built in prototype) | None |
| `/services/custom-software-development/` | `/services/custom-software-development/` | Unchanged (built in prototype) | None |
| `/services/data-quality/` | `/services/data-quality/` | Unchanged (built in prototype) | None |
| `/services/digital-agile-transformation/` | `/services/digital-agile-transformation/` | Unchanged (built in prototype) | None |
| `/services/full-stack-testing/` | `/services/full-stack-testing/` | Unchanged (built in prototype) | None |
| `/services/non-functional-testing/` | `/services/non-functional-testing/` | Unchanged (built in prototype) | None |
| `/services/performance-testing/` | `/services/performance-testing/` | Unchanged (built in prototype) | None |
| `/services/security-testing/` | `/services/security-testing/` | Unchanged (built in prototype) | None |
| `/services/technology-advisory-partnership/` | `/services/technology-advisory-partnership/` | Unchanged (built in prototype) | None |
| `/services/test-automation/` | `/services/test-automation/` | Unchanged (built in prototype) | None |
| `/services/user-experience-testing/` | `/services/user-experience-testing/` | Unchanged (built in prototype) | None |
| `/services/web-mobile-application-testing/` | `/services/web-mobile-application-testing/` | Unchanged (built in prototype) | None |
| `/terms-conditions/` | `/terms-conditions/` | Unchanged (built in prototype) | None |
| `/thank-you/` | `/thank-you/` | Keep (noindex); non-JS fallback | None |
## 2. Collections

| Pattern | Count | New pattern | Redirect |
|---|---|---|---|
| `/case-study/{slug}/` | 17 | unchanged | none |
| `/{post-slug}/` (blog) | 99 | unchanged (root-level article route) | none; reserved-slug check required so a post slug never collides with a page route |
| `/blog/?_blog_categories={cat}` | used by service pages | `/blog/?category={Category}` | **301 with query mapping** (or support both parameters) |
| `/blog/page/{n}/` | WordPress pagination | `/blog/page/{n}/` | keep |
| `/category/{slug}/`, `/tag/{slug}/` (in sitemap index) | many | decision Q-11: keep thin archives (noindex) or 301 to `/blog/?category=` | **approval needed** |
| `/feed/`, `/comments/feed/` | 2 | RSS at `/feed/` (generate) | keep `/feed/`; 301 `/comments/feed/` to `/blog/` |
| `/wp-content/uploads/*` | media | CDN/media path TBD | **301 or keep path**; many external backlinks point to PDFs/images |
| `/xmlrpc.php`, `/wp-json/*`, `/wp-admin/*` | — | none | 410 / not served |
| `/sitemap_index.xml`, `*-sitemap1.xml` | 6 | `/sitemap-index.xml` | 301 old sitemap URLs to new index; resubmit in Search Console |

## 3. New routes (proposed, need QM-41 approval)
`/products/`, `/products/agents-as-a-service/`, `/products/prism/`, `/industries/public-sector/`, `/industries/small-business/`, `/resources/`, `/events/`, `/events/{slug}/`. None replace an existing URL.

## 4. Redirect implementation requirements
- Server-level 301s (hosting-agnostic map file, e.g. `_redirects` or nginx map); one hop only; preserve query strings except mapped ones.
- Before launch: crawl the old site, compare with the new route list, and fail the release if any 200 URL lacks either a matching route or a 301.
- After launch: monitor 404s for 30 days; keep the redirect map in the repo.
