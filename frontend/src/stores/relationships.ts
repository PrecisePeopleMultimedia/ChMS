import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export interface RelationshipType {
  id: number
  organization_id?: number
  name: string
  slug: string
  description?: string
  category: string
  is_family: boolean
  is_household: boolean
  is_legal: boolean
  display_order: number
  is_active: boolean
  reciprocal_type_id?: number
  reciprocal_type?: RelationshipType
}

export interface FamilyRelationship {
  id: number
  organization_id: number
  family_id: number
  person1_id: number
  person2_id: number
  relationship_type_id: number
  relationship_details?: any
  is_primary: boolean
  start_date?: string
  end_date?: string
  status: string
  custody_type?: string
  custody_notes?: string
  custody_start_date?: string
  custody_end_date?: string
  notes?: string
  created_at: string
  updated_at: string
  person1?: any
  person2?: any
  relationship_type?: RelationshipType
  family?: any
}

export interface RelationshipFilters {
  family_id?: number
  member_id?: number
  relationship_type_id?: number
  status?: string
  active_only?: boolean
}

export const useRelationshipsStore = defineStore('relationships', () => {
  // State
  const relationshipTypes = ref<RelationshipType[]>([])
  const relationships = ref<FamilyRelationship[]>([])
  const currentRelationship = ref<FamilyRelationship | null>(null)
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
  const activeRelationshipTypes = computed(() => 
    relationshipTypes.value.filter(type => type.is_active)
  )

  const familyTypes = computed(() => 
    activeRelationshipTypes.value.filter(type => type.is_family)
  )

  const householdTypes = computed(() => 
    activeRelationshipTypes.value.filter(type => type.is_household)
  )

  const legalTypes = computed(() => 
    activeRelationshipTypes.value.filter(type => type.is_legal)
  )

  const typesByCategory = computed(() => {
    const grouped: Record<string, RelationshipType[]> = {}
    
    activeRelationshipTypes.value.forEach(type => {
      if (!grouped[type.category]) {
        grouped[type.category] = []
      }
      grouped[type.category]?.push(type)
    })

    return grouped
  })

  const activeRelationships = computed(() => 
    relationships.value.filter(rel => rel.status === 'active')
  )

  // Actions
  const fetchRelationshipTypes = async (filters?: {
    category?: string
    family_only?: boolean
    household_only?: boolean
    legal_only?: boolean
  }) => {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()
      if (filters?.category) params.append('category', filters.category)
      if (filters?.family_only) params.append('family_only', '1')
      if (filters?.household_only) params.append('household_only', '1')
      if (filters?.legal_only) params.append('legal_only', '1')

      const response = await api.get(`/relationship-types?${params.toString()}`)
      relationshipTypes.value = response.data.data || []
      return relationshipTypes.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch relationship types'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchRelationships = async (filters?: RelationshipFilters) => {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()
      if (filters?.family_id) params.append('family_id', filters.family_id.toString())
      if (filters?.member_id) params.append('member_id', filters.member_id.toString())
      if (filters?.relationship_type_id) params.append('relationship_type_id', filters.relationship_type_id.toString())
      if (filters?.status) params.append('status', filters.status)
      if (filters?.active_only !== false) params.append('active_only', '1')

      const response = await api.get(`/family-relationships?${params.toString()}`)
      
      if (response.data.data?.data) {
        relationships.value = response.data.data.data
        pagination.value = {
          page: response.data.data.current_page || 1,
          per_page: response.data.data.per_page || 15,
          total: response.data.data.total || 0,
          last_page: response.data.data.last_page || 1
        }
      } else {
        relationships.value = response.data.data || []
      }

      return relationships.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch relationships'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchRelationship = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/family-relationships/${id}`)
      const relationship = response.data.data
      currentRelationship.value = relationship
      return relationship
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch relationship'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchMemberRelationships = async (memberId: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/members/${memberId}/relationships`)
      return response.data.data || []
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch member relationships'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createRelationship = async (relationshipData: Partial<FamilyRelationship>) => {
    saving.value = true
    error.value = null

    try {
      const response = await api.post('/family-relationships', relationshipData)
      const relationship = response.data.data
      relationships.value.unshift(relationship)
      return relationship
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create relationship'
      throw err
    } finally {
      saving.value = false
    }
  }

  const updateRelationship = async (id: number, relationshipData: Partial<FamilyRelationship>) => {
    saving.value = true
    error.value = null

    try {
      const response = await api.put(`/family-relationships/${id}`, relationshipData)
      const relationship = response.data.data
      const index = relationships.value.findIndex(r => r.id === id)
      if (index !== -1) {
        relationships.value[index] = relationship
      }
      if (currentRelationship.value?.id === id) {
        currentRelationship.value = relationship
      }
      return relationship
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update relationship'
      throw err
    } finally {
      saving.value = false
    }
  }

  const deleteRelationship = async (id: number) => {
    saving.value = true
    error.value = null

    try {
      await api.delete(`/family-relationships/${id}`)
      relationships.value = relationships.value.filter(r => r.id !== id)
      if (currentRelationship.value?.id === id) {
        currentRelationship.value = null
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete relationship'
      throw err
    } finally {
      saving.value = false
    }
  }

  const createRelationshipType = async (typeData: Partial<RelationshipType>) => {
    saving.value = true
    error.value = null

    try {
      const response = await api.post('/relationship-types', typeData)
      const type = response.data.data
      relationshipTypes.value.push(type)
      return type
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create relationship type'
      throw err
    } finally {
      saving.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    relationshipTypes,
    relationships,
    currentRelationship,
    loading,
    saving,
    error,
    pagination,
    // Getters
    activeRelationshipTypes,
    familyTypes,
    householdTypes,
    legalTypes,
    typesByCategory,
    activeRelationships,
    // Actions
    fetchRelationshipTypes,
    fetchRelationships,
    fetchRelationship,
    fetchMemberRelationships,
    createRelationship,
    updateRelationship,
    deleteRelationship,
    createRelationshipType,
    clearError
  }
})

