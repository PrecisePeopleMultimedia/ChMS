<template>
  <div class="member-checkin-container">
    <!-- Header -->
    <div class="checkin-header">
      <h3 class="text-h6 text-center q-mb-md">
        <q-icon name="person_search" class="q-mr-sm" />
        Member Check-in
      </h3>
      <p class="text-center text-grey-6">
        Search for a member to check them in
      </p>
    </div>

    <!-- Search Form -->
    <div class="search-form q-mb-lg">
      <q-input
        v-model="searchQuery"
        label="Search members..."
        outlined
        clearable
        @input="searchMembers"
        @clear="clearSearch"
        :loading="isSearching"
        class="search-input"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append v-if="searchQuery">
          <q-icon name="clear" class="cursor-pointer" @click="clearSearch" />
        </template>
      </q-input>
    </div>

    <!-- Search Results -->
    <div v-if="searchResults.length > 0" class="search-results">
      <div class="text-caption text-grey-6 q-mb-sm">
        {{ searchResults.length }} member(s) found
      </div>
      
      <q-list class="member-list">
        <q-item
          v-for="member in searchResults"
          :key="member.id"
          clickable
          @click="selectMember(member)"
          class="member-item"
        >
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">
              {{ member.first_name.charAt(0) }}{{ member.last_name.charAt(0) }}
            </q-avatar>
          </q-item-section>
          
          <q-item-section>
            <q-item-label class="text-weight-medium">
              {{ member.first_name }} {{ member.last_name }}
            </q-item-label>
            <q-item-label caption>
              {{ member.email }}
            </q-item-label>
            <q-item-label caption v-if="member.phone">
              <q-icon name="phone" size="12px" class="q-mr-xs" />
              {{ member.phone }}
            </q-item-label>
          </q-item-section>
          
          <q-item-section side>
            <q-chip 
              :color="getRoleColor(member.role)" 
              text-color="white" 
              size="sm"
            >
              {{ member.role }}
            </q-chip>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- No Results -->
    <div v-else-if="searchQuery && !isSearching" class="no-results">
      <q-icon name="person_off" size="48px" color="grey-5" />
      <p class="text-grey-6 q-mt-sm">No members found</p>
      <q-btn 
        color="primary" 
        label="Add New Member" 
        @click="showAddMemberDialog = true"
        outline
        class="q-mt-md"
      />
    </div>

    <!-- Selected Member -->
    <div v-if="selectedMember" class="selected-member">
      <q-card class="selected-member-card">
        <q-card-section>
          <div class="row items-center">
            <q-avatar size="48px" color="primary" text-color="white" class="q-mr-md">
              {{ selectedMember.first_name.charAt(0) }}{{ selectedMember.last_name.charAt(0) }}
            </q-avatar>
            <div class="col">
              <div class="text-h6">{{ selectedMember.first_name }} {{ selectedMember.last_name }}</div>
              <div class="text-caption text-grey-6">{{ selectedMember.email }}</div>
              <q-chip 
                :color="getRoleColor(selectedMember.role)" 
                text-color="white" 
                size="sm"
                class="q-mt-xs"
              >
                {{ selectedMember.role }}
              </q-chip>
            </div>
          </div>
        </q-card-section>
        
        <q-card-actions>
          <q-btn 
            color="primary" 
            label="Check In" 
            @click="checkInMember"
            :loading="isCheckingIn"
            class="full-width"
            size="lg"
          />
          <q-btn 
            color="grey" 
            label="Cancel" 
            @click="clearSelection"
            outline
            class="full-width q-mt-sm"
          />
        </q-card-actions>
      </q-card>
    </div>

    <!-- Recent Members -->
    <div v-if="!searchQuery && !selectedMember" class="recent-members">
      <div class="text-subtitle2 text-grey-8 q-mb-md">Recent Members</div>
      <q-list class="recent-members-list">
        <q-item
          v-for="member in recentMembers"
          :key="member.id"
          clickable
          @click="selectMember(member)"
          class="recent-member-item"
        >
          <q-item-section avatar>
            <q-avatar color="grey-3" text-color="grey-8">
              {{ member.first_name.charAt(0) }}{{ member.last_name.charAt(0) }}
            </q-avatar>
          </q-item-section>
          
          <q-item-section>
            <q-item-label class="text-weight-medium">
              {{ member.first_name }} {{ member.last_name }}
            </q-item-label>
            <q-item-label caption>
              Last checked in: {{ formatLastCheckIn(member.last_check_in) }}
            </q-item-label>
          </q-item-section>
          
          <q-item-section side>
            <q-icon name="chevron_right" color="grey-5" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Add Member Dialog -->
    <q-dialog v-model="showAddMemberDialog">
      <q-card class="add-member-dialog" style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Add New Member</div>
        </q-card-section>
        
        <q-card-section>
          <q-form @submit="addNewMember" class="q-gutter-md">
            <div class="row q-gutter-sm">
              <div class="col">
                <q-input
                  v-model="newMember.first_name"
                  label="First Name"
                  outlined
                  :rules="[val => !!val || 'First name is required']"
                />
              </div>
              <div class="col">
                <q-input
                  v-model="newMember.last_name"
                  label="Last Name"
                  outlined
                  :rules="[val => !!val || 'Last name is required']"
                />
              </div>
            </div>
            
            <q-input
              v-model="newMember.email"
              label="Email"
              type="email"
              outlined
              :rules="[val => !!val || 'Email is required', val => /.+@.+\..+/.test(val) || 'Invalid email']"
            />
            
            <q-input
              v-model="newMember.phone"
              label="Phone (optional)"
              outlined
            />
            
            <q-select
              v-model="newMember.role"
              :options="roleOptions"
              label="Role"
              outlined
              :rules="[val => !!val || 'Role is required']"
            />
          </q-form>
        </q-card-section>
        
        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="showAddMemberDialog = false" />
          <q-btn 
            color="primary" 
            label="Add Member" 
            @click="addNewMember"
            :loading="isAddingMember"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Error Messages -->
    <div v-if="error" class="error-message q-mt-md">
      <q-banner class="bg-negative text-white">
        <template v-slot:avatar>
          <q-icon name="error" />
        </template>
        {{ error }}
        <template v-slot:action>
          <q-btn flat label="Dismiss" @click="clearError" />
        </template>
      </q-banner>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useAttendanceStore } from '@/stores/attendance';
import type { User, MemberFormData } from '@/types/attendance';

// Props
interface Props {
  serviceId: number;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  'check-in-success': [data: any];
}>();

// Composables
const $q = useQuasar();
const attendanceStore = useAttendanceStore();

// State
const searchQuery = ref('');
const searchResults = ref<User[]>([]);
const selectedMember = ref<User | null>(null);
const recentMembers = ref<User[]>([]);
const isSearching = ref(false);
const isCheckingIn = ref(false);
const error = ref<string | null>(null);
const showAddMemberDialog = ref(false);
const isAddingMember = ref(false);

// New member form
const newMember = ref<MemberFormData>({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  role: 'member'
});

// Role options
const roleOptions = [
  { label: 'Member', value: 'member' },
  { label: 'Staff', value: 'staff' },
  { label: 'Admin', value: 'admin' }
];

// Computed
const getRoleColor = (role: string) => {
  const colors = {
    admin: 'red',
    staff: 'orange',
    member: 'blue'
  };
  return colors[role as keyof typeof colors] || 'grey';
};

// Methods
const searchMembers = async () => {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    searchResults.value = [];
    return;
  }
  
  isSearching.value = true;
  error.value = null;
  
  try {
    // This would typically call an API endpoint
    // For now, we'll simulate the search
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock search results
    searchResults.value = [
      {
        id: 1,
        organization_id: 1,
        name: 'John Doe',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        role: 'member',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        organization_id: 1,
        name: 'Jane Smith',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+1234567891',
        role: 'staff',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ].filter(member => 
      member.first_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      member.last_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
    
  } catch (err: any) {
    console.error('Member search error:', err);
    error.value = 'Failed to search members';
  } finally {
    isSearching.value = false;
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
  selectedMember.value = null;
};

const selectMember = (member: User) => {
  selectedMember.value = member;
  searchQuery.value = '';
  searchResults.value = [];
};

const clearSelection = () => {
  selectedMember.value = null;
};

const checkInMember = async () => {
  if (!selectedMember.value) return;
  
  isCheckingIn.value = true;
  error.value = null;
  
  try {
    const attendance = await attendanceStore.recordAttendance({
      service_id: props.serviceId,
      member_id: selectedMember.value.id,
      check_in_method: 'manual_search',
      check_in_time: new Date().toISOString()
    });
    
    // Emit success event
    emit('check-in-success', attendance);
    
    // Show success notification
    $q.notify({
      type: 'positive',
      message: `${selectedMember.value.first_name} ${selectedMember.value.last_name} checked in successfully!`,
      position: 'top',
      timeout: 3000
    });
    
    // Clear selection
    selectedMember.value = null;
    
  } catch (err: any) {
    console.error('Check-in error:', err);
    error.value = err.message || 'Failed to check in member';
  } finally {
    isCheckingIn.value = false;
  }
};

const addNewMember = async () => {
  isAddingMember.value = true;
  error.value = null;
  
  try {
    // This would typically call an API endpoint
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock new member creation
    const newMemberData: User = {
      id: Date.now(),
      organization_id: 1,
      name: `${newMember.value.first_name} ${newMember.value.last_name}`,
      first_name: newMember.value.first_name,
      last_name: newMember.value.last_name,
      email: newMember.value.email,
      phone: newMember.value.phone,
      role: newMember.value.role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to recent members
    recentMembers.value.unshift(newMemberData);
    
    // Show success notification
    $q.notify({
      type: 'positive',
      message: 'Member added successfully!',
      position: 'top',
      timeout: 3000
    });
    
    // Close dialog and reset form
    showAddMemberDialog.value = false;
    newMember.value = {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: 'member'
    };
    
  } catch (err: any) {
    console.error('Add member error:', err);
    error.value = err.message || 'Failed to add member';
  } finally {
    isAddingMember.value = false;
  }
};

const formatLastCheckIn = (date: string | null) => {
  if (!date) return 'Never';
  
  const checkInDate = new Date(date);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - checkInDate.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return checkInDate.toLocaleDateString();
};

const clearError = () => {
  error.value = null;
};

// Lifecycle
onMounted(() => {
  // Load recent members
  recentMembers.value = [
    {
      id: 1,
      organization_id: 1,
      name: 'John Doe',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      role: 'member',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_check_in: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      organization_id: 1,
      name: 'Jane Smith',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1234567891',
      role: 'staff',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_check_in: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
});
</script>

<style lang="sass" scoped>
.member-checkin-container
  max-width: 100%
  margin: 0 auto

.search-input
  .q-field__control
    border-radius: 12px

.member-list
  .member-item
    border-radius: 8px
    margin-bottom: 8px
    transition: all 0.2s ease
    
    &:hover
      background-color: rgba(25, 118, 210, 0.04)
      transform: translateY(-1px)
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)

.no-results
  text-align: center
  padding: 40px 20px

.selected-member-card
  border-left: 4px solid #4CAF50
  border-radius: 12px

.recent-members
  .recent-member-item
    border-radius: 8px
    margin-bottom: 4px
    transition: all 0.2s ease
    
    &:hover
      background-color: rgba(158, 158, 158, 0.04)

.add-member-dialog
  .q-card-section
    padding: 20px

// Mobile optimizations
@media (max-width: 768px)
  .member-checkin-container
    padding: 0 8px
  
  .member-item
    padding: 12px 16px
  
  .selected-member-card
    margin: 0 -8px
</style>
