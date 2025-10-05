<template>
  <q-card class="dashboard-card quick-actions-panel hover-lift">
    <q-card-section class="card-header">
      <div class="row items-center q-gutter-sm">
        <q-icon name="flash_on" size="24px" color="orange" />
        <div class="column">
          <div class="text-h6 text-weight-bold">Quick Actions</div>
          <div class="text-caption text-grey-6">Common tasks</div>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="card-content">
      <div class="row q-gutter-sm">
        <!-- Add Member -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-btn
            flat
            color="primary"
            icon="person_add"
            label="Add Member"
            @click="goToAddMember"
            class="action-btn full-width"
            :loading="isLoading"
          />
        </div>

        <!-- Record Attendance -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-btn
            flat
            color="green"
            icon="check_circle"
            label="Record Attendance"
            @click="goToRecordAttendance"
            class="action-btn full-width"
            :loading="isLoading"
          />
        </div>

        <!-- Create Event -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-btn
            flat
            color="orange"
            icon="event"
            label="Create Event"
            @click="goToCreateEvent"
            class="action-btn full-width"
            :loading="isLoading"
          />
        </div>

        <!-- Generate Report -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-btn
            flat
            color="purple"
            icon="assessment"
            label="Generate Report"
            @click="goToGenerateReport"
            class="action-btn full-width"
            :loading="isLoading"
          />
        </div>
      </div>

      <!-- Offline Actions -->
      <div v-if="!isOnline" class="q-mt-md">
        <q-banner class="offline-banner" rounded>
          <template v-slot:avatar>
            <q-icon name="wifi_off" color="warning" />
          </template>
          <div class="text-body2">
            You're offline. Actions will be queued for sync.
          </div>
        </q-banner>
      </div>

      <!-- Pending Actions -->
      <div v-if="hasPendingActions" class="q-mt-md">
        <q-banner class="pending-banner" rounded>
          <template v-slot:avatar>
            <q-icon name="pending" color="info" />
          </template>
          <div class="text-body2">
            {{ pendingActionsCount }} actions pending sync
          </div>
          <template v-slot:action>
            <q-btn
              flat
              color="primary"
              label="Sync Now"
              @click="handleSync"
              :loading="isLoading"
            />
          </template>
        </q-banner>
      </div>
    </q-card-section>

    <q-card-section class="card-actions">
      <div class="row q-gutter-sm">
        <q-btn
          flat
          color="grey-6"
          icon="settings"
          label="Settings"
          @click="goToSettings"
          class="col"
        />
        <q-btn
          flat
          color="grey-6"
          icon="help"
          label="Help"
          @click="goToHelp"
          class="col"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useDashboardStore } from '@/stores/dashboard'

// Composables
const router = useRouter()
const $q = useQuasar()
const dashboardStore = useDashboardStore()

// Computed
const isLoading = computed(() => dashboardStore.isLoading)
const isOnline = computed(() => dashboardStore.isOnline)
const hasPendingActions = computed(() => dashboardStore.hasPendingSync)
const pendingActionsCount = computed(() => dashboardStore.stats.pendingSync)

// Methods
const goToAddMember = () => {
  if (!isOnline.value) {
    handleOfflineAction('Add Member')
    return
  }
  router.push({ name: 'AddMember' })
}

const goToRecordAttendance = () => {
  if (!isOnline.value) {
    handleOfflineAction('Record Attendance')
    return
  }
  router.push({ name: 'RecordAttendance' })
}

const goToCreateEvent = () => {
  if (!isOnline.value) {
    handleOfflineAction('Create Event')
    return
  }
  router.push({ name: 'CreateEvent' })
}

const goToGenerateReport = () => {
  if (!isOnline.value) {
    handleOfflineAction('Generate Report')
    return
  }
  router.push({ name: 'GenerateReport' })
}

const goToSettings = () => {
  router.push({ name: 'Settings' })
}

const goToHelp = () => {
  router.push({ name: 'Help' })
}

const handleOfflineAction = (action: string) => {
  // Increment pending sync counter
  dashboardStore.incrementPendingSync()
  
  // Add activity
  dashboardStore.addActivity({
    type: 'member_added',
    description: `${action} queued for offline sync`,
    user: 'You',
    icon: 'pending',
    color: 'warning'
  })

  $q.notify({
    type: 'info',
    message: `${action} queued for sync when online`,
    position: 'top'
  })
}

const handleSync = async () => {
  try {
    await dashboardStore.syncOfflineData()
    $q.notify({
      type: 'positive',
      message: 'Actions synced successfully',
      position: 'top'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Sync failed. Please try again.',
      position: 'top'
    })
  }
}
</script>

<style lang="sass" scoped>
.quick-actions-panel
  height: 100%
  min-height: 280px

.card-header
  padding-bottom: 8px

.card-content
  padding-top: 8px

.action-btn
  height: 48px
  border-radius: 8px
  transition: all 0.2s ease

  &:hover
    transform: translateY(-2px)
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)

.offline-banner
  background: var(--warning)
  color: white

.pending-banner
  background: var(--info)
  color: white

.card-actions
  padding-top: 8px
</style>
