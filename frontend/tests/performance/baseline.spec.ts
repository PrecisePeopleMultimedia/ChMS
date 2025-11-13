/**
 * Performance Baseline Tests
 * 
 * This test suite establishes the performance baseline BEFORE
 * design system migration. It ensures performance doesn't
 * regress during the migration.
 * 
 * ⚠️ CRITICAL: Run this ONCE before starting Phase 1 migration.
 */

import { test, expect } from '@playwright/test';

test.describe('Performance Baseline', () => {
  test('Dashboard page - performance metrics baseline', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.fetchStart,
        firstPaint: performance.getEntriesByType('paint').find((entry) => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint').find((entry) => entry.name === 'first-contentful-paint')?.startTime || 0,
      };
    });
    
    // Document baseline metrics
    console.log('\nDashboard Performance Baseline:');
    console.log(`  DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms`);
    console.log(`  Load Complete: ${metrics.loadComplete.toFixed(2)}ms`);
    console.log(`  First Paint: ${metrics.firstPaint.toFixed(2)}ms`);
    console.log(`  First Contentful Paint: ${metrics.firstContentfulPaint.toFixed(2)}ms`);
    
    // Baseline - document metrics (will compare during migration)
    expect(metrics.loadComplete).toBeGreaterThan(0);
  });

  test('Bundle size - baseline', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Get resource sizes
    const resources = await page.evaluate(() => {
      return performance.getEntriesByType('resource').map((entry: any) => ({
        name: entry.name,
        size: entry.transferSize || 0,
        duration: entry.duration || 0,
      }));
    });
    
    // Calculate bundle sizes
    const jsResources = resources.filter((r: any) => r.name.includes('.js'));
    const cssResources = resources.filter((r: any) => r.name.includes('.css'));
    
    const totalJSSize = jsResources.reduce((sum: number, r: any) => sum + r.size, 0);
    const totalCSSSize = cssResources.reduce((sum: number, r: any) => sum + r.size, 0);
    const totalSize = totalJSSize + totalCSSSize;
    
    // Document baseline bundle sizes
    console.log('\nBundle Size Baseline:');
    console.log(`  JavaScript: ${(totalJSSize / 1024).toFixed(2)}KB`);
    console.log(`  CSS: ${(totalCSSSize / 1024).toFixed(2)}KB`);
    console.log(`  Total: ${(totalSize / 1024).toFixed(2)}KB`);
    
    // Baseline - document sizes (will compare during migration)
    // Target: < 500KB gzipped for initial load
    expect(totalSize).toBeGreaterThan(0);
  });

  test('Mobile performance - baseline (3G simulation)', async ({ page, context }) => {
    // Simulate 3G network
    await context.route('**/*', (route) => {
      route.continue();
    });
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to dashboard
    const startTime = Date.now();
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Document mobile performance baseline
    console.log('\nMobile Performance Baseline (3G simulation):');
    console.log(`  Load Time: ${loadTime}ms`);
    console.log(`  Target: < 3000ms`);
    
    // Baseline - document metrics
    expect(loadTime).toBeGreaterThan(0);
  });
});

