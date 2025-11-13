<template>
  <div v-if="!isOnline" class="offline-indicator">
    <div class="offline-banner">
      <q-icon name="wifi_off" size="sm" class="mr-2" />
      <span class="text-sm font-medium">You're offline</span>
      <span v-if="hasPendingChanges" class="text-xs ml-2 opacity-75">
        ({{ syncStatus.pendingItems }} pending changes)
      </span>
    </div>
  </div>

  <!-- Update Available Banner -->
  <div v-if="showUpdateBanner" class="update-banner">
    <div class="update-content">
      <q-icon name="system_update" size="sm" class="mr-2" />
      <span class="text-sm font-medium">App update available</span>
      <div class="ml-auto flex gap-2">
        <q-btn
          @click="dismissUpdate"
          size="sm"
          flat
          dense
          class="text-white"
        >
          Later
        </q-btn>
        <q-btn
          @click="handleUpdate"
          size="sm"
          color="white"
          text-color="primary"
          dense
        >
          Update
        </q-btn>
      </div>
    </div>
  </div>

  <!-- Sync Status Toast -->
  <div v-if="syncStatus.isSyncing" class="sync-toast">
    <q-icon name="sync" size="sm" class="mr-2 animate-spin" />
    <span class="text-sm">Syncing changes...</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { useOfflineStore } from '@/composables/useOfflineStore'
import pwaService from '@/services/pwa'

// Composables
const $q = useQuasar()
const {
  isOnline,
  syncStatus,
  hasPendingChanges
} = useOfflineStore()

// Local state
const showUpdateBanner = ref(false)

// Event handlers
let updateAvailableHandler: (() => void) | null = null
let offlineReadyHandler: (() => void) | null = null

const setupEventListeners = () => {
  updateAvailableHandler = () => {
    showUpdateBanner.value = true
  }

  offlineReadyHandler = () => {
    $q.notify({
      type: 'positive',
      message: 'App is ready to work offline!',
      position: 'top',
      timeout: 3000,
      icon: 'offline_bolt'
    })
  }

  window.addEventListener('pwa-update-available', updateAvailableHandler)
  window.addEventListener('pwa-offline-ready', offlineReadyHandler)
}

const cleanupEventListeners = () => {
  if (updateAvailableHandler) {
    window.removeEventListener('pwa-update-available', updateAvailableHandler)
  }
  if (offlineReadyHandler) {
    window.removeEventListener('pwa-offline-ready', offlineReadyHandler)
  }
}

// Methods
const handleUpdate = async () => {
  try {
    await pwaService.updateServiceWorker()
    showUpdateBanner.value = false
    
    $q.notify({
      type: 'positive',
      message: 'App will update shortly...',
      position: 'top',
      timeout: 2000
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Update failed. Please try again.',
      position: 'top'
    })
  }
}

const dismissUpdate = () => {
  showUpdateBanner.value = false
}

// Lifecycle
onMounted(() => {
  setupEventListeners()
})

onUnmounted(() => {
  cleanupEventListeners()
})
</script>

<style scoped>
.offline-indicator {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
}

.offline-banner {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.update-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9998;
  background: linear-gradient(135deg, #1976d2, #1565c0);
  color: white;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.update-content {
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.sync-toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  z-index: 9997;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@-webkit-keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Adjust main content when offline banner is shown */
.offline-indicator ~ * {
  margin-top: 40px;
}

.update-banner ~ * {
  margin-top: 48px;
}
</style>
