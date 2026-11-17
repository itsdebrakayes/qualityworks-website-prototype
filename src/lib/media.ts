import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** Map a WordPress media URL to the locally mirrored copy in /public/media (see scripts/fetch-media.sh). */
export function localMedia(url?: string | null): string | null {
  if (!url) return null;
  const base = url.split('?')[0].split('/').pop()!.replace(/\.[a-z0-9]+$/i, '');
  const file = `/media/${base}.jpg`;
  return existsSync(join(process.cwd(), 'public', file)) ? file : url;
}
