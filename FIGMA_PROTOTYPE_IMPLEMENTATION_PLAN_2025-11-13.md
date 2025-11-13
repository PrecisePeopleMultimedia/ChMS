# Figma Prototype to Vue+Quasar Implementation Plan

## Executive Summary

This document provides a comprehensive, step-by-step implementation plan to **COMPLETELY REPLACE** the current design system, UI, and UX with the React-based Figma prototype (ChMS-by-Make). This is a **complete visual overhaul** - the current codebase provides functional foundation only, and all visual/UX elements will be replaced with the prototype's design system.

**⚠️ CRITICAL CLARIFICATION**: This is NOT an alignment or incremental update. This is a **complete design system replacement** where:
- ✅ **KEEP**: Backend logic, API integrations, Pinia stores (data structure), composables (business logic), routing structure
- ❌ **REPLACE**: All UI components, styling, color system, typography, layout, visual design, UX patterns

**Status**: Planning Phase - DO NOT IMPLEMENT YET

**⚠️ BRANCH STRATEGY**: This major update will be carried out on a **separate feature branch** to maintain integrity of the current codebase. The current main/master branch will remain stable and functional while this overhaul is in progress.

**Prototype Source**: 
- Figma: https://www.figma.com/make/RFzrbbFTveD3cc2wlJ6571/ChMS-by-Make
- Web Preview: https://cast-bloom-55985635.figma.site
- TweakCN Theme: https://tweakcn.com/themes/cmhw1o251000b04l7076c29in
- Code Location: `/ChMS-by-Make/` (React + TypeScript + Tailwind + ShadCN)

**Target Stack**: Vue 3 (Composition API) + Quasar Framework + TypeScript + Tailwind CSS

**Migration Strategy**: Complete visual overhaul while preserving functional foundation

---

## Table of Contents

### Main Sections
- [Executive Summary](#executive-summary)
- [Migration Strategy & What to Keep/Replace](#migration-strategy--what-to-keepreplace)
  - [Core Principle](#-core-principle)
  - [What to KEEP (Functional Foundation)](#-what-to-keep-functional-foundation)
  - [What to REPLACE (Visual/UX Layer)](#-what-to-replace-visualux-layer)
  - [Migration Approach](#-migration-approach)
  - [Component Replacement Checklist](#-component-replacement-checklist)
- [Design System Analysis](#design-system-analysis)
  - [Design System: TweakCN Theme](#design-system-tweakcn-theme-from-prototype)
  - [Color System: OKLCH Color Space](#color-system-oklch-color-space)
  - [Typography: Geist Font](#typography-geist-font)
  - [Tailwind v4 CSS-First Configuration](#tailwind-v4-css-first-configuration)
  - [Shadow System](#shadow-system)
  - [Design Tokens](#design-tokens)
  - [Layout System](#layout-system)
  - [Component Patterns](#component-patterns)
- [Component Mapping Strategy](#component-mapping-strategy)
  - [React → Vue+Quasar Mapping](#react--vuequasar-mapping)
  - [State Management Mapping](#state-management-mapping)
  - [Routing Mapping](#routing-mapping)
- [Specification Review](#specification-review)
  - [Specs Requiring Updates](#specs-requiring-updates)
- [Pre-Migration Checklist](#pre-migration-checklist)
  - [Current State Audit](#-current-state-audit)
    - [1. Functionality Inventory](#1-functionality-inventory)
    - [2. Store & State Management Audit](#2-store--state-management-audit)
    - [3. Component Inventory](#3-component-inventory)
    - [4. API Integration Audit](#4-api-integration-audit)
    - [5. Visual Baseline Documentation](#5-visual-baseline-documentation)
    - [6. Performance Baseline](#6-performance-baseline)
    - [7. Accessibility Baseline](#7-accessibility-baseline)
    - [8. Testing Infrastructure](#8-testing-infrastructure)
    - [9. Git Branch Strategy](#9-git-branch-strategy)
    - [10. Documentation Preparation](#10-documentation-preparation)
    - [11. Environment Setup](#11-environment-setup)
    - [12. Prototype Access & Reference](#12-prototype-access--reference)
  - [Pre-Migration Sign-Off](#-pre-migration-sign-off)
- [Implementation Tasks](#implementation-tasks)
  - [Phase 1: Design System Foundation](#phase-1-design-system-foundation-critical---do-first)
    - [Task 1.1: Replace Color System with TweakCN OKLCH Theme](#task-11-replace-color-system-with-tweakcn-oklch-theme-complete-overhaul)
    - [Task 1.2: Replace Typography System with Geist Font](#task-12-replace-typography-system-with-geist-font-complete-overhaul)
    - [Task 1.3: Replace Layout System](#task-13-replace-layout-system-complete-overhaul)
  - [Phase 2: Core Component Library](#phase-2-core-component-library)
    - [Task 2.1: Create Base UI Components](#task-21-create-base-ui-components)
    - [Task 2.2: Create Navigation Components](#task-22-create-navigation-components)
  - [Phase 3: Feature Components](#phase-3-feature-components)
    - [Task 3.1: Dashboard Components](#task-31-dashboard-components)
    - [Task 3.2: Member Management Components](#task-32-member-management-components)
    - [Task 3.3: Attendance System Components](#task-33-attendance-system-components)
    - [Task 3.4: Other Feature Components](#task-34-other-feature-components)
  - [Phase 4: Integration & Polish](#phase-4-integration--polish)
    - [Task 4.1: Update Router & Navigation](#task-41-update-router--navigation)
    - [Task 4.2: Update State Management](#task-42-update-state-management)
    - [Task 4.3: Responsive Design & Mobile Optimization](#task-43-responsive-design--mobile-optimization)
    - [Task 4.4: Accessibility Audit](#task-44-accessibility-audit)
    - [Task 4.5: Performance Optimization](#task-45-performance-optimization)
  - [Phase 5: Testing & Validation](#phase-5-testing--validation)
    - [Task 5.1: Visual Regression Testing](#task-51-visual-regression-testing)
    - [Task 5.2: Functional Testing](#task-52-functional-testing)
    - [Task 5.3: Accessibility Testing](#task-53-accessibility-testing)
- [Risk Mitigation & Testing Strategy](#risk-mitigation--testing-strategy)
  - [Critical Risks](#-critical-risks)
    - [Risk 1: Breaking Functionality During Visual Overhaul](#risk-1-breaking-functionality-during-visual-overhaul)
    - [Risk 2: State Management Incompatibility](#risk-2-state-management-incompatibility)
    - [Risk 3: Performance Regression](#risk-3-performance-regression)
    - [Risk 4: Accessibility Regression](#risk-4-accessibility-regression)
  - [Testing Strategy](#-testing-strategy)
    - [Pre-Migration Testing](#pre-migration-testing)
    - [During Migration Testing](#during-migration-testing)
    - [Post-Migration Testing](#post-migration-testing)
  - [Success Metrics](#-success-metrics)
- [Critical Design System Notes](#critical-design-system-notes)
  - [TweakCN Theme Requirements](#-tweakcn-theme-requirements)
- [Questions & Clarifications](#questions--clarifications)
  - [Design Questions](#design-questions)
  - [Technical Questions](#technical-questions)
  - [Specification Questions](#specification-questions)
- [Implementation Order Recommendation](#implementation-order-recommendation)
- [Estimated Timeline](#estimated-timeline)
- [Risk Assessment](#risk-assessment)
  - [High Risk](#high-risk)
  - [Medium Risk](#medium-risk)
  - [Low Risk](#low-risk)
- [Next Steps](#next-steps)
- [Notes](#notes)

---

## Migration Strategy & What to Keep/Replace

### 🎯 Core Principle

**Preserve functionality, replace all visuals.** The current codebase has solid functional foundations (stores, composables, API integration, routing logic). We will keep all of that and completely replace the UI/UX layer.

### ✅ What to KEEP (Functional Foundation)

1. **Backend Integration**
   - API services (`src/services/api.ts`)
   - API client configuration
   - Authentication logic
   - Offline sync logic

2. **State Management (Pinia Stores)**
   - Store structure and data models
   - Store actions and getters (business logic)
   - Store state shape (may need minor adjustments for UI needs)
   - **Note**: Store logic stays, but UI components using stores will be replaced

3. **Composables**
   - Business logic composables
   - Utility composables
   - Data fetching logic
   - **Note**: Keep logic, but UI components will be replaced

4. **Routing Structure**
   - Route definitions
   - Route guards
   - Route meta information
   - **Note**: Routes stay, but route components will be replaced

5. **Type Definitions**
   - TypeScript interfaces/types
   - Data models
   - API response types

6. **Utilities & Helpers**
   - Formatting utilities
   - Validation logic
   - Date/time helpers
   - Data transformation functions

### ❌ What to REPLACE (Visual/UX Layer)

1. **Complete Design System**
   - Color palette (replace entirely)
   - Typography system (replace entirely)
   - Spacing system (replace entirely)
   - Border radius system (replace entirely)
   - Shadow system (replace entirely)

2. **All UI Components**
   - Current Quasar components → Replace with prototype-styled components
   - Custom components → Rebuild to match prototype
   - Layout components → Replace with prototype layout
   - Form components → Replace with prototype forms

3. **Layout System**
   - Current layout → Replace with 3-column prototype layout
   - Sidebar components → Replace with prototype sidebars
   - Header components → Replace with prototype header
   - Mobile navigation → Replace with prototype mobile nav

4. **Styling & Theming**
   - Current theme files → Replace with prototype theme
   - Global CSS → Replace with prototype styles
   - Component styles → Replace entirely
   - Quasar theme config → Replace with prototype colors

5. **Visual Patterns**
   - Card designs → Replace with prototype cards
   - Button styles → Replace with prototype buttons
   - Form styles → Replace with prototype forms
   - Navigation patterns → Replace with prototype navigation

### 🔄 Migration Approach

**Strategy**: "Wrap and Replace"

1. **Phase 1**: Build new design system foundation (colors, typography, layout)
2. **Phase 2**: Create new base components matching prototype
3. **Phase 3**: Replace feature components one by one, keeping store/composable logic
4. **Phase 4**: Remove old styling/theming completely
5. **Phase 5**: Test functionality to ensure nothing broke

**Key Principle**: When replacing a component:
- ✅ Keep the component's props interface (if it makes sense)
- ✅ Keep the component's store/composable usage
- ✅ Keep the component's business logic
- ❌ Replace all visual styling
- ❌ Replace all UI markup/structure
- ❌ Replace all CSS/styling

### 📋 Component Replacement Checklist

For each component being replaced:

- [ ] Identify which stores/composables it uses
- [ ] Document the component's props interface
- [ ] Document the component's events/emits
- [ ] Create new component matching prototype design
- [ ] Wire up same stores/composables
- [ ] Maintain same props interface (or update if needed)
- [ ] Maintain same events/emits
- [ ] Test that functionality still works
- [ ] Remove old component
- [ ] Update imports throughout codebase

---

## Design System Analysis

### Design System: TweakCN Theme (From Prototype)

**⚠️ CRITICAL**: The prototype uses **TweakCN theme** with **OKLCH color space** and **Geist font**. This is a professional, polished design system that must be replicated exactly.

**TweakCN Theme URL**: https://tweakcn.com/themes/cmhw1o251000b04l7076c29in

#### Color System: OKLCH Color Space

**Why OKLCH?**
- Perceptually uniform color space
- Better accessibility (consistent brightness)
- Future-proof (CSS Level 4)
- Better color manipulation

**Primary Colors (Dark Theme - OKLCH):**
- Primary Green: `oklch(0.4365 0.1044 156.7556)` - Used for primary actions, success states
- Background: `oklch(0.1822 0 0)` - Main page background (`#0A0A0F` equivalent)
- Card: `oklch(0.2046 0 0)` - Card/surface backgrounds (`#1A1A20` equivalent)
- Foreground: `oklch(0.9288 0.0126 255.5078)` - Primary text (white)
- Muted Foreground: `oklch(0.7122 0 0)` - Secondary text (grey)
- Border: `oklch(0.2809 0 0)` - Border color

**Semantic Colors (OKLCH):**
- Success: `oklch(0.4365 0.1044 156.7556)` (same as primary)
- Warning: `oklch(0.8369 0.1644 84.4286)` (yellow/gold)
- Destructive: `oklch(0.3123 0.0852 29.7877)` (red)
- Info: `oklch(0.7137 0.1434 254.6240)` (blue)

**Chart Colors (OKLCH):**
- Chart 1: `oklch(0.8003 0.1821 151.7110)` (green)
- Chart 2: `oklch(0.7137 0.1434 254.6240)` (purple)
- Chart 3: `oklch(0.7090 0.1592 293.5412)` (pink)
- Chart 4: `oklch(0.8369 0.1644 84.4286)` (yellow)
- Chart 5: `oklch(0.7845 0.1325 181.9120)` (cyan)

#### Typography: Geist Font

**Font Family:**
- **Primary**: Geist (Google Fonts) - Confirmed from `globals.css`
- **Weights**: 100, 200, 300, 400, 500, 600, 700, 800
- **Why Geist?**
  - Sharper rendering on screens
  - Modern geometric design
  - Better readability at all sizes
  - Excellent letter spacing (0.025em)

**Typography Settings:**
- Base Font Size: 15px (not 14px)
- Font Weight: Light (200-300) for headings, Regular (400) for body
- Letter Spacing: `0.025em` (normal), with tight/wide variants
- Line Height: Tight (1.0-1.2) for headings, Normal (1.5) for body
- Font Rendering: Antialiased, optimized for screens

**Font Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@100;200;300;400;500;600;700;800&display=swap');
```

#### Tailwind v4 CSS-First Configuration

**Important**: Prototype uses Tailwind v4 with CSS-first configuration (no `tailwind.config.js` needed for colors).

**Theme Configuration:**
```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  /* ... all other colors */
  --font-sans: var(--font-sans);
  --radius-lg: var(--radius);
  --shadow-md: var(--shadow-md);
}
```

#### Shadow System

**Professional Layered Shadows:**
```css
--shadow-sm: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 1px 2px -1px hsl(0 0% 0% / 0.17);
--shadow-md: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 2px 4px -1px hsl(0 0% 0% / 0.17);
--shadow-lg: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 4px 6px -1px hsl(0 0% 0% / 0.17);
--shadow-xl: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 8px 10px -1px hsl(0 0% 0% / 0.17);
```

#### Design Tokens

**Border Radius:**
```css
--radius: 0.5rem;             /* 8px base */
--radius-sm: calc(var(--radius) - 4px);
--radius-md: calc(var(--radius) - 2px);
--radius-lg: var(--radius);
--radius-xl: calc(var(--radius) + 4px);
```

**Letter Spacing:**
```css
--tracking-normal: 0.025em;
--tracking-tight: calc(var(--tracking-normal) - 0.025em);
--tracking-wide: calc(var(--tracking-normal) + 0.025em);
```

### Layout System

**3-Column Layout:**
- Left Sidebar: 280px (collapsible)
- Main Content: Flexible (takes remaining space)
- Right Sidebar: 320px (collapsible, for chat/activity)

**Header:**
- Fixed height: 64px
- Contains: Church info (acronym, name, campus badge), logo, progress badge

**Mobile:**
- Bottom navigation bar
- Overlay sidebars
- Touch-optimized spacing (48px minimum touch targets)

### Component Patterns

**Cards:**
- Background: `#1A1A20` or `#0F0F12`
- Border: `border-border/50` (subtle)
- Padding: `p-4` to `p-6`
- Rounded: `rounded-lg`

**Buttons:**
- Primary: `bg-primary text-primary-foreground`
- Variants: default, outline, ghost, destructive
- Sizes: sm, default, lg, icon

**Badges:**
- Uppercase text
- Small font size (0.75rem)
- Background with opacity (e.g., `bg-warning/20`)

---

## Component Mapping Strategy

### React → Vue+Quasar Mapping

| React Component | Vue+Quasar Equivalent | Notes |
|----------------|----------------------|-------|
| `AppLayout` | `q-layout` with custom layout | 3-column grid system |
| `Sidebar` | `q-drawer` (left) | 280px width, collapsible |
| `SecondarySidebar` | `q-drawer` (right) | 320px width, for chat |
| `AppHeader` | Custom header component | Church branding header |
| `Button` | `q-btn` + custom styling | Match ShadCN variants |
| `Card` | `q-card` + custom styling | Match prototype styling |
| `Tabs` | `q-tabs` + `q-tab-panels` | Tab navigation |
| `Badge` | `q-badge` + custom styling | Status indicators |
| `Dialog` | `q-dialog` | Modals |
| `DropdownMenu` | `q-menu` | Context menus |
| `Input` | `q-input` | Form inputs |
| `Select` | `q-select` | Dropdowns |
| `Checkbox` | `q-checkbox` | Checkboxes |
| `Radio` | `q-radio` | Radio buttons |
| `Avatar` | `q-avatar` | User avatars |
| `ScrollArea` | `q-scroll-area` | Scrollable containers |

### State Management Mapping

| React Pattern | Vue+Quasar Equivalent |
|--------------|----------------------|
| `useState` | `ref()` or `reactive()` |
| `useEffect` | `watch()` or `onMounted()` |
| `useContext` | Pinia stores |
| `AuthContext` | `useAuthStore()` (Pinia) |
| `OrganizationContext` | `useOrganizationStore()` (Pinia) |

### Routing Mapping

| React Router | Vue Router |
|-------------|-----------|
| `useNavigate` | `useRouter()` |
| `useLocation` | `useRoute()` |
| `ProtectedRoute` | Route guards (`beforeEnter`) |

---

## Specification Review

### Specs Requiring Updates

After reviewing the prototype against the 18 specifications, the following specs need updates:

#### **Spec 000: Authentication System** ✅
- **Status**: Mostly complete
- **Updates Needed**: 
  - Match prototype's auth page design exactly
  - Add demo mode toggle (as seen in prototype)
  - Update styling to match green dark theme

#### **Spec 001: Organization Setup** ⚠️
- **Status**: Needs design alignment
- **Updates Needed**:
  - Implement AppHeader component with church branding (acronym, name, campus badge)
  - Add church logo component
  - Match prototype's organization display format

#### **Spec 002: Member Management** ✅
- **Status**: Functionally complete, needs design alignment
- **Updates Needed**:
  - Match prototype's member list design
  - Update card styling to match `#1A1A20` background
  - Align typography (light font weights)

#### **Spec 003: Attendance System** ⚠️
- **Status**: Needs significant design work
- **Updates Needed**:
  - Implement CheckInKiosk component (fullscreen mode)
  - Match service card design with green accent
  - Add attendance management header (as in prototype)
  - Implement QR code scanner UI matching prototype

#### **Spec 004: UI/UX System** 🔴 **CRITICAL UPDATE NEEDED**
- **Status**: Major design system mismatch
- **Updates Needed**:
  - **Color System**: Update from current theme to prototype's green dark theme
    - Primary: `#1CE479` (not current theme)
    - Background: `#0A0A0F` (not current dark grey)
    - Card: `#1A1A20` (not current card color)
  - **Typography**: Implement light font weights (200-300)
  - **Layout**: Implement 3-column layout system
  - **Component Styling**: Match all ShadCN component styles
  - **Spacing**: Match prototype's spacing system
  - **Border Radius**: Match prototype's rounded corners

#### **Spec 005: Dashboard System** ⚠️
- **Status**: Needs complete redesign
- **Updates Needed**:
  - Implement draggable KPI cards (as in prototype)
  - Match dashboard customizer UI
  - Add dashboard tour feature
  - Match chart styling (attendance, giving, visitors)
  - Implement activity feed component
  - Add quick actions panel

#### **Spec 006: Communication System** ✅
- **Status**: Functionally complete
- **Updates Needed**:
  - Match chat interface design
  - Update to match prototype's chat sidebar

#### **Spec 007: Integration System** ✅
- **Status**: No design changes needed (backend-focused)

#### **Spec 008: Admin Settings System** ⚠️
- **Status**: Needs design alignment
- **Updates Needed**:
  - Match settings page design
  - Update color palette component (if exists)

#### **Spec 009: Workflow Engine System** ✅
- **Status**: Backend-focused, no immediate design needs

#### **Spec 010: Financial Management System** ⚠️
- **Status**: Needs design alignment
- **Updates Needed**:
  - Match giving dashboard design
  - Update donation form styling
  - Match campaign manager UI

#### **Spec 011: Advanced Member Journey Analytics** ✅
- **Status**: Backend-focused, design can follow later

#### **Spec 012: Multi-Location Territory Management** ✅
- **Status**: Backend-focused, design can follow later

#### **Spec 013: Multi-Location Territory Management** (Duplicate?) ⚠️
- **Status**: Verify if this is a duplicate of Spec 012

#### **Spec 014: Chat System** ⚠️
- **Status**: Needs design alignment
- **Updates Needed**:
  - Match prototype's chat interface
  - Update secondary sidebar design
  - Match message styling

#### **Spec 015: AI Memory System** ✅
- **Status**: Backend-focused, design can follow later

#### **Spec 016: Production Deployment System** ✅
- **Status**: Infrastructure-focused, no design changes

#### **Spec 017: Nginx Migration System** ✅
- **Status**: Infrastructure-focused, no design changes

#### **Spec 018: AI Assistant System** ⚠️
- **Status**: Needs design alignment
- **Updates Needed**:
  - Match AI dashboard design
  - Update insights display
  - Match churn predictions UI

---

## Implementation Tasks

### Phase 1: Design System Foundation (CRITICAL - Do First)

#### Task 1.1: Replace Color System with TweakCN OKLCH Theme (Complete Overhaul)
**Priority**: P0 (Critical)
**Estimated Time**: 8-10 hours

**⚠️ CRITICAL**: This is a COMPLETE REPLACEMENT with **TweakCN theme using OKLCH color space**. The prototype uses a professional design system that must be replicated exactly.

**Subtasks:**
1. **Remove Current Color System**
   - Delete/backup current Quasar theme colors
   - Remove current Tailwind color definitions
   - Remove current CSS color variables
   - Document what was removed (for reference)

2. **Implement TweakCN OKLCH Color System**
   - **Copy entire color system from prototype's `globals.css`**
   - Use OKLCH color space (not hex/RGB)
   - Primary: `oklch(0.4365 0.1044 156.7556)` (dark mode)
   - Background: `oklch(0.1822 0 0)` (equivalent to `#0A0A0F`)
   - Card: `oklch(0.2046 0 0)` (equivalent to `#1A1A20`)
   - Foreground: `oklch(0.9288 0.0126 255.5078)` (white text)
   - Muted Foreground: `oklch(0.7122 0 0)` (grey text)
   - Border: `oklch(0.2809 0 0)`
   - **Semantic colors in OKLCH:**
     - Success: `oklch(0.4365 0.1044 156.7556)`
     - Warning: `oklch(0.8369 0.1644 84.4286)`
     - Destructive: `oklch(0.3123 0.0852 29.7877)`
     - Info: `oklch(0.7137 0.1434 254.6240)`
   - **Chart colors in OKLCH** (5 distinct colors for data visualization)
   - **Sidebar colors in OKLCH** (if applicable)

3. **Set Up Tailwind v4 CSS-First Configuration**
   - Use `@theme inline` directive (Tailwind v4)
   - Map all OKLCH CSS variables to Tailwind utilities
   - No JavaScript config needed for colors
   - Ensure OKLCH support in build process

3. **Update Quasar Theme Configuration**
   - Replace Quasar theme colors completely
   - Remove old theme files if they exist
   - Create new theme configuration matching prototype

4. **Update Tailwind Configuration**
   - Replace Tailwind color palette entirely
   - Add prototype colors as custom colors
   - Configure dark mode (prototype is dark-only)
   - Set up color opacity utilities (`/10`, `/20`, `/50`, etc.)

5. **Update Global CSS**
   - Replace CSS custom properties with prototype colors
   - Remove old color variables
   - Add prototype color system
   - Ensure OKLCH color space support (if prototype uses it)

6. **Remove Old Theme Files**
   - Delete or archive old theme files
   - Remove any theme switching logic (if prototype is dark-only)
   - Clean up unused theme code

7. **Test Color Consistency**
   - Verify NO old colors remain
   - Verify all components use new colors
   - Check contrast ratios (WCAG AA)
   - Visual comparison with prototype

**Files to Modify:**
- `frontend/quasar.config.js` (replace theme configuration)
- `frontend/tailwind.config.js` (update for Tailwind v4 if needed, or use CSS-first)
- `frontend/src/styles/globals.css` (REPLACE with prototype's globals.css - copy TweakCN theme)
- `frontend/src/themes/*` (replace or remove theme files)

**Files to Archive/Delete:**
- Old theme files (backup first)
- Old color configuration files

**Reference Files (Copy from Prototype):**
- `ChMS-by-Make/src/styles/globals.css` - Copy entire TweakCN theme
- `ChMS-by-Make/src/DESIGN_SYSTEM_UPDATE_NOV_12_2025.md` - Design system documentation

**Acceptance Criteria:**
- [ ] ALL old colors removed
- [ ] OKLCH color space implemented (not hex/RGB)
- [ ] Primary color is `oklch(0.4365 0.1044 156.7556)` throughout app
- [ ] Background is `oklch(0.1822 0 0)` everywhere (equivalent to `#0A0A0F`)
- [ ] Cards use `oklch(0.2046 0 0)` background (equivalent to `#1A1A20`)
- [ ] All semantic colors use OKLCH format
- [ ] Chart colors implemented (5 OKLCH colors)
- [ ] NO hardcoded old colors remain
- [ ] Visual match with prototype color system
- [ ] OKLCH colors render correctly in browsers

---

#### Task 1.2: Replace Typography System with Geist Font (Complete Overhaul)
**Priority**: P0 (Critical)
**Estimated Time**: 5-6 hours

**⚠️ CRITICAL**: This is a COMPLETE REPLACEMENT with **Geist font from Google Fonts**. The prototype uses Geist, NOT Inter or system fonts.

**Subtasks:**
1. **Remove Current Typography**
   - Remove current font weight definitions
   - Remove current font family settings (Inter, system fonts, etc.)
   - Remove current line height settings
   - Document what was removed

2. **Implement Geist Font System**
   - **Import Geist font from Google Fonts:**
     ```css
     @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100;200;300;400;500;600;700;800&display=swap');
     ```
   - Set font family: `'Geist', sans-serif` (NOT Inter, NOT system fonts)
   - Base font size: **15px** (not 14px - prototype uses 15px)
   - Font weights: Light (300) for headings, Regular (400) for body
   - Letter spacing: `0.025em` (normal), with tight/wide variants
   - Line heights: Tight (1.0-1.2) for headings, Normal (1.5) for body

3. **Configure Font Rendering**
   - Enable antialiasing: `-webkit-font-smoothing: antialiased`
   - Enable font smoothing: `-moz-osx-font-smoothing: grayscale`
   - Optimize text rendering: `text-rendering: optimizeLegibility`
   - Enable font features: `font-feature-settings: "kern" 1, "liga" 1`

4. **Update CSS Variables**
   - Set `--font-sans: 'Geist', sans-serif`
   - Set `--tracking-normal: 0.025em`
   - Set `--tracking-tight: calc(var(--tracking-normal) - 0.025em)`
   - Set `--tracking-wide: calc(var(--tracking-normal) + 0.025em)`

3. **Update Quasar Typography**
   - Replace Quasar typography classes
   - Override default Quasar typography
   - Create custom typography utilities

4. **Update Global CSS**
   - Replace font definitions
   - Add prototype typography system
   - Remove old typography styles

5. **Create Typography Utility Classes**
   - Heading classes with light weights (200-300)
   - Body text classes (regular 400)
   - Muted text classes
   - Match prototype typography exactly

6. **Update Component Typography**
   - Audit all components for typography usage
   - Replace old typography classes
   - Apply prototype typography

**Files to Modify:**
- `frontend/quasar.config.js` (replace typography config)
- `frontend/src/styles/globals.css` (add Outfit font import and configuration)
- All component files (update typography classes)

**Reference Files (Copy from Prototype):**
- `ChMS-by-Make/src/styles/globals.css` - Font configuration
- `ChMS-by-Make/src/DESIGN_SYSTEM_UPDATE_NOV_12_2025.md` - Typography documentation

**Acceptance Criteria:**
- [ ] ALL old typography removed (Inter, system fonts, etc.)
- [ ] Geist font imported from Google Fonts
- [ ] Font family is `'Geist', sans-serif` throughout
- [ ] Base font size is 15px (not 14px)
- [ ] Headings use light font weights (300)
- [ ] Body text uses regular weight (400)
- [ ] Letter spacing is `0.025em` (normal)
- [ ] Line heights match prototype exactly
- [ ] Font rendering is optimized (antialiased, etc.)
- [ ] Visual match with prototype typography

---

#### Task 1.3: Replace Layout System (Complete Overhaul)
**Priority**: P0 (Critical)
**Estimated Time**: 10-12 hours

**⚠️ IMPORTANT**: This is a COMPLETE REPLACEMENT. Remove current layout and replace with prototype layout.

**Subtasks:**
1. **Remove Current Layout**
   - Archive current layout components
   - Remove current sidebar components
   - Remove current header components
   - Document current layout structure (for reference)

2. **Create Prototype 3-Column Layout**
   - Left sidebar: 280px width (collapsible)
   - Main content: Flexible (takes remaining space)
   - Right sidebar: 320px width (collapsible)
   - Use Quasar's `q-layout` with custom configuration
   - Match prototype layout exactly

3. **Create Prototype Sidebar Components**
   - Left sidebar: Navigation menu (match prototype exactly)
   - Right sidebar: Chat/activity panel (match prototype exactly)
   - Collapse/expand functionality (smooth animations)
   - Mobile overlay behavior (match prototype)
   - Sidebar styling matches prototype

4. **Create Prototype Header Component**
   - Church branding: Acronym + City (line 1)
   - Full church name + Campus badge (line 2)
   - Address (line 3)
   - Logo display (right side)
   - Progress badge (optional, right side)
   - Match prototype's 3-line header format exactly

5. **Create Prototype Mobile Navigation**
   - Bottom navigation bar (match prototype)
   - Overlay sidebars (match prototype)
   - Touch-optimized spacing (48px minimum)
   - Match prototype mobile patterns

6. **Replace Layout in Router**
   - Update router to use new layout
   - Remove old layout references
   - Test routing with new layout

**Files to Create:**
- `frontend/src/layouts/PrototypeLayout.vue` (new 3-column layout - REPLACES current)
- `frontend/src/components/layout/AppHeader.vue` (prototype header - REPLACES current)
- `frontend/src/components/layout/LeftSidebar.vue` (prototype sidebar - REPLACES current)
- `frontend/src/components/layout/RightSidebar.vue` (prototype sidebar - REPLACES current)
- `frontend/src/components/layout/MobileBottomNav.vue` (prototype mobile nav - REPLACES current)

**Files to Archive/Replace:**
- `frontend/src/layouts/DashboardLayout.vue` (archive, replace with PrototypeLayout)
- `frontend/src/layouts/AccessibleDashboardLayout.vue` (archive or adapt)
- Current layout components (archive)

**Files to Modify:**
- `frontend/src/router/index.ts` (update to use PrototypeLayout)
- All views/pages (may need minor adjustments for new layout)

**Acceptance Criteria:**
- [ ] Current layout completely removed/replaced
- [ ] 3-column layout matches prototype exactly
- [ ] Sidebars match prototype design and behavior
- [ ] Header matches prototype's 3-line format exactly
- [ ] Mobile navigation matches prototype
- [ ] Layout is fully responsive
- [ ] All routes work with new layout

---

### Phase 2: Core Component Library

#### Task 2.1: Create Base UI Components
**Priority**: P0 (Critical)
**Estimated Time**: 12-16 hours

**Components to Create/Update:**

1. **Button Component** (`BaseButton.vue`)
   - Match ShadCN button variants
   - Sizes: sm, default, lg, icon
   - Variants: default, outline, ghost, destructive, secondary, link
   - Match prototype styling exactly

2. **Card Component** (`BaseCard.vue`)
   - Background: `#1A1A20` or `#0F0F12`
   - Border: subtle (`border-border/50`)
   - Padding: configurable
   - Rounded corners

3. **Badge Component** (`BaseBadge.vue`)
   - Uppercase text
   - Small font size (0.75rem)
   - Background with opacity
   - Variants: default, outline, success, warning, destructive

4. **Input Component** (`BaseInput.vue`)
   - Match prototype styling
   - Dark theme styling
   - Proper focus states
   - Error states

5. **Select Component** (`BaseSelect.vue`)
   - Match prototype dropdown styling
   - Dark theme
   - Proper focus states

6. **Dialog/Modal Component** (`BaseDialog.vue`)
   - Match prototype modal styling
   - Dark overlay
   - Proper animations

7. **Tabs Component** (`BaseTabs.vue`)
   - Match prototype tab styling
   - Light font weight for labels
   - Icon support
   - Active state styling

**Files to Create:**
- `frontend/src/components/ui/BaseButton.vue`
- `frontend/src/components/ui/BaseCard.vue`
- `frontend/src/components/ui/BaseBadge.vue`
- `frontend/src/components/ui/BaseInput.vue`
- `frontend/src/components/ui/BaseSelect.vue`
- `frontend/src/components/ui/BaseDialog.vue`
- `frontend/src/components/ui/BaseTabs.vue`

**Acceptance Criteria:**
- [ ] All components match prototype styling exactly
- [ ] Components are reusable and well-documented
- [ ] Dark theme styling is consistent
- [ ] Accessibility features are included (ARIA labels, keyboard navigation)

---

#### Task 2.2: Create Navigation Components
**Priority**: P0 (Critical)
**Estimated Time**: 8-10 hours

**Components to Create:**

1. **Navigation Sidebar** (`LeftSidebar.vue`)
   - Match prototype's sidebar design
   - Church info at top
   - Navigation items with icons
   - Active state indicators
   - Collapsible sections
   - User profile section at bottom

2. **Secondary Sidebar** (`RightSidebar.vue`)
   - Chat interface (if applicable)
   - Activity feed
   - Notifications
   - Match prototype's right sidebar

3. **Mobile Bottom Navigation** (`MobileBottomNav.vue`)
   - Icon-based navigation
   - Active state indicators
   - Touch-optimized

4. **Sub Navigation** (`SubNavigation.vue`)
   - Tab-based sub-navigation
   - Match prototype's sub-navigation design
   - Used in attendance, events, giving sections

**Files to Create:**
- `frontend/src/components/layout/LeftSidebar.vue`
- `frontend/src/components/layout/RightSidebar.vue`
- `frontend/src/components/layout/MobileBottomNav.vue`
- `frontend/src/components/navigation/SubNavigation.vue`

**Acceptance Criteria:**
- [ ] Navigation matches prototype exactly
- [ ] Active states are clear
- [ ] Mobile navigation works smoothly
- [ ] Icons match prototype

---

### Phase 3: Feature Components

#### Task 3.1: Dashboard Components
**Priority**: P1 (High)
**Estimated Time**: 16-20 hours

**Components to Create/Update:**

1. **Dashboard Container** (`Dashboard.vue`)
   - Draggable KPI cards
   - Dashboard customizer
   - Dashboard tour
   - Match prototype's dashboard layout

2. **KPI Cards** (`KPICard.vue`, `DraggableKPICard.vue`)
   - Match prototype's card design
   - Icons, values, labels
   - Trend indicators
   - Draggable functionality

3. **Charts** (`AttendanceChart.vue`, `GivingChart.vue`, `VisitorsChart.vue`)
   - Match prototype's chart styling
   - Dark theme colors
   - Proper legends and labels

4. **Activity Feed** (`ActivityFeed.vue`)
   - Match prototype's activity feed design
   - Timeline layout
   - Icons and avatars

5. **Quick Actions** (`QuickActions.vue`)
   - Match prototype's quick actions panel
   - Icon buttons
   - Hover states

6. **Upcoming Events** (`UpcomingEvents.vue`)
   - Match prototype's events widget
   - Card-based layout
   - Date and time display

**Files to Create/Update:**
- `frontend/src/components/dashboard/Dashboard.vue`
- `frontend/src/components/dashboard/KPICard.vue`
- `frontend/src/components/dashboard/DraggableKPICard.vue`
- `frontend/src/components/dashboard/AttendanceChart.vue`
- `frontend/src/components/dashboard/GivingChart.vue`
- `frontend/src/components/dashboard/VisitorsChart.vue`
- `frontend/src/components/dashboard/ActivityFeed.vue`
- `frontend/src/components/dashboard/QuickActions.vue`
- `frontend/src/components/dashboard/UpcomingEvents.vue`

**Acceptance Criteria:**
- [ ] Dashboard matches prototype layout
- [ ] KPI cards are draggable
- [ ] Charts match prototype styling
- [ ] All widgets are functional

---

#### Task 3.2: Member Management Components
**Priority**: P1 (High)
**Estimated Time**: 12-16 hours

**Components to Update:**

1. **Member List** (`MemberList.vue`)
   - Match prototype's member list design
   - Card-based layout
   - Search and filters
   - Action buttons

2. **Member Card** (`MemberCard.vue`)
   - Match prototype's member card design
   - Avatar, name, details
   - Status badges
   - Action menu

3. **Add Member Form** (`AddMemberForm.vue`)
   - Match prototype's form design
   - Dark theme styling
   - Proper validation
   - Error states

**Files to Update:**
- `frontend/src/components/members/MemberList.vue`
- `frontend/src/components/members/MemberCard.vue` (create if needed)
- `frontend/src/components/members/AddMemberForm.vue` (create if needed)

**Acceptance Criteria:**
- [ ] Member list matches prototype design
- [ ] Cards use correct colors and spacing
- [ ] Forms match prototype styling
- [ ] Typography matches (light weights)

---

#### Task 3.3: Attendance System Components
**Priority**: P1 (High)
**Estimated Time**: 20-24 hours

**Components to Create/Update:**

1. **Attendance Management Header** (`AttendanceHeader.vue`)
   - Match prototype's header design
   - Church acronym + campus badge
   - Service card with details
   - Check-in count display

2. **Check-In Kiosk** (`CheckInKiosk.vue`)
   - Fullscreen mode
   - QR code scanner
   - Member search
   - Recent check-ins display
   - Match prototype's kiosk design exactly

3. **Service Card** (`ServiceCard.vue`)
   - Match prototype's service card
   - Green accent color
   - Service details (date, time, location)
   - Expected attendance

4. **Attendance Tracker** (`AttendanceTracker.vue`)
   - Match prototype's manual check-in design
   - Service selector
   - Member list with check-in buttons
   - Status indicators

5. **QR Code Components** (`QRCodeGenerator.vue`, `QRCodeScanner.vue`)
   - Match prototype's QR code UI
   - Service-specific QR codes
   - Family QR codes

**Files to Create/Update:**
- `frontend/src/components/attendance/AttendanceHeader.vue`
- `frontend/src/components/attendance/CheckInKiosk.vue`
- `frontend/src/components/attendance/ServiceCard.vue`
- `frontend/src/components/attendance/AttendanceTracker.vue`
- `frontend/src/components/attendance/QRCodeGenerator.vue`
- `frontend/src/components/attendance/QRCodeScanner.vue`

**Acceptance Criteria:**
- [ ] Attendance header matches prototype exactly
- [ ] Check-in kiosk has fullscreen mode
- [ ] Service card matches prototype design
- [ ] QR code components match prototype UI

---

#### Task 3.4: Other Feature Components
**Priority**: P2 (Medium)
**Estimated Time**: 24-32 hours

**Components to Update:**

1. **Events Components**
   - Event calendar
   - Event list
   - Event management
   - Match prototype styling

2. **Giving Components**
   - Giving dashboard
   - Donation form
   - Campaign manager
   - Match prototype styling

3. **Analytics Components**
   - Analytics hub
   - Membership analytics
   - Attendance analytics
   - Church health analytics
   - Match prototype styling

4. **AI Dashboard**
   - AI insights
   - Churn predictions
   - Match prototype styling

5. **Reports Components**
   - Reports hub
   - Various report types
   - Match prototype styling

**Files to Update:**
- All feature component files in respective directories

**Acceptance Criteria:**
- [ ] All components match prototype styling
- [ ] Consistent design language throughout
- [ ] Dark theme applied correctly

---

### Phase 4: Integration & Polish

#### Task 4.1: Update Router & Navigation
**Priority**: P1 (High)
**Estimated Time**: 4-6 hours

**Subtasks:**
1. Update route definitions
   - Match prototype's route structure
   - Add sub-routes for tabs

2. Update navigation logic
   - Match prototype's navigation flow
   - Tab-based navigation where applicable

3. Add route guards
   - Protected routes
   - Role-based access

**Files to Modify:**
- `frontend/src/router/index.ts`

**Acceptance Criteria:**
- [ ] Routes match prototype structure
- [ ] Navigation works smoothly
- [ ] Route guards are functional

---

#### Task 4.2: Update State Management
**Priority**: P1 (High)
**Estimated Time**: 6-8 hours

**Subtasks:**
1. Update Pinia stores
   - Match prototype's state structure
   - Add any missing stores

2. Update composables
   - Match prototype's composable patterns
   - Add any missing composables

**Files to Modify:**
- All Pinia store files
- Composable files

**Acceptance Criteria:**
- [ ] State management matches prototype patterns
- [ ] All stores are properly typed
- [ ] Composables are reusable

---

#### Task 4.3: Responsive Design & Mobile Optimization
**Priority**: P1 (High)
**Estimated Time**: 8-10 hours

**Subtasks:**
1. Test all components on mobile
   - Ensure touch targets are 48px minimum
   - Verify spacing is appropriate
   - Check overlay behavior

2. Optimize for tablet
   - Test intermediate screen sizes
   - Ensure layout adapts properly

3. Test on various devices
   - Android phones (primary target)
   - iOS devices
   - Tablets

**Acceptance Criteria:**
- [ ] All components work on mobile
- [ ] Touch targets meet accessibility standards
- [ ] Layout adapts properly to all screen sizes

---

#### Task 4.4: Accessibility Audit
**Priority**: P1 (High)
**Estimated Time**: 6-8 hours

**Subtasks:**
1. Add ARIA labels
   - All interactive elements
   - Form inputs
   - Buttons

2. Keyboard navigation
   - Tab order
   - Focus indicators
   - Keyboard shortcuts

3. Screen reader testing
   - Test with screen readers
   - Ensure proper announcements

4. Contrast checking
   - Verify WCAG AA compliance
   - Check all text/background combinations

**Acceptance Criteria:**
- [ ] WCAG AA compliance achieved
- [ ] Keyboard navigation works throughout
- [ ] Screen readers can navigate app
- [ ] All contrast ratios meet standards

---

#### Task 4.5: Performance Optimization
**Priority**: P2 (Medium)
**Estimated Time**: 6-8 hours

**Subtasks:**
1. Code splitting
   - Lazy load routes
   - Lazy load heavy components

2. Image optimization
   - Optimize all images
   - Use appropriate formats
   - Lazy load images

3. Bundle size optimization
   - Analyze bundle size
   - Remove unused dependencies
   - Tree-shake unused code

4. Runtime performance
   - Optimize re-renders
   - Use virtual scrolling where needed
   - Optimize chart rendering

**Acceptance Criteria:**
- [ ] Initial bundle size < 500KB
- [ ] Page load time < 3 seconds on 3G
- [ ] Smooth 60fps animations
- [ ] No performance regressions

---

### Phase 5: Testing & Validation

#### Task 5.1: Visual Regression Testing
**Priority**: P1 (High)
**Estimated Time**: 8-10 hours

**Subtasks:**
1. Set up visual regression testing
   - Configure testing tool (e.g., Percy, Chromatic)
   - Create baseline screenshots

2. Test all pages
   - Dashboard
   - Members
   - Attendance
   - Events
   - All other pages

3. Compare with prototype
   - Side-by-side comparison
   - Document any intentional differences

**Acceptance Criteria:**
- [ ] Visual regression tests pass
- [ ] All pages match prototype (or documented differences)
- [ ] Tests are automated in CI/CD

---

#### Task 5.2: Functional Testing
**Priority**: P1 (High)
**Estimated Time**: 12-16 hours

**Subtasks:**
1. Test all user flows
   - Authentication
   - Member management
   - Attendance tracking
   - Event management
   - All other features

2. Test edge cases
   - Offline functionality
   - Error states
   - Empty states
   - Loading states

3. Cross-browser testing
   - Chrome/Edge
   - Firefox
   - Safari
   - Mobile browsers

**Acceptance Criteria:**
- [ ] All user flows work correctly
- [ ] Edge cases are handled properly
- [ ] Works on all target browsers

---

#### Task 5.3: Accessibility Testing
**Priority**: P1 (High)
**Estimated Time**: 6-8 hours

**Subtasks:**
1. Automated accessibility testing
   - Run axe-core or similar
   - Fix all violations

2. Manual testing
   - Keyboard navigation
   - Screen reader testing
   - Color contrast verification

3. User testing (if possible)
   - Test with users with disabilities
   - Gather feedback

**Acceptance Criteria:**
- [ ] No accessibility violations
- [ ] WCAG AA compliance verified
- [ ] User testing feedback incorporated

---

## Risk Mitigation & Testing Strategy

### 🚨 Critical Risks

#### Risk 1: Breaking Functionality During Visual Overhaul
**Impact**: High - Users lose access to features
**Mitigation**:
- Create comprehensive test suite before starting
- Test each component after replacement
- Maintain feature parity checklist
- Use feature flags if needed for gradual rollout

#### Risk 2: State Management Incompatibility
**Impact**: Medium - Data flow breaks
**Mitigation**:
- Audit all Pinia stores before starting
- Document store usage in each component
- Test store integration after component replacement
- Keep store structure stable (only adjust if absolutely necessary)

#### Risk 3: Performance Regression
**Impact**: Medium - App becomes slow
**Mitigation**:
- Performance baseline before starting
- Monitor bundle size during replacement
- Optimize new components from the start
- Performance testing after each phase

#### Risk 4: Accessibility Regression
**Impact**: High - Legal/compliance issues
**Mitigation**:
- Accessibility audit before starting
- Test accessibility after each component replacement
- Maintain WCAG AA compliance throughout
- Automated accessibility testing in CI/CD

### 🧪 Testing Strategy

#### Pre-Migration Testing
1. **Functional Test Suite**
   - Document all current user flows
   - Create test cases for each feature
   - Test on target devices (Android phones)
   - Test offline functionality

2. **Visual Baseline**
   - Screenshot all current pages
   - Document current UI patterns
   - Create visual regression baseline

3. **Performance Baseline**
   - Measure current bundle size
   - Measure current load times
   - Measure current runtime performance
   - Document performance metrics

#### During Migration Testing
1. **Component-Level Testing**
   - Test each new component in isolation
   - Test component with real data from stores
   - Test component interactions
   - Visual comparison with prototype

2. **Integration Testing**
   - Test component integration with stores
   - Test component integration with composables
   - Test routing with new components
   - Test API integration

3. **Regression Testing**
   - Run functional tests after each component replacement
   - Verify no features broke
   - Verify data flow still works
   - Verify offline functionality still works

#### Post-Migration Testing
1. **Complete Functional Testing**
   - Test all user flows end-to-end
   - Test on all target devices
   - Test offline/online scenarios
   - Test error handling

2. **Visual Regression Testing**
   - Compare with prototype screenshots
   - Verify design system consistency
   - Check responsive behavior
   - Verify accessibility

3. **Performance Testing**
   - Measure bundle size (target: < 500KB)
   - Measure load time (target: < 3s on 3G)
   - Measure runtime performance
   - Compare with baseline

4. **User Acceptance Testing**
   - Test with actual users (if possible)
   - Gather feedback on new design
   - Verify usability improvements
   - Check mobile experience

### 📊 Success Metrics

**Functional Metrics:**
- ✅ All existing features work
- ✅ No regression in functionality
- ✅ All API integrations work
- ✅ Offline functionality preserved

**Visual Metrics:**
- ✅ 95%+ match with prototype design
- ✅ Consistent design system throughout
- ✅ All components match prototype styling

**Performance Metrics:**
- ✅ Bundle size ≤ 500KB (initial load)
- ✅ Load time ≤ 3s on 3G connection
- ✅ 60fps animations
- ✅ No performance regressions

**Accessibility Metrics:**
- ✅ WCAG AA compliance
- ✅ Keyboard navigation works
- ✅ Screen reader compatible
- ✅ Color contrast ratios met

---

## Critical Design System Notes

### ⚠️ TweakCN Theme Requirements

The prototype uses a **professional TweakCN theme** that must be replicated exactly:

1. **OKLCH Color Space** - All colors must use OKLCH format, not hex/RGB
2. **Geist Font** - Must use Geist from Google Fonts, not Inter or system fonts
3. **Tailwind v4** - Uses CSS-first configuration with `@theme inline`
4. **15px Base Font** - Not 14px
5. **Professional Shadows** - Layered shadow system
6. **Design Tokens** - Border radius, letter spacing, etc. from prototype

**Reference Documents:**
- **TweakCN Theme**: https://tweakcn.com/themes/cmhw1o251000b04l7076c29in
- `ChMS-by-Make/src/DESIGN_SYSTEM_UPDATE_NOV_12_2025.md` - Complete design system documentation
- `ChMS-by-Make/src/styles/globals.css` - Complete TweakCN theme CSS (copy this!)
- `ChMS-by-Make/src/VUE_MIGRATION_GUIDE.md` - Vue migration patterns
- `ChMS-by-Make/src/PROJECT_HANDOFF.md` - Complete component inventory

---

## Pre-Migration Checklist

### 🔍 Current State Audit

Before starting the migration, complete a comprehensive audit of the current codebase to ensure nothing is lost during the visual overhaul.

#### 1. Functionality Inventory

**Document all current features:**
- [ ] List all working features in the current codebase
- [ ] Document all user flows (authentication, member management, attendance, etc.)
- [ ] Create test cases for each feature
- [ ] Test all features on target devices (Android phones)
- [ ] Test offline functionality
- [ ] Document any known bugs or issues

**Files to Review:**
- `frontend/src/router/index.ts` - All routes
- `frontend/src/stores/*` - All Pinia stores
- `frontend/src/composables/*` - All composables
- `frontend/src/services/*` - All API services
- All view/component files

#### 2. Store & State Management Audit

**Document all Pinia stores:**
- [ ] List all stores and their purposes
- [ ] Document store state structure
- [ ] Document store actions and getters
- [ ] Document store dependencies
- [ ] Note which components use which stores
- [ ] Create a store dependency map

**Stores to Audit:**
- `frontend/src/stores/auth.ts`
- `frontend/src/stores/members.ts`
- `frontend/src/stores/attendance.ts`
- `frontend/src/stores/organization.ts`
- `frontend/src/stores/dashboard.ts`
- All other stores

#### 3. Component Inventory

**Document all current components:**
- [ ] List all Vue components
- [ ] Document component props and emits
- [ ] Document which stores/composables each component uses
- [ ] Document component dependencies
- [ ] Note component functionality (not styling)
- [ ] Create component dependency map

**Components to Audit:**
- All files in `frontend/src/components/`
- All files in `frontend/src/views/`
- All files in `frontend/src/layouts/`

#### 4. API Integration Audit

**Document all API integrations:**
- [ ] List all API endpoints used
- [ ] Document API request/response formats
- [ ] Document error handling
- [ ] Document offline sync logic
- [ ] Test all API integrations
- [ ] Document authentication flow

**Files to Review:**
- `frontend/src/services/api.ts`
- `frontend/src/services/offline-sync.ts`
- All API-related composables

#### 5. Visual Baseline Documentation

**Capture current visual state:**
- [ ] Screenshot all pages/views
- [ ] Document current color scheme
- [ ] Document current typography
- [ ] Document current layout patterns
- [ ] Document current component styles
- [ ] Create visual regression baseline

**Tools to Use:**
- Browser DevTools (screenshots)
- Visual regression testing tools (if available)
- Manual documentation

#### 6. Performance Baseline

**Measure current performance:**
- [ ] Measure current bundle size
- [ ] Measure current load times (on 3G)
- [ ] Measure runtime performance
- [ ] Measure memory usage
- [ ] Document performance metrics
- [ ] Create performance baseline

**Metrics to Capture:**
- Initial bundle size (target: < 500KB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Runtime performance (60fps target)

#### 7. Accessibility Baseline

**Document current accessibility:**
- [ ] Run automated accessibility tests (axe-core, etc.)
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Check color contrast ratios
- [ ] Document accessibility issues
- [ ] Create accessibility baseline

**Tools to Use:**
- Browser DevTools (Accessibility panel)
- axe DevTools extension
- Screen reader testing
- Color contrast checkers

#### 8. Testing Infrastructure

**Ensure testing is ready:**
- [ ] Review existing test suite
- [ ] Document test coverage
- [ ] Ensure tests are passing
- [ ] Set up visual regression testing (if not already)
- [ ] Set up accessibility testing (if not already)
- [ ] Document test execution process

**Test Files to Review:**
- `frontend/tests/e2e/*` - E2E tests
- `frontend/tests/unit/*` - Unit tests
- `frontend/src/__tests__/*` - Component tests

#### 9. Git Branch Strategy

**Set up branch for migration:**
- [ ] Create new feature branch: `feature/figma-prototype-migration` or `feature/design-system-overhaul`
- [ ] Ensure current main/master branch is stable
- [ ] Document branch naming convention
- [ ] Set up branch protection (if applicable)
- [ ] Document merge strategy
- [ ] Create backup branch (optional but recommended)

**Branch Commands:**
```bash
# Create and switch to new branch
git checkout -b feature/figma-prototype-migration

# Or with descriptive date
git checkout -b feature/design-system-overhaul-2025-01-XX

# Push branch to remote
git push -u origin feature/figma-prototype-migration
```

#### 10. Documentation Preparation

**Prepare migration documentation:**
- [ ] Create migration log template
- [ ] Set up issue tracking (if using GitHub Issues, Jira, etc.)
- [ ] Document decision log (for design decisions)
- [ ] Create progress tracking system
- [ ] Set up communication channels (if team)
- [ ] Document rollback plan

**Documentation to Create:**
- Migration progress log
- Decision log
- Issue tracker
- Rollback procedure

#### 11. Environment Setup

**Prepare development environment:**
- [ ] Ensure all dependencies are up to date
- [ ] Set up development environment
- [ ] Configure build tools
- [ ] Set up linting/formatting
- [ ] Configure IDE/editor
- [ ] Test development workflow

**Environment Checklist:**
- Node.js version correct
- npm/yarn working
- Vite dev server working
- TypeScript compiling
- ESLint/Prettier configured
- Git configured

#### 12. Prototype Access & Reference

**Ensure prototype is accessible:**
- [ ] Access to Figma prototype (if possible)
- [ ] Access to web preview: https://cast-bloom-55985635.figma.site
- [ ] Access to TweakCN theme: https://tweakcn.com/themes/cmhw1o251000b04l7076c29in
- [ ] Local copy of `ChMS-by-Make/` code
- [ ] All prototype documentation reviewed
- [ ] Design system reference ready

**Reference Materials:**
- Figma prototype (if accessible)
- Web preview URL
- TweakCN theme URL
- Local prototype code
- All `.md` documentation files

---

### ✅ Pre-Migration Sign-Off

Before starting implementation, ensure:

- [ ] All functionality is documented
- [ ] All stores/composables are documented
- [ ] All components are inventoried
- [ ] Visual baseline is captured
- [ ] Performance baseline is measured
- [ ] Accessibility baseline is documented
- [ ] Test suite is ready
- [ ] Branch is created
- [ ] Documentation is prepared
- [ ] Environment is set up
- [ ] Prototype references are accessible
- [ ] Team is aligned (if applicable)

**Only proceed to implementation once all checklist items are complete.**

---

## Questions & Clarifications

### Design Questions

1. **Color System**: The prototype uses **OKLCH color space** (`oklch(0.4365 0.1044 156.7556)`) not hex. Should we:
   - Completely replace with OKLCH system?
   - Add fallbacks for older browsers?
   - Or maintain both and allow switching?

2. **Typography**: The prototype uses very light font weights (200-300) for headings. Should we:
   - Apply this globally?
   - Or only to specific components?

3. **Layout**: The prototype has a 3-column layout with collapsible sidebars. Should we:
   - Replace the current layout completely?
   - Or make it configurable?

4. **Mobile Navigation**: The prototype has a bottom navigation bar for mobile. Should we:
   - Always show it on mobile?
   - Or make it configurable?

### Technical Questions

1. **Component Library**: Should we:
   - Create new base components matching ShadCN?
   - Or style existing Quasar components to match?

2. **State Management**: The prototype uses React Context. Should we:
   - Migrate all state to Pinia stores?
   - Or use a hybrid approach?

3. **Routing**: The prototype uses tab-based navigation in some areas. Should we:
   - Use Vue Router with nested routes?
   - Or use a custom tab system?

4. **Charts**: The prototype uses Recharts. Should we:
   - Use a Vue charting library (e.g., ECharts, Chart.js)?
   - Or create custom chart components?

### Specification Questions

1. **Spec 004 (UI/UX)**: This spec needs major updates. Should we:
   - Update the spec document first?
   - Or update it as we implement?

2. **Spec 005 (Dashboard)**: The dashboard spec may not match the prototype. Should we:
   - Update the spec to match prototype?
   - Or follow the existing spec?

3. **Priority**: Which features should be implemented first?
   - Design system foundation (Phase 1)?
   - Or specific feature components?

---

## Implementation Order Recommendation

Based on dependencies and criticality, I recommend this order:

1. **Phase 1: Design System Foundation** (CRITICAL - Do First)
   - Task 1.1: Update Color System
   - Task 1.2: Update Typography System
   - Task 1.3: Implement Layout System

2. **Phase 2: Core Component Library**
   - Task 2.1: Create Base UI Components
   - Task 2.2: Create Navigation Components

3. **Phase 3: Feature Components** (Can be done in parallel)
   - Task 3.1: Dashboard Components
   - Task 3.2: Member Management Components
   - Task 3.3: Attendance System Components
   - Task 3.4: Other Feature Components

4. **Phase 4: Integration & Polish**
   - Task 4.1: Update Router & Navigation
   - Task 4.2: Update State Management
   - Task 4.3: Responsive Design & Mobile Optimization
   - Task 4.4: Accessibility Audit
   - Task 4.5: Performance Optimization

5. **Phase 5: Testing & Validation**
   - Task 5.1: Visual Regression Testing
   - Task 5.2: Functional Testing
   - Task 5.3: Accessibility Testing

---

## Estimated Timeline

**Total Estimated Time**: 150-200 hours

**Breakdown:**
- Phase 1: 12-17 hours
- Phase 2: 20-26 hours
- Phase 3: 52-68 hours
- Phase 4: 30-40 hours
- Phase 5: 26-34 hours

**With a team of 2-3 developers**: 4-6 weeks

**With a single developer**: 8-10 weeks

---

## Risk Assessment

### High Risk
- **Design System Mismatch**: Current codebase may have deeply embedded styling that conflicts with prototype
- **Component Complexity**: Some prototype components (e.g., draggable dashboard) may be complex to implement
- **Performance**: Matching prototype exactly may impact performance (need to optimize)

### Medium Risk
- **State Management Migration**: Migrating from current state management to match prototype patterns
- **Routing Complexity**: Tab-based navigation may require custom routing solutions
- **Mobile Optimization**: Ensuring mobile experience matches prototype while maintaining performance

### Low Risk
- **Component Styling**: Most components can be styled to match prototype
- **Typography**: Font weight changes are straightforward
- **Color System**: Color updates are mostly configuration changes

---

## Next Steps

1. **Review this plan** with the team
2. **Answer questions** in the Questions & Clarifications section
3. **Prioritize tasks** based on business needs
4. **Set up project tracking** (e.g., GitHub Projects, Jira)
5. **Begin Phase 1** implementation (Design System Foundation)

---

## Notes

- **DO NOT START IMPLEMENTATION** until questions are answered and plan is approved
- This plan is based on the React prototype code analysis
- Actual Figma design may have additional details not captured in code
- Some components may need adjustment based on actual Figma design
- Regular design reviews should be conducted during implementation

---

**Document Version**: 1.0
**Last Updated**: 2025-11-13
**Author**: AI Assistant
**Status**: Planning Phase - Awaiting Approval

