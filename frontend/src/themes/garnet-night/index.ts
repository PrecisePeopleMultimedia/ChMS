import type { Theme } from '../types'

export const garnetNightTheme: Theme = {
  id: 'garnet-night',
  name: 'Garnet Night',
  description: 'Elegant dark theme with rich burgundy and garnet accents',
  author: 'ChurchAfrica',
  version: '1.0.0',

  light: {
    // Primary Colors - Lighter burgundy tones for light mode
    primary: '#8B1538',      // Burgundy
    secondary: '#B8336A',    // Garnet Pink
    accent: '#C93D74',       // Bright Pink

    // Semantic Colors
    positive: '#2ECC71',     // Emerald Green
    negative: '#E74C3C',     // Alizarin Red
    info: '#3498DB',         // Peter River Blue
    warning: '#F39C12',      // Orange

    // Neutral Colors
    dark: '#2C1B24',
    background: '#FFFFFF',
    surface: '#F8F4F6',

    // Text Colors
    textPrimary: 'rgba(0, 0, 0, 0.87)',
    textSecondary: 'rgba(0, 0, 0, 0.60)',
    textDisabled: 'rgba(0, 0, 0, 0.38)',

    // Border & Divider
    border: 'rgba(139, 21, 56, 0.15)',
    divider: 'rgba(139, 21, 56, 0.12)',
  },

  dark: {
    // Primary Colors - Deep burgundy for dark mode
    primary: '#8B1538',      // Burgundy
    secondary: '#B8336A',    // Garnet Pink
    accent: '#dd4b39',       // Bright Coral

    // Semantic Colors
    positive: '#2ECC71',
    negative: '#E74C3C',
    info: '#3498DB',
    warning: '#F39C12',

    // Neutral Colors - Rich dark backgrounds
    dark: '#1a0a0f',
    background: 'hsl(330, 40%, 10%)',   // Deep burgundy black
    surface: '#2D1B24',                   // Dark plum

    // Text Colors
    textPrimary: 'rgba(255, 255, 255, 0.95)',
    textSecondary: 'rgba(255, 255, 255, 0.70)',
    textDisabled: 'rgba(255, 255, 255, 0.40)',

    // Border & Divider
    border: 'rgba(184, 51, 106, 0.20)',
    divider: 'rgba(184, 51, 106, 0.15)',
  },

  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '2rem'     // 32px
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
      normal: '1.6',
      relaxed: '1.8'
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
    sm: '0 2px 4px rgba(139, 21, 56, 0.1)',
    md: '0 4px 8px rgba(139, 21, 56, 0.15)',
    lg: '0 8px 16px rgba(139, 21, 56, 0.2)',
    xl: '0 16px 32px rgba(139, 21, 56, 0.25)',
    '2xl': '0 24px 48px rgba(139, 21, 56, 0.3)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
    none: 'none'
  },

  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
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
      height: '44px',      // Touch-friendly
      padding: '0 24px',
      borderRadius: '8px'
    },
    card: {
      padding: '20px',
      borderRadius: '12px',
      elevation: 2
    },
    input: {
      height: '44px',
      borderRadius: '8px'
    }
  },

  cssVariables: {
    'garnet-gradient': 'linear-gradient(135deg, #8B1538 0%, #B8336A 100%)',
    'garnet-gradient-hover': 'linear-gradient(135deg, #A01B42 0%, #C93D74 100%)',
    'surface-gradient': 'radial-gradient(at 0% 0%, hsl(340, 70%, 35%) 0px, transparent 50%), radial-gradient(at 100% 100%, hsl(290, 50%, 30%) 0px, transparent 50%)'
  },

  scssImports: [
    '@/themes/garnet-night/variables.scss',
    '@/themes/garnet-night/styles.scss'
  ]
}
