<template>
  <q-layout view="hHh Lpr lFf" class="auth-layout">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
// Authentication layout for login, register, and forgot password pages
// This layout applies the TweakCN green dark theme to auth pages
</script>

<style lang="scss">
.auth-layout {
  min-height: 100vh;
  background: oklch(0.1822 0 0); // --background from TweakCN theme

  :deep(.q-page) {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }
}
</style>