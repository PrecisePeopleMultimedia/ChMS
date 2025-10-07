export interface Member {
  id: number
  organization_id: number
  family_id?: number | null
  first_name: string
  last_name: string
  email?: string | null
  phone?: string | null
  date_of_birth?: string | null
  gender?: 'male' | 'female' | 'other' | null
  address?: string | null
  member_type: 'adult' | 'child' | 'youth' | 'visitor'
  join_date: string
  is_active: boolean
  notes?: string | null
  avatar?: string | null
  created_at: string
  updated_at: string
  
  // Relationships
  family?: Family | null
  organization?: Organization | null
  history?: MemberHistory[]
  
  // Computed properties
  full_name?: string
  age?: number
}

export interface Family {
  id: number
  organization_id: number
  family_name: string
  head_of_family_id?: number | null
  address?: string | null
  phone?: string | null
  email?: string | null
  notes?: string | null
  created_at: string
  updated_at: string
  
  // Relationships
  members?: Member[]
  head_of_family?: Member | null
  organization?: Organization | null
  
  // Computed properties
  member_count?: number
  active_member_count?: number
}

export interface MemberHistory {
  id: number
  member_id: number
  changed_by_user_id: number
  change_type: 'created' | 'updated' | 'deleted' | 'restored'
  field_changes?: string[] | null
  old_values?: Record<string, any> | null
  new_values?: Record<string, any> | null
  created_at: string
  
  // Relationships
  member?: Member
  changed_by?: User
}

export interface Organization {
  id: number
  name: string
  slug: string
  description?: string | null
  address?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
  logo?: string | null
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  name: string
  email: string
  organization_id?: number | null
  created_at: string
  updated_at: string
}

// API Response types
export interface MembersResponse {
  success: boolean
  data: {
    data: Member[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
  message: string
}

export interface MemberResponse {
  success: boolean
  data: Member
  message: string
}

export interface FamiliesResponse {
  success: boolean
  data: {
    data: Family[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
  message: string
}

export interface FamilyResponse {
  success: boolean
  data: Family
  message: string
}

// Search and filter types
export interface MemberFilters {
  search?: string
  member_type?: 'adult' | 'child' | 'youth' | 'visitor'
  is_active?: boolean
  family_id?: number
  page?: number
  per_page?: number
  sort_by?: 'first_name' | 'last_name' | 'email' | 'join_date' | 'created_at'
  sort_order?: 'asc' | 'desc'
}

export interface FamilyFilters {
  search?: string
  page?: number
  per_page?: number
  sort_by?: 'family_name' | 'created_at'
  sort_order?: 'asc' | 'desc'
}

// Form data types
export interface MemberFormData {
  first_name: string
  last_name: string
  email?: string | null
  phone?: string | null
  date_of_birth?: string | null
  gender?: 'male' | 'female' | 'other' | null
  address?: string | null
  member_type: 'adult' | 'child' | 'youth' | 'visitor'
  join_date: string
  family_id?: number | null
  notes?: string | null
  is_active?: boolean
}

export interface FamilyFormData {
  family_name: string
  head_of_family_id?: number | null
  address?: string | null
  phone?: string | null
  email?: string | null
  notes?: string | null
}

// Pagination type
export interface Pagination {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

// Error types
export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
}

// Duplicate detection
export interface DuplicateCheckResponse {
  success: boolean
  message: string
  duplicate_member?: Member
  suggestion?: string
}
