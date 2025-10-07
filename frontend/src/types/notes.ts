export interface MemberNote {
  id: number
  member_id: number
  author_id: number
  title?: string
  content: string
  note_type: string
  privacy_level: 'public' | 'private' | 'extreme'
  is_alert: boolean
  is_pinned: boolean
  alert_expires_at?: string
  created_at: string
  updated_at: string
  
  // Relations
  author?: {
    id: number
    first_name: string
    last_name: string
  }
  member?: {
    id: number
    first_name: string
    last_name: string
  }
  
  // Computed properties
  alert_status?: string
  privacy_level_description?: string
  note_type_description?: string
  
  // Methods
  isAlertActive(): boolean
  canView(user: any): boolean
  canEdit(user: any): boolean
  canDelete(user: any): boolean
}

export interface NoteFilters {
  privacy_level: string
  note_type: string
  is_alert: boolean | null
  is_pinned: boolean | null
  search: string
}

export interface NoteSearchParams {
  privacy_level?: string
  note_type?: string
  is_alert?: boolean
  is_pinned?: boolean
  search?: string
  per_page?: number
  page?: number
}

export interface NoteFormData {
  title?: string
  content: string
  note_type: string
  privacy_level: 'public' | 'private' | 'extreme'
  is_alert: boolean
  is_pinned: boolean
  alert_expires_at?: string
}

export const NOTE_TYPES = {
  'Personal Note': 'Personal Note',
  'Follow-up': 'Follow-up',
  'Prayer Request': 'Prayer Request',
  'Ministry Note': 'Ministry Note',
  'Administrative': 'Administrative',
  'Pastoral Care': 'Pastoral Care',
  'Emergency': 'Emergency'
} as const

export const PRIVACY_LEVELS = {
  'public': 'Public',
  'private': 'Private',
  'extreme': 'Extreme'
} as const

export const PRIVACY_LEVEL_DESCRIPTIONS = {
  'public': 'Visible to all organization members',
  'private': 'Visible to admins and the member only',
  'extreme': 'Visible to admins only'
} as const
