import { ref, onMounted, onUnmounted } from 'vue'
import * as Sentry from '@sentry/vue'

export function usePerformance() {
  const performanceMetrics = ref({
    pageLoadTime: 0,
    apiResponseTime: 0,
    memoryUsage: 0,
    networkLatency: 0
  })

  const isOnline = ref(navigator.onLine)
  const connectionType = ref('unknown')

  // Track page load performance
  function trackPageLoad() {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (navigation) {
        performanceMetrics.value.pageLoadTime = navigation.loadEventEnd - navigation.loadEventStart
        
        // Track Core Web Vitals
        trackCoreWebVitals()
      }
    }
  }

  // Track Core Web Vitals
  function trackCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        
        if (lastEntry) {
          Sentry.addBreadcrumb({
            category: 'performance',
            message: 'Largest Contentful Paint',
            level: 'info',
            data: {
              lcp: lastEntry.startTime,
              element: (lastEntry as any).element?.tagName
            }
          })
        }
      })
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        // LCP not supported in this browser
      }
    }

    // First Input Delay (FID)
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          Sentry.addBreadcrumb({
            category: 'performance',
            message: 'First Input Delay',
            level: 'info',
            data: {
              fid: (entry as any).processingStart - entry.startTime,
              eventType: entry.name
            }
          })
        })
      })
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] })
      } catch (e) {
        // FID not supported in this browser
      }
    }

    // Cumulative Layout Shift (CLS)
    if ('PerformanceObserver' in window) {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        
        Sentry.addBreadcrumb({
          category: 'performance',
          message: 'Cumulative Layout Shift',
          level: 'info',
          data: { cls: clsValue }
        })
      })
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        // CLS not supported in this browser
      }
    }
  }

  // Track API call performance
  function trackAPICall(endpoint: string, duration: number, status: number, method: string = 'GET') {
    const isSlow = duration > 1000
    const isError = status >= 400

    performanceMetrics.value.apiResponseTime = duration

    // Track to Sentry
    Sentry.addBreadcrumb({
      category: 'http',
      message: `${method} ${endpoint}`,
      level: isError ? 'error' : (isSlow ? 'warning' : 'info'),
      data: {
        endpoint,
        duration,
        status,
        method,
        slow: isSlow,
        error: isError
      }
    })

    // Alert on slow API calls
    if (isSlow) {
      console.warn(`Slow API call: ${method} ${endpoint} took ${duration}ms`)
    }

    // Alert on errors
    if (isError) {
      console.error(`API Error: ${method} ${endpoint} returned ${status}`)
    }
  }

  // Track custom events
  function trackEvent(name: string, properties?: Record<string, any>) {
    Sentry.addBreadcrumb({
      category: 'user',
      message: name,
      level: 'info',
      data: properties
    })
  }

  // Track user interactions
  function trackUserInteraction(action: string, component: string, properties?: Record<string, any>) {
    trackEvent('user_interaction', {
      action,
      component,
      ...properties
    })
  }

  // Track memory usage
  function trackMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      performanceMetrics.value.memoryUsage = memory.usedJSHeapSize / 1024 / 1024 // MB
      
      Sentry.addBreadcrumb({
        category: 'performance',
        message: 'Memory Usage',
        level: 'info',
        data: {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
          usedMB: Math.round(memory.usedJSHeapSize / 1024 / 1024)
        }
      })
    }
  }

  // Track network conditions
  function trackNetworkConditions() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      connectionType.value = connection.effectiveType || 'unknown'
      
      Sentry.addBreadcrumb({
        category: 'network',
        message: 'Network Conditions',
        level: 'info',
        data: {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        }
      })
    }
  }

  // Monitor online/offline status
  function handleOnlineStatus() {
    isOnline.value = navigator.onLine
    
    trackEvent('connection_change', {
      online: isOnline.value,
      timestamp: new Date().toISOString()
    })
  }

  // Track page visibility changes
  function handleVisibilityChange() {
    const isVisible = !document.hidden
    
    trackEvent('page_visibility', {
      visible: isVisible,
      timestamp: new Date().toISOString()
    })
  }

  // Initialize performance monitoring
  onMounted(() => {
    // Track initial page load
    trackPageLoad()
    
    // Set up event listeners
    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Track network conditions
    trackNetworkConditions()
    
    // Track memory usage periodically
    const memoryInterval = setInterval(trackMemoryUsage, 30000) // Every 30 seconds
    
    // Cleanup on unmount
    onUnmounted(() => {
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOnlineStatus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(memoryInterval)
    })
  })

  return {
    performanceMetrics,
    isOnline,
    connectionType,
    trackAPICall,
    trackEvent,
    trackUserInteraction,
    trackMemoryUsage,
    trackNetworkConditions
  }
}