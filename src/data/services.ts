/**
 * Service groups shown on /services (one section each, anchored by id) and in the Home bento.
 * Copy is grounded only in the brief and the Google reviews; every bullet traces to a review or a
 * project photo. Review evidence is derived with `reviewsForService()`, so it is never typed twice.
 */
import type { ProjectType } from '../lib/contracts/quote';
import { reviewsForService, type Review } from './reviews';
import { SERVICE_IDS, type ServiceId } from './service-ids';

export interface Service {
  id: ServiceId;
  /** Section heading. */
  name: string;
  /** Short label for chips and the bento. */
  shortName: string;
  /** One or two plain sentences. */
  summary: string;
  /** What's included, each traceable to a review or photo. */
  bullets: readonly string[];
  /** Gallery ids, lead photo first. Empty when no photo shows this work honestly. */
  photos: readonly string[];
  /** Quote form preselection: `/contact?type=<projectType>#quote`. */
  projectType: ProjectType;
  /** The review whose highlight leads this section (must be tagged with this service). */
  featuredReviewId: string;
  /** Set when the client still has to confirm the service (shown in the handoff, not the UI). */
  confirm?: string;
}

const SERVICE_LIST: readonly Service[] = [
  {
    id: 'driveways',
    name: 'Driveways',
    shortName: 'Driveways',
    summary:
      'New driveways, full replacements and add-ons. We tear out the old slab, prep the base and pour a drive that fits how you park.',
    bullets: [
      'New driveways and full replacements',
      'Extensions and widening for extra parking',
      'Tear-out of old or broken concrete',
      'Graded, compacted base before the pour',
      'Extra drains where water collects',
      'Broom finish with clean control joints',
    ],
    photos: ['photo-28', 'photo-33', 'photo-27', 'photo-00'],
    projectType: 'driveway',
    featuredReviewId: 'r07',
  },
  {
    id: 'patios-pads',
    name: 'Patios and pads',
    shortName: 'Patios & pads',
    summary:
      'Backyard patios, patio extensions and the small pads that make a yard work: sheds, side yards, garbage cans and AC units.',
    bullets: [
      'Backyard patios and patio extensions',
      'Shed, side-yard and garbage-can pads',
      'Old brick or worn patios replaced with concrete',
      'Sloped for drainage',
      'Footings set in the slab for a future deck',
    ],
    photos: ['photo-43', 'photo-38', 'photo-16'],
    projectType: 'patio-pad',
    featuredReviewId: 'r02',
  },
  {
    id: 'sport-courts',
    name: 'Sport courts',
    shortName: 'Sport courts',
    summary:
      'Pickleball and basketball courts poured as one big, flat slab, with help laying the court out on your lot.',
    bullets: [
      'Pickleball and basketball court slabs',
      'Options like a 5 inch slab, rebar and a vapor barrier',
      'Help planning the layout and the best way to lay it out',
      'Large slabs on sloped and hillside lots',
    ],
    photos: ['photo-03', 'photo-10', 'photo-11'],
    projectType: 'sport-court',
    featuredReviewId: 'r03',
  },
  {
    id: 'steps-walkways',
    name: 'Steps and walkways',
    shortName: 'Steps & walkways',
    summary:
      'Front steps, porches, sidewalks and side paths. Old steps come out, forms and rebar go in, and new concrete is poured.',
    bullets: [
      'New front steps and porches',
      'Demolition of old steps and walkways',
      'Sidewalks, side paths and curved walkways',
      'Framed, reinforced with rebar and poured',
    ],
    photos: ['photo-07', 'photo-40', 'photo-34'],
    projectType: 'steps-walkway',
    featuredReviewId: 'r08',
  },
  {
    id: 'rv-pads',
    name: 'RV and trailer pads',
    shortName: 'RV pads',
    summary:
      'A solid place to park the RV, the trailer or the boat, from excavation to the finished slab.',
    bullets: [
      'RV and trailer parking pads',
      'Excavation, pouring and finishing',
      'Wider drives for easy trailer parking',
      'No debris left behind when the job is done',
    ],
    photos: [],
    projectType: 'rv-pad',
    featuredReviewId: 'r09',
  },
  {
    id: 'retaining-walls',
    name: 'Retaining walls',
    shortName: 'Retaining walls',
    summary:
      'Poured concrete retaining walls that hold a yard in place, backfilled and leveled behind.',
    bullets: [
      'Poured concrete retaining walls',
      'Backfilled and leveled behind the wall',
      'A fence installed on top of the wall when you need one',
    ],
    photos: ['photo-25'],
    projectType: 'retaining-wall',
    featuredReviewId: 'r17',
  },
  {
    id: 'hardscape',
    name: 'Pavers and hardscape',
    shortName: 'Hardscape',
    summary:
      'The finishing work around the concrete: pavers, edging, borders, curbing, drains and light landscaping.',
    bullets: [
      'Paver patios and paver borders',
      'Edging, rock borders and garden borders',
      'Concrete mow strips and curbing',
      'Footings and posts',
      'Xeriscaping and light landscape work',
    ],
    photos: ['photo-19', 'photo-22', 'photo-21', 'photo-31'],
    projectType: 'hardscape',
    featuredReviewId: 'r23',
  },
  {
    id: 'fences',
    name: 'Fences',
    shortName: 'Fences',
    summary:
      'Fence installation and repair, set on concrete footings, with a concrete strip along the line when you need it.',
    bullets: [
      'Fence installation',
      'Fence repair',
      'Posts set in concrete footings',
      'A concrete strip along the fence line so it cannot be dug under',
    ],
    photos: [],
    projectType: 'fence',
    featuredReviewId: 'r21',
    confirm: 'Fence work appears in reviews; confirm it is still a current service.',
  },
];

/** Services in the canonical SERVICE_IDS order. */
export const services: readonly Service[] = SERVICE_IDS.map((id) => {
  const service = SERVICE_LIST.find((entry) => entry.id === id);
  if (!service) throw new Error(`Missing service copy for ${id}`);
  return service;
});

export function serviceById(id: ServiceId): Service {
  const service = services.find((entry) => entry.id === id);
  if (!service) throw new Error(`Unknown service ${id}`);
  return service;
}

/** Reviews that mention this service, with the featured one first. */
export function serviceEvidence(service: Service): { featured: Review; others: Review[] } {
  const all = reviewsForService(service.id);
  const featured = all.find((review) => review.id === service.featuredReviewId);
  if (!featured) {
    throw new Error(`${service.featuredReviewId} is not tagged with service ${service.id}`);
  }
  return { featured, others: all.filter((review) => review !== featured) };
}

/** Quote form link with the project type preselected. */
export function quoteHref(projectType: ProjectType): string {
  return `/contact?type=${projectType}#quote`;
}
