# Design Tokens Document

**Created**: 2025-11-13  
**Source**: TweakCN Theme (ChMS-by-Make prototype)  
**Purpose**: Complete design system tokens for Vue+Quasar migration  
**Status**: Complete

---

## Overview

This document contains all design tokens extracted from the Figma prototype (ChMS-by-Make) for implementation in the Vue+Quasar platform. All tokens use the **OKLCH color space** for modern, perceptually uniform colors with **hex/RGB fallbacks** for older browsers.

**Theme**: TweakCN Green Dark Theme  
**Font**: Geist (Google Fonts)  
**Color Space**: OKLCH (with hex fallbacks)

---

## Color System

### Color Space: OKLCH

**OKLCH** (OK Lightness Chroma Hue) is a modern, perceptually uniform color space that provides:
- Better color consistency across devices
- More intuitive color manipulation
- Improved accessibility
- Future-proof color system

**Browser Support**:
- Modern browsers (Chrome 120+, Safari 16.4+, Firefox 113+): Native OKLCH support
- Older browsers: Automatic fallback to hex/RGB via `@supports` queries

---

## Light Mode Colors

### Base Colors

| Token | OKLCH Value | Hex Fallback | Usage |
|-------|-------------|--------------|-------|
| `--background` | `oklch(0.9911 0 0)` | `#FCFCFC` | Main background |
| `--foreground` | `oklch(0.2046 0 0)` | `#343434` | Primary text |
| `--card` | `oklch(0.9911 0 0)` | `#FCFCFC` | Card background |
| `--card-foreground` | `oklch(0.2046 0 0)` | `#343434` | Card text |
| `--popover` | `oklch(0.9911 0 0)` | `#FCFCFC` | Popover background |
| `--popover-foreground` | `oklch(0.4386 0 0)` | `#707070` | Popover text |
| `--primary` | `oklch(0.38 0.12 156)` | `#1CE479` | Primary actions |
| `--primary-foreground` | `oklch(0.98 0 0)` | `#FAFAFA` | Primary text |
| `--secondary` | `oklch(0.9940 0 0)` | `#FDFDFD` | Secondary elements |
| `--secondary-foreground` | `oklch(0.2046 0 0)` | `#343434` | Secondary text |
| `--muted` | `oklch(0.9461 0 0)` | `#F1F1F1` | Muted backgrounds |
| `--muted-foreground` | `oklch(0.2435 0 0)` | `#3D3D3D` | Muted text |
| `--accent` | `oklch(0.9461 0 0)` | `#F1F1F1` | Accent elements |
| `--accent-foreground` | `oklch(0.2435 0 0)` | `#3D3D3D` | Accent text |
| `--destructive` | `oklch(0.5523 0.1927 32.7272)` | `#EF4444` | Destructive actions |
| `--destructive-foreground` | `oklch(0.9934 0.0032 17.2118)` | `#FEF2F2` | Destructive text |
| `--border` | `oklch(0.9037 0 0)` | `#E6E6E6` | Borders |
| `--input` | `oklch(0.9731 0 0)` | `#F8F8F8` | Input backgrounds |
| `--ring` | `oklch(0.38 0.12 156)` | `#1CE479` | Focus rings |

### Semantic Colors (Light Mode)

| Token | OKLCH Value | Hex Fallback | Usage |
|-------|-------------|--------------|-------|
| `--success` | `oklch(0.38 0.12 156)` | `#1CE479` | Success states |
| `--success-foreground` | `oklch(0.98 0 0)` | `#FAFAFA` | Success text |
| `--warning` | `oklch(0.7686 0.1647 70.0804)` | `#F59E0B` | Warning states |
| `--warning-foreground` | `oklch(0.2046 0 0)` | `#343434` | Warning text |
| `--info` | `oklch(0.6231 0.1880 259.8145)` | `#3B82F6` | Info states |
| `--info-foreground` | `oklch(0.9911 0 0)` | `#FCFCFC` | Info text |

### Chart Colors (Light Mode)

| Token | OKLCH Value | Hex Fallback | Usage |
|-------|-------------|--------------|-------|
| `--chart-1` | `oklch(0.38 0.12 156)` | `#1CE479` | Chart color 1 (green) |
| `--chart-2` | `oklch(0.6231 0.1880 259.8145)` | `#3B82F6` | Chart color 2 (blue/purple) |
| `--chart-3` | `oklch(0.6056 0.2189 292.7172)` | `#A855F7` | Chart color 3 (purple/pink) |
| `--chart-4` | `oklch(0.7686 0.1647 70.0804)` | `#F59E0B` | Chart color 4 (yellow/orange) |
| `--chart-5` | `oklch(0.6959 0.1491 162.4796)` | `#10B981` | Chart color 5 (cyan/green) |

### Sidebar Colors (Light Mode)

| Token | OKLCH Value | Hex Fallback | Usage |
|-------|-------------|--------------|-------|
| `--sidebar` | `oklch(0.9911 0 0)` | `#FCFCFC` | Sidebar background |
| `--sidebar-foreground` | `oklch(0.5452 0 0)` | `#8B8B8B` | Sidebar text |
| `--sidebar-primary` | `oklch(0.38 0.12 156)` | `#1CE479` | Sidebar primary |
| `--sidebar-primary-foreground` | `oklch(0.98 0 0)` | `#FAFAFA` | Sidebar primary text |
| `--sidebar-accent` | `oklch(0.9461 0 0)` | `#F1F1F1` | Sidebar accent |
| `--sidebar-accent-foreground` | `oklch(0.2435 0 0)` | `#3D3D3D` | Sidebar accent text |
| `--sidebar-border` | `oklch(0.9037 0 0)` | `#E6E6E6` | Sidebar borders |
| `--sidebar-ring` | `oklch(0.38 0.12 156)` | `#1CE479` | Sidebar focus rings |

---

## Dark Mode Colors

### Base Colors

| Token | OKLCH Value | Hex Fallback | Usage |
|-------|-------------|--------------|-------|
| `--background` | `oklch(0.1822 0 0)` | `#0A0A0F` | Main background |
| `--foreground` | `oklch(0.9288 0.0126 255.5078)` | `#EDEDF5` | Primary text |
| `--card` | `oklch(0.2046 0 0)` | `#1A1A20` | Card background |
| `--card-foreground` | `oklch(0.9288 0.0126 255.5078)` | `#EDEDF5` | Card text |
| `--popover` | `oklch(0.2603 0 0)` | `#2A2A30` | Popover background |
| `--popover-foreground` | `oklch(0.7348 0 0)` | `#BBBBBB` | Popover text |
| `--primary` | `oklch(0.4365 0.1044 156.7556)` | `#1CE479` | Primary actions |
| `--primary-foreground` | `oklch(0.9213 0.0135 167.1556)` | `#EBEBEB` | Primary text |
| `--secondary` | `oklch(0.2603 0 0)` | `#2A2A30` | Secondary elements |
| `--secondary-foreground` | `oklch(0.9851 0 0)` | `#FBFBFB` | Secondary text |
| `--muted` | `oklch(0.2393 0 0)` | `#262626` | Muted backgrounds |
| `--muted-foreground` | `oklch(0.7122 0 0)` | `#B5B5B5` | Muted text |
| `--accent` | `oklch(0.3132 0 0)` | `#333333` | Accent elements |
| `--accent-foreground` | `oklch(0.9851 0 0)` | `#FBFBFB` | Accent text |
| `--destructive` | `oklch(0.3123 0.0852 29.7877)` | `#DC2626` | Destructive actions |
| `--destructive-foreground` | `oklch(0.9368 0.0045 34.3092)` | `#EFEFEF` | Destructive text |
| `--border` | `oklch(0.2809 0 0)` | `#2D2D35` | Borders |
| `--input` | `oklch(0.2603 0 0)` | `#2A2A30` | Input backgrounds |
| `--ring` | `oklch(0.8003 0.1821 151.7110)` | `#4ADE80` | Focus rings |

### Semantic Colors (Dark Mode)

| Token | OKLCH Value | Hex Fallback | Usage |
|-------|-------------|--------------|-------|
| `--success` | `oklch(0.4365 0.1044 156.7556)` | `#1CE479` | Success states |
| `--success-foreground` | `oklch(0.9213 0.0135 167.1556)` | `#EBEBEB` | Success text |
| `--warning` | `oklch(0.8369 0.1644 84.4286)` | `#F59E0B` | Warning states |
| `--warning-foreground` | `oklch(0.2046 0 0)` | `#343434` | Warning text |
| `--info` | `oklch(0.7137 0.1434 254.6240)` | `#6366F1` | Info states |
| `--info-foreground` | `oklch(0.9911 0 0)` | `#FCFCFC` | Info text |

### Chart Colors (Dark Mode)

| Token | OKLCH Value | Hex Fallback | Usage |
|-------|-------------|--------------|-------|
| `--chart-1` | `oklch(0.8003 0.1821 151.7110)` | `#4ADE80` | Chart color 1 (green) |
| `--chart-2` | `oklch(0.7137 0.1434 254.6240)` | `#6366F1` | Chart color 2 (purple) |
| `--chart-3` | `oklch(0.7090 0.1592 293.5412)` | `#A855F7` | Chart color 3 (pink) |
| `--chart-4` | `oklch(0.8369 0.1644 84.4286)` | `#F59E0B` | Chart color 4 (yellow) |
| `--chart-5` | `oklch(0.7845 0.1325 181.9120)` | `#22D3EE` | Chart color 5 (cyan) |

### Sidebar Colors (Dark Mode)

| Token | OKLCH Value | Hex Fallback | Usage |
|-------|-------------|--------------|-------|
| `--sidebar` | `oklch(0.1822 0 0)` | `#0A0A0F` | Sidebar background |
| `--sidebar-foreground` | `oklch(0.6301 0 0)` | `#A0A0A0` | Sidebar text |
| `--sidebar-primary` | `oklch(0.4365 0.1044 156.7556)` | `#1CE479` | Sidebar primary |
| `--sidebar-primary-foreground` | `oklch(0.9213 0.0135 167.1556)` | `#EBEBEB` | Sidebar primary text |
| `--sidebar-accent` | `oklch(0.3132 0 0)` | `#333333` | Sidebar accent |
| `--sidebar-accent-foreground` | `oklch(0.9851 0 0)` | `#FBFBFB` | Sidebar accent text |
| `--sidebar-border` | `oklch(0.2809 0 0)` | `#2D2D35` | Sidebar borders |
| `--sidebar-ring` | `oklch(0.8003 0.1821 151.7110)` | `#4ADE80` | Sidebar focus rings |

---

## Typography System

### Font Family

| Token | Value | Usage |
|-------|-------|-------|
| `--font-sans` | `'Geist', sans-serif` | Primary font (body, headings) |
| `--font-serif` | `ui-serif, Georgia, Cambria, "Times New Roman", Times, serif` | Serif font (optional) |
| `--font-mono` | `monospace` | Monospace font (code) |

### Font Import

```css
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@100;200;300;400;500;600;700;800&display=swap');
```

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Thin | 100 | Rarely used |
| Extra Light | 200 | Rarely used |
| **Light** | **300** | **ALL headings (H1-H6) globally** |
| Regular | 400 | Body text, buttons, labels |
| Medium | 500 | Emphasis, badges |
| Semi Bold | 600 | Strong emphasis |
| Bold | 700 | Rarely used |
| Extra Bold | 800 | Rarely used |

### Base Font Size

- **Base**: `15px` (not 14px - prototype uses 15px)
- **Line Height**: `1.5` (body), `1.0-1.2` (headings)

### Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--tracking-normal` | `0.025em` | Default letter spacing |
| `--tracking-tighter` | `calc(var(--tracking-normal) - 0.05em)` | Tighter spacing |
| `--tracking-tight` | `calc(var(--tracking-normal) - 0.025em)` | Tight spacing |
| `--tracking-wide` | `calc(var(--tracking-normal) + 0.025em)` | Wide spacing |
| `--tracking-wider` | `calc(var(--tracking-normal) + 0.05em)` | Wider spacing |
| `--tracking-widest` | `calc(var(--tracking-normal) + 0.1em)` | Widest spacing |

### Typography Scale

| Element | Font Size | Font Weight | Line Height | Letter Spacing |
|---------|-----------|-------------|-------------|----------------|
| H1 | `2.4em` | 300 (light) | 1.0 | normal |
| H2 | `2em` | 300 (light) | 1.1 | normal |
| H3 | `1.75em` | 300 (light) | 1.2 | normal |
| H4 | `1.5em` | 300 (light) | 1.2 | normal |
| H5 | `1.25em` | 300 (light) | 1.3 | normal |
| H6 | `1.125em` | 300 (light) | 1.3 | normal |
| Body | `15px` (1em) | 400 (regular) | 1.5 | normal |
| Small | `0.875em` | 400 (regular) | 1.5 | normal |
| Caption | `0.75em` | 400 (regular) | 1.4 | normal |

**⚠️ CRITICAL**: ALL headings (H1-H6) use `font-weight: 300` (light) globally.

---

## Spacing System

### Base Spacing

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--spacing` | `0.25rem` | 4px | Base spacing unit |
| `--spacing-1` | `0.25rem` | 4px | Tiny spacing |
| `--spacing-2` | `0.5rem` | 8px | Small spacing |
| `--spacing-3` | `0.75rem` | 12px | Medium-small spacing |
| `--spacing-4` | `1rem` | 16px | Medium spacing |
| `--spacing-5` | `1.25rem` | 20px | Medium-large spacing |
| `--spacing-6` | `1.5rem` | 24px | Large spacing |
| `--spacing-8` | `2rem` | 32px | Extra large spacing |
| `--spacing-10` | `2.5rem` | 40px | 2X large spacing |
| `--spacing-12` | `3rem` | 48px | 3X large spacing |
| `--spacing-16` | `4rem` | 64px | 4X large spacing |

### Systematic Scale

**4px base system**: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px, 64px

---

## Border Radius System

### Base Radius

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--radius` | `0.5rem` | 8px | Base border radius |

### Radius Variants

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--radius-sm` | `calc(var(--radius) - 4px)` | 4px | Small radius |
| `--radius-md` | `calc(var(--radius) - 2px)` | 6px | Medium radius |
| `--radius-lg` | `var(--radius)` | 8px | Large radius (base) |
| `--radius-xl` | `calc(var(--radius) + 4px)` | 12px | Extra large radius |

---

## Shadow System

### Shadow Properties

| Property | Value | Usage |
|----------|-------|-------|
| `--shadow-x` | `0px` | Horizontal offset |
| `--shadow-y` | `1px` | Vertical offset |
| `--shadow-blur` | `3px` | Blur radius |
| `--shadow-spread` | `0px` | Spread radius |
| `--shadow-opacity` | `0.17` | Shadow opacity |
| `--shadow-color` | `#000000` | Shadow color |

### Shadow Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-2xs` | `0px 1px 3px 0px hsl(0 0% 0% / 0.09)` | Smallest shadow |
| `--shadow-xs` | `0px 1px 3px 0px hsl(0 0% 0% / 0.09)` | Extra small shadow |
| `--shadow-sm` | `0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 1px 2px -1px hsl(0 0% 0% / 0.17)` | Small shadow |
| `--shadow` | `0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 1px 2px -1px hsl(0 0% 0% / 0.17)` | Default shadow |
| `--shadow-md` | `0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 2px 4px -1px hsl(0 0% 0% / 0.17)` | Medium shadow |
| `--shadow-lg` | `0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 4px 6px -1px hsl(0 0% 0% / 0.17)` | Large shadow |
| `--shadow-xl` | `0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 8px 10px -1px hsl(0 0% 0% / 0.17)` | Extra large shadow |
| `--shadow-2xl` | `0px 1px 3px 0px hsl(0 0% 0% / 0.43)` | Largest shadow |

---

## Layout System

### Layout Structure

| Component | Width | Behavior |
|-----------|-------|----------|
| Left Sidebar | 280px | Fixed, collapsible |
| Main Content | Flexible | Responsive, fills remaining space |
| Right Sidebar | 320px | Optional, collapsible |

### Breakpoints

**Note**: Exact breakpoints to be extracted from prototype during implementation.

### Mobile Navigation

- **Bottom Navigation**: Always visible on mobile
- **Fixed Position**: Bottom of viewport
- **Height**: Minimum 48px (touch-friendly)
- **Icon + Label**: Design pattern

---

## Animation System

### Timing Functions

| Function | Value | Usage |
|----------|-------|-------|
| Ease-in-out (standard) | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard transitions |
| Ease-out (exiting) | `cubic-bezier(0, 0, 0.2, 1)` | Exiting animations |
| Ease-in (entering) | `cubic-bezier(0.4, 0, 1, 1)` | Entering animations |

### Durations

| Duration | Value | Usage |
|----------|-------|-------|
| Fast | 150ms | Button hover, tooltip |
| Standard | 200ms | Modal, dropdown |
| Slow | 300ms | Sidebar, page transitions |
| Extra Slow | 500ms | Complex animations |

### Animation Requirements

1. **Sidebar Transitions**: 300ms ease-in-out
2. **Button Interactions**: 150ms ease-out (hover), 100ms ease-in-out (active)
3. **Modal/Dialog**: 200ms ease-out (backdrop fade, content scale/fade)
4. **Page/Route Transitions**: 200ms ease-in-out (fade), 300ms ease-in-out (slide on mobile)
5. **Loading States**: 1s linear (spinner), 1.5s ease-in-out (skeleton pulse)
6. **Toast Notifications**: 200ms ease-out (slide in), 150ms ease-in (slide out)

### Performance Considerations

- Use CSS `transform` and `opacity` for 60fps animations
- Avoid animating `width`, `height`, `margin`, `padding`
- Respect `prefers-reduced-motion` media query
- Use `will-change` sparingly and only when needed

---

## Component Variants

### Button Variants

| Variant | Usage |
|---------|-------|
| default | Primary actions |
| outline | Secondary actions |
| ghost | Tertiary actions |
| destructive | Destructive actions |
| secondary | Alternative primary |
| link | Text links |

### Button Sizes

| Size | Height | Usage |
|------|--------|-------|
| sm | 32px | Small buttons |
| default | 40px | Standard buttons |
| lg | 48px | Large buttons |
| icon | 32px | Icon-only buttons |

### Card Variants

| Variant | Usage |
|---------|-------|
| default | Standard cards |
| elevated | Cards with shadow |
| outlined | Cards with border |

### Badge Variants

| Variant | Usage |
|---------|-------|
| default | Standard badges |
| outline | Outlined badges |
| success | Success states |
| warning | Warning states |
| destructive | Error states |

---

## Implementation Notes

### Browser Fallback Strategy

```css
:root {
  /* Fallback for older browsers */
  --primary: #1CE479;
  --background: #0A0A0F;
  --card: #1A1A20;
  /* ... other fallbacks ... */
}

@supports (color: oklch(0 0 0)) {
  :root {
    /* OKLCH for modern browsers */
    --primary: oklch(0.4365 0.1044 156.7556);
    --background: oklch(0.1822 0 0);
    --card: oklch(0.2046 0 0);
    /* ... other OKLCH colors ... */
  }
}
```

### Tailwind v4 CSS-First Configuration

The prototype uses Tailwind v4 with CSS-first configuration. The Vue+Quasar implementation should use Tailwind v3.4+ with similar configuration.

### Design Token Usage

1. **CSS Custom Properties**: All tokens should be defined as CSS custom properties
2. **Tailwind Integration**: Map tokens to Tailwind config for utility classes
3. **Quasar Theme**: Override Quasar theme colors with design tokens
4. **Component Props**: Use tokens in component prop definitions

---

## References

- **TweakCN Theme**: https://tweakcn.com/themes/cmhw1o251000b04l7076c29in
- **Prototype Source**: `ChMS-by-Make/src/styles/globals.css`
- **Font Source**: Google Fonts - Geist
- **Color Space**: OKLCH (https://oklch.com/)

---

**Last Updated**: 2025-11-13  
**Status**: Complete - Ready for Implementation

