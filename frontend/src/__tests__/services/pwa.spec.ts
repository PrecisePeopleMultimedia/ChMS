/**
 * PWA Service Tests
 * Tests for Progressive Web App functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import pwaService from '@/services/pwa'

// Mock Workbox
vi.mock('workbox-window', () => ({
  Workbox: vi.fn().mockImplementation(() => ({
    register: vi.fn().mockResolvedValue({}),
    addEventListener: vi.fn(),
    messageSkipWaiting: vi.fn()
  }))
}))

// Mock navigator
const mockNavigator = {
  serviceWorker: {
    register: vi.fn().mockResolvedValue({}),
    getRegistrations: vi.fn().mockResolvedValue([])
  }
}

Object.defineProperty(global, 'navigator', {
  value: mockNavigator,
  writable: true
})

// Mock window
const mockWindow = {
  matchMedia: vi.fn().mockReturnValue({ matches: false }),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn()
}

Object.defineProperty(global, 'window', {
  value: mockWindow,
  writable: true
})

// Mock caches API
const mockCaches = {
  keys: vi.fn().mockResolvedValue(['cache1', 'cache2']),
  delete: vi.fn().mockResolvedValue(true)
}

Object.defineProperty(global, 'caches', {
  value: mockCaches,
  writable: true
})

describe('PWA Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Initialization', () => {
    it('should initialize PWA service successfully', async () => {
      await pwaService.init()
      
      // Should not throw any errors
      expect(true).toBe(true)
    })

    it('should handle service worker not supported', async () => {
      // Mock service worker not supported
      const originalServiceWorker = (global as any).navigator.serviceWorker
      delete (global as any).navigator.serviceWorker

      await pwaService.init()
      
      // Should handle gracefully
      expect(true).toBe(true)

      // Restore
      ;(global as any).navigator.serviceWorker = originalServiceWorker
    })
  })

  describe('PWA Status', () => {
    it('should return correct PWA status', () => {
      const status = pwaService.getPWAStatus()
      
      expect(status).toHaveProperty('isSupported')
      expect(status).toHaveProperty('isInstalled')
      expect(status).toHaveProperty('isUpdateAvailable')
      expect(status).toHaveProperty('isOfflineReady')
      
      expect(typeof status.isSupported).toBe('boolean')
      expect(typeof status.isInstalled).toBe('boolean')
      expect(typeof status.isUpdateAvailable).toBe('boolean')
      expect(typeof status.isOfflineReady).toBe('boolean')
    })

    it('should detect if app is installed', () => {
      // Mock standalone mode
      mockWindow.matchMedia.mockReturnValue({ matches: true })
      
      const status = pwaService.getPWAStatus()
      expect(status.isInstalled).toBe(true)
    })
  })

  describe('Network Status', () => {
    it('should check online status', () => {
      // Mock navigator.onLine
      Object.defineProperty(navigator, 'onLine', {
        value: true,
        writable: true
      })

      const isOnline = pwaService.isOnline()
      expect(isOnline).toBe(true)
    })

    it('should setup network listeners', () => {
      const onOnline = vi.fn()
      const onOffline = vi.fn()

      pwaService.setupNetworkListeners(onOnline, onOffline)

      expect(mockWindow.addEventListener).toHaveBeenCalledWith('online', expect.any(Function))
      expect(mockWindow.addEventListener).toHaveBeenCalledWith('offline', expect.any(Function))
    })
  })

  describe('Cache Management', () => {
    it('should get cache information', async () => {
      const cacheInfo = await pwaService.getCacheInfo()
      
      expect(cacheInfo).toHaveProperty('supported', true)
      expect(cacheInfo).toHaveProperty('caches')
      expect(cacheInfo).toHaveProperty('totalCaches')
      expect(cacheInfo.caches).toEqual(['cache1', 'cache2'])
      expect(cacheInfo.totalCaches).toBe(2)
    })

    it('should clear all caches', async () => {
      await pwaService.clearCaches()
      
      expect(mockCaches.keys).toHaveBeenCalled()
      expect(mockCaches.delete).toHaveBeenCalledWith('cache1')
      expect(mockCaches.delete).toHaveBeenCalledWith('cache2')
    })

    it('should handle cache API not supported', async () => {
      // Mock caches not supported
      const originalCaches = (global as any).caches
      delete (global as any).caches

      const cacheInfo = await pwaService.getCacheInfo()
      expect(cacheInfo.supported).toBe(false)

      // Should throw error when trying to clear
      await expect(pwaService.clearCaches()).rejects.toThrow('Cache API not supported')

      // Restore
      ;(global as any).caches = originalCaches
    })
  })

  describe('Service Worker Management', () => {
    it('should update service worker', async () => {
      // Initialize first
      await pwaService.init()
      
      // Should not throw
      await expect(pwaService.updateServiceWorker()).resolves.not.toThrow()
    })

    it('should unregister service worker', async () => {
      await pwaService.unregister()
      
      expect(mockNavigator.serviceWorker.getRegistrations).toHaveBeenCalled()
    })

    it('should handle unregister when service worker not supported', async () => {
      // Mock service worker not supported
      const originalServiceWorker = (global as any).navigator.serviceWorker
      delete (global as any).navigator.serviceWorker

      await pwaService.unregister()
      
      // Should handle gracefully
      expect(true).toBe(true)

      // Restore
      ;(global as any).navigator.serviceWorker = originalServiceWorker
    })
  })

  describe('Error Handling', () => {
    it('should handle initialization errors gracefully', async () => {
      // Mock Workbox to throw error
      const { Workbox } = await import('workbox-window')
      vi.mocked(Workbox).mockImplementation(() => {
        throw new Error('Test error')
      })

      // Should not throw
      await expect(pwaService.init()).resolves.not.toThrow()
    })

    it('should handle cache errors gracefully', async () => {
      // Mock caches.keys to throw error
      mockCaches.keys.mockRejectedValue(new Error('Cache error'))

      const cacheInfo = await pwaService.getCacheInfo()
      expect(cacheInfo).toHaveProperty('error', 'Cache error')
    })
  })
})
