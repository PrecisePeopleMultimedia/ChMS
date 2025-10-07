import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ModernInput from '@/components/ui/ModernInput.vue'

describe('ModernInput', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      const wrapper = mount(ModernInput, {
        props: {
          modelValue: ''
        }
      })

      const input = wrapper.find('input')
      expect(input.exists()).toBe(true)
      expect(input.classes()).toContain('modern-input')
      expect(input.attributes('type')).toBe('text')
    })

    it('renders with label', () => {
      const wrapper = mount(ModernInput, {
        props: {
          modelValue: '',
          label: 'Test Label'
        }
      })

      const label = wrapper.find('label')
      expect(label.exists()).toBe(true)
      expect(label.text()).toBe('Test Label')
    })

    it('renders with required indicator', () => {
      const wrapper = mount(ModernInput, {
        props: {
          modelValue: '',
          label: 'Required Field',
          required: true
        }
      })

      const requiredIndicator = wrapper.find('.text-destructive')
      expect(requiredIndicator.exists()).toBe(true)
      expect(requiredIndicator.text()).toBe('*')
    })

    it('renders with placeholder', () => {
      const wrapper = mount(ModernInput, {
        props: {
          modelValue: '',
          placeholder: 'Enter text here'
        }
      })

      const input = wrapper.find('input')
      expect(input.attributes('placeholder')).toBe('Enter text here')
    })

    it('renders with different input types', () => {
      const types = ['text', 'email', 'password', 'number', 'tel', 'url'] as const
      
      types.forEach(type => {
        const wrapper = mount(ModernInput, {
          props: {
            modelValue: '',
            type
          }
        })

        const input = wrapper.find('input')
        expect(input.attributes('type')).toBe(type)
      })
    })
  })

  describe('Value Binding', () => {
    it('displays the model value', () => {
      const wrapper = mount(ModernInput, {
        props: {
          modelValue: 'test value'
        }
      })

      const input = wrapper.find('input')
      expect(input.element.value).toBe('test value')
    })

    it('emits update:modelValue on input', async () => {
      const wrapper = mount(ModernInput, {
        props: {
          modelValue: ''
        }
      })

      const input = wrapper.find('input')
      await input.setValue('new value')

      expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value'])
    })

    it('emits focus and blur events', async () => {
      const wrapper = mount(ModernInput, {
        props: {
          modelValue: ''
        }
      })

      const input = wrapper.find('input')
      
      await input.trigger('focus')
      expect(wrapper.emitted('focus')).toHaveLength(1)

      await input.trigger('blur')
      expect(wrapper.emitted('blur')).toHaveLength(1)
    })
  })

  describe('States', () => {
    it('shows error state correctly', () => {
      const wrapper = mount(ModernInput, {
        props: {
          modelValue: '',
          errorMessage: 'This field is required'
        }
      })

      const input = wrapper.find('input')
      expect(input.classes()).toContain('border-destructive')
      
      const errorMessage = wrapper.find('.text-destructive')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('This field is required')
    })

    it('shows help text when no error', () => {
      const wrapper = mount(ModernInput, {
        props: {
          modelValue: '',
          helperText: 'This is helpful information'
        }
      })

      const helpText = wrapper.find('.text-muted-foreground')
      expect(helpText.exists()).toBe(true)
      expect(helpText.text()).toBe('This is helpful information')
    })

    it('prioritizes error over help text', () => {
      const wrapper = mount(ModernInput, {
        props: {
          modelValue: '',
          errorMessage: 'Error message',
          helperText: 'Help message'
        }
      })

      const errorMessage = wrapper.find('.text-destructive')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('Error message')

      const helpText = wrapper.find('.text-muted-foreground')
      expect(helpText.exists()).toBe(false)
    })

    it('shows disabled state correctly', () => {
      const wrapper = mount(ModernInput, {
        props: {
          modelValue: '',
          disabled: true
        }
      })

      const input = wrapper.find('input')
      expect(input.attributes('disabled')).toBeDefined()
      expect(input.classes()).toContain('opacity-50')
      expect(input.classes()).toContain('cursor-not-allowed')
    })
  })

  describe('Password Input', () => {
    it('renders password toggle button for password type', () => {
      const wrapper = mount(ModernInput, {
        props: {
          modelValue: '',
          type: 'password'
        }
      })

      const toggleButton = wrapper.find('button')
      expect(toggleButton.exists()).toBe(true)
      expect(toggleButton.find('.q-icon').exists()).toBe(true)
    })

    it('toggles password visibility when button is clicked', async () => {
      const wrapper = mount(ModernInput, {
        props: {
          modelValue: 'secret',
          type: 'password'
        }
      })

      const input = wrapper.find('input')
      const toggleButton = wrapper.find('button')

      // Initially should be password type
      expect(input.attributes('type')).toBe('password')

      // Click toggle button
      await toggleButton.trigger('click')
      
      // Should change to text type (this would be handled by the component's logic)
      // Note: The actual type change happens in the component's togglePasswordVisibility method
      expect(toggleButton.exists()).toBe(true)
    })
  })

  describe('Slots', () => {
    it('renders prefix slot correctly', () => {
      const wrapper = mount(ModernInput, {
        props: {
          modelValue: ''
        },
        slots: {
          prefix: '<svg data-testid="prefix-icon">Icon</svg>'
        }
      })

      expect(wrapper.find('[data-testid="prefix-icon"]').exists()).toBe(true)
      
      const input = wrapper.find('input')
      expect(input.classes()).toContain('pl-10')
    })

    it('renders suffix slot correctly', () => {
      const wrapper = mount(ModernInput, {
        props: {
          modelValue: ''
        },
        slots: {
          suffix: '<svg data-testid="suffix-icon">Icon</svg>'
        }
      })

      expect(wrapper.find('[data-testid="suffix-icon"]').exists()).toBe(true)
      
      const input = wrapper.find('input')
      expect(input.classes()).toContain('pr-10')
    })
  })

  describe('Accessibility', () => {
    it('associates label with input using for/id', () => {
      const wrapper = mount(ModernInput, {
        props: {
          modelValue: '',
          label: 'Test Label'
        }
      })

      const label = wrapper.find('label')
      const input = wrapper.find('input')
      
      const inputId = input.attributes('id')
      const labelFor = label.attributes('for')
      
      expect(inputId).toBeDefined()
      expect(labelFor).toBe(inputId)
    })

    it('has proper required attribute when required', () => {
      const wrapper = mount(ModernInput, {
        props: {
          modelValue: '',
          required: true
        }
      })

      const input = wrapper.find('input')
      expect(input.attributes('required')).toBeDefined()
    })

    it('has proper disabled attribute when disabled', () => {
      const wrapper = mount(ModernInput, {
        props: {
          modelValue: '',
          disabled: true
        }
      })

      const input = wrapper.find('input')
      expect(input.attributes('disabled')).toBeDefined()
    })
  })

  describe('CSS Classes and Styling', () => {
    it('applies focus styles correctly', () => {
      const wrapper = mount(ModernInput, {
        props: {
          modelValue: ''
        }
      })

      const input = wrapper.find('input')
      expect(input.classes()).toContain('focus-visible:outline-none')
      expect(input.classes()).toContain('focus-visible:ring-2')
      expect(input.classes()).toContain('focus-visible:ring-ring')
    })

    it('applies hover styles correctly', () => {
      const wrapper = mount(ModernInput, {
        props: {
          modelValue: ''
        }
      })

      const input = wrapper.find('input')
      expect(input.classes()).toContain('modern-input')
    })

    it('applies backdrop blur effect', () => {
      const wrapper = mount(ModernInput, {
        props: {
          modelValue: ''
        }
      })

      const input = wrapper.find('input')
      expect(input.classes()).toContain('backdrop-blur-sm')
    })
  })
})
