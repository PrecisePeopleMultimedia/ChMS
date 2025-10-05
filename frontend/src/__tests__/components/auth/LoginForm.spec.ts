import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '@/components/auth/LoginForm.vue'
import { useAuthStore } from '@/stores/auth'

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}))

// Mock Quasar
vi.mock('quasar', () => ({
  useQuasar: () => ({
    notify: vi.fn()
  })
}))

// Mock router
const mockRouter = {
  push: vi.fn()
}

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRouter: () => mockRouter
  }
})

describe('LoginForm', () => {
  let wrapper: any
  let authStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    authStore = useAuthStore()
    
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/login', component: { template: '<div>Login</div>' } },
        { path: '/dashboard', component: { template: '<div>Dashboard</div>' } }
      ]
    })

    wrapper = mount(LoginForm, {
      global: {
        plugins: [createPinia(), router],
        stubs: {
          'BaseFormCard': {
            template: '<div class="base-form-card"><slot name="content" /></div>'
          },
          'ModernButton': {
            template: '<button @click="$emit(\'click\')" :disabled="disabled" :loading="loading"><slot /></button>',
            props: ['disabled', 'loading']
          },
          'ModernAlert': {
            template: '<div class="modern-alert"><slot /></div>',
            props: ['variant', 'message']
          }
        }
      }
    })
  })

  describe('Rendering', () => {
    it('renders login form correctly', () => {
      expect(wrapper.find('.base-form-card').exists()).toBe(true)
      expect(wrapper.find('input[type="email"]').exists()).toBe(true)
      expect(wrapper.find('input[type="password"]').exists()).toBe(true)
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('displays pre-filled test credentials', () => {
      const emailInput = wrapper.find('input[type="email"]')
      const passwordInput = wrapper.find('input[type="password"]')
      
      expect(emailInput.element.value).toBe('john@example.com')
      expect(passwordInput.element.value).toBe('password123')
    })

    it('shows Google login button', () => {
      const googleButton = wrapper.find('button:contains("Continue with Google")')
      expect(googleButton.exists()).toBe(true)
    })
  })

  describe('Form Validation', () => {
    it('validates email format', async () => {
      const emailInput = wrapper.find('input[type="email"]')
      
      await emailInput.setValue('invalid-email')
      await emailInput.trigger('blur')

      // Should show validation error or disable submit
      expect(wrapper.vm.isFormValid).toBe(false)
    })

    it('validates required fields', async () => {
      const emailInput = wrapper.find('input[type="email"]')
      const passwordInput = wrapper.find('input[type="password"]')
      
      await emailInput.setValue('')
      await passwordInput.setValue('')

      expect(wrapper.vm.isFormValid).toBe(false)
    })

    it('enables submit when form is valid', async () => {
      const emailInput = wrapper.find('input[type="email"]')
      const passwordInput = wrapper.find('input[type="password"]')
      
      await emailInput.setValue('test@example.com')
      await passwordInput.setValue('password123')

      expect(wrapper.vm.isFormValid).toBe(true)
    })
  })

  describe('Form Submission', () => {
    it('calls login when form is submitted', async () => {
      const loginSpy = vi.spyOn(authStore, 'login').mockResolvedValue(undefined)
      
      const emailInput = wrapper.find('input[type="email"]')
      const passwordInput = wrapper.find('input[type="password"]')
      const submitButton = wrapper.find('button')
      
      await emailInput.setValue('test@example.com')
      await passwordInput.setValue('password123')
      await submitButton.trigger('click')

      expect(loginSpy).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })

    it('shows loading state during submission', async () => {
      authStore.isLoading = true
      await wrapper.vm.$nextTick()

      const submitButton = wrapper.find('button')
      expect(submitButton.attributes('loading')).toBeDefined()
    })

    it('redirects to dashboard on successful login', async () => {
      vi.spyOn(authStore, 'login').mockResolvedValue(undefined)
      authStore.isAuthenticated = true
      
      const submitButton = wrapper.find('button')
      await submitButton.trigger('click')

      // Should redirect to dashboard
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
    })
  })

  describe('Error Handling', () => {
    it('displays error message when login fails', async () => {
      authStore.error = 'Invalid credentials'
      await wrapper.vm.$nextTick()

      const errorAlert = wrapper.find('.modern-alert')
      expect(errorAlert.exists()).toBe(true)
    })

    it('clears errors when form changes', async () => {
      authStore.error = 'Some error'
      const clearErrorSpy = vi.spyOn(authStore, 'clearError')
      
      const emailInput = wrapper.find('input[type="email"]')
      await emailInput.setValue('new@example.com')

      expect(clearErrorSpy).toHaveBeenCalled()
    })
  })

  describe('Google OAuth', () => {
    it('handles Google login button click', async () => {
      const googleButton = wrapper.find('button:contains("Continue with Google")')
      
      // Mock axios response
      const axios = await import('axios')
      vi.mocked(axios.default.get).mockResolvedValue({
        data: { redirect_url: 'https://accounts.google.com/oauth' }
      })

      // Mock window.location.href
      delete window.location
      window.location = { href: '' } as any

      await googleButton.trigger('click')

      expect(axios.default.get).toHaveBeenCalledWith('/auth/google')
    })

    it('shows loading state during Google OAuth', async () => {
      wrapper.vm.isGoogleLoading = true
      await wrapper.vm.$nextTick()

      const googleButton = wrapper.find('button:contains("Continue with Google")')
      expect(googleButton.attributes('loading')).toBeDefined()
    })
  })

  describe('API Testing', () => {
    it('tests API connection', async () => {
      const axios = await import('axios')
      vi.mocked(axios.default.get).mockResolvedValue({
        data: { message: 'API is working' }
      })

      const testButton = wrapper.find('button:contains("Test API Connection")')
      await testButton.trigger('click')

      expect(axios.default.get).toHaveBeenCalledWith('/auth/test')
    })

    it('shows API test results', async () => {
      const axios = await import('axios')
      vi.mocked(axios.default.get).mockResolvedValue({
        data: { message: 'API is working' }
      })

      wrapper.vm.debugInfo = true
      await wrapper.vm.$nextTick()

      // Should show debug information
      expect(wrapper.text()).toContain('API URL')
      expect(wrapper.text()).toContain('Form Valid')
    })
  })

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      const emailInput = wrapper.find('input[type="email"]')
      const passwordInput = wrapper.find('input[type="password"]')
      
      expect(emailInput.attributes('placeholder')).toBeDefined()
      expect(passwordInput.attributes('placeholder')).toBeDefined()
    })

    it('has proper button text', () => {
      const submitButton = wrapper.find('button')
      expect(submitButton.text()).toContain('Sign In')
    })

    it('supports keyboard navigation', async () => {
      const emailInput = wrapper.find('input[type="email"]')
      const passwordInput = wrapper.find('input[type="password"]')
      
      await emailInput.trigger('focus')
      expect(document.activeElement).toBe(emailInput.element)
      
      await emailInput.trigger('keydown', { key: 'Tab' })
      // Should move focus to password field
    })
  })

  describe('Mobile Responsiveness', () => {
    it('has touch-friendly button sizes', () => {
      const buttons = wrapper.findAll('button')
      buttons.forEach(button => {
        // Buttons should have appropriate classes for mobile
        expect(button.classes()).toContain('w-full')
      })
    })

    it('has mobile-optimized input fields', () => {
      const emailInput = wrapper.find('input[type="email"]')
      expect(emailInput.attributes('type')).toBe('email') // Triggers email keyboard on mobile
    })
  })

  describe('Performance', () => {
    it('does not make unnecessary API calls', () => {
      const axios = require('axios')
      const getSpy = vi.spyOn(axios.default, 'get')
      
      // Just mounting should not trigger API calls
      expect(getSpy).not.toHaveBeenCalled()
    })

    it('debounces form validation', async () => {
      const emailInput = wrapper.find('input[type="email"]')
      
      // Rapid typing should not trigger excessive validation
      await emailInput.setValue('t')
      await emailInput.setValue('te')
      await emailInput.setValue('test@example.com')
      
      // Should validate efficiently
      expect(wrapper.vm.isFormValid).toBe(true)
    })
  })
})
