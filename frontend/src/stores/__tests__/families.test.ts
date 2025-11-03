import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFamiliesStore } from '../families'
import { api } from '@/services/api'

// Mock the API
vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

describe('Families Store', () => {
  let familiesStore: ReturnType<typeof useFamiliesStore>

  const mockFamily = {
    id: 1,
    organization_id: 1,
    family_name: 'Smith Family',
    head_of_family_id: 1,
    address: '123 Main St',
    city: 'Lagos',
    state: 'Lagos State',
    postal_code: '100001',
    country: 'Nigeria',
    home_phone: '+234-123-456-7890',
    email: 'smith.family@example.com',
    anniversary_date: '2020-06-15',
    notes: 'Active church family',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    head_of_family: {
      id: 1,
      first_name: 'John',
      last_name: 'Smith'
    },
    members: [],
    member_count: 3
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    familiesStore = useFamiliesStore()
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with empty state', () => {
      expect(familiesStore.families).toEqual([])
      expect(familiesStore.loading).toBe(false)
      expect(familiesStore.error).toBeNull()
    })
  })

  describe('Computed Properties', () => {
    beforeEach(() => {
      familiesStore.families = [
        mockFamily,
        { ...mockFamily, id: 2, family_name: 'Johnson Family', is_active: false },
        { ...mockFamily, id: 3, family_name: 'Brown Family', city: 'Abuja' }
      ]
    })

    it('should compute active families correctly', () => {
      expect(familiesStore.activeFamilies).toHaveLength(2)
      expect(familiesStore.activeFamilies.every(f => f.is_active)).toBe(true)
    })

    it('should group families by city', () => {
      const grouped = familiesStore.familiesByCity
      expect(grouped).toHaveProperty('Lagos')
      expect(grouped).toHaveProperty('Abuja')
      expect(grouped.Lagos).toHaveLength(1)
      expect(grouped.Abuja).toHaveLength(1)
    })

    it('should find family by ID', () => {
      const family = familiesStore.getFamilyById(1)
      expect(family).toEqual(mockFamily)
    })

    it('should find family by name', () => {
      const family = familiesStore.getFamilyByName('Smith Family')
      expect(family).toEqual(mockFamily)
    })
  })

  describe('Family CRUD Operations', () => {
    it('should handle fetch families success', async () => {
      const mockResponse = { data: { data: [mockFamily] } }
      vi.mocked(api.get).mockResolvedValue(mockResponse)

      await familiesStore.fetchFamilies()

      expect(api.get).toHaveBeenCalledWith('/families', { params: undefined })
      expect(familiesStore.families).toEqual([mockFamily])
      expect(familiesStore.loading).toBe(false)
      expect(familiesStore.error).toBeNull()
    })

    it('should handle fetch families error', async () => {
      const errorResponse = { response: { data: { message: 'Server error' } } }
      vi.mocked(api.get).mockRejectedValue(errorResponse)

      await expect(familiesStore.fetchFamilies()).rejects.toThrow()
      expect(familiesStore.error).toBe('Server error')
    })

    it('should handle create family success', async () => {
      const newFamilyData = {
        family_name: 'New Family',
        head_of_family_id: 2,
        address: '456 Oak St',
        city: 'Abuja'
      }
      const newFamily = { ...mockFamily, id: 2, ...newFamilyData }
      const mockResponse = { data: { data: newFamily } }
      vi.mocked(api.post).mockResolvedValue(mockResponse)

      const result = await familiesStore.createFamily(newFamilyData)

      expect(api.post).toHaveBeenCalledWith('/families', newFamilyData)
      expect(result).toEqual(newFamily)
      expect(familiesStore.families).toHaveLength(1)
      expect(familiesStore.families[0]).toEqual(newFamily)
    })

    it('should handle update family success', async () => {
      familiesStore.families = [mockFamily]
      const updateData = { family_name: 'Updated Smith Family' }
      const updatedFamily = { ...mockFamily, ...updateData }
      const mockResponse = { data: { data: updatedFamily } }
      vi.mocked(api.put).mockResolvedValue(mockResponse)

      const result = await familiesStore.updateFamily(1, updateData)

      expect(api.put).toHaveBeenCalledWith('/families/1', updateData)
      expect(result).toEqual(updatedFamily)
      expect(familiesStore.families[0]).toEqual(updatedFamily)
    })

    it('should handle delete family success', async () => {
      familiesStore.families = [mockFamily]
      vi.mocked(api.delete).mockResolvedValue({})

      await familiesStore.deleteFamily(1)

      expect(api.delete).toHaveBeenCalledWith('/families/1')
      expect(familiesStore.families).toHaveLength(0)
    })
  })

  describe('Family Member Operations', () => {
    it('should handle get family members success', async () => {
      const mockMembers = [
        { id: 1, first_name: 'John', last_name: 'Smith' },
        { id: 2, first_name: 'Jane', last_name: 'Smith' }
      ]
      const mockResponse = { data: { data: mockMembers } }
      vi.mocked(api.get).mockResolvedValue(mockResponse)

      const result = await familiesStore.getFamilyMembers(1)

      expect(api.get).toHaveBeenCalledWith('/families/1/members')
      expect(result).toEqual(mockMembers)
    })

    it('should handle add member to family success', async () => {
      familiesStore.families = [{ ...mockFamily }] // Create a copy to avoid mutation
      const mockResponse = { data: { data: { success: true } } }
      vi.mocked(api.post).mockResolvedValue(mockResponse)

      const result = await familiesStore.addMemberToFamily(1, 2)

      expect(api.post).toHaveBeenCalledWith('/families/1/members', { member_id: 2 })
      expect(result).toEqual({ success: true })
      expect(familiesStore.families[0].member_count).toBe(4) // 3 + 1
    })

    it('should handle remove member from family success', async () => {
      familiesStore.families = [{ ...mockFamily }] // Create a copy to avoid mutation
      vi.mocked(api.delete).mockResolvedValue({})

      await familiesStore.removeMemberFromFamily(1, 2)

      expect(api.delete).toHaveBeenCalledWith('/families/1/members/2')
      expect(familiesStore.families[0].member_count).toBe(2) // 3 - 1
    })
  })

  describe('Utility Functions', () => {
    it('should clear error when calling clearError', () => {
      familiesStore.error = 'Some error'
      familiesStore.clearError()
      expect(familiesStore.error).toBeNull()
    })

    it('should reset store when calling resetStore', () => {
      familiesStore.families = [mockFamily]
      familiesStore.error = 'Some error'
      
      familiesStore.resetStore()
      
      expect(familiesStore.families).toEqual([])
      expect(familiesStore.error).toBeNull()
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const errorResponse = { response: { data: { message: 'API Error' } } }
      vi.mocked(api.get).mockRejectedValue(errorResponse)

      await expect(familiesStore.fetchFamilies()).rejects.toThrow()
      expect(familiesStore.error).toBe('API Error')
    })

    it('should handle network errors', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('Network Error'))

      await expect(familiesStore.fetchFamilies()).rejects.toThrow()
      expect(familiesStore.error).toBe('Failed to fetch families')
    })
  })
})
