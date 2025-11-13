<template>
  <div class="modern-input-wrapper" :class="wrapperClasses">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="modern-input-label"
      :class="{ 'text-destructive': hasError }"
    >
      {{ label }}
      <span v-if="required" class="text-destructive ml-1">*</span>
    </label>

    <!-- Input Field -->
    <input
      :id="inputId"
      :type="inputType"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :autocomplete="autocomplete"
      :aria-invalid="hasError"
      :class="[
        'file:text-foreground placeholder:text-muted-foreground',
        'selection:bg-primary selection:text-primary-foreground',
        'dark:bg-input/30 border-input',
        'flex h-9 w-full min-w-0 rounded-md border px-3 py-1',
        'text-base bg-input-background transition-[color,box-shadow]',
        'outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent',
        'file:text-sm file:font-medium',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        inputClasses
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown.enter="$emit('enter')"
    />

    <!-- Helper Text / Error Message -->
    <div v-if="helperText || hasError" class="modern-input-helper mt-1">
      <span v-if="hasError" class="text-destructive text-sm">
        {{ errorMessage }}
      </span>
      <span v-else-if="helperText" class="text-muted-foreground text-sm">
        {{ helperText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  placeholder?: string
  helperText?: string
  errorMessage?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  autocomplete?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showPasswordToggle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  showPasswordToggle: false,
  className: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  enter: []
}>()

// Generate unique ID for input
const inputId = `input-${Math.random().toString(36).substr(2, 9)}`

const showPassword = ref(false)
const isFocused = ref(false)

const inputType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text'
  }
  return props.type
})

const hasError = computed(() => !!props.errorMessage)

const wrapperClasses = computed(() => {
  return {
    'has-error': hasError.value,
    'is-focused': isFocused.value,
    [`size-${props.size}`]: true
  }
})

const inputClasses = computed(() => {
  return props.className
})

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<style scoped>
.modern-input-wrapper {
  @apply w-full;
}

.modern-input-label {
  @apply block text-sm font-medium mb-2 text-foreground;
}

.modern-input-helper {
  @apply text-xs;
}

/* Focus states */
.modern-input-wrapper.is-focused .modern-input-label {
  @apply text-primary;
}
</style>
