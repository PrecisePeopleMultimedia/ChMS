import { chromium, FullConfig } from '@playwright/test'
import { setupTestEnvironment } from './database-helpers'
import TEST_CONFIG from './test-config'

/**
 * Global Setup for Regression Tests
 * 
 * This runs once before all tests to:
 * - Set up test database
 * - Create authenticated user sessions
 * - Verify test environment is ready
 */

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for regression tests...')

  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    // Setup test environment with mock data
    await setupTestEnvironment(page)
    console.log('✅ Test environment setup complete')

    // Create authenticated session for tests
    await page.goto(TEST_CONFIG.urls.frontend + '/login')
    
    // Wait for login form to be ready
    await page.waitForSelector('input[type="email"]', { state: 'visible' })
    await page.waitForSelector('input[type="password"]', { state: 'visible' })
    
    // Clear and fill email field (ensure it triggers validation)
    await page.fill('input[type="email"]', '')
    await page.type('input[type="email"]', TEST_CONFIG.users.member.email, { delay: 50 })
    
    // Clear and fill password field
    await page.fill('input[type="password"]', '')
    await page.type('input[type="password"]', TEST_CONFIG.users.member.password, { delay: 50 })
    
    // Wait for form validation to complete and button to be enabled
    await page.waitForSelector('button:has-text("Sign In"):not([disabled])', { timeout: 10000 })
    
    // Click Sign In button
    await page.click('button:has-text("Sign In")')
    
    // Wait for successful login
    await page.waitForURL('**/dashboard')
    console.log('✅ Test user authentication complete')

    // Save authenticated state
    await page.context().storageState({ path: 'test-results/.auth/user.json' })
    console.log('✅ Authentication state saved')

    // Verify test environment is working
    await page.goto(TEST_CONFIG.urls.frontend + '/dashboard')
    await page.waitForSelector('text=Welcome', { timeout: 10000 })
    console.log('✅ Test environment verification complete')

  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  } finally {
    await browser.close()
  }

  console.log('🎉 Global setup completed successfully')
}

export default globalSetup
