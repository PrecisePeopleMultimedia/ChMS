<template>
  <q-dialog
    v-model="showPrompt"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    class="install-prompt-dialog"
  >
    <q-card class="install-prompt-card">
      <q-card-section class="text-center q-pa-lg">
        <!-- App Icon -->
        <div class="app-icon-container q-mb-md">
          <img 
            src="/icons/icon-192x192.png" 
            alt="ChurchAfrica ChMS" 
            class="app-icon"
          />
        </div>

        <!-- App Info -->
        <div class="app-info q-mb-lg">
          <h4 class="text-h4 q-mb-sm text-weight-bold">
            ChurchAfrica ChMS
          </h4>
          <p class="text-subtitle1 text-grey-7 q-mb-md">
            Africa-First Church Management System
          </p>
          <p class="text-body2 text-grey-6">
            Install our app for the best experience with offline capabilities, 
            faster loading, and native app features.
          </p>
        </div>

        <!-- Features List -->
        <div class="features-list q-mb-lg">
          <div class="feature-item q-mb-sm">
            <q-icon name="offline_bolt" color="positive" size="sm" class="q-mr-sm" />
            <span class="text-body2">Works offline</span>
          </div>
          <div class="feature-item q-mb-sm">
            <q-icon name="speed" color="primary" size="sm" class="q-mr-sm" />
            <span class="text-body2">Faster loading</span>
          </div>
          <div class="feature-item q-mb-sm">
            <q-icon name="smartphone" color="accent" size="sm" class="q-mr-sm" />
            <span class="text-body2">Native app experience</span>
          </div>
          <div class="feature-item">
            <q-icon name="sync" color="info" size="sm" class="q-mr-sm" />
            <span class="text-body2">Automatic updates</span>
          </div>
        </div>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions class="q-pa-lg q-gutter-md">
        <q-btn
          @click="installApp"
          color="primary"
          size="lg"
          class="full-width install-btn"
          :loading="installing"
          :disable="installing"
          unelevated
        >
          <q-icon name="get_app" class="q-mr-sm" />
          Install App
        </q-btn>
        
        <q-btn
          @click="dismissPrompt"
          color="grey-7"
          size="md"
          class="full-width"
          flat
          :disable="installing"
        >
          Not Now
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import pwaService from '@/services/pwa'

// Composables
const $q = useQuasar()

// Local state
const showPrompt = ref(false)
const installing = ref(false)

// Event handlers
let installableHandler: (() => void) | null = null
let installedHandler: (() => void) | null = null

const setupEventListeners = () => {
  installableHandler = () => {
    // Show prompt after a delay to avoid being intrusive
    setTimeout(() => {
      if (pwaService.canShowInstallPrompt()) {
        showPrompt.value = true
      }
    }, 3000) // 3 second delay
  }

  installedHandler = () => {
    showPrompt.value = false
    
    $q.notify({
      type: 'positive',
      message: 'App installed successfully!',
      position: 'top',
      timeout: 3000,
      icon: 'check_circle'
    })
  }

  window.addEventListener('pwa-installable', installableHandler)
  window.addEventListener('pwa-installed', installedHandler)
}

const cleanupEventListeners = () => {
  if (installableHandler) {
    window.removeEventListener('pwa-installable', installableHandler)
  }
  if (installedHandler) {
    window.removeEventListener('pwa-installed', installedHandler)
  }
}

// Methods
const installApp = async () => {
  installing.value = true
  
  try {
    const accepted = await pwaService.showInstallPrompt()
    
    if (accepted) {
      console.log('✅ User accepted install prompt')
    } else {
      console.log('❌ User declined install prompt')
      showPrompt.value = false
    }
  } catch (error) {
    console.error('❌ Install failed:', error)
    
    $q.notify({
      type: 'negative',
      message: 'Installation failed. Please try again.',
      position: 'top'
    })
    
    showPrompt.value = false
  } finally {
    installing.value = false
  }
}

const dismissPrompt = () => {
  showPrompt.value = false
  
  // Remember user dismissed the prompt (optional)
  localStorage.setItem('pwa-install-dismissed', Date.now().toString())
}

// Lifecycle
onMounted(() => {
  setupEventListeners()
  
  // Check if user previously dismissed the prompt
  const dismissed = localStorage.getItem('pwa-install-dismissed')
  if (dismissed) {
    const dismissedTime = parseInt(dismissed)
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)
    
    // Show again after 7 days
    if (daysSinceDismissed < 7) {
      return
    }
  }
})

onUnmounted(() => {
  cleanupEventListeners()
})
</script>

<style scoped>
.install-prompt-dialog {
  z-index: 9999;
}

.install-prompt-card {
  max-width: 400px;
  margin: auto;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.app-icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.app-icon {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.app-info h4 {
  color: var(--q-primary);
  margin: 0;
}

.features-list {
  text-align: left;
  max-width: 280px;
  margin: 0 auto;
}

.feature-item {
  display: flex;
  align-items: center;
}

.install-btn {
  font-weight: 600;
  border-radius: 12px;
  padding: 12px 24px;
}

@media (max-width: 600px) {
  .install-prompt-card {
    margin: 16px;
    max-width: none;
  }
  
  .app-icon {
    width: 64px;
    height: 64px;
  }
}
</style>
