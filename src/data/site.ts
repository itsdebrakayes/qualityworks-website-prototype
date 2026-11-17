import type { Cta } from './types';

/** Global company facts. Source: live footer + About page (audited 2026-11-17). */
export const site = {
  name: 'QualityWorks Consulting Group',
  shortName: 'QualityWorks',
  legacyOrigin: 'https://qualityworkscg.com',
  tagline: 'Engineered for Excellence',
  // Footer statement, verbatim from the live footer.
  footerStatement: 'We enable the delivery of transformative digital solutions through innovations in testing and agile project delivery.',
  founded: 2010,
  email: 'support@qualityworkscg.com',
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
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/qualityworks-consulting-group-llc/' },
    { label: 'Facebook', href: 'https://www.facebook.com/qualityworksconsulting/' },
    { label: 'Instagram', href: 'https://www.instagram.com/qualityworkscg/' },
    { label: 'X (Twitter)', href: 'https://twitter.com/qualityworkscg' },
  ],
  externalPlatforms: {
    agentsMarketplace: 'https://agents.qualityworkscg.com/',
    qualityWatcherAi: 'https://www.qualitywatcher.ai/',
    qualityWatcherTcm: 'https://qualitywatcher.com/',
    posture: 'https://www.postured.io/',
    bambooHr: 'https://qualityworksconsulting.bamboohr.com/careers',
    clutch: 'https://clutch.co/profile/qualityworks-consulting-group#highlights',
    testSquadBooking: 'https://meetings.hubspot.com/skirk/test-squad',
  },
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy/' },
    { label: 'Terms & Conditions', href: '/terms-conditions/' },
  ],
} as const;

/** Global CTAs: one definition, referenced everywhere, so labels/destinations stay consistent. */
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
