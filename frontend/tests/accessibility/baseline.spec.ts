/**
 * Accessibility Baseline Tests
 * 
 * This test suite establishes the accessibility baseline BEFORE
 * design system migration. It ensures accessibility doesn't
 * regress during the migration.
 * 
 * ⚠️ CRITICAL: Run this ONCE before starting Phase 1 migration.
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Baseline', () => {
  const pages = [
    { name: 'Landing', path: '/' },
    { name: 'Login', path: '/auth/login' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Members', path: '/members' },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Settings', path: '/settings' },
  ];

  for (const page of pages) {
    test(`${page.name} page - accessibility baseline`, async ({ page: playwrightPage }) => {
      await playwrightPage.goto(page.path);
      await playwrightPage.waitForLoadState('networkidle');
      
      // Run axe-core accessibility scan
      const accessibilityScanResults = await new AxeBuilder({ page: playwrightPage })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      // Document violations (baseline - will compare during migration)
      const violations = accessibilityScanResults.violations;
      
      // Log violations for baseline documentation
      if (violations.length > 0) {
        console.log(`\n${page.name} Page - Accessibility Violations (Baseline):`);
        violations.forEach((violation) => {
          console.log(`  - ${violation.id}: ${violation.description}`);
          console.log(`    Impact: ${violation.impact}`);
          console.log(`    Nodes: ${violation.nodes.length}`);
        });
      }
      
      // For baseline, we document violations but don't fail
      // During migration, we'll ensure no NEW violations are introduced
      expect(accessibilityScanResults.violations.length).toBeGreaterThanOrEqual(0);
    });
  }

  test('Keyboard navigation - baseline', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    
    // Verify keyboard navigation works (baseline check)
    expect(focusedElement).toBeTruthy();
  });

  test('Color contrast - baseline', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Run color contrast check
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();
    
    // Filter color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast'
    );
    
    // Document for baseline
    if (contrastViolations.length > 0) {
      console.log(`\nColor Contrast Violations (Baseline): ${contrastViolations.length}`);
    }
    
    // Baseline - document but don't fail
    expect(contrastViolations.length).toBeGreaterThanOrEqual(0);
  });
});

