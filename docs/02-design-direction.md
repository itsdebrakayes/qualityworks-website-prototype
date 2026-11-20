---
title: "02 · Design direction"
summary: "Older corporate pages vs. newer product pages, and the unified system that reconciles them."
---

# Design direction: evolution, not reinvention

> **Updated 20 Nov 2026 (visual revision, [doc 15](/prototype/15-visual-revision/)).** Colours, type, radii and logo now follow the *QualityWorks Brand Guidelines v1.0*. Sections 2–4 below describe the **current** system; section 1 is the original 17 Nov observation and is kept for history.

## 1. Visual comparison (observed 17 Nov 2026)

| Attribute | Corporate site (older pages) | QualityWatcher AI (`qualitywatcher.ai`) | Agents as a Service (`agents.qualityworkscg.com`) |
|---|---|---|---|
| Typeface | Red Hat Display (Google Fonts); Typekit `area-normal` loaded but barely used | Inter | Geist |
| Body colour / bg | `#36414F` on `#F2F2F2` | near-black on `#F8FAFC` | `#F8FAFC` on `#0B1413` |
| Primary button | Pill, `#289DAD`/`#29A59A`, 14px regular, **3.2:1 contrast** | Rounded-rect, teal, 16px semibold, arrow icon | Pill, teal, arrow icon, plus outline secondary |
| Hero | Full-bleed stock photo, dark overlay, white H1 80px, one CTA | Dark photo + floating agent labels, gradient keyword, two CTAs | Dark gridded surface, editorial H1 72px, three CTAs, interactive “org chart” |
| Section headings | “– Eyebrow –” dash-framed, 36px light weight | Badge-style eyebrow with sparkle icon | Mono uppercase eyebrow with letter-spacing |
| Motifs | Wavy section dividers, stock photography, logo carousels | Product UI, robots, glow | Fine grid, cards with borders, avatars |
| Density | Long pages, repeated testimonial/award blocks | Product-forward, technical | Spacious, app-like |

**What reads as “QualityWorks” today:** the logo (teal + green gear-Q wordmark), the teal accent, Red Hat Display, pill buttons, the phrase *“We go \<beyond the code\>”*, the dash-framed eyebrows, and the founder-led, coaching-oriented voice.

**What dates the older pages:** stock-photo heroes, wavy dividers, light-weight 36px headings, low-contrast buttons, one-CTA heroes, near-identical industry and service templates, and repeated carousels.

**What the newer pages do well:** dark technical surfaces, product previews, mono labels, clear primary + secondary CTAs, and visible hand-offs ("Sign in", "Get Started").

## 2. The unified concept: *“Engineered editorial”*, people first

A refined B2B editorial system on the brand's slate canvas, with people photography in headers and one technical accent layer for products.

- **From the Brand Guidelines v1.0:** teal wordmark on Slate 800 (header) and white reversed wordmark (footer, drawer); Green `#2CAF81`, Teal `#29A59A`, Blue `#289DAD`, Mint `#ECF7F6`; the slate canvas; Montserrat display + Lato body; uppercase teal eyebrows with 0.16em tracking; pill buttons; 6/12/18px radii; 1120px content width; one gradient moment per page; "Engineered for Excellence." with the period.
- **People-focused headers:** the homepage hero is a full-width photograph of people working together, with a slate scrim behind the copy; About, Careers, Services, Contact and seven industry pages use the same treatment: a slate band with the photo on the right blending into slate (a plain full-width picture above the copy on phones) (`PageHero` `image` prop, `src/data/peopleImagery.ts`). Photos come from the live site; they are not presented as employees.
- **Retained:** pathway panel in the homepage hero, *&lt;beyond the code&gt;* phrase, core copy, dash-framed eyebrow (short accent rule + label), static scannable proof instead of carousels.
- **Removed:** concentric gear-ring motifs and the corporate grid overlay (they read as generated imagery), the two-tone logo, Red Hat Display / Mono.
- **Product layer:** the `surface-product` theme (Slate 950 `#1A212B`) with a fine grid, used on QualityWatcher, Agents as a Service, PRISM and the homepage products band.
- **Services vs products:** services use Mint/white surfaces and teal accents; products use the dark product surface, colour-coded top borders and an explicit **"where it lives"** badge.

## 3. Tokens (single source: `src/styles/tokens.css`, rendered at `/design-system/`)

| Group | Decision |
|---|---|
| Colour | Guide swatches (green, teal, blue, mint, slate 950–700, text-on-slate greys, caution) + derived teal-700/800 and mint-200 for accessibility; feedback pairs; semantic tokens (`--color-text`, `--color-link`, `--color-eyebrow`, `--color-on-primary`, …) re-mapped per surface |
| Type | `--font-display` Montserrat 300–800 (variable), `--font-body` Lato 400/700/400i, self-hosted; system monospace for code; fluid scale `--fs-xs` to `--fs-3xl` aligned to the guide (D1 44, D2 30, H 22, eyebrow 13, body 17); `font-synthesis: none` |
| Space | 4px base; fluid section padding `clamp(3.5rem, …, 6.5rem)`; container 1120px + fluid gutter (16–40px) |
| Shape | Radius 6 (inputs) / 12 (notes, images) / 18px (cards), pill buttons and tags |
| Elevation | 3 slate-tinted shadows; hover elevation on cards only |
| Motion | 120/200/320ms; one reveal-on-scroll; all disabled under `prefers-reduced-motion` |
| Focus | 3px outline, teal-700 on light / Green on dark, 3px offset |

## 4. Contrast decisions (computed)

| Pair | Ratio | Use |
|---|---|---|
| white on Teal `#29A59A` | 3.02 | **Not used for text** |
| slate 900 `#222B37` on Teal `#29A59A` | 4.73 | Primary buttons |
| slate 900 on Green `#2CAF81` | 5.14 | Primary button hover |
| teal-700 `#1D766F` on white / Mint | 5.42 / 4.96 | Links, eyebrows, outline focus on light |
| `#1F8D84` (guide eyebrow) on white | 4.04 | Not used for small text |
| Teal `#29A59A` on slate 900 | 4.73 | Links, eyebrows on dark |
| Green `#2CAF81` on slate 900 | 5.14 | Accent on dark |
| ink-1 `#E7ECEF` on slate 800 | 8.71 | Navigation, CTA band text |
| ink-2 `#AEB8C1` on slate 900 | 7.10 | Muted on dark |
| `#5A6673` on white / Mint | 5.86 / 5.36 | Muted on light |
| Green on slate 800 (focus ring in header) | 3.73 | Focus indicator (at least 3:1) |

## 5. Restraint rules

One reveal animation; no parallax; no autoplay carousels; no gradient text or gradient backgrounds (the brand gradient appears once per page, as a short rule); at most one dark product band on a corporate page; people photography only in page headers, never decorative filler. Illustrations are product-truthful (the QualityWatcher preview is labelled “illustrative”). Every number carries a claim ID.
