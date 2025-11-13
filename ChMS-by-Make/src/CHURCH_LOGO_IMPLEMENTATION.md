# Church Logo Implementation

**Date:** Wednesday, November 12, 2025

## Overview

Implemented church-specific branding system with The OliveBrook Church logo throughout church-facing interfaces. The implementation distinguishes between **platform-level** interfaces (neutral branding) and **church-specific** interfaces (displaying individual church branding).

## Core Principle: Multi-Tenancy

ChurchAfrica ChMS is a **multi-tenant platform**. Each church has its own branding (logo, colours, name). The OliveBrook Church, Abuja is used as the example church in this prototype.

## What Was Implemented

### 1. **ChurchLogo Component** (`/components/organization/ChurchLogo.tsx`)
- Reusable component that displays the current church's logo
- Pulls logo from `OrganizationContext`
- Four size variants: `sm`, `md`, `lg`, `xl`
- Automatic fallback to Church icon if no logo is set
- Uses `ImageWithFallback` component for robust image handling

### 2. **Updated OrganizationContext** (`/contexts/OrganizationContext.tsx`)
- Already had logo field in `OrganizationProfile` interface
- Updated default organization to include The OliveBrook Church logo path:
  ```typescript
  logo: 'figma:asset/9d1163839e7096c205b7e5081c4bdd76fc45aba3.png'
  ```

### 3. **Church-Facing Interfaces Updated**

#### **AppHeader** (`/components/layout/AppHeader.tsx`)
- Replaced Unsplash placeholder image with `<ChurchLogo size="lg" />`
- Logo appears in top-right of admin dashboard
- Displays alongside church name, campus, and address

#### **CheckInKiosk** (`/components/attendance/CheckInKiosk.tsx`)
- Added new header section with church branding
- Shows `<ChurchLogo size="md" />` alongside church name
- Header includes:
  - Church logo + name
  - Service information (name, date, time, location)
  - Fullscreen toggle button
- Creates professional kiosk experience for church entrances

#### **LoginForm** (`/components/auth/LoginForm.tsx`)
- Replaced generic Church icon with `<ChurchLogo size="lg" />`
- Shows church name below logo
- Makes login experience church-specific
- Members see their church's branding when logging in

#### **MemberDashboard** (`/components/member-portal/MemberDashboard.tsx`)
- Added top bar with church branding
- Shows `<ChurchLogo size="sm" />` in header
- Displays church name + "Member Portal" label
- Consistent branding throughout member portal experience

## Architecture

### Component Hierarchy
```
OrganizationProvider (Context)
  └─ ChurchLogo Component
      ├─ Used in AppHeader
      ├─ Used in CheckInKiosk
      ├─ Used in LoginForm
      └─ Used in MemberDashboard
```

### Data Flow
1. Church logo stored in `OrganizationProfile` in `OrganizationContext`
2. `ChurchLogo` component reads from `useOrganization()` hook
3. Multiple components import and use `ChurchLogo` with different sizes

## Church-Specific vs Platform-Level

### Church-Specific (Logo Displayed)
✅ Admin Dashboard Header (`AppHeader`)  
✅ Attendance Check-In Kiosk (`CheckInKiosk`)  
✅ Member Login (`LoginForm`)  
✅ Member Portal Dashboard (`MemberDashboard`)  
✅ Organization Settings (existing `OrganizationManagement`)

### Platform-Level (No Church Logo)
❌ Platform landing pages  
❌ System configuration screens  
❌ Super-admin interfaces  
❌ Multi-church selection screens

## The OliveBrook Church Details

### Church Information
- **Name:** The OliveBrook Church
- **Abbreviation:** TOBC
- **Location:** Abuja, Nigeria
- **Campuses:**
  - Kubwa Campus (HQ) - Ignobis Hotels, Kubwa
  - Wuse 2 Campus - Wuse 2, Abuja

### Logo Asset
- **Path:** `figma:asset/9d1163839e7096c205b7e5081c4bdd76fc45aba3.png`
- **Design:** Pink and purple flowing waves above "THE OLIVEBROOK CHURCH" text
- **Background:** White
- **Style:** Modern, welcoming, vibrant African aesthetic

## Files Modified

1. `/components/organization/ChurchLogo.tsx` - **NEW** - Reusable logo component
2. `/components/organization/index.ts` - Added ChurchLogo export
3. `/components/layout/AppHeader.tsx` - Replaced placeholder with ChurchLogo
4. `/components/attendance/CheckInKiosk.tsx` - Added header with logo and service info
5. `/components/auth/LoginForm.tsx` - Added logo to login card
6. `/components/member-portal/MemberDashboard.tsx` - Added branded top bar
7. `/contexts/OrganizationContext.tsx` - Logo already existed, verified correct path

## Benefits

### For Prototype Demonstration
- Shows professional, branded experience
- Demonstrates multi-tenancy architecture
- Provides clear visual identity

### For Vue Team Migration
- Clear component structure to replicate
- Context/store pattern for organization data
- Documented sizing and usage patterns
- Separates church branding from platform branding

## Vue Migration Notes

Each updated component includes Vue migration notes. The ChurchLogo component maps to:

```vue
<template>
  <div :class="logoClasses">
    <q-img
      v-if="organization.logo"
      :src="organization.logo"
      :alt="`${organization.name} Logo`"
      fit="contain"
    />
    <div v-else-if="showFallback" class="fallback-logo">
      <q-icon name="church" color="primary" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrganizationStore } from '@/stores/organization';

const organizationStore = useOrganizationStore();
const organization = computed(() => organizationStore.currentOrganization);
</script>
```

## Future Enhancements

### Potential Additions
- **Event pages** - Show church logo on event registration/details
- **Donation receipts** - Include church logo on giving statements
- **Email templates** - Church logo in transactional emails
- **QR codes** - Embed church logo in service QR codes
- **Reports** - Church logo in PDF report headers

### Logo Management
- Upload interface in Organization Settings
- Logo preview in OrganizationManagement
- Multiple logo variants (light/dark theme)
- Logo size validation and optimization

## Testing Checklist

- [x] ChurchLogo component renders with correct logo
- [x] ChurchLogo falls back to icon when logo is missing
- [x] AppHeader displays logo at correct size (lg)
- [x] CheckInKiosk header shows logo with service info
- [x] LoginForm shows logo with church name
- [x] MemberDashboard top bar has logo
- [x] All imports work correctly
- [x] No TypeScript errors
- [x] Logo displays on white background correctly

## Notes

- Logo is stored as `figma:asset` import path
- All church-facing interfaces now have consistent branding
- Platform remains neutral for multi-church support
- Component is fully documented with Vue migration notes
