import { describe, expect, it } from 'vitest';

import { gallery, GALLERY_CATEGORIES } from '../../src/data/gallery';
import {
  ALL_FILTER,
  filterCounts,
  isGalleryFilter,
  matchesFilter,
  resultMessage,
  visibleIds,
} from '../../src/lib/gallery-filter';

const items = [
  { id: 'a', category: 'driveways' },
  { id: 'b', category: 'courts' },
  { id: 'c', category: 'driveways' },
];

describe('isGalleryFilter', () => {
  it('accepts "all" and every category', () => {
    expect(isGalleryFilter(ALL_FILTER)).toBe(true);
    for (const category of GALLERY_CATEGORIES) expect(isGalleryFilter(category)).toBe(true);
  });

  it('rejects anything else', () => {
    for (const value of ['', 'Driveways', 'fences', null, undefined]) {
      expect(isGalleryFilter(value)).toBe(false);
    }
  });
});

describe('matchesFilter and visibleIds', () => {
  it('shows everything for "all"', () => {
    expect(matchesFilter('courts', ALL_FILTER)).toBe(true);
    expect(visibleIds(items, ALL_FILTER)).toEqual(['a', 'b', 'c']);
  });

  it('keeps only the chosen category, in order', () => {
    expect(visibleIds(items, 'driveways')).toEqual(['a', 'c']);
    expect(visibleIds(items, 'patios')).toEqual([]);
  });
});

describe('filterCounts', () => {
  it('counts every category and the total', () => {
    const counts = filterCounts(items);
    expect(counts.all).toBe(3);
    expect(counts.driveways).toBe(2);
    expect(counts.courts).toBe(1);
    expect(counts.process).toBe(0);
  });

  it('adds up to the full manifest', () => {
    const counts = filterCounts(gallery);
    const sum = GALLERY_CATEGORIES.reduce((total, category) => total + counts[category], 0);
    expect(sum).toBe(counts.all);
  });
});

describe('resultMessage', () => {
  it('describes the result for the live region', () => {
    expect(resultMessage(45, 'All', true)).toBe('Showing all 45 photos');
    expect(resultMessage(13, 'Driveways', false)).toBe('Showing 13 photos in Driveways');
    expect(resultMessage(1, 'Fences', false)).toBe('Showing 1 photo in Fences');
    expect(resultMessage(0, 'Fences', false)).toBe('No photos in Fences yet.');
  });
});
