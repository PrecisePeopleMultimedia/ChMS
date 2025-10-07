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

    <!-- Input Container -->
    <div class="modern-input-container" :class="containerClasses">
      <!-- Left Icon -->
      <div v-if="leftIcon || $slots.leftIcon || $slots.prefix" class="modern-input-icon-left" data-testid="prefix-icon">
        <slot name="leftIcon">
          <slot name="prefix">
            <q-icon v-if="leftIcon" :name="leftIcon" :size="iconSize" />
          </slot>
        </slot>
      </div>

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
        :class="[
          'modern-input',
          'flex-1 bg-transparent border-0 outline-none',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-ring',
          'focus-visible:ring-offset-2',
          'backdrop-blur-sm',
          props.size === 'sm' && 'text-sm px-2',
          props.size === 'md' && 'text-sm px-3',
          props.size === 'lg' && 'text-base px-4',
          props.variant === 'filled' && 'bg-muted',
          props.variant === 'outlined' && 'border border-input',
          props.variant === 'default' && 'border-b border-input rounded-none',
          hasError && 'border-destructive',
          props.disabled && 'opacity-50 cursor-not-allowed',
          (leftIcon || $slots.leftIcon || $slots.prefix) && 'pl-10',
          (rightIcon || $slots.rightIcon || $slots.suffix || showPasswordToggle || props.type === 'password') && 'pr-10'
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="$emit('enter')"
      />

      <!-- Right Icon/Button -->
      <div v-if="rightIcon || $slots.rightIcon || $slots.suffix || showPasswordToggle || (props.type === 'password')" class="modern-input-icon-right" data-testid="suffix-icon">
        <slot name="rightIcon">
          <slot name="suffix">
            <!-- Password Toggle -->
            <button
              v-if="showPasswordToggle || props.type === 'password'"
              type="button"
              class="modern-input-toggle"
              @click="togglePassword"
            >
              <q-icon 
                :name="inputType === 'password' ? 'visibility_off' : 'visibility'" 
                :size="iconSize"
              />
            </button>
            <!-- Custom Right Icon -->
            <q-icon v-else-if="rightIcon" :name="rightIcon" :size="iconSize" />
          </slot>
        </slot>
      </div>
    </div>

    <!-- Helper Text -->
    <div v-if="helperText || hasError" class="modern-input-helper">
      <span v-if="hasError" class="text-destructive">
        {{ errorMessage }}
      </span>
      <span v-else-if="helperText" class="text-muted-foreground">
        {{ helperText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useId } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  placeholder?: string
  helperText?: string
  errorMessage?: string
  leftIcon?: string
  rightIcon?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  autocomplete?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outlined'
  showPasswordToggle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  variant: 'outlined',
  showPasswordToggle: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: []
  blur: []
  enter: []
}>()

// Generate unique ID for accessibility
const inputId = useId()

// Password visibility state
const showPassword = ref(false)
const inputType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text'
  }
  return props.type
})

// Focus state
const isFocused = ref(false)

// Computed classes
const wrapperClasses = computed(() => [
  'w-full',
  props.size === 'sm' && 'space-y-1',
  props.size === 'md' && 'space-y-2',
  props.size === 'lg' && 'space-y-3'
])

const containerClasses = computed(() => [
  'relative flex items-center',
  props.size === 'sm' && 'h-8',
  props.size === 'md' && 'h-10',
  props.size === 'lg' && 'h-12',
  isFocused.value && 'ring-2 ring-ring ring-offset-2',
  hasError.value && 'border-destructive',
  props.disabled && 'opacity-50 cursor-not-allowed'
])

const inputClasses = computed(() => [
  'modern-input',
  'flex-1 bg-transparent border-0 outline-none',
  'placeholder:text-muted-foreground',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'focus-visible:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-ring',
  'focus-visible:ring-offset-2',
  'backdrop-blur-sm',
  props.size === 'sm' && 'text-sm px-2',
  props.size === 'md' && 'text-sm px-3',
  props.size === 'lg' && 'text-base px-4',
  props.variant === 'filled' && 'bg-muted',
  props.variant === 'outlined' && 'border border-input',
  props.variant === 'default' && 'border-b border-input rounded-none',
  hasError.value && 'border-destructive'
])

const hasError = computed(() => !!props.errorMessage)

const iconSize = computed(() => {
  switch (props.size) {
    case 'sm': return '16px'
    case 'md': return '20px'
    case 'lg': return '24px'
    default: return '20px'
  }
})

// Methods
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleFocus = () => {
  isFocused.value = true
  emit('focus')
}

const handleBlur = () => {
  isFocused.value = false
  emit('blur')
}
</script>

<style scoped>
.modern-input-wrapper {
  @apply w-full;
}

.modern-input-label {
  @apply block text-sm font-medium text-foreground mb-1;
}

.modern-input-container {
  @apply relative flex items-center rounded-md border border-input bg-background;
  transition: all 0.2s ease-in-out;
}

.modern-input-container:focus-within {
  @apply ring-2 ring-ring ring-offset-2 border-ring;
}

.modern-input-container.error {
  @apply border-destructive ring-destructive;
}

.modern-input {
  @apply flex-1 bg-transparent border-0 outline-none;
}

.modern-input::placeholder {
  @apply text-muted-foreground;
}

.modern-input:focus {
  @apply outline-none;
}

.modern-input-icon-left {
  @apply absolute left-3 flex items-center text-muted-foreground;
}

.modern-input-icon-right {
  @apply absolute right-3 flex items-center text-muted-foreground;
}

.modern-input-toggle {
  @apply p-1 hover:bg-muted rounded-sm transition-colors;
}

.modern-input-helper {
  @apply text-xs mt-1;
}

/* Size variants */
.modern-input-wrapper.size-sm .modern-input-container {
  @apply h-8;
}

.modern-input-wrapper.size-md .modern-input-container {
  @apply h-10;
}

.modern-input-wrapper.size-lg .modern-input-container {
  @apply h-12;
}

/* Variant styles */
.modern-input-container.variant-filled {
  @apply bg-muted border-muted;
}

.modern-input-container.variant-outlined {
  @apply border-input bg-background;
}

.modern-input-container.variant-default {
  @apply border-0 border-b border-input bg-transparent rounded-none;
}
</style>