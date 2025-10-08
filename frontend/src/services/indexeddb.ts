/**
 * IndexedDB Service for Offline Data Storage
 * Provides a comprehensive interface for storing and retrieving data offline
 */

import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

// Define the database schema
interface ChMSDB extends DBSchema {
  // User data
  users: {
    key: string
    value: {
      id: string
      name: string
      email: string
      role: string
      createdAt: string
      updatedAt: string
    }
  }
  
  // Organization data
  organizations: {
    key: string
    value: {
      id: string
      name: string
      address: string
      phone: string
      email: string
      website: string
      description: string
      timezone: string
      createdAt: string
      updatedAt: string
    }
  }
  
  // Members data
  members: {
    key: string
    value: {
      id: string
      organizationId: string
      firstName: string
      lastName: string
      email: string
      phone: string
      address: string
      dateOfBirth: string
      membershipDate: string
      status: 'active' | 'inactive'
      createdAt: string
      updatedAt: string
    }
    indexes: { 'by-organization': string }
  }
  
  // Attendance records
  attendance: {
    key: string
    value: {
      id: string
      organizationId: string
      memberId: string
      serviceDate: string
      serviceType: string
      checkInTime: string
      createdAt: string
    }
    indexes: { 'by-organization': string; 'by-member': string; 'by-date': string }
  }
  
  // Offline sync queue
  syncQueue: {
    key: string
    value: {
      id: string
      action: 'create' | 'update' | 'delete'
      table: string
      data: any
      timestamp: string
      retryCount: number
      lastError?: string
    }
  }
  
  // App settings
  settings: {
    key: string
    value: {
      key: string
      value: any
      updatedAt: string
    }
  }
}

class IndexedDBService {
  private db: IDBPDatabase<ChMSDB> | null = null
  private readonly dbName = 'ChMSDB'
  private readonly dbVersion = 1

  /**
   * Initialize the database
   */
  async init(): Promise<void> {
    try {
      this.db = await openDB<ChMSDB>(this.dbName, this.dbVersion, {
        upgrade(db) {
          // Users store
          if (!db.objectStoreNames.contains('users')) {
            db.createObjectStore('users', { keyPath: 'id' })
          }

          // Organizations store
          if (!db.objectStoreNames.contains('organizations')) {
            db.createObjectStore('organizations', { keyPath: 'id' })
          }

          // Members store with indexes
          if (!db.objectStoreNames.contains('members')) {
            const membersStore = db.createObjectStore('members', { keyPath: 'id' })
            membersStore.createIndex('by-organization', 'organizationId')
          }

          // Attendance store with indexes
          if (!db.objectStoreNames.contains('attendance')) {
            const attendanceStore = db.createObjectStore('attendance', { keyPath: 'id' })
            attendanceStore.createIndex('by-organization', 'organizationId')
            attendanceStore.createIndex('by-member', 'memberId')
            attendanceStore.createIndex('by-date', 'serviceDate')
          }

          // Sync queue store
          if (!db.objectStoreNames.contains('syncQueue')) {
            db.createObjectStore('syncQueue', { keyPath: 'id' })
          }

          // Settings store
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'key' })
          }
        }
      })

      console.log('✅ IndexedDB initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize IndexedDB:', error)
      throw error
    }
  }

  /**
   * Ensure database is initialized
   */
  private async ensureDB(): Promise<IDBPDatabase<ChMSDB>> {
    if (!this.db) {
      await this.init()
    }
    return this.db!
  }

  // Generic CRUD operations
  async create<T extends keyof ChMSDB>(store: T, data: ChMSDB[T]['value']): Promise<void> {
    const db = await this.ensureDB()
    await db.add(store as any, data)
  }

  async read<T extends keyof ChMSDB>(store: T, key: string): Promise<ChMSDB[T]['value'] | undefined> {
    const db = await this.ensureDB()
    return await db.get(store as any, key)
  }

  async update<T extends keyof ChMSDB>(store: T, data: ChMSDB[T]['value']): Promise<void> {
    const db = await this.ensureDB()
    await db.put(store as any, data)
  }

  async delete<T extends keyof ChMSDB>(store: T, key: string): Promise<void> {
    const db = await this.ensureDB()
    await db.delete(store as any, key)
  }

  async getAll<T extends keyof ChMSDB>(store: T): Promise<ChMSDB[T]['value'][]> {
    const db = await this.ensureDB()
    return await db.getAll(store as any)
  }

  // Specialized methods for common operations
  async getMembersByOrganization(organizationId: string) {
    const db = await this.ensureDB()
    return await db.getAllFromIndex('members', 'by-organization', organizationId)
  }

  async getAttendanceByMember(memberId: string) {
    const db = await this.ensureDB()
    return await db.getAllFromIndex('attendance', 'by-member', memberId)
  }

  async getAttendanceByDate(date: string) {
    const db = await this.ensureDB()
    return await db.getAllFromIndex('attendance', 'by-date', date)
  }

  // Settings management
  async getSetting(key: string): Promise<any> {
    const setting = await this.read('settings', key)
    return setting?.value
  }

  async setSetting(key: string, value: any): Promise<void> {
    await this.update('settings', {
      key,
      value,
      updatedAt: new Date().toISOString()
    })
  }

  // Sync queue management
  async addToSyncQueue(action: 'create' | 'update' | 'delete', table: string, data: any): Promise<void> {
    const queueItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      action,
      table,
      data,
      timestamp: new Date().toISOString(),
      retryCount: 0
    }
    
    await this.create('syncQueue', queueItem)
  }

  async getSyncQueue() {
    return await this.getAll('syncQueue')
  }

  async removeSyncQueueItem(id: string): Promise<void> {
    await this.delete('syncQueue', id)
  }

  async updateSyncQueueItem(id: string, updates: Partial<ChMSDB['syncQueue']['value']>): Promise<void> {
    const item = await this.read('syncQueue', id)
    if (item) {
      await this.update('syncQueue', { ...item, ...updates })
    }
  }

  // Clear all data (for testing or reset)
  async clearAllData(): Promise<void> {
    const db = await this.ensureDB()
    const stores: (keyof ChMSDB)[] = ['users', 'organizations', 'members', 'attendance', 'syncQueue', 'settings']

    for (const store of stores) {
      await db.clear(store as any)
    }

    console.log('🗑️ All IndexedDB data cleared')
  }

  // Get database info
  async getDatabaseInfo() {
    const db = await this.ensureDB()
    const info = {
      name: this.dbName,
      version: this.dbVersion,
      stores: Array.from(db.objectStoreNames),
      size: 0 // Would need additional calculation for actual size
    }
    
    return info
  }
}

// Export singleton instance
export const indexedDBService = new IndexedDBService()
export default indexedDBService
