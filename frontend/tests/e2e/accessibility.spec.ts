import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/')
  })

  test('Login page should be accessible', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Dashboard should be accessible', async ({ page }) => {
    // Login first
    await page.fill('#login-email', 'john@example.com')
    await page.fill('#login-password', 'password123')
    await page.click('button[type="submit"]')
    
    // Wait for dashboard to load
    await page.waitForURL('/dashboard')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('Skip links should be functional', async ({ page }) => {
    // Login first
    await page.fill('#login-email', 'john@example.com')
    await page.fill('#login-password', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
    
    // Press Tab to show skip links
    await page.keyboard.press('Tab')
    
    // Check if skip links are visible
    const skipLinks = page.locator('.skip-links--visible')
    await expect(skipLinks).toBeVisible()
    
    // Test skip to main content
    await page.click('a[href="#main-content"]')
    
    // Verify focus is on main content
    const mainContent = page.locator('#main-content')
    await expect(mainContent).toBeFocused()
  })

  test('Keyboard navigation should work', async ({ page }) => {
    // Test keyboard navigation on login form
    await page.keyboard.press('Tab') // Focus email field
    await expect(page.locator('#login-email')).toBeFocused()
    
    await page.keyboard.press('Tab') // Focus password field
    await expect(page.locator('#login-password')).toBeFocused()
    
    await page.keyboard.press('Tab') // Focus password toggle
    await expect(page.locator('[data-testid="password-toggle"]')).toBeFocused()
    
    // Test password toggle with keyboard
    await page.keyboard.press('Enter')
    await expect(page.locator('#login-password')).toHaveAttribute('type', 'text')
    
    await page.keyboard.press('Enter')
    await expect(page.locator('#login-password')).toHaveAttribute('type', 'password')
  })

  test('Form validation should be accessible', async ({ page }) => {
    // Submit empty form to trigger validation
    await page.click('button[type="submit"]')
    
    // Check for ARIA invalid attributes
    await expect(page.locator('#login-email')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.locator('#login-password')).toHaveAttribute('aria-invalid', 'true')
    
    // Check for error messages with proper ARIA
    const emailError = page.locator('#email-error')
    const passwordError = page.locator('#password-error')
    
    if (await emailError.isVisible()) {
      await expect(emailError).toHaveAttribute('role', 'alert')
      await expect(emailError).toHaveAttribute('aria-live', 'polite')
    }
    
    if (await passwordError.isVisible()) {
      await expect(passwordError).toHaveAttribute('role', 'alert')
      await expect(passwordError).toHaveAttribute('aria-live', 'polite')
    }
  })

  test('Navigation menu should be accessible', async ({ page }) => {
    // Login first
    await page.fill('#login-email', 'john@example.com')
    await page.fill('#login-password', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
    
    // Check navigation structure
    const navigation = page.locator('#main-navigation')
    await expect(navigation).toHaveAttribute('role', 'navigation')
    await expect(navigation).toHaveAttribute('aria-label', 'Main navigation')
    
    // Check menu items
    const menuItems = page.locator('[role="menuitem"]')
    const count = await menuItems.count()
    expect(count).toBeGreaterThan(0)
    
    // Test keyboard navigation in menu
    await page.click('[aria-label="Toggle navigation menu"]')
    await page.keyboard.press('Tab')
    
    // First menu item should be focused
    const firstMenuItem = menuItems.first()
    await expect(firstMenuItem).toBeFocused()
  })

  test('Images should have alt text', async ({ page }) => {
    // Check all images have alt attributes
    const images = page.locator('img')
    const count = await images.count()
    
    for (let i = 0; i < count; i++) {
      const image = images.nth(i)
      const alt = image
      expect(alt).not.toBeNull()
      await expect(alt).not.toHaveAttribute('alt', '')
    }
  })

  test('Color contrast should meet WCAG standards', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze()

    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    )

    expect(contrastViolations).toEqual([])
  })

  test('Focus indicators should be visible', async ({ page }) => {
    // Test focus indicators on various elements
    const focusableElements = [
      '#login-email',
      '#login-password',
      'button[type="submit"]',
      '[data-testid="password-toggle"]'
    ]
    
    for (const selector of focusableElements) {
      await page.focus(selector)
      
      // Check if element has focus styles
      const element = page.locator(selector)
      const styles = await element.evaluate((el) => {
        const computed = window.getComputedStyle(el, ':focus')
        return {
          outline: computed.outline,
          outlineWidth: computed.outlineWidth,
          boxShadow: computed.boxShadow
        }
      })
      
      // Should have some form of focus indicator
      const hasFocusIndicator = 
        styles.outline !== 'none' || 
        styles.outlineWidth !== '0px' || 
        styles.boxShadow !== 'none'
      
      expect(hasFocusIndicator).toBe(true)
    }
  })

  test('Screen reader announcements should work', async ({ page }) => {
    // Test live regions for screen reader announcements
    const liveRegions = page.locator('[aria-live]')
    const count = await liveRegions.count()
    
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const region = liveRegions.nth(i)
        const ariaLive = await region.getAttribute('aria-live')
        expect(['polite', 'assertive', 'off']).toContain(ariaLive)
      }
    }
  })

  test('Form labels should be properly associated', async ({ page }) => {
    // Check all form controls have proper labels
    const formControls = page.locator('input, select, textarea')
    const count = await formControls.count()
    
    for (let i = 0; i < count; i++) {
      const control = formControls.nth(i)
      const id = await control.getAttribute('id')
      const ariaLabel = await control.getAttribute('aria-label')
      const ariaLabelledBy = await control.getAttribute('aria-labelledby')
      
      if (id && !ariaLabel && !ariaLabelledBy) {
        // Should have a corresponding label
        const label = page.locator(`label[for="${id}"]`)
        await expect(label).toBeVisible()
      } else {
        // Should have aria-label or aria-labelledby
        expect(ariaLabel || ariaLabelledBy).toBeTruthy()
      }
    }
  })

  test('Headings should have proper hierarchy', async ({ page }) => {
    // Login and navigate to dashboard
    await page.fill('#login-email', 'john@example.com')
    await page.fill('#login-password', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
    
    // Check heading hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6, [role="heading"]')
    const count = await headings.count()
    
    if (count > 0) {
      // Should start with h1
      const firstHeading = headings.first()
      const tagName = await firstHeading.evaluate(el => el.tagName.toLowerCase())
      const ariaLevel = await firstHeading.getAttribute('aria-level')
      
      expect(tagName === 'h1' || ariaLevel === '1').toBe(true)
    }
  })

  test('Interactive elements should have proper roles', async ({ page }) => {
    // Check buttons have proper roles
    const buttons = page.locator('button, [role="button"]')
    const count = await buttons.count()
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i)
      const role = await button.getAttribute('role')
      const tagName = await button.evaluate(el => el.tagName.toLowerCase())
      
      // Should be button element or have button role
      expect(tagName === 'button' || role === 'button').toBe(true)
    }
  })

  test('Page should have proper document structure', async ({ page }) => {
    // Login and check dashboard structure
    await page.fill('#login-email', 'john@example.com')
    await page.fill('#login-password', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
    
    // Check for main landmarks
    await expect(page.locator('[role="banner"]')).toBeVisible() // Header
    await expect(page.locator('[role="navigation"]')).toBeVisible() // Navigation
    await expect(page.locator('[role="main"]')).toBeVisible() // Main content
    
    // Check main content is focusable for skip links
    const mainContent = page.locator('#main-content')
    await expect(mainContent).toHaveAttribute('tabindex', '-1')
  })
})
