<template>
  <q-card class="dashboard-card member-stats-card hover-lift">
    <q-card-section class="card-header">
      <div class="row items-center justify-between">
        <div class="row items-center q-gutter-sm">
          <q-icon name="people" size="24px" color="primary" />
          <div class="column">
            <div class="text-h6 text-weight-bold">Members</div>
            <div class="text-caption text-grey-6">Total members</div>
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
        <!-- Total Members -->
        <div class="col-12 col-md-4">
          <div class="stat-item">
            <div class="stat-value text-h4 text-weight-bold text-primary">
              {{ formatNumber(stats.totalMembers) }}
            </div>
            <div class="stat-label text-caption text-grey-6">
              Total Members
            </div>
          </div>
        </div>

        <!-- New This Month -->
        <div class="col-12 col-md-4">
          <div class="stat-item">
            <div class="stat-value text-h5 text-weight-bold text-green">
              +{{ formatNumber(stats.newMembersThisMonth) }}
            </div>
            <div class="stat-label text-caption text-grey-6">
              New This Month
            </div>
          </div>
        </div>

        <!-- Active Members -->
        <div class="col-12 col-md-4">
          <div class="stat-item">
            <div class="stat-value text-h5 text-weight-bold text-blue">
              {{ formatNumber(stats.activeMembers) }}
            </div>
            <div class="stat-label text-caption text-grey-6">
              Active (30 days)
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="q-mt-md">
        <div class="row items-center justify-between q-mb-xs">
          <span class="text-caption text-grey-6">Active Rate</span>
          <span class="text-caption text-weight-medium">
            {{ activeRate }}%
          </span>
        </div>
        <q-linear-progress
          :value="activeRate / 100"
          color="primary"
          size="8px"
          rounded
        />
      </div>
    </q-card-section>

    <q-card-section class="card-actions">
      <q-btn
        flat
        color="primary"
        icon="people"
        label="View All Members"
        @click="goToMembers"
        class="full-width"
      />
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

const activeRate = computed(() => {
  if (stats.value.totalMembers === 0) return 0
  return Math.round((stats.value.activeMembers / stats.value.totalMembers) * 100)
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

const goToMembers = () => {
  router.push({ name: 'Members' })
}
</script>

<style lang="sass" scoped>
.member-stats-card
  height: 100%
  min-height: 280px

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

.card-actions
  padding-top: 8px
</style>
