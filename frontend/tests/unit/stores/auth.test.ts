import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'

// Mock the API
vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    defaults: {
      headers: {
        common: {}
      }
    }
  }
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
vi.stubGlobal('localStorage', localStorageMock)

// Mock router
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn()
}
vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Authentication State Management', () => {
    it('should initialize with correct default state', () => {
      const store = useAuthStore()
      
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should restore authentication state from localStorage', () => {
      const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' }
      const mockToken = 'mock-jwt-token'
      
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'auth_user') return JSON.stringify(mockUser)
        if (key === 'auth_token') return mockToken
        return null
      })

      const store = useAuthStore()
      store.initializeAuth()

      expect(store.user).toEqual(mockUser)
      expect(store.token).toBe(mockToken)
      expect(store.isAuthenticated).toBe(true)
    })
  })

  describe('Login Functionality', () => {
    it('should login successfully with valid credentials', async () => {
      const credentials = { email: 'test@example.com', password: 'password123' }
      const mockResponse = {
        data: {
          user: { id: 1, email: 'test@example.com', name: 'Test User' },
          token: 'mock-jwt-token',
          expires_at: '2024-12-31T23:59:59Z'
        }
      }

      vi.mocked(api.post).mockResolvedValue(mockResponse)

      const store = useAuthStore()
      await store.login(credentials)

      expect(api.post).toHaveBeenCalledWith('/auth/login', credentials)
      expect(store.user).toEqual(mockResponse.data.user)
      expect(store.token).toBe(mockResponse.data.token)
      expect(store.isAuthenticated).toBe(true)
      expect(store.error).toBeNull()
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_user', JSON.stringify(mockResponse.data.user))
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', mockResponse.data.token)
    })

    it('should handle login failure with 401 error', async () => {
      const credentials = { email: 'test@example.com', password: 'wrongpassword' }
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Invalid credentials' }
        }
      }

      vi.mocked(api.post).mockRejectedValue(mockError)

      const store = useAuthStore()
      
      await expect(store.login(credentials)).rejects.toThrow()
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.error).toBe('Invalid credentials')
    })

    it('should handle login failure with validation errors', async () => {
      const credentials = { email: 'invalid-email', password: '123' }
      const mockError = {
        response: {
          status: 422,
          data: {
            message: 'Validation failed',
            errors: {
              email: ['Please enter a valid email address'],
              password: ['Password must be at least 6 characters']
            }
          }
        }
      }

      vi.mocked(api.post).mockRejectedValue(mockError)

      const store = useAuthStore()
      
      await expect(store.login(credentials)).rejects.toThrow()
      expect(store.error).toBe('Validation failed')
    })

    it('should handle network errors during login', async () => {
      const credentials = { email: 'test@example.com', password: 'password123' }
      const mockError = {
        code: 'NETWORK_ERROR',
        message: 'Network Error'
      }

      vi.mocked(api.post).mockRejectedValue(mockError)

      const store = useAuthStore()
      
      await expect(store.login(credentials)).rejects.toThrow()
      expect(store.error).toBe('Network error. Please check your connection.')
    })
  })

  describe('Registration Functionality', () => {
    it('should register successfully with valid data', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123'
      }
      const mockResponse = {
        data: {
          user: { id: 1, email: 'test@example.com', name: 'Test User' },
          token: 'mock-jwt-token',
          expires_at: '2024-12-31T23:59:59Z'
        }
      }

      vi.mocked(api.post).mockResolvedValue(mockResponse)

      const store = useAuthStore()
      await store.register(userData)

      expect(api.post).toHaveBeenCalledWith('/auth/register', userData)
      expect(store.user).toEqual(mockResponse.data.user)
      expect(store.token).toBe(mockResponse.data.token)
      expect(store.isAuthenticated).toBe(true)
    })

    it('should handle registration failure with existing email', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'existing@example.com',
        password: 'password123',
        password_confirmation: 'password123'
      }
      const mockError = {
        response: {
          status: 422,
          data: {
            message: 'The email has already been taken.',
            errors: {
              email: ['The email has already been taken.']
            }
          }
        }
      }

      vi.mocked(api.post).mockRejectedValue(mockError)

      const store = useAuthStore()
      
      await expect(store.register(userData)).rejects.toThrow()
      expect(store.error).toBe('The email has already been taken.')
    })
  })

  describe('Logout Functionality', () => {
    it('should logout successfully', async () => {
      const store = useAuthStore()
      // Set up authenticated state
      store.user = { id: 1, email: 'test@example.com', name: 'Test User' }
      store.token = 'mock-jwt-token'

      vi.mocked(api.post).mockResolvedValue({ data: {} })

      await store.logout()

      expect(api.post).toHaveBeenCalledWith('/auth/logout')
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_user')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token')
    })

    it('should clear local state even if logout API fails', async () => {
      const store = useAuthStore()
      // Set up authenticated state
      store.user = { id: 1, email: 'test@example.com', name: 'Test User' }
      store.token = 'mock-jwt-token'

      vi.mocked(api.post).mockRejectedValue(new Error('Network error'))

      await store.logout()

      // Should still clear local state
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_user')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token')
    })
  })

  describe('Google OAuth Functionality', () => {
    it('should handle Google login successfully', async () => {
      const googleToken = 'google-oauth-token'
      const mockResponse = {
        data: {
          user: { id: 1, email: 'test@example.com', name: 'Test User' },
          token: 'mock-jwt-token',
          expires_at: '2024-12-31T23:59:59Z'
        }
      }

      vi.mocked(api.post).mockResolvedValue(mockResponse)

      const store = useAuthStore()
      await store.googleLogin(googleToken)

      expect(api.post).toHaveBeenCalledWith('/auth/google/login', { token: googleToken })
      expect(store.user).toEqual(mockResponse.data.user)
      expect(store.token).toBe(mockResponse.data.token)
      expect(store.isAuthenticated).toBe(true)
    })

    it('should handle Google login failure', async () => {
      const googleToken = 'invalid-google-token'
      const mockError = {
        response: {
          status: 400,
          data: { message: 'Invalid Google token' }
        }
      }

      vi.mocked(api.post).mockRejectedValue(mockError)

      const store = useAuthStore()
      
      await expect(store.googleLogin(googleToken)).rejects.toThrow()
      expect(store.error).toBe('Invalid Google token')
    })
  })

  describe('Token Management', () => {
    it('should set auth header when token is set', () => {
      const store = useAuthStore()
      const token = 'mock-jwt-token'

      store.setAuthHeader(token)

      expect(api.defaults.headers.common['Authorization']).toBe(`Bearer ${token}`)
    })

    it('should clear auth header', () => {
      const store = useAuthStore()
      // First set a token
      api.defaults.headers.common['Authorization'] = 'Bearer mock-token'

      store.clearAuthHeader()

      expect(api.defaults.headers.common['Authorization']).toBeUndefined()
    })

    it('should refresh token successfully', async () => {
      const mockResponse = {
        data: {
          token: 'new-jwt-token',
          expires_at: '2024-12-31T23:59:59Z'
        }
      }

      vi.mocked(api.post).mockResolvedValue(mockResponse)

      const store = useAuthStore()
      await store.refreshToken()

      expect(api.post).toHaveBeenCalledWith('/auth/refresh')
      expect(store.token).toBe('new-jwt-token')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', 'new-jwt-token')
    })
  })

  describe('User Profile Management', () => {
    it('should fetch user profile successfully', async () => {
      const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' }
      const mockResponse = { data: mockUser }

      vi.mocked(api.get).mockResolvedValue(mockResponse)

      const store = useAuthStore()
      await store.fetchUser()

      expect(api.get).toHaveBeenCalledWith('/user')
      expect(store.user).toEqual(mockUser)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_user', JSON.stringify(mockUser))
    })

    it('should handle fetch user failure', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      }

      vi.mocked(api.get).mockRejectedValue(mockError)

      const store = useAuthStore()
      
      await expect(store.fetchUser()).rejects.toThrow()
      expect(store.error).toBe('Unauthorized')
    })
  })

  describe('Error Handling', () => {
    it('should clear error state', () => {
      const store = useAuthStore()
      store.error = 'Some error message'

      store.clearError()

      expect(store.error).toBeNull()
    })

    it('should set loading state during async operations', async () => {
      const store = useAuthStore()
      const credentials = { email: 'test@example.com', password: 'password123' }

      // Mock a delayed response
      vi.mocked(api.post).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ data: {} }), 100))
      )

      const loginPromise = store.login(credentials)
      
      // Should be loading immediately
      expect(store.isLoading).toBe(true)
      
      await loginPromise
      
      // Should not be loading after completion
      expect(store.isLoading).toBe(false)
    })
  })
})
