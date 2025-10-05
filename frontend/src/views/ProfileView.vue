<template>
  <q-page class="garnet-night-bg q-pa-md">
    <div class="profile-container">
      <!-- Header -->
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <div class="text-h4 text-white">
            Profile Settings
          </div>
          <div class="text-subtitle1 text-grey-4">
            Manage your account information
          </div>
        </div>
        <div>
          <q-btn
            @click="$router.push('/dashboard')"
            outline
            color="primary"
            icon="arrow_back"
            label="Back to Dashboard"
          />
        </div>
      </div>

      <!-- Profile Form -->
      <q-card class="garnet-card">
        <q-card-section>
          <div class="text-h6 text-white q-mb-md">
            <q-icon name="person" class="q-mr-sm" />
            Personal Information
          </div>
          
          <q-form class="q-gutter-md">
            <div class="row q-gutter-md">
              <div class="col-md-6 col-12">
                <q-input
                  v-model="profileForm.first_name"
                  label="First Name"
                  outlined
                  dark
                  class="garnet-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" color="primary" />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-12">
                <q-input
                  v-model="profileForm.last_name"
                  label="Last Name"
                  outlined
                  dark
                  class="garnet-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="person_outline" color="primary" />
                  </template>
                </q-input>
              </div>
            </div>

            <q-input
              v-model="profileForm.email"
              type="email"
              label="Email Address"
              outlined
              dark
              class="garnet-input"
            >
              <template v-slot:prepend>
                <q-icon name="email" color="primary" />
              </template>
            </q-input>

            <q-input
              v-model="profileForm.phone"
              label="Phone Number"
              outlined
              dark
              class="garnet-input"
            >
              <template v-slot:prepend>
                <q-icon name="phone" color="primary" />
              </template>
            </q-input>

            <div class="row justify-end q-mt-lg">
              <q-btn
                @click="updateProfile"
                color="primary"
                label="Update Profile"
                :loading="isUpdating"
                class="garnet-btn"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>

      <!-- Change Password -->
      <q-card class="garnet-card q-mt-lg">
        <q-card-section>
          <div class="text-h6 text-white q-mb-md">
            <q-icon name="lock" class="q-mr-sm" />
            Change Password
          </div>
          
          <q-form class="q-gutter-md">
            <q-input
              v-model="passwordForm.current_password"
              type="password"
              label="Current Password"
              outlined
              dark
              class="garnet-input"
            >
              <template v-slot:prepend>
                <q-icon name="lock_open" color="primary" />
              </template>
            </q-input>

            <q-input
              v-model="passwordForm.password"
              type="password"
              label="New Password"
              outlined
              dark
              class="garnet-input"
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="primary" />
              </template>
            </q-input>

            <q-input
              v-model="passwordForm.password_confirmation"
              type="password"
              label="Confirm New Password"
              outlined
              dark
              class="garnet-input"
            >
              <template v-slot:prepend>
                <q-icon name="lock_outline" color="primary" />
              </template>
            </q-input>

            <div class="row justify-end q-mt-lg">
              <q-btn
                @click="changePassword"
                color="primary"
                label="Change Password"
                :loading="isChangingPassword"
                class="garnet-btn"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'
import type { UpdateProfileData, ChangePasswordData } from '@/types/auth'

const $q = useQuasar()
const authStore = useAuthStore()

const profileForm = ref<UpdateProfileData>({
  first_name: '',
  last_name: '',
  email: '',
  phone: ''
})

const passwordForm = ref<ChangePasswordData>({
  current_password: '',
  password: '',
  password_confirmation: ''
})

const isUpdating = ref(false)
const isChangingPassword = ref(false)

const updateProfile = async () => {
  try {
    isUpdating.value = true
    
    // Simulate profile update (backend not ready yet)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    $q.notify({
      type: 'positive',
      message: 'Profile updated successfully!',
      position: 'top'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to update profile',
      position: 'top'
    })
  } finally {
    isUpdating.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.password !== passwordForm.value.password_confirmation) {
    $q.notify({
      type: 'negative',
      message: 'Passwords do not match',
      position: 'top'
    })
    return
  }

  try {
    isChangingPassword.value = true
    
    // Simulate password change (backend not ready yet)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    $q.notify({
      type: 'positive',
      message: 'Password changed successfully!',
      position: 'top'
    })
    
    // Clear form
    passwordForm.value = {
      current_password: '',
      password: '',
      password_confirmation: ''
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to change password',
      position: 'top'
    })
  } finally {
    isChangingPassword.value = false
  }
}

onMounted(() => {
  // Load current user data
  if (authStore.user) {
    profileForm.value = {
      first_name: authStore.user.first_name,
      last_name: authStore.user.last_name,
      email: authStore.user.email,
      phone: authStore.user.phone || ''
    }
  }
})
</script>

<style lang="sass" scoped>
.garnet-night-bg
  background: hsl(330, 40%, 10%)
  background-image: radial-gradient(at 0% 0%, hsl(340, 70%, 35%) 0px, transparent 50%), radial-gradient(at 100% 100%, hsl(290, 50%, 30%) 0px, transparent 50%)
  min-height: 100vh

.profile-container
  max-width: 800px
  margin: 0 auto

.garnet-card
  background: rgba(26, 10, 15, 0.95)
  backdrop-filter: blur(10px)
  border: 1px solid rgba(184, 51, 106, 0.2)
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3)

.garnet-input
  .q-field__control
    background: rgba(45, 27, 36, 0.5)
    border-color: rgba(184, 51, 106, 0.3)
    
  .q-field__control:hover
    border-color: rgba(184, 51, 106, 0.5)
    
  .q-field--focused .q-field__control
    border-color: #B8336A
    box-shadow: 0 0 0 1px rgba(184, 51, 106, 0.3)

.garnet-btn
  background: linear-gradient(135deg, #8B1538 0%, #B8336A 100%)
  border: none
  
  &:hover
    background: linear-gradient(135deg, #A01B42 0%, #C93D74 100%)
</style>
