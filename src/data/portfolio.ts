/**
 * CUSTOM DEVELOPMENT PORTFOLIO — SAMPLE PROJECTS (executive review, Stacy Kirk, 24 Nov 2026).
 *
 * WHAT: the projects shown in the cinematic portfolio gallery (components/PortfolioGallery.astro) on
 *   /services/custom-software-development/#portfolio and, as a three-project preview, on the homepage.
 *
 * WHY: Stacy asked for "an online portfolio": the screen behind it, what the technology does, a testimonial
 *   and an industry tag, and said "even if you have fake data, let's just look at a couple designs".
 *
 * HONESTY RULES (CONTRIBUTING.md rule 1):
 *   - EVERY record below is FICTIONAL SAMPLE CONTENT (`sample: true`). The organisations, people, quotes and
 *     numbers are invented to evaluate the design. None is attributed to a real client.
 *   - The gallery shows a visible "Sample project" label on each record while `sample` is true, and release
 *     builds mark it as a release blocker.
 *   - Screens are illustrative interfaces rendered in HTML/CSS (components/AppScreen.astro) with fake data.
 *
 * HOW TO REPLACE WITH A REAL PROJECT: add a record with the client's approved name, set `sample: false`,
 *   add approved outcomes (with a claim ID where a figure is shown) and an approved testimonial, and either
 *   keep a `screen` spec or add `shots` (real screenshot paths under public/portfolio/). Stacy estimates about
 *   ten past projects where clients may allow screens to be shown (docs/17 §5).
 */
export interface ScreenSpec {
  /** Product name shown in the app header. */
  app: string;
  /** Left navigation items (first is active). */
  nav: string[];
  /** Headline tiles. */
  kpis: { l: string; v: string; d?: string }[];
  /** Chart: 'line' | 'bars'. Values 0–100. */
  chart: 'line' | 'bars';
  series: number[];
  chartLabel: string;
  /** Table rows: [primary, secondary, status]. */
  rows: [string, string, string][];
  /** Phone companion screen. */
  phone: { title: string; hero: string; heroSub: string; items: [string, string][] ; cta: string };
}
export interface PortfolioProject {
  slug: string;
  sample: boolean;
  name: string;
  client: string;
  industry: string;
  platforms: string;
  /** Brand accent for the mock screens (any CSS colour). */
  accent: string;
  challenge: string;
  built: string;
  tech: string[];
  outcomes: { v: string; l: string }[];
  testimonial: { quote: string; who: string; role: string };
  screen: ScreenSpec;
}

export const portfolio: PortfolioProject[] = [
  {
    slug: 'member-banking', sample: true, name: 'Member banking app', client: 'Harborline Credit Union (fictional)', industry: 'Finance & banking', platforms: 'iOS · Android · Web',
    accent: '#289DAD',
    challenge: 'Members were calling the branch for tasks a phone should handle, and the legacy portal failed accessibility audits.',
    built: 'A member app and web portal with biometric sign-in, instant transfers, card controls and plain-language spending insights, tested end to end before every release.',
    tech: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL', 'Azure'],
    outcomes: [{ v: '4.8 / 5', l: 'App store rating (sample)' }, { v: '−38%', l: 'Branch support calls (sample)' }],
    testimonial: { quote: 'They treated our members like their own customers. The app launched on schedule and the first release just worked.', who: 'Sample client name', role: 'VP Digital, credit union (sample)' },
    screen: { app: 'Harborline', nav: ['Accounts', 'Transfers', 'Cards', 'Insights', 'Support'], kpis: [{ l: 'Available balance', v: '$12,480.22' }, { l: 'Spent this month', v: '$2,316.40', d: '−8%' }, { l: 'Savings goal', v: '72%' }], chart: 'line', series: [30, 42, 38, 55, 49, 63, 58, 71, 69, 80], chartLabel: 'Balance, last 10 weeks',
      rows: [['Payroll deposit', 'Today', '+$3,150.00'], ['Grocery market', 'Yesterday', '−$86.42'], ['Utility autopay', 'Nov 21', '−$142.10']],
      phone: { title: 'Good morning, Alex', hero: '$12,480.22', heroSub: 'Available balance', items: [['Transfer', 'Instant'], ['Card controls', 'On'], ['Round-up savings', '$18.40']], cta: 'Send money' } },
  },
  {
    slug: 'patient-portal', sample: true, name: 'Patient portal & scheduling', client: 'Meridian Community Clinics (fictional)', industry: 'Healthcare', platforms: 'Web · iOS · Android',
    accent: '#2CAF81',
    challenge: 'Appointment no-shows were high and front-desk staff re-keyed intake forms from paper.',
    built: 'A HIPAA-minded patient portal with self-scheduling, digital intake, reminders and secure messaging, integrated with the clinic’s EHR through FHIR APIs.',
    tech: ['Next.js', 'FHIR APIs', 'Python', 'AWS', 'Playwright'],
    outcomes: [{ v: '−27%', l: 'No-shows (sample)' }, { v: '9 min', l: 'Saved per check-in (sample)' }],
    testimonial: { quote: 'Patients book themselves now. Our front desk finally has time for the people standing in front of them.', who: 'Sample client name', role: 'Operations Director, clinic network (sample)' },
    screen: { app: 'Meridian Care', nav: ['Schedule', 'Patients', 'Intake', 'Messages', 'Reports'], kpis: [{ l: 'Appointments today', v: '142' }, { l: 'Checked in', v: '96', d: '+12' }, { l: 'Forms completed', v: '91%' }], chart: 'bars', series: [55, 68, 74, 62, 80, 88, 70], chartLabel: 'Self-scheduled visits, last 7 days',
      rows: [['Dr. Rivera · Family medicine', '9:30 AM', 'Checked in'], ['Dr. Chen · Pediatrics', '10:15 AM', 'Intake done'], ['Telehealth · Follow-up', '11:00 AM', 'Upcoming']],
      phone: { title: 'Your next visit', hero: 'Thu 10:15', heroSub: 'Pediatrics · Main Street', items: [['Intake form', 'Complete'], ['Reminder', 'SMS'], ['Messages', '2 new']], cta: 'Book a visit' } },
  },
  {
    slug: 'fleet-ops', sample: true, name: 'Fleet operations platform', client: 'Northline Freight (fictional)', industry: 'Logistics', platforms: 'Web · Android (driver)',
    accent: '#1D766F',
    challenge: 'Dispatchers tracked 300 trucks across spreadsheets and phone calls, and late deliveries were found after the fact.',
    built: 'A live dispatch dashboard and driver app with route optimisation, proof-of-delivery capture and exception alerts, load-tested for peak season.',
    tech: ['Vue', 'Kotlin', 'Go', 'Kafka', 'Google Cloud'],
    outcomes: [{ v: '+18%', l: 'On-time deliveries (sample)' }, { v: '300', l: 'Vehicles live (sample)' }],
    testimonial: { quote: 'We see problems before customers do. That alone changed how our dispatch team works.', who: 'Sample client name', role: 'COO, freight carrier (sample)' },
    screen: { app: 'Northline Dispatch', nav: ['Live map', 'Loads', 'Drivers', 'Exceptions', 'Reports'], kpis: [{ l: 'Trucks on route', v: '286' }, { l: 'On-time today', v: '94.2%', d: '+3.1' }, { l: 'Open exceptions', v: '7' }], chart: 'bars', series: [62, 70, 66, 78, 84, 81, 90], chartLabel: 'On-time rate, last 7 days',
      rows: [['Load #48213 · Memphis to Dallas', 'ETA 4:20 PM', 'On time'], ['Load #48207 · Atlanta to Raleigh', 'ETA 6:05 PM', 'At risk'], ['Load #48199 · Denver to Omaha', 'Delivered', 'POD signed']],
      phone: { title: 'Route 12 · Today', hero: '6 stops', heroSub: '2 completed · 4 remaining', items: [['Next stop', '2.4 mi'], ['Proof of delivery', 'Photo + sign'], ['Break due', '1h 10m']], cta: 'Start navigation' } },
  },
  {
    slug: 'citizen-services', sample: true, name: 'Citizen service requests', client: 'City of Fairhaven (fictional)', industry: 'Public sector', platforms: 'Web · iOS · Android',
    accent: '#36414F',
    challenge: 'Residents reported potholes and outages by phone, and staff had no shared view of what was open or overdue.',
    built: 'A resident app and staff work-order console with photo reports, status tracking, SLA timers and WCAG 2.2 AA accessibility verified by our testers.',
    tech: ['Angular', '.NET', 'SQL Server', 'Azure Gov', 'axe-core'],
    outcomes: [{ v: '2.1 days', l: 'Average resolution (sample)' }, { v: 'AA', l: 'WCAG 2.2 conformance target' }],
    testimonial: { quote: 'For the first time, residents can see that their request was heard and when it will be fixed.', who: 'Sample client name', role: 'CIO, city government (sample)' },
    screen: { app: 'Fairhaven 311', nav: ['Requests', 'Work orders', 'Crews', 'Map', 'Analytics'], kpis: [{ l: 'Open requests', v: '318' }, { l: 'Closed this week', v: '1,204', d: '+9%' }, { l: 'Within SLA', v: '92%' }], chart: 'line', series: [40, 48, 45, 52, 60, 58, 66, 72, 70, 78], chartLabel: 'Requests closed within SLA',
      rows: [['Pothole · Elm St & 4th', 'Crew 7 assigned', 'In progress'], ['Streetlight out · Bay Ave', 'Reported 2h ago', 'New'], ['Graffiti · Library', 'Completed', 'Closed']],
      phone: { title: 'Report an issue', hero: 'Pothole', heroSub: 'Elm St & 4th · photo attached', items: [['Status', 'In progress'], ['Crew ETA', 'Tomorrow'], ['Updates', 'On']], cta: 'Submit request' } },
  },
  {
    slug: 'learning-platform', sample: true, name: 'Workforce learning platform', client: 'Brightpath Academy (fictional)', industry: 'Education & workforce', platforms: 'Web · iOS · Android',
    accent: '#2CAF81',
    challenge: 'Training lived in slide decks; managers could not see who had completed required courses.',
    built: 'A mobile-first learning platform with bite-sized lessons, quizzes, certificates and a manager dashboard, built with an AI assistant that drafts quiz questions for instructors to approve.',
    tech: ['Flutter', 'Firebase', 'Python', 'OpenAI API', 'Cypress'],
    outcomes: [{ v: '3×', l: 'Course completion (sample)' }, { v: '12k', l: 'Active learners (sample)' }],
    testimonial: { quote: 'Our people actually finish the training now, and our managers can see it.', who: 'Sample client name', role: 'Head of L&D, training provider (sample)' },
    screen: { app: 'Brightpath', nav: ['Courses', 'Learners', 'Paths', 'Certificates', 'Insights'], kpis: [{ l: 'Active learners', v: '12,408' }, { l: 'Completion rate', v: '81%', d: '+22' }, { l: 'Certificates issued', v: '3,912' }], chart: 'bars', series: [35, 48, 57, 63, 72, 79, 86], chartLabel: 'Weekly completions',
      rows: [['Safety essentials', '1,204 learners', '92% complete'], ['Customer care basics', '860 learners', '78% complete'], ['Leading teams', '312 learners', 'New']],
      phone: { title: 'Keep going, Sam', hero: 'Lesson 4 of 6', heroSub: 'Customer care basics', items: [['Quiz', '8/10'], ['Streak', '5 days'], ['Certificate', '2 lessons away']], cta: 'Resume lesson' } },
  },
];
