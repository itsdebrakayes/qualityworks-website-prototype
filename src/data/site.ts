/**
 * GLOBAL COMPANY FACTS AND CTAS: single source for the company name, contact details, offices,
 * social profiles, external platform URLs, legal links and the shared calls to action.
 *
 * WHY: CONTRIBUTING.md rule 3 (one source of truth). Changing a phone number or CTA label here
 *   changes it on every page, so they cannot drift apart.
 *
 * EXPORTS AND CONSUMERS
 *   site  read by BaseLayout (name; legacyOrigin for canonical, OG and breadcrumb URLs), Footer (offices, social, legal,
 *         footerStatement), src/lib/schema.ts (Organization JSON-LD), and many pages (email on the
 *         contact page, externalPlatforms.clutch for review links, legacyOrigin for absolute URLs).
 *   ctas  shared CTAs used across pages; `contact` is by far the most used. Some entries (e.g.
 *         contactShort, careers) and some externalPlatforms URLs are defined for consistency but not
 *         currently referenced.
 *
 * HOW TO EXTEND: add a field to `site` (it is `as const`, so values are literal types) or a CTA to
 *   `ctas` (checked against the Cta type with `satisfies`). Reference it from pages instead of
 *   typing the value again.
 *
 * GOTCHAS
 *   - `legacyOrigin` is the canonical production origin used for canonical URLs and JSON-LD; it is
 *     not the prototype host (that is `site` in astro.config.mjs).
 *   - organizationLd() in src/lib/schema.ts hard-codes the HQ telephone and address; keep them in step
 *     with `offices` below.
 *   - The Kingston phone number has an open discrepancy (audit A-07, see below).
 */
import type { Cta } from './types';

/**
 * Global company facts. Source: live footer + About page (audited 2026-11-17).
 * `as const` makes every value readonly and literal-typed.
 */
export const site = {
  name: 'QualityWorks Consulting Group',
  shortName: 'QualityWorks',
  legacyOrigin: 'https://qualityworkscg.com',
  tagline: 'Engineered for Excellence.',
  // Footer statement, verbatim from the live footer.
  footerStatement: 'We enable the delivery of transformative digital solutions through innovations in testing and agile project delivery.',
  founded: 2010,
  email: 'support@qualityworkscg.com',
  // Each office: label, locality, and phones as { display text, E.164 number for tel: links }.
  offices: [
    {
      label: 'Headquarters',
      locality: 'Los Angeles, CA, US',
      phones: [
        { display: '424-363-7111', tel: '+14243637111' },
        { display: '213-239-3583', tel: '+12132393583' },
      ],
    },
    {
      label: 'Nearshore',
      locality: 'Kingston, Jamaica',
      // DISCREPANCY (audit A-07): live footer displays (876) 551-1956 but links tel:18766672327.
      // Prototype uses the displayed number; owner must confirm the correct number.
      phones: [{ display: '(876) 551-1956', tel: '+18765511956' }],
    },
  ],
  // Social profiles (footer links and Organization sameAs in JSON-LD).
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/qualityworks-consulting-group-llc/' },
    { label: 'Facebook', href: 'https://www.facebook.com/qualityworksconsulting/' },
    { label: 'Instagram', href: 'https://www.instagram.com/qualityworkscg/' },
    { label: 'X (Twitter)', href: 'https://twitter.com/qualityworkscg' },
  ],
  // Separate QualityWorks or third-party platforms the site hands visitors off to.
  externalPlatforms: {
    agentsMarketplace: 'https://agents.qualityworkscg.com/',
    qualityWatcherAi: 'https://www.qualitywatcher.ai/',
    qualityWatcherTcm: 'https://qualitywatcher.com/',
    posture: 'https://www.postured.io/',
    bambooHr: 'https://qualityworksconsulting.bamboohr.com/careers',
    clutch: 'https://clutch.co/profile/qualityworks-consulting-group#highlights',
    testSquadBooking: 'https://meetings.hubspot.com/skirk/test-squad',
  },
  // Legal page links shown in the footer.
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy/' },
    { label: 'Terms & Conditions', href: '/terms-conditions/' },
  ],
} as const;

/**
 * Global CTAs: one definition, referenced everywhere, so labels/destinations stay consistent.
 * External CTAs carry `external: true` and a `handoffNote` that Button.astro reads out to screen
 * readers. `satisfies Cta` type-checks each entry without widening its literal values.
 */
export const ctas = {
  contact: { label: 'Talk to an expert', href: '/contact-us/', kind: 'primary' } satisfies Cta,
  contactShort: { label: 'Contact us', href: '/contact-us/', kind: 'primary' } satisfies Cta,
  exploreSolutions: { label: 'Explore solutions', href: '/services/', kind: 'secondary' } satisfies Cta,
  caseStudies: { label: 'See case studies', href: '/case-studies/', kind: 'secondary' } satisfies Cta,
  careers: { label: 'View open roles', href: '/careers/#open-roles', kind: 'secondary' } satisfies Cta,
  qualityWatcherDemo: {
    label: 'Request a QualityWatcher demo',
    href: 'https://www.qualitywatcher.ai/',
    external: true,
    kind: 'primary',
    handoffNote: 'Opens qualitywatcher.ai, a separate QualityWorks product site',
  } satisfies Cta,
  agentsMarketplace: {
    label: 'Browse the agent marketplace',
    href: 'https://agents.qualityworkscg.com/',
    external: true,
    kind: 'primary',
    handoffNote: 'Opens agents.qualityworkscg.com, the separate Agents as a Service marketplace',
  } satisfies Cta,
};
