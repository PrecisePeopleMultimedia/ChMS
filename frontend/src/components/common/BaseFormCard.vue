<template>
  <div
    class="modern-form-card animate-in"
    :class="[
      'w-full max-w-md mx-auto',
      'rounded-2xl shadow-modern-lg',
      'p-8 space-y-6',
      variant === 'glass' && 'glass-effect',
      variant === 'solid' && 'bg-card border-border'
    ]"
  >
    <!-- Header Section -->
    <div v-if="title || subtitle || $slots.header" class="text-center space-y-2">
      <slot name="header">
        <div v-if="title" class="text-2xl font-bold text-foreground tracking-tight">
          {{ title }}
        </div>
        <div v-if="subtitle" class="text-sm text-muted-foreground">
          {{ subtitle }}
        </div>
      </slot>
    </div>

    <!-- Content Section -->
    <div class="space-y-4">
      <slot name="content">
        <slot /> <!-- Default slot for backward compatibility -->
      </slot>
    </div>

    <!-- Footer Section -->
    <div v-if="$slots.footer" class="text-center space-y-2 pt-4 border-t border-border/50">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  variant?: 'glass' | 'solid'
  maxWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'glass',
  maxWidth: '28rem' // 448px, equivalent to max-w-md
})
</script>

<style scoped>
/* Modern form card styling with shadcn/ui inspiration */
.modern-form-card {
  /* Custom properties for dynamic theming */
  --card-bg: hsl(var(--card) / 0.95);
  --border-color: hsl(var(--border) / 0.5);

  /* Enhanced backdrop blur effect */
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);

  /* Subtle inner glow */
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Glass effect variant - dark theme for auth pages */
/* Always use dark theme for auth forms regardless of global theme */
.glass-effect {
  background: hsl(330, 35%, 10%) !important;
  border: 1px solid hsl(330, 25%, 15%) !important;
  color: hsl(330, 20%, 95%) !important;
}

/* Dark mode adjustments */
.dark .modern-form-card {
  --card-bg: hsl(var(--card) / 0.9);
  --border-color: hsl(var(--border) / 0.3);
}

/* Enhanced Quasar component styling */
/* Don't apply modern-input styles to Quasar fields - they have their own styling */
:deep(.q-field) {
  /* Remove any conflicting styles */
}

/* Remove duplicate borders - Quasar outlined inputs use .q-field__outline for borders */
:deep(.q-field--outlined .q-field__control) {
  background: transparent !important;
  border: none !important;
  backdrop-filter: none;
}

/* Ensure Quasar's outline is visible and not duplicated */
:deep(.q-field--outlined .q-field__outline) {
  /* Quasar handles this - don't override */
}

:deep(.q-field--focused .q-field__control) {
  /* Quasar handles focus borders, don't add extra */
}

:deep(.q-field__control:hover) {
  /* Quasar handles hover states */
}

:deep(.q-btn) {
  @apply modern-button transition-all duration-200;
}

:deep(.q-btn--standard) {
  @apply modern-button-primary shadow-lg hover:shadow-xl;
}

:deep(.q-btn--outline) {
  @apply modern-button-outline;
}

:deep(.q-btn--flat) {
  @apply modern-button-ghost;
}

/* Enhanced button effects */
:deep(.garnet-btn) {
  @apply gradient-primary text-white font-medium;
  box-shadow: 0 4px 14px 0 rgba(184, 51, 106, 0.4);
  transition: all 0.2s ease-in-out;
}

:deep(.garnet-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px 0 rgba(184, 51, 106, 0.6);
}

:deep(.google-btn) {
  @apply modern-button-outline bg-background/80 backdrop-blur-sm;
  transition: all 0.2s ease-in-out;
}

:deep(.google-btn:hover) {
  @apply bg-accent/80;
  transform: translateY(-1px);
}

/* Input enhancements - remove duplicate borders */
:deep(.garnet-input.q-field--outlined .q-field__control) {
  background: transparent !important;
  border: none !important;
  backdrop-filter: none;
}

/* Let Quasar handle the outlined input borders */
:deep(.garnet-input.q-field--outlined .q-field__native) {
  background: transparent;
}

/* Focus state - Quasar handles this with outlined inputs */
:deep(.garnet-input.q-field--focused .q-field__control) {
  /* Quasar's outlined input already has focus border */
}

/* Notification/banner styling */
:deep(.q-banner) {
  @apply modern-alert rounded-lg backdrop-blur-sm;
}

/* Animation enhancements */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-in {
  animation: fade-in 0.4s ease-out;
}
</style>
