/**
 * CLIENT EXPERIENCE — the logo cluster on the homepage ("Experience across industries").
 *
 * WHY: Stacy Kirk (24 Nov 2026): replace the wordy "Who we help" section with "industry and then start putting
 *   logos there ... just a visual, like boom, boom, look at all of these".
 *
 * SOURCES (no new client relationships are claimed here):
 *   - `logo` records: client logos ALREADY PUBLISHED in the client strip on qualityworkscg.com (files copied
 *     to public/clients/ from wp-content/uploads, retrieved 25 Nov 2026). Logo-use approval for the new site
 *     still needs confirming (docs/17 §6). The sales-deck logo sheet in Canva (mentioned by Stacy) should
 *     replace or extend this list.
 *   - case-study clients: official logos downloaded from each company's own website or the qualitywatcher.ai
 *     client strip (26 Nov 2026): Truist, JMMB, Swagbucks, WSSC Water, Wisynco. Sagicor, IEHP and Legacy.com
 *     could not be fetched (bot protection / no logo file) and stay as name marks until the files are supplied.
 *   - `industry`: from the case-study record where one exists; otherwise the client's widely known sector.
 *     'Industry to confirm' where we could not confirm it.
 */
export interface ClientMark {
  name: string;
  industry: string;
  logo?: string;
  /** Relative bubble size 1 (small) to 3 (large). */
  size: 1 | 2 | 3;
}

export const clients: ClientMark[] = [
  { name: 'Comcast', industry: 'Media & entertainment', logo: '/clients/logo-comcast.png', size: 3 },
  { name: 'AT&T', industry: 'Telecommunications', logo: '/clients/att-logo.png', size: 3 },
  { name: 'FOX', industry: 'Media & entertainment', logo: '/clients/fox-logo.png', size: 2 },
  { name: 'Fandango', industry: 'Media & entertainment', logo: '/clients/Fandango-Logo.png', size: 2 },
  { name: 'Ericsson', industry: 'Telecommunications technology', logo: '/clients/ericsson-logo.png', size: 2 },
  { name: 'Children’s Miracle Network Hospitals', industry: 'Nonprofit & healthcare', logo: '/clients/Childrens-Miracle-Network-Logo.png', size: 2 },
  { name: 'DPD', industry: 'Logistics', logo: '/clients/DPD_logo.png', size: 2 },
  { name: 'Equinox', industry: 'Industry to confirm', logo: '/clients/Equinox_logo.png', size: 1 },
  { name: 'Dunmor', industry: 'Industry to confirm', logo: '/clients/dunmor2.png', size: 1 },
  { name: 'A-MAN, Inc.', industry: 'Education', logo: '/clients/logo-aman.png', size: 1 },
  { name: 'WSSC Water', industry: 'Public sector & utilities', logo: '/clients/wssc-water.svg', size: 2 },
  { name: 'Truist (BB&T / SunTrust)', industry: 'Finance & banking', logo: '/clients/truist.svg', size: 2 },
  { name: 'Sagicor', industry: 'Insurance', size: 1 },
  { name: 'JMMB Group', industry: 'Finance & banking', logo: '/clients/jmmb.png', size: 1 },
  { name: 'Wisynco', industry: 'Retail & distribution', logo: '/clients/wisynco.png', size: 1 },
  { name: 'IEHP', industry: 'Healthcare', size: 1 },
  { name: 'Swagbucks', industry: 'Technology', logo: '/clients/swagbucks.svg', size: 1 },
  { name: 'Legacy.com', industry: 'Media & entertainment', size: 1 },
];
