import { expect, test } from '@playwright/test';

import { expectSeenImagesLoaded, scrollThroughPage } from '../support/scroll';
import { expectSeen } from '../support/visibility';

/**
 * Regression (commit ec6ad77): the count-up effect selected `[data-count]`, which the services
 * photo grids also used as a layout hook. It replaced each grid's photos with a number and broke
 * every scroll reveal after it. The grids now use `data-photos`.
 */
const GALLERY_SECTIONS = [
  { id: 'driveways', photos: 4 },
  { id: 'sport-courts', photos: 3 },
  { id: 'hardscape', photos: 4 },
] as const;

test.describe('services photo grids survive the motion module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/services');
    await scrollThroughPage(page);
  });

  for (const { id, photos } of GALLERY_SECTIONS) {
    test(`#${id} renders ${photos} real photos`, async ({ page }) => {
      const grid = page.locator(`#${id} ul[data-photos]`);
      await expect(grid).toHaveAttribute('data-photos', String(photos));
      await expect(grid.getByRole('listitem')).toHaveCount(photos);
      const images = grid.locator('li img');
      await expect(images).toHaveCount(photos);
      for (const image of await images.all()) {
        await expect(image).toBeVisible();
        await expect
          .poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth))
          .toBeGreaterThan(0);
      }
      // No stray number left where the photos should be.
      expect((await grid.innerText()).trim()).toBe('');
    });
  }

  test('later scroll-revealed headings (#fences, FAQ) end up visible', async ({ page }) => {
    await expectSeen(page.locator('#fences h2'));
    await expectSeen(
      page.getByRole('heading', { level: 2, name: 'Questions people ask before they call' }),
    );
  });

  test('every photo seen while scrolling loaded', async ({ page }) => {
    await expectSeenImagesLoaded(page);
  });
});
