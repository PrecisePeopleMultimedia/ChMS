<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

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
  transition: background 0.3s ease

  // Light mode - Clean Quasar style
  &:not(.dark)
    background: #fafafa

  // Dark mode - Clean Quasar style
  &.dark
    background: #1d1d1d

// Custom scrollbar - adaptive to theme
::-webkit-scrollbar
  width: 8px
  height: 8px

::-webkit-scrollbar-track
  background: rgba(0, 0, 0, 0.05)

.dark ::-webkit-scrollbar-track
  background: rgba(255, 255, 255, 0.05)

::-webkit-scrollbar-thumb
  background: rgba(0, 0, 0, 0.2)
  border-radius: 4px

.dark ::-webkit-scrollbar-thumb
  background: rgba(255, 255, 255, 0.2)

::-webkit-scrollbar-thumb:hover
  background: rgba(0, 0, 0, 0.3)

.dark ::-webkit-scrollbar-thumb:hover
  background: rgba(255, 255, 255, 0.3)

// Selection colors - clean theme
::selection
  background: rgba(25, 118, 210, 0.2)
  color: inherit

.dark ::selection
  background: rgba(25, 118, 210, 0.3)
  color: white

::-moz-selection
  background: rgba(25, 118, 210, 0.2)
  color: inherit

.dark ::-moz-selection
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

@keyframes fadeIn
  from
    opacity: 0
  to
    opacity: 1

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
