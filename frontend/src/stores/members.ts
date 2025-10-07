import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'
import type { 
  Member, 
  MemberFilters, 
  MemberFormData, 
  MembersResponse, 
  MemberResponse,
  Pagination,
  DuplicateCheckResponse
} from '@/types/member'

export const useMembersStore = defineStore('members', () => {
  // State
  const members = ref<Member[]>([])
  const currentMember = ref<Member | null>(null)
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
  const getMemberById = computed(() => {
    return (id: number) => members.value.find(member => member.id === id)
  })

  const activeMembersCount = computed(() => {
    return members.value.filter(member => member.is_active).length
  })

  const membersByType = computed(() => {
    return (type: string) => members.value.filter(member => member.member_type === type)
  })

  // Actions
  const fetchMembers = async (filters: MemberFilters = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const params = new URLSearchParams()
      
      // Add filters to params
      if (filters.search) params.append('search', filters.search)
      if (filters.member_type) params.append('member_type', filters.member_type)
      if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString())
      if (filters.family_id) params.append('family_id', filters.family_id.toString())
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.per_page) params.append('per_page', filters.per_page.toString())
      if (filters.sort_by) params.append('sort_by', filters.sort_by)
      if (filters.sort_order) params.append('sort_order', filters.sort_order)

      const response = await api.get<MembersResponse>(`/members?${params.toString()}`)
      
      if (response.data.success) {
        members.value = response.data.data.data
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
      error.value = err.response?.data?.message || err.message || 'Failed to fetch members'
      console.error('Error fetching members:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchMember = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get<MemberResponse>(`/members/${id}`)
      
      if (response.data.success) {
        currentMember.value = response.data.data
        
        // Update member in the list if it exists
        const index = members.value.findIndex(member => member.id === id)
        if (index !== -1) {
          members.value[index] = response.data.data
        }
        
        return response.data.data
      } else {
        throw new Error(response.data.message)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch member'
      console.error('Error fetching member:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createMember = async (memberData: MemberFormData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post<MemberResponse>('/members', memberData)
      
      if (response.data.success) {
        // Add new member to the beginning of the list
        members.value.unshift(response.data.data)
        
        // Update pagination total
        pagination.value.total += 1
        
        return response.data.data
      } else {
        throw new Error(response.data.message)
      }
    } catch (err: any) {
      // Handle duplicate detection
      if (err.response?.status === 409) {
        const duplicateResponse = err.response.data as DuplicateCheckResponse
        throw new Error(duplicateResponse.message)
      }
      
      error.value = err.response?.data?.message || err.message || 'Failed to create member'
      console.error('Error creating member:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateMember = async (id: number, memberData: Partial<MemberFormData>) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put<MemberResponse>(`/members/${id}`, memberData)
      
      if (response.data.success) {
        // Update member in the list
        const index = members.value.findIndex(member => member.id === id)
        if (index !== -1) {
          members.value[index] = response.data.data
        }
        
        // Update current member if it's the same
        if (currentMember.value?.id === id) {
          currentMember.value = response.data.data
        }
        
        return response.data.data
      } else {
        throw new Error(response.data.message)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to update member'
      console.error('Error updating member:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteMember = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.delete(`/members/${id}`)
      
      if (response.data.success) {
        // Remove member from the list
        const index = members.value.findIndex(member => member.id === id)
        if (index !== -1) {
          members.value.splice(index, 1)
        }
        
        // Update pagination total
        pagination.value.total -= 1
        
        // Clear current member if it's the deleted one
        if (currentMember.value?.id === id) {
          currentMember.value = null
        }
        
        return true
      } else {
        throw new Error(response.data.message)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to delete member'
      console.error('Error deleting member:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchMembers = async (query: string, filters: Omit<MemberFilters, 'search'> = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const params = new URLSearchParams()
      params.append('query', query)
      
      // Add additional filters
      if (filters.member_type) params.append('member_type', filters.member_type)
      if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString())
      if (filters.family_id) params.append('family_id', filters.family_id.toString())

      const response = await api.get<{ success: boolean; data: Member[]; message: string }>(`/members/search?${params.toString()}`)
      
      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.message)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to search members'
      console.error('Error searching members:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const toggleMemberStatus = async (id: number) => {
    const member = getMemberById.value(id)
    if (!member) return
    
    return updateMember(id, { is_active: !member.is_active })
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentMember = () => {
    currentMember.value = null
  }

  const resetStore = () => {
    members.value = []
    currentMember.value = null
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
    members,
    currentMember,
    loading,
    error,
    pagination,
    
    // Getters
    getMemberById,
    activeMembersCount,
    membersByType,
    
    // Actions
    fetchMembers,
    fetchMember,
    createMember,
    updateMember,
    deleteMember,
    searchMembers,
    toggleMemberStatus,
    clearError,
    clearCurrentMember,
    resetStore
  }
})
