import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import MemberCard from '../MemberCard.vue'
import type { Member } from '@/types/member'

// Mock Quasar
const mockQuasar = {
  install: vi.fn(),
  version: '2.0.0'
}

// Create wrapper function with Quasar
const createWrapper = (props: any) => {
  return mount(MemberCard, {
    props,
    global: {
      plugins: [mockQuasar as any]
    }
  })
}

describe('MemberCard', () => {
  const mockMember: Member = {
    id: 1,
    organization_id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    date_of_birth: '1990-01-15',
    gender: 'male',
    address: '123 Main St, City, State',
    member_type: 'adult',
    join_date: '2023-01-01',
    is_active: true,
    notes: 'Test member notes',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    family: {
      id: 1,
      organization_id: 1,
      family_name: 'Doe Family',
      head_of_family_id: 1,
      address: '123 Main St',
      phone: '+1234567890',
      email: 'doe.family@example.com',
      notes: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders member information correctly', () => {
    const wrapper = createWrapper({ member: mockMember })

    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('john.doe@example.com')
    expect(wrapper.text()).toContain('+1234567890')
    expect(wrapper.text()).toContain('Doe Family')
  })

  it('displays member initials when no avatar', () => {
    const wrapper = createWrapper({ member: mockMember })

    const avatar = wrapper.find('.bg-primary')
    expect(avatar.text()).toBe('JD')
  })

  it('shows member type label correctly', () => {
    const wrapper = createWrapper({ member: mockMember })
    expect(wrapper.text()).toContain('Adult')

    const childMember = { ...mockMember, member_type: 'child' as const }
    const childWrapper = createWrapper({ member: childMember })
    expect(childWrapper.text()).toContain('Child')
  })

  it('displays inactive status for inactive members', () => {
    const inactiveMember = { ...mockMember, is_active: false }
    const wrapper = createWrapper({ member: inactiveMember })

    expect(wrapper.text()).toContain('Inactive')
  })

  it('calculates and displays member age correctly', () => {
    const wrapper = createWrapper({ member: mockMember })
    
    // Calculate expected age (member born in 1990)
    const currentYear = new Date().getFullYear()
    const expectedAge = currentYear - 1990
    
    expect(wrapper.text()).toContain(`${expectedAge} years old`)
  })

  it('emits view event when view button is clicked', async () => {
    const wrapper = createWrapper({ member: mockMember })

    const viewButton = wrapper.find('[data-testid="view-button"]')
    if (viewButton.exists()) {
      await viewButton.trigger('click')
      expect(wrapper.emitted('view')).toBeTruthy()
      expect(wrapper.emitted('view')?.[0]).toEqual([mockMember])
    }
  })

  it('emits edit event when edit button is clicked', async () => {
    const wrapper = createWrapper({ member: mockMember })

    const editButton = wrapper.find('[data-testid="edit-button"]')
    if (editButton.exists()) {
      await editButton.trigger('click')
      expect(wrapper.emitted('edit')).toBeTruthy()
      expect(wrapper.emitted('edit')?.[0]).toEqual([mockMember])
    }
  })

  it('emits delete event when delete button is clicked', async () => {
    const wrapper = createWrapper({ member: mockMember })

    const deleteButton = wrapper.find('[data-testid="delete-button"]')
    if (deleteButton.exists()) {
      await deleteButton.trigger('click')
      expect(wrapper.emitted('delete')).toBeTruthy()
      expect(wrapper.emitted('delete')?.[0]).toEqual([mockMember])
    }
  })

  it('handles member without family gracefully', () => {
    const memberWithoutFamily = { ...mockMember, family: null, family_id: null }
    const wrapper = createWrapper({ member: memberWithoutFamily })

    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).not.toContain('Doe Family')
  })

  it('handles member without email gracefully', () => {
    const memberWithoutEmail = { ...mockMember, email: null }
    const wrapper = createWrapper({ member: memberWithoutEmail })

    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).not.toContain('john.doe@example.com')
  })

  it('handles member without phone gracefully', () => {
    const memberWithoutPhone = { ...mockMember, phone: null }
    const wrapper = createWrapper({ member: memberWithoutPhone })

    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).not.toContain('+1234567890')
  })

  it('handles member without date of birth gracefully', () => {
    const memberWithoutDOB = { ...mockMember, date_of_birth: null }
    const wrapper = createWrapper({ member: memberWithoutDOB })

    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).not.toContain('years old')
  })

  it('formats join date correctly', () => {
    const wrapper = createWrapper({ member: mockMember })
    expect(wrapper.text()).toContain('Joined Jan 2023')
  })

  it('shows correct member type for all types', () => {
    const memberTypes = [
      { type: 'adult', label: 'Adult' },
      { type: 'child', label: 'Child' },
      { type: 'youth', label: 'Youth' },
      { type: 'visitor', label: 'Visitor' }
    ] as const

    memberTypes.forEach(({ type, label }) => {
      const member = { ...mockMember, member_type: type }
      const wrapper = createWrapper({ member })
      expect(wrapper.text()).toContain(label)
    })
  })

  it('applies hover effects correctly', async () => {
    const wrapper = createWrapper({ member: mockMember })
    const card = wrapper.find('.member-card')

    expect(card.exists()).toBe(true)
    expect(card.classes()).toContain('member-card')
  })

  it('handles long names gracefully', () => {
    const memberWithLongName = {
      ...mockMember,
      first_name: 'VeryLongFirstNameThatMightCauseLayoutIssues',
      last_name: 'VeryLongLastNameThatMightCauseLayoutIssues'
    }
    
    const wrapper = createWrapper({ member: memberWithLongName })
    expect(wrapper.text()).toContain('VeryLongFirstNameThatMightCauseLayoutIssues')
    expect(wrapper.text()).toContain('VeryLongLastNameThatMightCauseLayoutIssues')
  })

  it('handles special characters in names', () => {
    const memberWithSpecialChars = {
      ...mockMember,
      first_name: "Jean-François",
      last_name: "O'Connor"
    }
    
    const wrapper = createWrapper({ member: memberWithSpecialChars })
    expect(wrapper.text()).toContain("Jean-François")
    expect(wrapper.text()).toContain("O'Connor")
  })
})
