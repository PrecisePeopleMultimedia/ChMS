import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Theme } from '@/themes/types'

// Import available themes
import { quasarAdminTheme } from '@/themes/quasar-admin'
import { garnetNightTheme } from '@/themes/garnet-night'

export const useThemeStore = defineStore('theme', () => {
  // === STATE ===
  const currentThemeId = ref<string>('quasar-admin')
  const mode = ref<'dark' | 'light' | 'system'>('dark')
  const isDark = ref<boolean>(true)

  // Available themes registry
  const availableThemes = ref<Theme[]>([
    quasarAdminTheme,
    garnetNightTheme
  ])

  // Current theme
  const currentTheme = ref<Theme>(quasarAdminTheme)

  // === COMPUTED ===
  const currentColors = computed(() => {
    return currentTheme.value.dark  // Always use dark colors
  })

  const themeClass = computed(() => {
    return 'dark'  // Always dark
  })

  // === METHODS ===
  // Simplified - no theme switching needed

  const applyTheme = () => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    const theme = currentTheme.value
    const colors = currentColors.value

    // Set theme data attribute - always quasar-admin
    root.setAttribute('data-theme', 'quasar-admin')

    // Set dark class only
    root.classList.remove('light')
    root.classList.add('dark')

    // Apply CSS custom properties for colors
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value)
    })

    // Apply typography
    root.style.setProperty('--theme-font-family', theme.typography.fontFamily)

    Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value)
    })

    Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
      root.style.setProperty(`--font-weight-${key}`, value.toString())
    })

    Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
      root.style.setProperty(`--line-height-${key}`, value)
    })

    // Apply spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value)
    })

    // Apply shadows
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value)
    })

    // Apply border radius
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value)
    })

    // Apply custom CSS variables
    if (theme.cssVariables) {
      Object.entries(theme.cssVariables).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value)
      })
    }

    // Always set Quasar to dark mode
    if (typeof window !== 'undefined' && (window as any).Quasar) {
      ;(window as any).Quasar.Dark.set(true)
    }

    // Load theme styles
    loadThemeStyles(theme)
  }

  const loadThemeStyles = (theme: Theme) => {
    // Check if styles are already loaded
    const styleId = `theme-${theme.id}-styles`
    if (document.getElementById(styleId)) return

    // Import quasar-admin theme styles only
    import(`@/themes/quasar-admin/styles.scss`).catch((err) => {
      console.warn(`Could not load theme styles for quasar-admin:`, err)
    })
  }

  const initializeTheme = () => {
    // Always apply dark theme on initialization
    applyTheme()
  }

  const getThemeIcon = () => {
    return mode.value === 'dark' ? 'dark_mode' : 'light_mode'
  }

  const setTheme = (themeId: string) => {
    const theme = availableThemes.value.find(t => t.id === themeId)
    if (theme) {
      currentThemeId.value = themeId
      currentTheme.value = theme
      applyTheme()
    }
  }

  const setMode = (newMode: 'dark' | 'light' | 'system') => {
    mode.value = newMode

    if (newMode === 'system') {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    } else {
      isDark.value = newMode === 'dark'
    }

    applyTheme()
  }

  const toggleMode = () => {
    const newMode = isDark.value ? 'light' : 'dark'
    setMode(newMode)
  }

  // === RETURN ===
  return {
    // State
    currentThemeId,
    mode,
    isDark,
    themeClass,
    availableThemes,

    // Computed
    currentTheme,
    currentColors,

    // Methods
    applyTheme,
    initializeTheme,
    getThemeIcon,
    setTheme,
    setMode,
    toggleMode,
  }
})
