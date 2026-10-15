import { expect, test } from '@playwright/test';

// J10. An unknown URL shows the 404 page with a link home.
test.describe('J10 not found', () => {
  test('an unknown URL returns 404 with the branded page and a way home', async ({ page }) => {
    const response = await page.goto('/this-slab-was-never-poured');

    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nothing poured here yet.');
    await expect(page).toHaveTitle(/Page not found/);

    await page.getByRole('link', { name: 'Back to the home page' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Concrete done right, by Frank and his crew.',
    );
  });

  test('a deep unknown path also gets the 404 page', async ({ page }) => {
    const response = await page.goto('/services/not-a-service/at-all');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('link', { name: 'See project photos' })).toHaveAttribute(
      'href',
      '/projects',
    );
  });
});
