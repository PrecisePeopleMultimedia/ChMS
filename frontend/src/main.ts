import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Dark, Notify } from 'quasar'
import * as Sentry from '@sentry/vue'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/material-icons-round/material-icons-round.css'
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Import our modern styles
import './styles/globals.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// Initialize Sentry for error tracking and performance monitoring
if (import.meta.env.PROD) {
  Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: 1.0, // 100% in production
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% when errors occur
    environment: import.meta.env.MODE,
    beforeSend(event) {
      // Filter out development errors
      if (event.exception) {
        const error = event.exception.values?.[0]
        if (error?.value?.includes('ResizeObserver loop limit exceeded')) {
          return null // Ignore ResizeObserver errors
        }
      }
      return event
    },
  })
}

app.use(createPinia())
app.use(router)

app.use(Quasar, {
  plugins: {
    Dark,
    Notify
  },
  config: {
    dark: true, // Default to dark theme - controlled by theme store
    brand: {
      primary: '#8B1538',
      secondary: '#4A1A2C',
      accent: '#B8336A',
      dark: '#1A0A0F',
      positive: '#21BA45',
      negative: '#C10015',
      info: '#31CCEC',
      warning: '#F2C037'
    }
  }
})

// Initialize PWA services
import pwaService from './services/pwa'
import indexedDBService from './services/indexeddb'
import { initAPIMonitoring } from './utils/apiMonitoring'

// Initialize PWA and offline services
async function initializeServices() {
  try {
    // Initialize API monitoring
    initAPIMonitoring()
    console.log('✅ API monitoring initialized')

    // Initialize IndexedDB
    await indexedDBService.init()
    console.log('✅ IndexedDB initialized')

    // Initialize PWA service worker
    await pwaService.init()
    console.log('✅ PWA services initialized')

  } catch (error) {
    console.error('❌ Failed to initialize services:', error)
  }
}

// Initialize theme after app is created
app.mount('#app')

// Initialize theme store after mounting
import { useThemeStore } from './stores/theme'
const themeStore = useThemeStore()
themeStore.initializeTheme()

// Initialize PWA services
initializeServices()
