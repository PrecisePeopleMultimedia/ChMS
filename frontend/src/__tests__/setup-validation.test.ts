import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestRouter, createTestPinia, createTestApp } from './setup'

// Test that our setup utilities work
describe('Test Setup Validation', () => {
  it('should create test router with default routes', () => {
    const router = createTestRouter()
    expect(router).toBeDefined()
    expect(router.getRoutes()).toHaveLength(3) // Default routes
  })

  it('should create test router with custom routes', () => {
    const customRoutes = [
      { path: '/custom', component: { template: '<div>Custom</div>' } }
    ]
    const router = createTestRouter(customRoutes as any)
    expect(router.getRoutes()).toHaveLength(4) // Default + custom
  })

  it('should create test pinia store', () => {
    const pinia = createTestPinia()
    expect(pinia).toBeDefined()
  })

  it('should create test app with router and pinia', () => {
    const TestComponent = {
      template: '<div>Test Component</div>'
    }
    
    const appOptions = createTestApp(TestComponent)
    expect(appOptions.global.plugins).toHaveLength(2) // router + pinia
    expect(appOptions.global.stubs['router-link']).toBe(true)
    expect(appOptions.global.stubs['router-view']).toBe(true)
  })

  it('should mock Quasar components', () => {
    // Test that Quasar components are mocked
    const { QBtn, QInput, QCard } = require('quasar')
    expect(QBtn).toBeDefined()
    expect(QInput).toBeDefined()
    expect(QCard).toBeDefined()
  })

  it('should have global Quasar mocks', () => {
    expect((global as any).Quasar).toBeDefined()
    expect((global as any).Quasar.Dark).toBeDefined()
    expect((global as any).Quasar.notify).toBeDefined()
    expect((global as any).Quasar.Loading).toBeDefined()
  })

  it('should have browser API mocks', () => {
    expect(global.matchMedia).toBeDefined()
    expect(global.ResizeObserver).toBeDefined()
    expect(global.IntersectionObserver).toBeDefined()
    expect(window.localStorage).toBeDefined()
    expect(window.sessionStorage).toBeDefined()
  })
})
