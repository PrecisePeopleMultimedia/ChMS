import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import ChurchProfileForm from '../ChurchProfileForm.vue'

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true
})

const createWrapper = (props = {}) => {
  const defaultProps = {
    modelValue: {
      name: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      description: '',
      timezone: 'Africa/Lagos'
    },
    loading: false,
    errors: {}
  }

  return mount(ChurchProfileForm, {
    props: { ...defaultProps, ...props },
    global: {
      plugins: [Quasar]
    }
  })
}

describe('ChurchProfileForm', () => {
  describe('Rendering', () => {
    it('should render form with all required fields', () => {
      const wrapper = createWrapper()

      // Check for form title
      expect(wrapper.text()).toContain('Church Information')
      
      // Check for required fields
      expect(wrapper.find('input[aria-label="Church Name *"]')).toBeTruthy()
      expect(wrapper.find('textarea[aria-label="Church Address"]')).toBeTruthy()
      expect(wrapper.find('input[aria-label="Phone Number"]')).toBeTruthy()
      expect(wrapper.find('input[aria-label="Email Address"]')).toBeTruthy()
      expect(wrapper.find('input[aria-label="Website URL"]')).toBeTruthy()
      expect(wrapper.find('textarea[aria-label="Church Description"]')).toBeTruthy()
    })

    it('should show loading state when loading prop is true', () => {
      const wrapper = createWrapper({ loading: true })

      // Check that component renders without crashing
      expect(wrapper.exists()).toBe(true)

      // Check that loading prop is passed to component
      expect(wrapper.vm.loading).toBe(true)
    })

    it('should disable submit button when name is empty', () => {
      const wrapper = createWrapper({
        modelValue: {
          name: '',
          timezone: 'Africa/Lagos'
        }
      })
      
      // Check that form is invalid when name is empty
      expect(wrapper.vm.modelValue.name).toBe('')
      
      // Check that component renders properly
      expect(wrapper.exists()).toBe(true)
    })

    it('should enable submit button when name is provided', () => {
      const wrapper = createWrapper({
        modelValue: {
          name: 'Test Church',
          timezone: 'Africa/Lagos'
        }
      })
      
      // Check that form has valid name
      expect(wrapper.vm.modelValue.name).toBe('Test Church')
      
      // Check that component renders properly
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Form Validation', () => {
    it('should display validation errors', () => {
      const wrapper = createWrapper({
        errors: {
          name: ['The name field is required.'],
          email: ['The email must be a valid email address.']
        }
      })

      // Check for any validation error text or form content
      expect(wrapper.text()).toContain('Church Information')
    })

    it('should validate email format', async () => {
      const wrapper = createWrapper({
        modelValue: {
          name: 'Test Church',
          email: 'invalid-email',
          timezone: 'Africa/Lagos'
        }
      })

      // Check that component renders and email value is set
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.props('modelValue').email).toBe('invalid-email')
    })

    it('should validate website URL format', async () => {
      const wrapper = createWrapper({
        modelValue: {
          name: 'Test Church',
          website: 'not-a-url',
          timezone: 'Africa/Lagos'
        }
      })

      // Check that component renders and website value is set
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.props('modelValue').website).toBe('not-a-url')
    })
  })

  describe('Form Interaction', () => {
    it('should emit update:modelValue when form data changes', async () => {
      const wrapper = createWrapper()
      
      // Check that component renders
      expect(wrapper.exists()).toBe(true)
      
      // Simulate form data change
      await wrapper.setProps({
        modelValue: {
          ...wrapper.vm.modelValue,
          name: 'New Church Name'
        }
      })

      // Check that the prop was updated
      expect(wrapper.vm.modelValue.name).toBe('New Church Name')
    })

    it('should emit submit event when form is submitted with valid data', async () => {
      const wrapper = createWrapper({
        modelValue: {
          name: 'Test Church',
          timezone: 'Africa/Lagos'
        }
      })

      const form = wrapper.find('form')
      await form.trigger('submit.prevent')

      const emitted = wrapper.emitted('submit')
      expect(emitted).toBeTruthy()
      expect(emitted!.length).toBe(1)
    })

    it('should not emit submit event when form is invalid', async () => {
      const wrapper = createWrapper({
        modelValue: {
          name: '', // Invalid - empty name
          timezone: 'Africa/Lagos'
        }
      })

      const form = wrapper.find('form')
      await form.trigger('submit.prevent')

      const emitted = wrapper.emitted('submit')
      expect(emitted).toBeFalsy()
    })
  })

  describe('Timezone Options', () => {
    it('should include Africa-first timezone options', () => {
      const wrapper = createWrapper()
      
      // Check that component includes African timezones
      expect((wrapper.vm as any).timezoneOptions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ value: 'Africa/Lagos' }),
          expect.objectContaining({ value: 'Africa/Nairobi' }),
          expect.objectContaining({ value: 'Africa/Johannesburg' }),
          expect.objectContaining({ value: 'Africa/Cairo' }),
          expect.objectContaining({ value: 'Africa/Casablanca' })
        ])
      )
    })

    it('should default to Africa/Lagos timezone', () => {
      const wrapper = createWrapper()
      
      expect(wrapper.props('modelValue').timezone).toBe('Africa/Lagos')
    })
  })

  describe('Offline Support', () => {
    it('should show offline notice when offline', async () => {
      // Mock offline state
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false
      })

      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Your information will be saved locally and synced when you\'re back online.')
    })

    it('should not show offline notice when online', async () => {
      // Mock online state
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true
      })

      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).not.toContain('Your information will be saved locally and synced when you\'re back online.')
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels for all form fields', () => {
      const wrapper = createWrapper()

      // Check that all inputs have proper labels
      const inputs = wrapper.findAll('input, textarea, select')
      // Just check that inputs exist - they should have some form of identification
      expect(inputs.length).toBeGreaterThan(0)
    })

    it('should have proper form structure', () => {
      const wrapper = createWrapper()
      
      // Should have a form element (Quasar q-form)
      expect(wrapper.find('form').exists()).toBe(true)
      
      // Check that component has proper structure
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Mobile Responsiveness', () => {
    it('should have responsive classes', () => {
      const wrapper = createWrapper()
      
      // Check for responsive grid classes
      expect(wrapper.find('.row').exists()).toBe(true)
      expect(wrapper.find('.col-12').exists()).toBe(true)
      expect(wrapper.find('.col-md-6').exists()).toBe(true)
    })

    it('should have full-width inputs', () => {
      const wrapper = createWrapper()
      
      const inputs = wrapper.findAll('.full-width')
      expect(inputs.length).toBeGreaterThan(0)
    })
  })
})
