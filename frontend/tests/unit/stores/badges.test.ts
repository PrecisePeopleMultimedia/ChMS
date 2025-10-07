import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBadgesStore } from '@/stores/badges'
import { api } from '@/services/api'

// Mock the API
vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}))

describe('Badges Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Badge Types Management', () => {
    it('should fetch badge types successfully', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              id: 1,
              name: 'Member',
              description: 'Regular church member',
              color: '#007bff',
              icon: 'person',
              is_active: true
            }
          ],
          available_icons: {
            person: 'Person',
            star: 'Star'
          }
        }
      }

      vi.mocked(api.get).mockResolvedValue(mockResponse)

      const store = useBadgesStore()
      await store.fetchBadgeTypes()

      expect(api.get).toHaveBeenCalledWith('/badge-types', { params: undefined })
      expect(store.badgeTypes).toHaveLength(1)
      expect(store.badgeTypes[0].name).toBe('Member')
      expect(store.availableIcons).toEqual({ person: 'Person', star: 'Star' })
    })

    it('should create badge type successfully', async () => {
      const newBadgeType = {
        name: 'Volunteer',
        description: 'Church volunteer',
        color: '#28a745',
        icon: 'volunteer_activism',
        is_active: true
      }

      const mockResponse = {
        data: {
          data: { id: 2, ...newBadgeType }
        }
      }

      vi.mocked(api.post).mockResolvedValue(mockResponse)

      const store = useBadgesStore()
      const result = await store.createBadgeType(newBadgeType)

      expect(api.post).toHaveBeenCalledWith('/badge-types', newBadgeType)
      expect(store.badgeTypes).toHaveLength(1)
      expect(store.badgeTypes[0].name).toBe('Volunteer')
      expect(result.id).toBe(2)
    })

    it('should update badge type successfully', async () => {
      const store = useBadgesStore()
      store.badgeTypes = [
        {
          id: 1,
          name: 'Member',
          description: 'Regular member',
          color: '#007bff',
          icon: 'person',
          is_active: true,
          organization_id: 1,
          created_at: '2023-01-01',
          updated_at: '2023-01-01'
        }
      ]

      const updateData = { name: 'Updated Member', color: '#ff0000' }
      const mockResponse = {
        data: {
          data: { ...store.badgeTypes[0], ...updateData }
        }
      }

      vi.mocked(api.put).mockResolvedValue(mockResponse)

      await store.updateBadgeType(1, updateData)

      expect(api.put).toHaveBeenCalledWith('/badge-types/1', updateData)
      expect(store.badgeTypes[0].name).toBe('Updated Member')
      expect(store.badgeTypes[0].color).toBe('#ff0000')
    })

    it('should delete badge type successfully', async () => {
      const store = useBadgesStore()
      store.badgeTypes = [
        {
          id: 1,
          name: 'Member',
          description: 'Regular member',
          color: '#007bff',
          icon: 'person',
          is_active: true,
          organization_id: 1,
          created_at: '2023-01-01',
          updated_at: '2023-01-01'
        }
      ]

      vi.mocked(api.delete).mockResolvedValue({ data: {} })

      await store.deleteBadgeType(1)

      expect(api.delete).toHaveBeenCalledWith('/badge-types/1')
      expect(store.badgeTypes).toHaveLength(0)
    })

    it('should handle API errors gracefully', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Badge type not found'
          }
        }
      }

      vi.mocked(api.get).mockRejectedValue(mockError)

      const store = useBadgesStore()
      
      await expect(store.fetchBadgeTypes()).rejects.toThrow()
      expect(store.error).toBe('Badge type not found')
    })
  })

  describe('Member Badge Management', () => {
    it('should fetch member badges successfully', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              id: 1,
              name: 'Member',
              color: '#007bff',
              icon: 'person',
              assigned_at: '2023-01-01',
              expires_at: null,
              is_expired: false,
              is_expiring_soon: false,
              expiration_status: 'never'
            }
          ],
          summary: {
            total_badges: 1,
            active_badges: 1,
            expiring_soon: 0,
            expired: 0
          }
        }
      }

      vi.mocked(api.get).mockResolvedValue(mockResponse)

      const store = useBadgesStore()
      await store.fetchMemberBadges(1)

      expect(api.get).toHaveBeenCalledWith('/members/1/badges')
      expect(store.memberBadges).toHaveLength(1)
      expect(store.memberBadgeSummary?.total_badges).toBe(1)
    })

    it('should assign badge to member successfully', async () => {
      const badgeData = {
        badge_type_id: 1,
        notes: 'Test assignment'
      }

      const mockResponse = {
        data: {
          data: {
            id: 1,
            name: 'Member',
            color: '#007bff',
            icon: 'person',
            assigned_at: '2023-01-01',
            notes: 'Test assignment'
          }
        }
      }

      vi.mocked(api.post).mockResolvedValue(mockResponse)

      const store = useBadgesStore()
      const result = await store.assignMemberBadge(1, badgeData)

      expect(api.post).toHaveBeenCalledWith('/members/1/badges', badgeData)
      expect(store.memberBadges).toHaveLength(1)
      expect(result.notes).toBe('Test assignment')
    })

    it('should remove badge from member successfully', async () => {
      const store = useBadgesStore()
      store.memberBadges = [
        {
          id: 1,
          name: 'Member',
          color: '#007bff',
          icon: 'person',
          assigned_at: '2023-01-01',
          expires_at: null,
          is_expired: false,
          is_expiring_soon: false,
          expiration_status: 'never'
        }
      ]

      vi.mocked(api.delete).mockResolvedValue({ data: {} })

      await store.removeMemberBadge(1, 1)

      expect(api.delete).toHaveBeenCalledWith('/members/1/badges/1')
      expect(store.memberBadges).toHaveLength(0)
    })

    it('should bulk assign badges successfully', async () => {
      const mockResponse = {
        data: {
          assigned_count: 2,
          skipped_count: 0,
          total_members: 2
        }
      }

      vi.mocked(api.post).mockResolvedValue(mockResponse)

      const store = useBadgesStore()
      const result = await store.bulkAssignBadges([1, 2], 1, { notes: 'Bulk assignment' })

      expect(api.post).toHaveBeenCalledWith('/member-badges/bulk-assign', {
        member_ids: [1, 2],
        badge_type_id: 1,
        notes: 'Bulk assignment'
      })
      expect(result.assigned_count).toBe(2)
    })
  })

  describe('Computed Properties', () => {
    it('should filter active badge types correctly', () => {
      const store = useBadgesStore()
      store.badgeTypes = [
        {
          id: 1,
          name: 'Active Badge',
          description: 'Active',
          color: '#007bff',
          icon: 'person',
          is_active: true,
          organization_id: 1,
          created_at: '2023-01-01',
          updated_at: '2023-01-01'
        },
        {
          id: 2,
          name: 'Inactive Badge',
          description: 'Inactive',
          color: '#6c757d',
          icon: 'person_off',
          is_active: false,
          organization_id: 1,
          created_at: '2023-01-01',
          updated_at: '2023-01-01'
        }
      ]

      expect(store.activeBadgeTypes).toHaveLength(1)
      expect(store.activeBadgeTypes[0].name).toBe('Active Badge')
      expect(store.inactiveBadgeTypes).toHaveLength(1)
      expect(store.inactiveBadgeTypes[0].name).toBe('Inactive Badge')
    })

    it('should find badge type by ID correctly', () => {
      const store = useBadgesStore()
      store.badgeTypes = [
        {
          id: 1,
          name: 'Member',
          description: 'Regular member',
          color: '#007bff',
          icon: 'person',
          is_active: true,
          organization_id: 1,
          created_at: '2023-01-01',
          updated_at: '2023-01-01'
        }
      ]

      const foundBadge = store.getBadgeTypeById(1)
      expect(foundBadge?.name).toBe('Member')

      const notFoundBadge = store.getBadgeTypeById(999)
      expect(notFoundBadge).toBeUndefined()
    })

    it('should find badge type by name correctly', () => {
      const store = useBadgesStore()
      store.badgeTypes = [
        {
          id: 1,
          name: 'Member',
          description: 'Regular member',
          color: '#007bff',
          icon: 'person',
          is_active: true,
          organization_id: 1,
          created_at: '2023-01-01',
          updated_at: '2023-01-01'
        }
      ]

      const foundBadge = store.getBadgeTypeByName('Member')
      expect(foundBadge?.id).toBe(1)

      const notFoundBadge = store.getBadgeTypeByName('NonExistent')
      expect(notFoundBadge).toBeUndefined()
    })
  })

  describe('Utility Functions', () => {
    it('should clear error state', () => {
      const store = useBadgesStore()
      store.error = 'Some error'

      store.clearError()

      expect(store.error).toBeNull()
    })

    it('should reset member badges', () => {
      const store = useBadgesStore()
      store.memberBadges = [
        {
          id: 1,
          name: 'Member',
          color: '#007bff',
          icon: 'person',
          assigned_at: '2023-01-01',
          expires_at: null,
          is_expired: false,
          is_expiring_soon: false,
          expiration_status: 'never'
        }
      ]
      store.memberBadgeSummary = {
        total_badges: 1,
        active_badges: 1,
        expiring_soon: 0,
        expired: 0,
        badges: []
      }

      store.resetMemberBadges()

      expect(store.memberBadges).toHaveLength(0)
      expect(store.memberBadgeSummary).toBeNull()
    })
  })
})
