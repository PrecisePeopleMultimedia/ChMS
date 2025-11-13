<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2>Attendance Tracking</h2>
        <p class="text-sm text-muted-foreground mt-1">
          Record and monitor service attendance
        </p>
      </div>
      <div class="flex gap-2">
        <ModernButton
          v-if="selectedServiceId"
          variant="outline"
          @click="showQRScanner = true"
          class="gap-2"
        >
          <q-icon name="qr_code_scanner" class="h-4 w-4" />
          QR Scan
        </ModernButton>
        <ModernButton
          v-if="onExport && selectedServiceId"
          variant="outline"
          @click="onExport"
          class="gap-2"
        >
          <q-icon name="download" class="h-4 w-4" />
          Export Report
        </ModernButton>
      </div>
    </div>

    <!-- Service Selection -->
    <div v-if="!selectedServiceId">
      <AttendanceServiceSelector
        :services="services"
        :selected-service-id="selectedServiceId"
        @select-service="handleSelectService"
        @create-service="onCreateService"
      />
    </div>

    <!-- Attendance Interface -->
    <div v-if="selectedServiceId && selectedService" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Stats & Actions -->
      <div class="lg:col-span-1 space-y-4">
        <!-- Service Info Card -->
        <ModernCard>
          <ModernCardHeader>
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <ModernCardTitle class="text-base">{{ selectedService.name }}</ModernCardTitle>
                <p class="text-sm text-muted-foreground">
                  {{ formatServiceDate(selectedService.date) }}
                </p>
              </div>
              <ModernButton
                variant="ghost"
                size="sm"
                @click="handleSelectService(selectedService)"
              >
                Change
              </ModernButton>
            </div>
          </ModernCardHeader>
        </ModernCard>

        <!-- Stats Cards -->
        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle class="text-base">Attendance Stats</ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent class="space-y-4">
            <!-- Progress Bar -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm">Attendance Rate</span>
                <span class="text-2xl font-bold">{{ stats.attendanceRate }}%</span>
              </div>
              <div class="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  class="h-full bg-primary transition-all"
                  :style="{ width: `${stats.attendanceRate}%` }"
                />
              </div>
              <p class="text-xs text-muted-foreground mt-1">
                {{ stats.totalPresent + stats.totalLate }} of {{ stats.totalExpected }} members
              </p>
            </div>

            <!-- Stat Items -->
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-success/10 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-1">
                  <q-icon name="check_circle" class="h-4 w-4 text-success" />
                  <span class="text-xs text-muted-foreground">Present</span>
                </div>
                <p class="text-2xl font-bold">{{ stats.totalPresent }}</p>
              </div>

              <div class="bg-warning/10 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-1">
                  <q-icon name="schedule" class="h-4 w-4 text-warning" />
                  <span class="text-xs text-muted-foreground">Late</span>
                </div>
                <p class="text-2xl font-bold">{{ stats.totalLate }}</p>
              </div>

              <div class="bg-muted rounded-lg p-3">
                <div class="flex items-center gap-2 mb-1">
                  <q-icon name="cancel" class="h-4 w-4 text-muted-foreground" />
                  <span class="text-xs text-muted-foreground">Absent</span>
                </div>
                <p class="text-2xl font-bold">{{ stats.totalAbsent }}</p>
              </div>

              <div class="bg-info/10 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-1">
                  <q-icon name="person_add" class="h-4 w-4 text-info" />
                  <span class="text-xs text-muted-foreground">First Timers</span>
                </div>
                <p class="text-2xl font-bold">{{ stats.firstTimers }}</p>
              </div>
            </div>

            <div v-if="stats.comparisonToPrevious" class="pt-3 border-t">
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">vs. Last Service</span>
                <div class="flex items-center gap-1">
                  <q-icon
                    :name="getTrendIcon()"
                    :class="[
                      'h-4 w-4',
                      stats.comparisonToPrevious.change > 0 ? 'text-success' : '',
                      stats.comparisonToPrevious.change < 0 ? 'text-destructive' : ''
                    ]"
                  />
                  <span
                    :class="[
                      'text-sm font-medium',
                      stats.comparisonToPrevious.change > 0 ? 'text-success' : '',
                      stats.comparisonToPrevious.change < 0 ? 'text-destructive' : ''
                    ]"
                  >
                    {{ stats.comparisonToPrevious.change > 0 ? '+' : '' }}{{ stats.comparisonToPrevious.change }}%
                  </span>
                </div>
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>

        <!-- Quick Actions -->
        <ModernCard v-if="onBulkCheckIn">
          <ModernCardHeader>
            <ModernCardTitle class="text-base">Quick Actions</ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent class="space-y-2">
            <ModernButton
              variant="outline"
              class="w-full justify-start gap-2"
              @click="handleMarkAllPresent"
            >
              <q-icon name="check_circle" class="h-4 w-4" />
              Mark All Present
            </ModernButton>
            <ModernButton
              variant="outline"
              class="w-full justify-start gap-2"
              @click="handleClearAll"
            >
              <q-icon name="cancel" class="h-4 w-4" />
              Clear All
            </ModernButton>
          </ModernCardContent>
        </ModernCard>
      </div>

      <!-- Right Column: Member List -->
      <div class="lg:col-span-2">
        <ModernCard>
          <ModernCardHeader>
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div class="flex-1">
                <ModernCardTitle>Check-In Members</ModernCardTitle>
                <p class="text-sm text-muted-foreground">
                  {{ filteredMembers.length }} {{ filteredMembers.length === 1 ? 'member' : 'members' }}
                </p>
              </div>

              <ModernTabs
                :model-value="filterStatus"
                :tabs="[
                  { name: 'all', label: 'All' },
                  { name: 'checked-in', label: `Checked In (${stats.totalPresent + stats.totalLate})` },
                  { name: 'not-checked-in', label: `Pending (${stats.totalExpected - (stats.totalPresent + stats.totalLate)})` },
                ]"
                @update:model-value="filterStatus = $event"
              />
            </div>

            <!-- Search -->
            <div class="relative mt-4">
              <q-icon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <ModernInput
                v-model="searchQuery"
                placeholder="Search members by name, phone, or membership #..."
                class="pl-9"
              />
            </div>
          </ModernCardHeader>

          <ModernCardContent>
            <div class="h-[600px] overflow-y-auto pr-4">
              <div class="space-y-2">
                <div v-if="filteredMembers.length === 0" class="text-center py-12 text-muted-foreground">
                  <q-icon name="people" size="48px" class="mb-2 opacity-50" />
                  <p>No members found</p>
                </div>
                <MemberCheckIn
                  v-for="member in filteredMembers"
                  :key="member.id"
                  :member="member"
                  :attendance="attendanceByMember[member.id]"
                  @check-in="handleCheckIn"
                  compact
                />
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>
      </div>
    </div>

    <!-- QR Code Scanner Dialog -->
    <ModernDialog
      v-model="showQRScanner"
      title="QR Code Check-In"
      max-width="500px"
    >
      <template #title>
        <div class="flex items-center gap-2">
          <q-icon name="qr_code_scanner" class="h-5 w-5 text-primary" />
          QR Code Check-In
        </div>
      </template>
      <QRCodeScanner @scan-success="handleQRScan" />
    </ModernDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ModernCard from '@/components/ui/ModernCard.vue'
import ModernCardHeader from '@/components/ui/ModernCardHeader.vue'
import ModernCardTitle from '@/components/ui/ModernCardTitle.vue'
import ModernCardContent from '@/components/ui/ModernCardContent.vue'
import ModernButton from '@/components/ui/ModernButton.vue'
import ModernInput from '@/components/ui/ModernInput.vue'
import ModernTabs from '@/components/ui/ModernTabs.vue'
import ModernDialog from '@/components/ui/ModernDialog.vue'
import MemberCheckIn from './MemberCheckIn.vue'
import AttendanceServiceSelector from './AttendanceServiceSelector.vue'
import QRCodeScanner from './QRCodeScanner.vue'
import type { Member } from '@/types/member'
import type { Service, AttendanceRecord, AttendanceStatus, AttendanceStats } from '@/types/attendance'

interface Props {
  services: Service[]
  members: Member[]
  attendanceRecords: AttendanceRecord[]
  onCheckIn: (memberId: string, status: AttendanceStatus) => void
  onBulkCheckIn?: (memberIds: string[], status: AttendanceStatus) => void
  onCreateService?: () => void
  onExport?: () => void
  selectedServiceId?: string
  onSelectService?: (service: Service) => void
}

const props = defineProps<Props>()

const internalSelectedServiceId = ref<string>()
const searchQuery = ref('')
const filterStatus = ref<'all' | 'checked-in' | 'not-checked-in'>('all')
const showQRScanner = ref(false)

const selectedServiceId = computed(() => props.selectedServiceId || internalSelectedServiceId.value)

const handleSelectService = (service: Service) => {
  if (props.onSelectService) {
    props.onSelectService(service)
  } else {
    internalSelectedServiceId.value = service.id
  }
}

const selectedService = computed(() => {
  return props.services.find(s => s.id === selectedServiceId.value)
})

const serviceAttendance = computed(() => {
  if (!selectedServiceId.value) return []
  return props.attendanceRecords.filter(record => record.serviceId === selectedServiceId.value)
})

const attendanceByMember = computed(() => {
  const lookup: Record<string, AttendanceRecord> = {}
  serviceAttendance.value.forEach(record => {
    lookup[record.memberId] = record
  })
  return lookup
})

const stats = computed((): AttendanceStats => {
  const totalMembers = props.members.filter(m => m.status === 'active').length
  const present = serviceAttendance.value.filter(r => r.status === 'present').length
  const late = serviceAttendance.value.filter(r => r.status === 'late').length
  const absent = serviceAttendance.value.filter(r => r.status === 'absent').length
  const excused = serviceAttendance.value.filter(r => r.status === 'excused').length
  const firstTimers = serviceAttendance.value.filter(r => r.isFirstTimer).length
  const totalCheckedIn = present + late

  return {
    serviceId: selectedServiceId.value || '',
    serviceName: selectedService.value?.name || '',
    serviceDate: selectedService.value?.date || '',
    totalExpected: totalMembers,
    totalPresent: present,
    totalAbsent: absent,
    totalLate: late,
    totalExcused: excused,
    attendanceRate: totalMembers > 0 ? Math.round((totalCheckedIn / totalMembers) * 100) : 0,
    byGender: { male: 0, female: 0, other: 0 },
    byAgeCategory: { children: 0, youth: 0, adults: 0, seniors: 0 },
    firstTimers,
    guests: serviceAttendance.value.filter(r => r.isGuest).length,
    newMembers: 0,
    onTimeCount: present,
    lateCount: late,
  }
})

const filteredMembers = computed(() => {
  let filtered = props.members.filter(m => m.status === 'active' || m.status === 'visitor')

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(m =>
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(query) ||
      m.contact.phone.toLowerCase().includes(query) ||
      m.membershipNumber?.toLowerCase().includes(query)
    )
  }

  if (filterStatus.value === 'checked-in') {
    filtered = filtered.filter(m => {
      const attendance = attendanceByMember.value[m.id]
      return attendance?.status === 'present' || attendance?.status === 'late'
    })
  } else if (filterStatus.value === 'not-checked-in') {
    filtered = filtered.filter(m => {
      const attendance = attendanceByMember.value[m.id]
      return !attendance || attendance.status === 'absent'
    })
  }

  return filtered.sort((a, b) => {
    const aChecked = attendanceByMember.value[a.id]?.status === 'present' || attendanceByMember.value[a.id]?.status === 'late'
    const bChecked = attendanceByMember.value[b.id]?.status === 'present' || attendanceByMember.value[b.id]?.status === 'late'
    if (aChecked === bChecked) return 0
    return aChecked ? 1 : -1
  })
})

const getTrendIcon = (): string => {
  if (!stats.value.comparisonToPrevious) return 'remove'
  if (stats.value.comparisonToPrevious.change > 0) return 'trending_up'
  if (stats.value.comparisonToPrevious.change < 0) return 'trending_down'
  return 'remove'
}

const handleCheckIn = (memberId: string, status: AttendanceStatus) => {
  props.onCheckIn(memberId, status)
}

const handleQRScan = (data: { memberId: string; name: string; membershipNumber?: string }) => {
  console.log('QR Scanned:', data)
  props.onCheckIn(data.memberId, 'present')
  showQRScanner.value = false
}

const handleMarkAllPresent = () => {
  if (!props.onBulkCheckIn) return
  const uncheckedIds = filteredMembers.value
    .filter(m => !attendanceByMember.value[m.id] || attendanceByMember.value[m.id].status === 'absent')
    .map(m => m.id)
  if (uncheckedIds.length > 0) {
    props.onBulkCheckIn(uncheckedIds, 'present')
  }
}

const handleClearAll = () => {
  if (!props.onBulkCheckIn) return
  const checkedIds = filteredMembers.value
    .filter(m => attendanceByMember.value[m.id]?.status === 'present' || attendanceByMember.value[m.id]?.status === 'late')
    .map(m => m.id)
  if (checkedIds.length > 0) {
    props.onBulkCheckIn(checkedIds, 'absent')
  }
}

const formatServiceDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

