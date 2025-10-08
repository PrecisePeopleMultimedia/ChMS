import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'
import { usePerformance } from '@/composables/usePerformance'

// Create a performance monitoring instance
const { trackAPICall } = usePerformance()

// Request interceptor to track start time
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add start time to config
    ;(config as any).metadata = { startTime: Date.now() }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor to track performance
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as InternalAxiosRequestConfig & { metadata?: { startTime: number } }
    
    if (config.metadata?.startTime) {
      const duration = Date.now() - config.metadata.startTime
      const endpoint = config.url || 'unknown'
      const method = config.method?.toUpperCase() || 'GET'
      const status = response.status
      
      trackAPICall(endpoint, duration, status, method)
    }
    
    return response
  },
  (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & { metadata?: { startTime: number } }
    
    if (config?.metadata?.startTime) {
      const duration = Date.now() - config.metadata.startTime
      const endpoint = config.url || 'unknown'
      const method = config.method?.toUpperCase() || 'GET'
      const status = error.response?.status || 0
      
      trackAPICall(endpoint, duration, status, method)
    }
    
    return Promise.reject(error)
  }
)

// Export the configured axios instance
export default axios
