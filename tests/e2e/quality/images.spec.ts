import { readdir } from 'node:fs/promises';
import path from 'node:path';

import { expect, test } from '@playwright/test';
import sharp from 'sharp';

import { expectSeenImagesLoaded, scrollThroughPage, seenImages } from '../support/scroll';
import { LOW_RES_MAX_WIDTH, PAGES } from '../support/site';

const PHOTO_DIR = path.resolve('src/assets/photos');

/** Native size of every committed photo, keyed by id ("photo-06"), read from the files. */
async function nativeSizes(): Promise<Map<string, { width: number; height: number }>> {
  const sizes = new Map<string, { width: number; height: number }>();
  for (const file of await readdir(PHOTO_DIR)) {
    if (!file.endsWith('.jpg')) continue;
    const { width, height } = await sharp(path.join(PHOTO_DIR, file)).metadata();
    if (width && height) sizes.set(path.basename(file, '.jpg'), { width, height });
  }
  return sizes;
}

test.describe('images', () => {
  let natives: Map<string, { width: number; height: number }>;
  test.beforeAll(async () => {
    natives = await nativeSizes();
  });

  for (const sitePage of PAGES) {
    test(`${sitePage.name}: every image seen loads, low-res photos never upscale`, async ({
      page,
    }) => {
      await page.goto(sitePage.path);
      await scrollThroughPage(page);
      await expectSeenImagesLoaded(page);

      const images = await seenImages(page);
      if (sitePage.hasPhotos) expect(images.length, 'photos seen on screen').toBeGreaterThan(0);
      const upscaled: string[] = [];
      for (const image of images) {
        const id = image.src.match(/photo-\d+/)?.[0];
        const native = id ? natives.get(id) : undefined;
        if (!id || !native || native.width > LOW_RES_MAX_WIDTH) continue;
        // object-fit: cover (and fill) scales by the larger ratio; contain by the smaller.
        const ratios = [image.width / native.width, image.height / native.height];
        const scale = image.objectFit === 'contain' ? Math.min(...ratios) : Math.max(...ratios);
        if (scale > 1.01) {
          upscaled.push(
            `${id} (${native.width}x${native.height}) shown at ${Math.round(image.width)}x${Math.round(image.height)}, ${scale.toFixed(2)}x`,
          );
        }
      }
      expect(upscaled, 'low-res photos shown larger than native size').toEqual([]);
    });
  }
});
