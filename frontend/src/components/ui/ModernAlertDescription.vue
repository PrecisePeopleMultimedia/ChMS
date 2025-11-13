<template>
  <div
    :class="[
      'text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm',
      '[&_p]:leading-relaxed',
      className
    ]"
    data-slot="alert-description"
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

