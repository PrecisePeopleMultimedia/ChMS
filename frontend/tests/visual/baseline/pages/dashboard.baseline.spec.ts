/**
 * Dashboard Page - Visual Baseline
 * 
 * This test captures baseline screenshots of the dashboard page
 * BEFORE any design system migration. These screenshots will be
 * used to compare against the new implementation.
 * 
 * ⚠️ CRITICAL: Run this ONCE before starting Phase 1 migration.
 * Do NOT update these screenshots during migration - they are
 * the baseline for comparison.
 */

import { test, expect } from '@playwright/test';

test.describe('Dashboard Page - Visual Baseline', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard (assumes user is logged in)
    // TODO: Set up authentication state for testing
    await page.goto('/dashboard');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations to complete
    await page.waitForTimeout(500);
  });

  test('Dashboard layout - desktop baseline', async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Disable animations for consistent screenshots
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          transition-duration: 0s !important;
        }
      `
    });
    
    // Wait for content to render
    await page.waitForSelector('[data-testid="dashboard"]', { timeout: 10000 }).catch(() => {
      // If testid doesn't exist, wait for any dashboard content
      return page.waitForSelector('.dashboard, [class*="dashboard"]', { timeout: 10000 });
    });
    
    // Capture full page screenshot
    await expect(page).toHaveScreenshot('dashboard-desktop-baseline.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 0 // Strict comparison
    });
  });

  test('Dashboard layout - tablet baseline', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          transition-duration: 0s !important;
        }
      `
    });
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('dashboard-tablet-baseline.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 0
    });
  });

  test('Dashboard layout - mobile baseline', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          transition-duration: 0s !important;
        }
      `
    });
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('dashboard-mobile-baseline.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 0
    });
  });
});

