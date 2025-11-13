<template>
  <div
    :class="[
      'flex items-center px-6 pb-6 [.border-t]:pt-6',
      className
    ]"
    data-slot="card-footer"
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

