import { GALLERY_CATEGORIES, type GalleryCategory } from '../data/gallery';

export const ALL_FILTER = 'all';
export type GalleryFilter = typeof ALL_FILTER | GalleryCategory;

export function isGalleryFilter(value: string | null | undefined): value is GalleryFilter {
  return value === ALL_FILTER || GALLERY_CATEGORIES.some((category) => category === value);
}

export function matchesFilter(itemCategory: string, filter: GalleryFilter): boolean {
  return filter === ALL_FILTER || itemCategory === filter;
}

/** Ids matching the active filter, in manifest order. */
export function visibleIds<T extends { id: string; category: string }>(
  items: readonly T[],
  filter: GalleryFilter,
): string[] {
  return items.filter((item) => matchesFilter(item.category, filter)).map((item) => item.id);
}

/** Per-filter totals for the chip badges. */
export function filterCounts<T extends { category: string }>(
  items: readonly T[],
): Record<GalleryFilter, number> {
  const counts = { [ALL_FILTER]: items.length } as Record<GalleryFilter, number>;
  for (const category of GALLERY_CATEGORIES) {
    counts[category] = items.filter((item) => item.category === category).length;
  }
  return counts;
}

/** Text for the aria-live result count. */
export function resultMessage(shown: number, label: string, isAll: boolean): string {
  if (shown === 0) return `No photos in ${label} yet.`;
  const noun = shown === 1 ? 'photo' : 'photos';
  return isAll ? `Showing all ${shown} ${noun}` : `Showing ${shown} ${noun} in ${label}`;
}
