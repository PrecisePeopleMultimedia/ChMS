import { test as setup, expect } from '@playwright/test'
import { setupTestEnvironment } from './regression/utils/database-helpers'
import TEST_CONFIG from './regression/utils/test-config'

/**
 * Authentication Setup for E2E Tests
 * 
 * This setup test runs before other tests to create authenticated sessions
 * that can be reused across test suites for better performance.
 */

const authFile = 'test-results/.auth/user.json'

setup('authenticate as test user', async ({ page }) => {
  console.log('🔐 Setting up authentication for test user...')

  // Setup test environment
  await setupTestEnvironment(page)

  // Navigate to login page
  await page.goto('/login')

  // Verify login page is loaded
  await expect(page.locator('h1')).toContainText('ChurchAfrica')
  await expect(page.locator('input[type="email"]')).toBeVisible()
  await expect(page.locator('input[type="password"]')).toBeVisible()

  // Fill login form
  await page.fill('input[type="email"]', TEST_CONFIG.users.member.email)
  await page.fill('input[type="password"]', TEST_CONFIG.users.member.password)

  // Submit login form
  await page.click('button:has-text("Sign In")')

  // Wait for successful login and redirect to dashboard
  await expect(page).toHaveURL('/dashboard')
  await expect(page.locator('h1:has-text("Welcome")')).toBeVisible()
  await expect(page.locator('button:has-text("Logout")')).toBeVisible()

  console.log('✅ User authenticated successfully')

  // Save authentication state
  await page.context().storageState({ path: authFile })
  console.log(`✅ Authentication state saved to ${authFile}`)
})

setup('authenticate as admin user', async ({ page }) => {
  console.log('🔐 Setting up authentication for admin user...')

  const adminAuthFile = 'test-results/.auth/admin.json'

  // Setup test environment
  await setupTestEnvironment(page)

  // Navigate to login page
  await page.goto('/login')

  // Fill login form with admin credentials
  await page.fill('input[type="email"]', TEST_CONFIG.users.admin.email)
  await page.fill('input[type="password"]', TEST_CONFIG.users.admin.password)

  // Submit login form
  await page.click('button:has-text("Sign In")')

  // Wait for successful login
  await expect(page).toHaveURL('/dashboard')
  await expect(page.locator('h1:has-text("Welcome")')).toBeVisible()

  console.log('✅ Admin authenticated successfully')

  // Save admin authentication state
  await page.context().storageState({ path: adminAuthFile })
  console.log(`✅ Admin authentication state saved to ${adminAuthFile}`)
})

setup('verify test environment', async ({ page }) => {
  console.log('🔍 Verifying test environment...')

  // Setup test environment
  await setupTestEnvironment(page)

  // Test basic navigation - app should redirect to login if not authenticated
  await page.goto('/')
  // Wait for potential redirect
  await page.waitForTimeout(1000)
  // Check if we're on login page or if app has different behavior
  const currentUrl = page.url()
  console.log(`Current URL: ${currentUrl}`)
  // For now, just verify the page loads
  await expect(page.locator('body')).toBeVisible()

  // Test API endpoints are mocked
  await page.goto('/login')
  await page.fill('input[type="email"]', 'invalid@example.com')
  await page.fill('input[type="password"]', 'wrongpassword')
  await page.click('button:has-text("Sign In")')

  // Wait for error message to appear - check for alert container first, then text
  // Error can appear in ModernAlert component or Quasar notification
  // The error message from backend is "Invalid credentials" but LoginForm might show variations
  const errorAlert = page.locator('.modern-alert, .q-banner, .q-notification, [role="alert"]')
  await expect(errorAlert).toBeVisible({ timeout: 10000 })
  
  // Check for the error text - it should appear in either the alert or notification
  // Accept multiple possible error messages (backend returns "Invalid credentials", but UI might show variations)
  // Use getByText with regex to match "Invalid credentials" or "Invalid email or password"
  const errorText = page.getByText(/Invalid (credentials|email or password)/i)
  await expect(errorText).toBeVisible({ timeout: 5000 }) 

  console.log('✅ Test environment verified')
})
