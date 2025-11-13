<template>
  <div
    ref="gridRef"
    :class="[
      'grid',
      gridColClasses[cardsPerRow],
      densityClasses[density]
    ]"
  >
    <DraggableKPICard
      v-for="(cardId, index) in cardOrder"
      :key="cardId"
      :id="cardId"
      :index="index"
      :is-dragging-enabled="isDraggingEnabled"
      v-bind="getCardData(cardId)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSortable } from '@/composables/useSortable'
import DraggableKPICard from './DraggableKPICard.vue'
import type { TrendDirection } from './KPICard.vue'

interface KPICardData {
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

interface Props {
  cardOrder: string[]
  cardsPerRow: 2 | 3 | 4
  density: 'compact' | 'standard' | 'comfortable'
  isDraggingEnabled?: boolean
  cardDataMap: Record<string, KPICardData>
  onOrderChange?: (newOrder: string[]) => void
}

const props = withDefaults(defineProps<Props>(), {
  isDraggingEnabled: true
})

const gridRef = ref<HTMLElement | null>(null)

const gridColClasses = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

const densityClasses = {
  compact: 'gap-3',
  standard: 'gap-4',
  comfortable: 'gap-6',
}

const getCardData = (cardId: string): KPICardData => {
  return props.cardDataMap[cardId] || {
    title: 'Unknown',
    value: 0,
    icon: 'help',
  }
}

const { sortableInstance } = useSortable(gridRef, {
  handle: '.group .absolute', // Drag handle selector
  onEnd: (event) => {
    if (event.oldIndex !== undefined && event.newIndex !== undefined) {
      const newOrder = [...props.cardOrder]
      const [moved] = newOrder.splice(event.oldIndex, 1)
      newOrder.splice(event.newIndex, 0, moved)
      props.onOrderChange?.(newOrder)
    }
  },
  disabled: !props.isDraggingEnabled,
})

watch(() => props.isDraggingEnabled, (enabled) => {
  if (enabled) {
    sortableInstance.value?.option('disabled', false)
  } else {
    sortableInstance.value?.option('disabled', true)
  }
})
</script>

<style>
/* Sortable.js classes */
.sortable-ghost {
  opacity: 0.3;
}

.sortable-chosen {
  cursor: grabbing;
}

.sortable-drag {
  opacity: 0.5;
}
</style>

