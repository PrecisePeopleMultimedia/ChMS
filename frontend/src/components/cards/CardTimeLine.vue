<template>
  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <q-card>
      <q-card-section>
        <div class="text-h6 q-mb-md">Recent Church Activities</div>
      </q-card-section>

      <q-card-section class="q-pa-none">
        <q-timeline color="primary">
          <q-timeline-entry
            v-for="activity in activities"
            :key="activity.id"
            :title="activity.title"
            :subtitle="activity.time"
            :icon="activity.icon"
            :color="activity.color"
          >
            <div class="text-body2 q-mb-sm">{{ activity.description }}</div>
            <div v-if="activity.details" class="text-caption text-grey-6">
              {{ activity.details }}
            </div>
            <div v-if="activity.participants" class="q-mt-sm">
              <q-chip
                v-for="participant in activity.participants"
                :key="participant"
                size="sm"
                color="grey-3"
                text-color="grey-8"
                class="q-mr-xs"
              >
                {{ participant }}
              </q-chip>
            </div>
          </q-timeline-entry>
        </q-timeline>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat color="primary" label="View All Activities" icon="history" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Activity {
  id: number
  title: string
  description: string
  time: string
  icon: string
  color: string
  details?: string
  participants?: string[]
}

const activities = ref<Activity[]>([
  {
    id: 1,
    title: 'Sunday Service Completed',
    description: 'Morning worship service with 245 attendees',
    time: '2 hours ago',
    icon: 'church',
    color: 'primary',
    details: 'Pastor John delivered sermon on "Faith and Hope"',
    participants: ['Pastor John', 'Worship Team', '245 Members']
  },
  {
    id: 2,
    title: 'New Member Registration',
    description: 'Sarah Johnson joined the church family',
    time: '1 day ago',
    icon: 'person_add',
    color: 'positive',
    details: 'Completed orientation and baptism scheduling'
  },
  {
    id: 3,
    title: 'Youth Group Meeting',
    description: 'Weekly youth gathering with 35 participants',
    time: '2 days ago',
    icon: 'group',
    color: 'secondary',
    details: 'Topic: "Living as Young Christians in Modern World"',
    participants: ['Youth Pastor', '35 Youth Members']
  },
  {
    id: 4,
    title: 'Community Outreach',
    description: 'Food distribution to local families in need',
    time: '3 days ago',
    icon: 'volunteer_activism',
    color: 'accent',
    details: 'Served 50 families with food packages and prayers',
    participants: ['Outreach Team', '15 Volunteers']
  },
  {
    id: 5,
    title: 'Prayer Meeting',
    description: 'Wednesday evening prayer and worship',
    time: '4 days ago',
    icon: 'favorite',
    color: 'warning',
    details: 'Focused prayers for church growth and community healing',
    participants: ['Prayer Team', '67 Members']
  },
  {
    id: 6,
    title: 'Bible Study Session',
    description: 'Weekly Bible study on the Book of Romans',
    time: '5 days ago',
    icon: 'menu_book',
    color: 'info',
    details: 'Chapter 8: "Life in the Spirit" - Deep discussion and insights',
    participants: ['Bible Study Leader', '28 Members']
  }
])
</script>

<style lang="sass" scoped>
.q-timeline
  .q-timeline__content
    padding-bottom: 24px
</style>
