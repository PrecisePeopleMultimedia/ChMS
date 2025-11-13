<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :persistent="persistent"
  >
    <q-card
      :class="[
        'bg-background',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'w-full max-w-[calc(100%-2rem)] sm:max-w-lg',
        'rounded-lg border p-6 shadow-lg',
        'grid gap-4',
        className
      ]"
      data-slot="dialog-content"
    >
      <!-- Header -->
      <q-card-section v-if="title || $slots.header" class="q-pa-none">
        <slot name="header">
          <div class="flex flex-col gap-2 text-center sm:text-left" data-slot="dialog-header">
            <h2 v-if="title" class="text-lg font-semibold leading-none">
              {{ title }}
            </h2>
            <p v-if="description" class="text-sm text-muted-foreground">
              {{ description }}
            </p>
          </div>
        </slot>
      </q-card-section>

      <!-- Content -->
      <q-card-section class="q-pa-none">
        <slot />
      </q-card-section>

      <!-- Footer -->
      <q-card-section v-if="$slots.footer" class="q-pa-none">
        <div
          class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
          data-slot="dialog-footer"
        >
          <slot name="footer" />
        </div>
      </q-card-section>

      <!-- Close Button -->
      <q-btn
        flat
        round
        dense
        icon="close"
        class="absolute top-4 right-4 opacity-70 hover:opacity-100"
        @click="$emit('update:modelValue', false)"
      >
        <span class="sr-only">Close</span>
      </q-btn>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  description?: string
  persistent?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  persistent: false,
  className: ''
})

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<style scoped>
/* Dialog animations */
@-webkit-keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@-webkit-keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@-webkit-keyframes zoom-in {
  from {
    transform: scale(0.95);
  }
  to {
    transform: scale(1);
  }
}
@keyframes zoom-in {
  from {
    transform: scale(0.95);
  }
  to {
    transform: scale(1);
  }
}

@-webkit-keyframes zoom-out {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0.95);
  }
}
@keyframes zoom-out {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0.95);
  }
}

[data-state="open"] {
  -webkit-animation: fade-in 0.2s, zoom-in 0.2s;
  -webkit-animation-fill-mode: both;
  animation: fade-in 0.2s, zoom-in 0.2s;
  animation-fill-mode: both;
}

[data-state="closed"] {
  -webkit-animation: fade-out 0.2s, zoom-out 0.2s;
  -webkit-animation-fill-mode: both;
  animation: fade-out 0.2s, zoom-out 0.2s;
  animation-fill-mode: both;
}
</style>

