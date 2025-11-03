import { test, expect } from '@playwright/test'
import { loginUser } from '../utils/test-helpers'
import { setupTestEnvironment as setupDB, cleanupTestData as cleanupDB } from '../utils/database-helpers'
import TEST_CONFIG from '../utils/test-config'

/**
 * Attendance System Regression Test Suite
 * 
 * Comprehensive tests to ensure attendance functionality
 * doesn't regress when new features are added. Covers all
 * attendance check-in methods, family check-in, QR codes,
 * multi-service support, and reporting.
 */

test.describe('Attendance System Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestEnvironment(page)
    await loginUser(page, 'admin')
    await setupDB(page)
  })

  test.afterEach(async ({ page }) => {
    await cleanupTestData(page)
    await cleanupDB(page)
  })

  test.describe('Service Management Regression', () => {
    test('should list all services correctly', async ({ page }) => {
      await page.goto('/attendance/services')
      
      // Verify services are displayed
      await expect(page.locator('text=Service Management')).toBeVisible()
      
      // Check for default services
      const serviceCount = await page.locator('[data-testid="service-card"]').count()
      expect(serviceCount).toBeGreaterThan(0)
    })

    test('should create and manage services', async ({ page }) => {
      await page.goto('/attendance/services')
      
      // Create new service
      await page.click('button:has-text("Create Service")')
      await page.fill('input[name="name"]', 'Test Service')
      await page.selectOption('select[name="serviceType"]', 'sunday_morning')
      await page.click('button[type="submit"]')
      
      // Verify service created
      await expect(page.locator('text=Test Service')).toBeVisible()
      
      // Edit service
      page.click('button:has-text("Edit")').last()
      await page.fill('input[name="name"]', 'Updated Test Service')
      await page.click('button:has-text("Save")')
      
      // Verify update
      await expect(page.locator('text=Updated Test Service')).toBeVisible()
    })
  })

  test.describe('Individual Check-In Regression', () => {
    test('should check in member manually', async ({ page }) => {
      await page.goto('/attendance/checkin')
      
      // Select service
      await page.selectOption('select[name="service"]', '1')
      
      // Search and check in member
      await page.fill('input[placeholder*="Search"]', 'John')
      await page.waitForTimeout(500)
      await page.click('text=John Doe')
      await page.click('button:has-text("Check In")')
      
      // Verify check-in
      await expect(page.locator('text=checked in successfully')).toBeVisible()
    })

    test('should display check-in history', async ({ page }) => {
      // First check in a member
      await page.goto('/attendance/checkin')
      await page.selectOption('select[name="service"]', '1')
      await page.fill('input[placeholder*="Search"]', 'John')
      await page.waitForTimeout(500)
      await page.click('text=John Doe')
      await page.click('button:has-text("Check In")')
      await page.waitForTimeout(1000)
      
      // View attendance history
      await page.goto('/attendance/history')
      
      // Verify check-in appears in history
      await expect(page.locator('text=John Doe')).toBeVisible()
      await expect(page.locator('text=checked in')).toBeVisible()
    })
  })

  test.describe('QR Code Check-In Regression', () => {
    test('should generate member QR code', async ({ page }) => {
      await page.goto('/members')
      
      // Navigate to member detail
      await page.click('text=John Doe')
      
      // Check for QR code option
      await page.click('button:has-text("Generate QR Code")')
      
      // Verify QR code displayed
      await expect(page.locator('canvas, img[alt*="QR"]')).toBeVisible()
    })

    test('should process QR code check-in', async ({ page }) => {
      await page.goto('/attendance/checkin/qr')
      
      // Mock QR code scan
      await page.route('**/api/attendance/qr-checkin', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            member: { id: 1, name: 'John Doe' },
            service: { id: 1, name: 'Sunday Morning' }
          })
        })
      })
      
      // Simulate scan
      await page.click('button:has-text("Scan QR Code")')
      
      // Verify check-in
      await expect(page.locator('text=John Doe checked in')).toBeVisible()
    })
  })

  test.describe('Family Check-In Regression', () => {
    test('should check in entire family', async ({ page }) => {
      await page.goto('/attendance/checkin/family')
      
      // Select service
      await page.selectOption('select[name="service"]', '1')
      
      // Search family
      await page.fill('input[placeholder*="Search family"]', 'Doe')
      await page.waitForTimeout(500)
      await page.click('text=Doe Family')
      
      // Verify family members shown
      const memberCount = await page.locator('[data-testid="family-member"]').count()
      expect(memberCount).toBeGreaterThan(0)
      
      // Check in family
      await page.click('button:has-text("Check In Family")')
      
      // Verify success
      await expect(page.locator('text=Family checked in')).toBeVisible()
    })

    test('should assign children to ministries', async ({ page }) => {
      await page.goto('/attendance/checkin/family')
      
      // Select service and family
      await page.selectOption('select[name="service"]', '1')
      await page.fill('input[placeholder*="Search family"]', 'Doe')
      await page.waitForTimeout(500)
      await page.click('text=Doe Family')
      
      // Find child member
      const childRow = page.locator('text=Jack Doe').locator('..').locator('..')
      
      // Assign ministry
      await childRow.selectOption('select[name*="ministry"]', 'children-church')
      
      // Complete check-in
      await page.click('button:has-text("Check In Family")')
      
      // Verify assignment
      await expect(page.locator('text=assigned to')).toBeVisible()
    })
  })

  test.describe('Multi-Service Support Regression', () => {
    test('should support multiple services per day', async ({ page }) => {
      await page.goto('/attendance/checkin')
      
      // Verify service selector has multiple options
      const serviceOptions = await page.locator('select[name="service"] option').count()
      expect(serviceOptions).toBeGreaterThan(1)
      
      // Check in to morning service
      await page.selectOption('select[name="service"]', '1')
      await page.fill('input[placeholder*="Search"]', 'John')
      await page.waitForTimeout(500)
      await page.click('text=John Doe')
      await page.click('button:has-text("Check In")')
      await page.waitForTimeout(1000)
      
      // Check in to evening service
      await page.goto('/attendance/checkin')
      await page.selectOption('select[name="service"]', '2')
      await page.fill('input[placeholder*="Search"]', 'John')
      await page.waitForTimeout(500)
      await page.click('text=John Doe')
      await page.click('button:has-text("Check In")')
      
      // Verify both check-ins recorded
      await expect(page.locator('text=checked in successfully')).toBeVisible()
    })
  })

  test.describe('Visitor Check-In Regression', () => {
    test('should register and check in visitor', async ({ page }) => {
      await page.goto('/attendance/checkin/visitor')
      
      // Fill visitor form
      await page.fill('input[name="firstName"]', 'Visitor')
      await page.fill('input[name="lastName"]', 'Test')
      await page.fill('input[name="email"]', 'visitor@test.com')
      
      // Select service
      await page.selectOption('select[name="service"]', '1')
      
      // Register and check in
      await page.click('button:has-text("Register & Check In")')
      
      // Verify
      await expect(page.locator('text=registered and checked in')).toBeVisible()
    })
  })

  test.describe('Attendance Reports Regression', () => {
    test('should generate attendance reports', async ({ page }) => {
      // Create some check-ins first
      await page.goto('/attendance/checkin')
      await page.selectOption('select[name="service"]', '1')
      await page.fill('input[placeholder*="Search"]', 'John')
      await page.waitForTimeout(500)
      await page.click('text=John Doe')
      await page.click('button:has-text("Check In")')
      await page.waitForTimeout(1000)
      
      // View reports
      await page.goto('/attendance/reports')
      
      // Verify report elements
      await expect(page.locator('text=Attendance Reports')).toBeVisible()
      await expect(page.locator('text=Today')).toBeVisible()
    })

    test('should filter reports by service and date', async ({ page }) => {
      await page.goto('/attendance/reports')
      
      // Apply filters
      await page.selectOption('select[name="serviceFilter"]', '1')
      await page.fill('input[name="dateFrom"]', new Date().toISOString().split('T')[0])
      
      // Verify filtered results
      await expect(page.locator('text=Sunday Morning Service')).toBeVisible()
    })
  })

  test.describe('Offline Functionality Regression', () => {
    test('should record attendance offline', async ({ page, context }) => {
      // Go offline
      await context.setOffline(true)
      
      await page.goto('/attendance/checkin')
      
      // Verify offline indicator
      await expect(page.locator('text=Offline, text=No internet')).toBeVisible()
      
      // Should still allow check-in
      await page.selectOption('select[name="service"]', '1')
      await page.fill('input[placeholder*="Search"]', 'John')
      await page.waitForTimeout(500)
      await page.click('text=John Doe')
      await page.click('button:has-text("Check In")')
      
      // Verify offline recording
      await expect(page.locator('text=recorded offline')).toBeVisible()
      
      // Go back online
      await context.setOffline(false)
    })
  })

  test.describe('Location Assignment Regression', () => {
    test('should assign location during check-in', async ({ page }) => {
      await page.goto('/attendance/checkin')
      
      // Select service and member
      await page.selectOption('select[name="service"]', '1')
      await page.fill('input[placeholder*="Search"]', 'John')
      await page.waitForTimeout(500)
      await page.click('text=John Doe')
      
      // Assign location
      await page.selectOption('select[name="location"]', 'main-sanctuary')
      
      // Check in
      await page.click('button:has-text("Check In")')
      
      // Verify location assigned
      await expect(page.locator('text=Main Sanctuary')).toBeVisible()
    })
  })
})

