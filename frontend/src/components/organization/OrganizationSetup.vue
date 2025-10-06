<template>
  <div class="organization-setup">
    <q-card class="setup-card">
      <q-card-section class="text-center q-pb-none">
        <div class="text-h4 text-weight-bold q-mb-md">
          Welcome to ChurchAfrica
        </div>
        <div class="text-subtitle1 text-grey-6 q-mb-lg">
          Let's set up your church profile to get started
        </div>
      </q-card-section>

      <!-- Progress Stepper -->
      <q-card-section class="q-pt-none">
        <q-stepper
          v-model="currentStep"
          ref="stepper"
          color="primary"
          animated
          flat
          bordered
          class="setup-stepper"
        >
          <!-- Step 1: Church Profile -->
          <q-step
            :name="1"
            title="Church Profile"
            icon="church"
            :done="currentStep > 1"
            :header-nav="currentStep > 1"
          >
            <ChurchProfileForm
              v-model="organizationData"
              :loading="isLoading"
              :errors="formErrors"
              @submit="handleProfileSubmit"
            />
          </q-step>

          <!-- Step 2: Service Schedules -->
          <q-step
            :name="2"
            title="Service Times"
            icon="schedule"
            :done="currentStep > 2"
            :header-nav="currentStep > 2"
          >
            <ServiceScheduleForm
              v-model="serviceSchedules"
              :loading="isLoading"
              :errors="formErrors"
              @submit="handleScheduleSubmit"
            />
          </q-step>

          <!-- Step 3: Settings & Preferences -->
          <q-step
            :name="3"
            title="Settings"
            icon="settings"
            :done="currentStep > 3"
            :header-nav="currentStep > 3"
          >
            <SettingsForm
              v-model="settingsData"
              :loading="isLoading"
              :errors="formErrors"
              @submit="handleSettingsSubmit"
            />
          </q-step>

          <!-- Step 4: Complete -->
          <q-step
            :name="4"
            title="Complete"
            icon="check_circle"
            :done="setupComplete"
          >
            <div class="text-center q-py-xl">
              <q-icon
                name="check_circle"
                size="4rem"
                color="positive"
                class="q-mb-md"
              />
              <div class="text-h5 text-weight-bold q-mb-md">
                Setup Complete!
              </div>
              <div class="text-body1 text-grey-6 q-mb-lg">
                Your church profile has been successfully configured.
                You can now start using ChurchAfrica to manage your church.
              </div>
              <q-btn
                color="primary"
                size="lg"
                label="Go to Dashboard"
                @click="goToDashboard"
                :loading="isLoading"
              />
            </div>
          </q-step>

          <!-- Navigation -->
          <template v-slot:navigation>
            <q-stepper-navigation class="row justify-between">
              <q-btn
                v-if="currentStep > 1 && currentStep < 4"
                flat
                color="primary"
                label="Back"
                @click="previousStep"
                :disable="isLoading"
              />
              <q-space />
              <q-btn
                v-if="currentStep < 3"
                color="primary"
                label="Next"
                @click="nextStep"
                :loading="isLoading"
                :disable="!canProceed"
              />
              <q-btn
                v-if="currentStep === 3"
                color="primary"
                label="Complete Setup"
                @click="completeSetup"
                :loading="isLoading"
              />
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </q-card-section>
    </q-card>

    <!-- Offline Notice -->
    <q-banner
      v-if="!isOnline"
      class="bg-warning text-dark q-mt-md"
      rounded
    >
      <template v-slot:avatar>
        <q-icon name="wifi_off" />
      </template>
      You're currently offline. Your setup will be saved locally and synced when you're back online.
    </q-banner>

    <!-- Error Display -->
    <q-banner
      v-if="error"
      class="bg-negative text-white q-mt-md"
      rounded
      dismissible
      @dismiss="clearError"
    >
      <template v-slot:avatar>
        <q-icon name="error" />
      </template>
      {{ error }}
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useOrganizationStore } from '@/stores/organization'
import { useAuthStore } from '@/stores/auth'
import ChurchProfileForm from './ChurchProfileForm.vue'
import ServiceScheduleForm from './ServiceScheduleForm.vue'
import SettingsForm from './SettingsForm.vue'

// Composables
const router = useRouter()
const $q = useQuasar()
const organizationStore = useOrganizationStore()
const authStore = useAuthStore()

// State
const currentStep = ref(1)
const setupComplete = ref(false)
const formErrors = ref<Record<string, string[]>>({})

// Form data
const organizationData = ref({
  name: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  description: '',
  timezone: 'Africa/Lagos'
})

const serviceSchedules = ref([
  {
    name: 'Sunday Service',
    day_of_week: 0,
    start_time: '09:00',
    end_time: '11:00',
    is_active: true
  }
])

const settingsData = ref({
  welcome_message: '',
  contact_person: '',
  emergency_contact: '',
  social_media_facebook: '',
  social_media_twitter: '',
  social_media_instagram: ''
})

// Computed
const isLoading = computed(() => organizationStore.isLoading)
const error = computed(() => organizationStore.error)
const isOnline = computed(() => navigator.onLine)

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return organizationData.value.name.trim().length > 0
    case 2:
      return serviceSchedules.value.length > 0
    case 3:
      return true
    default:
      return false
  }
})

// Methods
const clearError = () => {
  organizationStore.clearError()
  formErrors.value = {}
}

const nextStep = () => {
  if (canProceed.value && currentStep.value < 4) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleProfileSubmit = async () => {
  try {
    clearError()
    await organizationStore.createOrganization(organizationData.value)
    nextStep()
  } catch (err: any) {
    if (err.response?.data?.errors) {
      formErrors.value = err.response.data.errors
    }
  }
}

const handleScheduleSubmit = async () => {
  try {
    clearError()
    // Create service schedules
    for (const schedule of serviceSchedules.value) {
      await organizationStore.createServiceSchedule(schedule)
    }
    nextStep()
  } catch (err: any) {
    if (err.response?.data?.errors) {
      formErrors.value = err.response.data.errors
    }
  }
}

const handleSettingsSubmit = async () => {
  try {
    clearError()
    await organizationStore.updateSettings(settingsData.value)
    nextStep()
  } catch (err: any) {
    if (err.response?.data?.errors) {
      formErrors.value = err.response.data.errors
    }
  }
}

const completeSetup = async () => {
  try {
    clearError()
    
    // Save settings if not already saved
    if (currentStep.value === 3) {
      await organizationStore.updateSettings(settingsData.value)
    }
    
    setupComplete.value = true
    currentStep.value = 4
    
    $q.notify({
      type: 'positive',
      message: 'Church setup completed successfully!',
      position: 'top'
    })
  } catch (err: any) {
    console.error('Setup completion error:', err)
  }
}

const goToDashboard = () => {
  router.push('/dashboard')
}

// Lifecycle
onMounted(() => {
  // Check if organization already exists
  organizationStore.fetchOrganization().then((org) => {
    if (org) {
      // Organization exists, redirect to dashboard
      router.push('/dashboard')
    }
  })
})
</script>

<style lang="sass" scoped>
.organization-setup
  max-width: 800px
  margin: 0 auto
  padding: 2rem 1rem

.setup-card
  border-radius: 12px
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)

.setup-stepper
  .q-stepper__header
    border-radius: 8px

  .q-stepper__content
    padding: 2rem 1rem

@media (max-width: 600px)
  .organization-setup
    padding: 1rem 0.5rem

  .setup-stepper
    .q-stepper__content
      padding: 1rem 0.5rem
</style>
