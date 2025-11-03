import { test, expect } from '@playwright/test'
import { loginUser, setupMobileViewport, simulateSlowNetwork, validateTouchFriendlyUI, generateTestData } from '../utils/test-helpers'
import { setupTestEnvironment, cleanupTestData } from '../utils/database-helpers'
import { memberFixtures, testScenarios } from '../fixtures/test-data'
import TEST_CONFIG from '../utils/test-config'

/**
 * Members Management Regression Test Suite
 * 
 * Comprehensive tests to ensure member management functionality
 * doesn't regress when new features are added. Covers member listing,
 * creation, editing, search, and mobile functionality.
 */

test.describe('Members Management Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestEnvironment(page)
    await loginUser(page, 'member')
    await page.goto('/members')
  })

  test.afterEach(async ({ page }) => {
    await cleanupTestData(page)
  })

  test.describe('Members List Display', () => {
    test('should display members list correctly', async ({ page }) => {
      // Check page header
      await expect(page.locator('text=Member Management')).toBeVisible()
      await expect(page.locator('button:has-text("Add Member")')).toBeVisible()

      // Check search functionality
      await expect(page.locator('input[placeholder*="Search"]')).toBeVisible()

      // Check members table/list
      await expect(page.locator('text=John Doe')).toBeVisible()
      await expect(page.locator('text=Jane Doe')).toBeVisible()
      await expect(page.locator('text=Visitor Guest')).toBeVisible()

      // Check member details
      await expect(page.locator('text=john.doe@example.com')).toBeVisible()
      await expect(page.locator('text=+234-804-123-4567')).toBeVisible()
    })

    test('should display member cards with correct information', async ({ page }) => {
      // Check first member card (John Doe)
      const johnCard = page.locator('text=John Doe').locator('..')
      await expect(johnCard.locator('text=john.doe@example.com')).toBeVisible()
      await expect(johnCard.locator('text=+234-804-123-4567')).toBeVisible()
      await expect(johnCard.locator('text=Member')).toBeVisible()

      // Check action buttons
      await expect(johnCard.locator('button:has-text("Edit"), button[aria-label="Edit"]')).toBeVisible()
      await expect(johnCard.locator('button:has-text("View"), button[aria-label="View"]')).toBeVisible()
    })

    test('should handle empty members list', async ({ page }) => {
      // Mock empty response
      await page.route('**/api/members', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [],
            meta: { current_page: 1, per_page: 15, total: 0, last_page: 1 }
          })
        })
      })

      await page.reload()

      // Should show empty state
      await expect(page.locator('text=No members found')).toBeVisible()
      await expect(page.locator('text=Add your first member')).toBeVisible()
      await expect(page.locator('button:has-text("Add Member")')).toBeVisible()
    })

    test('should display pagination when needed', async ({ page }) => {
      // Mock response with many members
      const manyMembers = Array.from({ length: 50 }, (_, i) => ({
        ...memberFixtures.johnDoe,
        id: i + 1,
        first_name: `Member${i + 1}`,
        email: `member${i + 1}@example.com`
      }))

      await page.route('**/api/members', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: manyMembers.slice(0, 15), // First page
            meta: { current_page: 1, per_page: 15, total: 50, last_page: 4 }
          })
        })
      })

      await page.reload()

      // Should show pagination
      await expect(page.locator('text=Page 1 of 4')).toBeVisible()
      await expect(page.locator('button:has-text("Next")')).toBeVisible()
      await expect(page.locator('button:has-text("Previous")')).toBeDisabled()
    })
  })

  test.describe('Member Search and Filtering', () => {
    test('should search members by name', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="Search"]')
      
      // Search for John
      await searchInput.fill('John')
      await page.keyboard.press('Enter')

      // Should show only John Doe
      await expect(page.locator('text=John Doe')).toBeVisible()
      await expect(page.locator('text=Jane Doe')).toBeHidden()
      await expect(page.locator('text=Visitor Guest')).toBeHidden()
    })

    test('should search members by email', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="Search"]')
      
      // Search by email
      await searchInput.fill('jane.doe@example.com')
      await page.keyboard.press('Enter')

      // Should show only Jane Doe
      await expect(page.locator('text=Jane Doe')).toBeVisible()
      await expect(page.locator('text=John Doe')).toBeHidden()
    })

    test('should filter members by type', async ({ page }) => {
      // Check if filter dropdown exists
      const filterButton = page.locator('button:has-text("Filter"), select[name="member_type"]')
      
      if (await filterButton.isVisible()) {
        await filterButton.click()
        await page.click('text=Visitor')

        // Should show only visitors
        await expect(page.locator('text=Visitor Guest')).toBeVisible()
        await expect(page.locator('text=John Doe')).toBeHidden()
        await expect(page.locator('text=Jane Doe')).toBeHidden()
      }
    })

    test('should handle no search results', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="Search"]')
      
      // Search for non-existent member
      await searchInput.fill('NonExistentMember')
      await page.keyboard.press('Enter')

      // Should show no results message
      await expect(page.locator('text=No members found')).toBeVisible()
      await expect(page.locator('text=Try adjusting your search')).toBeVisible()
    })

    test('should clear search results', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="Search"]')
      
      // Search for John
      await searchInput.fill('John')
      await page.keyboard.press('Enter')
      await expect(page.locator('text=John Doe')).toBeVisible()

      // Clear search
      await searchInput.clear()
      await page.keyboard.press('Enter')

      // Should show all members again
      await expect(page.locator('text=John Doe')).toBeVisible()
      await expect(page.locator('text=Jane Doe')).toBeVisible()
      await expect(page.locator('text=Visitor Guest')).toBeVisible()
    })
  })

  test.describe('Add New Member', () => {
    test('should display add member form correctly', async ({ page }) => {
      await page.click('button:has-text("Add Member")')
      await expect(page).toHaveURL('/members/add')

      // Check form fields
      await expect(page.locator('input[name="first_name"], input[placeholder*="First"]')).toBeVisible()
      await expect(page.locator('input[name="last_name"], input[placeholder*="Last"]')).toBeVisible()
      await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible()
      await expect(page.locator('input[name="phone"], input[placeholder*="Phone"]')).toBeVisible()
      await expect(page.locator('input[name="date_of_birth"], input[type="date"]')).toBeVisible()
      await expect(page.locator('select[name="gender"]')).toBeVisible()
      await expect(page.locator('select[name="member_type"]')).toBeVisible()

      // Check form buttons
      await expect(page.locator('button:has-text("Save Member")')).toBeVisible()
      await expect(page.locator('button:has-text("Cancel")')).toBeVisible()
    })

    test('should create new member successfully', async ({ page }) => {
      await page.click('button:has-text("Add Member")')
      
      const newMember = testScenarios.memberCreation

      // Fill form
      await page.fill('input[name="first_name"], input[placeholder*="First"]', newMember.first_name)
      await page.fill('input[name="last_name"], input[placeholder*="Last"]', newMember.last_name)
      await page.fill('input[name="email"], input[type="email"]', newMember.email)
      await page.fill('input[name="phone"], input[placeholder*="Phone"]', newMember.phone)
      await page.fill('input[name="date_of_birth"], input[type="date"]', newMember.date_of_birth)
      await page.selectOption('select[name="gender"]', newMember.gender)
      await page.selectOption('select[name="member_type"]', newMember.member_type)

      // Submit form
      await page.click('button:has-text("Save Member")')

      // Should redirect to members list
      await expect(page).toHaveURL('/members')
      
      // Should show success message
      await expect(page.locator('text=Member created successfully')).toBeVisible()
      
      // Should show new member in list
      await expect(page.locator(`text=${newMember.first_name} ${newMember.last_name}`)).toBeVisible()
    })

    test('should validate required fields', async ({ page }) => {
      await page.click('button:has-text("Add Member")')

      // Try to submit empty form
      await page.click('button:has-text("Save Member")')

      // Should show validation errors
      await expect(page.locator('text=First name is required')).toBeVisible()
      await expect(page.locator('text=Last name is required')).toBeVisible()
      await expect(page.locator('text=Email is required')).toBeVisible()
    })

    test('should validate email format', async ({ page }) => {
      await page.click('button:has-text("Add Member")')

      // Fill form with invalid email
      await page.fill('input[name="first_name"], input[placeholder*="First"]', 'Test')
      await page.fill('input[name="last_name"], input[placeholder*="Last"]', 'User')
      await page.fill('input[name="email"], input[type="email"]', 'invalid-email')

      await page.click('button:has-text("Save Member")')

      // Should show email validation error
      await expect(page.locator('text=Please enter a valid email')).toBeVisible()
    })

    test('should handle duplicate email error', async ({ page }) => {
      await page.click('button:has-text("Add Member")')

      // Fill form with existing email
      await page.fill('input[name="first_name"], input[placeholder*="First"]', 'Test')
      await page.fill('input[name="last_name"], input[placeholder*="Last"]', 'User')
      await page.fill('input[name="email"], input[type="email"]', memberFixtures.johnDoe.email)

      await page.click('button:has-text("Save Member")')

      // Should show duplicate email error
      await expect(page.locator('text=Email already exists')).toBeVisible()
    })
  })

  test.describe('CSV Import Functionality', () => {
    test('should open import dialog and download template', async ({ page }) => {
      // Click import button
      await page.click('button:has-text("Import")')

      // Verify import dialog opens
      await expect(page.locator('text=Import Members')).toBeVisible()
      await expect(page.locator('text=Upload a CSV file to import multiple members')).toBeVisible()

      // Test download template button
      const downloadPromise = page.waitForDownload()
      await page.click('button:has-text("Download Template")')
      const download = await downloadPromise

      // Verify download
      expect(download.suggestedFilename()).toBe('member_import_template.csv')

      // Close dialog
      await page.click('button:has-text("Cancel")')
      await expect(page.locator('text=Import Members')).not.toBeVisible()
    })

    test('should show import instructions', async ({ page }) => {
      // Open import dialog
      await page.click('button:has-text("Import")')

      // Expand import instructions
      await page.click('text=Import Instructions')

      // Verify instructions content
      await expect(page.locator('text=Required columns:')).toBeVisible()
      await expect(page.locator('text=first_name')).toBeVisible()
      await expect(page.locator('text=last_name')).toBeVisible()
      await expect(page.locator('text=email')).toBeVisible()
      await expect(page.locator('text=Optional columns:')).toBeVisible()
      await expect(page.locator('text=Duplicate emails will be skipped')).toBeVisible()
      await expect(page.locator('text=Maximum file size: 10MB')).toBeVisible()
    })

    test('should validate file selection', async ({ page }) => {
      // Open import dialog
      await page.click('button:has-text("Import")')

      // Try to import without selecting file
      await page.click('button:has-text("Import")')

      // Should show validation message
      await expect(page.locator('text=Please select a CSV file to import')).toBeVisible()

      // Import button should be disabled when no file selected
      const importButton = page.locator('button:has-text("Import")')
      await expect(importButton).toBeDisabled()
    })

    test('should handle successful CSV import', async ({ page }) => {
      // Create test CSV content
      const csvContent = `first_name,last_name,email,phone,gender
Test,User1,test.user1@example.com,+234-804-123-4567,male
Test,User2,test.user2@example.com,+234-804-123-4568,female`

      // Open import dialog
      await page.click('button:has-text("Import")')

      // Upload CSV file
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles({
        name: 'test-members.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from(csvContent)
      })

      // Verify file is selected
      await expect(page.locator('text=test-members.csv')).toBeVisible()

      // Import button should be enabled
      const importButton = page.locator('button:has-text("Import")')
      await expect(importButton).toBeEnabled()

      // Click import
      await importButton.click()

      // Wait for import to complete
      await expect(page.locator('text=Import completed!')).toBeVisible({ timeout: 10000 })

      // Verify success message
      await expect(page.locator('text=2 members imported')).toBeVisible()

      // Verify dialog closes
      await expect(page.locator('text=Import Members')).not.toBeVisible()

      // Verify new members appear in list
      await expect(page.locator('text=Test User1')).toBeVisible()
      await expect(page.locator('text=Test User2')).toBeVisible()
      await expect(page.locator('text=test.user1@example.com')).toBeVisible()
      await expect(page.locator('text=test.user2@example.com')).toBeVisible()
    })

    test('should handle CSV import errors', async ({ page }) => {
      // Create invalid CSV content (missing required headers)
      const csvContent = `name,contact
Invalid User,invalid@example.com`

      // Open import dialog
      await page.click('button:has-text("Import")')

      // Upload invalid CSV file
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles({
        name: 'invalid-members.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from(csvContent)
      })

      // Click import
      await page.click('button:has-text("Import")')

      // Wait for error message
      await expect(page.locator('text=Missing required headers')).toBeVisible({ timeout: 10000 })

      // Verify specific error details
      await expect(page.locator('text=first_name, last_name')).toBeVisible()
    })

    test('should handle duplicate email detection', async ({ page }) => {
      // Create CSV with duplicate email (john.doe@example.com already exists)
      const csvContent = `first_name,last_name,email
John,Doe,john.doe@example.com
New,User,new.user@example.com`

      // Open import dialog
      await page.click('button:has-text("Import")')

      // Upload CSV file
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles({
        name: 'duplicate-test.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from(csvContent)
      })

      // Click import
      await page.click('button:has-text("Import")')

      // Wait for import to complete
      await expect(page.locator('text=Import completed!')).toBeVisible({ timeout: 10000 })

      // Should show 1 imported, 1 skipped
      await expect(page.locator('text=1 members imported, 1 skipped')).toBeVisible()

      // Should show detailed results dialog
      await expect(page.locator('text=Import Results')).toBeVisible()
      await expect(page.locator('text=already exists')).toBeVisible()

      // Close results dialog
      await page.click('button:has-text("Close")')
    })

    test('should show loading state during import', async ({ page }) => {
      // Create large CSV to test loading state
      let csvContent = 'first_name,last_name,email\n'
      for (let i = 1; i <= 50; i++) {
        csvContent += `User${i},Test${i},user${i}@example.com\n`
      }

      // Open import dialog
      await page.click('button:has-text("Import")')

      // Upload CSV file
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles({
        name: 'large-import.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from(csvContent)
      })

      // Click import
      const importButton = page.locator('button:has-text("Import")')
      await importButton.click()

      // Verify loading state
      await expect(importButton).toHaveAttribute('loading', '')
      await expect(page.locator('button:has-text("Cancel")')).toBeDisabled()

      // Wait for completion
      await expect(page.locator('text=Import completed!')).toBeVisible({ timeout: 15000 })
    })
  })
})
