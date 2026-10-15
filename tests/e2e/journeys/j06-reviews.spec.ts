import { expect, test } from '@playwright/test';

import { scrollThroughPage } from '../support/scroll';
import { BUSINESS } from '../support/site';

// J6. A visitor opens /reviews, sees the 4.7 summary and the review list, and the "Read all reviews
// on Google" link points to the listing.
test.describe('J6 reviews', () => {
  test('rating summary, review list and the Google listing link', async ({ page }) => {
    await page.goto('/reviews');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Reviews from the people we pour for',
    );
    await expect(
      page.getByRole('img', { name: `Rated ${BUSINESS.rating.value} out of 5` }).first(),
    ).toBeVisible();
    await expect(
      page
        .getByText(new RegExp(`from ${BUSINESS.rating.count} Google reviews, as of Oct 2026`))
        .first(),
    ).toBeVisible();
    // The big figure ends on the real value (it may count up when motion is allowed).
    await expect(page.locator('.rating--large .rating__value')).toHaveText(BUSINESS.rating.value);

    const listHeading = page.getByRole('heading', { level: 2, name: /written reviews$/ });
    const written = Number((await listHeading.textContent())?.match(/\d+/)?.[0]);
    expect(written).toBe(27);
    await scrollThroughPage(page);
    await expect(page.getByRole('article')).toHaveCount(written);

    const googleLink = page.getByRole('link', { name: /Read all reviews on Google/ });
    await expect(googleLink).toHaveAttribute('href', BUSINESS.googleListingUrl);
    await expect(googleLink).toHaveAttribute('target', '_blank');
    await expect(googleLink).toHaveAttribute('rel', /noopener/);
  });
});
