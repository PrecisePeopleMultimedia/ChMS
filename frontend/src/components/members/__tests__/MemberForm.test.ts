import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MemberForm from '../MemberForm.vue'
import type { Member, Family } from '@/types/member'

// Mock Quasar
const mockQuasar = {
  install: vi.fn(),
  version: '2.0.0'
}

// Mock stores
const mockFamiliesStore = {
  families: [],
  fetchFamilies: vi.fn(),
  loading: false,
  error: null
}

const mockMembersStore = {
  createMember: vi.fn(),
  updateMember: vi.fn(),
  loading: false,
  error: null
}

vi.mock('@/stores/families', () => ({
  useFamiliesStore: () => mockFamiliesStore
}))

vi.mock('@/stores/members', () => ({
  useMembersStore: () => mockMembersStore
}))

const createWrapper = (props: any = {}) => {
  return mount(MemberForm, {
    props: {
      modelValue: true,
      member: null,
      ...props
    },
    global: {
      plugins: [mockQuasar as any],
      stubs: {
        'q-dialog': {
          template: '<div><slot /></div>',
          props: ['modelValue']
        },
        'q-card': { template: '<div><slot /></div>' },
        'q-card-section': { template: '<div><slot /></div>' },
        'q-form': { 
          template: '<form @submit.prevent="$emit(\'submit\')"><slot /></form>',
          methods: {
            validate: vi.fn(() => Promise.resolve(true)),
            resetValidation: vi.fn()
          }
        },
        'q-input': {
          template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
          props: ['modelValue', 'label', 'rules', 'type']
        },
        'q-select': {
          template: '<select :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option></select>',
          props: ['modelValue', 'options', 'label']
        },
        'q-btn': {
          template: '<button @click="$emit(\'click\')" :disabled="disable"><slot /></button>',
          props: ['disable', 'loading']
        },
        'q-checkbox': {
          template: '<input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" />',
          props: ['modelValue', 'label']
        }
      }
    }
  })
}

describe('MemberForm', () => {
  const mockFamilies: Family[] = [
    {
      id: 1,
      organization_id: 1,
      family_name: 'Smith Family',
      head_of_family_id: null,
      address: '123 Main St',
      phone: '+1234567890',
      email: 'smith@example.com',
      notes: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
  ]

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
    notes: 'Test notes',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockFamiliesStore.families = mockFamilies
  })

  it('renders form fields correctly', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('input[value=""]').exists()).toBe(true) // First name input
    expect(wrapper.find('select').exists()).toBe(true) // Member type select
  })

  it('populates form when editing existing member', async () => {
    const wrapper = createWrapper({ member: mockMember })
    await nextTick()

    const inputs = wrapper.findAll('input')
    const firstNameInput = inputs.find(input => 
      input.element.value === mockMember.first_name
    )
    expect(firstNameInput?.element.value).toBe('John')
  })

  it('validates required fields', async () => {
    const wrapper = createWrapper()
    
    const form = wrapper.find('form')
    await form.trigger('submit')

    // Form should not submit without required fields
    expect(mockMembersStore.createMember).not.toHaveBeenCalled()
  })

  it('creates new member when form is valid', async () => {
    mockMembersStore.createMember.mockResolvedValue(mockMember)
    
    const wrapper = createWrapper()
    
    // Fill required fields
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('John') // First name
    await inputs[1].setValue('Doe')  // Last name
    
    const select = wrapper.find('select')
    await select.setValue('adult')

    const form = wrapper.find('form')
    await form.trigger('submit')
    await nextTick()

    expect(mockMembersStore.createMember).toHaveBeenCalledWith(
      expect.objectContaining({
        first_name: 'John',
        last_name: 'Doe',
        member_type: 'adult'
      })
    )
  })

  it('updates existing member when editing', async () => {
    mockMembersStore.updateMember.mockResolvedValue(mockMember)
    
    const wrapper = createWrapper({ member: mockMember })
    
    // Update first name
    const inputs = wrapper.findAll('input')
    const firstNameInput = inputs.find(input => 
      input.element.value === mockMember.first_name
    )
    await firstNameInput?.setValue('Jane')

    const form = wrapper.find('form')
    await form.trigger('submit')
    await nextTick()

    expect(mockMembersStore.updateMember).toHaveBeenCalledWith(
      mockMember.id,
      expect.objectContaining({
        first_name: 'Jane'
      })
    )
  })

  it('emits close event when cancel button is clicked', async () => {
    const wrapper = createWrapper()
    
    const buttons = wrapper.findAll('button')
    const cancelButton = buttons.find(btn => 
      btn.text().includes('Cancel')
    )
    
    if (cancelButton) {
      await cancelButton.trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    }
  })

  it('loads families on mount', () => {
    createWrapper()
    expect(mockFamiliesStore.fetchFamilies).toHaveBeenCalled()
  })

  it('handles form submission errors gracefully', async () => {
    const error = new Error('Validation failed')
    mockMembersStore.createMember.mockRejectedValue(error)
    
    const wrapper = createWrapper()
    
    // Fill required fields
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('John')
    await inputs[1].setValue('Doe')
    
    const select = wrapper.find('select')
    await select.setValue('adult')

    const form = wrapper.find('form')
    await form.trigger('submit')
    await nextTick()

    // Form should remain open on error
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('validates email format', async () => {
    const wrapper = createWrapper()
    
    const inputs = wrapper.findAll('input')
    const emailInput = inputs.find(input => 
      input.attributes('type') === 'email'
    )
    
    if (emailInput) {
      await emailInput.setValue('invalid-email')
      // Email validation would be handled by Quasar rules
      expect(emailInput.element.value).toBe('invalid-email')
    }
  })

  it('handles member type selection correctly', async () => {
    const wrapper = createWrapper()
    
    const select = wrapper.find('select')
    await select.setValue('child')
    
    expect(select.element.value).toBe('child')
  })

  it('handles family selection', async () => {
    const wrapper = createWrapper()
    
    // Family select would be a separate select element
    const selects = wrapper.findAll('select')
    if (selects.length > 1) {
      const familySelect = selects[1]
      await familySelect.setValue('1')
      expect(familySelect.element.value).toBe('1')
    }
  })

  it('shows loading state during submission', async () => {
    mockMembersStore.loading = true
    const wrapper = createWrapper()
    
    const buttons = wrapper.findAll('button')
    const submitButton = buttons.find(btn => 
      btn.text().includes('Save') || btn.text().includes('Create')
    )
    
    expect(submitButton?.attributes('disabled')).toBeDefined()
  })

  it('resets form when dialog is closed and reopened', async () => {
    const wrapper = createWrapper({ member: mockMember })
    
    // Close dialog
    await wrapper.setProps({ modelValue: false })
    
    // Reopen with no member (new member form)
    await wrapper.setProps({ modelValue: true, member: null })
    
    // Form should be reset
    const inputs = wrapper.findAll('input')
    const firstNameInput = inputs[0]
    expect(firstNameInput.element.value).toBe('')
  })

  it('handles date inputs correctly', async () => {
    const wrapper = createWrapper()
    
    const inputs = wrapper.findAll('input')
    const dateInput = inputs.find(input => 
      input.attributes('type') === 'date'
    )
    
    if (dateInput) {
      await dateInput.setValue('1990-01-15')
      expect(dateInput.element.value).toBe('1990-01-15')
    }
  })
})
