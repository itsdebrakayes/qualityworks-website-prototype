// @ts-check
import { defineConfig } from 'astro/config';

/** rehype plugin: external links in markdown docs open in a new tab with rel=noopener. */
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
