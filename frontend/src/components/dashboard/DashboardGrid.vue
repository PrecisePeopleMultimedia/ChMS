<template>
  <div 
    class="dashboard-grid"
    :class="{ 'is-dragging': isDragging }"
    :style="gridStyle"
    @dragover.prevent
    @drop="handleDrop"
  >
    <!-- Grid Background -->
    <div class="grid-background" :style="gridBackgroundStyle"></div>
    
    <!-- Widget Instances -->
    <DashboardWidget
      v-for="widget in visibleWidgets"
      :key="widget.id"
      :widget="widget"
      :is-editing="isEditMode"
      @update-position="handleWidgetPositionUpdate"
      @update-config="handleWidgetConfigUpdate"
      @remove="handleWidgetRemove"
      @start-drag="handleStartDrag"
      @stop-drag="handleStopDrag"
    />
    
    <!-- Drop Zone Indicator -->
    <div
      v-if="isDragging && dropZone"
      class="drop-zone-indicator"
      :style="dropZoneStyle"
    ></div>
    
    <!-- Empty State -->
    <div v-if="!visibleWidgets.length && !isLoading" class="empty-state">
      <q-icon name="dashboard" size="4rem" color="grey-5" />
      <h3 class="text-h6 text-grey-6 q-mt-md">No widgets added yet</h3>
      <p class="text-body2 text-grey-5 q-mb-lg">
        Add widgets from the library to customize your dashboard
      </p>
      <q-btn
        color="primary"
        icon="add"
        label="Add Widget"
        @click="$emit('open-widget-library')"
      />
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <q-spinner-dots size="3rem" color="primary" />
      <p class="text-body2 text-grey-6 q-mt-md">Loading dashboard...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useWidgetsStore } from '@/stores/widgets'
import type { WidgetInstance, WidgetPosition, WidgetConfig } from '@/stores/widgets'
import DashboardWidget from './DashboardWidget.vue'

interface Props {
  isEditMode?: boolean
  gridSize?: number
  gap?: number
}

interface Emits {
  (e: 'open-widget-library'): void
  (e: 'widget-added', widget: WidgetInstance): void
  (e: 'widget-removed', widgetId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  isEditMode: false,
  gridSize: 100,
  gap: 16
})

const emit = defineEmits<Emits>()

const widgetsStore = useWidgetsStore()

// Reactive state
const dropZone = ref<WidgetPosition | null>(null)
const dragOverPosition = ref<{ x: number; y: number } | null>(null)

// Computed properties
const { 
  currentLayout, 
  visibleWidgets, 
  isLoading, 
  isDragging, 
  draggedWidget 
} = widgetsStore

const gridStyle = computed(() => {
  if (!currentLayout.value) return {}
  
  const { columns, rows } = currentLayout.value.layoutConfig
  
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, ${props.gridSize}px)`,
    gap: `${props.gap}px`,
    minHeight: `${rows * props.gridSize + (rows - 1) * props.gap}px`,
    position: 'relative'
  }
})

const gridBackgroundStyle = computed(() => {
  if (!props.isEditMode) return { display: 'none' }
  
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
    `,
    backgroundSize: `${props.gridSize + props.gap}px ${props.gridSize + props.gap}px`,
    pointerEvents: 'none',
    zIndex: 0
  }
})

const dropZoneStyle = computed(() => {
  if (!dropZone.value) return {}
  
  const { x, y, width, height } = dropZone.value
  
  return {
    position: 'absolute',
    gridColumnStart: x + 1,
    gridColumnEnd: x + width + 1,
    gridRowStart: y + 1,
    gridRowEnd: y + height + 1,
    backgroundColor: 'rgba(25, 118, 210, 0.2)',
    border: '2px dashed #1976d2',
    borderRadius: '8px',
    zIndex: 1000,
    pointerEvents: 'none'
  }
})

// Methods
const handleWidgetPositionUpdate = async (widgetId: string, position: WidgetPosition) => {
  try {
    await widgetsStore.updateWidgetPosition(widgetId, position)
  } catch (error) {
    console.error('Failed to update widget position:', error)
  }
}

const handleWidgetConfigUpdate = async (widgetId: string, config: WidgetConfig) => {
  try {
    await widgetsStore.updateWidgetConfig(widgetId, config)
  } catch (error) {
    console.error('Failed to update widget config:', error)
  }
}

const handleWidgetRemove = async (widgetId: string) => {
  try {
    await widgetsStore.removeWidgetFromLayout(widgetId)
    emit('widget-removed', widgetId)
  } catch (error) {
    console.error('Failed to remove widget:', error)
  }
}

const handleStartDrag = (widget: WidgetInstance) => {
  widgetsStore.startDragging(widget)
}

const handleStopDrag = () => {
  widgetsStore.stopDragging()
  dropZone.value = null
}

const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  
  if (!draggedWidget.value || !dropZone.value) return
  
  try {
    // If it's an existing widget being moved
    if (visibleWidgets.value.find(w => w.id === draggedWidget.value!.id)) {
      await handleWidgetPositionUpdate(draggedWidget.value.id, dropZone.value)
    } else {
      // If it's a new widget being added from the library
      await widgetsStore.addWidgetToLayout(
        draggedWidget.value.widgetId,
        dropZone.value,
        draggedWidget.value.config
      )
      emit('widget-added', draggedWidget.value)
    }
  } catch (error) {
    console.error('Failed to handle drop:', error)
  } finally {
    handleStopDrag()
  }
}

const calculateDropZone = (event: DragEvent): WidgetPosition | null => {
  if (!currentLayout.value) return null
  
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  const { columns, rows } = currentLayout.value.layoutConfig
  const cellWidth = (rect.width - (columns - 1) * props.gap) / columns
  const cellHeight = props.gridSize
  
  const gridX = Math.floor(x / (cellWidth + props.gap))
  const gridY = Math.floor(y / (cellHeight + props.gap))
  
  // Default widget size (can be customized)
  const defaultWidth = 2
  const defaultHeight = 2
  
  // Ensure the widget fits within the grid
  const finalX = Math.max(0, Math.min(gridX, columns - defaultWidth))
  const finalY = Math.max(0, Math.min(gridY, rows - defaultHeight))
  const finalWidth = Math.min(defaultWidth, columns - finalX)
  const finalHeight = Math.min(defaultHeight, rows - finalY)
  
  return {
    x: finalX,
    y: finalY,
    width: finalWidth,
    height: finalHeight
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  
  if (!isDragging.value) return
  
  dropZone.value = calculateDropZone(event)
}

// Lifecycle
onMounted(() => {
  const gridElement = document.querySelector('.dashboard-grid')
  if (gridElement) {
    gridElement.addEventListener('dragover', handleDragOver)
  }
})

onUnmounted(() => {
  const gridElement = document.querySelector('.dashboard-grid')
  if (gridElement) {
    gridElement.removeEventListener('dragover', handleDragOver)
  }
})
</script>

<style scoped>
.dashboard-grid {
  width: 100%;
  padding: 16px;
  background-color: var(--q-color-background);
  border-radius: 8px;
  position: relative;
  transition: background-color 0.3s ease;
}

.dashboard-grid.is-dragging {
  background-color: rgba(25, 118, 210, 0.05);
}

.grid-background {
  opacity: 0.3;
}

.drop-zone-indicator {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { opacity: 0.3; }
  50% { opacity: 0.6; }
  100% { opacity: 0.3; }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .dashboard-grid {
    padding: 8px;
    gap: 8px;
  }
  
  .empty-state {
    min-height: 300px;
  }
  
  .empty-state h3 {
    font-size: 1.2rem;
  }
  
  .empty-state p {
    font-size: 0.9rem;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .dashboard-grid {
    /* Larger touch targets for mobile */
    gap: 12px;
  }
  
  .drop-zone-indicator {
    /* More visible on touch devices */
    border-width: 3px;
    background-color: rgba(25, 118, 210, 0.3);
  }
}
</style>
