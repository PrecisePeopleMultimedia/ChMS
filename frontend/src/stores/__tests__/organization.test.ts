import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useOrganizationStore } from '../organization'
import { api } from '@/services/api'

// Mock the API service
vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}))

describe('Organization Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = useOrganizationStore()
      
      expect(store.organization).toBeNull()
      expect(store.settings).toEqual({})
      expect(store.serviceSchedules).toEqual([])
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.isSetupComplete).toBe(false)
      expect(store.hasOrganization).toBe(false)
      expect(store.organizationId).toBeUndefined()
    })
  })

  describe('Organization CRUD', () => {
    it('should create organization successfully', async () => {
      const store = useOrganizationStore()
      const mockOrganization = {
        id: 1,
        name: 'Test Church',
        address: '123 Test St',
        timezone: 'Africa/Lagos'
      }

      vi.mocked(api.post).mockResolvedValue({
        data: {
          success: true,
          data: mockOrganization
        }
      })

      const orgData = {
        name: 'Test Church',
        address: '123 Test St',
        timezone: 'Africa/Lagos'
      }

      const result = await store.createOrganization(orgData)

      expect(api.post).toHaveBeenCalledWith('/organizations', orgData)
      expect(store.organization).toEqual(mockOrganization)
      expect(store.isSetupComplete).toBe(true)
      expect(result).toEqual(mockOrganization)
    })

    it('should handle organization creation error', async () => {
      const store = useOrganizationStore()
      const errorMessage = 'Validation failed'

      vi.mocked(api.post).mockRejectedValue({
        response: {
          data: {
            message: errorMessage
          }
        }
      })

      const orgData = {
        name: 'Test Church',
        timezone: 'Africa/Lagos'
      }

      await expect(store.createOrganization(orgData)).rejects.toThrow()
      expect(store.error).toBe(errorMessage)
      expect(store.isLoading).toBe(false)
    })

    it('should fetch organization successfully', async () => {
      const store = useOrganizationStore()
      const mockOrganization = {
        id: 1,
        name: 'Test Church',
        timezone: 'Africa/Lagos'
      }

      vi.mocked(api.get).mockResolvedValue({
        data: {
          success: true,
          data: mockOrganization
        }
      })

      const result = await store.fetchOrganization()

      expect(api.get).toHaveBeenCalledWith('/organizations')
      expect(store.organization).toEqual(mockOrganization)
      expect(store.isSetupComplete).toBe(true)
      expect(result).toEqual(mockOrganization)
    })

    it('should handle no organization found (404)', async () => {
      const store = useOrganizationStore()

      vi.mocked(api.get).mockRejectedValue({
        response: {
          status: 404
        }
      })

      const result = await store.fetchOrganization()

      expect(store.isSetupComplete).toBe(false)
      expect(result).toBeNull()
    })

    it('should update organization successfully', async () => {
      const store = useOrganizationStore()
      store.organization = { id: 1, name: 'Old Name', timezone: 'Africa/Lagos' }
      
      const updatedOrg = { id: 1, name: 'New Name', timezone: 'Africa/Lagos' }
      
      vi.mocked(api.put).mockResolvedValue({
        data: {
          success: true,
          data: updatedOrg
        }
      })

      const result = await store.updateOrganization({ name: 'New Name' })

      expect(api.put).toHaveBeenCalledWith('/organizations/1', { name: 'New Name' })
      expect(store.organization).toEqual(updatedOrg)
      expect(result).toEqual(updatedOrg)
    })
  })

  describe('Settings Management', () => {
    it('should fetch settings successfully', async () => {
      const store = useOrganizationStore()
      store.organization = { id: 1, name: 'Test Church', timezone: 'Africa/Lagos' }
      
      const mockSettings = {
        welcome_message: 'Welcome to our church',
        contact_person: 'Pastor John'
      }

      vi.mocked(api.get).mockResolvedValue({
        data: {
          success: true,
          data: mockSettings
        }
      })

      const result = await store.fetchSettings()

      expect(api.get).toHaveBeenCalledWith('/organizations/1/settings')
      expect(store.settings).toEqual(mockSettings)
      expect(result).toEqual(mockSettings)
    })

    it('should update settings successfully', async () => {
      const store = useOrganizationStore()
      store.organization = { id: 1, name: 'Test Church', timezone: 'Africa/Lagos' }
      
      const newSettings = {
        welcome_message: 'Updated welcome message',
        contact_person: 'Pastor Jane'
      }

      vi.mocked(api.put).mockResolvedValue({
        data: {
          success: true,
          data: newSettings
        }
      })

      const result = await store.updateSettings(newSettings)

      expect(api.put).toHaveBeenCalledWith('/organizations/1/settings', {
        settings: newSettings
      })
      expect(store.settings).toEqual(newSettings)
      expect(result).toEqual(newSettings)
    })
  })

  describe('Service Schedules', () => {
    it('should fetch service schedules successfully', async () => {
      const store = useOrganizationStore()
      const mockSchedules = [
        {
          id: 1,
          name: 'Sunday Service',
          day_of_week: 0,
          start_time: '09:00',
          end_time: '11:00',
          is_active: true
        }
      ]

      vi.mocked(api.get).mockResolvedValue({
        data: {
          success: true,
          data: mockSchedules
        }
      })

      const result = await store.fetchServiceSchedules()

      expect(api.get).toHaveBeenCalledWith('/service-schedules')
      expect(store.serviceSchedules).toEqual(mockSchedules)
      expect(result).toEqual(mockSchedules)
    })

    it('should create service schedule successfully', async () => {
      const store = useOrganizationStore()
      const newSchedule = {
        name: 'Bible Study',
        day_of_week: 3,
        start_time: '19:00',
        end_time: '21:00',
        is_active: true
      }

      const createdSchedule = { id: 1, ...newSchedule }

      vi.mocked(api.post).mockResolvedValue({
        data: {
          success: true,
          data: createdSchedule
        }
      })

      const result = await store.createServiceSchedule(newSchedule)

      expect(api.post).toHaveBeenCalledWith('/service-schedules', newSchedule)
      expect(store.serviceSchedules).toContain(createdSchedule)
      expect(result).toEqual(createdSchedule)
    })

    it('should update service schedule successfully', async () => {
      const store = useOrganizationStore()
      const existingSchedule = {
        id: 1,
        name: 'Sunday Service',
        day_of_week: 0,
        start_time: '09:00',
        end_time: '11:00',
        is_active: true
      }
      store.serviceSchedules = [existingSchedule]

      const updatedSchedule = { ...existingSchedule, name: 'Updated Service' }

      vi.mocked(api.put).mockResolvedValue({
        data: {
          success: true,
          data: updatedSchedule
        }
      })

      const result = await store.updateServiceSchedule(1, { name: 'Updated Service' })

      expect(api.put).toHaveBeenCalledWith('/service-schedules/1', { name: 'Updated Service' })
      expect(store.serviceSchedules[0]).toEqual(updatedSchedule)
      expect(result).toEqual(updatedSchedule)
    })

    it('should delete service schedule successfully', async () => {
      const store = useOrganizationStore()
      const schedule = {
        id: 1,
        name: 'Sunday Service',
        day_of_week: 0,
        start_time: '09:00',
        end_time: '11:00',
        is_active: true
      }
      store.serviceSchedules = [schedule]

      vi.mocked(api.delete).mockResolvedValue({
        data: {
          success: true
        }
      })

      const result = await store.deleteServiceSchedule(1)

      expect(api.delete).toHaveBeenCalledWith('/service-schedules/1')
      expect(store.serviceSchedules).toEqual([])
      expect(result).toBe(true)
    })
  })

  describe('Utility Methods', () => {
    it('should clear error', () => {
      const store = useOrganizationStore()
      store.error = 'Some error'

      store.clearError()

      expect(store.error).toBeNull()
    })

    it('should reset store', () => {
      const store = useOrganizationStore()
      store.organization = { id: 1, name: 'Test', timezone: 'Africa/Lagos' }
      store.settings = { key: 'value' }
      store.serviceSchedules = [{ id: 1, name: 'Test', day_of_week: 0, start_time: '09:00', is_active: true }]
      store.isLoading = true
      store.error = 'Error'
      store.isSetupComplete = true

      store.resetStore()

      expect(store.organization).toBeNull()
      expect(store.settings).toEqual({})
      expect(store.serviceSchedules).toEqual([])
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.isSetupComplete).toBe(false)
    })
  })
})
