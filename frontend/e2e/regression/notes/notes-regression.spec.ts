import { test, expect } from '@playwright/test'

test.describe('Member Notes System - Regression Tests', () => {
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

  test('should display notes section on member detail page', async ({ page }) => {
    // Check that notes section is visible
    await expect(page.locator('.member-notes')).toBeVisible()
    await expect(page.locator('h3:has-text("Notes")')).toBeVisible()
    await expect(page.locator('button:has-text("Add Note")')).toBeVisible()
  })

  test('should open add note dialog when clicking Add Note button', async ({ page }) => {
    // Click Add Note button
    await page.click('button:has-text("Add Note")')
    
    // Check that dialog is visible
    await expect(page.locator('.note-dialog')).toBeVisible()
    await expect(page.locator('input[placeholder*="title"], input[label*="Title"]')).toBeVisible()
    await expect(page.locator('textarea[placeholder*="content"], textarea[label*="Content"]')).toBeVisible()
  })

  test('should create a new note successfully', async ({ page }) => {
    // Click Add Note button
    await page.click('button:has-text("Add Note")')
    
    // Fill in note details
    await page.fill('input[placeholder*="title"], input[label*="Title"]', 'Test Note Title')
    await page.fill('textarea[placeholder*="content"], textarea[label*="Content"]', 'This is a test note content for regression testing.')
    
    // Select note type
    await page.click('.q-select:has-text("Note Type")')
    await page.click('.q-item:has-text("Personal Note")')
    
    // Select privacy level
    await page.click('.q-select:has-text("Privacy Level")')
    await page.click('.q-item:has-text("Public")')
    
    // Save the note
    await page.click('button:has-text("Save")')
    
    // Verify note was created
    await expect(page.locator('.note-card:has-text("Test Note Title")')).toBeVisible()
    await expect(page.locator('.note-card:has-text("This is a test note content")')).toBeVisible()
  })

  test('should create an alert note with expiration', async ({ page }) => {
    // Click Add Note button
    await page.click('button:has-text("Add Note")')
    
    // Fill in note details
    await page.fill('input[placeholder*="title"], input[label*="Title"]', 'Alert Note')
    await page.fill('textarea[placeholder*="content"], textarea[label*="Content"]', 'This is an important alert that needs attention.')
    
    // Select Emergency note type
    await page.click('.q-select:has-text("Note Type")')
    await page.click('.q-item:has-text("Emergency")')
    
    // Mark as alert
    await page.check('input[type="checkbox"]:near(:text("Alert"))')
    
    // Set expiration date (tomorrow)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]
    await page.fill('input[type="date"]', tomorrowStr)
    
    // Save the note
    await page.click('button:has-text("Save")')
    
    // Verify alert note appears in alerts section
    await expect(page.locator('.alerts-section')).toBeVisible()
    await expect(page.locator('.alert-note:has-text("Alert Note")')).toBeVisible()
    
    // Verify alert badge is shown in header
    await expect(page.locator('.notes-header .q-badge')).toBeVisible()
    await expect(page.locator('.notes-header .q-badge')).toContainText('1')
  })

  test('should create a pinned note', async ({ page }) => {
    // Click Add Note button
    await page.click('button:has-text("Add Note")')
    
    // Fill in note details
    await page.fill('input[placeholder*="title"], input[label*="Title"]', 'Pinned Note')
    await page.fill('textarea[placeholder*="content"], textarea[label*="Content"]', 'This note should be pinned to the top.')
    
    // Mark as pinned
    await page.check('input[type="checkbox"]:near(:text("Pinned"))')
    
    // Save the note
    await page.click('button:has-text("Save")')
    
    // Verify pinned note appears in pinned section
    await expect(page.locator('.pinned-section')).toBeVisible()
    await expect(page.locator('.pinned-note:has-text("Pinned Note")')).toBeVisible()
  })

  test('should filter notes by type', async ({ page }) => {
    // Ensure we have some notes first
    await page.click('button:has-text("Add Note")')
    await page.fill('input[placeholder*="title"], input[label*="Title"]', 'Personal Note')
    await page.fill('textarea[placeholder*="content"], textarea[label*="Content"]', 'Personal content')
    await page.click('.q-select:has-text("Note Type")')
    await page.click('.q-item:has-text("Personal Note")')
    await page.click('button:has-text("Save")')
    
    // Add another note with different type
    await page.click('button:has-text("Add Note")')
    await page.fill('input[placeholder*="title"], input[label*="Title"]', 'Follow-up Note')
    await page.fill('textarea[placeholder*="content"], textarea[label*="Content"]', 'Follow-up content')
    await page.click('.q-select:has-text("Note Type")')
    await page.click('.q-item:has-text("Follow-up")')
    await page.click('button:has-text("Save")')
    
    // Filter by Personal Note type
    await page.click('.notes-filters .q-select:has-text("Note Type")')
    await page.click('.q-item:has-text("Personal Note")')
    
    // Verify only personal notes are shown
    await expect(page.locator('.note-card:has-text("Personal Note")')).toBeVisible()
    await expect(page.locator('.note-card:has-text("Follow-up Note")')).toBeHidden()
    
    // Clear filter
    await page.click('.notes-filters .q-select:has-text("Personal Note") .q-icon:has-text("clear")')
    
    // Verify both notes are shown again
    await expect(page.locator('.note-card:has-text("Personal Note")')).toBeVisible()
    await expect(page.locator('.note-card:has-text("Follow-up Note")')).toBeVisible()
  })

  test('should search notes by content', async ({ page }) => {
    // Ensure we have some notes first
    await page.click('button:has-text("Add Note")')
    await page.fill('input[placeholder*="title"], input[label*="Title"]', 'Searchable Note')
    await page.fill('textarea[placeholder*="content"], textarea[label*="Content"]', 'This note contains unique search terms')
    await page.click('button:has-text("Save")')
    
    // Search for specific content
    await page.fill('.notes-filters input[placeholder*="search"], input[label*="Search"]', 'unique search terms')
    
    // Verify filtered results
    await expect(page.locator('.note-card:has-text("Searchable Note")')).toBeVisible()
    
    // Clear search
    await page.fill('.notes-filters input[placeholder*="search"], input[label*="Search"]', '')
    
    // Verify all notes are shown again
    await expect(page.locator('.note-card')).toBeVisible()
  })

  test('should edit an existing note', async ({ page }) => {
    // Create a note first
    await page.click('button:has-text("Add Note")')
    await page.fill('input[placeholder*="title"], input[label*="Title"]', 'Original Title')
    await page.fill('textarea[placeholder*="content"], textarea[label*="Content"]', 'Original content')
    await page.click('button:has-text("Save")')
    
    // Click edit button on the note
    await page.click('.note-card:has-text("Original Title") .edit-button, .note-card:has-text("Original Title") button:has-text("Edit")')
    
    // Update the note
    await page.fill('input[placeholder*="title"], input[label*="Title"]', 'Updated Title')
    await page.fill('textarea[placeholder*="content"], textarea[label*="Content"]', 'Updated content')
    
    // Save changes
    await page.click('button:has-text("Save")')
    
    // Verify changes were saved
    await expect(page.locator('.note-card:has-text("Updated Title")')).toBeVisible()
    await expect(page.locator('.note-card:has-text("Updated content")')).toBeVisible()
    await expect(page.locator('.note-card:has-text("Original Title")')).toBeHidden()
  })

  test('should delete a note with confirmation', async ({ page }) => {
    // Create a note first
    await page.click('button:has-text("Add Note")')
    await page.fill('input[placeholder*="title"], input[label*="Title"]', 'Note to Delete')
    await page.fill('textarea[placeholder*="content"], textarea[label*="Content"]', 'This note will be deleted')
    await page.click('button:has-text("Save")')
    
    // Click delete button on the note
    await page.click('.note-card:has-text("Note to Delete") .delete-button, .note-card:has-text("Note to Delete") button:has-text("Delete")')
    
    // Handle confirmation dialog
    page.on('dialog', dialog => dialog.accept())
    
    // Verify note was deleted
    await expect(page.locator('.note-card:has-text("Note to Delete")')).toBeHidden()
  })

  test('should display privacy level indicators', async ({ page }) => {
    // Create notes with different privacy levels
    const privacyLevels = ['Public', 'Private', 'Extreme']
    
    for (const level of privacyLevels) {
      await page.click('button:has-text("Add Note")')
      await page.fill('input[placeholder*="title"], input[label*="Title"]', `${level} Note`)
      await page.fill('textarea[placeholder*="content"], textarea[label*="Content"]', `This is a ${level.toLowerCase()} note`)
      
      // Select privacy level
      await page.click('.q-select:has-text("Privacy Level")')
      await page.click(`.q-item:has-text("${level}")`)
      
      await page.click('button:has-text("Save")')
    }
    
    // Verify privacy level badges are displayed
    await expect(page.locator('.note-card:has-text("Public Note") .privacy-badge')).toBeVisible()
    await expect(page.locator('.note-card:has-text("Private Note") .privacy-badge')).toBeVisible()
    await expect(page.locator('.note-card:has-text("Extreme Note") .privacy-badge')).toBeVisible()
  })

  test('should handle offline note creation', async ({ page }) => {
    // Go offline
    await page.context().setOffline(true)
    
    // Try to create a note
    await page.click('button:has-text("Add Note")')
    await page.fill('input[placeholder*="title"], input[label*="Title"]', 'Offline Note')
    await page.fill('textarea[placeholder*="content"], textarea[label*="Content"]', 'Created while offline')
    await page.click('button:has-text("Save")')
    
    // Verify offline indicator or message
    await expect(page.locator('.offline-indicator, .offline-message')).toBeVisible()
    
    // Go back online
    await page.context().setOffline(false)
    
    // Verify note syncs when back online
    await page.reload()
    await expect(page.locator('.note-card:has-text("Offline Note")')).toBeVisible()
  })
})
