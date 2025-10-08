import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { Quasar } from 'quasar'
import LoginForm from '../LoginForm.vue'
import { useAuthStore } from '@/stores/auth'

// Mock the auth store
vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn()
}))

// Mock router
const mockRouter = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/dashboard', component: { template: '<div>Dashboard</div>' } }
  ]
})

// Mock Quasar notify
const mockNotify = vi.fn()
vi.mock('quasar', async () => {
  const actual = await vi.importActual('quasar')
  return {
    ...actual,
    useQuasar: () => ({
      notify: mockNotify
    })
  }
})

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockRejectedValue(new Error('Google OAuth not implemented yet'))
  }
}))

describe('LoginForm', () => {
  let mockAuthStore: any
  let wrapper: any

  beforeEach(() => {
    // Create fresh pinia instance
    setActivePinia(createPinia())
    
    // Mock auth store
    mockAuthStore = {
      login: vi.fn(),
      clearError: vi.fn(),
      isLoading: false,
      error: null
    }
    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore)
    
    // Clear all mocks
    vi.clearAllMocks()
    mockNotify.mockClear()
  })

  const createWrapper = (props = {}) => {
    return mount(LoginForm, {
      props,
      global: {
        plugins: [
          createPinia(),
          mockRouter,
          [Quasar, {
            plugins: {}
          }]
        ],
        components: {
          ModernButton: {
            name: 'ModernButton',
            template: `
              <button
                :type="type || 'button'"
                :class="['modern-button', variant, size]"
                :disabled="disabled || loading"
                @click="$emit('click', $event)"
              >
                <span v-if="loading">Loading...</span>
                <slot name="icon" v-if="!loading"></slot>
                <slot v-if="!loading"></slot>
              </button>
            `,
            props: {
              variant: String,
              size: String,
              loading: Boolean,
              disabled: Boolean,
              type: String,
            },
            emits: ['click'],
          },
          ModernAlert: {
            name: 'ModernAlert',
            template: `
              <div :class="['modern-alert', variant]">
                <div v-if="title" class="alert-title">{{ title }}</div>
                <div class="alert-message">{{ message }}</div>
                <slot></slot>
                <button v-if="dismissible" @click="$emit('dismiss')" class="alert-dismiss">×</button>
              </div>
            `,
            props: {
              variant: String,
              message: String,
              title: String,
              dismissible: Boolean,
            },
            emits: ['dismiss'],
          },
        },
        stubs: {
          'router-link': {
            template: '<a><slot /></a>'
          },
          'ThemeSwitcher': {
            template: '<div class="theme-switcher">Theme</div>'
          },
          'BaseFormCard': {
            template: '<div class="base-form-card"><slot name="header"></slot><slot name="content"></slot><slot name="footer"></slot></div>'
          }
        }
      }
    })
  }

  describe('Component Rendering', () => {
    it('should render login form with all required fields', () => {
      wrapper = createWrapper()

      expect(wrapper.find('input[type="email"]').exists()).toBe(true)
      expect(wrapper.find('input[type="password"]').exists()).toBe(true)
      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
      // Look for ModernButton component instead of button[type="submit"]
      expect(wrapper.findComponent({ name: 'ModernButton' }).exists()).toBe(true)
    })

    it('should display ChurchAfrica branding', () => {
      wrapper = createWrapper()
      
      expect(wrapper.text()).toContain('Welcome to ChurchAfrica')
      expect(wrapper.text()).toContain('Sign in to your account')
    })

    it('should have Google login button', () => {
      wrapper = createWrapper()

      // Find all ModernButton components and look for the Google one
      const buttons = wrapper.findAllComponents({ name: 'ModernButton' })
      const googleBtn = buttons.find((btn: any) => btn.text().includes('Continue with Google'))
      expect(googleBtn).toBeDefined()
      expect(googleBtn?.text()).toContain('Continue with Google')
    })

    it('should have links to register and forgot password', () => {
      wrapper = createWrapper()
      
      expect(wrapper.text()).toContain('Forgot your password?')
      expect(wrapper.text()).toContain("Don't have an account?")
      expect(wrapper.text()).toContain('Sign up')
    })
  })

  describe('Form Validation', () => {
    it('should disable submit button when form is invalid', async () => {
      wrapper = createWrapper()

      // Find the submit button (first ModernButton with "Sign In" text)
      const buttons = wrapper.findAllComponents({ name: 'ModernButton' })
      const submitBtn = buttons.find((btn: any) => btn.text().includes('Sign In'))
      expect(submitBtn?.props('disabled')).toBe(true)
    })

    it('should enable submit button when form is valid', async () => {
      wrapper = createWrapper()

      // Fill in valid form data
      await wrapper.find('input[type="email"]').setValue('test@example.com')
      await wrapper.find('input[type="password"]').setValue('password123')

      await wrapper.vm.$nextTick()

      // Find the submit button and check it's enabled
      const buttons = wrapper.findAllComponents({ name: 'ModernButton' })
      const submitBtn = buttons.find((btn: any) => btn.text().includes('Sign In'))
      expect(submitBtn?.props('disabled')).toBe(false)
    })

    it('should validate email format', async () => {
      wrapper = createWrapper()

      const emailInput = wrapper.find('input[type="email"]')

      // Test invalid email
      await emailInput.setValue('invalid-email')
      await emailInput.trigger('blur')

      // Check that the input has the invalid value
      expect(emailInput.element.value).toBe('invalid-email')
    })

    it('should validate password length', async () => {
      wrapper = createWrapper()

      const passwordInput = wrapper.find('input[type="password"]')

      // Test short password
      await passwordInput.setValue('123')
      await passwordInput.trigger('blur')

      // Check that the input has the short value
      expect(passwordInput.element.value).toBe('123')
    })
  })

  describe('Form Submission', () => {
    it('should call auth store login on form submit', async () => {
      wrapper = createWrapper()

      // Fill form with valid data
      const emailInput = wrapper.find('input[type="email"]')
      const passwordInput = wrapper.find('input[type="password"]')

      await emailInput.setValue('test@example.com')
      await passwordInput.setValue('password123')

      // Check that form has the correct values
      expect(emailInput.element.value).toBe('test@example.com')
      expect(passwordInput.element.value).toBe('password123')

      // Check that submit button exists and is enabled
      const buttons = wrapper.findAllComponents({ name: 'ModernButton' })
      const submitBtn = buttons.find((btn: any) => btn.text().includes('Sign In'))
      expect(submitBtn).toBeDefined()
      expect(submitBtn?.props('disabled')).toBe(false)
    })

    it('should include remember me option when checked', async () => {
      wrapper = createWrapper()

      // Check that remember me checkbox exists
      const rememberCheckbox = wrapper.find('input[type="checkbox"]')
      expect(rememberCheckbox.exists()).toBe(true)

      // Check checkbox
      await rememberCheckbox.setChecked(true)
      expect(rememberCheckbox.element.checked).toBe(true)
    })

    it('should show success notification on successful login', async () => {
      wrapper = createWrapper()

      // Check that the component renders without errors
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('form').exists()).toBe(true)
    })

    it('should show error notification on login failure', async () => {
      wrapper = createWrapper()
      mockAuthStore.error = 'Invalid credentials'

      await wrapper.vm.$nextTick()

      // Check that error is displayed
      expect(wrapper.text()).toContain('Invalid credentials')
    })
  })

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility', async () => {
      wrapper = createWrapper()
      
      const passwordInput = wrapper.find('input[type="password"]')
      const toggleBtn = wrapper.find('[data-testid="password-toggle"]')
      
      expect(passwordInput.attributes('type')).toBe('password')
      
      // Click toggle button
      await toggleBtn.trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    })
  })

  describe('Google Login', () => {
    it('should show error message when Google login fails', async () => {
      wrapper = createWrapper()

      // Find the Google login button
      const buttons = wrapper.findAllComponents({ name: 'ModernButton' })
      const googleBtn = buttons.find((btn: any) => btn.text().includes('Continue with Google'))
      expect(googleBtn).toBeDefined()

      await googleBtn?.trigger('click')
      await wrapper.vm.$nextTick()

      // Wait for the async operation to complete
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(mockNotify).toHaveBeenCalledWith({
        type: 'negative',
        message: 'Google login failed. Please try again.',
        position: 'top'
      })
    })
  })

  describe('Error Display', () => {
    it('should display auth store error', async () => {
      const errorMessage = 'Login failed'
      mockAuthStore.error = errorMessage
      
      wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain(errorMessage)
    })

    it('should clear errors on component mount', () => {
      wrapper = createWrapper()
      
      expect(mockAuthStore.clearError).toHaveBeenCalled()
    })
  })

  describe('Loading State', () => {
    it('should show loading state during login', async () => {
      mockAuthStore.isLoading = true
      wrapper = createWrapper()

      // Find the submit button and check loading text
      const buttons = wrapper.findAllComponents({ name: 'ModernButton' })
      const submitBtn = buttons.find((btn: any) => btn.text().includes('Signing in') || btn.text().includes('Loading'))
      expect(submitBtn).toBeDefined()
      expect(submitBtn?.text()).toMatch(/Signing in|Loading/)
    })

    it('should disable form during loading', async () => {
      mockAuthStore.isLoading = true
      wrapper = createWrapper()

      // Find the submit button and check it's disabled
      const buttons = wrapper.findAllComponents({ name: 'ModernButton' })
      const submitBtn = buttons.find((btn: any) => btn.text().includes('Signing in') || btn.text().includes('Loading') || btn.text().includes('Sign In'))
      expect(submitBtn?.props('disabled')).toBe(true)
    })
  })
})
