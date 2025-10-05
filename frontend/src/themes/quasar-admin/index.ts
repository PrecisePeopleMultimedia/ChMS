import type { Theme } from '../types'

export const quasarAdminTheme: Theme = {
  id: 'quasar-admin',
  name: 'Quasar Admin',
  description: 'Professional admin theme with clean, modern design',
  author: 'Pratik Patel',
  version: '1.0.0',

  light: {
    // Primary Colors (from quasar-admin-master/src/css/quasar.variables.scss)
    primary: '#363636',      // Dark gray
    secondary: '#26A69A',    // Teal
    accent: '#dd4b39',       // Red

    // Semantic Colors
    positive: '#21BA45',     // Green
    negative: '#C10015',     // Red
    info: '#31CCEC',         // Cyan
    warning: '#F2C037',      // Yellow

    // Neutral Colors
    dark: '#1D1D1D',
    background: '#FFFFFF',
    surface: '#F5F5F5',

    // Text Colors
    textPrimary: 'rgba(0, 0, 0, 0.87)',
    textSecondary: 'rgba(0, 0, 0, 0.60)',
    textDisabled: 'rgba(0, 0, 0, 0.38)',

    // Border & Divider
    border: 'rgba(0, 0, 0, 0.12)',
    divider: 'rgba(0, 0, 0, 0.12)',
  },

  dark: {
    // Primary Colors
    primary: '#363636',
    secondary: '#26A69A',
    accent: '#dd4b39',

    // Semantic Colors
    positive: '#21BA45',
    negative: '#C10015',
    info: '#31CCEC',
    warning: '#F2C037',

    // Neutral Colors
    dark: '#1D1D1D',
    background: '#121212',
    surface: '#1E1E1E',

    // Text Colors
    textPrimary: 'rgba(255, 255, 255, 0.87)',
    textSecondary: 'rgba(255, 255, 255, 0.60)',
    textDisabled: 'rgba(255, 255, 255, 0.38)',

    // Border & Divider
    border: 'rgba(255, 255, 255, 0.12)',
    divider: 'rgba(255, 255, 255, 0.12)',
  },

  typography: {
    fontFamily: 'Roboto, -apple-system, Helvetica Neue, Helvetica, Arial, sans-serif',
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem' // 30px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },

  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem'    // 64px
  },

  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    md: '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
    lg: '0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.10)',
    xl: '0 15px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.05)',
    '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
    none: 'none'
  },

  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.25rem',    // 4px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px'
  },

  breakpoints: {
    xs: 0,
    sm: 600,
    md: 1024,
    lg: 1440,
    xl: 1920
  },

  components: {
    button: {
      height: '36px',
      padding: '0 16px',
      borderRadius: '4px'
    },
    card: {
      padding: '16px',
      borderRadius: '4px',
      elevation: 2
    },
    input: {
      height: '40px',
      borderRadius: '4px'
    }
  },

  scssImports: [
    '@/themes/quasar-admin/variables.scss',
    '@/themes/quasar-admin/styles.scss'
  ]
}
