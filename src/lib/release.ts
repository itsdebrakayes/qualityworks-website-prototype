/**
 * REVIEW vs RELEASE MODE (review round 1, item 5).
 * - Default build (`npm run build`) = REVIEW MODE for Janique: prototype bar, Review hub, claim
 *   annotations, fixtures, wireframes and status notes are all present.
 * - Release build (`npm run build:release`, QW_RELEASE=true) strips every review-only element listed in
 *   docs/12-release-cleanup.md, removes review routes, and is then scanned by scripts/release-check.mjs.
 *   The release build is a GATE: it is expected to FAIL until open content/integration items are closed.
 *
 * INPUT: the environment variable QW_RELEASE, read once at build time. Only the exact string
 *   "true" enables release mode; anything else (unset, "1", "TRUE") means review mode.
 *
 * EXPORTS
 *   RELEASE  boolean, true in release builds. Use it to filter content out (fixtures, unverified
 *            stats, date-TBC events) and to set `data-release-blocker` attributes.
 *   REVIEW   boolean, the exact opposite. Use it to render review-only UI: `{REVIEW && …}`.
 *   rn(note) review-note helper for `data-review-note` attributes (see below).
 *
 * USED BY: BaseLayout (robots meta, prototype bar), Header (proposed-link dots), ClaimRef, StatBlock,
 *   ProofBlock, FaqAccordion, ProductCard, ContactForm, Wireframe, ServiceTemplate, the homepage,
 *   article, careers, case-study, contact, industry and product pages, plus data modules
 *   src/data/articles.ts and src/data/events.ts (fixture filtering). CONTRIBUTING.md §6 is the guide.
 *
 * HOW TO USE
 *   - Review-only element:      {REVIEW && <p>…</p>}
 *   - Review annotation:        <div data-review-note={rn('Why this is here')}>
 *   - Placeholder to replace:   <div data-release-blocker={RELEASE ? 'reason' : undefined}>
 *     release-check.mjs fails while any data-release-blocker remains in the release output.
 *
 * GOTCHA: these are module-level constants evaluated at build time. Static pages contain the
 *   result; there is no runtime switch in the browser (the "Review annotations" toggle in the
 *   prototype bar only shows/hides annotations that the review build already rendered).
 */
export const RELEASE = process.env.QW_RELEASE === 'true';
export const REVIEW = !RELEASE;

/**
 * Review-note attribute value: present in review builds, omitted from release builds.
 * @param note reviewer-facing text (why the element exists, its approval state, …).
 * @returns `note` in review builds; `undefined` in release builds, which makes Astro omit the
 *   attribute entirely, so release-check.mjs finds no `data-review-note` markers.
 */
export const rn = (note?: string) => (REVIEW ? note : undefined);
