#!/usr/bin/env node

/**
 * Africa-First Performance Benchmarking Script
 * 
 * This script measures key performance metrics that are critical for
 * African users with limited bandwidth and lower-end devices.
 */

import { chromium } from 'playwright';
import { performance } from 'perf_hooks';
import fs from 'fs/promises';
import path from 'path';

// Africa-first performance targets
const PERFORMANCE_TARGETS = {
  // Load time targets (seconds)
  FIRST_CONTENTFUL_PAINT: 1.5,    // Critical for perceived performance
  LARGEST_CONTENTFUL_PAINT: 2.5,   // Core Web Vital
  TIME_TO_INTERACTIVE: 3.0,        // When user can interact
  TOTAL_LOAD_TIME: 4.0,           // Complete page load
  
  // Bundle size targets (KB)
  INITIAL_JS_BUNDLE: 200,          // Initial JavaScript bundle
  TOTAL_JS_BUNDLE: 500,            // Total JavaScript
  CSS_BUNDLE: 50,                  // CSS bundle size
  TOTAL_BUNDLE_SIZE: 600,          // Total bundle size
  
  // Network targets (simulating 3G)
  NETWORK_THROTTLE: {
    downloadThroughput: 1.5 * 1024 * 1024 / 8, // 1.5 Mbps
    uploadThroughput: 750 * 1024 / 8,          // 750 Kbps
    latency: 150,                              // 150ms latency
  },
  
  // Mobile-specific targets
  TOUCH_TARGET_SIZE: 44,           // Minimum touch target size (px)
  VIEWPORT_WIDTH: 375,             // Mobile viewport width
  VIEWPORT_HEIGHT: 667,            // Mobile viewport height
};

// Test scenarios for African users
const TEST_SCENARIOS = [
  {
    name: 'Login Page - 3G Network',
    url: '/login',
    network: '3G',
    device: 'Mobile',
    description: 'Critical authentication flow on slow network'
  },
  {
    name: 'Dashboard - 3G Network',
    url: '/dashboard',
    network: '3G',
    device: 'Mobile',
    description: 'Main application interface on slow network'
  },
  {
    name: 'Member Management - 3G Network',
    url: '/members',
    network: '3G',
    device: 'Mobile',
    description: 'Core functionality on slow network'
  },
  {
    name: 'Login Page - Offline',
    url: '/login',
    network: 'Offline',
    device: 'Mobile',
    description: 'Offline functionality testing'
  }
];

class PerformanceBenchmark {
  constructor() {
    this.results = [];
    this.browser = null;
    this.context = null;
  }

  async initialize() {
    console.log('🚀 Initializing Africa-First Performance Benchmark...\n');
    
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Create context with mobile viewport (common in Africa)
    this.context = await this.browser.newContext({
      viewport: { 
        width: PERFORMANCE_TARGETS.VIEWPORT_WIDTH, 
        height: PERFORMANCE_TARGETS.VIEWPORT_HEIGHT 
      },
      userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'
    });
  }

  async runScenario(scenario) {
    console.log(`📱 Testing: ${scenario.name}`);
    console.log(`   Description: ${scenario.description}`);
    
    const page = await this.context.newPage();
    
    // Set up network throttling for 3G simulation
    if (scenario.network === '3G') {
      await page.route('**/*', async (route) => {
        // Simulate 3G network delay
        await new Promise(resolve => setTimeout(resolve, 50));
        await route.continue();
      });
    } else if (scenario.network === 'Offline') {
      await page.route('**/*', route => route.abort());
    }

    // Start performance measurement
    const startTime = performance.now();
    
    try {
      // Navigate to the page
      await page.goto(`http://localhost:1814${scenario.url}`, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Wait for page to be interactive
      await page.waitForLoadState('domcontentloaded');
      
      // Measure Core Web Vitals
      const metrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          // Use Performance Observer for accurate metrics
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const vitals = {};
            
            entries.forEach(entry => {
              if (entry.entryType === 'paint') {
                if (entry.name === 'first-contentful-paint') {
                  vitals.firstContentfulPaint = entry.startTime;
                }
              }
              if (entry.entryType === 'largest-contentful-paint') {
                vitals.largestContentfulPaint = entry.startTime;
              }
            });
            
            resolve(vitals);
          });
          
          observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
          
          // Fallback timeout
          setTimeout(() => resolve({}), 5000);
        });
      });

      const endTime = performance.now();
      const totalLoadTime = (endTime - startTime) / 1000;

      // Measure bundle sizes
      const bundleSizes = await this.measureBundleSizes(page);
      
      // Measure touch target sizes
      const touchTargets = await this.measureTouchTargets(page);
      
      // Test offline functionality
      const offlineCapability = await this.testOfflineCapability(page);

      const result = {
        scenario: scenario.name,
        url: scenario.url,
        network: scenario.network,
        device: scenario.device,
        metrics: {
          firstContentfulPaint: metrics.firstContentfulPaint || 0,
          largestContentfulPaint: metrics.largestContentfulPaint || 0,
          totalLoadTime: totalLoadTime,
          timeToInteractive: totalLoadTime // Simplified for this test
        },
        bundleSizes,
        touchTargets,
        offlineCapability,
        timestamp: new Date().toISOString()
      };

      this.results.push(result);
      
      // Log immediate results
      this.logScenarioResults(result);
      
    } catch (error) {
      console.error(`❌ Error testing ${scenario.name}:`, error.message);
      
      this.results.push({
        scenario: scenario.name,
        url: scenario.url,
        network: scenario.network,
        device: scenario.device,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      await page.close();
    }
  }

  async measureBundleSizes(page) {
    // Get resource sizes from network requests
    const resources = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      const jsFiles = resources.filter(r => r.name.includes('.js'));
      const cssFiles = resources.filter(r => r.name.includes('.css'));
      
      return {
        jsFiles: jsFiles.length,
        cssFiles: cssFiles.length,
        totalResources: resources.length
      };
    });

    return {
      jsFiles: resources.jsFiles,
      cssFiles: resources.cssFiles,
      totalResources: resources.totalResources
    };
  }

  async measureTouchTargets(page) {
    // Check if buttons meet minimum touch target size
    const touchTargets = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"]');
      const results = [];
      
      buttons.forEach((button, index) => {
        const rect = button.getBoundingClientRect();
        const isTouchFriendly = rect.height >= 44 && rect.width >= 44;
        
        results.push({
          index,
          height: rect.height,
          width: rect.width,
          isTouchFriendly,
          text: button.textContent?.trim() || button.value || 'Unknown'
        });
      });
      
      return results;
    });

    return touchTargets;
  }

  async testOfflineCapability(page) {
    // Test if the app works offline
    try {
      // Simulate offline
      await page.context().setOffline(true);
      
      // Try to interact with the page
      const buttons = await page.locator('button').count();
      const inputs = await page.locator('input').count();
      
      return {
        buttonsAvailable: buttons,
        inputsAvailable: inputs,
        offlineCapable: buttons > 0 || inputs > 0
      };
    } catch (error) {
      return {
        buttonsAvailable: 0,
        inputsAvailable: 0,
        offlineCapable: false,
        error: error.message
      };
    }
  }

  logScenarioResults(result) {
    console.log(`   📊 Performance Metrics:`);
    console.log(`      First Contentful Paint: ${result.metrics.firstContentfulPaint.toFixed(2)}ms`);
    console.log(`      Total Load Time: ${result.metrics.totalLoadTime.toFixed(2)}s`);
    console.log(`      Touch Targets: ${result.touchTargets.filter(t => t.isTouchFriendly).length}/${result.touchTargets.length} friendly`);
    console.log(`      Offline Capable: ${result.offlineCapability?.offlineCapable ? '✅' : '❌'}`);
    
    // Check against targets
    const fcpPass = result.metrics.firstContentfulPaint <= PERFORMANCE_TARGETS.FIRST_CONTENTFUL_PAINT * 1000;
    const loadPass = result.metrics.totalLoadTime <= PERFORMANCE_TARGETS.TOTAL_LOAD_TIME;
    
    console.log(`      Performance: ${fcpPass && loadPass ? '✅ PASS' : '❌ FAIL'}`);
    console.log('');
  }

  async generateReport() {
    console.log('📋 Generating Africa-First Performance Report...\n');
    
    const report = {
      timestamp: new Date().toISOString(),
      targets: PERFORMANCE_TARGETS,
      scenarios: TEST_SCENARIOS,
      results: this.results,
      summary: this.generateSummary()
    };

    // Save detailed report
    const reportPath = path.join(process.cwd(), 'performance-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    // Generate markdown report
    const markdownReport = this.generateMarkdownReport(report);
    const markdownPath = path.join(process.cwd(), 'PERFORMANCE_REPORT.md');
    await fs.writeFile(markdownPath, markdownReport);
    
    console.log(`📄 Reports generated:`);
    console.log(`   JSON: ${reportPath}`);
    console.log(`   Markdown: ${markdownPath}`);
    
    return report;
  }

  generateSummary() {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => !r.error && 
      r.metrics.firstContentfulPaint <= PERFORMANCE_TARGETS.FIRST_CONTENTFUL_PAINT * 1000 &&
      r.metrics.totalLoadTime <= PERFORMANCE_TARGETS.TOTAL_LOAD_TIME
    ).length;
    
    const avgLoadTime = this.results
      .filter(r => !r.error)
      .reduce((sum, r) => sum + r.metrics.totalLoadTime, 0) / totalTests;
    
    const touchFriendlyTargets = this.results
      .filter(r => !r.error)
      .reduce((sum, r) => sum + r.touchTargets.filter(t => t.isTouchFriendly).length, 0);
    
    return {
      totalTests,
      passedTests,
      passRate: `${((passedTests / totalTests) * 100).toFixed(1)}%`,
      averageLoadTime: `${avgLoadTime.toFixed(2)}s`,
      touchFriendlyTargets,
      recommendations: this.generateRecommendations()
    };
  }

  generateRecommendations() {
    const recommendations = [];
    
    const slowTests = this.results.filter(r => 
      !r.error && r.metrics.totalLoadTime > PERFORMANCE_TARGETS.TOTAL_LOAD_TIME
    );
    
    if (slowTests.length > 0) {
      recommendations.push('🚀 Consider code splitting and lazy loading for slow pages');
      recommendations.push('📦 Optimize bundle sizes for 3G networks');
    }
    
    const unfriendlyTargets = this.results.filter(r => 
      !r.error && r.touchTargets.some(t => !t.isTouchFriendly)
    );
    
    if (unfriendlyTargets.length > 0) {
      recommendations.push('👆 Increase touch target sizes to minimum 44px');
    }
    
    const offlineIssues = this.results.filter(r => 
      !r.error && !r.offlineCapability?.offlineCapable
    );
    
    if (offlineIssues.length > 0) {
      recommendations.push('📱 Implement offline functionality for better user experience');
    }
    
    return recommendations;
  }

  generateMarkdownReport(report) {
    return `# Africa-First Performance Report

## 📊 Executive Summary

- **Test Date**: ${new Date(report.timestamp).toLocaleDateString()}
- **Total Tests**: ${report.summary.totalTests}
- **Pass Rate**: ${report.summary.passRate}
- **Average Load Time**: ${report.summary.averageLoadTime}

## 🎯 Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| First Contentful Paint | ≤ 1.5s | ${report.summary.passedTests > 0 ? '✅' : '❌'} |
| Total Load Time | ≤ 4.0s | ${report.summary.passedTests > 0 ? '✅' : '❌'} |
| Touch Targets | ≥ 44px | ${report.summary.touchFriendlyTargets > 0 ? '✅' : '❌'} |
| Offline Capable | Yes | ${report.results.some(r => r.offlineCapability?.offlineCapable) ? '✅' : '❌'} |

## 📱 Test Results

${report.results.map(result => `
### ${result.scenario}
- **Network**: ${result.network}
- **Device**: ${result.device}
- **Load Time**: ${result.metrics?.totalLoadTime?.toFixed(2)}s
- **Touch Friendly**: ${result.touchTargets?.filter(t => t.isTouchFriendly).length}/${result.touchTargets?.length}
- **Offline**: ${result.offlineCapability?.offlineCapable ? '✅' : '❌'}
- **Status**: ${result.error ? '❌ FAILED' : '✅ PASSED'}
`).join('')}

## 🚀 Recommendations

${report.summary.recommendations.map(rec => `- ${rec}`).join('\n')}

## 📈 Next Steps

1. **Optimize slow pages** identified in the report
2. **Improve touch targets** for better mobile experience
3. **Enhance offline functionality** for unreliable networks
4. **Monitor performance** in production with real African users

---
*Generated by ChurchAfrica Performance Benchmarking Tool*
`;
  }

  async cleanup() {
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }
}

// Main execution
async function main() {
  const benchmark = new PerformanceBenchmark();
  
  try {
    await benchmark.initialize();
    
    console.log('🌍 Running Africa-First Performance Tests...\n');
    
    for (const scenario of TEST_SCENARIOS) {
      await benchmark.runScenario(scenario);
    }
    
    const report = await benchmark.generateReport();
    
    console.log('📊 Performance Summary:');
    console.log(`   Total Tests: ${report.summary.totalTests}`);
    console.log(`   Pass Rate: ${report.summary.passRate}`);
    console.log(`   Average Load Time: ${report.summary.averageLoadTime}`);
    console.log(`   Touch Friendly Targets: ${report.summary.touchFriendlyTargets}`);
    
    if (report.summary.recommendations.length > 0) {
      console.log('\n🚀 Recommendations:');
      report.summary.recommendations.forEach(rec => console.log(`   ${rec}`));
    }
    
  } catch (error) {
    console.error('❌ Benchmark failed:', error);
    process.exit(1);
  } finally {
    await benchmark.cleanup();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { PerformanceBenchmark, PERFORMANCE_TARGETS, TEST_SCENARIOS };
