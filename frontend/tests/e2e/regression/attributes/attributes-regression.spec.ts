import { test, expect } from '@playwright/test'

test.describe('Custom Attributes System - Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to member detail page
    await page.goto('/members/1')
    await page.waitForLoadState('networkidle')
  })

  test('should display custom attributes section on member detail page', async ({ page }) => {
    // Check if custom attributes section is visible
    await expect(page.locator('[data-testid="custom-attributes-section"]')).toBeVisible()
    await expect(page.locator('text=Custom Attributes')).toBeVisible()
    
    // Check for edit button
    await expect(page.locator('[data-testid="edit-attributes-btn"]')).toBeVisible()
  })

  test('should show all configured custom attributes', async ({ page }) => {
    // Wait for attributes to load
    await page.waitForSelector('[data-testid="attribute-field"]')
    
    // Check that attributes are displayed
    const attributeFields = page.locator('[data-testid="attribute-field"]')
    await expect(attributeFields).toHaveCount(3) // Assuming 3 test attributes
    
    // Check specific attribute names
    await expect(page.locator('text=Emergency Contact')).toBeVisible()
    await expect(page.locator('text=Phone Number')).toBeVisible()
    await expect(page.locator('text=Membership Type')).toBeVisible()
  })

  test('should group attributes by category', async ({ page }) => {
    // Check category headers
    await expect(page.locator('[data-testid="category-personal"]')).toBeVisible()
    await expect(page.locator('[data-testid="category-contact"]')).toBeVisible()
    await expect(page.locator('[data-testid="category-church"]')).toBeVisible()
    
    // Check that attributes are under correct categories
    const personalSection = page.locator('[data-testid="category-personal"]')
    await expect(personalSection.locator('text=Emergency Contact')).toBeVisible()
  })

  test('should display current attribute values', async ({ page }) => {
    // Check that existing values are displayed
    const emergencyContactField = page.locator('[data-testid="attribute-emergency_contact"]')
    await expect(emergencyContactField.locator('input')).toHaveValue('John Doe - 555-1234')
    
    const phoneField = page.locator('[data-testid="attribute-phone_number"]')
    await expect(phoneField.locator('input')).toHaveValue('+1-555-987-6543')
  })

  test('should enter edit mode when edit button is clicked', async ({ page }) => {
    // Click edit button
    await page.click('[data-testid="edit-attributes-btn"]')
    
    // Check that form is now in edit mode
    await expect(page.locator('[data-testid="save-attributes-btn"]')).toBeVisible()
    await expect(page.locator('[data-testid="cancel-attributes-btn"]')).toBeVisible()
    
    // Check that inputs are enabled
    const inputs = page.locator('[data-testid="attribute-field"] input')
    for (let i = 0; i < await inputs.count(); i++) {
      await expect(inputs.nth(i)).toBeEnabled()
    }
  })

  test('should validate required fields', async ({ page }) => {
    // Enter edit mode
    await page.click('[data-testid="edit-attributes-btn"]')
    
    // Clear a required field
    const requiredField = page.locator('[data-testid="attribute-emergency_contact"] input')
    await requiredField.clear()
    
    // Try to save
    await page.click('[data-testid="save-attributes-btn"]')
    
    // Check for validation error
    await expect(page.locator('text=This field is required')).toBeVisible()
    await expect(page.locator('[data-testid="save-attributes-btn"]')).toBeDisabled()
  })

  test('should validate field formats', async ({ page }) => {
    // Enter edit mode
    await page.click('[data-testid="edit-attributes-btn"]')
    
    // Enter invalid phone number
    const phoneField = page.locator('[data-testid="attribute-phone_number"] input')
    await phoneField.clear()
    await phoneField.fill('invalid-phone')
    await phoneField.blur()
    
    // Check for format validation error
    await expect(page.locator('text=Please enter a valid phone number')).toBeVisible()
  })

  test('should save attribute changes successfully', async ({ page }) => {
    // Enter edit mode
    await page.click('[data-testid="edit-attributes-btn"]')
    
    // Modify a field
    const emergencyContactField = page.locator('[data-testid="attribute-emergency_contact"] input')
    await emergencyContactField.clear()
    await emergencyContactField.fill('Jane Smith - 555-9876')
    
    // Save changes
    await page.click('[data-testid="save-attributes-btn"]')
    
    // Wait for save to complete
    await page.waitForSelector('[data-testid="edit-attributes-btn"]')
    
    // Verify the change was saved
    await expect(emergencyContactField).toHaveValue('Jane Smith - 555-9876')
    
    // Check for success message
    await expect(page.locator('text=Attributes updated successfully')).toBeVisible()
  })

  test('should cancel changes when cancel button is clicked', async ({ page }) => {
    const originalValue = 'John Doe - 555-1234'
    
    // Enter edit mode
    await page.click('[data-testid="edit-attributes-btn"]')
    
    // Modify a field
    const emergencyContactField = page.locator('[data-testid="attribute-emergency_contact"] input')
    await emergencyContactField.clear()
    await emergencyContactField.fill('Modified Value')
    
    // Cancel changes
    await page.click('[data-testid="cancel-attributes-btn"]')
    
    // Verify original value is restored
    await expect(emergencyContactField).toHaveValue(originalValue)
    
    // Check that edit mode is exited
    await expect(page.locator('[data-testid="edit-attributes-btn"]')).toBeVisible()
  })

  test('should handle different field types correctly', async ({ page }) => {
    // Enter edit mode
    await page.click('[data-testid="edit-attributes-btn"]')
    
    // Test text field
    const textField = page.locator('[data-testid="attribute-emergency_contact"] input')
    await expect(textField).toHaveAttribute('type', 'text')
    
    // Test phone field
    const phoneField = page.locator('[data-testid="attribute-phone_number"] input')
    await expect(phoneField).toHaveAttribute('type', 'tel')
    
    // Test select field
    const selectField = page.locator('[data-testid="attribute-membership_type"] select')
    await expect(selectField).toBeVisible()
    
    // Test select options
    await selectField.click()
    await expect(page.locator('option:has-text("Regular")')).toBeVisible()
    await expect(page.locator('option:has-text("Associate")')).toBeVisible()
    await expect(page.locator('option:has-text("Honorary")')).toBeVisible()
  })

  test('should show loading state while saving', async ({ page }) => {
    // Enter edit mode
    await page.click('[data-testid="edit-attributes-btn"]')
    
    // Modify a field
    const emergencyContactField = page.locator('[data-testid="attribute-emergency_contact"] input')
    await emergencyContactField.clear()
    await emergencyContactField.fill('New Value')
    
    // Click save and immediately check for loading state
    await page.click('[data-testid="save-attributes-btn"]')
    await expect(page.locator('[data-testid="saving-spinner"]')).toBeVisible()
  })

  test('should handle save errors gracefully', async ({ page }) => {
    // Mock API to return error
    await page.route('**/api/members/*/attribute-values/bulk', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Server error' })
      })
    })
    
    // Enter edit mode and try to save
    await page.click('[data-testid="edit-attributes-btn"]')
    await page.click('[data-testid="save-attributes-btn"]')
    
    // Check for error message
    await expect(page.locator('text=Failed to save changes')).toBeVisible()
    await expect(page.locator('[data-testid="retry-save-btn"]')).toBeVisible()
  })

  test('should show empty state when no attributes configured', async ({ page }) => {
    // Mock API to return empty attributes
    await page.route('**/api/member-attributes', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] })
      })
    })
    
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Check for empty state
    await expect(page.locator('text=No custom attributes configured')).toBeVisible()
    await expect(page.locator('text=Contact your administrator to set up custom attributes')).toBeVisible()
  })

  test('should be accessible with keyboard navigation', async ({ page }) => {
    // Enter edit mode
    await page.click('[data-testid="edit-attributes-btn"]')
    
    // Test tab navigation through fields
    await page.keyboard.press('Tab')
    const firstField = page.locator('[data-testid="attribute-emergency_contact"] input')
    await expect(firstField).toBeFocused()
    
    await page.keyboard.press('Tab')
    const secondField = page.locator('[data-testid="attribute-phone_number"] input')
    await expect(secondField).toBeFocused()
    
    // Test Enter key to save (when valid)
    await page.keyboard.press('Tab') // Move to save button
    await page.keyboard.press('Tab') // Move to save button
    const saveButton = page.locator('[data-testid="save-attributes-btn"]')
    await expect(saveButton).toBeFocused()
  })

  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check that attributes section is still visible and usable
    await expect(page.locator('[data-testid="custom-attributes-section"]')).toBeVisible()
    
    // Enter edit mode
    await page.click('[data-testid="edit-attributes-btn"]')
    
    // Check that form fields are touch-friendly
    const inputs = page.locator('[data-testid="attribute-field"] input')
    for (let i = 0; i < await inputs.count(); i++) {
      const input = inputs.nth(i)
      const boundingBox = await input.boundingBox()
      expect(boundingBox?.height).toBeGreaterThan(44) // Minimum touch target size
    }
  })

  test('should maintain data integrity during navigation', async ({ page }) => {
    // Enter edit mode and modify a field
    await page.click('[data-testid="edit-attributes-btn"]')
    const emergencyContactField = page.locator('[data-testid="attribute-emergency_contact"] input')
    await emergencyContactField.clear()
    await emergencyContactField.fill('Modified Value')
    
    // Navigate away and back
    await page.goto('/members')
    await page.goto('/members/1')
    await page.waitForLoadState('networkidle')
    
    // Check that unsaved changes are not persisted
    await expect(emergencyContactField).toHaveValue('John Doe - 555-1234')
  })

  test('should handle concurrent edits gracefully', async ({ page, context }) => {
    // Open second tab
    const secondPage = await context.newPage()
    await secondPage.goto('/members/1')
    await secondPage.waitForLoadState('networkidle')
    
    // Edit in first tab
    await page.click('[data-testid="edit-attributes-btn"]')
    const field1 = page.locator('[data-testid="attribute-emergency_contact"] input')
    await field1.clear()
    await field1.fill('First Tab Value')
    await page.click('[data-testid="save-attributes-btn"]')
    
    // Edit in second tab
    await secondPage.click('[data-testid="edit-attributes-btn"]')
    const field2 = secondPage.locator('[data-testid="attribute-emergency_contact"] input')
    await field2.clear()
    await field2.fill('Second Tab Value')
    await secondPage.click('[data-testid="save-attributes-btn"]')
    
    // Check for conflict resolution
    await expect(secondPage.locator('text=Data has been updated by another user')).toBeVisible()
    
    await secondPage.close()
  })

  test('should support bulk operations', async ({ page }) => {
    // Enter edit mode
    await page.click('[data-testid="edit-attributes-btn"]')
    
    // Modify multiple fields
    await page.fill('[data-testid="attribute-emergency_contact"] input', 'New Emergency Contact')
    await page.fill('[data-testid="attribute-phone_number"] input', '+1-555-111-2222')
    await page.selectOption('[data-testid="attribute-membership_type"] select', 'Associate')
    
    // Save all changes at once
    await page.click('[data-testid="save-attributes-btn"]')
    
    // Wait for save to complete
    await page.waitForSelector('[data-testid="edit-attributes-btn"]')
    
    // Verify all changes were saved
    await expect(page.locator('[data-testid="attribute-emergency_contact"] input')).toHaveValue('New Emergency Contact')
    await expect(page.locator('[data-testid="attribute-phone_number"] input')).toHaveValue('+1-555-111-2222')
    await expect(page.locator('[data-testid="attribute-membership_type"] select')).toHaveValue('Associate')
  })

  test('should integrate with member search and filtering', async ({ page }) => {
    // Navigate to members list
    await page.goto('/members')
    await page.waitForLoadState('networkidle')
    
    // Open advanced search/filter
    await page.click('[data-testid="advanced-search-btn"]')
    
    // Check that custom attributes are available as filter options
    await expect(page.locator('text=Emergency Contact')).toBeVisible()
    await expect(page.locator('text=Membership Type')).toBeVisible()
    
    // Filter by custom attribute
    await page.selectOption('[data-testid="filter-membership_type"]', 'Regular')
    await page.click('[data-testid="apply-filters-btn"]')
    
    // Verify filtered results
    await page.waitForSelector('[data-testid="member-card"]')
    const memberCards = page.locator('[data-testid="member-card"]')
    expect(await memberCards.count()).toBeGreaterThan(0)
  })
})
