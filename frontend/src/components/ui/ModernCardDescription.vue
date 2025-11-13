<template>
  <p
    :class="[
      'text-muted-foreground',
      className
    ]"
    data-slot="card-description"
  >
    <slot />
  </p>
</template>

<script setup lang="ts">
interface Props {
  className?: string
}

withDefaults(defineProps<Props>(), {
  className: ''
})
</script>

