/**
 * PEOPLE IMAGERY: the photographs used in page headers (visual revision, docs/15-visual-revision.md).
 *
 * WHAT: one record per header photo: where the file lives, its sizes, the alt text, the crop focus
 *   and, most importantly, where it came from and what we may say about it.
 *
 * WHY: Janique's feedback asked for a more human, people-centred presentation. Every photo here is
 *   already published by QualityWorks on qualityworkscg.com (mostly page-title backgrounds and
 *   industry feature images). Nothing is AI-generated and nothing was sourced from a new stock
 *   library for this prototype.
 *
 * HONESTY RULES (CONTRIBUTING.md rule 1):
 *   - These are licensed-stock style photographs used on the live site. The people in them are NOT
 *     identified as QualityWorks employees or clients. Alt text describes what is visible
 *     ("two colleagues review code"), never "our team" or a named person.
 *   - `licence: 'live-site-asset-unconfirmed'` means: QualityWorks uses the image today, but the
 *     licence terms (e.g. Adobe Stock seat, web-only use) have not been checked for the new site.
 *     Confirm before launch (docs/09 Q-29). Authentic QualityWorks team photography is the
 *     preferred replacement (docs/15 §6, "Required assets").
 *
 * FILES: public/people/{id}-{width}.webp, generated from the live-site originals at 800 / 1600
 *   (and 2400 for the homepage) pixels wide. Re-create them from the source URL if replaced.
 *
 * CONSUMERS: components/PageHero.astro (`image` prop), pages/index.astro (homepage hero),
 *   pages/contact-us/index.astro, pages/industries/[slug].astro (via Industry.heroImage).
 *
 * HOW TO ADD A PHOTO: add the webp files, add a record below, then pass `peopleImage('id')` to
 *   PageHero's `image` prop. `focus` is a CSS object-position: move it towards the faces so they
 *   survive the crop at every width.
 */
export interface PeopleImage {
  /** File stem in public/people/ (files are `${id}-${width}.webp`). */
  id: string;
  /** Widths available on disk, smallest first. */
  widths: number[];
  /** Intrinsic aspect ratio of the source (width / height), for layout stability. */
  ratio: number;
  /** Alt text: what is visible, neutral, never identifies people as staff or clients. */
  alt: string;
  /** CSS object-position used when the photo is cropped. Keep faces inside the crop. */
  focus: string;
  /** The live-site URL the original was taken from. */
  sourceUrl: string;
  /** Licence/approval status for reuse on the new site. */
  licence: 'live-site-asset-unconfirmed' | 'unsplash-licence' | 'pexels-licence';
}

const LIVE = 'https://qualityworkscg.com/wp-content/uploads/';

export const peopleImagery: PeopleImage[] = [
  { id: 'home-mentoring', widths: [800, 1600, 2400], ratio: 16 / 9, focus: '62% 35%',
    alt: 'A software engineer points to code on a monitor while a colleague at the desk works through it with her',
    sourceUrl: `${LIVE}AdobeStock_507970416-scaled.jpg`, licence: 'live-site-asset-unconfirmed' },
  { id: 'about-team', widths: [800, 1600], ratio: 1600 / 875, focus: '55% 40%',
    alt: 'Colleagues talk through a problem together in a bright open-plan office',
    sourceUrl: `${LIVE}Featue_Image_About_Us.jpg`, licence: 'live-site-asset-unconfirmed' },
  { id: 'careers-colleagues', widths: [800, 1600], ratio: 1600 / 1067, focus: '55% 35%',
    alt: 'Two colleagues smile while working together on a laptop',
    sourceUrl: `${LIVE}background-page-title-careers.jpg`, licence: 'live-site-asset-unconfirmed' },
  { id: 'contact-team', widths: [800, 1600], ratio: 1600 / 1067, focus: '60% 40%',
    alt: 'A group of colleagues review work together on laptops and a tablet',
    sourceUrl: `${LIVE}background-page-title-contact-us.jpg`, licence: 'live-site-asset-unconfirmed' },
  { id: 'services-pair', widths: [800, 1600], ratio: 1600 / 908, focus: '75% 40%',
    alt: 'Two engineers discuss what they see on a screen',
    sourceUrl: `${LIVE}background-home-hero.jpg`, licence: 'live-site-asset-unconfirmed' },
  { id: 'finance-client-meeting', widths: [800, 1600], ratio: 1600 / 875, focus: '50% 40%',
    alt: 'A consultant talks through a plan with two people across a meeting table',
    sourceUrl: `${LIVE}Feature_Image_Banking_Page-web.jpg`, licence: 'live-site-asset-unconfirmed' },
  { id: 'insurance-advisor', widths: [800, 1600], ratio: 1600 / 875, focus: '50% 35%',
    alt: 'A professional holding a phone smiles in an office',
    sourceUrl: `${LIVE}Insurance_Service_Industry.jpg`, licence: 'live-site-asset-unconfirmed' },
  { id: 'healthcare-pharmacy', widths: [800, 1600], ratio: 1600 / 875, focus: '45% 35%',
    alt: 'A pharmacist checks a tablet while a colleague works at the pharmacy shelves',
    sourceUrl: `${LIVE}Possible_healthcare_image-feature.jpg`, licence: 'live-site-asset-unconfirmed' },
  { id: 'retail-ecommerce', widths: [800, 1600], ratio: 1600 / 875, focus: '70% 40%',
    alt: 'A person reviews an online store product page on a desktop monitor',
    sourceUrl: `${LIVE}retail-industry.jpg`, licence: 'live-site-asset-unconfirmed' },
  { id: 'social-impact-volunteers', widths: [600], ratio: 1, focus: '50% 40%',
    alt: 'Volunteers pack donation boxes together',
    sourceUrl: `${LIVE}social-community-impact-industry.jpg`, licence: 'live-site-asset-unconfirmed' },
  { id: 'technology-pair', widths: [600], ratio: 1, focus: '50% 35%',
    alt: 'Two colleagues talk beside a desk with code on two monitors',
    sourceUrl: `${LIVE}technology-industry.jpg`, licence: 'live-site-asset-unconfirmed' },
  { id: 'logistics-warehouse', widths: [600], ratio: 1, focus: '50% 40%',
    alt: 'A warehouse worker checks a tablet between tall shelving aisles',
    sourceUrl: `${LIVE}logistics-inustry.jpg`, licence: 'live-site-asset-unconfirmed' },
  // Section overview headers (added after review: every page reachable as a menu "overview" gets a photo).
  { id: 'products-engineer', widths: [800, 1600], ratio: 1600 / 1067, focus: '75% 35%',
    alt: 'An engineer smiles while working at a desk with code on two monitors',
    sourceUrl: `${LIVE}AdobeStock_434993367.jpeg`, licence: 'live-site-asset-unconfirmed' },
  { id: 'industries-team', widths: [800, 1136], ratio: 1136 / 900, focus: '55% 35%',
    alt: 'A team talks through ideas around a meeting table with laptops',
    sourceUrl: `${LIVE}teama.jpg`, licence: 'live-site-asset-unconfirmed' },
  { id: 'results-celebration', widths: [800, 1600], ratio: 1600 / 1067, focus: '60% 30%',
    alt: 'A developer raises a fist in celebration in front of a monitor showing code',
    sourceUrl: `${LIVE}AdobeStock_215707658-web-scaled.jpg`, licence: 'live-site-asset-unconfirmed' },
  // 600px source only (no larger original on the live site): soft on large screens; replacement listed in docs/15 §6.
  { id: 'resources-audience', widths: [600], ratio: 1, focus: '50% 45%',
    alt: 'An audience smiles and applauds during a presentation',
    sourceUrl: `${LIVE}About_Us_Our_Team_image_sm.jpg`, licence: 'live-site-asset-unconfirmed' },
  // Executive review, 24-25 Nov 2026 (Stacy Kirk, relayed by the project lead): every person on the site should
  // look like our BUYERS: mature, corporate, well-dressed decision-makers. Senior white male executives first,
  // then Black businesswomen in their 40s+ and mature Black businessmen. No young developers or students.
  // Stock photographs (Unsplash License / Pexels License: free commercial use, no attribution required).
  // Stock models, NOT QualityWorks staff or clients. Placeholders until commissioned photography exists (docs/17 §6).
  { id: 'exec-leader', widths: [800, 1600, 2400], ratio: 2 / 3, focus: '50% 22%',
    alt: 'An experienced business leader in a blazer and glasses stands in a modern office',
    sourceUrl: 'https://unsplash.com/photos/1560250097-0b93528c311a', licence: 'unsplash-licence' },
  { id: 'why-leader', widths: [800, 1600], ratio: 1600 / 2343, focus: '50% 28%',
    alt: 'A senior businesswoman in a white blouse holds a stack of binders in a modern office',
    sourceUrl: 'https://www.pexels.com/photo/5668875/', licence: 'pexels-licence' },
  { id: 'svc-testing', widths: [800, 1600], ratio: 2 / 3, focus: '50% 35%',
    alt: 'A senior manager in a shirt and tie reviews results on a laptop at his desk',
    sourceUrl: 'https://www.pexels.com/photo/5668886/', licence: 'pexels-licence' },
  { id: 'svc-build', widths: [800, 1600], ratio: 1600 / 1091, focus: '45% 40%',
    alt: 'An executive in a suit walks a colleague through an application on a laptop in a bright office',
    sourceUrl: 'https://unsplash.com/photos/1560250056-07ba64664864', licence: 'unsplash-licence' },
  { id: 'svc-agents', widths: [800, 1600], ratio: 3 / 2, focus: '50% 35%',
    alt: 'Two senior colleagues review a document together in a meeting room',
    sourceUrl: 'https://www.pexels.com/photo/5668830/', licence: 'pexels-licence' },
  { id: 'exec-review', widths: [800, 1600], ratio: 3 / 2, focus: '50% 35%',
    alt: 'Three senior colleagues stand together reviewing a document in an office',
    sourceUrl: 'https://www.pexels.com/photo/5668840/', licence: 'pexels-licence' },
  { id: 'exec-office', widths: [800, 1600], ratio: 3 / 2, focus: '40% 35%',
    alt: 'Two executives talk as they walk through a bright modern office',
    sourceUrl: 'https://unsplash.com/photos/1560250163-17506787d971', licence: 'unsplash-licence' },
  { id: 'exec-desk', widths: [800, 1600], ratio: 2 / 3, focus: '50% 30%',
    alt: 'A businesswoman works at a laptop by the window of her office',
    sourceUrl: 'https://www.pexels.com/photo/5668846/', licence: 'pexels-licence' },
  { id: 'exec-meeting', widths: [800, 1600], ratio: 1600 / 2351, focus: '50% 40%',
    alt: 'Two senior colleagues meet across a desk in a glass-walled office',
    sourceUrl: 'https://www.pexels.com/photo/5668844/', licence: 'pexels-licence' },
  { id: 'exec-boardroom', widths: [800, 1600], ratio: 3 / 2, focus: '30% 35%',
    alt: 'Senior professionals talk together during a business conference',
    sourceUrl: 'https://www.pexels.com/photo/8761562/', licence: 'pexels-licence' },
  { id: 'work-team', widths: [800, 1600], ratio: 3 / 2, focus: '50% 40%',
    alt: 'Two senior colleagues celebrate a milestone with a high five across a meeting table',
    sourceUrl: 'https://unsplash.com/photos/1600880292203-757bb62b4baf', licence: 'unsplash-licence' },
  { id: 'telecom-ops', widths: [800, 1600], ratio: 3 / 2, focus: '60% 45%',
    alt: 'An engineer walks through a data centre aisle carrying a laptop',
    sourceUrl: 'https://unsplash.com/photos/1573164713988-8665fc963095', licence: 'unsplash-licence' },
  // Testimonial PLACEHOLDER portraits (stock models). Never pair them with a real client's name or quote.
  { id: 't-1', widths: [800, 1200], ratio: 3 / 2, focus: '55% 30%', alt: 'Placeholder portrait: a businesswoman in a blazer and glasses', sourceUrl: 'https://www.pexels.com/photo/1181519/', licence: 'pexels-licence' },
  { id: 't-2', widths: [800, 1200], ratio: 2 / 3, focus: '50% 30%', alt: 'Placeholder portrait: a senior executive with glasses and a grey beard', sourceUrl: 'https://unsplash.com/photos/1504257432389-52343af06ae3', licence: 'unsplash-licence' },
  { id: 't-3', widths: [800, 1200], ratio: 2 / 3, focus: '50% 22%', alt: 'Placeholder portrait: an executive in a suit with folded arms', sourceUrl: 'https://www.pexels.com/photo/3778876/', licence: 'pexels-licence' },
  { id: 't-4', widths: [800, 1200], ratio: 3 / 2, focus: '50% 30%', alt: 'Placeholder portrait: a businesswoman in a grey blazer', sourceUrl: 'https://www.pexels.com/photo/2381069/', licence: 'pexels-licence' },
];

/** Look up a header photo by id. Throws at build time for an unknown id, so a typo cannot reach a built page. */
export const peopleImage = (id: string): PeopleImage => {
  const img = peopleImagery.find((p) => p.id === id);
  if (!img) throw new Error(`Unknown people image "${id}" (src/data/peopleImagery.ts)`);
  return img;
};

/** srcset string for a record: "/people/id-800.webp 800w, /people/id-1600.webp 1600w". */
export const peopleSrcset = (img: PeopleImage) => img.widths.map((w) => `/people/${img.id}-${w}.webp ${w}w`).join(', ');
/** Default src (largest file up to 1600px). */
export const peopleSrc = (img: PeopleImage) => `/people/${img.id}-${Math.max(...img.widths.filter((w) => w <= 1600))}.webp`;
