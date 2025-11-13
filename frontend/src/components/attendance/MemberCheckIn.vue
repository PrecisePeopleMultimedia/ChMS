<template>
  <ModernCard
    :class="[
      'transition-all',
      isCheckedIn && 'border-success shadow-sm'
    ]"
  >
    <ModernCardContent :class="compact ? 'p-3' : 'p-4'">
      <div class="flex items-center gap-3">
        <!-- Avatar -->
        <q-avatar :size="compact ? '40px' : '48px'" class="flex-shrink-0">
          <img v-if="member.photo" :src="member.photo" :alt="fullName" />
          <div v-else class="bg-primary/10 text-primary flex items-center justify-center h-full w-full text-sm">
            {{ initials }}
          </div>
        </q-avatar>

        <!-- Member Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0 flex-1">
              <h5 class="truncate text-sm">{{ fullName }}</h5>
              <p class="text-xs text-muted-foreground truncate">
                {{ member.membershipNumber || 'No membership #' }}
              </p>
            </div>

            <!-- Status Badge or Check-in Time -->
            <div v-if="attendance" class="flex flex-col items-end gap-1">
              <ModernBadge
                variant="outline"
                :class="['text-xs', statusColors[attendance.status]]"
              >
                {{ attendance.status }}
              </ModernBadge>
              <span v-if="attendance.checkInTime" class="text-xs text-muted-foreground">
                {{ formatCheckInTime(attendance.checkInTime) }}
              </span>
            </div>
            <ModernBadge
              v-else-if="member.status === 'visitor'"
              variant="outline"
              class="bg-info/10 text-info border-info/20 text-xs"
            >
              <q-icon name="person_add" class="h-3 w-3 mr-1" />
              Visitor
            </ModernBadge>
          </div>

          <!-- Additional Info -->
          <div v-if="!compact" class="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <div v-if="member.attendancePercentage !== undefined" class="flex items-center gap-1">
              <q-icon name="star" class="h-3 w-3" />
              <span>{{ member.attendancePercentage }}% rate</span>
            </div>
            <div v-if="member.ministries && member.ministries.length > 0" class="flex items-center gap-1">
              <q-icon name="person" class="h-3 w-3" />
              <span>{{ member.ministries.length }} {{ member.ministries.length === 1 ? 'ministry' : 'ministries' }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="!disabled" class="flex items-center gap-1 flex-shrink-0">
          <q-btn
            v-if="isCheckedIn"
            flat
            round
            dense
            icon="close"
            size="sm"
            class="h-9 w-9 border border-success text-success hover:bg-success hover:text-success-foreground"
            @click="handleCheckIn('absent')"
          >
            <q-tooltip>Undo check-in</q-tooltip>
          </q-btn>
          <template v-else>
            <q-btn
              flat
              round
              dense
              icon="check"
              size="sm"
              class="h-9 w-9 hover:bg-success hover:text-success-foreground hover:border-success"
              @click="handleCheckIn('present')"
            >
              <q-tooltip>Mark present</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="schedule"
              size="sm"
              class="h-9 w-9 hover:bg-warning hover:text-warning-foreground hover:border-warning"
              @click="handleCheckIn('late')"
            >
              <q-tooltip>Mark late</q-tooltip>
            </q-btn>
          </template>
        </div>
      </div>
    </ModernCardContent>
  </ModernCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ModernCard from '@/components/ui/ModernCard.vue'
import ModernCardContent from '@/components/ui/ModernCardContent.vue'
import ModernBadge from '@/components/ui/ModernBadge.vue'
import type { Member } from '@/types/member'
import type { AttendanceRecord, AttendanceStatus } from '@/types/attendance'

interface Props {
  member: Member
  attendance?: AttendanceRecord
  disabled?: boolean
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  compact: false
})

const emit = defineEmits<{
  checkIn: [memberId: string, status: AttendanceStatus]
}>()

const initials = computed(() => {
  return `${props.member.firstName[0]}${props.member.lastName[0]}`.toUpperCase()
})

const fullName = computed(() => {
  return `${props.member.firstName} ${props.member.lastName}`
})

const isCheckedIn = computed(() => {
  return props.attendance?.status === 'present' || props.attendance?.status === 'late'
})

const statusColors: Record<AttendanceStatus, string> = {
  present: 'bg-success/10 text-success border-success/20',
  late: 'bg-warning/10 text-warning border-warning/20',
  absent: 'bg-muted text-muted-foreground border-border',
  excused: 'bg-info/10 text-info border-info/20',
}

const formatCheckInTime = (time?: string): string => {
  if (!time) return ''
  const date = new Date(time)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

const handleCheckIn = (status: AttendanceStatus) => {
  emit('checkIn', props.member.id, status)
}
</script>

