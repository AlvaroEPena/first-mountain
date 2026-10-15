import { expect, test } from '@playwright/test';

import { BUSINESS, PAGES } from '../support/site';

test.describe('links', () => {
  for (const sitePage of PAGES) {
    test(`${sitePage.name}: every internal link and fragment resolves`, async ({
      page,
      baseURL,
      request,
    }) => {
      await page.goto(sitePage.path);
      const origin = new URL(baseURL ?? page.url()).origin;
      const hrefs = await page
        .locator('a[href]')
        .evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href));
      const internal = [...new Set(hrefs)].filter((href) => new URL(href).origin === origin);
      expect(internal.length).toBeGreaterThan(0);

      const broken: string[] = [];
      const htmlByPath = new Map<string, string>();
      for (const href of internal) {
        const url = new URL(href);
        const target = `${url.pathname}${url.search}`;
        if (!htmlByPath.has(target)) {
          const response = await request.get(target);
          if (response.status() !== 200) {
            broken.push(`${target} -> ${response.status()}`);
            continue;
          }
          const isHtml = (response.headers()['content-type'] ?? '').includes('text/html');
          htmlByPath.set(target, isHtml ? await response.text() : '');
        }
        const fragment = decodeURIComponent(url.hash.slice(1));
        if (fragment && !htmlByPath.get(target)?.includes(`id="${fragment}"`)) {
          broken.push(`${target}#${fragment} -> no element with that id`);
        }
      }
      expect(broken, 'broken internal links').toEqual([]);
    });

    test(`${sitePage.name}: call and text links use the business number`, async ({ page }) => {
      await page.goto(sitePage.path);
      expect(await page.locator(`a[href="${BUSINESS.telHref}"]`).count()).toBeGreaterThan(0);
      expect(await page.locator(`a[href="${BUSINESS.smsHref}"]`).count()).toBeGreaterThan(0);
      // No other phone numbers sneak in.
      const otherPhones = await page
        .locator('a[href^="tel:"], a[href^="sms:"]')
        .evaluateAll(
          (links, allowed) =>
            links
              .map((link) => link.getAttribute('href'))
              .filter((href) => !allowed.includes(href ?? '')),
          [BUSINESS.telHref, BUSINESS.smsHref] as string[],
        );
      expect(otherPhones).toEqual([]);
    });
  }

  test('"Read all reviews on Google" points to the Google listing on every page that has it', async ({
    page,
  }) => {
    for (const path of ['/', '/reviews']) {
      await page.goto(path);
      const links = page.getByRole('link', { name: /Read all reviews on Google/ });
      await expect(links).not.toHaveCount(0);
      for (const link of await links.all()) {
        await expect(link).toHaveAttribute('href', BUSINESS.googleListingUrl);
      }
    }
  });
});
