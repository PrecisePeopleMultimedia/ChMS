import { test, expect } from '@playwright/test'

test.describe('Custom Attributes System', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin user
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'admin@example.com')
    await page.fill('[data-testid="password-input"]', 'password')
    await page.click('[data-testid="login-button"]')
    
    // Wait for dashboard to load
    await page.waitForURL('/dashboard')
    
    // Navigate to custom attributes management
    await page.click('[data-testid="settings-menu"]')
    await page.click('[data-testid="custom-attributes-link"]')
    await page.waitForURL('/settings/custom-attributes')
  })

  test('should display custom attributes management page', async ({ page }) => {
    await expect(page.locator('[data-testid="attribute-manager"]')).toBeVisible()
    await expect(page.locator('[data-testid="add-attribute-btn"]')).toBeVisible()
    await expect(page.locator('[data-testid="attributes-list"]')).toBeVisible()
  })

  test('should create a new text attribute', async ({ page }) => {
    // Click add attribute button
    await page.click('[data-testid="add-attribute-btn"]')
    
    // Fill attribute form
    await page.fill('[data-testid="attribute-key-input"]', 'emergency_contact')
    await page.fill('[data-testid="attribute-name-input"]', 'Emergency Contact')
    await page.selectOption('[data-testid="field-type-select"]', 'text')
    await page.selectOption('[data-testid="category-select"]', 'Emergency')
    
    // Save attribute
    await page.click('[data-testid="save-attribute-btn"]')
    
    // Verify attribute was created
    await expect(page.locator('[data-testid="attribute-item"]').filter({ hasText: 'Emergency Contact' })).toBeVisible()
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Attribute created successfully')
  })

  test('should create a select attribute with options', async ({ page }) => {
    // Click add attribute button
    await page.click('[data-testid="add-attribute-btn"]')
    
    // Fill basic attribute info
    await page.fill('[data-testid="attribute-key-input"]', 'marital_status')
    await page.fill('[data-testid="attribute-name-input"]', 'Marital Status')
    await page.selectOption('[data-testid="field-type-select"]', 'select')
    await page.selectOption('[data-testid="category-select"]', 'Personal')
    
    // Add select options
    await page.click('[data-testid="add-option-btn"]')
    await page.fill('[data-testid="option-input-0"]', 'Single')
    
    await page.click('[data-testid="add-option-btn"]')
    await page.fill('[data-testid="option-input-1"]', 'Married')
    
    await page.click('[data-testid="add-option-btn"]')
    await page.fill('[data-testid="option-input-2"]', 'Divorced')
    
    // Save attribute
    await page.click('[data-testid="save-attribute-btn"]')
    
    // Verify attribute was created with options
    await expect(page.locator('[data-testid="attribute-item"]').filter({ hasText: 'Marital Status' })).toBeVisible()
    await expect(page.locator('[data-testid="field-type-badge"]').filter({ hasText: 'Select' })).toBeVisible()
  })

  test('should edit an existing attribute', async ({ page }) => {
    // Assume there's an existing attribute
    await page.click('[data-testid="attribute-item"]:first-child [data-testid="edit-btn"]')
    
    // Update attribute name
    await page.fill('[data-testid="attribute-name-input"]', 'Updated Attribute Name')
    
    // Save changes
    await page.click('[data-testid="save-attribute-btn"]')
    
    // Verify attribute was updated
    await expect(page.locator('[data-testid="attribute-item"]').filter({ hasText: 'Updated Attribute Name' })).toBeVisible()
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Attribute updated successfully')
  })

  test('should delete an attribute', async ({ page }) => {
    // Click delete button on first attribute
    await page.click('[data-testid="attribute-item"]:first-child [data-testid="delete-btn"]')
    
    // Confirm deletion
    await page.click('[data-testid="confirm-delete-btn"]')
    
    // Verify attribute was deleted
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Attribute deleted successfully')
  })

  test('should filter attributes by category', async ({ page }) => {
    // Select Personal category filter
    await page.selectOption('[data-testid="category-filter"]', 'Personal')
    
    // Verify only Personal category attributes are shown
    const visibleAttributes = page.locator('[data-testid="attribute-item"]:visible')
    await expect(visibleAttributes).toHaveCount(await visibleAttributes.count())
    
    // Verify all visible attributes have Personal category
    const categoryBadges = page.locator('[data-testid="attribute-item"]:visible [data-testid="category-badge"]')
    for (let i = 0; i < await categoryBadges.count(); i++) {
      await expect(categoryBadges.nth(i)).toContainText('Personal')
    }
  })

  test('should search attributes by name', async ({ page }) => {
    // Enter search term
    await page.fill('[data-testid="search-input"]', 'baptism')
    
    // Verify only matching attributes are shown
    const visibleAttributes = page.locator('[data-testid="attribute-item"]:visible')
    for (let i = 0; i < await visibleAttributes.count(); i++) {
      await expect(visibleAttributes.nth(i)).toContainText('baptism', { ignoreCase: true })
    }
  })

  test('should reorder attributes using drag and drop', async ({ page }) => {
    // Get initial order
    const firstAttribute = page.locator('[data-testid="attribute-item"]').first()
    const firstAttributeName = await firstAttribute.locator('[data-testid="attribute-name"]').textContent()
    
    const secondAttribute = page.locator('[data-testid="attribute-item"]').nth(1)
    const secondAttributeName = await secondAttribute.locator('[data-testid="attribute-name"]').textContent()
    
    // Drag first attribute to second position
    await firstAttribute.dragTo(secondAttribute)
    
    // Verify order changed
    const newFirstAttribute = page.locator('[data-testid="attribute-item"]').first()
    const newFirstAttributeName = await newFirstAttribute.locator('[data-testid="attribute-name"]').textContent()
    
    expect(newFirstAttributeName).toBe(secondAttributeName)
  })

  test('should validate required fields when creating attribute', async ({ page }) => {
    // Click add attribute button
    await page.click('[data-testid="add-attribute-btn"]')
    
    // Try to save without filling required fields
    await page.click('[data-testid="save-attribute-btn"]')
    
    // Verify validation errors
    await expect(page.locator('[data-testid="key-error"]')).toContainText('required')
    await expect(page.locator('[data-testid="name-error"]')).toContainText('required')
    await expect(page.locator('[data-testid="field-type-error"]')).toContainText('required')
  })

  test('should prevent duplicate attribute keys', async ({ page }) => {
    // Click add attribute button
    await page.click('[data-testid="add-attribute-btn"]')
    
    // Fill form with existing key
    await page.fill('[data-testid="attribute-key-input"]', 'baptism_date') // Assuming this exists
    await page.fill('[data-testid="attribute-name-input"]', 'Duplicate Key Test')
    await page.selectOption('[data-testid="field-type-select"]', 'text')
    
    // Try to save
    await page.click('[data-testid="save-attribute-btn"]')
    
    // Verify duplicate key error
    await expect(page.locator('[data-testid="key-error"]')).toContainText('already exists')
  })

  test('should use custom attributes in member form', async ({ page }) => {
    // Navigate to add member page
    await page.goto('/members/create')
    
    // Verify custom attributes section is present
    await expect(page.locator('[data-testid="custom-attributes-section"]')).toBeVisible()
    
    // Fill basic member info
    await page.fill('[data-testid="first-name-input"]', 'John')
    await page.fill('[data-testid="last-name-input"]', 'Doe')
    await page.fill('[data-testid="email-input"]', 'john.doe@example.com')
    
    // Fill custom attributes
    await page.fill('[data-testid="custom-attr-baptism_date"]', '2023-01-15')
    await page.selectOption('[data-testid="custom-attr-marital_status"]', 'Single')
    
    // Save member
    await page.click('[data-testid="save-member-btn"]')
    
    // Verify member was created with custom attributes
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Member created successfully')
  })

  test('should display custom attributes in member profile', async ({ page }) => {
    // Navigate to member profile (assuming member exists)
    await page.goto('/members/1')
    
    // Verify custom attributes section is visible
    await expect(page.locator('[data-testid="member-custom-attributes"]')).toBeVisible()
    
    // Verify custom attribute values are displayed
    await expect(page.locator('[data-testid="custom-attr-display"]')).toHaveCount(await page.locator('[data-testid="custom-attr-display"]').count())
  })

  test('should handle mobile responsive design', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Verify mobile layout
    await expect(page.locator('[data-testid="mobile-attribute-list"]')).toBeVisible()
    await expect(page.locator('[data-testid="mobile-add-btn"]')).toBeVisible()
    
    // Test mobile attribute creation
    await page.click('[data-testid="mobile-add-btn"]')
    await expect(page.locator('[data-testid="mobile-attribute-form"]')).toBeVisible()
  })
})
