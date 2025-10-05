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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import type { RegisterCredentials } from '@/types/auth'
import BaseFormCard from '@/components/common/BaseFormCard.vue'

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

// Validation rules
const nameRules = [
  (val: string) => !!val || 'This field is required',
  (val: string) => val.length >= 2 || 'Must be at least 2 characters'
]

const emailRules = [
  (val: string) => !!val || 'Email is required',
  (val: string) => /.+@.+\..+/.test(val) || 'Please enter a valid email'
]

const passwordRules = [
  (val: string) => !!val || 'Password is required',
  (val: string) => val.length >= 8 || 'Password must be at least 8 characters'
]

const confirmPasswordRules = [
  (val: string) => !!val || 'Please confirm your password',
  (val: string) => val === form.value.password || 'Passwords do not match'
]

const isFormValid = computed(() => {
  return form.value.first_name &&
         form.value.last_name &&
         form.value.email &&
         form.value.password &&
         form.value.password_confirmation &&
         form.value.password === form.value.password_confirmation &&
         /.+@.+\..+/.test(form.value.email) &&
         form.value.password.length >= 8
})

const handleRegister = async () => {
  try {
    isLoading.value = true
    
    // Simulate registration (backend not ready yet)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    $q.notify({
      type: 'positive',
      message: 'Account created successfully! Please sign in.',
      position: 'top'
    })
    
    router.push('/login')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Registration failed. Please try again.',
      position: 'top'
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
