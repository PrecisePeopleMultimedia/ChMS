<template>
  <q-drawer
    v-model="drawerOpen"
    show-if-above
    bordered
    :width="sidebarWidth"
    :mini="isCollapsed"
    class="quasar-prime-sidebar"
  >
    <!-- Logo Section with Collapse Button -->
    <div class="sidebar-header">
      <div class="row items-center justify-between">
        <div class="row items-center" v-if="!isCollapsed">
          <q-icon name="account_tree" size="24px" color="primary" class="q-mr-sm" />
          <div class="text-h6 text-weight-bold">ChurchAfrica</div>
        </div>
        
        <!-- Collapse Button (only visible when expanded) -->
        <q-btn
          v-if="!isCollapsed"
          flat
          round
          dense
          icon="chevron_left"
          class="collapse-btn"
          @click="collapseSidebar"
        />
      </div>
    </div>

    <q-list class="sidebar-menu">
      <q-item-label header class="text-grey-6 q-pa-sm">
        Navigation
      </q-item-label>

      <!-- Dashboard -->
      <q-item
        clickable
        v-ripple
        to="/dashboard"
        exact
        active-class="active-menu-item"
        class="menu-item"
      >
        <q-item-section avatar>
          <q-icon name="dashboard" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Dashboard</q-item-label>
        </q-item-section>
      </q-item>

      <!-- Members -->
      <q-item
        clickable
        v-ripple
        to="/members"
        active-class="active-menu-item"
        class="menu-item"
      >
        <q-item-section avatar>
          <q-icon name="people" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Members</q-item-label>
        </q-item-section>
      </q-item>

      <!-- Attendance -->
      <q-item
        clickable
        v-ripple
        to="/attendance"
        active-class="active-menu-item"
        class="menu-item"
      >
        <q-item-section avatar>
          <q-icon name="event_available" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Attendance</q-item-label>
        </q-item-section>
      </q-item>

      <!-- Events -->
      <q-item
        clickable
        v-ripple
        to="/events"
        active-class="active-menu-item"
        class="menu-item"
      >
        <q-item-section avatar>
          <q-icon name="event" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Events</q-item-label>
        </q-item-section>
      </q-item>

      <!-- Reports -->
      <q-item
        clickable
        v-ripple
        to="/reports"
        active-class="active-menu-item"
        class="menu-item"
      >
        <q-item-section avatar>
          <q-icon name="bar_chart" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Reports</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator class="q-my-md" />

      <!-- Settings -->
      <q-item
        clickable
        v-ripple
        to="/settings"
        active-class="active-menu-item"
        class="menu-item"
      >
        <q-item-section avatar>
          <q-icon name="settings" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Settings</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const drawerOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isCollapsed = ref(false)
const sidebarWidth = computed(() => isCollapsed.value ? 60 : 280)

const collapseSidebar = () => {
  isCollapsed.value = true
}

// Re-expand when any menu item is clicked
const expandSidebar = () => {
  if (isCollapsed.value) {
    isCollapsed.value = false
  }
}

// Listen for clicks on menu items
const handleMenuItemClick = () => {
  expandSidebar()
}
</script>

<style lang="sass" scoped>
.quasar-prime-sidebar
  background: var(--sidebar-bg)
  color: var(--sidebar-text)
  border-right: 1px solid var(--border)

.sidebar-header
  padding: 16px
  border-bottom: 1px solid var(--border)
  background: var(--sidebar-header-bg)

.collapse-btn
  color: var(--sidebar-text)
  transition: all 0.2s ease
  
  &:hover
    background: var(--hover-bg)
    transform: scale(1.1)

.sidebar-menu
  padding: 8px 0

.menu-item
  margin: 4px 8px
  border-radius: 8px
  transition: all 0.2s ease
  
  &:hover
    background: var(--hover-bg)
    transform: translateX(4px)

.active-menu-item
  background: var(--primary)
  color: white
  
  .q-icon
    color: white

/* Light mode variables */
:root
  --sidebar-bg: #ffffff
  --sidebar-text: #1a1a1a
  --sidebar-header-bg: #f8f9fa
  --hover-bg: rgba(0, 0, 0, 0.05)
  --border: #e9ecef

/* Dark mode variables */
.dark
  --sidebar-bg: #1a1a1a
  --sidebar-text: #ffffff
  --sidebar-header-bg: #2d2d2d
  --hover-bg: rgba(255, 255, 255, 0.1)
  --border: #3d3d3d
</style>
