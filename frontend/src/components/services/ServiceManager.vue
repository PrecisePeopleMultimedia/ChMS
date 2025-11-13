<template>
  <div class="space-y-6">
    <!-- Header -->
    <PageHeader
      title="Service Management"
      description="Manage church services, schedules, and attendance tracking"
    >
      <template #action>
        <ModernButton
          @click="showCreateForm = true"
          class="bg-[#1CE479] hover:bg-[#1CE479]/90 text-[#0A0A0F] gap-2"
        >
          <q-icon name="add" class="h-4 w-4" />
          Create Service
        </ModernButton>
      </template>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <ModernCard>
          <ModernCardContent class="pt-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted-foreground">Total Services</p>
                <p class="text-2xl font-bold">{{ services.length }}</p>
              </div>
              <q-icon name="event" class="h-8 w-8 text-muted-foreground" />
            </div>
          </ModernCardContent>
        </ModernCard>

        <ModernCard>
          <ModernCardContent class="pt-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted-foreground">Active Today</p>
                <p class="text-2xl font-bold text-[#1CE479]">{{ todayServices.length }}</p>
              </div>
              <q-icon name="play_arrow" class="h-8 w-8 text-[#1CE479]" />
            </div>
          </ModernCardContent>
        </ModernCard>

        <ModernCard>
          <ModernCardContent class="pt-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted-foreground">This Week</p>
                <p class="text-2xl font-bold text-blue-400">{{ thisWeekServices }}</p>
              </div>
              <q-icon name="schedule" class="h-8 w-8 text-blue-400" />
            </div>
          </ModernCardContent>
        </ModernCard>

        <ModernCard>
          <ModernCardContent class="pt-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted-foreground">Weekly Services</p>
                <p class="text-2xl font-bold text-purple-400">{{ weeklyServicesCount }}</p>
              </div>
              <q-icon name="event" class="h-8 w-8 text-purple-400" />
            </div>
          </ModernCardContent>
        </ModernCard>
      </div>
    </PageHeader>

    <!-- Active Services Alert -->
    <ModernCard
      v-if="activeServices.length > 0"
      class="border-primary bg-primary/10"
    >
      <ModernCardHeader>
        <ModernCardTitle class="flex items-center gap-2 text-primary">
          <q-icon name="play_arrow" class="h-5 w-5" />
          Active Services Now
        </ModernCardTitle>
      </ModernCardHeader>
      <ModernCardContent>
        <div class="space-y-2">
          <div
            v-for="service in activeServices"
            :key="service.id"
            class="flex items-center justify-between p-3 bg-[#1A1A20] rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <q-icon name="play_arrow" class="h-5 w-5 text-primary" />
              </div>
              <div>
                <div class="font-medium">{{ service.name }}</div>
                <div class="text-sm text-muted-foreground">
                  {{ formatServiceTime(service) }} • {{ service.location?.venue }}
                </div>
              </div>
            </div>
            <ModernBadge variant="default" class="bg-[#1CE479] text-[#0A0A0F]">
              <div class="animate-pulse h-2 w-2 rounded-full bg-[#0A0A0F] mr-2" />
              Live
            </ModernBadge>
          </div>
        </div>
      </ModernCardContent>
    </ModernCard>

    <!-- Service Form Dialog -->
    <ServiceForm
      v-if="showCreateForm"
      :service="editingService"
      @save="editingService 
        ? (service) => handleUpdate(editingService.id, service)
        : handleCreate
      "
      @cancel="handleCancel"
    />

    <!-- Service Tabs -->
    <ModernTabs
      v-model="activeTab"
      :tabs="[
        { value: 'list', label: 'Service List', icon: 'event' },
        { value: 'calendar', label: 'Calendar View', icon: 'event' },
        { value: 'upcoming', label: 'Upcoming', icon: 'schedule' }
      ]"
    >
      <!-- List View -->
      <template #panel-list>
        <ServiceList
          :services="services"
          @edit="handleEdit"
          @delete="handleDelete"
          @duplicate="handleDuplicate"
        />
      </template>

      <!-- Calendar View -->
      <template #panel-calendar>
        <ServiceCalendar
          :services="services"
          @service-click="handleEdit"
        />
      </template>

      <!-- Upcoming Services -->
      <template #panel-upcoming>
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle>Upcoming Services</ModernCardTitle>
            <ModernCardDescription>
              Next {{ upcomingServices.length }} scheduled services
            </ModernCardDescription>
          </ModernCardHeader>
          <ModernCardContent>
            <div v-if="upcomingServices.length === 0" class="text-center py-12 text-muted-foreground">
              <q-icon name="event" class="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming services scheduled</p>
              <ModernButton
                @click="showCreateForm = true"
                variant="outline"
                class="mt-4 gap-2"
              >
                <q-icon name="add" class="h-4 w-4" />
                Create First Service
              </ModernButton>
            </div>
            <div v-else class="space-y-4">
              <UpcomingServiceCard
                v-for="service in upcomingServices"
                :key="service.id"
                :service="service"
                @edit="handleEdit(service)"
              />
            </div>
          </ModernCardContent>
        </ModernCard>
      </template>
    </ModernTabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import PageHeader from '@/components/layout/PageHeader.vue'
import ModernCard from '@/components/ui/ModernCard.vue'
import ModernCardHeader from '@/components/ui/ModernCardHeader.vue'
import ModernCardTitle from '@/components/ui/ModernCardTitle.vue'
import ModernCardDescription from '@/components/ui/ModernCardDescription.vue'
import ModernCardContent from '@/components/ui/ModernCardContent.vue'
import ModernButton from '@/components/ui/ModernButton.vue'
import ModernBadge from '@/components/ui/ModernBadge.vue'
import ModernTabs from '@/components/ui/ModernTabs.vue'
import ServiceForm from './ServiceForm.vue'
import ServiceList from './ServiceList.vue'
import ServiceCalendar from './ServiceCalendar.vue'
import UpcomingServiceCard from './UpcomingServiceCard.vue'
import {
  formatServiceTime,
  isServiceActive,
  type Service,
} from '@/types/service'

interface Props {
  services?: Service[]
  onCreateService?: (service: Partial<Service>) => void
  onUpdateService?: (id: string, service: Partial<Service>) => void
  onDeleteService?: (id: string) => void
  onDuplicateService?: (service: Service) => void
}

const props = withDefaults(defineProps<Props>(), {
  services: () => [],
})

const $q = useQuasar()

const showCreateForm = ref(false)
const editingService = ref<Service | null>(null)
const activeTab = ref('list')

// Get active services for today
const today = computed(() => new Date().toISOString().split('T')[0])
const todayServices = computed(() => 
  props.services.filter(s => s.scheduledDate === today.value)
)
const activeServices = computed(() => 
  todayServices.value.filter(s => isServiceActive(s))
)

// Get upcoming services
const upcomingServices = computed(() => {
  return props.services
    .filter(s => s.scheduledDate >= today.value && s.status === 'scheduled')
    .sort((a, b) => {
      const dateCompare = a.scheduledDate.localeCompare(b.scheduledDate)
      if (dateCompare !== 0) return dateCompare
      return a.startTime.localeCompare(b.startTime)
    })
    .slice(0, 5)
})

// Calculate stats for this week
const thisWeekServices = computed(() => {
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)
  
  return props.services.filter(s => {
    const serviceDate = new Date(s.scheduledDate)
    return serviceDate >= weekStart && serviceDate <= weekEnd
  }).length
})

const weeklyServicesCount = computed(() => 
  props.services.filter(s => s.frequency === 'weekly').length
)

const handleCreate = (service: Partial<Service>) => {
  props.onCreateService?.(service)
  showCreateForm.value = false
}

const handleUpdate = (id: string, service: Partial<Service>) => {
  props.onUpdateService?.(id, service)
  editingService.value = null
  showCreateForm.value = false
}

const handleEdit = (service: Service) => {
  editingService.value = service
  showCreateForm.value = true
}

const handleDuplicate = (service: Service) => {
  props.onDuplicateService?.(service)
}

const handleDelete = (id: string) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: 'Are you sure you want to delete this service? This action cannot be undone.',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    props.onDeleteService?.(id)
  })
}

const handleCancel = () => {
  showCreateForm.value = false
  editingService.value = null
}
</script>

