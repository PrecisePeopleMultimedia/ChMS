import { Page } from '@playwright/test'
import { userFixtures, organizationFixtures, memberFixtures } from '../fixtures/test-data'

/**
 * Database Helpers for Regression Testing
 * 
 * Utilities for seeding test data and cleaning up after tests
 * to ensure consistent test environments.
 */

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8000/api'

/**
 * Seed test users in the database
 */
export async function seedTestUsers(page: Page) {
  // Mock the user creation API calls
  await page.route('**/api/auth/register', async (route) => {
    const requestBody = route.request().postDataJSON()
    
    // Return appropriate user based on email
    let user = userFixtures.member
    if (requestBody.email === userFixtures.admin.email) {
      user = userFixtures.admin
    } else if (requestBody.email === userFixtures.staff.email) {
      user = userFixtures.staff
    }
    
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'User registered successfully',
        user,
        token: 'test-jwt-token',
        expires_at: '2024-12-01T00:00:00Z'
      })
    })
  })
  
  // Mock login API calls
  await page.route('**/api/auth/login', async (route) => {
    const requestBody = route.request().postDataJSON()
    
    // Check credentials and return appropriate user
    let user = null
    if (requestBody.email === userFixtures.admin.email && requestBody.password === userFixtures.admin.password) {
      user = userFixtures.admin
    } else if (requestBody.email === userFixtures.staff.email && requestBody.password === userFixtures.staff.password) {
      user = userFixtures.staff
    } else if (requestBody.email === userFixtures.member.email && requestBody.password === userFixtures.member.password) {
      user = userFixtures.member
    }
    
    if (user) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Login successful',
          user,
          token: 'test-jwt-token',
          expires_at: '2024-12-01T00:00:00Z'
        })
      })
    } else {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Invalid credentials'
        })
      })
    }
  })
}

/**
 * Seed test organization data
 */
export async function seedTestOrganization(page: Page) {
  await page.route('**/api/organizations', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [organizationFixtures.testChurch]
      })
    })
  })
  
  await page.route('**/api/organizations/1', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: organizationFixtures.testChurch
      })
    })
  })
}

/**
 * Seed test member data
 */
export async function seedTestMembers(page: Page) {
  const members = [memberFixtures.johnDoe, memberFixtures.janeDoe, memberFixtures.visitor]
  
  // Mock members list API
  await page.route('**/api/members', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: members,
          meta: {
            current_page: 1,
            per_page: 15,
            total: members.length,
            last_page: 1
          }
        })
      })
    } else if (route.request().method() === 'POST') {
      const requestBody = route.request().postDataJSON()
      const newMember = {
        id: members.length + 1,
        organization_id: 1,
        ...requestBody,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Member created successfully',
          data: newMember
        })
      })
    }
  })
  
  // Mock individual member API calls
  members.forEach(member => {
    page.route(`**/api/members/${member.id}`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: member
          })
        })
      } else if (route.request().method() === 'PUT') {
        const requestBody = route.request().postDataJSON()
        const updatedMember = {
          ...member,
          ...requestBody,
          updated_at: new Date().toISOString()
        }
        
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Member updated successfully',
            data: updatedMember
          })
        })
      } else if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Member deleted successfully'
          })
        })
      }
    })
  })
}

/**
 * Seed dashboard data
 */
export async function seedDashboardData(page: Page) {
  await page.route('**/api/dashboard/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        memberStats: { totalMembers: 150, newMembersThisMonth: 8 },
        attendanceOverview: { todayAttendance: 85, weeklyAverage: 78 },
        systemStatus: { connectionStatus: 'online', lastSync: new Date().toISOString() },
        recentActivities: []
      })
    })
  })
}

/**
 * Setup all test data for a complete test environment
 */
export async function setupTestEnvironment(page: Page) {
  await seedTestUsers(page)
  await seedTestOrganization(page)
  await seedTestMembers(page)
  await seedDashboardData(page)
}

/**
 * Clean up test data after tests
 */
export async function cleanupTestData(page: Page) {
  // Clear all route mocks
  await page.unroute('**/*')
  
  // Clear localStorage and sessionStorage
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
  
  // Clear cookies
  await page.context().clearCookies()
}

/**
 * Reset database to clean state
 */
export async function resetDatabase(page: Page) {
  // In a real implementation, this would call a test API endpoint
  // to reset the database to a clean state
  await cleanupTestData(page)
  await setupTestEnvironment(page)
}

/**
 * Verify test data integrity
 */
export async function verifyTestData(page: Page) {
  // Verify users exist
  await page.goto('/login')
  await page.fill('input[type="email"]', userFixtures.member.email)
  await page.fill('input[type="password"]', userFixtures.member.password)
  await page.click('button:has-text("Sign In")')
  
  // Should successfully login
  await page.waitForURL('/dashboard')
  
  // Logout for cleanup
  await page.click('button:has-text("Logout")')
  await page.waitForURL('/login')
}
