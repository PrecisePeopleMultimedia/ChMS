import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { Quasar } from 'quasar'
import HouseholdFamilyDistinction from '@/components/family/HouseholdFamilyDistinction.vue'

// Mock the stores
vi.mock('@/stores/relationships', () => ({
  useRelationshipsStore: () => ({
    familyRelationships: [],
    fetchMemberRelationships: vi.fn()
  })
}))

vi.mock('@/stores/households', () => ({
  useHouseholdsStore: () => ({
    memberHouseholds: [],
    fetchMemberHouseholds: vi.fn()
  })
}))

describe('HouseholdFamilyDistinction', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const createWrapper = (props = {}) => {
    return mount(HouseholdFamilyDistinction, {
      props: {
        memberId: 1,
        memberFamily: {
          id: 1,
          family_name: 'Smith Family',
          organization_id: 1
        },
        familyRelationships: [],
        memberHouseholds: [],
        ...props
      },
      global: {
        plugins: [Quasar]
      }
    })
  }

  it('renders correctly with basic props', () => {
    const wrapper = createWrapper()
    
    expect(wrapper.find('.text-h6').text()).toContain('Family vs Household Relationships')
    expect(wrapper.find('[data-testid="family-section"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="household-section"]').exists()).toBe(true)
  })

  it('displays family relationships correctly', () => {
    const familyRelationships = [
      {
        id: 1,
        person1: { first_name: 'John', last_name: 'Smith' },
        person2: { first_name: 'Jane', last_name: 'Smith' },
        relationship_type: { name: 'Spouse' },
        family_id: 1,
        custody_type: null
      },
      {
        id: 2,
        person1: { first_name: 'John', last_name: 'Smith' },
        person2: { first_name: 'Bobby', last_name: 'Smith' },
        relationship_type: { name: 'Parent' },
        family_id: 1,
        custody_type: 'full'
      }
    ]

    const wrapper = createWrapper({ familyRelationships })
    
    const familyItems = wrapper.findAll('[data-testid="family-relationship"]')
    expect(familyItems).toHaveLength(2)
    
    // Check first relationship
    expect(familyItems[0].text()).toContain('John Smith ↔ Jane Smith')
    expect(familyItems[0].text()).toContain('Spouse')
    
    // Check second relationship with custody
    expect(familyItems[1].text()).toContain('John Smith ↔ Bobby Smith')
    expect(familyItems[1].text()).toContain('Parent')
    expect(familyItems[1].find('.q-chip').text()).toContain('full')
  })

  it('displays household memberships correctly', () => {
    const memberHouseholds = [
      {
        id: 1,
        household: {
          id: 1,
          name: 'Main House',
          household_type: 'primary'
        },
        role: 'head',
        residency_status: 'permanent'
      },
      {
        id: 2,
        household: {
          id: 2,
          name: 'Summer House',
          household_type: 'secondary'
        },
        role: 'resident',
        residency_status: 'temporary'
      }
    ]

    const wrapper = createWrapper({ memberHouseholds })
    
    const householdItems = wrapper.findAll('[data-testid="household-membership"]')
    expect(householdItems).toHaveLength(2)
    
    // Check first household
    expect(householdItems[0].text()).toContain('Main House')
    expect(householdItems[0].text()).toContain('head')
    expect(householdItems[0].text()).toContain('permanent')
    
    // Check second household
    expect(householdItems[1].text()).toContain('Summer House')
    expect(householdItems[1].text()).toContain('resident')
    expect(householdItems[1].text()).toContain('temporary')
  })

  it('detects complex relationships correctly', () => {
    const familyRelationships = [
      {
        id: 1,
        person1: { first_name: 'John', last_name: 'Smith' },
        person2: { first_name: 'Jane', last_name: 'Doe' },
        relationship_type: { name: 'Spouse' },
        family_id: 1,
        custody_type: null
      },
      {
        id: 2,
        person1: { first_name: 'John', last_name: 'Smith' },
        person2: { first_name: 'Bobby', last_name: 'Johnson' },
        relationship_type: { name: 'Guardian' },
        family_id: 2, // Different family
        custody_type: 'joint'
      }
    ]

    const memberHouseholds = [
      {
        id: 1,
        household: { id: 1, name: 'House 1', household_type: 'primary' },
        role: 'head',
        residency_status: 'permanent'
      },
      {
        id: 2,
        household: { id: 2, name: 'House 2', household_type: 'secondary' },
        role: 'resident',
        residency_status: 'temporary'
      }
    ]

    const wrapper = createWrapper({ familyRelationships, memberHouseholds })
    
    // Should detect complex relationships due to multiple families, households, and custody
    expect(wrapper.find('[data-testid="complex-indicator"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="complex-indicator"]').text()).toContain('Complex Relationships Detected')
  })

  it('emits events when action buttons are clicked', async () => {
    const wrapper = createWrapper()
    
    // Test manage family button
    await wrapper.find('[data-testid="manage-family-btn"]').trigger('click')
    expect(wrapper.emitted('manage-family')).toBeTruthy()
    
    // Test manage households button
    await wrapper.find('[data-testid="manage-households-btn"]').trigger('click')
    expect(wrapper.emitted('manage-households')).toBeTruthy()
    
    // Test view family tree button
    await wrapper.find('[data-testid="view-family-tree-btn"]').trigger('click')
    expect(wrapper.emitted('view-family-tree')).toBeTruthy()
    
    // Test view relationship map button
    await wrapper.find('[data-testid="view-relationship-map-btn"]').trigger('click')
    expect(wrapper.emitted('view-relationship-map')).toBeTruthy()
  })

  it('shows complex relationships review button when complex relationships exist', () => {
    const familyRelationships = [
      {
        id: 1,
        person1: { first_name: 'John', last_name: 'Smith' },
        person2: { first_name: 'Jane', last_name: 'Doe' },
        relationship_type: { name: 'Spouse' },
        family_id: 1,
        custody_type: 'joint' // Has custody = complex
      }
    ]

    const wrapper = createWrapper({ familyRelationships })
    
    expect(wrapper.find('[data-testid="review-complex-btn"]').exists()).toBe(true)
  })

  it('does not show complex relationships review button when no complex relationships', () => {
    const familyRelationships = [
      {
        id: 1,
        person1: { first_name: 'John', last_name: 'Smith' },
        person2: { first_name: 'Jane', last_name: 'Smith' },
        relationship_type: { name: 'Spouse' },
        family_id: 1,
        custody_type: null // No custody = not complex
      }
    ]

    const memberHouseholds = [
      {
        id: 1,
        household: { id: 1, name: 'House 1', household_type: 'primary' },
        role: 'head',
        residency_status: 'permanent'
      }
    ] // Only one household = not complex

    const wrapper = createWrapper({ familyRelationships, memberHouseholds })
    
    expect(wrapper.find('[data-testid="review-complex-btn"]').exists()).toBe(false)
  })

  it('handles empty relationships and households gracefully', () => {
    const wrapper = createWrapper({
      familyRelationships: [],
      memberHouseholds: []
    })
    
    expect(wrapper.find('[data-testid="no-family-relationships"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="no-household-memberships"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="no-family-relationships"]').text()).toContain('No family relationships found')
    expect(wrapper.find('[data-testid="no-household-memberships"]').text()).toContain('No household memberships found')
  })

  it('formats person names correctly', () => {
    const familyRelationships = [
      {
        id: 1,
        person1: { first_name: 'John', last_name: 'Smith' },
        person2: { first_name: 'Jane', last_name: 'Doe-Smith' },
        relationship_type: { name: 'Spouse' },
        family_id: 1,
        custody_type: null
      }
    ]

    const wrapper = createWrapper({ familyRelationships })
    
    const relationshipItem = wrapper.find('[data-testid="family-relationship"]')
    expect(relationshipItem.text()).toContain('John Smith ↔ Jane Doe-Smith')
  })

  it('displays custody information with correct styling', () => {
    const familyRelationships = [
      {
        id: 1,
        person1: { first_name: 'John', last_name: 'Smith' },
        person2: { first_name: 'Bobby', last_name: 'Smith' },
        relationship_type: { name: 'Parent' },
        family_id: 1,
        custody_type: 'full'
      },
      {
        id: 2,
        person1: { first_name: 'Jane', last_name: 'Smith' },
        person2: { first_name: 'Bobby', last_name: 'Smith' },
        relationship_type: { name: 'Parent' },
        family_id: 1,
        custody_type: 'joint'
      }
    ]

    const wrapper = createWrapper({ familyRelationships })
    
    const custodyChips = wrapper.findAll('.q-chip')
    expect(custodyChips).toHaveLength(2)
    expect(custodyChips[0].text()).toContain('full')
    expect(custodyChips[1].text()).toContain('joint')
  })
})
