import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { useQuasar } from 'quasar';
import VisitorCheckIn from '../VisitorCheckIn.vue';

// Mock Quasar
vi.mock('quasar', () => ({
  useQuasar: vi.fn(() => ({
    notify: vi.fn(),
    screen: { lt: { md: false } }
  }))
}));

describe('VisitorCheckIn', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should render visitor check-in form', () => {
    const wrapper = mount(VisitorCheckIn, {
      props: {
        serviceId: 1
      }
    });

    expect(wrapper.find('.visitor-checkin-container').exists()).toBe(true);
    expect(wrapper.find('.checkin-header').exists()).toBe(true);
    expect(wrapper.find('h3').text()).toContain('Visitor Check-in');
  });

  it('should show personal information fields', () => {
    const wrapper = mount(VisitorCheckIn, {
      props: {
        serviceId: 1
      }
    });

    expect(wrapper.find('input[placeholder*="First Name"]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder*="Last Name"]').exists()).toBe(true);
    expect(wrapper.find('input[type="tel"]').exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
  });

  it('should show address information field', () => {
    const wrapper = mount(VisitorCheckIn, {
      props: {
        serviceId: 1
      }
    });

    const addressField = wrapper.find('textarea');
    expect(addressField.exists()).toBe(true);
  });

  it('should show additional information fields', () => {
    const wrapper = mount(VisitorCheckIn, {
      props: {
        serviceId: 1
      }
    });

    expect(wrapper.find('select').exists()).toBe(true); // Visit reason
    expect(wrapper.find('textarea[placeholder*="additional information"]').exists()).toBe(true);
  });

  it('should show accompanying information fields', () => {
    const wrapper = mount(VisitorCheckIn, {
      props: {
        serviceId: 1
      }
    });

    const numberInput = wrapper.find('input[type="number"]');
    expect(numberInput.exists()).toBe(true);
    expect(numberInput.attributes('min')).toBe('1');
    expect(numberInput.attributes('max')).toBe('20');
  });

  it('should validate required fields', async () => {
    const wrapper = mount(VisitorCheckIn, {
      props: {
        serviceId: 1
      }
    });

    const form = wrapper.find('form');
    await form.trigger('submit');

    // Check for validation errors
    expect(wrapper.vm.visitorForm.first_name).toBe('');
    expect(wrapper.vm.visitorForm.last_name).toBe('');
    expect(wrapper.vm.visitorForm.phone).toBe('');
  });

  it('should submit form with valid data', async () => {
    const wrapper = mount(VisitorCheckIn, {
      props: {
        serviceId: 1
      }
    });

    // Fill form with valid data
    wrapper.vm.visitorForm = {
      first_name: 'John',
      last_name: 'Doe',
      phone: '+1234567890',
      email: 'john@example.com',
      address: '123 Main St',
      visit_reason: 'First time visitor',
      notes: 'Test notes',
      accompanying_count: 2,
      accompanying_names: 'Jane Doe, Bob Smith'
    };

    wrapper.vm.checkInVisitor = vi.fn().mockResolvedValue(undefined);

    await wrapper.vm.$nextTick();

    const submitButton = wrapper.find('button[type="submit"]');
    await submitButton.trigger('click');

    expect(wrapper.vm.checkInVisitor).toHaveBeenCalled();
  });

  it('should emit check-in-success when check-in is successful', async () => {
    const wrapper = mount(VisitorCheckIn, {
      props: {
        serviceId: 1
      }
    });

    wrapper.vm.visitorForm = {
      first_name: 'John',
      last_name: 'Doe',
      phone: '+1234567890',
      email: 'john@example.com',
      visit_reason: 'First time visitor',
      accompanying_count: 1,
      accompanying_names: ''
    };

    wrapper.vm.checkInVisitor = vi.fn().mockResolvedValue(undefined);

    await wrapper.vm.$nextTick();

    const submitButton = wrapper.find('button[type="submit"]');
    await submitButton.trigger('click');

    expect(wrapper.emitted('check-in-success')).toBeTruthy();
  });

  it('should emit cancel when cancel button is clicked', async () => {
    const wrapper = mount(VisitorCheckIn, {
      props: {
        serviceId: 1
      }
    });

    const cancelButton = wrapper.find('button:has-text("Cancel")');
    await cancelButton.trigger('click');

    expect(wrapper.emitted('cancel')).toBeTruthy();
  });

  it('should show recent visitors when available', () => {
    const wrapper = mount(VisitorCheckIn, {
      props: {
        serviceId: 1
      }
    });

    wrapper.vm.recentVisitors = [
      {
        id: 1,
        first_name: 'Jane',
        last_name: 'Smith',
        phone: '+1234567891',
        email: 'jane@example.com',
        last_visit: '2025-01-05T10:00:00Z'
      }
    ];

    expect(wrapper.find('.recent-visitors').exists()).toBe(true);
    expect(wrapper.find('.recent-visitors-list').exists()).toBe(true);
  });

  it('should select recent visitor when clicked', async () => {
    const wrapper = mount(VisitorCheckIn, {
      props: {
        serviceId: 1
      }
    });

    const mockVisitor = {
      id: 1,
      first_name: 'Jane',
      last_name: 'Smith',
      phone: '+1234567891',
      email: 'jane@example.com',
      last_visit: '2025-01-05T10:00:00Z'
    };

    wrapper.vm.recentVisitors = [mockVisitor];
    await wrapper.vm.$nextTick();

    const visitorItem = wrapper.find('.recent-visitor-item');
    await visitorItem.trigger('click');

    expect(wrapper.vm.visitorForm.first_name).toBe('Jane');
    expect(wrapper.vm.visitorForm.last_name).toBe('Smith');
    expect(wrapper.vm.visitorForm.phone).toBe('+1234567891');
    expect(wrapper.vm.visitorForm.email).toBe('jane@example.com');
  });

  it('should build visitor notes correctly', () => {
    const wrapper = mount(VisitorCheckIn, {
      props: {
        serviceId: 1
      }
    });

    wrapper.vm.visitorForm = {
      first_name: 'John',
      last_name: 'Doe',
      phone: '+1234567890',
      email: 'john@example.com',
      address: '123 Main St',
      visit_reason: 'First time visitor',
      notes: 'Test notes',
      accompanying_count: 2,
      accompanying_names: 'Jane Doe, Bob Smith'
    };

    const notes = wrapper.vm.buildVisitorNotes();
    
    expect(notes).toContain('Email: john@example.com');
    expect(notes).toContain('Address: 123 Main St');
    expect(notes).toContain('Reason: First time visitor');
    expect(notes).toContain('Accompanying: 2 people');
    expect(notes).toContain('Names: Jane Doe, Bob Smith');
    expect(notes).toContain('Additional: Test notes');
  });

  it('should format last visit time correctly', () => {
    const wrapper = mount(VisitorCheckIn, {
      props: {
        serviceId: 1
      }
    });

    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    const result = wrapper.vm.formatLastVisit(twoHoursAgo.toISOString());
    expect(result).toContain('2 hours ago');
  });

  it('should return "Never" for null last visit', () => {
    const wrapper = mount(VisitorCheckIn, {
      props: {
        serviceId: 1
      }
    });

    const result = wrapper.vm.formatLastVisit(null);
    expect(result).toBe('Never');
  });

  it('should show loading state during check-in', async () => {
    const wrapper = mount(VisitorCheckIn, {
      props: {
        serviceId: 1
      }
    });

    wrapper.vm.isCheckingIn = true;
    await wrapper.vm.$nextTick();

    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.attributes('loading')).toBeDefined();
  });

  it('should display error message when check-in fails', async () => {
    const wrapper = mount(VisitorCheckIn, {
      props: {
        serviceId: 1
      }
    });

    wrapper.vm.error = 'Check-in failed';
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.error-message').exists()).toBe(true);
    expect(wrapper.find('.error-message').text()).toContain('Check-in failed');
  });

  it('should clear error when dismiss button is clicked', async () => {
    const wrapper = mount(VisitorCheckIn, {
      props: {
        serviceId: 1
      }
    });

    wrapper.vm.error = 'Test error';
    await wrapper.vm.$nextTick();

    const dismissButton = wrapper.find('button:has-text("Dismiss")');
    await dismissButton.trigger('click');

    expect(wrapper.vm.error).toBeNull();
  });

  it('should reset form after successful check-in', async () => {
    const wrapper = mount(VisitorCheckIn, {
      props: {
        serviceId: 1
      }
    });

    wrapper.vm.visitorForm = {
      first_name: 'John',
      last_name: 'Doe',
      phone: '+1234567890',
      email: 'john@example.com',
      address: '123 Main St',
      visit_reason: 'First time visitor',
      notes: 'Test notes',
      accompanying_count: 2,
      accompanying_names: 'Jane Doe, Bob Smith'
    };

    wrapper.vm.checkInVisitor = vi.fn().mockResolvedValue(undefined);

    await wrapper.vm.$nextTick();

    const submitButton = wrapper.find('button[type="submit"]');
    await submitButton.trigger('click');

    // Check if form is reset
    expect(wrapper.vm.visitorForm.first_name).toBe('');
    expect(wrapper.vm.visitorForm.last_name).toBe('');
    expect(wrapper.vm.visitorForm.phone).toBe('');
  });

  it('should add visitor to recent visitors after check-in', async () => {
    const wrapper = mount(VisitorCheckIn, {
      props: {
        serviceId: 1
      }
    });

    wrapper.vm.visitorForm = {
      first_name: 'John',
      last_name: 'Doe',
      phone: '+1234567890',
      email: 'john@example.com',
      visit_reason: 'First time visitor',
      accompanying_count: 1,
      accompanying_names: ''
    };

    wrapper.vm.checkInVisitor = vi.fn().mockResolvedValue(undefined);

    await wrapper.vm.$nextTick();

    const submitButton = wrapper.find('button[type="submit"]');
    await submitButton.trigger('click');

    expect(wrapper.vm.recentVisitors.length).toBeGreaterThan(0);
    expect(wrapper.vm.recentVisitors[0].first_name).toBe('John');
    expect(wrapper.vm.recentVisitors[0].last_name).toBe('Doe');
  });
});
