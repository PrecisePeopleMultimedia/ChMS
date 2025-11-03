import { test, expect } from '@playwright/test'

test.describe('Organization Setup', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses for testing
    await page.route('**/api/auth/user', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            role: 'admin',
            organization_id: null
          }
        })
      })
    })

    await page.route('**/api/organizations', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'No organization found for user'
          })
        })
      } else if (route.request().method() === 'POST') {
        const requestBody = await route.request().postDataJSON()
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Organization created successfully',
            data: {
              id: 1,
              ...requestBody,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          })
        })
      }
    })

    await page.route('**/api/organizations/1/settings', async route => {
      if (route.request().method() === 'PUT') {
        const requestBody = await route.request().postDataJSON()
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: requestBody.settings
          })
        })
      }
    })

    await page.route('**/api/service-schedules', async route => {
      if (route.request().method() === 'POST') {
        const requestBody = await route.request().postDataJSON()
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: Date.now(),
              organization_id: 1,
              ...requestBody,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          })
        })
      }
    })

    // Set auth token
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'mock-token')
    })

    await page.goto('/setup')
  })

  test('should display organization setup wizard', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Church Setup')
    await expect(page.locator('text=Step 1 of 4')).toBeVisible()
    await expect(page.locator('text=Church Profile')).toBeVisible()
  })

  test('should show progress indicator', async ({ page }) => {
    await expect(page.locator('.q-linear-progress')).toBeVisible()
    await expect(page.locator('text=25%')).toBeVisible()
  })

  test('should validate required fields in church profile', async ({ page }) => {
    // Try to proceed without filling required fields
    await page.click('button:has-text("Next")')
    
    // Should stay on step 1
    await expect(page.locator('text=Step 1 of 4')).toBeVisible()
    
    // Should show validation error
    await expect(page.locator('text=Church name is required')).toBeVisible()
  })

  test('should complete church profile step', async ({ page }) => {
    // Fill in required church information
    await page.fill('input[aria-label="Church Name *"]', 'Test Church')
    await page.fill('textarea[aria-label="Church Address"]', '123 Test Street, Test City')
    await page.fill('input[aria-label="Phone Number"]', '+234 123 456 7890')
    await page.fill('input[aria-label="Email Address"]', 'test@testchurch.com')
    await page.fill('input[aria-label="Website URL"]', 'https://testchurch.com')
    await page.fill('textarea[aria-label="Church Description"]', 'A test church for testing purposes')
    
    // Select timezone
    await page.click('.q-select')
    await page.click('text=Africa/Lagos')
    
    // Proceed to next step
    await page.click('button:has-text("Next")')
    
    // Should be on step 2
    await expect(page.locator('text=Step 2 of 4')).toBeVisible()
    await expect(page.locator('text=Service Times')).toBeVisible()
  })

  test('should add service schedules', async ({ page }) => {
    // Complete step 1 first
    await page.fill('input[aria-label="Church Name *"]', 'Test Church')
    await page.click('button:has-text("Next")')
    
    // Should be on service schedules step
    await expect(page.locator('text=Step 2 of 4')).toBeVisible()
    
    // Add a service schedule
    await page.fill('input[aria-label="Service Name *"]', 'Sunday Morning Service')
    await page.selectOption('select[aria-label="Day of Week *"]', '0') // Sunday
    await page.fill('input[aria-label="Start Time *"]', '09:00')
    await page.fill('input[aria-label="End Time"]', '11:00')
    
    await page.click('button:has-text("Add Service")')
    
    // Should show the added service in the list
    await expect(page.locator('text=Sunday Morning Service')).toBeVisible()
    await expect(page.locator('text=Sunday 09:00 - 11:00')).toBeVisible()
  })

  test('should validate service schedule times', async ({ page }) => {
    // Complete step 1 first
    await page.fill('input[aria-label="Church Name *"]', 'Test Church')
    await page.click('button:has-text("Next")')
    
    // Try to add service with end time before start time
    await page.fill('input[aria-label="Service Name *"]', 'Invalid Service')
    await page.selectOption('select[aria-label="Day of Week *"]', '0')
    await page.fill('input[aria-label="Start Time *"]', '11:00')
    await page.fill('input[aria-label="End Time"]', '09:00') // Before start time
    
    await page.click('button:has-text("Add Service")')
    
    // Should show validation error
    await expect(page.locator('text=End time must be after start time')).toBeVisible()
  })

  test('should complete settings step', async ({ page }) => {
    // Complete steps 1 and 2
    await page.fill('input[aria-label="Church Name *"]', 'Test Church')
    await page.click('button:has-text("Next")')
    
    // Add a service schedule
    await page.fill('input[aria-label="Service Name *"]', 'Sunday Service')
    await page.selectOption('select[aria-label="Day of Week *"]', '0')
    await page.fill('input[aria-label="Start Time *"]', '09:00')
    await page.click('button:has-text("Add Service")')
    await page.click('button:has-text("Next")')
    
    // Should be on settings step
    await expect(page.locator('text=Step 3 of 4')).toBeVisible()
    await expect(page.locator('text=Church Settings')).toBeVisible()
    
    // Fill optional settings
    await page.fill('textarea[aria-label="Welcome Message"]', 'Welcome to our church!')
    await page.fill('input[aria-label="Contact Person"]', 'Pastor John')
    await page.fill('input[aria-label="Facebook URL"]', 'https://facebook.com/testchurch')
    
    // Proceed to completion
    await page.click('button:has-text("Next")')
    
    // Should be on completion step
    await expect(page.locator('text=Step 4 of 4')).toBeVisible()
    await expect(page.locator('text=Complete Setup')).toBeVisible()
  })

  test('should complete full setup workflow', async ({ page }) => {
    // Step 1: Church Profile
    await page.fill('input[aria-label="Church Name *"]', 'Test Church')
    await page.fill('textarea[aria-label="Church Address"]', '123 Test Street')
    await page.fill('input[aria-label="Phone Number"]', '+234 123 456 7890')
    await page.fill('input[aria-label="Email Address"]', 'test@testchurch.com')
    await page.click('button:has-text("Next")')
    
    // Step 2: Service Schedules
    await page.fill('input[aria-label="Service Name *"]', 'Sunday Morning Service')
    await page.selectOption('select[aria-label="Day of Week *"]', '0')
    await page.fill('input[aria-label="Start Time *"]', '09:00')
    await page.fill('input[aria-label="End Time"]', '11:00')
    await page.click('button:has-text("Add Service")')
    await page.click('button:has-text("Next")')
    
    // Step 3: Settings
    await page.fill('textarea[aria-label="Welcome Message"]', 'Welcome to our church!')
    await page.click('button:has-text("Next")')
    
    // Step 4: Complete Setup
    await expect(page.locator('text=Review Your Information')).toBeVisible()
    await expect(page.locator('text=Test Church')).toBeVisible()
    await expect(page.locator('text=Sunday Morning Service')).toBeVisible()
    
    // Complete setup
    await page.click('button:has-text("Complete Setup")')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/)
  })

  test('should handle setup errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/organizations', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 422,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Validation failed',
            errors: {
              name: ['The name field is required.']
            }
          })
        })
      }
    })
    
    // Complete setup steps
    await page.fill('input[aria-label="Church Name *"]', 'Test Church')
    await page.click('button:has-text("Next")')
    await page.click('button:has-text("Next")') // Skip services
    await page.click('button:has-text("Next")') // Skip settings
    await page.click('button:has-text("Complete Setup")')
    
    // Should show error message
    await expect(page.locator('text=Validation failed')).toBeVisible()
    await expect(page.locator('text=The name field is required.')).toBeVisible()
  })

  test('should support mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }) // iPhone SE
    
    // Should still be usable on mobile
    await expect(page.locator('h1')).toContainText('Church Setup')
    await expect(page.locator('text=Step 1 of 4')).toBeVisible()
    
    // Form should be responsive
    const nameInput = page.locator('input[aria-label="Church Name *"]')
    await expect(nameInput).toBeVisible()
    
    // Buttons should be touch-friendly
    const nextButton = page.locator('button:has-text("Next")')
    await expect(nextButton).toBeVisible()
    
    const buttonBox = await nextButton.boundingBox()
    expect(buttonBox?.height).toBeGreaterThan(40) // Minimum touch target
  })

  test('should show offline support message', async ({ page }) => {
    // Simulate offline state
    await page.context().setOffline(true)
    await page.reload()
    
    // Should show offline indicator
    await expect(page.locator('text=Working Offline')).toBeVisible()
    await expect(page.locator('text=Your information will be saved locally')).toBeVisible()
  })

  test('should support keyboard navigation', async ({ page }) => {
    // Should be able to navigate with Tab key
    await page.keyboard.press('Tab')
    await expect(page.locator('input[aria-label="Church Name *"]')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.locator('textarea[aria-label="Church Address"]')).toBeFocused()
    
    // Should be able to submit with Enter key
    await page.fill('input[aria-label="Church Name *"]', 'Test Church')
    await page.keyboard.press('Enter')
    
    // Should proceed to next step
    await expect(page.locator('text=Step 2 of 4')).toBeVisible()
  })
})
