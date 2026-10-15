import { expect, test, type Page } from '@playwright/test';

/** Current marquee offset in px (positive = moved left), read from the rail's transform. */
const railOffset = (page: Page) =>
  page
    .locator('[data-track] .track__rail')
    .evaluate((rail) => -new DOMMatrixReadOnly(getComputedStyle(rail).transform).m41);

const viewport = (page: Page) => page.locator('[data-track] .track__viewport');
const toggle = (page: Page) => page.locator('[data-track-toggle]');

test.describe('home review marquee', () => {
  test.skip(
    ({ contextOptions }) => contextOptions.reducedMotion === 'reduce',
    'Under reduced motion the marquee is a plain scroller with no controls.',
  );

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await viewport(page).scrollIntoViewIfNeeded();
  });

  test('keeps moving while the mouse is over it', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Hover only applies to pointer devices.');
    await viewport(page).hover();
    const before = await railOffset(page);
    await expect.poll(() => railOffset(page)).toBeGreaterThan(before + 2);
  });

  test('Pause freezes it in place and turns it into a scroller; Play resumes from there', async ({
    page,
  }) => {
    await expect.poll(() => railOffset(page)).toBeGreaterThan(5);
    await toggle(page).click();

    await expect(page.locator('[data-track]')).toHaveAttribute('data-paused', '');
    await expect(toggle(page)).toHaveText('Play quotes');
    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByText('Swipe or scroll to browse')).toBeVisible();
    // Frozen where it stopped: the animation offset became scrollLeft, so nothing jumped.
    const frozen = await viewport(page).evaluate((el) => el.scrollLeft);
    expect(frozen).toBeGreaterThan(5);
    expect(await railOffset(page)).toBeCloseTo(0);
    await expect(viewport(page)).toHaveCSS('overflow-x', 'auto');

    // Browse a little, then resume: the marquee continues from the scrolled position.
    await viewport(page).evaluate((el) => (el.scrollLeft += 300));
    const scrolled = await viewport(page).evaluate((el) => el.scrollLeft);
    await toggle(page).click();
    await expect(page.locator('[data-track]')).not.toHaveAttribute('data-paused');
    await expect(toggle(page)).toHaveText('Pause quotes');
    await expect(page.getByText('Swipe or scroll to browse')).toBeHidden();
    const resumed = await railOffset(page);
    expect(Math.abs(resumed - scrolled)).toBeLessThan(40);
  });

  test('the mouse wheel scrolls the paused marquee sideways, not the page', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Mouse wheel only applies to desktop.');
    await toggle(page).click();
    await viewport(page).evaluate((el) => (el.scrollLeft = 0));
    await viewport(page).hover();
    const pageY = await page.evaluate(() => window.scrollY);

    await page.mouse.wheel(0, 400);
    await expect.poll(() => viewport(page).evaluate((el) => el.scrollLeft)).toBeGreaterThan(100);
    expect(await page.evaluate(() => window.scrollY)).toBe(pageY);
  });

  test('the mouse wheel scrolls the page while the marquee is playing', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Mouse wheel only applies to desktop.');
    await viewport(page).hover();
    const pageY = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 400);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(pageY);
  });
});
