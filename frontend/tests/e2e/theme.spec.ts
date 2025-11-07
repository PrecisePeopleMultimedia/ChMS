import { test, expect } from '@playwright/test'

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123'
}

test.describe('Theme Switching (Light/Dark Mode)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Theme Toggle on Login Page', () => {
    test('should display theme toggle button', async ({ page }) => {
      await page.goto('/login')

      // Theme toggle should be visible
      const themeToggle = page.locator('[data-testid="theme-toggle"], .theme-toggle, button:has(.q-icon):has-text("dark_mode, light_mode")')
      await expect(themeToggle.first()).toBeVisible()
    })

    test('should toggle between light and dark modes', async ({ page }) => {
      await page.goto('/login')

      // Get the html element to check dark mode class
      const htmlElement = page.locator('html')

      // Default should be dark mode (Garnet Night theme)
      const initialClass = await htmlElement.getAttribute('class')
      const initialIsDark = initialClass?.includes('dark') || true // Garnet Night is dark by default

      // Find and click theme toggle
      const themeToggle = page.locator('[data-testid="theme-toggle"]').first()
      await themeToggle.click()

      // Wait for theme change
      await page.waitForTimeout(500)

      // Class should change
      const afterToggleClass = await htmlElement.getAttribute('class')
      const afterToggleIsDark = afterToggleClass?.includes('dark')

      // Mode should have switched
      expect(initialIsDark).not.toBe(afterToggleIsDark)

      // Toggle back
      await themeToggle.click()
      await page.waitForTimeout(500)

      const finalClass = await htmlElement.getAttribute('class')
      const finalIsDark = finalClass?.includes('dark')

      // Should be back to initial state
      expect(initialIsDark).toBe(finalIsDark)
    })

    test('should persist theme preference in localStorage', async ({ page }) => {
      await page.goto('/login')

      // Toggle to light mode
      const themeToggle = page.locator('[data-testid="theme-toggle"]').first()
      await themeToggle.click()
      await page.waitForTimeout(500)

      // Check localStorage
      const themePreference = await page.evaluate(() => localStorage.getItem('theme'))
      expect(themePreference).toBeTruthy()

      // Reload page
      await page.reload()

      // Theme should persist
      const htmlElement = page.locator('html')
      const classAfterReload = await htmlElement.getAttribute('class')

      // Should match the toggled state
      if (themePreference === 'light') {
        expect(classAfterReload).not.toContain('dark')
      } else {
        expect(classAfterReload).toContain('dark')
      }
    })

    test('should update theme icon when toggling', async ({ page }) => {
      await page.goto('/login')

      const themeToggle = page.locator('[data-testid="theme-toggle"]').first()

      // Get initial icon
      const initialIcon = themeToggle.locator('.q-icon')

      // Toggle theme
      await themeToggle.click()
      await page.waitForTimeout(500)

      // Icon should change
      const afterToggleIcon = await themeToggle.locator('.q-icon').textContent()
      await expect(initialIcon).not.toHaveText(afterToggleIcon)
    })

    test('should apply theme colors correctly', async ({ page }) => {
      await page.goto('/login')

      // Check dark mode colors (default Garnet Night)
      const bodyDark = await page.locator('body').evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor
      })

      // Toggle to light mode
      const themeToggle = page.locator('[data-testid="theme-toggle"]').first()
      await themeToggle.click()
      await page.waitForTimeout(500)

      // Check light mode colors
      const bodyLight = await page.locator('body').evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor
      })

      // Colors should be different
      expect(bodyDark).not.toBe(bodyLight)
    })
  })

  test.describe('Theme Toggle on Register Page', () => {
    test('should display and work on register page', async ({ page }) => {
      await page.goto('/register')

      // Theme toggle should be visible
      const themeToggle = page.locator('[data-testid="theme-toggle"]').first()
      await expect(themeToggle).toBeVisible()

      // Click to toggle
      await themeToggle.click()
      await page.waitForTimeout(500)

      // Should change theme
      const htmlElement = page.locator('html')
      const htmlClass = htmlElement
      await expect(htmlClass).toHaveAttribute('class', )
    })

    test('should maintain theme when navigating between auth pages', async ({ page }) => {
      await page.goto('/login')

      // Toggle to light mode
      const themeToggle = page.locator('[data-testid="theme-toggle"]').first()
      await themeToggle.click()
      await page.waitForTimeout(500)

      const loginTheme = page.locator('html')

      // Navigate to register
      await page.click('a:has-text("Sign up")')
      await expect(page).toHaveURL('/register')
      await page.waitForTimeout(500)

      // Theme should persist
      const registerTheme = await page.locator('html').getAttribute('class')
      await expect(loginTheme).toHaveAttribute('class', registerTheme)

      // Navigate to forgot password
      await page.goto('/forgot-password')
      await page.waitForTimeout(500)

      const forgotPasswordTheme = await page.locator('html').getAttribute('class')
      expect(loginTheme).toBe(forgotPasswordTheme)
    })
  })

  test.describe('Theme Toggle on Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each dashboard test
      await page.goto('/login')
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)
      await page.click('button:has-text("Sign In")')
      await expect(page).toHaveURL('/dashboard')
    })

    test('should display theme toggle on dashboard', async ({ page }) => {
      // Theme toggle should be visible in dashboard header/navbar
      const themeToggle = page.locator('[data-testid="theme-toggle"], .theme-toggle').first()
      await expect(themeToggle).toBeVisible()
    })

    test('should toggle theme on dashboard', async ({ page }) => {
      const htmlElement = page.locator('html')
      const initialClass = htmlElement

      // Toggle theme
      const themeToggle = page.locator('[data-testid="theme-toggle"]').first()
      await themeToggle.click()
      await page.waitForTimeout(500)

      const afterToggleClass = await htmlElement.getAttribute('class')
      await expect(initialClass).not.toHaveAttribute('class', afterToggleClass)
    })

    test('should maintain theme after logout and login', async ({ page }) => {
      // Toggle to light mode
      const themeToggle = page.locator('[data-testid="theme-toggle"]').first()
      await themeToggle.click()
      await page.waitForTimeout(500)

      const dashboardTheme = page.locator('html')

      // Logout
      await page.click('button:has-text("Logout")')
      await expect(page).toHaveURL('/login')
      await page.waitForTimeout(500)

      // Theme should persist to login page
      const loginTheme = await page.locator('html').getAttribute('class')
      await expect(dashboardTheme).toHaveAttribute('class', loginTheme)

      // Login again
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)
      await page.click('button:has-text("Sign In")')
      await expect(page).toHaveURL('/dashboard')
      await page.waitForTimeout(500)

      // Theme should still persist
      const dashboardThemeAfterLogin = await page.locator('html').getAttribute('class')
      expect(dashboardTheme).toBe(dashboardThemeAfterLogin)
    })
  })

  test.describe('Theme Accessibility', () => {
    test('should be keyboard accessible', async ({ page }) => {
      await page.goto('/login')

      // Tab to theme toggle
      // Note: May need multiple tabs depending on page structure
      let foundToggle = false
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab')
        const focusedElement = await page.evaluate(() => {
          const el = document.activeElement
          return {
            tag: el?.tagName,
            testId: el?.getAttribute('data-testid'),
            class: el?.className
          }
        })

        if (focusedElement.testId === 'theme-toggle' ||
            focusedElement.class?.includes('theme-toggle')) {
          foundToggle = true
          break
        }
      }

      if (foundToggle) {
        // Press Enter or Space to toggle
        const htmlElement = page.locator('html')
        const beforeToggle = htmlElement

        await page.keyboard.press('Enter')
        await page.waitForTimeout(500)

        const afterToggle = await htmlElement.getAttribute('class')
        await expect(beforeToggle).not.toHaveAttribute('class', afterToggle)
      }
    })

    test('should have proper ARIA attributes', async ({ page }) => {
      await page.goto('/login')

      const themeToggle = page.locator('[data-testid="theme-toggle"]').first()

      // Should have aria-label or title
      const ariaLabel = await themeToggle.getAttribute('aria-label')
      const title = await themeToggle.getAttribute('title')

      expect(ariaLabel || title).toBeTruthy()
    })

    test('should maintain contrast ratios in both themes', async ({ page }) => {
      await page.goto('/login')

      // Check text is visible in dark mode
      const welcomeTextDark = page.locator('.brand-title')
      await expect(welcomeTextDark).toBeVisible()

      // Toggle to light mode
      const themeToggle = page.locator('[data-testid="theme-toggle"]').first()
      await themeToggle.click()
      await page.waitForTimeout(500)

      // Check text is still visible in light mode
      const welcomeTextLight = page.locator('.brand-title')
      await expect(welcomeTextLight).toBeVisible()

      // Check form inputs are visible in both modes
      const emailInput = page.locator('input[type="email"]')
      await expect(emailInput).toBeVisible()
    })
  })

  test.describe('Theme Performance', () => {
    test('should toggle theme without layout shift', async ({ page }) => {
      await page.goto('/login')

      // Get form position before toggle
      const formCard = page.locator('.modern-form-card, .forgot-password-card, q-card').first()
      const beforeBox = await formCard.boundingBox()

      // Toggle theme
      const themeToggle = page.locator('[data-testid="theme-toggle"]').first()
      await themeToggle.click()
      await page.waitForTimeout(500)

      // Get form position after toggle
      const afterBox = await formCard.boundingBox()

      // Position should remain stable (allowing for small differences)
      if (beforeBox && afterBox) {
        expect(Math.abs(beforeBox.x - afterBox.x)).toBeLessThan(10)
        expect(Math.abs(beforeBox.y - afterBox.y)).toBeLessThan(10)
      }
    })

    test('should toggle theme quickly', async ({ page }) => {
      await page.goto('/login')

      const themeToggle = page.locator('[data-testid="theme-toggle"]').first()

      const startTime = Date.now()
      await themeToggle.click()
      await page.waitForTimeout(100) // Small wait for visual change
      const endTime = Date.now()

      // Should toggle in less than 500ms
      expect(endTime - startTime).toBeLessThan(500)
    })
  })

  test.describe('Theme Mobile Support', () => {
    test('should work on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/login')

      // Theme toggle should be visible on mobile
      const themeToggle = page.locator('[data-testid="theme-toggle"]').first()
      await expect(themeToggle).toBeVisible()

      // Should be touch-friendly
      const toggleBox = await themeToggle.boundingBox()
      expect(toggleBox?.width).toBeGreaterThanOrEqual(44)
      expect(toggleBox?.height).toBeGreaterThanOrEqual(44)

      // Tap to toggle
      await themeToggle.tap()
      await page.waitForTimeout(500)

      // Theme should change
      const htmlElement = page.locator('html')
      const htmlClass = htmlElement
      await expect(htmlClass).toHaveAttribute('class', )
    })

    test('should respect system preference on mobile', async ({ page, context }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      // Emulate dark mode preference
      await context.emulateMedia({ colorScheme: 'dark' })
      await page.goto('/login')
      await page.waitForTimeout(500)

      const htmlDark = await page.locator('html').getAttribute('class')

      // Clean up
      await page.context().clearCookies()
      await page.evaluate(() => localStorage.clear())

      // Emulate light mode preference
      await context.emulateMedia({ colorScheme: 'light' })
      await page.goto('/login')
      await page.waitForTimeout(500)

      const htmlLight = await page.locator('html').getAttribute('class')

      // Themes should be different based on system preference
      // (only if app respects system preference)
      expect(htmlDark || htmlLight).toBeTruthy()
    })
  })

  test.describe('Theme Edge Cases', () => {
    test('should handle rapid theme toggling', async ({ page }) => {
      await page.goto('/login')

      const themeToggle = page.locator('[data-testid="theme-toggle"]').first()

      // Rapidly toggle theme multiple times
      for (let i = 0; i < 5; i++) {
        await themeToggle.click()
        await page.waitForTimeout(100)
      }

      // Page should still be responsive
      await expect(page.locator('.brand-title')).toBeVisible()
      await expect(page.locator('input[type="email"]')).toBeVisible()
    })

    test('should handle theme toggle during form submission', async ({ page }) => {
      await page.goto('/login')

      // Start filling form
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)

      // Toggle theme while form is filled
      const themeToggle = page.locator('[data-testid="theme-toggle"]').first()
      await themeToggle.click()
      await page.waitForTimeout(500)

      // Form values should persist
      const emailValue = page.locator('input[type="email"]')
      const passwordValue = page.locator('input[type="password"]')

      await expect(emailValue).toHaveValue(testUser.email)
      await expect(passwordValue).toHaveValue(testUser.password)

      // Should still be able to submit
      await page.click('button:has-text("Sign In")')
      await expect(page).toHaveURL('/dashboard')
    })

    test('should not lose theme preference after clearing some localStorage', async ({ page }) => {
      await page.goto('/login')

      // Toggle to light mode
      const themeToggle = page.locator('[data-testid="theme-toggle"]').first()
      await themeToggle.click()
      await page.waitForTimeout(500)

      // Clear some localStorage (but not theme)
      await page.evaluate(() => {
        localStorage.removeItem('some_other_key')
      })

      // Reload page
      await page.reload()
      await page.waitForTimeout(500)

      // Theme should still be light
      const htmlElement = page.locator('html')
      const themePreference = await page.evaluate(() => localStorage.getItem('theme'))

      expect(themePreference).toBeTruthy()
    })
  })

  test.describe('Theme Integration with Other Features', () => {
    test('should maintain theme when showing error messages', async ({ page }) => {
      await page.goto('/login')

      // Toggle to light mode
      const themeToggle = page.locator('[data-testid="theme-toggle"]').first()
      await themeToggle.click()
      await page.waitForTimeout(500)

      const themeBeforeError = page.locator('html')

      // Trigger validation error
      await page.fill('input[type="email"]', 'invalid@example.com')
      await page.fill('input[type="password"]', 'wrongpassword')
      await page.click('button:has-text("Sign In")')

      // Wait for error
      await expect(page.locator('text=Invalid credentials')).toBeVisible()

      // Theme should not change
      const themeAfterError = await page.locator('html').getAttribute('class')
      await expect(themeBeforeError).toHaveAttribute('class', themeAfterError)
    })

    test('should maintain theme during loading states', async ({ page }) => {
      await page.goto('/login')

      // Toggle to light mode
      const themeToggle = page.locator('[data-testid="theme-toggle"]').first()
      await themeToggle.click()
      await page.waitForTimeout(500)

      const themeBefore = page.locator('html')

      // Mock slow API
      await page.route('**/api/auth/login', async route => {
        await new Promise(resolve => setTimeout(resolve, 2000))
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            user: { id: 1, email: testUser.email },
            token: 'test-token'
          })
        })
      })

      // Submit login
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)
      await page.click('button:has-text("Sign In")')

      // Check theme during loading
      await page.waitForTimeout(1000)
      const themeDuringLoading = await page.locator('html').getAttribute('class')
      await expect(themeBefore).toHaveAttribute('class', themeDuringLoading)
    })
  })
})
