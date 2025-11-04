/**
 * PWA Service Worker Integration
 * Handles service worker registration, updates, and PWA features
 */

import { Workbox } from 'workbox-window'

export interface PWAStatus {
  isSupported: boolean
  isInstalled: boolean
  isUpdateAvailable: boolean
  isOfflineReady: boolean
}

class PWAService {
  private wb: Workbox | null = null
  private registration: ServiceWorkerRegistration | null = null
  private updateAvailable = false
  private offlineReady = false
  private deferredPrompt: any = null
  private installPromptShown = false

  /**
   * Initialize PWA service worker
   */
  async init(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.warn('⚠️ Service Worker not supported')
      return
    }

    // In development, VitePWA may not generate service worker
    // Only register in production or if service worker file exists
    if (import.meta.env.DEV) {
      // Check if service worker file exists before registering
      try {
        const response = await fetch('/sw.js', { method: 'HEAD' })
        if (!response.ok || response.headers.get('content-type')?.includes('text/html')) {
          console.log('⚠️ Service Worker not available in development mode')
          return
        }
      } catch (error) {
        console.log('⚠️ Service Worker not available in development mode')
        return
      }
    }

    try {
      // Initialize Workbox
      // VitePWA generates service worker at root
      const swPath = '/sw.js'
      this.wb = new Workbox(swPath)

      // Listen for service worker events
      this.setupEventListeners()

      // Setup install prompt listener
      this.setupInstallPromptListener()

      // Register service worker
      this.registration = await this.wb.register() || null
      console.log('✅ Service Worker registered successfully')

    } catch (error: any) {
      // Don't block app initialization if service worker fails
      // This is expected in development mode
      if (import.meta.env.DEV) {
        console.log('⚠️ Service Worker registration skipped in development')
      } else {
        console.error('❌ Service Worker registration failed:', error)
      }
    }
  }

  /**
   * Setup service worker event listeners
   */
  private setupEventListeners(): void {
    if (!this.wb) return

    // Service worker installed and ready to work offline
    this.wb.addEventListener('installed', (event) => {
      console.log('🎉 Service Worker installed')
      this.offlineReady = true
      
      if (event.isUpdate) {
        console.log('🔄 Service Worker updated')
        this.showUpdateNotification()
      } else {
        console.log('📱 App ready to work offline')
        this.showOfflineReadyNotification()
      }
    })

    // New service worker waiting to activate
    this.wb.addEventListener('waiting', () => {
      console.log('⏳ New Service Worker waiting')
      this.updateAvailable = true
      this.showUpdateAvailableNotification()
    })

    // Service worker controlling the page
    this.wb.addEventListener('controlling', () => {
      console.log('🎮 Service Worker controlling')
      window.location.reload()
    })

    // Service worker activated
    this.wb.addEventListener('activated', (event) => {
      console.log('🚀 Service Worker activated')
      
      if (!event.isUpdate) {
        this.offlineReady = true
      }
    })
  }

  /**
   * Update service worker to latest version
   */
  async updateServiceWorker(): Promise<void> {
    if (!this.wb) {
      throw new Error('Service Worker not initialized')
    }

    try {
      // Skip waiting and activate new service worker
      this.wb.messageSkipWaiting()
      console.log('🔄 Service Worker update initiated')
    } catch (error) {
      console.error('❌ Failed to update Service Worker:', error)
      throw error
    }
  }

  /**
   * Get PWA installation status
   */
  getPWAStatus(): PWAStatus {
    return {
      isSupported: 'serviceWorker' in navigator,
      isInstalled: this.isAppInstalled(),
      isUpdateAvailable: this.updateAvailable,
      isOfflineReady: this.offlineReady
    }
  }

  /**
   * Check if app is installed as PWA
   */
  private isAppInstalled(): boolean {
    // Check if running in standalone mode (installed PWA)
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true
  }

  /**
   * Setup install prompt listener
   */
  private setupInstallPromptListener(): void {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()

      // Stash the event so it can be triggered later
      this.deferredPrompt = e

      console.log('📱 PWA install prompt available')

      // Dispatch custom event for components to listen to
      window.dispatchEvent(new CustomEvent('pwa-installable'))
    })

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      console.log('🎉 PWA was installed')
      this.deferredPrompt = null

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('pwa-installed'))
    })
  }

  /**
   * Show install prompt for PWA
   */
  async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.warn('⚠️ Install prompt not available')
      return false
    }

    try {
      // Show the install prompt
      this.deferredPrompt.prompt()

      // Wait for the user to respond to the prompt
      const { outcome } = await this.deferredPrompt.userChoice

      console.log(`👤 User response to install prompt: ${outcome}`)

      // Clear the deferred prompt
      this.deferredPrompt = null
      this.installPromptShown = true

      return outcome === 'accepted'
    } catch (error) {
      console.error('❌ Failed to show install prompt:', error)
      return false
    }
  }

  /**
   * Check if install prompt is available
   */
  canShowInstallPrompt(): boolean {
    return !!this.deferredPrompt && !this.installPromptShown
  }

  /**
   * Show notification that app is ready to work offline
   */
  private showOfflineReadyNotification(): void {
    // In a real app, you'd show a toast or notification
    console.log('📱 App is ready to work offline!')
    
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('pwa-offline-ready'))
  }

  /**
   * Show notification that an update is available
   */
  private showUpdateAvailableNotification(): void {
    console.log('🔄 App update available!')
    
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('pwa-update-available'))
  }

  /**
   * Show notification that app has been updated
   */
  private showUpdateNotification(): void {
    console.log('✅ App has been updated!')
    
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('pwa-updated'))
  }

  /**
   * Get cache information
   */
  async getCacheInfo(): Promise<any> {
    if (!('caches' in window)) {
      return { supported: false }
    }

    try {
      const cacheNames = await caches.keys()
      const cacheInfo = {
        supported: true,
        caches: cacheNames,
        totalCaches: cacheNames.length
      }

      return cacheInfo
    } catch (error) {
      console.error('❌ Failed to get cache info:', error)
      return { supported: true, error: (error as Error).message }
    }
  }

  /**
   * Clear all caches
   */
  async clearCaches(): Promise<void> {
    if (!('caches' in window)) {
      throw new Error('Cache API not supported')
    }

    try {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
      console.log('🗑️ All caches cleared')
    } catch (error) {
      console.error('❌ Failed to clear caches:', error)
      throw error
    }
  }

  /**
   * Check network connectivity
   */
  isOnline(): boolean {
    return navigator.onLine
  }

  /**
   * Setup network status listeners
   */
  setupNetworkListeners(
    onOnline?: () => void,
    onOffline?: () => void
  ): void {
    window.addEventListener('online', () => {
      console.log('🌐 Network connection restored')
      onOnline?.()
    })

    window.addEventListener('offline', () => {
      console.log('📴 Network connection lost')
      onOffline?.()
    })
  }

  /**
   * Unregister service worker (for development/testing)
   */
  async unregister(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      return
    }

    try {
      const registrations = await navigator.serviceWorker.getRegistrations()
      for (const registration of registrations) {
        await registration.unregister()
      }
      console.log('🗑️ Service Worker unregistered')
    } catch (error) {
      console.error('❌ Failed to unregister Service Worker:', error)
      throw error
    }
  }
}

// Export singleton instance
export const pwaService = new PWAService()
export default pwaService
