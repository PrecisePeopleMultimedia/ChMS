<template>
  <ModernCard>
    <ModernCardHeader>
      <div class="flex items-center justify-between">
        <div>
          <ModernCardTitle>Upcoming Events</ModernCardTitle>
          <ModernCardDescription>
            Scheduled church activities
          </ModernCardDescription>
        </div>
        <ModernButton
          v-if="showSeeAll"
          variant="ghost"
          size="sm"
          @click="onSeeAll"
        >
          See All
          <q-icon name="chevron_right" class="h-4 w-4" />
        </ModernButton>
      </div>
    </ModernCardHeader>
    <ModernCardContent>
      <div class="space-y-3">
        <div
          v-for="event in displayEvents"
          :key="event.id"
          :class="[
            'p-4 rounded-lg border cursor-pointer transition-all hover:border-primary/50',
            'hover:shadow-md'
          ]"
          @click="onEventClick?.(event)"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <h4 class="text-sm font-semibold">{{ event.title }}</h4>
                <ModernBadge
                  :class="categoryColors[event.category]"
                  variant="outline"
                >
                  {{ event.category }}
                </ModernBadge>
              </div>
              
              <div class="space-y-1 text-xs text-muted-foreground">
                <div class="flex items-center gap-2">
                  <q-icon name="event" class="h-3 w-3" />
                  <span>{{ event.date }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <q-icon name="schedule" class="h-3 w-3" />
                  <span>{{ event.time }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <q-icon name="place" class="h-3 w-3" />
                  <span>{{ event.location }}</span>
                </div>
                <div v-if="event.attendees !== undefined" class="flex items-center gap-2">
                  <q-icon name="people" class="h-3 w-3" />
                  <span>
                    {{ event.attendees }}{{ event.maxAttendees ? ` / ${event.maxAttendees}` : '' }} attendees
                  </span>
                </div>
              </div>
            </div>
            
            <q-icon name="chevron_right" class="h-5 w-5 text-muted-foreground flex-shrink-0" />
          </div>
        </div>
      </div>
    </ModernCardContent>
  </ModernCard>
</template>

<script setup lang="ts">
import ModernCard from '@/components/ui/ModernCard.vue'
import ModernCardHeader from '@/components/ui/ModernCardHeader.vue'
import ModernCardTitle from '@/components/ui/ModernCardTitle.vue'
import ModernCardDescription from '@/components/ui/ModernCardDescription.vue'
import ModernCardContent from '@/components/ui/ModernCardContent.vue'
import ModernButton from '@/components/ui/ModernButton.vue'
import ModernBadge from '@/components/ui/ModernBadge.vue'
import { computed } from 'vue'

export interface ChurchEvent {
  id: string
  title: string
  date: string
  time: string
  location: string
  attendees?: number
  maxAttendees?: number
  category: 'service' | 'meeting' | 'conference' | 'fellowship' | 'outreach' | 'other'
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  description?: string
}

interface Props {
  events?: ChurchEvent[]
  maxEvents?: number
  showSeeAll?: boolean
  onEventClick?: (event: ChurchEvent) => void
  onSeeAll?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  maxEvents: 4,
  showSeeAll: true,
  events: () => [
    {
      id: '1',
      title: 'Sunday Worship Service',
      date: 'Sunday, Oct 27',
      time: '9:00 AM',
      location: 'Main Sanctuary',
      attendees: 342,
      maxAttendees: 500,
      category: 'service',
      status: 'upcoming',
    },
    {
      id: '2',
      title: 'Youth Conference 2024',
      date: 'Friday, Nov 1',
      time: '6:00 PM',
      location: 'Youth Hall',
      attendees: 156,
      maxAttendees: 200,
      category: 'conference',
      status: 'upcoming',
    },
    {
      id: '3',
      title: 'Prayer Meeting',
      date: 'Wednesday, Oct 30',
      time: '7:00 PM',
      location: 'Prayer Room',
      attendees: 45,
      category: 'meeting',
      status: 'upcoming',
    },
    {
      id: '4',
      title: 'Community Outreach',
      date: 'Saturday, Nov 2',
      time: '10:00 AM',
      location: 'City Center',
      attendees: 67,
      maxAttendees: 100,
      category: 'outreach',
      status: 'upcoming',
    },
  ]
})

const categoryColors: Record<ChurchEvent['category'], string> = {
  service: 'bg-primary/10 text-primary',
  meeting: 'bg-info/10 text-info',
  conference: 'bg-accent/10 text-accent',
  fellowship: 'bg-success/10 text-success',
  outreach: 'bg-warning/10 text-warning',
  other: 'bg-muted text-muted-foreground',
}

const displayEvents = computed(() => {
  return props.events.slice(0, props.maxEvents)
})
</script>

