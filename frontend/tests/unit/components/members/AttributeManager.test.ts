import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AttributeManager from '@/components/members/AttributeManager.vue'
import { useAttributesStore } from '@/stores/attributes'
import { createTestApp } from '@/__tests__/setup'

// Mock the stores
vi.mock('@/stores/attributes', () => ({
  useAttributesStore: vi.fn(() => ({
    attributes: [],
    categories: ['Personal', 'Contact', 'Ministry', 'Family'],
    fieldTypes: {
      'text': 'Text',
      'textarea': 'Textarea',
      'number': 'Number',
      'date': 'Date',
      'boolean': 'Boolean',
      'select': 'Select',
      'multi-select': 'Multi-Select',
      'email': 'Email',
      'phone': 'Phone'
    },
    loading: false,
    error: null,
    fetchAttributes: vi.fn(),
    createAttribute: vi.fn(),
    updateAttribute: vi.fn(),
    deleteAttribute: vi.fn(),
    updateOrder: vi.fn()
  }))
}))

describe('AttributeManager', () => {
  let wrapper: any
  let mockStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    mockStore = useAttributesStore()

    wrapper = mount(AttributeManager, {
      ...createTestApp(AttributeManager)
    })
  })

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-testid="attribute-manager"]').exists()).toBe(true)
  })

  it('displays loading state', async () => {
    mockStore.loading = true
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('[data-testid="loading-spinner"]').exists()).toBe(true)
  })

  it('displays error state', async () => {
    mockStore.error = 'Failed to load attributes'
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Failed to load attributes')
  })

  it('displays attributes list', async () => {
    mockStore.attributes = [
      {
        id: 1,
        key: 'baptism_date',
        name: 'Baptism Date',
        field_type: 'date',
        category: 'Personal',
        is_required: false,
        is_active: true,
        display_order: 1
      },
      {
        id: 2,
        key: 'ministry',
        name: 'Ministry Involvement',
        field_type: 'select',
        category: 'Ministry',
        field_options: { options: ['Youth', 'Music', 'Outreach'] },
        is_required: true,
        is_active: true,
        display_order: 2
      }
    ]
    await wrapper.vm.$nextTick()
    
    expect(wrapper.findAll('[data-testid="attribute-item"]')).toHaveLength(2)
    expect(wrapper.text()).toContain('Baptism Date')
    expect(wrapper.text()).toContain('Ministry Involvement')
  })

  it('shows create attribute dialog when add button clicked', async () => {
    await wrapper.find('[data-testid="add-attribute-btn"]').trigger('click')
    
    expect(wrapper.find('[data-testid="attribute-form-dialog"]').exists()).toBe(true)
  })

  it('filters attributes by category', async () => {
    mockStore.attributes = [
      {
        id: 1,
        key: 'baptism_date',
        name: 'Baptism Date',
        field_type: 'date',
        category: 'Personal',
        is_required: false,
        is_active: true,
        display_order: 1
      },
      {
        id: 2,
        key: 'ministry',
        name: 'Ministry Involvement',
        field_type: 'select',
        category: 'Ministry',
        is_required: true,
        is_active: true,
        display_order: 2
      }
    ]
    await wrapper.vm.$nextTick()
    
    // Select Personal category filter
    await wrapper.find('[data-testid="category-filter"]').setValue('Personal')
    await wrapper.vm.$nextTick()
    
    const visibleItems = wrapper.findAll('[data-testid="attribute-item"]:not(.hidden)')
    expect(visibleItems).toHaveLength(1)
    expect(wrapper.text()).toContain('Baptism Date')
  })

  it('calls store methods when actions are triggered', async () => {
    const mockAttribute = {
      id: 1,
      key: 'test_attr',
      name: 'Test Attribute',
      field_type: 'text',
      category: 'Personal',
      is_required: false,
      is_active: true,
      display_order: 1
    }

    // Test create
    await wrapper.vm.handleCreate(mockAttribute)
    expect(mockStore.createAttribute).toHaveBeenCalledWith(mockAttribute)

    // Test update
    await wrapper.vm.handleUpdate(mockAttribute)
    expect(mockStore.updateAttribute).toHaveBeenCalledWith(mockAttribute.id, mockAttribute)

    // Test delete
    await wrapper.vm.handleDelete(mockAttribute.id)
    expect(mockStore.deleteAttribute).toHaveBeenCalledWith(mockAttribute.id)
  })

  it('handles drag and drop reordering', async () => {
    mockStore.attributes = [
      { id: 1, name: 'First', display_order: 1 },
      { id: 2, name: 'Second', display_order: 2 }
    ]
    await wrapper.vm.$nextTick()

    // Simulate drag and drop reorder
    const newOrder = [
      { id: 2, display_order: 1 },
      { id: 1, display_order: 2 }
    ]
    
    await wrapper.vm.handleReorder(newOrder)
    expect(mockStore.updateOrder).toHaveBeenCalledWith(newOrder)
  })

  it('shows field type icons correctly', async () => {
    mockStore.attributes = [
      { id: 1, field_type: 'text', name: 'Text Field' },
      { id: 2, field_type: 'date', name: 'Date Field' },
      { id: 3, field_type: 'boolean', name: 'Boolean Field' }
    ]
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('[data-testid="field-type-text"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="field-type-date"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="field-type-boolean"]').exists()).toBe(true)
  })

  it('displays required field indicators', async () => {
    mockStore.attributes = [
      { id: 1, name: 'Required Field', is_required: true },
      { id: 2, name: 'Optional Field', is_required: false }
    ]
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('[data-testid="required-indicator"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="required-indicator"]')).toHaveLength(1)
  })

  it('handles search functionality', async () => {
    mockStore.attributes = [
      { id: 1, name: 'Baptism Date', key: 'baptism_date' },
      { id: 2, name: 'Ministry Involvement', key: 'ministry' }
    ]
    await wrapper.vm.$nextTick()
    
    // Search for 'baptism'
    await wrapper.find('[data-testid="search-input"]').setValue('baptism')
    await wrapper.vm.$nextTick()
    
    const visibleItems = wrapper.findAll('[data-testid="attribute-item"]:not(.hidden)')
    expect(visibleItems).toHaveLength(1)
    expect(wrapper.text()).toContain('Baptism Date')
  })
})
