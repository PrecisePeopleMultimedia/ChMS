import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export interface Family {
  id: number
  organization_id: number
  family_name: string
  head_of_family_id?: number
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  home_phone?: string
  email?: string
  anniversary_date?: string
  notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
  head_of_family?: any
  members?: any[]
  member_count?: number
}

export interface FamilyFormData {
  family_name: string
  head_of_family_id?: number | null
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  home_phone?: string
  email?: string
  anniversary_date?: string
  notes?: string
  is_active?: boolean
}

export interface FamilyFilters {
  search?: string
  head_of_family_id?: number
  city?: string
  state?: string
  active_only?: boolean
  has_anniversary?: boolean
}

export const useFamiliesStore = defineStore('families', () => {
  // State
  const families = ref<Family[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const activeFamilies = computed(() => 
    families.value.filter(family => family.is_active)
  )

  const familiesByCity = computed(() => {
    const grouped: Record<string, Family[]> = {}
    
    activeFamilies.value.forEach(family => {
      const city = family.city || 'Unknown'
      if (!grouped[city]) {
        grouped[city] = []
      }
      grouped[city]?.push(family)
    })

    // Sort families within each city by family_name
    Object.keys(grouped).forEach(city => {
      grouped[city]?.sort((a, b) => a.family_name.localeCompare(b.family_name))
    })

    return grouped
  })

  const getFamilyById = computed(() => (id: number) =>
    families.value.find(family => family.id === id)
  )

  const getFamilyByName = computed(() => (name: string) =>
    families.value.find(family => family.family_name.toLowerCase() === name.toLowerCase())
  )

  // Actions
  const fetchFamilies = async (params?: FamilyFilters) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/families', { params })
      
      families.value = response.data.data || []
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch families'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createFamily = async (familyData: FamilyFormData) => {
    try {
      const response = await api.post('/families', familyData)
      
      // Add the new family to the store
      families.value.push(response.data.data)
      
      // Sort by family_name
      families.value.sort((a, b) => a.family_name.localeCompare(b.family_name))
      
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create family'
      throw err
    }
  }

  const updateFamily = async (id: number, familyData: Partial<FamilyFormData>) => {
    try {
      const response = await api.put(`/families/${id}`, familyData)
      
      // Update the family in the store
      const index = families.value.findIndex(family => family.id === id)
      if (index !== -1) {
        families.value[index] = response.data.data
      }
      
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update family'
      throw err
    }
  }

  const deleteFamily = async (id: number) => {
    try {
      await api.delete(`/families/${id}`)
      
      // Remove the family from the store
      const index = families.value.findIndex(family => family.id === id)
      if (index !== -1) {
        families.value.splice(index, 1)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete family'
      throw err
    }
  }

  const getFamilyMembers = async (familyId: number) => {
    try {
      const response = await api.get(`/families/${familyId}/members`)
      return response.data.data || []
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch family members'
      throw err
    }
  }

  const addMemberToFamily = async (familyId: number, memberId: number) => {
    try {
      const response = await api.post(`/families/${familyId}/members`, {
        member_id: memberId
      })
      
      // Update the family in the store with new member count
      const family = families.value.find(f => f.id === familyId)
      if (family) {
        family.member_count = (family.member_count || 0) + 1
      }
      
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to add member to family'
      throw err
    }
  }

  const removeMemberFromFamily = async (familyId: number, memberId: number) => {
    try {
      await api.delete(`/families/${familyId}/members/${memberId}`)
      
      // Update the family in the store with new member count
      const family = families.value.find(f => f.id === familyId)
      if (family && family.member_count) {
        family.member_count = Math.max(0, family.member_count - 1)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to remove member from family'
      throw err
    }
  }

  const clearError = () => {
    error.value = null
  }

  const resetStore = () => {
    families.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    families,
    loading,
    error,

    // Getters
    activeFamilies,
    familiesByCity,
    getFamilyById,
    getFamilyByName,

    // Actions
    fetchFamilies,
    createFamily,
    updateFamily,
    deleteFamily,
    getFamilyMembers,
    addMemberToFamily,
    removeMemberFromFamily,
    clearError,
    resetStore
  }
})
