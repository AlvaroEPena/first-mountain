import { expect, test, type Page } from '@playwright/test';

// J8. A mobile visitor opens the nav menu (focus trap, Esc closes, body doesn't scroll) and
// navigates.

const toggle = (page: Page) => page.getByRole('button', { name: /^(Menu|Close menu)$/ });
const menu = (page: Page) => page.getByRole('navigation', { name: 'Mobile' });

test.describe('J8 mobile menu', () => {
  test.skip(({ isMobile }) => !isMobile, 'The menu toggle only exists below 64rem.');

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('opens with focus inside, traps Tab, locks scroll and closes on Esc', async ({ page }) => {
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false');
    await toggle(page).click();

    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle(page)).toHaveAccessibleName('Close menu');
    await expect(menu(page)).toBeVisible();
    await expect(menu(page).getByRole('link', { name: 'Services' })).toBeFocused();

    // Focus trap: forward from the last control wraps to the toggle, and back again.
    const panel = page.locator('#mobile-menu');
    const lastControl = panel.getByRole('link').last();
    await lastControl.focus();
    await page.keyboard.press('Tab');
    await expect(toggle(page)).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(lastControl).toBeFocused();

    // Scroll lock: the page behind does not move.
    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 900);
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
    expect(await page.evaluate(() => window.scrollY)).toBe(before);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe(
      'hidden',
    );

    await page.keyboard.press('Escape');
    await expect(menu(page)).toBeHidden();
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle(page)).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');
  });

  test('following a link navigates and leaves the menu closed', async ({ page }) => {
    await toggle(page).click();
    await menu(page).getByRole('link', { name: 'Projects' }).click();

    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Real jobs, photographed on site',
    );
    await expect(menu(page)).toBeHidden();
    await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false');
  });
});
