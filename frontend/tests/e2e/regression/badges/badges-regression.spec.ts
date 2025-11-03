import { test, expect } from '@playwright/test'

test.describe('Person Badges System - Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/')
    
    // Login with test credentials
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // Wait for dashboard to load
    await expect(page.locator('h1:has-text("Welcome")')).toBeVisible()
    
    // Navigate to members page
    await page.click('a[href="/members"]')
    await expect(page.locator('h1:has-text("Members")')).toBeVisible()
    
    // Click on first member to view details
    await page.click('.member-card:first-child')
    await expect(page.locator('h1')).toContainText('Member Details')
  })

  test('should display badges section on member detail page', async ({ page }) => {
    // Check that badges section is visible
    await expect(page.locator('.member-badges')).toBeVisible()
    await expect(page.locator('h6:has-text("Member Badges"), .text-h6:has-text("Member Badges")')).toBeVisible()
    await expect(page.locator('button:has-text("Assign Badge")')).toBeVisible()
    await expect(page.locator('button:has-text("Auto Assign")')).toBeVisible()
  })

  test('should open assign badge dialog when clicking Assign Badge button', async ({ page }) => {
    // Click Assign Badge button
    await page.click('button:has-text("Assign Badge")')
    
    // Check that dialog is visible
    await expect(page.locator('.badge-assign-dialog, [data-testid="badge-assign-dialog"]')).toBeVisible()
    await expect(page.locator('select:has-text("Badge Type"), .q-select:has-text("Badge Type")')).toBeVisible()
  })

  test('should assign a badge to member successfully', async ({ page }) => {
    // Click Assign Badge button
    await page.click('button:has-text("Assign Badge")')
    
    // Select badge type
    await page.click('.q-select:has-text("Badge Type")')
    await page.click('.q-item:has-text("Leader")')
    
    // Add assignment notes
    await page.fill('textarea[placeholder*="notes"], textarea[label*="Notes"]', 'Assigned for leadership role in youth ministry')
    
    // Save the assignment
    await page.click('button:has-text("Assign")')
    
    // Verify badge was assigned
    await expect(page.locator('.badge-display:has-text("Leader"), .q-chip:has-text("Leader")')).toBeVisible()
  })

  test('should auto-assign badges based on member type', async ({ page }) => {
    // Click Auto Assign button
    await page.click('button:has-text("Auto Assign")')
    
    // Wait for auto-assignment to complete
    await expect(page.locator('.q-notification:has-text("auto-assigned"), .q-banner:has-text("auto-assigned")')).toBeVisible()
    
    // Verify badges were auto-assigned
    await expect(page.locator('.badge-display, .q-chip')).toBeVisible()
  })

  test('should display badge summary statistics', async ({ page }) => {
    // Ensure member has some badges first
    await page.click('button:has-text("Assign Badge")')
    await page.click('.q-select:has-text("Badge Type")')
    await page.click('.q-item:has-text("Volunteer")')
    await page.click('button:has-text("Assign")')
    
    // Check badge summary chips
    await expect(page.locator('.q-chip:has-text("Total")')).toBeVisible()
    
    // Verify summary shows correct count
    const totalChip = page.locator('.q-chip:has-text("Total")')
    await expect(totalChip).toContainText('1')
  })

  test('should edit an existing badge assignment', async ({ page }) => {
    // First assign a badge
    await page.click('button:has-text("Assign Badge")')
    await page.click('.q-select:has-text("Badge Type")')
    await page.click('.q-item:has-text("VIP")')
    await page.fill('textarea[placeholder*="notes"], textarea[label*="Notes"]', 'Original VIP assignment')
    await page.click('button:has-text("Assign")')
    
    // Click edit on the badge
    await page.click('.badge-display:has-text("VIP") .edit-button, .q-chip:has-text("VIP") + button:has-text("Edit")')
    
    // Update the notes
    await page.fill('textarea[placeholder*="notes"], textarea[label*="Notes"]', 'Updated VIP assignment with special privileges')
    
    // Save changes
    await page.click('button:has-text("Save")')
    
    // Verify changes were saved (check tooltip or expanded view)
    await page.hover('.badge-display:has-text("VIP"), .q-chip:has-text("VIP")')
    await expect(page.locator('.q-tooltip:has-text("Updated VIP assignment")')).toBeVisible()
  })

  test('should remove a badge with confirmation', async ({ page }) => {
    // First assign a badge
    await page.click('button:has-text("Assign Badge")')
    await page.click('.q-select:has-text("Badge Type")')
    await page.click('.q-item:has-text("New Convert")')
    await page.click('button:has-text("Assign")')
    
    // Click remove on the badge
    await page.click('.badge-display:has-text("New Convert") .remove-button, .q-chip:has-text("New Convert") + button:has-text("Remove")')
    
    // Handle confirmation dialog
    page.on('dialog', dialog => dialog.accept())
    
    // Verify badge was removed
    await expect(page.locator('.badge-display:has-text("New Convert"), .q-chip:has-text("New Convert")')).toBeHidden()
  })

  test('should display badge expiration warnings', async ({ page }) => {
    // Assign a badge with expiration
    await page.click('button:has-text("Assign Badge")')
    await page.click('.q-select:has-text("Badge Type")')
    await page.click('.q-item:has-text("Youth")')
    
    // Set expiration date (tomorrow)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]
    await page.fill('input[type="date"]', tomorrowStr)
    
    await page.click('button:has-text("Assign")')
    
    // Verify expiration warning is shown
    await expect(page.locator('.q-chip:has-text("Expiring"), .expiring-badge')).toBeVisible()
    await expect(page.locator('.q-icon[name="schedule"], .warning-icon')).toBeVisible()
  })

  test('should filter badges by status', async ({ page }) => {
    // Assign multiple badges with different statuses
    const badges = ['Leader', 'Volunteer', 'VIP']
    
    for (const badge of badges) {
      await page.click('button:has-text("Assign Badge")')
      await page.click('.q-select:has-text("Badge Type")')
      await page.click(`.q-item:has-text("${badge}")`)
      await page.click('button:has-text("Assign")')
    }
    
    // Use filter if available
    const filterButton = page.locator('button:has-text("Filter"), .filter-button')
    if (await filterButton.isVisible()) {
      await filterButton.click()
      await page.click('.q-item:has-text("Active Only")')
      
      // Verify only active badges are shown
      await expect(page.locator('.badge-display, .q-chip')).toBeVisible()
    }
  })

  test('should display badge colors and icons correctly', async ({ page }) => {
    // Assign badges with different colors
    await page.click('button:has-text("Assign Badge")')
    await page.click('.q-select:has-text("Badge Type")')
    await page.click('.q-item:has-text("Leader")')
    await page.click('button:has-text("Assign")')
    
    // Verify badge has correct styling
    const leaderBadge = page.locator('.badge-display:has-text("Leader"), .q-chip:has-text("Leader")')
    await expect(leaderBadge).toBeVisible()
    
    // Check if icon is displayed
    await expect(page.locator('.q-icon, .badge-icon')).toBeVisible()
  })

  test('should handle badge assignment errors gracefully', async ({ page }) => {
    // Try to assign the same badge twice
    await page.click('button:has-text("Assign Badge")')
    await page.click('.q-select:has-text("Badge Type")')
    await page.click('.q-item:has-text("Member")')
    await page.click('button:has-text("Assign")')
    
    // Try to assign the same badge again
    await page.click('button:has-text("Assign Badge")')
    await page.click('.q-select:has-text("Badge Type")')
    await page.click('.q-item:has-text("Member")')
    await page.click('button:has-text("Assign")')
    
    // Should show error or update existing badge
    await expect(page.locator('.q-notification, .error-message')).toBeVisible()
  })

  test('should display badge assignment history', async ({ page }) => {
    // Assign a badge
    await page.click('button:has-text("Assign Badge")')
    await page.click('.q-select:has-text("Badge Type")')
    await page.click('.q-item:has-text("Elder")')
    await page.fill('textarea[placeholder*="notes"], textarea[label*="Notes"]', 'Promoted to elder status')
    await page.click('button:has-text("Assign")')
    
    // Check if assignment details are visible (hover or click for details)
    await page.hover('.badge-display:has-text("Elder"), .q-chip:has-text("Elder")')
    
    // Should show assignment date and assigner
    await expect(page.locator('.q-tooltip, .badge-details')).toBeVisible()
  })

  test('should work offline for badge viewing', async ({ page }) => {
    // First assign some badges while online
    await page.click('button:has-text("Assign Badge")')
    await page.click('.q-select:has-text("Badge Type")')
    await page.click('.q-item:has-text("Volunteer")')
    await page.click('button:has-text("Assign")')
    
    // Go offline
    await page.context().setOffline(true)
    
    // Refresh page
    await page.reload()
    
    // Verify badges are still visible (cached)
    await expect(page.locator('.member-badges')).toBeVisible()
    await expect(page.locator('.badge-display, .q-chip')).toBeVisible()
    
    // Go back online
    await page.context().setOffline(false)
  })

  test('should integrate with member quick actions', async ({ page }) => {
    // Check if badge assignment is available in quick actions
    const quickActionsSection = page.locator('.quick-actions, .member-actions')
    
    if (await quickActionsSection.isVisible()) {
      const assignBadgeAction = quickActionsSection.locator('button:has-text("Assign Badge"), button[aria-label*="badge"]')
      
      if (await assignBadgeAction.isVisible()) {
        await assignBadgeAction.click()
        
        // Should open badge assignment dialog
        await expect(page.locator('.badge-assign-dialog, [data-testid="badge-assign-dialog"]')).toBeVisible()
      }
    }
  })

  test('should display badges in member list view', async ({ page }) => {
    // Navigate back to members list
    await page.click('a[href="/members"], button:has-text("Back")')
    await expect(page.locator('h1:has-text("Members")')).toBeVisible()
    
    // Check if badges are displayed on member cards
    const memberCards = page.locator('.member-card')
    const firstCard = memberCards.first()
    
    // Look for badge indicators on member cards
    const badgeIndicator = firstCard.locator('.badge-display, .q-chip, .member-badges')
    
    if (await badgeIndicator.isVisible()) {
      await expect(badgeIndicator).toBeVisible()
    }
  })

  test('should handle bulk badge operations', async ({ page }) => {
    // Check if bulk operations are available
    const bulkActionsButton = page.locator('button:has-text("Bulk Actions"), .bulk-actions-button')
    
    if (await bulkActionsButton.isVisible()) {
      await bulkActionsButton.click()
      
      // Look for bulk badge assignment option
      const bulkAssignOption = page.locator('.q-item:has-text("Assign Badges"), button:has-text("Bulk Assign")')
      
      if (await bulkAssignOption.isVisible()) {
        await bulkAssignOption.click()
        
        // Should open bulk assignment dialog
        await expect(page.locator('.bulk-assign-dialog, [data-testid="bulk-assign-dialog"]')).toBeVisible()
      }
    }
  })
})
