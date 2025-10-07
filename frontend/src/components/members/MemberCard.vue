<template>
  <q-card class="member-card" flat bordered>
    <!-- Member Avatar and Basic Info -->
    <q-card-section class="text-center q-pb-none">
      <q-avatar size="80px" class="q-mb-md">
        <img
          v-if="member.avatar"
          :src="member.avatar"
          :alt="`${member.first_name} ${member.last_name}`"
        />
        <div
          v-else
          class="bg-primary text-white text-h4"
        >
          {{ memberInitials }}
        </div>
      </q-avatar>
      
      <div class="text-h6 text-weight-medium">
        {{ member.first_name }} {{ member.last_name }}
      </div>
      
      <div class="text-caption text-grey-6 q-mb-sm">
        {{ memberTypeLabel }}
        <q-chip
          v-if="!member.is_active"
          size="sm"
          color="orange"
          text-color="white"
          label="Inactive"
          class="q-ml-xs"
        />
      </div>
    </q-card-section>

    <!-- Contact Information -->
    <q-card-section class="q-pt-none">
      <div class="member-info">
        <!-- Email -->
        <div v-if="member.email" class="info-row">
          <q-icon name="email" size="16px" class="text-grey-6" />
          <span class="text-body2 q-ml-sm">{{ member.email }}</span>
        </div>
        
        <!-- Phone -->
        <div v-if="member.phone" class="info-row">
          <q-icon name="phone" size="16px" class="text-grey-6" />
          <span class="text-body2 q-ml-sm">{{ member.phone }}</span>
        </div>
        
        <!-- Family -->
        <div v-if="member.family" class="info-row">
          <q-icon name="family_restroom" size="16px" class="text-grey-6" />
          <span class="text-body2 q-ml-sm">{{ member.family.family_name }}</span>
        </div>
        
        <!-- Join Date -->
        <div class="info-row">
          <q-icon name="event" size="16px" class="text-grey-6" />
          <span class="text-body2 q-ml-sm">Joined {{ formatDate(member.join_date) }}</span>
        </div>
        
        <!-- Age (if date of birth available) -->
        <div v-if="memberAge" class="info-row">
          <q-icon name="cake" size="16px" class="text-grey-6" />
          <span class="text-body2 q-ml-sm">{{ memberAge }} years old</span>
        </div>
      </div>
    </q-card-section>

    <!-- Action Buttons -->
    <q-card-actions align="center" class="q-pt-none">
      <q-btn
        flat
        round
        color="primary"
        icon="visibility"
        size="sm"
        @click="$emit('view', member)"
      >
        <q-tooltip>View Details</q-tooltip>
      </q-btn>
      
      <q-btn
        flat
        round
        color="positive"
        icon="edit"
        size="sm"
        @click="$emit('edit', member)"
      >
        <q-tooltip>Edit Member</q-tooltip>
      </q-btn>
      
      <q-btn
        flat
        round
        color="negative"
        icon="delete"
        size="sm"
        @click="$emit('delete', member)"
      >
        <q-tooltip>Delete Member</q-tooltip>
      </q-btn>
      
      <!-- Quick Actions Menu -->
      <q-btn flat round color="grey-7" icon="more_vert" size="sm">
        <q-menu>
          <q-list style="min-width: 150px">
            <q-item clickable v-close-popup @click="toggleActiveStatus">
              <q-item-section avatar>
                <q-icon :name="member.is_active ? 'person_off' : 'person'" />
              </q-item-section>
              <q-item-section>
                {{ member.is_active ? 'Deactivate' : 'Activate' }}
              </q-item-section>
            </q-item>
            
            <q-item clickable v-close-popup @click="sendMessage">
              <q-item-section avatar>
                <q-icon name="message" />
              </q-item-section>
              <q-item-section>Send Message</q-item-section>
            </q-item>
            
            <q-item clickable v-close-popup @click="viewHistory">
              <q-item-section avatar>
                <q-icon name="history" />
              </q-item-section>
              <q-item-section>View History</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { date } from 'quasar'
import type { Member } from '@/types/member'

// Props
interface Props {
  member: Member
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  view: [member: Member]
  edit: [member: Member]
  delete: [member: Member]
  toggleStatus: [member: Member]
  sendMessage: [member: Member]
  viewHistory: [member: Member]
}>()

// Computed properties
const memberInitials = computed(() => {
  const first = props.member.first_name?.charAt(0) || ''
  const last = props.member.last_name?.charAt(0) || ''
  return (first + last).toUpperCase()
})

const memberTypeLabel = computed(() => {
  const typeMap = {
    adult: 'Adult',
    child: 'Child',
    youth: 'Youth',
    visitor: 'Visitor'
  }
  return typeMap[props.member.member_type] || 'Member'
})

const memberAge = computed(() => {
  if (!props.member.date_of_birth) return null
  
  const birthDate = new Date(props.member.date_of_birth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
})

// Methods
const formatDate = (dateString: string) => {
  return date.formatDate(dateString, 'MMM YYYY')
}

const toggleActiveStatus = () => {
  emit('toggleStatus', props.member)
}

const sendMessage = () => {
  emit('sendMessage', props.member)
}

const viewHistory = () => {
  emit('viewHistory', props.member)
}
</script>

<style scoped>
.member-card {
  transition: all 0.3s ease;
  height: 100%;
}

.member-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.member-info {
  min-height: 120px;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.q-avatar {
  border: 3px solid rgba(0, 0, 0, 0.1);
}
</style>
