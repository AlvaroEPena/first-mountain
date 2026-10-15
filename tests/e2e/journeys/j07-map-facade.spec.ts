import { expect, test } from '@playwright/test';

import { BUSINESS } from '../support/site';
import { escapeRegExp } from '../support/text';

// J7. A visitor on /contact clicks "Show map", and the Google Maps iframe loads only then. A "Get
// directions" link always works.

const GOOGLE_HOST = /(^|\.)(google\.com|gstatic\.com|googleapis\.com|googleusercontent\.com)$/;

test.describe('J7 map facade', () => {
  test('no Google request until "Show map"; then the embed loads and takes focus', async ({
    page,
  }) => {
    const googleRequests: string[] = [];
    page.on('request', (request) => {
      if (GOOGLE_HOST.test(new URL(request.url()).hostname)) googleRequests.push(request.url());
    });
    // Keep the suite hermetic: answer Google with an empty page instead of the real map.
    await page.route(/^https:\/\/([a-z0-9-]+\.)*google\.com\//, (route) =>
      route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>map stub</title>' }),
    );

    await page.goto('/contact');
    const directions = page.getByRole('link', { name: /Get directions/ });
    await expect(directions).toHaveAttribute(
      'href',
      new RegExp(`^${escapeRegExp(BUSINESS.directionsPrefix)}`),
    );
    await expect(directions).toHaveAttribute('target', '_blank');
    await expect(directions).toHaveAttribute('rel', /noopener/);

    const showMap = page.getByRole('button', { name: 'Show map' });
    await showMap.scrollIntoViewIfNeeded();
    await page.waitForLoadState('networkidle');
    expect(googleRequests, 'Google requests before the visitor asked for the map').toEqual([]);

    await showMap.click();
    const iframe = page.locator(`iframe[src^="${BUSINESS.mapEmbedPrefix}"]`);
    await expect(iframe).toBeAttached();
    await expect(iframe).toHaveAttribute('title', /Map showing First Mountain Construction/);
    await expect(iframe).toBeFocused();
    await expect(showMap).toHaveCount(0);
    await expect.poll(() => googleRequests.length).toBeGreaterThan(0);

    // Directions still work with the map open.
    await expect(directions).toBeVisible();
  });
});
