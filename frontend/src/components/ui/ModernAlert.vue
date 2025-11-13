<template>
  <div
    :class="[
      'relative w-full rounded-lg border px-4 py-3 text-sm',
      'grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr]',
      'has-[>svg]:gap-x-3 gap-y-0.5 items-start',
      '[&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
      variantClasses,
      className
    ]"
    role="alert"
    data-slot="alert"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'destructive'
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  className: ''
})

const variantClasses = computed(() => {
  const variants = {
    default: 'bg-card text-card-foreground',
    destructive: 'text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90'
  }
  return variants[props.variant]
})
</script>
