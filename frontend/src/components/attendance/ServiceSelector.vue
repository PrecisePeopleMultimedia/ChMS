<template>
  <div v-if="services.length === 0" class="text-center py-12">
    <q-icon name="event" size="48px" color="grey" class="mb-4" />
    <h4 class="mb-2">No Services Available</h4>
    <p class="text-sm text-muted-foreground mb-4">
      Create a service to start recording attendance
    </p>
    <ModernButton v-if="onCreateService" @click="onCreateService" class="gap-2">
      <q-icon name="add" class="h-4 w-4" />
      Create Service
    </ModernButton>
  </div>

  <div v-else class="space-y-4">
    <div class="flex items-center justify-between">
      <label class="text-sm font-medium">Select Service</label>
      <ModernButton
        v-if="onCreateService"
        variant="outline"
        size="sm"
        @click="onCreateService"
        class="gap-2"
      >
        <q-icon name="add" class="h-4 w-4" />
        New Service
      </ModernButton>
    </div>

    <div class="space-y-6">
      <div v-for="[date, dateServices] in servicesByDate" :key="date">
        <div class="flex items-center gap-2 mb-3">
          <q-icon name="event" class="h-4 w-4 text-muted-foreground" />
          <span class="text-sm font-medium">{{ formatDate(date) }}</span>
          <span class="text-sm text-muted-foreground">
            ({{ new Date(date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }) }})
          </span>
        </div>

        <div class="grid grid-cols-1 gap-3">
          <ModernCard
            v-for="service in dateServices"
            :key="service.id"
            :class="[
              'cursor-pointer transition-all hover:shadow-md',
              service.id === selectedServiceId && 'border-primary shadow-md'
            ]"
            @click="onSelectService(service)"
          >
            <ModernCardContent class="p-4">
              <div class="flex items-start gap-3">
                <div
                  :class="[
                    'h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0',
                    service.id === selectedServiceId ? 'bg-primary' : 'bg-muted'
                  ]"
                >
                  <q-icon
                    :name="service.id === selectedServiceId ? 'check' : 'schedule'"
                    :class="[
                      'h-5 w-5',
                      service.id === selectedServiceId ? 'text-primary-foreground' : 'text-muted-foreground'
                    ]"
                  />
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h5 class="truncate">{{ service.name }}</h5>
                      <div class="flex items-center gap-2 text-sm text-muted-foreground">
                        <q-icon name="schedule" class="h-3 w-3" />
                        <span>{{ formatTime(service.startTime) }}</span>
                        <span v-if="service.endTime">- {{ formatTime(service.endTime) }}</span>
                      </div>
                    </div>

                    <ModernBadge
                      variant="outline"
                      :class="serviceTypeColors[service.type]"
                    >
                      {{ serviceTypeLabels[service.type] }}
                    </ModernBadge>
                  </div>

                  <div class="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <div v-if="service.location" class="flex items-center gap-1">
                      <q-icon name="place" class="h-3 w-3" />
                      <span>{{ service.location }}</span>
                    </div>
                    <div v-if="service.expectedAttendance" class="flex items-center gap-1">
                      <q-icon name="people" class="h-3 w-3" />
                      <span>Expected: {{ service.expectedAttendance }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ModernCard from '@/components/ui/ModernCard.vue'
import ModernCardContent from '@/components/ui/ModernCardContent.vue'
import ModernButton from '@/components/ui/ModernButton.vue'
import ModernBadge from '@/components/ui/ModernBadge.vue'
import type { Service, ServiceType } from '@/types/attendance'

interface Props {
  services: Service[]
  selectedServiceId?: string
  onSelectService: (service: Service) => void
  onCreateService?: () => void
}

defineProps<Props>()

const serviceTypeLabels: Record<ServiceType, string> = {
  sunday_first: 'Sunday 1st Service',
  sunday_second: 'Sunday 2nd Service',
  midweek: 'Midweek Service',
  prayer: 'Prayer Meeting',
  special: 'Special Service',
  youth: 'Youth Service',
  children: "Children's Service",
}

const serviceTypeColors: Record<ServiceType, string> = {
  sunday_first: 'bg-primary/10 text-primary border-primary/20',
  sunday_second: 'bg-primary/10 text-primary border-primary/20',
  midweek: 'bg-info/10 text-info border-info/20',
  prayer: 'bg-accent/10 text-accent border-accent/20',
  special: 'bg-warning/10 text-warning border-warning/20',
  youth: 'bg-success/10 text-success border-success/20',
  children: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
}

const props = defineProps<Props>()

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    })
  }
}

const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}

const servicesByDate = computed(() => {
  const grouped: Record<string, Service[]> = {}
  props.services.forEach(service => {
    if (!grouped[service.date]) {
      grouped[service.date] = []
    }
    grouped[service.date].push(service)
  })

  return Object.entries(grouped).sort(([a], [b]) =>
    new Date(b).getTime() - new Date(a).getTime()
  )
})
</script>
