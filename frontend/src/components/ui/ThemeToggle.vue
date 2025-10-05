<template>
  <q-btn
    flat
    round
    :icon="isDark ? 'light_mode' : 'dark_mode'"
    @click="toggleTheme"
    class="theme-toggle"
    :color="isDark ? 'amber' : 'blue-grey-7'"
  >
    <q-tooltip>
      {{ isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}
    </q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

// Composables
const themeStore = useThemeStore()

// Computed
const isDark = computed(() => themeStore.isDark)

// Methods
const toggleTheme = () => {
  themeStore.toggleTheme()
}
</script>

<style lang="sass" scoped>
.theme-toggle
  transition: all 0.2s ease
</style>
