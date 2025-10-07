import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export interface BadgeType {
  id: number
  organization_id: number
  name: string
  description?: string
  color: string
  icon: string
  is_active: boolean
  member_count?: number
  active_member_count?: number
  created_at: string
  updated_at: string
}

export interface MemberBadge {
  id: number
  name: string
  description?: string
  color: string
  icon: string
  assigned_at: string
  expires_at?: string
  is_expired: boolean
  is_expiring_soon: boolean
  expiration_status: 'never' | 'active' | 'expiring_soon' | 'expired'
  days_until_expiration?: number
  notes?: string
  assigned_by_name?: string
}

export interface BadgeStatistics {
  total_badge_types: number
  total_assignments: number
  active_assignments: number
  badge_distribution: Array<{
    name: string
    color: string
    member_count: number
    active_member_count: number
  }>
}

export interface MemberBadgeSummary {
  total_badges: number
  active_badges: number
  expiring_soon: number
  expired: number
  badges: MemberBadge[]
}

export const useBadgesStore = defineStore('badges', () => {
  // State
  const badgeTypes = ref<BadgeType[]>([])
  const memberBadges = ref<MemberBadge[]>([])
  const memberBadgeSummary = ref<MemberBadgeSummary | null>(null)
  const availableIcons = ref<Record<string, string>>({})
  const statistics = ref<BadgeStatistics>({
    total_badge_types: 0,
    total_assignments: 0,
    active_assignments: 0,
    badge_distribution: []
  })
  const expiringBadges = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const activeBadgeTypes = computed(() => 
    badgeTypes.value.filter(badge => badge.is_active)
  )

  const inactiveBadgeTypes = computed(() => 
    badgeTypes.value.filter(badge => !badge.is_active)
  )

  const getBadgeTypeById = computed(() => (id: number) => 
    badgeTypes.value.find(badge => badge.id === id)
  )

  const getBadgeTypeByName = computed(() => (name: string) => 
    badgeTypes.value.find(badge => badge.name === name)
  )

  // Actions
  const fetchBadgeTypes = async (params?: { search?: string; active_only?: boolean }) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get('/badge-types', { params })
      badgeTypes.value = response.data.data || []
      availableIcons.value = response.data.available_icons || {}
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch badge types'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createBadgeType = async (badgeTypeData: Partial<BadgeType>) => {
    try {
      const response = await api.post('/badge-types', badgeTypeData)
      const newBadgeType = response.data.data
      badgeTypes.value.push(newBadgeType)
      return newBadgeType
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create badge type'
      throw err
    }
  }

  const updateBadgeType = async (id: number, badgeTypeData: Partial<BadgeType>) => {
    try {
      const response = await api.put(`/badge-types/${id}`, badgeTypeData)
      const updatedBadgeType = response.data.data
      
      const index = badgeTypes.value.findIndex(badge => badge.id === id)
      if (index !== -1) {
        badgeTypes.value[index] = updatedBadgeType
      }
      
      return updatedBadgeType
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update badge type'
      throw err
    }
  }

  const deleteBadgeType = async (id: number) => {
    try {
      await api.delete(`/badge-types/${id}`)
      badgeTypes.value = badgeTypes.value.filter(badge => badge.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete badge type'
      throw err
    }
  }

  const createDefaultBadges = async () => {
    try {
      await api.post('/badge-types/create-defaults')
      // Refresh badge types after creating defaults
      await fetchBadgeTypes()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create default badges'
      throw err
    }
  }

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/badge-types-statistics')
      statistics.value = response.data.data
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch statistics'
      throw err
    }
  }

  const bulkUpdateBadgeTypes = async (updates: Array<{ id: number; is_active: boolean }>) => {
    try {
      await api.post('/badge-types/bulk-update', { badge_types: updates })
      
      // Update local state
      updates.forEach(update => {
        const badge = badgeTypes.value.find(b => b.id === update.id)
        if (badge) {
          badge.is_active = update.is_active
        }
      })
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to bulk update badge types'
      throw err
    }
  }

  // Member Badge Actions
  const fetchMemberBadges = async (memberId: number) => {
    try {
      loading.value = true
      const response = await api.get(`/members/${memberId}/badges`)
      memberBadges.value = response.data.data || []
      memberBadgeSummary.value = response.data.summary || null
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch member badges'
      throw err
    } finally {
      loading.value = false
    }
  }

  const assignMemberBadge = async (memberId: number, badgeData: {
    badge_type_id: number
    expires_at?: string
    notes?: string
  }) => {
    try {
      const response = await api.post(`/members/${memberId}/badges`, badgeData)
      const newBadge = response.data.data
      memberBadges.value.push(newBadge)
      return newBadge
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to assign badge'
      throw err
    }
  }

  const updateMemberBadge = async (memberId: number, badgeTypeId: number, badgeData: {
    expires_at?: string
    notes?: string
  }) => {
    try {
      const response = await api.put(`/members/${memberId}/badges/${badgeTypeId}`, badgeData)
      const updatedBadge = response.data.data
      
      const index = memberBadges.value.findIndex(badge => badge.id === updatedBadge.id)
      if (index !== -1) {
        memberBadges.value[index] = updatedBadge
      }
      
      return updatedBadge
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update badge'
      throw err
    }
  }

  const removeMemberBadge = async (memberId: number, badgeTypeId: number) => {
    try {
      await api.delete(`/members/${memberId}/badges/${badgeTypeId}`)
      memberBadges.value = memberBadges.value.filter(badge => badge.id !== badgeTypeId)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to remove badge'
      throw err
    }
  }

  const autoAssignBadges = async (memberId: number) => {
    try {
      const response = await api.post(`/members/${memberId}/badges/auto-assign`)
      memberBadges.value = response.data.badges || []
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to auto-assign badges'
      throw err
    }
  }

  const bulkAssignBadges = async (memberIds: number[], badgeTypeId: number, options?: {
    expires_at?: string
    notes?: string
  }) => {
    try {
      const response = await api.post('/member-badges/bulk-assign', {
        member_ids: memberIds,
        badge_type_id: badgeTypeId,
        ...options
      })
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to bulk assign badges'
      throw err
    }
  }

  const bulkRemoveBadges = async (memberIds: number[], badgeTypeId: number) => {
    try {
      const response = await api.post('/member-badges/bulk-remove', {
        member_ids: memberIds,
        badge_type_id: badgeTypeId
      })
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to bulk remove badges'
      throw err
    }
  }

  const fetchExpiringBadges = async (days: number = 7) => {
    try {
      const response = await api.get('/member-badges/expiring', { params: { days } })
      expiringBadges.value = response.data.data || []
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch expiring badges'
      throw err
    }
  }

  // Utility functions
  const clearError = () => {
    error.value = null
  }

  const resetMemberBadges = () => {
    memberBadges.value = []
    memberBadgeSummary.value = null
  }

  return {
    // State
    badgeTypes,
    memberBadges,
    memberBadgeSummary,
    availableIcons,
    statistics,
    expiringBadges,
    loading,
    error,

    // Getters
    activeBadgeTypes,
    inactiveBadgeTypes,
    getBadgeTypeById,
    getBadgeTypeByName,

    // Actions
    fetchBadgeTypes,
    createBadgeType,
    updateBadgeType,
    deleteBadgeType,
    createDefaultBadges,
    fetchStatistics,
    bulkUpdateBadgeTypes,

    // Member Badge Actions
    fetchMemberBadges,
    assignMemberBadge,
    updateMemberBadge,
    removeMemberBadge,
    autoAssignBadges,
    bulkAssignBadges,
    bulkRemoveBadges,
    fetchExpiringBadges,

    // Utilities
    clearError,
    resetMemberBadges,
  }
})
