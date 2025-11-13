<template>
  <div class="reset-password-page garnet-night-bg flex flex-center">
    <div class="reset-password-container">
      <!-- Logo/Brand Section -->
      <div class="text-center q-mb-xl">
        <div class="brand-logo q-mb-md">
          <q-icon 
            name="lock_reset" 
            size="3rem" 
            color="primary"
            class="brand-icon"
          />
        </div>
        <div class="text-h4 text-white brand-title">
          Reset Your Password
        </div>
        <div class="text-subtitle1 text-grey-4 brand-subtitle">
          Enter your new password below
        </div>
      </div>

      <!-- Reset Password Form -->
      <q-card 
        class="reset-password-card q-pa-lg"
        style="min-width: 400px; max-width: 500px; background: rgba(26, 10, 15, 0.95); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);"
      >
        <q-card-section>
          <q-form @submit="handleResetPassword" class="q-gutter-md">
            <!-- Email Field (readonly) -->
            <q-input
              v-model="email"
              type="email"
              label="Email Address"
              outlined
              dark
              readonly
              class="garnet-input"
            >
              <template v-slot:prepend>
                <q-icon name="email" color="primary" />
              </template>
            </q-input>

            <!-- Password Field -->
            <q-input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="New Password"
              outlined
              dark
              :rules="passwordRules"
              class="garnet-input"
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="primary" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>

            <!-- Confirm Password Field -->
            <q-input
              v-model="passwordConfirmation"
              :type="showPasswordConfirmation ? 'text' : 'password'"
              label="Confirm New Password"
              outlined
              dark
              :rules="passwordConfirmationRules"
              class="garnet-input"
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="primary" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showPasswordConfirmation ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPasswordConfirmation = !showPasswordConfirmation"
                />
              </template>
            </q-input>

            <!-- Password Requirements -->
            <div class="password-requirements q-mb-md">
              <div class="text-caption text-grey-5 q-mb-sm">Password must contain:</div>
              <div class="requirement-item" :class="{ 'text-positive': hasMinLength }">
                <q-icon :name="hasMinLength ? 'check_circle' : 'radio_button_unchecked'" size="xs" />
                At least 8 characters
              </div>
              <div class="requirement-item" :class="{ 'text-positive': hasUppercase }">
                <q-icon :name="hasUppercase ? 'check_circle' : 'radio_button_unchecked'" size="xs" />
                One uppercase letter
              </div>
              <div class="requirement-item" :class="{ 'text-positive': hasLowercase }">
                <q-icon :name="hasLowercase ? 'check_circle' : 'radio_button_unchecked'" size="xs" />
                One lowercase letter
              </div>
              <div class="requirement-item" :class="{ 'text-positive': hasNumber }">
                <q-icon :name="hasNumber ? 'check_circle' : 'radio_button_unchecked'" size="xs" />
                One number
              </div>
            </div>

            <!-- Submit Button -->
            <q-btn
              type="submit"
              label="Reset Password"
              color="primary"
              size="lg"
              class="full-width q-mt-md garnet-btn"
              :loading="isLoading"
              :disable="!isFormValid"
            >
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                Resetting...
              </template>
            </q-btn>
          </q-form>
        </q-card-section>

        <!-- Footer Links -->
        <q-card-section class="text-center q-pt-lg">
          <div class="text-grey-5">
            Remember your password?
            <router-link to="/login" class="text-primary text-decoration-none">
              Sign in
            </router-link>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const token = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)

// Password validation
const hasMinLength = computed(() => password.value.length >= 8)
const hasUppercase = computed(() => /[A-Z]/.test(password.value))
const hasLowercase = computed(() => /[a-z]/.test(password.value))
const hasNumber = computed(() => /\d/.test(password.value))

const isPasswordValid = computed(() => {
  return hasMinLength.value && hasUppercase.value && hasLowercase.value && hasNumber.value
})

const isFormValid = computed(() => {
  return isPasswordValid.value && password.value === passwordConfirmation.value
})

// Validation rules
const passwordRules = [
  (val: string) => !!val || 'Password is required',
  (val: string) => val.length >= 8 || 'Password must be at least 8 characters',
  (val: string) => /[A-Z]/.test(val) || 'Password must contain at least one uppercase letter',
  (val: string) => /[a-z]/.test(val) || 'Password must contain at least one lowercase letter',
  (val: string) => /\d/.test(val) || 'Password must contain at least one number'
]

const passwordConfirmationRules = [
  (val: string) => !!val || 'Password confirmation is required',
  (val: string) => val === password.value || 'Passwords do not match'
]

onMounted(() => {
  // Get token and email from URL parameters
  token.value = route.query.token as string
  email.value = route.query.email as string

  if (!token.value || !email.value) {
    $q.notify({
      type: 'negative',
      message: 'Invalid or missing reset token. Please request a new password reset.',
      position: 'top'
    })
    router.push('/forgot-password')
  }
})

const handleResetPassword = async () => {
  try {
    isLoading.value = true
    
    // Call the backend API
    const response = await axios.post('/api/auth/reset-password', {
      email: email.value,
      token: token.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    })
    
    $q.notify({
      type: 'positive',
      message: response.data.message || 'Password reset successfully! Please login with your new password.',
      position: 'top'
    })
    
    router.push('/login')
  } catch (error: any) {
    console.error('Password reset error:', error)
    
    let errorMessage = 'Failed to reset password. Please try again.'
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      if (errors.password) {
        errorMessage = errors.password[0]
      } else if (errors.token) {
        errorMessage = errors.token[0]
      } else if (errors.email) {
        errorMessage = errors.email[0]
      }
    }
    
    $q.notify({
      type: 'negative',
      message: errorMessage,
      position: 'top'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="sass" scoped>
.reset-password-page
  min-height: 100vh
  display: -ms-flexbox
  display: flex
  align-items: center
  justify-content: center
  padding: 2rem 1rem

.garnet-night-bg
  background: hsl(330, 40%, 10%)
  background-image: radial-gradient(at 0% 0%, hsl(340, 70%, 35%) 0px, transparent 50%), radial-gradient(at 100% 100%, hsl(290, 50%, 30%) 0px, transparent 50%)
  min-height: 100vh
  padding: 2rem 1rem

.reset-password-container
  width: 100%
  max-width: 500px
  margin: 0 auto

.reset-password-card
  border: 1px solid rgba(184, 51, 106, 0.2)
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3)

// DO NOT add borders to .q-field__control - Quasar's outlined prop handles borders
// This was causing double borders
.garnet-input
  // Quasar's outlined inputs use .q-field__outline for borders, not .q-field__control
  &.q-field--outlined
    .q-field__outline
      border-color: rgba(184, 51, 106, 0.3)

    &:hover .q-field__outline
      border-color: rgba(184, 51, 106, 0.5)

    &.q-field--focused .q-field__outline
      border-color: #B8336A
      box-shadow: 0 0 0 1px rgba(184, 51, 106, 0.3)

.garnet-btn
  background: linear-gradient(135deg, #8B1538 0%, #B8336A 100%)
  border: none
  
  &:hover
    background: linear-gradient(135deg, #A01B42 0%, #C93D74 100%)

.brand-icon
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))
  
.brand-title
  font-weight: 700
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5)
  
.brand-subtitle
  font-weight: 400
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3)

.password-requirements
  background: rgba(45, 27, 36, 0.3)
  border-radius: 8px
  padding: 12px
  border: 1px solid rgba(184, 51, 106, 0.2)

.requirement-item
  display: flex
  align-items: center
  gap: 8px
  margin-bottom: 4px
  font-size: 12px
  color: #999
  
  &:last-child
    margin-bottom: 0
</style>
