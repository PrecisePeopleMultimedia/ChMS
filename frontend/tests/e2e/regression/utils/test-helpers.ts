import { Page, expect } from '@playwright/test'

/**
 * Regression Test Utilities
 * 
 * Shared utilities for regression testing to ensure consistency
 * and reduce code duplication across test suites.
 */

// Test user data
export const TEST_USERS = {
  admin: {
    email: 'admin@example.com',
    password: 'password123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  staff: {
    email: 'staff@example.com', 
    password: 'password123',
    firstName: 'Staff',
    lastName: 'User',
    role: 'staff'
  },
  member: {
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    role: 'member'
  }
}

// Test organization data
export const TEST_ORGANIZATION = {
  name: 'Test Church',
  email: 'admin@testchurch.com',
  phone: '+234-123-456-7890',
  address: '123 Test Street, Lagos, Nigeria',
  timezone: 'Africa/Lagos'
}

/**
 * Login helper for regression tests
 */
export async function loginUser(page: Page, userType: keyof typeof TEST_USERS = 'member') {
  const user = TEST_USERS[userType]
  
  await page.goto('/login')
  await page.fill('input[type="email"]', user.email)
  await page.fill('input[type="password"]', user.password)
  await page.click('button:has-text("Sign In")')
  
  // Wait for successful login
  await expect(page).toHaveURL('/dashboard')
  await expect(page.locator('text=Welcome')).toBeVisible()
  
  return user
}

/**
 * Logout helper for regression tests
 */
export async function logoutUser(page: Page) {
  await page.click('button:has-text("Logout")')
  await expect(page).toHaveURL('/login')
  await expect(page.locator('text=Logged out successfully')).toBeVisible()
}

/**
 * Setup mobile viewport for Africa-first testing
 */
export async function setupMobileViewport(page: Page, device: 'pixel5' | 'galaxy-s5' | 'iphone12' = 'pixel5') {
  const viewports = {
    'pixel5': { width: 393, height: 851 },
    'galaxy-s5': { width: 360, height: 640 },
    'iphone12': { width: 390, height: 844 }
  }
  
  await page.setViewportSize(viewports[device])
}

/**
 * Simulate slow network conditions (3G)
 */
export async function simulateSlowNetwork(page: Page, delayMs: number = 100) {
  await page.route('**/*', async (route) => {
    await new Promise(resolve => setTimeout(resolve, delayMs))
    await route.continue()
  })
}

/**
 * Check touch-friendly UI elements
 */
export async function validateTouchFriendlyUI(page: Page, selector: string) {
  const element = page.locator(selector)
  await expect(element).toBeVisible()
  
  const boundingBox = await element.boundingBox()
  expect(boundingBox?.height).toBeGreaterThanOrEqual(44) // Minimum touch target size
  expect(boundingBox?.width).toBeGreaterThanOrEqual(44)
}

/**
 * Validate page load performance
 */
export async function validatePagePerformance(page: Page, url: string, maxLoadTime: number = 3000) {
  const startTime = Date.now()
  await page.goto(url)
  const loadTime = Date.now() - startTime
  
  expect(loadTime).toBeLessThan(maxLoadTime)
  
  // Check performance metrics
  const performanceEntries = await page.evaluate(() => {
    return JSON.stringify(performance.getEntriesByType('navigation'))
  })
  
  const entries = JSON.parse(performanceEntries)
  if (entries.length > 0) {
    const entry = entries[0]
    expect(entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart).toBeLessThan(1000)
  }
  
  return loadTime
}

/**
 * Mock API responses for consistent testing
 */
export async function mockApiResponse(page: Page, endpoint: string, response: any, status: number = 200) {
  await page.route(`**${endpoint}`, async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(response)
    })
  })
}

/**
 * Mock API error for error handling tests
 */
export async function mockApiError(page: Page, endpoint: string, status: number = 500, message: string = 'Internal server error') {
  await mockApiResponse(page, endpoint, { message }, status)
}

/**
 * Validate accessibility standards
 */
export async function validateAccessibility(page: Page) {
  // Check for proper heading structure
  const h1 = page.locator('h1')
  await expect(h1).toBeVisible()
  
  // Test keyboard navigation
  await page.keyboard.press('Tab')
  const focusedElement = page.locator(':focus')
  await expect(focusedElement).toBeVisible()
  
  // Check for ARIA labels on interactive elements
  const buttons = page.locator('button')
  const buttonCount = await buttons.count()
  
  for (let i = 0; i < Math.min(buttonCount, 5); i++) { // Check first 5 buttons
    const button = buttons.nth(i)
    const ariaLabel = await button.getAttribute('aria-label')
    const text = await button.textContent()
    
    // Should have either aria-label or text content
    expect(ariaLabel || text).toBeTruthy()
  }
}

/**
 * Wait for loading states to complete
 */
export async function waitForLoadingComplete(page: Page, timeout: number = 5000) {
  // Wait for any loading spinners to disappear
  await page.waitForSelector('.q-spinner', { state: 'detached', timeout }).catch(() => {})
  await page.waitForSelector('.loading', { state: 'detached', timeout }).catch(() => {})
  await page.waitForSelector('[data-testid="loading"]', { state: 'detached', timeout }).catch(() => {})
}

/**
 * Generate unique test data
 */
export function generateTestData() {
  const timestamp = Date.now()
  return {
    email: `test.${timestamp}@example.com`,
    firstName: `Test${timestamp}`,
    lastName: `User${timestamp}`,
    organizationName: `Test Church ${timestamp}`
  }
}
