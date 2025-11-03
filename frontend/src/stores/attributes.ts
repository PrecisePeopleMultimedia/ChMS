import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export interface MemberAttribute {
  id: number
  organization_id: number
  key: string
  name: string
  field_type: 'text' | 'textarea' | 'number' | 'date' | 'boolean' | 'select' | 'multi-select' | 'email' | 'phone'
  category: string
  field_options?: {
    options?: string[]
    min?: number
    max?: number
    placeholder?: string
  }
  is_required: boolean
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MemberAttributeValue {
  id: number
  member_id: number
  attribute_id: number
  value: any
  formatted_value: any
  display_value: string
  attribute: MemberAttribute
  created_at: string
  updated_at: string
}

export interface AttributeFormData {
  key: string
  name: string
  field_type: 'text' | 'textarea' | 'number' | 'date' | 'boolean' | 'select' | 'multi-select' | 'email' | 'phone'
  category: string
  field_options?: {
    options?: string[]
    min?: number
    max?: number
    placeholder?: string
  }
  is_required: boolean
  display_order: number
  is_active: boolean
}

// Field type definitions
export const FIELD_TYPES = {
  'text': 'Text',
  'textarea': 'Textarea',
  'number': 'Number',
  'date': 'Date',
  'boolean': 'Boolean',
  'select': 'Select',
  'multi-select': 'Multi-Select',
  'email': 'Email',
  'phone': 'Phone'
} as const

export const CATEGORIES = {
  'Personal': 'Personal Information',
  'Contact': 'Contact Details',
  'Ministry': 'Ministry Information',
  'Family': 'Family Details',
  'Medical': 'Medical Information',
  'Emergency': 'Emergency Contacts',
  'Custom': 'Custom Fields'
} as const

export const useAttributesStore = defineStore('attributes', () => {
  // State
  const attributes = ref<MemberAttribute[]>([])
  const categories = ref<Record<string, string>>({})
  const fieldTypes = ref<Record<string, string>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const activeAttributes = computed(() => 
    attributes.value.filter(attr => attr.is_active)
  )

  const attributesByCategory = computed(() => {
    const grouped: Record<string, MemberAttribute[]> = {}
    
    activeAttributes.value.forEach(attr => {
      if (!grouped[attr.category]) {
        grouped[attr.category] = []
      }
      grouped[attr.category]?.push(attr)
    })

    // Sort attributes within each category by display_order
    Object.keys(grouped).forEach(category => {
      grouped[category]?.sort((a, b) => a.display_order - b.display_order)
    })

    return grouped
  })

  const getAttributeByKey = computed(() => (key: string) => 
    attributes.value.find(attr => attr.key === key)
  )

  const getAttributeById = computed(() => (id: number) =>
    attributes.value.find(attr => attr.id === id)
  )

  // Validation and formatting functions
  const validateAttributeValue = (attribute: MemberAttribute, value: any): string | null => {
    // Handle required validation
    if (attribute.is_required && (value === null || value === undefined || value === '')) {
      return `${attribute.name} is required`
    }

    // Skip validation for empty optional fields
    if (!attribute.is_required && (value === null || value === undefined || value === '')) {
      return null
    }

    // Type-specific validation
    switch (attribute.field_type) {
      case 'text':
        if (typeof value !== 'string') return `${attribute.name} must be text`
        if (value.length > 255) return `${attribute.name} must be less than 255 characters`
        break

      case 'textarea':
        if (typeof value !== 'string') return `${attribute.name} must be text`
        if (value.length > 65535) return `${attribute.name} is too long`
        break

      case 'number':
        if (isNaN(Number(value))) return `${attribute.name} must be a number`
        const num = Number(value)
        if (attribute.field_options?.min !== undefined && num < attribute.field_options.min) {
          return `${attribute.name} must be at least ${attribute.field_options.min}`
        }
        if (attribute.field_options?.max !== undefined && num > attribute.field_options.max) {
          return `${attribute.name} must be at most ${attribute.field_options.max}`
        }
        break

      case 'date':
        if (!isValidDate(value)) return `${attribute.name} must be a valid date`
        break

      case 'boolean':
        if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
          return `${attribute.name} must be true or false`
        }
        break

      case 'select':
        if (!attribute.field_options?.options?.includes(value)) {
          return `${attribute.name} must be one of the available options`
        }
        break

      case 'multi-select':
        if (!Array.isArray(value)) return `${attribute.name} must be an array`
        const invalidOptions = value.filter(v => !attribute.field_options?.options?.includes(v))
        if (invalidOptions.length > 0) {
          return `${attribute.name} contains invalid options: ${invalidOptions.join(', ')}`
        }
        break

      case 'email':
        if (!isValidEmail(value)) return `${attribute.name} must be a valid email address`
        break

      case 'phone':
        if (!isValidPhone(value)) return `${attribute.name} must be a valid phone number`
        break
    }

    return null
  }

  const formatAttributeValue = (attribute: MemberAttribute, value: any): any => {
    if (value === null || value === undefined || value === '') {
      return null
    }

    switch (attribute.field_type) {
      case 'boolean':
        return Boolean(value)
      case 'number':
        return Number(value)
      case 'date':
        return formatDate(value)
      case 'multi-select':
        return Array.isArray(value) ? value : [value]
      default:
        return String(value)
    }
  }

  const getDisplayValue = (attribute: MemberAttribute, value: any): string => {
    if (value === null || value === undefined || value === '') {
      return ''
    }

    switch (attribute.field_type) {
      case 'boolean':
        return value ? 'Yes' : 'No'
      case 'date':
        return formatDisplayDate(value)
      case 'multi-select':
        if (Array.isArray(value)) {
          return value.join(', ')
        }
        if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value)
            return Array.isArray(parsed) ? parsed.join(', ') : String(value)
          } catch {
            return String(value)
          }
        }
        return String(value)
      default:
        return String(value)
    }
  }

  // Helper functions
  const isValidDate = (value: any): boolean => {
    if (!value) return false
    const date = new Date(value)
    return date instanceof Date && !isNaN(date.getTime())
  }

  const isValidEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }

  const isValidPhone = (value: string): boolean => {
    // Basic phone validation - can be enhanced based on requirements
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))
  }

  const formatDate = (value: any): string => {
    if (!value) return ''
    const date = new Date(value)
    return date.toISOString().split('T')[0] // YYYY-MM-DD format
  }

  const formatDisplayDate = (value: any): string => {
    if (!value) return ''
    const date = new Date(value)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Actions
  const fetchAttributes = async (params?: {
    category?: string
    active_only?: boolean
    search?: string
  }) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/member-attributes', { params })
      
      attributes.value = response.data.data || []
      categories.value = response.data.categories || {}
      fieldTypes.value = response.data.field_types || {}
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch attributes'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createAttribute = async (attributeData: AttributeFormData) => {
    try {
      const response = await api.post('/member-attributes', attributeData)
      
      // Add the new attribute to the store
      attributes.value.push(response.data.data)
      
      // Sort by display_order
      attributes.value.sort((a, b) => a.display_order - b.display_order)
      
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create attribute'
      throw err
    }
  }

  const updateAttribute = async (id: number, attributeData: Partial<AttributeFormData>) => {
    try {
      const response = await api.put(`/member-attributes/${id}`, attributeData)
      
      // Update the attribute in the store
      const index = attributes.value.findIndex(attr => attr.id === id)
      if (index !== -1) {
        attributes.value[index] = response.data.data
      }
      
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update attribute'
      throw err
    }
  }

  const deleteAttribute = async (id: number) => {
    try {
      await api.delete(`/member-attributes/${id}`)
      
      // Remove the attribute from the store
      const index = attributes.value.findIndex(attr => attr.id === id)
      if (index !== -1) {
        attributes.value.splice(index, 1)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete attribute'
      throw err
    }
  }

  const updateAttributeOrder = async (attributeUpdates: Array<{ id: number; display_order: number }>) => {
    try {
      await api.post('/member-attributes/update-order', {
        attributes: attributeUpdates
      })
      
      // Update the display_order in the store
      attributeUpdates.forEach(update => {
        const attribute = attributes.value.find(attr => attr.id === update.id)
        if (attribute) {
          attribute.display_order = update.display_order
        }
      })
      
      // Re-sort attributes
      attributes.value.sort((a, b) => a.display_order - b.display_order)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update attribute order'
      throw err
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/member-attributes-categories')
      categories.value = response.data.data || {}
      return categories.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch categories'
      throw err
    }
  }

  const fetchFieldTypes = async () => {
    try {
      const response = await api.get('/member-attributes-field-types')
      fieldTypes.value = response.data.data || {}
      return fieldTypes.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch field types'
      throw err
    }
  }

  const initializeAttributes = async () => {
    await Promise.all([
      fetchAttributes(),
      fetchCategories(),
      fetchFieldTypes()
    ])
  }

  const clearError = () => {
    error.value = null
  }

  const resetStore = () => {
    attributes.value = []
    categories.value = {}
    fieldTypes.value = {}
    loading.value = false
    error.value = null
  }

  // Member attribute value management
  const fetchMemberAttributes = async (memberId: number): Promise<MemberAttributeValue[]> => {
    try {
      const response = await api.get(`/members/${memberId}/attributes`)
      return response.data.data || []
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch member attributes'
      throw err
    }
  }

  const updateMemberAttributes = async (memberId: number, attributeValues: Record<string, any>) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/members/${memberId}/attributes`, {
        attributes: attributeValues
      })
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update member attributes'
      throw err
    } finally {
      loading.value = false
    }
  }

  const bulkUpdateMemberAttributes = async (memberIds: number[], attributeValues: Record<string, any>) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/member-attributes/bulk-update', {
        member_ids: memberIds,
        attributes: attributeValues
      })
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to bulk update member attributes'
      throw err
    } finally {
      loading.value = false
    }
  }

  const validateMemberAttributes = (attributeValues: Record<string, any>): Record<string, string> => {
    const errors: Record<string, string> = {}

    Object.entries(attributeValues).forEach(([key, value]) => {
      const attribute = getAttributeByKey.value(key)
      if (attribute) {
        const error = validateAttributeValue(attribute, value)
        if (error) {
          errors[key] = error
        }
      }
    })

    return errors
  }



  return {
    // State
    attributes,
    categories,
    fieldTypes,
    loading,
    error,

    // Getters
    activeAttributes,
    attributesByCategory,
    getAttributeByKey,
    getAttributeById,

    // Actions
    fetchAttributes,
    createAttribute,
    updateAttribute,
    deleteAttribute,
    updateAttributeOrder,
    fetchCategories,
    fetchFieldTypes,
    initializeAttributes,
    clearError,
    resetStore,

    // Member attribute values
    fetchMemberAttributes,
    updateMemberAttributes,
    bulkUpdateMemberAttributes,
    validateMemberAttributes,

    // Validation and formatting
    validateAttributeValue,
    formatAttributeValue,
    getDisplayValue
  }
})
