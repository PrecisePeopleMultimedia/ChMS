<template>
  <div class="flex items-start gap-3">
    <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-lg flex-shrink-0">
      {{ activityIcon }}
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm">{{ activity.description }}</p>
      <p class="text-xs text-muted-foreground mt-1">
        {{ activity.timestamp }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  activity: {
    id: string
    type: string
    description: string
    timestamp: string
  }
}

const props = defineProps<Props>()

const activityIcon = computed(() => {
  const icons: Record<string, string> = {
    new_member: '👋',
    event: '📅',
    attendance: '✓'
  }
  return icons[props.activity.type] || '📌'
})
</script>

