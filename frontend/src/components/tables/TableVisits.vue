<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Member Attendance Overview</div>
      <div class="text-subtitle2 text-grey-6">Recent church service attendance tracking</div>
    </q-card-section>

    <q-card-section class="q-pa-none">
      <q-table
        :rows="attendanceData"
        :columns="columns"
        row-key="id"
        :pagination="pagination"
        :loading="loading"
        flat
        bordered
      >
        <template v-slot:body-cell-member="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-sm">
              <q-avatar size="32px">
                <img :src="props.row.avatar" />
              </q-avatar>
              <div>
                <div class="text-weight-medium">{{ props.row.name }}</div>
                <div class="text-caption text-grey-6">{{ props.row.role }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="getStatusColor(props.value)"
              text-color="white"
              size="sm"
            >
              {{ props.value }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-attendance="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-sm">
              <q-circular-progress
                :value="props.value"
                size="30px"
                :thickness="0.2"
                :color="getAttendanceColor(props.value)"
                track-color="grey-3"
              />
              <span class="text-weight-medium">{{ props.value }}%</span>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat round dense icon="visibility" color="primary" size="sm">
              <q-tooltip>View Details</q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="edit" color="secondary" size="sm">
              <q-tooltip>Edit Member</q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="email" color="accent" size="sm">
              <q-tooltip>Send Message</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)

const pagination = ref({
  page: 1,
  rowsPerPage: 10
})

const columns = [
  {
    name: 'member',
    required: true,
    label: 'Member',
    align: 'left' as const,
    field: 'name',
    sortable: true
  },
  {
    name: 'lastVisit',
    align: 'center' as const,
    label: 'Last Visit',
    field: 'lastVisit',
    sortable: true
  },
  {
    name: 'attendance',
    align: 'center' as const,
    label: 'Attendance Rate',
    field: 'attendanceRate',
    sortable: true
  },
  {
    name: 'status',
    align: 'center' as const,
    label: 'Status',
    field: 'status',
    sortable: true
  },
  {
    name: 'joinDate',
    align: 'center' as const,
    label: 'Member Since',
    field: 'joinDate',
    sortable: true
  },
  {
    name: 'actions',
    align: 'center' as const,
    label: 'Actions',
    field: 'actions'
  }
]

const attendanceData = ref([
  {
    id: 1,
    name: 'John Doe',
    role: 'Elder',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    lastVisit: 'Today',
    attendanceRate: 95,
    status: 'Active',
    joinDate: 'Jan 2020'
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'Volunteer',
    avatar: 'https://cdn.quasar.dev/img/avatar6.jpg',
    lastVisit: 'Yesterday',
    attendanceRate: 87,
    status: 'Active',
    joinDate: 'Mar 2021'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    role: 'Member',
    avatar: 'https://cdn.quasar.dev/team/jeff_galbraith.jpg',
    lastVisit: '3 days ago',
    attendanceRate: 72,
    status: 'Active',
    joinDate: 'Jul 2022'
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    role: 'Youth Leader',
    avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
    lastVisit: '1 week ago',
    attendanceRate: 45,
    status: 'Inactive',
    joinDate: 'Sep 2023'
  },
  {
    id: 5,
    name: 'David Brown',
    role: 'Member',
    avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
    lastVisit: '2 weeks ago',
    attendanceRate: 23,
    status: 'Inactive',
    joinDate: 'Nov 2023'
  }
])

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active': return 'positive'
    case 'inactive': return 'negative'
    case 'pending': return 'warning'
    default: return 'grey'
  }
}

const getAttendanceColor = (rate: number) => {
  if (rate >= 80) return 'positive'
  if (rate >= 60) return 'warning'
  return 'negative'
}
</script>
