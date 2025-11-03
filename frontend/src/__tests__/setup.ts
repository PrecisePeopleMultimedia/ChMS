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

// CRITICAL: Don't override Event constructors - jsdom provides them
// vue-test-utils requires jsdom's native Event constructors to work with dispatchEvent
// If these are missing, vue-test-utils will fail with "SupportedEventInterface is not a constructor"

// Ensure jsdom's Event constructors are available on window
// jsdom should provide these automatically, but we verify they exist
if (typeof window !== 'undefined') {
  // Verify Event constructors exist (jsdom provides these)
  if (!window.Event || !window.MouseEvent || !window.KeyboardEvent || !window.InputEvent || !window.FocusEvent) {
    console.warn('Warning: jsdom Event constructors not found. Tests may fail.')
  }
  
  // Ensure these are available for vue-test-utils
  // jsdom should already have these, but we're verifying
  // DO NOT override them with custom classes - it breaks dispatchEvent!
}

// Initialize window.history.state for vue-router
// vue-router's createWebHistory requires history.state to exist
if (typeof window !== 'undefined' && window.history) {
  if (window.history.state === undefined) {
    // Initialize history.state if it doesn't exist
    Object.defineProperty(window.history, 'state', {
      value: null,
      writable: true,
      configurable: true,
    })
  }
}

// Ensure navigator.userAgent exists for accessibility tests
if (typeof navigator !== 'undefined') {
  if (!navigator.userAgent) {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      writable: true,
      configurable: true,
    })
  }
  
  // Ensure navigator.maxTouchPoints exists for Quasar compatibility
  if (!navigator.maxTouchPoints) {
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 0,
      writable: true,
      configurable: true,
    })
  }
}

// Mock IndexedDB
const mockIDBDatabase = {
  objectStoreNames: ['organizations', 'members', 'attendance', 'settings', 'sync_queue'],
  transaction: vi.fn().mockReturnValue({
    objectStore: vi.fn().mockReturnValue({
      add: vi.fn().mockResolvedValue(undefined),
      put: vi.fn().mockResolvedValue(undefined),
      get: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
      getAll: vi.fn().mockResolvedValue([]),
      getAllFromIndex: vi.fn().mockResolvedValue([]),
      clear: vi.fn().mockResolvedValue(undefined),
      createIndex: vi.fn(),
      index: vi.fn().mockReturnValue({
        getAll: vi.fn().mockResolvedValue([]),
      }),
    }),
    oncomplete: null,
    onerror: null,
    onabort: null,
  }),
  close: vi.fn(),
  createObjectStore: vi.fn().mockReturnValue({
    createIndex: vi.fn(),
  }),
}

const mockIDBRequest = {
  result: mockIDBDatabase,
  error: null,
  onsuccess: null as ((event: any) => void) | null,
  onerror: null,
  onupgradeneeded: null,
}

global.indexedDB = {
  open: vi.fn().mockReturnValue(mockIDBRequest),
  deleteDatabase: vi.fn().mockReturnValue(mockIDBRequest),
  databases: vi.fn().mockResolvedValue([]),
  cmp: vi.fn(),
}

// Trigger success callback for IndexedDB open
setTimeout(() => {
  if (mockIDBRequest.onsuccess) {
    mockIDBRequest.onsuccess({ target: mockIDBRequest } as any)
  }
}, 0)

// Mock Cache API
global.caches = {
  open: vi.fn().mockResolvedValue({
    match: vi.fn().mockResolvedValue(undefined),
    matchAll: vi.fn().mockResolvedValue([]),
    add: vi.fn().mockResolvedValue(undefined),
    addAll: vi.fn().mockResolvedValue(undefined),
    put: vi.fn().mockResolvedValue(undefined),
    delete: vi.fn().mockResolvedValue(true),
    keys: vi.fn().mockResolvedValue([]),
  }),
  match: vi.fn().mockResolvedValue(undefined),
  has: vi.fn().mockResolvedValue(false),
  delete: vi.fn().mockResolvedValue(true),
  keys: vi.fn().mockResolvedValue([]),
}

// Mock Service Worker
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: vi.fn().mockResolvedValue({
      installing: null,
      waiting: null,
      active: null,
      scope: 'http://localhost:3000/',
      update: vi.fn().mockResolvedValue(undefined),
      unregister: vi.fn().mockResolvedValue(true),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
    getRegistrations: vi.fn().mockResolvedValue([]),
    ready: Promise.resolve({
      installing: null,
      waiting: null,
      active: null,
      scope: 'http://localhost:3000/',
      update: vi.fn().mockResolvedValue(undefined),
      unregister: vi.fn().mockResolvedValue(true),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
    controller: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  },
  writable: true,
})

// Mock Workbox
vi.mock('workbox-window', () => ({
  Workbox: vi.fn().mockImplementation(() => ({
    register: vi.fn().mockResolvedValue(undefined),
    update: vi.fn().mockResolvedValue(undefined),
    messageSkipWaiting: vi.fn().mockResolvedValue(undefined),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
}))

// Mock network status
Object.defineProperty(navigator, 'onLine', {
  value: true,
  writable: true,
})

// Mock window event listeners for network status
const originalAddEventListener = window.addEventListener
const originalRemoveEventListener = window.removeEventListener

window.addEventListener = vi.fn().mockImplementation((event, handler, options) => {
  if (event === 'online' || event === 'offline') {
    // Store the handler for potential triggering in tests
    return
  }
  return originalAddEventListener.call(window, event, handler, options)
})

window.removeEventListener = vi.fn().mockImplementation((event, handler, options) => {
  if (event === 'online' || event === 'offline') {
    return
  }
  return originalRemoveEventListener.call(window, event, handler, options)
})

// Mock setInterval and clearInterval
window.setInterval = vi.fn().mockImplementation((callback, delay) => {
  return 123 // Return a mock timer ID
})

window.clearInterval = vi.fn()

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
    template: '<div class="q-input"><input v-bind="$attrs" :value="modelValue" :readonly="readonly" :disabled="readonly" @input="$emit(\'update:modelValue\', $event.target.value)" /><slot name="append"></slot><slot name="prepend"></slot></div>',
    props: ['modelValue', 'label', 'placeholder', 'type', 'rules', 'error', 'outlined', 'filled', 'dense', 'readonly'],
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
    template: '<i class="q-icon" v-bind="$attrs"><slot /></i>',
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
  QChip: {
    name: 'QChip',
    template: `
      <div class="q-chip">
        <q-icon v-if="icon" :name="icon" />
        <span v-if="label">{{ label }}</span>
        <slot />
        <q-icon v-if="removable" name="cancel" @click="$emit('remove')" />
      </div>
    `,
    props: ['label', 'icon', 'color', 'text-color', 'size', 'square', 'outline', 'clickable', 'removable', 'selected'],
    emits: ['remove', 'click'],
  },
  QTable: {
    name: 'QTable',
    template: `
      <div class="q-table">
        <table>
          <thead v-if="columns">
            <tr>
              <th v-for="col in columns" :key="col.name">{{ col.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in rows" :key="index">
              <td v-for="col in columns" :key="col.name">
                {{ row[col.field] }}
              </td>
            </tr>
          </tbody>
        </table>
        <slot />
      </div>
    `,
    props: ['rows', 'columns', 'row-key', 'loading', 'pagination', 'filter', 'selection', 'selected'],
    emits: ['update:selected', 'request'],
  },
  QTh: {
    name: 'QTh',
    template: '<th class="q-th"><slot /></th>',
    props: ['props'],
  },
  QTr: {
    name: 'QTr',
    template: '<tr class="q-tr"><slot /></tr>',
    props: ['props'],
  },
  QTd: {
    name: 'QTd',
    template: '<td class="q-td"><slot /></td>',
    props: ['props'],
  },
  QFile: {
    name: 'QFile',
    template: '<input type="file" v-bind="$attrs" @change="$emit(\'update:modelValue\', $event.target.files[0])" />',
    props: ['modelValue', 'label', 'accept', 'multiple', 'outlined', 'filled'],
    emits: ['update:modelValue'],
  },
  QCardActions: {
    name: 'QCardActions',
    template: '<div class="q-card__actions"><slot /></div>',
    props: ['align', 'vertical'],
  },
  QTextarea: {
    name: 'QTextarea',
    template: '<textarea v-bind="$attrs" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></textarea>',
    props: ['modelValue', 'label', 'placeholder', 'rows', 'outlined', 'filled'],
    emits: ['update:modelValue'],
  },
  QDate: {
    name: 'QDate',
    template: '<input type="date" v-bind="$attrs" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['modelValue', 'mask', 'locale'],
    emits: ['update:modelValue'],
  },
  QPopupProxy: {
    name: 'QPopupProxy',
    template: '<div v-if="modelValue" class="q-popup-proxy"><slot /></div>',
    props: ['modelValue', 'cover', 'transition-show', 'transition-hide'],
    emits: ['update:modelValue'],
  },
  QTime: {
    name: 'QTime',
    template: '<input type="time" v-bind="$attrs" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['modelValue', 'mask', 'format24h'],
    emits: ['update:modelValue'],
  },
  QSlider: {
    name: 'QSlider',
    template: '<input type="range" v-bind="$attrs" :value="modelValue" @input="$emit(\'update:modelValue\', Number($event.target.value))" />',
    props: ['modelValue', 'min', 'max', 'step', 'label', 'markers'],
    emits: ['update:modelValue'],
  },
  QRange: {
    name: 'QRange',
    template: '<div class="q-range"><input type="range" v-bind="$attrs" /></div>',
    props: ['modelValue', 'min', 'max', 'step'],
    emits: ['update:modelValue'],
  },
  QRating: {
    name: 'QRating',
    template: '<div class="q-rating"><span v-for="n in max" :key="n">⭐</span></div>',
    props: ['modelValue', 'max', 'size', 'color', 'icon'],
    emits: ['update:modelValue'],
  },
  QKnob: {
    name: 'QKnob',
    template: '<div class="q-knob">{{ modelValue }}</div>',
    props: ['modelValue', 'min', 'max', 'step', 'size'],
    emits: ['update:modelValue'],
  },
  QOptionGroup: {
    name: 'QOptionGroup',
    template: `
      <div class="q-option-group">
        <div v-for="option in options" :key="option.value">
          <input
            :type="type"
            :name="name"
            :value="option.value"
            :checked="modelValue === option.value || (Array.isArray(modelValue) && modelValue.includes(option.value))"
            @change="handleChange"
          />
          <label>{{ option.label }}</label>
        </div>
      </div>
    `,
    props: ['modelValue', 'options', 'type', 'name'],
    emits: ['update:modelValue'],
    methods: {
      handleChange(event: Event) {
        const target = event.target as HTMLInputElement
        if (this.type === 'checkbox') {
          const newValue = Array.isArray(this.modelValue) ? [...this.modelValue] : []
          if (target.checked) {
            newValue.push(target.value)
          } else {
            const index = newValue.indexOf(target.value)
            if (index > -1) newValue.splice(index, 1)
          }
          this.$emit('update:modelValue', newValue)
        } else {
          this.$emit('update:modelValue', target.value)
        }
      }
    }
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

// Mock $q object for components
const mockQuasarInstance = {
  notify: vi.fn(),
  dialog: vi.fn().mockReturnValue({
    onOk: vi.fn().mockReturnThis(),
    onCancel: vi.fn().mockReturnThis(),
    onDismiss: vi.fn().mockReturnThis(),
  }),
  loading: {
    show: vi.fn(),
    hide: vi.fn(),
  },
  dark: {
    set: vi.fn(),
    toggle: vi.fn(),
    isActive: false,
  },
  localStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  sessionStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
}

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

// Initialize global Pinia instance for tests
const globalPinia = createTestPinia()

// Global test helpers
export const createTestApp = (component: any, options: any = {}) => {
  const { router, pinia, ...otherOptions } = options

  return {
    global: {
      plugins: [
        router || createTestRouter(),
        pinia || globalPinia,
      ],
      stubs: {
        'router-link': true,
        'router-view': true,
      },
      mocks: {
        $q: mockQuasarInstance,
      },
      provide: {
        $q: mockQuasarInstance,
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
