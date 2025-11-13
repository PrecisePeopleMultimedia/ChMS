import { ref, computed, readonly } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/services/api'
import type { User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const demoCredentials = ref<LoginCredentials | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || null)
  const isAdmin = computed(() => userRole.value === 'admin')
  const isStaff = computed(() => ['admin', 'staff'].includes(userRole.value || ''))

  // Actions
  const setAuthHeader = (authToken: string) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
  }

  const clearAuthHeader = () => {
    delete api.defaults.headers.common['Authorization']
  }

  const setToken = (authToken: string) => {
    token.value = authToken
    localStorage.setItem('auth_token', authToken)
    setAuthHeader(authToken)
  }

  const clearToken = () => {
    token.value = null
    localStorage.removeItem('auth_token')
    clearAuthHeader()
  }

  const setUser = (userData: User) => {
    user.value = userData
    // Cache user data for offline access
    localStorage.setItem('auth_user', JSON.stringify(userData))
  }

  const clearUser = () => {
    user.value = null
    localStorage.removeItem('auth_user')
  }

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await api.post<AuthResponse>('/auth/login', credentials)
      const { user: userData, token: authToken } = response.data

      setToken(authToken)
      setUser(userData)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await api.post<AuthResponse>('/auth/register', credentials)
      const { user: userData, token: authToken } = response.data

      setToken(authToken)
      setUser(userData)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      isLoading.value = true

      // Call logout API if token exists
      if (token.value) {
        await api.post('/auth/logout')
      }
    } catch (err) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', err)
    } finally {
      clearToken()
      clearUser()
      isLoading.value = false
    }
  }

  const fetchUser = async (): Promise<void> => {
    try {
      if (!token.value) return

      isLoading.value = true
      setAuthHeader(token.value)

      const response = await api.get<User>('/user')
      setUser(response.data)
    } catch (err: any) {
      // If token is invalid, clear auth data
      if (err.response?.status === 401) {
        clearToken()
        clearUser()
      }
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const refreshToken = async (): Promise<void> => {
    try {
      if (!token.value) return

      const response = await api.post<{ token: string, expires_at: string }>('/auth/refresh')
      setToken(response.data.token)
    } catch (err: any) {
      // If refresh fails, clear auth data
      clearToken()
      clearUser()
      throw err
    }
  }

  const googleLogin = async (googleToken: string): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await api.post<AuthResponse>('/auth/google/login', {
        token: googleToken
      })
      const { user: userData, token: authToken } = response.data

      setToken(authToken)
      setUser(userData)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Google login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const initializeAuth = async (): Promise<void> => {
    // Check for cached token
    const cachedToken = localStorage.getItem('auth_token')
    const cachedUser = localStorage.getItem('auth_user')

    if (cachedToken && cachedUser) {
      try {
        token.value = cachedToken
        user.value = JSON.parse(cachedUser)
        setAuthHeader(cachedToken)

        // Verify token is still valid with backend (with timeout)
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
        
        await Promise.race([fetchUser(), timeoutPromise])
      } catch (err) {
        console.warn('Auth initialization failed:', err)
        // Token is invalid, clear cached data
        clearToken()
        clearUser()
      }
    }
  }

  const hasRole = (role: string): boolean => {
    return userRole.value === role
  }

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.includes(userRole.value || '')
  }

  const clearError = () => {
    error.value = null
  }

  const setDemoCredentials = (credentials: LoginCredentials | null) => {
    demoCredentials.value = credentials
  }

  // Initialize auth on store creation
  if (token.value) {
    setAuthHeader(token.value)
  }

  return {
    // State
    user: readonly(user),
    token: readonly(token),
    isLoading: readonly(isLoading),
    error: readonly(error),
    demoCredentials: readonly(demoCredentials),

    // Getters
    isAuthenticated,
    userRole,
    isAdmin,
    isStaff,

    // Actions
    login,
    register,
    logout,
    fetchUser,
    refreshToken,
    googleLogin,
    initializeAuth,
    hasRole,
    hasAnyRole,
    clearError,
    setDemoCredentials,

    // Internal methods (exposed for testing)
    setToken,
    clearToken,
    setUser,
    clearUser,
    setAuthHeader,
    clearAuthHeader
  }
})
