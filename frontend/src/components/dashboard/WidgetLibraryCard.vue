<template>
  <q-card
    class="widget-library-card"
    :class="{ 'is-selected': isSelected }"
    @click="$emit('select', widget.id)"
  >
    <!-- Widget Preview -->
    <div class="widget-preview">
      <div class="preview-header">
        <q-icon 
          :name="widget.icon || getWidgetIcon(widget.type)" 
          size="md" 
          :color="widget.isSystemWidget ? 'primary' : 'secondary'"
        />
        <q-chip
          v-if="widget.isSystemWidget"
          size="sm"
          color="primary"
          text-color="white"
          dense
        >
          System
        </q-chip>
        <q-chip
          v-else
          size="sm"
          color="secondary"
          text-color="white"
          dense
        >
          Custom
        </q-chip>
      </div>
      
      <div class="preview-content">
        <!-- Mock widget content based on type -->
        <component
          :is="previewComponent"
          :widget="widget"
          class="widget-mock"
        />
      </div>
    </div>

    <!-- Widget Info -->
    <q-card-section class="widget-info">
      <div class="widget-title">
        <div class="text-subtitle2 text-weight-medium">
          {{ widget.name }}
        </div>
        <div class="widget-type">
          <q-badge :color="getTypeColor(widget.type)" :label="widget.type" />
        </div>
      </div>
      
      <div class="widget-description">
        <p class="text-caption text-grey-6">
          {{ widget.description || 'No description available' }}
        </p>
      </div>
      
      <!-- Widget Features -->
      <div v-if="widgetFeatures.length" class="widget-features">
        <q-chip
          v-for="feature in widgetFeatures"
          :key="feature"
          size="sm"
          outline
          dense
          class="q-mr-xs q-mb-xs"
        >
          {{ feature }}
        </q-chip>
      </div>
    </q-card-section>

    <!-- Widget Actions -->
    <q-card-actions class="widget-actions">
      <q-btn
        flat
        dense
        size="sm"
        icon="visibility"
        label="Preview"
        color="grey-6"
        @click.stop="$emit('preview', widget)"
      />
      
      <q-space />
      
      <q-btn
        unelevated
        dense
        size="sm"
        icon="add"
        label="Add"
        color="primary"
        @click.stop="$emit('add', widget)"
      />
    </q-card-actions>

    <!-- Selection Indicator -->
    <div v-if="isSelected" class="selection-indicator">
      <q-icon name="check_circle" size="md" color="primary" />
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type { Widget } from '@/stores/widgets'

interface Props {
  widget: Widget
  isSelected?: boolean
}

interface Emits {
  (e: 'select', widgetId: string): void
  (e: 'preview', widget: Widget): void
  (e: 'add', widget: Widget): void
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false
})

const emit = defineEmits<Emits>()

// Computed properties
const widgetFeatures = computed(() => {
  const features: string[] = []
  
  if (props.widget.dataSource) {
    features.push('Real-time data')
  }
  
  if (props.widget.permissions?.length) {
    features.push('Permissions')
  }
  
  if (props.widget.defaultConfig?.refreshInterval) {
    features.push('Auto-refresh')
  }
  
  if (props.widget.defaultConfig?.interactive) {
    features.push('Interactive')
  }
  
  return features
})

const previewComponent = computed(() => {
  try {
    return defineAsyncComponent(() => 
      import(`./widgets/previews/${props.widget.type}Preview.vue`)
    )
  } catch (err) {
    return defineAsyncComponent(() => 
      import('./widgets/previews/DefaultPreview.vue')
    )
  }
})

// Methods
const getWidgetIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    metric: 'analytics',
    chart: 'bar_chart',
    list: 'list',
    action: 'play_circle',
    form: 'edit_note',
    custom: 'extension',
    system: 'settings_applications'
  }
  
  return iconMap[type] || 'widgets'
}

const getTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    metric: 'blue',
    chart: 'green',
    list: 'orange',
    action: 'purple',
    form: 'teal',
    custom: 'grey',
    system: 'primary'
  }
  
  return colorMap[type] || 'grey'
}
</script>

<style scoped>
.widget-library-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.widget-library-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.widget-library-card.is-selected {
  border-color: var(--q-color-primary);
  box-shadow: 0 0 0 1px var(--q-color-primary);
}

.widget-preview {
  height: 120px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow: hidden;
}

.preview-header {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
}

.preview-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.widget-mock {
  width: 100%;
  height: 100%;
  opacity: 0.7;
}

.widget-info {
  padding: 12px 16px;
}

.widget-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.widget-type {
  flex-shrink: 0;
}

.widget-description {
  margin-bottom: 8px;
  min-height: 32px;
}

.widget-features {
  margin-top: 8px;
}

.widget-actions {
  padding: 8px 16px 12px;
  background: var(--q-color-background);
}

.selection-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  background: white;
  border-radius: 50%;
  padding: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Widget type specific preview backgrounds */
.widget-library-card[data-type="metric"] .widget-preview {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.widget-library-card[data-type="chart"] .widget-preview {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.widget-library-card[data-type="list"] .widget-preview {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.widget-library-card[data-type="action"] .widget-preview {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.widget-library-card[data-type="form"] .widget-preview {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.widget-library-card[data-type="custom"] .widget-preview {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .widget-preview {
    height: 100px;
  }
  
  .widget-info {
    padding: 10px 12px;
  }
  
  .widget-actions {
    padding: 6px 12px 10px;
  }
  
  .widget-actions .q-btn {
    font-size: 0.75rem;
    padding: 4px 8px;
  }
  
  .widget-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .widget-description {
    min-height: 24px;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .widget-library-card {
    /* Remove hover effects on touch devices */
  }
  
  .widget-library-card:active {
    transform: scale(0.98);
  }
  
  .widget-actions .q-btn {
    min-height: 36px;
    min-width: 64px;
  }
}
</style>
