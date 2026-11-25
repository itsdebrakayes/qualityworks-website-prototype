/**
 * TESTIMONIALS — PLACEHOLDERS for the people-forward testimonial carousel (components/TestimonialStage.astro). The verbatim live-site quotes stay in testimonials.ts (still used by ProofBlock on inner pages).
 *
 * WHY: in the 24 Nov 2026 executive review Stacy Kirk said the existing testimonial people are old and no
 *   longer at those companies, and asked for "real faces of real people" with an animated carousel of
 *   "different people saying different things". QualityWorks still has to ask clients for permission.
 *
 * HONESTY RULES:
 *   - Every record is a PLACEHOLDER (`placeholder: true`): stock portrait (peopleImagery t-1…t-4), invented
 *     sample wording and no real name or company. The stage shows a visible "Sample testimonial" label for
 *     each one, and release builds mark it as a release blocker.
 *   - Never pair a stock portrait with a real client's name or quote.
 *
 * HOW TO REPLACE: once a client approves, set `placeholder: false`, add their real name, role and company,
 *   their approved quote, and their own photo (add it to peopleImagery.ts with the licence/consent noted).
 */
export interface Testimonial {
  placeholder: boolean;
  quote: string;
  name: string;
  role: string;
  org: string;
  industry: string;
  /** peopleImagery id */
  photo: string;
}

export const testimonialPlaceholders: Testimonial[] = [
  { placeholder: true, photo: 't-1', name: 'Client name', role: 'Chief Technology Officer', org: 'Financial services company', industry: 'Finance & banking',
    quote: 'QualityWorks didn’t just test our platform. They changed how our teams release software. Releases that used to make us nervous are now routine.' },
  { placeholder: true, photo: 't-2', name: 'Client name', role: 'VP of Engineering', org: 'Media & entertainment company', industry: 'Media & entertainment',
    quote: 'They were ready for our biggest traffic day before we were. When the moment came, everything held.' },
  { placeholder: true, photo: 't-3', name: 'Client name', role: 'Director of Product', org: 'Healthcare organisation', industry: 'Healthcare',
    quote: 'From the first workshop to launch, they built our app like it was their own, and they kept us in the room for every decision.' },
  { placeholder: true, photo: 't-4', name: 'Client name', role: 'Chief Information Officer', org: 'Public sector agency', industry: 'Public sector',
    quote: 'Their AI-powered testing gave our QA team hours back every week, with people reviewing every result.' },
];
