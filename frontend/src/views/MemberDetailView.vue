<template>
  <q-page class="member-detail-page">
    <div class="q-pa-md" v-if="member">
      <!-- Header -->
      <div class="row items-center justify-between q-mb-md">
        <div class="row items-center q-gutter-md">
          <q-btn
            icon="arrow_back"
            @click="$router.push('/members')"
            flat
            round
          />
          <div>
            <h1 class="text-h4 q-ma-none">
              {{ member.first_name }} {{ member.last_name }}
            </h1>
            <p class="text-body2 text-grey-6 q-ma-none">
              Member Details
            </p>
          </div>
        </div>
        <div class="row q-gutter-sm">
          <q-btn
            color="primary"
            icon="edit"
            label="Edit"
            @click="$router.push(`/members/${member.id}/edit`)"
          />
          <q-btn
            color="grey-7"
            icon="more_vert"
            flat
          >
            <q-menu>
              <q-list dense>
                <q-item clickable @click="toggleMemberStatus">
                  <q-item-section>
                    {{ member.is_active ? 'Deactivate' : 'Activate' }}
                  </q-item-section>
                </q-item>
                <q-item clickable @click="deleteMember" class="text-negative">
                  <q-item-section>Delete</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>

      <div class="row q-gutter-md">
        <!-- Main Content -->
        <div class="col-12 col-md-8">
          <!-- Basic Information -->
          <q-card flat bordered class="q-mb-md">
            <q-card-section>
              <div class="row items-center q-mb-md">
                <q-avatar size="80px" color="primary" text-color="white" class="q-mr-md">
                  {{ getInitials(member.first_name, member.last_name) }}
                </q-avatar>
                <div>
                  <div class="text-h5">
                    {{ member.first_name }} {{ member.last_name }}
                  </div>
                  <div class="text-subtitle1 text-grey-6">
                    {{ getMemberTypeLabel(member.member_type) }}
                  </div>
                  <q-chip
                    :color="member.is_active ? 'positive' : 'negative'"
                    text-color="white"
                    size="sm"
                  >
                    {{ member.is_active ? 'Active' : 'Inactive' }}
                  </q-chip>
                </div>
              </div>

              <div class="row q-gutter-md">
                <div class="col-12 col-md-6">
                  <q-list dense>
                    <q-item v-if="member.email">
                      <q-item-section avatar>
                        <q-icon name="email" color="primary" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ member.email }}</q-item-label>
                        <q-item-label caption>Email</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item v-if="member.phone">
                      <q-item-section avatar>
                        <q-icon name="phone" color="primary" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ member.phone }}</q-item-label>
                        <q-item-label caption>Phone</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item v-if="member.date_of_birth">
                      <q-item-section avatar>
                        <q-icon name="cake" color="primary" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ formatDate(member.date_of_birth) }}</q-item-label>
                        <q-item-label caption>Date of Birth (Age: {{ calculateAge(member.date_of_birth) }})</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>

                <div class="col-12 col-md-6">
                  <q-list dense>
                    <q-item v-if="member.gender">
                      <q-item-section avatar>
                        <q-icon name="person" color="primary" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ getGenderLabel(member.gender) }}</q-item-label>
                        <q-item-label caption>Gender</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item v-if="member.joined_date">
                      <q-item-section avatar>
                        <q-icon name="event" color="primary" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ formatDate(member.joined_date) }}</q-item-label>
                        <q-item-label caption>Joined Date</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item v-if="member.family">
                      <q-item-section avatar>
                        <q-icon name="family_restroom" color="primary" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ member.family.family_name }}</q-item-label>
                        <q-item-label caption>Family</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>

              <div v-if="member.address" class="q-mt-md">
                <q-item dense>
                  <q-item-section avatar>
                    <q-icon name="location_on" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ member.address }}</q-item-label>
                    <q-item-label caption>Address</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </q-card-section>
          </q-card>

          <!-- Custom Attributes -->
          <MemberAttributesPanel
            v-if="member.custom_attributes && member.custom_attributes.length > 0"
            :member-id="member.id"
            class="q-mb-md"
          />

          <!-- Member Badges -->
          <MemberBadges
            :member-id="member.id"
            class="q-mb-md"
          />

          <!-- Member Notes -->
          <MemberNotes
            :member-id="member.id"
            class="q-mb-md"
          />
        </div>

        <!-- Sidebar -->
        <div class="col-12 col-md-4">
          <!-- Quick Stats -->
          <q-card flat bordered class="q-mb-md">
            <q-card-section>
              <div class="text-h6 q-mb-md">Quick Stats</div>
              
              <div class="row q-gutter-md">
                <div class="col-6">
                  <div class="text-center">
                    <div class="text-h4 text-primary">{{ memberStats.totalNotes }}</div>
                    <div class="text-caption">Notes</div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-center">
                    <div class="text-h4 text-secondary">{{ memberStats.totalBadges }}</div>
                    <div class="text-caption">Badges</div>
                  </div>
                </div>
              </div>
              
              <div class="row q-gutter-md q-mt-md">
                <div class="col-6">
                  <div class="text-center">
                    <div class="text-h4 text-accent">{{ memberStats.attendanceRate }}%</div>
                    <div class="text-caption">Attendance</div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-center">
                    <div class="text-h4 text-info">{{ memberStats.daysSinceJoined }}</div>
                    <div class="text-caption">Days Member</div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Recent Activity -->
          <q-card flat bordered class="q-mb-md">
            <q-card-section>
              <div class="text-h6 q-mb-md">Recent Activity</div>
              
              <q-timeline color="primary" side="right" layout="dense">
                <q-timeline-entry
                  v-for="activity in recentActivity"
                  :key="activity.id"
                  :title="activity.title"
                  :subtitle="activity.date"
                  :icon="activity.icon"
                  :color="activity.color"
                >
                  <div class="text-caption">{{ activity.description }}</div>
                </q-timeline-entry>
              </q-timeline>

              <div v-if="recentActivity.length === 0" class="text-center text-grey-6">
                <q-icon name="history" size="48px" class="q-mb-sm" />
                <div>No recent activity</div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Quick Actions -->
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6 q-mb-md">Quick Actions</div>
              
              <div class="column q-gutter-sm">
                <q-btn
                  color="primary"
                  icon="note_add"
                  label="Add Note"
                  @click="addNote"
                  outline
                  class="full-width"
                />
                
                <q-btn
                  color="secondary"
                  icon="badge"
                  label="Assign Badge"
                  @click="assignBadge"
                  outline
                  class="full-width"
                />
                
                <q-btn
                  color="accent"
                  icon="email"
                  label="Send Email"
                  @click="sendEmail"
                  outline
                  class="full-width"
                  :disable="!member.email"
                />
                
                <q-btn
                  color="info"
                  icon="phone"
                  label="Call Member"
                  @click="callMember"
                  outline
                  class="full-width"
                  :disable="!member.phone"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner size="60px" color="primary" />
    </div>

    <!-- Error State -->
    <div v-else class="flex flex-center q-pa-xl">
      <div class="text-center">
        <q-icon name="error" size="64px" color="negative" class="q-mb-md" />
        <div class="text-h6">Member not found</div>
        <q-btn
          color="primary"
          label="Back to Members"
          @click="$router.push('/members')"
          class="q-mt-md"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useMembersStore } from '@/stores/members'
import MemberAttributesPanel from '@/components/members/MemberAttributesPanel.vue'
import MemberBadges from '@/components/members/MemberBadges.vue'
import MemberNotes from '@/components/members/MemberNotes.vue'

// Composables
const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const membersStore = useMembersStore()

// Local state
const member = ref<any>(null)
const loading = ref(true)
const recentActivity = ref([
  {
    id: 1,
    title: 'Attended Sunday Service',
    description: 'Present at morning worship',
    date: '2 days ago',
    icon: 'church',
    color: 'positive'
  },
  {
    id: 2,
    title: 'Note Added',
    description: 'Follow-up conversation completed',
    date: '1 week ago',
    icon: 'note',
    color: 'primary'
  }
])

// Computed
const memberId = computed(() => route.params.id as string)

const memberStats = computed(() => {
  if (!member.value) return {
    totalNotes: 0,
    totalBadges: 0,
    attendanceRate: 0,
    daysSinceJoined: 0
  }

  const joinedDate = new Date(member.value.joined_date || member.value.created_at)
  const daysSinceJoined = Math.floor((Date.now() - joinedDate.getTime()) / (1000 * 60 * 60 * 24))

  return {
    totalNotes: member.value.notes?.length || 0,
    totalBadges: member.value.badges?.length || 0,
    attendanceRate: 85, // TODO: Calculate from attendance data
    daysSinceJoined
  }
})

// Methods
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

const getMemberTypeLabel = (type: string) => {
  return membersStore.memberTypes[type] || type
}

const getGenderLabel = (gender: string) => {
  return membersStore.genders[gender] || gender
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const calculateAge = (dateOfBirth: string) => {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

const loadMember = async () => {
  loading.value = true
  
  try {
    member.value = await membersStore.fetchMember(memberId.value)
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load member details'
    })
  } finally {
    loading.value = false
  }
}

const toggleMemberStatus = async () => {
  try {
    await membersStore.updateMember(member.value.id, {
      is_active: !member.value.is_active
    })
    
    member.value.is_active = !member.value.is_active
    
    $q.notify({
      type: 'positive',
      message: `Member ${member.value.is_active ? 'activated' : 'deactivated'} successfully`
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to update member status'
    })
  }
}

const deleteMember = () => {
  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete ${member.value.first_name} ${member.value.last_name}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await membersStore.deleteMember(member.value.id)
      $q.notify({
        type: 'positive',
        message: 'Member deleted successfully'
      })
      router.push('/members')
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Failed to delete member'
      })
    }
  })
}

const addNote = () => {
  // TODO: Implement add note functionality
  $q.notify({
    type: 'info',
    message: 'Add note functionality coming soon'
  })
}

const assignBadge = () => {
  // TODO: Implement assign badge functionality
  $q.notify({
    type: 'info',
    message: 'Assign badge functionality coming soon'
  })
}

const sendEmail = () => {
  if (member.value.email) {
    window.open(`mailto:${member.value.email}`)
  }
}

const callMember = () => {
  if (member.value.phone) {
    window.open(`tel:${member.value.phone}`)
  }
}

// Lifecycle
onMounted(() => {
  loadMember()
})
</script>

<style scoped>
.member-detail-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
