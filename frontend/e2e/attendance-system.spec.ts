import { test, expect } from '@playwright/test';

test.describe('Attendance System', () => {
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
            role: 'admin'
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

  test('should navigate to attendance page', async ({ page }) => {
    // Navigate to attendance page
    await page.goto('/attendance');
    
    // Check if attendance page loads
    await expect(page.locator('h1')).toContainText('Attendance Management');
    
    // Check if service selector is visible
    await expect(page.locator('.service-selector')).toBeVisible();
  });

  test('should create a new service', async ({ page }) => {
    await page.goto('/attendance');
    
    // Mock service creation API
    await page.route('**/api/services', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Service created successfully',
            data: {
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
          })
        });
      }
    });
    
    // Click "New Service" button
    await page.click('button:has-text("New Service")');
    
    // Fill service form
    await page.fill('input[type="text"]', 'Sunday Service');
    await page.fill('input[type="date"]', '2025-01-06');
    await page.fill('input[type="time"]', '10:00');
    await page.selectOption('select', 'sunday_service');
    
    // Submit form
    await page.click('button:has-text("Create Service")');
    
    // Check for success notification
    await expect(page.locator('.q-notification')).toContainText('Service created successfully');
  });

  test('should select a service and show attendance dashboard', async ({ page }) => {
    await page.goto('/attendance');
    
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
    
    // Click on a service
    await page.click('.service-item:first-child');
    
    // Check if attendance dashboard is visible
    await expect(page.locator('.attendance-overview')).toBeVisible();
    
    // Check if check-in methods are visible
    await expect(page.locator('.methods-grid')).toBeVisible();
  });

  test('should open QR scanner modal', async ({ page }) => {
    await page.goto('/attendance');
    
    // Mock services and select one
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
    
    // Click QR Code check-in method
    await page.click('.method-card:has-text("QR Code")');
    
    // Check if QR scanner modal opens
    await expect(page.locator('.checkin-modal')).toBeVisible();
    await expect(page.locator('.qr-scanner-container')).toBeVisible();
  });

  test('should open manual check-in modal', async ({ page }) => {
    await page.goto('/attendance');
    
    // Mock services and select one
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
    
    // Click Manual check-in method
    await page.click('.method-card:has-text("Manual")');
    
    // Check if manual check-in modal opens
    await expect(page.locator('.checkin-modal')).toBeVisible();
    await expect(page.locator('.member-checkin-container')).toBeVisible();
  });

  test('should open visitor check-in modal', async ({ page }) => {
    await page.goto('/attendance');
    
    // Mock services and select one
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
    
    // Click Visitor check-in method
    await page.click('.method-card:has-text("Visitor")');
    
    // Check if visitor check-in modal opens
    await expect(page.locator('.checkin-modal')).toBeVisible();
    await expect(page.locator('.visitor-checkin-container')).toBeVisible();
  });

  test('should handle offline mode', async ({ page }) => {
    await page.goto('/attendance');
    
    // Simulate offline mode
    await page.context().setOffline(true);
    
    // Check if offline indicator appears
    await expect(page.locator('.offline-indicator')).toBeVisible();
    await expect(page.locator('.offline-indicator')).toContainText('You\'re offline');
  });

  test('should show loading states', async ({ page }) => {
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
  });
});
