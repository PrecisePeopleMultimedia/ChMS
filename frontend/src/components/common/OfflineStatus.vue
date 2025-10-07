<template>
  <div class="offline-status">
    <!-- Offline Banner -->
    <q-banner
      v-if="!isOnline"
      class="bg-orange-1 text-orange-9"
      dense
    >
      <template v-slot:avatar>
        <q-icon name="cloud_off" color="orange" />
      </template>
      <div class="row items-center">
        <div class="col">
          <div class="text-weight-medium">You're offline</div>
          <div class="text-caption">Changes will sync when you're back online</div>
        </div>
        <div class="col-auto">
          <q-btn
            flat
            dense
            color="orange"
            icon="sync"
            label="Retry"
            @click="attemptSync"
            :loading="syncing"
          />
        </div>
      </div>
    </q-banner>

    <!-- Sync Status -->
    <q-banner
      v-else-if="syncing"
      class="bg-blue-1 text-blue-9"
      dense
    >
      <template v-slot:avatar>
        <q-spinner color="blue" size="20px" />
      </template>
      <div class="text-weight-medium">Syncing data...</div>
    </q-banner>

    <!-- Sync Success -->
    <q-banner
      v-else-if="showSyncSuccess"
      class="bg-positive text-white"
      dense
    >
      <template v-slot:avatar>
        <q-icon name="cloud_done" color="white" />
      </template>
      <div class="row items-center">
        <div class="col">
          <div class="text-weight-medium">Data synced successfully</div>
          <div class="text-caption">Last sync: {{ formatLastSync }}</div>
        </div>
        <div class="col-auto">
          <q-btn
            flat
            dense
            color="white"
            icon="close"
            @click="showSyncSuccess = false"
          />
        </div>
      </div>
    </q-banner>

    <!-- Sync Error -->
    <q-banner
      v-else-if="syncError"
      class="bg-negative text-white"
      dense
    >
      <template v-slot:avatar>
        <q-icon name="sync_problem" color="white" />
      </template>
      <div class="row items-center">
        <div class="col">
          <div class="text-weight-medium">Sync failed</div>
          <div class="text-caption">{{ syncError }}</div>
        </div>
        <div class="col-auto">
          <q-btn
            flat
            dense
            color="white"
            icon="refresh"
            label="Retry"
            @click="attemptSync"
          />
          <q-btn
            flat
            dense
            color="white"
            icon="close"
            @click="syncError = null"
          />
        </div>
      </div>
    </q-banner>

    <!-- Pending Changes Indicator -->
    <q-banner
      v-else-if="hasPendingChanges"
      class="bg-amber-1 text-amber-9"
      dense
    >
      <template v-slot:avatar>
        <q-icon name="schedule" color="amber" />
      </template>
      <div class="row items-center">
        <div class="col">
          <div class="text-weight-medium">{{ pendingChangesCount }} changes pending sync</div>
          <div class="text-caption">Will sync automatically when online</div>
        </div>
        <div class="col-auto">
          <q-btn
            flat
            dense
            color="amber"
            icon="sync"
            label="Sync Now"
            @click="attemptSync"
            :disable="!isOnline"
          />
        </div>
      </div>
    </q-banner>

    <!-- Connection Status Chip (always visible in corner) -->
    <q-chip
      :color="isOnline ? 'positive' : 'orange'"
      text-color="white"
      :icon="isOnline ? 'wifi' : 'wifi_off'"
      :label="isOnline ? 'Online' : 'Offline'"
      class="connection-chip"
      dense
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { date } from 'quasar'
import { syncService } from '@/services/sync'
import { offlineService } from '@/services/offline'

// Reactive data
const isOnline = ref(navigator.onLine)
const syncing = ref(false)
const syncError = ref<string | null>(null)
const showSyncSuccess = ref(false)
const lastSyncTime = ref<number | null>(null)
const pendingChangesCount = ref(0)

// Computed
const hasPendingChanges = computed(() => pendingChangesCount.value > 0)

const formatLastSync = computed(() => {
  if (!lastSyncTime.value) return 'Never'
  
  const now = Date.now()
  const diff = now - lastSyncTime.value
  
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`
  
  return date.formatDate(lastSyncTime.value, 'MMM D, h:mm A')
})

// Methods
const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine
}

const updatePendingChanges = async () => {
  try {
    const pendingItems = await offlineService.getPendingSyncItems()
    pendingChangesCount.value = pendingItems.length
  } catch (error) {
    console.error('Failed to get pending changes:', error)
  }
}

const updateLastSyncTime = async () => {
  try {
    lastSyncTime.value = await offlineService.getLastSyncTime()
  } catch (error) {
    console.error('Failed to get last sync time:', error)
  }
}

const attemptSync = async () => {
  if (!isOnline.value) return
  
  syncing.value = true
  syncError.value = null
  
  try {
    const result = await syncService.syncAll()
    
    if (result.success) {
      showSyncSuccess.value = true
      await updateLastSyncTime()
      await updatePendingChanges()
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        showSyncSuccess.value = false
      }, 3000)
    } else {
      syncError.value = result.errors.join(', ') || 'Unknown sync error'
    }
  } catch (error: any) {
    syncError.value = error.message || 'Sync failed'
  } finally {
    syncing.value = false
  }
}

// Event listeners
let onlineListener: () => void
let offlineListener: () => void
let syncCompleteListener: (result: any) => void

onMounted(async () => {
  // Set up online/offline listeners
  onlineListener = () => {
    updateOnlineStatus()
    if (isOnline.value) {
      attemptSync()
    }
  }
  
  offlineListener = () => {
    updateOnlineStatus()
    syncError.value = null
    showSyncSuccess.value = false
  }
  
  window.addEventListener('online', onlineListener)
  window.addEventListener('offline', offlineListener)
  
  // Set up sync completion listener
  syncCompleteListener = (result) => {
    if (result.success) {
      updateLastSyncTime()
      updatePendingChanges()
    }
  }
  
  syncService.onSyncComplete(syncCompleteListener)
  
  // Initial data load
  await updateLastSyncTime()
  await updatePendingChanges()
  
  // Periodic updates
  const interval = setInterval(() => {
    updatePendingChanges()
  }, 30000) // Every 30 seconds
  
  // Cleanup
  onUnmounted(() => {
    clearInterval(interval)
  })
})

onUnmounted(() => {
  if (onlineListener) window.removeEventListener('online', onlineListener)
  if (offlineListener) window.removeEventListener('offline', offlineListener)
})
</script>

<style scoped>
.offline-status {
  position: relative;
}

.connection-chip {
  position: fixed;
  top: 70px;
  right: 16px;
  z-index: 1000;
  opacity: 0.9;
}

.connection-chip:hover {
  opacity: 1;
}

/* Hide connection chip on mobile to save space */
@media (max-width: 600px) {
  .connection-chip {
    display: none;
  }
}
</style>
