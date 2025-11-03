import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export interface Household {
  id: number
  organization_id: number
  name: string
  description?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  head_of_household_id?: number
  home_phone?: string
  email?: string
  household_type: string
  notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
  head_of_household?: any
  organization?: any
  members?: HouseholdMember[]
  member_count?: number
}

export interface HouseholdMember {
  id: number
  household_id: number
  member_id: number
  relationship_type_id?: number
  role: string
  residency_start_date?: string
  residency_end_date?: string
  residency_status: string
  custody_type?: string
  custody_notes?: string
  guardian_id?: number
  notes?: string
  member?: any
  relationship_type?: any
  guardian?: any
}

export interface HouseholdFilters {
  search?: string
  household_type?: string | null
  active_only?: boolean
}

export const useHouseholdsStore = defineStore('households', () => {
  // State
  const households = ref<Household[]>([])
  const currentHousehold = ref<Household | null>(null)
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
  const activeHouseholds = computed(() => 
    households.value.filter(household => household.is_active)
  )

  const householdsByType = computed(() => {
    const grouped: Record<string, Household[]> = {}
    
    activeHouseholds.value.forEach(household => {
      if (!grouped[household.household_type]) {
        grouped[household.household_type] = []
      }
      grouped[household.household_type]?.push(household)
    })

    return grouped
  })

  // Actions
  const fetchHouseholds = async (filters?: HouseholdFilters) => {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()
      if (filters?.search) params.append('search', filters.search)
      if (filters?.household_type) params.append('household_type', filters.household_type)
      if (filters?.active_only !== false) params.append('active_only', '1')

      const response = await api.get(`/households?${params.toString()}`)
      
      if (response.data.data?.data) {
        households.value = response.data.data.data
        pagination.value = {
          page: response.data.data.current_page || 1,
          per_page: response.data.data.per_page || 15,
          total: response.data.data.total || 0,
          last_page: response.data.data.last_page || 1
        }
      } else {
        households.value = response.data.data || []
      }

      return households.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch households'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchHousehold = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/households/${id}`)
      const household = response.data.data
      currentHousehold.value = household
      return household
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch household'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createHousehold = async (householdData: Partial<Household>) => {
    saving.value = true
    error.value = null

    try {
      const response = await api.post('/households', householdData)
      const household = response.data.data
      households.value.push(household)
      return household
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create household'
      throw err
    } finally {
      saving.value = false
    }
  }

  const updateHousehold = async (id: number, householdData: Partial<Household>) => {
    saving.value = true
    error.value = null

    try {
      const response = await api.put(`/households/${id}`, householdData)
      const household = response.data.data
      const index = households.value.findIndex(h => h.id === id)
      if (index !== -1) {
        households.value[index] = household
      }
      if (currentHousehold.value?.id === id) {
        currentHousehold.value = household
      }
      return household
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update household'
      throw err
    } finally {
      saving.value = false
    }
  }

  const deleteHousehold = async (id: number) => {
    saving.value = true
    error.value = null

    try {
      await api.delete(`/households/${id}`)
      households.value = households.value.filter(h => h.id !== id)
      if (currentHousehold.value?.id === id) {
        currentHousehold.value = null
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete household'
      throw err
    } finally {
      saving.value = false
    }
  }

  const addMemberToHousehold = async (householdId: number, memberData: {
    member_id: number
    relationship_type_id?: number
    role?: string
    residency_start_date?: string
    residency_end_date?: string
    residency_status?: string
    custody_type?: string
    custody_notes?: string
    guardian_id?: number
    notes?: string
  }) => {
    saving.value = true
    error.value = null

    try {
      const response = await api.post(`/households/${householdId}/members`, memberData)
      // Refresh household to get updated members list
      if (currentHousehold.value?.id === householdId) {
        await fetchHousehold(householdId)
      }
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to add member to household'
      throw err
    } finally {
      saving.value = false
    }
  }

  const removeMemberFromHousehold = async (householdId: number, memberId: number) => {
    saving.value = true
    error.value = null

    try {
      await api.delete(`/households/${householdId}/members/${memberId}`)
      // Refresh household to get updated members list
      if (currentHousehold.value?.id === householdId) {
        await fetchHousehold(householdId)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to remove member from household'
      throw err
    } finally {
      saving.value = false
    }
  }

  const fetchHouseholdMembers = async (householdId: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/households/${householdId}/members`)
      return response.data.data || []
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch household members'
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    households,
    currentHousehold,
    loading,
    saving,
    error,
    pagination,
    // Getters
    activeHouseholds,
    householdsByType,
    // Actions
    fetchHouseholds,
    fetchHousehold,
    createHousehold,
    updateHousehold,
    deleteHousehold,
    addMemberToHousehold,
    removeMemberFromHousehold,
    fetchHouseholdMembers,
    clearError
  }
})

