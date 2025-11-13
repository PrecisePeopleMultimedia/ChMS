/**
 * Attendance Type Definitions
 * Comprehensive attendance tracking data structures
 */

export type ServiceType = 'sunday_first' | 'sunday_second' | 'midweek' | 'prayer' | 'special' | 'youth' | 'children'
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'
export type CheckInMethod = 'manual' | 'qr_code' | 'sms' | 'app' | 'nfc'
export type AgeCategory = 'children' | 'youth' | 'adults' | 'seniors'

export interface Service {
  id: string
  name: string
  type: ServiceType
  date: string // ISO date
  startTime: string // HH:mm format
  endTime?: string
  location?: string
  expectedAttendance?: number
  notes?: string
  isActive: boolean
  createdAt: string
  createdBy?: string
}

export interface AttendanceRecord {
  id: string
  serviceId: string
  memberId: string
  status: AttendanceStatus
  checkInTime?: string // ISO datetime
  checkOutTime?: string
  checkInMethod: CheckInMethod
  memberName?: string
  memberPhoto?: string
  membershipNumber?: string
  isFirstTimer?: boolean
  isGuest?: boolean
  notes?: string
  temperature?: number
  hasChildren?: boolean
  childrenCount?: number
  recordedBy?: string
  createdAt: string
  updatedAt: string
}

export interface AttendanceStats {
  serviceId: string
  serviceName: string
  serviceDate: string
  totalExpected?: number
  totalPresent: number
  totalAbsent: number
  totalLate: number
  totalExcused: number
  attendanceRate: number
  byGender: {
    male: number
    female: number
    other: number
  }
  byAgeCategory: {
    children: number
    youth: number
    adults: number
    seniors: number
  }
  firstTimers: number
  guests: number
  newMembers: number
  onTimeCount: number
  lateCount: number
  comparisonToPrevious?: {
    change: number
    previousCount: number
  }
  trend?: 'increasing' | 'decreasing' | 'stable'
}

export interface AttendanceFilters {
  serviceId?: string
  serviceType?: ServiceType[]
  dateFrom?: string
  dateTo?: string
  status?: AttendanceStatus[]
  checkInMethod?: CheckInMethod[]
  isFirstTimer?: boolean
  isGuest?: boolean
  ageCategory?: AgeCategory[]
  search?: string
}

