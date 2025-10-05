<template>
  <q-page class="dashboard-page">
    <!-- Header -->
    <div class="dashboard-header q-pa-lg">
      <div class="row items-center justify-between">
        <div class="col">
          <h1 class="text-h4 text-white q-ma-none">
            Welcome back, {{ user?.first_name || user?.name || 'User' }}!
          </h1>
          <p class="text-grey-3 q-mt-sm">
            ChurchAfrica Dashboard
          </p>
        </div>
        <div class="col-auto">
          <div class="row items-center q-gutter-sm">
            <!-- Theme Toggle -->
            <ThemeToggle />
            
            <!-- Logout Button -->
            <q-btn
              @click="handleLogout"
              color="negative"
              icon="logout"
              label="Logout"
              :loading="isLoggingOut"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="dashboard-content q-pa-lg">
      <div class="row q-gutter-lg">
        <!-- User Info Card -->
        <div class="col-12 col-md-6">
          <q-card class="dashboard-card hover-lift stagger-item">
            <q-card-section>
              <div class="text-h6 q-mb-md">
                <q-icon name="person" class="q-mr-sm" />
                Your Profile
              </div>
              <div class="q-gutter-sm">
                <div><strong>Name:</strong> {{ user?.name }}</div>
                <div><strong>Email:</strong> {{ user?.email }}</div>
                <div><strong>Role:</strong> {{ user?.role || 'Member' }}</div>
                <div><strong>Member Since:</strong> {{ formatDate(user?.created_at) }}</div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Quick Actions Card -->
        <div class="col-12 col-md-6">
          <q-card class="dashboard-card hover-lift stagger-item">
            <q-card-section>
              <div class="text-h6 q-mb-md">
                <q-icon name="dashboard" class="q-mr-sm" />
                Quick Actions
              </div>
              <div class="q-gutter-sm">
                <q-btn
                  color="primary"
                  icon="edit"
                  label="Edit Profile"
                  class="full-width"
                  @click="editProfile"
                />
                <q-btn
                  color="secondary"
                  icon="settings"
                  label="Settings"
                  class="full-width"
                  @click="openSettings"
                />
                <q-btn
                  color="info"
                  icon="help"
                  label="Help & Support"
                  class="full-width"
                  @click="openHelp"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- System Status Card -->
        <div class="col-12">
          <q-card class="dashboard-card hover-lift stagger-item">
            <q-card-section>
              <div class="text-h6 q-mb-md">
                <q-icon name="check_circle" class="q-mr-sm" />
                System Status
              </div>
              <div class="row q-gutter-md">
                <div class="col-12 col-sm-6 col-md-3">
                  <q-card flat class="status-card">
                    <q-card-section class="text-center">
                      <q-icon name="cloud_done" size="2em" color="positive" />
                      <div class="text-subtitle2 q-mt-sm">Backend Connected</div>
                      <div class="text-caption text-grey-6">API Status: OK</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-card flat class="status-card">
                    <q-card-section class="text-center">
                      <q-icon name="security" size="2em" color="positive" />
                      <div class="text-subtitle2 q-mt-sm">Authentication</div>
                      <div class="text-caption text-grey-6">Token Valid</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-card flat class="status-card">
                    <q-card-section class="text-center">
                      <q-icon name="database" size="2em" color="positive" />
                      <div class="text-subtitle2 q-mt-sm">Database</div>
                      <div class="text-caption text-grey-6">SQLite Active</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <q-card flat class="status-card">
                    <q-card-section class="text-center">
                      <q-icon name="offline_bolt" size="2em" color="warning" />
                      <div class="text-subtitle2 q-mt-sm">Offline Mode</div>
                      <div class="text-caption text-grey-6">Coming Soon</div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

// Composables
const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

// State
const isLoggingOut = ref(false)

// Computed
const user = computed(() => authStore.user)

// Methods
const handleLogout = async () => {
  try {
    isLoggingOut.value = true
    
    await authStore.logout()
    
    $q.notify({
      type: 'positive',
      message: 'Logged out successfully',
      position: 'top'
    })
    
    router.push('/login')
  } catch (error: any) {
    console.error('Logout error:', error)
    $q.notify({
      type: 'negative',
      message: 'Logout failed. Please try again.',
      position: 'top'
    })
  } finally {
    isLoggingOut.value = false
  }
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const editProfile = () => {
  $q.notify({
    type: 'info',
    message: 'Profile editing coming soon!',
    position: 'top'
  })
}

const openSettings = () => {
  $q.notify({
    type: 'info',
    message: 'Settings panel coming soon!',
    position: 'top'
  })
}

const openHelp = () => {
  $q.notify({
    type: 'info',
    message: 'Help & Support coming soon!',
    position: 'top'
  })
}

// Lifecycle
onMounted(() => {
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
})
</script>

<style lang="sass" scoped>
.dashboard-page
  background: hsl(330, 40%, 10%)
  background-image: radial-gradient(at 0% 0%, hsl(340, 70%, 35%) 0px, transparent 50%), radial-gradient(at 100% 100%, hsl(290, 50%, 30%) 0px, transparent 50%)
  min-height: 100vh

.dashboard-header
  background: rgba(26, 10, 15, 0.8)
  backdrop-filter: blur(10px)
  border-bottom: 1px solid rgba(184, 51, 106, 0.2)

.dashboard-content
  max-width: 1200px
  margin: 0 auto

.dashboard-card
  background: rgba(26, 10, 15, 0.9)
  backdrop-filter: blur(10px)
  border: 1px solid rgba(184, 51, 106, 0.2)
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3)

.status-card
  background: rgba(45, 27, 36, 0.5)
  border: 1px solid rgba(184, 51, 106, 0.1)
  transition: all 0.3s ease
  
  &:hover
    border-color: rgba(184, 51, 106, 0.3)
    transform: translateY(-2px)
</style>