<template>
  <div class="attendance-dashboard">
    <!-- Statistics Cards -->
    <div class="row q-gutter-md q-mb-md">
      <div class="col-12 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-h6 text-weight-bold text-primary">
              {{ stats?.total_attendance || 0 }}
            </div>
            <div class="text-caption text-grey-7">Total Attendance</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-h6 text-weight-bold text-green">
              {{ stats?.member_attendance || 0 }}
            </div>
            <div class="text-caption text-grey-7">Members</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-h6 text-weight-bold text-blue">
              {{ stats?.visitor_attendance || 0 }}
            </div>
            <div class="text-caption text-grey-7">Visitors</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-h6 text-weight-bold text-purple">
              {{ stats?.family_checkins || 0 }}
            </div>
            <div class="text-caption text-grey-7">Family Check-ins</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Recent Check-ins -->
    <q-card>
      <q-card-section>
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h6">Recent Check-ins</div>
          <q-btn
            flat
            icon="refresh"
            label="Refresh"
            @click="refreshAttendance"
            :loading="attendanceStore.loading"
          />
        </div>

        <q-list v-if="recentCheckins.length > 0" bordered separator>
          <q-item
            v-for="record in recentCheckins"
            :key="record.id"
          >
            <q-item-section avatar>
              <q-avatar
                :color="record.member_id ? 'primary' : 'grey'"
                text-color="white"
              >
                {{
                  record.member_id
                    ? (record.member?.first_name?.charAt(0) || 'M')
                    : (record.visitor_name?.charAt(0) || 'V')
                }}
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{
                  record.member_id
                    ? `${record.member?.first_name} ${record.member?.last_name}`
                    : record.visitor_name
                }}
                <q-badge
                  v-if="record.is_family_checkin"
                  color="purple"
                  label="Family"
                  class="q-ml-sm"
                />
              </q-item-label>
              <q-item-label caption>
                {{ formatDateTime(record.checked_in_at) }}
                <span v-if="record.service"> • {{ record.service.name }}</span>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-chip
                :color="getMethodColor(record.checkin_method)"
                text-color="white"
                size="sm"
              >
                {{ formatMethod(record.checkin_method) }}
              </q-chip>
            </q-item-section>
          </q-item>
        </q-list>

        <q-banner v-else class="bg-grey-3">
          <div class="text-body2">No check-ins yet today</div>
        </q-banner>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAttendanceStore } from '@/stores/attendance'

const attendanceStore = useAttendanceStore()

const stats = ref<any>(null)
const recentCheckins = computed(() => attendanceStore.todayAttendance.slice(0, 10))

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatMethod = (method: string) => {
  const methods: Record<string, string> = {
    'qr_individual': 'QR Code',
    'qr_family': 'QR Family',
    'manual_search': 'Manual',
    'visitor_registration': 'Visitor'
  }
  return methods[method] || method
}

const getMethodColor = (method: string) => {
  const colors: Record<string, string> = {
    'qr_individual': 'green',
    'qr_family': 'purple',
    'manual_search': 'blue',
    'visitor_registration': 'orange'
  }
  return colors[method] || 'grey'
}

const refreshAttendance = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]
    await attendanceStore.fetchAttendanceRecords({ today: true })
    await attendanceStore.fetchReports({ date_from: today, date_to: today })
    stats.value = attendanceStore.stats
  } catch (error) {
    console.error('Failed to refresh attendance:', error)
  }
}

onMounted(async () => {
  await refreshAttendance()
})
</script>

<style scoped lang="sass">
.attendance-dashboard
  width: 100%
</style>

