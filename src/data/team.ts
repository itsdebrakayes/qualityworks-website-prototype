import type { Person } from './types';

/** Only leadership verifiable on the public site is included. Other profiles: awaiting approved bios/photos. */
export const leadership: Person[] = [
  {
    id: 'stacy-kirk', name: 'Stacy Kirk', role: 'CEO and Founder',
    bio: 'Stacy Kirk founded QualityWorks to build a company passionate about what it takes to deliver continuous quality and value to users. She speaks to professional and student groups across the United States and abroad.',
    photo: '/brand/stacy-kirk.png', photoAlt: 'Portrait of Stacy Kirk, CEO and Founder of QualityWorks',
    provenance: { source: 'live-site-copy', approval: 'published-live', sourceUrl: 'https://qualityworkscg.com/about-us/', retrievedAt: '2026-11-17', note: 'Bio condensed from About and homepage copy — needs approval.' },
  },
];
