<template>
  <div class="flex items-start justify-between mb-8">
    <!-- Left: Church Info - 3 Lines -->
    <div class="flex-1">
      <!-- Line 1: Acronym, City -->
      <div class="flex items-center gap-4">
        <h1
          class="text-[2.4em] leading-none mb-1 font-light"
          style="font-weight: 300"
        >
          {{ displayAcronym }}, {{ displayCity }}
        </h1>
      </div>

      <!-- Line 2: Full Church Name + Campus Badge with divider above -->
      <div class="inline-flex flex-col">
        <div class="h-px bg-border mb-1.5" />
        <div class="flex items-center gap-2 mb-1.5">
          <p class="text-muted-foreground">
            {{ displayName }}
          </p>
          <q-badge
            v-if="displayCampus"
            class="uppercase px-2 py-0.5 text-[10px] bg-warning text-warning-foreground"
            style="font-weight: 500; border-radius: 2px"
          >
            {{ displayCampus }}
          </q-badge>
        </div>
      </div>

      <!-- Line 3: Address -->
      <p class="text-sm text-muted-foreground">
        {{ displayAddress }}
      </p>
    </div>

    <!-- Right: Logo and Optional Progress Badge -->
    <div class="flex flex-col items-end gap-3">
      <ChurchLogo size="lg" />
      
      <q-badge
        v-if="showProgressBadge && progressText"
        color="secondary"
        class="gap-1"
      >
        <q-icon name="info" size="12px" />
        {{ progressText }}
      </q-badge>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOrganizationStore } from '@/stores/organization'
import ChurchLogo from '@/components/organization/ChurchLogo.vue'

interface Props {
  showProgressBadge?: boolean
  progressText?: string
}

const props = withDefaults(defineProps<Props>(), {
  showProgressBadge: false,
  progressText: undefined
})

const organizationStore = useOrganizationStore()

// Computed properties for display
const displayAcronym = computed(() => {
  // TODO: Add acronym field to Organization interface
  return organizationStore.organization?.name?.substring(0, 4).toUpperCase() || 'CHMS'
})

const displayCity = computed(() => {
  // Extract city from address or use default
  const address = organizationStore.organization?.address || ''
  const cityMatch = address.match(/,?\s*([^,]+),\s*([^,]+)$/)
  return cityMatch ? cityMatch[1] : 'City'
})

const displayName = computed(() => {
  return organizationStore.organization?.name || 'Church Management System'
})

const displayCampus = computed(() => {
  // TODO: Add campus support to organization store
  return null // Will be implemented when campus support is added
})

const displayAddress = computed(() => {
  const org = organizationStore.organization
  if (!org) return 'Address not set'
  
  const parts = [org.address, org.phone, org.email].filter(Boolean)
  return parts.join(' • ') || 'Address not set'
})
</script>

