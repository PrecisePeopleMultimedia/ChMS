<template>
  <q-page class="dashboard-page">
    <!-- Dashboard Header -->
    <div class="dashboard-header q-pa-md">
      <div class="row items-center justify-between">
        <div class="col">
          <h1 class="text-h4 text-weight-light q-ma-none">
            Welcome back, {{ userName }}
          </h1>
          <p class="text-body2 text-grey-6 q-ma-none q-mt-xs">
            Here's what's happening with your church today
          </p>
        </div>

        <div class="col-auto">
          <div class="dashboard-controls">
            <!-- Layout Selector -->
            <q-select
              v-model="selectedLayoutId"
              :options="layoutOptions"
              label="Dashboard Layout"
              outlined
              dense
              emit-value
              map-options
              style="min-width: 200px;"
              class="q-mr-sm"
              @update:model-value="handleLayoutChange"
            />

            <!-- Edit Mode Toggle -->
            <q-btn
              :color="isEditMode ? 'primary' : 'grey-6'"
              :icon="isEditMode ? 'edit_off' : 'edit'"
              :label="isEditMode ? 'Done' : 'Edit'"
              outline
              @click="toggleEditMode"
              class="q-mr-sm"
            />

            <!-- Add Widget Button -->
            <q-btn
              color="primary"
              icon="add"
              label="Add Widget"
              @click="openWidgetLibrary"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div class="dashboard-content q-pa-md">
      <!-- Loading State -->
      <div v-if="isLoading" class="dashboard-loading">
        <q-spinner-dots size="3rem" color="primary" />
        <p class="text-body2 text-grey-6 q-mt-md">Loading dashboard...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="dashboard-error">
        <q-icon name="error_outline" size="3rem" color="negative" />
        <h3 class="text-h6 text-negative q-mt-md">Failed to load dashboard</h3>
        <p class="text-body2 text-grey-6 q-mb-lg">{{ error }}</p>
        <q-btn
          color="primary"
          icon="refresh"
          label="Retry"
          @click="initializeDashboard"
        />
      </div>

      <!-- Dashboard Grid -->
      <DashboardGrid
        v-else
        :is-edit-mode="isEditMode"
        @open-widget-library="openWidgetLibrary"
        @widget-added="handleWidgetAdded"
        @widget-removed="handleWidgetRemoved"
      />
    </div>

    <!-- Widget Library Dialog -->
    <q-dialog v-model="showWidgetLibrary" persistent>
      <WidgetLibrary
        @add-widget="handleAddWidget"
        @add-widgets="handleAddWidgets"
        @cancel="showWidgetLibrary = false"
      />
    </q-dialog>

    <!-- Offline Indicator -->
    <q-banner
      v-if="isOffline"
      class="offline-banner"
      dense
      color="warning"
      text-color="dark"
    >
      <template v-slot:avatar>
        <q-icon name="cloud_off" />
      </template>
      You're currently offline. Changes will sync when connection is restored.
    </q-banner>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useWidgetsStore } from '@/stores/widgets'
import { useDashboardStore } from '@/stores/dashboard'
import { useAuthStore } from '@/stores/auth'
import type { Widget, WidgetInstance } from '@/stores/widgets'
import DashboardGrid from '@/components/dashboard/DashboardGrid.vue'
import WidgetLibrary from '@/components/dashboard/WidgetLibrary.vue'

// Stores
const widgetsStore = useWidgetsStore()
const dashboardStore = useDashboardStore()
const authStore = useAuthStore()

// Reactive state
const isEditMode = ref(false)
const showWidgetLibrary = ref(false)
const selectedLayoutId = ref<string | null>(null)
const isOffline = ref(false)

// Computed properties
const userName = computed(() => {
  return `${authStore.user?.first_name || ''} ${authStore.user?.last_name || ''}`.trim() || 'User'
})

const {
  dashboardLayouts,
  currentLayout,
  isLoading,
  error
} = widgetsStore

const layoutOptions = computed(() => {
  return dashboardLayouts.map((layout: any) => ({
    label: layout.name,
    value: layout.id
  }))
})

// Methods
const initializeDashboard = async () => {
  try {
    await Promise.all([
      widgetsStore.initializeWidgets(),
      dashboardStore.initializeDashboard()
    ])

    // Set selected layout
    if (currentLayout) {
      selectedLayoutId.value = currentLayout.id
    }
  } catch (err) {
    console.error('Failed to initialize dashboard:', err)
  }
}

const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
}

const openWidgetLibrary = () => {
  showWidgetLibrary.value = true
}

const handleLayoutChange = async (layoutId: string) => {
  try {
    await widgetsStore.setCurrentLayout(layoutId)
  } catch (err) {
    console.error('Failed to change layout:', err)
  }
}

const handleAddWidget = async (widget: Widget) => {
  try {
    // Add widget to current layout with default position
    const defaultPosition = {
      x: 0,
      y: 0,
      width: 2,
      height: 2
    }

    await widgetsStore.addWidgetToLayout(widget.id, defaultPosition)
    showWidgetLibrary.value = false
  } catch (err) {
    console.error('Failed to add widget:', err)
  }
}

const handleAddWidgets = async (widgets: Widget[]) => {
  try {
    // Add multiple widgets with automatic positioning
    for (let i = 0; i < widgets.length; i++) {
      const widget = widgets[i]
      if (widget) {
        const position = {
          x: (i % 3) * 2, // 3 columns
          y: Math.floor(i / 3) * 2, // 2 rows per widget
          width: 2,
          height: 2
        }

        await widgetsStore.addWidgetToLayout(widget.id, position)
      }
    }

    showWidgetLibrary.value = false
  } catch (err) {
    console.error('Failed to add widgets:', err)
  }
}

const handleWidgetAdded = (widget: WidgetInstance) => {
  // Handle widget added event
  console.log('Widget added:', widget)
}

const handleWidgetRemoved = (widgetId: string) => {
  // Handle widget removed event
  console.log('Widget removed:', widgetId)
}

const handleOnlineStatusChange = () => {
  isOffline.value = !navigator.onLine
}

// Lifecycle
onMounted(async () => {
  await initializeDashboard()

  // Listen for online/offline events
  window.addEventListener('online', handleOnlineStatusChange)
  window.addEventListener('offline', handleOnlineStatusChange)

  // Set initial offline status
  isOffline.value = !navigator.onLine
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnlineStatusChange)
  window.removeEventListener('offline', handleOnlineStatusChange)
})
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: var(--q-color-background);
}

.dashboard-header {
  background: var(--q-color-surface);
  border-bottom: 1px solid var(--q-color-separator);
  position: sticky;
  top: 0;
  z-index: 100;
}

.dashboard-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dashboard-content {
  flex: 1;
  min-height: calc(100vh - 120px);
}

.dashboard-loading,
.dashboard-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.offline-banner {
  position: fixed;
  bottom: 16px;
  left: 16px;
  right: 16px;
  z-index: 1000;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .dashboard-header .row {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .dashboard-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .dashboard-controls .q-select {
    margin-right: 0;
    margin-bottom: 8px;
  }

  .dashboard-controls .q-btn {
    margin-right: 0;
    margin-bottom: 8px;
  }

  .dashboard-content {
    padding: 8px;
  }

  .offline-banner {
    bottom: 8px;
    left: 8px;
    right: 8px;
  }
}

/* Tablet optimizations */
@media (max-width: 1024px) {
  .dashboard-controls {
    flex-wrap: wrap;
  }

  .dashboard-controls .q-select {
    min-width: 150px;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .dashboard-controls .q-btn {
    min-height: 44px;
    min-width: 88px;
  }

  .dashboard-header {
    padding: 16px;
  }
}

/* Dark mode adjustments */
.body--dark .dashboard-page {
  background: var(--q-dark-page);
}

.body--dark .dashboard-header {
  background: var(--q-dark);
  border-bottom-color: rgba(255, 255, 255, 0.12);
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .dashboard-header {
    border-bottom-width: 2px;
  }

  .offline-banner {
    border: 2px solid var(--q-color-warning);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .offline-banner {
    animation: none;
  }

  @keyframes slideUp {
    from, to {
      transform: translateY(0);
      opacity: 1;
    }
  }
}
</style>