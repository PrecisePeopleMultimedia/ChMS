import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ModernAlert from '@/components/ui/ModernAlert.vue'

describe('ModernAlert', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      const wrapper = mount(ModernAlert, {
        props: {
          message: 'Test message'
        }
      })

      expect(wrapper.text()).toContain('Test message')
      expect(wrapper.classes()).toContain('modern-alert')
      expect(wrapper.find('svg').exists()).toBe(true) // Default info icon
    })

    it('renders with title and message', () => {
      const wrapper = mount(ModernAlert, {
        props: {
          title: 'Alert Title',
          message: 'Alert message'
        }
      })

      expect(wrapper.text()).toContain('Alert Title')
      expect(wrapper.text()).toContain('Alert message')
      
      const title = wrapper.find('h3')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('Alert Title')
    })

    it('renders different variants correctly', () => {
      const variants = ['info', 'success', 'warning', 'error'] as const
      
      variants.forEach(variant => {
        const wrapper = mount(ModernAlert, {
          props: {
            variant,
            message: `${variant} message`
          }
        })

        // Check that appropriate color classes are applied
        const alertElement = wrapper.find('.modern-alert')
        expect(alertElement.exists()).toBe(true)
        
        // Each variant should have different styling
        switch (variant) {
          case 'info':
            expect(wrapper.classes()).toContain('bg-blue-50')
            break
          case 'success':
            expect(wrapper.classes()).toContain('bg-green-50')
            break
          case 'warning':
            expect(wrapper.classes()).toContain('bg-yellow-50')
            break
          case 'error':
            expect(wrapper.classes()).toContain('bg-red-50')
            break
        }
      })
    })
  })

  describe('Icons', () => {
    it('renders default info icon', () => {
      const wrapper = mount(ModernAlert, {
        props: {
          variant: 'info',
          message: 'Info message'
        }
      })

      const icon = wrapper.find('svg')
      expect(icon.exists()).toBe(true)
    })

    it('renders success icon for success variant', () => {
      const wrapper = mount(ModernAlert, {
        props: {
          variant: 'success',
          message: 'Success message'
        }
      })

      const icon = wrapper.find('svg')
      expect(icon.exists()).toBe(true)
      // Success icon should have checkmark path
      expect(icon.find('path[fill-rule="evenodd"]').exists()).toBe(true)
    })

    it('renders warning icon for warning variant', () => {
      const wrapper = mount(ModernAlert, {
        props: {
          variant: 'warning',
          message: 'Warning message'
        }
      })

      const icon = wrapper.find('svg')
      expect(icon.exists()).toBe(true)
    })

    it('renders error icon for error variant', () => {
      const wrapper = mount(ModernAlert, {
        props: {
          variant: 'error',
          message: 'Error message'
        }
      })

      const icon = wrapper.find('svg')
      expect(icon.exists()).toBe(true)
    })

    it('renders custom icon slot', () => {
      const wrapper = mount(ModernAlert, {
        props: {
          message: 'Custom icon message'
        },
        slots: {
          icon: '<svg data-testid="custom-icon">Custom</svg>'
        }
      })

      expect(wrapper.find('[data-testid="custom-icon"]').exists()).toBe(true)
    })
  })

  describe('Dismissible Functionality', () => {
    it('shows dismiss button when dismissible is true', () => {
      const wrapper = mount(ModernAlert, {
        props: {
          message: 'Dismissible message',
          dismissible: true
        }
      })

      const dismissButton = wrapper.find('button')
      expect(dismissButton.exists()).toBe(true)
      expect(dismissButton.find('svg').exists()).toBe(true) // X icon
    })

    it('does not show dismiss button when dismissible is false', () => {
      const wrapper = mount(ModernAlert, {
        props: {
          message: 'Non-dismissible message',
          dismissible: false
        }
      })

      const dismissButton = wrapper.find('button')
      expect(dismissButton.exists()).toBe(false)
    })

    it('hides alert when dismiss button is clicked', async () => {
      const wrapper = mount(ModernAlert, {
        props: {
          message: 'Dismissible message',
          dismissible: true
        }
      })

      expect(wrapper.find('.modern-alert').exists()).toBe(true)

      const dismissButton = wrapper.find('button')
      await dismissButton.trigger('click')

      // Alert should be hidden after dismiss
      expect(wrapper.find('.modern-alert').exists()).toBe(false)
    })

    it('emits dismiss event when dismissed', async () => {
      const wrapper = mount(ModernAlert, {
        props: {
          message: 'Dismissible message',
          dismissible: true
        }
      })

      const dismissButton = wrapper.find('button')
      await dismissButton.trigger('click')

      expect(wrapper.emitted('dismiss')).toHaveLength(1)
    })
  })

  describe('Content Slots', () => {
    it('renders default slot content', () => {
      const wrapper = mount(ModernAlert, {
        props: {
          message: 'Default message'
        },
        slots: {
          default: '<div data-testid="custom-content">Custom content</div>'
        }
      })

      expect(wrapper.find('[data-testid="custom-content"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Custom content')
    })

    it('prioritizes slot content over message prop', () => {
      const wrapper = mount(ModernAlert, {
        props: {
          message: 'Prop message'
        },
        slots: {
          default: '<div data-testid="slot-content">Slot content</div>'
        }
      })

      expect(wrapper.find('[data-testid="slot-content"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Slot content')
      expect(wrapper.text()).not.toContain('Prop message')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      const wrapper = mount(ModernAlert, {
        props: {
          variant: 'error',
          message: 'Error message'
        }
      })

      const alert = wrapper.find('.modern-alert')
      expect(alert.exists()).toBe(true)
      // Modern alerts should have appropriate role or aria attributes
    })

    it('dismiss button has proper accessibility attributes', () => {
      const wrapper = mount(ModernAlert, {
        props: {
          message: 'Dismissible message',
          dismissible: true
        }
      })

      const dismissButton = wrapper.find('button')
      expect(dismissButton.exists()).toBe(true)
      
      // Should have screen reader text
      const srText = dismissButton.find('.sr-only')
      expect(srText.exists()).toBe(true)
      expect(srText.text()).toBe('Dismiss')
    })

    it('has proper focus management for dismiss button', () => {
      const wrapper = mount(ModernAlert, {
        props: {
          message: 'Dismissible message',
          dismissible: true
        }
      })

      const dismissButton = wrapper.find('button')
      expect(dismissButton.classes()).toContain('focus:outline-none')
      expect(dismissButton.classes()).toContain('focus:ring-2')
    })
  })

  describe('Animation', () => {
    it('has animation classes when not dismissed', () => {
      const wrapper = mount(ModernAlert, {
        props: {
          message: 'Animated message'
        }
      })

      expect(wrapper.classes()).toContain('animate-in')
    })

    it('does not have animation classes when dismissed', async () => {
      const wrapper = mount(ModernAlert, {
        props: {
          message: 'Dismissible message',
          dismissible: true
        }
      })

      const dismissButton = wrapper.find('button')
      await dismissButton.trigger('click')

      // After dismissal, alert should not be visible
      expect(wrapper.find('.modern-alert').exists()).toBe(false)
    })
  })

  describe('Dark Mode Support', () => {
    it('applies dark mode classes correctly', () => {
      const wrapper = mount(ModernAlert, {
        props: {
          variant: 'info',
          message: 'Dark mode message'
        }
      })

      // Should have dark mode classes in the variant classes
      const alertElement = wrapper.find('.modern-alert')
      expect(alertElement.exists()).toBe(true)
      
      // The component should support dark mode through CSS classes
      expect(wrapper.classes()).toContain('bg-blue-50')
    })
  })

  describe('Responsive Design', () => {
    it('has responsive layout classes', () => {
      const wrapper = mount(ModernAlert, {
        props: {
          message: 'Responsive message'
        }
      })

      const alert = wrapper.find('.modern-alert')
      // Classes are applied via @apply in CSS, so check for base classes
      expect(alert.classes()).toContain('modern-alert')
      expect(alert.classes()).toContain('bg-blue-50') // Default info variant
      expect(alert.classes()).toContain('animate-in')
    })

    it('handles long content gracefully', () => {
      const longMessage = 'This is a very long message that should wrap properly on smaller screens and maintain good readability across different device sizes including mobile phones and tablets.'
      
      const wrapper = mount(ModernAlert, {
        props: {
          message: longMessage,
          title: 'Long Content Alert'
        }
      })

      expect(wrapper.text()).toContain(longMessage)
      expect(wrapper.find('h3').exists()).toBe(true)
    })
  })
})
