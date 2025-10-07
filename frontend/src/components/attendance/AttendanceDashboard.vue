<template>
  <div class="attendance-dashboard">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="service-info">
          <h2 class="text-h5 text-weight-bold">
            {{ currentService?.name || 'No Service Selected' }}
          </h2>
          <p class="text-grey-6">
            {{ formatServiceDate(currentService?.service_date) }}
            <span v-if="currentService?.start_time">
              • {{ formatTime(currentService.start_time) }}
            </span>
          </p>
        </div>
        
        <div class="attendance-stats">
          <div class="stat-item">
            <div class="stat-value">{{ totalAttendance }}</div>
            <div class="stat-label">Total</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ memberCount }}</div>
            <div class="stat-label">Members</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ visitorCount }}</div>
            <div class="stat-label">Visitors</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Service Selector -->
    <div v-if="!currentService" class="service-selector">
      <q-card class="service-selector-card">
        <q-card-section>
          <div class="text-h6 text-center q-mb-md">Select a Service</div>
          
          <q-list class="service-list">
            <q-item
              v-for="service in todayServices"
              :key="service.id"
              clickable
              @click="selectService(service)"
              class="service-item"
            >
              <q-item-section avatar>
                <q-avatar :color="getServiceTypeColor(service.service_type)" text-color="white">
                  <q-icon :name="getServiceTypeIcon(service.service_type)" />
                </q-avatar>
              </q-item-section>
              
              <q-item-section>
                <q-item-label class="text-weight-medium">
                  {{ service.name }}
                </q-item-label>
                <q-item-label caption>
                  {{ formatTime(service.start_time) }}
                  <span v-if="service.end_time"> - {{ formatTime(service.end_time) }}</span>
                </q-item-label>
              </q-item-section>
              
              <q-item-section side>
                <q-chip 
                  :color="getServiceTypeColor(service.service_type)" 
                  text-color="white" 
                  size="sm"
                >
                  {{ getServiceTypeLabel(service.service_type) }}
                </q-chip>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>

    <!-- Attendance Overview -->
    <div v-else class="attendance-overview">
      <!-- Quick Stats Cards -->
      <div class="stats-grid">
        <q-card class="stat-card">
          <q-card-section>
            <div class="row items-center">
              <q-icon name="people" color="primary" size="32px" class="q-mr-md" />
              <div>
                <div class="text-h4 text-weight-bold">{{ totalAttendance }}</div>
                <div class="text-caption text-grey-6">Total Attendance</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
        
        <q-card class="stat-card">
          <q-card-section>
            <div class="row items-center">
              <q-icon name="person" color="positive" size="32px" class="q-mr-md" />
              <div>
                <div class="text-h4 text-weight-bold">{{ memberCount }}</div>
                <div class="text-caption text-grey-6">Members</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
        
        <q-card class="stat-card">
          <q-card-section>
            <div class="row items-center">
              <q-icon name="person_add" color="orange" size="32px" class="q-mr-md" />
              <div>
                <div class="text-h4 text-weight-bold">{{ visitorCount }}</div>
                <div class="text-caption text-grey-6">Visitors</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Recent Check-ins -->
      <q-card class="recent-checkins">
        <q-card-section>
          <div class="text-h6 q-mb-md">
            <q-icon name="history" class="q-mr-sm" />
            Recent Check-ins
          </div>
          
          <q-list v-if="currentServiceAttendance.length > 0" class="checkin-list">
            <q-item
              v-for="record in currentServiceAttendance.slice(0, 10)"
              :key="record.id"
              class="checkin-item"
            >
              <q-item-section avatar>
                <q-avatar 
                  :color="record.member_id ? 'primary' : 'orange'" 
                  text-color="white"
                >
                  <q-icon :name="record.member_id ? 'person' : 'person_add'" />
                </q-avatar>
              </q-item-section>
              
              <q-item-section>
                <q-item-label class="text-weight-medium">
                  {{ getRecordDisplayName(record) }}
                </q-item-label>
                <q-item-label caption>
                  {{ formatCheckInTime(record.check_in_time) }}
                  <span class="q-ml-sm">
                    <q-chip 
                      :color="getCheckInMethodColor(record.check_in_method)" 
                      text-color="white" 
                      size="xs"
                    >
                      {{ getCheckInMethodLabel(record.check_in_method) }}
                    </q-chip>
                  </span>
                </q-item-label>
              </q-item-section>
              
              <q-item-section side>
                <q-icon 
                  :name="getCheckInMethodIcon(record.check_in_method)" 
                  :color="getCheckInMethodColor(record.check_in_method)"
                />
              </q-item-section>
            </q-item>
          </q-list>
          
          <div v-else class="no-checkins">
            <q-icon name="event_available" size="48px" color="grey-5" />
            <p class="text-grey-6 q-mt-sm">No check-ins yet</p>
          </div>
        </q-card-section>
      </q-card>

      <!-- Check-in Methods -->
      <div class="checkin-methods">
        <div class="text-h6 q-mb-md">Check-in Methods</div>
        
        <div class="methods-grid">
          <q-card 
            class="method-card"
            @click="$emit('start-qr-scan')"
          >
            <q-card-section class="text-center">
              <q-icon name="qr_code_scanner" size="48px" color="primary" />
              <div class="text-h6 q-mt-sm">QR Code</div>
              <div class="text-caption text-grey-6">Scan member QR code</div>
            </q-card-section>
          </q-card>
          
          <q-card 
            class="method-card"
            @click="$emit('start-manual-checkin')"
          >
            <q-card-section class="text-center">
              <q-icon name="person_search" size="48px" color="positive" />
              <div class="text-h6 q-mt-sm">Manual</div>
              <div class="text-caption text-grey-6">Search for member</div>
            </q-card-section>
          </q-card>
          
          <q-card 
            class="method-card"
            @click="$emit('start-visitor-checkin')"
          >
            <q-card-section class="text-center">
              <q-icon name="person_add" size="48px" color="orange" />
              <div class="text-h6 q-mt-sm">Visitor</div>
              <div class="text-caption text-grey-6">Register new visitor</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Offline Indicator -->
    <div v-if="isOffline" class="offline-indicator">
      <q-banner class="bg-warning text-dark">
        <template v-slot:avatar>
          <q-icon name="wifi_off" />
        </template>
        You're offline. Check-ins will be saved locally and synced when online.
        <template v-slot:action>
          <q-btn flat label="Sync Now" @click="syncOfflineData" :loading="isSyncing" />
        </template>
      </q-banner>
    </div>

    <!-- Loading Overlay -->
    <q-inner-loading :showing="isLoading">
      <q-spinner-hourglass size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAttendanceStore } from '@/stores/attendance';
import type { Service, AttendanceRecord } from '@/types/attendance';

// Props
interface Props {
  currentService?: Service | null;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  'start-qr-scan': [];
  'start-manual-checkin': [];
  'start-visitor-checkin': [];
  'service-selected': [service: Service];
}>();

// Composables
const attendanceStore = useAttendanceStore();

// Computed
const {
  todayServices,
  currentServiceAttendance,
  memberAttendance,
  visitorAttendance,
  totalAttendance,
  memberCount,
  visitorCount,
  isLoading,
  isOffline
} = attendanceStore;

// Methods
const selectService = (service: Service) => {
  attendanceStore.setCurrentService(service);
  emit('service-selected', service);
};

const getServiceTypeColor = (type: string) => {
  const colors = {
    sunday_service: 'blue',
    midweek: 'green',
    special_event: 'purple'
  };
  return colors[type as keyof typeof colors] || 'grey';
};

const getServiceTypeIcon = (type: string) => {
  const icons = {
    sunday_service: 'church',
    midweek: 'groups',
    special_event: 'event'
  };
  return icons[type as keyof typeof icons] || 'event';
};

const getServiceTypeLabel = (type: string) => {
  const labels = {
    sunday_service: 'Sunday Service',
    midweek: 'Midweek',
    special_event: 'Special Event'
  };
  return labels[type as keyof typeof labels] || type;
};

const getRecordDisplayName = (record: AttendanceRecord) => {
  if (record.member_id && record.member) {
    return record.member.name;
  }
  return record.visitor_name || 'Unknown';
};

const getCheckInMethodColor = (method: string) => {
  const colors = {
    qr_code: 'blue',
    manual_search: 'green',
    visitor: 'orange'
  };
  return colors[method as keyof typeof colors] || 'grey';
};

const getCheckInMethodIcon = (method: string) => {
  const icons = {
    qr_code: 'qr_code',
    manual_search: 'person_search',
    visitor: 'person_add'
  };
  return icons[method as keyof typeof icons] || 'help';
};

const getCheckInMethodLabel = (method: string) => {
  const labels = {
    qr_code: 'QR Code',
    manual_search: 'Manual',
    visitor: 'Visitor'
  };
  return labels[method as keyof typeof labels] || method;
};

const formatServiceDate = (date?: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatTime = (time: string) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const formatCheckInTime = (time: string) => {
  const checkInTime = new Date(time);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - checkInTime.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  return checkInTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const syncOfflineData = async () => {
  await attendanceStore.syncOfflineAttendance();
};

// Lifecycle
onMounted(() => {
  // Load today's services
  attendanceStore.fetchTodayServices();
});
</script>

<style lang="sass" scoped>
.attendance-dashboard
  max-width: 100%
  margin: 0 auto

.dashboard-header
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)
  color: white
  border-radius: 12px
  padding: 24px
  margin-bottom: 24px
  
  .header-content
    display: flex
    justify-content: space-between
    align-items: center
    
    .service-info
      h2
        margin: 0 0 8px 0
        color: white
      
      p
        margin: 0
        color: rgba(255, 255, 255, 0.8)
    
    .attendance-stats
      display: flex
      gap: 24px
      
      .stat-item
        text-align: center
        
        .stat-value
          font-size: 32px
          font-weight: bold
          color: white
          line-height: 1
        
        .stat-label
          font-size: 14px
          color: rgba(255, 255, 255, 0.8)
          margin-top: 4px

.service-selector-card
  border-radius: 12px
  
  .service-list
    .service-item
      border-radius: 8px
      margin-bottom: 8px
      transition: all 0.2s ease
      
      &:hover
        background-color: rgba(25, 118, 210, 0.04)
        transform: translateY(-1px)
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)

.attendance-overview
  .stats-grid
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))
    gap: 16px
    margin-bottom: 24px
    
    .stat-card
      border-radius: 12px
      transition: all 0.2s ease
      
      &:hover
        transform: translateY(-2px)
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)

.recent-checkins
  border-radius: 12px
  margin-bottom: 24px
  
  .checkin-list
    .checkin-item
      border-radius: 8px
      margin-bottom: 8px
      transition: all 0.2s ease
      
      &:hover
        background-color: rgba(25, 118, 210, 0.04)
        transform: translateY(-1px)
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
  
  .no-checkins
    text-align: center
    padding: 40px 20px

.checkin-methods
  .methods-grid
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr))
    gap: 16px
    
    .method-card
      border-radius: 12px
      cursor: pointer
      transition: all 0.2s ease
      
      &:hover
        transform: translateY(-4px)
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15)

.offline-indicator
  position: fixed
  top: 0
  left: 0
  right: 0
  z-index: 1000
  
  .q-banner
    border-radius: 0

// Mobile optimizations
@media (max-width: 768px)
  .dashboard-header
    padding: 16px
    
    .header-content
      flex-direction: column
      align-items: flex-start
      gap: 16px
      
      .attendance-stats
        gap: 16px
        
        .stat-item
          .stat-value
            font-size: 24px
  
  .stats-grid
    grid-template-columns: 1fr
    gap: 12px
  
  .methods-grid
    grid-template-columns: repeat(3, 1fr)
    gap: 12px
    
    .method-card
      .q-card-section
        padding: 16px 8px
</style>
