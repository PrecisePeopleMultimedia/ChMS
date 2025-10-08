/**
 * Offline Sync Service
 * Handles synchronization between local IndexedDB and remote API
 */

import axios from 'axios'
import indexedDBService from './indexeddb'
import { useAuthStore } from '@/stores/auth'

export interface SyncStatus {
  isOnline: boolean
  isSyncing: boolean
  lastSyncTime: string | null
  pendingItems: number
  syncErrors: string[]
}

class OfflineSyncService {
  private isOnline = navigator.onLine
  private isSyncing = false
  private syncInterval: number | null = null
  private readonly SYNC_INTERVAL = 30000 // 30 seconds
  private readonly MAX_RETRY_COUNT = 3

  constructor() {
    this.setupNetworkListeners()
    this.startPeriodicSync()
  }

  /**
   * Setup network status listeners
   */
  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      console.log('🌐 Network connection restored')
      this.isOnline = true
      this.syncPendingChanges()
    })

    window.addEventListener('offline', () => {
      console.log('📴 Network connection lost')
      this.isOnline = false
    })
  }

  /**
   * Start periodic sync when online
   */
  private startPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }

    this.syncInterval = window.setInterval(() => {
      if (this.isOnline && !this.isSyncing) {
        this.syncPendingChanges()
      }
    }, this.SYNC_INTERVAL)
  }

  /**
   * Stop periodic sync
   */
  stopPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  /**
   * Get current sync status
   */
  async getSyncStatus(): Promise<SyncStatus> {
    const pendingItems = await indexedDBService.getSyncQueue()
    const lastSyncTime = await indexedDBService.getSetting('lastSyncTime')
    
    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      lastSyncTime,
      pendingItems: pendingItems.length,
      syncErrors: []
    }
  }

  /**
   * Add item to sync queue for later synchronization
   */
  async queueForSync(action: 'create' | 'update' | 'delete', table: string, data: any): Promise<void> {
    await indexedDBService.addToSyncQueue(action, table, data)
    
    // Try to sync immediately if online
    if (this.isOnline) {
      setTimeout(() => this.syncPendingChanges(), 1000)
    }
  }

  /**
   * Sync all pending changes to the server
   */
  async syncPendingChanges(): Promise<void> {
    if (this.isSyncing || !this.isOnline) {
      return
    }

    this.isSyncing = true
    console.log('🔄 Starting sync process...')

    try {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        console.log('⚠️ User not authenticated, skipping sync')
        return
      }

      const pendingItems = await indexedDBService.getSyncQueue()
      console.log(`📊 Found ${pendingItems.length} items to sync`)

      for (const item of pendingItems) {
        try {
          await this.syncItem(item)
          await indexedDBService.removeSyncQueueItem(item.id)
          console.log(`✅ Synced item ${item.id}`)
        } catch (error) {
          console.error(`❌ Failed to sync item ${item.id}:`, error)
          
          // Update retry count
          const newRetryCount = item.retryCount + 1
          if (newRetryCount >= this.MAX_RETRY_COUNT) {
            console.error(`🚫 Max retries reached for item ${item.id}, removing from queue`)
            await indexedDBService.removeSyncQueueItem(item.id)
          } else {
            await indexedDBService.updateSyncQueueItem(item.id, {
              retryCount: newRetryCount,
              lastError: error instanceof Error ? error.message : 'Unknown error'
            })
          }
        }
      }

      // Update last sync time
      await indexedDBService.setSetting('lastSyncTime', new Date().toISOString())
      console.log('✅ Sync process completed')

    } catch (error) {
      console.error('❌ Sync process failed:', error)
    } finally {
      this.isSyncing = false
    }
  }

  /**
   * Sync individual item to server
   */
  private async syncItem(item: any): Promise<void> {
    const { action, table, data } = item

    switch (action) {
      case 'create':
        await this.syncCreate(table, data)
        break
      case 'update':
        await this.syncUpdate(table, data)
        break
      case 'delete':
        await this.syncDelete(table, data.id)
        break
      default:
        throw new Error(`Unknown sync action: ${action}`)
    }
  }

  /**
   * Sync create operation
   */
  private async syncCreate(table: string, data: any): Promise<void> {
    const endpoint = this.getApiEndpoint(table)
    const response = await axios.post(endpoint, data)
    
    // Update local data with server response (e.g., server-generated ID)
    if (response.data) {
      await indexedDBService.update(table as any, response.data)
    }
  }

  /**
   * Sync update operation
   */
  private async syncUpdate(table: string, data: any): Promise<void> {
    const endpoint = `${this.getApiEndpoint(table)}/${data.id}`
    const response = await axios.put(endpoint, data)
    
    // Update local data with server response
    if (response.data) {
      await indexedDBService.update(table as any, response.data)
    }
  }

  /**
   * Sync delete operation
   */
  private async syncDelete(table: string, id: string): Promise<void> {
    const endpoint = `${this.getApiEndpoint(table)}/${id}`
    await axios.delete(endpoint)
  }

  /**
   * Get API endpoint for table
   */
  private getApiEndpoint(table: string): string {
    const endpoints: Record<string, string> = {
      users: '/api/users',
      organizations: '/api/organizations',
      members: '/api/members',
      attendance: '/api/attendance'
    }

    const endpoint = endpoints[table]
    if (!endpoint) {
      throw new Error(`No API endpoint configured for table: ${table}`)
    }

    return endpoint
  }

  /**
   * Force sync all data from server (full refresh)
   */
  async fullSync(): Promise<void> {
    if (!this.isOnline) {
      throw new Error('Cannot perform full sync while offline')
    }

    console.log('🔄 Starting full sync from server...')

    try {
      // Sync organizations
      const orgsResponse = await axios.get('/api/organizations')
      for (const org of orgsResponse.data) {
        await indexedDBService.update('organizations', org)
      }

      // Sync members
      const membersResponse = await axios.get('/api/members')
      for (const member of membersResponse.data) {
        await indexedDBService.update('members', member)
      }

      // Sync attendance (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const attendanceResponse = await axios.get('/api/attendance', {
        params: { since: thirtyDaysAgo.toISOString() }
      })
      
      for (const attendance of attendanceResponse.data) {
        await indexedDBService.update('attendance', attendance)
      }

      await indexedDBService.setSetting('lastFullSync', new Date().toISOString())
      console.log('✅ Full sync completed')

    } catch (error) {
      console.error('❌ Full sync failed:', error)
      throw error
    }
  }

  /**
   * Check if data exists locally
   */
  async hasLocalData(): Promise<boolean> {
    const organizations = await indexedDBService.getAll('organizations')
    return organizations.length > 0
  }

  /**
   * Clear all local data and sync queue
   */
  async clearLocalData(): Promise<void> {
    await indexedDBService.clearAllData()
    console.log('🗑️ Local data cleared')
  }
}

// Export singleton instance
export const offlineSyncService = new OfflineSyncService()
export default offlineSyncService
