<template>
  <q-header elevated class="quasar-prime-header">
    <q-toolbar>
      <!-- Left Side: Hamburger + Logo -->
      <q-btn
        flat
        dense
        round
        icon="menu"
        class="q-mr-sm"
        @click="toggleLeftDrawer"
      />
      
      <div class="row items-center q-mr-lg">
        <q-icon name="account_tree" size="28px" color="primary" class="q-mr-sm" />
        <div class="text-h6 text-weight-bold">ChurchAfrica</div>
      </div>

      <!-- Center: Search -->
      <q-space />
      <div class="search-container">
        <q-input
          v-model="searchQuery"
          placeholder="Search"
          dense
          outlined
          class="search-input"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <q-space />

      <!-- Right Side: Controls -->
      <div class="row items-center q-gutter-sm">
        <!-- Notifications -->
        <q-btn
          flat
          round
          dense
          icon="notifications"
          class="header-btn"
        >
          <q-badge color="red" floating>2</q-badge>
        </q-btn>

        <!-- Language/Font -->
        <q-btn
          flat
          round
          dense
          icon="translate"
          class="header-btn"
        />

        <!-- Apps Grid -->
        <q-btn
          flat
          round
          dense
          icon="apps"
          class="header-btn"
        />

        <!-- Theme Switcher -->
        <ThemeSwitcher />

        <!-- User Avatar -->
        <q-btn
          flat
          round
          dense
          class="user-avatar"
        >
          <q-avatar size="32px">
            <img src="https://cdn.quasar.dev/img/avatar.png">
          </q-avatar>
          <q-badge color="green" floating />
        </q-btn>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ThemeSwitcher from '@/components/theme/ThemeSwitcher.vue'

const searchQuery = ref('')

const toggleLeftDrawer = () => {
  // This will be handled by the parent layout
  emit('toggle-drawer')
}

const emit = defineEmits<{
  'toggle-drawer': []
}>()
</script>

<style lang="sass" scoped>
.quasar-prime-header
  background: var(--header-bg)
  color: var(--header-text)
  border-bottom: 1px solid var(--border)
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)

.search-container
  max-width: 400px
  width: 100%

.search-input
  background: var(--input-bg)
  border-radius: 8px
  
  .q-field__control
    border-radius: 8px

.header-btn
  color: var(--header-text)
  transition: all 0.2s ease
  
  &:hover
    background: var(--hover-bg)
    transform: scale(1.05)

.theme-toggle-btn
  color: var(--header-text)
  background: var(--theme-toggle-bg)
  transition: all 0.3s ease
  
  &:hover
    background: var(--theme-toggle-hover)
    transform: scale(1.1)

.user-avatar
  .q-avatar
    border: 2px solid var(--border)

/* Light mode variables */
:root
  --header-bg: #ffffff
  --header-text: #1a1a1a
  --input-bg: #f8f9fa
  --hover-bg: rgba(0, 0, 0, 0.05)
  --theme-toggle-bg: #f8f9fa
  --theme-toggle-hover: #e9ecef
  --border: #e9ecef

/* Dark mode variables */
.dark
  --header-bg: #1a1a1a
  --header-text: #ffffff
  --input-bg: #2d2d2d
  --hover-bg: rgba(255, 255, 255, 0.1)
  --theme-toggle-bg: #2d2d2d
  --theme-toggle-hover: #3d3d3d
  --border: #3d3d3d
</style>
