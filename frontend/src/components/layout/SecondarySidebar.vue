<template>
  <!-- Mobile: render as slide-out sheet from right -->
  <template v-if="isMobile">
    <!-- Backdrop -->
    <div
      v-if="open"
      class="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
      @click="$emit('close')"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed right-0 top-0 h-full w-full sm:w-[320px] bg-card border-l border-border z-50',
        'transform transition-transform duration-300 ease-in-out',
        open ? 'translate-x-0' : 'translate-x-full'
      ]"
    >
      <SecondarySidebarContent
        :is-mobile="isMobile"
        @close="$emit('close')"
      />
    </aside>
  </template>

  <!-- Desktop: render as fixed sidebar -->
  <SecondarySidebarContent v-else :is-mobile="isMobile" />
</template>

<script setup lang="ts">
interface Props {
  open: boolean
  isMobile: boolean
}

defineProps<Props>()

defineEmits<{
  close: []
}>()
</script>

