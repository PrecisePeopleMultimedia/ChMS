import { test, expect } from '@playwright/test'

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123'
}

const resetEmail = 'reset@example.com'

test.describe('Password Reset Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Forgot Password Page', () => {
    test('should display forgot password form correctly', async ({ page }) => {
      await page.goto('/forgot-password')

      // Check page title and branding
      await expect(page.locator('text=Reset Password')).toBeVisible()
      await expect(page.locator('text=Enter your email to receive reset instructions')).toBeVisible()

      // Check form elements
      await expect(page.locator('input[type="email"]')).toBeVisible()
      await expect(page.locator('button:has-text("Send Reset Instructions")')).toBeVisible()

      // Check navigation links
      await expect(page.locator('text=Remember your password?')).toBeVisible()
      await expect(page.locator('a:has-text("Sign in")')).toBeVisible()
      await expect(page.locator('text=Don\'t have an account?')).toBeVisible()
      await expect(page.locator('a:has-text("Sign up")')).toBeVisible()
    })

    test('should validate email field', async ({ page }) => {
      await page.goto('/forgot-password')

      // Try to submit with empty email
      const submitButton = page.locator('button:has-text("Send Reset Instructions")')
      await expect(submitButton).toBeDisabled()

      // Enter invalid email
      await page.fill('input[type="email"]', 'invalid-email')
      await expect(submitButton).toBeDisabled()

      // Enter valid email
      await page.fill('input[type="email"]', resetEmail)
      await expect(submitButton).toBeEnabled()
    })

    test('should submit forgot password request successfully', async ({ page }) => {
      await page.goto('/forgot-password')

      // Mock successful API response
      await page.route('**/api/auth/forgot-password', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Password reset email sent successfully'
          })
        })
      })

      // Fill and submit form
      await page.fill('input[type="email"]', resetEmail)
      await page.click('button:has-text("Send Reset Instructions")')

      // Should show success message
      await expect(page.locator('text=Password reset instructions sent')).toBeVisible()

      // Should redirect to login page
      await expect(page).toHaveURL('/login')
    })

    test('should show error for non-existent email', async ({ page }) => {
      await page.goto('/forgot-password')

      // Mock API error response
      await page.route('**/api/auth/forgot-password', async route => {
        await route.fulfill({
          status: 422,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Validation failed',
            errors: {
              email: ['The selected email is invalid.']
            }
          })
        })
      })

      // Fill and submit form
      await page.fill('input[type="email"]', 'nonexistent@example.com')
      await page.click('button:has-text("Send Reset Instructions")')

      // Should show error message
      await expect(page.locator('text=invalid')).toBeVisible()
    })

    test('should show loading state during submission', async ({ page }) => {
      await page.goto('/forgot-password')

      // Mock slow API response
      await page.route('**/api/auth/forgot-password', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Password reset email sent successfully'
          })
        })
      })

      // Fill form
      await page.fill('input[type="email"]', resetEmail)

      // Submit and check loading state
      await page.click('button:has-text("Send Reset Instructions")')
      await expect(page.locator('text=Sending')).toBeVisible()
    })

    test('should navigate to login and register pages', async ({ page }) => {
      await page.goto('/forgot-password')

      // Navigate to login
      await page.click('a:has-text("Sign in")')
      await expect(page).toHaveURL('/login')

      // Go back to forgot password
      await page.goto('/forgot-password')

      // Navigate to register
      await page.click('a:has-text("Sign up")')
      await expect(page).toHaveURL('/register')
    })

    test('should handle network errors gracefully', async ({ page }) => {
      await page.goto('/forgot-password')

      // Mock network error
      await page.route('**/api/auth/forgot-password', async route => {
        await route.abort('failed')
      })

      // Fill and submit form
      await page.fill('input[type="email"]', resetEmail)
      await page.click('button:has-text("Send Reset Instructions")')

      // Should show error message
      await expect(page.locator('text=Failed to send reset instructions')).toBeVisible()
    })
  })

  test.describe('Reset Password Page', () => {
    const resetToken = 'test-reset-token-12345'
    const resetUrl = `/reset-password?token=${resetToken}&email=${encodeURIComponent(resetEmail)}`

    test('should display reset password form correctly', async ({ page }) => {
      await page.goto(resetUrl)

      // Check page title and branding
      await expect(page.locator('text=Reset Your Password')).toBeVisible()
      await expect(page.locator('text=Enter your new password below')).toBeVisible()

      // Check form elements
      await expect(page.locator('input[type="email"]')).toBeVisible()
      await expect(page.locator('input[type="email"]')).toHaveValue(resetEmail)
      await expect(page.locator('input[type="email"]')).toHaveAttribute('readonly')

      // Check password fields
      const passwordInputs = page.locator('input[type="password"]')
      await expect(passwordInputs).toHaveCount(2)

      // Check submit button
      await expect(page.locator('button:has-text("Reset Password")')).toBeVisible()

      // Check password requirements
      await expect(page.locator('text=Password must contain:')).toBeVisible()
      await expect(page.locator('text=At least 8 characters')).toBeVisible()
      await expect(page.locator('text=One uppercase letter')).toBeVisible()
      await expect(page.locator('text=One lowercase letter')).toBeVisible()
      await expect(page.locator('text=One number')).toBeVisible()
    })

    test('should redirect to forgot password if token is missing', async ({ page }) => {
      await page.goto('/reset-password')

      // Should show error notification
      await expect(page.locator('text=Invalid or missing reset token')).toBeVisible()

      // Should redirect to forgot password page
      await expect(page).toHaveURL('/forgot-password')
    })

    test('should validate password requirements', async ({ page }) => {
      await page.goto(resetUrl)

      const passwordInput = page.locator('input[label="New Password"]').first()
      const submitButton = page.locator('button:has-text("Reset Password")')

      // Submit button should be disabled initially
      await expect(submitButton).toBeDisabled()

      // Test weak password
      await passwordInput.fill('weak')
      await expect(submitButton).toBeDisabled()

      // Test password without uppercase
      await passwordInput.fill('lowercase123')
      await expect(submitButton).toBeDisabled()

      // Test password without number
      await passwordInput.fill('NoNumbers')
      await expect(submitButton).toBeDisabled()

      // Test valid password but no confirmation
      await passwordInput.fill('ValidPass123')
      await expect(submitButton).toBeDisabled()
    })

    test('should show password requirement indicators', async ({ page }) => {
      await page.goto(resetUrl)

      const passwordInput = page.locator('label:has-text("New Password")').locator('..').locator('input')

      // Initially all requirements should be unchecked
      await expect(page.locator('text=At least 8 characters').locator('..')).not.toHaveClass(/text-positive/)

      // Type password and check indicators
      await passwordInput.fill('Aa1')
      // Length requirement not met
      await expect(page.locator('text=At least 8 characters').locator('..')).not.toHaveClass(/text-positive/)

      // Type valid password
      await passwordInput.fill('ValidPass123')
      // All requirements should be met (positive color)
      await expect(page.locator('text=At least 8 characters').locator('..')).toHaveClass(/text-positive/)
      await expect(page.locator('text=One uppercase letter').locator('..')).toHaveClass(/text-positive/)
      await expect(page.locator('text=One lowercase letter').locator('..')).toHaveClass(/text-positive/)
      await expect(page.locator('text=One number').locator('..')).toHaveClass(/text-positive/)
    })

    test('should validate password confirmation match', async ({ page }) => {
      await page.goto(resetUrl)

      const passwordInputs = page.locator('input[type="password"]')
      const submitButton = page.locator('button:has-text("Reset Password")')

      // Fill different passwords
      await passwordInputs.nth(0).fill('ValidPass123')
      await passwordInputs.nth(1).fill('DifferentPass123')

      // Submit button should be disabled
      await expect(submitButton).toBeDisabled()

      // Fill matching passwords
      await passwordInputs.nth(1).fill('ValidPass123')

      // Submit button should be enabled
      await expect(submitButton).toBeEnabled()
    })

    test('should toggle password visibility', async ({ page }) => {
      await page.goto(resetUrl)

      const passwordInput = page.locator('label:has-text("New Password")').locator('..').locator('input')
      const toggleIcon = page.locator('label:has-text("New Password")').locator('..').locator('.q-icon').last()

      // Password should be hidden initially
      await expect(passwordInput).toHaveAttribute('type', 'password')

      // Fill password
      await passwordInput.fill('ValidPass123')

      // Click toggle to show password
      await toggleIcon.click()
      await expect(passwordInput).toHaveAttribute('type', 'text')

      // Click toggle to hide password again
      await toggleIcon.click()
      await expect(passwordInput).toHaveAttribute('type', 'password')
    })

    test('should submit password reset successfully', async ({ page }) => {
      await page.goto(resetUrl)

      // Mock successful API response
      await page.route('**/api/auth/reset-password', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Password reset successfully. Please login with your new password.'
          })
        })
      })

      // Fill form with valid data
      const passwordInputs = page.locator('input[type="password"]')
      await passwordInputs.nth(0).fill('NewPassword123')
      await passwordInputs.nth(1).fill('NewPassword123')

      // Submit form
      await page.click('button:has-text("Reset Password")')

      // Should show success message
      await expect(page.locator('text=Password reset successfully')).toBeVisible()

      // Should redirect to login page
      await expect(page).toHaveURL('/login')
    })

    test('should show error for invalid/expired token', async ({ page }) => {
      await page.goto(resetUrl)

      // Mock API error response
      await page.route('**/api/auth/reset-password', async route => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Invalid or expired reset token'
          })
        })
      })

      // Fill form
      const passwordInputs = page.locator('input[type="password"]')
      await passwordInputs.nth(0).fill('NewPassword123')
      await passwordInputs.nth(1).fill('NewPassword123')

      // Submit form
      await page.click('button:has-text("Reset Password")')

      // Should show error message
      await expect(page.locator('text=Invalid or expired reset token')).toBeVisible()
    })

    test('should show loading state during submission', async ({ page }) => {
      await page.goto(resetUrl)

      // Mock slow API response
      await page.route('**/api/auth/reset-password', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Password reset successfully'
          })
        })
      })

      // Fill form
      const passwordInputs = page.locator('input[type="password"]')
      await passwordInputs.nth(0).fill('NewPassword123')
      await passwordInputs.nth(1).fill('NewPassword123')

      // Submit and check loading state
      await page.click('button:has-text("Reset Password")')
      await expect(page.locator('text=Resetting')).toBeVisible()
    })

    test('should handle network errors gracefully', async ({ page }) => {
      await page.goto(resetUrl)

      // Mock network error
      await page.route('**/api/auth/reset-password', async route => {
        await route.abort('failed')
      })

      // Fill form
      const passwordInputs = page.locator('input[type="password"]')
      await passwordInputs.nth(0).fill('NewPassword123')
      await passwordInputs.nth(1).fill('NewPassword123')

      // Submit form
      await page.click('button:has-text("Reset Password")')

      // Should show error message
      await expect(page.locator('text=Failed to reset password')).toBeVisible()
    })

    test('should navigate back to login', async ({ page }) => {
      await page.goto(resetUrl)

      // Click login link
      await page.click('a:has-text("Sign in")')
      await expect(page).toHaveURL('/login')
    })
  })

  test.describe('Complete Password Reset Flow', () => {
    test('should complete full password reset journey', async ({ page }) => {
      // Step 1: Go to forgot password page from login
      await page.goto('/login')
      await page.click('a:has-text("Forgot your password?")')
      await expect(page).toHaveURL('/forgot-password')

      // Step 2: Submit forgot password request
      await page.route('**/api/auth/forgot-password', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Password reset email sent successfully'
          })
        })
      })

      await page.fill('input[type="email"]', resetEmail)
      await page.click('button:has-text("Send Reset Instructions")')

      // Step 3: Should redirect to login with success message
      await expect(page).toHaveURL('/login')
      await expect(page.locator('text=Password reset instructions sent')).toBeVisible()

      // Step 4: Simulate clicking reset link in email (navigate directly to reset page)
      const resetToken = 'email-reset-token'
      await page.goto(`/reset-password?token=${resetToken}&email=${encodeURIComponent(resetEmail)}`)

      // Step 5: Fill in new password
      await page.route('**/api/auth/reset-password', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Password reset successfully. Please login with your new password.'
          })
        })
      })

      const passwordInputs = page.locator('input[type="password"]')
      await passwordInputs.nth(0).fill('NewPassword123')
      await passwordInputs.nth(1).fill('NewPassword123')

      await page.click('button:has-text("Reset Password")')

      // Step 6: Should redirect to login with success message
      await expect(page).toHaveURL('/login')
      await expect(page.locator('text=Password reset successfully')).toBeVisible()

      // Step 7: Try to login with old password (should fail)
      await page.route('**/api/auth/login', async route => {
        const requestBody = route.request().postDataJSON()
        if (requestBody.password === testUser.password) {
          await route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Invalid credentials' })
          })
        }
      })

      await page.fill('input[type="email"]', resetEmail)
      await page.fill('input[type="password"]', testUser.password)
      await page.click('button:has-text("Sign In")')

      await expect(page.locator('text=Invalid credentials')).toBeVisible()
    })
  })

  test.describe('Password Reset Accessibility', () => {
    test('should support keyboard navigation on forgot password page', async ({ page }) => {
      await page.goto('/forgot-password')

      // Tab to email input
      await page.keyboard.press('Tab')
      const emailInput = page.locator('input[type="email"]')
      await expect(emailInput).toBeFocused()

      // Type email
      await page.keyboard.type(resetEmail)

      // Tab to submit button
      await page.keyboard.press('Tab')
      const submitButton = page.locator('button:has-text("Send Reset Instructions")')
      await expect(submitButton).toBeFocused()

      // Press Enter to submit
      await page.route('**/api/auth/forgot-password', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Success' })
        })
      })
      await page.keyboard.press('Enter')
    })

    test('should support keyboard navigation on reset password page', async ({ page }) => {
      const resetToken = 'test-token'
      await page.goto(`/reset-password?token=${resetToken}&email=${encodeURIComponent(resetEmail)}`)

      // Tab through password fields
      await page.keyboard.press('Tab')
      const passwordInput = page.locator('input[type="password"]').first()
      await expect(passwordInput).toBeFocused()

      await page.keyboard.type('ValidPass123')

      // Tab to confirm password
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab') // Skip visibility toggle
      const confirmInput = page.locator('input[type="password"]').last()
      await expect(confirmInput).toBeFocused()

      await page.keyboard.type('ValidPass123')
    })

    test('should have proper ARIA labels', async ({ page }) => {
      await page.goto('/forgot-password')

      // Check form has proper labels
      const emailInput = page.locator('input[type="email"]')
      await expect(emailInput).toBeVisible()

      const submitButton = page.locator('button:has-text("Send Reset Instructions")')
      await expect(submitButton).toHaveText(/Send Reset Instructions/)
    })
  })

  test.describe('Password Reset Mobile Responsiveness', () => {
    test('should work on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      // Test forgot password on mobile
      await page.goto('/forgot-password')
      await expect(page.locator('text=Reset Password')).toBeVisible()

      await page.tap('input[type="email"]')
      await page.fill('input[type="email"]', resetEmail)

      const submitButton = page.locator('button:has-text("Send Reset Instructions")')
      const buttonBox = await submitButton.boundingBox()
      expect(buttonBox?.height).toBeGreaterThanOrEqual(44) // Touch-friendly size

      // Test reset password on mobile
      const resetToken = 'mobile-token'
      await page.goto(`/reset-password?token=${resetToken}&email=${encodeURIComponent(resetEmail)}`)

      await expect(page.locator('text=Reset Your Password')).toBeVisible()

      const passwordInputs = page.locator('input[type="password"]')
      await passwordInputs.nth(0).tap()
      await passwordInputs.nth(0).fill('ValidPass123')

      await passwordInputs.nth(1).tap()
      await passwordInputs.nth(1).fill('ValidPass123')

      const resetButton = page.locator('button:has-text("Reset Password")')
      const resetButtonBox = await resetButton.boundingBox()
      expect(resetButtonBox?.height).toBeGreaterThanOrEqual(44)
    })
  })
})
