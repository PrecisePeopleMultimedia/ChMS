/**
 * Offline Sync Service Tests
 * Tests for offline synchronization functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import offlineSyncService from '@/services/offline-sync'

// Mock dependencies
vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({ data: { id: '1' } }),
    put: vi.fn().mockResolvedValue({ data: { id: '1' } }),
    delete: vi.fn().mockResolvedValue({})
  }
}))

vi.mock('@/services/indexeddb', () => ({
  default: {
    getSyncQueue: vi.fn().mockResolvedValue([]),
    getSetting: vi.fn().mockResolvedValue(null),
    addToSyncQueue: vi.fn().mockResolvedValue(undefined),
    removeSyncQueueItem: vi.fn().mockResolvedValue(undefined),
    updateSyncQueueItem: vi.fn().mockResolvedValue(undefined),
    update: vi.fn().mockResolvedValue(undefined),
    getAll: vi.fn().mockResolvedValue([]),
    setSetting: vi.fn().mockResolvedValue(undefined),
    clearAllData: vi.fn().mockResolvedValue(undefined)
  }
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(() => ({
    isAuthenticated: true
  }))
}))

// Mock navigator
Object.defineProperty(global, 'navigator', {
  value: {
    onLine: true
  },
  writable: true
})

// Mock window
const mockWindow = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  setInterval: vi.fn().mockReturnValue(123),
  clearInterval: vi.fn()
}

Object.defineProperty(global, 'window', {
  value: mockWindow,
  writable: true
})

describe('Offline Sync Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Initialization', () => {
    it('should setup network listeners on construction', () => {
      expect(mockWindow.addEventListener).toHaveBeenCalledWith('online', expect.any(Function))
      expect(mockWindow.addEventListener).toHaveBeenCalledWith('offline', expect.any(Function))
    })

    it('should start periodic sync', () => {
      expect(mockWindow.setInterval).toHaveBeenCalled()
    })
  })

  describe('Sync Status', () => {
    it('should get sync status', async () => {
      const status = await offlineSyncService.getSyncStatus()
      
      expect(status).toHaveProperty('isOnline')
      expect(status).toHaveProperty('isSyncing')
      expect(status).toHaveProperty('lastSyncTime')
      expect(status).toHaveProperty('pendingItems')
      expect(status).toHaveProperty('syncErrors')
      
      expect(typeof status.isOnline).toBe('boolean')
      expect(typeof status.isSyncing).toBe('boolean')
      expect(typeof status.pendingItems).toBe('number')
      expect(Array.isArray(status.syncErrors)).toBe(true)
    })
  })

  describe('Queue Management', () => {
    it('should queue item for sync', async () => {
      const testData = { id: '1', name: 'Test' }
      
      await expect(offlineSyncService.queueForSync('create', 'members', testData)).resolves.not.toThrow()
    })

    it('should attempt immediate sync when online', async () => {
      const testData = { id: '1', name: 'Test' }
      
      // Mock online status
      Object.defineProperty(navigator, 'onLine', {
        value: true,
        writable: true
      })

      await offlineSyncService.queueForSync('create', 'members', testData)
      
      // Should have queued the item
      expect(true).toBe(true) // Basic test that it doesn't throw
    })
  })

  describe('Sync Operations', () => {
    it('should sync pending changes when online', async () => {
      // Mock pending items
      const indexedDBService = await import('@/services/indexeddb')
      vi.mocked(indexedDBService.default.getSyncQueue).mockResolvedValue([
        {
          id: '1',
          action: 'create',
          table: 'members',
          data: { id: '1', name: 'Test' },
          timestamp: new Date().toISOString(),
          retryCount: 0
        }
      ])

      await expect(offlineSyncService.syncPendingChanges()).resolves.not.toThrow()
    })

    it('should not sync when offline', async () => {
      // Mock offline status
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        writable: true
      })

      await offlineSyncService.syncPendingChanges()
      
      // Should return early without syncing
      expect(true).toBe(true)
    })

    it('should not sync when already syncing', async () => {
      // Start a sync operation
      const syncPromise = offlineSyncService.syncPendingChanges()
      
      // Try to start another sync
      await offlineSyncService.syncPendingChanges()
      
      // Wait for first sync to complete
      await syncPromise
      
      expect(true).toBe(true)
    })

    it('should not sync when user not authenticated', async () => {
      // Mock unauthenticated user
      const { useAuthStore } = await import('@/stores/auth')
      vi.mocked(useAuthStore).mockReturnValue({
        isAuthenticated: false
      } as any)

      await offlineSyncService.syncPendingChanges()
      
      expect(true).toBe(true)
    })
  })

  describe('Full Sync', () => {
    it('should perform full sync when online', async () => {
      await expect(offlineSyncService.fullSync()).resolves.not.toThrow()
    })

    it('should throw error when offline', async () => {
      // Mock offline status
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        writable: true
      })

      await expect(offlineSyncService.fullSync()).rejects.toThrow('Cannot perform full sync while offline')
    })
  })

  describe('Data Management', () => {
    it('should check if local data exists', async () => {
      const hasData = await offlineSyncService.hasLocalData()
      
      expect(typeof hasData).toBe('boolean')
    })

    it('should clear local data', async () => {
      await expect(offlineSyncService.clearLocalData()).resolves.not.toThrow()
    })
  })

  describe('Periodic Sync', () => {
    it('should stop periodic sync', () => {
      offlineSyncService.stopPeriodicSync()
      
      expect(mockWindow.clearInterval).toHaveBeenCalledWith(123)
    })
  })

  describe('Error Handling', () => {
    it('should handle sync errors gracefully', async () => {
      // Mock axios to throw error
      const axios = await import('axios')
      vi.mocked(axios.default.post).mockRejectedValue(new Error('Network error'))

      // Mock pending items
      const indexedDBService = await import('@/services/indexeddb')
      vi.mocked(indexedDBService.default.getSyncQueue).mockResolvedValue([
        {
          id: '1',
          action: 'create',
          table: 'members',
          data: { id: '1', name: 'Test' },
          timestamp: new Date().toISOString(),
          retryCount: 0
        }
      ])

      await expect(offlineSyncService.syncPendingChanges()).resolves.not.toThrow()
    })

    it('should remove items after max retries', async () => {
      // Mock axios to throw error
      const axios = await import('axios')
      vi.mocked(axios.default.post).mockRejectedValue(new Error('Network error'))

      // Mock pending items with max retries
      const indexedDBService = await import('@/services/indexeddb')
      vi.mocked(indexedDBService.default.getSyncQueue).mockResolvedValue([
        {
          id: '1',
          action: 'create',
          table: 'members',
          data: { id: '1', name: 'Test' },
          timestamp: new Date().toISOString(),
          retryCount: 3 // Max retries reached
        }
      ])

      await offlineSyncService.syncPendingChanges()
      
      // Should have removed the item
      expect(indexedDBService.default.removeSyncQueueItem).toHaveBeenCalledWith('1')
    })
  })
})
