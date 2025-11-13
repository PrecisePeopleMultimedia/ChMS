<template>
  <ModernCard>
    <ModernCardHeader>
      <ModernCardTitle>Recent Activity</ModernCardTitle>
      <ModernCardDescription>
        Latest updates and events
      </ModernCardDescription>
    </ModernCardHeader>
    <ModernCardContent>
      <div class="space-y-4 max-h-[400px] overflow-y-auto">
        <div
          v-for="activity in activities"
          :key="activity.id"
          class="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div
            :class="[
              'h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0',
              getActivityIconColor(activity.type)
            ]"
          >
            <q-icon :name="getActivityIcon(activity.type)" class="h-5 w-5" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <p class="text-sm font-medium">{{ activity.title }}</p>
              <ModernBadge
                v-if="activity.metadata"
                variant="outline"
                class="text-xs"
              >
                {{ formatMetadata(activity.metadata) }}
              </ModernBadge>
            </div>
            <p class="text-sm text-muted-foreground">{{ activity.description }}</p>
            <div class="flex items-center gap-2 mt-1">
              <q-avatar v-if="activity.user" size="20px">
                <img v-if="activity.user.avatar" :src="activity.user.avatar" :alt="activity.user.name" />
                <q-icon v-else name="person" />
              </q-avatar>
              <span v-if="activity.user" class="text-xs text-muted-foreground">
                {{ activity.user.name }}
              </span>
              <span class="text-xs text-muted-foreground">{{ activity.timestamp }}</span>
            </div>
          </div>
        </div>
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
import ModernBadge from '@/components/ui/ModernBadge.vue'

export type ActivityType =
  | 'member_joined'
  | 'event_created'
  | 'donation_received'
  | 'group_created'
  | 'attendance_recorded'
  | 'message_sent'
  | 'task_completed'
  | 'alert'

export interface Activity {
  id: string
  type: ActivityType
  title: string
  description: string
  user?: {
    name: string
    avatar?: string
  }
  timestamp: string
  metadata?: Record<string, any>
}

interface Props {
  activities?: Activity[]
}

const props = withDefaults(defineProps<Props>(), {
  activities: () => [
    {
      id: '1',
      type: 'member_joined',
      title: 'New Member Joined',
      description: 'Sarah Johnson joined the church family',
      user: { name: 'Sarah Johnson', avatar: '' },
      timestamp: '5 minutes ago',
    },
    {
      id: '2',
      type: 'donation_received',
      title: 'Donation Received',
      description: '₦50,000 received from Building Fund campaign',
      timestamp: '15 minutes ago',
      metadata: { amount: 50000, campaign: 'Building Fund' },
    },
    {
      id: '3',
      type: 'event_created',
      title: 'Event Scheduled',
      description: 'Youth Conference 2024 created for next month',
      user: { name: 'Pastor John', avatar: '' },
      timestamp: '1 hour ago',
    },
    {
      id: '4',
      type: 'attendance_recorded',
      title: 'Attendance Updated',
      description: '342 members attended Sunday Service',
      timestamp: '2 hours ago',
    },
  ]
})

const getActivityIcon = (type: ActivityType): string => {
  const icons: Record<ActivityType, string> = {
    member_joined: 'person_add',
    event_created: 'event',
    donation_received: 'payments',
    group_created: 'groups',
    attendance_recorded: 'check_circle',
    message_sent: 'message',
    task_completed: 'task_alt',
    alert: 'warning',
  }
  return icons[type] || 'info'
}

const getActivityIconColor = (type: ActivityType): string => {
  const colors: Record<ActivityType, string> = {
    member_joined: 'bg-primary/10 text-primary',
    event_created: 'bg-info/10 text-info',
    donation_received: 'bg-success/10 text-success',
    group_created: 'bg-accent/10 text-accent',
    attendance_recorded: 'bg-primary/10 text-primary',
    message_sent: 'bg-info/10 text-info',
    task_completed: 'bg-success/10 text-success',
    alert: 'bg-warning/10 text-warning',
  }
  return colors[type] || 'bg-muted text-muted-foreground'
}

const formatMetadata = (metadata: Record<string, any>): string => {
  if (metadata.amount) {
    return `₦${metadata.amount.toLocaleString()}`
  }
  if (metadata.campaign) {
    return metadata.campaign
  }
  return ''
}
</script>

