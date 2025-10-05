<template>
  <q-layout view="lHh Lpr lFf" class="quasar-prime-layout">
    <!-- Header -->
    <QuasarPrimeHeader @toggle-drawer="toggleLeftDrawer" />

    <!-- Sidebar -->
    <QuasarPrimeSidebar v-model="leftDrawerOpen" />

    <!-- Main Content -->
    <q-page-container class="main-content">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import QuasarPrimeHeader from '@/components/layout/QuasarPrimeHeader.vue'
import QuasarPrimeSidebar from '@/components/layout/QuasarPrimeSidebar.vue'

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style lang="sass" scoped>
.quasar-prime-layout
  background: var(--main-bg)
  color: var(--main-text)

.main-content
  background: var(--main-bg)
  min-height: 100vh

/* Light mode variables */
:root
  --main-bg: #f8f9fa
  --main-text: #1a1a1a

/* Dark mode variables */
.dark
  --main-bg: #0d1117
  --main-text: #ffffff
</style>
