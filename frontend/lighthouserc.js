/**
 * Lighthouse CI Configuration
 * 
 * Performance baseline and budget configuration for ChMS.
 * This ensures performance doesn't regress during design system migration.
 */

module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:9000/',
        'http://localhost:9000/auth/login',
        'http://localhost:9000/dashboard',
        'http://localhost:9000/members',
        'http://localhost:9000/attendance',
      ],
      numberOfRuns: 3,
      startServerCommand: 'npm run dev',
      startServerReadyPattern: 'ready',
      startServerReadyTimeout: 10000,
    },
    assert: {
      assertions: {
        // Performance Budgets (Africa-First Requirements)
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.90 }],
        'categories:best-practices': ['error', { minScore: 0.85 }],
        'categories:seo': ['warn', { minScore: 0.80 }],
        
        // Bundle Size Budgets
        'resource-summary:script:size': ['error', { maxNumericValue: 500000 }], // 500KB gzipped
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 100000 }], // 100KB gzipped
        
        // Performance Metrics (3G Network)
        'first-contentful-paint': ['error', { maxNumericValue: 1500 }], // 1.5s on 3G
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }], // 2.5s on 3G
        'total-blocking-time': ['error', { maxNumericValue: 300 }], // 300ms
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }], // CLS < 0.1
        'speed-index': ['error', { maxNumericValue: 3000 }], // 3s on 3G
        
        // Network Conditions
        'network-requests': ['warn', { maxNumericValue: 50 }], // Max 50 requests
        'network-server-latency': ['warn', { maxNumericValue: 500 }], // 500ms max latency
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

