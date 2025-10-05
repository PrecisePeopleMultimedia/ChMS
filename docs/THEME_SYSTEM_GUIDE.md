# ChMS Theme System - Complete Implementation Guide

## 🎨 Overview

The ChMS Theme System is a **production-ready, fully customizable theming solution** extracted from Quasar Admin and enhanced with your custom Garnet Night theme. It supports hot-swapping between themes, light/dark modes, and complete CSS customization.

## 📁 Directory Structure

```
frontend/src/themes/
├── index.ts                          # Theme registry & exports
├── types.ts                          # TypeScript interfaces
├── quasar.variables.scss             # Quasar-compatible variables
├── quasar-admin/                     # Quasar Admin Theme
│   ├── index.ts                      # Theme definition
│   ├── variables.scss                # SCSS variables
│   ├── styles.scss                   # Theme styles
│   └── components/                   # Component-specific styles (future)
├── garnet-night/                     # Garnet Night Theme
│   ├── index.ts                      # Theme definition
│   ├── variables.scss                # SCSS variables
│   └── styles.scss                   # Theme styles
└── utils/                            # Utilities (future expansion)
    ├── theme-loader.ts
    └── css-variables.ts
```

## 🚀 Quick Start

### 1. Using the Theme Switcher

The ThemeSwitcher component is already integrated in:
- **Login/Auth pages**: Top-right corner
- **Dashboard**: Header toolbar

**Features:**
- Switch between themes (Quasar Admin, Garnet Night)
- Toggle color modes (Light, Dark, System)
- Live preview of theme colors
- Persistent preferences (localStorage)

### 2. Available Themes

#### **Quasar Admin** (`quasar-admin`)
- Professional, clean design
- Suitable for business applications
- Colors: Dark gray primary (#363636), Teal secondary (#26A69A)
- Author: Pratik Patel

#### **Garnet Night** (`garnet-night`)
- ChurchAfrica's signature theme
- Rich burgundy and garnet accents
- Optimized for dark mode
- Colors: Burgundy primary (#8B1538), Garnet pink secondary (#B8336A)

## 🎨 Creating a Custom Theme

### Step 1: Create Theme Directory

```bash
cd frontend/src/themes
mkdir my-custom-theme
```

### Step 2: Define Theme (TypeScript)

Create `my-custom-theme/index.ts`:

```typescript
import type { Theme } from '../types'

export const myCustomTheme: Theme = {
  id: 'my-custom-theme',
  name: 'My Custom Theme',
  description: 'A beautiful custom theme for ChMS',
  author: 'Your Name',
  version: '1.0.0',

  light: {
    primary: '#1976D2',
    secondary: '#424242',
    accent: '#82B1FF',
    positive: '#4CAF50',
    negative: '#F44336',
    info: '#2196F3',
    warning: '#FF9800',
    dark: '#1D1D1D',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    textPrimary: 'rgba(0, 0, 0, 0.87)',
    textSecondary: 'rgba(0, 0, 0, 0.60)',
    textDisabled: 'rgba(0, 0, 0, 0.38)',
    border: 'rgba(0, 0, 0, 0.12)',
    divider: 'rgba(0, 0, 0, 0.12)',
  },

  dark: {
    primary: '#2196F3',
    secondary: '#757575',
    accent: '#448AFF',
    positive: '#4CAF50',
    negative: '#F44336',
    info: '#2196F3',
    warning: '#FF9800',
    dark: '#1D1D1D',
    background: '#121212',
    surface: '#1E1E1E',
    textPrimary: 'rgba(255, 255, 255, 0.87)',
    textSecondary: 'rgba(255, 255, 255, 0.60)',
    textDisabled: 'rgba(255, 255, 255, 0.38)',
    border: 'rgba(255, 255, 255, 0.12)',
    divider: 'rgba(255, 255, 255, 0.12)',
  },

  typography: {
    fontFamily: '"Roboto", sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem'
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
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  },

  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12)',
    md: '0 3px 6px rgba(0,0,0,0.15)',
    lg: '0 10px 20px rgba(0,0,0,0.15)',
    xl: '0 15px 25px rgba(0,0,0,0.15)',
    '2xl': '0 25px 50px rgba(0,0,0,0.25)',
    inner: 'inset 0 2px 4px rgba(0,0,0,0.06)',
    none: 'none'
  },

  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
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
      borderRadius: '8px',
      elevation: 2
    }
  }
}
```

### Step 3: Create SCSS Variables

Create `my-custom-theme/variables.scss`:

```scss
// My Custom Theme Variables

// === PRIMARY COLORS ===
$mc-primary: #1976D2 !default;
$mc-secondary: #424242 !default;
$mc-accent: #82B1FF !default;

// === SEMANTIC COLORS ===
$mc-positive: #4CAF50 !default;
$mc-negative: #F44336 !default;
$mc-info: #2196F3 !default;
$mc-warning: #FF9800 !default;

// === LIGHT MODE ===
$mc-light-background: #FFFFFF !default;
$mc-light-surface: #F5F5F5 !default;
$mc-light-text-primary: rgba(0, 0, 0, 0.87) !default;
$mc-light-text-secondary: rgba(0, 0, 0, 0.60) !default;
$mc-light-border: rgba(0, 0, 0, 0.12) !default;

// === DARK MODE ===
$mc-dark-background: #121212 !default;
$mc-dark-surface: #1E1E1E !default;
$mc-dark-text-primary: rgba(255, 255, 255, 0.87) !default;
$mc-dark-text-secondary: rgba(255, 255, 255, 0.60) !default;
$mc-dark-border: rgba(255, 255, 255, 0.12) !default;

// === CSS CUSTOM PROPERTIES ===
:root {
  --mc-primary: #{$mc-primary};
  --mc-secondary: #{$mc-secondary};
  --mc-accent: #{$mc-accent};
  --mc-positive: #{$mc-positive};
  --mc-negative: #{$mc-negative};
  --mc-info: #{$mc-info};
  --mc-warning: #{$mc-warning};

  --mc-background: #{$mc-light-background};
  --mc-surface: #{$mc-light-surface};
  --mc-text-primary: #{$mc-light-text-primary};
  --mc-text-secondary: #{$mc-light-text-secondary};
  --mc-border: #{$mc-light-border};
}

html.dark,
html[data-theme="my-custom-theme"].dark {
  --mc-background: #{$mc-dark-background};
  --mc-surface: #{$mc-dark-surface};
  --mc-text-primary: #{$mc-dark-text-primary};
  --mc-text-secondary: #{$mc-dark-text-secondary};
  --mc-border: #{$mc-dark-border};
}
```

### Step 4: Create Theme Styles

Create `my-custom-theme/styles.scss`:

```scss
@import './variables.scss';

html[data-theme="my-custom-theme"] {
  body {
    background-color: var(--mc-background);
    color: var(--mc-text-primary);
  }

  // === CARDS ===
  .q-card {
    background-color: var(--mc-surface);
    border-radius: 8px;
  }

  // === BUTTONS ===
  .q-btn--primary {
    background-color: var(--mc-primary);
    color: white;
  }

  // === INPUTS ===
  .q-field__control {
    background-color: var(--mc-surface);
    border-color: var(--mc-border);
  }

  // Add more custom styles as needed
}
```

### Step 5: Register Your Theme

Update `frontend/src/stores/theme.ts`:

```typescript
import { myCustomTheme } from '@/themes/my-custom-theme'

const themeRegistry = ref<Map<string, Theme>>(new Map([
  ['quasar-admin', quasarAdminTheme],
  ['garnet-night', garnetNightTheme],
  ['my-custom-theme', myCustomTheme], // Add your theme
]))
```

### Step 6: Import Theme Styles

Update `frontend/src/themes/index.ts`:

```typescript
import './my-custom-theme/variables.scss'
import './my-custom-theme/styles.scss'
```

### Step 7: Test Your Theme

```bash
npm run dev
# Open browser → Click theme switcher → Select "My Custom Theme"
```

## 🎨 Theme Customization Options

### Colors

```typescript
// Customize any color in light or dark mode
light: {
  primary: '#YOUR_COLOR',
  secondary: '#YOUR_COLOR',
  accent: '#YOUR_COLOR',
  // ... other colors
}
```

### Typography

```typescript
typography: {
  fontFamily: '"Your Font", sans-serif',
  fontSize: {
    base: '16px', // Adjust base font size
    // ... other sizes
  }
}
```

### Spacing

```typescript
spacing: {
  md: '20px', // Increase/decrease spacing
  // ... other sizes
}
```

### Shadows

```typescript
shadows: {
  md: '0 4px 12px rgba(0, 0, 0, 0.3)', // Customize shadows
  // ... other shadows
}
```

### Border Radius

```typescript
borderRadius: {
  md: '12px', // Rounder or sharper corners
  // ... other radii
}
```

## 🔧 Advanced Usage

### Accessing Theme in Components

```vue
<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

// Get current theme
const theme = themeStore.currentTheme

// Get current colors (respects light/dark mode)
const colors = themeStore.currentColors

// Check if dark mode
const isDark = themeStore.isDark

// Switch theme programmatically
themeStore.setTheme('quasar-admin')

// Toggle mode
themeStore.toggleMode()
</script>

<template>
  <div>
    <p>Current Theme: {{ theme.name }}</p>
    <p>Primary Color: {{ colors.primary }}</p>
    <button @click="themeStore.toggleMode()">Toggle Mode</button>
  </div>
</template>
```

### Using CSS Variables

```scss
.my-component {
  background-color: var(--theme-primary);
  color: var(--theme-textPrimary);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

### Component-Specific Overrides

```typescript
components: {
  button: {
    height: '48px',        // Touch-friendly
    borderRadius: '12px',  // Rounder buttons
    padding: '0 24px'
  },
  card: {
    padding: '24px',
    borderRadius: '16px',
    elevation: 3
  }
}
```

## 📱 Responsive Design

Themes automatically adapt to:
- **Mobile devices** (xs: 0-599px)
- **Tablets** (sm: 600-1023px)
- **Desktops** (md: 1024-1439px)
- **Large screens** (lg: 1440-1919px)
- **Extra large** (xl: 1920px+)

## 🌍 Africa-First Considerations

Themes are optimized for:
- **Low bandwidth**: Minimal CSS, efficient caching
- **Slow connections**: Progressive loading
- **Mobile-first**: Touch-friendly sizes (44px minimum)
- **Battery saving**: Dark mode by default
- **Accessibility**: WCAG AA compliance

## 🧪 Testing Your Theme

1. **Visual Testing**: Use theme switcher to preview
2. **Light/Dark Modes**: Toggle between modes
3. **Components**: Test on all major components (buttons, cards, forms)
4. **Responsive**: Test on different screen sizes
5. **Accessibility**: Test with screen readers

## 📦 Exporting/Sharing Themes

### Export Theme as JSON

```typescript
const themeJSON = JSON.stringify(myCustomTheme, null, 2)
// Save or share this JSON
```

### Import Shared Theme

```typescript
import sharedThemeJSON from './shared-theme.json'

const sharedTheme: Theme = sharedThemeJSON as Theme
themeStore.registerTheme(sharedTheme)
```

## 🎯 Best Practices

1. **Use semantic color names**: `positive`, `negative`, not `green`, `red`
2. **Maintain contrast ratios**: WCAG AA minimum (4.5:1 for text)
3. **Test both modes**: Light and dark should both look good
4. **Keep it consistent**: Use theme variables, not hardcoded values
5. **Mobile-first**: Design for small screens, enhance for large
6. **Performance**: Minimize custom CSS, reuse theme styles

## 🐛 Troubleshooting

### Theme not applying?
- Check `data-theme` attribute on `<html>` element
- Ensure theme is registered in theme store
- Clear browser cache

### Colors not updating?
- Check CSS custom properties in DevTools
- Verify theme store is initialized
- Check SCSS compilation

### Styles conflicting?
- Use theme-specific selectors: `html[data-theme="my-theme"]`
- Check CSS specificity
- Ensure proper import order

## 🚀 Production Deployment

1. **Build themes**: `npm run build`
2. **Optimize CSS**: Themes are automatically optimized by Vite
3. **Cache busting**: Theme files include content hashes
4. **CDN**: Deploy theme CSS to CDN for faster loading

## 📚 Resources

- **Quasar Documentation**: https://quasar.dev/style/theme
- **CSS Variables**: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

## 💡 Tips & Tricks

### Quick Theme Cloning

```typescript
const newTheme = { ...garnetNightTheme, id: 'garnet-light', name: 'Garnet Light' }
newTheme.dark = newTheme.light // Use light colors for dark mode too
```

### Animated Theme Transitions

```scss
html {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

### Theme Preview Component

```vue
<ThemePreview :theme="myCustomTheme" />
```

## 🎉 Success!

You now have a **production-ready, fully customizable theme system**!

Create unlimited themes, switch between them instantly, and give your users the power to choose their preferred look and feel.

**Happy Theming! 🎨**
