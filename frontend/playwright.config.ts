import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ...(process.env.CI ? [['github']] : [])
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.CI ? 'http://localhost:4173' : 'http://localhost:1811',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Only on CI systems run the tests headless */
    headless: !!process.env.CI,

    /* Screenshot on failure for debugging */
    screenshot: 'only-on-failure',

    /* Video recording for failed tests */
    video: 'retain-on-failure',
  },



  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'test-results/',

  /* Global setup and teardown */
  globalSetup: './e2e/regression/utils/global-setup.ts',
  globalTeardown: './e2e/regression/utils/global-teardown.ts',

  /* Run your local dev server before starting the tests */
  webServer: {
    /**
     * Use the dev server by default for faster feedback loop.
     * Use the preview server on CI for more realistic testing.
     * Playwright will re-use the local server if there is already a dev-server running.
     */
    command: process.env.CI ? 'npm run preview' : 'npm run dev',
    port: process.env.CI ? 4173 : 1811,
    reuseExistingServer: !process.env.CI,
  },

  /* Test projects for different test suites */
  projects: [
    // Setup project for seeding test data
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Regression test suite
    {
      name: 'regression',
      testDir: './e2e/regression',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        // Store auth state for authenticated tests
        storageState: 'test-results/.auth/user.json',
      },
    },

    // Main E2E tests
    {
      name: 'chromium',
      testIgnore: /.*regression.*|.*\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      testIgnore: /.*regression.*|.*\.setup\.ts/,
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      testIgnore: /.*regression.*|.*\.setup\.ts/,
      use: {
        ...devices['Desktop Safari'],
      },
    },

    /* Test against mobile viewports - Africa-first approach */
    {
      name: 'Mobile Chrome',
      testIgnore: /.*regression.*|.*\.setup\.ts/,
      use: {
        ...devices['Pixel 5'],
        hasTouch: true,
      },
    },
    {
      name: 'Mobile Safari',
      testIgnore: /.*regression.*|.*\.setup\.ts/,
      use: {
        ...devices['iPhone 12'],
        hasTouch: true,
      },
    },
    {
      name: 'Mobile Chrome Low-End',
      testIgnore: /.*regression.*|.*\.setup\.ts/,
      use: {
        ...devices['Galaxy S5'], // Lower-end Android device
        hasTouch: true,
      },
    },

    // Regression tests on mobile
    {
      name: 'regression-mobile',
      testDir: './e2e/regression',
      dependencies: ['setup'],
      use: {
        ...devices['Pixel 5'],
        hasTouch: true,
        storageState: 'test-results/.auth/user.json',
      },
    },
  ],
})
