import { vi } from 'vitest'

// Mock Quasar before any imports
vi.mock('quasar', () => ({
  QIcon: {
    name: 'QIcon',
    props: ['name', 'class'],
    template: '<i :class="`q-icon q-icon-${name}`" v-bind="$attrs"><slot /></i>',
  },
  QForm: {
    name: 'QForm',
    props: ['model', 'rules'],
    template: '<form @submit.prevent="$emit(\'submit\')" v-bind="$attrs"><slot /></form>',
    emits: ['submit'],
  },
  QInput: {
    name: 'QInput',
    props: ['modelValue', 'type', 'label', 'outlined', 'rules', 'error', 'errorMessage', 'class'],
    template: `
      <div class="q-input">
        <label v-if="label" class="q-field__label">{{ label }}</label>
        <input 
          :value="modelValue" 
          :type="type" 
          :class="class"
          @input="$emit('update:modelValue', $event.target.value)"
          v-bind="$attrs"
        />
        <div v-if="error && errorMessage" class="q-field__messages">{{ errorMessage }}</div>
      </div>
    `,
    emits: ['update:modelValue'],
  },
  QBtn: {
    name: 'QBtn',
    props: ['color', 'icon', 'label', 'loading', 'disabled', 'class'],
    template: `
      <button 
        :class="class"
        :disabled="disabled || loading"
        @click="$emit('click')"
        v-bind="$attrs"
      >
        <i v-if="icon" :class="\`q-icon q-icon-\${icon}\`"></i>
        <span v-if="label">{{ label }}</span>
        <slot />
      </button>
    `,
    emits: ['click'],
  },
  QCard: {
    name: 'QCard',
    props: ['class'],
    template: '<div :class="`q-card ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
  },
  QCardSection: {
    name: 'QCardSection',
    props: ['class'],
    template: '<div :class="`q-card__section ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
  },
  QLinearProgress: {
    name: 'QLinearProgress',
    props: ['value', 'color', 'trackColor', 'rounded', 'size'],
    template: '<div class="q-linear-progress" v-bind="$attrs"><div class="q-linear-progress__track"></div><div class="q-linear-progress__bar"></div></div>',
  },
  QBadge: {
    name: 'QBadge',
    props: ['color', 'icon', 'class'],
    template: '<span :class="`q-badge q-badge--${color} ${class || \'\'}`" v-bind="$attrs"><i v-if="icon" :class="\`q-icon q-icon-\${icon}\`"></i><slot /></span>',
  },
  QSeparator: {
    name: 'QSeparator',
    props: ['dark'],
    template: '<hr :class="`q-separator ${dark ? \'q-separator--dark\' : \'\'}`" v-bind="$attrs" />',
  },
  QList: {
    name: 'QList',
    props: ['class'],
    template: '<div :class="`q-list ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
  },
  QItem: {
    name: 'QItem',
    props: ['clickable', 'class', 'activeClass'],
    template: '<div :class="`q-item ${clickable ? \'q-item--clickable\' : \'\'} ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
  },
  QItemSection: {
    name: 'QItemSection',
    props: ['avatar', 'class'],
    template: '<div :class="`q-item__section ${avatar ? \'q-item__section--avatar\' : \'\'} ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
  },
  QItemLabel: {
    name: 'QItemLabel',
    props: ['header', 'caption', 'class'],
    template: '<div :class="`q-item__label ${header ? \'q-item__label--header\' : \'\'} ${caption ? \'q-item__label--caption\' : \'\'} ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
  },
  QLayout: {
    name: 'QLayout',
    props: ['view', 'class'],
    template: '<div :class="`q-layout ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
  },
  QHeader: {
    name: 'QHeader',
    props: ['elevated', 'class'],
    template: '<header :class="`q-header ${elevated ? \'q-header--elevated\' : \'\'} ${class || \'\'}`" v-bind="$attrs"><slot /></header>',
  },
  QToolbar: {
    name: 'QToolbar',
    props: ['class'],
    template: '<div :class="`q-toolbar ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
  },
  QToolbarTitle: {
    name: 'QToolbarTitle',
    props: ['class'],
    template: '<div :class="`q-toolbar__title ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
  },
  QDrawer: {
    name: 'QDrawer',
    props: ['modelValue', 'showIfAbove', 'bordered', 'class'],
    template: '<aside :class="`q-drawer ${class || \'\'}`" v-bind="$attrs"><slot /></aside>',
  },
  QPageContainer: {
    name: 'QPageContainer',
    props: ['class'],
    template: '<div :class="`q-page-container ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
  },
  QPage: {
    name: 'QPage',
    props: ['class'],
    template: '<div :class="`q-page ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
  },
  QAvatar: {
    name: 'QAvatar',
    props: ['size', 'class'],
    template: '<div :class="`q-avatar ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
  },
  QMenu: {
    name: 'QMenu',
    props: ['class'],
    template: '<div :class="`q-menu ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
  },
  QBtnDropdown: {
    name: 'QBtnDropdown',
    props: ['flat', 'round', 'dense', 'icon', 'class', 'contentClass'],
    template: `
      <div class="q-btn-dropdown">
        <button :class="class" v-bind="$attrs">
          <i v-if="icon" :class="\`q-icon q-icon-\${icon}\`"></i>
          <slot />
        </button>
        <div :class="\`q-dropdown \${contentClass || ''}\`" v-if="false"><slot name="dropdown" /></div>
      </div>
    `,
  },
  Dark: {
    set: vi.fn(),
    toggle: vi.fn(),
    isActive: false,
  },
  Notify: {
    create: vi.fn(),
  },
  useQuasar: () => ({
    $q: {
      notify: vi.fn(),
      dark: {
        isActive: false,
      },
    },
  }),
}))

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

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

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

// Mock IndexedDB
const mockIDBRequest = {
  result: null,
  error: null,
  readyState: 'done',
  onsuccess: null,
  onerror: null,
  onupgradeneeded: null,
}

const mockIDBTransaction = {
  objectStore: vi.fn().mockReturnValue({
    add: vi.fn().mockReturnValue(mockIDBRequest),
    get: vi.fn().mockReturnValue(mockIDBRequest),
    put: vi.fn().mockReturnValue(mockIDBRequest),
    delete: vi.fn().mockReturnValue(mockIDBRequest),
    clear: vi.fn().mockReturnValue(mockIDBRequest),
    count: vi.fn().mockReturnValue(mockIDBRequest),
    getAll: vi.fn().mockReturnValue(mockIDBRequest),
    openCursor: vi.fn().mockReturnValue(mockIDBRequest),
    openKeyCursor: vi.fn().mockReturnValue(mockIDBRequest),
  }),
  oncomplete: null,
  onerror: null,
  onabort: null,
  abort: vi.fn(),
  commit: vi.fn(),
}

const mockIDBDatabase = {
  createObjectStore: vi.fn().mockReturnValue({
    add: vi.fn().mockReturnValue(mockIDBRequest),
    get: vi.fn().mockReturnValue(mockIDBRequest),
    put: vi.fn().mockReturnValue(mockIDBRequest),
    delete: vi.fn().mockReturnValue(mockIDBRequest),
    clear: vi.fn().mockReturnValue(mockIDBRequest),
    count: vi.fn().mockReturnValue(mockIDBRequest),
    getAll: vi.fn().mockReturnValue(mockIDBRequest),
    openCursor: vi.fn().mockReturnValue(mockIDBRequest),
    openKeyCursor: vi.fn().mockReturnValue(mockIDBRequest),
    createIndex: vi.fn(),
    deleteIndex: vi.fn(),
    index: vi.fn().mockReturnValue({
      get: vi.fn().mockReturnValue(mockIDBRequest),
      getAll: vi.fn().mockReturnValue(mockIDBRequest),
      count: vi.fn().mockReturnValue(mockIDBRequest),
      openCursor: vi.fn().mockReturnValue(mockIDBRequest),
      openKeyCursor: vi.fn().mockReturnValue(mockIDBRequest),
    }),
  }),
  transaction: vi.fn().mockReturnValue(mockIDBTransaction),
  close: vi.fn(),
  onversionchange: null,
  onclose: null,
}

const mockIndexedDB = {
  open: vi.fn().mockReturnValue({
    result: mockIDBDatabase,
    error: null,
    readyState: 'done',
    onsuccess: null,
    onerror: null,
    onupgradeneeded: null,
  }),
  deleteDatabase: vi.fn().mockReturnValue({
    result: null,
    error: null,
    readyState: 'done',
    onsuccess: null,
    onerror: null,
    onblocked: null,
  }),
}

// Mock IDBRequest
global.IDBRequest = vi.fn().mockImplementation(() => mockIDBRequest)

// Mock IDBTransaction
global.IDBTransaction = vi.fn().mockImplementation(() => mockIDBTransaction)

// Mock IDBDatabase
global.IDBDatabase = vi.fn().mockImplementation(() => mockIDBDatabase)

// Mock IDBObjectStore
global.IDBObjectStore = vi.fn().mockImplementation(() => ({
  add: vi.fn().mockReturnValue(mockIDBRequest),
  get: vi.fn().mockReturnValue(mockIDBRequest),
  put: vi.fn().mockReturnValue(mockIDBRequest),
  delete: vi.fn().mockReturnValue(mockIDBRequest),
  clear: vi.fn().mockReturnValue(mockIDBRequest),
  count: vi.fn().mockReturnValue(mockIDBRequest),
  getAll: vi.fn().mockReturnValue(mockIDBRequest),
  openCursor: vi.fn().mockReturnValue(mockIDBRequest),
  openKeyCursor: vi.fn().mockReturnValue(mockIDBRequest),
  createIndex: vi.fn(),
  deleteIndex: vi.fn(),
  index: vi.fn().mockReturnValue({
    get: vi.fn().mockReturnValue(mockIDBRequest),
    getAll: vi.fn().mockReturnValue(mockIDBRequest),
    count: vi.fn().mockReturnValue(mockIDBRequest),
    openCursor: vi.fn().mockReturnValue(mockIDBRequest),
    openKeyCursor: vi.fn().mockReturnValue(mockIDBRequest),
  }),
}))

// Mock IDBIndex
global.IDBIndex = vi.fn().mockImplementation(() => ({
  get: vi.fn().mockReturnValue(mockIDBRequest),
  getAll: vi.fn().mockReturnValue(mockIDBRequest),
  count: vi.fn().mockReturnValue(mockIDBRequest),
  openCursor: vi.fn().mockReturnValue(mockIDBRequest),
  openKeyCursor: vi.fn().mockReturnValue(mockIDBRequest),
}))

// Mock IDBCursor
global.IDBCursor = vi.fn().mockImplementation(() => ({
  continue: vi.fn(),
  advance: vi.fn(),
  update: vi.fn().mockReturnValue(mockIDBRequest),
  delete: vi.fn().mockReturnValue(mockIDBRequest),
}))

// Mock IDBCursorWithValue
global.IDBCursorWithValue = vi.fn().mockImplementation(() => ({
  continue: vi.fn(),
  advance: vi.fn(),
  update: vi.fn().mockReturnValue(mockIDBRequest),
  delete: vi.fn().mockReturnValue(mockIDBRequest),
}))

Object.defineProperty(global, 'indexedDB', {
  value: mockIndexedDB,
  writable: true,
})

// Mock Quasar
global.Quasar = {
  Dark: {
    set: vi.fn(),
    toggle: vi.fn(),
    isActive: false,
  },
  notify: vi.fn(),
}

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

// Export mocks for use in tests
export {
  localStorageMock,
  sessionStorageMock,
}
