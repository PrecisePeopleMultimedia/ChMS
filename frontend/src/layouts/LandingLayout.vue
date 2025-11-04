<template>
  <q-layout view="hHh lpR fFf" class="landing-layout">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
// Minimal layout for landing/marketing pages
// Provides Quasar layout structure for consistency without header/drawer
</script>

<style lang="sass" scoped>
.landing-layout
  min-height: 100vh
  
  // Ensure full-width layout for landing page
  .q-page-container
    padding: 0
    min-height: 100vh
</style>
