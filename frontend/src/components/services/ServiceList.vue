<template>
  <div class="space-y-4">
    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="relative flex-1">
        <q-icon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <ModernInput
          v-model="searchQuery"
          placeholder="Search services..."
          class="pl-10"
        />
      </div>

      <ModernSelect
        v-model="filterType"
        :options="typeFilterOptions"
        placeholder="Filter by type"
        class="w-full sm:w-[200px]"
      />

      <ModernSelect
        v-model="filterStatus"
        :options="statusFilterOptions"
        class="w-full sm:w-[180px]"
      />
    </div>

    <!-- Results Count -->
    <div class="text-sm text-muted-foreground">
      Showing {{ sortedServices.length }} of {{ services.length }} services
    </div>

    <!-- Service List -->
    <div class="space-y-3">
      <div v-if="sortedServices.length === 0" class="text-center py-12 border rounded-lg bg-muted/20">
        <q-icon name="event" class="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <p class="text-muted-foreground">
          {{ services.length === 0 ? 'No services created yet' : 'No services match your filters' }}
        </p>
      </div>

      <ServiceCard
        v-for="service in sortedServices"
        :key="service.id"
        :service="service"
        @edit="$emit('edit', service)"
        @delete="$emit('delete', service.id)"
        @duplicate="$emit('duplicate', service)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ModernInput from '@/components/ui/ModernInput.vue'
import ModernSelect from '@/components/ui/ModernSelect.vue'
import ServiceCard from './ServiceCard.vue'
import {
  SERVICE_TYPE_LABELS,
  type Service,
  type ServiceType,
  type ServiceStatus,
} from '@/types/service'

interface Props {
  services: Service[]
}

const props = defineProps<Props>()

defineEmits<{
  (e: 'edit', service: Service): void
  (e: 'delete', id: string): void
  (e: 'duplicate', service: Service): void
}>()

const searchQuery = ref('')
const filterType = ref<ServiceType | 'all'>('all')
const filterStatus = ref<ServiceStatus | 'all'>('all')

// Filter services
const filteredServices = computed(() => {
  return props.services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = filterType.value === 'all' || service.serviceType === filterType.value
    const matchesStatus = filterStatus.value === 'all' || service.status === filterStatus.value
    
    return matchesSearch && matchesType && matchesStatus
  })
})

// Sort by date and time
const sortedServices = computed(() => {
  return [...filteredServices.value].sort((a, b) => {
    const dateCompare = a.scheduledDate.localeCompare(b.scheduledDate)
    if (dateCompare !== 0) return dateCompare
    return a.startTime.localeCompare(b.startTime)
  })
})

const typeFilterOptions = [
  { label: 'All Types', value: 'all' },
  ...Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => ({
    label,
    value,
  })),
]

const statusFilterOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]
</script>

