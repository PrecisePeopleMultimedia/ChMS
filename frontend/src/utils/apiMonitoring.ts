import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { usePerformance } from '@/composables/usePerformance'

// Create performance tracking instance
const { trackAPICall } = usePerformance()

/**
 * API monitoring interceptor for automatic performance tracking
 */
export function setupAPIMonitoring() {
  // Request interceptor
  axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add timestamp for performance tracking
      ;(config as any).metadata = { startTime: Date.now() }
      return config
    },
    (error) => {
      console.error('Request error:', error)
      return Promise.reject(error)
    }
  )

  // Response interceptor
  axios.interceptors.response.use(
    (response: AxiosResponse) => {
      const config = response.config as InternalAxiosRequestConfig & { metadata?: { startTime: number } }
      const duration = Date.now() - (config.metadata?.startTime || 0)
      
      // Track API performance
      trackAPICall(
        config.url || 'unknown',
        duration,
        response.status
      )

      return response
    },
    (error) => {
      const config = error.config as InternalAxiosRequestConfig & { metadata?: { startTime: number } }
      const duration = config.metadata ? Date.now() - config.metadata.startTime : 0
      
      // Track failed API calls
      trackAPICall(
        config?.url || 'unknown',
        duration,
        error.response?.status || 0
      )

      return Promise.reject(error)
    }
  )
}

/**
 * Initialize API monitoring
 */
export function initAPIMonitoring() {
  setupAPIMonitoring()
  console.log('✅ API monitoring initialized')
}
