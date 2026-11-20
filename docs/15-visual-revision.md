---
title: "15 · Visual revision (people, brand colours, typography)"
summary: "Change log for Janique's visual feedback: people-focused headers, Brand Guidelines v1.0 colours, Montserrat + Lato, QA evidence and open decisions."
---

# Visual revision — change log (20 Nov 2026)

**Scope:** a targeted visual refinement of the existing prototype in response to Janique's feedback. Page structures, navigation, buyer journeys, CTAs, copy, claim restrictions, migrated-content corrections, client-confidentiality protections, release gates, routing, integration status and the Review hub are unchanged unless listed below. Nothing was deployed to production.

**Sources used**

| Source | What it gave us | Status |
|---|---|---|
| *QualityWorks Brand Guidelines v1.0 — for Partners* (HTML, supplied by marketing on 20 Nov 2026) | Colour palette, slate canvas, text-on-slate greys, state colours, gradient rule, Montserrat + Lato type system and scale, radii, 1120px content width, logo files and logo rules, tagline rule | **Primary source.** The guide is marked "Confidential — for partner use only", so it is **not** committed to this repository; only the values the website itself exposes are recorded here |
| *QUALITYWORKS BRAND 2023.pdf* (shared drive) | Montserrat; colours `#299FAE`, `#113C61`, `#E1FBFF`, `#8CC340` | **Superseded** by v1.0 (older, and its navy and green do not appear in v1.0). Recorded as a conflict in §6 |
| Live site `qualityworkscg.com` (page-title backgrounds and industry feature images) | People photographs for headers | Reused (licence to be confirmed, §6) |

No earlier "existing prototype" with people-featuring headers was found in the project, the shared drive or the conversation history. The closest match to Janique's description is the **live site's own page headers**, which are full-width photographs of people; those images are what this revision brings over. If Janique meant a different prototype, it is a required input (§6).

---

## 1. Homepage hero and people-focused imagery

**Before:** a dark ink gradient with a concentric-ring motif and a faint grid (no people). This is what read as "AI-generated".

**After:**
- The homepage hero is a **photograph of two people working through a technical problem at a workstation** (`home-mentoring`, originally `AdobeStock_507970416` on the live site, 2560px source → 800/1600/2400px WebP).
- **Desktop (≥ 1100px):** the photo fills the hero; a slate-900 scrim sits behind the copy (solid to 38% of the width, ≥ 92% to 50%) and fades out toward the people on the right. Text never depends on the photo for contrast (measured in §5).
- **Tablet and mobile (< 1100px):** the photo is a 16:9 band **above** the copy, so text never covers faces.
- H1, lede, both CTAs, the company facts and the three pathway cards are unchanged and still above the fold at 1440 × 900 (AC-HOME-1, QA-16).
- The concentric-ring motifs (homepage hero, inner-page heroes, CTA band) and the grid overlay on corporate heroes were removed. The fine grid stays only on the **product** layer (QualityWatcher, Agents as a Service, PRISM), where it signals product UI.
- All photographs are listed with source URL, crop focus, alt text and licence status in `src/data/peopleImagery.ts`. They are **not presented as QualityWorks employees or clients**; alt text describes what is visible ("two colleagues review code"), never "our team".

## 2. Brand colours (Brand Guidelines v1.0)

### Approved values now in `src/styles/tokens.css`

| Guide name | Hex | Token | Role on the site |
|---|---|---|---|
| Green | `#2CAF81` | `--qw-green-500` | Primary accent; accent and focus ring on dark; button hover |
| Teal | `#29A59A` | `--qw-teal-500` | Wordmark, primary buttons (with slate-900 text), links/eyebrows on dark |
| Blue | `#289DAD` | `--qw-blue-500` | Cool accent; gradient end |
| Mint | `#ECF7F6` | `--qw-mint-50` | The one light surface: inner-page heroes, alternate sections, info alerts |
| Brand signature | `linear-gradient(95deg, #2CAF81 0%, #29A59A 52%, #289DAD 100%)` | `--qw-gradient` | One short rule per page (hero) |
| Slate 900 | `#222B37` | `--qw-slate-900` | Dark sections, footer, hero scrim; headings on light |
| Slate 850 | `#2B3540` | `--qw-slate-850` | Cards on dark |
| Slate 800 | `#36414F` | `--qw-slate-800` | Header; CTA band; body text on light |
| Slate 700 | `#424D5B` | `--qw-slate-700` | Raised surfaces on dark |
| Slate 950 (guide stylesheet) | `#1A212B` | `--qw-slate-950` | Product layer |
| Text on slate | `#FFFFFF` / `#E7ECEF` / `#AEB8C1` / `#7F8A96` | `--qw-white`, `--qw-ink-1/2/3` | Headings / body / muted / captions on dark |
| Light-page text (guide stylesheet) | `#4A5663` lead, `#5A6673` muted, `#DDE4E6` hairline | `--qw-text-lead`, `--qw-muted`, `--qw-line` | Light-surface text and borders |
| State | `#2CB07E` / `#E8B34A` / `#E2624E` | `--qw-caution` (caution used) | Status indicators only |

### Before → after

| Role | Before | After |
|---|---|---|
| Dark sections / footer | ink `#16202B` | slate 900 `#222B37` |
| Header | ink `#16202B` | slate 800 `#36414F` (matches the supplied teal wordmark) |
| Product surface | `#0E1817` | slate 950 `#1A212B` |
| Brand teal | logo teal `#289DAD` | Teal `#29A59A` (`#289DAD` kept as Blue, gradient end) |
| Green accent | logo green `#8FC640` | Green `#2CAF81` |
| Light surface | canvas `#F4F7F7`, teal tint `#E9F6F7` | Mint `#ECF7F6` |
| Primary button | white on `#1B7480` | slate 900 on Teal `#29A59A` (4.73:1); hover Green `#2CAF81` (5.14:1) |
| Links / eyebrows on light | `#1B7480` | derived teal-700 `#1D766F` (5.42:1 white, 4.96:1 mint) |
| Links on dark | `#5FC3CF` | Teal `#29A59A` (4.73:1 on slate 900) |
| Body text on light | `#36414F` | `#36414F` (unchanged; = Slate 800) |
| Headings on light | `#16202B` | slate 900 `#222B37` |
| Muted text on light | `#5A6675` | `#5A6673` |
| Muted text on dark | `#9AA7B4` | `#AEB8C1` |
| Hairline | `#DCE3E6` | `#DDE4E6` |
| Highlight / event status | gold `#F4B942` | caution `#E8B34A` |
| CTA band | gradient `#16202B → #123C44` + rings | solid slate 800 |

**Derived shades (not in the guide; pending confirmation):** `--qw-teal-700 #1D766F` and `--qw-teal-800 #18625C` (the guide's teal and its own light-page eyebrow colour `#1F8D84` are 3.02:1 and 4.04:1 on white, below AA for small text), and `--qw-mint-200 #C9E8E5` (border tint). Accessible feedback colours (`#B42318`, `#B45309`, `#2F7A3E`) remain for form errors and badges because the guide's state swatches fail as text on white. Review-only annotation colours (amber) are unchanged.

**Logo:** the header now uses the guide's **primary lockup (teal wordmark on Slate 800)**; the footer and mobile drawer use the **white reversed wordmark**; files are the guide's own (`public/brand/qualityworks-wordmark-teal-on-slate.jpg`, `qualityworks-wordmark-white.png`, `qualityworks-symbol-white.png`), trimmed of empty margin only. The previous two-tone teal/green logo is no longer used, because the guide allows "teal, white, or single-colour black only".

## 3. Typography

- **Display: Montserrat** (variable, 300–800) for every heading, card title, button, eyebrow, navigation item, form label, badge and component title/label. **Body: Lato** (400, 700, 400 italic) for paragraph copy, captions and form input text. This is the split the Brand Guidelines v1.0 specify. Janique's statement that "Montserrat is the brand font" is consistent with it (Montserrat is the brand display face); the open question is in §6.
- Defined **once** in `src/styles/tokens.css`: `--font-display` and `--font-body` (`--font-sans` aliases the body face; `--font-mono` aliases display for labels). No component names a font family. Switching body text to Montserrat is a one-line change (`--font-body: var(--font-display)`).
- Self-hosted WOFF2 (Google Fonts, SIL OFL), latin + latin-ext subsets, `font-display: swap`; Montserrat and Lato latin files are preloaded. **Red Hat Display and Red Hat Mono were removed** (files and references). Code samples use the system monospace stack.
- Scale aligned to the guide: H1 up to 56px/800 on the homepage (guide cover 54px), page H1 up to 44px/800 (D1), section H2 up to 30px (D2), card titles 22px/700, eyebrows 13px/700 uppercase with 0.16em tracking, body 17px/1.6, captions 13px. Container 1120px; radii 6/12/18px + pill.
- `scripts/glyph-lint.mjs` now requires every visible character to be covered by **both** Montserrat and Lato; QA-09 checks in Chromium that every glyph is drawn by Montserrat or Lato. The tagline is set as **"Engineered for Excellence."** (guide: title case, always with the period).

## 4. Page headers revised

| Page | Change |
|---|---|
| Homepage | Full-width people photograph (see §1) |
| About Us | Header photo: colleagues working through a problem (`about-team`) |
| Careers | Header photo: two colleagues at a laptop (`careers-colleagues`) |
| Services overview | Header photo: two engineers at a screen (`services-pair`, the live homepage hero) |
| Contact Us | Photo in the left column on desktop only (`contact-team`); phones keep the form near the top |
| Industries: Finance & Banking, Healthcare, Social Impact, Insurance, Logistics, Retail, Technology | Header photo from the matching live-site industry image (`heroImage` in `src/data/industries.ts`) |
| All inner pages | Mint hero surface, brand gradient rule, no ring motif |

**Deliberately unchanged:** product pages (QualityWatcher AI, Agents as a Service, PRISM) keep the product surface and product preview; case-study pages keep their own case-study image; service detail pages keep the "At a glance" panel (adding a stock photo would not help a buyer compare services); articles keep their featured images. Public Sector, Small Business and Media & Entertainment have no suitable people photo on the live site (text header kept; see §6).

## 5. QA performed (20 Nov 2026)

| Check | Result |
|---|---|
| `npm run build` | 102 pages (doc 15 added); glyph lint clean (Montserrat + Lato); data integrity check clean; 18 redirect rules (pending host) |
| `npm run qa:checks` (Playwright + axe-core) | **35 pass, 0 fail, 2 blocked** (QA-31 HubSpot, QA-32 screen reader: no access in this environment). Two failures found during the revision were fixed: button text contrast in the header CTA, teal text on translucent dark cards (QA-08), and a 38px overflow at 360px on Contact (QA-07) |
| QA-09 fonts in a real browser | Every glyph on 8 representative pages drawn by Montserrat or Lato |
| Hero text over photo (pixel-sampled worst case behind each text element, 1100/1280/1440/1920px) | Eyebrow ≥ 4.66:1, H1 ≥ 12.99:1, lede ≥ 7.25:1, facts ≥ 6.67:1 |
| Old-palette scan of built CSS/HTML | 0 occurrences of `#16202B`, `#8FC640`, `#F4B942`, `#5FC3CF`, `#1B7480`, `#0E1817`, canvas/tint greys; 0 references to Red Hat |
| Visual review | Desktop 1440, tablet 820, mobile 390 for Home, About, Careers, Contact, Services, Test Automation, Finance & Banking, Case Studies, fintech case study, QualityWatcher AI, Agents as a Service; homepage also at 1100, 1280, 1920; mega-menu, mobile drawer and footer. Logged as MQ-25 to MQ-28 in doc 07 |
| `npm run check:content` | Marketing 0, source 0 (review documents informational only) |
| `npm run build:release` | Fails by design (doc 12 launch blockers); no new blocker types |

Not verified: Safari, Firefox and Edge rendering (MQ-20 still open); real-device testing; screen-reader walkthrough.

## 6. Missing assets, conflicts and decisions for Janique

| # | Item | Needed from |
|---|---|---|
| V-1 | **Body typeface.** The v1.0 guide specifies Montserrat for display and Lato for body; the brief said "Montserrat for body text too". The prototype follows the guide. Confirm, or approve Montserrat everywhere (one-token change) | Janique |
| V-2 | **Derived accessibility shades** `#1D766F` / `#18625C` (teal text on light) and the use of slate-900 text on Teal buttons instead of white | Janique / brand owner |
| V-3 | **Colour role mapping.** The guide gives swatches and short roles; mapping to header, sections, buttons and light surfaces (table in §2) is our interpretation | Janique |
| V-4 | **2023 brand PDF conflict.** It lists `#113C61` navy, `#299FAE`, `#E1FBFF`, `#8CC340`. The prototype treats v1.0 as current; confirm the 2023 palette is retired | Janique |
| V-5 | **Photo licences.** All header photos are stock-style images already on qualityworkscg.com (several are Adobe Stock). Confirm the licence covers reuse on the rebuilt site (docs/09 Q-29) | Marketing / licence owner |
| V-6 | **Authentic team photography (required asset).** Recommended replacements: QualityWorks team collaborating (Kingston and LA), consultants with clients, a leadership portrait set, and photos for Public Sector, Small Business and Media & Entertainment headers. Until then no person is presented as an employee | Marketing |
| V-7 | **"Existing prototype" reference.** Not found. If Janique meant a specific prototype or file, please share it | Janique |
| V-8 | **Tagline punctuation.** H1 now reads "Engineered for Excellence." per the guide's rule; confirm | Janique |
| V-9 | **Guide copy conflicts (not applied).** The guide's on-brand example and service list use "autonomous testing", which round 1 removed. The prototype keeps the approved round-1 wording | Janique |
| V-10 | **Wordmark file format.** The supplied teal wordmark is a JPG with the Slate 800 background built in, so it only works on Slate 800. A transparent SVG/PNG master is needed for production | Brand owner |
