import { expect, test } from '@playwright/test';

import { expectNoSeriousA11yViolations } from '../support/a11y';
import { scrollThroughPage } from '../support/scroll';
import { PAGES } from '../support/site';
import { expectMotionSettled } from '../support/visibility';

/** WCAG 2.2 AA with axe on every page and on the interactive states that change the DOM. */
test.describe('accessibility (axe, WCAG 2.2 AA)', () => {
  for (const sitePage of PAGES) {
    test(`${sitePage.name} page`, async ({ page }, testInfo) => {
      await page.goto(sitePage.path);
      // Scan the settled page: mid-reveal opacity would skew colour-contrast results.
      await scrollThroughPage(page);
      await expectMotionSettled(page);
      await expectNoSeriousA11yViolations(page, testInfo, sitePage.name);
    });
  }

  test('open mobile menu', async ({ page, isMobile }, testInfo) => {
    test.skip(!isMobile, 'The menu toggle only exists below 64rem.');
    await page.goto('/');
    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeVisible();
    await expectNoSeriousA11yViolations(page, testInfo, 'mobile-menu');
  });

  test('open lightbox', async ({ page }, testInfo) => {
    await page.goto('/projects');
    await page.locator('[data-gallery-grid] a').first().click();
    const lightbox = page.getByRole('dialog');
    await expect(lightbox).toBeVisible();
    await expect(lightbox.locator('.pswp__img').first()).toBeVisible();
    await expectNoSeriousA11yViolations(page, testInfo, 'lightbox');
  });

  test('quote form error state', async ({ page }, testInfo) => {
    await page.goto('/contact#quote');
    await page.getByRole('button', { name: 'Send my request' }).click();
    await expect(page.getByLabel(/^Your name/)).toHaveAttribute('aria-invalid', 'true');
    await scrollThroughPage(page);
    await expectMotionSettled(page);
    await expectNoSeriousA11yViolations(page, testInfo, 'quote-form-errors');
  });
});
