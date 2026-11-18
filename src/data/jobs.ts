import type { Job } from './types';

/**
 * Careers data is owned by BambooHR (qualityworksconsulting.bamboohr.com).
 * LIVE OBSERVATION 2026-11-17: GET /careers/list → {"meta":{"totalCount":0},"result":[]} (no open roles).
 * Production: fetch the public BambooHR job list at build/request time; never collect résumés on the corporate site.
 *
 * EXPORTS AND CONSUMERS (all used by src/pages/careers/index.astro unless noted)
 *   bambooHr     careers page URL, list endpoint and the observed snapshot (date + role count).
 *   liveJobs     real vacancies; empty because BambooHR reported 0 roles (not imported anywhere yet,
 *                kept as the slot a production fetch would fill).
 *   fixtureJobs  three fictional vacancies used behind the careers page's labelled prototype control
 *                to demonstrate the "roles available" and "expired" states (QA-27).
 *   isExpired    whether a job's closing date has passed.
 *
 * HOW TO EXTEND: real vacancies must come from BambooHR, never be typed in here. To demonstrate a
 *   new state, add a fixture with the "[Fixture]" title prefix and fixture provenance.
 *
 * GOTCHA: the careers page computes expiry at BUILD time, so the "Closed" state reflects the build date.
 */
/** BambooHR endpoints and the last observation of the public job list. */
export const bambooHr = {
  careersUrl: 'https://qualityworksconsulting.bamboohr.com/careers',
  listEndpoint: 'https://qualityworksconsulting.bamboohr.com/careers/list',
  observed: { at: '2026-11-17', totalCount: 0 },
};

/** Real open roles. Intentionally empty: matches the observed BambooHR state (0 roles). */
export const liveJobs: Job[] = [];

/**
 * Fixtures for demonstrating states. NOT real vacancies.
 * fx-1 and fx-2 close on 2026-12-31 and 2027-01-15 (open state when built in Nov 2026; they will
 * eventually expire too); fx-3 closed on 2026-09-30 (expired state). All
 * apply links hand off to the BambooHR careers page.
 */
export const fixtureJobs: Job[] = [
  { id: 'fx-1', title: '[Fixture] Senior QA Automation Engineer', department: 'Quality Engineering', location: 'Kingston, Jamaica', workModel: 'hybrid', employmentType: 'Full-time', postedAt: '2026-11-01', closesAt: '2026-12-31', applicationUrl: 'https://qualityworksconsulting.bamboohr.com/careers', provenance: { source: 'fixture', approval: 'fixture' } },
  { id: 'fx-2', title: '[Fixture] AI Solutions Developer', department: 'Software Development', location: 'Remote (US)', workModel: 'remote', employmentType: 'Contract', postedAt: '2026-10-20', closesAt: '2027-01-15', applicationUrl: 'https://qualityworksconsulting.bamboohr.com/careers', provenance: { source: 'fixture', approval: 'fixture' } },
  { id: 'fx-3', title: '[Fixture] Agile Delivery Coach', department: 'Transformation', location: 'Los Angeles, CA', workModel: 'hybrid', employmentType: 'Full-time', postedAt: '2026-08-01', closesAt: '2026-09-30', applicationUrl: 'https://qualityworksconsulting.bamboohr.com/careers', provenance: { source: 'fixture', approval: 'fixture' } },
];
/**
 * True when `closesAt` is set and the end of that day (23:59:59, in the build machine's local time)
 * is before `now`. Jobs without a closing date never expire.
 */
export const isExpired = (j: Job, now = new Date()) => !!j.closesAt && new Date(j.closesAt + 'T23:59:59') < now;
