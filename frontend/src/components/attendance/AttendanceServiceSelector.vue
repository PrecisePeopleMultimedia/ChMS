<template>
  <ServiceSelector
    :services="services"
    :selected-service-id="selectedServiceId"
    @select-service="onSelectService"
    @create-service="onCreateService"
  />
</template>

<script setup lang="ts">
import ServiceSelector from './ServiceSelector.vue'
import type { Service } from '@/types/attendance'

interface Props {
  services: Service[]
  selectedServiceId?: string
  onSelectService: (service: Service) => void
  onCreateService?: () => void
}

defineProps<Props>()
</script>

