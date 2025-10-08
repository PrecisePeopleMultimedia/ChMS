<template>
  <q-btn
    v-bind="$attrs"
    :aria-label="ariaLabel"
    :aria-describedby="ariaDescribedBy"
    :aria-pressed="ariaPressed"
    :aria-expanded="ariaExpanded"
    :disabled="disabled || loading"
    :loading="loading"
    class="accessible-button"
    :class="buttonClasses"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <template v-if="$slots.default">
      <slot />
    </template>
    <template v-else>
      {{ label }}
    </template>
    
    <!-- Loading announcement for screen readers -->
    <span v-if="loading" class="sr-only" aria-live="polite">
      Loading, please wait
    </span>
    
    <!-- Success/Error announcements -->
    <span v-if="successMessage" class="sr-only" aria-live="polite">
      {{ successMessage }}
    </span>
    <span v-if="errorMessage" class="sr-only" aria-live="assertive">
      {{ errorMessage }}
    </span>
  </q-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAccessibility } from '@/composables/useAccessibility'

interface Props {
  label?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  ariaPressed?: boolean | string
  ariaExpanded?: boolean | string
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
  size?: 'small' | 'medium' | 'large'
  successMessage?: string
  errorMessage?: string
  toggle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  ariaLabel: '',
  ariaDescribedBy: '',
  ariaPressed: undefined,
  ariaExpanded: undefined,
  disabled: false,
  loading: false,
  variant: 'primary',
  size: 'medium',
  successMessage: '',
  errorMessage: '',
  toggle: false
})

const emit = defineEmits<{
  click: [event: Event]
  toggle: [pressed: boolean]
}>()

const { announceToScreenReader, handleKeyboardNavigation } = useAccessibility()

const buttonClasses = computed(() => ({
  [`accessible-button--${props.variant}`]: true,
  [`accessible-button--${props.size}`]: true,
  'accessible-button--loading': props.loading,
  'accessible-button--disabled': props.disabled
}))

function handleClick(event: Event) {
  if (props.disabled || props.loading) {
    return
  }

  if (props.toggle) {
    const newPressed = !props.ariaPressed
    emit('toggle', newPressed)
    announceToScreenReader(`${props.label || props.ariaLabel} ${newPressed ? 'pressed' : 'not pressed'}`)
  }

  emit('click', event)

  // Announce success/error messages
  if (props.successMessage) {
    announceToScreenReader(props.successMessage)
  }
  if (props.errorMessage) {
    announceToScreenReader(props.errorMessage, 'assertive')
  }
}

function handleKeydown(event: KeyboardEvent) {
  handleKeyboardNavigation(event, {
    onEnter: () => handleClick(event),
    onSpace: () => handleClick(event)
  })
}
</script>

<style scoped>
.accessible-button {
  position: relative;
  transition: all 0.2s ease;
}

/* Focus styles */
.accessible-button:focus {
  outline: 2px solid var(--q-primary);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(25, 118, 210, 0.3);
}

/* Variant styles */
.accessible-button--primary {
  background: var(--q-primary);
  color: white;
}

.accessible-button--secondary {
  background: var(--q-secondary);
  color: white;
}

.accessible-button--danger {
  background: var(--q-negative);
  color: white;
}

.accessible-button--success {
  background: var(--q-positive);
  color: white;
}

.accessible-button--warning {
  background: var(--q-warning);
  color: var(--q-dark);
}

/* Size styles */
.accessible-button--small {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

.accessible-button--medium {
  font-size: 1rem;
  padding: 0.5rem 1rem;
}

.accessible-button--large {
  font-size: 1.125rem;
  padding: 0.75rem 1.5rem;
}

/* State styles */
.accessible-button--loading {
  cursor: wait;
}

.accessible-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .accessible-button {
    border: 2px solid currentColor;
  }
  
  .accessible-button:focus {
    outline: 3px solid;
    outline-offset: 3px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .accessible-button {
    transition: none;
  }
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
