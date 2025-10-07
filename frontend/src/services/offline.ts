import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Member, Family, MemberFormData, FamilyFormData } from '@/types/member'

// Database schema definition
interface ChMSDB extends DBSchema {
  members: {
    key: number
    value: Member & {
      _offline_id?: string
      _sync_status: 'synced' | 'pending_create' | 'pending_update' | 'pending_delete'
      _last_modified: number
    }
    indexes: {
      'by-organization': number
      'by-family': number
      'by-sync-status': string
      'by-last-modified': number
    }
  }
  families: {
    key: number
    value: Family & {
      _offline_id?: string
      _sync_status: 'synced' | 'pending_create' | 'pending_update' | 'pending_delete'
      _last_modified: number
    }
    indexes: {
      'by-organization': number
      'by-sync-status': string
      'by-last-modified': number
    }
  }
  sync_queue: {
    key: string
    value: {
      id: string
      type: 'member' | 'family'
      action: 'create' | 'update' | 'delete'
      data: any
      timestamp: number
      retries: number
    }
    indexes: {
      'by-timestamp': number
      'by-type': string
    }
  }
  app_metadata: {
    key: string
    value: {
      key: string
      value: any
      timestamp: number
    }
  }
}

class OfflineService {
  private db: IDBPDatabase<ChMSDB> | null = null
  private readonly DB_NAME = 'ChMS'
  private readonly DB_VERSION = 1

  async initialize(): Promise<void> {
    if (this.db) return

    this.db = await openDB<ChMSDB>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        // Members store
        const membersStore = db.createObjectStore('members', { keyPath: 'id' })
        membersStore.createIndex('by-organization', 'organization_id')
        membersStore.createIndex('by-family', 'family_id')
        membersStore.createIndex('by-sync-status', '_sync_status')
        membersStore.createIndex('by-last-modified', '_last_modified')

        // Families store
        const familiesStore = db.createObjectStore('families', { keyPath: 'id' })
        familiesStore.createIndex('by-organization', 'organization_id')
        familiesStore.createIndex('by-sync-status', '_sync_status')
        familiesStore.createIndex('by-last-modified', '_last_modified')

        // Sync queue store
        const syncQueueStore = db.createObjectStore('sync_queue', { keyPath: 'id' })
        syncQueueStore.createIndex('by-timestamp', 'timestamp')
        syncQueueStore.createIndex('by-type', 'type')

        // App metadata store
        db.createObjectStore('app_metadata', { keyPath: 'key' })
      }
    })
  }

  // Member operations
  async saveMembers(members: Member[], organizationId: number): Promise<void> {
    await this.initialize()
    if (!this.db) throw new Error('Database not initialized')

    const tx = this.db.transaction('members', 'readwrite')
    const store = tx.objectStore('members')

    for (const member of members) {
      const offlineMember = {
        ...member,
        _sync_status: 'synced' as const,
        _last_modified: Date.now()
      }
      await store.put(offlineMember)
    }

    await tx.done
  }

  async getMembers(organizationId: number): Promise<Member[]> {
    await this.initialize()
    if (!this.db) throw new Error('Database not initialized')

    const tx = this.db.transaction('members', 'readonly')
    const store = tx.objectStore('members')
    const index = store.index('by-organization')
    
    const members = await index.getAll(organizationId)
    
    // Filter out deleted members
    return members
      .filter(member => member._sync_status !== 'pending_delete')
      .map(member => {
        const { _offline_id, _sync_status, _last_modified, ...cleanMember } = member
        return cleanMember as Member
      })
  }

  async saveMemberOffline(memberData: MemberFormData, organizationId: number): Promise<Member> {
    await this.initialize()
    if (!this.db) throw new Error('Database not initialized')

    const offlineId = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const timestamp = Date.now()

    const offlineMember = {
      id: -timestamp, // Negative ID for offline members
      ...memberData,
      organization_id: organizationId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      _offline_id: offlineId,
      _sync_status: 'pending_create' as const,
      _last_modified: timestamp
    }

    const tx = this.db.transaction(['members', 'sync_queue'], 'readwrite')
    
    // Save member
    await tx.objectStore('members').put(offlineMember)
    
    // Add to sync queue
    await tx.objectStore('sync_queue').put({
      id: offlineId,
      type: 'member',
      action: 'create',
      data: memberData,
      timestamp,
      retries: 0
    })

    await tx.done

    const { _offline_id, _sync_status, _last_modified, ...cleanMember } = offlineMember
    return cleanMember as Member
  }

  async updateMemberOffline(id: number, memberData: Partial<MemberFormData>): Promise<Member> {
    await this.initialize()
    if (!this.db) throw new Error('Database not initialized')

    const tx = this.db.transaction(['members', 'sync_queue'], 'readwrite')
    const store = tx.objectStore('members')
    
    const existingMember = await store.get(id)
    if (!existingMember) {
      throw new Error('Member not found')
    }

    const timestamp = Date.now()
    const updatedMember = {
      ...existingMember,
      ...memberData,
      updated_at: new Date().toISOString(),
      _sync_status: existingMember._sync_status === 'pending_create' ? 'pending_create' : 'pending_update' as const,
      _last_modified: timestamp
    }

    await store.put(updatedMember)

    // Add to sync queue if not already pending creation
    if (existingMember._sync_status !== 'pending_create') {
      const syncId = existingMember._offline_id || `update_${id}_${timestamp}`
      await tx.objectStore('sync_queue').put({
        id: syncId,
        type: 'member',
        action: 'update',
        data: { id, ...memberData },
        timestamp,
        retries: 0
      })
    }

    await tx.done

    const { _offline_id, _sync_status, _last_modified, ...cleanMember } = updatedMember
    return cleanMember as Member
  }

  async deleteMemberOffline(id: number): Promise<void> {
    await this.initialize()
    if (!this.db) throw new Error('Database not initialized')

    const tx = this.db.transaction(['members', 'sync_queue'], 'readwrite')
    const store = tx.objectStore('members')
    
    const existingMember = await store.get(id)
    if (!existingMember) {
      throw new Error('Member not found')
    }

    const timestamp = Date.now()

    if (existingMember._sync_status === 'pending_create') {
      // If it was created offline, just remove it
      await store.delete(id)
      // Remove from sync queue
      if (existingMember._offline_id) {
        await tx.objectStore('sync_queue').delete(existingMember._offline_id)
      }
    } else {
      // Mark as pending delete
      const deletedMember = {
        ...existingMember,
        _sync_status: 'pending_delete' as const,
        _last_modified: timestamp
      }
      await store.put(deletedMember)

      // Add to sync queue
      const syncId = existingMember._offline_id || `delete_${id}_${timestamp}`
      await tx.objectStore('sync_queue').put({
        id: syncId,
        type: 'member',
        action: 'delete',
        data: { id },
        timestamp,
        retries: 0
      })
    }

    await tx.done
  }

  // Family operations
  async saveFamilies(families: Family[], organizationId: number): Promise<void> {
    await this.initialize()
    if (!this.db) throw new Error('Database not initialized')

    const tx = this.db.transaction('families', 'readwrite')
    const store = tx.objectStore('families')

    for (const family of families) {
      const offlineFamily = {
        ...family,
        _sync_status: 'synced' as const,
        _last_modified: Date.now()
      }
      await store.put(offlineFamily)
    }

    await tx.done
  }

  async getFamilies(organizationId: number): Promise<Family[]> {
    await this.initialize()
    if (!this.db) throw new Error('Database not initialized')

    const tx = this.db.transaction('families', 'readonly')
    const store = tx.objectStore('families')
    const index = store.index('by-organization')
    
    const families = await index.getAll(organizationId)
    
    return families
      .filter(family => family._sync_status !== 'pending_delete')
      .map(family => {
        const { _offline_id, _sync_status, _last_modified, ...cleanFamily } = family
        return cleanFamily as Family
      })
  }

  // Sync operations
  async getPendingSyncItems(): Promise<any[]> {
    await this.initialize()
    if (!this.db) throw new Error('Database not initialized')

    const tx = this.db.transaction('sync_queue', 'readonly')
    const store = tx.objectStore('sync_queue')
    const index = store.index('by-timestamp')
    
    return await index.getAll()
  }

  async removeSyncItem(id: string): Promise<void> {
    await this.initialize()
    if (!this.db) throw new Error('Database not initialized')

    const tx = this.db.transaction(['sync_queue', 'members', 'families'], 'readwrite')
    
    // Remove from sync queue
    await tx.objectStore('sync_queue').delete(id)
    
    // Update sync status in respective stores
    const syncItem = await tx.objectStore('sync_queue').get(id)
    if (syncItem) {
      if (syncItem.type === 'member') {
        const memberStore = tx.objectStore('members')
        const member = await memberStore.get(syncItem.data.id)
        if (member) {
          member._sync_status = 'synced'
          await memberStore.put(member)
        }
      } else if (syncItem.type === 'family') {
        const familyStore = tx.objectStore('families')
        const family = await familyStore.get(syncItem.data.id)
        if (family) {
          family._sync_status = 'synced'
          await familyStore.put(family)
        }
      }
    }

    await tx.done
  }

  // Utility methods
  async isOnline(): Promise<boolean> {
    return navigator.onLine
  }

  async getLastSyncTime(): Promise<number | null> {
    await this.initialize()
    if (!this.db) throw new Error('Database not initialized')

    const metadata = await this.db.get('app_metadata', 'last_sync_time')
    return metadata?.value || null
  }

  async setLastSyncTime(timestamp: number): Promise<void> {
    await this.initialize()
    if (!this.db) throw new Error('Database not initialized')

    await this.db.put('app_metadata', {
      key: 'last_sync_time',
      value: timestamp,
      timestamp: Date.now()
    })
  }

  async clearAllData(): Promise<void> {
    await this.initialize()
    if (!this.db) throw new Error('Database not initialized')

    const tx = this.db.transaction(['members', 'families', 'sync_queue', 'app_metadata'], 'readwrite')
    
    await Promise.all([
      tx.objectStore('members').clear(),
      tx.objectStore('families').clear(),
      tx.objectStore('sync_queue').clear(),
      tx.objectStore('app_metadata').clear()
    ])

    await tx.done
  }
}

export const offlineService = new OfflineService()
