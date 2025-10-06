<template>
  <div class="organization-setup-view">
    <OrganizationSetup />
  </div>
</template>

<script setup lang="ts">
import OrganizationSetup from '@/components/organization/OrganizationSetup.vue'
</script>

<style lang="sass" scoped>
.organization-setup-view
  min-height: 100vh
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
  display: flex
  align-items: center
  justify-content: center
  padding: 1rem

@media (max-width: 600px)
  .organization-setup-view
    padding: 0.5rem
    align-items: flex-start
    padding-top: 2rem
</style>
