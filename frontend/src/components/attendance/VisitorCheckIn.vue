<template>
  <div class="visitor-checkin-container">
    <!-- Header -->
    <div class="checkin-header">
      <h3 class="text-h6 text-center q-mb-md">
        <q-icon name="person_add" class="q-mr-sm" />
        Visitor Check-in
      </h3>
      <p class="text-center text-grey-6">
        Register a new visitor for this service
      </p>
    </div>

    <!-- Visitor Form -->
    <q-form @submit="checkInVisitor" class="visitor-form">
      <div class="form-section">
        <div class="section-title">
          <q-icon name="person" class="q-mr-sm" />
          Personal Information
        </div>
        
        <div class="row q-gutter-sm q-mb-md">
          <div class="col">
            <q-input
              v-model="visitorForm.first_name"
              label="First Name"
              outlined
              :rules="[val => !!val || 'First name is required']"
              class="form-input"
            />
          </div>
          <div class="col">
            <q-input
              v-model="visitorForm.last_name"
              label="Last Name"
              outlined
              :rules="[val => !!val || 'Last name is required']"
              class="form-input"
            />
          </div>
        </div>
        
        <q-input
          v-model="visitorForm.phone"
          label="Phone Number"
          outlined
          :rules="[val => !!val || 'Phone number is required']"
          class="form-input q-mb-md"
        >
          <template v-slot:prepend>
            <q-icon name="phone" />
          </template>
        </q-input>
        
        <q-input
          v-model="visitorForm.email"
          label="Email (optional)"
          type="email"
          outlined
          class="form-input q-mb-md"
        >
          <template v-slot:prepend>
            <q-icon name="email" />
          </template>
        </q-input>
      </div>

      <div class="form-section">
        <div class="section-title">
          <q-icon name="home" class="q-mr-sm" />
          Address Information
        </div>
        
        <q-input
          v-model="visitorForm.address"
          label="Address (optional)"
          outlined
          type="textarea"
          rows="2"
          class="form-input q-mb-md"
        />
      </div>

      <div class="form-section">
        <div class="section-title">
          <q-icon name="info" class="q-mr-sm" />
          Additional Information
        </div>
        
        <q-select
          v-model="visitorForm.visit_reason"
          :options="visitReasonOptions"
          label="Reason for Visit"
          outlined
          class="form-input q-mb-md"
        />
        
        <q-input
          v-model="visitorForm.notes"
          label="Notes (optional)"
          outlined
          type="textarea"
          rows="2"
          placeholder="Any additional information about the visitor..."
          class="form-input q-mb-md"
        />
      </div>

      <div class="form-section">
        <div class="section-title">
          <q-icon name="group" class="q-mr-sm" />
          Accompanying Information
        </div>
        
        <q-input
          v-model.number="visitorForm.accompanying_count"
          label="Number of People"
          type="number"
          outlined
          :min="1"
          :max="20"
          class="form-input q-mb-md"
        >
          <template v-slot:prepend>
            <q-icon name="people" />
          </template>
        </q-input>
        
        <q-input
          v-model="visitorForm.accompanying_names"
          label="Names of Accompanying People (optional)"
          outlined
          type="textarea"
          rows="2"
          placeholder="Enter names separated by commas..."
          class="form-input q-mb-md"
        />
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <q-btn
          type="submit"
          color="primary"
          label="Check In Visitor"
          :loading="isCheckingIn"
          class="full-width"
          size="lg"
        />
        
        <q-btn
          color="grey"
          label="Cancel"
          @click="$emit('cancel')"
          outline
          class="full-width q-mt-sm"
        />
      </div>
    </q-form>

    <!-- Recent Visitors -->
    <div v-if="recentVisitors.length > 0" class="recent-visitors q-mt-lg">
      <div class="text-subtitle2 text-grey-8 q-mb-md">Recent Visitors</div>
      <q-list class="recent-visitors-list">
        <q-item
          v-for="visitor in recentVisitors"
          :key="visitor.id"
          clickable
          @click="selectRecentVisitor(visitor)"
          class="recent-visitor-item"
        >
          <q-item-section avatar>
            <q-avatar color="orange" text-color="white">
              {{ visitor.first_name.charAt(0) }}{{ visitor.last_name.charAt(0) }}
            </q-avatar>
          </q-item-section>
          
          <q-item-section>
            <q-item-label class="text-weight-medium">
              {{ visitor.first_name }} {{ visitor.last_name }}
            </q-item-label>
            <q-item-label caption>
              Last visit: {{ formatLastVisit(visitor.last_visit) }}
            </q-item-label>
          </q-item-section>
          
          <q-item-section side>
            <q-icon name="chevron_right" color="grey-5" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

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
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useAttendanceStore } from '@/stores/attendance';

// Props
interface Props {
  serviceId: number;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  'check-in-success': [data: any];
  'cancel': [];
}>();

// Composables
const $q = useQuasar();
const attendanceStore = useAttendanceStore();

// State
const visitorForm = ref({
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  address: '',
  visit_reason: '',
  notes: '',
  accompanying_count: 1,
  accompanying_names: ''
});

const recentVisitors = ref<any[]>([]);
const isCheckingIn = ref(false);
const error = ref<string | null>(null);

// Visit reason options
const visitReasonOptions = [
  'First time visitor',
  'Returning visitor',
  'Special event',
  'Wedding',
  'Funeral',
  'Baptism',
  'Other'
];

// Methods
const checkInVisitor = async () => {
  isCheckingIn.value = true;
  error.value = null;
  
  try {
    const attendance = await attendanceStore.recordAttendance({
      service_id: props.serviceId,
      visitor_name: `${visitorForm.value.first_name} ${visitorForm.value.last_name}`,
      visitor_phone: visitorForm.value.phone,
      check_in_method: 'visitor',
      check_in_time: new Date().toISOString(),
      notes: buildVisitorNotes()
    });
    
    // Emit success event
    emit('check-in-success', attendance);
    
    // Show success notification
    $q.notify({
      type: 'positive',
      message: `${visitorForm.value.first_name} ${visitorForm.value.last_name} checked in successfully!`,
      position: 'top',
      timeout: 3000
    });
    
    // Add to recent visitors
    addToRecentVisitors();
    
    // Reset form
    resetForm();
    
  } catch (err: any) {
    console.error('Visitor check-in error:', err);
    error.value = err.message || 'Failed to check in visitor';
  } finally {
    isCheckingIn.value = false;
  }
};

const buildVisitorNotes = () => {
  const notes = [];
  
  if (visitorForm.value.email) {
    notes.push(`Email: ${visitorForm.value.email}`);
  }
  
  if (visitorForm.value.address) {
    notes.push(`Address: ${visitorForm.value.address}`);
  }
  
  if (visitorForm.value.visit_reason) {
    notes.push(`Reason: ${visitorForm.value.visit_reason}`);
  }
  
  if (visitorForm.value.accompanying_count > 1) {
    notes.push(`Accompanying: ${visitorForm.value.accompanying_count} people`);
    
    if (visitorForm.value.accompanying_names) {
      notes.push(`Names: ${visitorForm.value.accompanying_names}`);
    }
  }
  
  if (visitorForm.value.notes) {
    notes.push(`Additional: ${visitorForm.value.notes}`);
  }
  
  return notes.join(' | ');
};

const addToRecentVisitors = () => {
  const visitor = {
    id: Date.now(),
    first_name: visitorForm.value.first_name,
    last_name: visitorForm.value.last_name,
    phone: visitorForm.value.phone,
    email: visitorForm.value.email,
    last_visit: new Date().toISOString()
  };
  
  recentVisitors.value.unshift(visitor);
  
  // Keep only last 5 visitors
  if (recentVisitors.value.length > 5) {
    recentVisitors.value = recentVisitors.value.slice(0, 5);
  }
};

const selectRecentVisitor = (visitor: any) => {
  visitorForm.value.first_name = visitor.first_name;
  visitorForm.value.last_name = visitor.last_name;
  visitorForm.value.phone = visitor.phone;
  visitorForm.value.email = visitor.email;
  
  $q.notify({
    type: 'info',
    message: 'Visitor information filled from recent visitor',
    position: 'top',
    timeout: 2000
  });
};

const resetForm = () => {
  visitorForm.value = {
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    address: '',
    visit_reason: '',
    notes: '',
    accompanying_count: 1,
    accompanying_names: ''
  };
};

const formatLastVisit = (date: string | null) => {
  if (!date) return 'Never';
  
  const visitDate = new Date(date);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - visitDate.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return visitDate.toLocaleDateString();
};

const clearError = () => {
  error.value = null;
};

// Lifecycle
onMounted(() => {
  // Load recent visitors from localStorage or API
  const stored = localStorage.getItem('recent_visitors');
  if (stored) {
    try {
      recentVisitors.value = JSON.parse(stored);
    } catch (err) {
      console.error('Failed to parse recent visitors:', err);
    }
  }
  
  // Mock recent visitors for demo
  if (recentVisitors.value.length === 0) {
    recentVisitors.value = [
      {
        id: 1,
        first_name: 'Sarah',
        last_name: 'Johnson',
        phone: '+1234567890',
        email: 'sarah.johnson@example.com',
        last_visit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        first_name: 'Michael',
        last_name: 'Brown',
        phone: '+1234567891',
        email: 'michael.brown@example.com',
        last_visit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }
});
</script>

<style lang="sass" scoped>
.visitor-checkin-container
  max-width: 100%
  margin: 0 auto

.form-section
  margin-bottom: 24px
  
  .section-title
    display: flex
    align-items: center
    font-weight: 500
    color: #1976d2
    margin-bottom: 16px
    font-size: 16px

.form-input
  .q-field__control
    border-radius: 8px

.form-actions
  margin-top: 32px
  padding-top: 24px
  border-top: 1px solid #e0e0e0

.recent-visitors
  .recent-visitor-item
    border-radius: 8px
    margin-bottom: 4px
    transition: all 0.2s ease
    
    &:hover
      background-color: rgba(255, 152, 0, 0.04)
      transform: translateY(-1px)
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)

.error-message
  .q-banner
    border-radius: 8px

// Mobile optimizations
@media (max-width: 768px)
  .visitor-checkin-container
    padding: 0 8px
  
  .form-section
    margin-bottom: 20px
    
    .section-title
      font-size: 14px
      margin-bottom: 12px
  
  .form-actions
    margin-top: 24px
    padding-top: 16px

// Form validation styles
.q-field--error
  .q-field__control
    border-color: #f44336 !important

.q-field--focused
  .q-field__control
    border-color: #1976d2 !important
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2)
</style>
