import { vi } from 'vitest'

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
