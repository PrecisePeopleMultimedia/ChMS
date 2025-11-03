import { test, expect } from '@playwright/test'
import { loginUser, setupMobileViewport, simulateSlowNetwork, validateTouchFriendlyUI, validatePagePerformance } from '../utils/test-helpers'
import { setupTestEnvironment, cleanupTestData } from '../utils/database-helpers'
import { userFixtures, apiResponseFixtures } from '../fixtures/test-data'
import TEST_CONFIG from '../utils/test-config'

/**
 * Dashboard Regression Test Suite
 * 
 * Comprehensive tests to ensure dashboard functionality doesn't regress
 * when new features are added. Covers dashboard layout, data display,
 * navigation, and performance.
 */

test.describe('Dashboard Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setup test environment and login
    await setupTestEnvironment(page)
    await loginUser(page, 'member')
  })

  test.afterEach(async ({ page }) => {
    await cleanupTestData(page)
  })

  test.describe('Dashboard Layout and Content', () => {
    test('should display dashboard header correctly', async ({ page }) => {
      // Check main header elements
      await expect(page.locator('text=ChurchAfrica Dashboard')).toBeVisible()
      await expect(page.locator('text=Welcome back')).toBeVisible()
      
      // Check user info display
      await expect(page.locator(`text=${userFixtures.member.first_name}`)).toBeVisible()
      await expect(page.locator('button:has-text("Logout")')).toBeVisible()
      
      // Check navigation menu
      await expect(page.locator('nav')).toBeVisible()
      await expect(page.locator('a:has-text("Dashboard")')).toBeVisible()
      await expect(page.locator('a:has-text("Members")')).toBeVisible()
    })

    test('should display member statistics correctly', async ({ page }) => {
      // Check member stats card
      await expect(page.locator('text=Member Statistics')).toBeVisible()
      await expect(page.locator('text=Total Members')).toBeVisible()
      await expect(page.locator('text=150')).toBeVisible() // From mock data
      
      await expect(page.locator('text=New This Month')).toBeVisible()
      await expect(page.locator('text=8')).toBeVisible() // From mock data
      
      await expect(page.locator('text=Active This Week')).toBeVisible()
      await expect(page.locator('text=120')).toBeVisible() // From mock data
    })

    test('should display attendance overview correctly', async ({ page }) => {
      // Check attendance overview card
      await expect(page.locator('text=Attendance Overview')).toBeVisible()
      await expect(page.locator('text=Today\'s Attendance')).toBeVisible()
      await expect(page.locator('text=85')).toBeVisible() // From mock data
      
      await expect(page.locator('text=Weekly Average')).toBeVisible()
      await expect(page.locator('text=78')).toBeVisible() // From mock data
      
      await expect(page.locator('text=Monthly Average')).toBeVisible()
      await expect(page.locator('text=82')).toBeVisible() // From mock data
    })

    test('should display system status correctly', async ({ page }) => {
      // Check system status card
      await expect(page.locator('text=System Status')).toBeVisible()
      await expect(page.locator('text=Backend Connected')).toBeVisible()
      await expect(page.locator('text=Online')).toBeVisible()
      
      // Check sync status
      await expect(page.locator('text=Last Sync')).toBeVisible()
      await expect(page.locator('text=Pending Sync: 0')).toBeVisible()
    })

    test('should display recent activities correctly', async ({ page }) => {
      // Check recent activities section
      await expect(page.locator('text=Recent Activities')).toBeVisible()
      
      // Check for activity items (from mock data)
      await expect(page.locator('text=New member John Smith added')).toBeVisible()
      await expect(page.locator('text=Sunday service attendance recorded')).toBeVisible()
    })

    test('should display quick actions correctly', async ({ page }) => {
      // Check quick actions section
      await expect(page.locator('text=Quick Actions')).toBeVisible()
      
      // Check action buttons
      await expect(page.locator('button:has-text("Add Member")')).toBeVisible()
      await expect(page.locator('button:has-text("Record Attendance")')).toBeVisible()
      await expect(page.locator('button:has-text("View Reports")')).toBeVisible()
      await expect(page.locator('button:has-text("Settings")')).toBeVisible()
    })
  })

  test.describe('Dashboard Navigation', () => {
    test('should navigate to members page', async ({ page }) => {
      await page.click('a:has-text("Members")')
      await expect(page).toHaveURL('/members')
      await expect(page.locator('text=Member Management')).toBeVisible()
    })

    test('should navigate using quick actions', async ({ page }) => {
      // Test Add Member quick action
      await page.click('button:has-text("Add Member")')
      await expect(page).toHaveURL('/members/add')
      
      // Go back to dashboard
      await page.goto('/dashboard')
      
      // Test Record Attendance quick action
      await page.click('button:has-text("Record Attendance")')
      await expect(page).toHaveURL('/attendance')
    })

    test('should maintain active navigation state', async ({ page }) => {
      // Dashboard should be active by default
      const dashboardLink = page.locator('a:has-text("Dashboard")')
      await expect(dashboardLink).toHaveClass(/active|current|selected/)
      
      // Navigate to members
      await page.click('a:has-text("Members")')
      await expect(page.locator('a:has-text("Members")')).toHaveClass(/active|current|selected/)
    })
  })

  test.describe('Dashboard Performance', () => {
    test('should load dashboard quickly', async ({ page }) => {
      await page.goto('/login')
      await loginUser(page, 'member')
      
      // Measure dashboard load time
      const loadTime = await validatePagePerformance(page, '/dashboard', TEST_CONFIG.performance.pageLoadTime)
      expect(loadTime).toBeLessThan(TEST_CONFIG.performance.pageLoadTime)
    })

    test('should handle slow network conditions', async ({ page }) => {
      await simulateSlowNetwork(page, 200)
      
      // Dashboard should still load and be functional
      await page.reload()
      await expect(page.locator('text=Welcome')).toBeVisible({ timeout: TEST_CONFIG.timeouts.navigation })
      await expect(page.locator('text=Member Statistics')).toBeVisible()
    })

    test('should update data without full page reload', async ({ page }) => {
      // Mock updated data
      await page.route('**/api/dashboard/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            memberStats: { totalMembers: 155, newMembersThisMonth: 10 }, // Updated numbers
            attendanceOverview: { todayAttendance: 90, weeklyAverage: 80 },
            systemStatus: { connectionStatus: 'online', lastSync: new Date().toISOString() },
            recentActivities: []
          })
        })
      })

      // Trigger data refresh (if implemented)
      await page.click('button:has-text("Refresh"), [data-testid="refresh-button"]')
      
      // Should show updated data
      await expect(page.locator('text=155')).toBeVisible() // Updated total members
      await expect(page.locator('text=10')).toBeVisible()  // Updated new members
    })
  })

  test.describe('Mobile Dashboard', () => {
    test('should display correctly on mobile', async ({ page }) => {
      await setupMobileViewport(page, 'pixel5')
      await page.reload()

      // Check mobile layout
      await expect(page.locator('text=ChurchAfrica Dashboard')).toBeVisible()
      await expect(page.locator('text=Welcome')).toBeVisible()
      
      // Check cards are stacked vertically on mobile
      const memberStatsCard = page.locator('text=Member Statistics').locator('..')
      const attendanceCard = page.locator('text=Attendance Overview').locator('..')
      
      const memberStatsBox = await memberStatsCard.boundingBox()
      const attendanceBox = await attendanceCard.boundingBox()
      
      // Cards should be stacked (attendance card below member stats)
      expect(attendanceBox?.y).toBeGreaterThan(memberStatsBox?.y || 0)
    })

    test('should have touch-friendly navigation', async ({ page }) => {
      await setupMobileViewport(page, 'pixel5')
      await page.reload()

      // Check touch-friendly elements
      await validateTouchFriendlyUI(page, 'button:has-text("Logout")')
      await validateTouchFriendlyUI(page, 'button:has-text("Add Member")')
      await validateTouchFriendlyUI(page, 'a:has-text("Members")')
    })

    test('should support mobile gestures', async ({ page }) => {
      await setupMobileViewport(page, 'pixel5')
      await page.reload()

      // Test tap interactions
      await page.tap('button:has-text("Add Member")')
      await expect(page).toHaveURL('/members/add')
      
      // Go back
      await page.goBack()
      await expect(page).toHaveURL('/dashboard')
    })
  })
})
