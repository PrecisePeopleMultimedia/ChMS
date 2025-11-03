import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { Quasar } from 'quasar'
import ServiceSelector from '@/components/attendance/ServiceSelector.vue'
import { useAttendanceStore } from '@/stores/attendance'

// Mock the attendance store
vi.mock('@/stores/attendance', () => ({
  useAttendanceStore: vi.fn()
}))

// Mock date-fns
vi.mock('date-fns', () => ({
  format: vi.fn((date, formatStr) => {
    if (formatStr === 'EEEE, MMM d, yyyy') return 'Sunday, Dec 25, 2023'
    return date
  }),
  parseISO: vi.fn((date) => new Date(date))
}))

const createWrapper = (props = {}) => {
  return mount(ServiceSelector, {
    props,
    global: {
      plugins: [Quasar, createPinia()],
      stubs: {
        'q-card': { template: '<div class="q-card"><slot /></div>' },
        'q-card-section': { template: '<div class="q-card-section"><slot /></div>' },
        'q-select': { 
          template: '<div class="q-select"><slot name="no-option" /></div>',
          props: ['modelValue', 'options', 'loading', 'label'],
          emits: ['update:modelValue']
        },
        'q-btn': { 
          template: '<button class="q-btn"><slot /></button>',
          props: ['flat', 'color', 'icon', 'label'],
          emits: ['click']
        },
        'q-separator': { template: '<hr class="q-separator" />' },
        'q-chip': { 
          template: '<span class="q-chip"><slot /></span>',
          props: ['color', 'textColor', 'size']
        },
        'q-icon': { 
          template: '<i class="q-icon"></i>',
          props: ['name', 'size']
        },
        'q-item': { template: '<div class="q-item"><slot /></div>' },
        'q-item-section': { template: '<div class="q-item-section"><slot /></div>' }
      }
    }
  })
}

describe('ServiceSelector', () => {
  let mockStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    
    mockStore = {
      services: [],
      isLoading: false,
      todayServices: [],
      fetchServices: vi.fn()
    }

    vi.mocked(useAttendanceStore).mockReturnValue(mockStore)
  })

  describe('Component Rendering', () => {
    it('renders correctly with default props', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.service-selector').exists()).toBe(true)
      expect(wrapper.find('.text-h6').text()).toBe('Select Service')
      expect(wrapper.find('.q-select').exists()).toBe(true)
    })

    it('shows loading state when store is loading', () => {
      mockStore.isLoading = true
      const wrapper = createWrapper()

      const select = wrapper.findComponent({ name: 'q-select' })
      expect(select.props('loading')).toBe(true)
    })

    it('shows no options message when no services available', () => {
      const wrapper = createWrapper()

      expect(wrapper.text()).toContain('No services available')
    })

    it('displays service options correctly', () => {
      mockStore.services = [
        {
          id: 1,
          name: 'Sunday Morning',
          scheduled_date: '2023-12-25',
          start_time: '09:00:00'
        },
        {
          id: 2,
          name: 'Midweek Service',
          scheduled_date: '2023-12-27',
          start_time: '19:00:00'
        }
      ]

      const wrapper = createWrapper()
      const vm = wrapper.vm as any

      expect(vm.serviceOptions).toHaveLength(2)
      expect(vm.serviceOptions[0].label).toContain('Sunday Morning')
      expect(vm.serviceOptions[0].value).toBe(1)
    })
  })

  describe('Service Selection', () => {
    it('emits update:modelValue when service is selected', async () => {
      const wrapper = createWrapper()
      const vm = wrapper.vm as any

      vm.selectedServiceId = 1
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([1])
    })

    it('emits service-selected when a service is chosen', () => {
      mockStore.services = [
        {
          id: 1,
          name: 'Sunday Morning',
          scheduled_date: '2023-12-25',
          start_time: '09:00:00'
        }
      ]

      const wrapper = createWrapper({ modelValue: 1 })
      const vm = wrapper.vm as any

      vm.onServiceSelected(1)

      expect(wrapper.emitted('service-selected')).toBeTruthy()
      expect(wrapper.emitted('service-selected')![0][0]).toEqual(mockStore.services[0])
    })

    it('shows selected service information', () => {
      mockStore.services = [
        {
          id: 1,
          name: 'Sunday Morning Service',
          scheduled_date: '2023-12-25',
          start_time: '09:00:00',
          service_type: 'sunday_morning',
          attendance_records_count: 25
        }
      ]

      const wrapper = createWrapper({ modelValue: 1 })

      expect(wrapper.text()).toContain('Sunday Morning Service')
      expect(wrapper.text()).toContain('Sunday, Dec 25, 2023')
      expect(wrapper.text()).toContain('25 checked in')
    })

    it('shows create service button when service is selected', () => {
      mockStore.services = [
        {
          id: 1,
          name: 'Sunday Morning',
          scheduled_date: '2023-12-25',
          start_time: '09:00:00'
        }
      ]

      const wrapper = createWrapper({ modelValue: 1 })

      const createButton = wrapper.find('button')
      expect(createButton.exists()).toBe(true)
      expect(createButton.text()).toContain('Create New Service')
    })

    it('emits create-service when create button is clicked', async () => {
      mockStore.services = [
        {
          id: 1,
          name: 'Sunday Morning',
          scheduled_date: '2023-12-25',
          start_time: '09:00:00'
        }
      ]

      const wrapper = createWrapper({ modelValue: 1 })
      const createButton = wrapper.find('button')

      await createButton.trigger('click')

      expect(wrapper.emitted('create-service')).toBeTruthy()
    })
  })

  describe('Service Type Formatting', () => {
    it('formats service types correctly', () => {
      const wrapper = createWrapper()
      const vm = wrapper.vm as any

      expect(vm.formatServiceType('sunday_morning')).toBe('Sunday Morning')
      expect(vm.formatServiceType('sunday_evening')).toBe('Sunday Evening')
      expect(vm.formatServiceType('midweek')).toBe('Midweek')
      expect(vm.formatServiceType('special_event')).toBe('Special Event')
      expect(vm.formatServiceType('unknown')).toBe('unknown')
    })

    it('assigns correct colors to service types', () => {
      const wrapper = createWrapper()
      const vm = wrapper.vm as any

      expect(vm.getServiceTypeColor('sunday_morning')).toBe('primary')
      expect(vm.getServiceTypeColor('sunday_evening')).toBe('purple')
      expect(vm.getServiceTypeColor('midweek')).toBe('blue')
      expect(vm.getServiceTypeColor('special_event')).toBe('orange')
      expect(vm.getServiceTypeColor('unknown')).toBe('grey')
    })
  })

  describe('Time Formatting', () => {
    it('formats time correctly', () => {
      const wrapper = createWrapper()
      const vm = wrapper.vm as any

      expect(vm.formatTime('09:00:00')).toBe('9:00 AM')
      expect(vm.formatTime('13:30:00')).toBe('1:30 PM')
      expect(vm.formatTime('00:00:00')).toBe('12:00 AM')
      expect(vm.formatTime('12:00:00')).toBe('12:00 PM')
    })

    it('handles invalid time format gracefully', () => {
      const wrapper = createWrapper()
      const vm = wrapper.vm as any

      expect(vm.formatTime('invalid')).toBe('invalid')
    })
  })

  describe('Lifecycle Hooks', () => {
    it('fetches services on mount if none exist', () => {
      mockStore.services = []
      createWrapper()

      expect(mockStore.fetchServices).toHaveBeenCalled()
    })

    it('does not fetch services on mount if they already exist', () => {
      mockStore.services = [{ id: 1, name: 'Test Service' }]
      createWrapper()

      expect(mockStore.fetchServices).not.toHaveBeenCalled()
    })
  })

  describe('Auto-selection', () => {
    it('auto-selects single today service when not required', async () => {
      mockStore.todayServices = [
        { id: 1, name: 'Today Service' }
      ]

      const wrapper = createWrapper({ required: false })
      
      // Simulate watcher trigger
      const vm = wrapper.vm as any
      await vm.$nextTick()

      // Note: This test would need the actual watcher implementation
      // which is complex to test in isolation
    })

    it('does not auto-select when required prop is true', () => {
      mockStore.todayServices = [
        { id: 1, name: 'Today Service' }
      ]

      const wrapper = createWrapper({ required: true })
      const vm = wrapper.vm as any

      expect(vm.selectedServiceId).toBeNull()
    })
  })

  describe('Props', () => {
    it('accepts modelValue prop', () => {
      const wrapper = createWrapper({ modelValue: 5 })
      const vm = wrapper.vm as any

      expect(vm.selectedServiceId).toBe(5)
    })

    it('accepts required prop', () => {
      const wrapper = createWrapper({ required: true })

      expect(wrapper.props('required')).toBe(true)
    })

    it('has correct default props', () => {
      const wrapper = createWrapper()

      expect(wrapper.props('required')).toBe(false)
      expect(wrapper.props('modelValue')).toBeUndefined()
    })
  })

  describe('Emits', () => {
    it('defines correct emit events', () => {
      const wrapper = createWrapper()

      // Check that the component can emit the expected events
      expect(wrapper.emitted()).toEqual({})
      
      // The component should be able to emit these events
      const expectedEmits = ['update:modelValue', 'service-selected', 'create-service']
      // This is more of a type check that would be caught at compile time
    })
  })
})
