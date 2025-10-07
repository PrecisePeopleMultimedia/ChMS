import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export interface MemberAttribute {
  id: number
  organization_id: number
  key: string
  name: string
  field_type: string
  category: string
  field_options?: {
    options?: string[]
  }
  is_required: boolean
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AttributeFormData {
  key: string
  name: string
  field_type: string
  category: string
  field_options?: {
    options?: string[]
  }
  is_required: boolean
  display_order: number
  is_active: boolean
}

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
      grouped[attr.category].push(attr)
    })

    // Sort attributes within each category by display_order
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => a.display_order - b.display_order)
    })

    return grouped
  })

  const getAttributeByKey = computed(() => (key: string) => 
    attributes.value.find(attr => attr.key === key)
  )

  const getAttributeById = computed(() => (id: number) => 
    attributes.value.find(attr => attr.id === id)
  )

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

  // Validation helpers
  const validateAttributeValue = (attribute: MemberAttribute, value: any): string | null => {
    // Required validation
    if (attribute.is_required && (!value || value === '')) {
      return `${attribute.name} is required`
    }

    if (!value || value === '') {
      return null // Allow empty values for non-required fields
    }

    // Type-specific validation
    switch (attribute.field_type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address'
        }
        break

      case 'number':
        if (isNaN(Number(value))) {
          return 'Please enter a valid number'
        }
        break

      case 'date':
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (!dateRegex.test(value)) {
          return 'Please enter a valid date (YYYY-MM-DD)'
        }
        break

      case 'phone':
        const phoneRegex = /^[\d\s\-\+\(\)]+$/
        if (!phoneRegex.test(value)) {
          return 'Please enter a valid phone number'
        }
        break

      case 'select':
        if (attribute.field_options?.options && !attribute.field_options.options.includes(value)) {
          return 'Please select a valid option'
        }
        break
    }

    return null
  }

  const validateAttributeValues = (attributeValues: Record<string, any>): Record<string, string> => {
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

    // Validation
    validateAttributeValue,
    validateAttributeValues
  }
})
