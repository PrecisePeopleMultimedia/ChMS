import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import AttendanceDashboard from '../AttendanceDashboard.vue';

// Mock the attendance store
vi.mock('@/stores/attendance', () => ({
  useAttendanceStore: vi.fn(() => ({
    todayServices: [],
    currentServiceAttendance: [],
    memberAttendance: [],
    visitorAttendance: [],
    totalAttendance: 0,
    memberCount: 0,
    visitorCount: 0,
    isLoading: false,
    isOffline: false,
    fetchTodayServices: vi.fn(),
    fetchAttendanceForService: vi.fn(),
    setCurrentService: vi.fn()
  }))
}));

describe('AttendanceDashboard', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should render dashboard interface', () => {
    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: null
      }
    });

    expect(wrapper.find('.attendance-dashboard').exists()).toBe(true);
    expect(wrapper.find('.dashboard-header').exists()).toBe(true);
  });

  it('should show service selector when no service is selected', () => {
    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: null
      }
    });

    expect(wrapper.find('.service-selector').exists()).toBe(true);
    expect(wrapper.find('.service-selector-card').exists()).toBe(true);
    expect(wrapper.find('.text-h6').text()).toContain('Select a Service');
  });

  it('should display today services in selector', () => {
    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: null
      }
    });

    // Mock today services
    wrapper.vm.todayServices = [
      {
        id: 1,
        organization_id: 1,
        name: 'Sunday Service',
        service_date: '2025-01-06',
        start_time: '10:00:00',
        service_type: 'sunday_service',
        is_active: true,
        created_at: '2025-01-06T00:00:00Z',
        updated_at: '2025-01-06T00:00:00Z'
      }
    ];

    expect(wrapper.find('.service-list').exists()).toBe(true);
    expect(wrapper.find('.service-item').exists()).toBe(true);
  });

  it('should emit service-selected when service is clicked', async () => {
    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: null
      }
    });

    const mockService = {
      id: 1,
      organization_id: 1,
      name: 'Sunday Service',
      service_date: '2025-01-06',
      start_time: '10:00:00',
      service_type: 'sunday_service',
      is_active: true,
      created_at: '2025-01-06T00:00:00Z',
      updated_at: '2025-01-06T00:00:00Z'
    };

    wrapper.vm.todayServices = [mockService];
    await wrapper.vm.$nextTick();

    const serviceItem = wrapper.find('.service-item');
    await serviceItem.trigger('click');

    expect(wrapper.emitted('service-selected')).toBeTruthy();
    expect(wrapper.emitted('service-selected')[0]).toEqual([mockService]);
  });

  it('should show attendance overview when service is selected', () => {
    const mockService = {
      id: 1,
      organization_id: 1,
      name: 'Sunday Service',
      service_date: '2025-01-06',
      start_time: '10:00:00',
      service_type: 'sunday_service',
      is_active: true,
      created_at: '2025-01-06T00:00:00Z',
      updated_at: '2025-01-06T00:00:00Z'
    };

    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: mockService
      }
    });

    expect(wrapper.find('.attendance-overview').exists()).toBe(true);
    expect(wrapper.find('.stats-grid').exists()).toBe(true);
    expect(wrapper.find('.recent-checkins').exists()).toBe(true);
    expect(wrapper.find('.checkin-methods').exists()).toBe(true);
  });

  it('should display service information in header', () => {
    const mockService = {
      id: 1,
      organization_id: 1,
      name: 'Sunday Service',
      service_date: '2025-01-06',
      start_time: '10:00:00',
      service_type: 'sunday_service',
      is_active: true,
      created_at: '2025-01-06T00:00:00Z',
      updated_at: '2025-01-06T00:00:00Z'
    };

    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: mockService
      }
    });

    expect(wrapper.find('.service-info').exists()).toBe(true);
    expect(wrapper.find('.service-info h2').text()).toContain('Sunday Service');
  });

  it('should display attendance statistics', () => {
    const mockService = {
      id: 1,
      organization_id: 1,
      name: 'Sunday Service',
      service_date: '2025-01-06',
      start_time: '10:00:00',
      service_type: 'sunday_service',
      is_active: true,
      created_at: '2025-01-06T00:00:00Z',
      updated_at: '2025-01-06T00:00:00Z'
    };

    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: mockService
      }
    });

    wrapper.vm.totalAttendance = 25;
    wrapper.vm.memberCount = 20;
    wrapper.vm.visitorCount = 5;

    expect(wrapper.find('.attendance-stats').exists()).toBe(true);
    expect(wrapper.find('.stat-item').length).toBe(3);
  });

  it('should show recent check-ins', () => {
    const mockService = {
      id: 1,
      organization_id: 1,
      name: 'Sunday Service',
      service_date: '2025-01-06',
      start_time: '10:00:00',
      service_type: 'sunday_service',
      is_active: true,
      created_at: '2025-01-06T00:00:00Z',
      updated_at: '2025-01-06T00:00:00Z'
    };

    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: mockService
      }
    });

    wrapper.vm.currentServiceAttendance = [
      {
        id: 1,
        organization_id: 1,
        service_id: 1,
        member_id: 1,
        check_in_time: '2025-01-06T10:00:00Z',
        check_in_method: 'qr_code',
        created_at: '2025-01-06T10:00:00Z',
        updated_at: '2025-01-06T10:00:00Z',
        member: { name: 'John Doe' }
      }
    ];

    expect(wrapper.find('.checkin-list').exists()).toBe(true);
    expect(wrapper.find('.checkin-item').exists()).toBe(true);
  });

  it('should show no check-ins message when no attendance', () => {
    const mockService = {
      id: 1,
      organization_id: 1,
      name: 'Sunday Service',
      service_date: '2025-01-06',
      start_time: '10:00:00',
      service_type: 'sunday_service',
      is_active: true,
      created_at: '2025-01-06T00:00:00Z',
      updated_at: '2025-01-06T00:00:00Z'
    };

    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: mockService
      }
    });

    wrapper.vm.currentServiceAttendance = [];

    expect(wrapper.find('.no-checkins').exists()).toBe(true);
    expect(wrapper.find('.no-checkins').text()).toContain('No check-ins yet');
  });

  it('should emit start-qr-scan when QR code method is clicked', async () => {
    const mockService = {
      id: 1,
      organization_id: 1,
      name: 'Sunday Service',
      service_date: '2025-01-06',
      start_time: '10:00:00',
      service_type: 'sunday_service',
      is_active: true,
      created_at: '2025-01-06T00:00:00Z',
      updated_at: '2025-01-06T00:00:00Z'
    };

    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: mockService
      }
    });

    const qrMethod = wrapper.find('.method-card:has-text("QR Code")');
    await qrMethod.trigger('click');

    expect(wrapper.emitted('start-qr-scan')).toBeTruthy();
  });

  it('should emit start-manual-checkin when manual method is clicked', async () => {
    const mockService = {
      id: 1,
      organization_id: 1,
      name: 'Sunday Service',
      service_date: '2025-01-06',
      start_time: '10:00:00',
      service_type: 'sunday_service',
      is_active: true,
      created_at: '2025-01-06T00:00:00Z',
      updated_at: '2025-01-06T00:00:00Z'
    };

    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: mockService
      }
    });

    const manualMethod = wrapper.find('.method-card:has-text("Manual")');
    await manualMethod.trigger('click');

    expect(wrapper.emitted('start-manual-checkin')).toBeTruthy();
  });

  it('should emit start-visitor-checkin when visitor method is clicked', async () => {
    const mockService = {
      id: 1,
      organization_id: 1,
      name: 'Sunday Service',
      service_date: '2025-01-06',
      start_time: '10:00:00',
      service_type: 'sunday_service',
      is_active: true,
      created_at: '2025-01-06T00:00:00Z',
      updated_at: '2025-01-06T00:00:00Z'
    };

    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: mockService
      }
    });

    const visitorMethod = wrapper.find('.method-card:has-text("Visitor")');
    await visitorMethod.trigger('click');

    expect(wrapper.emitted('start-visitor-checkin')).toBeTruthy();
  });

  it('should show offline indicator when offline', () => {
    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: null
      }
    });

    wrapper.vm.isOffline = true;

    expect(wrapper.find('.offline-indicator').exists()).toBe(true);
    expect(wrapper.find('.offline-indicator').text()).toContain('You\'re offline');
  });

  it('should show loading overlay when loading', () => {
    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: null
      }
    });

    wrapper.vm.isLoading = true;

    expect(wrapper.find('.q-inner-loading').exists()).toBe(true);
  });

  it('should format service date correctly', () => {
    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: null
      }
    });

    const result = wrapper.vm.formatServiceDate('2025-01-06');
    expect(result).toContain('Monday');
    expect(result).toContain('January');
    expect(result).toContain('2025');
  });

  it('should format time correctly', () => {
    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: null
      }
    });

    const result = wrapper.vm.formatTime('10:00:00');
    expect(result).toContain('10:00');
  });

  it('should format check-in time correctly', () => {
    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: null
      }
    });

    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    const result = wrapper.vm.formatCheckInTime(twoHoursAgo.toISOString());
    expect(result).toContain('2 hours ago');
  });

  it('should get correct service type color', () => {
    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: null
      }
    });

    expect(wrapper.vm.getServiceTypeColor('sunday_service')).toBe('blue');
    expect(wrapper.vm.getServiceTypeColor('midweek')).toBe('green');
    expect(wrapper.vm.getServiceTypeColor('special_event')).toBe('purple');
  });

  it('should get correct service type icon', () => {
    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: null
      }
    });

    expect(wrapper.vm.getServiceTypeIcon('sunday_service')).toBe('church');
    expect(wrapper.vm.getServiceTypeIcon('midweek')).toBe('groups');
    expect(wrapper.vm.getServiceTypeIcon('special_event')).toBe('event');
  });

  it('should get correct service type label', () => {
    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: null
      }
    });

    expect(wrapper.vm.getServiceTypeLabel('sunday_service')).toBe('Sunday Service');
    expect(wrapper.vm.getServiceTypeLabel('midweek')).toBe('Midweek');
    expect(wrapper.vm.getServiceTypeLabel('special_event')).toBe('Special Event');
  });

  it('should get correct check-in method color', () => {
    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: null
      }
    });

    expect(wrapper.vm.getCheckInMethodColor('qr_code')).toBe('blue');
    expect(wrapper.vm.getCheckInMethodColor('manual_search')).toBe('green');
    expect(wrapper.vm.getCheckInMethodColor('visitor')).toBe('orange');
  });

  it('should get correct check-in method icon', () => {
    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: null
      }
    });

    expect(wrapper.vm.getCheckInMethodIcon('qr_code')).toBe('qr_code');
    expect(wrapper.vm.getCheckInMethodIcon('manual_search')).toBe('person_search');
    expect(wrapper.vm.getCheckInMethodIcon('visitor')).toBe('person_add');
  });

  it('should get correct check-in method label', () => {
    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: null
      }
    });

    expect(wrapper.vm.getCheckInMethodLabel('qr_code')).toBe('QR Code');
    expect(wrapper.vm.getCheckInMethodLabel('manual_search')).toBe('Manual');
    expect(wrapper.vm.getCheckInMethodLabel('visitor')).toBe('Visitor');
  });

  it('should get record display name for member', () => {
    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: null
      }
    });

    const record = {
      id: 1,
      member_id: 1,
      member: { name: 'John Doe' }
    };

    const result = wrapper.vm.getRecordDisplayName(record);
    expect(result).toBe('John Doe');
  });

  it('should get record display name for visitor', () => {
    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: null
      }
    });

    const record = {
      id: 1,
      visitor_name: 'Jane Smith'
    };

    const result = wrapper.vm.getRecordDisplayName(record);
    expect(result).toBe('Jane Smith');
  });

  it('should return "Unknown" for record without name', () => {
    const wrapper = mount(AttendanceDashboard, {
      props: {
        currentService: null
      }
    });

    const record = {
      id: 1
    };

    const result = wrapper.vm.getRecordDisplayName(record);
    expect(result).toBe('Unknown');
  });
});
