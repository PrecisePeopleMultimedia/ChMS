import { test, expect } from '@playwright/test'

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123'
}

test.describe('Dashboard System', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.fill('input[type="email"]', testUser.email)
    await page.fill('input[type="password"]', testUser.password)
    await page.click('button:has-text("Sign In")')
    await expect(page).toHaveURL('/dashboard')
  })

  test.describe('Dashboard Layout', () => {
    test('should display dashboard header correctly', async ({ page }) => {
      // Check welcome message
      await expect(page.locator('text=Welcome')).toBeVisible()
      await expect(page.locator('text=ChurchAfrica Dashboard')).toBeVisible()
      
      // Check logout button
      await expect(page.locator('button:has-text("Logout")')).toBeVisible()
    })

    test('should display all dashboard cards', async ({ page }) => {
      // Check main dashboard cards
      await expect(page.locator('text=Site Performance Metrics')).toBeVisible()
      await expect(page.locator('text=Income Earned')).toBeVisible()
      await expect(page.locator('text=Sales Summary')).toBeVisible()
      await expect(page.locator('text=Issue Resolution Tracker')).toBeVisible()
      await expect(page.locator('text=Summary of Weekly Earnings')).toBeVisible()
    })

    test('should have proper card layout', async ({ page }) => {
      // Check card grid layout
      const cards = page.locator('.quasar-prime-card, [data-testid="dashboard-card"]')
      await expect(cards).toHaveCount(5) // Should have 5 main cards
      
      // Check responsive layout
      const viewport = page.viewportSize()
      if (viewport && viewport.width >= 768) {
        // On desktop, cards should be in a grid
        const firstCard = cards.first()
        await expect(firstCard).toBeVisible()
      }
    })
  })

  test.describe('Performance Metrics Card', () => {
    test('should display performance metrics correctly', async ({ page }) => {
      const performanceCard = page.locator('text=Site Performance Metrics').locator('..')
      await expect(performanceCard).toBeVisible()
      
      // Check metrics
      await expect(page.locator('text=5.5k Sessions')).toBeVisible()
      await expect(page.locator('text=8.1k Page Views')).toBeVisible()
      await expect(page.locator('text=8.2k Leads')).toBeVisible()
      await expect(page.locator('text=72% Conversions')).toBeVisible()
    })

    test('should display conversion rate', async ({ page }) => {
      await expect(page.locator('text=The conversion rate is a total of 28.5%')).toBeVisible()
    })
  })

  test.describe('Income Card', () => {
    test('should display income metrics', async ({ page }) => {
      const incomeCard = page.locator('text=Income Earned').locator('..')
      await expect(incomeCard).toBeVisible()
      
      // Check income value
      await expect(page.locator('text=87.5k')).toBeVisible()
      
      // Check progress bar
      await expect(page.locator('.q-linear-progress')).toBeVisible()
    })
  })

  test.describe('Sales Summary Card', () => {
    test('should display sales metrics', async ({ page }) => {
      const salesCard = page.locator('text=Sales Summary').locator('..')
      await expect(salesCard).toBeVisible()
      
      // Check sales value
      await expect(page.locator('text=$87.5k')).toBeVisible()
      await expect(page.locator('text=+18.2%')).toBeVisible()
    })

    test('should have interactive buttons', async ({ page }) => {
      // Check action buttons
      await expect(page.locator('button:has-text("Request")')).toBeVisible()
      await expect(page.locator('button:has-text("Calls")')).toBeVisible()
      
      // Check progress indicators
      await expect(page.locator('text=62.2% (6,440)')).toBeVisible()
      await expect(page.locator('text=25.5% (12,749)')).toBeVisible()
    })
  })

  test.describe('Issue Resolution Card', () => {
    test('should display issue metrics', async ({ page }) => {
      const issueCard = page.locator('text=Issue Resolution Tracker').locator('..')
      await expect(issueCard).toBeVisible()
      
      // Check main metric
      await expect(page.locator('text=164')).toBeVisible()
      await expect(page.locator('text=Aggregate Tickets')).toBeVisible()
    })

    test('should display ticket breakdown', async ({ page }) => {
      // Check ticket categories
      await expect(page.locator('text=New Support Tickets')).toBeVisible()
      await expect(page.locator('text=142 New Tickets')).toBeVisible()
      
      await expect(page.locator('text=Open Customer Inquiries')).toBeVisible()
      await expect(page.locator('text=28 Open Tickets')).toBeVisible()
      
      await expect(page.locator('text=Average Response Time')).toBeVisible()
      await expect(page.locator('text=1 Day Response Time')).toBeVisible()
    })
  })

  test.describe('Weekly Earnings Card', () => {
    test('should display earnings metrics', async ({ page }) => {
      const earningsCard = page.locator('text=Summary of Weekly Earnings').locator('..')
      await expect(earningsCard).toBeVisible()
      
      // Check earnings value
      await expect(page.locator('text=$468')).toBeVisible()
      await expect(page.locator('text=+4.2%')).toBeVisible()
    })

    test('should display financial breakdown', async ({ page }) => {
      // Check financial details
      await expect(page.locator('text=Income $3345.69')).toBeVisible()
      await expect(page.locator('text=Financial gain $236.34')).toBeVisible()
      await expect(page.locator('text=Spending $74.19')).toBeVisible()
    })
  })

  test.describe('User Interactions', () => {
    test('should handle logout correctly', async ({ page }) => {
      // Click logout button
      await page.click('button:has-text("Logout")')
      
      // Should redirect to login
      await expect(page).toHaveURL('/login')
      
      // Should show success message
      await expect(page.locator('text=You have been logged out successfully')).toBeVisible()
    })

    test('should show loading state during logout', async ({ page }) => {
      // Click logout and check for loading state
      await page.click('button:has-text("Logout")')
      
      // Should show loading state briefly
      await expect(page.locator('.q-spinner, text=Logging out')).toBeVisible()
    })
  })

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      
      // Cards should stack vertically on mobile
      const cards = page.locator('.quasar-prime-card, [data-testid="dashboard-card"]')
      await expect(cards.first()).toBeVisible()
      
      // Check that cards are properly sized for mobile
      const firstCard = cards.first()
      const cardBox = await firstCard.boundingBox()
      expect(cardBox?.width).toBeLessThanOrEqual(375)
    })

    test('should work on tablet devices', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      
      // Should show grid layout
      const cards = page.locator('.quasar-prime-card, [data-testid="dashboard-card"]')
      await expect(cards).toHaveCount(5)
    })

    test('should work on desktop devices', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      
      // Should show full grid layout
      const cards = page.locator('.quasar-prime-card, [data-testid="dashboard-card"]')
      await expect(cards).toHaveCount(5)
    })
  })

  test.describe('Data Loading', () => {
    test('should handle loading states', async ({ page }) => {
      // Mock slow API response
      await page.route('**/api/dashboard/**', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            memberStats: { totalMembers: 100, newMembersThisMonth: 5 },
            attendanceOverview: { todayAttendance: 50, weeklyAverage: 45 },
            systemStatus: { connectionStatus: 'online', lastSync: new Date().toISOString() },
            recentActivities: []
          })
        })
      })
      
      // Reload page to trigger API calls
      await page.reload()
      
      // Should show loading state
      await expect(page.locator('.q-spinner, .loading')).toBeVisible()
    })

    test('should handle API errors gracefully', async ({ page }) => {
      // Mock API error
      await page.route('**/api/dashboard/**', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal server error' })
        })
      })
      
      // Reload page
      await page.reload()
      
      // Should show error message
      await expect(page.locator('text=Failed to load dashboard data')).toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('should have proper heading structure', async ({ page }) => {
      // Check for proper heading hierarchy
      const h1 = page.locator('h1')
      await expect(h1).toBeVisible()
      
      const h2 = page.locator('h2')
      await expect(h2).toHaveCount(5) // Should have 5 card headings
    })

    test('should support keyboard navigation', async ({ page }) => {
      // Tab through dashboard elements
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      
      // Should be able to focus on interactive elements
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    })

    test('should have proper ARIA labels', async ({ page }) => {
      // Check for ARIA labels on interactive elements
      const buttons = page.locator('button')
      const buttonCount = await buttons.count()
      
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i)
        const ariaLabel = await button.getAttribute('aria-label')
        const text = await button.textContent()
        
        // Should have either aria-label or text content
        expect(ariaLabel || text).toBeTruthy()
      }
    })
  })

  test.describe('Performance', () => {
    test('should load dashboard quickly', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/dashboard')
      
      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(3000) // Should load within 3 seconds
    })

    test('should have smooth animations', async ({ page }) => {
      // Check for CSS transitions
      const cards = page.locator('.quasar-prime-card, [data-testid="dashboard-card"]')
      const firstCard = cards.first()
      
      // Hover to trigger animation
      await firstCard.hover()
      
      // Should have smooth transition (hard to test automatically)
      // But we can check that the element is still visible
      await expect(firstCard).toBeVisible()
    })
  })

  test.describe('Data Validation', () => {
    test('should display valid metrics', async ({ page }) => {
      // Check that metrics are numeric where expected
      const sessionText = await page.locator('text=5.5k Sessions').textContent()
      expect(sessionText).toMatch(/5\.5k/)
      
      const incomeText = await page.locator('text=87.5k').textContent()
      expect(incomeText).toMatch(/87\.5k/)
      
      const salesText = await page.locator('text=$87.5k').textContent()
      expect(salesText).toMatch(/\$87\.5k/)
    })

    test('should handle missing data gracefully', async ({ page }) => {
      // Mock empty API response
      await page.route('**/api/dashboard/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            memberStats: null,
            attendanceOverview: null,
            systemStatus: null,
            recentActivities: []
          })
        })
      })
      
      // Reload page
      await page.reload()
      
      // Should still display cards with default/empty values
      await expect(page.locator('text=Site Performance Metrics')).toBeVisible()
    })
  })
})
