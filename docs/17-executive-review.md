---
title: "17 · Executive review (Stacy Kirk, 24 Nov 2026)"
summary: "Section-by-section implementation of the CEO's homepage review: buyer imagery, three service pillars, QualityWatcher, testimonials, client logos, results, custom development portfolio, IntelliBus-style cards, scenes and the spec-sheet stats. What is finished, what is a visual prototype, and which assets are outstanding."
---

# Executive review — implementation record (24–25 Nov 2026)

**Source:** CEO Stacy Kirk's marketing review of the prototype (24 Nov 2026), relayed with transcript quotes by the project lead, plus the lead's follow-up direction on 25 Nov 2026. **Nothing was deployed to production.** Everything below is in the review prototype only.

**Standing direction for all imagery (25 Nov 2026):** every person shown should look like a QualityWorks **buyer**: mature, corporate, well-dressed decision-makers. Senior white male executives first, then Black businesswomen in their 40s and up, and mature Black businessmen. No young developers or students. The Careers page keeps its existing photos, because its audience is job seekers.

## 1. Homepage, in review order

| # | Section | Stacy's direction | What changed | Status |
|---|---|---|---|---|
| 1 | Hero | Keep "Engineered for Excellence" and the scroll intro; replace the people; say testing + development up front | Kept the Samsung-style scroll intro and tagline. New senior business-leader photo. "AI-powered testing + Custom software development" shown as the positioning line. A single primary **Contact us** CTA. At the end of the zoom-out, the three service cards straddle the hero's bottom edge (half over the hero, half over the next section). | Finished (stock photo) |
| 2 | Quality you can measure | "I like that section" | Same four figures and claim IDs, still counting up and replaying when you scroll back. Restyled as a spec sheet (one panel, hairline columns, large numerals, thin rules) after the follow-up feedback that the icon tiles felt generated. | Finished; figures C02–C04 still need verification |
| 3 | Why QualityWorks | Pictures too small; one person's face; a Black buyer | A full-height **scene**: a portrait of a senior Black businesswoman fills the left half and fades into the page, with the copy centred beside it. The whole composition fits one 1440 × 900 screen. | Finished (stock photo) |
| 4 | Three services | All visible at once; less wordy; people; testing + development emphasised | Three adjacent photo pillars. Testing and development are wider and badged "Core service"; AI & Agents is narrower. Each pillar has **Learn more** plus a contact action. The scroll-driven device story was removed. | Finished |
| 4b | Featured work (new) | A click-through to the custom development portfolio | A three-project 3D carousel preview with "View project" deep links (`?project=`) to the full portfolio. | Visual prototype (sample projects) |
| 5 | Products & innovation | QualityWatcher, the Navy challenge, agentic AI; PRISM may be replaced; no "C+" | QualityWatcher showcase on a dark band: logo, "AI testing agents. Your rules.", four agent tabs (Capture, Generation, Execution, Analytics) and a window recreating the interfaces published on qualitywatcher.ai. The Navy AIAT First Prize card uses the published photo (claim C10). PRISM is reduced to a small "coming soon" link, and the C+ sample card is removed. | Interface recreated from the product site; swap for real screenshots or a recording |
| 6 | What our clients say | Old people and old titles; real faces; an animation of different people | A large portrait with an overlapping frosted quote panel, cross-fades, progress dots, prev/next and auto-advance. All four entries are **placeholders** (stock portraits, sample wording), labelled on screen and treated as release blockers. Recognition badges sit underneath. | Visual prototype; needs approved client quotes and photos |
| 7 | Where we work | Remove; LA/Kingston doesn't help | Section removed from the homepage. The contact page keeps the addresses. | Finished |
| 8 | Who we help | Industry + logos, "boom, boom, look at all of these" | An organic logo cluster (18 organisations). Bubbles drift, and grow on hover, focus or tap to show the name and industry. Logos already published in the live site's client strip, plus clients named in published case studies (as name marks). | Finished; logo-use approval and the Canva sales-deck logo sheet are outstanding |
| 9 | Results | Biggest US names: Truist, WSSC, Comcast/AT&T | Three large photo cards: **BB&T / SunTrust (now Truist)** (Legacy leadership game), **WSSC Water** (AI test case generation) and **US telecom & media company** (telecom automation). | Naming needs approval (see §4) |
| 10 | Insights | Only if it helps AEO | Removed from the homepage. A three-card blog strip adds no answer-engine value; the AEO value is in the articles themselves and their FAQ/Article schema. The blog and resource hub stay in the navigation. | Finished |
| 11 | Speaking & events | "Take that whole thing out" | Removed from the homepage. The events pages still exist. AC-HOME-3 (the events fallback) is retired. | Finished |
| 12 | Final CTA | "That's fine"; more contact options everywhere | Kept, with the primary button now reading **Contact us**. Contact actions now also appear in the hero, every pillar, the Why section, featured work, the QualityWatcher section and the service-page considerations. | Finished |

## 2. Custom development portfolio

On `/services/custom-software-development/#portfolio`, directly under the hero:

- A cinematic 3D carousel: the centre project is large and its neighbours are angled away. It works with arrows, dots, keyboard, swipe and clicks.
- A detail panel for each project: industry tag, platforms, challenge, what we built, technology chips, outcomes, a testimonial, and **Start a project** / case-study actions.
- Five **fictional sample projects** (banking, healthcare, logistics, public sector, learning). Each screen is rendered in HTML/CSS with fake data, and every record is labelled "Sample project · fictional" (`src/data/portfolio.ts`).
- Links to the three published custom development case studies.
- To replace a sample: set `sample: false`, add the approved client name, outcomes (with claim IDs), testimonial and real screenshots. Stacy estimates about 10 past projects where clients may allow screens to be shown.

## 3. Design system changes (follow-up feedback, 25 Nov 2026)

- **Cards** follow the user's IntelliBus Hack 2026 project (`client/src/index.css`): near-opaque white cards with a soft brand tint in the top-left corner, a short accent bar, a tinted icon tile, a white rim and a soft shadow. White inset panels sit over photos, inside dark gradient banners. The page background is a light grey-mint, and the drifting colour blobs are gone (`src/styles/glass.css`).
- **Scenes:** image + text sections are built as viewport-sized compositions. The photo fills one half at full height and fades into the section colour, and the copy is centred beside it (`.scene` in `src/styles/surfaces.css`). Used on the homepage Why section and on every service page's "What to know before you start".
- **Readability:** base text 18px (was 17), small text 16px (was 15), captions 14px (was 13). The header glass is darker for contrast.
- **Stats:** spec-sheet layout with no pictograms (`src/components/StatBlock.astro`).

## 4. Content integrity and open items

- **Photography:** all people photos are Unsplash/Pexels stock (free commercial licences), recorded in `src/data/peopleImagery.ts`. They are not staff or clients. Commissioned photography of real QualityWorks people and clients is the preferred replacement.
- **Testimonials:** placeholders only. QualityWorks needs to ask current clients for an approved quote and photo (Stacy: "we're gonna have to figure out who we can ask").
- **Truist naming:** the published case study names the BB&T / SunTrust Leadership Institute. BB&T and SunTrust merged to form Truist in 2019. Confirm the client is happy to be presented as Truist.
- **Comcast / AT&T:** both logos are in the live site's client strip. The telecom automation case study's client is deliberately unnamed, and we did not attribute it to either company. If it is one of them and they approve, rename the card.
- **Logo cluster industries:** Equinox and Dunmor are shown as "Industry to confirm".
- **QualityWatcher:** the window recreates interface panels from qualitywatcher.ai with sample data. The "4–5x productivity" figure on that site is not repeated, because it has no claim record.
- **Navy AIAT:** shown as First Prize (claim C10) with the published photo. The prize detail is unchanged from the news post.
- **Not yet redesigned:** the secondary-page work in Part 7 of the brief (company values graphics, Agents as a Service workflow, contact page sections, blog/resource categorisation) is still pending beyond the photo and scene changes above.
