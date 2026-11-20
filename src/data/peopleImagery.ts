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
  licence: 'live-site-asset-unconfirmed';
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
