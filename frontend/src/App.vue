<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import OfflineIndicator from '@/components/pwa/OfflineIndicator.vue'
import InstallPrompt from '@/components/pwa/InstallPrompt.vue'

const authStore = useAuthStore()
const themeStore = useThemeStore()

const themeClass = computed(() => themeStore.themeClass)

onMounted(async () => {
  // Initialize theme first for immediate visual feedback
  themeStore.initializeTheme()

  // Initialize authentication on app start with timeout
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Auth initialization timeout')), 10000)
    )

    await Promise.race([authStore.initializeAuth(), timeoutPromise])
  } catch (error) {
    console.warn('Auth initialization failed, continuing without auth:', error)
  }
})
</script>

<template>
  <div id="q-app" :class="themeClass">
    <!-- PWA Offline Indicator -->
    <OfflineIndicator />

    <!-- PWA Install Prompt -->
    <InstallPrompt />

    <!-- Main App Content -->
    <router-view />
  </div>
</template>

<style lang="sass">
// Global styles for ChurchAfrica Garnet Night theme
*
  box-sizing: border-box

html, body
  margin: 0
  padding: 0
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif

#q-app
  min-height: 100vh
  background: #1d1d1d  // Always dark mode

// Custom scrollbar - dark mode only
::-webkit-scrollbar
  width: 8px
  height: 8px

::-webkit-scrollbar-track
  background: rgba(255, 255, 255, 0.05)

::-webkit-scrollbar-thumb
  background: rgba(255, 255, 255, 0.2)
  border-radius: 4px

::-webkit-scrollbar-thumb:hover
  background: rgba(255, 255, 255, 0.3)

// Selection colors - dark mode only
::selection
  background: rgba(25, 118, 210, 0.3)
  color: white

::-moz-selection
  background: rgba(25, 118, 210, 0.3)
  color: white

// Focus outline for accessibility
*:focus
  outline: 2px solid rgba(25, 118, 210, 0.5)
  outline-offset: 2px

// Link styles
a
  color: #1976d2
  text-decoration: none

  &:hover
    color: #1565c0
    text-decoration: underline

// Animation classes
.fade-in
  animation: fadeIn 0.3s ease-in-out

.slide-up
  animation: slideUp 0.3s ease-out

@-webkit-keyframes fadeIn
  from
    opacity: 0
  to
    opacity: 1
@keyframes fadeIn
  from
    opacity: 0
  to
    opacity: 1

@-webkit-keyframes slideUp
  from
    opacity: 0
    transform: translateY(20px)
  to
    opacity: 1
    transform: translateY(0)
@keyframes slideUp
  from
    opacity: 0
    transform: translateY(20px)
  to
    opacity: 1
    transform: translateY(0)

// Responsive utilities
@media (max-width: 600px)
  .hide-on-mobile
    display: none !important

@media (min-width: 601px)
  .show-on-mobile-only
    display: none !important

// Print styles
@media print
  .no-print
    display: none !important

  body
    background: white !important
    color: black !important
</style>
