import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for E2E Tests with MSW
 *
 * This configuration runs tests against the Next.js dev server with MSW enabled.
 * MSW will intercept API calls and return mock data for testing various scenarios.
 *
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Only run MSW-specific tests */
  testMatch: ['**/e2e-msw*.spec.ts'],
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'github' : 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL - use port 3200 directly for MSW tests (no Netlify proxy needed) */
    baseURL: 'http://localhost:3200',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run dev server with MSW enabled before starting the tests */
  webServer: process.env.CI
    ? undefined
    : {
        command: 'NEXT_PUBLIC_ENABLE_MSW=true pnpm run dev',
        url: 'http://localhost:3200',
        reuseExistingServer: true,
        timeout: 120 * 1000,
        env: {
          NEXT_PUBLIC_ENABLE_MSW: 'true',
        },
      },
});
