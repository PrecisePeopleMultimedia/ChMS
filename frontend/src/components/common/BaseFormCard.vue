<template>
  <div
    class="modern-form-card animate-in"
    :class="[
      'w-full max-w-md mx-auto',
      'bg-card/95 backdrop-blur-xl border border-border/50',
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
      <div v-if="$slots.content" data-testid="content-slot">
        <slot name="content" />
      </div>
      <div v-else data-testid="default-slot">
        <slot /> <!-- Default slot for backward compatibility -->
      </div>
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

/* Glass effect variant */
.glass-effect {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

/* Dark mode adjustments */
.dark .modern-form-card {
  --card-bg: hsl(var(--card) / 0.9);
  --border-color: hsl(var(--border) / 0.3);
}

/* Enhanced Quasar component styling */
:deep(.q-field) {
  @apply modern-input;
}

:deep(.q-field__control) {
  @apply bg-background/50 border border-input rounded-md;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease-in-out;
}

:deep(.q-field--focused .q-field__control) {
  @apply ring-2 ring-ring ring-offset-2 border-primary;
}

:deep(.q-field__control:hover) {
  @apply border-primary/50;
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

/* Input enhancements */
:deep(.garnet-input .q-field__control) {
  @apply bg-background/60 border-input;
  backdrop-filter: blur(12px);
}

:deep(.garnet-input .q-field--focused .q-field__control) {
  @apply border-primary ring-2 ring-primary/20;
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
