<template>
  <q-page class="garnet-night-bg flex flex-center">
    <div class="not-found-container text-center">
      <!-- 404 Icon -->
      <div class="q-mb-xl">
        <q-icon 
          name="error_outline" 
          size="8rem" 
          color="primary"
          class="not-found-icon"
        />
      </div>

      <!-- Error Message -->
      <div class="text-h2 text-white q-mb-md error-title">
        404
      </div>
      <div class="text-h5 text-grey-3 q-mb-md">
        Page Not Found
      </div>
      <div class="text-body1 text-grey-5 q-mb-xl max-width-400">
        The page you're looking for doesn't exist or has been moved.
        Let's get you back on track.
      </div>

      <!-- Action Buttons -->
      <div class="q-gutter-md">
        <q-btn
          @click="goHome"
          color="primary"
          size="lg"
          label="Go Home"
          icon="home"
          class="garnet-btn"
        />
        <q-btn
          @click="goBack"
          outline
          color="primary"
          size="lg"
          label="Go Back"
          icon="arrow_back"
        />
      </div>

      <!-- Quick Links -->
      <div class="q-mt-xl">
        <div class="text-subtitle2 text-grey-4 q-mb-md">
          Quick Links
        </div>
        <div class="row justify-center q-gutter-sm">
          <q-chip
            @click="$router.push('/dashboard')"
            clickable
            color="primary"
            text-color="white"
            icon="dashboard"
            label="Dashboard"
          />
          <q-chip
            @click="$router.push('/login')"
            clickable
            color="primary"
            text-color="white"
            icon="login"
            label="Login"
          />
          <q-chip
            @click="$router.push('/register')"
            clickable
            color="primary"
            text-color="white"
            icon="person_add"
            label="Register"
          />
        </div>
      </div>

      <!-- Footer -->
      <div class="q-mt-xl text-grey-6 text-caption">
        © 2025 ChurchAfrica. Built for African churches.
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>

<style lang="sass" scoped>
.garnet-night-bg
  background: hsl(330, 40%, 10%)
  background-image: radial-gradient(at 0% 0%, hsl(340, 70%, 35%) 0px, transparent 50%), radial-gradient(at 100% 100%, hsl(290, 50%, 30%) 0px, transparent 50%)
  min-height: 100vh
  padding: 2rem 1rem

.not-found-container
  max-width: 600px
  margin: 0 auto

.not-found-icon
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))
  animation: pulse 2s infinite

.error-title
  font-weight: 900
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5)
  background: linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)
  -webkit-background-clip: text
  -webkit-text-fill-color: transparent
  background-clip: text

.max-width-400
  max-width: 400px
  margin: 0 auto

.garnet-btn
  background: linear-gradient(135deg, #8B1538 0%, #B8336A 100%)
  border: none
  
  &:hover
    background: linear-gradient(135deg, #A01B42 0%, #C93D74 100%)

@keyframes pulse
  0%
    transform: scale(1)
    opacity: 1
  50%
    transform: scale(1.05)
    opacity: 0.8
  100%
    transform: scale(1)
    opacity: 1

// Responsive design
@media (max-width: 600px)
  .error-title
    font-size: 3rem
    
  .not-found-icon
    font-size: 6rem !important
</style>
