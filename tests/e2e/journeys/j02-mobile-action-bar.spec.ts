import { expect, test } from '@playwright/test';

import { scrollThroughPage } from '../support/scroll';
import { BUSINESS, PAGES } from '../support/site';

// J2. A mobile visitor taps "Call" or "Text" from the sticky mobile action bar on any page.
test.describe('J2 mobile action bar', () => {
  test.skip(({ isMobile }) => !isMobile, 'The action bar only exists below 48rem.');

  for (const sitePage of PAGES) {
    test(`call, text and estimate stay in reach on ${sitePage.name}`, async ({ page }) => {
      await page.goto(sitePage.path);
      const bar = page.getByRole('navigation', { name: 'Quick contact' });

      await expect(bar).toBeInViewport();
      await expect(bar.getByRole('link', { name: 'Call' })).toHaveAttribute(
        'href',
        BUSINESS.telHref,
      );
      await expect(bar.getByRole('link', { name: 'Text' })).toHaveAttribute(
        'href',
        BUSINESS.smsHref,
      );
      await expect(bar.getByRole('link', { name: 'Estimate' })).toHaveAttribute(
        'href',
        '/contact#quote',
      );

      // Sticky: still on screen at the bottom of the page, and it never hides the footer.
      await scrollThroughPage(page);
      await expect(bar).toBeInViewport();
      const barTop = await bar.evaluate((element) => element.getBoundingClientRect().top);
      const footerBottom = await page.getByRole('contentinfo').evaluate((element) => {
        const lastLink = [...element.querySelectorAll('a, p')].at(-1);
        return (lastLink ?? element).getBoundingClientRect().bottom;
      });
      expect(footerBottom, 'last footer line sits above the action bar').toBeLessThanOrEqual(
        barTop + 1,
      );
    });
  }
});
