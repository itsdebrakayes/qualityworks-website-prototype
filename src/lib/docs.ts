/**
 * Loads the markdown documents in /docs so they render inside the prototype (single source).
 *
 * WHAT: Build-time loader that turns every numbered project document (docs/NN-name.md) into an
 *   entry the prototype can render at /prototype/NN-name/.
 *
 * WHY: The docs folder is the single source for the audit, design direction, schemas, QA summary,
 *   etc. Rendering the same files inside the review build means reviewers never read a stale copy.
 *
 * EXPORTS
 *   docs: array of { slug, title, summary, Content, headings }, sorted by slug (so 01 … 14 order).
 *     - slug     file name without ".md" (e.g. "04-content-schemas"); becomes the route segment.
 *     - title    frontmatter `title` (required in every numbered doc).
 *     - summary  frontmatter `summary` (used as the page meta description and on the hub).
 *     - Content  the Astro component that renders the markdown body.
 *     - headings the markdown headings list from Astro (empty array if unavailable).
 *
 * USED BY: src/pages/prototype/index.astro (Review hub list) and src/pages/prototype/[doc].astro
 *   (one page per doc, with previous/next links). Both routes are review-only and are deleted from
 *   release builds by scripts/release-check.mjs.
 *
 * HOW TO EXTEND: add docs/NN-new-topic.md with `title` and `summary` frontmatter. It appears
 *   automatically. Files whose names do not start with a digit (e.g. docs/_manual-qa.md) are NOT
 *   loaded, which is how partials are kept out of the hub.
 *
 * GOTCHAS: a numbered doc without frontmatter yields `undefined` title/summary. External links
 *   inside the markdown get target=_blank via the rehype plugin in astro.config.mjs.
 */
// import.meta.glob is resolved by Vite at build time; `eager: true` imports every match immediately.
// The pattern [0-9]* limits loading to numbered documents.
const mods = import.meta.glob<any>('../../docs/[0-9]*.md', { eager: true });
export const docs = Object.entries(mods)
  .map(([path, mod]) => ({ slug: path.split('/').pop()!.replace(/\.md$/, ''), title: mod.frontmatter.title as string, summary: mod.frontmatter.summary as string, Content: mod.Content, headings: mod.getHeadings?.() ?? [] }))
  .sort((a, b) => a.slug.localeCompare(b.slug));
