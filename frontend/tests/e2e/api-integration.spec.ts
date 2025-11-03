import { test, expect } from '@playwright/test'

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123'
}

test.describe('API Integration Tests', () => {
  test.describe('Authentication API', () => {
    test('should handle login API correctly', async ({ page }) => {
      await page.goto('/login')
      
      // Mock successful login response
      await page.route('**/api/auth/login', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Login successful',
            user: {
              id: 1,
              name: 'Test User',
              email: testUser.email,
              first_name: 'Test',
              last_name: 'User',
              role: 'member'
            },
            token: 'mock-jwt-token'
          })
        })
      })
      
      // Fill and submit login form
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)
      await page.click('button:has-text("Sign In")')
      
      // Should redirect to dashboard
      await expect(page).toHaveURL('/dashboard')
    })

    test('should handle login API errors', async ({ page }) => {
      await page.goto('/login')
      
      // Mock login error response
      await page.route('**/api/auth/login', async (route) => {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Invalid credentials'
          })
        })
      })
      
      // Fill and submit login form
      await page.fill('input[type="email"]', 'invalid@example.com')
      await page.fill('input[type="password"]', 'wrongpassword')
      await page.click('button:has-text("Sign In")')
      
      // Should show error message
      await expect(page.locator('text=Invalid credentials')).toBeVisible()
      await expect(page).toHaveURL('/login')
    })

    test('should handle registration API correctly', async ({ page }) => {
      await page.goto('/register')
      
      // Mock successful registration response
      await page.route('**/api/auth/register', async (route) => {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Registration successful',
            user: {
              id: 2,
              name: 'New User',
              email: 'new@example.com',
              first_name: 'New',
              last_name: 'User',
              role: 'member'
            },
            token: 'mock-jwt-token'
          })
        })
      })
      
      // Fill registration form
      await page.fill('input[placeholder*="First"]', 'New')
      await page.fill('input[placeholder*="Last"]', 'User')
      await page.fill('input[type="email"]', 'new@example.com')
      await page.fill('input[type="password"]', 'password123')
      await page.fill('input[placeholder*="Confirm"]', 'password123')
      
      // Submit form
      await page.click('button:has-text("Create Account")')
      
      // Should redirect to dashboard
      await expect(page).toHaveURL('/dashboard')
    })

    test('should handle logout API correctly', async ({ page }) => {
      // Login first
      await page.goto('/login')
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)
      await page.click('button:has-text("Sign In")')
      await expect(page).toHaveURL('/dashboard')
      
      // Mock logout response
      await page.route('**/api/auth/logout', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Logout successful'
          })
        })
      })
      
      // Click logout
      await page.click('button:has-text("Logout")')
      
      // Should redirect to login
      await expect(page).toHaveURL('/login')
    })
  })

  test.describe('Dashboard API', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.goto('/login')
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)
      await page.click('button:has-text("Sign In")')
      await expect(page).toHaveURL('/dashboard')
    })

    test('should load dashboard data from API', async ({ page }) => {
      // Mock dashboard API responses
      await page.route('**/api/dashboard/member-stats', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            totalMembers: 150,
            newMembersThisMonth: 12,
            activeMembers: 120,
            memberGrowthRate: 8.5
          })
        })
      })

      await page.route('**/api/dashboard/attendance-overview', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            todayAttendance: 45,
            weeklyAverage: 42,
            monthlyTrend: 'up'
          })
        })
      })

      await page.route('**/api/dashboard/system-status', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            connectionStatus: 'online',
            lastSync: new Date().toISOString(),
            pendingSyncItems: 0,
            databaseStatus: 'connected',
            cacheStatus: 'healthy'
          })
        })
      })

      await page.route('**/api/dashboard/recent-activities', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: '1',
              type: 'member_added',
              description: 'New member John Doe joined',
              timestamp: new Date().toISOString(),
              user: 'Admin'
            }
          ])
        })
      })

      // Reload dashboard to trigger API calls
      await page.reload()
      
      // Should display dashboard with data
      await expect(page.locator('text=Site Performance Metrics')).toBeVisible()
    })

    test('should handle API errors gracefully', async ({ page }) => {
      // Mock API error
      await page.route('**/api/dashboard/**', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Internal server error'
          })
        })
      })

      // Reload dashboard
      await page.reload()
      
      // Should show error message
      await expect(page.locator('text=Failed to load dashboard data')).toBeVisible()
    })

    test('should handle slow API responses', async ({ page }) => {
      // Mock slow API response
      await page.route('**/api/dashboard/**', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 2000))
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            memberStats: { totalMembers: 100 },
            attendanceOverview: { todayAttendance: 50 },
            systemStatus: { connectionStatus: 'online' },
            recentActivities: []
          })
        })
      })

      // Reload dashboard
      await page.reload()
      
      // Should show loading state
      await expect(page.locator('.q-spinner, .loading')).toBeVisible()
      
      // Should eventually load
      await expect(page.locator('text=Site Performance Metrics')).toBeVisible({ timeout: 10000 })
    })
  })

  test.describe('Network Error Handling', () => {
    test('should handle network failures', async ({ page }) => {
      await page.goto('/login')
      
      // Mock network failure
      await page.route('**/api/auth/login', async (route) => {
        await route.abort('failed')
      })
      
      // Try to login
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)
      await page.click('button:has-text("Sign In")')
      
      // Should show network error
      await expect(page.locator('text=Network error, text=Connection failed')).toBeVisible()
    })

    test('should handle timeout errors', async ({ page }) => {
      await page.goto('/login')
      
      // Mock timeout
      await page.route('**/api/auth/login', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 10000))
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Success' })
        })
      })
      
      // Try to login
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)
      await page.click('button:has-text("Sign In")')
      
      // Should show timeout error
      await expect(page.locator('text=Request timeout, text=Connection timeout')).toBeVisible()
    })
  })

  test.describe('API Rate Limiting', () => {
    test('should handle rate limiting', async ({ page }) => {
      await page.goto('/login')
      
      // Mock rate limit response
      await page.route('**/api/auth/login', async (route) => {
        await route.fulfill({
          status: 429,
          contentType: 'application/json',
          headers: {
            'Retry-After': '60'
          },
          body: JSON.stringify({
            message: 'Too many requests',
            retryAfter: 60
          })
        })
      })
      
      // Try to login
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)
      await page.click('button:has-text("Sign In")')
      
      // Should show rate limit error
      await expect(page.locator('text=Too many requests, text=Rate limit exceeded')).toBeVisible()
    })
  })

  test.describe('CORS and Security', () => {
    test('should handle CORS errors', async ({ page }) => {
      await page.goto('/login')
      
      // Mock CORS error
      await page.route('**/api/auth/login', async (route) => {
        await route.fulfill({
          status: 0, // Network error
          body: ''
        })
      })
      
      // Try to login
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)
      await page.click('button:has-text("Sign In")')
      
      // Should show CORS error
      await expect(page.locator('text=CORS error, text=Cross-origin request blocked')).toBeVisible()
    })

    test('should handle authentication token expiry', async ({ page }) => {
      // Login first
      await page.goto('/login')
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)
      await page.click('button:has-text("Sign In")')
      await expect(page).toHaveURL('/dashboard')
      
      // Mock token expiry
      await page.route('**/api/dashboard/**', async (route) => {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Token expired'
          })
        })
      })
      
      // Try to access dashboard
      await page.reload()
      
      // Should redirect to login
      await expect(page).toHaveURL('/login')
    })
  })

  test.describe('Data Validation', () => {
    test('should validate email format', async ({ page }) => {
      await page.goto('/login')
      
      // Try invalid email
      await page.fill('input[type="email"]', 'invalid-email')
      await page.fill('input[type="password"]', testUser.password)
      await page.click('button:has-text("Sign In")')
      
      // Should show validation error
      await expect(page.locator('text=Invalid email format')).toBeVisible()
    })

    test('should validate password requirements', async ({ page }) => {
      await page.goto('/register')
      
      // Try weak password
      await page.fill('input[placeholder*="First"]', 'Test')
      await page.fill('input[placeholder*="Last"]', 'User')
      await page.fill('input[type="email"]', 'test@example.com')
      await page.fill('input[type="password"]', '123')
      await page.fill('input[placeholder*="Confirm"]', '123')
      
      await page.click('button:has-text("Create Account")')
      
      // Should show validation error
      await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible()
    })

    test('should validate required fields', async ({ page }) => {
      await page.goto('/register')
      
      // Try to submit empty form
      await page.click('button:has-text("Create Account")')
      
      // Should show validation errors
      await expect(page.locator('text=First name is required')).toBeVisible()
      await expect(page.locator('text=Last name is required')).toBeVisible()
      await expect(page.locator('text=Email is required')).toBeVisible()
    })
  })

  test.describe('Performance Monitoring', () => {
    test('should measure API response times', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/login')
      
      // Mock API with known delay
      await page.route('**/api/auth/login', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 500))
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Success',
            user: { id: 1, name: 'Test User' },
            token: 'mock-token'
          })
        })
      })
      
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)
      await page.click('button:has-text("Sign In")')
      
      const endTime = Date.now()
      const responseTime = endTime - startTime
      
      // Should complete within reasonable time
      expect(responseTime).toBeLessThan(2000)
    })

    test('should handle concurrent API requests', async ({ page }) => {
      // Login first
      await page.goto('/login')
      await page.fill('input[type="email"]', testUser.email)
      await page.fill('input[type="password"]', testUser.password)
      await page.click('button:has-text("Sign In")')
      await expect(page).toHaveURL('/dashboard')
      
      // Mock multiple API endpoints
      await page.route('**/api/dashboard/**', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 100))
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({})
        })
      })
      
      // Trigger multiple API calls
      await page.reload()
      
      // Should handle all requests without issues
      await expect(page.locator('text=Site Performance Metrics')).toBeVisible()
    })
  })
})
