import type { Job } from './types';

/**
 * Careers data is owned by BambooHR (qualityworksconsulting.bamboohr.com).
 * LIVE OBSERVATION 2026-11-17: GET /careers/list → {"meta":{"totalCount":0},"result":[]} (no open roles).
 * Production: fetch the public BambooHR job list at build/request time; never collect résumés on the corporate site.
 */
export const bambooHr = {
  careersUrl: 'https://qualityworksconsulting.bamboohr.com/careers',
  listEndpoint: 'https://qualityworksconsulting.bamboohr.com/careers/list',
  observed: { at: '2026-11-17', totalCount: 0 },
};

export const liveJobs: Job[] = [];

/** Fixtures for demonstrating states. NOT real vacancies. */
export const fixtureJobs: Job[] = [
  { id: 'fx-1', title: '[Fixture] Senior QA Automation Engineer', department: 'Quality Engineering', location: 'Kingston, Jamaica', workModel: 'hybrid', employmentType: 'Full-time', postedAt: '2026-11-01', closesAt: '2026-12-31', applicationUrl: 'https://qualityworksconsulting.bamboohr.com/careers', provenance: { source: 'fixture', approval: 'fixture' } },
  { id: 'fx-2', title: '[Fixture] AI Solutions Developer', department: 'Software Development', location: 'Remote (US)', workModel: 'remote', employmentType: 'Contract', postedAt: '2026-10-20', closesAt: '2027-01-15', applicationUrl: 'https://qualityworksconsulting.bamboohr.com/careers', provenance: { source: 'fixture', approval: 'fixture' } },
  { id: 'fx-3', title: '[Fixture] Agile Delivery Coach', department: 'Transformation', location: 'Los Angeles, CA', workModel: 'hybrid', employmentType: 'Full-time', postedAt: '2026-08-01', closesAt: '2026-09-30', applicationUrl: 'https://qualityworksconsulting.bamboohr.com/careers', provenance: { source: 'fixture', approval: 'fixture' } },
];
export const isExpired = (j: Job, now = new Date()) => !!j.closesAt && new Date(j.closesAt + 'T23:59:59') < now;
