import { test, expect } from '@playwright/test'

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123'
}

test.describe('Quasar Prime Theme', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Header and Navigation', () => {
    test('should display Quasar Prime header correctly', async ({ page }) => {
      await page.goto('/login')
      
      // Check header elements
      await expect(page.locator('text=ChurchAfrica')).toBeVisible()
      await expect(page.locator('button[aria-label="Menu"]')).toBeVisible() // Hamburger menu
      
      // Check search bar
      await expect(page.locator('input[placeholder="Search"]')).toBeVisible()
      
      // Check right-side controls
      await expect(page.locator('button[aria-label*="notification"]')).toBeVisible()
      await expect(page.locator('button[aria-label*="language"]')).toBeVisible()
      await expect(page.locator('button[aria-label*="apps"]')).toBeVisible()
      
      // Check theme toggle button (not switch)
      const themeToggle = page.locator('button[aria-label*="theme"], button[aria-label*="dark"], button[aria-label*="light"]')
      await expect(themeToggle).toBeVisible()
      
      // Check user avatar
      await expect(page.locator('.user-avatar, [data-testid="user-avatar"]')).toBeVisible()
    })

    test('should toggle theme correctly', async ({ page }) => {
      await page.goto('/login')
      
      // Find theme toggle button
      const themeToggle = page.locator('button').filter({ hasText: /light|dark|theme/i }).first()
      await expect(themeToggle).toBeVisible()
      
      // Check initial theme (should be light by default)
      const body = page.locator('body')
      await expect(body).toHaveClass(/light/)
      
      // Click theme toggle
      await themeToggle.click()
      
      // Should switch to dark theme
      await expect(body).toHaveClass(/dark/)
      
      // Click again to switch back
      await themeToggle.click()
      await expect(body).toHaveClass(/light/)
    })

    test('should handle hamburger menu correctly', async ({ page }) => {
      await page.goto('/login')
      
      const hamburgerMenu = page.locator('button[aria-label="Menu"]')
      await expect(hamburgerMenu).toBeVisible()
      
      // Click hamburger menu
      await hamburgerMenu.click()
      
      // Should show/hide sidebar (this depends on implementation)
      // The exact behavior depends on how the sidebar is implemented
    })
  })

  test.describe('Sidebar Navigation', () => {
    test.beforeEach(async ({ page }) => {
      // Login first to access dashboard with sidebar
      await page.goto('/login')
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)
      await page.click('button:has-text("Sign In")')
      await expect(page).toHaveURL('/dashboard')
    })

    test('should display sidebar with navigation items', async ({ page }) => {
      // Check sidebar is visible
      await expect(page.locator('.quasar-prime-sidebar, [data-testid="sidebar"]')).toBeVisible()
      
      // Check navigation items
      await expect(page.locator('text=Navigation')).toBeVisible()
      await expect(page.locator('text=Dashboard')).toBeVisible()
      await expect(page.locator('text=Members')).toBeVisible()
      await expect(page.locator('text=Attendance')).toBeVisible()
      await expect(page.locator('text=Events')).toBeVisible()
      await expect(page.locator('text=Reports')).toBeVisible()
      await expect(page.locator('text=Settings')).toBeVisible()
    })

    test('should collapse sidebar with arrow button', async ({ page }) => {
      // Find collapse button (left arrow)
      const collapseButton = page.locator('button[aria-label*="collapse"], button[aria-label*="arrow"]')
      await expect(collapseButton).toBeVisible()
      
      // Click collapse button
      await collapseButton.click()
      
      // Sidebar should collapse (show only icons)
      const sidebar = page.locator('.quasar-prime-sidebar, [data-testid="sidebar"]')
      await expect(sidebar).toHaveClass(/collapsed|mini/)
      
      // Arrow button should disappear
      await expect(collapseButton).toBeHidden()
    })

    test('should expand sidebar when icon is clicked', async ({ page }) => {
      // First collapse the sidebar
      const collapseButton = page.locator('button[aria-label*="collapse"], button[aria-label*="arrow"]')
      await collapseButton.click()
      
      // Click on any navigation icon
      const dashboardIcon = page.locator('a[href="/dashboard"]').first()
      await dashboardIcon.click()
      
      // Sidebar should expand and arrow should reappear
      const sidebar = page.locator('.quasar-prime-sidebar, [data-testid="sidebar"]')
      await expect(sidebar).not.toHaveClass(/collapsed|mini/)
      await expect(collapseButton).toBeVisible()
    })

    test('should hide sidebar completely with hamburger menu', async ({ page }) => {
      const hamburgerMenu = page.locator('button[aria-label="Menu"]')
      await hamburgerMenu.click()
      
      // Sidebar should be hidden
      const sidebar = page.locator('.quasar-prime-sidebar, [data-testid="sidebar"]')
      await expect(sidebar).toBeHidden()
      
      // Click hamburger again to show
      await hamburgerMenu.click()
      await expect(sidebar).toBeVisible()
    })
  })

  test.describe('Dashboard Cards', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.goto('/login')
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)
      await page.click('button:has-text("Sign In")')
      await expect(page).toHaveURL('/dashboard')
    })

    test('should display Quasar Prime dashboard cards', async ({ page }) => {
      // Check main dashboard cards
      await expect(page.locator('text=Site Performance Metrics')).toBeVisible()
      await expect(page.locator('text=Income Earned')).toBeVisible()
      await expect(page.locator('text=Sales Summary')).toBeVisible()
      await expect(page.locator('text=Issue Resolution Tracker')).toBeVisible()
      await expect(page.locator('text=Summary of Weekly Earnings')).toBeVisible()
    })

    test('should have proper card styling', async ({ page }) => {
      // Check card styling
      const cards = page.locator('.quasar-prime-card, [data-testid="dashboard-card"]')
      await expect(cards.first()).toBeVisible()
      
      // Cards should have proper spacing and styling
      const firstCard = cards.first()
      await expect(firstCard).toHaveCSS('border-radius', /12px/)
      await expect(firstCard).toHaveCSS('box-shadow', /.+/)
    })

    test('should display metrics correctly', async ({ page }) => {
      // Check performance metrics
      await expect(page.locator('text=5.5k Sessions')).toBeVisible()
      await expect(page.locator('text=8.1k Page Views')).toBeVisible()
      await expect(page.locator('text=8.2k Leads')).toBeVisible()
      await expect(page.locator('text=72% Conversions')).toBeVisible()
      
      // Check income metrics
      await expect(page.locator('text=87.5k')).toBeVisible()
      
      // Check sales metrics
      await expect(page.locator('text=$87.5k')).toBeVisible()
      await expect(page.locator('text=+18.2%')).toBeVisible()
    })

    test('should have interactive elements', async ({ page }) => {
      // Check for buttons in sales summary
      await expect(page.locator('button:has-text("Request")')).toBeVisible()
      await expect(page.locator('button:has-text("Calls")')).toBeVisible()
      
      // Check for progress bars
      await expect(page.locator('.q-linear-progress')).toBeVisible()
    })
  })

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/login')
      
      // Header should be responsive
      await expect(page.locator('text=ChurchAfrica')).toBeVisible()
      
      // Search should be hidden or collapsed on mobile
      const searchInput = page.locator('input[placeholder="Search"]')
      const isSearchVisible = await searchInput.isVisible()
      
      if (isSearchVisible) {
        // If visible, should be properly sized
        const searchBox = await searchInput.boundingBox()
        expect(searchBox?.width).toBeLessThanOrEqual(375)
      }
    })

    test('should work on tablet devices', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/login')
      
      // Should show both header and sidebar
      await expect(page.locator('text=ChurchAfrica')).toBeVisible()
      await expect(page.locator('input[placeholder="Search"]')).toBeVisible()
    })

    test('should work on desktop devices', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto('/login')
      
      // All elements should be visible
      await expect(page.locator('text=ChurchAfrica')).toBeVisible()
      await expect(page.locator('input[placeholder="Search"]')).toBeVisible()
      await expect(page.locator('button[aria-label="Menu"]')).toBeVisible()
    })
  })

  test.describe('Theme Persistence', () => {
    test('should remember theme preference', async ({ page }) => {
      await page.goto('/login')
      
      // Set to dark theme
      const themeToggle = page.locator('button').filter({ hasText: /light|dark|theme/i }).first()
      await themeToggle.click()
      
      // Reload page
      await page.reload()
      
      // Should still be dark theme
      const body = page.locator('body')
      await expect(body).toHaveClass(/dark/)
    })

    test('should apply theme to all pages', async ({ page }) => {
      await page.goto('/login')
      
      // Set to dark theme
      const themeToggle = page.locator('button').filter({ hasText: /light|dark|theme/i }).first()
      await themeToggle.click()
      
      // Navigate to register
      await page.goto('/register')
      
      // Should still be dark theme
      const body = page.locator('body')
      await expect(body).toHaveClass(/dark/)
    })
  })

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      await page.goto('/login')
      
      // Check for proper ARIA labels
      await expect(page.locator('button[aria-label="Menu"]')).toBeVisible()
      await expect(page.locator('input[placeholder="Search"]')).toBeVisible()
    })

    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('/login')
      
      // Tab through elements
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      
      // Should be able to focus on theme toggle
      const themeToggle = page.locator('button').filter({ hasText: /light|dark|theme/i }).first()
      await expect(themeToggle).toBeFocused()
    })

    test('should have proper color contrast', async ({ page }) => {
      await page.goto('/login')
      
      // This would require more sophisticated testing
      // For now, just check that elements are visible
      await expect(page.locator('text=ChurchAfrica')).toBeVisible()
      await expect(page.locator('input[type="email"]')).toBeVisible()
    })
  })

  test.describe('Performance', () => {
    test('should load quickly', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/login')
      
      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(3000) // Should load within 3 seconds
    })

    test('should have smooth animations', async ({ page }) => {
      await page.goto('/login')
      
      // Click theme toggle and check for smooth transition
      const themeToggle = page.locator('button').filter({ hasText: /light|dark|theme/i }).first()
      await themeToggle.click()
      
      // Should transition smoothly (this is hard to test automatically)
      // But we can check that the theme actually changed
      const body = page.locator('body')
      await expect(body).toHaveClass(/dark/)
    })
  })
})
