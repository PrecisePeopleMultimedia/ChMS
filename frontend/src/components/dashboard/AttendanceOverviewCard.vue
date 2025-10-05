<template>
  <q-card class="dashboard-card attendance-overview-card hover-lift">
    <q-card-section class="card-header">
      <div class="row items-center justify-between">
        <div class="row items-center q-gutter-sm">
          <q-icon name="check_circle" size="24px" color="green" />
          <div class="column">
            <div class="text-h6 text-weight-bold">Attendance</div>
            <div class="text-caption text-grey-6">Today's overview</div>
          </div>
        </div>
        <q-btn
          flat
          round
          icon="refresh"
          size="sm"
          @click="refresh"
          :loading="isLoading"
        />
      </div>
    </q-card-section>

    <q-card-section class="card-content">
      <div class="row q-gutter-md">
        <!-- Today's Attendance -->
        <div class="col-12 col-md-6">
          <div class="stat-item">
            <div class="stat-value text-h4 text-weight-bold text-green">
              {{ formatNumber(stats.todayAttendance) }}
            </div>
            <div class="stat-label text-caption text-grey-6">
              Today's Attendance
            </div>
          </div>
        </div>

        <!-- Weekly Average -->
        <div class="col-12 col-md-6">
          <div class="stat-item">
            <div class="stat-value text-h5 text-weight-bold text-blue">
              {{ formatNumber(stats.weeklyAverage) }}
            </div>
            <div class="stat-label text-caption text-grey-6">
              Weekly Average
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Trend -->
      <div class="q-mt-md">
        <div class="row items-center justify-between q-mb-xs">
          <span class="text-caption text-grey-6">Monthly Trend</span>
          <span 
            class="text-caption text-weight-medium"
            :class="trendColor"
          >
            {{ trendIcon }} {{ Math.abs(stats.monthlyTrend) }}%
          </span>
        </div>
        <q-linear-progress
          :value="Math.abs(stats.monthlyTrend) / 100"
          :color="trendColor"
          size="8px"
          rounded
        />
      </div>

      <!-- Attendance Chart Placeholder -->
      <div class="q-mt-md">
        <div class="attendance-chart">
          <div class="chart-placeholder">
            <q-icon name="bar_chart" size="48px" color="grey-4" />
            <div class="text-caption text-grey-6 q-mt-sm">
              Attendance chart will be displayed here
            </div>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="card-actions">
      <div class="row q-gutter-sm">
        <q-btn
          flat
          color="green"
          icon="check_circle"
          label="Record Attendance"
          @click="goToAttendance"
          class="col"
        />
        <q-btn
          flat
          color="blue"
          icon="assessment"
          label="View Reports"
          @click="goToReports"
          class="col"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/stores/dashboard'

// Composables
const router = useRouter()
const dashboardStore = useDashboardStore()

// Computed
const stats = computed(() => dashboardStore.stats)
const isLoading = computed(() => dashboardStore.isLoading)

const trendColor = computed(() => {
  if (stats.value.monthlyTrend > 0) return 'text-green'
  if (stats.value.monthlyTrend < 0) return 'text-red'
  return 'text-grey-6'
})

const trendIcon = computed(() => {
  if (stats.value.monthlyTrend > 0) return '↗'
  if (stats.value.monthlyTrend < 0) return '↘'
  return '→'
})

// Methods
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const refresh = async () => {
  await dashboardStore.refreshData()
}

const goToAttendance = () => {
  router.push({ name: 'Attendance' })
}

const goToReports = () => {
  router.push({ name: 'Reports' })
}
</script>

<style lang="sass" scoped>
.attendance-overview-card
  height: 100%
  min-height: 320px

.card-header
  padding-bottom: 8px

.card-content
  padding-top: 8px

.stat-item
  text-align: center
  padding: 8px

.stat-value
  line-height: 1.2

.stat-label
  margin-top: 4px

.attendance-chart
  height: 120px
  background: var(--muted)
  border-radius: 8px
  display: flex
  align-items: center
  justify-content: center

.chart-placeholder
  text-align: center
  color: var(--muted-foreground)

.card-actions
  padding-top: 8px
</style>
