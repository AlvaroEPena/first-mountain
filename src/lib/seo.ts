/**
 * Structured data and URL helpers, built only from data/site.ts and data/services.ts.
 * Deliberately no `aggregateRating` or `review`: the rating comes from Google, and marking it up
 * would be aggregating third-party reviews (Google policy; see docs/research.md Q5).
 */
import type { Service } from '../data/services';
import { site } from '../data/site';
import { WEEKDAY_NAMES } from './open-hours';

type JsonLd = Record<string, unknown>;

/** Route path for canonical URLs: `build.format: 'file'` yields `/x.html`, but we serve `/x`. */
export function canonicalPath(pathname: string): string {
  return pathname.replace(/(\/index)?\.html$/, '').replace(/(.)\/$/, '$1') || '/';
}

export function absoluteUrl(path: string, origin: string): string {
  return new URL(path, origin).toString();
}

/** schema.org OpeningHoursSpecification from the weekly hours in site.ts. */
export function openingHoursJsonLd(hours: typeof site.hours): JsonLd[] {
  return hours.map((rule) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: rule.days.map((day) => WEEKDAY_NAMES[day - 1]),
    opens: rule.opens,
    closes: rule.closes,
  }));
}

export function businessJsonLd(origin: string, services: readonly Service[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': ['HomeAndConstructionBusiness', 'GeneralContractor'],
    '@id': `${absoluteUrl('/', origin)}#business`,
    name: site.name,
    legalName: site.legalName,
    description: `Family-owned concrete and hardscape contractor in ${site.address.city}, ${site.address.region}: driveways, patios, sport courts, steps, retaining walls and more.`,
    url: absoluteUrl('/', origin),
    telephone: site.phoneE164,
    logo: absoluteUrl('/logo-512.png', origin),
    image: absoluteUrl('/og.jpg', origin),
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    openingHoursSpecification: openingHoursJsonLd(site.hours),
    areaServed: site.areaServed.map((name) => ({ '@type': 'Place', name })),
    hasMap: site.links.googleMaps,
    sameAs: [site.links.googleMaps],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Concrete and hardscape services',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: serviceJsonLd(service, origin),
      })),
    },
  };
}

export function serviceJsonLd(service: Service, origin: string): JsonLd {
  return {
    '@type': 'Service',
    name: service.name,
    description: service.summary,
    url: absoluteUrl(`/services#${service.id}`, origin),
    areaServed: site.areaServed.map((name) => ({ '@type': 'Place', name })),
    provider: { '@id': `${absoluteUrl('/', origin)}#business` },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(crumbs: readonly Crumb[], origin: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path, origin),
    })),
  };
}

/** Serialise JSON-LD for a script tag; "<" is escaped so content can never close it early. */
export function serializeJsonLd(data: JsonLd | readonly JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
