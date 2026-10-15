import { expect, test, type Page } from '@playwright/test';

import { BUSINESS } from '../support/site';
import { escapeRegExp } from '../support/text';

// J5. A visitor fills the quote form with invalid data and sees inline accessible errors. They
// correct them, submit, and see a confirmation. In demo mode the confirmation says the preview
// doesn't send and shows the phone number.

const field = {
  name: (page: Page) => page.getByLabel(/^Your name/),
  phone: (page: Page) => page.getByLabel(/^Phone/),
  email: (page: Page) => page.getByLabel(/^Email/),
  projectType: (page: Page) => page.getByLabel(/^Type of project/),
  message: (page: Page) => page.getByLabel(/^Tell us about the project/),
};
const submitButton = (page: Page) => page.getByRole('button', { name: 'Send my request' });

/** Requests other than GETs for page assets: anything that could carry the form data. */
function trackOutgoingData(page: Page): string[] {
  const sent: string[] = [];
  page.on('request', (request) => {
    if (request.method() !== 'GET') sent.push(`${request.method()} ${request.url()}`);
  });
  return sent;
}

test.describe('J5 quote form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact#quote');
  });

  test('empty submit shows accessible inline errors and focuses the first one', async ({
    page,
  }) => {
    await submitButton(page).click();

    await expect(page.getByText('Please fix 4 highlighted fields and send again.')).toBeVisible();
    const expectations = [
      [field.name(page), 'Please enter your name'],
      [field.phone(page), 'Enter a phone number we can call or text'],
      [field.projectType(page), 'Choose a project type'],
      [field.message(page), 'Tell us a little about the project (10+ characters)'],
    ] as const;
    for (const [control, message] of expectations) {
      await expect(control).toHaveAttribute('aria-invalid', 'true');
      await expect(control).toHaveAccessibleDescription(new RegExp(escapeRegExp(message)));
      await expect(page.getByText(message, { exact: true })).toBeVisible();
    }
    await expect(field.name(page)).toBeFocused();
    // Optional fields stay valid when empty.
    await expect(field.email(page)).not.toHaveAttribute('aria-invalid', 'true');
  });

  test('malformed values are rejected with specific messages', async ({ page }) => {
    await field.name(page).fill('A');
    await field.phone(page).fill('555-12');
    await field.email(page).fill('not-an-email');
    await field.projectType(page).selectOption('driveway');
    await field.message(page).fill('Too short');
    await submitButton(page).click();

    await expect(field.name(page)).toHaveAccessibleDescription(/Please enter your name/);
    await expect(field.phone(page)).toHaveAccessibleDescription(
      /Enter a phone number we can call or text/,
    );
    await expect(field.email(page)).toHaveAccessibleDescription(/Enter a valid email address/);
    await expect(field.message(page)).toHaveAccessibleDescription(/10\+ characters/);
    await expect(field.projectType(page)).not.toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByText('Please fix 4 highlighted fields and send again.')).toBeVisible();
  });

  test('correcting the errors and submitting shows the demo confirmation', async ({ page }) => {
    const sent = trackOutgoingData(page);
    await submitButton(page).click();
    await expect(field.name(page)).toHaveAttribute('aria-invalid', 'true');

    // Editing a field clears its error straight away.
    await field.name(page).fill('Test Visitor');
    await expect(field.name(page)).not.toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByText('Please enter your name', { exact: true })).toBeHidden();

    await field.phone(page).fill('(801) 555-0134');
    await field.email(page).fill('visitor@example.com');
    await field.projectType(page).selectOption('patio-pad');
    await field.message(page).fill('Backyard patio, about 12 by 20 feet, replacing old pavers.');
    await submitButton(page).click();

    const done = page.getByRole('status').filter({ has: page.getByRole('heading') });
    await expect(done).toBeVisible();
    await expect(done).toBeFocused();
    await expect(done.getByRole('heading')).toHaveText(
      'Your request looks good, but this preview does not send it.',
    );
    await expect(done).toContainText('does not send anything yet');
    await expect(done.getByRole('link', { name: BUSINESS.phoneDisplay })).toHaveAttribute(
      'href',
      BUSINESS.telHref,
    );
    await expect(page.locator('[data-quote-form]')).toBeHidden();
    expect(sent, 'demo mode must not send the form anywhere').toEqual([]);
  });

  test('a filled honeypot looks like success but sends nothing', async ({ page }) => {
    const sent = trackOutgoingData(page);
    await page.locator('#quote-website').evaluate((input: HTMLInputElement) => {
      input.value = 'https://spam.example';
    });
    await submitButton(page).click();

    const done = page.getByRole('status').filter({ has: page.getByRole('heading') });
    await expect(done.getByRole('heading')).toHaveText('Thanks, we have your request.');
    expect(sent).toEqual([]);
  });
});
