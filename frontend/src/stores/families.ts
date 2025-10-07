import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'
import type { 
  Family, 
  FamilyFilters, 
  FamilyFormData, 
  FamiliesResponse, 
  FamilyResponse,
  Pagination
} from '@/types/member'

export const useFamiliesStore = defineStore('families', () => {
  // State
  const families = ref<Family[]>([])
  const currentFamily = ref<Family | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<Pagination>({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
    from: 0,
    to: 0
  })

  // Getters
  const getFamilyById = computed(() => {
    return (id: number) => families.value.find(family => family.id === id)
  })

  const familiesWithMembers = computed(() => {
    return families.value.filter(family => family.member_count && family.member_count > 0)
  })

  const familyOptions = computed(() => {
    return families.value.map(family => ({
      label: family.family_name,
      value: family.id
    }))
  })

  // Actions
  const fetchFamilies = async (filters: FamilyFilters = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const params = new URLSearchParams()
      
      // Add filters to params
      if (filters.search) params.append('search', filters.search)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.per_page) params.append('per_page', filters.per_page.toString())
      if (filters.sort_by) params.append('sort_by', filters.sort_by)
      if (filters.sort_order) params.append('sort_order', filters.sort_order)

      const response = await api.get<FamiliesResponse>(`/families?${params.toString()}`)
      
      if (response.data.success) {
        families.value = response.data.data.data
        pagination.value = {
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          per_page: response.data.data.per_page,
          total: response.data.data.total,
          from: response.data.data.from,
          to: response.data.data.to
        }
      } else {
        throw new Error(response.data.message)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch families'
      console.error('Error fetching families:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchFamily = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get<FamilyResponse>(`/families/${id}`)
      
      if (response.data.success) {
        currentFamily.value = response.data.data
        
        // Update family in the list if it exists
        const index = families.value.findIndex(family => family.id === id)
        if (index !== -1) {
          families.value[index] = response.data.data
        }
        
        return response.data.data
      } else {
        throw new Error(response.data.message)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch family'
      console.error('Error fetching family:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createFamily = async (familyData: FamilyFormData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post<FamilyResponse>('/families', familyData)
      
      if (response.data.success) {
        // Add new family to the beginning of the list
        families.value.unshift(response.data.data)
        
        // Update pagination total
        pagination.value.total += 1
        
        return response.data.data
      } else {
        throw new Error(response.data.message)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to create family'
      console.error('Error creating family:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateFamily = async (id: number, familyData: Partial<FamilyFormData>) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put<FamilyResponse>(`/families/${id}`, familyData)
      
      if (response.data.success) {
        // Update family in the list
        const index = families.value.findIndex(family => family.id === id)
        if (index !== -1) {
          families.value[index] = response.data.data
        }
        
        // Update current family if it's the same
        if (currentFamily.value?.id === id) {
          currentFamily.value = response.data.data
        }
        
        return response.data.data
      } else {
        throw new Error(response.data.message)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to update family'
      console.error('Error updating family:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteFamily = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.delete(`/families/${id}`)
      
      if (response.data.success) {
        // Remove family from the list
        const index = families.value.findIndex(family => family.id === id)
        if (index !== -1) {
          families.value.splice(index, 1)
        }
        
        // Update pagination total
        pagination.value.total -= 1
        
        // Clear current family if it's the deleted one
        if (currentFamily.value?.id === id) {
          currentFamily.value = null
        }
        
        return true
      } else {
        throw new Error(response.data.message)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to delete family'
      console.error('Error deleting family:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchFamilies = async (query: string) => {
    loading.value = true
    error.value = null
    
    try {
      const params = new URLSearchParams()
      params.append('search', query)

      const response = await api.get<FamiliesResponse>(`/families?${params.toString()}`)
      
      if (response.data.success) {
        return response.data.data.data
      } else {
        throw new Error(response.data.message)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to search families'
      console.error('Error searching families:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentFamily = () => {
    currentFamily.value = null
  }

  const resetStore = () => {
    families.value = []
    currentFamily.value = null
    loading.value = false
    error.value = null
    pagination.value = {
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 0,
      from: 0,
      to: 0
    }
  }

  return {
    // State
    families,
    currentFamily,
    loading,
    error,
    pagination,
    
    // Getters
    getFamilyById,
    familiesWithMembers,
    familyOptions,
    
    // Actions
    fetchFamilies,
    fetchFamily,
    createFamily,
    updateFamily,
    deleteFamily,
    searchFamilies,
    clearError,
    clearCurrentFamily,
    resetStore
  }
})
