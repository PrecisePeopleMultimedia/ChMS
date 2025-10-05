// Theme System Entry Point
// Export all themes and utilities

export { quasarAdminTheme } from './quasar-admin'
export { garnetNightTheme } from './garnet-night'

export type {
  Theme,
  ThemeMode,
  ThemeColors,
  ThemeTypography,
  ThemeSpacing,
  ThemeShadows,
  ThemeBorderRadius,
  ThemeBreakpoints,
} from './types'

// Import theme styles
import './quasar-admin/variables.scss'
import './quasar-admin/styles.scss'
import './garnet-night/variables.scss'
import './garnet-night/styles.scss'
