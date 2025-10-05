export interface ThemeColors {
  // Primary Colors
  primary: string
  secondary: string
  accent: string

  // Semantic Colors
  positive: string
  negative: string
  info: string
  warning: string

  // Neutral Colors
  dark: string
  background: string
  surface: string

  // Text Colors
  textPrimary: string
  textSecondary: string
  textDisabled: string

  // Border & Divider
  border: string
  divider: string
}

export interface ThemeTypography {
  fontFamily: string
  fontSize: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
  }
  fontWeight: {
    light: number
    normal: number
    medium: number
    semibold: number
    bold: number
  }
  lineHeight: {
    tight: string
    normal: string
    relaxed: string
  }
}

export interface ThemeSpacing {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
}

export interface ThemeShadows {
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  inner: string
  none: string
}

export interface ThemeBorderRadius {
  none: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  full: string
}

export interface ThemeBreakpoints {
  xs: number  // 0-599px
  sm: number  // 600-1023px
  md: number  // 1024-1439px
  lg: number  // 1440-1919px
  xl: number  // 1920px+
}

export interface Theme {
  id: string
  name: string
  description: string
  author?: string
  version?: string

  // Color Modes
  light: ThemeColors
  dark: ThemeColors

  // Design Tokens
  typography: ThemeTypography
  spacing: ThemeSpacing
  shadows: ThemeShadows
  borderRadius: ThemeBorderRadius
  breakpoints: ThemeBreakpoints

  // Component Overrides (optional)
  components?: {
    button?: Record<string, any>
    card?: Record<string, any>
    input?: Record<string, any>
    table?: Record<string, any>
    [key: string]: Record<string, any> | undefined
  }

  // Custom CSS Variables
  cssVariables?: Record<string, string>

  // SCSS/SASS import paths
  scssImports?: string[]
}

export type ThemeMode = 'light' | 'dark' | 'system'
