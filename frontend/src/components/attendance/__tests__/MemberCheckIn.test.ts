import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { useQuasar } from 'quasar';
import MemberCheckIn from '../MemberCheckIn.vue';

// Mock Quasar
vi.mock('quasar', () => ({
  useQuasar: vi.fn(() => ({
    notify: vi.fn(),
    screen: { lt: { md: false } }
  }))
}));

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

describe('MemberCheckIn', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should render member check-in interface', () => {
    const wrapper = mount(MemberCheckIn, {
      props: {
        serviceId: 1
      }
    });

    expect(wrapper.find('.member-checkin-container').exists()).toBe(true);
    expect(wrapper.find('.checkin-header').exists()).toBe(true);
    expect(wrapper.find('h3').text()).toContain('Member Check-in');
  });

  it('should show search input', () => {
    const wrapper = mount(MemberCheckIn, {
      props: {
        serviceId: 1
      }
    });

    const searchInput = wrapper.find('input[type="text"]');
    expect(searchInput.exists()).toBe(true);
    expect(searchInput.attributes('placeholder')).toContain('Search members');
  });

  it('should display recent members when no search query', () => {
    const wrapper = mount(MemberCheckIn, {
      props: {
        serviceId: 1
      }
    });

    // Mock recent members
    wrapper.vm.recentMembers = [
      {
        id: 1,
        name: 'John Doe',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        last_check_in: '2025-01-05T10:00:00Z'
      }
    ];

    expect(wrapper.find('.recent-members').exists()).toBe(true);
    expect(wrapper.find('.recent-members-list').exists()).toBe(true);
  });

  it('should search for members when typing in search input', async () => {
    const wrapper = mount(MemberCheckIn, {
      props: {
        serviceId: 1
      }
    });

    const searchInput = wrapper.find('input[type="text"]');
    await searchInput.setValue('John');

    // Wait for debounced search
    await new Promise(resolve => setTimeout(resolve, 500));

    expect(wrapper.vm.searchQuery).toBe('John');
  });

  it('should display search results when members are found', async () => {
    const wrapper = mount(MemberCheckIn, {
      props: {
        serviceId: 1
      }
    });

    // Mock search results
    wrapper.vm.searchResults = [
      {
        id: 1,
        name: 'John Doe',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        role: 'member'
      }
    ];

    await wrapper.vm.$nextTick();

    expect(wrapper.find('.search-results').exists()).toBe(true);
    expect(wrapper.find('.member-list').exists()).toBe(true);
    expect(wrapper.find('.member-item').exists()).toBe(true);
  });

  it('should show no results message when no members found', async () => {
    const wrapper = mount(MemberCheckIn, {
      props: {
        serviceId: 1
      }
    });

    wrapper.vm.searchQuery = 'NonExistent';
    wrapper.vm.searchResults = [];
    wrapper.vm.isSearching = false;

    await wrapper.vm.$nextTick();

    expect(wrapper.find('.no-results').exists()).toBe(true);
    expect(wrapper.find('.no-results').text()).toContain('No members found');
  });

  it('should select member when clicked', async () => {
    const wrapper = mount(MemberCheckIn, {
      props: {
        serviceId: 1
      }
    });

    const mockMember = {
      id: 1,
      name: 'John Doe',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      role: 'member'
    };

    wrapper.vm.searchResults = [mockMember];
    await wrapper.vm.$nextTick();

    const memberItem = wrapper.find('.member-item');
    await memberItem.trigger('click');

    expect(wrapper.vm.selectedMember).toEqual(mockMember);
    expect(wrapper.find('.selected-member').exists()).toBe(true);
  });

  it('should show selected member card', async () => {
    const wrapper = mount(MemberCheckIn, {
      props: {
        serviceId: 1
      }
    });

    const mockMember = {
      id: 1,
      name: 'John Doe',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      role: 'member'
    };

    wrapper.vm.selectedMember = mockMember;
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.selected-member-card').exists()).toBe(true);
    expect(wrapper.find('.selected-member-card').text()).toContain('John Doe');
  });

  it('should emit check-in-success when check-in is successful', async () => {
    const wrapper = mount(MemberCheckIn, {
      props: {
        serviceId: 1
      }
    });

    const mockMember = {
      id: 1,
      name: 'John Doe',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      role: 'member'
    };

    wrapper.vm.selectedMember = mockMember;
    wrapper.vm.checkInMember = vi.fn().mockResolvedValue(undefined);

    await wrapper.vm.$nextTick();

    const checkInButton = wrapper.find('button:has-text("Check In")');
    await checkInButton.trigger('click');

    expect(wrapper.emitted('check-in-success')).toBeTruthy();
  });

  it('should show add member dialog when no results found', async () => {
    const wrapper = mount(MemberCheckIn, {
      props: {
        serviceId: 1
      }
    });

    wrapper.vm.searchQuery = 'NonExistent';
    wrapper.vm.searchResults = [];
    wrapper.vm.isSearching = false;

    await wrapper.vm.$nextTick();

    const addMemberButton = wrapper.find('button:has-text("Add New Member")');
    await addMemberButton.trigger('click');

    expect(wrapper.vm.showAddMemberDialog).toBe(true);
  });

  it('should add new member when form is submitted', async () => {
    const wrapper = mount(MemberCheckIn, {
      props: {
        serviceId: 1
      }
    });

    wrapper.vm.showAddMemberDialog = true;
    wrapper.vm.newMember = {
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      phone: '+1234567890',
      role: 'member'
    };

    wrapper.vm.addNewMember = vi.fn().mockResolvedValue(undefined);

    await wrapper.vm.$nextTick();

    const addButton = wrapper.find('button:has-text("Add Member")');
    await addButton.trigger('click');

    expect(wrapper.vm.addNewMember).toHaveBeenCalled();
  });

  it('should clear selection when cancel is clicked', async () => {
    const wrapper = mount(MemberCheckIn, {
      props: {
        serviceId: 1
      }
    });

    wrapper.vm.selectedMember = { id: 1, name: 'John Doe' };
    await wrapper.vm.$nextTick();

    const cancelButton = wrapper.find('button:has-text("Cancel")');
    await cancelButton.trigger('click');

    expect(wrapper.vm.selectedMember).toBeNull();
  });

  it('should show loading state during check-in', async () => {
    const wrapper = mount(MemberCheckIn, {
      props: {
        serviceId: 1
      }
    });

    wrapper.vm.isCheckingIn = true;
    await wrapper.vm.$nextTick();

    const checkInButton = wrapper.find('button:has-text("Check In")');
    expect(checkInButton.attributes('loading')).toBeDefined();
  });

  it('should display error message when check-in fails', async () => {
    const wrapper = mount(MemberCheckIn, {
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
    const wrapper = mount(MemberCheckIn, {
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

  it('should format last check-in time correctly', () => {
    const wrapper = mount(MemberCheckIn, {
      props: {
        serviceId: 1
      }
    });

    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    const result = wrapper.vm.formatLastCheckIn(twoHoursAgo.toISOString());
    expect(result).toContain('2 hours ago');
  });

  it('should return "Never" for null last check-in', () => {
    const wrapper = mount(MemberCheckIn, {
      props: {
        serviceId: 1
      }
    });

    const result = wrapper.vm.formatLastCheckIn(null);
    expect(result).toBe('Never');
  });

  it('should get correct role color', () => {
    const wrapper = mount(MemberCheckIn, {
      props: {
        serviceId: 1
      }
    });

    expect(wrapper.vm.getRoleColor('admin')).toBe('red');
    expect(wrapper.vm.getRoleColor('staff')).toBe('orange');
    expect(wrapper.vm.getRoleColor('member')).toBe('blue');
    expect(wrapper.vm.getRoleColor('unknown')).toBe('grey');
  });
});
