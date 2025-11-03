<template>
  <div class="attendance-reports-view">
    <div class="row q-col-gutter-md">
      <!-- Filters -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Report Filters</div>
            <div class="row q-gutter-md">
              <div class="col-12 col-md-4">
                <q-select
                  v-model="filters.service_id"
                  :options="serviceOptions"
                  option-label="label"
                  option-value="value"
                  emit-value
                  map-options
                  label="Service"
                  clearable
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="filters.date_from"
                  filled
                  label="Date From"
                  type="date"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="filters.date_to"
                  filled
                  label="Date To"
                  type="date"
                />
              </div>
            </div>
            <div class="q-mt-md">
              <q-btn
                color="primary"
                label="Generate Report"
                @click="generateReport"
                :loading="attendanceStore.loading"
              />
              <q-btn
                flat
                label="Reset"
                @click="resetFilters"
                class="q-ml-sm"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Statistics -->
      <div v-if="stats" class="col-12">
        <div class="row q-gutter-md">
          <div class="col-12 col-md-3">
            <q-card>
              <q-card-section>
                <div class="text-h6 text-weight-bold text-primary">
                  {{ stats.total_attendance }}
                </div>
                <div class="text-caption text-grey-7">Total Attendance</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-3">
            <q-card>
              <q-card-section>
                <div class="text-h6 text-weight-bold text-green">
                  {{ stats.member_attendance }}
                </div>
                <div class="text-caption text-grey-7">Members</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-3">
            <q-card>
              <q-card-section>
                <div class="text-h6 text-weight-bold text-blue">
                  {{ stats.visitor_attendance }}
                </div>
                <div class="text-caption text-grey-7">Visitors</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-3">
            <q-card>
              <q-card-section>
                <div class="text-h6 text-weight-bold text-purple">
                  {{ stats.family_checkins }}
                </div>
                <div class="text-caption text-grey-7">Family Check-ins</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Daily Breakdown Chart (Placeholder) -->
      <div v-if="stats?.daily_breakdown" class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Daily Attendance Breakdown</div>
            <div class="chart-placeholder">
              <q-icon name="bar_chart" size="48px" color="grey-4" />
              <div class="text-caption text-grey-6 q-mt-sm">
                Chart visualization will be implemented here
              </div>
              <div class="q-mt-md">
                <div
                  v-for="(count, date) in stats.daily_breakdown"
                  :key="date"
                  class="row items-center q-mb-sm"
                >
                  <div class="col-4">{{ formatDate(date) }}</div>
                  <div class="col-8">
                    <q-linear-progress
                      :value="count / (stats.total_attendance || 1)"
                      color="primary"
                      size="20px"
                    >
                      <div class="absolute-full flex flex-center">
                        <q-badge color="white" text-color="primary" :label="count" />
                      </div>
                    </q-linear-progress>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Service Breakdown -->
      <div v-if="stats?.service_breakdown" class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Service Type Breakdown</div>
            <q-list bordered separator>
              <q-item
                v-for="(count, serviceType) in stats.service_breakdown"
                :key="serviceType"
              >
                <q-item-section>
                  <q-item-label>{{ formatServiceType(serviceType) }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge color="primary" :label="count" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAttendanceStore } from '@/stores/attendance'

const attendanceStore = useAttendanceStore()

const filters = ref({
  service_id: null as number | null,
  date_from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
  date_to: new Date().toISOString().split('T')[0] // Today
})

const stats = computed(() => attendanceStore.stats)

const serviceOptions = computed(() => {
  return attendanceStore.services.map(service => ({
    label: `${service.name} - ${service.scheduled_date}`,
    value: service.id
  }))
})

const generateReport = async () => {
  try {
    await attendanceStore.fetchReports({
      service_id: filters.value.service_id || undefined,
      date_from: filters.value.date_from,
      date_to: filters.value.date_to
    })
  } catch (error) {
    console.error('Failed to generate report:', error)
  }
}

const resetFilters = () => {
  filters.value = {
    service_id: null,
    date_from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    date_to: new Date().toISOString().split('T')[0]
  }
  generateReport()
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
}

const formatServiceType = (type: string) => {
  const types: Record<string, string> = {
    'sunday_morning': 'Sunday Morning',
    'sunday_evening': 'Sunday Evening',
    'midweek': 'Midweek',
    'special_event': 'Special Event'
  }
  return types[type] || type
}

onMounted(async () => {
  // Load services for filter
  await attendanceStore.fetchServices({ upcoming: true })
  // Generate initial report
  await generateReport()
})
</script>

<style scoped lang="sass">
.attendance-reports-view
  padding: 16px
  max-width: 1200px
  margin: 0 auto

.chart-placeholder
  min-height: 300px
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  text-align: center
</style>

