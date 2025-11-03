import { test, expect } from '@playwright/test'

test.describe('Families System - Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to families page
    await page.goto('/families')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
  })

  test('should display families list page', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Families/)
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Families')
    
    // Check for families table or list
    await expect(page.locator('[data-testid="families-list"]')).toBeVisible()
  })

  test('should display family search and filters', async ({ page }) => {
    // Check search input
    await expect(page.locator('[data-testid="family-search"]')).toBeVisible()
    
    // Check filter options
    await expect(page.locator('[data-testid="city-filter"]')).toBeVisible()
    await expect(page.locator('[data-testid="active-only-filter"]')).toBeVisible()
  })

  test('should open create family dialog', async ({ page }) => {
    // Click create family button
    await page.click('[data-testid="create-family-btn"]')
    
    // Check dialog is visible
    await expect(page.locator('[data-testid="family-form-dialog"]')).toBeVisible()
    
    // Check required form fields
    await expect(page.locator('[data-testid="family-name-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="head-of-family-select"]')).toBeVisible()
    await expect(page.locator('[data-testid="address-input"]')).toBeVisible()
  })

  test('should validate required fields in family form', async ({ page }) => {
    // Open create dialog
    await page.click('[data-testid="create-family-btn"]')
    
    // Try to submit without required fields
    await page.click('[data-testid="save-family-btn"]')
    
    // Check validation messages
    await expect(page.locator('[data-testid="family-name-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="family-name-error"]')).toContainText('required')
  })

  test('should create new family successfully', async ({ page }) => {
    // Mock API response
    await page.route('**/api/families', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Family created successfully',
            data: {
              id: 1,
              family_name: 'Test Family',
              head_of_family_id: 1,
              address: '123 Test St',
              city: 'Lagos',
              is_active: true
            }
          })
        })
      }
    })
    
    // Open create dialog
    await page.click('[data-testid="create-family-btn"]')
    
    // Fill form
    await page.fill('[data-testid="family-name-input"]', 'Test Family')
    await page.selectOption('[data-testid="head-of-family-select"]', '1')
    await page.fill('[data-testid="address-input"]', '123 Test St')
    await page.fill('[data-testid="city-input"]', 'Lagos')
    
    // Submit form
    await page.click('[data-testid="save-family-btn"]')
    
    // Check success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Family created successfully')
  })

  test('should display family details in list', async ({ page }) => {
    // Mock families data
    await page.route('**/api/families*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 1,
              family_name: 'Smith Family',
              head_of_family: { first_name: 'John', last_name: 'Smith' },
              address: '123 Main St',
              city: 'Lagos',
              member_count: 4,
              is_active: true
            }
          ]
        })
      })
    })
    
    await page.reload()
    
    // Check family details are displayed
    await expect(page.locator('[data-testid="family-name-1"]')).toContainText('Smith Family')
    await expect(page.locator('[data-testid="family-head-1"]')).toContainText('John Smith')
    await expect(page.locator('[data-testid="family-city-1"]')).toContainText('Lagos')
    await expect(page.locator('[data-testid="family-member-count-1"]')).toContainText('4')
  })

  test('should filter families by city', async ({ page }) => {
    // Mock filtered data
    await page.route('**/api/families*city=Lagos*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 1,
              family_name: 'Lagos Family',
              city: 'Lagos',
              is_active: true
            }
          ]
        })
      })
    })
    
    // Select city filter
    await page.selectOption('[data-testid="city-filter"]', 'Lagos')
    
    // Check filtered results
    await expect(page.locator('[data-testid="family-name-1"]')).toContainText('Lagos Family')
  })

  test('should search families by name', async ({ page }) => {
    // Mock search results
    await page.route('**/api/families*search=Smith*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 1,
              family_name: 'Smith Family',
              is_active: true
            }
          ]
        })
      })
    })
    
    // Enter search term
    await page.fill('[data-testid="family-search"]', 'Smith')
    await page.press('[data-testid="family-search"]', 'Enter')
    
    // Check search results
    await expect(page.locator('[data-testid="family-name-1"]')).toContainText('Smith Family')
  })

  test('should open family details view', async ({ page }) => {
    // Mock family data
    await page.route('**/api/families/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            id: 1,
            family_name: 'Smith Family',
            head_of_family: { first_name: 'John', last_name: 'Smith' },
            address: '123 Main St',
            city: 'Lagos',
            home_phone: '+234-123-456-7890',
            email: 'smith@example.com',
            anniversary_date: '2020-06-15',
            notes: 'Active church family',
            is_active: true
          }
        })
      })
    })
    
    // Click on family row
    await page.click('[data-testid="family-row-1"]')
    
    // Check family details are displayed
    await expect(page.locator('[data-testid="family-details"]')).toBeVisible()
    await expect(page.locator('[data-testid="family-name-detail"]')).toContainText('Smith Family')
    await expect(page.locator('[data-testid="family-address-detail"]')).toContainText('123 Main St')
    await expect(page.locator('[data-testid="family-phone-detail"]')).toContainText('+234-123-456-7890')
  })

  test('should display family members list', async ({ page }) => {
    // Mock family members
    await page.route('**/api/families/1/members', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 1,
              first_name: 'John',
              last_name: 'Smith',
              relationship: 'Head of Family'
            },
            {
              id: 2,
              first_name: 'Jane',
              last_name: 'Smith',
              relationship: 'Spouse'
            }
          ]
        })
      })
    })
    
    // Navigate to family details
    await page.goto('/families/1')
    
    // Check members section
    await expect(page.locator('[data-testid="family-members-section"]')).toBeVisible()
    await expect(page.locator('[data-testid="member-1"]')).toContainText('John Smith')
    await expect(page.locator('[data-testid="member-2"]')).toContainText('Jane Smith')
  })

  test('should handle edit family', async ({ page }) => {
    // Mock update response
    await page.route('**/api/families/1', async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Family updated successfully',
            data: {
              id: 1,
              family_name: 'Updated Family Name',
              is_active: true
            }
          })
        })
      }
    })
    
    // Click edit button
    await page.click('[data-testid="edit-family-btn-1"]')
    
    // Update family name
    await page.fill('[data-testid="family-name-input"]', 'Updated Family Name')
    
    // Save changes
    await page.click('[data-testid="save-family-btn"]')
    
    // Check success message
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Family updated successfully')
  })

  test('should handle delete family confirmation', async ({ page }) => {
    // Click delete button
    await page.click('[data-testid="delete-family-btn-1"]')
    
    // Check confirmation dialog
    await expect(page.locator('[data-testid="delete-confirmation-dialog"]')).toBeVisible()
    await expect(page.locator('[data-testid="delete-confirmation-message"]')).toContainText('Are you sure')
    
    // Check cancel and confirm buttons
    await expect(page.locator('[data-testid="cancel-delete-btn"]')).toBeVisible()
    await expect(page.locator('[data-testid="confirm-delete-btn"]')).toBeVisible()
  })

  test('should handle loading states', async ({ page }) => {
    // Mock slow response
    await page.route('**/api/families*', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] })
      })
    })
    
    await page.reload()
    
    // Check loading indicator
    await expect(page.locator('[data-testid="families-loading"]')).toBeVisible()
  })

  test('should handle error states', async ({ page }) => {
    // Mock error response
    await page.route('**/api/families*', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Server error'
        })
      })
    })
    
    await page.reload()
    
    // Check error message
    await expect(page.locator('[data-testid="families-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="families-error"]')).toContainText('Server error')
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check mobile layout
    await expect(page.locator('[data-testid="families-mobile-view"]')).toBeVisible()
    
    // Check mobile navigation
    await expect(page.locator('[data-testid="mobile-menu-btn"]')).toBeVisible()
  })

  test('should support keyboard navigation', async ({ page }) => {
    // Focus on search input
    await page.focus('[data-testid="family-search"]')
    
    // Tab to create button
    await page.keyboard.press('Tab')
    await expect(page.locator('[data-testid="create-family-btn"]')).toBeFocused()
    
    // Enter to open dialog
    await page.keyboard.press('Enter')
    await expect(page.locator('[data-testid="family-form-dialog"]')).toBeVisible()
  })
})
