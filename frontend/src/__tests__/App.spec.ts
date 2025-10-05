import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'

// Mock the auth store
vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(() => ({
    initializeAuth: vi.fn().mockResolvedValue(undefined),
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false,
    error: null
  }))
}))

describe('App', () => {
  it('mounts renders properly', () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } }
      ]
    })

    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), router],
        stubs: {
          'router-view': true
        }
      }
    })

    expect(wrapper.find('#q-app').exists()).toBe(true)
  })
})
