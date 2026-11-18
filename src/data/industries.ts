import type { Industry, Provenance } from './types';

const live = (slug: string, note?: string): Provenance => ({ source: 'live-site-copy', approval: 'published-live', sourceUrl: `https://qualityworkscg.com/industries/${slug}/`, retrievedAt: '2026-11-17', note });
const proposed = (note: string): Provenance => ({ source: 'proposed-copy', approval: 'pending-approval', note });
const contact = { label: 'Talk to an industry expert', href: '/contact-us/', kind: 'primary' as const };

export const industries: Industry[] = [
  {
    slug: 'finance-banking', path: '/industries/finance-banking/', name: 'Finance & Banking', status: 'live',
    heroTitle: 'Making quality work for banking and fintech',
    heroLede: 'Innovative banking solutions for the digital world: accurate calculations, secure transactions and experiences customers trust.',
    buyerChallenge: 'Financial institutions must modernize core banking, investment and remittance platforms while every release is checked for calculation accuracy, security and regulatory adherence. Legacy-to-modern integrations multiply the testing workload, and leadership often lacks visibility into test progress.',
    considerations: [
      { title: 'Accuracy and compliance by default', text: 'We work to ensure accurate financial calculations, secure transactions and adherence to regulatory standards, to prevent errors, fraud and financial losses.' },
      { title: 'Modernization without regression', text: 'Legacy platforms often have no documentation or test cases. We build the regression safety net first, then automate it.' },
      { title: 'Capability that stays in-house', text: 'At JMMB, the bank’s existing QA staff were trained in test case management and automation alongside our engineers.' },
    ],
    capabilities: ['test-automation', 'full-stack-testing', 'api-cloud-services-testing', 'digital-agile-transformation'],
    caseStudies: ['jmmb-group-leverages-automation-best-practices', 'fintech-legacy-platform-modernization', 'financial-best-practices'],
    primaryCta: contact, personas: { primary: 'Enterprise CTO / VP Engineering', secondary: 'QA Director' },
    seo: { title: 'QA & Software Testing for Banking and Fintech | QualityWorks', description: 'Test automation, modernization QA and agile delivery for banks and fintech, with published results from JMMB and other financial institutions.' },
    contentDepth: 'full', provenance: live('finance-banking'),
  },
  {
    slug: 'healthcare', path: '/industries/healthcare/', name: 'Healthcare', status: 'live',
    heroTitle: 'Making quality work for healthcare',
    heroLede: 'Delivering quality care while working in compliant systems and processes.',
    buyerChallenge: 'Healthcare organizations must serve professionals and patients through systems that protect patient information and meet HIPAA obligations, while the pace of technology change keeps rising.',
    considerations: [
      { title: 'Compliance-aware teams', text: 'QualityWorks states that its teams receive HIPAA compliance training along with monthly cybersecurity training (claim C19 — confirm before publishing).' },
      { title: 'Delivery maturity', text: 'For Inland Empire Health Plan, a two-week DevOps maturity assessment produced a three-phase transformation roadmap.' },
      { title: 'Patient-facing reliability', text: 'Functional, accessibility and performance testing for patient and provider experiences.' },
    ],
    capabilities: ['maturity-assessments', 'digital-agile-transformation', 'non-functional-testing', 'data-quality'],
    caseStudies: ['building-a-roadmap-to-continuous-improvement'],
    primaryCta: contact, personas: { primary: 'Healthcare IT leader', secondary: 'QA Director' },
    seo: { title: 'Software Quality for Healthcare Organizations | QualityWorks', description: 'Compliance-aware QA, DevOps maturity assessments and accessible, reliable patient and provider experiences for healthcare organizations.' },
    contentDepth: 'full', provenance: live('healthcare'),
  },
  {
    slug: 'social-impact', path: '/industries/social-impact/', name: 'Social Impact', status: 'live',
    heroTitle: 'Making quality work for social impact',
    heroLede: 'Supporting your mission by focusing on quality — with solutions centered on empathy, understanding and cost-effectiveness.',
    buyerChallenge: 'Mission-driven organizations balance tight timelines and budgets, and often need a technology partner who can advise as well as build. A failed platform launch costs donor trust as well as money.',
    considerations: [
      { title: 'Advice before build', text: 'Fractional CTO and product strategy support helps you decide what to build — and what not to.' },
      { title: 'Purpose-built platforms', text: 'Portfolio includes volunteer management, reentry management and disaster care platforms.' },
      { title: 'Vetting partners', text: 'Our team has published guidance on technology partner red flags for nonprofits.' },
    ],
    capabilities: ['technology-advisory-partnership', 'custom-software-development', 'test-automation'],
    caseStudies: ['social-enterprise-org', 'increasing-regression-test-coverage-by-15x'],
    evidenceNote: 'Live page embeds a client video testimonial (VocalVideo). Keep, caption and re-approve.',
    primaryCta: contact, personas: { primary: 'Nonprofit / mission-driven leader', secondary: 'SMB Founder / COO' },
    seo: { title: 'Technology Partner for Nonprofits and Social Impact | QualityWorks', description: 'Advisory, custom software and QA for mission-driven organizations, including Shared Harvest and Children’s Miracle Network Hospitals.' },
    contentDepth: 'full', provenance: live('social-impact'),
  },
  {
    slug: 'public-sector', path: '/industries/public-sector/', name: 'Public Sector & Utilities', status: 'proposed',
    heroTitle: 'Quality engineering for public agencies and utilities',
    heroLede: 'Capability statements, documented approaches and verifiable outcomes for organizations that must account for every system change.',
    buyerChallenge: 'Public bodies and regulated utilities modernize under scrutiny: requirements are formal, audit trails matter, and late QA involvement turns into schedule and budget risk. Procurement teams need clear capability statements and evidence they can verify.',
    considerations: [
      { title: 'Evidence you can verify', text: 'Published work for the Washington Suburban Sanitary Commission (WSSC), a large US water and wastewater utility, piloted AI-powered test case generation with the utility’s QA team.' },
      { title: 'Documented, requirement-based testing', text: 'Approaches are built around requirement traceability, test documentation and coverage metrics that can be reviewed by oversight teams.' },
      { title: 'Human review of AI outputs', text: 'Where AI generates test assets, QA engineers review them; PRISM™ provides a structured way to evaluate AI outputs.' },
      { title: 'Procurement information', text: 'Certifications (WBE, MBE, WOSB), NAICS codes, contract vehicles and a downloadable capability statement are NOT shown until verified documents are supplied — see open question Q-07.' },
    ],
    capabilities: ['maturity-assessments', 'test-automation', 'full-stack-testing', 'ai-governance'],
    products: ['qualitywatcher-ai-tools', 'prism'],
    caseStudies: ['ai-powered-test-case-generation-wssc', 'building-a-roadmap-to-continuous-improvement'],
    evidenceNote: 'The U.S. Navy AI Augmented Testing (AIAT) Challenge (administered with Palmetto Tech Bridge) was a competition prize, not a contract award, and must be described that way.',
    primaryCta: { label: 'Make a procurement inquiry', href: '/contact-us/?topic=procurement', kind: 'primary' },
    personas: { primary: 'Government / public-sector procurement and technology decision-maker', secondary: 'Enterprise CTO' },
    seo: { title: 'Software Quality for Public Agencies and Utilities | QualityWorks', description: 'Requirement-based testing, maturity assessments and AI-assisted QA for public agencies and utilities, with published work for WSSC.' },
    contentDepth: 'full', provenance: proposed('New page for Persona C. Not in live navigation; needs QM-41 approval and verified procurement documents.'),
  },
  {
    slug: 'small-business', path: '/industries/small-business/', name: 'Small & Mid-Size Businesses', status: 'proposed',
    heroTitle: 'Practical AI and software for growing businesses',
    heroLede: 'Start with the problem, not the technology. We help you decide whether you need a ready-made AI agent, a custom build, or neither.',
    buyerChallenge: 'Founders and operators are told AI will fix everything, but budgets are finite. The real questions are where to begin, what implementation involves, and how to avoid paying for something you do not need.',
    considerations: [
      { title: 'Common workflow? Start with an agent', text: 'Lead follow-up, scheduling and support FAQs are covered by named agents on the Agents as a Service marketplace, with setup support included.' },
      { title: 'Unique process? Consider custom', text: 'If the workflow is specific to your business or customer-facing, custom AI solutions or software development fit better.' },
      { title: 'Not sure? Get advice first', text: 'A fractional CTO conversation can save a purchase. We will say so if you do not need one.' },
    ],
    capabilities: ['ai-service', 'custom-software-development', 'technology-advisory-partnership'],
    products: ['agents-as-a-service'],
    caseStudies: ['social-enterprise-org', 'transforming-workforce-development-through-modern-technology'],
    primaryCta: { label: 'Help me choose', href: '/contact-us/?topic=smb-ai', kind: 'primary' },
    personas: { primary: 'SMB Founder / COO', secondary: 'Marketing / Operations leader' },
    seo: { title: 'AI and Software for Small Businesses | QualityWorks', description: 'Decide between a ready-made AI agent, custom software or advice first. Practical AI adoption for small and mid-size businesses.' },
    contentDepth: 'full', provenance: proposed('New audience page for Personas D and E. Needs QM-41 approval.'),
  },
  ...([
    ['insurance', 'Insurance', 'Insurance institutions need to function with a very high level of accuracy while meeting customer needs consistently to keep clients’ confidence and trust.', ['maturity-assessments', 'full-stack-testing'], ['insurance-faster-to-market']],
    ['logistics', 'Logistics', 'Logistics-driven businesses balance tight timelines and supply chain challenges, and need technology that meets complex needs and works consistently.', ['api-cloud-services-testing', 'test-automation'], ['api-test-automation-for-european-delivery-company']],
    ['media-entertainment', 'Media & Entertainment', 'Demanding audiences expect top-tier digital experiences, especially at peak moments like blockbuster presales.', ['non-functional-testing', 'test-automation'], ['leading-entertainment-platform-with-site-reliability-engineering', 'telecom-automation', 'address-quality-gaps']],
    ['retail', 'Retail', 'Ecommerce and distribution businesses need consultants who understand internal and external audiences and the quality challenges of the digital era.', ['test-automation', 'full-stack-testing'], ['accelerating-confidence-qa-modernization-for-wisyncos-digital-ecosystem']],
    ['technology', 'Technology', 'Technology businesses exist in a world that changes constantly, and need consultants who bring solutions and respond quickly.', ['custom-software-development', 'test-automation'], ['how-automation-saved-big-bucks-and-drove-faster-app-releases', 'transforming-workforce-development-through-modern-technology']],
  ] as const).map(([slug, name, challenge, caps, cs]): Industry => ({
    slug, path: `/industries/${slug}/`, name, status: 'live',
    heroTitle: `Making quality work for ${name.toLowerCase()}`, heroLede: challenge, buyerChallenge: challenge,
    considerations: [], capabilities: [...caps], caseStudies: [...cs], primaryCta: contact,
    personas: { primary: 'Enterprise CTO / VP Engineering', secondary: 'QA Director' },
    seo: { title: `Software Quality for ${name} | QualityWorks`, description: `${challenge.slice(0, 120)} QualityWorks testing and delivery for ${name.toLowerCase()}.` },
    contentDepth: 'summary', provenance: live(slug, 'Summary record — full copy to migrate. Live industry pages share one template with near-identical sections (audit C-05).'),
  })),
];

export const industryBySlug = (slug: string) => industries.find((i) => i.slug === slug);
