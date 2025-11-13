<template>
  <ModernCard>
    <ModernCardHeader>
      <div class="flex items-center justify-between">
        <div>
          <ModernCardTitle>Attendance Trends</ModernCardTitle>
          <ModernCardDescription>
            Track attendance patterns and growth
          </ModernCardDescription>
        </div>
        <ModernTabs
          :model-value="period"
          :tabs="[
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' }
          ]"
          @update:model-value="period = $event"
        />
      </div>
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
          <p class="text-xs text-muted-foreground">Average</p>
          <p class="text-sm font-semibold">{{ average }}</p>
        </div>
        <div>
          <p class="text-xs text-muted-foreground">Peak</p>
          <p class="text-sm font-semibold">{{ peak }}</p>
        </div>
        <div>
          <p class="text-xs text-muted-foreground">Growth</p>
          <p class="text-sm font-semibold text-success">+{{ growth }}%</p>
        </div>
        <div>
          <p class="text-xs text-muted-foreground">This Period</p>
          <p class="text-sm font-semibold">{{ current }}</p>
        </div>
      </div>
    </ModernCardContent>
  </ModernCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, AreaChart } from 'echarts/charts'
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
import ModernTabs from '@/components/ui/ModernTabs.vue'

use([
  CanvasRenderer,
  LineChart,
  AreaChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

interface Props {
  data?: typeof weeklyData
  showTargetLine?: boolean
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  showTargetLine: true,
  height: 300
})

const period = ref<'weekly' | 'monthly'>('weekly')

const weeklyData = [
  { date: 'Week 1', attendance: 245, visitors: 45, target: 250 },
  { date: 'Week 2', attendance: 268, visitors: 52, target: 250 },
  { date: 'Week 3', attendance: 289, visitors: 48, target: 250 },
  { date: 'Week 4', attendance: 312, visitors: 58, target: 250 },
  { date: 'Week 5', attendance: 295, visitors: 50, target: 250 },
  { date: 'Week 6', attendance: 334, visitors: 62, target: 250 },
  { date: 'Week 7', attendance: 356, visitors: 68, target: 250 },
  { date: 'Week 8', attendance: 342, visitors: 60, target: 250 },
]

const monthlyData = [
  { month: 'Jan', attendance: 980, visitors: 180, target: 1000 },
  { month: 'Feb', attendance: 1050, visitors: 195, target: 1000 },
  { month: 'Mar', attendance: 1120, visitors: 210, target: 1000 },
  { month: 'Apr', attendance: 1200, visitors: 230, target: 1000 },
  { month: 'May', attendance: 1180, visitors: 215, target: 1000 },
  { month: 'Jun', attendance: 1280, visitors: 245, target: 1000 },
]

const chartData = computed(() => period.value === 'weekly' ? weeklyData : monthlyData)

const average = computed(() => {
  return Math.round(chartData.value.reduce((sum, d) => sum + d.attendance, 0) / chartData.value.length)
})

const peak = computed(() => {
  return Math.max(...chartData.value.map(d => d.attendance))
})

const growth = computed(() => {
  const first = chartData.value[0].attendance
  const last = chartData.value[chartData.value.length - 1].attendance
  return Math.round(((last - first) / first) * 100)
})

const current = computed(() => {
  return chartData.value[chartData.value.length - 1].attendance
})

const chartOption = computed(() => {
  const categories = period.value === 'weekly'
    ? weeklyData.map(d => d.date)
    : monthlyData.map(d => d.month)

  return {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: categories,
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
      data: ['Actual Attendance', ...(props.showTargetLine ? ['Target'] : [])],
      textStyle: {
        color: 'var(--foreground)'
      }
    },
    series: [
      {
        name: 'Actual Attendance',
        type: 'line',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'var(--primary)' },
              { offset: 1, color: 'transparent' }
            ]
          }
        },
        lineStyle: {
          color: 'var(--primary)',
          width: 2
        },
        data: chartData.value.map(d => d.attendance)
      },
      ...(props.showTargetLine ? [{
        name: 'Target',
        type: 'line',
        smooth: true,
        lineStyle: {
          color: 'var(--chart-2)',
          width: 2,
          type: 'dashed'
        },
        symbol: 'none',
        data: chartData.value.map(d => d.target)
      }] : [])
    ]
  }
})
</script>

