import { vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

// Mock browser APIs for testing environment
global.matchMedia = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(), // deprecated
  removeListener: vi.fn(), // deprecated
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))

// Mock localStorage with proper reset functionality
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    length: 0,
    key: vi.fn(),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock sessionStorage with proper reset functionality
const sessionStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    length: 0,
    key: vi.fn(),
  }
})()

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
})

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: '',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  },
  writable: true,
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn().mockImplementation((cb) => {
  return setTimeout(cb, 16)
})

global.cancelAnimationFrame = vi.fn().mockImplementation((id) => {
  clearTimeout(id)
})

// Mock Quasar Framework
;(global as any).Quasar = {
  Dark: {
    set: vi.fn(),
    toggle: vi.fn(),
    isActive: false,
  },
  notify: vi.fn(),
  Loading: {
    show: vi.fn(),
    hide: vi.fn(),
  },
  Dialog: {
    create: vi.fn(),
  },
  Notify: {
    create: vi.fn(),
  },
}

// Mock Quasar components
vi.mock('quasar', () => ({
  // Export Quasar object for plugin usage
  Quasar: {
    install: vi.fn(),
  },
  QBtn: {
    name: 'QBtn',
    template: '<button><slot /></button>',
    props: ['label', 'color', 'type', 'size', 'icon', 'loading', 'disable'],
  },
  QInput: {
    name: 'QInput',
    template: '<input v-bind="$attrs" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['modelValue', 'label', 'placeholder', 'type', 'rules', 'error', 'outlined', 'filled', 'dense'],
    emits: ['update:modelValue'],
  },
  QCard: {
    name: 'QCard',
    template: '<div class="q-card"><slot /></div>',
  },
  QCardSection: {
    name: 'QCardSection',
    template: '<div class="q-card__section"><slot /></div>',
  },
  QForm: {
    name: 'QForm',
    template: '<form @submit.prevent="$emit(\'submit\', $event)"><slot /></form>',
    props: ['modelValue'],
    emits: ['submit'],
  },
  QSelect: {
    name: 'QSelect',
    template: '<select v-bind="$attrs"><slot /></select>',
    props: ['modelValue', 'options', 'label', 'multiple'],
  },
  QCheckbox: {
    name: 'QCheckbox',
    template: '<input type="checkbox" v-bind="$attrs" />',
    props: ['modelValue', 'label', 'val'],
  },
  QRadio: {
    name: 'QRadio',
    template: '<input type="radio" v-bind="$attrs" />',
    props: ['modelValue', 'label', 'val'],
  },
  QToggle: {
    name: 'QToggle',
    template: '<input type="checkbox" v-bind="$attrs" />',
    props: ['modelValue', 'label'],
  },
  QIcon: {
    name: 'QIcon',
    template: '<i v-bind="$attrs"><slot /></i>',
    props: ['name', 'size', 'color'],
  },
  QSpinner: {
    name: 'QSpinner',
    template: '<div class="q-spinner">Loading...</div>',
    props: ['size', 'color'],
  },
  QSeparator: {
    name: 'QSeparator',
    template: '<hr />',
  },
  QSpace: {
    name: 'QSpace',
    template: '<div class="q-space"><slot /></div>',
  },
  QItem: {
    name: 'QItem',
    template: '<div class="q-item"><slot /></div>',
    props: ['clickable', 'active'],
  },
  QItemSection: {
    name: 'QItemSection',
    template: '<div class="q-item__section"><slot /></div>',
    props: ['avatar', 'thumbnail', 'side'],
  },
  QItemLabel: {
    name: 'QItemLabel',
    template: '<div class="q-item__label"><slot /></div>',
  },
  QList: {
    name: 'QList',
    template: '<div class="q-list"><slot /></div>',
  },
  QExpansionItem: {
    name: 'QExpansionItem',
    template: '<div class="q-expansion-item"><slot /></div>',
    props: ['label', 'header-class', 'expand-separator'],
  },
  QDialog: {
    name: 'QDialog',
    template: '<div v-if="modelValue" class="q-dialog"><slot /></div>',
    props: ['modelValue', 'persistent'],
  },
  QHeader: {
    name: 'QHeader',
    template: '<header class="q-header"><slot /></header>',
  },
  QFooter: {
    name: 'QFooter',
    template: '<footer class="q-footer"><slot /></footer>',
  },
  QDrawer: {
    name: 'QDrawer',
    template: '<aside class="q-drawer"><slot /></aside>',
    props: ['modelValue', 'side', 'overlay'],
  },
  QPage: {
    name: 'QPage',
    template: '<main class="q-page"><slot /></main>',
  },
  QPageContainer: {
    name: 'QPageContainer',
    template: '<div class="q-page-container"><slot /></div>',
  },
  QLayout: {
    name: 'QLayout',
    template: '<div class="q-layout"><slot /></div>',
    props: ['view'],
  },
  QToolbar: {
    name: 'QToolbar',
    template: '<div class="q-toolbar"><slot /></div>',
  },
  QToolbarTitle: {
    name: 'QToolbarTitle',
    template: '<div class="q-toolbar__title"><slot /></div>',
  },
  QBtnToggle: {
    name: 'QBtnToggle',
    template: '<div class="q-btn-toggle"><slot /></div>',
    props: ['modelValue', 'options', 'color'],
  },
  QBadge: {
    name: 'QBadge',
    template: '<span class="q-badge"><slot /></span>',
    props: ['color', 'floating', 'transparent'],
  },
  QAvatar: {
    name: 'QAvatar',
    template: '<div class="q-avatar"><slot /></div>',
    props: ['size', 'color', 'text-color', 'icon', 'square'],
  },
  QImg: {
    name: 'QImg',
    template: '<img v-bind="$attrs" />',
    props: ['src', 'alt', 'loading'],
  },
  QSpinnerDots: {
    name: 'QSpinnerDots',
    template: '<div class="q-spinner-dots">Loading...</div>',
    props: ['size', 'color'],
  },
  QSpinnerGears: {
    name: 'QSpinnerGears',
    template: '<div class="q-spinner-gears">Loading...</div>',
    props: ['size', 'color'],
  },
  QSpinnerHourglass: {
    name: 'QSpinnerHourglass',
    template: '<div class="q-spinner-hourglass">Loading...</div>',
    props: ['size', 'color'],
  },
  QSpinnerInfinity: {
    name: 'QSpinnerInfinity',
    template: '<div class="q-spinner-infinity">Loading...</div>',
    props: ['size', 'color'],
  },
  QSpinnerIos: {
    name: 'QSpinnerIos',
    template: '<div class="q-spinner-ios">Loading...</div>',
    props: ['size', 'color'],
  },
  QSpinnerOrbit: {
    name: 'QSpinnerOrbit',
    template: '<div class="q-spinner-orbit">Loading...</div>',
    props: ['size', 'color'],
  },
  QSpinnerOval: {
    name: 'QSpinnerOval',
    template: '<div class="q-spinner-oval">Loading...</div>',
    props: ['size', 'color'],
  },
  QSpinnerPuff: {
    name: 'QSpinnerPuff',
    template: '<div class="q-spinner-puff">Loading...</div>',
    props: ['size', 'color'],
  },
  QSpinnerRings: {
    name: 'QSpinnerRings',
    template: '<div class="q-spinner-rings">Loading...</div>',
    props: ['size', 'color'],
  },
  QSpinnerTail: {
    name: 'QSpinnerTail',
    template: '<div class="q-spinner-tail">Loading...</div>',
    props: ['size', 'color'],
  },
  QBanner: {
    name: 'QBanner',
    template: `
      <div class="q-banner">
        <div class="q-banner__avatar">
          <slot name="avatar">
            <q-icon v-if="icon" :name="icon" />
          </slot>
        </div>
        <div class="q-banner__content">
          <slot />
        </div>
        <div v-if="$slots.action" class="q-banner__actions">
          <slot name="action" />
        </div>
      </div>
    `,
    props: ['icon', 'color', 'textColor', 'inline', 'dense', 'rounded'],
  },
  QStepper: {
    name: 'QStepper',
    template: `
      <div class="q-stepper">
        <slot />
      </div>
    `,
    props: ['modelValue', 'vertical', 'flat', 'bordered', 'alternative-labels', 'header-nav'],
    emits: ['update:modelValue'],
  },
  QStep: {
    name: 'QStep',
    template: `
      <div class="q-step">
        <slot />
      </div>
    `,
    props: ['name', 'title', 'caption', 'icon', 'color', 'prefix', 'done-icon', 'done-color', 'active-icon', 'active-color', 'error-icon', 'error-color', 'header-nav', 'done', 'disable'],
  },
  QStepperNavigation: {
    name: 'QStepperNavigation',
    template: `
      <div class="q-stepper__nav">
        <slot />
      </div>
    `,
  },
  QTooltip: {
    name: 'QTooltip',
    template: `
      <div class="q-tooltip">
        <slot />
      </div>
    `,
    props: ['anchor', 'offset', 'delay', 'max-width', 'max-height', 'class', 'style'],
  },
  // useQuasar composable
  useQuasar: () => ({
    notify: vi.fn(),
    dialog: vi.fn(),
    loading: {
      show: vi.fn(),
      hide: vi.fn(),
    },
    dark: {
      set: vi.fn(),
      toggle: vi.fn(),
      isActive: false,
    },
  }),
}))

// Mock Quasar plugins
vi.mock('quasar/src/plugins/Notify', () => ({
  Notify: {
    create: vi.fn(),
    registerType: vi.fn(),
  },
}))

vi.mock('quasar/src/plugins/Dialog', () => ({
  Dialog: {
    create: vi.fn(),
  },
}))

vi.mock('quasar/src/plugins/Loading', () => ({
  Loading: {
    show: vi.fn(),
    hide: vi.fn(),
  },
}))

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

console.error = vi.fn().mockImplementation((...args) => {
  // Only show actual errors, not Vue warnings
  if (!args[0]?.includes?.('[Vue warn]')) {
    originalConsoleError(...args)
  }
})

console.warn = vi.fn().mockImplementation((...args) => {
  // Only show actual warnings, not Vue warnings
  if (!args[0]?.includes?.('[Vue warn]')) {
    originalConsoleWarn(...args)
  }
})

// Test utilities for Vue Router and Pinia
export const createTestRouter = (routes = []) => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: { template: '<div>Home</div>' } },
      { path: '/login', component: { template: '<div>Login</div>' } },
      { path: '/dashboard', component: { template: '<div>Dashboard</div>' } },
      ...routes,
    ],
  })

  // Mock router methods to prevent warnings
  router.resolve = vi.fn().mockImplementation((to) => {
    if (typeof to === 'string') {
      return {
        path: to,
        name: undefined,
        params: {},
        query: {},
        hash: '',
        fullPath: to,
        matched: [],
        meta: {},
        redirectedFrom: undefined,
      }
    }
    return to
  })

  return router
}

export const createTestPinia = () => {
  const pinia = createPinia()
  setActivePinia(pinia)
  return pinia
}

// Global test helpers
export const createTestApp = (component: any, options: any = {}) => {
  const { router, pinia, ...otherOptions } = options
  
  return {
    global: {
      plugins: [
        router || createTestRouter(),
        pinia || createTestPinia(),
      ],
      stubs: {
        'router-link': true,
        'router-view': true,
      },
      ...otherOptions,
    },
  }
}

// Mock API responses
export const mockApiResponse = (data: any, status = 200) => {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {},
  }
}

// Mock API error
export const mockApiError = (message = 'API Error', status = 500) => {
  const error = new Error(message)
  ;(error as any).response = {
    data: { message },
    status,
    statusText: 'Internal Server Error',
    headers: {},
    config: {},
  }
  return error
}

// Export mocks for use in tests
export {
  localStorageMock,
  sessionStorageMock,
}
