import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export interface Organization {
  id?: number
  name: string
  address?: string
  phone?: string
  email?: string
  website?: string
  description?: string
  timezone: string
  created_at?: string
  updated_at?: string
}

export interface OrganizationSettings {
  [key: string]: string | null
}

export interface ServiceSchedule {
  id?: number
  organization_id?: number
  name: string
  day_of_week: number
  start_time: string
  end_time?: string
  is_active: boolean
  day_name?: string
}

export const useOrganizationStore = defineStore('organization', () => {
  // State
  const organization = ref<Organization | null>(null)
  const settings = ref<OrganizationSettings>({})
  const serviceSchedules = ref<ServiceSchedule[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isSetupComplete = ref(false)

  // Computed
  const hasOrganization = computed(() => organization.value !== null)
  const organizationId = computed(() => organization.value?.id)

  // Actions
  const clearError = () => {
    error.value = null
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (errorMessage: string) => {
    error.value = errorMessage
    isLoading.value = false
  }

  // Organization CRUD operations
  const createOrganization = async (orgData: Omit<Organization, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true)
      clearError()

      const response = await api.post('/organizations', orgData)
      
      if (response.data.success) {
        organization.value = response.data.data
        isSetupComplete.value = true
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to create organization')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create organization'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchOrganization = async () => {
    try {
      setLoading(true)
      clearError()

      const response = await api.get('/organizations')
      
      if (response.data.success || response.data.data) {
        organization.value = response.data.data
        isSetupComplete.value = true
        return response.data.data
      } else {
        // No organization found - setup needed
        isSetupComplete.value = false
        return null
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        // No organization found - setup needed
        isSetupComplete.value = false
        return null
      }
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch organization'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateOrganization = async (orgData: Partial<Organization>) => {
    if (!organizationId.value) {
      throw new Error('No organization to update')
    }

    try {
      setLoading(true)
      clearError()

      const response = await api.put(`/organizations/${organizationId.value}`, orgData)
      
      if (response.data.success) {
        organization.value = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to update organization')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update organization'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Settings operations
  const fetchSettings = async () => {
    if (!organizationId.value) return

    try {
      setLoading(true)
      clearError()

      const response = await api.get(`/organizations/${organizationId.value}/settings`)
      
      if (response.data.success) {
        settings.value = response.data.data || {}
        return response.data.data
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch settings'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (newSettings: OrganizationSettings) => {
    if (!organizationId.value) {
      throw new Error('No organization to update settings for')
    }

    try {
      setLoading(true)
      clearError()

      const response = await api.put(`/organizations/${organizationId.value}/settings`, {
        settings: newSettings
      })
      
      if (response.data.success) {
        settings.value = response.data.data || {}
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to update settings')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update settings'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Service schedule operations
  const fetchServiceSchedules = async () => {
    try {
      setLoading(true)
      clearError()

      const response = await api.get('/service-schedules')
      
      if (response.data.success) {
        serviceSchedules.value = response.data.data || []
        return response.data.data
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch service schedules'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const createServiceSchedule = async (scheduleData: Omit<ServiceSchedule, 'id' | 'organization_id'>) => {
    try {
      setLoading(true)
      clearError()

      const response = await api.post('/service-schedules', scheduleData)
      
      if (response.data.success) {
        const newSchedule = response.data.data
        serviceSchedules.value.push(newSchedule)
        return newSchedule
      } else {
        throw new Error(response.data.message || 'Failed to create service schedule')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create service schedule'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateServiceSchedule = async (id: number, scheduleData: Partial<ServiceSchedule>) => {
    try {
      setLoading(true)
      clearError()

      const response = await api.put(`/service-schedules/${id}`, scheduleData)
      
      if (response.data.success) {
        const updatedSchedule = response.data.data
        const index = serviceSchedules.value.findIndex(s => s.id === id)
        if (index !== -1) {
          serviceSchedules.value[index] = updatedSchedule
        }
        return updatedSchedule
      } else {
        throw new Error(response.data.message || 'Failed to update service schedule')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update service schedule'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteServiceSchedule = async (id: number) => {
    try {
      setLoading(true)
      clearError()

      const response = await api.delete(`/service-schedules/${id}`)
      
      if (response.data.success) {
        serviceSchedules.value = serviceSchedules.value.filter(s => s.id !== id)
        return true
      } else {
        throw new Error(response.data.message || 'Failed to delete service schedule')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete service schedule'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Initialize organization data
  const initializeOrganization = async () => {
    await fetchOrganization()
    if (hasOrganization.value) {
      await Promise.all([
        fetchSettings(),
        fetchServiceSchedules()
      ])
    }
  }

  // Reset store
  const resetStore = () => {
    organization.value = null
    settings.value = {}
    serviceSchedules.value = []
    isLoading.value = false
    error.value = null
    isSetupComplete.value = false
  }

  return {
    // State
    organization,
    settings,
    serviceSchedules,
    isLoading,
    error,
    isSetupComplete,

    // Computed
    hasOrganization,
    organizationId,

    // Actions
    clearError,
    createOrganization,
    fetchOrganization,
    updateOrganization,
    fetchSettings,
    updateSettings,
    fetchServiceSchedules,
    createServiceSchedule,
    updateServiceSchedule,
    deleteServiceSchedule,
    initializeOrganization,
    resetStore,
  }
})
