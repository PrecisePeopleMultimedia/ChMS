import { api } from './api'
import { offlineService } from './offline'
import { useAuthStore } from '@/stores/auth'
import type { Member, Family, MemberFormData, FamilyFormData } from '@/types/member'

export interface SyncResult {
  success: boolean
  synced: number
  failed: number
  errors: string[]
}

export interface ConflictResolution {
  strategy: 'server_wins' | 'client_wins' | 'merge' | 'manual'
  serverData?: any
  clientData?: any
  resolvedData?: any
}

class SyncService {
  private isSyncing = false
  private syncListeners: Array<(result: SyncResult) => void> = []

  // Event listeners
  onSyncComplete(callback: (result: SyncResult) => void): void {
    this.syncListeners.push(callback)
  }

  private notifySyncComplete(result: SyncResult): void {
    this.syncListeners.forEach(callback => callback(result))
  }

  // Main sync method
  async syncAll(): Promise<SyncResult> {
    if (this.isSyncing) {
      throw new Error('Sync already in progress')
    }

    if (!navigator.onLine) {
      throw new Error('Cannot sync while offline')
    }

    this.isSyncing = true
    const result: SyncResult = {
      success: true,
      synced: 0,
      failed: 0,
      errors: []
    }

    try {
      // Step 1: Push local changes to server
      const pushResult = await this.pushLocalChanges()
      result.synced += pushResult.synced
      result.failed += pushResult.failed
      result.errors.push(...pushResult.errors)

      // Step 2: Pull server changes to local
      const pullResult = await this.pullServerChanges()
      result.synced += pullResult.synced
      result.failed += pullResult.failed
      result.errors.push(...pullResult.errors)

      // Step 3: Update last sync time
      await offlineService.setLastSyncTime(Date.now())

      result.success = result.failed === 0
    } catch (error: any) {
      result.success = false
      result.errors.push(error.message || 'Unknown sync error')
    } finally {
      this.isSyncing = false
      this.notifySyncComplete(result)
    }

    return result
  }

  // Push local changes to server
  private async pushLocalChanges(): Promise<SyncResult> {
    const result: SyncResult = { success: true, synced: 0, failed: 0, errors: [] }
    
    try {
      const pendingItems = await offlineService.getPendingSyncItems()
      
      for (const item of pendingItems) {
        try {
          await this.syncItem(item)
          await offlineService.removeSyncItem(item.id)
          result.synced++
        } catch (error: any) {
          result.failed++
          result.errors.push(`Failed to sync ${item.type} ${item.action}: ${error.message}`)
          
          // Increment retry count
          item.retries = (item.retries || 0) + 1
          
          // Remove item if too many retries
          if (item.retries >= 3) {
            await offlineService.removeSyncItem(item.id)
            result.errors.push(`Removed ${item.type} ${item.action} after 3 failed attempts`)
          }
        }
      }
    } catch (error: any) {
      result.success = false
      result.errors.push(`Push sync error: ${error.message}`)
    }

    return result
  }

  // Pull server changes to local
  private async pullServerChanges(): Promise<SyncResult> {
    const result: SyncResult = { success: true, synced: 0, failed: 0, errors: [] }
    const authStore = useAuthStore()
    
    if (!authStore.user?.organization_id) {
      result.errors.push('No organization ID available')
      return result
    }

    try {
      // Get last sync time
      const lastSyncTime = await offlineService.getLastSyncTime()
      
      // Fetch members from server
      const membersResponse = await api.get('/members', {
        params: {
          per_page: 1000, // Get all members
          updated_since: lastSyncTime ? new Date(lastSyncTime).toISOString() : undefined
        }
      })

      if (membersResponse.data.success) {
        const serverMembers = membersResponse.data.data.data as Member[]
        await this.resolveConflictsAndSave('members', serverMembers, authStore.user.organization_id)
        result.synced += serverMembers.length
      }

      // Fetch families from server
      const familiesResponse = await api.get('/families', {
        params: {
          per_page: 1000, // Get all families
          updated_since: lastSyncTime ? new Date(lastSyncTime).toISOString() : undefined
        }
      })

      if (familiesResponse.data.success) {
        const serverFamilies = familiesResponse.data.data.data as Family[]
        await this.resolveConflictsAndSave('families', serverFamilies, authStore.user.organization_id)
        result.synced += serverFamilies.length
      }

    } catch (error: any) {
      result.success = false
      result.failed++
      result.errors.push(`Pull sync error: ${error.message}`)
    }

    return result
  }

  // Sync individual item
  private async syncItem(item: any): Promise<void> {
    switch (item.type) {
      case 'member':
        await this.syncMember(item)
        break
      case 'family':
        await this.syncFamily(item)
        break
      default:
        throw new Error(`Unknown sync item type: ${item.type}`)
    }
  }

  // Sync member item
  private async syncMember(item: any): Promise<void> {
    switch (item.action) {
      case 'create':
        const createResponse = await api.post('/members', item.data)
        if (!createResponse.data.success) {
          throw new Error(createResponse.data.message)
        }
        break
        
      case 'update':
        const updateResponse = await api.put(`/members/${item.data.id}`, item.data)
        if (!updateResponse.data.success) {
          throw new Error(updateResponse.data.message)
        }
        break
        
      case 'delete':
        const deleteResponse = await api.delete(`/members/${item.data.id}`)
        if (!deleteResponse.data.success) {
          throw new Error(deleteResponse.data.message)
        }
        break
        
      default:
        throw new Error(`Unknown member action: ${item.action}`)
    }
  }

  // Sync family item
  private async syncFamily(item: any): Promise<void> {
    switch (item.action) {
      case 'create':
        const createResponse = await api.post('/families', item.data)
        if (!createResponse.data.success) {
          throw new Error(createResponse.data.message)
        }
        break
        
      case 'update':
        const updateResponse = await api.put(`/families/${item.data.id}`, item.data)
        if (!updateResponse.data.success) {
          throw new Error(updateResponse.data.message)
        }
        break
        
      case 'delete':
        const deleteResponse = await api.delete(`/families/${item.data.id}`)
        if (!deleteResponse.data.success) {
          throw new Error(deleteResponse.data.message)
        }
        break
        
      default:
        throw new Error(`Unknown family action: ${item.action}`)
    }
  }

  // Resolve conflicts and save data
  private async resolveConflictsAndSave(
    type: 'members' | 'families', 
    serverData: any[], 
    organizationId: number
  ): Promise<void> {
    if (type === 'members') {
      // Get local members
      const localMembers = await offlineService.getMembers(organizationId)
      
      // Simple conflict resolution: server wins for now
      // In a more sophisticated implementation, you'd compare timestamps
      // and allow user to choose resolution strategy
      
      await offlineService.saveMembers(serverData as Member[], organizationId)
    } else if (type === 'families') {
      const localFamilies = await offlineService.getFamilies(organizationId)
      await offlineService.saveFamilies(serverData as Family[], organizationId)
    }
  }

  // Auto-sync when coming back online
  setupAutoSync(): void {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('Back online, starting auto-sync...')
      this.syncAll().catch(error => {
        console.error('Auto-sync failed:', error)
      })
    })

    // Periodic sync when online
    setInterval(() => {
      if (navigator.onLine && !this.isSyncing) {
        this.syncAll().catch(error => {
          console.error('Periodic sync failed:', error)
        })
      }
    }, 5 * 60 * 1000) // Every 5 minutes
  }

  // Background sync using Service Worker (if available)
  async registerBackgroundSync(): Promise<void> {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready
        await registration.sync.register('background-sync')
        console.log('Background sync registered')
      } catch (error) {
        console.warn('Background sync registration failed:', error)
      }
    }
  }

  // Get sync status
  getSyncStatus(): { isSyncing: boolean; lastSyncTime: Promise<number | null> } {
    return {
      isSyncing: this.isSyncing,
      lastSyncTime: offlineService.getLastSyncTime()
    }
  }

  // Force sync specific type
  async syncMembers(): Promise<SyncResult> {
    // Implementation for syncing only members
    return this.syncAll() // Simplified for now
  }

  async syncFamilies(): Promise<SyncResult> {
    // Implementation for syncing only families
    return this.syncAll() // Simplified for now
  }
}

export const syncService = new SyncService()
