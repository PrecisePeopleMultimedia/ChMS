<template>
  <div class="member-count-widget">
    <!-- Loading State -->
    <div v-if="isLoading" class="widget-loading">
      <q-skeleton type="text" width="60%" />
      <q-skeleton type="text" width="40%" class="q-mt-sm" />
      <q-skeleton type="rect" height="60px" class="q-mt-md" />
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="widget-error">
      <q-icon name="error_outline" size="md" color="negative" />
      <p class="text-caption text-negative q-mt-xs">{{ error }}</p>
    </div>
    
    <!-- Widget Content -->
    <div v-else class="widget-content">
      <!-- Main Metric -->
      <div class="main-metric">
        <div class="metric-value" :style="{ color: config.colorTheme !== 'default' ? `var(--q-color-${config.colorTheme})` : undefined }">
          {{ formattedMemberCount }}
        </div>
        <div class="metric-label">
          {{ config.title || 'Total Members' }}
        </div>
      </div>
      
      <!-- Trend Indicator -->
      <div v-if="showTrend" class="trend-indicator">
        <q-icon 
          :name="trendIcon" 
          :color="trendColor" 
          size="sm"
          class="q-mr-xs"
        />
        <span :class="`text-${trendColor}`" class="text-caption">
          {{ trendText }}
        </span>
      </div>
      
      <!-- Additional Metrics -->
      <div v-if="showAdditionalMetrics" class="additional-metrics">
        <div class="metric-row">
          <div class="metric-item">
            <div class="metric-small-value">{{ data?.newMembersThisMonth || 0 }}</div>
            <div class="metric-small-label">New This Month</div>
          </div>
          <div class="metric-item">
            <div class="metric-small-value">{{ data?.activeMembersPercent || 0 }}%</div>
            <div class="metric-small-label">Active Rate</div>
          </div>
        </div>
      </div>
      
      <!-- Mini Chart -->
      <div v-if="showMiniChart && chartData" class="mini-chart">
        <canvas ref="chartCanvas" width="200" height="40"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick } from 'vue'
import type { WidgetInstance, WidgetConfig } from '@/stores/widgets'

interface Props {
  widget: WidgetInstance
  data?: any
  config: WidgetConfig
  isLoading?: boolean
  error?: string
}

interface Emits {
  (e: 'update-config', config: WidgetConfig): void
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

const emit = defineEmits<Emits>()

// Reactive state
const chartCanvas = ref<HTMLCanvasElement | null>(null)

// Computed properties
const formattedMemberCount = computed(() => {
  const count = props.data?.totalMembers || 0
  
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  
  return count.toString()
})

const showTrend = computed(() => {
  return props.config.showTrend !== false && props.data?.memberTrend !== undefined
})

const trendIcon = computed(() => {
  const trend = props.data?.memberTrend || 0
  if (trend > 0) return 'trending_up'
  if (trend < 0) return 'trending_down'
  return 'trending_flat'
})

const trendColor = computed(() => {
  const trend = props.data?.memberTrend || 0
  if (trend > 0) return 'positive'
  if (trend < 0) return 'negative'
  return 'grey-6'
})

const trendText = computed(() => {
  const trend = props.data?.memberTrend || 0
  const absValue = Math.abs(trend)
  
  if (trend > 0) {
    return `+${absValue}% this month`
  } else if (trend < 0) {
    return `-${absValue}% this month`
  }
  
  return 'No change'
})

const showAdditionalMetrics = computed(() => {
  return props.config.showAdditionalMetrics !== false
})

const showMiniChart = computed(() => {
  return props.config.showMiniChart === true && props.data?.chartData
})

const chartData = computed(() => {
  return props.data?.chartData || []
})

// Methods
const drawMiniChart = () => {
  if (!chartCanvas.value || !chartData.value.length) return
  
  const canvas = chartCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  const width = canvas.width
  const height = canvas.height
  const data = chartData.value
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height)
  
  // Find min and max values
  const values = data.map((d: any) => d.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const range = maxValue - minValue || 1
  
  // Draw line
  ctx.strokeStyle = props.config.colorTheme !== 'default' 
    ? `var(--q-color-${props.config.colorTheme})` 
    : '#1976d2'
  ctx.lineWidth = 2
  ctx.beginPath()
  
  data.forEach((point: any, index: number) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((point.value - minValue) / range) * height
    
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  
  ctx.stroke()
  
  // Draw area under curve
  ctx.globalAlpha = 0.2
  ctx.fillStyle = props.config.colorTheme !== 'default' 
    ? `var(--q-color-${props.config.colorTheme})` 
    : '#1976d2'
  ctx.lineTo(width, height)
  ctx.lineTo(0, height)
  ctx.closePath()
  ctx.fill()
  ctx.globalAlpha = 1
}

// Watchers
watch(() => props.data, () => {
  if (showMiniChart.value) {
    nextTick(() => {
      drawMiniChart()
    })
  }
}, { deep: true })

watch(() => props.config, () => {
  if (showMiniChart.value) {
    nextTick(() => {
      drawMiniChart()
    })
  }
}, { deep: true })

// Lifecycle
onMounted(() => {
  if (showMiniChart.value) {
    nextTick(() => {
      drawMiniChart()
    })
  }
})
</script>

<style scoped>
.member-count-widget {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.widget-loading,
.widget-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.widget-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.main-metric {
  text-align: center;
  margin-bottom: 16px;
}

.metric-value {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  color: var(--q-color-primary);
}

.metric-label {
  font-size: 0.875rem;
  color: var(--q-color-on-surface-variant);
  margin-top: 4px;
  font-weight: 500;
}

.trend-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.additional-metrics {
  margin-top: auto;
}

.metric-row {
  display: flex;
  justify-content: space-around;
  gap: 16px;
}

.metric-item {
  text-align: center;
  flex: 1;
}

.metric-small-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--q-color-on-surface);
}

.metric-small-label {
  font-size: 0.75rem;
  color: var(--q-color-on-surface-variant);
  margin-top: 2px;
}

.mini-chart {
  margin-top: 12px;
  display: flex;
  justify-content: center;
}

.mini-chart canvas {
  max-width: 100%;
  height: auto;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .metric-value {
    font-size: 2rem;
  }
  
  .metric-small-value {
    font-size: 1rem;
  }
  
  .metric-row {
    gap: 8px;
  }
}

/* Small widget size adjustments */
.dashboard-widget[data-size="small"] .metric-value {
  font-size: 1.75rem;
}

.dashboard-widget[data-size="small"] .additional-metrics {
  display: none;
}

.dashboard-widget[data-size="small"] .mini-chart {
  display: none;
}

/* Large widget size adjustments */
.dashboard-widget[data-size="large"] .metric-value {
  font-size: 3.5rem;
}

.dashboard-widget[data-size="large"] .main-metric {
  margin-bottom: 24px;
}
</style>
