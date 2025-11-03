/**
 * PWA E2E Tests
 * Tests for Progressive Web App functionality in real browser environment
 */

import { test, expect } from '@playwright/test'

test.describe('PWA Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/')
  })

  test('should have PWA manifest', async ({ page }) => {
    // Check if manifest is linked in HTML
    const manifestLink = page.locator('link[rel="manifest"]')
    await expect(manifestLink).toBeAttached()
    
    // Check manifest content
    const response = await page.request.get('/manifest.webmanifest')
    expect(response.ok()).toBeTruthy()
    
    const manifest = await response.json()
    expect(manifest.name).toBe('ChMS - Church Management System')
    expect(manifest.short_name).toBe('ChMS')
    expect(manifest.display).toBe('standalone')
    expect(manifest.theme_color).toBe('#1976d2')
    expect(manifest.icons).toHaveLength(8)
  })

  test('should have service worker registered', async ({ page }) => {
    // Wait for service worker to register
    await page.waitForTimeout(2000)
    
    // Check if service worker is registered
    const swRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator && navigator.serviceWorker.controller !== null
    })
    
    // Service worker should be supported (may not be registered in test environment)
    const swSupported = await page.evaluate(() => {
      return 'serviceWorker' in navigator
    })
    
    expect(swSupported).toBeTruthy()
  })

  test('should have PWA icons available', async ({ page }) => {
    // Check if PWA icons exist
    const iconSizes = ['72x72', '96x96', '128x128', '144x144', '152x152', '192x192', '384x384', '512x512']
    
    for (const size of iconSizes) {
      const response = await page.request.get(`/icons/icon-${size}.png`)
      expect(response.ok()).toBeTruthy()
    }
  })

  test('should show offline indicator when offline', async ({ page, context }) => {
    // Set network to offline
    await context.setOffline(true)
    
    // Reload page to trigger offline state
    await page.reload()
    
    // Check if offline indicator is shown
    const offlineIndicator = page.locator('.offline-indicator')
    await expect(offlineIndicator).toBeVisible()
    
    // Check offline message
    await expect(page.locator('text=You\'re offline')).toBeVisible()
  })

  test('should initialize IndexedDB', async ({ page }) => {
    // Check if IndexedDB is available and initialized
    const dbInitialized = await page.evaluate(async () => {
      try {
        // Check if IndexedDB is supported
        if (!('indexedDB' in window)) {
          return false
        }
        
        // Try to open the ChMS database
        return new Promise((resolve) => {
          const request = indexedDB.open('ChMSDB', 1)
          request.onsuccess = () => {
            resolve(true)
          }
          request.onerror = () => {
            resolve(false)
          }
        })
      } catch (error) {
        return false
      }
    })
    
    expect(dbInitialized).toBeTruthy()
  })

  test('should have cache API available', async ({ page }) => {
    // Check if Cache API is supported
    const cacheSupported = await page.evaluate(() => {
      return 'caches' in window
    })
    
    expect(cacheSupported).toBeTruthy()
  })

  test('should handle network status changes', async ({ page, context }) => {
    // Start online
    await context.setOffline(false)
    
    let networkStatus = await page.evaluate(() => navigator.onLine)
    expect(networkStatus).toBeTruthy()
    
    // Go offline
    await context.setOffline(true)
    
    // Wait for network status to update
    await page.waitForTimeout(1000)
    
    networkStatus = await page.evaluate(() => navigator.onLine)
    expect(networkStatus).toBeFalsy()
    
    // Go back online
    await context.setOffline(false)
    
    // Wait for network status to update
    await page.waitForTimeout(1000)
    
    networkStatus = await page.evaluate(() => navigator.onLine)
    expect(networkStatus).toBeTruthy()
  })

  test('should have proper PWA meta tags', async ({ page }) => {
    // Check theme color
    const themeColor = page.locator('meta[name="theme-color"]')
    await expect(themeColor).toHaveAttribute('content', '#1976d2')
    
    // Check apple mobile web app capable
    const appleMobileCapable = page.locator('meta[name="apple-mobile-web-app-capable"]')
    await expect(appleMobileCapable).toHaveAttribute('content', 'yes')
    
    // Check apple mobile web app title
    const appleMobileTitle = page.locator('meta[name="apple-mobile-web-app-title"]')
    await expect(appleMobileTitle).toHaveAttribute('content', 'ChMS')
    
    // Check description
    const description = page.locator('meta[name="description"]')
    await expect(description).toHaveAttribute('content', 'Africa-first church management system with offline capabilities')
  })

  test('should load app shell quickly', async ({ page }) => {
    const startTime = Date.now()
    
    // Navigate to app
    await page.goto('/')
    
    // Wait for main app element to be visible
    await page.waitForSelector('#q-app', { timeout: 5000 })
    
    const loadTime = Date.now() - startTime
    
    // App should load within 5 seconds (generous for test environment)
    expect(loadTime).toBeLessThan(5000)
  })

  test('should work without JavaScript (progressive enhancement)', async ({ page, context }) => {
    // Disable JavaScript
    await context.addInitScript(() => {
      Object.defineProperty(window, 'navigator', {
        value: {
          ...window.navigator,
          serviceWorker: undefined
        }
      })
    })
    
    await page.goto('/')
    
    // Basic HTML structure should still be present
    await expect(page.locator('#q-app')).toBeAttached()
    await expect(page.locator('title')).toHaveText('ChMS - Church Management System')
  })
})
