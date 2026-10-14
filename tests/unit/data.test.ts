import { readdirSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { atmospherePhotoId, gallery, GALLERY_CATEGORIES } from '../../src/data/gallery';
import { reviews } from '../../src/data/reviews';
import { SERVICE_IDS } from '../../src/data/service-ids';
import { site } from '../../src/data/site';

const PHOTO_DIR = path.resolve('src/assets/photos');
const photoFiles = readdirSync(PHOTO_DIR).filter((file) => file.endsWith('.jpg'));

describe('gallery manifest', () => {
  it('has unique ids, real files, alt text and valid categories', () => {
    const ids = gallery.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of gallery) {
      expect(photoFiles).toContain(`${item.id}.jpg`);
      expect(item.alt.length).toBeGreaterThan(15);
      expect(GALLERY_CATEGORIES).toContain(item.category);
    }
  });

  it('never presents the atmosphere photo as a project', () => {
    expect(gallery.some((item) => item.id === atmospherePhotoId)).toBe(false);
    expect(photoFiles).toContain(`${atmospherePhotoId}.jpg`);
  });

  it('flags every photo under 1000px as low-res', async () => {
    for (const item of gallery) {
      const { width = 0, height = 0 } = await sharp(
        path.join(PHOTO_DIR, `${item.id}.jpg`),
      ).metadata();
      expect(Boolean(item.lowRes), item.id).toBe(Math.max(width, height) < 1000);
    }
  });
});

describe('committed photos', () => {
  it('carry no EXIF, GPS, XMP or IPTC metadata', async () => {
    for (const file of photoFiles) {
      const meta = await sharp(path.join(PHOTO_DIR, file)).metadata();
      expect({ file, exif: meta.exif, xmp: meta.xmp, iptc: meta.iptc }).toEqual({
        file,
        exif: undefined,
        xmp: undefined,
        iptc: undefined,
      });
    }
  });
});

describe('reviews', () => {
  it('have unique ids, 4+ stars, text and verbatim highlights', () => {
    const ids = reviews.map((review) => review.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const review of reviews) {
      expect(review.rating).toBeGreaterThanOrEqual(4);
      expect(review.text.length).toBeGreaterThan(20);
      // Pull quotes may capitalize their first word and end early with a period; otherwise verbatim.
      if (review.highlight) {
        const quote = review.highlight.replace(/[.!?]+$/, '').toLowerCase();
        expect(review.text.toLowerCase(), review.id).toContain(quote);
      }
      for (const service of review.services) expect(SERVICE_IDS).toContain(service);
    }
  });

  it('never outnumber the rating count captured from Google', () => {
    expect(reviews.length).toBeLessThanOrEqual(site.rating.count);
  });
});
