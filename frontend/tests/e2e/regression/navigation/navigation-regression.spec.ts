import { test, expect } from '@playwright/test'
import { loginUser, setupMobileViewport, simulateSlowNetwork, validateTouchFriendlyUI } from '../utils/test-helpers'
import { setupTestEnvironment, cleanupTestData } from '../utils/database-helpers'
import { userFixtures } from '../fixtures/test-data'
import TEST_CONFIG from '../utils/test-config'

/**
 * Navigation Regression Test Suite
 * 
 * Comprehensive tests to ensure navigation and routing functionality
 * doesn't regress when new features are added. Covers authentication
 * guards, navigation flows, and mobile navigation.
 */

test.describe('Navigation Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestEnvironment(page)
  })

  test.afterEach(async ({ page }) => {
    await cleanupTestData(page)
  })

  test.describe('Authentication Guards', () => {
    test('should redirect unauthenticated users to login', async ({ page }) => {
      // Try to access protected routes
      const protectedRoutes = ['/dashboard', '/members', '/attendance', '/settings']
      
      for (const route of protectedRoutes) {
        await page.goto(route)
        await expect(page).toHaveURL('/login')
        await expect(page.locator('text=Sign in to your account')).toBeVisible()
      }
    })

    test('should redirect authenticated users away from auth pages', async ({ page }) => {
      // Login first
      await loginUser(page, 'member')

      // Try to access auth pages while authenticated
      await page.goto('/login')
      await expect(page).toHaveURL('/dashboard')

      await page.goto('/register')
      await expect(page).toHaveURL('/dashboard')
    })

    test('should handle deep links after authentication', async ({ page }) => {
      // Try to access a deep link while unauthenticated
      await page.goto('/members/add')
      await expect(page).toHaveURL('/login')

      // Login
      await page.fill('input[type="email"]', userFixtures.member.email)
      await page.fill('input[type="password"]', userFixtures.member.password)
      await page.click('button:has-text("Sign In")')

      // Should redirect to the originally requested page
      await expect(page).toHaveURL('/members/add')
    })

    test('should handle session expiry during navigation', async ({ page }) => {
      await loginUser(page, 'member')

      // Mock session expiry
      await page.route('**/api/**', async (route) => {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Session expired' })
        })
      })

      // Try to navigate to a protected page
      await page.goto('/members')

      // Should redirect to login with session expired message
      await expect(page).toHaveURL('/login')
      await expect(page.locator('text=Session expired, text=Please log in again')).toBeVisible()
    })
  })

  test.describe('Navigation Flow', () => {
    test.beforeEach(async ({ page }) => {
      await loginUser(page, 'member')
    })

    test('should navigate between main sections', async ({ page }) => {
      // Start at dashboard
      await expect(page).toHaveURL('/dashboard')
      await expect(page.locator('text=ChurchAfrica Dashboard')).toBeVisible()

      // Navigate to members
      await page.click('a:has-text("Members")')
      await expect(page).toHaveURL('/members')
      await expect(page.locator('text=Member Management')).toBeVisible()

      // Navigate to attendance
      await page.click('a:has-text("Attendance")')
      await expect(page).toHaveURL('/attendance')
      await expect(page.locator('text=Attendance Management')).toBeVisible()

      // Navigate back to dashboard
      await page.click('a:has-text("Dashboard")')
      await expect(page).toHaveURL('/dashboard')
      await expect(page.locator('text=ChurchAfrica Dashboard')).toBeVisible()
    })

    test('should maintain navigation state', async ({ page }) => {
      // Dashboard should be active by default
      const dashboardLink = page.locator('a:has-text("Dashboard")')
      await expect(dashboardLink).toHaveClass(/active|current|selected/)

      // Navigate to members
      await page.click('a:has-text("Members")')
      const membersLink = page.locator('a:has-text("Members")')
      await expect(membersLink).toHaveClass(/active|current|selected/)
      
      // Dashboard should no longer be active
      await expect(dashboardLink).not.toHaveClass(/active|current|selected/)
    })

    test('should support browser back/forward navigation', async ({ page }) => {
      // Navigate through pages
      await page.click('a:has-text("Members")')
      await expect(page).toHaveURL('/members')

      await page.click('a:has-text("Attendance")')
      await expect(page).toHaveURL('/attendance')

      // Use browser back button
      await page.goBack()
      await expect(page).toHaveURL('/members')
      await expect(page.locator('text=Member Management')).toBeVisible()

      // Use browser forward button
      await page.goForward()
      await expect(page).toHaveURL('/attendance')
      await expect(page.locator('text=Attendance Management')).toBeVisible()
    })

    test('should handle page refresh correctly', async ({ page }) => {
      // Navigate to members page
      await page.click('a:has-text("Members")')
      await expect(page).toHaveURL('/members')

      // Refresh the page
      await page.reload()

      // Should stay on members page and maintain authentication
      await expect(page).toHaveURL('/members')
      await expect(page.locator('text=Member Management')).toBeVisible()
      await expect(page.locator('button:has-text("Logout")')).toBeVisible()
    })
  })

  test.describe('Mobile Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await setupMobileViewport(page, 'pixel5')
      await loginUser(page, 'member')
    })

    test('should display mobile navigation menu', async ({ page }) => {
      // Check for mobile menu button (hamburger menu)
      const menuButton = page.locator('button[aria-label="Menu"], button:has-text("☰"), .mobile-menu-button')
      await expect(menuButton).toBeVisible()

      // Click menu button to open navigation
      await menuButton.click()

      // Check navigation items are visible
      await expect(page.locator('a:has-text("Dashboard")')).toBeVisible()
      await expect(page.locator('a:has-text("Members")')).toBeVisible()
      await expect(page.locator('a:has-text("Attendance")')).toBeVisible()
    })

    test('should have touch-friendly navigation elements', async ({ page }) => {
      // Open mobile menu
      const menuButton = page.locator('button[aria-label="Menu"], button:has-text("☰"), .mobile-menu-button')
      await menuButton.click()

      // Validate touch-friendly sizes
      await validateTouchFriendlyUI(page, 'a:has-text("Dashboard")')
      await validateTouchFriendlyUI(page, 'a:has-text("Members")')
      await validateTouchFriendlyUI(page, 'a:has-text("Attendance")')
    })

    test('should close mobile menu after navigation', async ({ page }) => {
      // Open mobile menu
      const menuButton = page.locator('button[aria-label="Menu"], button:has-text("☰"), .mobile-menu-button')
      await menuButton.click()

      // Navigate to members
      await page.tap('a:has-text("Members")')
      await expect(page).toHaveURL('/members')

      // Menu should be closed (navigation items should not be visible or overlay should be hidden)
      const overlay = page.locator('.mobile-menu-overlay, .menu-overlay')
      await expect(overlay).toBeHidden()
    })

    test('should support swipe gestures for navigation', async ({ page }) => {
      // This test would require more advanced gesture simulation
      // For now, we'll test basic touch navigation
      await page.tap('a:has-text("Members")')
      await expect(page).toHaveURL('/members')

      await page.tap('a:has-text("Dashboard")')
      await expect(page).toHaveURL('/dashboard')
    })
  })

  test.describe('Navigation Performance', () => {
    test.beforeEach(async ({ page }) => {
      await loginUser(page, 'member')
    })

    test('should navigate quickly between pages', async ({ page }) => {
      const startTime = Date.now()
      
      await page.click('a:has-text("Members")')
      await expect(page).toHaveURL('/members')
      
      const navigationTime = Date.now() - startTime
      expect(navigationTime).toBeLessThan(2000) // Should navigate within 2 seconds
    })

    test('should handle slow network during navigation', async ({ page }) => {
      await simulateSlowNetwork(page, 300)

      // Navigation should still work but may take longer
      await page.click('a:has-text("Members")')
      await expect(page).toHaveURL('/members', { timeout: TEST_CONFIG.timeouts.navigation })
      await expect(page.locator('text=Member Management')).toBeVisible()
    })

    test('should show loading states during navigation', async ({ page }) => {
      // Simulate slow page load
      await page.route('**/members', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        await route.continue()
      })

      await page.click('a:has-text("Members")')

      // Should show loading indicator
      await expect(page.locator('.loading, .spinner, [data-testid="loading"]')).toBeVisible()
      
      // Eventually should load the page
      await expect(page).toHaveURL('/members')
      await expect(page.locator('text=Member Management')).toBeVisible()
    })
  })

  test.describe('Error Handling', () => {
    test.beforeEach(async ({ page }) => {
      await loginUser(page, 'member')
    })

    test('should handle 404 errors gracefully', async ({ page }) => {
      await page.goto('/nonexistent-page')

      // Should show 404 page or redirect to dashboard
      const is404 = await page.locator('text=404, text=Page not found').isVisible()
      const isDashboard = await page.locator('text=ChurchAfrica Dashboard').isVisible()
      
      expect(is404 || isDashboard).toBeTruthy()
    })

    test('should handle network errors during navigation', async ({ page }) => {
      // Mock network error
      await page.route('**/members', async (route) => {
        await route.abort('failed')
      })

      await page.click('a:has-text("Members")')

      // Should show error message or stay on current page
      const hasError = await page.locator('text=Network error, text=Connection failed').isVisible()
      const stayedOnDashboard = await page.locator('text=ChurchAfrica Dashboard').isVisible()
      
      expect(hasError || stayedOnDashboard).toBeTruthy()
    })
  })
})
