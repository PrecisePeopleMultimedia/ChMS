/**
 * Offline Store Composable
 * Provides offline-aware data operations with automatic sync
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import indexedDBService from '@/services/indexeddb'
import offlineSyncService from '@/services/offline-sync'
import type { SyncStatus } from '@/services/offline-sync'

export function useOfflineStore() {
  // Reactive state
  const isOnline = ref(navigator.onLine)
  const syncStatus = ref<SyncStatus>({
    isOnline: navigator.onLine,
    isSyncing: false,
    lastSyncTime: null,
    pendingItems: 0,
    syncErrors: []
  })

  // Network status listeners
  let onlineHandler: (() => void) | null = null
  let offlineHandler: (() => void) | null = null

  /**
   * Setup network listeners
   */
  const setupNetworkListeners = () => {
    onlineHandler = () => {
      isOnline.value = true
      updateSyncStatus()
    }

    offlineHandler = () => {
      isOnline.value = false
      updateSyncStatus()
    }

    window.addEventListener('online', onlineHandler)
    window.addEventListener('offline', offlineHandler)
  }

  /**
   * Cleanup network listeners
   */
  const cleanupNetworkListeners = () => {
    if (onlineHandler) {
      window.removeEventListener('online', onlineHandler)
    }
    if (offlineHandler) {
      window.removeEventListener('offline', offlineHandler)
    }
  }

  /**
   * Update sync status
   */
  const updateSyncStatus = async () => {
    try {
      syncStatus.value = await offlineSyncService.getSyncStatus()
    } catch (error) {
      console.error('Failed to update sync status:', error)
    }
  }

  /**
   * Create data with offline support
   */
  const createOffline = async <T>(
    table: string,
    data: T,
    optimisticUpdate?: () => void
  ): Promise<T> => {
    try {
      // Add timestamp and ID if not present
      const enrichedData = {
        ...data,
        id: (data as any).id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: (data as any).createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Store locally first
      await indexedDBService.create(table as any, enrichedData)

      // Apply optimistic update
      optimisticUpdate?.()

      // Queue for sync if online, or add to sync queue if offline
      await offlineSyncService.queueForSync('create', table, enrichedData)

      await updateSyncStatus()
      return enrichedData as T

    } catch (error) {
      console.error('Failed to create data offline:', error)
      throw error
    }
  }

  /**
   * Update data with offline support
   */
  const updateOffline = async <T>(
    table: string,
    data: T,
    optimisticUpdate?: () => void
  ): Promise<T> => {
    try {
      // Add updated timestamp
      const enrichedData = {
        ...data,
        updatedAt: new Date().toISOString()
      }

      // Update locally first
      await indexedDBService.update(table as any, enrichedData)

      // Apply optimistic update
      optimisticUpdate?.()

      // Queue for sync
      await offlineSyncService.queueForSync('update', table, enrichedData)

      await updateSyncStatus()
      return enrichedData as T

    } catch (error) {
      console.error('Failed to update data offline:', error)
      throw error
    }
  }

  /**
   * Delete data with offline support
   */
  const deleteOffline = async (
    table: string,
    id: string,
    optimisticUpdate?: () => void
  ): Promise<void> => {
    try {
      // Delete locally first
      await indexedDBService.delete(table as any, id)

      // Apply optimistic update
      optimisticUpdate?.()

      // Queue for sync
      await offlineSyncService.queueForSync('delete', table, { id })

      await updateSyncStatus()

    } catch (error) {
      console.error('Failed to delete data offline:', error)
      throw error
    }
  }

  /**
   * Get data with offline fallback
   */
  const getOffline = async <T>(table: string, id: string): Promise<T | null> => {
    try {
      const data = await indexedDBService.read(table as any, id)
      return data as T || null
    } catch (error) {
      console.error('Failed to get data offline:', error)
      return null
    }
  }

  /**
   * Get all data with offline fallback
   */
  const getAllOffline = async <T>(table: string): Promise<T[]> => {
    try {
      const data = await indexedDBService.getAll(table as any)
      return data as T[]
    } catch (error) {
      console.error('Failed to get all data offline:', error)
      return []
    }
  }

  /**
   * Force sync pending changes
   */
  const forcSync = async (): Promise<void> => {
    if (!isOnline.value) {
      throw new Error('Cannot sync while offline')
    }

    try {
      await offlineSyncService.syncPendingChanges()
      await updateSyncStatus()
    } catch (error) {
      console.error('Failed to force sync:', error)
      throw error
    }
  }

  /**
   * Perform full sync from server
   */
  const fullSync = async (): Promise<void> => {
    if (!isOnline.value) {
      throw new Error('Cannot perform full sync while offline')
    }

    try {
      await offlineSyncService.fullSync()
      await updateSyncStatus()
    } catch (error) {
      console.error('Failed to perform full sync:', error)
      throw error
    }
  }

  /**
   * Clear all local data
   */
  const clearLocalData = async (): Promise<void> => {
    try {
      await offlineSyncService.clearLocalData()
      await updateSyncStatus()
    } catch (error) {
      console.error('Failed to clear local data:', error)
      throw error
    }
  }

  // Computed properties
  const canSync = computed(() => isOnline.value && !syncStatus.value.isSyncing)
  const hasPendingChanges = computed(() => syncStatus.value.pendingItems > 0)
  const lastSyncTime = computed(() => syncStatus.value.lastSyncTime)

  // Lifecycle
  onMounted(() => {
    setupNetworkListeners()
    updateSyncStatus()
  })

  onUnmounted(() => {
    cleanupNetworkListeners()
  })

  return {
    // State
    isOnline: computed(() => isOnline.value),
    syncStatus: computed(() => syncStatus.value),
    canSync,
    hasPendingChanges,
    lastSyncTime,

    // Methods
    createOffline,
    updateOffline,
    deleteOffline,
    getOffline,
    getAllOffline,
    forcSync,
    fullSync,
    clearLocalData,
    updateSyncStatus
  }
}

export default useOfflineStore
