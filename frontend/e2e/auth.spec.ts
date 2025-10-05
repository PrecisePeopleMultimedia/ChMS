import { test, expect } from '@playwright/test'

// Test data
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: 'password123'
}

const newUser = {
  firstName: 'New',
  lastName: 'User',
  email: `new.user.${Date.now()}@example.com`,
  password: 'newpassword123'
}

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/')
  })

  test.describe('Login Flow', () => {
    test('should display login form correctly', async ({ page }) => {
      await page.goto('/login')

      // Check page title and branding
      await expect(page.locator('h1')).toContainText('ChurchAfrica')
      await expect(page.locator('text=Welcome to ChurchAfrica')).toBeVisible()
      await expect(page.locator('text=Sign in to your account')).toBeVisible()

      // Check form elements
      await expect(page.locator('input[type="email"]')).toBeVisible()
      await expect(page.locator('input[type="password"]')).toBeVisible()
      await expect(page.locator('button:has-text("Sign In")')).toBeVisible()
      await expect(page.locator('button:has-text("Continue with Google")')).toBeVisible()

      // Check navigation links
      await expect(page.locator('text=Don\'t have an account?')).toBeVisible()
      await expect(page.locator('a:has-text("Sign up")')).toBeVisible()
    })

    test('should login successfully with valid credentials', async ({ page }) => {
      await page.goto('/login')

      // Fill login form
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)

      // Submit form
      await page.click('button:has-text("Sign In")')

      // Should redirect to dashboard
      await expect(page).toHaveURL('/dashboard')
      
      // Check dashboard content
      await expect(page.locator('text=Welcome back')).toBeVisible()
      await expect(page.locator('text=ChurchAfrica Dashboard')).toBeVisible()
      await expect(page.locator('button:has-text("Logout")')).toBeVisible()
    })

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/login')

      // Fill with invalid credentials
      await page.fill('input[type="email"]', 'invalid@example.com')
      await page.fill('input[type="password"]', 'wrongpassword')

      // Submit form
      await page.click('button:has-text("Sign In")')

      // Should show error message
      await expect(page.locator('.q-banner, .modern-alert')).toBeVisible()
      await expect(page.locator('text=Invalid credentials')).toBeVisible()

      // Should stay on login page
      await expect(page).toHaveURL('/login')
    })

    test('should show validation errors for empty fields', async ({ page }) => {
      await page.goto('/login')

      // Try to submit empty form
      await page.click('button:has-text("Sign In")')

      // Should show validation errors or disable button
      const signInButton = page.locator('button:has-text("Sign In")')
      await expect(signInButton).toBeDisabled()
    })

    test('should show loading state during login', async ({ page }) => {
      await page.goto('/login')

      // Fill form
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)

      // Submit and check loading state
      await page.click('button:has-text("Sign In")')
      
      // Should show loading state (spinner or loading text)
      await expect(page.locator('text=Signing in, .q-spinner, .animate-pulse')).toBeVisible()
    })
  })

  test.describe('Registration Flow', () => {
    test('should display registration form correctly', async ({ page }) => {
      await page.goto('/register')

      // Check page title and branding
      await expect(page.locator('text=Create Your Account')).toBeVisible()
      await expect(page.locator('text=Join ChurchAfrica today')).toBeVisible()

      // Check form elements
      await expect(page.locator('input[placeholder*="First"]')).toBeVisible()
      await expect(page.locator('input[placeholder*="Last"]')).toBeVisible()
      await expect(page.locator('input[type="email"]')).toBeVisible()
      await expect(page.locator('input[type="password"]').first()).toBeVisible()
      await expect(page.locator('input[placeholder*="Confirm"]')).toBeVisible()
      await expect(page.locator('button:has-text("Create Account")')).toBeVisible()

      // Check navigation links
      await expect(page.locator('text=Already have an account?')).toBeVisible()
      await expect(page.locator('a:has-text("Sign in")')).toBeVisible()
    })

    test('should register successfully with valid data', async ({ page }) => {
      await page.goto('/register')

      // Fill registration form
      await page.fill('input[placeholder*="First"]', newUser.firstName)
      await page.fill('input[placeholder*="Last"]', newUser.lastName)
      await page.fill('input[type="email"]', newUser.email)
      await page.fill('input[type="password"]', newUser.password)
      await page.fill('input[placeholder*="Confirm"]', newUser.password)

      // Submit form
      await page.click('button:has-text("Create Account")')

      // Should redirect to dashboard
      await expect(page).toHaveURL('/dashboard')
      
      // Check dashboard shows new user
      await expect(page.locator(`text=${newUser.firstName}`)).toBeVisible()
    })

    test('should show error for mismatched passwords', async ({ page }) => {
      await page.goto('/register')

      // Fill form with mismatched passwords
      await page.fill('input[placeholder*="First"]', 'Test')
      await page.fill('input[placeholder*="Last"]', 'User')
      await page.fill('input[type="email"]', 'test@example.com')
      await page.fill('input[type="password"]', 'password123')
      await page.fill('input[placeholder*="Confirm"]', 'differentpassword')

      // Submit form
      await page.click('button:has-text("Create Account")')

      // Should show validation error
      await expect(page.locator('text=Passwords do not match, text=Password confirmation')).toBeVisible()
    })

    test('should show error for existing email', async ({ page }) => {
      await page.goto('/register')

      // Fill form with existing email
      await page.fill('input[placeholder*="First"]', 'Test')
      await page.fill('input[placeholder*="Last"]', 'User')
      await page.fill('input[type="email"]', testUser.email) // Existing email
      await page.fill('input[type="password"]', 'password123')
      await page.fill('input[placeholder*="Confirm"]', 'password123')

      // Submit form
      await page.click('button:has-text("Create Account")')

      // Should show error message
      await expect(page.locator('text=Email already exists, text=already taken')).toBeVisible()
    })
  })

  test.describe('Dashboard and Logout', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each dashboard test
      await page.goto('/login')
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)
      await page.click('button:has-text("Sign In")')
      await expect(page).toHaveURL('/dashboard')
    })

    test('should display dashboard correctly', async ({ page }) => {
      // Check dashboard elements
      await expect(page.locator('text=Welcome back')).toBeVisible()
      await expect(page.locator('text=ChurchAfrica Dashboard')).toBeVisible()
      
      // Check user profile card
      await expect(page.locator('text=Your Profile')).toBeVisible()
      await expect(page.locator(`text=${testUser.email}`)).toBeVisible()
      
      // Check quick actions
      await expect(page.locator('text=Quick Actions')).toBeVisible()
      await expect(page.locator('button:has-text("Edit Profile")')).toBeVisible()
      await expect(page.locator('button:has-text("Settings")')).toBeVisible()
      
      // Check system status
      await expect(page.locator('text=System Status')).toBeVisible()
      await expect(page.locator('text=Backend Connected')).toBeVisible()
    })

    test('should logout successfully', async ({ page }) => {
      // Click logout button
      await page.click('button:has-text("Logout")')

      // Should redirect to login page
      await expect(page).toHaveURL('/login')
      
      // Should show success message
      await expect(page.locator('text=Logged out successfully')).toBeVisible()
      
      // Should not be able to access dashboard
      await page.goto('/dashboard')
      await expect(page).toHaveURL('/login')
    })

    test('should show loading state during logout', async ({ page }) => {
      // Click logout and check loading state
      await page.click('button:has-text("Logout")')
      
      // Should show loading state briefly
      await expect(page.locator('.q-spinner, text=Logging out')).toBeVisible()
    })
  })

  test.describe('Google OAuth Flow', () => {
    test('should display Google login button', async ({ page }) => {
      await page.goto('/login')

      const googleButton = page.locator('button:has-text("Continue with Google")')
      await expect(googleButton).toBeVisible()
      await expect(googleButton.locator('img[alt="Google"]')).toBeVisible()
    })

    test('should redirect to Google OAuth when clicked', async ({ page }) => {
      await page.goto('/login')

      // Mock the Google OAuth redirect
      await page.route('**/api/auth/google', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            redirect_url: 'https://accounts.google.com/o/oauth2/auth?client_id=test'
          })
        })
      })

      // Click Google login button
      const googleButton = page.locator('button:has-text("Continue with Google")')
      await googleButton.click()

      // Should make request to Google OAuth endpoint
      // Note: In a real test, this would redirect to Google
      // For testing purposes, we're mocking the response
    })
  })

  test.describe('Navigation and Routing', () => {
    test('should redirect unauthenticated users to login', async ({ page }) => {
      await page.goto('/dashboard')
      await expect(page).toHaveURL('/login')
    })

    test('should navigate between login and register', async ({ page }) => {
      await page.goto('/login')
      
      // Go to register
      await page.click('a:has-text("Sign up")')
      await expect(page).toHaveURL('/register')
      
      // Go back to login
      await page.click('a:has-text("Sign in")')
      await expect(page).toHaveURL('/login')
    })

    test('should redirect authenticated users away from auth pages', async ({ page }) => {
      // Login first
      await page.goto('/login')
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)
      await page.click('button:has-text("Sign In")')
      await expect(page).toHaveURL('/dashboard')

      // Try to access login page while authenticated
      await page.goto('/login')
      await expect(page).toHaveURL('/dashboard')

      // Try to access register page while authenticated
      await page.goto('/register')
      await expect(page).toHaveURL('/dashboard')
    })
  })

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      await page.goto('/login')

      // Mock network error
      await page.route('**/api/auth/login', async route => {
        await route.abort('failed')
      })

      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)
      await page.click('button:has-text("Sign In")')

      // Should show network error message
      await expect(page.locator('text=Network error, text=Connection failed')).toBeVisible()
    })

    test('should handle server errors gracefully', async ({ page }) => {
      await page.goto('/login')

      // Mock server error
      await page.route('**/api/auth/login', async route => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal server error' })
        })
      })

      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)
      await page.click('button:has-text("Sign In")')

      // Should show server error message
      await expect(page.locator('text=Server error, text=Something went wrong')).toBeVisible()
    })
  })
})
