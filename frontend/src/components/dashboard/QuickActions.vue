<template>
  <ModernCard>
    <ModernCardHeader>
      <ModernCardTitle>Quick Actions</ModernCardTitle>
      <ModernCardDescription>
        Common tasks and shortcuts
      </ModernCardDescription>
    </ModernCardHeader>
    <ModernCardContent>
      <div :class="['grid gap-3', gridCols]">
        <ModernButton
          v-for="action in actions"
          :key="action.id"
          variant="outline"
          :class="[
            'h-auto flex-col gap-2 p-4 touch-target relative',
            action.disabled && 'opacity-50 cursor-not-allowed'
          ]"
          :disabled="action.disabled"
          @click="action.onClick"
        >
          <q-badge
            v-if="action.badge"
            color="destructive"
            :label="action.badge"
            class="absolute top-2 right-2"
          />
          <q-icon :name="action.icon" class="h-6 w-6" />
          <span class="text-xs text-center">{{ action.label }}</span>
        </ModernButton>
      </div>
    </ModernCardContent>
  </ModernCard>
</template>

<script setup lang="ts">
import ModernCard from '@/components/ui/ModernCard.vue'
import ModernCardHeader from '@/components/ui/ModernCardHeader.vue'
import ModernCardTitle from '@/components/ui/ModernCardTitle.vue'
import ModernCardDescription from '@/components/ui/ModernCardDescription.vue'
import ModernCardContent from '@/components/ui/ModernCardContent.vue'
import ModernButton from '@/components/ui/ModernButton.vue'
import { computed } from 'vue'

export interface QuickAction {
  id: string
  label: string
  icon: string
  color?: string
  onClick: () => void
  badge?: string
  disabled?: boolean
}

interface Props {
  actions?: QuickAction[]
  columns?: number
}

const props = withDefaults(defineProps<Props>(), {
  columns: 4,
  actions: () => [
    {
      id: 'add-member',
      label: 'Add Member',
      icon: 'person_add',
      color: 'primary',
      onClick: () => console.log('Add member'),
    },
    {
      id: 'record-attendance',
      label: 'Record Attendance',
      icon: 'checklist',
      color: 'success',
      onClick: () => console.log('Record attendance'),
    },
    {
      id: 'create-event',
      label: 'Create Event',
      icon: 'event',
      color: 'info',
      onClick: () => console.log('Create event'),
    },
    {
      id: 'send-message',
      label: 'Send Message',
      icon: 'message',
      color: 'accent',
      onClick: () => console.log('Send message'),
      badge: '3',
    },
    {
      id: 'record-giving',
      label: 'Record Giving',
      icon: 'payments',
      color: 'primary',
      onClick: () => console.log('Record giving'),
    },
    {
      id: 'manage-groups',
      label: 'Manage Groups',
      icon: 'groups',
      color: 'info',
      onClick: () => console.log('Manage groups'),
    },
    {
      id: 'generate-report',
      label: 'Generate Report',
      icon: 'description',
      color: 'accent',
      onClick: () => console.log('Generate report'),
    },
    {
      id: 'view-analytics',
      label: 'View Analytics',
      icon: 'analytics',
      color: 'success',
      onClick: () => console.log('View analytics'),
    },
  ]
})

const gridCols = computed(() => {
  const cols: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 lg:grid-cols-5',
  }
  return cols[props.columns] || 'grid-cols-2 lg:grid-cols-4'
})
</script>

<style scoped>
.touch-target {
  min-height: 48px;
  min-width: 48px;
}
</style>

