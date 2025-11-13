<template>
  <q-card class="widget-config-panel" style="min-width: 400px; max-width: 600px;">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">Configure Widget</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-card-section>
      <div class="widget-info q-mb-md">
        <div class="row items-center q-mb-sm">
          <q-icon 
            :name="widget.widget?.icon || 'widgets'" 
            size="md" 
            color="primary" 
            class="q-mr-sm"
          />
          <div>
            <div class="text-subtitle1 text-weight-medium">
              {{ widget.widget?.name || 'Widget' }}
            </div>
            <div class="text-caption text-grey-6">
              {{ widget.widget?.description || 'No description available' }}
            </div>
          </div>
        </div>
      </div>

      <q-separator class="q-mb-md" />

      <!-- Widget Configuration Form -->
      <q-form @submit="handleSave" class="widget-config-form">
        <!-- General Settings -->
        <div class="config-section q-mb-md">
          <div class="text-subtitle2 q-mb-sm">General Settings</div>
          
          <!-- Widget Title Override -->
          <q-input
            v-model="configData.title"
            label="Widget Title"
            outlined
            dense
            class="q-mb-sm"
            hint="Override the default widget title"
          />
          
          <!-- Refresh Interval -->
          <q-select
            v-model="configData.refreshInterval"
            :options="refreshIntervalOptions"
            label="Refresh Interval"
            outlined
            dense
            emit-value
            map-options
            class="q-mb-sm"
            hint="How often to refresh widget data"
          />
          
          <!-- Show Header -->
          <q-checkbox
            v-model="configData.showHeader"
            label="Show widget header"
            class="q-mb-sm"
          />
        </div>

        <!-- Widget-Specific Configuration -->
        <div v-if="hasWidgetSpecificConfig" class="config-section q-mb-md">
          <div class="text-subtitle2 q-mb-sm">Widget Settings</div>
          
          <!-- Dynamic configuration based on widget type -->
          <component
            :is="configComponent"
            v-if="configComponent"
            v-model="configData.widgetSpecific"
            :widget="widget"
          />
          
          <!-- Fallback generic configuration -->
          <div v-else class="generic-config">
            <q-input
              v-for="(value, key) in configData.widgetSpecific"
              :key="key"
              v-model="configData.widgetSpecific[key]"
              :label="formatConfigLabel(String(key))"
              outlined
              dense
              class="q-mb-sm"
            />
          </div>
        </div>

        <!-- Display Settings -->
        <div class="config-section q-mb-md">
          <div class="text-subtitle2 q-mb-sm">Display Settings</div>
          
          <!-- Color Theme -->
          <q-select
            v-model="configData.colorTheme"
            :options="colorThemeOptions"
            label="Color Theme"
            outlined
            dense
            emit-value
            map-options
            class="q-mb-sm"
          />
          
          <!-- Show Border -->
          <q-checkbox
            v-model="configData.showBorder"
            label="Show widget border"
            class="q-mb-sm"
          />
          
          <!-- Background Opacity -->
          <div class="q-mb-sm">
            <div class="text-body2 q-mb-xs">Background Opacity</div>
            <q-slider
              v-model="configData.backgroundOpacity"
              :min="0"
              :max="100"
              :step="10"
              label
              label-always
              markers
              class="q-px-sm"
            />
          </div>
        </div>

        <!-- Data Settings (if applicable) -->
        <div v-if="hasDataSettings" class="config-section q-mb-md">
          <div class="text-subtitle2 q-mb-sm">Data Settings</div>
          
          <!-- Data Source -->
          <q-select
            v-model="configData.dataSource"
            :options="dataSourceOptions"
            label="Data Source"
            outlined
            dense
            emit-value
            map-options
            class="q-mb-sm"
            hint="Select the data source for this widget"
          />
          
          <!-- Date Range -->
          <q-select
            v-model="configData.dateRange"
            :options="dateRangeOptions"
            label="Date Range"
            outlined
            dense
            emit-value
            map-options
            class="q-mb-sm"
          />
          
          <!-- Max Items -->
          <q-input
            v-model.number="configData.maxItems"
            type="number"
            label="Maximum Items"
            outlined
            dense
            :min="1"
            :max="100"
            class="q-mb-sm"
            hint="Maximum number of items to display"
          />
        </div>

        <!-- Preview -->
        <div class="config-section q-mb-md">
          <div class="text-subtitle2 q-mb-sm">Preview</div>
          <div class="config-preview">
            <div class="preview-widget" :style="previewStyle">
              <div v-if="configData.showHeader" class="preview-header">
                <span class="text-subtitle2">
                  {{ configData.title || widget.widget?.name || 'Widget' }}
                </span>
              </div>
              <div class="preview-content">
                <q-icon name="preview" size="md" color="grey-5" />
                <div class="text-caption text-grey-6 q-mt-xs">
                  Widget preview
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-form>
    </q-card-section>

    <q-card-actions align="right" class="q-pa-md">
      <q-btn
        flat
        label="Cancel"
        color="grey-6"
        @click="$emit('cancel')"
      />
      <q-btn
        flat
        label="Reset"
        color="warning"
        @click="resetConfig"
      />
      <q-btn
        unelevated
        label="Save"
        color="primary"
        @click="handleSave"
        :loading="isSaving"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted, defineAsyncComponent } from 'vue'
import type { WidgetInstance, WidgetConfig } from '@/stores/widgets'

interface Props {
  widget: WidgetInstance
}

interface Emits {
  (e: 'save', config: WidgetConfig): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Reactive state
const isSaving = ref(false)
const configData = reactive<any>({
  // General settings
  title: '',
  refreshInterval: 300000, // 5 minutes
  showHeader: true,
  
  // Display settings
  colorTheme: 'default',
  showBorder: true,
  backgroundOpacity: 100,
  
  // Data settings
  dataSource: 'default',
  dateRange: '7d',
  maxItems: 10,
  
  // Widget-specific settings
  widgetSpecific: {}
})

// Options
const refreshIntervalOptions = [
  { label: '30 seconds', value: 30000 },
  { label: '1 minute', value: 60000 },
  { label: '5 minutes', value: 300000 },
  { label: '15 minutes', value: 900000 },
  { label: '30 minutes', value: 1800000 },
  { label: '1 hour', value: 3600000 },
  { label: 'Manual only', value: 0 }
]

const colorThemeOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Accent', value: 'accent' },
  { label: 'Success', value: 'positive' },
  { label: 'Warning', value: 'warning' },
  { label: 'Error', value: 'negative' }
]

const dataSourceOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Real-time', value: 'realtime' },
  { label: 'Cached', value: 'cached' }
]

const dateRangeOptions = [
  { label: 'Today', value: '1d' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Last year', value: '1y' },
  { label: 'All time', value: 'all' }
]

// Computed properties
const hasWidgetSpecificConfig = computed(() => {
  return props.widget.widget?.component && 
         Object.keys(configData.widgetSpecific).length > 0
})

const hasDataSettings = computed(() => {
  return props.widget.widget?.dataSource
})

const configComponent = computed(() => {
  if (!props.widget.widget?.component) return null
  
  try {
    return defineAsyncComponent(() => 
      import(`./widgets/config/${props.widget.widget!.component}Config.vue`)
    )
  } catch (err) {
    console.warn('Widget-specific config component not found:', err)
    return null
  }
})

const previewStyle = computed(() => ({
  borderColor: configData.showBorder ? 'var(--q-color-separator)' : 'transparent',
  backgroundColor: `rgba(var(--q-color-surface-rgb), ${configData.backgroundOpacity / 100})`,
  color: configData.colorTheme !== 'default' ? `var(--q-color-${configData.colorTheme})` : undefined
}))

// Methods
const formatConfigLabel = (key: string): string => {
  return key.replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim()
}

const resetConfig = () => {
  // Reset to widget's default configuration
  Object.assign(configData, {
    ...props.widget.widget?.defaultConfig,
    ...props.widget.config
  })
}

const handleSave = async () => {
  try {
    isSaving.value = true
    
    // Prepare the configuration object
    const config: WidgetConfig = {
      ...configData,
      updatedAt: new Date().toISOString()
    }
    
    emit('save', config)
  } catch (error) {
    console.error('Failed to save widget configuration:', error)
  } finally {
    isSaving.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Initialize configuration data
  Object.assign(configData, {
    ...props.widget.widget?.defaultConfig,
    ...props.widget.config
  })
  
  // Ensure widgetSpecific is an object
  if (!configData.widgetSpecific) {
    configData.widgetSpecific = {}
  }
})
</script>

<style scoped>
.widget-config-panel {
  max-height: 80vh;
  overflow-y: auto;
}

.widget-info {
  background: var(--q-color-background);
  border-radius: 8px;
  padding: 16px;
}

.config-section {
  border: 1px solid var(--q-color-separator);
  border-radius: 8px;
  padding: 16px;
}

.config-section .text-subtitle2 {
  color: var(--q-color-primary);
  font-weight: 600;
}

.generic-config {
  display: -ms-grid;
  display: grid;
  gap: 12px;
}

.config-preview {
  background: var(--q-color-background);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid var(--q-color-separator);
}

.preview-widget {
  border: 1px solid var(--q-color-separator);
  border-radius: 8px;
  overflow: hidden;
  background: var(--q-color-surface);
  min-height: 120px;
}

.preview-header {
  padding: 12px 16px;
  background: var(--q-color-background);
  border-bottom: 1px solid var(--q-color-separator);
}

.preview-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80px;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .widget-config-panel {
    min-width: 300px;
    max-width: 95vw;
  }
  
  .config-section {
    padding: 12px;
  }
  
  .widget-info {
    padding: 12px;
  }
}
</style>
