<template>
  <q-tabs
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :class="[
      'flex flex-col gap-2',
      className
    ]"
    data-slot="tabs"
  >
    <q-tab
      v-for="tab in tabs"
      :key="tab.value"
      :name="tab.value"
      :label="tab.label"
      :icon="tab.icon"
      :class="[
        'modern-tab-trigger',
        'data-[state=active]:bg-card dark:data-[state=active]:text-foreground',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring',
        'dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30',
        'text-foreground dark:text-muted-foreground',
        'inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5',
        'rounded-sm border border-transparent px-2 py-1 text-sm font-medium',
        'whitespace-nowrap transition-[color,box-shadow]',
        'focus-visible:ring-[3px] focus-visible:outline-1',
        'disabled:pointer-events-none disabled:opacity-50',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4'
      ]"
      data-slot="tabs-trigger"
    />
  </q-tabs>

  <q-tab-panels
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    class="flex-1 outline-none"
    data-slot="tabs-content"
  >
    <q-tab-panel
      v-for="tab in tabs"
      :key="tab.value"
      :name="tab.value"
    >
      <slot :name="`content-${tab.value}`" />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup lang="ts">
interface Tab {
  value: string
  label: string
  icon?: string
}

interface Props {
  modelValue: string
  tabs: Tab[]
  className?: string
}

const props = defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
.modern-tab-trigger {
  @apply bg-muted text-muted-foreground;
}

.modern-tab-trigger.q-tab--active {
  @apply bg-card text-foreground dark:border-input dark:bg-input/30;
}
</style>

