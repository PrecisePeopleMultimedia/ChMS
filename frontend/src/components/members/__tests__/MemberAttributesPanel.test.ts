import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import MemberAttributesPanel from '../MemberAttributesPanel.vue'
import { useAttributesStore } from '@/stores/attributes'

// Mock Quasar components
vi.mock('quasar', async () => {
  const actual = await vi.importActual('quasar')
  return {
    ...actual,
    QCard: { name: 'QCard', template: '<div class="q-card"><slot /></div>' },
    QCardSection: { name: 'QCardSection', template: '<div class="q-card-section"><slot /></div>' },
    QSeparator: { name: 'QSeparator', template: '<hr class="q-separator" />' },
    QBtn: { name: 'QBtn', template: '<button class="q-btn" @click="$emit(\'click\')"><slot /></button>' },
    QIcon: { name: 'QIcon', template: '<i class="q-icon"></i>' },
    QSpinner: { name: 'QSpinner', template: '<div class="q-spinner"></div>' },
    QBanner: { name: 'QBanner', template: '<div class="q-banner"><slot /></div>' },
    QInput: { name: 'QInput', template: '<input class="q-input" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />' },
    QSelect: { name: 'QSelect', template: '<select class="q-select" :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><slot /></select>' },
    QCheckbox: { name: 'QCheckbox', template: '<input type="checkbox" class="q-checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" />' },
    QDate: { name: 'QDate', template: '<input type="date" class="q-date" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />' },
    QOptionGroup: { name: 'QOptionGroup', template: '<div class="q-option-group"><slot /></div>' }
  }
})

describe('MemberAttributesPanel Component', () => {
  let wrapper: any
  let attributesStore: any

  const mockAttributes = [
    {
      id: 1,
      key: 'emergency_contact',
      name: 'Emergency Contact',
      field_type: 'text',
      category: 'Personal',
      is_required: true,
      is_active: true,
      display_order: 1
    },
    {
      id: 2,
      key: 'phone_number',
      name: 'Phone Number',
      field_type: 'phone',
      category: 'Contact',
      is_required: false,
      is_active: true,
      display_order: 2
    },
    {
      id: 3,
      key: 'membership_type',
      name: 'Membership Type',
      field_type: 'select',
      category: 'Church',
      field_options: { options: ['Regular', 'Associate', 'Honorary'] },
      is_required: true,
      is_active: true,
      display_order: 3
    }
  ]

  const mockAttributeValues = [
    {
      id: 1,
      member_id: 1,
      attribute_id: 1,
      value: 'John Doe - 555-1234',
      attribute: mockAttributes[0]
    },
    {
      id: 2,
      member_id: 1,
      attribute_id: 2,
      value: '+1-555-987-6543',
      attribute: mockAttributes[1]
    }
  ]

  const createWrapper = (props = {}) => {
    return mount(MemberAttributesPanel, {
      props: {
        memberId: 1,
        ...props
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              attributes: {
                attributes: mockAttributes,
                memberAttributeValues: mockAttributeValues,
                loading: false,
                error: null
              }
            }
          })
        ]
      }
    })
  }

  beforeEach(() => {
    wrapper = createWrapper()
    attributesStore = useAttributesStore()
  })

  describe('Component Rendering', () => {
    it('should render correctly with attributes', () => {
      expect(wrapper.find('.q-card').exists()).toBe(true)
      expect(wrapper.text()).toContain('Custom Attributes')
    })

    it('should show loading state', async () => {
      attributesStore.loading = true
      await wrapper.vm.$nextTick()
      
      expect(wrapper.find('.q-spinner').exists()).toBe(true)
    })

    it('should show error state', async () => {
      attributesStore.error = 'Failed to load attributes'
      await wrapper.vm.$nextTick()
      
      expect(wrapper.find('.q-banner').exists()).toBe(true)
      expect(wrapper.text()).toContain('Failed to load attributes')
    })

    it('should show empty state when no attributes', async () => {
      attributesStore.attributes = []
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('No custom attributes configured')
    })
  })

  describe('Attribute Display', () => {
    it('should display all active attributes', () => {
      const attributeInputs = wrapper.findAll('.attribute-field')
      expect(attributeInputs).toHaveLength(3)
    })

    it('should group attributes by category', () => {
      const categories = wrapper.findAll('.attribute-category')
      expect(categories.length).toBeGreaterThan(0)
      
      // Should have Personal, Contact, and Church categories
      expect(wrapper.text()).toContain('Personal')
      expect(wrapper.text()).toContain('Contact')
      expect(wrapper.text()).toContain('Church')
    })

    it('should show required field indicators', () => {
      const requiredFields = wrapper.findAll('.required-indicator')
      expect(requiredFields.length).toBeGreaterThan(0)
    })

    it('should display current attribute values', () => {
      expect(wrapper.text()).toContain('John Doe - 555-1234')
      expect(wrapper.text()).toContain('+1-555-987-6543')
    })
  })

  describe('Field Type Rendering', () => {
    it('should render text input for text field type', () => {
      const textInputs = wrapper.findAll('input[type="text"]')
      expect(textInputs.length).toBeGreaterThan(0)
    })

    it('should render phone input for phone field type', () => {
      const phoneInputs = wrapper.findAll('input[type="tel"]')
      expect(phoneInputs.length).toBeGreaterThan(0)
    })

    it('should render select dropdown for select field type', () => {
      const selectInputs = wrapper.findAll('.q-select')
      expect(selectInputs.length).toBeGreaterThan(0)
    })

    it('should render checkbox for boolean field type', async () => {
      // Add a boolean attribute
      attributesStore.attributes.push({
        id: 4,
        key: 'is_baptized',
        name: 'Is Baptized',
        field_type: 'boolean',
        category: 'Church',
        is_required: false,
        is_active: true,
        display_order: 4
      })
      await wrapper.vm.$nextTick()
      
      const checkboxes = wrapper.findAll('input[type="checkbox"]')
      expect(checkboxes.length).toBeGreaterThan(0)
    })

    it('should render date picker for date field type', async () => {
      // Add a date attribute
      attributesStore.attributes.push({
        id: 5,
        key: 'baptism_date',
        name: 'Baptism Date',
        field_type: 'date',
        category: 'Church',
        is_required: false,
        is_active: true,
        display_order: 5
      })
      await wrapper.vm.$nextTick()
      
      const dateInputs = wrapper.findAll('input[type="date"]')
      expect(dateInputs.length).toBeGreaterThan(0)
    })
  })

  describe('Form Interactions', () => {
    it('should call fetchAttributes on mount', () => {
      expect(attributesStore.fetchAttributes).toHaveBeenCalled()
    })

    it('should call fetchMemberAttributeValues on mount', () => {
      expect(attributesStore.fetchMemberAttributeValues).toHaveBeenCalledWith(1)
    })

    it('should update attribute value when input changes', async () => {
      const textInput = wrapper.find('input[type="text"]')
      await textInput.setValue('New emergency contact')
      await textInput.trigger('blur')
      
      expect(attributesStore.updateMemberAttributeValue).toHaveBeenCalled()
    })

    it('should validate required fields', async () => {
      const requiredInput = wrapper.find('input[type="text"]')
      await requiredInput.setValue('')
      await requiredInput.trigger('blur')
      
      // Should show validation error
      expect(wrapper.text()).toContain('This field is required')
    })

    it('should validate field format', async () => {
      const phoneInput = wrapper.find('input[type="tel"]')
      await phoneInput.setValue('invalid phone')
      await phoneInput.trigger('blur')
      
      // Should show format validation error
      expect(wrapper.text()).toContain('Please enter a valid phone number')
    })
  })

  describe('Edit Mode', () => {
    it('should toggle edit mode when edit button is clicked', async () => {
      const editButton = wrapper.find('.edit-button')
      await editButton.trigger('click')
      
      expect(wrapper.vm.isEditing).toBe(true)
      expect(wrapper.text()).toContain('Save')
      expect(wrapper.text()).toContain('Cancel')
    })

    it('should save changes when save button is clicked', async () => {
      wrapper.vm.isEditing = true
      await wrapper.vm.$nextTick()
      
      const saveButton = wrapper.find('.save-button')
      await saveButton.trigger('click')
      
      expect(attributesStore.bulkUpdateMemberAttributeValues).toHaveBeenCalled()
    })

    it('should cancel changes when cancel button is clicked', async () => {
      wrapper.vm.isEditing = true
      wrapper.vm.formData = { 1: 'Modified value' }
      await wrapper.vm.$nextTick()
      
      const cancelButton = wrapper.find('.cancel-button')
      await cancelButton.trigger('click')
      
      expect(wrapper.vm.isEditing).toBe(false)
      expect(wrapper.vm.formData).toEqual({})
    })
  })

  describe('Validation', () => {
    it('should validate all fields before saving', async () => {
      wrapper.vm.isEditing = true
      wrapper.vm.formData = {
        1: '', // Required field left empty
        2: 'invalid-phone'
      }
      
      const saveButton = wrapper.find('.save-button')
      await saveButton.trigger('click')
      
      expect(wrapper.vm.validationErrors).toHaveProperty('1')
      expect(wrapper.vm.validationErrors).toHaveProperty('2')
      expect(attributesStore.bulkUpdateMemberAttributeValues).not.toHaveBeenCalled()
    })

    it('should show validation errors in UI', async () => {
      wrapper.vm.validationErrors = {
        1: 'This field is required',
        2: 'Invalid phone number format'
      }
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('This field is required')
      expect(wrapper.text()).toContain('Invalid phone number format')
    })

    it('should clear validation errors when field is corrected', async () => {
      wrapper.vm.validationErrors = { 1: 'This field is required' }
      
      const textInput = wrapper.find('input[type="text"]')
      await textInput.setValue('Valid value')
      
      expect(wrapper.vm.validationErrors).not.toHaveProperty('1')
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels for all form fields', () => {
      const labels = wrapper.findAll('label')
      expect(labels.length).toBeGreaterThan(0)
      
      labels.forEach(label => {
        expect(label.attributes('for')).toBeDefined()
      })
    })

    it('should have proper ARIA attributes for required fields', () => {
      const requiredInputs = wrapper.findAll('[aria-required="true"]')
      expect(requiredInputs.length).toBeGreaterThan(0)
    })

    it('should have proper error announcements', async () => {
      wrapper.vm.validationErrors = { 1: 'Error message' }
      await wrapper.vm.$nextTick()
      
      const errorElements = wrapper.findAll('[role="alert"]')
      expect(errorElements.length).toBeGreaterThan(0)
    })
  })

  describe('Mobile Responsiveness', () => {
    it('should have responsive layout classes', () => {
      expect(wrapper.find('.col-12').exists()).toBe(true)
      expect(wrapper.find('.col-md-6').exists()).toBe(true)
    })

    it('should have touch-friendly button sizes', () => {
      const buttons = wrapper.findAll('.q-btn')
      buttons.forEach(button => {
        expect(button.classes()).toContain('q-btn--standard')
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle save errors gracefully', async () => {
      attributesStore.bulkUpdateMemberAttributeValues.mockRejectedValue(new Error('Save failed'))
      
      wrapper.vm.isEditing = true
      const saveButton = wrapper.find('.save-button')
      await saveButton.trigger('click')
      
      expect(wrapper.text()).toContain('Failed to save changes')
    })

    it('should show retry option on error', async () => {
      attributesStore.error = 'Network error'
      await wrapper.vm.$nextTick()
      
      const retryButton = wrapper.find('.retry-button')
      expect(retryButton.exists()).toBe(true)
      
      await retryButton.trigger('click')
      expect(attributesStore.fetchAttributes).toHaveBeenCalledTimes(2)
    })
  })
})
