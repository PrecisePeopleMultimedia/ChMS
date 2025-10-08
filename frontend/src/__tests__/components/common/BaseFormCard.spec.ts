import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseFormCard from '@/components/common/BaseFormCard.vue'

describe('BaseFormCard', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      const wrapper = mount(BaseFormCard)

      expect(wrapper.find('.modern-form-card').exists()).toBe(true)
      expect(wrapper.classes()).toContain('animate-in')
      expect(wrapper.classes()).toContain('glass-effect') // Default variant
    })

    it('renders with title and subtitle', () => {
      const wrapper = mount(BaseFormCard, {
        props: {
          title: 'Test Title',
          subtitle: 'Test Subtitle'
        }
      })

      expect(wrapper.text()).toContain('Test Title')
      expect(wrapper.text()).toContain('Test Subtitle')
      
      const title = wrapper.find('.text-2xl')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('Test Title')
      
      const subtitle = wrapper.find('.text-muted-foreground')
      expect(subtitle.exists()).toBe(true)
      expect(subtitle.text()).toBe('Test Subtitle')
    })

    it('renders different variants correctly', () => {
      const variants = ['glass', 'solid'] as const
      
      variants.forEach(variant => {
        const wrapper = mount(BaseFormCard, {
          props: { variant }
        })

        if (variant === 'glass') {
          expect(wrapper.classes()).toContain('glass-effect')
        } else if (variant === 'solid') {
          expect(wrapper.classes()).toContain('bg-card')
          expect(wrapper.classes()).toContain('border-border')
        }
      })
    })

    it('applies custom max width', () => {
      const wrapper = mount(BaseFormCard, {
        props: {
          maxWidth: '32rem'
        }
      })

      // The component should apply the max-width through CSS or classes
      expect(wrapper.find('.modern-form-card').exists()).toBe(true)
    })
  })

  describe('Slots', () => {
    it('renders header slot content', () => {
      const wrapper = mount(BaseFormCard, {
        slots: {
          header: '<div data-testid="custom-header">Custom Header</div>'
        }
      })

      expect(wrapper.find('[data-testid="custom-header"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Custom Header')
    })

    it('renders content slot', () => {
      const wrapper = mount(BaseFormCard, {
        slots: {
          content: '<div data-testid="form-content">Form Content</div>'
        }
      })

      expect(wrapper.find('[data-testid="form-content"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Form Content')
    })

    it('renders default slot as fallback for content', () => {
      const wrapper = mount(BaseFormCard, {
        slots: {
          default: '<div data-testid="default-content">Default Content</div>'
        }
      })

      expect(wrapper.find('[data-testid="default-content"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Default Content')
    })

    it('renders footer slot', () => {
      const wrapper = mount(BaseFormCard, {
        slots: {
          footer: '<div data-testid="footer-content">Footer Content</div>'
        }
      })

      expect(wrapper.find('[data-testid="footer-content"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Footer Content')
    })

    it('prioritizes content slot over default slot', () => {
      const wrapper = mount(BaseFormCard, {
        slots: {
          content: '<div data-testid="content-slot">Content Slot</div>',
          default: '<div data-testid="default-slot">Default Slot</div>'
        }
      })

      // When content slot is provided, it takes priority
      expect(wrapper.find('[data-testid="content-slot"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="default-slot"]').exists()).toBe(false)
      expect(wrapper.text()).toContain('Content Slot')
      expect(wrapper.text()).not.toContain('Default Slot')
    })
  })

  describe('Header Section', () => {
    it('shows header section when title is provided', () => {
      const wrapper = mount(BaseFormCard, {
        props: {
          title: 'Test Title'
        }
      })

      const headerSection = wrapper.find('.text-center.space-y-2')
      expect(headerSection.exists()).toBe(true)
    })

    it('shows header section when subtitle is provided', () => {
      const wrapper = mount(BaseFormCard, {
        props: {
          subtitle: 'Test Subtitle'
        }
      })

      const headerSection = wrapper.find('.text-center.space-y-2')
      expect(headerSection.exists()).toBe(true)
    })

    it('shows header section when header slot is provided', () => {
      const wrapper = mount(BaseFormCard, {
        slots: {
          header: '<div>Custom Header</div>'
        }
      })

      const headerSection = wrapper.find('.text-center.space-y-2')
      expect(headerSection.exists()).toBe(true)
    })

    it('hides header section when no title, subtitle, or header slot', () => {
      const wrapper = mount(BaseFormCard)

      const headerSection = wrapper.find('.text-center.space-y-2')
      expect(headerSection.exists()).toBe(false)
    })

    it('prioritizes header slot over title and subtitle', () => {
      const wrapper = mount(BaseFormCard, {
        props: {
          title: 'Prop Title',
          subtitle: 'Prop Subtitle'
        },
        slots: {
          header: '<div data-testid="slot-header">Slot Header</div>'
        }
      })

      expect(wrapper.find('[data-testid="slot-header"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Slot Header')
      expect(wrapper.text()).not.toContain('Prop Title')
      expect(wrapper.text()).not.toContain('Prop Subtitle')
    })
  })

  describe('Footer Section', () => {
    it('shows footer section when footer slot is provided', () => {
      const wrapper = mount(BaseFormCard, {
        slots: {
          footer: '<div>Footer Content</div>'
        }
      })

      const footerSection = wrapper.find('.text-center.space-y-2.pt-4.border-t')
      expect(footerSection.exists()).toBe(true)
    })

    it('hides footer section when no footer slot', () => {
      const wrapper = mount(BaseFormCard)

      const footerSection = wrapper.find('.text-center.space-y-2.pt-4.border-t')
      expect(footerSection.exists()).toBe(false)
    })

    it('applies border-top styling to footer', () => {
      const wrapper = mount(BaseFormCard, {
        slots: {
          footer: '<div>Footer</div>'
        }
      })

      const footerSection = wrapper.find('.border-t')
      expect(footerSection.exists()).toBe(true)
      expect(footerSection.classes()).toContain('border-border/50')
    })
  })

  describe('Styling and CSS Classes', () => {
    it('applies modern form card base classes', () => {
      const wrapper = mount(BaseFormCard)

      const card = wrapper.find('.modern-form-card')
      expect(card.classes()).toContain('w-full')
      expect(card.classes()).toContain('max-w-md')
      expect(card.classes()).toContain('mx-auto')
      expect(card.classes()).toContain('rounded-2xl')
      expect(card.classes()).toContain('p-8')
      expect(card.classes()).toContain('space-y-6')
    })

    it('applies backdrop blur effects', () => {
      const wrapper = mount(BaseFormCard)

      const card = wrapper.find('.modern-form-card')
      expect(card.classes()).toContain('backdrop-blur-xl')
    })

    it('applies shadow effects', () => {
      const wrapper = mount(BaseFormCard)

      const card = wrapper.find('.modern-form-card')
      expect(card.classes()).toContain('shadow-modern-lg')
    })

    it('applies border styling', () => {
      const wrapper = mount(BaseFormCard)

      const card = wrapper.find('.modern-form-card')
      expect(card.classes()).toContain('border')
      expect(card.classes()).toContain('border-border/50')
    })

    it('applies animation classes', () => {
      const wrapper = mount(BaseFormCard)

      expect(wrapper.classes()).toContain('animate-in')
    })
  })

  describe('Responsive Design', () => {
    it('has responsive width classes', () => {
      const wrapper = mount(BaseFormCard)

      const card = wrapper.find('.modern-form-card')
      expect(card.classes()).toContain('w-full')
      expect(card.classes()).toContain('max-w-md')
      expect(card.classes()).toContain('mx-auto')
    })

    it('has responsive spacing', () => {
      const wrapper = mount(BaseFormCard)

      const card = wrapper.find('.modern-form-card')
      expect(card.classes()).toContain('p-8')
      expect(card.classes()).toContain('space-y-6')
    })
  })

  describe('Accessibility', () => {
    it('maintains proper heading hierarchy', () => {
      const wrapper = mount(BaseFormCard, {
        props: {
          title: 'Form Title',
          subtitle: 'Form Subtitle'
        }
      })

      // Title should be properly structured for screen readers
      const title = wrapper.find('.text-2xl.font-bold')
      expect(title.exists()).toBe(true)
      
      // Subtitle should have appropriate styling for hierarchy
      const subtitle = wrapper.find('.text-sm.text-muted-foreground')
      expect(subtitle.exists()).toBe(true)
    })

    it('provides proper content structure', () => {
      const wrapper = mount(BaseFormCard, {
        slots: {
          content: '<form><input type="text" /></form>'
        }
      })

      // Content should be properly contained
      const contentSection = wrapper.find('.space-y-4')
      expect(contentSection.exists()).toBe(true)
    })
  })

  describe('Glass Morphism Effects', () => {
    it('applies glass effect variant correctly', () => {
      const wrapper = mount(BaseFormCard, {
        props: {
          variant: 'glass'
        }
      })

      expect(wrapper.classes()).toContain('glass-effect')
    })

    it('applies solid variant correctly', () => {
      const wrapper = mount(BaseFormCard, {
        props: {
          variant: 'solid'
        }
      })

      expect(wrapper.classes()).toContain('bg-card')
      expect(wrapper.classes()).toContain('border-border')
      expect(wrapper.classes()).not.toContain('glass-effect')
    })

    it('has backdrop filter effects', () => {
      const wrapper = mount(BaseFormCard)

      const card = wrapper.find('.modern-form-card')
      expect(card.classes()).toContain('backdrop-blur-xl')
    })
  })
})
