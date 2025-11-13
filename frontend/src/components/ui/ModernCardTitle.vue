<template>
  <h4
    :class="[
      'leading-none',
      className
    ]"
    data-slot="card-title"
  >
    <slot />
  </h4>
</template>

<script setup lang="ts">
interface Props {
  className?: string
}

withDefaults(defineProps<Props>(), {
  className: ''
})
</script>

