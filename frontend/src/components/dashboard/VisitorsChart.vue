<template>
  <ModernCard>
    <ModernCardHeader>
      <ModernCardTitle>Visitors & First-Timers</ModernCardTitle>
      <ModernCardDescription>
        Track new visitors and first-time attendees
      </ModernCardDescription>
    </ModernCardHeader>
    <ModernCardContent>
      <v-chart
        :option="chartOption"
        :style="{ height: `${height}px`, width: '100%' }"
        autoresize
      />

      <!-- Summary Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
        <div>
          <p class="text-xs text-muted-foreground">Total Visitors</p>
          <p class="text-sm font-semibold">{{ totalVisitors }}</p>
        </div>
        <div>
          <p class="text-xs text-muted-foreground">First-Timers</p>
          <p class="text-sm font-semibold">{{ totalFirstTimers }}</p>
        </div>
        <div>
          <p class="text-xs text-muted-foreground">Conversion Rate</p>
          <p class="text-sm font-semibold text-success">{{ conversionRate }}%</p>
        </div>
        <div>
          <p class="text-xs text-muted-foreground">This Period</p>
          <p class="text-sm font-semibold">{{ currentVisitors }}</p>
        </div>
      </div>
    </ModernCardContent>
  </ModernCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import ModernCard from '@/components/ui/ModernCard.vue'
import ModernCardHeader from '@/components/ui/ModernCardHeader.vue'
import ModernCardTitle from '@/components/ui/ModernCardTitle.vue'
import ModernCardDescription from '@/components/ui/ModernCardDescription.vue'
import ModernCardContent from '@/components/ui/ModernCardContent.vue'

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

interface Props {
  data?: typeof mockData
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 300
})

const mockData = [
  { week: 'Week 1', visitors: 45, firstTimers: 12 },
  { week: 'Week 2', visitors: 52, firstTimers: 15 },
  { week: 'Week 3', visitors: 48, firstTimers: 10 },
  { week: 'Week 4', visitors: 58, firstTimers: 18 },
  { week: 'Week 5', visitors: 50, firstTimers: 14 },
  { week: 'Week 6', visitors: 62, firstTimers: 20 },
  { week: 'Week 7', visitors: 68, firstTimers: 22 },
  { week: 'Week 8', visitors: 60, firstTimers: 16 },
]

const chartData = computed(() => props.data || mockData)

const totalVisitors = computed(() => {
  return chartData.value.reduce((sum, d) => sum + d.visitors, 0)
})

const totalFirstTimers = computed(() => {
  return chartData.value.reduce((sum, d) => sum + d.firstTimers, 0)
})

const conversionRate = computed(() => {
  return Math.round((totalFirstTimers.value / totalVisitors.value) * 100)
})

const currentVisitors = computed(() => {
  return chartData.value[chartData.value.length - 1].visitors
})

const chartOption = computed(() => {
  return {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.value.map(d => d.week),
      axisLine: {
        lineStyle: {
          color: 'var(--muted-foreground)'
        }
      },
      axisLabel: {
        color: 'var(--muted-foreground)',
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: 'var(--muted-foreground)'
        }
      },
      axisLabel: {
        color: 'var(--muted-foreground)',
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          color: 'var(--border)',
          type: 'dashed'
        }
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'var(--card)',
      borderColor: 'var(--border)',
      textStyle: {
        color: 'var(--foreground)'
      }
    },
    legend: {
      data: ['Visitors', 'First-Timers'],
      textStyle: {
        color: 'var(--foreground)'
      }
    },
    series: [
      {
        name: 'Visitors',
        type: 'line',
        smooth: true,
        data: chartData.value.map(d => d.visitors),
        lineStyle: {
          color: 'var(--primary)',
          width: 2
        },
        itemStyle: {
          color: 'var(--primary)'
        }
      },
      {
        name: 'First-Timers',
        type: 'line',
        smooth: true,
        data: chartData.value.map(d => d.firstTimers),
        lineStyle: {
          color: 'var(--chart-3)',
          width: 2
        },
        itemStyle: {
          color: 'var(--chart-3)'
        }
      }
    ]
  }
})
</script>

