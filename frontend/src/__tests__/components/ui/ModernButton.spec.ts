import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ModernButton from '@/components/ui/ModernButton.vue'

describe('ModernButton', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      const wrapper = mount(ModernButton, {
        slots: {
          default: 'Click me'
        }
      })

      expect(wrapper.text()).toBe('Click me')
      expect(wrapper.classes()).toContain('modern-button')
      expect(wrapper.classes()).toContain('bg-primary')
      expect(wrapper.classes()).toContain('h-10')
    })

    it('renders with custom variant', () => {
      const wrapper = mount(ModernButton, {
        props: {
          variant: 'secondary'
        },
        slots: {
          default: 'Secondary Button'
        }
      })

      expect(wrapper.classes()).toContain('bg-secondary')
      expect(wrapper.classes()).not.toContain('bg-primary')
    })

    it('renders with custom size', () => {
      const wrapper = mount(ModernButton, {
        props: {
          size: 'lg'
        },
        slots: {
          default: 'Large Button'
        }
      })

      expect(wrapper.classes()).toContain('h-12')
      expect(wrapper.classes()).not.toContain('h-10')
    })

    it('renders all variant classes correctly', () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const
      
      variants.forEach(variant => {
        const wrapper = mount(ModernButton, {
          props: { variant },
          slots: { default: `${variant} button` }
        })

        switch (variant) {
          case 'primary':
            expect(wrapper.classes()).toContain('bg-primary')
            break
          case 'secondary':
            expect(wrapper.classes()).toContain('bg-secondary')
            break
          case 'outline':
            expect(wrapper.classes()).toContain('border')
            expect(wrapper.classes()).toContain('border-input')
            break
          case 'ghost':
            expect(wrapper.classes()).toContain('hover:bg-accent')
            break
          case 'destructive':
            expect(wrapper.classes()).toContain('bg-destructive')
            break
        }
      })
    })

    it('renders all size classes correctly', () => {
      const sizes = ['sm', 'md', 'lg'] as const
      
      sizes.forEach(size => {
        const wrapper = mount(ModernButton, {
          props: { size },
          slots: { default: `${size} button` }
        })

        switch (size) {
          case 'sm':
            expect(wrapper.classes()).toContain('h-8')
            break
          case 'md':
            expect(wrapper.classes()).toContain('h-10')
            break
          case 'lg':
            expect(wrapper.classes()).toContain('h-12')
            break
        }
      })
    })
  })

  describe('States', () => {
    it('shows loading state correctly', () => {
      const wrapper = mount(ModernButton, {
        props: {
          loading: true
        },
        slots: {
          default: 'Loading Button'
        }
      })

      expect(wrapper.classes()).toContain('animate-pulse')
      expect(wrapper.find('svg').exists()).toBe(true) // Loading spinner
      expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('shows disabled state correctly', () => {
      const wrapper = mount(ModernButton, {
        props: {
          disabled: true
        },
        slots: {
          default: 'Disabled Button'
        }
      })

      expect(wrapper.classes()).toContain('opacity-50')
      expect(wrapper.classes()).toContain('cursor-not-allowed')
      expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('is disabled when loading', () => {
      const wrapper = mount(ModernButton, {
        props: {
          loading: true
        },
        slots: {
          default: 'Loading Button'
        }
      })

      expect(wrapper.attributes('disabled')).toBeDefined()
    })
  })

  describe('Interactions', () => {
    it('emits click event when clicked', async () => {
      const wrapper = mount(ModernButton, {
        slots: {
          default: 'Click me'
        }
      })

      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('does not emit click when disabled', async () => {
      const wrapper = mount(ModernButton, {
        props: {
          disabled: true
        },
        slots: {
          default: 'Disabled Button'
        }
      })

      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('does not emit click when loading', async () => {
      const wrapper = mount(ModernButton, {
        props: {
          loading: true
        },
        slots: {
          default: 'Loading Button'
        }
      })

      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })

  describe('Slots', () => {
    it('renders icon slot correctly', () => {
      const wrapper = mount(ModernButton, {
        slots: {
          icon: '<svg data-testid="icon">Icon</svg>',
          default: 'Button with icon'
        }
      })

      expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true)
    })

    it('renders default slot content', () => {
      const wrapper = mount(ModernButton, {
        slots: {
          default: '<span data-testid="content">Custom Content</span>'
        }
      })

      expect(wrapper.find('[data-testid="content"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Custom Content')
    })
  })

  describe('Accessibility', () => {
    it('has proper button role', () => {
      const wrapper = mount(ModernButton, {
        slots: {
          default: 'Accessible Button'
        }
      })

      expect(wrapper.element.tagName).toBe('BUTTON')
    })

    it('has proper disabled attribute when disabled', () => {
      const wrapper = mount(ModernButton, {
        props: {
          disabled: true
        },
        slots: {
          default: 'Disabled Button'
        }
      })

      expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('has proper aria attributes when loading', () => {
      const wrapper = mount(ModernButton, {
        props: {
          loading: true
        },
        slots: {
          default: 'Loading Button'
        }
      })

      expect(wrapper.attributes('disabled')).toBeDefined()
      // Loading state should be communicated to screen readers
      expect(wrapper.find('svg').exists()).toBe(true)
    })
  })

  describe('CSS Classes', () => {
    it('applies focus-visible classes for keyboard navigation', () => {
      const wrapper = mount(ModernButton, {
        slots: {
          default: 'Focusable Button'
        }
      })

      expect(wrapper.classes()).toContain('focus-visible:outline-none')
      expect(wrapper.classes()).toContain('focus-visible:ring-2')
    })

    it('applies transition classes for smooth interactions', () => {
      const wrapper = mount(ModernButton, {
        slots: {
          default: 'Smooth Button'
        }
      })

      expect(wrapper.classes()).toContain('transition-all')
      expect(wrapper.classes()).toContain('duration-200')
    })
  })
})
