import type { NavItem, NavLink } from './types';

/**
 * GLOBAL NAVIGATION — single source of truth for the desktop mega-menu, the mobile drawer,
 * the footer sitemap and the XML sitemap. Do not hardcode navigation anywhere else.
 *
 * Top-level categories follow QM-112 (7 categories incl. Home via logo).
 * Labels and group structure mirror the CURRENT live header (audited 2026-11-17) because the
 * QM-41 approved sitemap could not be accessed (Jira returned 404/unauthorised). Items marked
 * `status: 'proposed'` are NOT in the live navigation and need QM-41 confirmation.
 */
export const primaryNav: NavItem[] = [
  {
    id: 'solutions',
    label: 'Solutions',
    href: '/services/',
    groups: [
      {
        heading: 'Improve Software Quality',
        links: [
          { label: 'Test Automation', href: '/services/test-automation/', description: 'Frameworks, CI integration and team upskilling' },
          { label: 'Full-Stack Testing', href: '/services/full-stack-testing/', description: 'Testing at every stage of the lifecycle' },
          { label: 'Web & Mobile Application Testing', href: '/services/web-mobile-application-testing/', description: 'Functional, usability and device coverage' },
          { label: 'Non-Functional Testing', href: '/services/non-functional-testing/', description: 'Performance, security, accessibility, UX' },
          { label: 'API & Cloud Services Testing', href: '/services/api-cloud-services-testing/', description: 'Automated API checks in your pipeline' },
          { label: 'Managed AI Test Squad', href: '/services/ai-test-squad/', description: 'Senior QA oversight of AI testing agents', status: 'proposed' },
          { label: 'Maturity Assessments', href: '/maturity-assessments/', description: 'Benchmark QA and delivery maturity' },
        ],
      },
      {
        heading: 'Build or Modernize a Digital Product',
        links: [
          { label: 'Custom Software Development', href: '/services/custom-software-development/', description: 'AI-accelerated web and mobile products' },
          { label: 'Tech Advisory / Fractional CTO', href: '/services/technology-advisory-partnership/', description: 'Senior technology leadership, on demand' },
          { label: 'Digital & Agile Transformation', href: '/services/digital-agile-transformation/', description: 'Coaching, playbooks and training', status: 'proposed' },
          { label: 'Dedicated Teams', href: '/engagement-models/dedicated-teams/', description: 'A managed, cross-functional team' },
          { label: 'Staff Augmentation', href: '/engagement-models/staff-augmentation/', description: 'Skilled specialists inside your team' },
          { label: 'Consulting & Training', href: '/engagement-models/consulting-training/', description: 'Upskill your teams' },
          { label: 'Innovation Tourism', href: '/innovation-tourism/', description: 'Ideate and prototype with our team' },
        ],
      },
      {
        heading: 'Deploy, Integrate, or Govern AI',
        links: [
          { label: 'AI & Agentic Business Solutions', href: '/services/ai-service/', description: 'Custom agents, automation and GenAI strategy' },
          { label: 'Data Quality', href: '/services/data-quality/', description: 'Trustworthy data for AI and decisions' },
          { label: 'AI Governance', href: '/services/ai-governance/', description: 'Oversight for AI in production', status: 'proposed' },
        ],
      },
    ],
    feature: {
      eyebrow: 'Not sure where to start?',
      title: 'Talk to a QualityWorks expert',
      text: 'Describe the problem; we will point you to the right service or tell you if you do not need one.',
      cta: { label: 'Talk to an expert', href: '/contact-us/' },
    },
  },
  {
    id: 'products',
    label: 'Products & Innovations',
    href: '/products/',
    groups: [
      {
        heading: 'Software quality products',
        links: [
          { label: 'QualityWatcher AI', href: '/qualitywatcher-ai-tools/', description: 'AI test creation and automation (qualitywatcher.ai)' },
          { label: 'QualityWatcher Test Management', href: 'https://qualitywatcher.com/', description: 'Test case management (qualitywatcher.com)', external: true },
          { label: 'PRISM™ AI Output Quality Standard', href: '/products/prism/', description: '10-dimension framework for AI outputs', status: 'proposed' },
        ],
      },
      {
        heading: 'Business AI & risk',
        links: [
          { label: 'Agents as a Service', href: '/products/agents-as-a-service/', description: 'Named AI agents for business teams', status: 'proposed' },
          { label: 'Cyber Risk Management (Posture)', href: 'https://www.postured.io/', description: 'Cyber risk platform for suppliers', external: true },
        ],
      },
    ],
    feature: {
      eyebrow: 'Products vs. services',
      title: 'All products in one place',
      text: 'Compare what each product does, who it is for and where it lives.',
      cta: { label: 'View all products', href: '/products/' },
    },
  },
  {
    id: 'who-we-help',
    label: 'Who We Help',
    href: '/industries/',
    groups: [
      {
        heading: 'Industries',
        links: [
          { label: 'Finance & Banking', href: '/industries/finance-banking/' },
          { label: 'Insurance', href: '/industries/insurance/' },
          { label: 'Healthcare', href: '/industries/healthcare/' },
          { label: 'Logistics', href: '/industries/logistics/' },
          { label: 'Media & Entertainment', href: '/industries/media-entertainment/' },
          { label: 'Retail', href: '/industries/retail/' },
          { label: 'Technology', href: '/industries/technology/' },
          { label: 'Social Impact', href: '/industries/social-impact/' },
        ],
      },
      {
        heading: 'Organizations',
        links: [
          { label: 'Public Sector & Utilities', href: '/industries/public-sector/', description: 'Agencies, utilities and public bodies', status: 'proposed' },
          { label: 'Small & Mid-Size Businesses', href: '/industries/small-business/', description: 'Practical AI and software for SMBs', status: 'proposed' },
        ],
      },
    ],
  },
  {
    id: 'results',
    label: 'Results',
    href: '/case-studies/',
    groups: [
      {
        heading: 'Proof',
        links: [
          { label: 'Case Studies', href: '/case-studies/', description: 'Outcomes from client engagements' },
          { label: 'Client Reviews (Clutch)', href: 'https://clutch.co/profile/qualityworks-consulting-group#highlights', description: 'Independent reviews', external: true, status: 'proposed' },
        ],
      },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    href: '/resources/',
    groups: [
      {
        heading: 'Learn',
        links: [
          { label: 'Resource Hub', href: '/resources/', description: 'Articles, whitepapers, news and events', status: 'proposed' },
          { label: 'Blog', href: '/blog/', description: 'Insights from our team' },
          { label: 'Events & Speaking', href: '/events/', description: 'Where to catch our team next', status: 'proposed' },
        ],
      },
    ],
  },
  {
    id: 'company',
    label: 'Company',
    href: '/about-us/',
    groups: [
      {
        heading: 'QualityWorks',
        links: [
          { label: 'About Us', href: '/about-us/' },
          { label: 'Careers', href: '/careers/' },
          { label: 'Contact Us', href: '/contact-us/' },
        ],
      },
    ],
  },
];

export const headerCta = { label: 'Contact us', href: '/contact-us/' };

/** Footer link columns — derived from the same nav data (no separate hardcoded list). */
export function footerColumns() {
  const byId = Object.fromEntries(primaryNav.map((n) => [n.id, n]));
  const flat = (id: string) => (byId[id].groups ?? []).flatMap((g) => g.links);
  return [
    { heading: 'Solutions', links: [{ label: 'All solutions', href: '/services/' }, ...byId.solutions.groups!.map((g) => g.links[0])] },
    { heading: 'Products & Innovations', links: flat('products') },
    { heading: 'Who We Help', links: [{ label: 'All industries', href: '/industries/' }, ...flat('who-we-help').slice(0, 5)] },
    { heading: 'Results & Resources', links: [...flat('results'), ...flat('resources')] },
    { heading: 'Company', links: flat('company') },
  ];
}

/** Every internal route in the navigation (used by QA link checks and sitemap tests). */
export function allNavLinks(): NavLink[] {
  return primaryNav.flatMap((n) => [
    ...(n.href ? [{ label: n.label, href: n.href }] : []),
    ...(n.groups ?? []).flatMap((g) => g.links),
  ]);
}

export function isActive(currentPath: string, item: NavItem): boolean {
  const links = allNavLinksFor(item);
  return links.some((l) => !l.external && (currentPath === l.href || (l.href !== '/' && currentPath.startsWith(l.href))))
    || (item.id === 'solutions' && /^\/(services|engagement-models|maturity-assessments|innovation-tourism)\//.test(currentPath))
    || (item.id === 'products' && /^\/(products|qualitywatcher-ai-tools)\//.test(currentPath))
    || (item.id === 'results' && /^\/case-studies\//.test(currentPath))
    || (item.id === 'resources' && /^\/(blog|resources|events)\//.test(currentPath));
}
function allNavLinksFor(item: NavItem): NavLink[] {
  return [...(item.href ? [{ label: item.label, href: item.href }] : []), ...(item.groups ?? []).flatMap((g) => g.links)];
}
