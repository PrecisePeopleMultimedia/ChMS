<template>
  <ModernCard>
    <ModernCardHeader>
      <ModernCardTitle>Giving Trends</ModernCardTitle>
      <ModernCardDescription>
        Track donations and contributions
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
          <p class="text-xs text-muted-foreground">Total</p>
          <p class="text-sm font-semibold">₦{{ total.toLocaleString() }}</p>
        </div>
        <div>
          <p class="text-xs text-muted-foreground">Average</p>
          <p class="text-sm font-semibold">₦{{ average.toLocaleString() }}</p>
        </div>
        <div>
          <p class="text-xs text-muted-foreground">Growth</p>
          <p class="text-sm font-semibold text-success">+{{ growth }}%</p>
        </div>
        <div>
          <p class="text-xs text-muted-foreground">This Period</p>
          <p class="text-sm font-semibold">₦{{ current.toLocaleString() }}</p>
        </div>
      </div>
    </ModernCardContent>
  </ModernCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
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
  BarChart,
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
  { month: 'Jan', amount: 450000, online: 120000, cash: 330000 },
  { month: 'Feb', amount: 520000, online: 150000, cash: 370000 },
  { month: 'Mar', amount: 480000, online: 140000, cash: 340000 },
  { month: 'Apr', amount: 610000, online: 180000, cash: 430000 },
  { month: 'May', amount: 550000, online: 160000, cash: 390000 },
  { month: 'Jun', amount: 680000, online: 200000, cash: 480000 },
]

const chartData = computed(() => props.data || mockData)

const total = computed(() => {
  return chartData.value.reduce((sum, d) => sum + d.amount, 0)
})

const average = computed(() => {
  return Math.round(total.value / chartData.value.length)
})

const growth = computed(() => {
  const first = chartData.value[0].amount
  const last = chartData.value[chartData.value.length - 1].amount
  return Math.round(((last - first) / first) * 100)
})

const current = computed(() => {
  return chartData.value[chartData.value.length - 1].amount
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
      data: chartData.value.map(d => d.month),
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
        fontSize: 12,
        formatter: (value: number) => `₦${(value / 1000).toFixed(0)}K`
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
      },
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>Total: ₦${data.value.toLocaleString()}`
      }
    },
    legend: {
      data: ['Online', 'Cash'],
      textStyle: {
        color: 'var(--foreground)'
      }
    },
    series: [
      {
        name: 'Online',
        type: 'bar',
        stack: 'total',
        data: chartData.value.map(d => d.online),
        itemStyle: {
          color: 'var(--primary)'
        }
      },
      {
        name: 'Cash',
        type: 'bar',
        stack: 'total',
        data: chartData.value.map(d => d.cash),
        itemStyle: {
          color: 'var(--chart-2)'
        }
      }
    ]
  }
})
</script>

