<template>
  <q-card class="member-details-card">
    <!-- Header -->
    <q-card-section class="bg-primary text-white">
      <div class="row items-center">
        <div class="col">
          <div class="text-h5">Member Details</div>
          <div class="text-subtitle2 opacity-70">
            {{ member?.first_name }} {{ member?.last_name }}
          </div>
        </div>
        <div class="col-auto">
          <q-btn
            flat
            round
            icon="edit"
            color="white"
            @click="$emit('edit', member)"
          >
            <q-tooltip>Edit Member</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            icon="close"
            color="white"
            @click="$emit('close')"
          >
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card-section>

    <div class="row no-wrap" style="height: calc(100vh - 120px)">
      <!-- Main Content -->
      <div class="col-8 q-pa-md" style="overflow-y: auto">
        <!-- Member Avatar and Basic Info -->
        <div class="text-center q-mb-lg">
          <q-avatar size="120px" class="q-mb-md">
            <img
              v-if="member?.avatar"
              :src="member.avatar"
              :alt="`${member.first_name} ${member.last_name}`"
            />
            <div
              v-else
              class="bg-primary text-white text-h3"
            >
              {{ memberInitials }}
            </div>
          </q-avatar>
          
          <div class="text-h4 text-weight-medium">
            {{ member?.first_name }} {{ member?.last_name }}
          </div>
          
          <div class="text-subtitle1 text-grey-6 q-mb-sm">
            {{ memberTypeLabel }}
            <q-chip
              v-if="!member?.is_active"
              size="sm"
              color="orange"
              text-color="white"
              label="Inactive"
              class="q-ml-xs"
            />
          </div>
        </div>

        <!-- Personal Information -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-h6 q-mb-md">Personal Information</div>
            
            <div class="row q-gutter-md">
              <div class="col-md-6 col-sm-12">
                <q-field label="Email" stack-label readonly>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline">
                      {{ member?.email || 'Not provided' }}
                    </div>
                  </template>
                </q-field>
              </div>
              
              <div class="col-md-6 col-sm-12">
                <q-field label="Phone" stack-label readonly>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline">
                      {{ member?.phone || 'Not provided' }}
                    </div>
                  </template>
                </q-field>
              </div>
              
              <div class="col-md-6 col-sm-12">
                <q-field label="Date of Birth" stack-label readonly>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline">
                      {{ formatDate(member?.date_of_birth) || 'Not provided' }}
                      <span v-if="memberAge" class="text-grey-6 q-ml-sm">({{ memberAge }} years old)</span>
                    </div>
                  </template>
                </q-field>
              </div>
              
              <div class="col-md-6 col-sm-12">
                <q-field label="Gender" stack-label readonly>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline">
                      {{ formatGender(member?.gender) || 'Not specified' }}
                    </div>
                  </template>
                </q-field>
              </div>
              
              <div class="col-md-6 col-sm-12">
                <q-field label="Join Date" stack-label readonly>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline">
                      {{ formatDate(member?.join_date) }}
                    </div>
                  </template>
                </q-field>
              </div>
              
              <div class="col-md-6 col-sm-12">
                <q-field label="Status" stack-label readonly>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline">
                      <q-chip
                        :color="member?.is_active ? 'positive' : 'orange'"
                        text-color="white"
                        :label="member?.is_active ? 'Active' : 'Inactive'"
                      />
                    </div>
                  </template>
                </q-field>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Family Information -->
        <q-card v-if="member?.family" flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-h6 q-mb-md">Family Information</div>
            
            <div class="row q-gutter-md">
              <div class="col-md-6 col-sm-12">
                <q-field label="Family Name" stack-label readonly>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline">
                      {{ member.family.family_name }}
                    </div>
                  </template>
                </q-field>
              </div>
              
              <div class="col-md-6 col-sm-12">
                <q-field label="Head of Family" stack-label readonly>
                  <template v-slot:control>
                    <div class="self-center full-width no-outline">
                      {{ member.family.head_of_family ? 
                         `${member.family.head_of_family.first_name} ${member.family.head_of_family.last_name}` : 
                         'Not assigned' }}
                    </div>
                  </template>
                </q-field>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Address -->
        <q-card v-if="member?.address" flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-h6 q-mb-md">Address</div>
            <div class="text-body1">{{ member.address }}</div>
          </q-card-section>
        </q-card>

        <!-- Notes -->
        <q-card v-if="member?.notes" flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-h6 q-mb-md">Notes</div>
            <div class="text-body1">{{ member.notes }}</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Sidebar -->
      <div class="col-4 bg-grey-1 q-pa-md" style="overflow-y: auto">
        <!-- Quick Actions -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-h6 q-mb-md">Quick Actions</div>
            
            <div class="q-gutter-sm">
              <q-btn
                color="primary"
                icon="edit"
                label="Edit Member"
                @click="$emit('edit', member)"
                class="full-width"
                unelevated
              />
              
              <q-btn
                :color="member?.is_active ? 'orange' : 'positive'"
                :icon="member?.is_active ? 'person_off' : 'person'"
                :label="member?.is_active ? 'Deactivate' : 'Activate'"
                @click="toggleStatus"
                class="full-width"
                outline
              />
              
              <q-btn
                color="info"
                icon="message"
                label="Send Message"
                @click="sendMessage"
                class="full-width"
                outline
              />
              
              <q-btn
                color="secondary"
                icon="history"
                label="View History"
                @click="viewHistory"
                class="full-width"
                outline
              />
            </div>
          </q-card-section>
        </q-card>

        <!-- Member Statistics -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-h6 q-mb-md">Statistics</div>
            
            <div class="q-gutter-sm">
              <div class="row items-center">
                <div class="col">
                  <div class="text-caption text-grey-6">Member Since</div>
                  <div class="text-body2">{{ formatDate(member?.join_date) }}</div>
                </div>
              </div>
              
              <div class="row items-center">
                <div class="col">
                  <div class="text-caption text-grey-6">Days as Member</div>
                  <div class="text-body2">{{ daysSinceJoining }}</div>
                </div>
              </div>
              
              <div class="row items-center">
                <div class="col">
                  <div class="text-caption text-grey-6">Last Updated</div>
                  <div class="text-body2">{{ formatDateTime(member?.updated_at) }}</div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Recent Activity -->
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6 q-mb-md">Recent Activity</div>
            
            <div v-if="member?.history && member.history.length > 0" class="q-gutter-sm">
              <div
                v-for="activity in member.history.slice(0, 5)"
                :key="activity.id"
                class="activity-item"
              >
                <div class="text-caption text-grey-6">
                  {{ formatDateTime(activity.created_at) }}
                </div>
                <div class="text-body2">
                  {{ formatActivityType(activity.change_type) }}
                  <span v-if="activity.changed_by" class="text-grey-6">
                    by {{ activity.changed_by.name }}
                  </span>
                </div>
              </div>
            </div>
            
            <div v-else class="text-grey-6 text-center q-py-md">
              No recent activity
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { date } from 'quasar'
import type { Member } from '@/types/member'

// Props
interface Props {
  member: Member | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  edit: [member: Member]
  close: []
  toggleStatus: [member: Member]
  sendMessage: [member: Member]
  viewHistory: [member: Member]
}>()

// Computed properties
const memberInitials = computed(() => {
  if (!props.member) return ''
  const first = props.member.first_name?.charAt(0) || ''
  const last = props.member.last_name?.charAt(0) || ''
  return (first + last).toUpperCase()
})

const memberTypeLabel = computed(() => {
  if (!props.member) return ''
  const typeMap = {
    adult: 'Adult',
    child: 'Child',
    youth: 'Youth',
    visitor: 'Visitor'
  }
  return typeMap[props.member.member_type] || 'Member'
})

const memberAge = computed(() => {
  if (!props.member?.date_of_birth) return null
  
  const birthDate = new Date(props.member.date_of_birth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
})

const daysSinceJoining = computed(() => {
  if (!props.member?.join_date) return 0
  
  const joinDate = new Date(props.member.join_date)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - joinDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
})

// Methods
const formatDate = (dateString?: string | null) => {
  if (!dateString) return null
  return date.formatDate(dateString, 'MMMM D, YYYY')
}

const formatDateTime = (dateString?: string | null) => {
  if (!dateString) return null
  return date.formatDate(dateString, 'MMM D, YYYY h:mm A')
}

const formatGender = (gender?: string | null) => {
  if (!gender) return null
  return gender.charAt(0).toUpperCase() + gender.slice(1)
}

const formatActivityType = (changeType: string) => {
  const typeMap = {
    created: 'Member created',
    updated: 'Member updated',
    deleted: 'Member deleted',
    restored: 'Member restored'
  }
  return typeMap[changeType as keyof typeof typeMap] || changeType
}

const toggleStatus = () => {
  if (props.member) {
    emit('toggleStatus', props.member)
  }
}

const sendMessage = () => {
  if (props.member) {
    emit('sendMessage', props.member)
  }
}

const viewHistory = () => {
  if (props.member) {
    emit('viewHistory', props.member)
  }
}
</script>

<style scoped>
.member-details-card {
  height: 100vh;
  max-height: 100vh;
}

.activity-item {
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.activity-item:last-child {
  border-bottom: none;
}
</style>
