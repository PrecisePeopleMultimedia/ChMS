import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { Quasar } from 'quasar'
import LoginForm from '@/components/auth/LoginForm.vue'
import { useAuthStore } from '@/stores/auth'

// Mock the API
vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn()
  }
}))

// Mock router
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn()
}
vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

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

// Mock accessibility composable
vi.mock('@/composables/useAccessibility', () => ({
  useAccessibility: () => ({
    announceToScreenReader: vi.fn()
  })
}))

describe('LoginForm Component', () => {
  let wrapper: VueWrapper<any>
  let authStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    authStore = useAuthStore()
    vi.clearAllMocks()
    
    // Mock environment variables
    vi.stubEnv('VITE_ENABLE_TEST_CREDENTIALS', 'false')
    vi.stubEnv('DEV', false)
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    vi.unstubAllEnvs()
  })

  const createWrapper = (props = {}) => {
    return mount(LoginForm, {
      props,
      global: {
        plugins: [
          createPinia(),
          [Quasar, {}]
        ],
        stubs: {
          'router-link': true,
          'BaseFormCard': {
            template: '<div><slot name="content"></slot><slot name="footer"></slot></div>'
          },
          'ModernButton': {
            template: '<button @click="$emit(\'click\')" :disabled="disabled" :loading="loading"><slot></slot></button>',
            props: ['disabled', 'loading']
          },
          'ModernAlert': {
            template: '<div class="alert"><slot></slot></div>'
          }
        }
      }
    })
  }

  describe('Component Rendering', () => {
    it('should render login form correctly', () => {
      wrapper = createWrapper()

      expect(wrapper.find('input[type="email"]').exists()).toBe(true)
      expect(wrapper.find('input[type="password"]').exists()).toBe(true)
      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.text()).toContain('Sign In')
    })

    it('should render Google login button', () => {
      wrapper = createWrapper()

      const googleButton = wrapper.find('button:contains("Continue with Google")')
      expect(googleButton.exists()).toBe(true)
    })

    it('should render remember me checkbox', () => {
      wrapper = createWrapper()

      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Remember me')
    })
  })

  describe('Form Validation', () => {
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('should validate email format correctly', async () => {
      const emailInput = wrapper.find('input[type="email"]')
      
      // Test invalid email
      await emailInput.setValue('invalid-email')
      await emailInput.trigger('blur')
      
      expect(wrapper.text()).toContain('Please enter a valid email address')
    })

    it('should validate email with consecutive dots', async () => {
      const emailInput = wrapper.find('input[type="email"]')
      
      await emailInput.setValue('test..user@example.com')
      await emailInput.trigger('blur')
      
      expect(wrapper.text()).toContain('Email cannot contain consecutive dots')
    })

    it('should validate email length', async () => {
      const emailInput = wrapper.find('input[type="email"]')
      
      // Create a very long email (over 254 characters)
      const longEmail = 'a'.repeat(250) + '@example.com'
      await emailInput.setValue(longEmail)
      await emailInput.trigger('blur')
      
      expect(wrapper.text()).toContain('Email address is too long')
    })

    it('should validate password length', async () => {
      const passwordInput = wrapper.find('input[type="password"]')
      
      // Test short password
      await passwordInput.setValue('123')
      await passwordInput.trigger('blur')
      
      expect(wrapper.text()).toContain('Password must be at least 6 characters')
    })

    it('should validate password maximum length', async () => {
      const passwordInput = wrapper.find('input[type="password"]')
      
      // Test very long password
      const longPassword = 'a'.repeat(130)
      await passwordInput.setValue(longPassword)
      await passwordInput.trigger('blur')
      
      expect(wrapper.text()).toContain('Password must be less than 128 characters')
    })

    it('should validate password with leading/trailing spaces', async () => {
      const passwordInput = wrapper.find('input[type="password"]')
      
      await passwordInput.setValue(' password123 ')
      await passwordInput.trigger('blur')
      
      expect(wrapper.text()).toContain('Password cannot start or end with spaces')
    })

    it('should disable submit button when form is invalid', async () => {
      const submitButton = wrapper.find('button:contains("Sign In")')
      
      // Initially should be disabled (empty form)
      expect(submitButton.attributes('disabled')).toBeDefined()
      
      // Fill with invalid data
      await wrapper.find('input[type="email"]').setValue('invalid-email')
      await wrapper.find('input[type="password"]').setValue('123')
      
      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    it('should enable submit button when form is valid', async () => {
      const submitButton = wrapper.find('button:contains("Sign In")')
      
      // Fill with valid data
      await wrapper.find('input[type="email"]').setValue('test@example.com')
      await wrapper.find('input[type="password"]').setValue('password123')
      
      expect(submitButton.attributes('disabled')).toBeUndefined()
    })
  })

  describe('Form Submission', () => {
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('should call login store method on form submission', async () => {
      const loginSpy = vi.spyOn(authStore, 'login').mockResolvedValue({})
      
      // Fill form with valid data
      await wrapper.find('input[type="email"]').setValue('test@example.com')
      await wrapper.find('input[type="password"]').setValue('password123')
      
      // Submit form
      await wrapper.find('button:contains("Sign In")').trigger('click')
      
      expect(loginSpy).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        remember: false
      })
    })

    it('should show loading state during submission', async () => {
      authStore.isLoading = true
      await wrapper.vm.$nextTick()
      
      const submitButton = wrapper.find('button:contains("Sign In")')
      expect(submitButton.attributes('loading')).toBeDefined()
      expect(submitButton.text()).toContain('Signing in...')
    })

    it('should handle login success', async () => {
      vi.spyOn(authStore, 'login').mockResolvedValue({})
      
      await wrapper.find('input[type="email"]').setValue('test@example.com')
      await wrapper.find('input[type="password"]').setValue('password123')
      await wrapper.find('button:contains("Sign In")').trigger('click')
      
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
    })

    it('should handle login failure with error notification', async () => {
      const error = new Error('Invalid credentials')
      error.response = {
        status: 401,
        data: { message: 'Invalid credentials' }
      }
      vi.spyOn(authStore, 'login').mockRejectedValue(error)
      
      await wrapper.find('input[type="email"]').setValue('test@example.com')
      await wrapper.find('input[type="password"]').setValue('password123')
      await wrapper.find('button:contains("Sign In")').trigger('click')
      
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'negative',
          message: expect.stringContaining('Invalid')
        })
      )
    })

    it('should handle network errors', async () => {
      const error = new Error('Network Error')
      error.code = 'NETWORK_ERROR'
      vi.spyOn(authStore, 'login').mockRejectedValue(error)
      
      await wrapper.find('input[type="email"]').setValue('test@example.com')
      await wrapper.find('input[type="password"]').setValue('password123')
      await wrapper.find('button:contains("Sign In")').trigger('click')
      
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'negative',
          message: expect.stringContaining('Network error')
        })
      )
    })
  })

  describe('Google OAuth', () => {
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('should handle Google login button click', async () => {
      // Mock the API response for Google OAuth
      const { api } = await import('@/services/api')
      vi.mocked(api.get).mockResolvedValue({
        data: { redirect_url: 'https://accounts.google.com/oauth2/auth' }
      })

      const googleButton = wrapper.find('button:contains("Continue with Google")')
      await googleButton.trigger('click')
      
      expect(api.get).toHaveBeenCalledWith('/auth/google')
    })

    it('should show loading state during Google OAuth', async () => {
      wrapper.vm.isGoogleLoading = true
      await wrapper.vm.$nextTick()
      
      const googleButton = wrapper.find('button:contains("Continue with Google")')
      expect(googleButton.attributes('loading')).toBeDefined()
      expect(googleButton.text()).toContain('Opening Google login...')
    })

    it('should handle Google OAuth configuration error', async () => {
      const { api } = await import('@/services/api')
      vi.mocked(api.get).mockResolvedValue({
        data: { redirect_url: null }
      })

      const googleButton = wrapper.find('button:contains("Continue with Google")')
      await googleButton.trigger('click')
      
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'negative',
          message: expect.stringContaining('not set up')
        })
      )
    })
  })

  describe('UX Improvements', () => {
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('should clear field errors when user starts typing', async () => {
      // Set initial field error
      wrapper.vm.fieldErrors = { email: 'Invalid email' }
      await wrapper.vm.$nextTick()
      
      // Start typing in email field
      const emailInput = wrapper.find('input[type="email"]')
      await emailInput.setValue('t')
      await emailInput.trigger('input')
      
      expect(wrapper.vm.fieldErrors.email).toBeUndefined()
    })

    it('should show form validation help text', async () => {
      // Fill partial form
      await wrapper.find('input[type="email"]').setValue('test@example.com')
      // Leave password empty
      
      expect(wrapper.text()).toContain('Please fill in all required fields')
    })

    it('should handle Enter key submission', async () => {
      const loginSpy = vi.spyOn(authStore, 'login').mockResolvedValue({})
      
      // Fill form with valid data
      await wrapper.find('input[type="email"]').setValue('test@example.com')
      await wrapper.find('input[type="password"]').setValue('password123')
      
      // Press Enter key
      await wrapper.find('input[type="password"]').trigger('keydown', { key: 'Enter' })
      
      expect(loginSpy).toHaveBeenCalled()
    })

    it('should not submit on Enter when form is invalid', async () => {
      const loginSpy = vi.spyOn(authStore, 'login').mockResolvedValue({})
      
      // Fill form with invalid data
      await wrapper.find('input[type="email"]').setValue('invalid-email')
      
      // Press Enter key
      await wrapper.find('input[type="email"]').trigger('keydown', { key: 'Enter' })
      
      expect(loginSpy).not.toHaveBeenCalled()
    })
  })

  describe('Security Features', () => {
    it('should not load test credentials in production', () => {
      vi.stubEnv('DEV', false)
      vi.stubEnv('VITE_ENABLE_TEST_CREDENTIALS', 'true')
      
      wrapper = createWrapper()
      
      expect(wrapper.find('input[type="email"]').element.value).toBe('')
      expect(wrapper.find('input[type="password"]').element.value).toBe('')
    })

    it('should load test credentials only in development when enabled', () => {
      vi.stubEnv('DEV', true)
      vi.stubEnv('VITE_ENABLE_TEST_CREDENTIALS', 'true')
      
      wrapper = createWrapper()
      
      expect(wrapper.find('input[type="email"]').element.value).toBe('john@example.com')
      expect(wrapper.find('input[type="password"]').element.value).toBe('password123')
    })

    it('should not load test credentials in development when disabled', () => {
      vi.stubEnv('DEV', true)
      vi.stubEnv('VITE_ENABLE_TEST_CREDENTIALS', 'false')
      
      wrapper = createWrapper()
      
      expect(wrapper.find('input[type="email"]').element.value).toBe('')
      expect(wrapper.find('input[type="password"]').element.value).toBe('')
    })
  })

  describe('Password Visibility Toggle', () => {
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('should toggle password visibility', async () => {
      const passwordInput = wrapper.find('input[type="password"]')
      const toggleButton = wrapper.find('[data-testid="password-toggle"]')
      
      expect(passwordInput.attributes('type')).toBe('password')
      
      await toggleButton.trigger('click')
      
      expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    })

    it('should announce password visibility changes to screen readers', async () => {
      const { useAccessibility } = await import('@/composables/useAccessibility')
      const { announceToScreenReader } = useAccessibility()
      
      const toggleButton = wrapper.find('[data-testid="password-toggle"]')
      await toggleButton.trigger('click')
      
      expect(announceToScreenReader).toHaveBeenCalledWith('Password is now visible')
    })
  })
})
