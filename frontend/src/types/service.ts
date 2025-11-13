/**
 * Service Type Definitions
 * Comprehensive service management data structures
 */

export type ServiceType =
  | 'sunday_morning'
  | 'sunday_evening'
  | 'midweek'
  | 'prayer_meeting'
  | 'bible_study'
  | 'youth_service'
  | 'children_service'
  | 'special_event'

export type ServiceStatus =
  | 'scheduled'
  | 'active'
  | 'completed'
  | 'cancelled'

export type ServiceFrequency =
  | 'weekly'
  | 'bi-weekly'
  | 'monthly'
  | 'one-time'

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export interface MinistryAssignment {
  id: string
  ageMin: number
  ageMax: number
  ministry: string // e.g., "nursery", "children's church", "youth"
  room?: string
  capacity?: number
  staffRequired?: number
}

export interface Service {
  id: string
  organizationId: string
  branchId: string
  name: string
  serviceType: ServiceType
  scheduledDate: string // ISO date string
  startTime: string // HH:mm format (e.g., "09:00")
  endTime: string // HH:mm format (e.g., "11:00")
  status: ServiceStatus
  frequency: ServiceFrequency
  dayOfWeek?: DayOfWeek // For recurring services
  capacity?: number
  expectedAttendance?: number
  location?: {
    type: 'physical' | 'online' | 'hybrid'
    venue?: string
    onlineUrl?: string
    buildingId?: string
    roomId?: string
  }
  ministryAssignments?: MinistryAssignment[]
  description?: string
  leader?: string // User ID of service leader
  notes?: string
  isActive?: boolean // Computed property for UI convenience
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy?: string
}

export interface ServiceTemplate {
  id: string
  organizationId: string
  name: string
  serviceType: ServiceType
  frequency: ServiceFrequency
  dayOfWeek?: DayOfWeek
  startTime: string
  endTime: string
  location?: Service['location']
  ministryAssignments?: MinistryAssignment[]
  isActive: boolean
  createdAt: string
}

export interface ServiceAttendanceStats {
  serviceId: string
  serviceName: string
  serviceType: ServiceType
  date: string
  totalAttendance: number
  adultsCount: number
  childrenCount: number
  youthCount: number
  visitorsCount: number
  membersCount: number
  capacity?: number
  capacityPercentage?: number
}

// Service Type Labels (British English)
export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  sunday_morning: 'Sunday Morning Service',
  sunday_evening: 'Sunday Evening Service',
  midweek: 'Midweek Service',
  special_event: 'Special Event',
  prayer_meeting: 'Prayer Meeting',
  bible_study: 'Bible Study',
  youth_service: 'Youth Service',
  children_service: "Children's Service",
}

// Service Type Icons (Quasar icon names)
export const SERVICE_TYPE_ICONS: Record<ServiceType, string> = {
  sunday_morning: 'wb_sunny',
  sunday_evening: 'nights_stay',
  midweek: 'event',
  special_event: 'auto_awesome',
  prayer_meeting: 'favorite',
  bible_study: 'menu_book',
  youth_service: 'people',
  children_service: 'child_care',
}

// Service Type Colors (OKLCH-based theme colors)
export const SERVICE_TYPE_COLORS: Record<ServiceType, string> = {
  sunday_morning: 'text-[#1CE479]', // Primary green
  sunday_evening: 'text-blue-400',
  midweek: 'text-purple-400',
  special_event: 'text-yellow-400',
  prayer_meeting: 'text-pink-400',
  bible_study: 'text-cyan-400',
  youth_service: 'text-orange-400',
  children_service: 'text-green-400',
}

// Service Status Labels
export const SERVICE_STATUS_LABELS: Record<ServiceStatus, string> = {
  scheduled: 'Scheduled',
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

// Service Frequency Labels
export const SERVICE_FREQUENCY_LABELS: Record<ServiceFrequency, string> = {
  weekly: 'Weekly',
  'bi-weekly': 'Bi-Weekly',
  monthly: 'Monthly',
  'one-time': 'One-Time',
}

// Day of Week Labels
export const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

// Helper function to format service time
export function formatServiceTime(service: Service): string {
  return `${service.startTime} - ${service.endTime}`
}

// Helper function to check if service is happening now
export function isServiceActive(service: Service): boolean {
  const now = new Date()
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  const currentDate = now.toISOString().split('T')[0]
  
  return (
    service.status === 'active' &&
    service.scheduledDate === currentDate &&
    service.startTime <= currentTime &&
    service.endTime >= currentTime
  )
}

// Helper function to get the current active service
export function getCurrentActiveService(services: Service[]): Service | null {
  const now = new Date()
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  const currentDate = now.toISOString().split('T')[0]
  
  return services.find(service => 
    service.status === 'active' &&
    service.scheduledDate === currentDate &&
    service.startTime <= currentTime &&
    service.endTime >= currentTime
  ) || null
}

// Helper function to get upcoming services for today
export function getTodayServices(services: Service[]): Service[] {
  const today = new Date().toISOString().split('T')[0]
  
  return services
    .filter(service => 
      service.scheduledDate === today &&
      service.status !== 'cancelled'
    )
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
}

// Helper function to get next service
export function getNextService(services: Service[]): Service | null {
  const now = new Date()
  const upcomingServices = services
    .filter(service => {
      const serviceDateTime = new Date(`${service.scheduledDate}T${service.startTime}`)
      return serviceDateTime > now
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.scheduledDate}T${a.startTime}`)
      const dateB = new Date(`${b.scheduledDate}T${b.startTime}`)
      return dateA.getTime() - dateB.getTime()
    })

  return upcomingServices[0] || null
}

