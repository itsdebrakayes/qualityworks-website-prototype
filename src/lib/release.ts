/**
 * REVIEW vs RELEASE MODE (review round 1, item 5).
 * - Default build (`npm run build`) = REVIEW MODE for Janique: prototype bar, Review hub, claim
 *   annotations, fixtures, wireframes and status notes are all present.
 * - Release build (`npm run build:release`, QW_RELEASE=true) strips every review-only element listed in
 *   docs/12-release-cleanup.md, removes review routes, and is then scanned by scripts/release-check.mjs.
 *   The release build is a GATE: it is expected to FAIL until open content/integration items are closed.
 */
export const RELEASE = process.env.QW_RELEASE === 'true';
export const REVIEW = !RELEASE;

/** Review-note attribute value: present in review builds, omitted from release builds. */
export const rn = (note?: string) => (REVIEW ? note : undefined);
