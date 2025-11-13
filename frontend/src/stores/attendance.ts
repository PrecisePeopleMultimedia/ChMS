import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'
import offlineSyncService from '@/services/offline-sync'

export interface Service {
  id: number
  organization_id: number
  name: string
  service_type: string
  scheduled_date: string
  start_time: string
  end_time?: string
  location?: string
  location_assignment?: string
  capacity?: number
  ministry_assignments?: any
  special_requirements?: any
  allow_family_checkin: boolean
  require_location_assignment: boolean
  enable_child_security: boolean
  status: string
  notes?: string
  created_at: string
  updated_at: string
  attendance_count?: number
}

export interface AttendanceRecord {
  id: number
  organization_id: number
  service_id: number
  member_id?: number
  family_id?: number
  checked_in_at: string
  checked_out_at?: string
  checkin_method: string
  location_assignment?: string
  ministry_assignment?: string
  seat_section?: string
  is_family_checkin: boolean
  parent_id?: number
  child_security_code?: string
  special_needs_notes?: string
  visitor_name?: string
  visitor_phone?: string
  visitor_email?: string
  device_info?: any
  offline_sync: boolean
  notes?: string
  checked_in_by: number
  created_at: string
  updated_at: string
  service?: Service
  member?: any
  family?: any
}

export interface QrCode {
  id: number
  member_id?: number
  family_id?: number
  qr_code_data: string
  qr_code_type: string
  generated_at: string
  expires_at?: string
  is_active: boolean
}

export interface AttendanceStats {
  total_attendance: number
  member_attendance: number
  visitor_attendance: number
  family_checkins: number
  qr_checkins: number
  manual_checkins: number
  date_range?: {
    from: string
    to: string
  }
  daily_breakdown?: Record<string, number>
  service_breakdown?: Record<string, number>
}

export interface AttendanceFilters {
  service_id?: number
  member_id?: number
  family_id?: number
  checkin_method?: string
  date_from?: string
  date_to?: string
  today?: boolean
  visitors_only?: boolean
  members_only?: boolean
  family_checkins_only?: boolean
}

export const useAttendanceStore = defineStore('attendance', () => {
  // State
  const services = ref<Service[]>([])
  const currentService = ref<Service | null>(null)
  const attendanceRecords = ref<AttendanceRecord[]>([])
  const stats = ref<AttendanceStats | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    per_page: 15,
    total: 0,
    last_page: 1
  })

  // Getters
  const todayServices = computed(() => 
    services.value.filter(service => {
      const today = new Date().toISOString().split('T')[0]
      return service.scheduled_date === today && 
             ['scheduled', 'active'].includes(service.status)
    })
  )

  const upcomingServices = computed(() =>
    services.value.filter(service => {
      const today = new Date().toISOString().split('T')[0]
      return service.scheduled_date >= today && 
             ['scheduled', 'active'].includes(service.status)
    })
  )

  const todayAttendance = computed(() =>
    attendanceRecords.value.filter(record => {
      const today = new Date().toISOString().split('T')[0]
      return record.checked_in_at.startsWith(today)
    })
  )

  // Actions
  const fetchServices = async (filters?: {
    status?: string
    service_type?: string
    date_from?: string
    date_to?: string
    today?: boolean
    upcoming?: boolean
  }) => {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()
      if (filters?.status) params.append('status', filters.status)
      if (filters?.service_type) params.append('service_type', filters.service_type)
      if (filters?.date_from) params.append('date_from', filters.date_from)
      if (filters?.date_to) params.append('date_to', filters.date_to)
      if (filters?.today) params.append('today', '1')
      if (filters?.upcoming) params.append('upcoming', '1')

      const response = await api.get(`/services?${params.toString()}`)
      
      if (response.data.data) {
        // Paginated response
        services.value = response.data.data.data || response.data.data
        if (response.data.data.total !== undefined) {
          pagination.value = {
            page: response.data.data.current_page || 1,
            per_page: response.data.data.per_page || 15,
            total: response.data.data.total || 0,
            last_page: response.data.data.last_page || 1
          }
        }
      } else {
        services.value = response.data.data || []
      }

      return services.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch services'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchService = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/services/${id}`)
      const service = response.data.data
      currentService.value = service
      return service
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch service'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createService = async (serviceData: Partial<Service>) => {
    saving.value = true
    error.value = null

    try {
      const response = await api.post('/services', serviceData)
      const service = response.data.data
      services.value.push(service)
      return service
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create service'
      throw err
    } finally {
      saving.value = false
    }
  }

  const updateService = async (id: number, serviceData: Partial<Service>) => {
    saving.value = true
    error.value = null

    try {
      const response = await api.put(`/services/${id}`, serviceData)
      const service = response.data.data
      const index = services.value.findIndex(s => s.id === id)
      if (index !== -1) {
        services.value[index] = service
      }
      if (currentService.value?.id === id) {
        currentService.value = service
      }
      return service
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update service'
      throw err
    } finally {
      saving.value = false
    }
  }

  const fetchAttendanceRecords = async (filters?: AttendanceFilters) => {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()
      if (filters?.service_id) params.append('service_id', filters.service_id.toString())
      if (filters?.member_id) params.append('member_id', filters.member_id.toString())
      if (filters?.family_id) params.append('family_id', filters.family_id.toString())
      if (filters?.checkin_method) params.append('checkin_method', filters.checkin_method)
      if (filters?.date_from) params.append('date_from', filters.date_from)
      if (filters?.date_to) params.append('date_to', filters.date_to)
      if (filters?.today) params.append('today', '1')
      if (filters?.visitors_only) params.append('visitors_only', '1')
      if (filters?.members_only) params.append('members_only', '1')
      if (filters?.family_checkins_only) params.append('family_checkins_only', '1')

      const response = await api.get(`/attendance?${params.toString()}`)
      
      if (response.data.data?.data) {
        // Paginated response
        attendanceRecords.value = response.data.data.data
        pagination.value = {
          page: response.data.data.current_page || 1,
          per_page: response.data.data.per_page || 15,
          total: response.data.data.total || 0,
          last_page: response.data.data.last_page || 1
        }
      } else {
        attendanceRecords.value = response.data.data || []
      }

      return attendanceRecords.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch attendance records'
      throw err
    } finally {
      loading.value = false
    }
  }

  const checkInMember = async (checkinData: {
    service_id: number
    member_id?: number
    visitor_name?: string
    visitor_phone?: string
    visitor_email?: string
    location_assignment?: string
    ministry_assignment?: string
    seat_section?: string
    notes?: string
    checkin_method?: string
    offline_sync?: boolean
  }) => {
    saving.value = true
    error.value = null

    // Check if offline
    const isOffline = !navigator.onLine

    try {
      if (isOffline) {
        // Queue for offline sync
        const tempId = Date.now()
        const offlineRecord = {
          ...checkinData,
          id: tempId,
          offline_sync: true,
          checked_in_at: new Date().toISOString(),
          temp_id: tempId
        }

        await offlineSyncService.queueForSync('create', 'attendance_records', offlineRecord)
        
        // Add to local records immediately
        attendanceRecords.value.unshift(offlineRecord as any)
        
        return offlineRecord
      } else {
        const response = await api.post('/attendance', checkinData)
        const record = response.data.data
        attendanceRecords.value.unshift(record)
        return record
      }
    } catch (err: any) {
      // If online and request fails, try to queue for offline sync
      if (!isOffline && err.response?.status !== 422) {
        try {
          const tempId = Date.now()
          const offlineRecord = {
            ...checkinData,
            id: tempId,
            offline_sync: true,
            checked_in_at: new Date().toISOString(),
            temp_id: tempId
          }

          await offlineSyncService.queueForSync('create', 'attendance_records', offlineRecord)
          attendanceRecords.value.unshift(offlineRecord as any)
          
          return offlineRecord
        } catch (queueError) {
          error.value = err.response?.data?.message || 'Failed to check in member'
          throw err
        }
      } else {
        error.value = err.response?.data?.message || 'Failed to check in member'
        throw err
      }
    } finally {
      saving.value = false
    }
  }

  const qrCheckIn = async (qrData: {
    qr_code_data: string
    service_id: number
    location_assignment?: string
    ministry_assignment?: string
    offline_sync?: boolean
  }) => {
    saving.value = true
    error.value = null

    const isOffline = !navigator.onLine

    try {
      if (isOffline) {
        // For offline QR check-in, we need to decode QR data first
        // This is a simplified version - in production, you'd decode the QR data
        const tempId = Date.now()
        const offlineRecord = {
          service_id: qrData.service_id,
          id: tempId,
          offline_sync: true,
          checkin_method: 'qr_individual',
          checked_in_at: new Date().toISOString(),
          qr_code_data: qrData.qr_code_data,
          temp_id: tempId
        }

        await offlineSyncService.queueForSync('create', 'attendance_records', offlineRecord)
        attendanceRecords.value.unshift(offlineRecord as any)
        
        return offlineRecord
      } else {
        const response = await api.post('/attendance/qr-checkin', qrData)
        const result = response.data.data

        // Handle family check-in (multiple records)
        if (result.attendance_records) {
          attendanceRecords.value.unshift(...result.attendance_records)
          return result
        }

        // Individual check-in (single record)
        attendanceRecords.value.unshift(result)
        return result
      }
    } catch (err: any) {
      if (!isOffline && err.response?.status !== 422) {
        // Queue for offline sync on error
        const tempId = Date.now()
        const offlineRecord = {
          service_id: qrData.service_id,
          id: tempId,
          offline_sync: true,
          checkin_method: 'qr_individual',
          checked_in_at: new Date().toISOString(),
          qr_code_data: qrData.qr_code_data,
          temp_id: tempId
        }

        await offlineSyncService.queueForSync('create', 'attendance_records', offlineRecord)
        attendanceRecords.value.unshift(offlineRecord as any)
        return offlineRecord
      }
      error.value = err.response?.data?.message || 'Failed to process QR check-in'
      throw err
    } finally {
      saving.value = false
    }
  }

  const familyCheckIn = async (checkinData: {
    family_id: number
    service_id: number
    member_ids?: number[]
    location_assignment?: string
    ministry_assignment?: string
  }) => {
    saving.value = true
    error.value = null

    const isOffline = !navigator.onLine

    try {
      if (isOffline) {
        // Queue family check-in for offline sync
        const tempId = Date.now()
        const offlineRecord = {
          ...checkinData,
          id: tempId,
          offline_sync: true,
          is_family_checkin: true,
          checked_in_at: new Date().toISOString(),
          checkin_method: 'qr_family',
          temp_id: tempId
        }

        await offlineSyncService.queueForSync('create', 'attendance_records', offlineRecord)
        attendanceRecords.value.unshift(offlineRecord as any)
        
        return { attendance_records: [offlineRecord] }
      } else {
        const response = await api.post('/attendance/family-checkin', checkinData)
        const result = response.data.data

        // Family check-in returns multiple records
        if (result.attendance_records) {
          attendanceRecords.value.unshift(...result.attendance_records)
        }

        return result
      }
    } catch (err: any) {
      if (!isOffline && err.response?.status !== 422) {
        // Queue for offline sync on error
        const tempId = Date.now()
        const offlineRecord = {
          ...checkinData,
          id: tempId,
          offline_sync: true,
          is_family_checkin: true,
          checked_in_at: new Date().toISOString(),
          checkin_method: 'qr_family',
          temp_id: tempId
        }

        await offlineSyncService.queueForSync('create', 'attendance_records', offlineRecord)
        attendanceRecords.value.unshift(offlineRecord as any)
        return { attendance_records: [offlineRecord] }
      }
      error.value = err.response?.data?.message || 'Failed to check in family'
      throw err
    } finally {
      saving.value = false
    }
  }

  const fetchReports = async (filters?: {
    service_id?: number
    date_from?: string
    date_to?: string
  }) => {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()
      if (filters?.service_id) params.append('service_id', filters.service_id.toString())
      if (filters?.date_from) params.append('date_from', filters.date_from)
      if (filters?.date_to) params.append('date_to', filters.date_to)

      const response = await api.get(`/attendance/reports?${params.toString()}`)
      stats.value = response.data.data
      return stats.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch reports'
      throw err
    } finally {
      loading.value = false
    }
  }

  const generateMemberQrCode = async (memberId: number, serviceId?: number) => {
    loading.value = true
    error.value = null

    try {
      const params = serviceId ? `?service_id=${serviceId}` : ''
      const response = await api.get(`/members/${memberId}/qr-code${params}`)
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to generate QR code'
      throw err
    } finally {
      loading.value = false
    }
  }

  const generateFamilyQrCode = async (familyId: number, serviceId?: number) => {
    loading.value = true
    error.value = null

    try {
      const params = serviceId ? `?service_id=${serviceId}` : ''
      const response = await api.get(`/qr-codes/families/${familyId}/generate${params}`)
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to generate family QR code'
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  // New methods for AttendanceTracker component
  const checkIn = async (data: {
    serviceId: string
    memberId: string
    status: 'present' | 'absent' | 'late' | 'excused'
    checkInMethod?: string
    checkInTime?: string
  }) => {
    return await checkInMember({
      service_id: parseInt(data.serviceId),
      member_id: parseInt(data.memberId),
      checkin_method: data.checkInMethod || 'manual',
      notes: `Status: ${data.status}`,
    })
  }

  const bulkCheckIn = async (data: {
    serviceId: string
    memberIds: string[]
    status: 'present' | 'absent' | 'late' | 'excused'
    checkInMethod?: string
    checkInTime?: string
  }) => {
    saving.value = true
    try {
      const promises = data.memberIds.map(memberId =>
        checkInMember({
          service_id: parseInt(data.serviceId),
          member_id: parseInt(memberId),
          checkin_method: data.checkInMethod || 'manual',
          notes: `Status: ${data.status}`,
        })
      )
      await Promise.all(promises)
    } finally {
      saving.value = false
    }
  }

  const fetchRecords = async (serviceId?: string) => {
    return await fetchAttendanceRecords(serviceId ? { service_id: parseInt(serviceId) } : undefined)
  }

  const exportReport = async (serviceId: string) => {
    // In production, call API to export report
    console.log('Exporting report for service:', serviceId)
  }

  return {
    // State
    services,
    currentService,
    attendanceRecords: attendanceRecords as any,
    records: attendanceRecords, // Alias for compatibility
    stats,
    loading,
    saving,
    error,
    pagination,
    // Getters
    todayServices,
    upcomingServices,
    todayAttendance,
    // Actions
    fetchServices,
    fetchService,
    createService,
    updateService,
    fetchAttendanceRecords,
    fetchRecords, // New alias
    checkInMember,
    checkIn, // New method for AttendanceTracker
    bulkCheckIn, // New method for AttendanceTracker
    qrCheckIn,
    familyCheckIn,
    fetchReports,
    generateMemberQrCode,
    generateFamilyQrCode,
    exportReport, // New method
    clearError
  }
})

