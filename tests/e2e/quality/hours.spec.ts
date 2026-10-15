import { expect, test } from '@playwright/test';

/**
 * The "Open now / Closed" badge is computed in the browser in America/Denver. The clock is fixed
 * so the result never depends on when the suite runs. October 2026 is on MDT (UTC-6).
 */
const CASES = [
  {
    when: 'Monday 10:00 MDT',
    at: '2026-10-12T16:00:00Z',
    status: 'Open now, until 7 pm',
    today: 'Monday',
  },
  {
    when: 'Monday 06:00 MDT, before opening',
    at: '2026-10-12T12:00:00Z',
    status: 'Closed, opens today at 7 am',
    today: 'Monday',
  },
  {
    when: 'Saturday 12:00 MDT',
    at: '2026-10-17T18:00:00Z',
    status: 'Closed, opens Monday at 7 am',
    today: 'Saturday',
  },
] as const;

test.describe('hours badge', () => {
  for (const { when, at, status, today } of CASES) {
    test(`${when}: "${status}" with today highlighted`, async ({ page }) => {
      await page.clock.setFixedTime(new Date(at));
      await page.goto('/contact');
      const hours = page.locator('[data-hours]');

      await expect(hours.locator('[data-hours-status]')).toHaveText(status);
      await expect(hours.locator('tr[aria-current="date"] th')).toHaveText(`${today} (today)`);
      await expect(hours.locator('tr[aria-current="date"]')).toHaveCount(1);
    });
  }

  test('without a mocked clock the badge shows a well-formed status', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-hours-status]').first()).toHaveText(
      /^(Open now, until \d{1,2}(:\d{2})? [ap]m|Closed, opens (today|\w+day) at \d{1,2}(:\d{2})? [ap]m)$/,
    );
  });
});
