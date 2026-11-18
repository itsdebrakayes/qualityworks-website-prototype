/**
 * LEADERSHIP PROFILES shown on /about-us/ (src/pages/about-us/index.astro imports `leadership`).
 *
 * WHY so short: only people whose bio and photo are already public on the live site are included.
 *   Adding anyone else needs an approved bio and photo from the content owner (docs/04 §8).
 *
 * HOW TO EXTEND: copy the record; supply id, name, role, approved bio, a photo under public/brand/
 *   with descriptive photoAlt, and provenance pointing at the approved source.
 */
import type { Person } from './types';

/**
 * Only leadership verifiable on the public site is included. Other profiles: awaiting approved bios/photos.
 * Current record: the CEO profile, copied from the live About page (retrieved 2026-11-17, re-approval needed).
 */
export const leadership: Person[] = [
  {
    id: 'stacy-kirk', name: 'Stacy Kirk', role: 'CEO and Founder',
    bio: 'Stacy Kirk founded QualityWorks to build a company passionate about what it takes to deliver continuous quality and value to users. She speaks to professional and student groups across the United States and abroad.',
    photo: '/brand/stacy-kirk.png', photoAlt: 'Portrait of Stacy Kirk, CEO and Founder of QualityWorks',
    provenance: { source: 'live-site-copy', approval: 'published-live', sourceUrl: 'https://qualityworkscg.com/about-us/', retrievedAt: '2026-11-17', note: 'Bio condensed from About and homepage copy — needs approval.' },
  },
];
