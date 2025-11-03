/**
 * Regression Test Configuration
 * 
 * Centralized configuration for regression tests including
 * timeouts, retry policies, and environment settings.
 */

export const TEST_CONFIG = {
  // Timeouts (in milliseconds)
  timeouts: {
    default: 30000,        // 30 seconds default timeout
    navigation: 10000,     // 10 seconds for navigation
    api: 5000,            // 5 seconds for API calls
    loading: 3000,        // 3 seconds for loading states
    animation: 1000       // 1 second for animations
  },
  
  // Retry configuration
  retries: {
    default: 2,           // Retry failed tests 2 times
    flaky: 3,            // Retry flaky tests 3 times
    network: 5           // Retry network-related tests 5 times
  },
  
  // Performance thresholds (Africa-first requirements)
  performance: {
    pageLoadTime: 3000,   // 3 seconds max page load
    apiResponseTime: 500, // 500ms max API response
    domContentLoaded: 1000, // 1 second max DOM content loaded
    firstContentfulPaint: 1500 // 1.5 seconds max first contentful paint
  },
  
  // Mobile device configurations
  devices: {
    pixel5: {
      name: 'Pixel 5',
      viewport: { width: 393, height: 851 },
      userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36'
    },
    galaxyS5: {
      name: 'Galaxy S5',
      viewport: { width: 360, height: 640 },
      userAgent: 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P) AppleWebKit/537.36'
    },
    iphone12: {
      name: 'iPhone 12',
      viewport: { width: 390, height: 844 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    }
  },
  
  // Network simulation settings
  network: {
    slow3G: {
      downloadThroughput: 500 * 1024 / 8,    // 500 Kbps
      uploadThroughput: 500 * 1024 / 8,      // 500 Kbps
      latency: 400                           // 400ms latency
    },
    fast3G: {
      downloadThroughput: 1.6 * 1024 * 1024 / 8, // 1.6 Mbps
      uploadThroughput: 750 * 1024 / 8,           // 750 Kbps
      latency: 150                                // 150ms latency
    },
    offline: {
      downloadThroughput: 0,
      uploadThroughput: 0,
      latency: 0
    }
  },
  
  // Test environment URLs
  urls: {
    frontend: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:1811',
    backend: process.env.VITE_API_URL || 'http://localhost:8000/api'
  },
  
  // Test user credentials
  users: {
    admin: {
      email: 'admin@testchurch.com',
      password: 'AdminPass123!'
    },
    staff: {
      email: 'staff@testchurch.com', 
      password: 'StaffPass123!'
    },
    member: {
      email: 'test@example.com',
      password: 'password123'
    }
  },
  
  // Accessibility testing configuration
  accessibility: {
    standards: 'wcag2aa',
    tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
    rules: {
      'color-contrast': { enabled: true },
      'keyboard-navigation': { enabled: true },
      'focus-management': { enabled: true },
      'aria-labels': { enabled: true }
    }
  },
  
  // Screenshot and video configuration
  media: {
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true
    },
    video: {
      mode: 'retain-on-failure',
      size: { width: 1280, height: 720 }
    },
    trace: {
      mode: 'on-first-retry',
      screenshots: true,
      snapshots: true
    }
  },
  
  // Test data configuration
  testData: {
    cleanup: true,        // Clean up test data after tests
    seed: true,          // Seed test data before tests
    isolation: true      // Isolate tests from each other
  },
  
  // Parallel execution configuration
  parallel: {
    workers: process.env.CI ? 1 : 4,  // 1 worker on CI, 4 locally
    fullyParallel: true,
    forbidOnly: !!process.env.CI
  },
  
  // Reporting configuration
  reporting: {
    reporters: [
      ['html', { outputFolder: 'test-results/regression-report' }],
      ['json', { outputFile: 'test-results/regression-results.json' }],
      ['junit', { outputFile: 'test-results/regression-results.xml' }]
    ],
    outputDir: 'test-results/regression'
  }
}

// Environment-specific overrides
if (process.env.CI) {
  // CI-specific configuration
  TEST_CONFIG.timeouts.default = 60000  // Longer timeouts on CI
  TEST_CONFIG.retries.default = 3       // More retries on CI
  TEST_CONFIG.parallel.workers = 2      // More workers on CI
}

if (process.env.NODE_ENV === 'development') {
  // Development-specific configuration
  TEST_CONFIG.timeouts.default = 10000  // Shorter timeouts in dev
  TEST_CONFIG.retries.default = 0       // No retries in dev
}

export default TEST_CONFIG
