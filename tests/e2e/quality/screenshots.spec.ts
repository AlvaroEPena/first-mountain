import path from 'node:path';

import { test } from '@playwright/test';

import { scrollThroughPage, expectSeenImagesLoaded } from '../support/scroll';
import { PAGES } from '../support/site';
import { expectMotionSettled } from '../support/visibility';

/**
 * Full-page screenshots of every page at phone and desktop widths for the visual review. They are
 * written to test-results/screenshots/ (gitignored) after lazy images and reveals have fired.
 */
const VIEWPORTS = [
  { label: 'mobile-390', width: 390, height: 844 },
  { label: 'desktop-1440', width: 1440, height: 900 },
] as const;

test.describe('screenshots', () => {
  for (const viewport of VIEWPORTS) {
    for (const sitePage of PAGES) {
      test(`${sitePage.name} at ${viewport.label}`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(sitePage.path);
        await scrollThroughPage(page);
        await expectSeenImagesLoaded(page);
        await expectMotionSettled(page);
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.screenshot({
          path: path.join(
            testInfo.project.outputDir,
            'screenshots',
            `${sitePage.name}-${viewport.label}.png`,
          ),
          fullPage: true,
          animations: 'disabled',
        });
      });
    }
  }
});
