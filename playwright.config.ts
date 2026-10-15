import { defineConfig, devices } from '@playwright/test';

/**
 * E2E runs against the production build, never the dev server (port 4334).
 * Port 4336 belongs to the orchestrator's own preview server. Astro 7 allows one tracked
 * preview server per project, so this one opts out of the lock with `--ignore-lock`.
 */
const PORT = 4335;
const BASE_URL = `http://localhost:${PORT}`;

/** Specs that set their own viewports or only need one browser profile. */
const DESKTOP_ONLY = ['**/quality/responsive.spec.ts', '**/quality/screenshots.spec.ts'];

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  // A flaky test is a bug to report, not something to retry away.
  retries: 0,
  // Modest parallelism so axe scans and full-page scrolls do not starve each other.
  workers: 2,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
      testIgnore: DESKTOP_ONLY,
    },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'reduced-motion',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
        contextOptions: { reducedMotion: 'reduce' },
      },
      // Axe and layout checks do not depend on motion; the desktop project covers them.
      testIgnore: [...DESKTOP_ONLY, '**/quality/a11y.spec.ts'],
    },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --ignore-lock`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
