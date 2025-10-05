import { ref, computed, readonly } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import type { User } from '@/types/auth'

const API_URL = import.meta.env.VITE_API_URL

// Configure axios defaults
axios.defaults.baseURL = API_URL
axios.defaults.withCredentials = true

export interface DashboardStats {
  totalMembers: number
  newMembersThisMonth: number
  activeMembers: number
  todayAttendance: number
  weeklyAverage: number
  monthlyTrend: number
  upcomingEvents: number
  recentEvents: number
  systemStatus: 'online' | 'offline'
  lastSync: string
  pendingSync: number
}

export interface ActivityItem {
  id: string
  type: 'member_added' | 'attendance_recorded' | 'event_created' | 'profile_updated'
  description: string
  user: string
  timestamp: string
  icon: string
  color: string
}

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const stats = ref<DashboardStats>({
    totalMembers: 0,
    newMembersThisMonth: 0,
    activeMembers: 0,
    todayAttendance: 0,
    weeklyAverage: 0,
    monthlyTrend: 0,
    upcomingEvents: 0,
    recentEvents: 0,
    systemStatus: 'online',
    lastSync: new Date().toISOString(),
    pendingSync: 0
  })

  const activities = ref<ActivityItem[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)

  // Computed
  const isOnline = computed(() => stats.value.systemStatus === 'online')
  const hasPendingSync = computed(() => stats.value.pendingSync > 0)
  const recentActivities = computed(() => activities.value.slice(0, 5))

  // Actions
  const fetchDashboardData = async (): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      // Fetch dashboard statistics
      const statsResponse = await axios.get('/dashboard/stats')
      stats.value = {
        ...stats.value,
        ...statsResponse.data
      }

      // Fetch recent activities
      const activitiesResponse = await axios.get('/dashboard/activities')
      activities.value = activitiesResponse.data

      lastUpdated.value = new Date()
    } catch (err: any) {
      console.error('Dashboard data fetch failed:', err)
      error.value = err.response?.data?.message || 'Failed to fetch dashboard data'
      
      // Set offline status if network error
      if (err.code === 'NETWORK_ERROR' || err.response?.status >= 500) {
        stats.value.systemStatus = 'offline'
      }
    } finally {
      isLoading.value = false
    }
  }

  const refreshData = async (): Promise<void> => {
    await fetchDashboardData()
  }

  const syncOfflineData = async (): Promise<void> => {
    try {
      isLoading.value = true
      
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      stats.value.pendingSync = 0
      stats.value.systemStatus = 'online'
      stats.value.lastSync = new Date().toISOString()
    } catch (err: any) {
      console.error('Sync failed:', err)
      error.value = 'Failed to sync offline data'
    } finally {
      isLoading.value = false
    }
  }

  const addActivity = (activity: Omit<ActivityItem, 'id' | 'timestamp'>): void => {
    const newActivity: ActivityItem = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    }
    
    activities.value.unshift(newActivity)
    
    // Keep only last 50 activities
    if (activities.value.length > 50) {
      activities.value = activities.value.slice(0, 50)
    }
  }

  const updateStats = (updates: Partial<DashboardStats>): void => {
    stats.value = { ...stats.value, ...updates }
  }

  const setOnlineStatus = (status: 'online' | 'offline'): void => {
    stats.value.systemStatus = status
    if (status === 'online') {
      stats.value.lastSync = new Date().toISOString()
    }
  }

  const incrementPendingSync = (): void => {
    stats.value.pendingSync += 1
  }

  const clearPendingSync = (): void => {
    stats.value.pendingSync = 0
  }

  // Initialize dashboard data
  const initializeDashboard = async (): Promise<void> => {
    try {
      await fetchDashboardData()
    } catch (err) {
      console.warn('Dashboard initialization failed:', err)
      // Continue with cached/default data
    }
  }

  return {
    // State
    stats: readonly(stats),
    activities: readonly(activities),
    isLoading: readonly(isLoading),
    error: readonly(error),
    lastUpdated: readonly(lastUpdated),
    
    // Computed
    isOnline,
    hasPendingSync,
    recentActivities,
    
    // Actions
    fetchDashboardData,
    refreshData,
    syncOfflineData,
    addActivity,
    updateStats,
    setOnlineStatus,
    incrementPendingSync,
    clearPendingSync,
    initializeDashboard
  }
})
