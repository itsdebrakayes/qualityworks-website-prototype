---
title: "02 · Design direction"
summary: "Older corporate pages vs. newer product pages, and the unified system that reconciles them."
---

# Design direction: evolution, not reinvention

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

## 2. The unified concept: *“Engineered editorial”*

The design is a refined B2B editorial system with one technical accent layer that the product pages can turn up.

- **Retained:** logo, exact logo teal `#289DAD` and logo green `#8FC640`, legacy slate `#36414F` and ink `#222B37`, Red Hat Display, pill buttons, dash-framed eyebrow (modernised as a short teal rule + mono label), *&lt;beyond the code&gt;* phrase, core copy.
- **Modernised:** heavier, tighter display headings; ink-dark hero instead of stock photo; a **pathway panel** in the homepage hero; mono labels from the **same Red Hat superfamily** (not a third typeface); accessible teal `#1B7480` for interactive elements; a gear-ring line motif drawn from the “Q” in the logo instead of wavy dividers; fewer carousels (static, scannable proof).
- **Product layer:** the `surface-product` theme (`#0E1817`, from the AaaS `#0B1413`, warmed toward brand teal) with a fine grid. It is used on QualityWatcher, Agents as a Service, PRISM and the homepage products band. It shares header, footer, type, buttons and cards with corporate pages, so products feel distinct but clearly belong to the same company.
- **Services vs products:** services use light/tint surfaces, teal accents and service icons. Products use the dark product surface, colour-coded top borders (teal = QualityWatcher, green = Agents, gold = PRISM) and an explicit **"where it lives"** badge.

## 3. Tokens (single source: `src/styles/tokens.css`, rendered at `/design-system/`)

| Group | Decision |
|---|---|
| Colour | 10 brand/neutral tokens + 4 feedback pairs; semantic tokens (`--color-text`, `--color-link`, …) re-mapped per surface (`surface-dark`, `surface-product`, `surface-tint`, `surface-alt`) |
| Type | Red Hat Display 300–900 (variable, self-hosted), Red Hat Mono 400–600 for labels; fluid scale `--fs-xs` to `--fs-3xl`; `font-synthesis: none` |
| Space | 4px base; fluid section padding `clamp(3.5rem, …, 6.5rem)`; container 1216px + fluid gutter (16–40px) |
| Shape | Radius 6/10/16px, pill buttons; card radius 16px everywhere |
| Elevation | 3 shadows; hover elevation on cards only |
| Motion | 120/200/320ms; one reveal-on-scroll; all disabled under `prefers-reduced-motion` |
| Focus | 3px outline, teal on light / green on dark, 3px offset |

## 4. Contrast decisions (computed)

| Pair | Ratio | Use |
|---|---|---|
| white on `#289DAD` (live) | 3.22 | **Not used for text** |
| white on `#1B7480` | 5.45 | Buttons |
| `#1B7480` on white | 5.45 | Links |
| `#5A6675` on white | 5.85 | Muted text |
| `#8FC640` on `#16202B` | 8.09 | Accent on dark |
| `#5FC3CF` on `#16202B` | 7.99 | Links on dark |
| `#9AA7B4` on `#16202B` | 6.71 | Muted on dark |

## 5. Restraint rules

One reveal animation; no parallax; no autoplay carousels; no gradient text; at most one dark product band on a corporate page. Illustrations are product-truthful (the QualityWatcher preview is labelled “illustrative”). Every number carries a claim ID.
