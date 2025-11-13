/**
 * Member Type Definitions
 * Comprehensive member data structures matching prototype
 */

export type MemberStatus = 'active' | 'inactive' | 'visitor' | 'alumni'
export type MembershipType = 'regular' | 'founding' | 'honorary' | 'visiting'
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say'
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed'
export type AgeGroup = 'child' | 'youth' | 'young_adult' | 'adult' | 'senior'

export interface ContactInfo {
  phone: string
  email?: string
  whatsapp?: string
  address?: {
    street?: string
    city?: string
    state?: string
    country?: string
    postalCode?: string
  }
}

export interface FamilyMember {
  id: string
  name: string
  relationship: 'spouse' | 'child' | 'parent' | 'sibling' | 'guardian' | 'other'
  memberId?: string
}

export interface Ministry {
  id: string
  name: string
  role: string
  startDate: string
  endDate?: string
  isActive: boolean
}

export interface Group {
  id: string
  name: string
  type: 'fellowship' | 'ministry' | 'small_group' | 'committee'
  role?: string
  joinedDate: string
}

export interface Member {
  id: string
  firstName: string
  lastName: string
  middleName?: string
  photo?: string
  dateOfBirth?: string
  gender: Gender
  contact: ContactInfo
  membershipNumber?: string
  membershipType: MembershipType
  status: MemberStatus
  joinDate: string
  baptismDate?: string
  salvationDate?: string
  maritalStatus: MaritalStatus
  occupation?: string
  employer?: string
  family?: FamilyMember[]
  familyId?: string
  ministries?: Ministry[]
  groups?: Group[]
  skills?: string[]
  interests?: string[]
  lastAttendance?: string
  attendanceCount?: number
  attendancePercentage?: number
  lastDonation?: string
  totalDonations?: number
  notes?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
  createdBy?: string
}

export interface MemberFilters {
  search?: string
  status?: MemberStatus[]
  gender?: Gender[]
  maritalStatus?: MaritalStatus[]
  ageGroup?: AgeGroup[]
  ministry?: string[]
  group?: string[]
  hasPhoto?: boolean
  joinDateFrom?: string
  joinDateTo?: string
}

export interface MemberStats {
  total: number
  active: number
  inactive: number
  visitors: number
  newThisMonth: number
  byGender: Record<Gender, number>
  byMaritalStatus: Record<MaritalStatus, number>
  byAgeGroup: Record<AgeGroup, number>
  averageAttendance: number
}

