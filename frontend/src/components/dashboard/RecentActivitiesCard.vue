<template>
  <q-card class="dashboard-card recent-activities-card hover-lift">
    <q-card-section class="card-header">
      <div class="row items-center justify-between">
        <div class="row items-center q-gutter-sm">
          <q-icon name="history" size="24px" color="purple" />
          <div class="column">
            <div class="text-h6 text-weight-bold">Recent Activities</div>
            <div class="text-caption text-grey-6">Latest updates</div>
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
      <!-- Activities List -->
      <div v-if="activities.length > 0" class="activities-list">
        <div
          v-for="activity in recentActivities"
          :key="activity.id"
          class="activity-item"
        >
          <div class="row items-start q-gutter-sm">
            <!-- Activity Icon -->
            <div class="activity-icon">
              <q-icon
                :name="activity.icon"
                :color="activity.color"
                size="20px"
              />
            </div>

            <!-- Activity Content -->
            <div class="col">
              <div class="activity-description text-body2">
                {{ activity.description }}
              </div>
              <div class="activity-meta text-caption text-grey-6">
                {{ activity.user }} • {{ formatTimestamp(activity.timestamp) }}
              </div>
            </div>

            <!-- Activity Type Badge -->
            <div class="activity-type">
              <q-chip
                :color="getTypeColor(activity.type)"
                :label="getTypeLabel(activity.type)"
                size="sm"
                dense
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <q-icon name="history" size="48px" color="grey-4" />
        <div class="text-h6 text-grey-6 q-mt-sm">No recent activities</div>
        <div class="text-caption text-grey-6">
          Activities will appear here as you use the system
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <q-spinner color="primary" size="24px" />
        <div class="text-caption text-grey-6 q-mt-sm">Loading activities...</div>
      </div>
    </q-card-section>

    <q-card-section class="card-actions">
      <q-btn
        flat
        color="purple"
        icon="history"
        label="View All Activities"
        @click="goToActivities"
        class="full-width"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/stores/dashboard'
import type { ActivityItem } from '@/stores/dashboard'

// Composables
const router = useRouter()
const dashboardStore = useDashboardStore()

// Computed
const activities = computed(() => dashboardStore.activities)
const recentActivities = computed(() => dashboardStore.recentActivities)
const isLoading = computed(() => dashboardStore.isLoading)

// Methods
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

const getTypeColor = (type: ActivityItem['type']): string => {
  const colors = {
    member_added: 'blue',
    attendance_recorded: 'green',
    event_created: 'orange',
    profile_updated: 'purple'
  }
  return colors[type] || 'grey'
}

const getTypeLabel = (type: ActivityItem['type']): string => {
  const labels = {
    member_added: 'Member',
    attendance_recorded: 'Attendance',
    event_created: 'Event',
    profile_updated: 'Profile'
  }
  return labels[type] || 'Activity'
}

const refresh = async () => {
  await dashboardStore.refreshData()
}

const goToActivities = () => {
  router.push({ name: 'Activities' })
}
</script>

<style lang="sass" scoped>
.recent-activities-card
  height: 100%
  min-height: 400px

.card-header
  padding-bottom: 8px

.card-content
  padding-top: 8px
  max-height: 300px
  overflow-y: auto

.activities-list
  space-y: 8px

.activity-item
  padding: 12px 0
  border-bottom: 1px solid var(--border)

  &:last-child
    border-bottom: none

.activity-icon
  margin-top: 2px

.activity-description
  line-height: 1.4
  margin-bottom: 4px

.activity-meta
  line-height: 1.2

.activity-type
  margin-top: 2px

.empty-state
  text-align: center
  padding: 32px 16px

.loading-state
  text-align: center
  padding: 32px 16px

.card-actions
  padding-top: 8px
</style>
