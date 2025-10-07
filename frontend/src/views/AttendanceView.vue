<template>
  <q-page class="attendance-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="text-h4 text-weight-bold">Attendance Management</h1>
          <p class="text-grey-6">Record and manage church attendance</p>
        </div>
        
        <div class="header-actions">
          <q-btn
            color="primary"
            icon="add"
            label="New Service"
            @click="showNewServiceDialog = true"
            class="q-mr-sm"
          />
          <q-btn
            color="secondary"
            icon="refresh"
            label="Refresh"
            @click="refreshData"
            :loading="isLoading"
          />
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="attendance-content">
      <!-- Attendance Dashboard -->
      <AttendanceDashboard
        :current-service="currentService"
        @service-selected="handleServiceSelected"
        @start-qr-scan="startQRScan"
        @start-manual-checkin="startManualCheckIn"
        @start-visitor-checkin="startVisitorCheckIn"
      />

      <!-- Check-in Modal -->
      <q-dialog v-model="showCheckInModal" :maximized="$q.screen.lt.md">
        <q-card class="checkin-modal">
          <q-card-section class="modal-header">
            <div class="text-h6">{{ currentCheckInMode.title }}</div>
            <q-btn
              icon="close"
              flat
              round
              @click="closeCheckInModal"
            />
          </q-card-section>
          
          <q-card-section class="modal-content">
            <!-- QR Scanner -->
            <AttendanceScanner
              v-if="currentCheckInMode.type === 'qr'"
              :service-id="currentService?.id || 0"
              @check-in-success="handleCheckInSuccess"
              @switch-to-manual="switchToManualCheckIn"
            />
            
            <!-- Manual Check-in -->
            <MemberCheckIn
              v-else-if="currentCheckInMode.type === 'manual'"
              :service-id="currentService?.id || 0"
              @check-in-success="handleCheckInSuccess"
            />
            
            <!-- Visitor Check-in -->
            <VisitorCheckIn
              v-else-if="currentCheckInMode.type === 'visitor'"
              :service-id="currentService?.id || 0"
              @check-in-success="handleCheckInSuccess"
              @cancel="closeCheckInModal"
            />
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- New Service Dialog -->
      <q-dialog v-model="showNewServiceDialog">
        <q-card class="new-service-dialog" style="min-width: 500px">
          <q-card-section>
            <div class="text-h6">Create New Service</div>
          </q-card-section>
          
          <q-card-section>
            <q-form @submit="createService" class="q-gutter-md">
              <q-input
                v-model="newService.name"
                label="Service Name"
                outlined
                :rules="[val => !!val || 'Service name is required']"
              />
              
              <div class="row q-gutter-sm">
                <div class="col">
                  <q-input
                    v-model="newService.service_date"
                    label="Service Date"
                    type="date"
                    outlined
                    :rules="[val => !!val || 'Service date is required']"
                  />
                </div>
                <div class="col">
                  <q-input
                    v-model="newService.start_time"
                    label="Start Time"
                    type="time"
                    outlined
                    :rules="[val => !!val || 'Start time is required']"
                  />
                </div>
              </div>
              
              <q-input
                v-model="newService.end_time"
                label="End Time (optional)"
                type="time"
                outlined
              />
              
              <q-select
                v-model="newService.service_type"
                :options="serviceTypeOptions"
                label="Service Type"
                outlined
                :rules="[val => !!val || 'Service type is required']"
              />
            </q-form>
          </q-card-section>
          
          <q-card-actions align="right">
            <q-btn flat label="Cancel" @click="showNewServiceDialog = false" />
            <q-btn 
              color="primary" 
              label="Create Service" 
              @click="createService"
              :loading="isCreatingService"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Attendance Reports -->
      <div v-if="currentService" class="attendance-reports q-mt-lg">
        <q-card class="reports-card">
          <q-card-section>
            <div class="text-h6 q-mb-md">
              <q-icon name="bar_chart" class="q-mr-sm" />
              Attendance Reports
            </div>
            
            <div class="reports-grid">
              <q-card 
                class="report-card"
                @click="exportAttendanceReport"
              >
                <q-card-section class="text-center">
                  <q-icon name="download" size="32px" color="primary" />
                  <div class="text-subtitle1 q-mt-sm">Export Report</div>
                  <div class="text-caption text-grey-6">Download attendance data</div>
                </q-card-section>
              </q-card>
              
              <q-card 
                class="report-card"
                @click="viewAttendanceStats"
              >
                <q-card-section class="text-center">
                  <q-icon name="analytics" size="32px" color="positive" />
                  <div class="text-subtitle1 q-mt-sm">View Stats</div>
                  <div class="text-caption text-grey-6">Attendance analytics</div>
                </q-card-section>
              </q-card>
              
              <q-card 
                class="report-card"
                @click="printAttendanceList"
              >
                <q-card-section class="text-center">
                  <q-icon name="print" size="32px" color="orange" />
                  <div class="text-subtitle1 q-mt-sm">Print List</div>
                  <div class="text-caption text-grey-6">Print attendance list</div>
                </q-card-section>
              </q-card>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Success Notifications -->
    <q-banner
      v-if="successMessage"
      class="bg-positive text-white success-banner"
      @click="clearSuccessMessage"
    >
      <template v-slot:avatar>
        <q-icon name="check_circle" />
      </template>
      {{ successMessage }}
      <template v-slot:action>
        <q-btn flat label="Dismiss" @click="clearSuccessMessage" />
      </template>
    </q-banner>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useAttendanceStore } from '@/stores/attendance';
import AttendanceDashboard from '@/components/attendance/AttendanceDashboard.vue';
import AttendanceScanner from '@/components/attendance/AttendanceScanner.vue';
import MemberCheckIn from '@/components/attendance/MemberCheckIn.vue';
import VisitorCheckIn from '@/components/attendance/VisitorCheckIn.vue';
import type { Service, ServiceFormData } from '@/types/attendance';

// Composables
const $q = useQuasar();
const attendanceStore = useAttendanceStore();

// State
const currentService = ref<Service | null>(null);
const showCheckInModal = ref(false);
const showNewServiceDialog = ref(false);
const currentCheckInMode = ref({
  type: '',
  title: ''
});
const successMessage = ref<string | null>(null);
const isCreatingService = ref(false);

// New service form
const newService = ref<ServiceFormData>({
  name: '',
  service_date: '',
  start_time: '',
  end_time: '',
  service_type: 'sunday_service'
});

// Service type options
const serviceTypeOptions = [
  { label: 'Sunday Service', value: 'sunday_service' },
  { label: 'Midweek Service', value: 'midweek' },
  { label: 'Special Event', value: 'special_event' }
];

// Computed
const isLoading = computed(() => attendanceStore.isLoading);

// Methods
const handleServiceSelected = (service: Service) => {
  currentService.value = service;
};

const startQRScan = () => {
  currentCheckInMode.value = {
    type: 'qr',
    title: 'QR Code Check-in'
  };
  showCheckInModal.value = true;
};

const startManualCheckIn = () => {
  currentCheckInMode.value = {
    type: 'manual',
    title: 'Manual Check-in'
  };
  showCheckInModal.value = true;
};

const startVisitorCheckIn = () => {
  currentCheckInMode.value = {
    type: 'visitor',
    title: 'Visitor Check-in'
  };
  showCheckInModal.value = true;
};

const switchToManualCheckIn = () => {
  currentCheckInMode.value = {
    type: 'manual',
    title: 'Manual Check-in'
  };
};

const closeCheckInModal = () => {
  showCheckInModal.value = false;
  currentCheckInMode.value = {
    type: '',
    title: ''
  };
};

const handleCheckInSuccess = (attendance: any) => {
  // Close modal
  closeCheckInModal();
  
  // Show success message
  successMessage.value = 'Check-in recorded successfully!';
  
  // Refresh attendance data
  if (currentService.value) {
    attendanceStore.fetchAttendanceForService(currentService.value.id);
  }
  
  // Auto-hide success message
  setTimeout(() => {
    clearSuccessMessage();
  }, 3000);
};

const createService = async () => {
  isCreatingService.value = true;
  
  try {
    const service = await attendanceStore.createService(newService.value);
    
    // Show success notification
    $q.notify({
      type: 'positive',
      message: 'Service created successfully!',
      position: 'top',
      timeout: 3000
    });
    
    // Close dialog and reset form
    showNewServiceDialog.value = false;
    newService.value = {
      name: '',
      service_date: '',
      start_time: '',
      end_time: '',
      service_type: 'sunday_service'
    };
    
    // Refresh services
    await attendanceStore.fetchTodayServices();
    
  } catch (err: any) {
    console.error('Service creation error:', err);
    $q.notify({
      type: 'negative',
      message: err.message || 'Failed to create service',
      position: 'top',
      timeout: 3000
    });
  } finally {
    isCreatingService.value = false;
  }
};

const refreshData = async () => {
  await attendanceStore.fetchTodayServices();
  
  if (currentService.value) {
    await attendanceStore.fetchAttendanceForService(currentService.value.id);
  }
};

const exportAttendanceReport = () => {
  $q.notify({
    type: 'info',
    message: 'Export feature coming soon!',
    position: 'top',
    timeout: 2000
  });
};

const viewAttendanceStats = () => {
  $q.notify({
    type: 'info',
    message: 'Analytics feature coming soon!',
    position: 'top',
    timeout: 2000
  });
};

const printAttendanceList = () => {
  $q.notify({
    type: 'info',
    message: 'Print feature coming soon!',
    position: 'top',
    timeout: 2000
  });
};

const clearSuccessMessage = () => {
  successMessage.value = null;
};

// Lifecycle
onMounted(() => {
  // Load today's services
  attendanceStore.fetchTodayServices();
});
</script>

<style lang="sass" scoped>
.attendance-page
  padding: 24px
  max-width: 1200px
  margin: 0 auto

.page-header
  margin-bottom: 32px
  
  .header-content
    display: flex
    justify-content: space-between
    align-items: center
    
    .header-info
      h1
        margin: 0 0 8px 0
      
      p
        margin: 0

.attendance-content
  .checkin-modal
    width: 100%
    max-width: 800px
    
    .modal-header
      display: flex
      justify-content: space-between
      align-items: center
      border-bottom: 1px solid #e0e0e0
      padding-bottom: 16px
    
    .modal-content
      max-height: 70vh
      overflow-y: auto

.new-service-dialog
  .q-card-section
    padding: 20px

.attendance-reports
  .reports-grid
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr))
    gap: 16px
    
    .report-card
      border-radius: 12px
      cursor: pointer
      transition: all 0.2s ease
      
      &:hover
        transform: translateY(-4px)
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15)

.success-banner
  position: fixed
  top: 0
  left: 0
  right: 0
  z-index: 1000
  border-radius: 0

// Mobile optimizations
@media (max-width: 768px)
  .attendance-page
    padding: 16px
  
  .page-header
    .header-content
      flex-direction: column
      align-items: flex-start
      gap: 16px
      
      .header-actions
        width: 100%
        display: flex
        gap: 8px
        
        .q-btn
          flex: 1
  
  .checkin-modal
    .modal-content
      max-height: 60vh
  
  .reports-grid
    grid-template-columns: repeat(3, 1fr)
    gap: 12px
    
    .report-card
      .q-card-section
        padding: 16px 8px
</style>
