import { defineConfig, devices } from '@playwright/test'

/**
 * Simplified Playwright configuration for VS Code extension
 * This config focuses on the regression tests for better extension compatibility
 */
export default defineConfig({
  testDir: './tests/e2e/regression',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  forbidOnly: false,
  retries: 0,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost:1811',
    trace: 'on-first-retry',
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  outputDir: 'test-results/',
  globalSetup: './tests/e2e/regression/utils/global-setup.ts',
  globalTeardown: './tests/e2e/regression/utils/global-teardown.ts',
  webServer: {
    command: 'npm run dev',
    port: 1811,
    reuseExistingServer: true,
  },
  projects: [
    // Setup project
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      testDir: './tests/e2e',
    },
    // Regression tests only
    {
      name: 'regression',
      testDir: './tests/e2e/regression',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'test-results/.auth/user.json',
      },
    },
  ],
})
