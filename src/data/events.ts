import type { EventRecord } from './types';

/**
 * Events. Status is DERIVED at render time from dates (upcoming / past) unless cancelled —
 * an event whose end date has passed can never show a registration CTA.
 * Prototype "today" is the build date; production should compute on request or rebuild daily.
 */
export const events: EventRecord[] = [
  {
    id: 'pnsqc-2026', slug: 'pnsqc-2026', title: 'Pacific Northwest Software Quality Conference 2026',
    summary: 'Test Design Is Not Dead: It Just Looks Different Now — a fireside chat with Stacy Kirk and the Smartesting team.',
    startDate: '2026-10-12T08:00:00-07:00', endDate: '2026-10-14T17:00:00-07:00', timeZone: 'America/Los_Angeles',
    venueType: 'in-person', venue: 'Portland, Oregon', registrationUrl: 'https://pnsqc.org/conference/2026/at-a-glance/', status: 'scheduled',
    description: 'Fireside chat: AI generates tests. But does it generate the right tests? Stacy has opinions. Bring your own as Stacy Kirk argues the topic with the Smartesting team.',
    speaker: 'Stacy Kirk',
    provenance: { source: 'live-site-copy', approval: 'published-live', sourceUrl: 'https://qualityworkscg.com/', retrievedAt: '2026-11-17', note: 'Dates verified on pnsqc.org (10/12/2026–10/14/2026). The live homepage still promotes this past event as "See Her Next Event" — audit item C-03.' },
  },
  {
    id: 'bow-growth-2026', slug: 'bow-growth-conference-2026', title: 'BOW Growth Conference 2026',
    summary: 'Building an AI-Ready GovCon Business.',
    startDate: '', endDate: '', timeZone: 'America/New_York', venueType: 'in-person',
    registrationUrl: 'https://www.thebowcollective.org/event-details/bow-growth-conference-2026', status: 'scheduled',
    description: 'Session topic as listed on the live homepage: Building an AI-Ready GovCon Business.',
    speaker: 'Stacy Kirk',
    provenance: { source: 'live-site-copy', approval: 'not-verified', sourceUrl: 'https://qualityworkscg.com/', retrievedAt: '2026-11-17', note: 'Event date could not be verified (organiser page renders dates client-side). Shown as "Date to be confirmed"; registration hidden until a date is entered.' },
  },
  {
    id: 'ntc-2025', slug: 'ntc-2025', title: 'Nonprofit Technology Conference 2025',
    summary: 'Stacy Kirk speaking session, as announced on the QualityWorks blog.',
    startDate: '2025-03-19T09:00:00-05:00', endDate: '2025-03-21T17:00:00-05:00', timeZone: 'America/Chicago', venueType: 'in-person',
    status: 'scheduled', description: 'See the announcement post for session details.', speaker: 'Stacy Kirk',
    provenance: { source: 'wordpress-migrated', approval: 'not-verified', sourceUrl: 'https://qualityworkscg.com/announcing-stacy-kirks-upcoming-speaking-engagement-at-the-2025-nonprofit-technology-conference/', note: 'Exact dates not verified — illustrative dates used to demonstrate the past-event state.' },
  },
  {
    id: 'fixture-webinar-upcoming', slug: 'fixture-agentic-qa-webinar', title: '[Fixture] Agentic QA in practice — webinar',
    summary: 'Illustrative upcoming online event used to demonstrate the registration state.',
    startDate: '2027-02-10T11:00:00-05:00', endDate: '2027-02-10T12:00:00-05:00', timeZone: 'America/New_York', venueType: 'online',
    registrationUrl: '#fixture-registration', status: 'scheduled',
    description: 'This is not a real event. It exists only to show how an upcoming online event with registration appears.',
    provenance: { source: 'fixture', approval: 'fixture' },
  },
  {
    id: 'fixture-cancelled', slug: 'fixture-cancelled-meetup', title: '[Fixture] Quality engineering meetup — Kingston',
    summary: 'Illustrative cancelled event used to demonstrate the cancelled state.',
    startDate: '2027-01-20T18:00:00-05:00', endDate: '2027-01-20T20:00:00-05:00', timeZone: 'America/Jamaica', venueType: 'in-person', venue: 'Kingston, Jamaica',
    registrationUrl: '#fixture-registration', status: 'cancelled',
    description: 'This is not a real event. It exists only to show that cancelled events never show registration.',
    provenance: { source: 'fixture', approval: 'fixture' },
  },
];

export type EventPhase = 'upcoming' | 'past' | 'cancelled' | 'date-tbc';
export function eventPhase(e: EventRecord, now = new Date()): EventPhase {
  if (e.status === 'cancelled') return 'cancelled';
  if (!e.startDate || !e.endDate) return 'date-tbc';
  return new Date(e.endDate) < now ? 'past' : 'upcoming';
}
export function canRegister(e: EventRecord, now = new Date()) {
  return eventPhase(e, now) === 'upcoming' && !!e.registrationUrl;
}
export function formatEventDate(e: EventRecord) {
  if (!e.startDate) return 'Date to be confirmed';
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric', timeZone: e.timeZone };
  const s = new Date(e.startDate).toLocaleDateString('en-US', opts);
  const en = new Date(e.endDate).toLocaleDateString('en-US', opts);
  return s === en ? s : `${s} – ${en}`;
}
export const eventBySlug = (slug: string) => events.find((e) => e.slug === slug);
