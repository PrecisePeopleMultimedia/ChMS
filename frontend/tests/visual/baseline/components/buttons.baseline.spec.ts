/**
 * Button Components - Visual Baseline
 * 
 * This test captures baseline screenshots of button components
 * BEFORE any design system migration. These screenshots will be
 * used to compare against the new implementation.
 * 
 * ⚠️ CRITICAL: Run this ONCE before starting Phase 1 migration.
 */

import { test, expect } from '@playwright/test';

test.describe('Button Components - Visual Baseline', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a test page with buttons
    // TODO: Create a test component showcase page
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
  });

  test('Button variants - baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          transition-duration: 0s !important;
        }
      `
    });
    
    // Find button container or create test page
    // For now, capture any buttons on the page
    const buttonContainer = page.locator('button').first();
    
    if (await buttonContainer.count() > 0) {
      await expect(buttonContainer).toHaveScreenshot('button-variants-baseline.png', {
        animations: 'disabled',
        maxDiffPixels: 0
      });
    } else {
      // Skip if no buttons found (will need test page)
      test.skip();
    }
  });

  test('Button states - baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          transition-duration: 0s !important;
        }
      `
    });
    
    const button = page.locator('button').first();
    
    if (await button.count() > 0) {
      // Default state
      await expect(button).toHaveScreenshot('button-default-baseline.png', {
        animations: 'disabled',
        maxDiffPixels: 0
      });
      
      // Hover state
      await button.hover();
      await page.waitForTimeout(100);
      await expect(button).toHaveScreenshot('button-hover-baseline.png', {
        animations: 'disabled',
        maxDiffPixels: 0
      });
      
      // Focus state
      await button.focus();
      await page.waitForTimeout(100);
      await expect(button).toHaveScreenshot('button-focus-baseline.png', {
        animations: 'disabled',
        maxDiffPixels: 0
      });
    } else {
      test.skip();
    }
  });
});

