<template>
  <div class="pwa-status">
    <!-- Network Status -->
    <div class="flex items-center gap-2 mb-4">
      <q-icon 
        :name="isOnline ? 'wifi' : 'wifi_off'" 
        :color="isOnline ? 'positive' : 'negative'"
        size="sm"
      />
      <span class="text-sm">
        {{ isOnline ? 'Online' : 'Offline' }}
      </span>
    </div>

    <!-- Sync Status -->
    <div class="sync-status mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium">Sync Status</span>
        <q-btn
          v-if="canSync && hasPendingChanges"
          @click="handleForceSync"
          :loading="syncStatus.isSyncing"
          size="sm"
          color="primary"
          outline
          dense
        >
          Sync Now
        </q-btn>
      </div>

      <div class="flex items-center gap-2 mb-2">
        <q-icon
          :name="syncStatus.isSyncing ? 'sync' : 'sync_disabled'"
          :color="syncStatus.isSyncing ? 'primary' : 'grey'"
          size="xs"
          :class="{ 'animate-spin': syncStatus.isSyncing }"
        />
        <span class="text-xs text-grey-6">
          {{ syncStatusText }}
        </span>
      </div>

      <div v-if="hasPendingChanges" class="text-xs text-warning">
        {{ syncStatus.pendingItems }} pending changes
      </div>

      <div v-if="lastSyncTime" class="text-xs text-grey-6">
        Last sync: {{ formatSyncTime(lastSyncTime) }}
      </div>
    </div>

    <!-- PWA Status -->
    <div class="pwa-info mb-4">
      <div class="text-sm font-medium mb-2">PWA Status</div>
      
      <div class="flex items-center gap-2 mb-1">
        <q-icon
          :name="pwaStatus.isSupported ? 'check_circle' : 'cancel'"
          :color="pwaStatus.isSupported ? 'positive' : 'negative'"
          size="xs"
        />
        <span class="text-xs">
          Service Worker {{ pwaStatus.isSupported ? 'Supported' : 'Not Supported' }}
        </span>
      </div>

      <div class="flex items-center gap-2 mb-1">
        <q-icon
          :name="pwaStatus.isInstalled ? 'check_circle' : 'circle'"
          :color="pwaStatus.isInstalled ? 'positive' : 'grey'"
          size="xs"
        />
        <span class="text-xs">
          {{ pwaStatus.isInstalled ? 'Installed as PWA' : 'Not Installed' }}
        </span>
      </div>

      <div class="flex items-center gap-2 mb-1">
        <q-icon
          :name="pwaStatus.isOfflineReady ? 'check_circle' : 'circle'"
          :color="pwaStatus.isOfflineReady ? 'positive' : 'grey'"
          size="xs"
        />
        <span class="text-xs">
          {{ pwaStatus.isOfflineReady ? 'Offline Ready' : 'Not Offline Ready' }}
        </span>
      </div>

      <div v-if="pwaStatus.isUpdateAvailable" class="mt-2">
        <q-btn
          @click="handleUpdate"
          size="sm"
          color="primary"
          outline
          dense
          class="w-full"
        >
          Update Available - Click to Update
        </q-btn>
      </div>
    </div>

    <!-- Actions -->
    <div class="actions">
      <q-btn
        v-if="isOnline"
        @click="handleFullSync"
        :loading="isFullSyncing"
        size="sm"
        color="secondary"
        outline
        dense
        class="w-full mb-2"
      >
        Full Sync from Server
      </q-btn>

      <q-btn
        @click="handleClearData"
        size="sm"
        color="negative"
        outline
        dense
        class="w-full"
      >
        Clear Local Data
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { useOfflineStore } from '@/composables/useOfflineStore'
import pwaService from '@/services/pwa'
import type { PWAStatus } from '@/services/pwa'

// Composables
const $q = useQuasar()
const {
  isOnline,
  syncStatus,
  canSync,
  hasPendingChanges,
  lastSyncTime,
  forcSync,
  fullSync,
  clearLocalData
} = useOfflineStore()

// Local state
const pwaStatus = ref<PWAStatus>({
  isSupported: false,
  isInstalled: false,
  isUpdateAvailable: false,
  isOfflineReady: false
})
const isFullSyncing = ref(false)

// Computed
const syncStatusText = computed(() => {
  if (syncStatus.value.isSyncing) {
    return 'Syncing...'
  }
  if (!isOnline.value) {
    return 'Offline'
  }
  if (hasPendingChanges.value) {
    return 'Pending changes'
  }
  return 'Up to date'
})

// Methods
const updatePWAStatus = () => {
  pwaStatus.value = pwaService.getPWAStatus()
}

const handleForceSync = async () => {
  try {
    await forcSync()
    $q.notify({
      type: 'positive',
      message: 'Sync completed successfully',
      position: 'top'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Sync failed: ' + (error as Error).message,
      position: 'top'
    })
  }
}

const handleFullSync = async () => {
  isFullSyncing.value = true
  try {
    await fullSync()
    $q.notify({
      type: 'positive',
      message: 'Full sync completed successfully',
      position: 'top'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Full sync failed: ' + (error as Error).message,
      position: 'top'
    })
  } finally {
    isFullSyncing.value = false
  }
}

const handleUpdate = async () => {
  try {
    await pwaService.updateServiceWorker()
    $q.notify({
      type: 'positive',
      message: 'App will update shortly...',
      position: 'top'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Update failed: ' + (error as Error).message,
      position: 'top'
    })
  }
}

const handleClearData = () => {
  $q.dialog({
    title: 'Clear Local Data',
    message: 'This will remove all offline data. Are you sure?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await clearLocalData()
      $q.notify({
        type: 'positive',
        message: 'Local data cleared successfully',
        position: 'top'
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Failed to clear data: ' + (error as Error).message,
        position: 'top'
      })
    }
  })
}

const formatSyncTime = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

// Event listeners
let updateAvailableHandler: (() => void) | null = null
let offlineReadyHandler: (() => void) | null = null

const setupPWAListeners = () => {
  updateAvailableHandler = () => {
    updatePWAStatus()
  }
  
  offlineReadyHandler = () => {
    updatePWAStatus()
  }

  window.addEventListener('pwa-update-available', updateAvailableHandler)
  window.addEventListener('pwa-offline-ready', offlineReadyHandler)
}

const cleanupPWAListeners = () => {
  if (updateAvailableHandler) {
    window.removeEventListener('pwa-update-available', updateAvailableHandler)
  }
  if (offlineReadyHandler) {
    window.removeEventListener('pwa-offline-ready', offlineReadyHandler)
  }
}

// Lifecycle
onMounted(() => {
  updatePWAStatus()
  setupPWAListeners()
})

onUnmounted(() => {
  cleanupPWAListeners()
})
</script>

<style scoped>
.pwa-status {
  padding: 16px;
  border: 1px solid var(--q-color-grey-4);
  border-radius: 8px;
  background: var(--q-color-grey-1);
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
</style>
