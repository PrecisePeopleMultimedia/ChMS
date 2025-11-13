# Figma Prototype to Vue+Quasar Implementation Plan

## Executive Summary

This document provides a comprehensive, step-by-step implementation plan to **COMPLETELY REPLACE** the current design system, UI, and UX with the React-based Figma prototype (ChMS-by-Make). This is a **complete visual overhaul** - the current codebase provides functional foundation only, and all visual/UX elements will be replaced with the prototype's design system.

**⚠️ CRITICAL CLARIFICATION**: This is NOT an alignment or incremental update. This is a **complete design system replacement** where:
- ✅ **KEEP**: Backend logic, API integrations, Pinia stores (data structure), composables (business logic), routing structure
- ❌ **REPLACE**: All UI components, styling, color system, typography, layout, visual design, UX patterns

**Status**: **IMPLEMENTATION IN PROGRESS - Authentication System Completed**

## 📊 Implementation Progress Update (2025-11-13)

### ✅ Completed Specifications (1/18)
- **Spec 000: Authentication System** - **FULLY COMPLETED**
  - Pixel-perfect React → Vue conversion
  - TweakCN theme with OKLCH colors
  - Geist font typography implementation
  - Demo mode toggle functionality
  - Router configuration and redirects

### 🔄 In Progress
- None currently

### 📋 Next Priority
- **Spec 004: UI/UX System** - Update design system specifications
- **Spec 001: Organization Setup** - Implement AppHeader component
- **Spec 003: Attendance System** - Design attendance management header

**⚠️ BRANCH STRATEGY**: This major update will be carried out on a **separate feature branch** to maintain integrity of the current codebase. The current main/master branch will remain stable and functional while this overhaul is in progress.

**⚠️ PIXEL-PERFECT REQUIREMENT**: The React prototype (`ChMS-by-Make`) is the **SINGLE SOURCE OF TRUTH** for all visual design. Every component, layout, color, spacing, typography, and animation must match **EXACTLY**. No creative interpretations, no "improvements", no deviations. See `docs/migration/PIXEL_PERFECT_IMPLEMENTATION_GUIDE.md` for complete pixel-perfect implementation strategy.

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

### Component Variant Mapping

**Base Components with All Variants:**

1. **Button Component** (24 total variants)
   - **Variants** (6): default, outline, ghost, destructive, secondary, link
   - **Sizes** (4): sm (32px), default (40px), lg (48px), icon (32px)
   - **States** (4): default, hover, active, disabled
   - **Total Combinations**: 6 × 4 × 4 = 96 variants (many will be handled by CSS)

2. **Card Component** (6 total variants)
   - **Types** (3): default, elevated, outlined
   - **Sizes** (2): default (p-6), compact (p-4)
   - **States** (2): default, hover
   - **Features**: Optional header, optional footer, optional actions

3. **Badge Component** (10 total variants)
   - **Variants** (5): default, outline, success, warning, destructive
   - **Sizes** (2): sm (0.75rem), default (0.875rem)
   - **States** (2): default, removable (with × icon)

4. **Input Component** (6 total variants)
   - **States** (3): default, error, disabled
   - **Sizes** (2): sm (36px), default (44px)
   - **Types**: text, email, password, number, tel, search
   - **Features**: Optional label, optional helper text, optional error message

5. **Select Component** (8 total variants)
   - **States** (3): default, error, disabled
   - **Sizes** (2): sm, default
   - **Types**: single-select, multi-select
   - **Features**: Searchable, clearable, creatable

6. **Dialog/Modal Component** (4 total variants)
   - **Sizes** (4): sm (400px), default (600px), lg (800px), fullscreen
   - **Features**: Optional header, custom footer, close button, backdrop click handling

7. **Tabs Component** (6 total variants)
   - **Types** (3): default, underline, pills
   - **Sizes** (2): sm, default
   - **Features**: Icons, vertical orientation, disabled tabs

**Total Estimated Variants**: ~50-60 across all base components

**Variant Implementation Strategy:**
- Use CSS custom properties for dynamic variant handling
- Create utility classes for combinations (e.g., `btn-primary-sm`, `card-elevated`)
- Maintain Quasar component functionality with custom styling
- Document all variants in component prop definitions

### Animation Requirements

**Animation System:**
- **Timing**: Consistent easing functions
  - Ease-in-out: `cubic-bezier(0.4, 0, 0.2, 1)` (standard)
  - Ease-out: `cubic-bezier(0, 0, 0.2, 1)` (exiting)
  - Ease-in: `cubic-bezier(0.4, 0, 1, 1)` (entering)

- **Durations** (in milliseconds):
  - Fast: 150ms (button hover, tooltip)
  - Standard: 200ms (modal, dropdown)
  - Slow: 300ms (sidebar, page transitions)
  - Extra Slow: 500ms (complex animations)

**Required Animations:**
1. **Sidebar Transitions**
   - Collapse/Expand: 300ms ease-in-out
   - Overlay fade: 200ms ease-out
   - Content slide: 300ms ease-in-out

2. **Button Interactions**
   - Hover state: 150ms ease-out
   - Active/Pressed: 100ms ease-in-out
   - Focus ring: 200ms ease-out

3. **Modal/Dialog Animations**
   - Backdrop fade: 200ms ease-out
   - Content scale/fade: 200ms ease-out
   - Exit: 150ms ease-in

4. **Page/Route Transitions**
   - Fade: 200ms ease-in-out
   - Slide (mobile): 300ms ease-in-out
   - No animation on reduced motion preference

5. **Loading States**
   - Spinner: 1s linear rotation (infinite)
   - Skeleton: 1.5s ease-in-out pulse
   - Progress bar: 300ms ease-out

6. **Toast Notifications**
   - Slide in: 200ms ease-out
   - Auto-dismiss after 5s
   - Slide out: 150ms ease-in

**Performance Considerations:**
- Use CSS `transform` and `opacity` for 60fps animations
- Avoid animating `width`, `height`, `margin`, `padding`
- Respect `prefers-reduced-motion` media query
- Use `will-change` sparingly and only when needed

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

#### **Spec 000: Authentication System** ✅ **COMPLETED**
- **Status**: **COMPLETED - Authentication UI/UX fully implemented**
- **Implementation Date**: 2025-11-13
- **What Was Implemented**:
  - ✅ **Pixel-perfect auth page design matching prototype exactly**
  - ✅ **Demo mode toggle functionality (as seen in prototype)**
  - ✅ **TweakCN green dark theme with OKLCH colors**
  - ✅ **Geist font typography (15px base, light weights)**
  - ✅ **Tabbed Sign In/Sign Up interface**
  - ✅ **Google OAuth button with custom styling**
  - ✅ **Password strength indicator and form validation**
  - ✅ **Responsive design for mobile devices**
  - ✅ **Router configuration with proper redirects**
- **Files Created/Updated**:
  - `frontend/src/views/AuthView.vue` (new - tabbed authentication)
  - `frontend/src/components/auth/LoginForm.vue` (complete rewrite)
  - `frontend/src/components/auth/RegisterForm.vue` (new)
  - `frontend/src/layouts/AuthLayout.vue` (updated with TweakCN theme)
  - `frontend/src/router/index.ts` (updated routes)
  - `frontend/index.html` (Geist font import)
  - `frontend/src/styles/globals.css` (Geist font global styles)
  - `frontend/src/themes/quasar.variables.scss` (Geist font family)
- **Next Steps**: No further authentication UI work needed - move to next specification

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

## Pre-Implementation: Specification Updates

**⚠️ IMPORTANT**: Before starting Phase 1, update the specification documents as decided.

**⚠️ PIXEL-PERFECT VALIDATION**: All implementation tasks must follow the pixel-perfect requirements:
- **Reference Documents**: 
  - `docs/migration/PIXEL_PERFECT_IMPLEMENTATION_GUIDE.md` - Complete pixel-perfect strategy
  - `docs/migration/PIXEL_PERFECT_VALIDATION_CHECKLIST.md` - Step-by-step validation process
  - `docs/migration/REACT_VUE_COMPONENT_MAPPING.md` - Exact component conversions
  - `docs/testing/VISUAL_REGRESSION_SETUP.md` - Visual testing infrastructure
- **Validation Process**: 
  1. Analyze React component (screenshot, measurements)
  2. Implement Vue component matching exactly
  3. Visual comparison (side-by-side, image diff)
  4. Measurement verification (DevTools)
  5. Visual regression test
  6. Cross-browser verification
- **Acceptance Criteria**: Component is complete ONLY when:
  - Visual screenshot matches React prototype exactly (pixel-perfect)
  - All states (default, hover, active, disabled) match exactly
  - All measurements match exactly (verified with DevTools)
  - All colors match exactly (OKLCH values verified)
  - Visual regression test passes
- **Critical Principle**: The React prototype is the SINGLE SOURCE OF TRUTH. No deviations, no "improvements", no creative interpretations.

### Task 0.1: Component Complexity Matrix & Audit
**Priority**: P0 (Critical - Must do before Phase 1)
**Estimated Time**: 3-4 hours

**Subtasks:**
1. **Categorize All Components**
   - Simple: Basic UI components (Button, Badge, Input) - 4-6 hours each
   - Moderate: Feature components (MemberCard, ServiceCard) - 8-12 hours each
   - Complex: Interactive components (Dashboard, CheckInKiosk) - 16-24 hours each

2. **Prioritize by User Impact**
   - High Impact: Dashboard, Member Management, Attendance (used daily)
   - Medium Impact: Settings, Reports, Events (used weekly)
   - Low Impact: Admin utilities, optional features (used monthly)

3. **Prioritize by Usage Frequency**
   - Daily: Layout components, Navigation, Dashboard, Member List
   - Weekly: Attendance, Reports, Settings
   - Monthly: Admin features, advanced settings

4. **Document Component Dependencies**
   - Identify which components depend on which stores/composables
   - Document component composition patterns
   - Create migration dependency graph

5. **Create Migration Priority Matrix**
   - High Priority: High Impact + High Frequency (migrate first)
   - Medium Priority: High Impact + Medium Frequency OR Medium Impact + High Frequency
   - Low Priority: Medium Impact + Low Frequency OR Low Impact + Any Frequency

**Files to Create:**
- `docs/migration/COMPONENT_COMPLEXITY_MATRIX.md` - Detailed component analysis
- `docs/migration/MIGRATION_PRIORITY_MATRIX.md` - Migration order and dependencies

**Acceptance Criteria:**
- [ ] All components categorized by complexity
- [ ] All components prioritized by impact and frequency
- [ ] Component dependencies documented
- [ ] Migration order established
- [ ] Complexity estimates validated

---

### Task 0.2: Update Spec 004 (UI/UX System)
**Priority**: P0 (Critical - Must do before Phase 1)
**Estimated Time**: 2-3 hours

**Subtasks:**
1. **Review Current Spec 004**
   - Read `.specify/specs/005-ui-ux-system/spec.md`
   - Document current requirements
   - Identify what needs updating

2. **Update with TweakCN Theme Requirements**
   - Add OKLCH color space specification
   - Add Geist font specification
   - Add Tailwind v4 CSS-first configuration
   - Add design tokens (shadows, border radius, letter spacing)
   - Add 3-column layout specification
   - Add mobile bottom navigation specification

3. **Update Color System Section**
   - Replace old color system with OKLCH
   - Add fallback strategy for older browsers
   - Document OKLCH color values
   - Add chart colors specification

4. **Update Typography Section**
   - Replace font specification with Geist
   - Add global light font weights for headings
   - Update base font size to 15px
   - Add letter spacing specification

5. **Update Layout Section**
   - Add 3-column layout specification
   - Add collapsible sidebar specification
   - Add mobile bottom navigation specification
   - Add responsive breakpoints

6. **Update Component Patterns**
   - Add ShadCN-style component patterns
   - Document Quasar adaptation strategy
   - Add component library decision rationale

**Files to Modify:**
- `.specify/specs/005-ui-ux-system/spec.md`

**Acceptance Criteria:**
- [ ] Spec 004 updated with TweakCN theme requirements
- [ ] OKLCH color system documented
- [ ] Geist font documented
- [ ] Layout system documented
- [ ] Component library strategy documented
- [ ] All design decisions reflected in spec

---

### Task 0.2: Update Spec 005 (Dashboard System) - Merge Best of Both
**Priority**: P1 (High - Should do before Phase 3)
**Estimated Time**: 1-2 hours

**Subtasks:**
1. **Review Current Spec 005**
   - Read `.specify/specs/006-dashboard-system/spec.md`
   - Document current functional requirements

2. **Review Prototype Dashboard**
   - Document prototype dashboard features
   - Document prototype dashboard design

3. **Merge Requirements**
   - Keep all functional requirements from spec
   - Add visual design requirements from prototype
   - Document any conflicts and resolutions
   - Create unified dashboard specification

**Files to Modify:**
- `.specify/specs/006-dashboard-system/spec.md`

**Acceptance Criteria:**
- [ ] Spec 005 updated with prototype design requirements
- [ ] All functional requirements preserved
- [ ] Visual design requirements added
- [ ] Conflicts resolved and documented

---

### Task 0.3: Update Additional Specifications
**Priority**: P1 (High - Should do before Phase 1)
**Estimated Time**: 3-4 hours

**⚠️ IMPORTANT**: Based on prototype analysis, 7 additional specifications need updates beyond Spec 004 and 005.

**Subtasks:**

**1. Update Spec 001 (Organization Setup)**
- Add AppHeader component specification
- Document church branding display format (3-line format)
- Add church logo component requirements
- Update organization display patterns from prototype

**2. Update Spec 003 (Attendance System)**
- Add CheckInKiosk component (fullscreen mode) specification
- Document attendance management header design
- Add service card design with green accent
- Add QR code scanner UI requirements
- Update check-in interface to match prototype

**3. Update Spec 006 (Communication System)**
- Update chat interface design
- Document secondary sidebar patterns
- Update message styling to match prototype
- Add notification UI patterns

**4. Update Spec 008 (Admin Settings System)**
- Update settings page design
- Document color palette component patterns
- Add settings navigation structure
- Update form styling for settings

**5. Update Spec 010 (Financial Management System)**
- Update giving dashboard design
- Document donation form styling
- Add campaign manager UI patterns
- Update financial display components

**6. Update Spec 014 (Chat System)**
- If separate from Spec 006, update chat-specific UI patterns
- Document chat sidebar design
- Update message component styling
- Add chat state management patterns

**7. Update Spec 018 (AI Assistant System)**
- Update AI dashboard design
- Document insights display components
- Add churn predictions UI patterns
- Update AI feature styling

**Files to Modify:**
- `.specify/specs/002-organization-setup/spec.md`
- `.specify/specs/004-attendance-system/spec.md`
- `.specify/specs/007-communication-system/spec.md`
- `.specify/specs/009-admin-settings-system/spec.md`
- `.specify/specs/011-financial-management-system/spec.md`
- `.specify/specs/015-chat-system/spec.md` (if exists)
- `.specify/specs/019-ai-assistant-system/spec.md`

**Acceptance Criteria:**
- [ ] All 7 specifications updated with prototype design requirements
- [ ] Visual design requirements added to each spec
- [ ] Component requirements documented
- [ ] UI patterns extracted from prototype
- [ ] Conflicts with existing requirements resolved
- [ ] Each spec marked as updated with version/date

---

## Pre-Migration Documentation Tasks

### Task 0.4: Create Design Tokens Document
**Priority**: P0 (Critical - Must do before Phase 1)
**Estimated Time**: 2-3 hours

**Subtasks:**
1. **Extract Design Tokens from Prototype**
   - Document all OKLCH color values with fallbacks
   - Extract typography scale (font sizes, weights, line heights)
   - Document spacing system (4px base scale)
   - Extract shadow system values
   - Document border radius system
   - Extract animation timings and easing functions

2. **Create Design Tokens Document**
   - Create `docs/design/DESIGN_TOKENS.md`
   - Organize tokens by category
   - Include usage examples
   - Document implementation approach

**Files to Create:**
- `docs/design/DESIGN_TOKENS.md` - Complete design token reference

**Acceptance Criteria:**
- [ ] All design tokens extracted from prototype
- [ ] Document organized by category
- [ ] OKLCH colors with fallbacks documented
- [ ] Typography system documented
- [ ] Spacing system documented
- [ ] Implementation guidance provided

---

### Task 0.5: Create Component Inventory
**Priority**: P0 (Critical - Must do before Phase 1)
**Estimated Time**: 2-3 hours

**Subtasks:**
1. **Inventory All Components**
   - List every component in current codebase
   - Document component props and events
   - Note which stores/composables each uses
   - Mark component complexity (Simple/Moderate/Complex)

2. **Create Component Dependency Map**
   - Document component composition patterns
   - Identify shared utilities
   - Map component migration order

**Files to Create:**
- `docs/migration/COMPONENT_INVENTORY.md` - Complete component listing
- `docs/migration/COMPONENT_DEPENDENCIES.md` - Dependency mapping

**Acceptance Criteria:**
- [ ] All components inventoried
- [ ] Component complexity documented
- [ ] Dependencies mapped
- [ ] Migration order suggested
- [ ] Props and events documented

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

3. **Add Fallbacks for Older Browsers**
   - Create hex/RGB fallback values for all OKLCH colors
   - Use `@supports` queries to provide fallbacks
   - Test in browsers without OKLCH support
   - Ensure graceful degradation
   - **Fallback Strategy:**
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

4. **Set Up Tailwind v4 CSS-First Configuration**
   - Use `@theme inline` directive (Tailwind v4)
   - Map all OKLCH CSS variables to Tailwind utilities
   - Map fallback colors to Tailwind utilities
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

**⚠️ PIXEL-PERFECT VALIDATION**:
- **Reference**: `docs/migration/PIXEL_PERFECT_IMPLEMENTATION_GUIDE.md` - Color fidelity checklist
- **Visual Comparison**: Take screenshots of React prototype and Vue implementation side-by-side
- **Color Matching**: Use browser DevTools to verify exact OKLCH values match prototype
- **Testing**: Run visual regression tests comparing color implementation

**Acceptance Criteria:**
- [ ] ALL old colors removed
- [ ] OKLCH color space implemented (not hex/RGB)
- [ ] Fallback colors (hex/RGB) implemented for older browsers
- [ ] `@supports` queries used for OKLCH detection
- [ ] Primary color is `oklch(0.4365 0.1044 156.7556)` throughout app
- [ ] Background is `oklch(0.1822 0 0)` everywhere (equivalent to `#0A0A0F`)
- [ ] Cards use `oklch(0.2046 0 0)` background (equivalent to `#1A1A20`)
- [ ] All semantic colors use OKLCH format
- [ ] Chart colors implemented (5 OKLCH colors)
- [ ] NO hardcoded old colors remain
- [ ] **Visual screenshot matches React prototype exactly** (pixel-perfect)
- [ ] **Side-by-side comparison shows identical colors**
- [ ] OKLCH colors render correctly in modern browsers
- [ ] Fallback colors render correctly in older browsers
- [ ] Tested in browsers without OKLCH support
- [ ] **Visual regression test passes** (see `docs/testing/VISUAL_REGRESSION_SETUP.md`)

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

2. **Implement Geist Font System (Global Application)**
   - **Import Geist font from Google Fonts:**
     ```css
     @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100;200;300;400;500;600;700;800&display=swap');
     ```
   - Set font family: `'Geist', sans-serif` (NOT Inter, NOT system fonts)
   - Base font size: **15px** (not 14px - prototype uses 15px)
   - **Apply light font weights globally for ALL headings:**
     - H1: `font-weight: 300` (light)
     - H2: `font-weight: 300` (light)
     - H3: `font-weight: 300` (light)
     - H4: `font-weight: 300` (light)
     - H5: `font-weight: 300` (light)
     - H6: `font-weight: 300` (light)
   - Body text: `font-weight: 400` (regular)
   - Letter spacing: `0.025em` (normal), with tight/wide variants
   - Line heights: Tight (1.0-1.2) for headings, Normal (1.5) for body
   - **Global CSS rule:**
     ```css
     h1, h2, h3, h4, h5, h6 {
       font-weight: 300; /* Light weight globally */
     }
     ```

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
- [ ] **ALL headings (H1-H6) use light font weight (300) globally**
- [ ] Body text uses regular weight (400)
- [ ] Letter spacing is `0.025em` (normal)
- [ ] Line heights match prototype exactly
- [ ] Font rendering is optimized (antialiased, etc.)
- [ ] Visual match with prototype typography
- [ ] Global heading styles applied (no component-specific overrides needed)

---

#### Task 1.3: Replace Layout System (Complete Overhaul)
**Priority**: P0 (Critical)
**Estimated Time**: 10-12 hours

**⚠️ CRITICAL**: This is a COMPLETE REPLACEMENT. Remove current layout and replace with prototype's 3-column layout.

**⚠️ PIXEL-PERFECT VALIDATION**:
- **Reference**: 
  - `docs/migration/PIXEL_PERFECT_IMPLEMENTATION_GUIDE.md` - Layout specifications
  - `docs/migration/REACT_VUE_COMPONENT_MAPPING.md` - Exact layout conversion
- **Measurement Requirements**: 
  - Left sidebar: **EXACTLY 280px** (not 275px, not 285px)
  - Right sidebar: **EXACTLY 320px** (not 315px, not 325px)
  - Header: **EXACTLY 64px height** (not 60px, not 68px)
- **Visual Comparison**: Screenshot React prototype layout and Vue implementation, compare pixel-by-pixel
- **Component Mapping**: Use `REACT_VUE_COMPONENT_MAPPING.md` for exact component structure

**Subtasks:**
1. **Remove Current Layout**
   - Remove current layout components
   - Remove current layout styles
   - Document what was removed
   - Backup current layout (for reference)

2. **Implement 3-Column Layout (Complete Replacement)**
   - **Left Sidebar**: 280px fixed width, collapsible
   - **Main Content**: Flexible width, responsive
   - **Right Sidebar** (optional): 320px, collapsible
   - **Mobile**: Bottom navigation bar (always visible)
   - **Breakpoints**: Match prototype exactly
   - **Collapsible Sidebars**: Smooth animations
   - **State Persistence**: Use localStorage for sidebar state

3. **Implement Mobile Bottom Navigation (Always Visible)**
   - **Always show on mobile** (no configuration needed)
   - Fixed position at bottom
   - Icon + label design
   - Active state indicators
   - Smooth transitions
   - Touch-friendly sizing (min 44px height)

4. **Remove Layout Configuration Options**
   - Remove any layout configuration
   - Remove layout switching options
   - Use prototype layout as single source of truth

5. **Create Prototype Header Component** (PIXEL-PERFECT MATCH REQUIRED)
   - **Reference**: `ChMS-by-Make/src/components/layout/AppHeader.tsx` - Copy structure exactly
   - Church branding: Acronym + City (line 1) - **EXACT font size: 2.4em, line-height: 1, font-weight: 300, margin-bottom: 0.25em**
   - Full church name + Campus badge (line 2) - **EXACT divider above (h-px bg-border mb-1.5), gap-2, text-muted-foreground**
   - Address (line 3) - **EXACT text-sm, text-muted-foreground**
   - Logo display (right side) - **EXACT positioning and sizing**
   - Progress badge (optional, right side) - **EXACT styling (variant="secondary", gap-1)**
   - **Visual Validation**: Screenshot React header (`AppHeader.tsx`) and Vue header, compare side-by-side
   - **Measurement**: Use browser DevTools to verify exact pixel measurements match
   - **Component Mapping**: Use `docs/migration/REACT_VUE_COMPONENT_MAPPING.md` for exact conversion

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
- [ ] **3-column layout matches prototype EXACTLY** (280px left, flexible main, 320px right - verified with DevTools)
- [ ] **Sidebars match prototype design and behavior EXACTLY** (pixel-perfect match)
- [ ] **Header matches prototype's 3-line format EXACTLY** (pixel-perfect match, verified with screenshots)
- [ ] **Mobile navigation matches prototype EXACTLY** (always visible, exact styling)
- [ ] Layout is fully responsive
- [ ] All routes work with new layout
- [ ] **Visual regression test passes** (layout screenshot matches React prototype exactly)
- [ ] **Side-by-side comparison shows identical layout** (React vs Vue)

---

### Phase 2: Core Component Library

**⚠️ Component Library Decision**: Based on performance analysis, we will:
1. **Primary Strategy**: Adapt Quasar components to match ShadCN styling (better performance, smaller bundle)
2. **Secondary Strategy**: Create custom ShadCN-style components only where Quasar can't match the design
3. **Bundle Size Monitoring**: Track bundle size throughout implementation (target: < 500KB)

#### Task 2.1: Create Base UI Components
**Priority**: P0 (Critical)
**Estimated Time**: 20-25 hours

**⚠️ Component Library Strategy**: 
- **Primary**: Adapt Quasar components to match ShadCN styling
- **Secondary**: Create custom components only where Quasar can't match
- **Bundle Size**: Monitor bundle size (target: < 500KB initial load)

**Subtasks:**
1. **Evaluate Quasar Component Adaptability**
   - Test Quasar Button → ShadCN Button styling
   - Test Quasar Input → ShadCN Input styling
   - Test Quasar Card → ShadCN Card styling
   - Document which components can be adapted vs need custom
   - Measure bundle size impact of each approach

2. **Adapt Quasar Components (Primary Strategy)**
   - Style Quasar Button to match ShadCN Button
   - Style Quasar Input to match ShadCN Input
   - Style Quasar Card to match ShadCN Card
   - Style Quasar Badge to match ShadCN Badge
   - Style Quasar Select to match ShadCN Select
   - Use Tailwind classes for styling
   - Maintain Quasar functionality

3. **Create Custom Components (Secondary Strategy - Only Where Needed)**
   - Create custom components only if Quasar can't match design
   - Use ShadCN component patterns as reference
   - Ensure custom components are lightweight
   - Monitor bundle size impact

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

**⚠️ PIXEL-PERFECT VALIDATION**:
- **Reference**: 
  - `docs/migration/PIXEL_PERFECT_IMPLEMENTATION_GUIDE.md` - Visual fidelity checklist
  - `docs/migration/REACT_VUE_COMPONENT_MAPPING.md` - Exact component conversions
- **For Each Component**:
  1. Open React component in `ChMS-by-Make/src/components/ui/`
  2. Take screenshot of React component in all states (default, hover, active, disabled)
  3. Implement Vue component matching exactly
  4. Take screenshot of Vue component in same states
  5. Compare side-by-side using image diff tool
  6. Adjust until pixel-perfect match
  7. Run visual regression test (see `docs/testing/VISUAL_REGRESSION_SETUP.md`)
- **Measurement Requirements**: Use browser DevTools to verify exact pixel measurements match prototype
- **Color Matching**: Verify OKLCH values match exactly using DevTools
- **Typography Matching**: Verify font, size, weight, line-height, letter-spacing match exactly

**Acceptance Criteria:**
- [ ] **Visual screenshot matches React prototype exactly** (pixel-perfect for each component)
- [ ] **All states (default, hover, active, disabled) match prototype exactly**
- [ ] **All variants and sizes match prototype exactly**
- [ ] **Side-by-side comparison shows identical appearance**
- [ ] **Visual regression test passes** (see `docs/testing/VISUAL_REGRESSION_SETUP.md`)
- [ ] Components are reusable and well-documented
- [ ] Dark theme styling is consistent
- [ ] Accessibility features are included (ARIA labels, keyboard navigation)
- [ ] **Exact measurements verified** (padding, margins, border-radius, shadows)

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

#### Task 3.1: Dashboard Components (Merge Best of Both Worlds)
**Priority**: P1 (High)
**Estimated Time**: 15-20 hours

**⚠️ Dashboard Strategy**: Merge prototype design with existing spec requirements:
- Use prototype as visual design reference
- Keep all functional requirements from Spec 005
- Combine best features from both

**Charting Library**: Use **ECharts for Vue** (`vue-echarts`)
- Feature-rich, good performance
- Excellent mobile support
- Bundle size: ~150KB gzipped (acceptable)
- Replace all chart placeholders with ECharts components

**Subtasks:**
1. **Install Charting Library**
   - Install `vue-echarts` and `echarts`: `npm install vue-echarts echarts`
   - Configure ECharts with OKLCH colors from design system
   - Create chart wrapper components
   - Test bundle size impact (target: < 500KB total)

2. **Create Dashboard Chart Components**
- Keep all functional requirements from Spec 005
- Combine best features from both

**Subtasks:**
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

#### Task 4.1: Update Router & Navigation (Best Practices)
**Priority**: P1 (High)
**Estimated Time**: 4-6 hours

**⚠️ Routing Strategy**: Use best practices for performance, SEO, and UX:
- Vue Router with nested routes for tab-based navigation
- Route-based code splitting for performance
- Meta tags for SEO
- Proper loading states for UX

**Subtasks:**
1. **Update Route Definitions (Nested Routes)**
   - Match prototype's route structure
   - Add nested routes for tab-based navigation
   - Use Vue Router nested routes pattern
   - Implement route-based code splitting (lazy loading)

2. **Update Navigation Logic**
   - Match prototype's navigation flow
   - Tab-based navigation using nested routes
   - Active route highlighting
   - Smooth transitions

3. **Add Route Guards**
   - Protected routes (authentication)
   - Role-based access control
   - Redirect logic

4. **Add SEO Meta Tags**
   - Route-specific meta tags
   - Open Graph tags
   - Twitter Card tags
   - Dynamic meta updates

5. **Add Loading States**
   - Route transition loading indicators
   - Skeleton screens for async routes
   - Error boundaries for failed routes

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

**⚠️ CRITICAL**: Testing infrastructure must be set up BEFORE any implementation begins. Do not start Phase 1 until Phase 0 is complete.

#### Phase 0: Test Baseline Setup (Before ANY Implementation)
**Priority**: P0 (Critical - Must complete first)
**Estimated Time**: 8-12 hours

**0.1 Visual Regression Baseline**
- Set up Playwright with visual regression testing (Percy/Chromatic)
- Take baseline screenshots of ALL current pages/views
- Document current UI patterns and components
- Create visual regression test suite
- Set up automated visual testing in CI/CD

**0.2 Performance Baseline**
- Install and configure Lighthouse CI
- Measure current bundle size (gzipped and uncompressed)
- Measure performance metrics:
  - First Contentful Paint (FCP)
  - Largest Contentful Paint (LCP)
  - Time to Interactive (TTI)
  - Cumulative Layout Shift (CLS)
  - First Input Delay (FID)
- Document performance budget (current state)
- Set up performance monitoring in CI/CD

**0.3 Accessibility Audit**
- Run axe-core automated accessibility tests
- Manual keyboard navigation testing
- Screen reader testing (NVDA, VoiceOver)
- Color contrast verification
- Document all accessibility issues
- Create accessibility test suite

**0.4 Functional Test Suite**
- Document all current user flows
- Create comprehensive test cases for each feature
- Test offline functionality thoroughly
- Test on target Android devices
- Ensure all tests are passing before migration

**Files to Create:**
- `tests/visual/baseline.spec.ts` - Visual regression tests
- `tests/performance/budget.spec.ts` - Performance budget tests
- `tests/accessibility/accessibility.spec.ts` - Accessibility tests
- `tests/functional/user-flows.spec.ts` - End-to-end user flow tests

#### Phases 1-5: Continuous Testing
**Testing after EACH component replacement:**

**1. Component-Level Testing**
- Unit tests for new component logic
- Visual comparison with prototype
- Accessibility testing (axe-core + manual)
- Performance impact measurement
- Cross-browser testing (Chrome, Firefox, Safari)

**2. Integration Testing**
- Component integration with stores/composables
- Routing functionality with new component
- API integration testing
- Offline functionality verification
- State management consistency

**3. Visual Regression Testing**
- Automated visual tests after EACH phase
- Compare with prototype screenshots
- Document any intentional differences
- Ensure design system consistency

**Phase 1-5 Testing Checklist (after each phase):**
- [ ] All new components have unit tests
- [ ] All components pass visual regression tests
- [ ] No accessibility regressions
- [ ] Bundle size still under budget
- [ ] All user flows still work
- [ ] Offline functionality preserved
- [ ] Performance metrics maintained

#### Phase 6: Release Validation
**Priority**: P1 (High - Must complete before release)
**Estimated Time**: 16-20 hours

**6.1 Cross-Device Testing Matrix**
| Device | OS/Browser | Test Coverage | Priority |
|--------|------------|----------------|----------|
| Pixel 5 | Android 12/Chrome | Full testing | Critical |
| Galaxy A5 | Android 10/Chrome | Full testing | Critical |
| iPhone 12 | iOS 16/Safari | Full testing | High |
| iPad Air | iPadOS 16/Safari | Tablet testing | Medium |
| Desktop | Win10/Chrome | Desktop testing | Medium |

**6.2 Network Condition Testing**
- 3G simulation (1.6 Mbps down, 750 Kbps up, 300ms latency)
- 4G simulation (5 Mbps down, 2 Mbps up, 100ms latency)
- Offline mode testing
- Intermittent connectivity testing

**6.3 Performance Validation**
- Full Lighthouse audit (> 90 score)
- Bundle size verification (< 500KB gzipped)
- Real user monitoring simulation
- Memory usage testing on low-end devices

**6.4 User Acceptance Testing**
- Test with actual target users (if possible)
- Gather feedback on design changes
- Verify task completion rates
- Check mobile usability improvements

**6.5 Security Testing**
- OWASP security checklist
- Input validation testing
- XSS and injection testing
- Authentication flow testing

#### Continuous Testing in CI/CD

**Automated Test Pipeline:**
```yaml
# On every PR
- Unit Tests (Jest/Vitest)
- Component Tests
- Visual Regression Tests
- Accessibility Tests (axe-core)
- Bundle Size Check
- Lighthouse Performance

# On merge to main
- All above tests
- Full E2E Test Suite
- Cross-Browser Testing
- Performance Budget Validation
```

**Test Success Criteria:**
- ✅ All tests passing (100% pass rate)
- ✅ No visual regressions
- ✅ No accessibility violations
- ✅ Bundle size < 500KB gzipped
- ✅ Lighthouse score > 90
- ✅ All user flows working
- ✅ Offline functionality preserved

**Rollback Triggers:**
- Any test failure
- Bundle size exceeds 550KB
- Lighthouse score drops below 85
- Critical accessibility violation
- Performance regression > 10%

**Monitoring Dashboard:**
Track these metrics throughout implementation:
- Test pass rate
- Bundle size trends
- Performance scores
- Accessibility violations count
- Visual regression failures
- User feedback scores

## Bundle Size Strategy & Performance Optimization

### 🎯 Bundle Size Budgets

**Critical Targets:**
- **Initial Load (gzipped)**: < 500KB
- **Initial Load (uncompressed)**: < 1.5MB
- **First Contentful Paint**: < 1.5s on 3G
- **Time to Interactive**: < 3s on 3G
- **JavaScript Heap**: < 50MB on mid-range Android

### 📦 Progressive Loading Strategy

**Priority 1: Critical (Must Load First)**
- Bundle Size Target: < 200KB gzipped
- Components:
  - Layout system (PrototypeLayout, AppHeader, Sidebars)
  - Navigation (MobileBottomNav, router)
  - Core UI (Button, Input, Card)
  - Authentication logic
- Loading: Synchronous, non-lazy

**Priority 2: High-Impact Features**
- Bundle Size Target: < 150KB gzipped
- Components:
  - Dashboard (KPICards, Charts)
  - Member Management (MemberList, MemberCard)
  - Basic Forms (AddMemberForm)
- Loading: Lazy after initial render

**Priority 3: Medium-Impact Features**
- Bundle Size Target: < 100KB gzipped
- Components:
  - Attendance System (CheckInKiosk, ServiceCard)
  - Giving (DonationForm, CampaignManager)
  - Settings (Settings components)
- Loading: Lazy on route access

**Priority 4: Low-Impact Features**
- Bundle Size Target: < 50KB gzipped
- Components:
  - Reports (complex charts)
  - Analytics (dashboards)
  - Admin utilities
- Loading: Lazy on demand

### 🖼️ Asset Optimization Strategy

**Font Optimization:**
- **Geist Font**: Subset to Latin + common characters (~30KB vs 150KB full)
- **Font Loading**: `font-display: swap` for better perceived performance
- **Preload Critical Fonts**: Only if above-the-fold text needs them immediately

**Icon Optimization:**
- **Critical Icons**: Inline SVG for navigation, actions (~5KB)
- **Non-Critical Icons**: SVG sprite loaded on demand (~15KB)
- **Fallback**: Use Quasar icons where suitable (already in bundle)

**Image Optimization:**
- **Format**: WebP with JPEG/PNG fallbacks
- **Compression**: 80% quality for photos, 90% for graphics
- **Loading**: Lazy load all images below fold
- **Responsive**: Serve appropriate sizes per device

**Chart Library Optimization:**
- **ECharts**: Load only when charts are needed (~100KB gzipped)
- **Tree Shaking**: Import only chart types used
- **Dynamic Loading**: `() => import('echarts/lib/chart/line')` pattern

### ⚡ Code Splitting Strategy

**Route-Based Splitting:**
```javascript
// Critical routes - eager loaded
const Dashboard = () => import('./views/Dashboard.vue')
const Members = () => import('./views/Members.vue')

// Medium priority - lazy loaded
const Attendance = () => import('./views/Attendance.vue')
const Giving = () => import('./views/Giving.vue')

// Low priority - lazy loaded
const Reports = () => import('./views/Reports.vue')
const Analytics = () => import('./views/Analytics.vue')
```

**Component-Based Splitting:**
- Heavy components (charts, complex forms) lazy-loaded
- Modal/dialog components loaded on demand
- Large utility functions split into separate chunks

**Third-Party Library Splitting:**
- ECharts: Dynamic import per chart type
- Date libraries: Only import what's needed
- Validation libraries: Tree-shake unused validators

### 📊 Bundle Analysis & Monitoring

**Tools to Use:**
- **Webpack Bundle Analyzer**: `webpack-bundle-analyzer`
- **Lighthouse CI**: Automated performance monitoring
- **Bundlephobia**: Analyze library sizes before adding
- **Chrome DevTools**: Runtime performance analysis

**Monitoring Strategy:**
1. **Pre-Migration**: Establish baseline bundle size
2. **During Development**: Monitor with each major component addition
3. **Before Release**: Full bundle analysis and optimization
4. **Production**: Monitor real-world loading times

**Alert Thresholds:**
- **Warning**: Bundle exceeds 450KB gzipped
- **Critical**: Bundle exceeds 500KB gzipped
- **Action Required**: Any regression > 5% from baseline

### 🚀 Performance Optimization Techniques

**JavaScript Optimization:**
- **Tree Shaking**: Remove unused code
- **Minification**: Terser with aggressive settings
- **Compression**: Brotli + Gzip (Brotli preferred)
- **Code Splitting**: As described above

**CSS Optimization:**
- **PurgeCSS**: Remove unused CSS
- **CSS Modules**: Scoped styles to prevent bloat
- **Critical CSS**: Inline critical styles for first paint
- **Non-Critical CSS**: Load asynchronously

**Caching Strategy:**
- **Static Assets**: 1-year cache with content hash
- **HTML**: No cache or short cache (1 hour)
- **API Responses**: Vary by endpoint, short cache (5 minutes)
- **Service Worker**: Cache-first for static, network-first for API

### 📱 Device-Specific Optimizations

**Low-End Devices (< 2GB RAM):**
- Reduce animation complexity
- Disable non-essential animations
- Simplify chart rendering
- Use lighter-weight components

**Slow Networks (3G/2G):**
- Aggressive lazy loading
- Data compression
- Offline-first strategies
- Reduced quality images

### 🔄 Bundle Size Budget Tracking

**Budget Categories:**
- **Framework (Vue, Quasar)**: ~150KB gzipped
- **UI Components**: ~100KB gzipped
- **Business Logic**: ~100KB gzipped
- **Charts/Visualization**: ~100KB gzipped
- **Utilities (date, validation)**: ~50KB gzipped
- **Total Target**: < 500KB gzipped

**Weekly Bundle Review Checklist:**
- [ ] Bundle size under 500KB gzipped?
- [ ] No unused dependencies?
- [ ] Tree shaking working correctly?
- [ ] Code splitting optimized?
- [ ] Images optimized?
- [ ] No performance regressions?
- [ ] Lighthouse score > 90?

### 📋 Bundle Size Decision Matrix

| Component | Complexity | Usage | Bundle Impact | Priority |
|-----------|------------|-------|---------------|----------|
| Dashboard | High | Daily | High | Critical |
| Charts | Medium | Weekly | High | High |
| Modals | Low | Daily | Medium | Medium |
| Forms | Medium | Daily | Medium | High |
| Settings | Low | Monthly | Low | Low |

### 🎯 Success Metrics

**Bundle Metrics:**
- ✅ Initial bundle < 500KB gzipped
- ✅ Largest chunk < 200KB gzipped
- ✅ Total chunks < 10 for initial load
- ✅ Time to Interactive < 3s on 3G
- ✅ Lighthouse Performance > 90

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

### ✅ Design Questions - ANSWERED

1. **Color System**: ✅ **DECIDED**
   - ✅ Completely replace with OKLCH system
   - ✅ Add fallbacks for older browsers (hex/RGB fallbacks)
   - **Implementation**: Use OKLCH as primary, with `@supports` fallbacks for older browsers

2. **Typography**: ✅ **DECIDED**
   - ✅ Apply light font weights (200-300) globally for headings
   - **Implementation**: Global typography system with light weights for all headings

3. **Layout**: ✅ **DECIDED**
   - ✅ Replace the current layout completely
   - **Implementation**: Complete 3-column layout replacement with collapsible sidebars

4. **Mobile Navigation**: ✅ **DECIDED**
   - ✅ Always show bottom navigation bar on mobile
   - **Implementation**: Persistent mobile bottom nav (no configuration needed)

### ✅ Technical Questions - ANSWERED

1. **Component Library**: ✅ **DECIDED**
   - **Decision**: Use ShadCN-style components if no performance impact, otherwise adapt Quasar components
   - **Analysis Required**: Need to evaluate bundle size impact
   - **Recommendation**: 
     - **Phase 1**: Adapt Quasar components to match ShadCN styling (better performance, smaller bundle)
     - **Phase 2**: Create custom ShadCN-style components only where Quasar can't match the design
   - **Bundle Size Target**: Keep under 500KB initial load
   - **Performance Check**: Test bundle size before/after component library decision

2. **State Management**: ✅ **DECIDED**
   - ✅ Migrate all state to Pinia stores
   - **Implementation**: Convert all React Context to Pinia stores, no hybrid approach

3. **Routing**: ✅ **DECIDED**
   - **Decision**: Use best practices for performance, SEO, and UX
   - **Recommendation**: 
     - Use Vue Router with nested routes for tab-based navigation
     - Implement route-based code splitting for performance
     - Use meta tags for SEO
     - Implement proper loading states for UX
   - **Implementation**: Vue Router nested routes with lazy loading

4. **Charts**: ✅ **DECIDED**
   - ✅ Use a Vue charting library
   - **Recommendation**: 
     - **Option 1**: **ECharts for Vue** (`vue-echarts`) - Most feature-rich, good performance
     - **Option 2**: **Chart.js with vue-chartjs** - Lighter weight, simpler API
     - **Option 3**: **ApexCharts Vue** - Modern, good mobile support
   - **Selected**: **ECharts for Vue** (`vue-echarts`)
   - **Why**: Best balance of features, performance, and mobile support
   - **Bundle Size**: ~150KB gzipped (acceptable for our 500KB target)
   - **Installation**: `npm install vue-echarts echarts`
   - **Configuration**: Use OKLCH colors from design system

### ✅ Specification Questions - ANSWERED

1. **Spec 004 (UI/UX)**: ✅ **DECIDED**
   - ✅ Update the spec document first
   - **Implementation**: Update Spec 004 before starting Phase 1 implementation
   - **Task Added**: See "Pre-Implementation: Specification Updates" section

2. **Spec 005 (Dashboard)**: ✅ **DECIDED**
   - ✅ Merge the best of both worlds
   - **Implementation**: Combine prototype design with existing spec requirements
   - **Approach**: Use prototype as visual reference, keep spec functional requirements

3. **Priority**: ✅ **DECIDED**
   - ✅ Design system foundation (Phase 1) first
   - **Implementation Order**: Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5

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

**Total Estimated Time**: 154-205 hours

**Updated Breakdown** (includes Phase 0 pre-migration tasks):
- **Phase 0**: 14-19 hours (pre-migration setup and documentation)
- **Phase 1**: 12-17 hours (design system foundation)
- **Phase 2**: 20-26 hours (core component library)
- **Phase 3**: 52-68 hours (feature components)
- **Phase 4**: 30-40 hours (integration & polish)
- **Phase 5**: 26-34 hours (testing & validation)

**Phase 0 Breakdown (NEW):**
- Task 0.1 (Component Complexity Matrix): 3-4 hours
- Task 0.2 (Update Spec 004): 2-3 hours
- Task 0.3 (Update Additional Specs): 3-4 hours
- Task 0.4 (Design Tokens Document): 2-3 hours
- Task 0.5 (Component Inventory): 2-3 hours
- Test Baseline Setup (from reorganized testing): 8-12 hours

**With a team of 2-3 developers**: 4-6 weeks

**With a single developer**: 8-10 weeks

**Note**: Timeline includes comprehensive Phase 0 setup which ensures smoother implementation and reduces risks during migration phases.

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

**Document Version**: 1.1
**Last Updated**: 2025-11-13
**Author**: AI Assistant
**Status**: Implementation In Progress - Authentication System Completed

