import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAttributesStore } from '../attributes'
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

describe('Attributes Store', () => {
  let attributesStore: ReturnType<typeof useAttributesStore>

  const mockAttribute = {
    id: 1,
    organization_id: 1,
    key: 'emergency_contact',
    name: 'Emergency Contact',
    field_type: 'text',
    category: 'Personal',
    field_options: null,
    is_required: true,
    display_order: 1,
    is_active: true,
    created_at: '2024-01-01T00:00:00.000000Z',
    updated_at: '2024-01-01T00:00:00.000000Z'
  }

  const mockAttributeValue = {
    id: 1,
    member_id: 1,
    attribute_id: 1,
    value: 'John Doe - 555-1234',
    created_at: '2024-01-01T00:00:00.000000Z',
    updated_at: '2024-01-01T00:00:00.000000Z',
    attribute: mockAttribute
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    attributesStore = useAttributesStore()
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with empty state', () => {
      expect(attributesStore.attributes).toEqual([])
      expect(attributesStore.categories).toEqual({})
      expect(attributesStore.fieldTypes).toEqual({})
      expect(attributesStore.loading).toBe(false)
      expect(attributesStore.error).toBeNull()
    })
  })

  describe('Computed Properties', () => {
    it('should compute active attributes correctly', () => {
      attributesStore.attributes = [
        { ...mockAttribute, is_active: true },
        { ...mockAttribute, id: 2, is_active: false }
      ]

      expect(attributesStore.activeAttributes).toHaveLength(1)
      expect(attributesStore.activeAttributes[0].is_active).toBe(true)
    })

    it('should group attributes by category', () => {
      attributesStore.attributes = [
        { ...mockAttribute, category: 'Personal' },
        { ...mockAttribute, id: 2, category: 'Contact', name: 'Phone' },
        { ...mockAttribute, id: 3, category: 'Personal', name: 'Address' }
      ]

      const grouped = attributesStore.attributesByCategory
      expect(grouped.Personal).toHaveLength(2)
      expect(grouped.Contact).toHaveLength(1)
    })

    it('should find attribute by ID', () => {
      attributesStore.attributes = [mockAttribute]
      
      const found = attributesStore.getAttributeById(1)
      expect(found).toEqual(mockAttribute)
      
      const notFound = attributesStore.getAttributeById(999)
      expect(notFound).toBeUndefined()
    })

    it('should find attribute by key', () => {
      attributesStore.attributes = [mockAttribute]
      
      const found = attributesStore.getAttributeByKey('emergency_contact')
      expect(found).toEqual(mockAttribute)
      
      const notFound = attributesStore.getAttributeByKey('nonexistent')
      expect(notFound).toBeUndefined()
    })
  })

  describe('Attribute CRUD Operations', () => {
    it('should handle fetch attributes success', async () => {
      const mockResponse = { data: { data: [mockAttribute] } }
      vi.mocked(api.get).mockResolvedValue(mockResponse)

      await attributesStore.fetchAttributes()

      expect(api.get).toHaveBeenCalledWith('/member-attributes', { params: undefined })
      expect(attributesStore.attributes).toEqual([mockAttribute])
      expect(attributesStore.loading).toBe(false)
      expect(attributesStore.error).toBeNull()
    })

    it('should handle fetch attributes error', async () => {
      const errorMessage = 'Failed to fetch attributes'
      vi.mocked(api.get).mockRejectedValue(new Error(errorMessage))

      await expect(attributesStore.fetchAttributes()).rejects.toThrow()
      expect(attributesStore.error).toBe(errorMessage)
      expect(attributesStore.loading).toBe(false)
    })

    it('should handle create attribute success', async () => {
      const newAttributeData = {
        key: 'phone_number',
        name: 'Phone Number',
        field_type: 'phone' as const,
        category: 'Contact',
        is_required: false,
        display_order: 2,
        is_active: true
      }
      const newAttribute = { ...mockAttribute, id: 2, ...newAttributeData }
      const mockResponse = { data: { data: newAttribute } }
      vi.mocked(api.post).mockResolvedValue(mockResponse)

      const result = await attributesStore.createAttribute(newAttributeData)

      expect(api.post).toHaveBeenCalledWith('/member-attributes', newAttributeData)
      expect(result).toEqual(newAttribute)
      expect(attributesStore.attributes).toHaveLength(1)
      expect(attributesStore.attributes[0]).toEqual(newAttribute)
    })

    it('should handle update attribute success', async () => {
      attributesStore.attributes = [mockAttribute]
      const updateData = { name: 'Updated Emergency Contact' }
      const updatedAttribute = { ...mockAttribute, ...updateData }
      const mockResponse = { data: { data: updatedAttribute } }
      vi.mocked(api.put).mockResolvedValue(mockResponse)

      const result = await attributesStore.updateAttribute(1, updateData)

      expect(api.put).toHaveBeenCalledWith('/member-attributes/1', updateData)
      expect(result).toEqual(updatedAttribute)
      expect(attributesStore.attributes[0]).toEqual(updatedAttribute)
    })

    it('should handle delete attribute success', async () => {
      attributesStore.attributes = [mockAttribute]
      vi.mocked(api.delete).mockResolvedValue({ data: { message: 'Deleted' } })

      await attributesStore.deleteAttribute(1)

      expect(api.delete).toHaveBeenCalledWith('/member-attributes/1')
      expect(attributesStore.attributes).toHaveLength(0)
    })
  })

  describe('Member Attribute Values', () => {
    it('should handle fetch member attributes success', async () => {
      const mockResponse = { data: { data: [mockAttributeValue] } }
      vi.mocked(api.get).mockResolvedValue(mockResponse)

      const result = await attributesStore.fetchMemberAttributes(1)

      expect(api.get).toHaveBeenCalledWith('/members/1/attributes')
      expect(result).toEqual([mockAttributeValue])
    })

    it('should handle update member attributes success', async () => {
      const attributeValues = { emergency_contact: 'Jane Doe - 555-5678' }
      const mockResponse = { data: { data: [mockAttributeValue] } }
      vi.mocked(api.put).mockResolvedValue(mockResponse)

      const result = await attributesStore.updateMemberAttributes(1, attributeValues)

      expect(api.put).toHaveBeenCalledWith('/members/1/attributes', { attributes: attributeValues })
      expect(result).toEqual(mockResponse.data.data)
    })

    it('should handle bulk update member attributes success', async () => {
      const memberIds = [1, 2, 3]
      const attributeValues = { emergency_contact: 'Bulk Update Value' }
      const mockResponse = { data: { message: 'Success' } }
      vi.mocked(api.post).mockResolvedValue(mockResponse)

      const result = await attributesStore.bulkUpdateMemberAttributes(memberIds, attributeValues)

      expect(api.post).toHaveBeenCalledWith('/member-attributes/bulk-update', {
        member_ids: memberIds,
        attributes: attributeValues
      })
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('Field Type Validation', () => {
    it('should validate text field correctly', () => {
      const textAttribute = { ...mockAttribute, field_type: 'text' as const }

      expect(attributesStore.validateAttributeValue(textAttribute, 'Valid text')).toBeNull()
      expect(attributesStore.validateAttributeValue(textAttribute, '')).toBe('Emergency Contact is required')
      expect(attributesStore.validateAttributeValue({ ...textAttribute, is_required: false }, '')).toBeNull()
    })

    it('should validate number field correctly', () => {
      const numberAttribute = { ...mockAttribute, field_type: 'number' as const }

      expect(attributesStore.validateAttributeValue(numberAttribute, '123')).toBeNull()
      expect(attributesStore.validateAttributeValue(numberAttribute, '123.45')).toBeNull()
      expect(attributesStore.validateAttributeValue(numberAttribute, 'not a number')).toBe('Emergency Contact must be a number')
    })

    it('should validate email field correctly', () => {
      const emailAttribute = { ...mockAttribute, field_type: 'email' as const }

      expect(attributesStore.validateAttributeValue(emailAttribute, 'test@example.com')).toBeNull()
      expect(attributesStore.validateAttributeValue(emailAttribute, 'invalid-email')).toBe('Emergency Contact must be a valid email address')
    })

    it('should validate phone field correctly', () => {
      const phoneAttribute = { ...mockAttribute, field_type: 'phone' as const }

      expect(attributesStore.validateAttributeValue(phoneAttribute, '+15551234567')).toBeNull()
      expect(attributesStore.validateAttributeValue(phoneAttribute, '5551234567')).toBeNull()
      expect(attributesStore.validateAttributeValue(phoneAttribute, 'not a phone')).toBe('Emergency Contact must be a valid phone number')
    })

    it('should validate date field correctly', () => {
      const dateAttribute = { ...mockAttribute, field_type: 'date' as const }

      expect(attributesStore.validateAttributeValue(dateAttribute, '2024-01-01')).toBeNull()
      expect(attributesStore.validateAttributeValue(dateAttribute, 'invalid-date')).toBe('Emergency Contact must be a valid date')
    })

    it('should validate boolean field correctly', () => {
      const booleanAttribute = { ...mockAttribute, field_type: 'boolean' as const }

      expect(attributesStore.validateAttributeValue(booleanAttribute, true)).toBeNull()
      expect(attributesStore.validateAttributeValue(booleanAttribute, false)).toBeNull()
      expect(attributesStore.validateAttributeValue(booleanAttribute, 'not boolean')).toBe('Emergency Contact must be true or false')
    })

    it('should validate select field correctly', () => {
      const selectAttribute = {
        ...mockAttribute,
        field_type: 'select' as const,
        field_options: { options: ['Option 1', 'Option 2', 'Option 3'] }
      }

      expect(attributesStore.validateAttributeValue(selectAttribute, 'Option 1')).toBeNull()
      expect(attributesStore.validateAttributeValue(selectAttribute, 'Invalid Option')).toBe('Emergency Contact must be one of the available options')
    })

    it('should validate multi-select field correctly', () => {
      const multiSelectAttribute = {
        ...mockAttribute,
        field_type: 'multi-select' as const,
        field_options: { options: ['Option 1', 'Option 2', 'Option 3'] }
      }

      expect(attributesStore.validateAttributeValue(multiSelectAttribute, ['Option 1', 'Option 2'])).toBeNull()
      expect(attributesStore.validateAttributeValue(multiSelectAttribute, ['Invalid Option'])).toBe('Emergency Contact contains invalid options: Invalid Option')
      expect(attributesStore.validateAttributeValue(multiSelectAttribute, 'not an array')).toBe('Emergency Contact must be an array')
    })
  })

  describe('Utility Functions', () => {
    it('should clear error when calling clearError', () => {
      attributesStore.error = 'Some error'
      attributesStore.clearError()
      expect(attributesStore.error).toBeNull()
    })

    it('should reset store when calling resetStore', () => {
      attributesStore.attributes = [mockAttribute]
      attributesStore.categories = { Personal: 'Personal Info' }
      attributesStore.error = 'Some error'

      attributesStore.resetStore()

      expect(attributesStore.attributes).toEqual([])
      expect(attributesStore.categories).toEqual({})
      expect(attributesStore.error).toBeNull()
    })

    it('should format field value for display', () => {
      // Test different field types
      expect(attributesStore.getDisplayValue({ field_type: 'boolean' } as any, true)).toBe('Yes')
      expect(attributesStore.getDisplayValue({ field_type: 'boolean' } as any, false)).toBe('No')
      expect(attributesStore.getDisplayValue({ field_type: 'multi-select' } as any, ['A', 'B'])).toBe('A, B')
      expect(attributesStore.getDisplayValue({ field_type: 'text' } as any, 'Simple text')).toBe('Simple text')
    })

    it('should validate member attributes', () => {
      attributesStore.attributes = [mockAttribute]
      const attributeValues = {
        emergency_contact: '', // Required field left empty
        phone_number: 'valid value'
      }

      const errors = attributesStore.validateMemberAttributes(attributeValues)
      expect(errors).toHaveProperty('emergency_contact')
      expect(errors.emergency_contact).toBe('Emergency Contact is required')
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const errorResponse = {
        response: {
          data: {
            message: 'Validation failed',
            errors: { name: ['Name is required'] }
          }
        }
      }
      vi.mocked(api.post).mockRejectedValue(errorResponse)

      await expect(attributesStore.createAttribute({})).rejects.toThrow()
      expect(attributesStore.error).toBe('Validation failed')
    })

    it('should handle network errors', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('Network Error'))

      await expect(attributesStore.fetchAttributes()).rejects.toThrow()
      expect(attributesStore.error).toBe('Failed to fetch attributes')
    })
  })
})
