import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  // State
  const theme = ref<'light' | 'dark' | 'system'>('system')
  const isSystemDark = ref(false)

  // Computed
  const isDark = computed(() => {
    if (theme.value === 'system') {
      return isSystemDark.value
    }
    return theme.value === 'dark'
  })

  const themeClass = computed(() => {
    return isDark.value ? 'dark' : 'light'
  })

  // Methods
  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    theme.value = newTheme
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', newTheme)
    }
    applyTheme()
  }

  const toggleTheme = () => {
    if (theme.value === 'system') {
      setTheme('light')
    } else if (theme.value === 'light') {
      setTheme('dark')
    } else {
      setTheme('system')
    }
  }

  const applyTheme = () => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement

      // Remove existing theme classes
      root.classList.remove('light', 'dark')

      // Add current theme class
      root.classList.add(themeClass.value)
    }

    // Update Quasar dark mode
    if (typeof window !== 'undefined' && window.Quasar) {
      window.Quasar.Dark.set(isDark.value)
    }
  }

  const detectSystemTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      isSystemDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  }

  const initializeTheme = () => {
    // Load saved theme preference
    if (typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        theme.value = savedTheme
      }
    }

    // Detect system theme
    detectSystemTheme()

    // Listen for system theme changes
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', detectSystemTheme)
    }

    // Apply initial theme
    applyTheme()
  }

  // Watch for theme changes
  watch([theme, isSystemDark], () => {
    applyTheme()
  }, { immediate: false })

  return {
    // State
    theme,
    isDark,
    isSystemDark,
    themeClass,
    
    // Methods
    setTheme,
    toggleTheme,
    applyTheme,
    detectSystemTheme,
    initializeTheme
  }
})
