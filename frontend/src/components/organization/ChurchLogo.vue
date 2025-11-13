<template>
  <div
    :class="[
      sizeClasses[size],
      'flex items-center justify-center overflow-hidden rounded-lg'
    ]"
  >
    <q-img
      v-if="organization?.logo"
      :src="organization.logo"
      :alt="`${organization.name} Logo`"
      fit="contain"
      class="h-full w-full"
    />
    <div
      v-else-if="showFallback"
      class="h-full w-full rounded-lg bg-primary/10 flex items-center justify-center"
    >
      <q-icon name="church" color="primary" :size="iconSize" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOrganizationStore } from '@/stores/organization'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showFallback?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showFallback: true
})

const organizationStore = useOrganizationStore()
const organization = computed(() => organizationStore.organization)

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-20 w-20',
  xl: 'h-32 w-32'
}

const iconSize = computed(() => {
  const sizes = {
    sm: '16px',
    md: '24px',
    lg: '40px',
    xl: '64px'
  }
  return sizes[props.size]
})
</script>

