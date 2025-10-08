<template>
  <div class="accessible-input">
    <label 
      :for="inputId"
      class="accessible-input__label"
      :class="{ 'accessible-input__label--required': required }"
    >
      {{ label }}
      <span v-if="required" class="accessible-input__required" aria-label="required">*</span>
    </label>
    
    <q-input
      :id="inputId"
      :model-value="modelValue"
      v-bind="$attrs"
      :aria-describedby="ariaDescribedBy"
      :aria-invalid="hasError"
      :aria-required="required"
      :error="hasError"
      :error-message="errorMessage"
      class="accessible-input__field"
      @update:model-value="$emit('update:modelValue', $event)"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <template v-for="(_, slot) in $slots" v-slot:[slot]="slotProps">
        <slot :name="slot" v-bind="slotProps" />
      </template>
    </q-input>
    
    <div 
      v-if="helpText"
      :id="helpId"
      class="accessible-input__help"
      role="note"
    >
      {{ helpText }}
    </div>
    
    <div 
      v-if="hasError && errorMessage"
      :id="errorId"
      class="accessible-input__error"
      role="alert"
      aria-live="polite"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAccessibility } from '@/composables/useAccessibility'

interface Props {
  modelValue: string | number | null
  label: string
  required?: boolean
  helpText?: string
  errorMessage?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  helpText: '',
  errorMessage: '',
  id: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

const { generateId, announceToScreenReader } = useAccessibility()

const inputId = computed(() => props.id || generateId('input'))
const helpId = computed(() => `${inputId.value}-help`)
const errorId = computed(() => `${inputId.value}-error`)

const hasError = computed(() => !!props.errorMessage)

const ariaDescribedBy = computed(() => {
  const descriptions = []
  if (props.helpText) descriptions.push(helpId.value)
  if (hasError.value) descriptions.push(errorId.value)
  return descriptions.join(' ') || undefined
})

function handleFocus() {
  if (props.helpText) {
    announceToScreenReader(`${props.label}. ${props.helpText}`)
  }
}

function handleBlur() {
  if (hasError.value && props.errorMessage) {
    announceToScreenReader(`Error: ${props.errorMessage}`, 'assertive')
  }
}
</script>

<style scoped>
.accessible-input {
  margin-bottom: 1rem;
}

.accessible-input__label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--q-dark, #1d1d1d);
}

.accessible-input__label--required {
  position: relative;
}

.accessible-input__required {
  color: var(--q-negative, #c10015);
  margin-left: 0.25rem;
  font-weight: bold;
}

.accessible-input__field {
  width: 100%;
}

.accessible-input__help {
  font-size: 0.875rem;
  color: var(--q-dark-page, #666);
  margin-top: 0.25rem;
  line-height: 1.4;
}

.accessible-input__error {
  font-size: 0.875rem;
  color: var(--q-negative, #c10015);
  margin-top: 0.25rem;
  font-weight: 500;
  line-height: 1.4;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .accessible-input__label {
    font-weight: bold;
  }
  
  .accessible-input__error {
    background: var(--q-negative, #c10015);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }
}

/* Focus styles */
.accessible-input__field :deep(.q-field__control) {
  transition: all 0.2s ease;
}

.accessible-input__field :deep(.q-field--focused .q-field__control) {
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.3);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .accessible-input__field :deep(.q-field__control) {
    transition: none;
  }
}
</style>
