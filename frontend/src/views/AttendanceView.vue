<template>
  <div class="attendance-view">
    <AttendanceTracker
      :services="services"
      :members="members"
      :attendance-records="attendanceRecords"
      :selected-service-id="selectedServiceId"
      @check-in="handleCheckIn"
      @bulk-check-in="handleBulkCheckIn"
      @create-service="handleCreateService"
      @export="handleExport"
      @select-service="handleSelectService"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import AttendanceTracker from '@/components/attendance/AttendanceTracker.vue'
import { useAttendanceStore } from '@/stores/attendance'
import { useMembersStore } from '@/stores/members'
import type { Service, AttendanceRecord, AttendanceStatus } from '@/types/attendance'
import type { Member } from '@/types/member'

const $q = useQuasar()
const attendanceStore = useAttendanceStore()
const memberStore = useMembersStore()

const selectedServiceId = ref<string>()

// Convert store services to new format
const services = computed<Service[]>(() => {
  return attendanceStore.services.map(s => ({
    id: s.id.toString(),
    name: s.name,
    type: mapServiceType(s.service_type),
    date: s.scheduled_date,
    startTime: s.start_time,
    endTime: s.end_time,
    location: s.location,
    expectedAttendance: s.capacity,
    isActive: s.status === 'active' || s.status === 'scheduled',
    createdAt: s.created_at,
    createdBy: s.organization_id?.toString(),
  }))
})

// Convert store attendance records to new format
const attendanceRecords = computed<AttendanceRecord[]>(() => {
  return attendanceStore.attendanceRecords.map(r => ({
    id: r.id.toString(),
    serviceId: r.service_id.toString(),
    memberId: r.member_id?.toString() || '',
    status: mapAttendanceStatus(r.checkin_method, r.checked_in_at),
    checkInTime: r.checked_in_at,
    checkOutTime: r.checked_out_at,
    checkInMethod: mapCheckInMethod(r.checkin_method),
    isFirstTimer: !r.member_id && !!r.visitor_name,
    isGuest: !r.member_id && !!r.visitor_name,
    notes: r.notes,
    recordedBy: r.checked_in_by?.toString(),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }))
})

// Convert store members to new format
const members = computed<Member[]>(() => {
  return (memberStore.members || []).map(m => ({
    id: m.id.toString(),
    firstName: m.first_name,
    lastName: m.last_name,
    middleName: undefined,
    photo: undefined,
    dateOfBirth: m.date_of_birth,
    gender: (m.gender || 'other') as Member['gender'],
    contact: {
      phone: m.phone || '',
      email: m.email,
      address: m.address ? {
        street: m.address,
        city: undefined,
        state: undefined,
        country: undefined,
        postalCode: undefined,
      } : undefined,
    },
    membershipNumber: undefined,
    membershipType: 'regular',
    status: m.is_active ? 'active' : 'inactive',
    joinDate: m.joined_date || m.created_at,
    maritalStatus: 'single',
    createdAt: m.created_at,
    updatedAt: m.updated_at,
  }))
})

// Helper functions to map between old and new formats
const mapServiceType = (type: string): Service['type'] => {
  const mapping: Record<string, Service['type']> = {
    'sunday_morning': 'sunday_first',
    'sunday_evening': 'sunday_second',
    'midweek': 'midweek',
    'prayer_meeting': 'prayer',
    'bible_study': 'midweek',
    'youth_service': 'youth',
    'children_service': 'children',
    'special_event': 'special',
  }
  return mapping[type] || 'special'
}

const mapAttendanceStatus = (method: string, checkedInAt?: string): AttendanceStatus => {
  if (!checkedInAt) return 'absent'
  // In production, determine based on check-in time vs service start time
  return 'present'
}

const mapCheckInMethod = (method: string): 'manual' | 'qr_code' | 'sms' | 'app' | 'nfc' => {
  if (method.includes('qr')) return 'qr_code'
  if (method.includes('sms')) return 'sms'
  if (method.includes('app')) return 'app'
  if (method.includes('nfc')) return 'nfc'
  return 'manual'
}

const handleCheckIn = async (memberId: string, status: AttendanceStatus) => {
  if (!selectedServiceId.value) return

  try {
    await attendanceStore.checkIn({
      serviceId: selectedServiceId.value,
      memberId,
      status,
      checkInMethod: 'manual',
      checkInTime: new Date().toISOString(),
    })
    $q.notify({
      type: 'positive',
      message: 'Member checked in successfully',
    })
  } catch (error) {
    console.error('Check-in error:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to check in member',
    })
  }
}

const handleBulkCheckIn = async (memberIds: string[], status: AttendanceStatus) => {
  if (!selectedServiceId.value) return

  try {
    await attendanceStore.bulkCheckIn({
      serviceId: selectedServiceId.value,
      memberIds,
      status,
      checkInMethod: 'manual',
      checkInTime: new Date().toISOString(),
    })
    $q.notify({
      type: 'positive',
      message: `${memberIds.length} members checked in successfully`,
    })
  } catch (error) {
    console.error('Bulk check-in error:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to check in members',
    })
  }
}

const handleCreateService = () => {
  // Navigate to service creation or open dialog
  $q.notify({
    type: 'info',
    message: 'Service creation feature coming soon',
  })
}

const handleExport = () => {
  if (!selectedServiceId.value) return
  attendanceStore.exportReport(selectedServiceId.value)
  $q.notify({
    type: 'positive',
    message: 'Report export initiated',
  })
}

const handleSelectService = (service: Service) => {
  selectedServiceId.value = service.id
  // Fetch attendance records for this service
  attendanceStore.fetchRecords(service.id)
}

onMounted(async () => {
  try {
    // Load initial data
    await Promise.all([
      memberStore.fetchMembers(),
      attendanceStore.fetchServices({ today: true, upcoming: true }),
    ])
  } catch (error) {
    console.error('Failed to load attendance data:', error)
  }
})
</script>

<style scoped>
.attendance-view {
  width: 100%;
  max-width: 100%;
}
</style>

