<template>
  <q-page class="garnet-night-bg flex flex-center">
    <div class="register-container">
      <!-- Logo/Brand Section -->
      <div class="text-center q-mb-xl">
        <div class="brand-logo q-mb-md">
          <q-icon 
            name="church" 
            size="3rem" 
            color="primary"
            class="brand-icon"
          />
        </div>
        <div class="text-h4 text-white brand-title">
          Join ChurchAfrica
        </div>
        <div class="text-subtitle1 text-grey-4 brand-subtitle">
          Create your account to get started
        </div>
      </div>

      <!-- Register Form -->
      <BaseFormCard
        title="Join ChurchAfrica"
        subtitle="Create your account to get started"
      >
        <template #content>
          <q-form @submit="handleRegister" class="q-gutter-md">
            <!-- First Name -->
            <q-input
              v-model="form.first_name"
              label="First Name"
              outlined
              dark
              :rules="nameRules"
              class="garnet-input"
            >
              <template v-slot:prepend>
                <q-icon name="person" color="primary" />
              </template>
            </q-input>

            <!-- Last Name -->
            <q-input
              v-model="form.last_name"
              label="Last Name"
              outlined
              dark
              :rules="nameRules"
              class="garnet-input"
            >
              <template v-slot:prepend>
                <q-icon name="person_outline" color="primary" />
              </template>
            </q-input>

            <!-- Email -->
            <q-input
              v-model="form.email"
              type="email"
              label="Email Address"
              outlined
              dark
              :rules="emailRules"
              class="garnet-input"
            >
              <template v-slot:prepend>
                <q-icon name="email" color="primary" />
              </template>
            </q-input>

            <!-- Password -->
            <q-input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              outlined
              dark
              :rules="passwordRules"
              class="garnet-input"
              @input="updatePasswordStrength"
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="primary" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  color="grey-5"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>

            <!-- Password Requirements Checklist -->
            <div v-if="form.password" class="q-mt-sm q-mb-md q-pa-sm" style="background: rgba(184, 51, 106, 0.1); border-radius: 8px; border-left: 3px solid #B8336A;">
              <div class="text-caption text-weight-medium text-grey-3 q-mb-xs">Password Requirements:</div>
              <div class="text-caption q-gutter-y-xs">
                <div :class="{ 'text-positive': hasMinLength, 'text-grey-5': !hasMinLength }">
                  <q-icon :name="hasMinLength ? 'check_circle' : 'radio_button_unchecked'" size="xs" />
                  At least 12 characters
                </div>
                <div :class="{ 'text-positive': hasUppercase, 'text-grey-5': !hasUppercase }">
                  <q-icon :name="hasUppercase ? 'check_circle' : 'radio_button_unchecked'" size="xs" />
                  One uppercase letter
                </div>
                <div :class="{ 'text-positive': hasLowercase, 'text-grey-5': !hasLowercase }">
                  <q-icon :name="hasLowercase ? 'check_circle' : 'radio_button_unchecked'" size="xs" />
                  One lowercase letter
                </div>
                <div :class="{ 'text-positive': hasNumber, 'text-grey-5': !hasNumber }">
                  <q-icon :name="hasNumber ? 'check_circle' : 'radio_button_unchecked'" size="xs" />
                  One number
                </div>
                <div :class="{ 'text-positive': hasSpecialChar, 'text-grey-5': !hasSpecialChar }">
                  <q-icon :name="hasSpecialChar ? 'check_circle' : 'radio_button_unchecked'" size="xs" />
                  One special character (!@#$%^&*)
                </div>
              </div>
            </div>

            <!-- Password Strength Indicator -->
            <div v-if="form.password" class="q-mb-md">
              <div class="text-caption text-grey-5 q-mb-xs">Password Strength</div>
              <q-linear-progress
                :value="passwordStrength / 100"
                :color="passwordStrengthColor"
                size="8px"
                rounded
              />
              <div class="text-caption q-mt-xs" :class="`text-${passwordStrengthColor}`">
                {{ passwordStrengthLabel }}
              </div>
            </div>

            <!-- Confirm Password -->
            <q-input
              v-model="form.password_confirmation"
              :type="showConfirmPassword ? 'text' : 'password'"
              label="Confirm Password"
              outlined
              dark
              :rules="confirmPasswordRules"
              class="garnet-input"
            >
              <template v-slot:prepend>
                <q-icon name="lock_outline" color="primary" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  color="grey-5"
                  @click="showConfirmPassword = !showConfirmPassword"
                />
              </template>
            </q-input>

            <!-- Register Button -->
            <q-btn
              type="submit"
              label="Create Account"
              color="primary"
              size="lg"
              class="full-width q-mt-md garnet-btn"
              :loading="isLoading"
              :disable="!isFormValid"
            >
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                Creating account...
              </template>
            </q-btn>
          </q-form>
        </template>

        <template #footer>
          <div class="text-grey-5">
            Already have an account?
            <router-link to="/login" class="text-primary text-decoration-none">
              Sign in
            </router-link>
          </div>
        </template>
      </BaseFormCard>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import type { RegisterCredentials } from '@/types/auth'
import BaseFormCard from '@/components/common/BaseFormCard.vue'
import api from '@/services/api'

const router = useRouter()
const $q = useQuasar()

const form = ref<RegisterCredentials>({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)

// Password strength indicators
const hasMinLength = ref(false)
const hasUppercase = ref(false)
const hasLowercase = ref(false)
const hasNumber = ref(false)
const hasSpecialChar = ref(false)
const passwordStrength = ref(0)
const passwordStrengthLabel = ref('')
const passwordStrengthColor = ref('grey')

// Validation rules
const nameRules = [
  (val: string) => !!val || 'This field is required',
  (val: string) => val.length >= 2 || 'Must be at least 2 characters'
]

const emailRules = [
  (val: string) => !!val || 'Email is required',
  (val: string) => /.+@.+\..+/.test(val) || 'Please enter a valid email'
]

// Industry-standard password requirements (NIST/OWASP)
const passwordRules = [
  (val: string) => !!val || 'Password is required',
  (val: string) => val.length >= 12 || 'Password must be at least 12 characters',
  (val: string) => /[A-Z]/.test(val) || 'Must contain at least one uppercase letter',
  (val: string) => /[a-z]/.test(val) || 'Must contain at least one lowercase letter',
  (val: string) => /\d/.test(val) || 'Must contain at least one number',
  (val: string) => /[!@#$%^&*(),.?":{}|<>]/.test(val) || 'Must contain at least one special character (!@#$%^&*)'
]

const confirmPasswordRules = [
  (val: string) => !!val || 'Please confirm your password',
  (val: string) => val === form.value.password || 'Passwords do not match'
]

// Update password strength indicators
const updatePasswordStrength = () => {
  const password = form.value.password

  hasMinLength.value = password.length >= 12
  hasUppercase.value = /[A-Z]/.test(password)
  hasLowercase.value = /[a-z]/.test(password)
  hasNumber.value = /\d/.test(password)
  hasSpecialChar.value = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  // Calculate strength (0-100)
  let strength = 0
  if (hasMinLength.value) strength += 20
  if (hasUppercase.value) strength += 20
  if (hasLowercase.value) strength += 20
  if (hasNumber.value) strength += 20
  if (hasSpecialChar.value) strength += 20

  passwordStrength.value = strength

  // Set label and color
  if (strength === 0) {
    passwordStrengthLabel.value = ''
    passwordStrengthColor.value = 'grey'
  } else if (strength <= 40) {
    passwordStrengthLabel.value = 'Weak'
    passwordStrengthColor.value = 'negative'
  } else if (strength <= 60) {
    passwordStrengthLabel.value = 'Fair'
    passwordStrengthColor.value = 'warning'
  } else if (strength <= 80) {
    passwordStrengthLabel.value = 'Good'
    passwordStrengthColor.value = 'info'
  } else {
    passwordStrengthLabel.value = 'Strong'
    passwordStrengthColor.value = 'positive'
  }
}

// Watch password field and update strength indicators in real-time
watch(() => form.value.password, () => {
  updatePasswordStrength()
})

const isFormValid = computed(() => {
  return form.value.first_name &&
         form.value.last_name &&
         form.value.email &&
         form.value.password &&
         form.value.password_confirmation &&
         form.value.password === form.value.password_confirmation &&
         /.+@.+\..+/.test(form.value.email) &&
         passwordStrength.value === 100 // All password requirements met
})

const handleRegister = async () => {
  try {
    isLoading.value = true

    // Call backend API to register user
    const response = await api.post('/auth/register', form.value)

    $q.notify({
      type: 'positive',
      message: response.data.message || 'Registration successful! Please check your email to verify your account.',
      position: 'top',
      timeout: 5000
    })

    // Redirect to login page
    router.push('/login')
  } catch (error: any) {
    console.error('Registration error:', error)

    const errorMessage = error.response?.data?.message ||
                        error.response?.data?.errors?.email?.[0] ||
                        'Registration failed. Please try again.'

    $q.notify({
      type: 'negative',
      message: errorMessage,
      position: 'top',
      timeout: 5000
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="sass" scoped>
.garnet-night-bg
  background: hsl(330, 40%, 10%)
  background-image: radial-gradient(at 0% 0%, hsl(340, 70%, 35%) 0px, transparent 50%), radial-gradient(at 100% 100%, hsl(290, 50%, 30%) 0px, transparent 50%)
  min-height: 100vh
  padding: 2rem 1rem

.register-container
  width: 100%
  max-width: 500px
  margin: 0 auto
  display: flex
  flex-direction: column
  align-items: center

.brand-icon
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))
  
.brand-title
  font-weight: 700
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5)
  
.brand-subtitle
  font-weight: 400
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3)
</style>
