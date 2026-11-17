/** Loads the markdown documents in /docs so they render inside the prototype (single source). */
const mods = import.meta.glob<any>('../../docs/[0-9]*.md', { eager: true });
export const docs = Object.entries(mods)
  .map(([path, mod]) => ({ slug: path.split('/').pop()!.replace(/\.md$/, ''), title: mod.frontmatter.title as string, summary: mod.frontmatter.summary as string, Content: mod.Content, headings: mod.getHeadings?.() ?? [] }))
  .sort((a, b) => a.slug.localeCompare(b.slug));
