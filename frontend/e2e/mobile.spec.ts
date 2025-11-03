import { test, expect, devices } from '@playwright/test'

// Test data
const testUser = {
  email: 'john@example.com',
  password: 'password123'
}

// Africa-first mobile testing - focusing on common devices in African markets
// Pixel 5 Tests
test.describe('Mobile Authentication - Pixel 5', () => {
  test.use(devices['Pixel 5'])

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

    test('should display mobile-optimized login form', async ({ page }) => {
      await page.goto('/login')

      // Check mobile layout
      await expect(page.locator('.modern-form-card')).toBeVisible()
      
      // Check touch-friendly button sizes
      const signInButton = page.locator('button:has-text("Sign In")')
      await expect(signInButton).toBeVisible()
      
      // Button should be large enough for touch (minimum 44px height)
      const buttonBox = await signInButton.boundingBox()
      expect(buttonBox?.height).toBeGreaterThanOrEqual(44)

      // Check input field sizes
      const emailInput = page.locator('input[type="email"]')
      const inputBox = await emailInput.boundingBox()
      expect(inputBox?.height).toBeGreaterThanOrEqual(44)

      // Check responsive design
      const viewport = page.viewportSize()
      if (viewport && viewport.width < 768) {
        // Mobile-specific checks
        await expect(page.locator('.w-full')).toBeVisible()
      }
    })

    test('should handle touch interactions correctly', async ({ page }) => {
      await page.goto('/login')

      // Test touch interactions
      await page.tap('input[type="email"]')
      await page.fill('input[type="email"]', testUser.email)

      await page.tap('input[type="password"]')
      await page.fill('input[type="password"]', testUser.password)

      // Test button tap
      await page.tap('button:has-text("Sign In")')

      // Should redirect to dashboard
      await expect(page).toHaveURL('/dashboard')
    })

    test('should display mobile-optimized dashboard', async ({ page }) => {
      // Login first
      await page.goto('/login')
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)
      await page.click('button:has-text("Sign In")')
      await expect(page).toHaveURL('/dashboard')

      // Check mobile dashboard layout
      await expect(page.locator('text=Welcome back')).toBeVisible()
      
      // Check responsive cards
      const profileCard = page.locator('text=Your Profile').locator('..')
      await expect(profileCard).toBeVisible()

      // Check mobile navigation
      const logoutButton = page.locator('button:has-text("Logout")')
      await expect(logoutButton).toBeVisible()
      
      // Button should be touch-friendly
      const buttonBox = await logoutButton.boundingBox()
      expect(buttonBox?.height).toBeGreaterThanOrEqual(44)
    })

    test('should handle mobile registration form', async ({ page }) => {
      await page.goto('/register')

      // Check mobile form layout
      await expect(page.locator('input[placeholder*="First"]')).toBeVisible()
      await expect(page.locator('input[placeholder*="Last"]')).toBeVisible()
      await expect(page.locator('input[type="email"]')).toBeVisible()

      // Test form filling on mobile
      await page.tap('input[placeholder*="First"]')
      await page.fill('input[placeholder*="First"]', 'Mobile')
      
      await page.tap('input[placeholder*="Last"]')
      await page.fill('input[placeholder*="Last"]', 'User')
      
      await page.tap('input[type="email"]')
      await page.fill('input[type="email"]', `mobile.${Date.now()}@example.com`)
      
      await page.tap('input[type="password"]')
      await page.fill('input[type="password"]', 'password123')
      
      await page.tap('input[placeholder*="Confirm"]')
      await page.fill('input[placeholder*="Confirm"]', 'password123')

      // Submit form
      await page.tap('button:has-text("Create Account")')

      // Should redirect to dashboard
      await expect(page).toHaveURL('/dashboard')
    })

    test('should handle mobile keyboard interactions', async ({ page }) => {
      await page.goto('/login')

      // Test keyboard navigation
      await page.focus('input[type="email"]')
      await page.keyboard.type(testUser.email)
      
      // Tab to next field
      await page.keyboard.press('Tab')
      await page.keyboard.type(testUser.password)
      
      // Submit with Enter
      await page.keyboard.press('Enter')

      // Should redirect to dashboard
      await expect(page).toHaveURL('/dashboard')
    })

    test('should display error messages properly on mobile', async ({ page }) => {
      await page.goto('/login')

      // Try invalid login
      await page.fill('input[type="email"]', 'invalid@example.com')
      await page.fill('input[type="password"]', 'wrongpassword')
      await page.tap('button:has-text("Sign In")')

      // Error should be visible and readable on mobile
      const errorAlert = page.locator('.q-banner, .modern-alert')
      await expect(errorAlert).toBeVisible()
      
      // Error should not be cut off on mobile
      const errorBox = await errorAlert.boundingBox()
      const viewport = page.viewportSize()
      if (viewport && errorBox) {
        expect(errorBox.width).toBeLessThanOrEqual(viewport.width)
      }
    })

    test('should handle mobile viewport changes', async ({ page }) => {
      await page.goto('/login')

      // Test portrait orientation
      await page.setViewportSize({ width: 375, height: 667 })
      await expect(page.locator('.modern-form-card')).toBeVisible()

      // Test landscape orientation (if supported)
      await page.setViewportSize({ width: 667, height: 375 })
      await expect(page.locator('.modern-form-card')).toBeVisible()

      // Form should still be usable
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)
      await page.tap('button:has-text("Sign In")')
      
      await expect(page).toHaveURL('/dashboard')
    })

    test('should handle slow network conditions', async ({ page }) => {
      // Simulate slow 3G connection (Africa-first consideration)
      await page.route('**/*', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 100)) // Add delay
        await route.continue()
      })

      await page.goto('/login')

      // Form should still be responsive
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)
      await page.tap('button:has-text("Sign In")')

      // Should show loading state
      await expect(page.locator('text=Signing in, .q-spinner, .animate-pulse')).toBeVisible()

      // Should eventually succeed
      await expect(page).toHaveURL('/dashboard', { timeout: 10000 })
    })

    test('should work with mobile browser features', async ({ page }) => {
      await page.goto('/login')

      // Test autofill/autocomplete
      const emailInput = page.locator('input[type="email"]')
      await expect(emailInput).toHaveAttribute('type', 'email')
      
      const passwordInput = page.locator('input[type="password"]')
      await expect(passwordInput).toHaveAttribute('type', 'password')

      // Test form validation
      await page.tap('button:has-text("Sign In")')
      
      // Button should be disabled or show validation
      const signInButton = page.locator('button:has-text("Sign In")')
      await expect(signInButton).toBeDisabled()
    })

    test('should handle mobile-specific gestures', async ({ page }) => {
      await page.goto('/dashboard')
      
      // Login first
      await page.goto('/login')
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)
      await page.tap('button:has-text("Sign In")')
      await expect(page).toHaveURL('/dashboard')

      // Test scroll behavior on mobile
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })

      // Content should still be accessible
      await expect(page.locator('text=System Status')).toBeVisible()

      // Test pull-to-refresh (if implemented)
      // This would be a custom implementation
    })

    test('should maintain performance on mobile', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/login')
      
      const loadTime = Date.now() - startTime
      
      // Should load within 3 seconds (Africa-first requirement)
      expect(loadTime).toBeLessThan(3000)

      // Check for performance metrics
      const performanceEntries = await page.evaluate(() => {
        return JSON.stringify(performance.getEntriesByType('navigation'))
      })
      
      const entries = JSON.parse(performanceEntries)
      if (entries.length > 0) {
        const entry = entries[0]
        // DOM content should load quickly
        expect(entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart).toBeLessThan(1000)
      }
    })
  })

// Additional mobile-specific tests
test.describe('Mobile-Specific Features', () => {
  test.use(devices['Pixel 5'])

  test('should handle mobile keyboard types correctly', async ({ page }) => {
    await page.goto('/register')

    // Email input should trigger email keyboard
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toHaveAttribute('type', 'email')

    // Phone input (if present) should trigger numeric keyboard
    // This would be tested if we had phone number fields
  })

  test('should handle mobile form validation', async ({ page }) => {
    await page.goto('/register')

    // Test required field validation
    await page.tap('button:has-text("Create Account")')
    
    // Should show validation errors or disable button
    const createButton = page.locator('button:has-text("Create Account")')
    await expect(createButton).toBeDisabled()
  })

  test('should work in mobile browser private/incognito mode', async ({ page, context }) => {
    // This test ensures the app works without localStorage persistence
    await page.goto('/login')
    
    await page.fill('input[type="email"]', testUser.email)
    await page.fill('input[type="password"]', testUser.password)
    await page.tap('button:has-text("Sign In")')
    
    await expect(page).toHaveURL('/dashboard')
    
    // Logout should work
    await page.tap('button:has-text("Logout")')
    await expect(page).toHaveURL('/login')
  })
})
