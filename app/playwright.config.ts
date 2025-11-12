import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for E2E Tests
 *
 * IMPORTANT: Tests should run against production build, not dev server!
 *
 * Setup:
 * 1. Build: pnpm run build (creates static export in out/ directory)
 * 2. Serve: pnpm run serve (serves out/ on port 3200)
 * 3. Netlify: pnpm run dev:api (Netlify Dev on port 8888, proxies to 3200)
 * 4. Test: Tests access via http://localhost:8888
 *
 * This ensures tests validate the actual production build that will be deployed.
 *
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
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
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:8888',
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

  /* Run your local build server before starting the tests */
  webServer: process.env.CI
    ? undefined
    : {
        command: 'cd .. && pnpm run dev:api',
        url: 'http://localhost:8888',
        reuseExistingServer: true,
        timeout: 120 * 1000,
      },
});
