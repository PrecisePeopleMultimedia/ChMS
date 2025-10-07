import { test, expect } from '@playwright/test';

test.describe('Attendance System - Complete Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/login');
    
    // Mock successful login
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Login successful',
          user: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            role: 'admin',
            organization_id: 1
          },
          token: 'mock-token'
        })
      });
    });
    
    // Fill login form
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard');
  });

  test('should complete full attendance workflow', async ({ page }) => {
    // Navigate to attendance page
    await page.goto('/attendance');
    
    // Check if attendance page loads
    await expect(page.locator('h1')).toContainText('Attendance Management');
    
    // Mock services API
    await page.route('**/api/services/today', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 1,
              organization_id: 1,
              name: 'Sunday Service',
              service_date: '2025-01-06',
              start_time: '10:00:00',
              service_type: 'sunday_service',
              is_active: true,
              created_at: '2025-01-06T00:00:00Z',
              updated_at: '2025-01-06T00:00:00Z'
            }
          ]
        })
      });
    });

    // Wait for services to load
    await page.waitForSelector('.service-item');
    
    // Select a service
    await page.click('.service-item:first-child');
    
    // Check if attendance dashboard is visible
    await expect(page.locator('.attendance-overview')).toBeVisible();
    
    // Test QR Code check-in
    await page.click('.method-card:has-text("QR Code")');
    await expect(page.locator('.checkin-modal')).toBeVisible();
    await expect(page.locator('.qr-scanner-container')).toBeVisible();
    
    // Close QR scanner
    await page.click('button:has-text("Close")');
    
    // Test Manual check-in
    await page.click('.method-card:has-text("Manual")');
    await expect(page.locator('.checkin-modal')).toBeVisible();
    await expect(page.locator('.member-checkin-container')).toBeVisible();
    
    // Mock member search
    await page.route('**/api/members/search', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 1,
              name: 'John Doe',
              first_name: 'John',
              last_name: 'Doe',
              email: 'john@example.com',
              phone: '+1234567890',
              role: 'member'
            }
          ]
        })
      });
    });
    
    // Search for member
    await page.fill('input[type="text"]', 'John');
    await page.waitForSelector('.member-item');
    
    // Select member
    await page.click('.member-item:first-child');
    
    // Mock attendance recording
    await page.route('**/api/attendance', async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Attendance recorded successfully',
          data: {
            id: 1,
            organization_id: 1,
            service_id: 1,
            member_id: 1,
            check_in_time: '2025-01-06T10:00:00Z',
            check_in_method: 'manual_search',
            created_at: '2025-01-06T10:00:00Z',
            updated_at: '2025-01-06T10:00:00Z'
          }
        })
      });
    });
    
    // Check in member
    await page.click('button:has-text("Check In")');
    
    // Check for success notification
    await expect(page.locator('.q-notification')).toContainText('John Doe checked in successfully');
    
    // Close modal
    await page.click('button:has-text("Close")');
    
    // Test Visitor check-in
    await page.click('.method-card:has-text("Visitor")');
    await expect(page.locator('.checkin-modal')).toBeVisible();
    await expect(page.locator('.visitor-checkin-container')).toBeVisible();
    
    // Fill visitor form
    await page.fill('input[placeholder*="First Name"]', 'Jane');
    await page.fill('input[placeholder*="Last Name"]', 'Smith');
    await page.fill('input[type="tel"]', '+1234567890');
    await page.fill('input[type="email"]', 'jane@example.com');
    await page.selectOption('select', 'First time visitor');
    await page.fill('textarea[placeholder*="additional information"]', 'Test visitor');
    
    // Mock visitor attendance recording
    await page.route('**/api/attendance', async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Attendance recorded successfully',
          data: {
            id: 2,
            organization_id: 1,
            service_id: 1,
            visitor_name: 'Jane Smith',
            visitor_phone: '+1234567890',
            check_in_time: '2025-01-06T10:05:00Z',
            check_in_method: 'visitor',
            created_at: '2025-01-06T10:05:00Z',
            updated_at: '2025-01-06T10:05:00Z'
          }
        })
      });
    });
    
    // Submit visitor form
    await page.click('button[type="submit"]');
    
    // Check for success notification
    await expect(page.locator('.q-notification')).toContainText('Jane Smith checked in successfully');
    
    // Close modal
    await page.click('button:has-text("Close")');
    
    // Check if attendance is reflected in dashboard
    await expect(page.locator('.stat-value').first()).toContainText('2');
    await expect(page.locator('.checkin-item')).toHaveCount(2);
  });

  test('should handle offline mode gracefully', async ({ page }) => {
    await page.goto('/attendance');
    
    // Simulate offline mode
    await page.context().setOffline(true);
    
    // Check if offline indicator appears
    await expect(page.locator('.offline-indicator')).toBeVisible();
    await expect(page.locator('.offline-indicator')).toContainText('You\'re offline');
    
    // Test offline attendance recording
    await page.route('**/api/services/today', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 1,
              organization_id: 1,
              name: 'Sunday Service',
              service_date: '2025-01-06',
              start_time: '10:00:00',
              service_type: 'sunday_service',
              is_active: true,
              created_at: '2025-01-06T00:00:00Z',
              updated_at: '2025-01-06T00:00:00Z'
            }
          ]
        })
      });
    });
    
    await page.waitForSelector('.service-item');
    await page.click('.service-item:first-child');
    
    // Test offline visitor check-in
    await page.click('.method-card:has-text("Visitor")');
    
    // Fill visitor form
    await page.fill('input[placeholder*="First Name"]', 'Offline');
    await page.fill('input[placeholder*="Last Name"]', 'Visitor');
    await page.fill('input[type="tel"]', '+1234567890');
    
    // Submit form (should work offline)
    await page.click('button[type="submit"]');
    
    // Check for offline success message
    await expect(page.locator('.q-notification')).toContainText('checked in successfully');
    
    // Simulate going back online
    await page.context().setOffline(false);
    
    // Check if sync button appears
    await expect(page.locator('button:has-text("Sync Now")')).toBeVisible();
  });

  test('should create new service and record attendance', async ({ page }) => {
    await page.goto('/attendance');
    
    // Mock service creation
    await page.route('**/api/services', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Service created successfully',
            data: {
              id: 2,
              organization_id: 1,
              name: 'New Service',
              service_date: '2025-01-07',
              start_time: '10:00:00',
              service_type: 'sunday_service',
              is_active: true,
              created_at: '2025-01-07T00:00:00Z',
              updated_at: '2025-01-07T00:00:00Z'
            }
          })
        });
      }
    });
    
    // Click "New Service" button
    await page.click('button:has-text("New Service")');
    
    // Fill service form
    await page.fill('input[type="text"]', 'New Service');
    await page.fill('input[type="date"]', '2025-01-07');
    await page.fill('input[type="time"]', '10:00');
    await page.selectOption('select', 'sunday_service');
    
    // Submit form
    await page.click('button:has-text("Create Service")');
    
    // Check for success notification
    await expect(page.locator('.q-notification')).toContainText('Service created successfully');
    
    // Mock updated services list
    await page.route('**/api/services/today', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 1,
              organization_id: 1,
              name: 'Sunday Service',
              service_date: '2025-01-06',
              start_time: '10:00:00',
              service_type: 'sunday_service',
              is_active: true,
              created_at: '2025-01-06T00:00:00Z',
              updated_at: '2025-01-06T00:00:00Z'
            },
            {
              id: 2,
              organization_id: 1,
              name: 'New Service',
              service_date: '2025-01-07',
              start_time: '10:00:00',
              service_type: 'sunday_service',
              is_active: true,
              created_at: '2025-01-07T00:00:00Z',
              updated_at: '2025-01-07T00:00:00Z'
            }
          ]
        })
      });
    });
    
    // Refresh page to see new service
    await page.reload();
    await page.waitForSelector('.service-item');
    
    // Select the new service
    await page.click('.service-item:last-child');
    
    // Record attendance for new service
    await page.click('.method-card:has-text("Visitor")');
    
    await page.fill('input[placeholder*="First Name"]', 'Test');
    await page.fill('input[placeholder*="Last Name"]', 'Visitor');
    await page.fill('input[type="tel"]', '+1234567890');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.q-notification')).toContainText('checked in successfully');
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await page.goto('/attendance');
    
    // Mock API error
    await page.route('**/api/services/today', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Internal server error'
        })
      });
    });
    
    // Check if error message is displayed
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('Failed to fetch today\'s services');
    
    // Test retry functionality
    await page.click('button:has-text("Refresh")');
    
    // Mock successful response
    await page.route('**/api/services/today', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: []
        })
      });
    });
    
    // Check if error is cleared
    await expect(page.locator('.error-message')).not.toBeVisible();
  });

  test('should show loading states during operations', async ({ page }) => {
    await page.goto('/attendance');
    
    // Mock slow API response
    await page.route('**/api/services/today', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] })
      });
    });
    
    // Check if loading indicator is visible
    await expect(page.locator('.q-inner-loading')).toBeVisible();
    
    // Wait for loading to complete
    await page.waitForSelector('.service-selector', { timeout: 2000 });
    
    // Check if loading indicator is hidden
    await expect(page.locator('.q-inner-loading')).not.toBeVisible();
  });

  test('should handle mobile responsive design', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/attendance');
    
    // Check if mobile layout is applied
    await expect(page.locator('.attendance-page')).toBeVisible();
    
    // Test mobile navigation
    await page.route('**/api/services/today', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 1,
              organization_id: 1,
              name: 'Sunday Service',
              service_date: '2025-01-06',
              start_time: '10:00:00',
              service_type: 'sunday_service',
              is_active: true,
              created_at: '2025-01-06T00:00:00Z',
              updated_at: '2025-01-06T00:00:00Z'
            }
          ]
        })
      });
    });
    
    await page.waitForSelector('.service-item');
    await page.click('.service-item:first-child');
    
    // Test mobile check-in methods
    await page.click('.method-card:has-text("Visitor")');
    
    // Check if modal is maximized on mobile
    await expect(page.locator('.checkin-modal')).toBeVisible();
    
    // Test mobile form interaction
    await page.fill('input[placeholder*="First Name"]', 'Mobile');
    await page.fill('input[placeholder*="Last Name"]', 'User');
    await page.fill('input[type="tel"]', '+1234567890');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.q-notification')).toContainText('checked in successfully');
  });
});
