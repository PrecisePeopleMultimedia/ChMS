import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export interface Member {
  id: number
  organization_id: number
  first_name: string
  last_name: string
  email?: string
  phone?: string
  date_of_birth?: string
  gender?: string
  address?: string
  member_type: string
  family_id?: number
  joined_date?: string
  is_active: boolean
  created_at: string
  updated_at: string
  full_name?: string
  age?: number
  family?: any
  custom_attributes?: any[]
}

export interface MemberFormData {
  first_name: string
  last_name: string
  email?: string
  phone?: string
  date_of_birth?: string
  gender?: string
  address?: string
  member_type: string
  family_id?: number
  joined_date?: string
  is_active?: boolean
  custom_attributes?: Record<string, any>
}

export interface MemberFilters {
  search?: string
  member_type?: string
  gender?: string
  family_id?: number
  active_only?: boolean
}

export const useMembersStore = defineStore('members', () => {
  // State
  const members = ref<Member[]>([])
  const currentMember = ref<Member | null>(null)
  const memberTypes = ref<Record<string, string>>({})
  const genders = ref<Record<string, string>>({})
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
  const activeMembers = computed(() => 
    members.value.filter(member => member.is_active)
  )

  const membersByType = computed(() => {
    const grouped: Record<string, Member[]> = {}
    
    activeMembers.value.forEach(member => {
      if (!grouped[member.member_type]) {
        grouped[member.member_type] = []
      }
      grouped[member.member_type].push(member)
    })

    return grouped
  })

  const getMemberById = computed(() => (id: number) => 
    members.value.find(member => member.id === id)
  )

  // Actions
  const fetchMembers = async (filters?: MemberFilters & { page?: number; per_page?: number }) => {
    loading.value = true
    error.value = null

    try {
      const params = {
        page: pagination.value.page,
        per_page: pagination.value.per_page,
        ...filters
      }

      const response = await api.get('/members', { params })
      
      members.value = response.data.data || []
      
      // Update pagination
      pagination.value = {
        page: response.data.current_page || 1,
        per_page: response.data.per_page || 15,
        total: response.data.total || 0,
        last_page: response.data.last_page || 1
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch members'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchMember = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/members/${id}`)
      currentMember.value = response.data.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch member'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createMember = async (memberData: MemberFormData) => {
    saving.value = true
    error.value = null

    try {
      const response = await api.post('/members', memberData)
      
      // Add the new member to the store
      members.value.unshift(response.data.data)
      
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create member'
      throw err
    } finally {
      saving.value = false
    }
  }

  const updateMember = async (id: number, memberData: Partial<MemberFormData>) => {
    saving.value = true
    error.value = null

    try {
      const response = await api.put(`/members/${id}`, memberData)
      
      // Update the member in the store
      const index = members.value.findIndex(member => member.id === id)
      if (index !== -1) {
        members.value[index] = response.data.data
      }
      
      // Update current member if it's the same
      if (currentMember.value?.id === id) {
        currentMember.value = response.data.data
      }
      
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update member'
      throw err
    } finally {
      saving.value = false
    }
  }

  const deleteMember = async (id: number) => {
    try {
      await api.delete(`/members/${id}`)
      
      // Remove the member from the store
      const index = members.value.findIndex(member => member.id === id)
      if (index !== -1) {
        members.value.splice(index, 1)
      }
      
      // Clear current member if it's the same
      if (currentMember.value?.id === id) {
        currentMember.value = null
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete member'
      throw err
    }
  }

  const bulkUpdateMembers = async (memberIds: number[], updates: Partial<MemberFormData>) => {
    saving.value = true
    error.value = null

    try {
      const response = await api.post('/members/bulk-update', {
        member_ids: memberIds,
        updates
      })
      
      // Refresh the members list to get updated data
      await fetchMembers()
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to bulk update members'
      throw err
    } finally {
      saving.value = false
    }
  }

  const getMemberAttributes = async (memberId: number) => {
    try {
      const response = await api.get(`/members/${memberId}`)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch member attributes'
      throw err
    }
  }

  const updateMemberAttributes = async (memberId: number, attributes: Record<string, any>) => {
    saving.value = true
    error.value = null

    try {
      const response = await api.put(`/members/${memberId}`, {
        custom_attributes: attributes
      })
      
      // Update the member in the store
      const index = members.value.findIndex(member => member.id === memberId)
      if (index !== -1) {
        members.value[index] = response.data.data
      }
      
      // Update current member if it's the same
      if (currentMember.value?.id === memberId) {
        currentMember.value = response.data.data
      }
      
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update member attributes'
      throw err
    } finally {
      saving.value = false
    }
  }

  const fetchMemberOptions = async () => {
    try {
      const response = await api.get('/members/options')
      memberTypes.value = response.data.member_types || {}
      genders.value = response.data.genders || {}
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch member options'
      throw err
    }
  }

  const searchMembers = async (query: string, filters?: MemberFilters) => {
    return await fetchMembers({ ...filters, search: query })
  }

  const setCurrentPage = (page: number) => {
    pagination.value.page = page
  }

  const setPerPage = (perPage: number) => {
    pagination.value.per_page = perPage
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
    memberTypes.value = {}
    genders.value = {}
    loading.value = false
    saving.value = false
    error.value = null
    pagination.value = {
      page: 1,
      per_page: 15,
      total: 0,
      last_page: 1
    }
  }

  const initializeMembers = async () => {
    await Promise.all([
      fetchMembers(),
      fetchMemberOptions()
    ])
  }

  return {
    // State
    members,
    currentMember,
    memberTypes,
    genders,
    loading,
    saving,
    error,
    pagination,

    // Getters
    activeMembers,
    membersByType,
    getMemberById,

    // Actions
    fetchMembers,
    fetchMember,
    createMember,
    updateMember,
    deleteMember,
    bulkUpdateMembers,
    getMemberAttributes,
    updateMemberAttributes,
    fetchMemberOptions,
    searchMembers,
    setCurrentPage,
    setPerPage,
    clearError,
    clearCurrentMember,
    resetStore,
    initializeMembers
  }
})
