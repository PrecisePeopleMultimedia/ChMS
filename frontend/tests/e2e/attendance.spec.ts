import { test, expect } from '@playwright/test'

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123'
}

const testMember = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+234-804-123-4567'
}

const testFamily = {
  familyName: 'Doe Family',
  members: [
    { firstName: 'John', lastName: 'Doe', age: 35 },
    { firstName: 'Jane', lastName: 'Doe', age: 32 },
    { firstName: 'Jack', lastName: 'Doe', age: 8 }
  ]
}

const testService = {
  name: 'Sunday Morning Service',
  serviceType: 'sunday_morning',
  scheduledDate: new Date().toISOString().split('T')[0],
  startTime: '09:00',
  endTime: '12:00'
}

test.describe('Attendance System E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate and login
    await page.goto('/login')
    await page.fill('input[type="email"]', testUser.email)
    await page.fill('input[type="password"]', testUser.password)
    await page.click('button:has-text("Sign In")')
    await expect(page).toHaveURL('/dashboard')
  })

  test.describe('Service Management', () => {
    test('should display services list correctly', async ({ page }) => {
      await page.goto('/attendance/services')
      
      // Check page header
      await expect(page.locator('text=Service Management')).toBeVisible()
      await expect(page.locator('button:has-text("Create Service")')).toBeVisible()
      
      // Check service list
      await expect(page.locator('text=Sunday Morning Service')).toBeVisible()
      await expect(page.locator('text=Sunday Evening Service')).toBeVisible()
      await expect(page.locator('text=Midweek Service')).toBeVisible()
    })

    test('should create a new service', async ({ page }) => {
      await page.goto('/attendance/services')
      
      // Click create service button
      await page.click('button:has-text("Create Service")')
      
      // Fill service form
      await page.fill('input[name="name"]', testService.name)
      await page.selectOption('select[name="serviceType"]', testService.serviceType)
      await page.fill('input[name="scheduledDate"]', testService.scheduledDate)
      await page.fill('input[name="startTime"]', testService.startTime)
      await page.fill('input[name="endTime"]', testService.endTime)
      
      // Submit form
      await page.click('button[type="submit"]')
      
      // Verify service created
      await expect(page.locator(`text=${testService.name}`)).toBeVisible()
    })

    test('should edit an existing service', async ({ page }) => {
      await page.goto('/attendance/services')
      
      // Click edit on first service
      page.click('button:has-text("Edit")').first()
      
      // Update service name
      await page.fill('input[name="name"]', 'Updated Sunday Service')
      
      // Save changes
      await page.click('button:has-text("Save")')
      
      // Verify update
      await expect(page.locator('text=Updated Sunday Service')).toBeVisible()
    })
  })

  test.describe('Individual Member Check-In', () => {
    test('should check in a member manually', async ({ page }) => {
      await page.goto('/attendance/checkin')
      
      // Select service
      await page.selectOption('select[name="service"]', '1')
      
      // Search for member
      await page.fill('input[placeholder*="Search member"]', 'John Doe')
      await page.waitForTimeout(500) // Wait for search results
      
      // Select member from results
      await page.click('text=John Doe')
      
      // Click check-in button
      await page.click('button:has-text("Check In")')
      
      // Verify success message
      await expect(page.locator('text=Member checked in successfully')).toBeVisible()
    })

    test('should display check-in confirmation', async ({ page }) => {
      await page.goto('/attendance/checkin')
      
      // Perform check-in (mocked)
      await page.selectOption('select[name="service"]', '1')
      await page.fill('input[placeholder*="Search member"]', 'John Doe')
      await page.waitForTimeout(500)
      await page.click('text=John Doe')
      await page.click('button:has-text("Check In")')
      
      // Check confirmation details
      await expect(page.locator('text=Check-In Confirmation')).toBeVisible()
      await expect(page.locator('text=John Doe')).toBeVisible()
      await expect(page.locator('text=Sunday Morning Service')).toBeVisible()
    })
  })

  test.describe('QR Code Check-In', () => {
    test('should display QR code scanner', async ({ page }) => {
      await page.goto('/attendance/checkin/qr')
      
      // Check scanner interface
      await expect(page.locator('text=QR Code Scanner')).toBeVisible()
      await expect(page.locator('video')).toBeVisible() // Camera feed
      await expect(page.locator('button:has-text("Scan QR Code")')).toBeVisible()
    })

    test('should process QR code check-in', async ({ page }) => {
      await page.goto('/attendance/checkin/qr')
      
      // Mock QR code scan (simulate successful scan)
      await page.route('**/api/attendance/qr-checkin', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            member: { id: 1, name: 'John Doe' },
            service: { id: 1, name: 'Sunday Morning Service' },
            checked_in_at: new Date().toISOString()
          })
        })
      })
      
      // Simulate QR code scan
      await page.click('button:has-text("Scan QR Code")')
      
      // Verify check-in success
      await expect(page.locator('text=John Doe checked in successfully')).toBeVisible()
    })

    test('should handle invalid QR code', async ({ page }) => {
      await page.goto('/attendance/checkin/qr')
      
      // Mock invalid QR code response
      await page.route('**/api/attendance/qr-checkin', async route => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Invalid QR code'
          })
        })
      })
      
      // Simulate invalid scan
      await page.click('button:has-text("Scan QR Code")')
      
      // Verify error message
      await expect(page.locator('text=Invalid QR code')).toBeVisible()
    })
  })

  test.describe('Family Check-In', () => {
    test('should display family check-in form', async ({ page }) => {
      await page.goto('/attendance/checkin/family')
      
      // Check form elements
      await expect(page.locator('text=Family Check-In')).toBeVisible()
      await expect(page.locator('input[placeholder*="Search family"]')).toBeVisible()
      await expect(page.locator('select[name="service"]')).toBeVisible()
    })

    test('should check in entire family', async ({ page }) => {
      await page.goto('/attendance/checkin/family')
      
      // Select service
      await page.selectOption('select[name="service"]', '1')
      
      // Search for family
      await page.fill('input[placeholder*="Search family"]', 'Doe Family')
      await page.waitForTimeout(500)
      
      // Select family
      await page.click('text=Doe Family')
      
      // Verify family members displayed
      await expect(page.locator('text=John Doe')).toBeVisible()
      await expect(page.locator('text=Jane Doe')).toBeVisible()
      await expect(page.locator('text=Jack Doe')).toBeVisible()
      
      // Check in family
      await page.click('button:has-text("Check In Family")')
      
      // Verify success
      await expect(page.locator('text=Family checked in successfully')).toBeVisible()
    })

    test('should assign children to ministries during family check-in', async ({ page }) => {
      await page.goto('/attendance/checkin/family')
      
      // Select service
      await page.selectOption('select[name="service"]', '1')
      
      // Search and select family
      await page.fill('input[placeholder*="Search family"]', 'Doe Family')
      await page.waitForTimeout(500)
      await page.click('text=Doe Family')
      
      // Check child ministry assignment
      const jackRow = page.locator('text=Jack Doe').locator('..')
      await expect(jackRow.locator('select[name*="ministry"]')).toBeVisible()
      
      // Assign child to ministry
      await jackRow.selectOption('select[name*="ministry"]', 'children-church')
      
      // Complete check-in
      await page.click('button:has-text("Check In Family")')
      
      // Verify ministry assignment
      await expect(page.locator('text=Jack Doe assigned to Children\'s Church')).toBeVisible()
    })

    test('should display family QR code option', async ({ page }) => {
      await page.goto('/attendance/checkin/family')
      
      // Check QR code option
      await expect(page.locator('button:has-text("Use Family QR Code")')).toBeVisible()
      
      // Click QR code option
      await page.click('button:has-text("Use Family QR Code")')
      
      // Verify QR scanner for family
      await expect(page.locator('text=Family QR Code Scanner')).toBeVisible()
    })
  })

  test.describe('Multi-Service Attendance', () => {
    test('should display multiple services for selection', async ({ page }) => {
      await page.goto('/attendance/checkin')
      
      // Check service selector
      const serviceSelect = page.locator('select[name="service"]')
      await expect(serviceSelect).toBeVisible()
      
      // Verify multiple services available
      const options = await serviceSelect.locator('option').all()
      expect(options.length).toBeGreaterThan(1)
      
      // Check service types
      await expect(serviceSelect.locator('option:has-text("Sunday Morning")')).toBeVisible()
      await expect(serviceSelect.locator('option:has-text("Sunday Evening")')).toBeVisible()
      await expect(serviceSelect.locator('option:has-text("Midweek")')).toBeVisible()
    })

    test('should check in member to specific service', async ({ page }) => {
      await page.goto('/attendance/checkin')
      
      // Select evening service
      await page.selectOption('select[name="service"]', '2') // Evening service
      
      // Search and check in member
      await page.fill('input[placeholder*="Search member"]', 'John Doe')
      await page.waitForTimeout(500)
      await page.click('text=John Doe')
      await page.click('button:has-text("Check In")')
      
      // Verify service-specific check-in
      await expect(page.locator('text=Checked in to Sunday Evening Service')).toBeVisible()
    })
  })

  test.describe('Visitor Registration and Check-In', () => {
    test('should register and check in a visitor', async ({ page }) => {
      await page.goto('/attendance/checkin/visitor')
      
      // Fill visitor form
      await page.fill('input[name="firstName"]', 'Visitor')
      await page.fill('input[name="lastName"]', 'Guest')
      await page.fill('input[name="email"]', 'visitor@example.com')
      await page.fill('input[name="phone"]', '+234-804-999-9999')
      
      // Select service
      await page.selectOption('select[name="service"]', '1')
      
      // Submit registration and check-in
      await page.click('button:has-text("Register & Check In")')
      
      // Verify success
      await expect(page.locator('text=Visitor registered and checked in')).toBeVisible()
    })

    test('should check in existing visitor', async ({ page }) => {
      await page.goto('/attendance/checkin/visitor')
      
      // Search for existing visitor
      await page.fill('input[placeholder*="Search visitor"]', 'visitor@example.com')
      await page.waitForTimeout(500)
      
      // Select visitor
      await page.click('text=Visitor Guest')
      
      // Check in
      await page.selectOption('select[name="service"]', '1')
      await page.click('button:has-text("Check In")')
      
      // Verify check-in
      await expect(page.locator('text=Visitor checked in successfully')).toBeVisible()
    })
  })

  test.describe('Attendance Reports', () => {
    test('should display attendance dashboard', async ({ page }) => {
      await page.goto('/attendance/reports')
      
      // Check dashboard elements
      await expect(page.locator('text=Attendance Reports')).toBeVisible()
      await expect(page.locator('text=Today\'s Attendance')).toBeVisible()
      await expect(page.locator('text=Service Statistics')).toBeVisible()
    })

    test('should filter attendance by service', async ({ page }) => {
      await page.goto('/attendance/reports')
      
      // Select service filter
      await page.selectOption('select[name="serviceFilter"]', '1')
      
      // Verify filtered results
      await expect(page.locator('text=Sunday Morning Service Attendance')).toBeVisible()
    })

    test('should display attendance trends', async ({ page }) => {
      await page.goto('/attendance/reports')
      
      // Check trend chart/graph
      await expect(page.locator('text=Attendance Trends')).toBeVisible()
      
      // Verify chart container exists
      const chartContainer = page.locator('[data-testid="attendance-chart"], canvas, svg')
      await expect(chartContainer.first()).toBeVisible()
    })

    test('should export attendance report', async ({ page }) => {
      await page.goto('/attendance/reports')
      
      // Click export button
      await page.click('button:has-text("Export Report")')
      
      // Check export options
      await expect(page.locator('button:has-text("Export as PDF")')).toBeVisible()
      await expect(page.locator('button:has-text("Export as CSV")')).toBeVisible()
      
      // Mock export
      await page.click('button:has-text("Export as CSV")')
      
      // Verify download started (would check in real scenario)
      await expect(page.locator('text=Report exported successfully')).toBeVisible()
    })
  })

  test.describe('Offline Attendance Recording', () => {
    test('should record attendance offline', async ({ page, context }) => {
      // Simulate offline mode
      await context.setOffline(true)
      
      await page.goto('/attendance/checkin')
      
      // Should show offline indicator
      await expect(page.locator('text=Offline Mode')).toBeVisible()
      
      // Should still allow check-in
      await page.selectOption('select[name="service"]', '1')
      await page.fill('input[placeholder*="Search member"]', 'John Doe')
      await page.waitForTimeout(500)
      await page.click('text=John Doe')
      await page.click('button:has-text("Check In")')
      
      // Verify offline check-in recorded
      await expect(page.locator('text=Attendance recorded offline')).toBeVisible()
      
      // Restore online mode
      await context.setOffline(false)
    })

    test('should sync offline attendance when back online', async ({ page, context }) => {
      // Start offline, record attendance
      await context.setOffline(true)
      await page.goto('/attendance/checkin')
      
      // Record offline attendance
      await page.selectOption('select[name="service"]', '1')
      await page.fill('input[placeholder*="Search member"]', 'John Doe')
      await page.waitForTimeout(500)
      await page.click('text=John Doe')
      await page.click('button:has-text("Check In")')
      
      // Go back online
      await context.setOffline(false)
      await page.waitForTimeout(1000) // Wait for sync
      
      // Verify sync notification
      await expect(page.locator('text=Offline attendance synced')).toBeVisible()
    })
  })

  test.describe('Location-Specific Attendance', () => {
    test('should assign location during check-in', async ({ page }) => {
      await page.goto('/attendance/checkin')
      
      // Select service
      await page.selectOption('select[name="service"]', '1')
      
      // Search and select member
      await page.fill('input[placeholder*="Search member"]', 'John Doe')
      await page.waitForTimeout(500)
      await page.click('text=John Doe')
      
      // Select location
      await page.selectOption('select[name="location"]', 'main-sanctuary')
      
      // Check in
      await page.click('button:has-text("Check In")')
      
      // Verify location assignment
      await expect(page.locator('text=Assigned to Main Sanctuary')).toBeVisible()
    })

    test('should display location capacity', async ({ page }) => {
      await page.goto('/attendance/locations')
      
      // Check location list with capacity
      await expect(page.locator('text=Main Sanctuary')).toBeVisible()
      await expect(page.locator('text=Capacity: 500')).toBeVisible()
      await expect(page.locator('text=Occupied: 250')).toBeVisible()
    })
  })
})

