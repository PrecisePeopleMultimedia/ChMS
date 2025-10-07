import { test, expect } from '@playwright/test'

// Test data
const testMember = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  memberType: 'adult'
}

const testFamily = {
  name: 'Doe Family',
  address: '123 Main St, City, State',
  phone: '+1234567890',
  email: 'doe.family@example.com'
}

test.describe('Member Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/')
    
    // Login (assuming we have authentication)
    // This would need to be implemented based on your auth system
    await page.waitForSelector('[data-testid="dashboard"]', { timeout: 10000 })
    
    // Navigate to members page
    await page.click('[data-testid="members-nav"]')
    await page.waitForSelector('[data-testid="members-page"]')
  })

  test('should display members list', async ({ page }) => {
    // Check if members list is visible
    await expect(page.locator('[data-testid="members-list"]')).toBeVisible()
    
    // Check if search input is present
    await expect(page.locator('[data-testid="member-search"]')).toBeVisible()
    
    // Check if add member button is present
    await expect(page.locator('[data-testid="add-member-btn"]')).toBeVisible()
  })

  test('should create a new member', async ({ page }) => {
    // Click add member button
    await page.click('[data-testid="add-member-btn"]')
    
    // Wait for form dialog to appear
    await expect(page.locator('[data-testid="member-form-dialog"]')).toBeVisible()
    
    // Fill in member details
    await page.fill('[data-testid="first-name-input"]', testMember.firstName)
    await page.fill('[data-testid="last-name-input"]', testMember.lastName)
    await page.fill('[data-testid="email-input"]', testMember.email)
    await page.fill('[data-testid="phone-input"]', testMember.phone)
    await page.selectOption('[data-testid="member-type-select"]', testMember.memberType)
    
    // Submit form
    await page.click('[data-testid="save-member-btn"]')
    
    // Wait for success message or member to appear in list
    await expect(page.locator(`text=${testMember.firstName} ${testMember.lastName}`)).toBeVisible()
    
    // Verify member appears in the list
    const memberCard = page.locator(`[data-testid="member-card"]:has-text("${testMember.firstName} ${testMember.lastName}")`)
    await expect(memberCard).toBeVisible()
  })

  test('should search for members', async ({ page }) => {
    // First create a member to search for
    await page.click('[data-testid="add-member-btn"]')
    await page.fill('[data-testid="first-name-input"]', testMember.firstName)
    await page.fill('[data-testid="last-name-input"]', testMember.lastName)
    await page.fill('[data-testid="email-input"]', testMember.email)
    await page.selectOption('[data-testid="member-type-select"]', testMember.memberType)
    await page.click('[data-testid="save-member-btn"]')
    
    // Wait for member to be created
    await expect(page.locator(`text=${testMember.firstName} ${testMember.lastName}`)).toBeVisible()
    
    // Search for the member
    await page.fill('[data-testid="member-search"]', testMember.firstName)
    
    // Verify search results
    await expect(page.locator(`text=${testMember.firstName} ${testMember.lastName}`)).toBeVisible()
    
    // Clear search and verify all members are shown again
    await page.fill('[data-testid="member-search"]', '')
    await expect(page.locator('[data-testid="members-list"]')).toBeVisible()
  })

  test('should edit a member', async ({ page }) => {
    // First create a member
    await page.click('[data-testid="add-member-btn"]')
    await page.fill('[data-testid="first-name-input"]', testMember.firstName)
    await page.fill('[data-testid="last-name-input"]', testMember.lastName)
    await page.fill('[data-testid="email-input"]', testMember.email)
    await page.selectOption('[data-testid="member-type-select"]', testMember.memberType)
    await page.click('[data-testid="save-member-btn"]')
    
    // Wait for member to be created
    await expect(page.locator(`text=${testMember.firstName} ${testMember.lastName}`)).toBeVisible()
    
    // Click edit button on the member card
    const memberCard = page.locator(`[data-testid="member-card"]:has-text("${testMember.firstName} ${testMember.lastName}")`)
    await memberCard.locator('[data-testid="edit-member-btn"]').click()
    
    // Wait for edit form to appear
    await expect(page.locator('[data-testid="member-form-dialog"]')).toBeVisible()
    
    // Update member details
    const updatedFirstName = 'Jane'
    await page.fill('[data-testid="first-name-input"]', updatedFirstName)
    
    // Submit form
    await page.click('[data-testid="save-member-btn"]')
    
    // Verify updated member appears in the list
    await expect(page.locator(`text=${updatedFirstName} ${testMember.lastName}`)).toBeVisible()
  })

  test('should delete a member', async ({ page }) => {
    // First create a member
    await page.click('[data-testid="add-member-btn"]')
    await page.fill('[data-testid="first-name-input"]', testMember.firstName)
    await page.fill('[data-testid="last-name-input"]', testMember.lastName)
    await page.fill('[data-testid="email-input"]', testMember.email)
    await page.selectOption('[data-testid="member-type-select"]', testMember.memberType)
    await page.click('[data-testid="save-member-btn"]')
    
    // Wait for member to be created
    await expect(page.locator(`text=${testMember.firstName} ${testMember.lastName}`)).toBeVisible()
    
    // Click delete button on the member card
    const memberCard = page.locator(`[data-testid="member-card"]:has-text("${testMember.firstName} ${testMember.lastName}")`)
    await memberCard.locator('[data-testid="delete-member-btn"]').click()
    
    // Confirm deletion in dialog
    await expect(page.locator('[data-testid="confirm-delete-dialog"]')).toBeVisible()
    await page.click('[data-testid="confirm-delete-btn"]')
    
    // Verify member is removed from the list
    await expect(page.locator(`text=${testMember.firstName} ${testMember.lastName}`)).not.toBeVisible()
  })

  test('should filter members by type', async ({ page }) => {
    // Create members of different types
    const members = [
      { ...testMember, firstName: 'Adult', memberType: 'adult' },
      { ...testMember, firstName: 'Child', lastName: 'Smith', memberType: 'child' },
      { ...testMember, firstName: 'Youth', lastName: 'Johnson', memberType: 'youth' }
    ]
    
    // Create each member
    for (const member of members) {
      await page.click('[data-testid="add-member-btn"]')
      await page.fill('[data-testid="first-name-input"]', member.firstName)
      await page.fill('[data-testid="last-name-input"]', member.lastName)
      await page.fill('[data-testid="email-input"]', `${member.firstName.toLowerCase()}@example.com`)
      await page.selectOption('[data-testid="member-type-select"]', member.memberType)
      await page.click('[data-testid="save-member-btn"]')
      await page.waitForTimeout(500) // Small delay between creations
    }
    
    // Filter by adult members
    await page.selectOption('[data-testid="member-type-filter"]', 'adult')
    
    // Verify only adult members are shown
    await expect(page.locator('text=Adult Doe')).toBeVisible()
    await expect(page.locator('text=Child Smith')).not.toBeVisible()
    await expect(page.locator('text=Youth Johnson')).not.toBeVisible()
    
    // Clear filter
    await page.selectOption('[data-testid="member-type-filter"]', '')
    
    // Verify all members are shown again
    await expect(page.locator('text=Adult Doe')).toBeVisible()
    await expect(page.locator('text=Child Smith')).toBeVisible()
    await expect(page.locator('text=Youth Johnson')).toBeVisible()
  })

  test('should handle form validation', async ({ page }) => {
    // Click add member button
    await page.click('[data-testid="add-member-btn"]')
    
    // Try to submit empty form
    await page.click('[data-testid="save-member-btn"]')
    
    // Verify validation errors are shown
    await expect(page.locator('[data-testid="first-name-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="last-name-error"]')).toBeVisible()
    
    // Fill required fields
    await page.fill('[data-testid="first-name-input"]', testMember.firstName)
    await page.fill('[data-testid="last-name-input"]', testMember.lastName)
    await page.selectOption('[data-testid="member-type-select"]', testMember.memberType)
    
    // Submit form - should succeed now
    await page.click('[data-testid="save-member-btn"]')
    
    // Verify member was created
    await expect(page.locator(`text=${testMember.firstName} ${testMember.lastName}`)).toBeVisible()
  })

  test('should work offline', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true)
    
    // Verify offline indicator is shown
    await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible()
    
    // Try to create a member while offline
    await page.click('[data-testid="add-member-btn"]')
    await page.fill('[data-testid="first-name-input"]', 'Offline')
    await page.fill('[data-testid="last-name-input"]', 'Member')
    await page.selectOption('[data-testid="member-type-select"]', 'adult')
    await page.click('[data-testid="save-member-btn"]')
    
    // Verify member appears in list (stored locally)
    await expect(page.locator('text=Offline Member')).toBeVisible()
    
    // Verify sync pending indicator
    await expect(page.locator('[data-testid="sync-pending"]')).toBeVisible()
    
    // Go back online
    await context.setOffline(false)
    
    // Verify sync occurs
    await expect(page.locator('[data-testid="sync-success"]')).toBeVisible({ timeout: 10000 })
  })
})
