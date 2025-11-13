<template>
  <div class="default-preview">
    <div class="preview-content">
      <q-icon 
        :name="getWidgetIcon(widget.type)" 
        size="lg" 
        :color="getWidgetColor(widget.type)"
        class="preview-icon"
      />
      <div class="preview-text">
        <div class="text-caption text-weight-medium">
          {{ widget.name }}
        </div>
        <div class="text-caption text-grey-6">
          {{ widget.type }} widget
        </div>
      </div>
    </div>
    
    <!-- Mock data visualization based on widget type -->
    <div class="preview-visualization">
      <component :is="visualizationComponent" :widget="widget" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Widget } from '@/stores/widgets'

interface Props {
  widget: Widget
}

const props = defineProps<Props>()

// Computed properties
const visualizationComponent = computed(() => {
  switch (props.widget.type) {
    case 'metric':
      return 'MetricVisualization'
    case 'chart':
      return 'ChartVisualization'
    case 'list':
      return 'ListVisualization'
    case 'action':
      return 'ActionVisualization'
    default:
      return 'GenericVisualization'
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

const getWidgetColor = (type: string): string => {
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
.default-preview {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8px;
}

.preview-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.preview-icon {
  opacity: 0.7;
}

.preview-text {
  line-height: 1.2;
}

.preview-visualization {
  margin-top: 8px;
  width: 100%;
  -ms-flex: 1;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
