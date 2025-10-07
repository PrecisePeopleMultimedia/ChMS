import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAttendanceStore } from '../attendance';
import { offlineStorage } from '@/services/offlineStorage';

// Mock the offline storage service
vi.mock('@/services/offlineStorage', () => ({
  offlineStorage: {
    saveAttendanceRecord: vi.fn(),
    getOfflineAttendanceRecords: vi.fn(),
    syncPendingRecords: vi.fn(),
    getOnlineStatus: vi.fn(() => true)
  }
}));

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    defaults: {
      baseURL: 'http://test.api'
    }
  }
}));

describe('Attendance Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const store = useAttendanceStore();
    
    expect(store.services).toEqual([]);
    expect(store.attendanceRecords).toEqual([]);
    expect(store.currentService).toBeNull();
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
    expect(store.isOffline).toBe(false);
    expect(store.pendingSync).toEqual([]);
  });

  it('should set current service', () => {
    const store = useAttendanceStore();
    const mockService = {
      id: 1,
      organization_id: 1,
      name: 'Sunday Service',
      service_date: '2025-01-06',
      start_time: '10:00:00',
      service_type: 'sunday_service',
      is_active: true,
      created_at: '2025-01-06T00:00:00Z',
      updated_at: '2025-01-06T00:00:00Z'
    };

    store.setCurrentService(mockService);
    
    expect(store.currentService).toEqual(mockService);
  });

  it('should clear current service', () => {
    const store = useAttendanceStore();
    const mockService = {
      id: 1,
      organization_id: 1,
      name: 'Sunday Service',
      service_date: '2025-01-06',
      start_time: '10:00:00',
      service_type: 'sunday_service',
      is_active: true,
      created_at: '2025-01-06T00:00:00Z',
      updated_at: '2025-01-06T00:00:00Z'
    };

    store.setCurrentService(mockService);
    store.setCurrentService(null);
    
    expect(store.currentService).toBeNull();
  });

  it('should compute today services correctly', () => {
    const store = useAttendanceStore();
    const today = new Date().toISOString().split('T')[0];
    
    store.services = [
      {
        id: 1,
        organization_id: 1,
        name: 'Today Service',
        service_date: today,
        start_time: '10:00:00',
        service_type: 'sunday_service',
        is_active: true,
        created_at: '2025-01-06T00:00:00Z',
        updated_at: '2025-01-06T00:00:00Z'
      },
      {
        id: 2,
        organization_id: 1,
        name: 'Tomorrow Service',
        service_date: '2025-01-07',
        start_time: '10:00:00',
        service_type: 'sunday_service',
        is_active: true,
        created_at: '2025-01-06T00:00:00Z',
        updated_at: '2025-01-06T00:00:00Z'
      }
    ];

    expect(store.todayServices).toHaveLength(1);
    expect(store.todayServices[0].name).toBe('Today Service');
  });

  it('should compute upcoming services correctly', () => {
    const store = useAttendanceStore();
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    store.services = [
      {
        id: 1,
        organization_id: 1,
        name: 'Today Service',
        service_date: today.toISOString().split('T')[0],
        start_time: '10:00:00',
        service_type: 'sunday_service',
        is_active: true,
        created_at: '2025-01-06T00:00:00Z',
        updated_at: '2025-01-06T00:00:00Z'
      },
      {
        id: 2,
        organization_id: 1,
        name: 'Tomorrow Service',
        service_date: tomorrow.toISOString().split('T')[0],
        start_time: '10:00:00',
        service_type: 'sunday_service',
        is_active: true,
        created_at: '2025-01-06T00:00:00Z',
        updated_at: '2025-01-06T00:00:00Z'
      }
    ];

    expect(store.upcomingServices).toHaveLength(1);
    expect(store.upcomingServices[0].name).toBe('Tomorrow Service');
  });

  it('should compute current service attendance correctly', () => {
    const store = useAttendanceStore();
    const mockService = {
      id: 1,
      organization_id: 1,
      name: 'Sunday Service',
      service_date: '2025-01-06',
      start_time: '10:00:00',
      service_type: 'sunday_service',
      is_active: true,
      created_at: '2025-01-06T00:00:00Z',
      updated_at: '2025-01-06T00:00:00Z'
    };

    store.currentService = mockService;
    store.attendanceRecords = [
      {
        id: 1,
        organization_id: 1,
        service_id: 1,
        member_id: 1,
        check_in_time: '2025-01-06T10:00:00Z',
        check_in_method: 'qr_code',
        created_at: '2025-01-06T10:00:00Z',
        updated_at: '2025-01-06T10:00:00Z'
      },
      {
        id: 2,
        organization_id: 1,
        service_id: 2,
        member_id: 2,
        check_in_time: '2025-01-06T10:00:00Z',
        check_in_method: 'manual_search',
        created_at: '2025-01-06T10:00:00Z',
        updated_at: '2025-01-06T10:00:00Z'
      }
    ];

    expect(store.currentServiceAttendance).toHaveLength(1);
    expect(store.currentServiceAttendance[0].service_id).toBe(1);
  });

  it('should compute member and visitor attendance correctly', () => {
    const store = useAttendanceStore();
    const mockService = {
      id: 1,
      organization_id: 1,
      name: 'Sunday Service',
      service_date: '2025-01-06',
      start_time: '10:00:00',
      service_type: 'sunday_service',
      is_active: true,
      created_at: '2025-01-06T00:00:00Z',
      updated_at: '2025-01-06T00:00:00Z'
    };

    store.currentService = mockService;
    store.attendanceRecords = [
      {
        id: 1,
        organization_id: 1,
        service_id: 1,
        member_id: 1,
        check_in_time: '2025-01-06T10:00:00Z',
        check_in_method: 'qr_code',
        created_at: '2025-01-06T10:00:00Z',
        updated_at: '2025-01-06T10:00:00Z'
      },
      {
        id: 2,
        organization_id: 1,
        service_id: 1,
        visitor_name: 'John Doe',
        visitor_phone: '+1234567890',
        check_in_time: '2025-01-06T10:00:00Z',
        check_in_method: 'visitor',
        created_at: '2025-01-06T10:00:00Z',
        updated_at: '2025-01-06T10:00:00Z'
      }
    ];

    expect(store.memberAttendance).toHaveLength(1);
    expect(store.visitorAttendance).toHaveLength(1);
    expect(store.totalAttendance).toBe(2);
    expect(store.memberCount).toBe(1);
    expect(store.visitorCount).toBe(1);
  });

  it('should clear error', () => {
    const store = useAttendanceStore();
    store.error = 'Test error';
    
    store.clearError();
    
    expect(store.error).toBeNull();
  });
});
