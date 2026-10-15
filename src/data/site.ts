/**
 * Single source of truth for business facts.
 * Source: Google Business Profile, captured 2026-10-14 (plus HomeAdvisor for years and "family owned").
 * Items marked `confirm` must be checked with the client before launch.
 */
export const site = {
  name: 'First Mountain Construction',
  legalName: 'First Mountain Construction, LLC',
  owner: 'Frank Mounga',
  /** confirm: 925 is a Bay Area code; it is the number on their Google listing. */
  phone: '(925) 457-5539',
  phoneE164: '+19254575539',
  phoneHref: 'tel:+19254575539',
  smsHref: 'sms:+19254575539',
  address: {
    street: '1359 N General Dr',
    city: 'Salt Lake City',
    region: 'UT',
    postalCode: '84116',
    country: 'US',
  },
  geo: { latitude: 40.7987704, longitude: -111.9483085 },
  timeZone: 'America/Denver',
  /** ISO weekday (1 = Monday). Closed days are omitted. */
  hours: [{ days: [1, 2, 3, 4, 5], opens: '07:00', closes: '19:00' }] as ReadonlyArray<{
    days: readonly number[];
    opens: string;
    closes: string;
  }>,
  hoursText: 'Monday to Friday, 7 am to 7 pm. Closed Saturday and Sunday.',
  rating: { value: 4.7, count: 30, capturedOn: '2026-10-14' },
  /** confirm: "21 years of experience" on HomeAdvisor (self-reported). */
  yearsExperience: '20+',
  /** confirm: inferred from the address and review locations, not stated by the business. */
  serviceArea: 'Salt Lake City and the Salt Lake Valley',
  areaServed: ['Salt Lake City, UT', 'Salt Lake County, UT'],
  links: {
    googleMaps: 'https://www.google.com/maps?cid=7678762711807686422',
    googleReviews: 'https://www.google.com/maps?cid=7678762711807686422',
    directions:
      'https://www.google.com/maps/dir/?api=1&destination=First+Mountain+Construction%2C+1359+N+General+Dr%2C+Salt+Lake+City%2C+UT+84116',
    /** Keyless share-embed; only loaded after the visitor clicks "Show map". */
    mapEmbed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.0!2d-111.9483085!3d40.7987704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8752f401c44c0001%3A0x6a907200a7cff716!2sFirst%20Mountain%20Construction!5e0!3m2!1sen!2sus!4v1792018000000!5m2!1sen!2sus',
  },
} as const;

export type Site = typeof site;
