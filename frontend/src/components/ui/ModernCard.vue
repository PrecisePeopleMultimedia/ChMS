<template>
  <div
    :class="[
      'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border',
      className
    ]"
    data-slot="card"
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

