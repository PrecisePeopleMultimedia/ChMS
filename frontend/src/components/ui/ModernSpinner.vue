<template>
  <div 
    :class="[
      'modern-spinner',
      sizeClasses,
      colorClasses,
      { 'animate-spin': !pulse }
    ]"
    :style="customStyle"
  >
    <!-- Default Spinner -->
    <svg
      v-if="variant === 'default'"
      class="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    <!-- Dots Spinner -->
    <div v-else-if="variant === 'dots'" class="flex space-x-1">
      <div 
        v-for="i in 3" 
        :key="i"
        class="rounded-full animate-bounce"
        :style="{ animationDelay: `${(i - 1) * 0.1}s` }"
      ></div>
    </div>

    <!-- Pulse Spinner -->
    <div v-else-if="variant === 'pulse'" class="rounded-full animate-pulse"></div>

    <!-- Bars Spinner -->
    <div v-else-if="variant === 'bars'" class="flex space-x-1">
      <div 
        v-for="i in 4" 
        :key="i"
        class="animate-pulse"
        :style="{ animationDelay: `${(i - 1) * 0.1}s` }"
      ></div>
    </div>

    <!-- Custom Content -->
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'dots' | 'pulse' | 'bars' | 'custom'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'muted' | 'white' | 'current'
  speed?: 'slow' | 'normal' | 'fast'
  pulse?: boolean
  customStyle?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  color: 'primary',
  speed: 'normal',
  pulse: false
})

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }
  return sizes[props.size]
})

const colorClasses = computed(() => {
  const colors = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    muted: 'text-muted-foreground',
    white: 'text-white',
    current: 'text-current'
  }
  return colors[props.color]
})

const customStyle = computed(() => {
  const speedMap = {
    slow: '2s',
    normal: '1s',
    fast: '0.5s'
  }
  
  return {
    animationDuration: speedMap[props.speed],
    ...props.customStyle
  }
})
</script>

<style scoped>
.modern-spinner {
  @apply inline-block;
}

/* Custom animations for different variants */
.modern-spinner.variant-dots .animate-bounce {
  animation: bounce 1.4s ease-in-out infinite both;
}

.modern-spinner.variant-bars > div {
  @apply w-1 bg-current;
  animation: bars 1.2s ease-in-out infinite;
}

@-webkit-keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

@-webkit-keyframes bars {
  0%, 40%, 100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}
@keyframes bars {
  0%, 40%, 100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}

/* Pulse animation */
.modern-spinner.variant-pulse {
  @apply bg-current;
  -webkit-animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@-webkit-keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
