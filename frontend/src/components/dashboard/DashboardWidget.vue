<template>
  <div
    class="dashboard-widget"
    :class="widgetClasses"
    :style="widgetStyle"
    :draggable="isEditing"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <!-- Widget Header -->
    <div v-if="showHeader" class="widget-header">
      <div class="widget-title">
        <q-icon 
          v-if="widget.widget?.icon" 
          :name="widget.widget.icon" 
          size="sm" 
          class="q-mr-xs"
        />
        <span class="text-subtitle2">{{ widget.widget?.name || 'Widget' }}</span>
      </div>
      
      <div class="widget-actions">
        <!-- Refresh Button -->
        <q-btn
          v-if="canRefresh"
          flat
          dense
          round
          size="sm"
          icon="refresh"
          color="grey-6"
          @click="handleRefresh"
          :loading="isRefreshing"
        >
          <q-tooltip>Refresh widget data</q-tooltip>
        </q-btn>
        
        <!-- Config Button -->
        <q-btn
          v-if="isEditing"
          flat
          dense
          round
          size="sm"
          icon="settings"
          color="grey-6"
          @click="openConfigDialog"
        >
          <q-tooltip>Configure widget</q-tooltip>
        </q-btn>
        
        <!-- Remove Button -->
        <q-btn
          v-if="isEditing"
          flat
          dense
          round
          size="sm"
          icon="close"
          color="negative"
          @click="handleRemove"
        >
          <q-tooltip>Remove widget</q-tooltip>
        </q-btn>
      </div>
    </div>
    
    <!-- Widget Content -->
    <div class="widget-content" :class="{ 'has-header': showHeader }">
      <!-- Dynamic Widget Component -->
      <component
        :is="widgetComponent"
        v-if="widgetComponent"
        :widget="widget"
        :data="widgetData"
        :config="widget.config"
        :is-loading="isLoading"
        :error="error"
        @update-config="handleConfigUpdate"
      />
      
      <!-- Fallback Content -->
      <div v-else class="widget-fallback">
        <q-icon name="widgets" size="2rem" color="grey-5" />
        <p class="text-body2 text-grey-6 q-mt-sm">
          Widget component not found
        </p>
      </div>
      
      <!-- Loading Overlay -->
      <div v-if="isLoading" class="widget-loading">
        <q-spinner size="md" color="primary" />
      </div>
      
      <!-- Error Overlay -->
      <div v-if="error" class="widget-error">
        <q-icon name="error_outline" size="md" color="negative" />
        <p class="text-caption text-negative q-mt-xs">{{ error }}</p>
      </div>
      
      <!-- Offline Indicator -->
      <div v-if="isOffline" class="widget-offline">
        <q-icon name="cloud_off" size="sm" color="warning" />
        <span class="text-caption text-warning">Offline</span>
      </div>
    </div>
    
    <!-- Resize Handles (Edit Mode) -->
    <div v-if="isEditing" class="resize-handles">
      <div class="resize-handle resize-se" @mousedown="startResize('se')"></div>
      <div class="resize-handle resize-sw" @mousedown="startResize('sw')"></div>
      <div class="resize-handle resize-ne" @mousedown="startResize('ne')"></div>
      <div class="resize-handle resize-nw" @mousedown="startResize('nw')"></div>
    </div>
    
    <!-- Widget Configuration Dialog -->
    <q-dialog v-model="showConfigDialog" persistent>
      <WidgetConfigPanel
        :widget="widget"
        @save="handleConfigSave"
        @cancel="showConfigDialog = false"
      />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { useWidgetsStore } from '@/stores/widgets'
import type { WidgetInstance, WidgetConfig } from '@/stores/widgets'
import WidgetConfigPanel from './WidgetConfigPanel.vue'

interface Props {
  widget: WidgetInstance
  isEditing?: boolean
  showHeader?: boolean
}

interface Emits {
  (e: 'update-position', widgetId: string, position: any): void
  (e: 'update-config', widgetId: string, config: WidgetConfig): void
  (e: 'remove', widgetId: string): void
  (e: 'start-drag', widget: WidgetInstance): void
  (e: 'stop-drag'): void
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false,
  showHeader: true
})

const emit = defineEmits<Emits>()

const widgetsStore = useWidgetsStore()

// Reactive state
const isRefreshing = ref(false)
const showConfigDialog = ref(false)
const isResizing = ref(false)
const error = ref<string | null>(null)

// Computed properties
const widgetData = computed(() => widgetsStore.getWidgetData(props.widget.id))

const isLoading = computed(() => widgetsStore.isLoading)

const isOffline = computed(() => {
  // Check if widget data is stale or if we're offline
  return false // TODO: Implement offline detection
})

const widgetClasses = computed(() => ({
  'is-editing': props.isEditing,
  'is-dragging': widgetsStore.isDragging && widgetsStore.draggedWidget?.id === props.widget.id,
  'is-resizing': isResizing.value,
  'has-error': !!error.value,
  'is-offline': isOffline.value
}))

const widgetStyle = computed(() => {
  const { x, y, width, height } = props.widget.position
  
  return {
    gridColumnStart: x + 1,
    gridColumnEnd: x + width + 1,
    gridRowStart: y + 1,
    gridRowEnd: y + height + 1,
    zIndex: props.isEditing ? 10 : 1
  }
})

const canRefresh = computed(() => {
  return props.widget.widget?.dataSource && !isLoading.value
})

// Dynamic component loading
const widgetComponent = computed(() => {
  if (!props.widget.widget?.component) return null
  
  try {
    return defineAsyncComponent(() => 
      import(`./widgets/${props.widget.widget!.component}.vue`)
    )
  } catch (err) {
    console.error('Failed to load widget component:', err)
    return null
  }
})

// Methods
const handleDragStart = (event: DragEvent) => {
  if (!props.isEditing) return
  
  event.dataTransfer!.effectAllowed = 'move'
  event.dataTransfer!.setData('text/plain', props.widget.id)
  
  emit('start-drag', props.widget)
}

const handleDragEnd = () => {
  emit('stop-drag')
}

const handleRefresh = async () => {
  try {
    isRefreshing.value = true
    error.value = null
    await widgetsStore.refreshWidgetData(props.widget.id)
  } catch (err: any) {
    error.value = err.message || 'Failed to refresh widget data'
  } finally {
    isRefreshing.value = false
  }
}

const handleRemove = () => {
  emit('remove', props.widget.id)
}

const openConfigDialog = () => {
  showConfigDialog.value = true
}

const handleConfigUpdate = (config: WidgetConfig) => {
  emit('update-config', props.widget.id, config)
}

const handleConfigSave = (config: WidgetConfig) => {
  handleConfigUpdate(config)
  showConfigDialog.value = false
}

const startResize = (direction: string) => {
  // TODO: Implement resize functionality
  console.log('Start resize:', direction)
  isResizing.value = true
}

// Lifecycle
onMounted(() => {
  // Initialize widget data if needed
  if (props.widget.widget?.dataSource && !widgetData.value) {
    widgetsStore.refreshWidgetData(props.widget.id)
  }
})

onUnmounted(() => {
  // Cleanup if needed
})
</script>

<style scoped>
.dashboard-widget {
  background: var(--q-color-surface);
  border: 1px solid var(--q-color-separator);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  cursor: default;
}

.dashboard-widget:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dashboard-widget.is-editing {
  cursor: move;
  border-color: var(--q-color-primary);
}

.dashboard-widget.is-dragging {
  opacity: 0.7;
  transform: rotate(2deg);
  z-index: 1000;
}

.dashboard-widget.is-resizing {
  border-color: var(--q-color-secondary);
}

.dashboard-widget.has-error {
  border-color: var(--q-color-negative);
}

.dashboard-widget.is-offline {
  opacity: 0.8;
}

.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--q-color-background);
  border-bottom: 1px solid var(--q-color-separator);
  min-height: 48px;
}

.widget-title {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: var(--q-color-on-surface);
}

.widget-actions {
  display: flex;
  gap: 4px;
}

.widget-content {
  position: relative;
  height: 100%;
  padding: 16px;
}

.widget-content.has-header {
  height: calc(100% - 48px);
}

.widget-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.widget-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  z-index: 10;
}

.widget-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  text-align: center;
  padding: 16px;
  z-index: 10;
}

.widget-offline {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 12px;
  z-index: 5;
}

.resize-handles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  width: 12px;
  height: 12px;
  background: var(--q-color-primary);
  border: 2px solid white;
  border-radius: 50%;
  pointer-events: all;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.dashboard-widget.is-editing:hover .resize-handle {
  opacity: 1;
}

.resize-se {
  bottom: -6px;
  right: -6px;
  cursor: se-resize;
}

.resize-sw {
  bottom: -6px;
  left: -6px;
  cursor: sw-resize;
}

.resize-ne {
  top: -6px;
  right: -6px;
  cursor: ne-resize;
}

.resize-nw {
  top: -6px;
  left: -6px;
  cursor: nw-resize;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .widget-header {
    padding: 8px 12px;
    min-height: 40px;
  }
  
  .widget-content {
    padding: 12px;
  }
  
  .widget-content.has-header {
    height: calc(100% - 40px);
  }
  
  .widget-actions .q-btn {
    min-width: 32px;
    min-height: 32px;
  }
  
  .resize-handle {
    width: 16px;
    height: 16px;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .dashboard-widget.is-editing .resize-handle {
    opacity: 0.7;
    width: 20px;
    height: 20px;
  }
  
  .widget-actions .q-btn {
    min-width: 44px;
    min-height: 44px;
  }
}
</style>
