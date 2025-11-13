<template>
  <ModernCard
    :class="[
      'transition-all hover:shadow-lg',
      active && 'border-primary bg-primary/5'
    ]"
  >
    <ModernCardContent class="p-4">
      <div class="flex items-start justify-between gap-4">
        <!-- Service Info -->
        <div class="flex-1 space-y-2">
          <div class="flex items-center gap-3 flex-wrap">
            <h3 class="font-semibold text-lg">{{ service.name }}</h3>
            <ModernBadge
              v-if="active"
              variant="default"
              class="bg-[#1CE479] text-[#0A0A0F]"
            >
              <q-icon name="play_arrow" class="h-3 w-3 mr-1" />
              Live Now
            </ModernBadge>
            <ModernBadge
              :variant="
                service.status === 'active' ? 'default' :
                service.status === 'completed' ? 'secondary' :
                service.status === 'cancelled' ? 'destructive' :
                'outline'
              "
              :class="
                service.status === 'active' && 'bg-[#1CE479] text-[#0A0A0F]'
              "
            >
              {{ SERVICE_STATUS_LABELS[service.status] }}
            </ModernBadge>
            <ModernBadge variant="outline" class="text-xs">
              {{ SERVICE_TYPE_LABELS[service.serviceType] }}
            </ModernBadge>
          </div>

          <p v-if="service.description" class="text-sm text-muted-foreground line-clamp-2">
            {{ service.description }}
          </p>

          <div class="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div class="flex items-center gap-1">
              <q-icon name="event" class="h-4 w-4" />
              <span>
                {{ formatDate(service.scheduledDate) }}
              </span>
            </div>

            <div class="flex items-center gap-1">
              <q-icon name="schedule" class="h-4 w-4" />
              <span>{{ formatServiceTime(service) }}</span>
            </div>

            <div v-if="service.location?.venue" class="flex items-center gap-1">
              <q-icon name="place" class="h-4 w-4" />
              <span>{{ service.location.venue }}</span>
            </div>

            <div v-if="service.capacity" class="flex items-center gap-1">
              <q-icon name="people" class="h-4 w-4" />
              <span>Capacity: {{ service.capacity }}</span>
            </div>
          </div>

          <p v-if="service.notes" class="text-xs text-muted-foreground italic">
            Note: {{ service.notes }}
          </p>
        </div>

        <!-- Actions -->
        <q-btn-dropdown
          flat
          round
          dense
          icon="more_vert"
          size="sm"
        >
          <q-list dense>
            <q-item clickable @click="$emit('edit')">
              <q-item-section avatar>
                <q-icon name="edit" />
              </q-item-section>
              <q-item-section>Edit Service</q-item-section>
            </q-item>
            <q-item clickable @click="$emit('duplicate')">
              <q-item-section avatar>
                <q-icon name="content_copy" />
              </q-item-section>
              <q-item-section>Duplicate</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable @click="$emit('delete')" class="text-destructive">
              <q-item-section avatar>
                <q-icon name="delete" />
              </q-item-section>
              <q-item-section>Delete</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </ModernCardContent>
  </ModernCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ModernCard from '@/components/ui/ModernCard.vue'
import ModernCardContent from '@/components/ui/ModernCardContent.vue'
import ModernBadge from '@/components/ui/ModernBadge.vue'
import {
  SERVICE_TYPE_LABELS,
  SERVICE_STATUS_LABELS,
  formatServiceTime,
  isServiceActive,
  type Service,
} from '@/types/service'

interface Props {
  service: Service
}

const props = defineProps<Props>()

defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
  (e: 'duplicate'): void
}>()

const active = computed(() => isServiceActive(props.service))

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>

