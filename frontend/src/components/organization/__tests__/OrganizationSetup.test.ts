import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { Quasar } from 'quasar'
import OrganizationSetup from '../OrganizationSetup.vue'
import { useOrganizationStore } from '@/stores/organization'

// Mock the router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

// Mock the organization store
vi.mock('@/stores/organization', () => ({
  useOrganizationStore: vi.fn()
}))

const createWrapper = (storeOverrides = {}) => {
  const mockStore = {
    createOrganization: vi.fn(),
    updateSettings: vi.fn(),
    createServiceSchedule: vi.fn(),
    isLoading: false,
    error: null,
    clearError: vi.fn(),
    ...storeOverrides
  }

  vi.mocked(useOrganizationStore).mockReturnValue(mockStore)

  return mount(OrganizationSetup, {
    global: {
      plugins: [Quasar, createPinia()]
    }
  })
}

describe('OrganizationSetup', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should render setup wizard with correct initial step', () => {
      const wrapper = createWrapper()

      expect(wrapper.text()).toContain('Church Setup')
      expect(wrapper.text()).toContain('Step 1 of 4')
      expect(wrapper.text()).toContain('Church Profile')
    })

    it('should show progress indicator', () => {
      const wrapper = createWrapper()

      const progressBar = wrapper.find('.q-linear-progress')
      expect(progressBar.exists()).toBe(true)
    })

    it('should have all step indicators', () => {
      const wrapper = createWrapper()

      expect(wrapper.text()).toContain('Profile')
      expect(wrapper.text()).toContain('Services')
      expect(wrapper.text()).toContain('Settings')
      expect(wrapper.text()).toContain('Complete')
    })
  })

  describe('Step Navigation', () => {
    it('should navigate to next step when valid data is provided', async () => {
      const wrapper = createWrapper()

      // Fill in required church profile data
      wrapper.vm.churchProfile.name = 'Test Church'
      wrapper.vm.churchProfile.timezone = 'Africa/Lagos'

      const nextButton = wrapper.find('button:contains("Next")')
      await nextButton.trigger('click')

      expect(wrapper.vm.currentStep).toBe(2)
      expect(wrapper.text()).toContain('Step 2 of 4')
      expect(wrapper.text()).toContain('Service Times')
    })

    it('should not navigate to next step with invalid data', async () => {
      const wrapper = createWrapper()

      // Leave required fields empty
      wrapper.vm.churchProfile.name = ''

      const nextButton = wrapper.find('button:contains("Next")')
      await nextButton.trigger('click')

      expect(wrapper.vm.currentStep).toBe(1)
      expect(wrapper.text()).toContain('Step 1 of 4')
    })

    it('should navigate back to previous step', async () => {
      const wrapper = createWrapper()

      // Go to step 2 first
      wrapper.vm.currentStep = 2

      const backButton = wrapper.find('button:contains("Back")')
      await backButton.trigger('click')

      expect(wrapper.vm.currentStep).toBe(1)
    })

    it('should not show back button on first step', () => {
      const wrapper = createWrapper()

      const backButton = wrapper.find('button:contains("Back")')
      expect(backButton.exists()).toBe(false)
    })
  })

  describe('Form Validation', () => {
    it('should validate church profile form', async () => {
      const wrapper = createWrapper()

      // Try to proceed without required fields
      const nextButton = wrapper.find('button:contains("Next")')
      await nextButton.trigger('click')

      expect(wrapper.vm.errors.churchProfile).toBeTruthy()
      expect(wrapper.vm.currentStep).toBe(1)
    })

    it('should validate service schedule form', async () => {
      const wrapper = createWrapper()

      // Navigate to service schedule step
      wrapper.vm.currentStep = 2

      // Try to add invalid service schedule
      wrapper.vm.newSchedule = {
        name: '',
        day_of_week: -1,
        start_time: '',
        end_time: '',
        is_active: true
      }

      const addButton = wrapper.find('button:contains("Add Service")')
      await addButton.trigger('click')

      expect(wrapper.vm.errors.serviceSchedule).toBeTruthy()
    })

    it('should validate time range in service schedule', async () => {
      const wrapper = createWrapper()
      wrapper.vm.currentStep = 2

      // Set end time before start time
      wrapper.vm.newSchedule = {
        name: 'Test Service',
        day_of_week: 0,
        start_time: '11:00',
        end_time: '09:00', // Before start time
        is_active: true
      }

      const addButton = wrapper.find('button:contains("Add Service")')
      await addButton.trigger('click')

      expect(wrapper.vm.errors.serviceSchedule).toContain('End time must be after start time')
    })
  })

  describe('Service Schedule Management', () => {
    it('should add service schedule to list', async () => {
      const wrapper = createWrapper()
      wrapper.vm.currentStep = 2

      const validSchedule = {
        name: 'Sunday Service',
        day_of_week: 0,
        start_time: '09:00',
        end_time: '11:00',
        is_active: true
      }

      wrapper.vm.newSchedule = validSchedule
      const addButton = wrapper.find('button:contains("Add Service")')
      await addButton.trigger('click')

      expect(wrapper.vm.serviceSchedules).toContainEqual(
        expect.objectContaining(validSchedule)
      )
    })

    it('should remove service schedule from list', async () => {
      const wrapper = createWrapper()
      wrapper.vm.currentStep = 2

      // Add a schedule first
      const schedule = {
        id: 1,
        name: 'Sunday Service',
        day_of_week: 0,
        start_time: '09:00',
        end_time: '11:00',
        is_active: true
      }
      wrapper.vm.serviceSchedules = [schedule]

      // Remove the schedule
      await wrapper.vm.removeSchedule(0)

      expect(wrapper.vm.serviceSchedules).toHaveLength(0)
    })

    it('should edit service schedule', async () => {
      const wrapper = createWrapper()
      wrapper.vm.currentStep = 2

      const schedule = {
        id: 1,
        name: 'Sunday Service',
        day_of_week: 0,
        start_time: '09:00',
        end_time: '11:00',
        is_active: true
      }
      wrapper.vm.serviceSchedules = [schedule]

      // Edit the schedule
      await wrapper.vm.editSchedule(0)

      expect(wrapper.vm.editingIndex).toBe(0)
      expect(wrapper.vm.newSchedule).toEqual(schedule)
    })
  })

  describe('Setup Completion', () => {
    it('should complete setup successfully', async () => {
      const mockCreateOrganization = vi.fn().mockResolvedValue({ id: 1 })
      const mockUpdateSettings = vi.fn().mockResolvedValue({})
      const mockCreateServiceSchedule = vi.fn().mockResolvedValue({})

      const wrapper = createWrapper({
        createOrganization: mockCreateOrganization,
        updateSettings: mockUpdateSettings,
        createServiceSchedule: mockCreateServiceSchedule
      })

      // Set up complete data
      wrapper.vm.churchProfile = {
        name: 'Test Church',
        address: '123 Test St',
        timezone: 'Africa/Lagos'
      }
      wrapper.vm.serviceSchedules = [{
        name: 'Sunday Service',
        day_of_week: 0,
        start_time: '09:00',
        end_time: '11:00',
        is_active: true
      }]
      wrapper.vm.settings = {
        welcome_message: 'Welcome to our church'
      }

      await wrapper.vm.completeSetup()

      expect(mockCreateOrganization).toHaveBeenCalledWith(wrapper.vm.churchProfile)
      expect(mockUpdateSettings).toHaveBeenCalledWith(wrapper.vm.settings)
      expect(mockCreateServiceSchedule).toHaveBeenCalledWith(wrapper.vm.serviceSchedules[0])
      expect(mockPush).toHaveBeenCalledWith({ name: 'Dashboard' })
    })

    it('should handle setup errors gracefully', async () => {
      const mockCreateOrganization = vi.fn().mockRejectedValue(new Error('Setup failed'))

      const wrapper = createWrapper({
        createOrganization: mockCreateOrganization,
        error: 'Setup failed'
      })

      wrapper.vm.churchProfile = {
        name: 'Test Church',
        timezone: 'Africa/Lagos'
      }

      await wrapper.vm.completeSetup()

      expect(wrapper.vm.currentStep).toBe(4) // Should stay on completion step
      expect(wrapper.text()).toContain('Setup failed')
    })
  })

  describe('Offline Support', () => {
    it('should show offline indicator when offline', async () => {
      // Mock offline state
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false
      })

      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Working Offline')
    })

    it('should save data locally when offline', async () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false
      })

      const wrapper = createWrapper()

      // Mock localStorage
      const mockSetItem = vi.fn()
      Object.defineProperty(window, 'localStorage', {
        value: {
          setItem: mockSetItem,
          getItem: vi.fn(),
          removeItem: vi.fn()
        }
      })

      wrapper.vm.churchProfile.name = 'Test Church'
      await wrapper.vm.saveToLocalStorage()

      expect(mockSetItem).toHaveBeenCalledWith(
        'chms_organization_setup',
        expect.stringContaining('Test Church')
      )
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      const wrapper = createWrapper()

      // Check for progress indicator ARIA
      const progress = wrapper.find('[role="progressbar"]')
      expect(progress.exists()).toBe(true)

      // Check for step navigation ARIA
      const stepIndicators = wrapper.findAll('[role="tab"]')
      expect(stepIndicators.length).toBeGreaterThan(0)
    })

    it('should have proper heading structure', () => {
      const wrapper = createWrapper()

      // Should have main heading
      expect(wrapper.find('h1, h2').exists()).toBe(true)
      
      // Should have step headings
      expect(wrapper.text()).toContain('Church Profile')
    })

    it('should support keyboard navigation', async () => {
      const wrapper = createWrapper()

      const nextButton = wrapper.find('button:contains("Next")')
      expect(nextButton.attributes('tabindex')).not.toBe('-1')
    })
  })

  describe('Mobile Responsiveness', () => {
    it('should have responsive layout classes', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.col-12').exists()).toBe(true)
      expect(wrapper.find('.col-md-8').exists()).toBe(true)
    })

    it('should have mobile-friendly button sizes', () => {
      const wrapper = createWrapper()

      const buttons = wrapper.findAll('button')
      buttons.forEach(button => {
        expect(button.classes()).toContain('q-btn')
      })
    })
  })
})
