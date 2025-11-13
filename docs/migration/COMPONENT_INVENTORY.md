# Component Inventory & Migration Mapping

**Created**: 2025-11-13  
**Purpose**: Comprehensive component mapping with dependencies and migration order  
**Status**: Complete

---

## Overview

This document provides a detailed inventory of all components in the Vue+Quasar codebase, mapping them to their prototype equivalents, documenting dependencies, and establishing the migration order.

**Total Components**: 76  
**Migration Priority**: P0 (35), P1 (20), P2 (21)

---

## Component Mapping Strategy

### React → Vue Conversion Patterns

1. **React Components → Vue 3 Components**
   - `useState` → `ref()` or `reactive()`
   - `useEffect` → `watch()` or `onMounted()`
   - Props: `interface Props` → `defineProps<Props>()`
   - Events: `onClick` → `@click`

2. **ShadCN UI → Quasar/Tailwind**
   - Adapt Quasar components to match ShadCN styling
   - Use Tailwind utility classes for styling
   - Create custom components where Quasar can't match

3. **React Context → Pinia Stores**
   - `useContext` → `use*Store()` composable
   - Store structure remains unchanged (functional foundation)

4. **React Router → Vue Router**
   - Route structure remains similar
   - Use Vue Router's Composition API

---

## Component Inventory by Category

### 1. Layout Components

#### DashboardLayout.vue
- **Location**: `layouts/DashboardLayout.vue`
- **Prototype Equivalent**: `AppLayout.tsx`
- **Complexity**: Complex
- **Priority**: P0 (Critical)
- **Dependencies**: None (foundation)
- **Migration Order**: 1
- **Estimated Hours**: 16-24
- **Key Features**:
  - 3-column layout (280px left, flexible main, 320px right)
  - Collapsible sidebars
  - Mobile bottom navigation
  - State persistence (localStorage)

#### AuthLayout.vue
- **Location**: `layouts/AuthLayout.vue`
- **Prototype Equivalent**: Auth layout (simpler)
- **Complexity**: Moderate
- **Priority**: P0 (Critical)
- **Dependencies**: None
- **Migration Order**: 2
- **Estimated Hours**: 8-12

#### QuasarPrimeLayout.vue
- **Location**: `layouts/QuasarPrimeLayout.vue`
- **Prototype Equivalent**: `AppLayout.tsx` (main layout)
- **Complexity**: Complex
- **Priority**: P0 (Critical)
- **Dependencies**: None
- **Migration Order**: 1 (parallel with DashboardLayout)
- **Estimated Hours**: 16-24

#### QuasarPrimeHeader.vue
- **Location**: `components/layout/QuasarPrimeHeader.vue`
- **Prototype Equivalent**: `AppHeader.tsx`
- **Complexity**: Moderate
- **Priority**: P0 (Critical)
- **Dependencies**: Layout system
- **Migration Order**: 3
- **Estimated Hours**: 8-12
- **Key Features**:
  - 3-line header format (acronym, name, address)
  - Logo display
  - Progress badge (optional)

#### QuasarPrimeSidebar.vue
- **Location**: `components/layout/QuasarPrimeSidebar.vue`
- **Prototype Equivalent**: `Sidebar.tsx`
- **Complexity**: Complex
- **Priority**: P0 (Critical)
- **Dependencies**: Layout system
- **Migration Order**: 3
- **Estimated Hours**: 16-24
- **Key Features**:
  - User profile section
  - Navigation items
  - Role-based filtering
  - Mobile slide-out overlay

---

### 2. Core UI Components

#### ModernButton.vue
- **Location**: `components/ui/ModernButton.vue`
- **Prototype Equivalent**: `button.tsx` (ShadCN)
- **Complexity**: Simple
- **Priority**: P0 (Critical)
- **Dependencies**: None
- **Migration Order**: 4
- **Estimated Hours**: 4-6
- **Variants**: default, outline, ghost, destructive, secondary, link
- **Sizes**: sm (32px), default (40px), lg (48px), icon (32px)

#### ModernInput.vue
- **Location**: `components/ui/ModernInput.vue`
- **Prototype Equivalent**: `input.tsx` (ShadCN)
- **Complexity**: Simple
- **Priority**: P0 (Critical)
- **Dependencies**: None
- **Migration Order**: 4
- **Estimated Hours**: 4-6
- **States**: default, error, disabled
- **Sizes**: sm (36px), default (44px)

#### ModernAlert.vue
- **Location**: `components/ui/ModernAlert.vue`
- **Prototype Equivalent**: `alert.tsx` (ShadCN)
- **Complexity**: Simple
- **Priority**: P0 (Critical)
- **Dependencies**: None
- **Migration Order**: 4
- **Estimated Hours**: 4-6

#### ModernSpinner.vue
- **Location**: `components/ui/ModernSpinner.vue`
- **Prototype Equivalent**: Loading spinner component
- **Complexity**: Simple
- **Priority**: P0 (Critical)
- **Dependencies**: None
- **Migration Order**: 4
- **Estimated Hours**: 4-6

#### BaseFormCard.vue
- **Location**: `components/common/BaseFormCard.vue`
- **Prototype Equivalent**: Card component with form styling
- **Complexity**: Simple
- **Priority**: P0 (Critical)
- **Dependencies**: None
- **Migration Order**: 4
- **Estimated Hours**: 4-6
- **Usage**: All forms depend on this

---

### 3. Authentication Components

#### LoginForm.vue
- **Location**: `components/auth/LoginForm.vue`
- **Prototype Equivalent**: Login form component
- **Complexity**: Moderate
- **Priority**: P0 (Critical)
- **Dependencies**: BaseFormCard, ModernInput, ModernButton
- **Migration Order**: 5
- **Estimated Hours**: 8-12
- **Store Dependencies**: `useAuthStore`

---

### 4. Dashboard Components

#### DashboardGrid.vue
- **Location**: `components/dashboard/DashboardGrid.vue`
- **Prototype Equivalent**: Dashboard grid layout
- **Complexity**: Complex
- **Priority**: P0 (Critical)
- **Dependencies**: Layout, Core UI
- **Migration Order**: 6
- **Estimated Hours**: 16-24
- **Store Dependencies**: `useDashboardStore`, `useMembersStore`, `useAttendanceStore`

#### DashboardWidget.vue
- **Location**: `components/dashboard/DashboardWidget.vue`
- **Prototype Equivalent**: Widget component
- **Complexity**: Moderate
- **Priority**: P0 (Critical)
- **Dependencies**: Core UI
- **Migration Order**: 6
- **Estimated Hours**: 8-12

#### AttendanceOverviewCard.vue
- **Location**: `components/dashboard/AttendanceOverviewCard.vue`
- **Prototype Equivalent**: Attendance card widget
- **Complexity**: Moderate
- **Priority**: P0 (Critical)
- **Dependencies**: Core UI, Charts
- **Migration Order**: 6
- **Estimated Hours**: 8-12
- **Store Dependencies**: `useAttendanceStore`

#### MemberStatsCard.vue
- **Location**: `components/dashboard/MemberStatsCard.vue`
- **Prototype Equivalent**: Member stats widget
- **Complexity**: Moderate
- **Priority**: P0 (Critical)
- **Dependencies**: Core UI, Charts
- **Migration Order**: 6
- **Estimated Hours**: 8-12
- **Store Dependencies**: `useMembersStore`

---

### 5. Member Management Components

#### MemberAttributesPanel.vue
- **Location**: `components/members/MemberAttributesPanel.vue`
- **Prototype Equivalent**: Member attributes display
- **Complexity**: Moderate
- **Priority**: P0 (Critical)
- **Dependencies**: Core UI, Layout
- **Migration Order**: 7
- **Estimated Hours**: 8-12
- **Store Dependencies**: `useMembersStore`, `useAttributesStore`

#### MemberBadges.vue
- **Location**: `components/members/MemberBadges.vue`
- **Prototype Equivalent**: Badge display component
- **Complexity**: Moderate
- **Priority**: P0 (Critical)
- **Dependencies**: Core UI
- **Migration Order**: 7
- **Estimated Hours**: 8-12
- **Store Dependencies**: `useMembersStore`, `useBadgesStore`

#### MemberNotes.vue
- **Location**: `components/members/MemberNotes.vue`
- **Prototype Equivalent**: Notes component
- **Complexity**: Moderate
- **Priority**: P0 (Critical)
- **Dependencies**: Core UI
- **Migration Order**: 7
- **Estimated Hours**: 8-12
- **Store Dependencies**: `useMembersStore`, `useNotesStore`

---

### 6. Attendance Components

#### AttendanceDashboard.vue
- **Location**: `components/attendance/AttendanceDashboard.vue`
- **Prototype Equivalent**: Attendance dashboard
- **Complexity**: Complex
- **Priority**: P0 (Critical)
- **Dependencies**: Layout, Core UI, Member components
- **Migration Order**: 8
- **Estimated Hours**: 16-24
- **Store Dependencies**: `useAttendanceStore`, `useMembersStore`, `useServicesStore`

#### FamilyCheckIn.vue
- **Location**: `components/attendance/FamilyCheckIn.vue`
- **Prototype Equivalent**: Family check-in interface
- **Complexity**: Complex
- **Priority**: P0 (Critical)
- **Dependencies**: Core UI, Member components
- **Migration Order**: 8
- **Estimated Hours**: 16-24
- **Store Dependencies**: `useAttendanceStore`, `useFamiliesStore`, `useMembersStore`

#### QRScanner.vue
- **Location**: `components/attendance/QRScanner.vue`
- **Prototype Equivalent**: QR code scanner
- **Complexity**: Complex
- **Priority**: P0 (Critical)
- **Dependencies**: Core UI
- **Migration Order**: 8
- **Estimated Hours**: 16-24
- **Store Dependencies**: `useAttendanceStore`, `useMembersStore`

---

### 7. View Components

#### DashboardView.vue
- **Location**: `views/DashboardView.vue`
- **Prototype Equivalent**: Dashboard page
- **Complexity**: Complex
- **Priority**: P0 (Critical)
- **Dependencies**: Layout, Dashboard components
- **Migration Order**: 9
- **Estimated Hours**: 16-24

#### MemberListView.vue
- **Location**: `views/MemberListView.vue`
- **Prototype Equivalent**: Member list page
- **Complexity**: Complex
- **Priority**: P0 (Critical)
- **Dependencies**: Layout, Member components
- **Migration Order**: 9
- **Estimated Hours**: 16-24

#### AttendanceCheckInView.vue
- **Location**: `views/AttendanceCheckInView.vue`
- **Prototype Equivalent**: Check-in page
- **Complexity**: Complex
- **Priority**: P0 (Critical)
- **Dependencies**: Layout, Attendance components
- **Migration Order**: 9
- **Estimated Hours**: 16-24

---

## Migration Dependency Graph

```
Phase 1: Foundation (No Dependencies)
├── Layout Components (DashboardLayout, AuthLayout, QuasarPrimeLayout)
└── Core UI Components (ModernButton, ModernInput, ModernAlert, etc.)

Phase 2: Feature Components (Depend on Foundation)
├── Authentication (LoginForm) → Depends on: BaseFormCard, Core UI
├── Dashboard Components → Depends on: Layout, Core UI
├── Member Components → Depends on: Layout, Core UI, Dashboard
└── Attendance Components → Depends on: Layout, Core UI, Member components

Phase 3: View Components (Depend on Feature Components)
├── DashboardView → Depends on: Layout, Dashboard components
├── MemberListView → Depends on: Layout, Member components
└── AttendanceCheckInView → Depends on: Layout, Attendance components
```

---

## Store Dependencies

### Pinia Stores (PRESERVE - No Changes)

All components use Pinia stores via `use*Store()` composable pattern. Store structure and logic remain unchanged - only UI/styling changes during migration.

**Stores Used**:
- `useAuthStore` - Authentication state
- `useOrganizationStore` - Organization data
- `useMembersStore` - Member data
- `useAttendanceStore` - Attendance data
- `useDashboardStore` - Dashboard stats
- `useFamiliesStore` - Family relationships
- `useRelationshipsStore` - Relationship management
- `useServicesStore` - Service schedules
- `useAttributesStore` - Member attributes
- `useBadgesStore` - Badge management
- `useNotesStore` - Notes data
- `useWidgetsStore` - Dashboard widgets

---

## Migration Order Summary

### Priority 0 (Critical - Migrate First)

**Order**: 1-9
1. Layout Components (3 components, 40-60 hours)
2. Core UI Components (9 components, 36-54 hours)
3. Authentication Components (1 component, 8-12 hours)
4. Dashboard Components (8 components, 72-108 hours)
5. Member Components (6 components, 48-72 hours)
6. Attendance Components (5 components, 64-96 hours)
7. View Components (3 components, 48-72 hours)

**Total P0**: 35 components, 340-510 hours

### Priority 1 (High - Migrate Second)

**Order**: 10-15
- Dashboard Widgets (4 components)
- Member Management Advanced (6 components)
- Attendance Advanced (1 component)
- Organization (3 components)
- Views (3 components)
- Supporting (3 components)

**Total P1**: 20 components, 160-240 hours

### Priority 2 (Medium/Low - Migrate Last)

**Order**: 16-21
- Family Advanced (2 components)
- Supporting Cards (4 components)
- PWA Components (2 components)
- Low-usage Views (3 components)
- Other Supporting (10 components)

**Total P2**: 21 components, 176-300 hours

---

## Component Conversion Patterns

### React to Vue Conversion Examples

#### Example 1: Button Component

**React (ShadCN)**:
```tsx
import { Button } from '@/components/ui/button'

<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>
```

**Vue (Quasar + Tailwind)**:
```vue
<template>
  <q-btn
    :class="buttonClasses"
    @click="handleClick"
  >
    Click Me
  </q-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
}>()

const buttonClasses = computed(() => {
  return [
    'modern-button',
    `variant-${props.variant || 'primary'}`,
    `size-${props.size || 'default'}`
  ]
})
</script>
```

#### Example 2: Layout Component

**React**:
```tsx
const [sidebarOpen, setSidebarOpen] = useState(true)

useEffect(() => {
  const saved = localStorage.getItem('sidebarOpen')
  if (saved) setSidebarOpen(JSON.parse(saved))
}, [])

useEffect(() => {
  localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen))
}, [sidebarOpen])
```

**Vue**:
```vue
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const sidebarOpen = ref(true)

onMounted(() => {
  const saved = localStorage.getItem('sidebarOpen')
  if (saved) sidebarOpen.value = JSON.parse(saved)
})

watch(sidebarOpen, (newVal) => {
  localStorage.setItem('sidebarOpen', JSON.stringify(newVal))
})
</script>
```

---

## Testing Requirements

### Component-Level Testing
- Unit tests for each component
- Visual regression tests
- Accessibility tests (axe-core)
- Mobile responsiveness tests

### Integration Testing
- Component composition tests
- Store integration tests
- Route integration tests

### E2E Testing
- Complete user flows
- Offline functionality
- Mobile device testing

---

## Acceptance Criteria

### Component Migration Complete When:
- [ ] Component matches prototype design exactly
- [ ] All variants and sizes implemented
- [ ] OKLCH colors applied correctly
- [ ] Geist font applied correctly
- [ ] Spacing system applied correctly
- [ ] Shadows and borders match prototype
- [ ] Animations match prototype
- [ ] Accessibility requirements met
- [ ] Mobile responsive
- [ ] Unit tests passing
- [ ] Visual regression tests passing

---

## References

- **Component Complexity Matrix**: `docs/migration/COMPONENT_COMPLEXITY_MATRIX.md`
- **Design Tokens**: `docs/migration/DESIGN_TOKENS.md`
- **Implementation Plan**: `FIGMA_PROTOTYPE_IMPLEMENTATION_PLAN_2025-11-13.md`
- **Prototype Source**: `ChMS-by-Make/src/components/`

---

**Last Updated**: 2025-11-13  
**Status**: Complete - Ready for Implementation

