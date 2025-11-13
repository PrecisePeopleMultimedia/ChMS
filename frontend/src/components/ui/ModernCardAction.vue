<template>
  <div
    :class="[
      'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
      className
    ]"
    data-slot="card-action"
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

