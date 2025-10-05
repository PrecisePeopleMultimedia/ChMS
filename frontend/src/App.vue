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

  // Light mode - Clean and professional
  &:not(.dark)
    background: hsl(0, 0%, 98%)
    background-image: radial-gradient(at 0% 0%, hsl(330, 30%, 95%) 0px, transparent 50%), radial-gradient(at 100% 100%, hsl(330, 20%, 92%) 0px, transparent 50%)

  // Dark mode - Original Garnet Night theme
  &.dark
    background: hsl(330, 40%, 8%)
    background-image: radial-gradient(at 0% 0%, hsl(340, 70%, 35%) 0px, transparent 50%), radial-gradient(at 100% 100%, hsl(290, 50%, 30%) 0px, transparent 50%)

// Custom scrollbar - adaptive to theme
::-webkit-scrollbar
  width: 8px
  height: 8px

::-webkit-scrollbar-track
  background: rgba(0, 0, 0, 0.1)

.dark ::-webkit-scrollbar-track
  background: rgba(26, 10, 15, 0.5)

::-webkit-scrollbar-thumb
  background: rgba(184, 51, 106, 0.3)
  border-radius: 4px

.dark ::-webkit-scrollbar-thumb
  background: rgba(184, 51, 106, 0.5)

::-webkit-scrollbar-thumb:hover
  background: rgba(184, 51, 106, 0.5)

.dark ::-webkit-scrollbar-thumb:hover
  background: rgba(184, 51, 106, 0.7)

// Selection colors - adaptive to theme
::selection
  background: rgba(184, 51, 106, 0.2)
  color: inherit

.dark ::selection
  background: rgba(184, 51, 106, 0.3)
  color: white

::-moz-selection
  background: rgba(184, 51, 106, 0.2)
  color: inherit

.dark ::-moz-selection
  background: rgba(184, 51, 106, 0.3)
  color: white

// Focus outline for accessibility
*:focus
  outline: 2px solid rgba(184, 51, 106, 0.5)
  outline-offset: 2px

// Link styles
a
  color: #B8336A
  text-decoration: none

  &:hover
    color: #D4477A
    text-decoration: underline

// Utility classes
.text-garnet
  color: #B8336A !important

.bg-garnet
  background-color: #B8336A !important

.border-garnet
  border-color: #B8336A !important

.garnet-gradient
  background: linear-gradient(135deg, #8B1538 0%, #B8336A 100%) !important

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
