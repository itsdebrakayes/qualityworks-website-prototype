/**
 * MEDIA MAPPING: WordPress image URL to locally mirrored file.
 *
 * WHY: featured images of migrated articles and case studies were downloaded and resized into
 *   public/media/ by scripts/fetch-media.sh, so the prototype does not hot-link the live WordPress
 *   site and pages stay light. This helper picks the local copy when it exists.
 *
 * EXPORTS: localMedia(url). USED BY: src/data/articles.ts and src/data/caseStudies.ts (the `image`
 *   field of every migrated record).
 *
 * GOTCHAS
 *   - Server/build-time only: it uses node:fs, so never import it into a client-side <script>.
 *   - It resolves public/ from process.cwd(), so builds must run from the project root (npm scripts do).
 *   - The file-name rule must stay identical to fetch-media.sh: last path segment, query string
 *     removed, extension replaced by ".jpg". Two source images with the same base name would collide.
 *   - Production media should come from the approved CMS / DAM (see fetch-media.sh header).
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Map a WordPress media URL to the locally mirrored copy in /public/media (see scripts/fetch-media.sh).
 * @param url absolute WordPress media URL, or null/undefined/'' when the record has no image.
 * @returns `/media/{base}.jpg` when that file exists in public/; otherwise the original URL
 *   unchanged (so a missing mirror degrades to the live image); null when there is no URL.
 */
export function localMedia(url?: string | null): string | null {
  if (!url) return null;
  // Base name: drop the query string, keep the last path segment, strip its extension (any case).
  const base = url.split('?')[0].split('/').pop()!.replace(/\.[a-z0-9]+$/i, '');
  // fetch-media.sh always writes JPEGs, whatever the source format.
  const file = `/media/${base}.jpg`;
  return existsSync(join(process.cwd(), 'public', file)) ? file : url;
}
