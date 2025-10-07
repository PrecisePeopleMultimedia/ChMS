import { vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory, type Router } from 'vue-router'
import type { Component } from 'vue'

// Test router configuration
export function createTestRouter(): Router {
  return createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        name: 'Home',
        component: { template: '<div>Home</div>' }
      },
      {
        path: '/auth/login',
        name: 'Login',
        component: { template: '<div>Login</div>' }
      },
      {
        path: '/auth/register',
        name: 'Register',
        component: { template: '<div>Register</div>' }
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: { template: '<div>Dashboard</div>' }
      },
      {
        path: '/setup',
        name: 'OrganizationSetup',
        component: { template: '<div>Setup</div>' }
      }
    ]
  })
}

// Test Pinia store setup
export function createTestPinia() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return pinia
}

// Mock store factories
export function createMockAuthStore() {
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    initializeAuth: vi.fn(),
    clearError: vi.fn(),
    hasRole: vi.fn(() => false),
    isAdmin: false,
    isStaff: false,
  }
}

export function createMockOrganizationStore() {
  return {
    organization: null,
    isSetupComplete: false,
    isLoading: false,
    error: null,
    fetchOrganization: vi.fn(),
    createOrganization: vi.fn(),
    updateOrganization: vi.fn(),
    clearError: vi.fn(),
  }
}

// Enhanced component mounting utility
export interface MountOptions {
  props?: Record<string, any>
  slots?: Record<string, any>
  global?: {
    plugins?: any[]
    mocks?: Record<string, any>
    stubs?: Record<string, any>
  }
  router?: Router
  pinia?: any
  attachTo?: HTMLElement
}

export function mountComponent(component: Component, options: MountOptions = {}): VueWrapper {
  const router = options.router || createTestRouter()
  const pinia = options.pinia || createTestPinia()

  // Default global configuration
  const defaultGlobal = {
    plugins: [router, pinia],
    mocks: {
      $t: (key: string) => key, // Mock i18n
      $router: router,
      $route: router.currentRoute.value,
    },
    stubs: {
      // Stub Quasar components with functional equivalents
      QForm: {
        template: '<form @submit.prevent="$emit(\'submit\', $event)"><slot /></form>',
        emits: ['submit'],
      },
      QInput: {
        template: `
          <div class="q-input">
            <label v-if="label">{{ label }}</label>
            <input 
              :type="type || 'text'"
              :value="modelValue"
              :placeholder="placeholder"
              @input="$emit('update:modelValue', $event.target.value)"
              @focus="$emit('focus', $event)"
              @blur="$emit('blur', $event)"
            />
            <div v-if="error" class="text-destructive">{{ error }}</div>
          </div>
        `,
        props: ['modelValue', 'label', 'placeholder', 'type', 'rules', 'error', 'lazyRules'],
        emits: ['update:modelValue', 'focus', 'blur'],
      },
      QBtn: {
        template: `
          <button 
            :type="type || 'button'"
            :disabled="loading || disable"
            @click="$emit('click', $event)"
            class="q-btn"
          >
            <span v-if="loading">Loading...</span>
            <slot v-else />
          </button>
        `,
        props: ['loading', 'disable', 'type', 'color', 'size', 'icon'],
        emits: ['click'],
      },
      QCard: {
        template: '<div class="q-card"><slot /></div>',
      },
      QCardSection: {
        template: '<div class="q-card-section"><slot /></div>',
      },
      QCheckbox: {
        template: `
          <label class="q-checkbox">
            <input 
              type="checkbox"
              :checked="modelValue"
              @change="$emit('update:modelValue', $event.target.checked)"
            />
            <span v-if="label">{{ label }}</span>
          </label>
        `,
        props: ['modelValue', 'label'],
        emits: ['update:modelValue'],
      },
      QSelect: {
        template: `
          <div class="q-select">
            <label v-if="label">{{ label }}</label>
            <select 
              :value="modelValue"
              @change="$emit('update:modelValue', $event.target.value)"
            >
              <option v-for="option in options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        `,
        props: ['modelValue', 'options', 'label'],
        emits: ['update:modelValue'],
      },
      QIcon: {
        template: '<i :class="name"><slot /></i>',
        props: ['name', 'size', 'color'],
      },
      QSeparator: {
        template: '<hr class="q-separator" />',
      },
      // Stub router components
      RouterLink: {
        template: '<a @click="$emit(\'click\', $event)"><slot /></a>',
        props: ['to'],
        emits: ['click'],
      },
      RouterView: {
        template: '<div class="router-view"><slot /></div>',
      },
      // Stub custom components
      ModernButton: {
        template: `
          <button
            :type="type || 'button'"
            :disabled="loading || disabled"
            @click="$emit('click', $event)"
            class="modern-button"
            :class="[variant, size, { 'opacity-50': disabled, 'animate-pulse': loading }]"
          >
            <span v-if="loading">Loading...</span>
            <template v-else>
              <slot name="icon" />
              <slot />
            </template>
          </button>
        `,
        props: ['variant', 'size', 'loading', 'disabled', 'type'],
        emits: ['click'],
      },
      ModernInput: {
        template: `
          <div class="modern-input">
            <label v-if="label">{{ label }}</label>
            <input
              :type="type || 'text'"
              :value="modelValue"
              :placeholder="placeholder"
              :disabled="disabled"
              @input="$emit('update:modelValue', $event.target.value)"
              @focus="$emit('focus', $event)"
              @blur="$emit('blur', $event)"
            />
            <div v-if="error" class="text-destructive">{{ error }}</div>
            <div v-else-if="helpText" class="text-muted-foreground">{{ helpText }}</div>
          </div>
        `,
        props: ['modelValue', 'label', 'placeholder', 'type', 'disabled', 'error', 'helpText'],
        emits: ['update:modelValue', 'focus', 'blur'],
      },
      BaseFormCard: {
        template: `
          <div class="base-form-card">
            <header v-if="title || subtitle || $slots.header">
              <slot name="header">
                <h1 v-if="title">{{ title }}</h1>
                <p v-if="subtitle">{{ subtitle }}</p>
              </slot>
            </header>
            <main>
              <slot name="content">
                <slot />
              </slot>
            </main>
            <footer v-if="$slots.footer">
              <slot name="footer" />
            </footer>
          </div>
        `,
        props: ['title', 'subtitle', 'variant', 'maxWidth'],
      },
    },
    ...options.global,
  }

  // Merge global options
  if (options.global) {
    if (options.global.plugins) {
      defaultGlobal.plugins.push(...options.global.plugins)
    }
    if (options.global.mocks) {
      Object.assign(defaultGlobal.mocks, options.global.mocks)
    }
    if (options.global.stubs) {
      Object.assign(defaultGlobal.stubs, options.global.stubs)
    }
  }

  return mount(component, {
    ...options,
    global: defaultGlobal,
  })
}

// Test data factories
export function createTestUser(overrides = {}) {
  return {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'admin',
    organization_id: 1,
    ...overrides,
  }
}

export function createTestOrganization(overrides = {}) {
  return {
    id: 1,
    name: 'Test Church',
    email: 'admin@testchurch.com',
    phone: '+234-123-456-7890',
    address: '123 Test Street, Lagos, Nigeria',
    timezone: 'Africa/Lagos',
    ...overrides,
  }
}

// Mock API responses
export function mockApiSuccess(data: any) {
  return Promise.resolve({ data })
}

export function mockApiError(message = 'API Error', status = 500) {
  const error = new Error(message) as any
  error.response = { status, data: { message } }
  return Promise.reject(error)
}

// Storage mocks with reset functionality
export function resetStorageMocks() {
  vi.clearAllMocks()
  
  // Reset localStorage mock
  const localStorageMock = (window as any).localStorage
  if (localStorageMock) {
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
    localStorageMock.clear.mockClear()
  }

  // Reset sessionStorage mock
  const sessionStorageMock = (window as any).sessionStorage
  if (sessionStorageMock) {
    sessionStorageMock.getItem.mockReturnValue(null)
    sessionStorageMock.setItem.mockClear()
    sessionStorageMock.removeItem.mockClear()
    sessionStorageMock.clear.mockClear()
  }
}

// Test cleanup utility
export function cleanupTest() {
  resetStorageMocks()
  vi.clearAllTimers()
  vi.useRealTimers()
}
