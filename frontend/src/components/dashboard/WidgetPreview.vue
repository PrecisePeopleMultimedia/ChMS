<template>
  <q-card class="widget-preview-dialog" style="min-width: 500px; max-width: 700px;">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">Widget Preview</div>
      <q-space />
      <q-btn icon="close" flat round dense @click="$emit('close')" />
    </q-card-section>

    <q-card-section>
      <!-- Widget Info -->
      <div class="widget-info q-mb-md">
        <div class="row items-center q-mb-sm">
          <q-icon 
            :name="widget.icon || getWidgetIcon(widget.type)" 
            size="lg" 
            :color="widget.isSystemWidget ? 'primary' : 'secondary'"
            class="q-mr-md"
          />
          <div class="col">
            <div class="text-h6">{{ widget.name }}</div>
            <div class="text-body2 text-grey-6">{{ widget.description }}</div>
            <div class="q-mt-xs">
              <q-chip
                :color="widget.isSystemWidget ? 'primary' : 'secondary'"
                text-color="white"
                size="sm"
                dense
              >
                {{ widget.isSystemWidget ? 'System Widget' : 'Custom Widget' }}
              </q-chip>
              <q-chip
                :color="getTypeColor(widget.type)"
                text-color="white"
                size="sm"
                dense
                class="q-ml-xs"
              >
                {{ widget.type }}
              </q-chip>
            </div>
          </div>
        </div>
      </div>

      <q-separator class="q-mb-md" />

      <!-- Widget Preview -->
      <div class="preview-section q-mb-md">
        <div class="text-subtitle2 q-mb-sm">Preview</div>
        <div class="preview-container">
          <div class="preview-widget" :style="previewStyle">
            <!-- Mock Widget Header -->
            <div v-if="showHeader" class="preview-header">
              <div class="text-subtitle2">{{ widget.name }}</div>
              <div class="preview-actions">
                <q-icon name="refresh" size="sm" color="grey-6" />
                <q-icon name="more_vert" size="sm" color="grey-6" class="q-ml-xs" />
              </div>
            </div>
            
            <!-- Mock Widget Content -->
            <div class="preview-content">
              <component
                :is="previewComponent"
                :widget="widget"
                :mock-data="mockData"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Widget Features -->
      <div v-if="widgetFeatures.length" class="features-section q-mb-md">
        <div class="text-subtitle2 q-mb-sm">Features</div>
        <div class="features-list">
          <div
            v-for="feature in widgetFeatures"
            :key="feature.name"
            class="feature-item"
          >
            <q-icon :name="feature.icon" size="sm" :color="feature.color" />
            <span class="q-ml-sm">{{ feature.name }}</span>
            <span v-if="feature.description" class="text-caption text-grey-6 q-ml-xs">
              - {{ feature.description }}
            </span>
          </div>
        </div>
      </div>

      <!-- Widget Configuration -->
      <div class="config-section">
        <div class="text-subtitle2 q-mb-sm">Configuration Options</div>
        <div class="config-options">
          <q-checkbox
            v-model="showHeader"
            label="Show widget header"
            class="q-mb-sm"
          />
          <q-select
            v-model="selectedTheme"
            :options="themeOptions"
            label="Color Theme"
            outlined
            dense
            emit-value
            map-options
            class="q-mb-sm"
            style="max-width: 200px;"
          />
          <q-select
            v-model="selectedSize"
            :options="sizeOptions"
            label="Widget Size"
            outlined
            dense
            emit-value
            map-options
            style="max-width: 200px;"
          />
        </div>
      </div>
    </q-card-section>

    <q-card-actions align="right" class="q-pa-md">
      <q-btn
        flat
        label="Cancel"
        color="grey-6"
        @click="$emit('close')"
      />
      <q-btn
        unelevated
        label="Add to Dashboard"
        color="primary"
        icon="add"
        @click="handleAddWidget"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref, defineAsyncComponent } from 'vue'
import type { Widget } from '@/stores/widgets'

interface Props {
  widget: Widget
}

interface Emits {
  (e: 'close'): void
  (e: 'add', widget: Widget): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Reactive state
const showHeader = ref(true)
const selectedTheme = ref('default')
const selectedSize = ref('medium')

// Options
const themeOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Success', value: 'positive' },
  { label: 'Warning', value: 'warning' },
  { label: 'Error', value: 'negative' }
]

const sizeOptions = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' }
]

// Computed properties
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

const previewStyle = computed(() => {
  const sizeMap = {
    small: { width: '200px', height: '150px' },
    medium: { width: '300px', height: '200px' },
    large: { width: '400px', height: '250px' }
  }
  
  const size = sizeMap[selectedSize.value as keyof typeof sizeMap]
  
  return {
    ...size,
    border: '1px solid var(--q-color-separator)',
    borderRadius: '8px',
    backgroundColor: 'var(--q-color-surface)',
    color: selectedTheme.value !== 'default' ? `var(--q-color-${selectedTheme.value})` : undefined
  }
})

const widgetFeatures = computed(() => {
  const features = []
  
  if (props.widget.dataSource) {
    features.push({
      name: 'Real-time Data',
      description: 'Updates automatically with live data',
      icon: 'sync',
      color: 'positive'
    })
  }
  
  if (props.widget.permissions?.length) {
    features.push({
      name: 'Permission Control',
      description: 'Respects user permissions',
      icon: 'security',
      color: 'warning'
    })
  }
  
  if (props.widget.defaultConfig?.interactive) {
    features.push({
      name: 'Interactive',
      description: 'Supports user interactions',
      icon: 'touch_app',
      color: 'info'
    })
  }
  
  if (props.widget.defaultConfig?.exportable) {
    features.push({
      name: 'Exportable',
      description: 'Data can be exported',
      icon: 'download',
      color: 'secondary'
    })
  }
  
  return features
})

const mockData = computed(() => {
  // Generate mock data based on widget type
  switch (props.widget.type) {
    case 'metric':
      return {
        value: 1247,
        trend: 12.5,
        label: 'Total Count'
      }
    case 'chart':
      return {
        data: [
          { label: 'Jan', value: 100 },
          { label: 'Feb', value: 120 },
          { label: 'Mar', value: 90 },
          { label: 'Apr', value: 140 },
          { label: 'May', value: 160 }
        ]
      }
    case 'list':
      return {
        items: [
          { id: 1, name: 'John Doe', status: 'Active' },
          { id: 2, name: 'Jane Smith', status: 'Pending' },
          { id: 3, name: 'Bob Johnson', status: 'Active' }
        ]
      }
    default:
      return {}
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

const handleAddWidget = () => {
  emit('add', props.widget)
}
</script>

<style scoped>
.widget-preview-dialog {
  max-height: 80vh;
  overflow-y: auto;
}

.widget-info {
  background: var(--q-color-background);
  border-radius: 8px;
  padding: 16px;
}

.preview-section {
  text-align: center;
}

.preview-container {
  display: flex;
  justify-content: center;
  padding: 16px;
  background: var(--q-color-background);
  border-radius: 8px;
}

.preview-widget {
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--q-color-background);
  border-bottom: 1px solid var(--q-color-separator);
}

.preview-actions {
  display: flex;
  align-items: center;
}

.preview-content {
  padding: 16px;
  height: calc(100% - 48px);
}

.features-section {
  background: var(--q-color-background);
  border-radius: 8px;
  padding: 16px;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-item {
  display: flex;
  align-items: center;
}

.config-section {
  background: var(--q-color-background);
  border-radius: 8px;
  padding: 16px;
}

.config-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .widget-preview-dialog {
    min-width: 300px;
    max-width: 95vw;
  }
  
  .preview-container {
    padding: 8px;
  }
  
  .preview-widget {
    max-width: 100%;
  }
  
  .widget-info,
  .features-section,
  .config-section {
    padding: 12px;
  }
}
</style>
