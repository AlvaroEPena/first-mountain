/**
 * Project photos from the client's Google Business Profile (captured 2026-10-14).
 * Preview use only until the client approves. Files: src/assets/photos/<id>.jpg (≤2400px, no metadata),
 * produced by `npm run images:prepare` from docs/google-photo-urls.txt.
 */
import type { ImageMetadata } from 'astro';

export const GALLERY_CATEGORIES = [
  'driveways',
  'courts',
  'patios',
  'steps',
  'hardscape',
  'process',
] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export const GALLERY_CATEGORY_LABELS: Record<GalleryCategory, string> = {
  driveways: 'Driveways',
  courts: 'Courts & Slabs',
  patios: 'Patios & Pads',
  steps: 'Steps & Walkways',
  hardscape: 'Walls & Hardscape',
  process: 'On the Job',
};

export interface GalleryItem {
  id: string;
  alt: string;
  category: GalleryCategory;
  /** Strongest shots, used on Home and as section leads. */
  featured?: boolean;
  /** Native size ≤ 960px: never display larger than its own width. */
  lowRes?: boolean;
}

export const gallery: readonly GalleryItem[] = [
  {
    id: 'photo-00',
    category: 'driveways',
    featured: true,
    alt: 'Freshly poured concrete driveway with clean control joints, curing behind orange traffic cones',
  },
  {
    id: 'photo-01',
    category: 'courts',
    alt: 'Crew screeding a large slab over a rebar grid while the pump hose places concrete',
  },
  {
    id: 'photo-02',
    category: 'process',
    alt: 'Concrete mixer truck pouring at a residential job beside a lawn',
  },
  {
    id: 'photo-03',
    category: 'courts',
    featured: true,
    alt: 'Finished pickleball court slab with taped lines and a net, a block wall behind it',
  },
  {
    id: 'photo-04',
    category: 'courts',
    featured: true,
    alt: 'Crew finishing a large slab in late-day sun with the Wasatch mountains behind',
  },
  {
    id: 'photo-05',
    category: 'driveways',
    alt: 'Graded and compacted base for a long driveway beside a modern home',
  },
  {
    id: 'photo-06',
    category: 'patios',
    lowRes: true,
    alt: 'Finisher screeding a fresh backyard pad inside wood forms',
  },
  {
    id: 'photo-07',
    category: 'steps',
    alt: 'Curved concrete walkway crossing a lawn to the front steps of a brick home',
  },
  {
    id: 'photo-08',
    category: 'courts',
    alt: 'Crew pouring a slab beside a block retaining wall, mixer truck and mountains behind',
  },
  {
    id: 'photo-09',
    category: 'courts',
    featured: true,
    alt: 'Large finished slab below a hillside of scrub oak and pines',
  },
  {
    id: 'photo-10',
    category: 'courts',
    alt: 'Freshly poured sport court slab inside braced forms with foothills behind',
  },
  {
    id: 'photo-11',
    category: 'courts',
    alt: 'Formed and poured court slab on a hillside lot beside a split-rail fence',
  },
  {
    id: 'photo-12',
    category: 'courts',
    alt: 'Large finished slab with the forms still in place on a sunny day',
  },
  {
    id: 'photo-13',
    category: 'process',
    alt: 'Crew guiding concrete from a mixer truck into driveway forms',
  },
  {
    id: 'photo-14',
    category: 'process',
    alt: 'Crew placing and raking concrete into forms over a gravel base',
  },
  {
    id: 'photo-15',
    category: 'process',
    alt: 'Graded base ready for a new driveway in front of a ranch-style home',
  },
  {
    id: 'photo-16',
    category: 'patios',
    alt: 'Crew finishing a raised backyard slab with forms braced by wood stakes',
  },
  {
    id: 'photo-17',
    category: 'hardscape',
    alt: 'Concrete footing tube set in a braced post form beside a new slab',
  },
  {
    id: 'photo-18',
    category: 'process',
    lowRes: true,
    alt: 'Old front steps and patio being torn out at a brick home',
  },
  {
    id: 'photo-19',
    category: 'hardscape',
    alt: 'Paver patio laid in a herringbone pattern in a backyard',
  },
  {
    id: 'photo-20',
    category: 'driveways',
    alt: 'Long new driveway slab beside a garage, fresh broom finish',
  },
  {
    id: 'photo-21',
    category: 'hardscape',
    alt: 'Gravel side path with edging along a block wall, plate compactor in use',
  },
  {
    id: 'photo-22',
    category: 'hardscape',
    alt: 'Curved concrete mow strip curbing winding through grass',
  },
  {
    id: 'photo-23',
    category: 'driveways',
    alt: 'New driveway apron at the street with a pickup truck parked on it',
  },
  {
    id: 'photo-24',
    category: 'driveways',
    alt: 'Driveway extension curing behind caution tape next to a two-car garage',
  },
  {
    id: 'photo-25',
    category: 'hardscape',
    featured: true,
    alt: 'Tall poured concrete retaining wall with crisp, straight edges',
  },
  {
    id: 'photo-27',
    category: 'driveways',
    featured: true,
    alt: 'Long new concrete driveway running alongside a modern home and carport',
  },
  {
    id: 'photo-28',
    category: 'driveways',
    featured: true,
    alt: 'Wide finished driveway leading to a carport, sharp control joints and lawn edges',
  },
  {
    id: 'photo-29',
    category: 'steps',
    lowRes: true,
    alt: 'New front steps with an iron railing at a brick home',
  },
  {
    id: 'photo-30',
    category: 'patios',
    alt: 'Small backyard pad freshly poured inside wood forms',
  },
  {
    id: 'photo-31',
    category: 'hardscape',
    alt: 'Brick paver sidewalk border beside a new curb and gutter',
  },
  {
    id: 'photo-32',
    category: 'driveways',
    alt: 'Smooth, freshly finished driveway slab beside a lawn',
  },
  {
    id: 'photo-33',
    category: 'driveways',
    featured: true,
    alt: 'New driveway with control joints leading up to a modern home',
  },
  {
    id: 'photo-34',
    category: 'steps',
    alt: 'New side-yard concrete walkway along the wall of a house',
  },
  {
    id: 'photo-35',
    category: 'steps',
    lowRes: true,
    alt: 'New front steps and walkway at a brick home with iron railings',
  },
  {
    id: 'photo-36',
    category: 'patios',
    alt: 'Side-yard concrete pad with an air-conditioning unit between a house and vinyl fence',
  },
  {
    id: 'photo-37',
    category: 'driveways',
    alt: 'Large freshly poured driveway slab, still wet, with a garden hose across it',
  },
  {
    id: 'photo-38',
    category: 'patios',
    alt: 'Backyard patio slab along a house and a vinyl privacy fence',
  },
  {
    id: 'photo-39',
    category: 'driveways',
    lowRes: true,
    alt: 'Freshly finished driveway slab with a curved edge',
  },
  {
    id: 'photo-40',
    category: 'steps',
    alt: 'Curved concrete walkway wrapping a planter bed behind caution tape',
  },
  { id: 'photo-41', category: 'patios', alt: 'Fresh concrete pad poured beside a garage' },
  {
    id: 'photo-42',
    category: 'patios',
    alt: 'Narrow concrete side pad along a house next to new sod',
  },
  {
    id: 'photo-43',
    category: 'patios',
    featured: true,
    alt: 'Large backyard patio slab with control joints next to a play area',
  },
  {
    id: 'photo-44',
    category: 'driveways',
    alt: 'Driveway extension with control joints beside a lawn',
  },
  {
    id: 'photo-46',
    category: 'driveways',
    alt: 'Long driveway extension running alongside an existing drive',
  },
];

/**
 * Photo 26 is a highway view of the Wasatch, not their work. Atmosphere only (e.g. a blurred
 * backdrop); never present it as a project.
 */
export const atmospherePhotoId = 'photo-26';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.jpg', {
  eager: true,
});

/** Resolve a photo id (e.g. "photo-04") to its imported image. Throws on a missing file. */
export function photo(id: string): ImageMetadata {
  const file = files[`../assets/photos/${id}.jpg`];
  if (!file) throw new Error(`Missing photo file for ${id}`);
  return file.default;
}

export function galleryItem(id: string): GalleryItem {
  const item = gallery.find((entry) => entry.id === id);
  if (!item) throw new Error(`Unknown gallery item ${id}`);
  return item;
}
