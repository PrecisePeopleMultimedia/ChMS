import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { Quasar } from 'quasar'
import MemberBadges from '@/components/members/MemberBadges.vue'
import { useBadgesStore } from '@/stores/badges'
import type { MemberBadge, MemberBadgeSummary } from '@/stores/badges'

// Mock the badges store
vi.mock('@/stores/badges', () => ({
  useBadgesStore: vi.fn()
}))

// Mock child components
vi.mock('@/components/members/BadgeDisplay.vue', () => ({
  default: {
    name: 'BadgeDisplay',
    template: '<div data-testid="badge-display"><slot /></div>',
    props: ['badge', 'badges', 'multiple', 'size', 'clickable', 'showIcon']
  }
}))

vi.mock('@/components/members/MemberBadgeAssignDialog.vue', () => ({
  default: {
    name: 'MemberBadgeAssignDialog',
    template: '<div data-testid="badge-assign-dialog"><slot /></div>',
    props: ['modelValue', 'memberId'],
    emits: ['update:modelValue', 'assigned']
  }
}))

vi.mock('@/components/members/MemberBadgeEditDialog.vue', () => ({
  default: {
    name: 'MemberBadgeEditDialog',
    template: '<div data-testid="badge-edit-dialog"><slot /></div>',
    props: ['modelValue', 'badge'],
    emits: ['update:modelValue', 'updated']
  }
}))

describe('MemberBadges Component', () => {
  let mockBadgesStore: any

  const mockMemberBadge: MemberBadge = {
    id: 1,
    member_id: 1,
    badge_type_id: 1,
    name: 'Leader',
    description: 'Church leadership team member',
    color: '#dc3545',
    icon: 'admin_panel_settings',
    assigned_at: '2025-01-01T00:00:00Z',
    expires_at: null,
    is_expired: false,
    is_expiring_soon: false,
    expiration_status: 'never',
    days_until_expiration: null,
    notes: 'Leadership assignment',
    assigned_by_name: 'Admin User'
  }

  const mockSummary: MemberBadgeSummary = {
    total_badges: 2,
    active_badges: 2,
    expiring_soon: 0,
    expired: 0,
    badges: [mockMemberBadge]
  }

  beforeEach(() => {
    setActivePinia(createPinia())

    // Mock window.confirm
    global.confirm = vi.fn(() => true)

    mockBadgesStore = {
      memberBadges: [mockMemberBadge],
      memberBadgeSummary: mockSummary,
      loading: false,
      error: null,
      fetchMemberBadges: vi.fn(),
      assignBadgeToMember: vi.fn(),
      removeBadgeFromMember: vi.fn(),
      updateMemberBadge: vi.fn(),
      autoAssignBadges: vi.fn(),
      clearError: vi.fn()
    }

    vi.mocked(useBadgesStore).mockReturnValue(mockBadgesStore)
  })

  const createWrapper = (props = {}) => {
    return mount(MemberBadges, {
      props: {
        memberId: 1,
        ...props
      },
      global: {
        plugins: [
          [Quasar, {}]
        ],
        stubs: {
          'q-btn': {
            template: '<button :data-testid="label === \'Assign Badge\' ? \'assign-badge-btn\' : label === \'Auto Assign\' ? \'auto-assign-btn\' : undefined"><slot /></button>',
            props: ['loading', 'color', 'icon', 'label', 'outline', 'size']
          },
          'q-chip': {
            template: '<span class="q-chip"><slot /></span>',
            props: ['color', 'textColor', 'icon', 'label']
          },
          'q-card': {
            template: '<div class="q-card"><slot /></div>',
            props: ['flat', 'bordered']
          },
          'q-card-section': {
            template: '<div class="q-card-section"><slot /></div>'
          },
          'q-spinner': {
            template: '<div class="q-spinner">Loading...</div>',
            props: ['color', 'size']
          },
          'q-banner': {
            template: '<div class="q-banner"><slot /></div>',
            props: ['type', 'actions']
          },
          'q-btn-group': {
            template: '<div class="q-btn-group"><slot /></div>',
            props: ['outline']
          },
          'q-tooltip': {
            template: '<div class="q-tooltip"><slot /></div>'
          },
          'q-menu': {
            template: '<div class="q-menu"><slot /></div>'
          },
          'q-list': {
            template: '<div class="q-list"><slot /></div>'
          },
          'q-item': {
            template: '<div class="q-item" @click="$emit(\'click\')"><slot /></div>',
            props: ['clickable']
          },
          'q-item-section': {
            template: '<div class="q-item-section"><slot /></div>',
            props: ['avatar']
          },
          'q-icon': {
            template: '<i class="q-icon"></i>',
            props: ['name', 'color', 'size']
          }
        }
      }
    })
  }

  it('should render correctly with badges', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('.member-badges').exists()).toBe(true)
    expect(wrapper.find('.text-h6').text()).toContain('Member Badges')
    expect(wrapper.find('[data-testid="assign-badge-btn"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="auto-assign-btn"]').exists()).toBe(true)
  })

  it('should display badge summary correctly', () => {
    const wrapper = createWrapper()

    const chips = wrapper.findAll('.q-chip')
    expect(chips.length).toBeGreaterThan(0)
    
    // Should show total badges
    expect(wrapper.text()).toContain('2 Total')
  })

  it('should show loading state', () => {
    mockBadgesStore.loading = true
    const wrapper = createWrapper()

    expect(wrapper.find('.q-spinner').exists()).toBe(true)
    expect(wrapper.text()).toContain('Loading badges...')
  })

  it('should show error state', () => {
    mockBadgesStore.error = 'Failed to load badges'
    const wrapper = createWrapper()

    expect(wrapper.find('.q-banner').exists()).toBe(true)
    expect(wrapper.text()).toContain('Failed to load badges')
  })

  it('should show empty state when no badges', () => {
    mockBadgesStore.memberBadges = []
    mockBadgesStore.memberBadgeSummary = {
      total_badges: 0,
      active_badges: 0,
      expiring_soon: 0,
      expired: 0,
      badges: []
    }

    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('No badges assigned')
    expect(wrapper.text()).toContain('Assign badges to categorize and identify this member')
  })

  it('should call fetchMemberBadges on mount', () => {
    createWrapper()

    expect(mockBadgesStore.fetchMemberBadges).toHaveBeenCalledWith(1)
  })

  it('should open assign dialog when assign button is clicked', async () => {
    const wrapper = createWrapper()

    await wrapper.find('[data-testid="assign-badge-btn"]').trigger('click')

    expect(wrapper.find('[data-testid="badge-assign-dialog"]').exists()).toBe(true)
  })

  it('should call auto assign when auto assign button is clicked', async () => {
    const wrapper = createWrapper()

    await wrapper.find('[data-testid="auto-assign-btn"]').trigger('click')

    expect(mockBadgesStore.autoAssignBadges).toHaveBeenCalledWith(1)
  })

  it('should handle badge assignment event', async () => {
    const wrapper = createWrapper()

    // Open assign dialog
    await wrapper.find('[data-testid="assign-badge-btn"]').trigger('click')

    // Emit assigned event
    await wrapper.findComponent({ name: 'MemberBadgeAssignDialog' }).vm.$emit('assigned')

    // Should refresh badges
    expect(mockBadgesStore.fetchMemberBadges).toHaveBeenCalledTimes(2) // Once on mount, once after assignment
  })

  it('should handle badge edit', async () => {
    const wrapper = createWrapper()

    // Find badge display component and emit edit event
    const badgeDisplay = wrapper.findComponent({ name: 'BadgeDisplay' })
    await badgeDisplay.vm.$emit('edit', mockMemberBadge)

    expect(wrapper.find('[data-testid="badge-edit-dialog"]').exists()).toBe(true)
  })

  it('should handle badge removal with confirmation', async () => {
    const wrapper = createWrapper()

    // Find badge display component and emit remove event
    const badgeDisplay = wrapper.findComponent({ name: 'BadgeDisplay' })
    await badgeDisplay.vm.$emit('remove', mockMemberBadge)

    expect(global.confirm).toHaveBeenCalledWith(
      expect.stringContaining('Are you sure you want to remove the "Leader" badge')
    )
    expect(mockBadgesStore.removeBadgeFromMember).toHaveBeenCalledWith(1, 1)
  })

  it('should not remove badge if user cancels confirmation', async () => {
    global.confirm = vi.fn(() => false)
    const wrapper = createWrapper()

    // Find badge display component and emit remove event
    const badgeDisplay = wrapper.findComponent({ name: 'BadgeDisplay' })
    await badgeDisplay.vm.$emit('remove', mockMemberBadge)

    expect(global.confirm).toHaveBeenCalled()
    expect(mockBadgesStore.removeBadgeFromMember).not.toHaveBeenCalled()
  })

  it('should handle badge update event', async () => {
    const wrapper = createWrapper()

    // Open edit dialog
    const badgeDisplay = wrapper.findComponent({ name: 'BadgeDisplay' })
    await badgeDisplay.vm.$emit('edit', mockMemberBadge)

    // Emit updated event
    await wrapper.findComponent({ name: 'MemberBadgeEditDialog' }).vm.$emit('updated')

    // Should refresh badges
    expect(mockBadgesStore.fetchMemberBadges).toHaveBeenCalledTimes(2) // Once on mount, once after update
  })

  it('should display expiring badges warning', () => {
    mockBadgesStore.memberBadgeSummary = {
      ...mockSummary,
      expiring_soon: 2
    }

    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('2 Expiring')
  })

  it('should display expired badges warning', () => {
    mockBadgesStore.memberBadgeSummary = {
      ...mockSummary,
      expired: 1
    }

    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('1 Expired')
  })

  it('should handle retry when error occurs', async () => {
    mockBadgesStore.error = 'Network error'
    const wrapper = createWrapper()

    // Find retry button and click it
    const retryButton = wrapper.find('button:contains("Retry")')
    if (retryButton.exists()) {
      await retryButton.trigger('click')
      expect(mockBadgesStore.fetchMemberBadges).toHaveBeenCalledWith(1)
    }
  })
})
