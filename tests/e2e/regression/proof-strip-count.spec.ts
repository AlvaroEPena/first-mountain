import { expect, test, type Page } from '@playwright/test';

import { scrollThroughPage } from '../support/scroll';
import { BUSINESS } from '../support/site';

/** Home proof strip: 4.7 and 30 count up when motion is allowed and must land on the real values. */
const countFigures = (page: Page) =>
  page.getByRole('region', { name: 'At a glance' }).locator('[data-count-up]');

test.describe('home proof strip figures', () => {
  test('end at 4.7 and 30 after scrolling', async ({ page }) => {
    await page.goto('/');
    await scrollThroughPage(page);
    await expect(countFigures(page)).toHaveText([BUSINESS.rating.value, BUSINESS.rating.count]);
    // Screen readers get the real values regardless of the animation.
    const strip = page.getByRole('region', { name: 'At a glance' });
    await expect(
      strip.getByText(`${BUSINESS.rating.value} star average on Google.`),
    ).toBeAttached();
    await expect(strip.getByText(`${BUSINESS.rating.count} Google reviews.`)).toBeAttached();
  });

  test('are correct at once and never animate under reduced motion', async ({
    page,
    contextOptions,
  }) => {
    test.skip(
      contextOptions.reducedMotion !== 'reduce',
      'Runs in the reduced-motion project only.',
    );
    const seen: string[] = [];
    await page.exposeFunction('__qaRecordFigure', (text: string) => seen.push(text));
    // Record every text the figures ever show, from the first parse onward.
    await page.addInitScript(() => {
      const record = (window as Window & { __qaRecordFigure?: (text: string) => void })
        .__qaRecordFigure;
      document.addEventListener('DOMContentLoaded', () => {
        for (const node of Array.from(document.querySelectorAll('.proof [data-count-up]'))) {
          record?.(node.textContent?.trim() ?? '');
          new MutationObserver(() => record?.(node.textContent?.trim() ?? '')).observe(node, {
            childList: true,
            characterData: true,
            subtree: true,
          });
        }
      });
    });

    await page.goto('/');
    await expect(countFigures(page)).toHaveText([BUSINESS.rating.value, BUSINESS.rating.count]);
    await scrollThroughPage(page);
    await expect(countFigures(page)).toHaveText([BUSINESS.rating.value, BUSINESS.rating.count]);
    expect([...new Set(seen)].sort()).toEqual(
      [BUSINESS.rating.count, BUSINESS.rating.value].sort(),
    );
  });
});
