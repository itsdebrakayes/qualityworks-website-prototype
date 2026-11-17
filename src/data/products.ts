import type { Product, QwTool, AgentRecord, Provenance } from './types';

const observed = (url: string, note?: string): Provenance => ({ source: 'external-platform', approval: 'published-live', sourceUrl: url, retrievedAt: '2026-11-17', note });

export const products: Product[] = [
  {
    slug: 'qualitywatcher-ai-tools', path: '/qualitywatcher-ai-tools/', name: 'QualityWatcher AI Tools', accent: 'teal',
    tagline: 'AI tools for test creation and automation',
    summary: 'Generate test cases from requirements in any format, convert them into UI automation, and get help from an automation expert assistant.',
    kind: 'internal-page', status: 'available', externalUrl: 'https://www.qualitywatcher.ai/',
    provenance: { source: 'live-site-copy', approval: 'published-live', sourceUrl: 'https://qualityworkscg.com/qualitywatcher-ai-tools/', retrievedAt: '2026-11-17' },
  },
  {
    slug: 'qualitywatcher-tcm', path: 'https://qualitywatcher.com/', name: 'QualityWatcher Test Management', accent: 'teal',
    tagline: 'AI test management',
    summary: 'Test case management platform. Listed in the live navigation as “AI Test Management”.',
    kind: 'external-platform', status: 'external', externalUrl: 'https://qualitywatcher.com/',
    provenance: observed('https://qualitywatcher.com/', 'Page title: "QualityWatcher - Next-Gen Test Case Management Tool". Relationship to qualitywatcher.ai must be clarified (audit P-02).'),
  },
  {
    slug: 'agents-as-a-service', path: '/products/agents-as-a-service/', name: 'Agents as a Service', accent: 'green',
    tagline: 'Named AI agents for business teams',
    summary: 'Pre-built AI agents for sales, support, marketing, admin, finance and operations, configured for your tools by QualityWorks and purchased on a separate marketplace.',
    kind: 'external-platform', status: 'external', externalUrl: 'https://agents.qualityworkscg.com/',
    provenance: observed('https://agents.qualityworkscg.com/', 'Marketplace exists but is not linked from the live corporate navigation (audit P-01).'),
  },
  {
    slug: 'prism', path: '/products/prism/', name: 'PRISM™', accent: 'gold',
    tagline: 'The AI output quality standard',
    summary: 'Performance & Reasoning Intelligence Scoring Method: a proprietary 10-dimension framework that grades AI-generated outputs in production on an A+–F scale.',
    kind: 'framework', status: 'awaiting-product-owner',
    provenance: { source: 'live-site-copy', approval: 'published-live', sourceUrl: 'https://qualityworkscg.com/', retrievedAt: '2026-11-17', note: 'Only a homepage teaser exists. No whitepaper URL, dimension list or commercial model found.' },
  },
  {
    slug: 'posture', path: 'https://www.postured.io/', name: 'Posture', accent: 'slate',
    tagline: 'Cyber risk management',
    summary: 'Cyber risk management platform for buyers and suppliers; listed in the live navigation as “Cyber Risk Management”.',
    kind: 'external-platform', status: 'external', externalUrl: 'https://www.postured.io/',
    provenance: observed('https://www.postured.io/', 'Ownership/relationship statement to be confirmed for the products overview.'),
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

/** QualityWatcher AI tools — CTAs probed on 2026-11-17. Status must be re-confirmed by the product owner before launch. */
export const qwTools: QwTool[] = [
  { id: 'rapid-test-case-generation', name: 'Rapid Test Case Generation', description: 'Create real-world test cases from input in any format, with titles, steps, test data and expected results.', ctaLabel: 'Open Test Case Generator', ctaHref: 'https://www.qualitywatcher.ai/test-case-generator', observedStatus: 'requires-sign-in', observedAt: '2026-11-17', provenance: observed('https://www.qualitywatcher.ai/test-case-generator', 'Redirects to /auth/login. Live corporate page still says unregistered users get 3 free uses.') },
  { id: 'test-case-to-ui-automation', name: 'Test Case to UI Automation', description: 'Transform manual test cases, including Test Case Generator output, into automated UI scripts.', ctaLabel: 'Open UI Automation Generator', ctaHref: 'https://www.qualitywatcher.ai/ui-automation-generator', observedStatus: 'requires-sign-in', observedAt: '2026-11-17', provenance: observed('https://www.qualitywatcher.ai/ui-automation-generator', 'Redirects to /auth/login.') },
  { id: 'ask-the-automation-expert', name: 'Ask the Automation Expert', description: 'An assistant with knowledge of test automation frameworks for debugging help and faster code development.', ctaLabel: 'Open Automation Expert', ctaHref: 'https://www.qualitywatcher.ai/expert/playwright-nodejs', observedStatus: 'requires-sign-in', observedAt: '2026-11-17', provenance: observed('https://www.qualitywatcher.ai/expert/playwright-nodejs', 'Redirects to /auth/login.') },
  { id: 'schema-to-api-automation', name: 'Schema to API Automation', description: 'Convert API schemas into automation scripts in your preferred programming language.', ctaLabel: 'Status unconfirmed', ctaHref: 'https://www.qualitywatcher.ai/api-automation-generator', observedStatus: 'not-found-404', observedAt: '2026-11-17', provenance: observed('https://www.qualitywatcher.ai/api-automation-generator', 'Returned HTTP 404. CTA disabled in prototype until the product owner confirms status.') },
];

/**
 * AGENT CATALOG — snapshot of public records observed on agents.qualityworkscg.com on 2026-11-17.
 * The marketplace is the source of truth for availability and price; the corporate site must
 * either read these from an approved marketplace API or link out without duplicating prices.
 * The prototype UI deliberately does NOT display prices (see docs/04-content-schemas.md §Agents).
 */
const mkt = 'https://agents.qualityworkscg.com/';
const agent = (id: string, name: string, role: string, category: string, description: string, availabilityStatus: AgentRecord['availabilityStatus'], price: number): AgentRecord => ({
  id, name, role, category, description, businessFunction: category, availabilityStatus,
  integrations: [], // NOT published on the catalog card — unknown; do not invent
  pricingInterval: 'monthly', price, setupFee: null, // setup fee shown only for packages
  ctaLabel: 'View on marketplace', ctaDestination: mkt, lastUpdated: '2026-11-17',
  provenance: observed(mkt, 'Snapshot from public catalog; integrations and setup fee not shown per agent.'),
});
export const agentSnapshot: AgentRecord[] = [
  agent('kai-customer-service', 'Kai', 'AI Customer Service Agent', 'Partnerships / Customer Success', 'Handles common support questions quickly while keeping human review in control.', 'quick-launch', 399),
  agent('nia-receptionist', 'Nia', 'AI Receptionist', 'Partnerships / Customer Success', 'Greets prospects, captures details, books appointments, and routes urgent requests.', 'custom-build', 349),
  agent('lena-knowledge-base', 'Lena', 'Knowledge Base Specialist', 'Partnerships / Customer Success', 'Turns repeated customer questions into reusable support content.', 'quick-launch', 179),
  agent('avery-marketing', 'Avery', 'AI Marketing Agent', 'PR & Marketing', 'Keeps marketing consistent by repurposing updates into campaigns and review-ready content.', 'quick-launch', 349),
  agent('maya-pr-outreach', 'Maya', 'PR Outreach Specialist', 'PR & Marketing', 'Builds targeted media lists, drafts pitches, and tracks replies.', 'ready-now', 199),
  agent('morgan-sales', 'Morgan', 'AI Sales Agent', 'Sales', 'Keeps lead response, qualification, and follow-up moving across the sales pipeline.', 'quick-launch', 399),
  agent('jordan-follow-up', 'Jordan', 'Sales Follow-Up Agent', 'Sales', 'Keeps prospects moving with timely, useful next steps.', 'quick-launch', 199),
  agent('elliot-meeting-reviewer', 'Elliot', 'Meeting Reviewer', 'Sales', 'Finds decisions, risks, and next steps hiding inside call notes.', 'ready-now', 199),
];
export const agentCatalogFacts = {
  totalAgentsObserved: 23,
  departments: ['Partnerships / Customer Success', 'PR & Marketing', 'Sales', 'Operations', 'Accounting', 'Admin / Executive Support'],
  steps: [
    { title: 'Choose', text: 'Browse agents or ready-made packages on the marketplace.' },
    { title: 'Set up', text: 'After purchase, book a short onboarding session to connect your tools and workflows.' },
    { title: 'Launch', text: 'QualityWorks finalizes setup and deploys the agents into your workstream.' },
  ],
  source: observed(mkt, '“How it works” section, 3 steps.'),
};
