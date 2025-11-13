<template>
  <div
    :class="[
      'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight',
      className
    ]"
    data-slot="alert-title"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  className?: string
}

withDefaults(defineProps<Props>(), {
  className: ''
})
</script>

