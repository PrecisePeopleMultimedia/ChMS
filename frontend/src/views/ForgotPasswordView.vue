<template>
  <q-page class="garnet-night-bg flex flex-center">
    <div class="forgot-password-container">
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
          Reset Password
        </div>
        <div class="text-subtitle1 text-grey-4 brand-subtitle">
          Enter your email to receive reset instructions
        </div>
      </div>

      <!-- Forgot Password Form -->
      <q-card 
        class="forgot-password-card q-pa-lg"
        style="min-width: 400px; max-width: 500px; background: rgba(26, 10, 15, 0.95); backdrop-filter: blur(10px);"
      >
        <q-card-section>
          <q-form @submit="handleForgotPassword" class="q-gutter-md">
            <!-- Email Field -->
            <q-input
              v-model="email"
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

            <!-- Submit Button -->
            <q-btn
              type="submit"
              label="Send Reset Instructions"
              color="primary"
              size="lg"
              class="full-width q-mt-md garnet-btn"
              :loading="isLoading"
              :disable="!isFormValid"
            >
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                Sending...
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
          <div class="text-grey-5 q-mt-sm">
            Don't have an account?
            <router-link to="/register" class="text-primary text-decoration-none">
              Sign up
            </router-link>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const email = ref('')
const isLoading = ref(false)

// Validation rules
const emailRules = [
  (val: string) => !!val || 'Email is required',
  (val: string) => /.+@.+\..+/.test(val) || 'Please enter a valid email'
]

const isFormValid = computed(() => {
  return email.value && /.+@.+\..+/.test(email.value)
})

const handleForgotPassword = async () => {
  try {
    isLoading.value = true
    
    // Simulate password reset request (backend not ready yet)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    $q.notify({
      type: 'positive',
      message: 'Password reset instructions sent to your email!',
      position: 'top'
    })
    
    router.push('/login')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to send reset instructions. Please try again.',
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

.forgot-password-container
  width: 100%
  max-width: 500px
  margin: 0 auto

.forgot-password-card
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

.brand-icon
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))
  
.brand-title
  font-weight: 700
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5)
  
.brand-subtitle
  font-weight: 400
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3)
</style>
