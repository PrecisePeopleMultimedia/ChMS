<template>
  <div
    class="flex items-center justify-between p-4 bg-[#1A1A20] rounded-lg hover:bg-[#1A1A20]/70 transition-colors cursor-pointer group"
    @click="$emit('edit')"
  >
    <div class="flex items-center gap-4">
      <div class="h-12 w-12 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
        <q-icon
          :name="SERVICE_TYPE_ICONS[service.serviceType]"
          :class="['h-6 w-6', SERVICE_TYPE_COLORS[service.serviceType]]"
        />
      </div>
      <div>
        <div class="font-medium">{{ service.name }}</div>
        <div class="text-sm text-muted-foreground">
          {{ formatFullDate(service.scheduledDate) }}
        </div>
        <div class="text-sm text-muted-foreground">
          {{ formatServiceTime(service) }} • {{ service.location?.venue }}
        </div>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <div class="text-right">
        <div class="text-sm font-medium text-[#1CE479]">
          {{ daysUntilText }}
        </div>
        <ModernBadge variant="outline" class="text-xs">
          {{ SERVICE_TYPE_LABELS[service.serviceType] }}
        </ModernBadge>
      </div>
      <ModernButton
        variant="ghost"
        size="sm"
        @click.stop="$emit('edit')"
        class="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <q-icon name="edit" class="h-4 w-4" />
      </ModernButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ModernButton from '@/components/ui/ModernButton.vue'
import ModernBadge from '@/components/ui/ModernBadge.vue'
import {
  SERVICE_TYPE_LABELS,
  SERVICE_TYPE_ICONS,
  SERVICE_TYPE_COLORS,
  formatServiceTime,
  type Service,
} from '@/types/service'

interface Props {
  service: Service
}

defineProps<Props>()

defineEmits<{
  (e: 'edit'): void
}>()

const props = defineProps<Props>()

const daysUntil = computed(() => {
  const serviceDate = new Date(props.service.scheduledDate)
  const now = new Date()
  return Math.ceil((serviceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
})

const daysUntilText = computed(() => {
  if (daysUntil.value === 0) return 'Today'
  if (daysUntil.value === 1) return 'Tomorrow'
  return `${daysUntil.value} days`
})

const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

