<template>
  <button
    @click="$emit('click')"
    :class="[
      'w-full flex items-center gap-3 px-3 py-2 rounded-lg',
      'transition-colors touch-target no-select',
      isActive
        ? 'bg-primary/10 text-primary font-normal'
        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
    ]"
    :style="{ fontWeight: isActive ? '400' : '300' }"
  >
    <q-icon
      :name="item.icon"
      :size="isActive ? '20px' : '18px'"
      :color="isActive ? 'primary' : 'currentColor'"
    />
    <span class="flex-1 text-left">{{ item.label }}</span>
    <q-badge
      v-if="item.badge"
      color="primary"
      :label="item.badge"
      class="text-xs px-2 py-0.5 rounded-full"
    />
  </button>
</template>

<script setup lang="ts">
import type { NavigationItem } from '@/config/navigation'

interface Props {
  item: NavigationItem
  isActive: boolean
}

defineProps<Props>()

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.no-select {
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
</style>

