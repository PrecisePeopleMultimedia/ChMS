import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    defaults: {
      headers: {
        common: {}
      }
    }
  }
}))

const mockedAxios = vi.mocked(axios)

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('has correct initial state', () => {
      const authStore = useAuthStore()

      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.isLoading).toBe(false)
      expect(authStore.error).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
    })
  })

  describe('Computed Properties', () => {
    it('isAuthenticated returns true when user and token exist', () => {
      const authStore = useAuthStore()
      
      // Set user and token
      authStore.user = { id: 1, name: 'Test User', email: 'test@example.com' }
      authStore.token = 'test-token'

      expect(authStore.isAuthenticated).toBe(true)
    })

    it('isAuthenticated returns false when user or token is missing', () => {
      const authStore = useAuthStore()
      
      // Only user, no token
      authStore.user = { id: 1, name: 'Test User', email: 'test@example.com' }
      expect(authStore.isAuthenticated).toBe(false)

      // Only token, no user
      authStore.user = null
      authStore.token = 'test-token'
      expect(authStore.isAuthenticated).toBe(false)
    })

    it('isAdmin returns true for admin users', () => {
      const authStore = useAuthStore()
      
      authStore.user = { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' }
      expect(authStore.isAdmin).toBe(true)
    })

    it('isStaff returns true for admin and staff users', () => {
      const authStore = useAuthStore()
      
      // Admin user
      authStore.user = { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' }
      expect(authStore.isStaff).toBe(true)

      // Staff user
      authStore.user = { id: 2, name: 'Staff', email: 'staff@example.com', role: 'staff' }
      expect(authStore.isStaff).toBe(true)

      // Regular member
      authStore.user = { id: 3, name: 'Member', email: 'member@example.com', role: 'member' }
      expect(authStore.isStaff).toBe(false)
    })
  })

  describe('Login', () => {
    it('successfully logs in user', async () => {
      const authStore = useAuthStore()
      const mockResponse = {
        data: {
          user: { id: 1, name: 'Test User', email: 'test@example.com' },
          token: 'test-token'
        }
      }

      mockedAxios.post.mockResolvedValueOnce(mockResponse)

      await authStore.login({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(authStore.user).toEqual(mockResponse.data.user)
      expect(authStore.token).toBe('test-token')
      expect(authStore.isAuthenticated).toBe(true)
      expect(authStore.error).toBeNull()
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', 'test-token')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_user', JSON.stringify(mockResponse.data.user))
    })

    it('handles login failure', async () => {
      const authStore = useAuthStore()
      const errorMessage = 'Invalid credentials'
      
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          data: { message: errorMessage }
        }
      })

      await authStore.login({
        email: 'test@example.com',
        password: 'wrongpassword'
      })

      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
      expect(authStore.error).toBe(errorMessage)
    })

    it('sets loading state during login', async () => {
      const authStore = useAuthStore()
      let loadingDuringRequest = false

      mockedAxios.post.mockImplementationOnce(() => {
        loadingDuringRequest = authStore.isLoading
        return Promise.resolve({
          data: {
            user: { id: 1, name: 'Test User', email: 'test@example.com' },
            token: 'test-token'
          }
        })
      })

      await authStore.login({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(loadingDuringRequest).toBe(true)
      expect(authStore.isLoading).toBe(false)
    })
  })

  describe('Register', () => {
    it('successfully registers user', async () => {
      const authStore = useAuthStore()
      const mockResponse = {
        data: {
          user: { id: 1, name: 'New User', email: 'new@example.com' },
          token: 'new-token'
        }
      }

      mockedAxios.post.mockResolvedValueOnce(mockResponse)

      await authStore.register({
        first_name: 'New',
        last_name: 'User',
        email: 'new@example.com',
        password: 'password123',
        password_confirmation: 'password123'
      })

      expect(authStore.user).toEqual(mockResponse.data.user)
      expect(authStore.token).toBe('new-token')
      expect(authStore.isAuthenticated).toBe(true)
      expect(authStore.error).toBeNull()
    })

    it('handles registration failure', async () => {
      const authStore = useAuthStore()
      const errorMessage = 'Email already exists'
      
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          data: { message: errorMessage }
        }
      })

      await authStore.register({
        first_name: 'New',
        last_name: 'User',
        email: 'existing@example.com',
        password: 'password123',
        password_confirmation: 'password123'
      })

      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.error).toBe(errorMessage)
    })
  })

  describe('Logout', () => {
    it('successfully logs out user', async () => {
      const authStore = useAuthStore()
      
      // Set initial authenticated state
      authStore.user = { id: 1, name: 'Test User', email: 'test@example.com' }
      authStore.token = 'test-token'

      mockedAxios.post.mockResolvedValueOnce({ data: { message: 'Logged out' } })

      await authStore.logout()

      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_user')
    })

    it('clears state even if API call fails', async () => {
      const authStore = useAuthStore()
      
      // Set initial authenticated state
      authStore.user = { id: 1, name: 'Test User', email: 'test@example.com' }
      authStore.token = 'test-token'

      mockedAxios.post.mockRejectedValueOnce(new Error('Network error'))

      await authStore.logout()

      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
    })
  })

  describe('Token Management', () => {
    it('initializes auth from localStorage', async () => {
      const mockUser = { id: 1, name: 'Stored User', email: 'stored@example.com' }
      const mockToken = 'stored-token'

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'auth_token') return mockToken
        if (key === 'auth_user') return JSON.stringify(mockUser)
        return null
      })

      mockedAxios.get.mockResolvedValueOnce({
        data: { user: mockUser }
      })

      const authStore = useAuthStore()
      await authStore.initializeAuth()

      expect(authStore.token).toBe(mockToken)
      expect(authStore.user).toEqual(mockUser)
      expect(authStore.isAuthenticated).toBe(true)
    })

    it('clears invalid token from localStorage', async () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'auth_token') return 'invalid-token'
        if (key === 'auth_user') return JSON.stringify({ id: 1, name: 'User' })
        return null
      })

      mockedAxios.get.mockRejectedValueOnce({
        response: { status: 401 }
      })

      const authStore = useAuthStore()
      await authStore.initializeAuth()

      expect(authStore.token).toBeNull()
      expect(authStore.user).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_user')
    })
  })

  describe('Role Management', () => {
    it('hasRole returns correct boolean for user roles', () => {
      const authStore = useAuthStore()
      
      authStore.user = { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' }

      expect(authStore.hasRole('admin')).toBe(true)
      expect(authStore.hasRole('staff')).toBe(false)
      expect(authStore.hasRole('member')).toBe(false)
    })

    it('hasRole returns false when user is not authenticated', () => {
      const authStore = useAuthStore()

      expect(authStore.hasRole('admin')).toBe(false)
      expect(authStore.hasRole('member')).toBe(false)
    })
  })

  describe('Error Handling', () => {
    it('clears error when clearError is called', () => {
      const authStore = useAuthStore()
      
      authStore.error = 'Some error'
      authStore.clearError()

      expect(authStore.error).toBeNull()
    })

    it('handles network errors gracefully', async () => {
      const authStore = useAuthStore()
      
      mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'))

      await authStore.login({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(authStore.error).toBe('Network error occurred')
      expect(authStore.isAuthenticated).toBe(false)
    })
  })
})
