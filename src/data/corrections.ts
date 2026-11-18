/**
 * EDITORIAL CORRECTIONS LAYER (review round 1 — Johnny's AI review, actioned 2026-11-18).
 *
 * Migrated WordPress content stays untouched in src/data/migrated/*.json (traceability). These
 * targeted corrections are applied at build time and every one is listed in
 * docs/11-review-resolution.md for Janique's approval. A correction whose `find` text no longer
 * matches FAILS THE BUILD, so stale corrections cannot silently stop applying.
 */
export interface Correction {
  id: string;
  target: string;          // 'article:{slug}' | 'case-study:{slug}'
  field: string;           // title | excerpt | bodyHtml | customer | challenge | approach | outcome
  find: string | RegExp;
  replace: string;
  reason: 'terminology' | 'award-name' | 'unverified-statistic' | 'client-disclosure';
  note: string;
}

const NAVY = 'U.S. Navy AI Augmented Testing (AIAT) Challenge';
const GARTNER_LINK = /<a href="https:\/\/www\.gartner\.com[^"]*"[^>]*>Gartner<\/a>/.source;

export const corrections: Correction[] = [
  // ── Award name (source: the news post body names the "Artificial Intelligence Augmented Testing (AIAT) Prize Challenge")
  { id: 'R-01', target: 'article:qualityworks-wins-us-navy-ai-testing-challenge', field: 'title', find: 'U.S. Navy AI Autonomous Testing Challenge', replace: NAVY, reason: 'award-name', note: 'Published title used an incorrect challenge name. URL slug unchanged.' },
  { id: 'R-02', target: 'article:qualityworks-wins-us-navy-ai-testing-challenge', field: 'bodyHtml', find: 'U.S. Navy AI Autonomous Testing Challenge', replace: NAVY, reason: 'award-name', note: 'Headline repeated in body.' },
  { id: 'R-03', target: 'article:qualityworks-wins-us-navy-ai-testing-challenge', field: 'bodyHtml', find: 'its AI autonomous testing platform', replace: 'its AI-powered testing platform', reason: 'terminology', note: 'Company description of QualityWatcher.' },
  { id: 'R-04', target: 'article:qualityworks-wins-us-navy-ai-testing-challenge', field: 'bodyHtml', find: 'Runs tests autonomously', replace: 'Runs tests automatically', reason: 'terminology', note: 'Product capability description.' },
  { id: 'R-05', target: 'article:qa-is-changing-why-agentic-qa-may-become-the-next-big-shift-in-software-quality', field: 'bodyHtml', find: 'PEO AI Autonomous Testing Challenge', replace: `PEO MLB ${NAVY.replace('U.S. Navy ', '')}`, reason: 'award-name', note: 'Incorrect challenge name in article body.' },
  { id: 'R-06', target: 'article:qa-is-changing-why-agentic-qa-may-become-the-next-big-shift-in-software-quality', field: 'bodyHtml', find: 'supporting autonomous execution', replace: 'supporting automated execution', reason: 'terminology', note: 'Product capability description.' },
  { id: 'R-07', target: 'article:qa-is-changing-why-agentic-qa-may-become-the-next-big-shift-in-software-quality', field: 'bodyHtml', find: 'Everyone wants to ship.', replace: 'Everyone wants to launch.', reason: 'terminology', note: '' },
  { id: 'R-08', target: 'article:top-7-black-technology-companies-to-watch-in-2026', field: 'bodyHtml', find: 'autonomous execution', replace: 'automated execution', reason: 'terminology', note: 'Description of QualityWorks/QualityWatcher.' },
  { id: 'R-09', target: 'article:top-7-black-technology-companies-to-watch-in-2026', field: 'bodyHtml', find: 'execute tests autonomously', replace: 'execute tests automatically', reason: 'terminology', note: 'Description of QualityWatcher.' },
  // ── "ship" in company-authored article copy (physical "Hazmat shipping documentation" in the SaaS-ideas post is a logistics term and is retained)
  { id: 'R-10', target: 'article:unpopular-qa-opinions-that-are-just-facts', field: 'bodyHtml', find: 'your team ships a broken release', replace: 'your team puts out a broken release', reason: 'terminology', note: '' },
  { id: 'R-11', target: 'article:unpopular-qa-opinions-that-are-just-facts', field: 'excerpt', find: 'your team ships a broken release', replace: 'your team puts out a broken release', reason: 'terminology', note: 'Excerpt repeats the opening line.' },
  { id: 'R-12', target: 'article:unpopular-qa-opinions-that-are-just-facts', field: 'bodyHtml', find: /you(&#8217;|’)re shipping is actually verified/, replace: 'you release is actually verified', reason: 'terminology', note: 'Replaces “what you’re shipping”.' },
  { id: 'R-13', target: 'article:unpopular-qa-opinions-that-are-just-facts', field: 'bodyHtml', find: /ready to ship\./, replace: 'ready to release.', reason: 'terminology', note: '' },
  { id: 'R-14', target: 'article:unpopular-qa-opinions-that-are-just-facts', field: 'bodyHtml', find: 'validated before shipping', replace: 'validated before release', reason: 'terminology', note: '' },
  { id: 'R-15', target: 'article:unpopular-qa-opinions-that-are-just-facts', field: 'bodyHtml', find: 'cleared to ship', replace: 'cleared to go live', reason: 'terminology', note: '' },
  { id: 'R-16', target: 'article:unpopular-qa-opinions-that-are-just-facts', field: 'bodyHtml', find: 'documented decision to ship', replace: 'documented decision to release', reason: 'terminology', note: '' },
  { id: 'R-17', target: 'article:unpopular-qa-opinions-that-are-just-facts', field: 'bodyHtml', find: 'ship with confidence', replace: 'release with confidence', reason: 'terminology', note: '' },
  { id: 'R-18', target: 'article:unpopular-qa-opinions-that-are-just-facts', field: 'bodyHtml', find: /Still ship knowing/g, replace: 'Still release knowing', reason: 'terminology', note: 'Two occurrences.' },
  { id: 'R-19', target: 'article:unpopular-qa-opinions-that-are-just-facts', field: 'bodyHtml', find: /They still ship knowing/g, replace: 'They still release knowing', reason: 'terminology', note: '' },
  { id: 'R-20', target: 'article:unpopular-qa-opinions-that-are-just-facts', field: 'bodyHtml', find: 'shipping fast', replace: 'releasing fast', reason: 'terminology', note: '' },
  { id: 'R-21', target: 'case-study:leading-entertainment-platform-with-site-reliability-engineering', field: 'outcome', find: 'freeing teams to ship new features faster', replace: 'freeing teams to release new features faster', reason: 'terminology', note: '' },
  // ── Unverified third-party statistic (Gartner primary source returned HTTP 403 to verification on 2026-11-18)
  { id: 'R-22', target: 'article:more-qa-not-less-closing-the-verification-gap-in-ai-accelerated-software-delivery', field: 'bodyHtml', find: new RegExp(`${GARTNER_LINK} forecasts that 90% of enterprise software engineers will use AI code assistants by 2028, while (<a [^>]*>Stack Overflow(?:&#8217;|’)s 2025 survey</a>)[\\s\\u00a0]found 84% of developers already use or plan to use AI tools\\.¹²`), replace: '$1 found 84% of developers already use or plan to use AI tools.²', reason: 'unverified-statistic', note: 'Gartner 90% forecast removed: exact wording, date and context could not be verified at the primary source.' },
  { id: 'R-23', target: 'article:more-qa-not-less-closing-the-verification-gap-in-ai-accelerated-software-delivery', field: 'bodyHtml', find: /<div>\s*<div>90%<\/div>\s*<h3>AI adoption is accelerating<\/h3>\s*<p>Gartner forecasts[^<]*<\/p>\s*<\/div>/, replace: '', reason: 'unverified-statistic', note: '“Key findings” 90% card removed.' },
  { id: 'R-24', target: 'article:more-qa-not-less-closing-the-verification-gap-in-ai-accelerated-software-delivery', field: 'bodyHtml', find: new RegExp(`found 84% of developers use or plan to use AI tools,[\\s\\u00a0]and[\\s\\u00a0]${GARTNER_LINK} forecasts that 90% of enterprise software engineers will use AI code assistants by 2028\\.¹²`), replace: 'found 84% of developers use or plan to use AI tools.²', reason: 'unverified-statistic', note: 'Second occurrence. Reference list entry 1 retained so footnote numbering stays intact — editor to decide.' },
  // ── WSSC: "30–80% / up to 80%" removed — no WSSC report with methodology is available to the project
  { id: 'R-25', target: 'case-study:ai-powered-test-case-generation-wssc', field: 'excerpt', find: /^[\s\S]*$/, replace: 'WSSC partnered with QualityWorks to pilot an AI-powered test case generation tool with its QA team.', reason: 'unverified-statistic', note: '“reduced QA effort by up to 80%” removed pending the WSSC pilot report.' },
  { id: 'R-26', target: 'case-study:ai-powered-test-case-generation-wssc', field: 'outcome', find: /^80% Test Creation Time Savings 67% Reported Efficiency 100% Continued Investment\s*/, replace: '', reason: 'unverified-statistic', note: 'Headline result figures removed.' },
  { id: 'R-27', target: 'case-study:ai-powered-test-case-generation-wssc', field: 'outcome', find: /30–80% time savings in test case creation \(depending on complexity\)\.\s*/, replace: '', reason: 'unverified-statistic', note: 'Figure removed; qualitative outcomes retained.' },
  // ── iPipelines: "2 weeks to 2 days" removed; client name not inferred from "via 3CI"
  { id: 'R-28', target: 'case-study:ipipelines-legacy-platform-modernization', field: 'customer', find: /QualityWorks helped them reduce regression testing cycles from 2 weeks to just 2 days while establishing/, replace: 'QualityWorks helped them establish', reason: 'unverified-statistic', note: '“2 weeks to 2 days” removed (no approved source).' },
  { id: 'R-29', target: 'case-study:ipipelines-legacy-platform-modernization', field: 'outcome', find: /The regression testing cycle was dramatically reduced from two weeks to just two days, resulting in an/, replace: 'The engagement resulted in an', reason: 'unverified-statistic', note: '“two weeks to two days” removed.' },
  { id: 'R-30', target: 'case-study:ipipelines-legacy-platform-modernization', field: 'outcome', find: /^85% Reduction in Testing Time 90% Automation Coverage 80%\+ Work Effort Savings\s*/, replace: '', reason: 'unverified-statistic', note: 'Headline figure strip removed with the derived “85% reduction in testing time”.' },
  { id: 'R-31', target: 'case-study:ipipelines-legacy-platform-modernization', field: 'customer', find: /QualityWorks partnered with 3CI(?:’|&#8217;|')s client, a leading/, replace: 'QualityWorks partnered with a leading', reason: 'client-disclosure', note: 'Partner/client relationship not disclosed without approval.' },
  { id: 'R-32', target: 'article:qualityworks-wins-us-navy-ai-testing-challenge', field: 'excerpt', find: 'U.S. Navy AI Autonomous Testing Challenge', replace: NAVY, reason: 'award-name', note: 'Excerpt shown on article cards.' },
  { id: 'R-33', target: 'article:qualityworks-wins-us-navy-ai-testing-challenge', field: 'excerpt', find: 'its AI autonomous testing platform', replace: 'its AI-powered testing platform', reason: 'terminology', note: 'Excerpt shown on article cards.' },
  { id: 'R-34', target: 'article:qa-is-changing-why-agentic-qa-may-become-the-next-big-shift-in-software-quality', field: 'excerpt', find: 'Everyone wants to ship.', replace: 'Everyone wants to launch.', reason: 'terminology', note: 'Excerpt shown on article cards.' },
  { id: 'R-35', target: 'article:qualityworks-wins-us-navy-ai-testing-challenge', field: 'tags', find: 'Autonomous Testing', replace: 'AI-Augmented Testing', reason: 'terminology', note: 'WordPress tag label shown under the article; CMS tag rename needed at migration.' },
  { id: 'R-36', target: 'article:more-qa-not-less-closing-the-verification-gap-in-ai-accelerated-software-delivery', field: 'excerpt', find: /Gartner forecasts that 90% of enterprise software engineers will use AI code assistants by…/, replace: 'Stack Overflow’s 2025 survey found 84% of developers already use or plan to use AI tools…', reason: 'unverified-statistic', note: 'Card excerpt repeated the removed Gartner forecast.' },
  { id: 'R-37', target: 'case-study:ai-powered-test-case-generation-wssc', field: 'approach', find: / and cutting creation time by up to 80%\./, replace: '.', reason: 'unverified-statistic', note: '“up to 80%” removed from the solution narrative.' },
  { id: 'R-38', target: 'case-study:ipipelines-legacy-platform-modernization', field: 'challenge', find: /, which took up to two weeks per cycle and consumed critical team resources\./, replace: ', which consumed critical team resources.', reason: 'unverified-statistic', note: 'Baseline half of the removed “2 weeks to 2 days” comparison.' },
];

const used = new Set<string>();
/** Apply all corrections for target+field. Throws if a correction no longer matches. */
export function applyCorrections(target: string, field: string, value: string): string {
  let out = value ?? '';
  for (const c of corrections) {
    if (c.target !== target || c.field !== field) continue;
    // Spaces in a pattern match any whitespace, incl. non-breaking spaces used by WordPress.
    const src = typeof c.find === 'string' ? c.find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : c.find.source;
    const re = new RegExp(src.replace(/ /g, '[\\s\\u00a0]+'), typeof c.find === 'string' ? 'g' : c.find.flags);
    if (!new RegExp(re.source, re.flags.replace('g', '')).test(out)) throw new Error(`Correction ${c.id} (${target} ${field}) no longer matches its source text`);
    out = out.replace(re, c.replace);
    used.add(c.id);
  }
  return out;
}
export const appliedCorrectionIds = () => used;
