<template>
  <q-layout view="lHh Lpr lFf" class="dashboard-layout">
    <!-- Header -->
    <q-header elevated class="dashboard-header">
      <q-toolbar class="dashboard-toolbar">
        <!-- Mobile Menu Button -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          class="q-mr-sm"
          @click="toggleLeftDrawer"
          v-if="$q.screen.lt.md"
        />

        <!-- Logo and Title -->
        <div class="row items-center q-gutter-sm">
          <q-icon name="church" size="28px" color="primary" />
          <div class="column">
            <div class="text-h6 text-weight-bold text-primary">
              ChurchAfrica
            </div>
            <div class="text-caption text-grey-6">
              {{ organizationName }}
            </div>
          </div>
        </div>

        <q-space />

        <!-- Header Actions -->
        <div class="row items-center q-gutter-sm">
          <!-- Online Status Indicator -->
          <q-chip
            :color="isOnline ? 'positive' : 'negative'"
            :icon="isOnline ? 'wifi' : 'wifi_off'"
            :label="isOnline ? 'Online' : 'Offline'"
            size="sm"
            class="status-chip"
          />

          <!-- Sync Status -->
          <q-chip
            v-if="hasPendingSync"
            color="warning"
            icon="sync"
            :label="`${pendingSync} pending`"
            size="sm"
            clickable
            @click="handleSync"
          />

          <!-- Theme Toggle -->
          <ThemeToggle />

          <!-- User Menu -->
          <q-btn-dropdown
            flat
            round
            :icon="user?.avatar || 'person'"
            class="user-menu"
          >
            <q-list>
              <q-item clickable v-close-popup @click="goToProfile">
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Profile</q-item-label>
                  <q-item-label caption>{{ user?.email }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="goToSettings">
                <q-item-section avatar>
                  <q-icon name="settings" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Settings</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable v-close-popup @click="handleLogout">
                <q-item-section avatar>
                  <q-icon name="logout" color="negative" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-negative">Logout</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Left Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="dashboard-drawer"
    >
      <q-list class="dashboard-nav">
        <q-item-label header class="text-grey-8">
          Navigation
        </q-item-label>

        <q-item
          v-for="item in navigationItems"
          :key="item.route"
          clickable
          v-ripple
          :active="$route.name === item.route"
          @click="navigateTo(item.route)"
          class="nav-item"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" :color="item.color" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <q-item-label header class="text-grey-8">
          Quick Actions
        </q-item-label>

        <q-item
          v-for="action in quickActions"
          :key="action.label"
          clickable
          v-ripple
          @click="action.handler"
          class="nav-item"
        >
          <q-item-section avatar>
            <q-icon :name="action.icon" :color="action.color" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ action.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Main Content -->
    <q-page-container class="dashboard-content">
      <router-view />
    </q-page-container>

    <!-- Loading Overlay -->
    <q-inner-loading :showing="isLoading" color="primary" />
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'
import { useDashboardStore } from '@/stores/dashboard'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

// Composables
const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const authStore = useAuthStore()
const dashboardStore = useDashboardStore()

// State
const leftDrawerOpen = ref(false)
const organizationName = ref('Your Church')

// Computed
const user = computed(() => authStore.user)
const isLoading = computed(() => dashboardStore.isLoading)
const isOnline = computed(() => dashboardStore.isOnline)
const hasPendingSync = computed(() => dashboardStore.hasPendingSync)
const pendingSync = computed(() => dashboardStore.stats.pendingSync)

const navigationItems = computed(() => [
  {
    route: 'Dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    color: 'primary'
  },
  {
    route: 'Members',
    label: 'Members',
    icon: 'people',
    color: 'blue'
  },
  {
    route: 'Attendance',
    label: 'Attendance',
    icon: 'check_circle',
    color: 'green'
  },
  {
    route: 'Events',
    label: 'Events',
    icon: 'event',
    color: 'orange'
  },
  {
    route: 'Reports',
    label: 'Reports',
    icon: 'assessment',
    color: 'purple'
  }
])

const quickActions = computed(() => [
  {
    label: 'Add Member',
    icon: 'person_add',
    color: 'primary',
    handler: () => navigateTo('AddMember')
  },
  {
    label: 'Record Attendance',
    icon: 'check_circle',
    color: 'green',
    handler: () => navigateTo('RecordAttendance')
  },
  {
    label: 'Create Event',
    icon: 'event',
    color: 'orange',
    handler: () => navigateTo('CreateEvent')
  }
])

// Methods
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const navigateTo = (routeName: string) => {
  router.push({ name: routeName })
  if ($q.screen.lt.md) {
    leftDrawerOpen.value = false
  }
}

const goToProfile = () => {
  router.push({ name: 'Profile' })
}

const goToSettings = () => {
  router.push({ name: 'Settings' })
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push({ name: 'Login' })
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const handleSync = async () => {
  try {
    await dashboardStore.syncOfflineData()
    $q.notify({
      type: 'positive',
      message: 'Data synced successfully',
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

// Lifecycle
onMounted(async () => {
  // Initialize dashboard data
  await dashboardStore.initializeDashboard()
})
</script>

<style lang="sass" scoped>
.dashboard-layout
  background: var(--background)

.dashboard-header
  background: var(--card)
  border-bottom: 1px solid var(--border)

.dashboard-toolbar
  padding: 0 16px
  min-height: 64px

.dashboard-drawer
  background: var(--card)
  border-right: 1px solid var(--border)

.dashboard-nav
  padding: 16px 0

.nav-item
  margin: 4px 8px
  border-radius: 8px
  transition: all 0.2s ease

  &:hover
    background: var(--muted)

  &.q-item--active
    background: var(--primary)
    color: white

    .q-icon
      color: white !important

.status-chip
  font-size: 12px

.user-menu
  margin-left: 8px

.dashboard-content
  background: var(--background)
  min-height: calc(100vh - 64px)
</style>
