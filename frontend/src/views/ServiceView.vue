<template>
  <div class="service-view">
    <ServiceManager
      :services="services"
      @create-service="handleCreateService"
      @update-service="handleUpdateService"
      @delete-service="handleDeleteService"
      @duplicate-service="handleDuplicateService"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import ServiceManager from '@/components/services/ServiceManager.vue'
import { useAttendanceStore } from '@/stores/attendance'
import type { Service } from '@/types/service'

const $q = useQuasar()
const attendanceStore = useAttendanceStore()

// Convert store services to new format
const services = computed<Service[]>(() => {
  return (attendanceStore.services || []).map(s => ({
    id: s.id.toString(),
    organizationId: s.organization_id?.toString() || 'org1',
    branchId: s.branch_id?.toString() || 'branch1',
    name: s.name,
    serviceType: mapServiceType(s.service_type),
    scheduledDate: s.scheduled_date,
    startTime: s.start_time,
    endTime: s.end_time || s.start_time,
    status: mapServiceStatus(s.status),
    frequency: 'weekly' as const,
    capacity: s.capacity,
    expectedAttendance: s.capacity,
    location: s.location ? {
      type: 'physical' as const,
      venue: s.location,
    } : undefined,
    description: s.description,
    notes: s.notes,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
    createdBy: s.created_by?.toString() || 'user1',
  }))
})

const mapServiceType = (type: string): Service['serviceType'] => {
  const mapping: Record<string, Service['serviceType']> = {
    'sunday_first': 'sunday_morning',
    'sunday_second': 'sunday_evening',
    'midweek': 'midweek',
    'prayer': 'prayer_meeting',
    'special': 'special_event',
    'youth': 'youth_service',
    'children': 'children_service',
  }
  return mapping[type] || 'sunday_morning'
}

const mapServiceStatus = (status: string): Service['status'] => {
  const mapping: Record<string, Service['status']> = {
    'active': 'active',
    'scheduled': 'scheduled',
    'completed': 'completed',
    'cancelled': 'cancelled',
  }
  return mapping[status] || 'scheduled'
}

const handleCreateService = async (service: Partial<Service>) => {
  try {
    await attendanceStore.createService({
      name: service.name || '',
      service_type: mapServiceTypeToStore(service.serviceType || 'sunday_morning'),
      scheduled_date: service.scheduledDate || '',
      start_time: service.startTime || '',
      end_time: service.endTime || '',
      location: service.location?.venue,
      capacity: service.capacity,
      description: service.description,
      notes: service.notes,
    })
    
    $q.notify({
      type: 'positive',
      message: 'Service created successfully',
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to create service',
    })
  }
}

const handleUpdateService = async (id: string, service: Partial<Service>) => {
  try {
    await attendanceStore.updateService(parseInt(id), {
      name: service.name,
      service_type: service.serviceType ? mapServiceTypeToStore(service.serviceType) : undefined,
      scheduled_date: service.scheduledDate,
      start_time: service.startTime,
      end_time: service.endTime,
      location: service.location?.venue,
      capacity: service.capacity,
      description: service.description,
      notes: service.notes,
    })
    
    $q.notify({
      type: 'positive',
      message: 'Service updated successfully',
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to update service',
    })
  }
}

const handleDeleteService = async (id: string) => {
  try {
    await attendanceStore.deleteService(parseInt(id))
    $q.notify({
      type: 'positive',
      message: 'Service deleted successfully',
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to delete service',
    })
  }
}

const handleDuplicateService = async (service: Service) => {
  try {
    await handleCreateService({
      ...service,
      name: `${service.name} (Copy)`,
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    })
    
    $q.notify({
      type: 'positive',
      message: 'Service duplicated successfully',
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to duplicate service',
    })
  }
}

const mapServiceTypeToStore = (type: Service['serviceType']): string => {
  const mapping: Record<Service['serviceType'], string> = {
    'sunday_morning': 'sunday_first',
    'sunday_evening': 'sunday_second',
    'midweek': 'midweek',
    'prayer_meeting': 'prayer',
    'special_event': 'special',
    'youth_service': 'youth',
    'children_service': 'children',
    'bible_study': 'midweek',
  }
  return mapping[type] || 'sunday_first'
}

onMounted(async () => {
  try {
    await attendanceStore.fetchServices()
  } catch (error) {
    console.error('Failed to load services:', error)
  }
})
</script>

<style scoped>
.service-view {
  width: 100%;
  max-width: 100%;
}
</style>

