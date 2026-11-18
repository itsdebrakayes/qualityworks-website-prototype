// @ts-check
/**
 * ASTRO CONFIGURATION for the QualityWorks QM-113 prototype.
 *
 * WHAT: build settings for Astro 5 (static site generation; no server runtime).
 *
 * KEY DECISIONS
 *   - Static output (Astro's default): every route is prebuilt HTML, so the prototype can be hosted
 *     anywhere (README "Stack and architecture").
 *   - `trailingSlash: 'always'` + `build.format: 'directory'`: every page is written as
 *     {route}/index.html and linked with a trailing slash, matching the existing WordPress URLs so
 *     legacy paths keep working (README "Configuration").
 *   - `site` is a placeholder host on the reserved .invalid TLD: the prototype has no real host and
 *     no production deployment is authorised. Canonical URLs and JSON-LD deliberately use
 *     `legacyOrigin` (https://qualityworkscg.com) from src/data/site.ts instead.
 *   - The Astro dev toolbar (a `npm run dev` overlay, never part of the built site) is disabled.
 *   - Markdown (the /docs files rendered at /prototype/…, see src/lib/docs.ts) gets the
 *     externalLinks rehype plugin below.
 *
 * ENVIRONMENT: release mode is NOT configured here; it is the QW_RELEASE env var read by
 *   src/lib/release.ts (`npm run build:release`, which also sets --outDir dist-release).
 *
 * GOTCHA: changing trailingSlash or build.format changes every URL and output path; QA link checks,
 *   scripts/gen-redirects.mjs (which writes `/case-studies/{slug}/` targets) and the release gate all
 *   assume the current directory format.
 */
import { defineConfig } from 'astro/config';

/**
 * rehype plugin: external links in markdown docs open in a new tab with rel=noopener.
 *
 * How it works: the markdown pipeline calls externalLinks() to get a transformer and runs it on each markdown
 * file's HTML syntax tree (HAST). `visit` walks every node recursively; any <a> whose href starts with
 * http: or https: gets target=_blank and rel=noopener. Relative and #anchor links are left alone.
 * No dependency on unist-util-visit is needed for a tree this small. QA-03 checks external links
 * site-wide.
 */
function externalLinks() {
  const visit = (node) => {
    if (node.type === 'element' && node.tagName === 'a' && /^https?:/.test(String(node.properties?.href ?? ''))) {
      node.properties.target = '_blank';
      node.properties.rel = ['noopener'];
    }
    (node.children ?? []).forEach(visit);
  };
  return (tree) => visit(tree);
}

// Prototype build: static output, trailing slashes kept to match existing WordPress URLs.
export default defineConfig({
  site: 'https://prototype.qualityworkscg.invalid',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  markdown: { rehypePlugins: [externalLinks] },
});
