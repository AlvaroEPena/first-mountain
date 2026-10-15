/**
 * Expected values for the e2e suite. They are written out here on purpose instead of imported
 * from src/data/site.ts: the tests are an independent oracle for the business facts in spec §5,
 * and site.ts reads `import.meta.env`, which only exists inside Vite.
 */
export const BUSINESS = {
  name: 'First Mountain Construction',
  phoneDisplay: '(925) 457-5539',
  telHref: 'tel:+19254575539',
  smsHref: 'sms:+19254575539',
  telephone: '+19254575539',
  address: {
    streetAddress: '1359 N General Dr',
    addressLocality: 'Salt Lake City',
    addressRegion: 'UT',
    postalCode: '84116',
  },
  rating: { value: '4.7', count: '30' },
  googleListingUrl: 'https://www.google.com/maps?cid=7678762711807686422',
  mapEmbedPrefix: 'https://www.google.com/maps/embed',
  directionsPrefix: 'https://www.google.com/maps/dir/?api=1&destination=',
} as const;

export interface SitePage {
  /** Short name used in test titles and screenshot file names. */
  name: string;
  path: string;
  /** Whether the page shows project photos (reviews, contact and 404 are text only). */
  hasPhotos: boolean;
}

/** Every route in spec §3. The 404 page is reachable at /404 (and for any unknown URL). */
export const PAGES: readonly SitePage[] = [
  { name: 'home', path: '/', hasPhotos: true },
  { name: 'services', path: '/services', hasPhotos: true },
  { name: 'projects', path: '/projects', hasPhotos: true },
  { name: 'reviews', path: '/reviews', hasPhotos: false },
  { name: 'about', path: '/about', hasPhotos: true },
  { name: 'contact', path: '/contact', hasPhotos: false },
  { name: '404', path: '/404', hasPhotos: false },
];

/** Low-res photos (native width <= 960 px) must never be shown larger than native (spec §10). */
export const LOW_RES_MAX_WIDTH = 960;
