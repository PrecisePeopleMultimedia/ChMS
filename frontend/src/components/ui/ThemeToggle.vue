<template>
  <div class="theme-toggle">
    <q-btn
      :icon="themeIcon"
      :label="themeLabel"
      @click="toggleTheme"
      :loading="isLoading"
      class="theme-toggle-btn"
      flat
      dense
    >
      <template v-slot:loading>
        <q-spinner-dots size="16px" />
      </template>
    </q-btn>

    <!-- Theme Options Dropdown (Optional) -->
    <q-menu
      v-model="showMenu"
      anchor="bottom left"
      self="top left"
      class="theme-menu"
    >
      <q-list class="theme-options">
        <q-item
          v-for="option in themeOptions"
          :key="option.value"
          clickable
          v-close-popup
          @click="setTheme(option.value)"
          :class="{ 'theme-option-active': theme === option.value }"
        >
          <q-item-section avatar>
            <q-icon :name="option.icon" :color="option.color" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ option.label }}</q-item-label>
            <q-item-label caption>{{ option.description }}</q-item-label>
          </q-item-section>
          <q-item-section side v-if="theme === option.value">
            <q-icon name="check" color="primary" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

// Composables
const themeStore = useThemeStore()

// State
const showMenu = ref(false)
const isLoading = ref(false)

// Computed
const theme = computed(() => themeStore.theme)
const isDark = computed(() => themeStore.isDark)

const themeIcon = computed(() => {
  if (theme.value === 'system') {
    return 'computer'
  }
  return isDark.value ? 'dark_mode' : 'light_mode'
})

const themeLabel = computed(() => {
  if (theme.value === 'system') {
    return isDark.value ? 'Dark (System)' : 'Light (System)'
  }
  return isDark.value ? 'Dark' : 'Light'
})

const themeOptions = computed(() => [
  {
    value: 'light',
    label: 'Light',
    description: 'Always use light theme',
    icon: 'light_mode',
    color: 'orange'
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Always use dark theme',
    icon: 'dark_mode',
    color: 'blue'
  },
  {
    value: 'system',
    label: 'System',
    description: 'Follow system preference',
    icon: 'computer',
    color: 'grey'
  }
])

// Methods
const toggleTheme = async () => {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 100)) // Small delay for smooth transition
    themeStore.toggleTheme()
  } finally {
    isLoading.value = false
  }
}

const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
  themeStore.setTheme(newTheme)
  showMenu.value = false
}
</script>

<style lang="sass" scoped>
.theme-toggle
  position: relative

.theme-toggle-btn
  @apply transition-all duration-200 ease-out
  border-radius: 8px
  
  &:hover
    @apply transform scale-105
    background: rgba(var(--primary), 0.1)

.theme-menu
  @apply bg-card border border-border shadow-lg
  border-radius: 12px
  min-width: 200px

.theme-options
  @apply bg-card

.theme-option-active
  @apply bg-primary/10

.q-item
  @apply transition-colors duration-200
  
  &:hover
    @apply bg-muted/50

.q-item-section
  @apply text-foreground
</style>
