import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Theme, ThemeMode } from '@/themes/types'

// Import available themes
import { quasarAdminTheme } from '@/themes/quasar-admin'
import { garnetNightTheme } from '@/themes/garnet-night'

export const useThemeStore = defineStore('theme', () => {
  // === STATE ===
  const currentThemeId = ref<string>('garnet-night')  // Default to Garnet Night
  const mode = ref<ThemeMode>('dark')  // light, dark, or system
  const isSystemDark = ref(false)

  // Registry of all available themes
  const themeRegistry = ref<Map<string, Theme>>(new Map([
    ['quasar-admin', quasarAdminTheme],
    ['garnet-night', garnetNightTheme],
    // Add more themes here as you create them
  ]))

  // === COMPUTED ===
  const currentTheme = computed(() => {
    return themeRegistry.value.get(currentThemeId.value) || garnetNightTheme
  })

  const isDark = computed(() => {
    if (mode.value === 'system') {
      return isSystemDark.value
    }
    return mode.value === 'dark'
  })

  const currentColors = computed(() => {
    return isDark.value ? currentTheme.value.dark : currentTheme.value.light
  })

  const availableThemes = computed(() => {
    return Array.from(themeRegistry.value.values())
  })

  const themeClass = computed(() => {
    return isDark.value ? 'dark' : 'light'
  })

  // === METHODS ===
  const setTheme = (themeId: string) => {
    if (themeRegistry.value.has(themeId)) {
      currentThemeId.value = themeId
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme-id', themeId)
      }
      applyTheme()
    }
  }

  const setMode = (newMode: ThemeMode) => {
    mode.value = newMode
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme-mode', newMode)
    }
    applyTheme()
  }

  const toggleMode = () => {
    if (mode.value === 'light') {
      setMode('dark')
    } else if (mode.value === 'dark') {
      setMode('system')
    } else {
      setMode('light')
    }
  }

  const applyTheme = () => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    const theme = currentTheme.value
    const colors = currentColors.value

    // Set theme data attribute
    root.setAttribute('data-theme', theme.id)

    // Set light/dark class
    root.classList.remove('light', 'dark')
    root.classList.add(themeClass.value)

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

    // Update Quasar dark mode if available
    if (typeof window !== 'undefined' && (window as any).Quasar) {
      ;(window as any).Quasar.Dark.set(isDark.value)
    }

    // Dynamically load theme styles
    loadThemeStyles(theme)
  }

  const loadThemeStyles = (theme: Theme) => {
    // Check if styles are already loaded
    const styleId = `theme-${theme.id}-styles`
    if (document.getElementById(styleId)) return

    // Import theme styles dynamically
    // Note: In production, these should be pre-built
    import(`@/themes/${theme.id}/styles.scss`).catch((err) => {
      console.warn(`Could not load theme styles for ${theme.id}:`, err)
    })
  }

  const detectSystemTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      isSystemDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  }

  const initializeTheme = () => {
    // Load saved theme ID
    if (typeof localStorage !== 'undefined') {
      const savedThemeId = localStorage.getItem('theme-id')
      if (savedThemeId && themeRegistry.value.has(savedThemeId)) {
        currentThemeId.value = savedThemeId
      }

      // Load saved mode
      const savedMode = localStorage.getItem('theme-mode') as ThemeMode | null
      if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
        mode.value = savedMode
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

  const registerTheme = (theme: Theme) => {
    themeRegistry.value.set(theme.id, theme)
  }

  const unregisterTheme = (themeId: string) => {
    themeRegistry.value.delete(themeId)

    // If current theme was removed, switch to default
    if (currentThemeId.value === themeId) {
      setTheme('garnet-night')
    }
  }

  const getThemeIcon = () => {
    return isDark.value ? 'light_mode' : 'dark_mode'
  }

  // === WATCH ===
  watch([currentThemeId, mode, isSystemDark], () => {
    applyTheme()
  }, { immediate: false })

  // === RETURN ===
  return {
    // State
    currentThemeId,
    mode,
    isDark,
    isSystemDark,
    themeClass,

    // Computed
    currentTheme,
    currentColors,
    availableThemes,

    // Methods
    setTheme,
    setMode,
    toggleMode,
    applyTheme,
    detectSystemTheme,
    initializeTheme,
    registerTheme,
    unregisterTheme,
    getThemeIcon,
  }
})
