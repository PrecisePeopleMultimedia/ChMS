import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAttendanceStore } from '@/stores/attendance'
import { api } from '@/services/api'

// Mock the API
vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  }
}))

// Mock the offline sync composable
vi.mock('@/composables/useOfflineStore', () => ({
  useOfflineStore: () => ({
    isOnline: { value: true },
    queueForSync: vi.fn(),
    syncQueue: vi.fn(),
  })
}))

describe('Attendance Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('State Management', () => {
    it('initializes with correct default state', () => {
      const store = useAttendanceStore()

      expect(store.services).toEqual([])
      expect(store.currentService).toBeNull()
      expect(store.attendanceRecords).toEqual([])
      expect(store.statistics).toBeNull()
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.offlineQueue).toEqual([])
    })
  })

  describe('Computed Properties', () => {
    it('filters today services correctly', () => {
      const store = useAttendanceStore()
      const today = new Date().toISOString().split('T')[0]
      
      store.services = [
        { id: 1, scheduled_date: today, name: 'Today Service' },
        { id: 2, scheduled_date: '2023-01-01', name: 'Past Service' },
        { id: 3, scheduled_date: today, name: 'Another Today Service' },
      ] as any

      expect(store.todayServices).toHaveLength(2)
      expect(store.todayServices[0].name).toBe('Today Service')
      expect(store.todayServices[1].name).toBe('Another Today Service')
    })

    it('filters active services correctly', () => {
      const store = useAttendanceStore()
      
      store.services = [
        { id: 1, status: 'active', name: 'Active Service' },
        { id: 2, status: 'scheduled', name: 'Scheduled Service' },
        { id: 3, status: 'active', name: 'Another Active Service' },
        { id: 4, status: 'completed', name: 'Completed Service' },
      ] as any

      expect(store.activeServices).toHaveLength(2)
      expect(store.activeServices[0].name).toBe('Active Service')
      expect(store.activeServices[1].name).toBe('Another Active Service')
    })

    it('filters pending offline records correctly', () => {
      const store = useAttendanceStore()
      
      store.offlineQueue = [
        { id: 1, offline_sync: false },
        { id: 2, offline_sync: true },
        { id: 3, offline_sync: false },
      ] as any

      expect(store.pendingOfflineRecords).toHaveLength(2)
      expect(store.pendingOfflineRecords[0].id).toBe(1)
      expect(store.pendingOfflineRecords[1].id).toBe(3)
    })
  })

  describe('Actions', () => {
    describe('fetchServices', () => {
      it('fetches services successfully', async () => {
        const store = useAttendanceStore()
        const mockServices = [
          { id: 1, name: 'Sunday Morning', service_type: 'sunday_morning' },
          { id: 2, name: 'Midweek', service_type: 'midweek' },
        ]

        vi.mocked(api.get).mockResolvedValue({ data: mockServices })

        await store.fetchServices()

        expect(api.get).toHaveBeenCalledWith('/attendance/services', { params: {} })
        expect(store.services).toEqual(mockServices)
        expect(store.isLoading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('handles fetch services error', async () => {
        const store = useAttendanceStore()
        const errorMessage = 'Failed to fetch services'

        vi.mocked(api.get).mockRejectedValue({
          response: { data: { message: errorMessage } }
        })

        await expect(store.fetchServices()).rejects.toThrow()
        expect(store.error).toBe(errorMessage)
        expect(store.isLoading).toBe(false)
      })

      it('passes filters to API correctly', async () => {
        const store = useAttendanceStore()
        const filters = {
          start_date: '2023-01-01',
          end_date: '2023-12-31',
          service_type: 'sunday_morning',
          status: 'active'
        }

        vi.mocked(api.get).mockResolvedValue({ data: [] })

        await store.fetchServices(filters)

        expect(api.get).toHaveBeenCalledWith('/attendance/services', { params: filters })
      })
    })

    describe('createService', () => {
      it('creates service successfully', async () => {
        const store = useAttendanceStore()
        const serviceData = {
          name: 'New Service',
          service_type: 'sunday_morning',
          scheduled_date: '2023-12-25'
        }
        const createdService = { id: 1, ...serviceData }

        vi.mocked(api.post).mockResolvedValue({ data: createdService })

        const result = await store.createService(serviceData)

        expect(api.post).toHaveBeenCalledWith('/attendance/services', serviceData)
        expect(store.services).toContain(createdService)
        expect(result).toEqual(createdService)
      })

      it('handles create service error', async () => {
        const store = useAttendanceStore()
        const errorMessage = 'Failed to create service'

        vi.mocked(api.post).mockRejectedValue({
          response: { data: { message: errorMessage } }
        })

        await expect(store.createService({})).rejects.toThrow()
        expect(store.error).toBe(errorMessage)
      })
    })

    describe('manualCheckIn', () => {
      it('performs manual check-in successfully when online', async () => {
        const store = useAttendanceStore()
        const checkInData = {
          member_id: 1,
          service_id: 1,
          location_assignment: 'Main Hall'
        }
        const response = { success: true, attendance: { id: 1, ...checkInData } }

        vi.mocked(api.post).mockResolvedValue({ data: response })

        const result = await store.manualCheckIn(1, 1, 'Main Hall')

        expect(api.post).toHaveBeenCalledWith('/attendance/manual-checkin', {
          member_id: 1,
          service_id: 1,
          location_assignment: 'Main Hall',
          ministry_assignment: undefined,
          notes: undefined
        })
        expect(result).toEqual(response)
      })

      it('queues check-in for offline sync when offline', async () => {
        // Mock offline state
        vi.mocked(vi.fn()).mockReturnValue({
          isOnline: { value: false },
          queueForSync: vi.fn(),
          syncQueue: vi.fn(),
        })

        const store = useAttendanceStore()
        
        const result = await store.manualCheckIn(1, 1)

        expect(store.offlineQueue).toHaveLength(1)
        expect(result.offline).toBe(true)
      })
    })

    describe('qrCheckIn', () => {
      it('performs QR check-in successfully', async () => {
        const store = useAttendanceStore()
        const qrData = 'encoded-qr-data'
        const response = { success: true, attendance: { id: 1, checkin_method: 'qr_individual' } }

        vi.mocked(api.post).mockResolvedValue({ data: response })

        const result = await store.qrCheckIn(qrData, 1)

        expect(api.post).toHaveBeenCalledWith('/attendance/qr-checkin', {
          qr_code_data: qrData,
          service_id: 1,
          device_info: undefined,
          notes: undefined
        })
        expect(result).toEqual(response)
      })
    })

    describe('familyCheckIn', () => {
      it('performs family check-in successfully', async () => {
        const store = useAttendanceStore()
        const response = { 
          success: true, 
          attendances: [
            { id: 1, member_id: 1, is_family_checkin: true },
            { id: 2, member_id: 2, is_family_checkin: true }
          ]
        }

        vi.mocked(api.post).mockResolvedValue({ data: response })

        const result = await store.familyCheckIn(1, 1, [1, 2])

        expect(api.post).toHaveBeenCalledWith('/attendance/family-checkin', {
          family_id: 1,
          service_id: 1,
          member_ids: [1, 2],
          location_assignment: undefined,
          ministry_assignments: undefined,
          notes: undefined
        })
        expect(result).toEqual(response)
      })
    })

    describe('fetchAttendanceRecords', () => {
      it('fetches attendance records successfully', async () => {
        const store = useAttendanceStore()
        const mockRecords = [
          { id: 1, member_id: 1, service_id: 1 },
          { id: 2, member_id: 2, service_id: 1 }
        ]

        vi.mocked(api.get).mockResolvedValue({ data: { data: mockRecords } })

        await store.fetchAttendanceRecords({ service_id: 1 })

        expect(api.get).toHaveBeenCalledWith('/attendance/records?service_id=1')
        expect(store.attendanceRecords).toEqual(mockRecords)
      })
    })

    describe('generateQrCode', () => {
      it('generates QR code successfully', async () => {
        const store = useAttendanceStore()
        const qrResponse = {
          qr_code_data: 'encoded-data',
          qr_code: { id: 1, member_id: 1, is_active: true },
          member: { id: 1, name: 'John Doe' }
        }

        vi.mocked(api.post).mockResolvedValue({ data: qrResponse })

        const result = await store.generateQrCode(1)

        expect(api.post).toHaveBeenCalledWith('/attendance/members/1/qr-code?', {})
        expect(result).toEqual(qrResponse)
      })

      it('generates family QR code with correct parameters', async () => {
        const store = useAttendanceStore()

        vi.mocked(api.post).mockResolvedValue({ data: {} })

        await store.generateQrCode(1, true, '2023-12-31')

        expect(api.post).toHaveBeenCalledWith(
          '/attendance/members/1/qr-code?family=true&expires_at=2023-12-31',
          {}
        )
      })
    })

    describe('fetchStatistics', () => {
      it('fetches statistics successfully', async () => {
        const store = useAttendanceStore()
        const mockStats = {
          total_attendance: 100,
          today_attendance: 25,
          unique_members: 80,
          by_service_type: { sunday_morning: 60, midweek: 40 },
          by_method: { qr_individual: 70, manual: 30 }
        }

        vi.mocked(api.get).mockResolvedValue({ data: mockStats })

        await store.fetchStatistics('2023-01-01', '2023-12-31')

        expect(api.get).toHaveBeenCalledWith('/attendance/statistics?start_date=2023-01-01&end_date=2023-12-31')
        expect(store.statistics).toEqual(mockStats)
      })
    })

    describe('syncOfflineRecords', () => {
      it('syncs offline records successfully', async () => {
        const store = useAttendanceStore()
        store.offlineQueue = [
          { id: 1, member_id: 1, service_id: 1, offline_sync: false },
          { id: 2, member_id: 2, service_id: 1, offline_sync: false }
        ] as any

        const syncResponse = {
          synced: 2,
          failed: 0,
          synced_records: [{ id: 1 }, { id: 2 }]
        }

        vi.mocked(api.post).mockResolvedValue({ data: syncResponse })

        const result = await store.syncOfflineRecords()

        expect(api.post).toHaveBeenCalledWith('/attendance/sync-offline', {
          attendances: [
            {
              member_id: 1,
              service_id: 1,
              checked_in_at: expect.any(String),
              checkin_method: expect.any(String)
            },
            {
              member_id: 2,
              service_id: 1,
              checked_in_at: expect.any(String),
              checkin_method: expect.any(String)
            }
          ]
        })
        expect(result).toEqual(syncResponse)
      })

      it('does not sync when offline', async () => {
        // Mock offline state
        vi.mocked(vi.fn()).mockReturnValue({
          isOnline: { value: false },
          queueForSync: vi.fn(),
          syncQueue: vi.fn(),
        })

        const store = useAttendanceStore()
        
        const result = await store.syncOfflineRecords()

        expect(api.post).not.toHaveBeenCalled()
        expect(result).toBeUndefined()
      })
    })

    describe('clearError', () => {
      it('clears error state', () => {
        const store = useAttendanceStore()
        store.error = 'Some error'

        store.clearError()

        expect(store.error).toBeNull()
      })
    })
  })
})
