<template>
  <nav 
    class="skip-links" 
    aria-label="Skip navigation links"
    :class="{ 'skip-links--visible': visible }"
  >
    <a 
      href="#main-content" 
      class="skip-link"
      @click="skipToMain"
      @keydown.enter="skipToMain"
    >
      Skip to main content
    </a>
    <a 
      href="#main-navigation" 
      class="skip-link"
      @click="skipToNavigation"
      @keydown.enter="skipToNavigation"
    >
      Skip to navigation
    </a>
    <a 
      href="#search" 
      class="skip-link"
      @click="skipToSearch"
      @keydown.enter="skipToSearch"
      v-if="hasSearch"
    >
      Skip to search
    </a>
  </nav>
</template>

<script setup lang="ts">
import { useAccessibility } from '@/composables/useAccessibility'

interface Props {
  visible?: boolean
  hasSearch?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  hasSearch: false
})

const { focusElement, announceToScreenReader } = useAccessibility()

function skipToMain(event: Event) {
  event.preventDefault()
  focusElement('#main-content')
  announceToScreenReader('Skipped to main content')
}

function skipToNavigation(event: Event) {
  event.preventDefault()
  focusElement('#main-navigation')
  announceToScreenReader('Skipped to navigation')
}

function skipToSearch(event: Event) {
  event.preventDefault()
  focusElement('#search')
  announceToScreenReader('Skipped to search')
}
</script>

<style scoped>
.skip-links {
  position: fixed;
  top: -100px;
  left: 0;
  z-index: 9999;
  background: var(--q-primary);
  padding: 0.5rem;
  border-radius: 0 0 0.5rem 0;
  transition: top 0.3s ease;
}

.skip-links--visible {
  top: 0;
}

.skip-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  background: var(--q-primary);
  color: white;
  text-decoration: none;
  border-radius: 0.25rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.skip-link:hover,
.skip-link:focus {
  background: var(--q-primary-dark, #1565c0);
  outline: 2px solid white;
  outline-offset: 2px;
  transform: translateY(-1px);
}

.skip-link:focus {
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .skip-link {
    border: 2px solid white;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .skip-links,
  .skip-link {
    transition: none;
  }
}
</style>
