<template>
  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <q-card>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="members" label="Recent Members" />
        <q-tab name="attendance" label="Attendance" />
        <q-tab name="events" label="Upcoming Events" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="members">
          <div class="text-h6 q-mb-md">Recent Member Registrations</div>
          <q-list>
            <q-item v-for="member in recentMembers" :key="member.id" clickable v-ripple>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="member.avatar" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ member.name }}</q-item-label>
                <q-item-label caption>{{ member.role }} • Joined {{ member.joinDate }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-chip :color="member.status === 'active' ? 'positive' : 'warning'" text-color="white" size="sm">
                  {{ member.status }}
                </q-chip>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="attendance">
          <div class="text-h6 q-mb-md">Weekly Attendance Summary</div>
          <q-list>
            <q-item v-for="service in attendanceData" :key="service.date" clickable v-ripple>
              <q-item-section avatar>
                <q-icon :name="service.icon" :color="service.color" size="md" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ service.name }}</q-item-label>
                <q-item-label caption>{{ service.date }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="text-right">
                  <div class="text-h6">{{ service.attendance }}</div>
                  <div class="text-caption text-grey-6">attendees</div>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="events">
          <div class="text-h6 q-mb-md">Upcoming Church Events</div>
          <q-list>
            <q-item v-for="event in upcomingEvents" :key="event.id" clickable v-ripple>
              <q-item-section avatar>
                <q-icon :name="event.icon" :color="event.color" size="md" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ event.name }}</q-item-label>
                <q-item-label caption>{{ event.date }} • {{ event.time }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-chip :color="event.priority" text-color="white" size="sm">
                  {{ event.type }}
                </q-chip>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('members')

const recentMembers = ref([
  {
    id: 1,
    name: 'John Doe',
    role: 'Member',
    joinDate: '2 days ago',
    status: 'active',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png'
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'Volunteer',
    joinDate: '1 week ago',
    status: 'pending',
    avatar: 'https://cdn.quasar.dev/img/avatar6.jpg'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    role: 'Member',
    joinDate: '2 weeks ago',
    status: 'active',
    avatar: 'https://cdn.quasar.dev/team/jeff_galbraith.jpg'
  }
])

const attendanceData = ref([
  {
    name: 'Sunday Service',
    date: 'Last Sunday',
    attendance: 245,
    icon: 'church',
    color: 'primary'
  },
  {
    name: 'Wednesday Prayer',
    date: 'This Wednesday',
    attendance: 89,
    icon: 'favorite',
    color: 'secondary'
  },
  {
    name: 'Youth Meeting',
    date: 'Friday',
    attendance: 67,
    icon: 'group',
    color: 'accent'
  }
])

const upcomingEvents = ref([
  {
    id: 1,
    name: 'Easter Celebration',
    date: 'March 31, 2024',
    time: '10:00 AM',
    type: 'Service',
    priority: 'primary',
    icon: 'celebration',
    color: 'primary'
  },
  {
    id: 2,
    name: 'Community Outreach',
    date: 'April 5, 2024',
    time: '2:00 PM',
    type: 'Outreach',
    priority: 'secondary',
    icon: 'volunteer_activism',
    color: 'secondary'
  },
  {
    id: 3,
    name: 'Bible Study',
    date: 'April 10, 2024',
    time: '7:00 PM',
    type: 'Study',
    priority: 'accent',
    icon: 'menu_book',
    color: 'accent'
  }
])
</script>
