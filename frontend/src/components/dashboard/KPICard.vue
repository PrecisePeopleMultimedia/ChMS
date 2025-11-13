<template>
  <ModernCard
    :class="[
      'transition-all hover:shadow-lg',
      onClick && 'cursor-pointer hover:border-primary/50'
    ]"
    @click="onClick"
  >
    <ModernCardContent class="pt-6">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <p class="text-sm text-muted-foreground mb-1">{{ title }}</p>
          <div v-if="loading" class="h-8 w-24 bg-muted animate-pulse rounded" />
          <h3 v-else class="mb-2">{{ value }}</h3>
          
          <div v-if="change !== undefined" class="flex items-center gap-2">
            <ModernBadge
              variant="outline"
              :class="[
                'gap-1 px-2 py-0 h-5',
                getTrendColor()
              ]"
            >
              <q-icon :name="getTrendIcon()" class="h-3 w-3" />
              <span class="text-xs">
                {{ change > 0 ? '+' : '' }}{{ change }}%
              </span>
            </ModernBadge>
            <span v-if="changeLabel" class="text-xs text-muted-foreground">
              {{ changeLabel }}
            </span>
          </div>
          
          <p v-if="subtitle" class="text-xs text-muted-foreground mt-1">{{ subtitle }}</p>
        </div>
        
        <div
          :class="[
            'h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0',
            colorClasses[color]
          ]"
        >
          <q-icon :name="icon" class="h-6 w-6" />
        </div>
      </div>
    </ModernCardContent>
  </ModernCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ModernCard from '@/components/ui/ModernCard.vue'
import ModernCardContent from '@/components/ui/ModernCardContent.vue'
import ModernBadge from '@/components/ui/ModernBadge.vue'

export type TrendDirection = 'up' | 'down' | 'neutral'

interface Props {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  trend?: TrendDirection
  icon: string
  color?: 'primary' | 'success' | 'accent' | 'info' | 'warning'
  subtitle?: string
  loading?: boolean
  onClick?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  trend: 'neutral',
  color: 'primary',
  loading: false
})

const colorClasses = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  accent: 'bg-accent/10 text-accent',
  info: 'bg-info/10 text-info',
  warning: 'bg-warning/10 text-warning',
}

const getTrendIcon = () => {
  switch (props.trend) {
    case 'up':
      return 'trending_up'
    case 'down':
      return 'trending_down'
    default:
      return 'remove'
  }
}

const getTrendColor = () => {
  switch (props.trend) {
    case 'up':
      return 'text-success'
    case 'down':
      return 'text-destructive'
    default:
      return 'text-muted-foreground'
  }
}
</script>

