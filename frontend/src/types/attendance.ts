export interface Service {
  id: number;
  organization_id: number;
  name: string;
  service_date: string;
  start_time: string;
  end_time?: string;
  service_type: 'sunday_service' | 'midweek' | 'special_event';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  attendance_records_count?: number;
}

export interface AttendanceRecord {
  id: number;
  organization_id: number;
  service_id: number;
  member_id?: number;
  visitor_name?: string;
  visitor_phone?: string;
  check_in_time: string;
  check_in_method: 'qr_code' | 'manual_search' | 'visitor';
  checked_in_by?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  service?: Service;
  member?: User;
  checked_in_by_user?: User;
  is_offline?: boolean;
}

export interface MemberQrCode {
  id: number;
  member_id: number;
  qr_code_data: string;
  generated_at: string;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  member?: User;
}

export interface User {
  id: number;
  organization_id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'staff' | 'member';
  date_of_birth?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Family {
  id: number;
  organization_id: number;
  name: string;
  head_id: number;
  address?: string;
  phone?: string;
  email?: string;
  created_at: string;
  updated_at: string;
  head?: User;
  members?: User[];
  size?: number;
}

export interface AttendanceStats {
  total_attendance: number;
  member_attendance: number;
  visitor_attendance: number;
  services_held: number;
}

export interface ServiceStats {
  total_attendance: number;
  member_attendance: number;
  visitor_attendance: number;
  qr_code_checkins: number;
  manual_checkins: number;
  visitor_checkins: number;
  attendance_by_hour: Record<number, number>;
}

export interface AttendanceFormData {
  service_id: number;
  member_id?: number;
  visitor_name?: string;
  visitor_phone?: string;
  check_in_method: 'qr_code' | 'manual_search' | 'visitor';
  notes?: string;
}

export interface QrCodeFormData {
  member_id: number;
  expiration_days?: number;
}

export interface ServiceFormData {
  name: string;
  service_date: string;
  start_time: string;
  end_time?: string;
  service_type: 'sunday_service' | 'midweek' | 'special_event';
  is_active?: boolean;
}

export interface MemberFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'staff' | 'member';
  date_of_birth?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface FamilyFormData {
  name: string;
  head_id: number;
  address?: string;
  phone?: string;
  email?: string;
}

export interface AttendanceFilters {
  service_id?: number;
  start_date?: string;
  end_date?: string;
  member_id?: number;
  check_in_method?: 'qr_code' | 'manual_search' | 'visitor';
  type?: 'members' | 'visitors';
  per_page?: number;
}

export interface ServiceFilters {
  service_type?: 'sunday_service' | 'midweek' | 'special_event';
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  upcoming?: boolean;
  past?: boolean;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
  per_page?: number;
}

export interface MemberFilters {
  role?: 'admin' | 'staff' | 'member';
  is_active?: boolean;
  search?: string;
  per_page?: number;
}

export interface FamilyFilters {
  search?: string;
  per_page?: number;
}

export interface QrCodeFilters {
  expires_soon?: boolean;
  never_expires?: boolean;
}

export interface AttendanceSummary {
  total_attendance: number;
  member_attendance: number;
  visitor_attendance: number;
  qr_code_checkins: number;
  manual_checkins: number;
  visitor_checkins: number;
}

export interface OfflineAttendanceRecord extends AttendanceRecord {
  is_offline: true;
  sync_status: 'pending' | 'synced' | 'failed';
  offline_id: string;
}

export interface SyncStatus {
  is_online: boolean;
  pending_sync: number;
  last_sync?: string;
  sync_errors: string[];
}

export interface AttendanceReport {
  service_id: number;
  service_name: string;
  service_date: string;
  total_attendance: number;
  member_attendance: number;
  visitor_attendance: number;
  attendance_by_hour: Record<number, number>;
  top_members: Array<{
    member_id: number;
    member_name: string;
    attendance_count: number;
  }>;
  visitor_details: Array<{
    visitor_name: string;
    visitor_phone?: string;
    check_in_time: string;
  }>;
}

export interface ExportOptions {
  format: 'csv' | 'pdf' | 'excel' | 'json';
  date_range: {
    start_date: string;
    end_date: string;
  };
  filters?: AttendanceFilters;
  include_visitors?: boolean;
  include_member_details?: boolean;
}
