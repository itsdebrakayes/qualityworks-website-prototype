import type { Provenance } from './types';
const p = (url: string): Provenance => ({ source: 'live-site-copy', approval: 'published-live', sourceUrl: url, retrievedAt: '2026-11-17', note: 'Re-approval from the quoted person required before reuse.' });
/** Testimonials published on the live homepage carousel (verbatim). */
export const testimonials = [
  { id: 'T1', name: 'Mark', role: 'Sr. Product Manager, Dunmor', quote: 'The biggest difference between QualityWorks and other quality service providers is that QualityWorks serves as a group of experts, and they leverage their whole community to really establish refined and robust quality processes within your organization.', provenance: p('https://qualityworkscg.com/') },
  { id: 'T2', name: 'Dr. Bettye Walker', role: 'CEO, A-MAN, Inc.', quote: 'The QualityWorks team took our Android educational app idea and made it a reality. They effectively managed ideation, tech team sourcing, requirements, and timelines throughout the project. They helped us innovate, simplify, and execute so we could meet our deliverables and budget.', provenance: p('https://qualityworkscg.com/') },
  { id: 'T3', name: 'Brendan Flannery', role: 'QA Director, Fandango.com', quote: 'QualityWorks was able to quickly provide us with skilled resources aligned with our immediate needs and budget. Their consultants played a critical role in meeting our project milestones and provided quality service and communication throughout the project release and beyond.', provenance: p('https://qualityworkscg.com/') },
];
