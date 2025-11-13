<template>
  <div v-if="upcomingDates.length === 0" class="text-center py-12 border rounded-lg bg-muted/20">
    <q-icon name="event" class="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
    <p class="text-muted-foreground">
      No services scheduled in the next 30 days
    </p>
  </div>

  <div v-else class="space-y-6">
    <ModernCard
      v-for="date in upcomingDates"
      :key="date"
      :class="[
        isToday(date) && 'border-primary bg-primary/5'
      ]"
    >
      <ModernCardHeader>
        <ModernCardTitle class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <q-icon name="event" class="h-5 w-5" />
            <span>
              {{ formatFullDate(date) }}
            </span>
            <ModernBadge
              v-if="isToday(date)"
              variant="default"
              class="bg-[#1CE479] text-[#0A0A0F]"
            >
              Today
            </ModernBadge>
            <ModernBadge
              v-if="isTomorrow(date)"
              variant="outline"
            >
              Tomorrow
            </ModernBadge>
          </div>
          <ModernBadge variant="secondary">
            {{ servicesByDate[date].length }} {{ servicesByDate[date].length === 1 ? 'service' : 'services' }}
          </ModernBadge>
        </ModernCardTitle>
      </ModernCardHeader>
      <ModernCardContent>
        <div class="space-y-3">
          <div
            v-for="service in servicesByDate[date]"
            :key="service.id"
            @click="$emit('service-click', service)"
            class="p-4 bg-[#1A1A20] rounded-lg hover:bg-[#1A1A20]/70 transition-colors cursor-pointer group"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 space-y-2">
                <div class="flex items-center gap-2 flex-wrap">
                  <h4 class="font-medium">{{ service.name }}</h4>
                  <ModernBadge variant="outline" class="text-xs">
                    {{ SERVICE_TYPE_LABELS[service.serviceType] }}
                  </ModernBadge>
                </div>

                <div class="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <div class="flex items-center gap-1">
                    <q-icon name="schedule" class="h-3 w-3" />
                    <span>{{ formatServiceTime(service) }}</span>
                  </div>

                  <div v-if="service.location?.venue" class="flex items-center gap-1">
                    <q-icon name="place" class="h-3 w-3" />
                    <span>{{ service.location.venue }}</span>
                  </div>
                </div>

                <p v-if="service.description" class="text-sm text-muted-foreground line-clamp-1">
                  {{ service.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ModernCardContent>
    </ModernCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ModernCard from '@/components/ui/ModernCard.vue'
import ModernCardHeader from '@/components/ui/ModernCardHeader.vue'
import ModernCardTitle from '@/components/ui/ModernCardTitle.vue'
import ModernCardContent from '@/components/ui/ModernCardContent.vue'
import ModernBadge from '@/components/ui/ModernBadge.vue'
import {
  SERVICE_TYPE_LABELS,
  formatServiceTime,
  type Service,
} from '@/types/service'

interface Props {
  services: Service[]
}

defineProps<Props>()

defineEmits<{
  (e: 'service-click', service: Service): void
}>()

const props = defineProps<Props>()

// Group services by date
const servicesByDate = computed(() => {
  const grouped: Record<string, Service[]> = {}
  props.services.forEach(service => {
    const date = service.scheduledDate
    if (!grouped[date]) {
      grouped[date] = []
    }
    grouped[date].push(service)
  })
  
  // Sort services within each date by time
  Object.keys(grouped).forEach(date => {
    grouped[date].sort((a, b) => a.startTime.localeCompare(b.startTime))
  })
  
  return grouped
})

// Get upcoming dates (next 30 days)
const upcomingDates = computed(() => {
  const today = new Date()
  const thirtyDaysFromNow = new Date(today)
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

  return Object.keys(servicesByDate.value)
    .filter(date => {
      const serviceDate = new Date(date)
      return serviceDate >= today && serviceDate <= thirtyDaysFromNow
    })
    .sort()
})

const isToday = (date: string): boolean => {
  return date === new Date().toISOString().split('T')[0]
}

const isTomorrow = (date: string): boolean => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return date === tomorrow.toISOString().split('T')[0]
}

const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

