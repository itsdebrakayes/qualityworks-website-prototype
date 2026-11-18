/**
 * ALT TEXT (review round 1, item 4). Written after viewing each image on 2026-11-18; replaces weak
 * WordPress alt text ("untitled design 3", "Contact QualityWorks Image", "Medical Graphic").
 * Images that contain words carry those words. Copy needs marketing approval with the rest of the content.
 *
 * WHAT: hand-written alt text for the featured image of every migrated case study and article,
 *   keyed by slug. Audit item A11Y-03 (cited in articles.ts) flagged the WordPress alt text as weak.
 *
 * EXPORTS AND CONSUMERS
 *   caseStudyAlt  read by src/data/caseStudies.ts (`altText: caseStudyAlt[slug] ?? r.alt ?? ''`).
 *   articleAlt    read by src/data/articles.ts (`imageAlt: articleAlt[p.slug] ?? p.imageAlt ?? ''`).
 *   When a slug has no entry here, the WordPress alt text (possibly empty) is used instead.
 *
 * HOW TO EXTEND: after adding a case study or article, look at its image and add one entry:
 *   describe what is shown (people, setting, action) in one sentence, and transcribe any words
 *   printed in the image. No "image of" prefix.
 *
 * GOTCHAS
 *   - Case-study keys are PUBLIC slugs (after the neutral renames in redirects.json), not the
 *     WordPress slugs. Article keys are the WordPress post slugs (unchanged on the site).
 *   - A misspelt key fails silently (the fallback alt text is used), so copy slugs exactly.
 *   - This file is scanned by scripts/content-check.mjs like any other source file.
 */
/** Case-study featured-image alt text, keyed by public case-study slug (17 records, one per migrated case study). */
export const caseStudyAlt: Record<string, string> = {
  'accelerating-confidence-qa-modernization-for-wisyncos-digital-ecosystem': 'Warehouse staff in yellow uniforms packing boxes on a distribution floor',
  'address-quality-gaps': 'Software developer smiling at her desk in front of two monitors showing code',
  'ai-powered-test-case-generation-wssc': 'Team of five in an office meeting around laptops',
  'api-test-automation-for-european-delivery-company': 'DPD delivery courier in a red DPD uniform and cap',
  'building-a-roadmap-to-continuous-improvement': 'Team planning at a whiteboard covered in sticky notes',
  'financial-best-practices': 'Developer at a desk with arms raised in celebration in front of a monitor',
  'how-automation-saved-big-bucks-and-drove-faster-app-releases': 'Robotic hand typing on a laptop keyboard',
  'increasing-regression-test-coverage-by-15x': 'Doctor holding a stethoscope in a bright hospital corridor',
  'insurance-faster-to-market': 'Two developers reviewing work together at computer workstations',
  'fintech-legacy-platform-modernization': 'Two developers discussing code on a monitor',
  'jmmb-group-leverages-automation-best-practices': 'Banking adviser in conversation with a client across a desk',
  'leading-entertainment-platform-with-site-reliability-engineering': 'Star Wars: Return of the Jedi film poster',
  'mobile-game-development-creating-legacy': 'Title screen of the Legacy mobile game with New Game, Continue and Settings buttons and cartoon characters',
  'performance-testing-for-presale-of-star-wars-the-last-jedi': 'Star Wars: The Last Jedi promotional banner with characters and BB-8',
  'social-enterprise-org': 'Group of young professionals working together on laptops',
  'telecom-automation': 'Developer’s hands on a keyboard in front of a monitor showing code',
  'transforming-workforce-development-through-modern-technology': 'Two transit maintenance workers in safety gear reviewing a tablet in a rail depot',
};

/** Article featured-image alt text, keyed by WordPress post slug (one per migrated post). */
export const articleAlt: Record<string, string> = {
  'more-qa-not-less-closing-the-verification-gap-in-ai-accelerated-software-delivery': 'Cover of the QualityWorks whitepaper “More QA, Not Less: Closing the Verification Gap in AI-Accelerated Software Delivery”',
  'top-7-black-technology-companies-to-watch-in-2026': 'Black technology leaders collaborating around a digital display',
  'unpopular-qa-opinions-that-are-just-facts': 'Professional woman holding an open laptop',
  'qa-is-changing-why-agentic-qa-may-become-the-next-big-shift-in-software-quality': 'Woman at a desk with two monitors showing code',
  'qualityworks-wins-us-navy-ai-testing-challenge': 'QualityWorks CEO Stacy Kirk accepting a $75,000 prize check with U.S. Navy leaders',
  'ai-powered-saas-ideas-by-industry-for-2026-growth': 'Text prompt reading “Build me an app…” over a blurred software dashboard',
  'qualityworks-wins-inc-best-in-business-2025-award': 'Team celebrating at a computer with an Inc. Best in Business 2025 badge',
  'determined-testers-in-non-deterministic-systems-4-invaluable-characteristics-for-genai-testers': 'Two testers smiling in front of a whiteboard of diagrams',
  'technology-partner-red-flags-what-nonprofits-need-to-know': 'Graphic titled “Technology Partner Red Flags: What Nonprofits Need to Know” showing a figure at a crossroads of innovation and success',
  '5-smart-ai-moves-for-your-small-business-building-your-competitive-edge': 'QualityWorks graphic titled “5 Smart AI Moves for Your Small Business: Building Your Competitive Edge” with a person climbing a staircase',
  'four-critical-challenges-engineering-leaders-without-qa-teams-can-solve': 'QualityWorks graphic titled “Four Critical Challenges Engineering Leaders Without QA Can Solve” with a man holding a “Need testing” sign',
  'announcing-stacy-kirks-upcoming-speaking-engagement-at-the-2025-nonprofit-technology-conference-ntc': '2025 Nonprofit Technology Conference graphic for Stacy Kirk’s session “Accountability and Success: Practical Tips for Technology Partnerships”',
};
