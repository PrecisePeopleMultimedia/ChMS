<template>
  <div
    :class="[
      'relative transition-all duration-200',
      isDragging && 'opacity-30',
      isOver && canDrop && 'scale-105',
      isDraggingEnabled && 'cursor-move group'
    ]"
    :data-id="id"
    :data-index="index"
  >
    <!-- Drag Handle -->
    <div
      v-if="isDraggingEnabled"
      :class="[
        'absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity',
        'cursor-grab active:cursor-grabbing',
        'bg-background/80 backdrop-blur-sm rounded p-1',
        'border border-border shadow-sm'
      ]"
    >
      <q-icon name="drag_indicator" class="h-4 w-4 text-muted-foreground" />
    </div>

    <!-- Drop Indicator -->
    <div
      v-if="isOver && canDrop"
      class="absolute inset-0 border-2 border-primary border-dashed rounded-lg pointer-events-none z-20"
    />

    <!-- Actual KPI Card -->
    <KPICard
      :title="title"
      :value="value"
      :change="change"
      :change-label="changeLabel"
      :trend="trend"
      :icon="icon"
      :color="color"
      :subtitle="subtitle"
      :loading="loading"
      :on-click="onClick"
    />
  </div>
</template>

<script setup lang="ts">
import KPICard from './KPICard.vue'
import type { TrendDirection } from './KPICard.vue'

interface Props {
  id: string
  index: number
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
  isDraggingEnabled?: boolean
  isDragging?: boolean
  isOver?: boolean
  canDrop?: boolean
}

withDefaults(defineProps<Props>(), {
  isDraggingEnabled: true,
  isDragging: false,
  isOver: false,
  canDrop: false
})
</script>

<style scoped>
.cursor-grab {
  cursor: grab;
}

.cursor-grab:active {
  cursor: grabbing;
}
</style>
