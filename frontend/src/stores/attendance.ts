import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { offlineStorage } from '@/services/offlineStorage';
import type { 
  Service, 
  AttendanceRecord, 
  MemberQrCode, 
  AttendanceStats,
  ServiceStats 
} from '@/types/attendance';

const API_URL = import.meta.env.VITE_API_URL;

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

export const useAttendanceStore = defineStore('attendance', () => {
  // State
  const services = ref<Service[]>([]);
  const attendanceRecords = ref<AttendanceRecord[]>([]);
  const currentService = ref<Service | null>(null);
  const qrCodes = ref<MemberQrCode[]>([]);
  const stats = ref<AttendanceStats | null>(null);
  const serviceStats = ref<ServiceStats | null>(null);
  
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isOffline = ref(false);
  const pendingSync = ref<AttendanceRecord[]>([]);

  // Computed
  const todayServices = computed(() => 
    services.value.filter(service => 
      new Date(service.service_date).toDateString() === new Date().toDateString()
    )
  );

  const upcomingServices = computed(() => 
    services.value.filter(service => 
      new Date(service.service_date) > new Date()
    )
  );

  const currentServiceAttendance = computed(() => 
    currentService.value 
      ? attendanceRecords.value.filter(record => record.service_id === currentService.value!.id)
      : []
  );

  const memberAttendance = computed(() => 
    currentServiceAttendance.value.filter(record => record.member_id)
  );

  const visitorAttendance = computed(() => 
    currentServiceAttendance.value.filter(record => !record.member_id)
  );

  const totalAttendance = computed(() => currentServiceAttendance.value.length);
  const memberCount = computed(() => memberAttendance.value.length);
  const visitorCount = computed(() => visitorAttendance.value.length);

  // Actions
  const fetchServices = async (params?: any) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await axios.get('/services', { params });
      services.value = response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch services';
      console.error('Services fetch error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchTodayServices = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await axios.get('/services/today');
      services.value = response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch today\'s services';
      console.error('Today services fetch error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchUpcomingServices = async (days = 7) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await axios.get('/services/upcoming', { 
        params: { days } 
      });
      services.value = response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch upcoming services';
      console.error('Upcoming services fetch error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const createService = async (serviceData: Partial<Service>) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await axios.post('/services', serviceData);
      const newService = response.data.data;
      services.value.unshift(newService);
      return newService;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create service';
      console.error('Service creation error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const setCurrentService = (service: Service | null) => {
    currentService.value = service;
    if (service) {
      fetchAttendanceForService(service.id);
    }
  };

  const fetchAttendanceForService = async (serviceId: number) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await axios.get('/attendance', {
        params: { service_id: serviceId }
      });
      attendanceRecords.value = response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch attendance';
      console.error('Attendance fetch error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const recordAttendance = async (attendanceData: Partial<AttendanceRecord>) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await axios.post('/attendance', attendanceData);
      const newRecord = response.data.data;
      attendanceRecords.value.unshift(newRecord);
      return newRecord;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to record attendance';
      console.error('Attendance recording error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const checkInWithQr = async (qrCodeData: string, serviceId: number) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await axios.post('/attendance/checkin/qr', {
        qr_code_data: qrCodeData,
        service_id: serviceId
      });
      const newRecord = response.data.data;
      attendanceRecords.value.unshift(newRecord);
      return newRecord;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'QR check-in failed';
      console.error('QR check-in error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchAttendanceStats = async (startDate?: string, endDate?: string) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await axios.get('/attendance/summary', {
        params: { start_date: startDate, end_date: endDate }
      });
      stats.value = response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch attendance stats';
      console.error('Stats fetch error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchServiceStats = async (serviceId: number) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await axios.get(`/services/${serviceId}/stats`);
      serviceStats.value = response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch service stats';
      console.error('Service stats fetch error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const generateQrCode = async (memberId: number, expirationDays = 365) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await axios.post('/qr-codes/generate', {
        member_id: memberId,
        expiration_days: expirationDays
      });
      const qrCode = response.data.data;
      qrCodes.value.push(qrCode);
      return qrCode;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to generate QR code';
      console.error('QR code generation error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const validateQrCode = async (qrCodeData: string) => {
    try {
      const response = await axios.post('/qr-codes/validate', {
        qr_code_data: qrCodeData
      });
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'QR code validation failed');
    }
  };

  // Offline functionality
  const saveOfflineAttendance = async (attendanceData: Partial<AttendanceRecord>) => {
    const offlineRecord: AttendanceRecord = {
      ...attendanceData,
      id: Date.now(), // Temporary ID for offline records
      check_in_time: new Date().toISOString(),
      is_offline: true,
    } as AttendanceRecord;
    
    pendingSync.value.push(offlineRecord);
    attendanceRecords.value.unshift(offlineRecord);
    
    // Save to IndexedDB
    await saveToOfflineStorage(offlineRecord);
  };

  const syncOfflineAttendance = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Use offline storage service to sync
      await offlineStorage.syncPendingRecords();
      
      // Update pending sync list
      const offlineRecords = await offlineStorage.getOfflineAttendanceRecords();
      pendingSync.value = offlineRecords;
      
      // Refresh attendance records
      if (currentService.value) {
        await fetchAttendanceForService(currentService.value.id);
      }
      
    } catch (err: any) {
      error.value = 'Failed to sync offline attendance';
      console.error('Offline sync error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const saveToOfflineStorage = async (record: AttendanceRecord) => {
    try {
      await offlineStorage.saveAttendanceRecord(record);
    } catch (err) {
      console.error('Failed to save to offline storage:', err);
    }
  };

  const loadFromOfflineStorage = async () => {
    try {
      const offlineRecords = await offlineStorage.getOfflineAttendanceRecords();
      pendingSync.value = offlineRecords;
      
      // Update isOffline status
      isOffline.value = !offlineStorage.getOnlineStatus();
    } catch (err) {
      console.error('Failed to load from offline storage:', err);
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    services,
    attendanceRecords,
    currentService,
    qrCodes,
    stats,
    serviceStats,
    isLoading,
    error,
    isOffline,
    pendingSync,
    
    // Computed
    todayServices,
    upcomingServices,
    currentServiceAttendance,
    memberAttendance,
    visitorAttendance,
    totalAttendance,
    memberCount,
    visitorCount,
    
    // Actions
    fetchServices,
    fetchTodayServices,
    fetchUpcomingServices,
    createService,
    setCurrentService,
    fetchAttendanceForService,
    recordAttendance,
    checkInWithQr,
    fetchAttendanceStats,
    fetchServiceStats,
    generateQrCode,
    validateQrCode,
    saveOfflineAttendance,
    syncOfflineAttendance,
    saveToOfflineStorage,
    loadFromOfflineStorage,
    clearError,
  };
});
