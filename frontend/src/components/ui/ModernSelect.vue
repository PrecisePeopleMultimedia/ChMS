<template>
  <q-select
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :options="options"
    :option-label="optionLabel"
    :option-value="optionValue"
    :label="label"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :error="hasError"
    :error-message="errorMessage"
    :dense="size === 'sm'"
    outlined
    :class="[
      'modern-select',
      'border-input data-[placeholder]:text-muted-foreground',
      '[&_svg:not([class*=\'text-\'])]:text-muted-foreground',
      'focus-visible:border-ring focus-visible:ring-ring/50',
      'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
      'dark:bg-input/30 dark:hover:bg-input/50',
      'rounded-md bg-input-background',
      'transition-[color,box-shadow] outline-none focus-visible:ring-[3px]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      size === 'default' ? 'h-9' : 'h-8',
      className
    ]"
    :aria-invalid="hasError"
  >
    <template v-if="$slots.option" #option="scope">
      <slot name="option" v-bind="scope" />
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: any
  options?: any[]
  optionLabel?: string | ((option: any) => string)
  optionValue?: string | ((option: any) => any)
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  errorMessage?: string
  size?: 'sm' | 'default'
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  className: ''
})

defineEmits<{
  'update:modelValue': [value: any]
}>()

const hasError = computed(() => !!props.errorMessage)
</script>

<style scoped>
.modern-select :deep(.q-field__control) {
  @apply rounded-md;
}

.modern-select :deep(.q-field__native) {
  @apply px-3 py-2 text-sm;
}
</style>

