import { test, expect } from '@playwright/test'
import { loginUser, logoutUser, setupMobileViewport, simulateSlowNetwork, validateTouchFriendlyUI, validateAccessibility } from '../utils/test-helpers'
import { setupTestEnvironment, cleanupTestData } from '../utils/database-helpers'
import { userFixtures, apiResponseFixtures, errorFixtures } from '../fixtures/test-data'
import TEST_CONFIG from '../utils/test-config'

/**
 * Authentication Regression Test Suite
 * 
 * Comprehensive tests to ensure authentication functionality doesn't regress
 * when new features are added. Covers all authentication scenarios including
 * edge cases, error handling, and mobile responsiveness.
 */

test.describe('Authentication Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setup test environment with clean data
    await setupTestEnvironment(page)
    await page.goto('/')
  })

  test.afterEach(async ({ page }) => {
    // Clean up after each test
    await cleanupTestData(page)
  })

  test.describe('Login Flow Regression', () => {
    test('should display login form correctly', async ({ page }) => {
      await page.goto('/login')

      // Check page title and branding
      await expect(page.locator('h1')).toContainText('ChurchAfrica')
      await expect(page.locator('text=Welcome to ChurchAfrica')).toBeVisible()
      await expect(page.locator('text=Sign in to your account')).toBeVisible()

      // Check form elements
      await expect(page.locator('input[type="email"]')).toBeVisible()
      await expect(page.locator('input[type="password"]')).toBeVisible()
      await expect(page.locator('button:has-text("Sign In")')).toBeVisible()
      await expect(page.locator('button:has-text("Continue with Google")')).toBeVisible()

      // Check navigation links
      await expect(page.locator('text=Don\'t have an account?')).toBeVisible()
      await expect(page.locator('a:has-text("Sign up")')).toBeVisible()
    })

    test('should login successfully with valid credentials', async ({ page }) => {
      const user = await loginUser(page, 'member')
      
      // Should redirect to dashboard
      await expect(page).toHaveURL('/dashboard')
      
      // Check dashboard content
      await expect(page.locator('text=Welcome back')).toBeVisible()
      await expect(page.locator('text=ChurchAfrica Dashboard')).toBeVisible()
      await expect(page.locator('button:has-text("Logout")')).toBeVisible()
    })

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/login')

      // Fill with invalid credentials
      await page.fill('input[type="email"]', 'invalid@example.com')
      await page.fill('input[type="password"]', 'wrongpassword')

      // Submit form
      await page.click('button:has-text("Sign In")')

      // Should show error message
      await expect(page.locator('.q-banner, .modern-alert')).toBeVisible()
      await expect(page.locator('text=Invalid credentials')).toBeVisible()

      // Should stay on login page
      await expect(page).toHaveURL('/login')
    })

    test('should show validation errors for empty fields', async ({ page }) => {
      await page.goto('/login')

      // Try to submit empty form
      await page.click('button:has-text("Sign In")')

      // Should show validation errors or disable button
      const signInButton = page.locator('button:has-text("Sign In")')
      await expect(signInButton).toBeDisabled()
    })

    test('should show loading state during login', async ({ page }) => {
      await page.goto('/login')

      // Fill form
      await page.fill('input[type="email"]', userFixtures.member.email)
      await page.fill('input[type="password"]', userFixtures.member.password)

      // Submit and check loading state
      await page.click('button:has-text("Sign In")')
      
      // Should show loading state (spinner or loading text)
      await expect(page.locator('text=Signing in, .q-spinner, .animate-pulse')).toBeVisible()
    })

    test('should handle network errors gracefully', async ({ page }) => {
      await page.goto('/login')

      // Mock network error
      await page.route('**/api/auth/login', async route => {
        await route.abort('failed')
      })

      await page.fill('input[type="email"]', userFixtures.member.email)
      await page.fill('input[type="password"]', userFixtures.member.password)
      await page.click('button:has-text("Sign In")')

      // Should show network error message
      await expect(page.locator('text=Network error, text=Connection failed')).toBeVisible()
    })

    test('should handle server errors gracefully', async ({ page }) => {
      await page.goto('/login')

      // Mock server error
      await page.route('**/api/auth/login', async route => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal server error' })
        })
      })

      await page.fill('input[type="email"]', userFixtures.member.email)
      await page.fill('input[type="password"]', userFixtures.member.password)
      await page.click('button:has-text("Sign In")')

      // Should show server error message
      await expect(page.locator('text=Server error, text=Something went wrong')).toBeVisible()
    })

    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('/login')

      // Tab to email input
      await page.keyboard.press('Tab')
      const emailInput = page.locator('input[type="email"]')
      await expect(emailInput).toBeFocused()

      // Type email
      await page.keyboard.type(userFixtures.member.email)

      // Tab to password input
      await page.keyboard.press('Tab')
      const passwordInput = page.locator('input[type="password"]')
      await expect(passwordInput).toBeFocused()

      // Type password
      await page.keyboard.type(userFixtures.member.password)

      // Tab to submit button
      await page.keyboard.press('Tab')
      const submitButton = page.locator('button:has-text("Sign In")')
      await expect(submitButton).toBeFocused()

      // Press Enter to submit
      await page.keyboard.press('Enter')

      // Should redirect to dashboard
      await expect(page).toHaveURL('/dashboard')
    })

    test('should work on mobile devices', async ({ page }) => {
      await setupMobileViewport(page, 'pixel5')
      await page.goto('/login')

      // Check mobile layout
      await expect(page.locator('.modern-form-card')).toBeVisible()
      
      // Check touch-friendly button sizes
      await validateTouchFriendlyUI(page, 'button:has-text("Sign In")')
      await validateTouchFriendlyUI(page, 'input[type="email"]')

      // Test touch interactions
      await page.tap('input[type="email"]')
      await page.fill('input[type="email"]', userFixtures.member.email)

      await page.tap('input[type="password"]')
      await page.fill('input[type="password"]', userFixtures.member.password)

      // Test button tap
      await page.tap('button:has-text("Sign In")')

      // Should redirect to dashboard
      await expect(page).toHaveURL('/dashboard')
    })

    test('should work with slow network conditions', async ({ page }) => {
      await simulateSlowNetwork(page, 200) // 200ms delay
      await page.goto('/login')

      // Form should still be responsive
      await page.fill('input[type="email"]', userFixtures.member.email)
      await page.fill('input[type="password"]', userFixtures.member.password)
      await page.click('button:has-text("Sign In")')

      // Should show loading state
      await expect(page.locator('text=Signing in, .q-spinner, .animate-pulse')).toBeVisible()

      // Should eventually succeed
      await expect(page).toHaveURL('/dashboard', { timeout: TEST_CONFIG.timeouts.navigation })
    })

    test('should maintain accessibility standards', async ({ page }) => {
      await page.goto('/login')
      await validateAccessibility(page)
    })
  })

  test.describe('Registration Flow Regression', () => {
    test('should display registration form correctly', async ({ page }) => {
      await page.goto('/register')

      // Check page title and branding
      await expect(page.locator('text=Create Your Account')).toBeVisible()
      await expect(page.locator('text=Join ChurchAfrica today')).toBeVisible()

      // Check form elements
      await expect(page.locator('input[placeholder*="First"]')).toBeVisible()
      await expect(page.locator('input[placeholder*="Last"]')).toBeVisible()
      await expect(page.locator('input[type="email"]')).toBeVisible()
      await expect(page.locator('input[type="password"]').first()).toBeVisible()
      await expect(page.locator('input[placeholder*="Confirm"]')).toBeVisible()
      await expect(page.locator('button:has-text("Create Account")')).toBeVisible()

      // Check navigation links
      await expect(page.locator('text=Already have an account?')).toBeVisible()
      await expect(page.locator('a:has-text("Sign in")')).toBeVisible()
    })

    test('should register successfully with valid data', async ({ page }) => {
      await page.goto('/register')

      const newUser = {
        firstName: 'New',
        lastName: 'User',
        email: `new.user.${Date.now()}@example.com`,
        password: 'newpassword123'
      }

      // Fill registration form
      await page.fill('input[placeholder*="First"]', newUser.firstName)
      await page.fill('input[placeholder*="Last"]', newUser.lastName)
      await page.fill('input[type="email"]', newUser.email)
      await page.fill('input[type="password"]', newUser.password)
      await page.fill('input[placeholder*="Confirm"]', newUser.password)

      // Submit form
      await page.click('button:has-text("Create Account")')

      // Should redirect to dashboard
      await expect(page).toHaveURL('/dashboard')

      // Check dashboard shows new user
      await expect(page.locator(`text=${newUser.firstName}`)).toBeVisible()
    })

    test('should show error for mismatched passwords', async ({ page }) => {
      await page.goto('/register')

      // Fill form with mismatched passwords
      await page.fill('input[placeholder*="First"]', 'Test')
      await page.fill('input[placeholder*="Last"]', 'User')
      await page.fill('input[type="email"]', 'test@example.com')
      await page.fill('input[type="password"]', 'password123')
      await page.fill('input[placeholder*="Confirm"]', 'differentpassword')

      // Submit form
      await page.click('button:has-text("Create Account")')

      // Should show validation error
      await expect(page.locator('text=Passwords do not match, text=Password confirmation')).toBeVisible()
    })

    test('should show error for existing email', async ({ page }) => {
      await page.goto('/register')

      // Fill form with existing email
      await page.fill('input[placeholder*="First"]', 'Test')
      await page.fill('input[placeholder*="Last"]', 'User')
      await page.fill('input[type="email"]', userFixtures.member.email) // Existing email
      await page.fill('input[type="password"]', 'password123')
      await page.fill('input[placeholder*="Confirm"]', 'password123')

      // Submit form
      await page.click('button:has-text("Create Account")')

      // Should show error message
      await expect(page.locator('text=Email already exists, text=already taken')).toBeVisible()
    })

    test('should work on mobile devices', async ({ page }) => {
      await setupMobileViewport(page, 'pixel5')
      await page.goto('/register')

      // Check mobile layout
      await expect(page.locator('.modern-form-card')).toBeVisible()

      // Check touch-friendly elements
      await validateTouchFriendlyUI(page, 'button:has-text("Create Account")')
      await validateTouchFriendlyUI(page, 'input[type="email"]')

      // Test form submission on mobile
      const newUser = {
        firstName: 'Mobile',
        lastName: 'User',
        email: `mobile.user.${Date.now()}@example.com`,
        password: 'mobilepassword123'
      }

      await page.tap('input[placeholder*="First"]')
      await page.fill('input[placeholder*="First"]', newUser.firstName)

      await page.tap('input[placeholder*="Last"]')
      await page.fill('input[placeholder*="Last"]', newUser.lastName)

      await page.tap('input[type="email"]')
      await page.fill('input[type="email"]', newUser.email)

      await page.tap('input[type="password"]')
      await page.fill('input[type="password"]', newUser.password)

      await page.tap('input[placeholder*="Confirm"]')
      await page.fill('input[placeholder*="Confirm"]', newUser.password)

      await page.tap('button:has-text("Create Account")')

      // Should redirect to dashboard
      await expect(page).toHaveURL('/dashboard')
    })
  })

  test.describe('Dashboard and Logout Regression', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each dashboard test
      await loginUser(page, 'member')
    })

    test('should display dashboard correctly', async ({ page }) => {
      // Check dashboard elements
      await expect(page.locator('text=Welcome back')).toBeVisible()
      await expect(page.locator('text=ChurchAfrica Dashboard')).toBeVisible()

      // Check user profile card
      await expect(page.locator('text=Your Profile')).toBeVisible()
      await expect(page.locator(`text=${userFixtures.member.email}`)).toBeVisible()

      // Check quick actions
      await expect(page.locator('text=Quick Actions')).toBeVisible()
      await expect(page.locator('button:has-text("Edit Profile")')).toBeVisible()
      await expect(page.locator('button:has-text("Settings")')).toBeVisible()

      // Check system status
      await expect(page.locator('text=System Status')).toBeVisible()
      await expect(page.locator('text=Backend Connected')).toBeVisible()
    })

    test('should logout successfully', async ({ page }) => {
      // Click logout button
      await page.click('button:has-text("Logout")')

      // Should redirect to login page
      await expect(page).toHaveURL('/login')

      // Should show success message
      await expect(page.locator('text=Logged out successfully')).toBeVisible()

      // Should not be able to access dashboard
      await page.goto('/dashboard')
      await expect(page).toHaveURL('/login')
    })

    test('should show loading state during logout', async ({ page }) => {
      // Click logout and check loading state
      await page.click('button:has-text("Logout")')

      // Should show loading state briefly
      await expect(page.locator('.q-spinner, text=Logging out')).toBeVisible()
    })

    test('should maintain session across page refreshes', async ({ page }) => {
      // Refresh the page
      await page.reload()

      // Should still be logged in
      await expect(page).toHaveURL('/dashboard')
      await expect(page.locator('text=Welcome')).toBeVisible()
      await expect(page.locator('button:has-text("Logout")')).toBeVisible()
    })

    test('should handle session expiry gracefully', async ({ page }) => {
      // Mock session expiry
      await page.route('**/api/**', async (route) => {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Session expired' })
        })
      })

      // Try to navigate to a protected page
      await page.goto('/dashboard')

      // Should redirect to login
      await expect(page).toHaveURL('/login')
      await expect(page.locator('text=Session expired, text=Please log in again')).toBeVisible()
    })
  })
})
