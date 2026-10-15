import { describe, expect, it } from 'vitest';

import { services } from '../../src/data/services';
import { cityLine, oneLineAddress } from '../../src/lib/address';
import { site } from '../../src/data/site';
import { monthYear, ratingSentence } from '../../src/lib/rating';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  businessJsonLd,
  canonicalPath,
  openingHoursJsonLd,
  serializeJsonLd,
} from '../../src/lib/seo';

const ORIGIN = 'https://first-mountain.example/';

describe('canonicalPath', () => {
  it('maps built file paths to served routes', () => {
    expect(canonicalPath('/')).toBe('/');
    expect(canonicalPath('/index.html')).toBe('/');
    expect(canonicalPath('/services.html')).toBe('/services');
    expect(canonicalPath('/services')).toBe('/services');
    expect(canonicalPath('/services/')).toBe('/services');
  });

  it('builds absolute URLs', () => {
    expect(absoluteUrl('/projects', ORIGIN)).toBe('https://first-mountain.example/projects');
  });
});

describe('businessJsonLd', () => {
  const data = businessJsonLd(ORIGIN, services);

  it('is a home and construction business and a general contractor', () => {
    expect(data['@type']).toEqual(['HomeAndConstructionBusiness', 'GeneralContractor']);
    expect(data.name).toBe(site.name);
    expect(data.telephone).toBe(site.phoneE164);
  });

  it('carries NAP, geo, map link and services from site.ts', () => {
    expect(data.address).toMatchObject({
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
    });
    expect(data.geo).toMatchObject(site.geo);
    expect(data.sameAs).toEqual([site.links.googleMaps]);
    const catalog = data.hasOfferCatalog as { itemListElement: unknown[] };
    expect(catalog.itemListElement).toHaveLength(services.length);
  });

  it('never includes review or rating markup (Google policy)', () => {
    const json = JSON.stringify(data);
    expect(json).not.toMatch(/aggregateRating|"review"|ratingValue/i);
  });
});

describe('openingHoursJsonLd', () => {
  it('turns ISO weekdays into schema.org day names', () => {
    expect(openingHoursJsonLd(site.hours)).toEqual([
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '19:00',
      },
    ]);
  });
});

describe('breadcrumbJsonLd', () => {
  it('numbers crumbs and makes their URLs absolute', () => {
    const data = breadcrumbJsonLd(
      [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
      ],
      ORIGIN,
    );
    expect(data.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: ORIGIN },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${ORIGIN}services` },
    ]);
  });
});

describe('serializeJsonLd', () => {
  it('escapes "<" so data cannot close the script tag', () => {
    expect(serializeJsonLd({ name: '</script><b>' })).not.toContain('<');
  });
});

describe('rating copy', () => {
  it('states the rating with its as-of month', () => {
    expect(monthYear('2026-10-14')).toBe('Oct 2026');
    expect(ratingSentence(site.rating)).toBe('4.7 from 30 Google reviews, as of Oct 2026');
  });
});

describe('address formatting', () => {
  it('keeps the spaces between region and ZIP', () => {
    expect(cityLine(site.address)).toBe('Salt Lake City, UT 84116');
    expect(oneLineAddress(site.address)).toBe('1359 N General Dr, Salt Lake City, UT 84116');
  });
});
