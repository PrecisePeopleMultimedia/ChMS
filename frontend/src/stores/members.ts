import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'
import { offlineService } from '@/services/offline'
import { syncService } from '@/services/sync'
import { useAuthStore } from '@/stores/auth'
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
      const authStore = useAuthStore()
      const organizationId = authStore.user?.organization_id

      if (!organizationId) {
        throw new Error('No organization ID available')
      }

      // Try online first
      if (navigator.onLine) {
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
            const serverMembers = response.data.data.data

            // Save to offline storage
            await offlineService.saveMembers(serverMembers, organizationId)

            members.value = serverMembers
            pagination.value = {
              current_page: response.data.data.current_page,
              last_page: response.data.data.last_page,
              per_page: response.data.data.per_page,
              total: response.data.data.total,
              from: response.data.data.from,
              to: response.data.data.to
            }
            return
          } else {
            throw new Error(response.data.message)
          }
        } catch (onlineError) {
          console.warn('Online fetch failed, falling back to offline:', onlineError)
        }
      }

      // Fallback to offline data
      const offlineMembers = await offlineService.getMembers(organizationId)

      // Apply filters to offline data
      let filteredMembers = offlineMembers

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredMembers = filteredMembers.filter(member =>
          member.first_name.toLowerCase().includes(searchLower) ||
          member.last_name.toLowerCase().includes(searchLower) ||
          member.email?.toLowerCase().includes(searchLower) ||
          member.phone?.includes(filters.search!)
        )
      }

      if (filters.member_type) {
        filteredMembers = filteredMembers.filter(member => member.member_type === filters.member_type)
      }

      if (filters.is_active !== undefined) {
        filteredMembers = filteredMembers.filter(member => member.is_active === filters.is_active)
      }

      if (filters.family_id) {
        filteredMembers = filteredMembers.filter(member => member.family_id === filters.family_id)
      }

      // Simple pagination for offline data
      const page = filters.page || 1
      const perPage = filters.per_page || 20
      const startIndex = (page - 1) * perPage
      const endIndex = startIndex + perPage
      const paginatedMembers = filteredMembers.slice(startIndex, endIndex)

      members.value = paginatedMembers
      pagination.value = {
        current_page: page,
        last_page: Math.ceil(filteredMembers.length / perPage),
        per_page: perPage,
        total: filteredMembers.length,
        from: startIndex + 1,
        to: Math.min(endIndex, filteredMembers.length)
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
      const authStore = useAuthStore()
      const organizationId = authStore.user?.organization_id

      if (!organizationId) {
        throw new Error('No organization ID available')
      }

      // Try online first
      if (navigator.onLine) {
        try {
          const response = await api.post<MemberResponse>('/members', memberData)

          if (response.data.success) {
            const newMember = response.data.data

            // Save to offline storage
            await offlineService.saveMembers([newMember], organizationId)

            // Add new member to the beginning of the list
            members.value.unshift(newMember)

            // Update pagination total
            pagination.value.total += 1

            return newMember
          } else {
            throw new Error(response.data.message)
          }
        } catch (onlineError: any) {
          // Handle duplicate detection
          if (onlineError.response?.status === 409) {
            const duplicateResponse = onlineError.response.data as DuplicateCheckResponse
            throw new Error(duplicateResponse.message)
          }

          // If it's a network error, fall back to offline
          if (!onlineError.response) {
            console.warn('Network error, creating member offline:', onlineError)
          } else {
            throw onlineError
          }
        }
      }

      // Create member offline
      const offlineMember = await offlineService.saveMemberOffline(memberData, organizationId)

      // Add to local state
      members.value.unshift(offlineMember)
      pagination.value.total += 1

      return offlineMember

    } catch (err: any) {
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
      // Try online first
      if (navigator.onLine) {
        try {
          const response = await api.put<MemberResponse>(`/members/${id}`, memberData)

          if (response.data.success) {
            const updatedMember = response.data.data

            // Update member in the list
            const index = members.value.findIndex(member => member.id === id)
            if (index !== -1) {
              members.value[index] = updatedMember
            }

            // Update current member if it's the same
            if (currentMember.value?.id === id) {
              currentMember.value = updatedMember
            }

            return updatedMember
          } else {
            throw new Error(response.data.message)
          }
        } catch (onlineError: any) {
          // If it's a network error, fall back to offline
          if (!onlineError.response) {
            console.warn('Network error, updating member offline:', onlineError)
          } else {
            throw onlineError
          }
        }
      }

      // Update member offline
      const updatedMember = await offlineService.updateMemberOffline(id, memberData)

      // Update in local state
      const index = members.value.findIndex(member => member.id === id)
      if (index !== -1) {
        members.value[index] = updatedMember
      }

      if (currentMember.value?.id === id) {
        currentMember.value = updatedMember
      }

      return updatedMember

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
      // Try online first
      if (navigator.onLine) {
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
        } catch (onlineError: any) {
          // If it's a network error, fall back to offline
          if (!onlineError.response) {
            console.warn('Network error, deleting member offline:', onlineError)
          } else {
            throw onlineError
          }
        }
      }

      // Delete member offline
      await offlineService.deleteMemberOffline(id)

      // Remove from local state
      const index = members.value.findIndex(member => member.id === id)
      if (index !== -1) {
        members.value.splice(index, 1)
      }

      pagination.value.total -= 1

      if (currentMember.value?.id === id) {
        currentMember.value = null
      }

      return true

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

  // Sync methods
  const syncMembers = async () => {
    try {
      const result = await syncService.syncMembers()
      if (result.success) {
        // Refresh members after successful sync
        await fetchMembers()
      }
      return result
    } catch (error: any) {
      console.error('Sync failed:', error)
      throw error
    }
  }

  const initializeOffline = async () => {
    try {
      await offlineService.initialize()
      syncService.setupAutoSync()
      await syncService.registerBackgroundSync()
    } catch (error) {
      console.error('Failed to initialize offline functionality:', error)
    }
  }

  const getSyncStatus = () => {
    return syncService.getSyncStatus()
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
    resetStore,

    // Sync methods
    syncMembers,
    initializeOffline,
    getSyncStatus
  }
})
