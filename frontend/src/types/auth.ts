// Authentication Types for ChurchAfrica

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  name?: string // Computed or full name field
  phone?: string
  avatar?: string // Profile picture URL
  role: 'admin' | 'staff' | 'member'
  organization_id: string
  email_verified_at?: string
  created_at: string
  updated_at: string
  organization?: Organization
}

export interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  logo_url?: string
  timezone: string
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterCredentials {
  first_name: string
  last_name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
  organization_name?: string
  role?: 'admin' | 'staff' | 'member'
}

export interface AuthResponse {
  user: User
  token: string
  expires_at: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordReset {
  email: string
  token: string
  password: string
  password_confirmation: string
}

export interface UpdateProfileData {
  first_name?: string
  last_name?: string
  phone?: string
  email?: string
}

export interface ChangePasswordData {
  current_password: string
  password: string
  password_confirmation: string
}

// Google OAuth Types
export interface GoogleAuthResponse {
  credential: string
  select_by: string
}

export interface GoogleUser {
  id: string
  email: string
  name: string
  given_name: string
  family_name: string
  picture: string
  verified_email: boolean
}

// API Error Response
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status: number
}

// Form Validation Types
export interface ValidationRule {
  (value: string): boolean | string
}

export interface FormValidation {
  email: ValidationRule[]
  password: ValidationRule[]
  first_name: ValidationRule[]
  last_name: ValidationRule[]
  phone: ValidationRule[]
  organization_name: ValidationRule[]
}

// Auth Store State
export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

// Route Meta for Authentication
export interface RouteMeta {
  requiresAuth?: boolean
  requiresGuest?: boolean
  roles?: string[]
  title?: string
}

// Offline Auth Cache
export interface OfflineAuthData {
  user: User
  token: string
  cached_at: string
  expires_at: string
}

// Session Management
export interface SessionInfo {
  id: string
  user_id: string
  ip_address: string
  user_agent: string
  last_activity: string
  created_at: string
}

// Permission Types
export type Permission = 
  | 'view_dashboard'
  | 'manage_members'
  | 'view_members'
  | 'manage_attendance'
  | 'view_attendance'
  | 'manage_events'
  | 'view_events'
  | 'manage_reports'
  | 'view_reports'
  | 'manage_organization'
  | 'manage_users'
  | 'view_users'

export interface RolePermissions {
  admin: Permission[]
  staff: Permission[]
  member: Permission[]
}

// Default role permissions
export const DEFAULT_PERMISSIONS: RolePermissions = {
  admin: [
    'view_dashboard',
    'manage_members',
    'view_members',
    'manage_attendance',
    'view_attendance',
    'manage_events',
    'view_events',
    'manage_reports',
    'view_reports',
    'manage_organization',
    'manage_users',
    'view_users'
  ],
  staff: [
    'view_dashboard',
    'view_members',
    'manage_attendance',
    'view_attendance',
    'view_events',
    'view_reports',
    'view_users'
  ],
  member: [
    'view_dashboard',
    'view_events'
  ]
}

// Utility type for checking permissions
export type HasPermission = (permission: Permission) => boolean
