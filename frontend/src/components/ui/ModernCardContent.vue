<template>
  <div
    :class="[
      'px-6 [&:last-child]:pb-6',
      className
    ]"
    data-slot="card-content"
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

