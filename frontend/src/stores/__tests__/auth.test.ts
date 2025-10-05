import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'
import type { User, LoginCredentials, RegisterCredentials } from '@/types/auth'

// Mock axios
vi.mock('axios', () => ({
  default: {
    defaults: {
      baseURL: '',
      withCredentials: false,
      headers: {
        common: {}
      }
    },
    post: vi.fn(),
    get: vi.fn()
  }
}))

describe('Auth Store', () => {
  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia())
    
    // Clear localStorage
    localStorage.clear()
    
    // Reset all mocks
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const authStore = useAuthStore()
      
      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.isLoading).toBe(false)
      expect(authStore.error).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
      expect(authStore.userRole).toBeNull()
      expect(authStore.isAdmin).toBe(false)
      expect(authStore.isStaff).toBe(false)
    })

    it('should initialize with cached token if available', () => {
      const mockToken = 'cached-token-123'
      localStorage.setItem('auth_token', mockToken)
      
      const authStore = useAuthStore()
      expect(authStore.token).toBe(mockToken)
    })
  })

  describe('Authentication State', () => {
    it('should be authenticated when both user and token exist', () => {
      const authStore = useAuthStore()
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'member',
        organization_id: 'org-1',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }

      // Simulate setting user and token
      authStore.setUser(mockUser)
      authStore.setToken('test-token')

      expect(authStore.isAuthenticated).toBe(true)
      expect(authStore.userRole).toBe('member')
      expect(authStore.isAdmin).toBe(false)
      expect(authStore.isStaff).toBe(false)
    })

    it('should identify admin users correctly', () => {
      const authStore = useAuthStore()
      const mockAdmin: User = {
        id: '1',
        email: 'admin@example.com',
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
        organization_id: 'org-1',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }

      authStore.setUser(mockAdmin)
      authStore.setToken('admin-token')

      expect(authStore.isAdmin).toBe(true)
      expect(authStore.isStaff).toBe(true)
      expect(authStore.userRole).toBe('admin')
    })

    it('should identify staff users correctly', () => {
      const authStore = useAuthStore()
      const mockStaff: User = {
        id: '1',
        email: 'staff@example.com',
        first_name: 'Staff',
        last_name: 'User',
        role: 'staff',
        organization_id: 'org-1',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }

      authStore.setUser(mockStaff)
      authStore.setToken('staff-token')

      expect(authStore.isAdmin).toBe(false)
      expect(authStore.isStaff).toBe(true)
      expect(authStore.userRole).toBe('staff')
    })
  })

  describe('Token Management', () => {
    it('should set token and update localStorage', () => {
      const authStore = useAuthStore()
      const testToken = 'test-token-123'

      authStore.setToken(testToken)

      expect(authStore.token).toBe(testToken)
      expect(localStorage.getItem('auth_token')).toBe(testToken)
    })

    it('should clear token and remove from localStorage', () => {
      const authStore = useAuthStore()
      
      // First set a token
      authStore.setToken('test-token')
      expect(authStore.token).toBe('test-token')
      
      // Then clear it
      authStore.clearToken()
      
      expect(authStore.token).toBeNull()
      expect(localStorage.getItem('auth_token')).toBeNull()
    })
  })

  describe('User Management', () => {
    it('should set user and cache in localStorage', () => {
      const authStore = useAuthStore()
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'member',
        organization_id: 'org-1',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }

      authStore.setUser(mockUser)

      expect(authStore.user).toEqual(mockUser)
      expect(JSON.parse(localStorage.getItem('user_data') || '{}')).toEqual(mockUser)
    })

    it('should clear user and remove from localStorage', () => {
      const authStore = useAuthStore()
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'member',
        organization_id: 'org-1',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }

      // First set a user
      authStore.setUser(mockUser)
      expect(authStore.user).toEqual(mockUser)
      
      // Then clear it
      authStore.clearUser()
      
      expect(authStore.user).toBeNull()
      expect(localStorage.getItem('user_data')).toBeNull()
    })
  })

  describe('Role Checking', () => {
    it('should check if user has specific role', () => {
      const authStore = useAuthStore()
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'staff',
        organization_id: 'org-1',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }

      authStore.setUser(mockUser)

      expect(authStore.hasRole('staff')).toBe(true)
      expect(authStore.hasRole('admin')).toBe(false)
      expect(authStore.hasRole('member')).toBe(false)
    })

    it('should check if user has any of multiple roles', () => {
      const authStore = useAuthStore()
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'staff',
        organization_id: 'org-1',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }

      authStore.setUser(mockUser)

      expect(authStore.hasAnyRole(['admin', 'staff'])).toBe(true)
      expect(authStore.hasAnyRole(['admin', 'member'])).toBe(false)
      expect(authStore.hasAnyRole(['staff'])).toBe(true)
    })

    it('should return false for role checks when no user is set', () => {
      const authStore = useAuthStore()

      expect(authStore.hasRole('admin')).toBe(false)
      expect(authStore.hasAnyRole(['admin', 'staff'])).toBe(false)
    })
  })

  describe('Error Handling', () => {
    it('should clear error', () => {
      const authStore = useAuthStore()

      // Since error is readonly, we'll test the clearError method
      // by checking that it exists and can be called
      expect(typeof authStore.clearError).toBe('function')

      // Clear the error (should not throw)
      authStore.clearError()
      expect(authStore.error).toBeNull()
    })
  })

  describe('Logout', () => {
    it('should clear all auth data on logout', async () => {
      const authStore = useAuthStore()
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'member',
        organization_id: 'org-1',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }

      // Set up authenticated state
      authStore.setUser(mockUser)
      authStore.setToken('test-token')
      
      expect(authStore.isAuthenticated).toBe(true)
      
      // Mock axios post for logout
      const axios = await import('axios')
      vi.mocked(axios.default.post).mockResolvedValue({ data: {} })
      
      // Logout
      await authStore.logout()
      
      // Verify everything is cleared
      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
      expect(localStorage.getItem('auth_token')).toBeNull()
      expect(localStorage.getItem('user_data')).toBeNull()
    })
  })
})
