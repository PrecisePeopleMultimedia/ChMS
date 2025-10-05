<template>
  <q-card class="dashboard-card system-status-card hover-lift">
    <q-card-section class="card-header">
      <div class="row items-center justify-between">
        <div class="row items-center q-gutter-sm">
          <q-icon name="settings" size="24px" color="grey-6" />
          <div class="column">
            <div class="text-h6 text-weight-bold">System Status</div>
            <div class="text-caption text-grey-6">Connection & sync</div>
          </div>
        </div>
        <q-btn
          flat
          round
          icon="refresh"
          size="sm"
          @click="refresh"
          :loading="isLoading"
        />
      </div>
    </q-card-section>

    <q-card-section class="card-content">
      <!-- Connection Status -->
      <div class="status-item">
        <div class="row items-center justify-between">
          <div class="row items-center q-gutter-sm">
            <q-icon 
              :name="isOnline ? 'wifi' : 'wifi_off'"
              :color="isOnline ? 'positive' : 'negative'"
              size="20px"
            />
            <span class="text-body2">Connection</span>
          </div>
          <q-chip
            :color="isOnline ? 'positive' : 'negative'"
            :label="isOnline ? 'Online' : 'Offline'"
            size="sm"
          />
        </div>
      </div>

      <!-- Last Sync -->
      <div class="status-item">
        <div class="row items-center justify-between">
          <div class="row items-center q-gutter-sm">
            <q-icon name="sync" color="blue" size="20px" />
            <span class="text-body2">Last Sync</span>
          </div>
          <span class="text-caption text-grey-6">
            {{ formatLastSync(stats.lastSync) }}
          </span>
        </div>
      </div>

      <!-- Pending Sync -->
      <div class="status-item" v-if="hasPendingSync">
        <div class="row items-center justify-between">
          <div class="row items-center q-gutter-sm">
            <q-icon name="pending" color="warning" size="20px" />
            <span class="text-body2">Pending Sync</span>
          </div>
          <q-chip
            color="warning"
            :label="`${stats.pendingSync} items`"
            size="sm"
            clickable
            @click="handleSync"
          />
        </div>
      </div>

      <!-- Database Status -->
      <div class="status-item">
        <div class="row items-center justify-between">
          <div class="row items-center q-gutter-sm">
            <q-icon name="storage" color="blue" size="20px" />
            <span class="text-body2">Database</span>
          </div>
          <q-chip
            color="positive"
            label="Connected"
            size="sm"
          />
        </div>
      </div>

      <!-- Cache Status -->
      <div class="status-item">
        <div class="row items-center justify-between">
          <div class="row items-center q-gutter-sm">
            <q-icon name="memory" color="purple" size="20px" />
            <span class="text-body2">Cache</span>
          </div>
          <q-chip
            color="positive"
            label="Active"
            size="sm"
          />
        </div>
      </div>
    </q-card-section>

    <q-card-section class="card-actions">
      <q-btn
        flat
        color="primary"
        icon="sync"
        label="Sync Now"
        @click="handleSync"
        :loading="isLoading"
        class="full-width"
        :disable="!hasPendingSync"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useDashboardStore } from '@/stores/dashboard'

// Composables
const $q = useQuasar()
const dashboardStore = useDashboardStore()

// Computed
const stats = computed(() => dashboardStore.stats)
const isLoading = computed(() => dashboardStore.isLoading)
const isOnline = computed(() => dashboardStore.isOnline)
const hasPendingSync = computed(() => dashboardStore.hasPendingSync)

// Methods
const formatLastSync = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

const refresh = async () => {
  await dashboardStore.refreshData()
}

const handleSync = async () => {
  try {
    await dashboardStore.syncOfflineData()
    $q.notify({
      type: 'positive',
      message: 'Data synced successfully',
      position: 'top'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Sync failed. Please try again.',
      position: 'top'
    })
  }
}
</script>

<style lang="sass" scoped>
.system-status-card
  height: 100%
  min-height: 280px

.card-header
  padding-bottom: 8px

.card-content
  padding-top: 8px

.status-item
  padding: 8px 0
  border-bottom: 1px solid var(--border)

  &:last-child
    border-bottom: none

.card-actions
  padding-top: 8px
</style>
