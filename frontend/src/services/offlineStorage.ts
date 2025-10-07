import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { AttendanceRecord, Service } from '@/types/attendance';

// Define the database schema
interface ChurchAfricaDB extends DBSchema {
  attendanceRecords: {
    key: number;
    value: AttendanceRecord & { is_offline?: boolean; sync_status?: string };
    indexes: { 'by-service': number; 'by-member': number; 'by-time': string; 'by-sync-status': string };
  };
  services: {
    key: number;
    value: Service;
    indexes: { 'by-organization': number; 'by-date': string; 'by-type': string };
  };
  syncQueue: {
    key: number;
    value: SyncQueueItem;
    indexes: { 'by-created': string; 'by-retry': number };
  };
}

// Sync queue item interface
interface SyncQueueItem {
  id?: number;
  record_type: 'attendance' | 'service';
  record_id: number;
  action: 'create' | 'update' | 'delete';
  data: any;
  created_at: string;
  retry_count: number;
  last_error?: string;
}

// Offline storage service
class OfflineStorageService {
  private db: IDBPDatabase<ChurchAfricaDB> | null = null;
  private isOnline: boolean = navigator.onLine;

  constructor() {
    this.initializeDB();
    this.setupEventListeners();
  }

  private async initializeDB() {
    this.db = await openDB<ChurchAfricaDB>('ChurchAfricaOffline', 1, {
      upgrade(db) {
        // Create attendance records store
        const attendanceStore = db.createObjectStore('attendanceRecords', {
          keyPath: 'id',
          autoIncrement: true
        });
        attendanceStore.createIndex('by-service', 'service_id');
        attendanceStore.createIndex('by-member', 'member_id');
        attendanceStore.createIndex('by-time', 'check_in_time');
        attendanceStore.createIndex('by-sync-status', 'sync_status');

        // Create services store
        const servicesStore = db.createObjectStore('services', {
          keyPath: 'id',
          autoIncrement: true
        });
        servicesStore.createIndex('by-organization', 'organization_id');
        servicesStore.createIndex('by-date', 'service_date');
        servicesStore.createIndex('by-type', 'service_type');

        // Create sync queue store
        const syncStore = db.createObjectStore('syncQueue', {
          keyPath: 'id',
          autoIncrement: true
        });
        syncStore.createIndex('by-created', 'created_at');
        syncStore.createIndex('by-retry', 'retry_count');
      }
    });
  }

  private setupEventListeners() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingRecords();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Attendance Records
  async saveAttendanceRecord(record: AttendanceRecord): Promise<void> {
    if (!this.db) await this.initializeDB();
    
    const offlineRecord = {
      ...record,
      is_offline: true,
      sync_status: 'pending' as const
    };

    await this.db!.add('attendanceRecords', offlineRecord);
    
    // Add to sync queue
    await this.addToSyncQueue('attendance', record.id, 'create', record);
  }

  async getAttendanceRecords(serviceId?: number): Promise<AttendanceRecord[]> {
    if (!this.db) await this.initializeDB();
    
    let records = await this.db!.getAll('attendanceRecords');
    
    if (serviceId) {
      records = records.filter(record => record.service_id === serviceId);
    }
    
    // Sort by check_in_time descending
    return records.sort((a, b) => 
      new Date(b.check_in_time).getTime() - new Date(a.check_in_time).getTime()
    );
  }

  async getOfflineAttendanceRecords(): Promise<AttendanceRecord[]> {
    if (!this.db) await this.initializeDB();
    
    const records = await this.db!.getAll('attendanceRecords');
    return records.filter(record => record.is_offline === true);
  }

  async updateAttendanceRecord(id: number, updates: Partial<AttendanceRecord>): Promise<void> {
    if (!this.db) await this.initializeDB();
    
    const record = await this.db!.get('attendanceRecords', id);
    if (record) {
      const updatedRecord = { ...record, ...updates };
      await this.db!.put('attendanceRecords', updatedRecord);
      
      // Add to sync queue
      await this.addToSyncQueue('attendance', id, 'update', updatedRecord);
    }
  }

  async deleteAttendanceRecord(id: number): Promise<void> {
    if (!this.db) await this.initializeDB();
    
    await this.db!.delete('attendanceRecords', id);
    
    // Add to sync queue
    await this.addToSyncQueue('attendance', id, 'delete', { id });
  }

  // Services
  async saveService(service: Service): Promise<void> {
    await this.db.services.add(service);
    
    // Add to sync queue
    await this.addToSyncQueue('service', service.id, 'create', service);
  }

  async getServices(): Promise<Service[]> {
    return await this.db.services.orderBy('service_date').reverse().toArray();
  }

  async getService(id: number): Promise<Service | undefined> {
    return await this.db.services.get(id);
  }

  async updateService(id: number, updates: Partial<Service>): Promise<void> {
    await this.db.services.update(id, updates);
    
    // Add to sync queue
    const service = await this.db.services.get(id);
    if (service) {
      await this.addToSyncQueue('service', id, 'update', { ...service, ...updates });
    }
  }

  async deleteService(id: number): Promise<void> {
    await this.db.services.delete(id);
    
    // Add to sync queue
    await this.addToSyncQueue('service', id, 'delete', { id });
  }

  // Sync Queue Management
  private async addToSyncQueue(
    recordType: 'attendance' | 'service',
    recordId: number,
    action: 'create' | 'update' | 'delete',
    data: any
  ): Promise<void> {
    await this.db.syncQueue.add({
      record_type: recordType,
      record_id: recordId,
      action,
      data,
      created_at: new Date().toISOString(),
      retry_count: 0
    });
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    return await this.db.syncQueue.orderBy('created_at').toArray();
  }

  async clearSyncQueue(): Promise<void> {
    await this.db.syncQueue.clear();
  }

  async removeSyncQueueItem(id: number): Promise<void> {
    await this.db.syncQueue.delete(id);
  }

  async updateSyncQueueItem(id: number, updates: Partial<SyncQueueItem>): Promise<void> {
    await this.db.syncQueue.update(id, updates);
  }

  // Sync Operations
  async syncPendingRecords(): Promise<void> {
    if (!this.isOnline) {
      console.log('Offline - cannot sync');
      return;
    }

    const syncItems = await this.getSyncQueue();
    
    for (const item of syncItems) {
      try {
        await this.syncItem(item);
        await this.removeSyncQueueItem(item.id!);
      } catch (error) {
        console.error('Sync failed for item:', item, error);
        
        // Increment retry count
        const newRetryCount = (item.retry_count || 0) + 1;
        await this.updateSyncQueueItem(item.id!, {
          retry_count: newRetryCount,
          last_error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        // Remove from queue if too many retries
        if (newRetryCount >= 3) {
          console.warn('Removing item from sync queue after 3 failed attempts:', item);
          await this.removeSyncQueueItem(item.id!);
        }
      }
    }
  }

  private async syncItem(item: SyncQueueItem): Promise<void> {
    const API_URL = import.meta.env.VITE_API_URL;
    
    switch (item.record_type) {
      case 'attendance':
        await this.syncAttendanceRecord(item);
        break;
      case 'service':
        await this.syncServiceRecord(item);
        break;
    }
  }

  private async syncAttendanceRecord(item: SyncQueueItem): Promise<void> {
    const API_URL = import.meta.env.VITE_API_URL;
    
    switch (item.action) {
      case 'create':
        const createResponse = await fetch(`${API_URL}/attendance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: JSON.stringify(item.data)
        });
        
        if (!createResponse.ok) {
          throw new Error(`Failed to create attendance record: ${createResponse.statusText}`);
        }
        
        const createdRecord = await createResponse.json();
        
        // Update local record with server ID
        await this.db.attendanceRecords.update(item.record_id, {
          id: createdRecord.data.id,
          is_offline: false,
          sync_status: 'synced'
        });
        break;
        
      case 'update':
        const updateResponse = await fetch(`${API_URL}/attendance/${item.record_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: JSON.stringify(item.data)
        });
        
        if (!updateResponse.ok) {
          throw new Error(`Failed to update attendance record: ${updateResponse.statusText}`);
        }
        break;
        
      case 'delete':
        const deleteResponse = await fetch(`${API_URL}/attendance/${item.record_id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        
        if (!deleteResponse.ok) {
          throw new Error(`Failed to delete attendance record: ${deleteResponse.statusText}`);
        }
        break;
    }
  }

  private async syncServiceRecord(item: SyncQueueItem): Promise<void> {
    const API_URL = import.meta.env.VITE_API_URL;
    
    switch (item.action) {
      case 'create':
        const createResponse = await fetch(`${API_URL}/services`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: JSON.stringify(item.data)
        });
        
        if (!createResponse.ok) {
          throw new Error(`Failed to create service: ${createResponse.statusText}`);
        }
        break;
        
      case 'update':
        const updateResponse = await fetch(`${API_URL}/services/${item.record_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: JSON.stringify(item.data)
        });
        
        if (!updateResponse.ok) {
          throw new Error(`Failed to update service: ${updateResponse.statusText}`);
        }
        break;
        
      case 'delete':
        const deleteResponse = await fetch(`${API_URL}/services/${item.record_id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        
        if (!deleteResponse.ok) {
          throw new Error(`Failed to delete service: ${deleteResponse.statusText}`);
        }
        break;
    }
  }

  // Utility Methods
  async clearAllData(): Promise<void> {
    await this.db.attendanceRecords.clear();
    await this.db.services.clear();
    await this.db.syncQueue.clear();
  }

  async getStorageStats(): Promise<{
    attendanceRecords: number;
    services: number;
    syncQueue: number;
    pendingSync: number;
  }> {
    const attendanceCount = await this.db.attendanceRecords.count();
    const servicesCount = await this.db.services.count();
    const syncQueueCount = await this.db.syncQueue.count();
    const pendingSyncCount = await this.db.attendanceRecords
      .where('sync_status')
      .equals('pending')
      .count();

    return {
      attendanceRecords: attendanceCount,
      services: servicesCount,
      syncQueue: syncQueueCount,
      pendingSync: pendingSyncCount
    };
  }

  // Check if we're online
  getOnlineStatus(): boolean {
    return this.isOnline;
  }

  // Force sync (useful for manual sync button)
  async forceSync(): Promise<void> {
    await this.syncPendingRecords();
  }
}

// Export singleton instance
export const offlineStorage = new OfflineStorageService();
export default offlineStorage;
