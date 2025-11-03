import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBadgesStore } from '@/stores/badges'
import type { BadgeType, MemberBadge } from '@/stores/badges'

// Mock the API
vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}))

import { api } from '@/services/api'

describe('Badges Store', () => {
  let badgesStore: ReturnType<typeof useBadgesStore>

  const mockBadgeType: BadgeType = {
    id: 1,
    organization_id: 1,
    name: 'Leader',
    description: 'Church leadership team member',
    color: '#dc3545',
    icon: 'admin_panel_settings',
    is_active: true,
    member_count: 5,
    active_member_count: 4,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }

  const mockMemberBadge: MemberBadge = {
    id: 1,
    member_id: 1,
    badge_type_id: 1,
    name: 'Leader',
    description: 'Church leadership team member',
    color: '#dc3545',
    icon: 'admin_panel_settings',
    assigned_at: '2025-01-01T00:00:00Z',
    expires_at: null,
    is_expired: false,
    is_expiring_soon: false,
    expiration_status: 'never',
    days_until_expiration: null,
    notes: 'Assigned for leadership role',
    assigned_by_name: 'Admin User'
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    badgesStore = useBadgesStore()
    vi.clearAllMocks()
  })

  it('should initialize with empty state', () => {
    expect(badgesStore.badgeTypes).toEqual([])
    expect(badgesStore.memberBadges).toEqual([])
    expect(badgesStore.memberBadgeSummary).toBeNull()
    expect(badgesStore.availableIcons).toEqual({})
    expect(badgesStore.loading).toBe(false)
    expect(badgesStore.error).toBeNull()
  })

  it('should compute active badge types correctly', () => {
    badgesStore.badgeTypes = [
      { ...mockBadgeType, is_active: true },
      { ...mockBadgeType, id: 2, is_active: false }
    ]

    expect(badgesStore.activeBadgeTypes).toHaveLength(1)
    expect(badgesStore.activeBadgeTypes[0].is_active).toBe(true)
  })

  it('should compute inactive badge types correctly', () => {
    badgesStore.badgeTypes = [
      { ...mockBadgeType, is_active: true },
      { ...mockBadgeType, id: 2, is_active: false }
    ]

    expect(badgesStore.inactiveBadgeTypes).toHaveLength(1)
    expect(badgesStore.inactiveBadgeTypes[0].is_active).toBe(false)
  })

  it('should find badge type by ID', () => {
    badgesStore.badgeTypes = [mockBadgeType]

    const foundBadge = badgesStore.getBadgeTypeById(1)
    expect(foundBadge).toEqual(mockBadgeType)

    const notFoundBadge = badgesStore.getBadgeTypeById(999)
    expect(notFoundBadge).toBeUndefined()
  })

  it('should find badge type by name', () => {
    badgesStore.badgeTypes = [mockBadgeType]

    const foundBadge = badgesStore.getBadgeTypeByName('Leader')
    expect(foundBadge).toEqual(mockBadgeType)

    const notFoundBadge = badgesStore.getBadgeTypeByName('NonExistent')
    expect(notFoundBadge).toBeUndefined()
  })

  it('should handle fetch badge types success', async () => {
    const mockResponse = {
      data: {
        data: [mockBadgeType],
        available_icons: { 'admin_panel_settings': 'Admin' }
      }
    }

    vi.mocked(api.get).mockResolvedValue(mockResponse)

    await badgesStore.fetchBadgeTypes()

    expect(api.get).toHaveBeenCalledWith('/badge-types', { params: undefined })
    expect(badgesStore.badgeTypes).toEqual([mockBadgeType])
    expect(badgesStore.availableIcons).toEqual({ 'admin_panel_settings': 'Admin' })
    expect(badgesStore.loading).toBe(false)
    expect(badgesStore.error).toBeNull()
  })

  it('should handle fetch badge types error', async () => {
    const mockError = {
      response: { data: { message: 'Failed to fetch badge types' } }
    }

    vi.mocked(api.get).mockRejectedValue(mockError)

    await expect(badgesStore.fetchBadgeTypes()).rejects.toThrow()
    expect(badgesStore.error).toBe('Failed to fetch badge types')
    expect(badgesStore.loading).toBe(false)
  })

  it('should handle create badge type success', async () => {
    const newBadgeData = {
      name: 'Volunteer',
      description: 'Active volunteer',
      color: '#28a745',
      icon: 'volunteer_activism'
    }

    const mockResponse = {
      data: { data: { ...mockBadgeType, ...newBadgeData, id: 2 } }
    }

    vi.mocked(api.post).mockResolvedValue(mockResponse)

    const result = await badgesStore.createBadgeType(newBadgeData)

    expect(api.post).toHaveBeenCalledWith('/badge-types', newBadgeData)
    expect(badgesStore.badgeTypes).toHaveLength(1)
    expect(result.name).toBe('Volunteer')
  })

  it('should handle update badge type success', async () => {
    badgesStore.badgeTypes = [mockBadgeType]

    const updateData = { name: 'Senior Leader' }
    const mockResponse = {
      data: { data: { ...mockBadgeType, ...updateData } }
    }

    vi.mocked(api.put).mockResolvedValue(mockResponse)

    const result = await badgesStore.updateBadgeType(1, updateData)

    expect(api.put).toHaveBeenCalledWith('/badge-types/1', updateData)
    expect(badgesStore.badgeTypes[0].name).toBe('Senior Leader')
    expect(result.name).toBe('Senior Leader')
  })

  it('should handle delete badge type success', async () => {
    badgesStore.badgeTypes = [mockBadgeType, { ...mockBadgeType, id: 2 }]

    vi.mocked(api.delete).mockResolvedValue({})

    await badgesStore.deleteBadgeType(1)

    expect(api.delete).toHaveBeenCalledWith('/badge-types/1')
    expect(badgesStore.badgeTypes).toHaveLength(1)
    expect(badgesStore.badgeTypes[0].id).toBe(2)
  })

  it('should handle fetch member badges success', async () => {
    const mockResponse = {
      data: {
        data: [mockMemberBadge],
        summary: {
          total_badges: 1,
          active_badges: 1,
          expiring_soon: 0,
          expired: 0,
          badges: [mockMemberBadge]
        }
      }
    }

    vi.mocked(api.get).mockResolvedValue(mockResponse)

    await badgesStore.fetchMemberBadges(1)

    expect(api.get).toHaveBeenCalledWith('/members/1/badges')
    expect(badgesStore.memberBadges).toEqual([mockMemberBadge])
    expect(badgesStore.memberBadgeSummary?.total_badges).toBe(1)
  })

  it('should handle assign badge to member success', async () => {
    const assignData = {
      badge_type_id: 1,
      notes: 'Leadership assignment',
      expires_at: null
    }

    const mockResponse = {
      data: { data: mockMemberBadge }
    }

    vi.mocked(api.post).mockResolvedValue(mockResponse)

    const result = await badgesStore.assignMemberBadge(1, assignData)

    expect(api.post).toHaveBeenCalledWith('/members/1/badges', assignData)
    expect(result).toEqual(mockMemberBadge)
  })

  it('should handle remove badge from member success', async () => {
    badgesStore.memberBadges = [mockMemberBadge]

    vi.mocked(api.delete).mockResolvedValue({})

    await badgesStore.removeMemberBadge(1, 1)

    expect(api.delete).toHaveBeenCalledWith('/members/1/badges/1')
    expect(badgesStore.memberBadges).toHaveLength(0)
  })

  it('should handle create default badges success', async () => {
    const mockResponse = {
      data: { message: 'Default badges created successfully' }
    }

    vi.mocked(api.post).mockResolvedValue(mockResponse)

    await badgesStore.createDefaultBadges()

    expect(api.post).toHaveBeenCalledWith('/badge-types/create-defaults')
  })

  it('should handle fetch statistics success', async () => {
    const mockStats = {
      total_badge_types: 5,
      total_assignments: 25,
      active_assignments: 20,
      badge_distribution: [
        { name: 'Leader', color: '#dc3545', member_count: 5, active_member_count: 4 }
      ]
    }

    const mockResponse = { data: { data: mockStats } }
    vi.mocked(api.get).mockResolvedValue(mockResponse)

    const result = await badgesStore.fetchStatistics()

    expect(api.get).toHaveBeenCalledWith('/badge-types-statistics')
    expect(result).toEqual(mockStats)
    expect(badgesStore.statistics).toEqual(mockStats)
  })

  it('should handle auto assign badges success', async () => {
    const mockResponse = {
      data: { 
        message: 'Badges auto-assigned successfully',
        assigned_badges: [mockMemberBadge]
      }
    }

    vi.mocked(api.post).mockResolvedValue(mockResponse)

    const result = await badgesStore.autoAssignBadges(1)

    expect(api.post).toHaveBeenCalledWith('/members/1/badges/auto-assign')
    expect(result.assigned_badges).toEqual([mockMemberBadge])
  })

  it('should clear error when calling clearError', () => {
    badgesStore.error = 'Some error'
    badgesStore.clearError()
    expect(badgesStore.error).toBeNull()
  })
})
