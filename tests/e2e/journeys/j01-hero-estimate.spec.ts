import { expect, test } from '@playwright/test';

// J1. A visitor lands on /, sees the hero photo and headline, taps "Get a free estimate" and
// reaches /contact#quote.
test.describe('J1 hero to estimate', () => {
  test('hero photo and headline lead to the quote form', async ({ page }) => {
    await page.goto('/');
    const hero = page.getByRole('region', { name: 'Concrete done right, by Frank and his crew.' });

    await expect(hero.getByRole('heading', { level: 1 })).toBeVisible();
    const photo = hero.getByRole('img').first();
    await expect(photo).toBeVisible();
    // The LCP image is eager and high priority, and it actually decodes.
    await expect(photo).toHaveAttribute('loading', 'eager');
    await expect(photo).toHaveAttribute('fetchpriority', 'high');
    await expect
      .poll(() => photo.evaluate((image: HTMLImageElement) => image.naturalWidth))
      .toBeGreaterThan(0);

    await hero.getByRole('link', { name: 'Get a free estimate' }).click();

    await expect(page).toHaveURL(/\/contact#quote$/);
    await expect(page.getByRole('heading', { name: 'Request an estimate' })).toBeVisible();
    await expect(page.getByLabel(/Your name/)).toBeInViewport();
  });
});
