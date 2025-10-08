<template>
  <!-- Skip Links for Accessibility -->
  <SkipLinks :visible="skipLinksVisible" :has-search="false" />
  
  <q-layout view="lHh Lpr lFf" role="application" aria-label="Church Management System">
    <!-- Main Header -->
    <q-header elevated role="banner">
      <q-toolbar>
        <q-btn 
          flat 
          dense 
          round 
          @click="toggleLeftDrawer" 
          icon="menu" 
          aria-label="Toggle navigation menu"
          :aria-expanded="leftDrawerOpen.toString()"
          aria-controls="main-navigation"
        />
        <q-toolbar-title role="heading" aria-level="1">
          ChurchAfrica
        </q-toolbar-title>
        <q-space />
        
        <!-- Header Actions -->
        <div class="q-gutter-sm row items-center no-wrap" role="toolbar" aria-label="Header actions">
          <!-- Fullscreen Toggle -->
          <q-btn
            round
            dense
            flat
            color="white"
            :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
            @click="$q.fullscreen.toggle()"
            v-if="$q.screen.gt.sm"
            :aria-label="$q.fullscreen.isActive ? 'Exit fullscreen' : 'Enter fullscreen'"
            :aria-pressed="$q.fullscreen.isActive.toString()"
          />
          
          <!-- GitHub Link -->
          <q-btn
            round
            dense
            flat
            color="white"
            icon="fab fa-github"
            type="a"
            href="https://github.com/JerryAgenyiInc/ChMS"
            target="_blank"
            aria-label="View source code on GitHub (opens in new tab)"
            rel="noopener noreferrer"
          />
          
          <!-- Notifications -->
          <q-btn
            round
            dense
            flat
            color="white"
            icon="notifications"
            aria-label="Notifications"
            aria-describedby="notification-count"
            :aria-expanded="notificationMenuOpen.toString()"
            @click="notificationMenuOpen = !notificationMenuOpen"
          >
            <q-badge 
              color="red" 
              text-color="white" 
              floating
              id="notification-count"
              aria-label="5 unread notifications"
            >
              5
            </q-badge>
            <q-menu 
              v-model="notificationMenuOpen"
              role="menu"
              aria-label="Notification menu"
            >
              <q-list style="min-width: 100px" role="none">
                <messages />
                <q-card class="text-center no-shadow no-border">
                  <q-btn
                    label="View All"
                    style="max-width: 120px !important"
                    flat
                    dense
                    class="text-indigo-8"
                    role="menuitem"
                    aria-label="View all notifications"
                  />
                </q-card>
              </q-list>
            </q-menu>
          </q-btn>
          
          <!-- User Menu -->
          <q-btn 
            round 
            flat
            aria-label="User menu"
            :aria-expanded="userMenuOpen.toString()"
            @click="userMenuOpen = !userMenuOpen"
          >
            <q-avatar size="26px">
              <img 
                :src="user?.avatar || 'https://cdn.quasar.dev/img/boy-avatar.png'" 
                :alt="user?.name ? `${user.name} avatar` : 'User avatar'"
              />
            </q-avatar>
            <q-menu 
              v-model="userMenuOpen"
              role="menu"
              aria-label="User menu"
            >
              <q-list role="none">
                <q-item 
                  clickable 
                  v-close-popup
                  role="menuitem"
                  aria-label="View profile"
                  to="/profile"
                >
                  <q-item-section avatar>
                    <q-icon name="person" />
                  </q-item-section>
                  <q-item-section>Profile</q-item-section>
                </q-item>
                <q-item 
                  clickable 
                  v-close-popup
                  role="menuitem"
                  aria-label="Settings"
                  to="/settings"
                >
                  <q-item-section avatar>
                    <q-icon name="settings" />
                  </q-item-section>
                  <q-item-section>Settings</q-item-section>
                </q-item>
                <q-separator />
                <q-item 
                  clickable 
                  v-close-popup
                  role="menuitem"
                  aria-label="Sign out"
                  @click="handleLogout"
                >
                  <q-item-section avatar>
                    <q-icon name="logout" />
                  </q-item-section>
                  <q-item-section>Sign Out</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Navigation Drawer -->
    <q-drawer 
      v-model="leftDrawerOpen" 
      show-if-above 
      bordered 
      class="bg-primary text-white"
      role="navigation"
      aria-label="Main navigation"
      id="main-navigation"
    >
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px">
        <nav role="navigation" aria-label="Main menu">
          <q-list role="menubar">
            <!-- Dashboard -->
            <q-item 
              to="/dashboard" 
              active-class="q-item-no-link-highlighting"
              role="menuitem"
              aria-label="Dashboard"
            >
              <q-item-section avatar>
                <q-icon name="dashboard" aria-hidden="true" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Dashboard</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator class="bg-grey-7" size="2px" inset role="separator" />

            <!-- Members Section -->
            <q-expansion-item 
              icon="people" 
              label="Members"
              role="menuitem"
              aria-label="Members section"
              :aria-expanded="membersExpanded.toString()"
              v-model="membersExpanded"
            >
              <q-list class="q-pl-lg" role="menu" aria-label="Members submenu">
                <q-item 
                  to="/members" 
                  active-class="q-item-no-link-highlighting"
                  role="menuitem"
                  aria-label="View all members"
                >
                  <q-item-section avatar>
                    <q-icon name="people" aria-hidden="true" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>All Members</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item 
                  to="/members/add" 
                  active-class="q-item-no-link-highlighting"
                  role="menuitem"
                  aria-label="Add new member"
                >
                  <q-item-section avatar>
                    <q-icon name="person_add" aria-hidden="true" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Add Member</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

            <!-- Other Navigation Items -->
            <q-item 
              to="/attendance" 
              active-class="q-item-no-link-highlighting"
              role="menuitem"
              aria-label="Attendance tracking"
            >
              <q-item-section avatar>
                <q-icon name="check_circle" aria-hidden="true" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Attendance</q-item-label>
              </q-item-section>
            </q-item>

            <q-item 
              to="/events" 
              active-class="q-item-no-link-highlighting"
              role="menuitem"
              aria-label="Events management"
            >
              <q-item-section avatar>
                <q-icon name="event" aria-hidden="true" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Events</q-item-label>
              </q-item-section>
            </q-item>

            <q-item 
              to="/reports" 
              active-class="q-item-no-link-highlighting"
              role="menuitem"
              aria-label="Reports and analytics"
            >
              <q-item-section avatar>
                <q-icon name="assessment" aria-hidden="true" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Reports</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator class="bg-grey-7" size="2px" inset role="separator" />

            <!-- Settings Section -->
            <q-item-label 
              header 
              class="text-weight-bolder text-white"
              role="heading"
              aria-level="2"
            >
              Settings
            </q-item-label>

            <q-item 
              to="/profile" 
              active-class="q-item-no-link-highlighting"
              role="menuitem"
              aria-label="User profile settings"
            >
              <q-item-section avatar>
                <q-icon name="person" aria-hidden="true" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Profile</q-item-label>
              </q-item-section>
            </q-item>

            <q-item 
              to="/settings" 
              active-class="q-item-no-link-highlighting"
              role="menuitem"
              aria-label="Application settings"
            >
              <q-item-section avatar>
                <q-icon name="settings" aria-hidden="true" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Settings</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </nav>
      </q-scroll-area>
    </q-drawer>

    <!-- Main Content Area -->
    <q-page-container>
      <main id="main-content" role="main" aria-label="Main content" tabindex="-1">
        <router-view />
      </main>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAccessibility } from '@/composables/useAccessibility'
import SkipLinks from '@/components/accessibility/SkipLinks.vue'
import Messages from '@/components/Messages.vue'

// State
const leftDrawerOpen = ref(false)
const notificationMenuOpen = ref(false)
const userMenuOpen = ref(false)
const membersExpanded = ref(false)
const skipLinksVisible = ref(false)

// Stores
const authStore = useAuthStore()
const router = useRouter()

// Accessibility
const { announceToScreenReader } = useAccessibility()

// Computed
const user = computed(() => authStore.user)

// Methods
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
  announceToScreenReader(
    leftDrawerOpen.value ? 'Navigation menu opened' : 'Navigation menu closed'
  )
}

async function handleLogout() {
  try {
    await authStore.logout()
    announceToScreenReader('Successfully signed out')
    router.push('/login')
  } catch (error) {
    announceToScreenReader('Error signing out', 'assertive')
  }
}

// Keyboard navigation
function handleKeydown(event: KeyboardEvent) {
  // Show skip links on Tab
  if (event.key === 'Tab') {
    skipLinksVisible.value = true
  }

  // Hide skip links on Escape
  if (event.key === 'Escape') {
    skipLinksVisible.value = false
    notificationMenuOpen.value = false
    userMenuOpen.value = false
  }
}

function handleClick() {
  skipLinksVisible.value = false
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', handleClick)

  // Announce page load
  announceToScreenReader('Church Management System dashboard loaded')
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', handleClick)
})
</script>

<style scoped>
/* Focus styles for better accessibility */
.q-btn:focus {
  outline: 2px solid rgba(255, 255, 255, 0.8);
  outline-offset: 2px;
}

.q-item:focus {
  outline: 2px solid rgba(255, 255, 255, 0.8);
  outline-offset: -2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .q-btn:focus,
  .q-item:focus {
    outline: 3px solid white;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
</style>
