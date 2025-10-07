import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMembersStore } from '../members'
import type { Member, MemberFormData } from '@/types/member'

// Mock API
const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn()
}

vi.mock('@/services/api', () => ({
  api: mockApi
}))

// Mock offline service
const mockOfflineService = {
  initialize: vi.fn(),
  getMembers: vi.fn(),
  saveMembers: vi.fn(),
  saveMemberOffline: vi.fn(),
  updateMemberOffline: vi.fn(),
  deleteMemberOffline: vi.fn()
}

vi.mock('@/services/offline', () => ({
  offlineService: mockOfflineService
}))

// Mock sync service
const mockSyncService = {
  syncMembers: vi.fn(),
  setupAutoSync: vi.fn(),
  registerBackgroundSync: vi.fn(),
  getSyncStatus: vi.fn()
}

vi.mock('@/services/sync', () => ({
  syncService: mockSyncService
}))

// Mock auth store
const mockAuthStore = {
  user: {
    organization_id: 1
  }
}

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => mockAuthStore
}))

describe('Members Store', () => {
  let membersStore: ReturnType<typeof useMembersStore>

  const mockMember: Member = {
    id: 1,
    organization_id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    date_of_birth: '1990-01-15',
    gender: 'male',
    address: '123 Main St',
    member_type: 'adult',
    join_date: '2023-01-01',
    is_active: true,
    notes: 'Test member',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }

  const mockMembersResponse = {
    data: {
      success: true,
      data: {
        data: [mockMember],
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 1,
        from: 1,
        to: 1
      },
      message: 'Members retrieved successfully'
    }
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    membersStore = useMembersStore()
    vi.clearAllMocks()
    
    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('fetchMembers', () => {
    it('should fetch members successfully when online', async () => {
      mockApi.get.mockResolvedValue(mockMembersResponse)
      mockOfflineService.saveMembers.mockResolvedValue(undefined)

      await membersStore.fetchMembers()

      expect(mockApi.get).toHaveBeenCalledWith('/members?')
      expect(mockOfflineService.saveMembers).toHaveBeenCalledWith([mockMember], 1)
      expect(membersStore.members).toEqual([mockMember])
      expect(membersStore.pagination.total).toBe(1)
      expect(membersStore.loading).toBe(false)
      expect(membersStore.error).toBe(null)
    })

    it('should fallback to offline data when online request fails', async () => {
      mockApi.get.mockRejectedValue(new Error('Network error'))
      mockOfflineService.getMembers.mockResolvedValue([mockMember])

      await membersStore.fetchMembers()

      expect(mockApi.get).toHaveBeenCalled()
      expect(mockOfflineService.getMembers).toHaveBeenCalledWith(1)
      expect(membersStore.members).toEqual([mockMember])
    })

    it('should use offline data when offline', async () => {
      Object.defineProperty(navigator, 'onLine', { value: false })
      mockOfflineService.getMembers.mockResolvedValue([mockMember])

      await membersStore.fetchMembers()

      expect(mockApi.get).not.toHaveBeenCalled()
      expect(mockOfflineService.getMembers).toHaveBeenCalledWith(1)
      expect(membersStore.members).toEqual([mockMember])
    })

    it('should apply search filters to offline data', async () => {
      Object.defineProperty(navigator, 'onLine', { value: false })
      const members = [
        { ...mockMember, first_name: 'John', last_name: 'Doe' },
        { ...mockMember, id: 2, first_name: 'Jane', last_name: 'Smith' }
      ]
      mockOfflineService.getMembers.mockResolvedValue(members)

      await membersStore.fetchMembers({ search: 'John' })

      expect(membersStore.members).toHaveLength(1)
      expect(membersStore.members[0].first_name).toBe('John')
    })

    it('should handle errors gracefully', async () => {
      const error = new Error('Failed to fetch')
      mockApi.get.mockRejectedValue(error)
      mockOfflineService.getMembers.mockRejectedValue(error)

      await membersStore.fetchMembers()

      expect(membersStore.error).toBe('Failed to fetch')
      expect(membersStore.loading).toBe(false)
    })
  })

  describe('createMember', () => {
    const memberData: MemberFormData = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      member_type: 'adult'
    }

    it('should create member successfully when online', async () => {
      const response = {
        data: {
          success: true,
          data: mockMember,
          message: 'Member created'
        }
      }
      mockApi.post.mockResolvedValue(response)
      mockOfflineService.saveMembers.mockResolvedValue(undefined)

      const result = await membersStore.createMember(memberData)

      expect(mockApi.post).toHaveBeenCalledWith('/members', memberData)
      expect(mockOfflineService.saveMembers).toHaveBeenCalledWith([mockMember], 1)
      expect(result).toEqual(mockMember)
      expect(membersStore.members[0]).toEqual(mockMember)
      expect(membersStore.pagination.total).toBe(1)
    })

    it('should create member offline when network fails', async () => {
      mockApi.post.mockRejectedValue(new Error('Network error'))
      mockOfflineService.saveMemberOffline.mockResolvedValue(mockMember)

      const result = await membersStore.createMember(memberData)

      expect(mockOfflineService.saveMemberOffline).toHaveBeenCalledWith(memberData, 1)
      expect(result).toEqual(mockMember)
      expect(membersStore.members[0]).toEqual(mockMember)
    })

    it('should handle duplicate member error', async () => {
      const duplicateError = {
        response: {
          status: 409,
          data: {
            success: false,
            message: 'Duplicate member found'
          }
        }
      }
      mockApi.post.mockRejectedValue(duplicateError)

      await expect(membersStore.createMember(memberData)).rejects.toThrow('Duplicate member found')
    })
  })

  describe('updateMember', () => {
    const updateData = { first_name: 'Jane' }

    it('should update member successfully when online', async () => {
      const updatedMember = { ...mockMember, first_name: 'Jane' }
      const response = {
        data: {
          success: true,
          data: updatedMember,
          message: 'Member updated'
        }
      }
      mockApi.put.mockResolvedValue(response)
      membersStore.members = [mockMember]
      membersStore.currentMember = mockMember

      const result = await membersStore.updateMember(1, updateData)

      expect(mockApi.put).toHaveBeenCalledWith('/members/1', updateData)
      expect(result).toEqual(updatedMember)
      expect(membersStore.members[0]).toEqual(updatedMember)
      expect(membersStore.currentMember).toEqual(updatedMember)
    })

    it('should update member offline when network fails', async () => {
      const updatedMember = { ...mockMember, first_name: 'Jane' }
      mockApi.put.mockRejectedValue(new Error('Network error'))
      mockOfflineService.updateMemberOffline.mockResolvedValue(updatedMember)
      membersStore.members = [mockMember]

      const result = await membersStore.updateMember(1, updateData)

      expect(mockOfflineService.updateMemberOffline).toHaveBeenCalledWith(1, updateData)
      expect(result).toEqual(updatedMember)
      expect(membersStore.members[0]).toEqual(updatedMember)
    })
  })

  describe('deleteMember', () => {
    it('should delete member successfully when online', async () => {
      const response = {
        data: {
          success: true,
          message: 'Member deleted'
        }
      }
      mockApi.delete.mockResolvedValue(response)
      membersStore.members = [mockMember]
      membersStore.currentMember = mockMember
      membersStore.pagination.total = 1

      const result = await membersStore.deleteMember(1)

      expect(mockApi.delete).toHaveBeenCalledWith('/members/1')
      expect(result).toBe(true)
      expect(membersStore.members).toHaveLength(0)
      expect(membersStore.currentMember).toBe(null)
      expect(membersStore.pagination.total).toBe(0)
    })

    it('should delete member offline when network fails', async () => {
      mockApi.delete.mockRejectedValue(new Error('Network error'))
      mockOfflineService.deleteMemberOffline.mockResolvedValue(undefined)
      membersStore.members = [mockMember]
      membersStore.pagination.total = 1

      const result = await membersStore.deleteMember(1)

      expect(mockOfflineService.deleteMemberOffline).toHaveBeenCalledWith(1)
      expect(result).toBe(true)
      expect(membersStore.members).toHaveLength(0)
      expect(membersStore.pagination.total).toBe(0)
    })
  })

  describe('sync functionality', () => {
    it('should initialize offline functionality', async () => {
      mockOfflineService.initialize.mockResolvedValue(undefined)
      mockSyncService.setupAutoSync.mockResolvedValue(undefined)
      mockSyncService.registerBackgroundSync.mockResolvedValue(undefined)

      await membersStore.initializeOffline()

      expect(mockOfflineService.initialize).toHaveBeenCalled()
      expect(mockSyncService.setupAutoSync).toHaveBeenCalled()
      expect(mockSyncService.registerBackgroundSync).toHaveBeenCalled()
    })

    it('should sync members successfully', async () => {
      const syncResult = { success: true, synced: 5, failed: 0, errors: [] }
      mockSyncService.syncMembers.mockResolvedValue(syncResult)
      mockApi.get.mockResolvedValue(mockMembersResponse)
      mockOfflineService.saveMembers.mockResolvedValue(undefined)

      const result = await membersStore.syncMembers()

      expect(mockSyncService.syncMembers).toHaveBeenCalled()
      expect(result).toEqual(syncResult)
      // Should refresh members after successful sync
      expect(mockApi.get).toHaveBeenCalled()
    })

    it('should get sync status', () => {
      const syncStatus = { isSyncing: false, lastSync: Date.now() }
      mockSyncService.getSyncStatus.mockReturnValue(syncStatus)

      const result = membersStore.getSyncStatus()

      expect(mockSyncService.getSyncStatus).toHaveBeenCalled()
      expect(result).toEqual(syncStatus)
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      membersStore.members = [
        { ...mockMember, id: 1, is_active: true, member_type: 'adult' },
        { ...mockMember, id: 2, is_active: false, member_type: 'child' },
        { ...mockMember, id: 3, is_active: true, member_type: 'adult' }
      ]
    })

    it('should get member by id', () => {
      const member = membersStore.getMemberById(2)
      expect(member?.id).toBe(2)
    })

    it('should count active members', () => {
      expect(membersStore.activeMembersCount).toBe(2)
    })

    it('should group members by type', () => {
      const membersByType = membersStore.membersByType
      expect(membersByType.adult).toHaveLength(2)
      expect(membersByType.child).toHaveLength(1)
    })
  })
})
