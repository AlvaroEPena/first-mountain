import { expect, test, type Page } from '@playwright/test';

import { expectSeen, unsettledMotion } from '../support/visibility';

/**
 * Content must be visible without JavaScript (spec §9): motion start states may only apply once
 * the head script has opted in, so with scripting off nothing can stay hidden.
 */
test.use({ javaScriptEnabled: false });

async function expectAllHeadingsSeen(page: Page): Promise<void> {
  const headings = page.locator('main h1, main h2');
  expect(await headings.count()).toBeGreaterThan(0);
  for (const heading of await headings.all()) {
    if (
      await heading.evaluate(
        (element) =>
          element.closest('.visually-hidden') !== null ||
          element.classList.contains('visually-hidden'),
      )
    )
      continue;
    await expectSeen(heading);
  }
}

async function expectPhotosLoaded(page: Page): Promise<void> {
  const images = page.locator('main img');
  expect(await images.count()).toBeGreaterThan(0);
  for (const image of await images.all()) {
    if (!(await image.isVisible())) continue;
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0), {
        message: `photo did not load without JS: ${await image.getAttribute('src')}`,
      })
      .toBe(true);
  }
}

test.describe('content without JavaScript', () => {
  test('home: headings, photos and review quotes are visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveAttribute('data-motion', /.*/);
    expect(await unsettledMotion(page)).toEqual([]);

    await expectAllHeadingsSeen(page);
    await expectPhotosLoaded(page);
    const firstQuote = page
      .getByRole('region', { name: 'Customer quotes' })
      .locator('blockquote')
      .first();
    await expectSeen(firstQuote);
    await expect(firstQuote).not.toBeEmpty();
    await expect(
      page.getByRole('region', { name: 'At a glance' }).locator('[data-count-up]'),
    ).toHaveText(['4.7', '30']);
  });

  test('services: headings, photos and review quotes are visible', async ({ page }) => {
    await page.goto('/services');
    expect(await unsettledMotion(page)).toEqual([]);

    await expectAllHeadingsSeen(page);
    await expectPhotosLoaded(page);
    const quotes = page.locator('.svc__quote');
    await expect(quotes).toHaveCount(8);
    for (const quote of await quotes.all()) await expectSeen(quote);
  });
});
