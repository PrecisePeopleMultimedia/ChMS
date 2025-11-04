<template>
  <q-page class="garnet-night-bg flex flex-center min-h-screen">
    <div class="login-container">
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
          ChurchAfrica
        </div>
        <div class="text-subtitle1 text-grey-4 brand-subtitle">
          Sign in to your account
        </div>
      </div>

      <!-- Login Form -->
      <LoginForm />

      <!-- Footer -->
      <div class="text-center q-mt-xl">
        <div class="text-grey-6 text-caption">
          © 2025 ChurchAfrica. Built for African churches.
        </div>
        <div class="text-grey-7 text-caption q-mt-xs">
          Offline-first • Mobile-optimized • Secure
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginForm from '@/components/auth/LoginForm.vue'

const router = useRouter()
const authStore = useAuthStore()

// Redirect if already authenticated
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})
</script>

<style lang="sass" scoped>
.garnet-night-bg
  background: hsl(330, 40%, 10%)
  background-image: radial-gradient(at 0% 0%, hsl(340, 70%, 35%) 0px, transparent 50%), radial-gradient(at 100% 100%, hsl(290, 50%, 30%) 0px, transparent 50%)
  min-height: 100vh
  padding: 2rem 1rem

.login-container
  width: 100%
  max-width: 500px
  margin: 0 auto
  display: flex
  flex-direction: column
  align-items: center

.brand-logo
  position: relative

.brand-icon
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))

.brand-title
  font-weight: 700
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5)

.brand-subtitle
  font-weight: 400
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3)

/* Responsive design */
@media (max-width: 640px)
  .garnet-night-bg
    padding: 1.5rem 1rem

  .brand-title
    font-size: 1.5rem

  .brand-subtitle
    font-size: 0.875rem
</style>
