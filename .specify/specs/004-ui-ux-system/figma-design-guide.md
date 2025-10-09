# ChurchAfrica ChMS - Figma Design Guide
**Comprehensive UI/UX System Design Specifications for AI-Assisted Figma Implementation**

## 🎯 Design System Overview

This guide provides **comprehensive specifications** for designing the ChurchAfrica ChMS UI/UX system in Figma using AI design tools (Figma Make, Moonchild.ai). The design system follows **Material Design 3** principles with **Quasar Framework components** and **Africa-first mobile optimization** to create a superior alternative to RockRMS.

### Key Design Principles
- **Mobile-First**: Designed for African mobile usage patterns (375px primary breakpoint)
- **Offline-First**: Clear visual feedback for connection states with status indicators
- **Accessibility-First**: WCAG AA compliance with enhanced contrast ratios (4.5:1 minimum)
- **Performance-First**: Optimized for 3G networks and mid-range Android devices
- **Touch-Optimized**: 48px minimum touch targets, thumb-friendly navigation zones
- **Quasar-Native**: All components must map directly to Quasar Framework components

### AI Design Tool Integration
- **Primary Tools**: Figma Make, Moochild.ai for initial design generation
- **Component Library**: Based on Quasar Framework Material Design 3 components
- **Design Tokens**: Consistent with Quasar's theming system
- **Responsive System**: Quasar's built-in breakpoint system (xs, sm, md, lg, xl)

---

## 🏗️ Universal Header & Footer Specifications

### 📋 Header System (Universal Across All Pages)

#### **Header Structure (64px height)**
**Quasar Component**: `q-header` with `q-toolbar`

**Universal Elements (Always Present)**:
1. **Logo/Brand** (Left - 180px width)
   - ChurchAfrica logo + "ChMS" text
   - Clickable → Dashboard
   - Component: `q-btn` flat with `q-img` and text

2. **Breadcrumb Navigation** (Center-left)
   - Shows current page hierarchy
   - Component: `q-breadcrumbs` with `q-breadcrumbs-el`
   - Format: "Dashboard > Members > John Doe"

3. **Global Search** (Center - 300px width)
   - Universal search across members, events, etc.
   - Component: `q-input` with search icon
   - Placeholder: "Search members, events..."
   - Only visible on desktop/tablet (hidden on mobile)

4. **Action Buttons** (Right side)
   - **Notifications**: `q-btn` with `q-badge` for count
   - **Theme Switcher**: `q-btn` with sun/moon icon
   - **User Menu**: `q-btn` with avatar dropdown

**Contextual Elements (Page-Specific)**:
- **Page Title**: H1 text next to breadcrumbs
- **Page Actions**: Primary action buttons (Add Member, Export, etc.)
- **Quick Filters**: `q-tabs` for page-specific filtering

#### **Mobile Header Adaptations**:
- Logo becomes icon-only (48px)
- Search hidden (accessible via search icon)
- Breadcrumbs become page title only
- User menu becomes hamburger menu

### 📋 Footer System (Universal Across All Pages)

#### **Desktop Footer (48px height)**
**Quasar Component**: `q-footer` with `q-toolbar`

**Elements**:
- **Left**: Copyright © 2024 ChurchAfrica
- **Center**: Version info (e.g., "v1.2.0")
- **Right**: Support | Privacy | Terms links

#### **Mobile Footer (80px height)**
**Quasar Component**: `q-footer` with bottom navigation

**Bottom Navigation Bar** (5 primary actions):
1. **Dashboard**: `q-btn` with home icon → `/dashboard`
2. **Members**: `q-btn` with people icon → `/members`
3. **Attendance**: `q-btn` with check icon → `/attendance`
4. **Events**: `q-btn` with calendar icon → `/events`
5. **More**: `q-btn` with menu icon (opens drawer with Settings, Reports, etc.)

**Floating Action Button (FAB)** - Contextual per page:
- **Component**: `q-page-sticky` with `q-btn` fab (circular button)
- **Position**: Bottom-right, 16px from edges
- **Page-Specific Actions**:
  - **Dashboard**: "Quick Check-in" (most common action)
  - **Members Page**: "Add New Member"
  - **Attendance Page**: "Start Service" or "Manual Check-in"
  - **Events Page**: "Create Event"
  - **Reports Page**: "Generate Report"

---

## 📄 Complete Page Inventory & Specifications

### **Complete Page List (Specs 000-010)**

#### **Authentication Flow (Spec 000)**
- **Landing Page** (`/`) - First impression and conversion
- **Login Page** (`/auth/login`) - Secure authentication entry
- **Registration Page** (`/auth/register`) - New user account creation
- **Forgot Password** (`/auth/forgot-password`) - Password reset initiation
- **Reset Password** (`/auth/reset-password`) - New password creation
- **Logout Confirmation** (Modal) - Confirm logout action

#### **Organization Setup (Spec 001)**
- **Organization Setup Wizard** (`/setup`) - Multi-step church configuration
- **Church Profile Setup** (`/setup/profile`) - Basic church information
- **Service Schedule Setup** (`/setup/services`) - Service times and types
- **Settings Configuration** (`/setup/settings`) - Initial preferences

#### **Member Management (Spec 002)**
- **Members Directory** (`/members`) - Member list and search
- **Member Profile** (`/members/:id`) - Individual member details
- **Add Member** (`/members/add`) - New member registration
- **Member Import** (`/members/import`) - Bulk member import
- **Family Management** (`/families`) - Family relationships

#### **Attendance System (Spec 003)**
- **Attendance Dashboard** (`/attendance`) - Attendance overview
- **QR Check-in** (`/attendance/checkin`) - QR code scanning
- **Manual Check-in** (`/attendance/manual`) - Manual attendance entry
- **Attendance History** (`/attendance/history`) - Historical records
- **Attendance Reports** (`/attendance/reports`) - Analytics and insights

#### **Dashboard System (Spec 005)**
- **Main Dashboard** (`/dashboard`) - Central hub with widgets
- **Dashboard Widgets** - Customizable dashboard components
- **Quick Actions** - Common task shortcuts

#### **Communication System (Spec 006)**
- **Messages Center** (`/messages`) - Internal messaging
- **Email Templates** (`/messages/templates`) - Email management
- **SMS Center** (`/sms`) - Text messaging
- **Announcements** (`/announcements`) - Church announcements

#### **Integration System (Spec 007)**
- **API Management** (`/integrations`) - Third-party integrations
- **Webhook Configuration** (`/integrations/webhooks`) - Event triggers
- **Data Sync** (`/integrations/sync`) - Data synchronization

#### **Admin Settings (Spec 008)**
- **System Settings** (`/admin/settings`) - Global configuration
- **User Management** (`/admin/users`) - User accounts and roles
- **Security Settings** (`/admin/security`) - Security policies
- **Backup & Restore** (`/admin/backup`) - Data management

#### **Workflow Engine (Spec 009)**
- **Workflow Builder** (`/workflows`) - Process automation
- **Workflow Templates** (`/workflows/templates`) - Pre-built workflows
- **Process Monitoring** (`/workflows/monitor`) - Workflow analytics

#### **Financial Management (Spec 010)**
- **Financial Dashboard** (`/finance`) - Financial overview
- **Tithe Tracking** (`/finance/tithes`) - Tithe management
- **Offering Records** (`/finance/offerings`) - Offering tracking
- **Financial Reports** (`/finance/reports`) - Financial analytics

#### **Error Pages**
- **404 Not Found** (`/404`) - Page not found
- **500 Server Error** (`/500`) - Server error
- **Offline Page** (`/offline`) - No internet connection

---

## 📄 Complete Page Specifications

### 🔐 Authentication Pages

#### **Landing Page** (`/`)
**Purpose**: First impression and entry point for ChurchAfrica ChMS
**Layout**: Centered content with hero section
**Quasar Components**: `q-page`, `q-card`, `q-btn`, `q-img`

**Content Structure**:
1. **Hero Section** (Full viewport height)
   - **Background**: Garnet Night gradient theme
   - **Logo**: Large ChurchAfrica logo (120px height)
   - **Headline**: "Church Management Made Simple"
   - **Subheadline**: "Africa's first offline-capable church management system"
   - **CTA Button**: "Get Started" → `/auth/login`
   - **Secondary CTA**: "Learn More" → scroll to features

2. **Features Section** (3-column grid desktop, 1-column mobile)
   - **Offline-First**: Icon + "Works without internet"
   - **Mobile-Optimized**: Icon + "Built for African mobile networks"
   - **Simple & Powerful**: Icon + "Easy to use, powerful features"

3. **Footer**: Minimal with contact info and social links

#### **Login Page** (`/auth/login`)
**Purpose**: Secure authentication entry point
**Layout**: Centered card with glass morphism effect
**Quasar Components**: `q-page`, `q-card`, `q-form`, `q-input`, `q-btn`

**Content Structure**:
1. **Background**: Garnet Night gradient with glass morphism overlay
2. **Login Card** (400px width desktop, full-width mobile with 16px margins)
   - **Header**:
     - ChurchAfrica logo (64px height)
     - "Welcome Back" title (H2)
     - "Sign in to your church account" subtitle

   - **Form Fields**:
     - **Email Input**: `q-input` with email validation
       - Label: "Email Address"
       - Placeholder: "pastor@yourchurch.org"
       - Icon: email icon
     - **Password Input**: `q-input` type="password"
       - Label: "Password"
       - Placeholder: "Enter your password"
       - Icon: lock icon
       - Toggle visibility button

   - **Actions**:
     - **Remember Me**: `q-checkbox` "Keep me signed in"
     - **Forgot Password**: Link to `/auth/forgot-password`
     - **Login Button**: Primary `q-btn` full-width "Sign In"
     - **Google OAuth**: Secondary `q-btn` with Google icon "Continue with Google"

   - **Footer**:
     - "Don't have an account?" + Link to `/auth/register`
     - Offline status indicator if applicable

#### **Registration Page** (`/auth/register`)
**Purpose**: New user account creation
**Layout**: Centered card, similar to login but taller
**Quasar Components**: `q-page`, `q-card`, `q-form`, `q-input`, `q-btn`, `q-select`

**Content Structure**:
1. **Background**: Same Garnet Night gradient
2. **Registration Card** (450px width desktop)
   - **Header**:
     - ChurchAfrica logo (64px height)
     - "Create Account" title (H2)
     - "Set up your church management system" subtitle

   - **Form Fields** (2-column on desktop, 1-column mobile):
     - **Church Name**: `q-input` required
     - **Your Name**: `q-input` required
     - **Email**: `q-input` with email validation
     - **Phone**: `q-input` with phone formatting
     - **Password**: `q-input` with strength indicator
     - **Confirm Password**: `q-input` with match validation
     - **Church Size**: `q-select` with options (1-50, 51-200, 201-500, 500+)

   - **Actions**:
     - **Terms Checkbox**: `q-checkbox` "I agree to Terms & Privacy Policy"
     - **Register Button**: Primary `q-btn` "Create Account"
     - **Google OAuth**: Secondary `q-btn` "Sign up with Google"

   - **Footer**:
     - "Already have an account?" + Link to `/auth/login`

#### **Forgot Password Page** (`/auth/forgot-password`)
**Purpose**: Password reset initiation
**Layout**: Centered card, minimal design
**Quasar Components**: `q-page`, `q-card`, `q-form`, `q-input`, `q-btn`

**Content Structure**:
1. **Background**: Same Garnet Night gradient
2. **Reset Card** (350px width)
   - **Header**:
     - Back arrow to login
     - "Reset Password" title (H2)
     - "Enter your email to receive reset instructions" subtitle

   - **Form**:
     - **Email Input**: `q-input` with validation
     - **Send Reset Button**: Primary `q-btn` "Send Reset Link"

   - **Footer**: Link back to login

#### **Password Reset Page** (`/auth/reset-password`)
**Purpose**: New password creation with token
**Layout**: Centered card
**Quasar Components**: `q-page`, `q-card`, `q-form`, `q-input`, `q-btn`

**Content Structure**:
1. **Background**: Same Garnet Night gradient
2. **Reset Card** (400px width)
   - **Header**:
     - "Set New Password" title (H2)
     - "Choose a strong password for your account" subtitle

   - **Form**:
     - **New Password**: `q-input` with strength indicator
     - **Confirm Password**: `q-input` with match validation
     - **Update Password Button**: Primary `q-btn` "Update Password"

   - **Success State**: Redirect to login with success message

### 🏢 Organization Setup Pages

#### **Organization Setup Wizard** (`/setup`)
**Purpose**: Multi-step church configuration process
**Layout**: Full-screen wizard with progress indicator
**Quasar Components**: `q-page`, `q-stepper`, `q-card`, `q-form`, `q-input`, `q-btn`

**Content Structure**:
1. **Progress Stepper** (Top of screen)
   - Step 1: Church Profile
   - Step 2: Service Schedule  
   - Step 3: Settings
   - Step 4: Complete

2. **Step 1: Church Profile**
   - **Church Name**: `q-input` required
   - **Church Address**: `q-input` with address autocomplete
   - **Phone Number**: `q-input` with phone formatting
   - **Email Address**: `q-input` with email validation
   - **Website**: `q-input` with URL validation
   - **Church Size**: `q-select` (1-50, 51-200, 201-500, 500+)
   - **Denomination**: `q-select` with common denominations

3. **Step 2: Service Schedule**
   - **Service Types**: `q-checkbox` list (Sunday Morning, Evening, Midweek, etc.)
   - **Service Times**: `q-time` picker for each service
   - **Service Days**: `q-checkbox` for days of week
   - **Special Services**: `q-input` for holidays and events

4. **Step 3: Settings**
   - **Timezone**: `q-select` with timezone list
   - **Language**: `q-select` (English, French, Portuguese, etc.)
   - **Currency**: `q-select` for local currency
   - **Data Preferences**: `q-toggle` for analytics and backups

5. **Step 4: Complete**
   - **Success Message**: "Your church is ready!"
   - **Next Steps**: Link to dashboard
   - **Get Help**: Support contact information

**AI Design Prompt**:
> "Create a multi-step organization setup wizard using Material Design 3 with q-stepper progress indicator, q-card forms for each step, q-input fields with validation, and q-btn navigation. Include church profile form, service schedule configuration, and settings preferences. Use Garnet Night gradient background with glassmorphism cards."

### 👥 Member Management Pages

#### **Members Directory** (`/members`)
**Purpose**: Member list, search, and management
**Layout**: Sidebar + main content with search and member list
**Quasar Components**: `q-page`, `q-table`, `q-input`, `q-btn`, `q-dialog`, `q-card`

**Content Structure**:
1. **Page Header Actions**:
   - **Search Bar**: `q-input` with search icon "Search members..."
   - **Filter Dropdown**: `q-select` (All, Adults, Children, Visitors, New)
   - **Add Member Button**: Primary `q-btn` with plus icon
   - **Import Members**: Secondary `q-btn` with upload icon
   - **Export Members**: Secondary `q-btn` with download icon

2. **Member Table** (Desktop):
   - **Columns**: Photo, Name, Phone, Email, Family, Status, Actions
   - **Sortable**: All columns sortable with `q-table`
   - **Row Actions**: View, Edit, Delete with `q-btn` icons
   - **Pagination**: Bottom pagination with `q-pagination`

3. **Member Cards** (Mobile):
   - **Card Layout**: Photo, name, contact info, status badge
   - **Swipe Actions**: Left swipe for edit, right swipe for delete
   - **Infinite Scroll**: Load more members on scroll

4. **Member Detail Modal**:
   - **Tabs**: Personal Info, Family, Notes, Attendance History
   - **Edit Mode**: Form with validation
   - **Actions**: Save, Cancel, Delete member

**AI Design Prompt**:
> "Design a member management interface using Material Design 3 with q-table for desktop, q-card layout for mobile, q-input search with filters, q-btn actions for add/edit/delete, and q-dialog for member details. Include member photos, contact information, family relationships, and attendance history. Use responsive design with mobile-first approach."

#### **Add Member Page** (`/members/add`)
**Purpose**: New member registration form
**Layout**: Centered form with validation
**Quasar Components**: `q-page`, `q-card`, `q-form`, `q-input`, `q-btn`, `q-select`

**Content Structure**:
1. **Form Header**:
   - "Add New Member" title (H2)
   - "Register a new church member" subtitle

2. **Personal Information**:
   - **First Name**: `q-input` required
   - **Last Name**: `q-input` required
   - **Email**: `q-input` with email validation
   - **Phone**: `q-input` with phone formatting
   - **Date of Birth**: `q-date` picker
   - **Gender**: `q-radio` (Male, Female, Other)
   - **Address**: `q-input` with address autocomplete

3. **Church Information**:
   - **Membership Date**: `q-date` picker
   - **Member Status**: `q-select` (Active, Inactive, Visitor)
   - **Family**: `q-select` with existing families
   - **Ministry**: `q-checkbox` list of ministries
   - **Notes**: `q-input` textarea for additional notes

4. **Form Actions**:
   - **Save Member**: Primary `q-btn` "Add Member"
   - **Save & Add Another**: Secondary `q-btn` "Save & Add Another"
   - **Cancel**: Tertiary `q-btn` "Cancel"

**AI Design Prompt**:
> "Create a member registration form using Material Design 3 with q-card container, q-form with validation, q-input fields for personal information, q-select for church details, q-date picker for dates, and q-btn actions. Include photo upload, family selection, ministry checkboxes, and form validation with error states."

### 📊 Dashboard System Pages

#### **Main Dashboard** (`/dashboard`)
**Purpose**: Central hub for church management overview
**Layout**: Sidebar + main content with widget grid
**Quasar Components**: `q-page`, `q-drawer`, `q-card`, `q-list`, `q-item`, `q-chart`

**Dashboard Widgets (Exact Content)**:

1. **Welcome Card** (Full width):
   - **Content**: "Good morning, Pastor [Name]"
   - **Date**: Today's date with weather widget
   - **Quick Action**: "Start Sunday Service" button
   - **Component**: `q-card` with `q-btn` action

2. **Key Metrics Row** (4 cards desktop, 2 mobile):
   - **Total Members**: 1,247 (+12% this month) with trend chart
   - **Weekly Attendance**: 89% (trending up) with mini chart
   - **New Visitors**: 3 (John, Mary, David) with photos
   - **Upcoming Events**: 2 (Sunday Service, Bible Study) with times

3. **Recent Activity Timeline** (2/3 width):
   - **Timeline Items**:
     - "Sarah Johnson joined" (2 hours ago)
     - "Morning service recorded" (4 hours ago)  
     - "New event created" (1 day ago)
     - "Member profile updated" (2 days ago)
   - **View All**: Link to full activity log

4. **Quick Actions Card** (1/3 width):
   - **Add New Member**: `q-btn` with people icon
   - **Record Attendance**: `q-btn` with check icon
   - **Create Event**: `q-btn` with calendar icon
   - **Generate Report**: `q-btn` with chart icon

5. **Attendance Chart Card** (Full width):
   - **Chart**: Weekly attendance trends (last 12 weeks)
   - **Interactive**: Hover details with `q-chart`
   - **Controls**: Time period selector

**AI Design Prompt**:
> "Design a church management dashboard using Material Design 3 with q-card widgets in responsive grid, q-chart for attendance trends, q-list for recent activity, q-btn quick actions, and welcome card with weather. Include metrics cards with numbers, trends, and mini charts. Use mobile-first responsive design with sidebar navigation."

### 📱 Attendance System Pages

#### **Attendance Dashboard** (`/attendance`)
**Purpose**: Attendance tracking and QR check-in
**Layout**: Split view - QR scanner + attendance list
**Quasar Components**: `q-page`, `q-card`, `q-list`, `q-btn`, `q-scanner`, `q-camera`

**Content Structure**:
1. **QR Check-in Section** (Left side desktop, top mobile):
   - **Service Selection**: `q-select` for service type
   - **Date Picker**: `q-date` for service date
   - **QR Scanner**: `q-camera` with scanning overlay
   - **Manual Search**: `q-input` with member search
   - **Start Check-in**: `q-btn` to begin scanning

2. **Attendance List** (Right side desktop, bottom mobile):
   - **Checked-in Members**: Real-time list with photos
   - **Member Names**: With check-in timestamps
   - **Total Count**: "47 members checked in"
   - **Quick Actions**: "Mark All Present", "Export", "End Service"

**AI Design Prompt**:
> "Create an attendance tracking interface using Material Design 3 with q-camera for QR scanning, q-list for checked-in members, q-card for service selection, q-btn for actions, and real-time attendance counter. Include manual search fallback and export functionality. Use mobile-first design with touch-optimized controls."

### 💬 Communication System Pages

#### **Messages Center** (`/messages`)
**Purpose**: Internal messaging and communication
**Layout**: Chat interface with message list
**Quasar Components**: `q-page`, `q-list`, `q-item`, `q-input`, `q-btn`, `q-avatar`

**Content Structure**:
1. **Message List** (Left sidebar):
   - **Conversations**: `q-list` with `q-item` for each conversation
   - **Unread Badges**: `q-badge` for unread count
   - **Search Messages**: `q-input` with search icon

2. **Chat Interface** (Main area):
   - **Message Thread**: `q-list` with message bubbles
   - **Message Input**: `q-input` with send button
   - **Attachment**: `q-btn` for file uploads
   - **Emoji Picker**: `q-btn` for emoji selection

**AI Design Prompt**:
> "Design a messaging interface using Material Design 3 with q-list for conversations, q-item for messages, q-input for typing, q-btn for actions, and q-avatar for user photos. Include unread badges, message bubbles, and attachment support. Use mobile-first chat interface design."

### ⚙️ Admin Settings Pages

#### **System Settings** (`/admin/settings`)
**Purpose**: Global system configuration
**Layout**: Settings categories with form controls
**Quasar Components**: `q-page`, `q-card`, `q-form`, `q-input`, `q-toggle`, `q-select`

**Content Structure**:
1. **Settings Categories** (Sidebar navigation):
   - **General**: Basic system settings
   - **Security**: Password policies, 2FA
   - **Notifications**: Email and SMS settings
   - **Integrations**: Third-party connections
   - **Backup**: Data management

2. **Settings Content** (Main area):
   - **Form Controls**: `q-input`, `q-toggle`, `q-select`
   - **Validation**: Real-time form validation
   - **Save Actions**: `q-btn` for save/cancel
   - **Preview**: Live preview of changes

**AI Design Prompt**:
> "Create an admin settings interface using Material Design 3 with q-card for settings sections, q-form with q-input and q-toggle controls, q-select for dropdowns, and q-btn for save actions. Include sidebar navigation for settings categories and real-time preview of changes."

### 🚨 Error Pages

#### **404 Not Found** (`/404`)
**Purpose**: Handle invalid routes gracefully
**Layout**: Centered content with illustration
**Quasar Components**: `q-page`, `q-card`, `q-btn`, `q-img`

**Content Structure**:
1. **Illustration**: Friendly 404 graphic (SVG)
2. **Headline**: "Page Not Found" (H1)
3. **Message**: "The page you're looking for doesn't exist"
4. **Actions**:
   - **Go to Dashboard**: Primary `q-btn` "Go to Dashboard"
   - **Go Back**: Secondary `q-btn` "Go Back"
5. **Search**: "Or search for what you need" with `q-input`

**AI Design Prompt**:
> "Design a 404 error page using Material Design 3 with q-card container, q-img for illustration, q-btn for navigation actions, and q-input for search. Include friendly messaging and helpful navigation options. Use centered layout with clear visual hierarchy."

#### **Offline Page** (`/offline`)
**Purpose**: No internet connection handling
**Layout**: Centered content with offline indicators
**Quasar Components**: `q-page`, `q-card`, `q-btn`, `q-icon`

**Content Structure**:
1. **Offline Icon**: `q-icon` with wifi-off icon
2. **Headline**: "You're Offline" (H1)
3. **Message**: "Check your internet connection and try again"
4. **Actions**:
   - **Retry**: Primary `q-btn` "Try Again"
   - **Go Offline**: Secondary `q-btn` "Continue Offline"
5. **Status**: "Last synced: 2 hours ago"

**AI Design Prompt**:
> "Create an offline page using Material Design 3 with q-card container, q-icon for offline status, q-btn for retry actions, and clear messaging about connection status. Include last sync timestamp and options to continue offline or retry connection."

---

## 📱 Layout Specifications

### 1. Main Application Layouts

### 🏠 Dashboard & Main Application Pages

#### **Dashboard Page** (`/dashboard`)
**Purpose**: Central hub for church management overview
**Layout**: Sidebar + main content area with widget grid
**Quasar Components**: `q-page`, `q-drawer`, `q-card`, `q-list`, `q-item`

**Sidebar Content** (280px width desktop, drawer on mobile):
1. **Navigation Menu**:
   - **Dashboard**: `q-item` with home icon (active state)
   - **Members**: `q-item` with people icon + member count badge
   - **Attendance**: `q-item` with check icon
   - **Events**: `q-item` with calendar icon
   - **Reports**: `q-item` with chart icon
   - **Settings**: `q-item` with gear icon (bottom)

2. **Quick Stats** (Mobile hidden):
   - Total Members: Number with trend arrow
   - This Week's Attendance: Percentage
   - Upcoming Events: Count

**Main Content Area** (Dashboard Widgets):
1. **Welcome Card** (Full width)
   - "Good morning, Pastor [Name]"
   - Today's date and weather
   - Quick action: "Start Sunday Service"

2. **Key Metrics Row** (4 cards desktop, 2 mobile):
   - **Total Members**: Number + growth percentage
   - **Weekly Attendance**: Percentage + trend chart
   - **New Visitors**: Count + names list
   - **Upcoming Events**: Count + next event details

3. **Recent Activity Card** (2/3 width):
   - Timeline of recent member additions, attendance records
   - "View All Activity" link

4. **Quick Actions Card** (1/3 width):
   - "Add New Member" button
   - "Record Attendance" button
   - "Create Event" button
   - "Generate Report" button

5. **Attendance Chart Card** (Full width):
   - Weekly attendance trends (last 12 weeks)
   - Interactive chart with hover details

#### **Members Page** (`/members`)
**Purpose**: Member management and directory
**Layout**: Sidebar + main content with search and member list
**Quasar Components**: `q-page`, `q-table`, `q-input`, `q-btn`, `q-dialog`

**Page Header Actions**:
- **Search Bar**: `q-input` with search icon "Search members..."
- **Filter Dropdown**: `q-select` (All, Adults, Children, Visitors)
- **Add Member Button**: Primary `q-btn` with plus icon
- **Export Button**: Secondary `q-btn` with download icon

**Main Content**:
1. **Member Table** (Desktop):
   - Columns: Photo, Name, Phone, Email, Family, Status, Actions
   - Sortable columns with `q-table` component
   - Row actions: View, Edit, Delete
   - Pagination at bottom

2. **Member Cards** (Mobile):
   - Card layout with photo, name, contact info
   - Swipe actions for quick edit/delete
   - Infinite scroll loading

3. **Member Detail Modal**:
   - Full member profile with tabs
   - Tabs: Personal Info, Family, Notes, Attendance History
   - Edit mode with form validation

#### **Attendance Page** (`/attendance`)
**Purpose**: Service attendance tracking and QR check-in
**Layout**: Split view - QR scanner + attendance list
**Quasar Components**: `q-page`, `q-card`, `q-list`, `q-btn`, `q-scanner`

**QR Check-in Section** (Left side desktop, top mobile):
1. **Service Selection**:
   - `q-select` for service type (Sunday Morning, Evening, etc.)
   - Date picker for service date
   - "Start Check-in" button

2. **QR Scanner**:
   - Camera view with scanning overlay
   - Member confirmation popup on scan
   - Manual search fallback

**Attendance List** (Right side desktop, bottom mobile):
1. **Checked-in Members**:
   - Real-time list of attendees
   - Member photos and names
   - Check-in timestamps
   - Total count at top

2. **Quick Actions**:
   - "Mark All Present" button
   - "Export Attendance" button
   - "End Service" button

#### **Events Page** (`/events`)
**Purpose**: Event management and calendar view
**Layout**: Calendar view with event details sidebar
**Quasar Components**: `q-page`, `q-calendar`, `q-card`, `q-list`

**Calendar View** (Main area):
- Monthly calendar with event indicators
- Click events to view details
- Different colors for event types
- Mobile: List view with date headers

**Event Details Sidebar**:
- Selected event information
- Attendee list and RSVP status
- Edit/Delete actions
- "Create New Event" button

#### **404 Error Page** (`/404`)
**Purpose**: Handle invalid routes gracefully
**Layout**: Centered content with illustration
**Quasar Components**: `q-page`, `q-card`, `q-btn`

**Content**:
1. **Illustration**: Friendly 404 graphic
2. **Headline**: "Page Not Found"
3. **Message**: "The page you're looking for doesn't exist"
4. **Actions**:
   - "Go to Dashboard" primary button
   - "Go Back" secondary button
5. **Search**: "Or search for what you need" with search input

#### **Logout Confirmation** (Modal/Dialog)
**Purpose**: Confirm logout action
**Layout**: Modal dialog
**Quasar Components**: `q-dialog`, `q-card`

**Content**:
1. **Title**: "Sign Out"
2. **Message**: "Are you sure you want to sign out?"
3. **Actions**:
   - "Cancel" secondary button
   - "Sign Out" primary button (red color)

---

#### **Dashboard Layout (Primary)**
- **Purpose**: Main church management dashboard
- **Breakpoints**: Mobile (375px), Tablet (768px), Desktop (1024px+)
- **Structure**:
  - **Header**: 64px height (universal header system above)
  - **Sidebar**: 280px width (desktop), collapsible, contains main navigation
  - **Main Content**: Flexible width, contains dashboard widgets and data
  - **Footer**: 48px height desktop, 80px mobile (universal footer system above)
- **Key Features**:
  - Responsive grid system (4 columns desktop, 2 tablet, 1 mobile)
  - Widget-based content areas
  - Offline status indicator in header
  - Quick action floating button (mobile)

#### **Authentication Layout**
- **Purpose**: Login, registration, password reset screens
- **Structure**:
  - **Centered Card**: 400px max width, glassmorphism effect
  - **Background**: Gradient or pattern, optimized for outdoor visibility
  - **Form Elements**: Large touch targets, clear validation states
- **Key Features**:
  - High contrast mode support
  - Clear error states and validation feedback
  - Social login options (Google OAuth)
  - Accessibility labels and focus management

#### **Organization Setup Layout**
- **Purpose**: Multi-step church setup wizard
- **Structure**:
  - **Progress Indicator**: Top of screen, shows current step
  - **Step Content**: Main form area with validation
  - **Navigation**: Previous/Next buttons, step indicators
- **Key Features**:
  - Clear progress indication
  - Step-by-step validation
  - Offline capability indicators
  - Mobile-optimized form controls

#### **Member Management Layout**
- **Purpose**: Member directory, profiles, and management
- **Structure**:
  - **Search/Filter Bar**: Sticky top, contains search and filters
  - **Member List**: Virtualized list for performance
  - **Member Cards**: Touch-optimized cards with key information
- **Key Features**:
  - Advanced search and filtering
  - Bulk action capabilities
  - Offline sync indicators
  - Touch-friendly member cards

#### **Settings Layout**
- **Purpose**: Application settings and preferences
- **Structure**:
  - **Settings Categories**: Sidebar navigation (desktop) or tabs (mobile)
  - **Settings Content**: Form-based configuration
  - **Theme Switcher**: Prominent theme selection
- **Key Features**:
  - Clear setting categories
  - Real-time preview of changes
  - Accessibility options
  - Data usage indicators

### 2. Mobile-Specific Layouts

#### **Mobile Dashboard**
- **Bottom Navigation**: 5 primary actions, 48px height
- **Floating Action Button**: Primary action, positioned for thumb reach
- **Pull-to-Refresh**: Native mobile refresh pattern
- **Swipe Actions**: Left/right swipe for quick actions

#### **Mobile Forms**
- **Single Column Layout**: Full-width inputs
- **Large Touch Targets**: 48px minimum height
- **Keyboard Optimization**: Input types and validation
- **Progress Indicators**: Clear form completion status

---

## 🎨 Component Library Specifications

### 1. Core UI Components

#### **ModernButton Component**
**Purpose**: Primary interaction element with multiple variants

**Variants**:
- **Primary**: Solid background, high contrast, main actions
- **Secondary**: Outlined style, secondary actions
- **Ghost**: Transparent background, subtle actions
- **Floating**: Circular, elevated, primary mobile actions
- **Icon**: Icon-only buttons for compact spaces

**States**:
- **Default**: Normal appearance
- **Hover**: Subtle elevation increase, color shift
- **Active**: Pressed state with visual feedback
- **Disabled**: Reduced opacity, no interaction
- **Loading**: Spinner overlay, disabled interaction

**Specifications**:
- **Size**: Small (32px), Medium (40px), Large (48px), XLarge (56px)
- **Touch Target**: Minimum 48px for mobile
- **Border Radius**: 8px (Material Design 3)
- **Elevation**: 0dp (flat), 2dp (elevated), 8dp (floating)
- **Typography**: Medium weight, 14px base size
- **Accessibility**: ARIA labels, keyboard navigation, focus indicators

#### **ModernInput Component**
**Purpose**: Form input with validation and accessibility

**Variants**:
- **Text**: Standard text input
- **Email**: Email validation and keyboard
- **Password**: Toggle visibility, strength indicator
- **Number**: Numeric input with formatting
- **Search**: Search-specific styling and behavior
- **Textarea**: Multi-line text input

**States**:
- **Default**: Normal input state
- **Focused**: Active focus with ring indicator
- **Filled**: Has content, different styling
- **Error**: Red border, error message below
- **Success**: Green border, success indicator
- **Disabled**: Grayed out, no interaction

**Specifications**:
- **Height**: 48px minimum for touch targets
- **Border**: 1px solid, 2px on focus
- **Border Radius**: 8px
- **Padding**: 16px horizontal, 12px vertical
- **Label**: Floating label or placeholder
- **Helper Text**: Below input, contextual information
- **Validation**: Real-time feedback with icons

#### **ModernAlert Component**
**Purpose**: System feedback and notifications

**Variants**:
- **Success**: Green color scheme, checkmark icon
- **Info**: Blue color scheme, information icon
- **Warning**: Orange color scheme, warning icon
- **Error**: Red color scheme, error icon

**States**:
- **Visible**: Normal display state
- **Dismissing**: Animation before removal
- **Dismissed**: Hidden from view

**Specifications**:
- **Padding**: 16px all around
- **Border Radius**: 8px
- **Icon**: 20px size, left-aligned
- **Text**: 14px, readable contrast
- **Dismiss Button**: 24px, right-aligned
- **Animation**: Slide in/out, fade effects

#### **BaseFormCard Component**
**Purpose**: Container for form content with glassmorphism

**Variants**:
- **Default**: Standard glassmorphism effect
- **Elevated**: Higher elevation for emphasis
- **Solid**: Solid background for high contrast

**Specifications**:
- **Background**: Semi-transparent with backdrop blur
- **Border**: 1px solid with opacity
- **Border Radius**: 16px
- **Padding**: 24px
- **Shadow**: Subtle drop shadow
- **Content Areas**: Header, body, footer sections

### 2. Africa-First Components

#### **OfflineIndicator Component**
**Purpose**: Show connection status and sync state

**States**:
- **Online**: Green indicator, "Connected" text
- **Offline**: Red indicator, "Working Offline" text
- **Syncing**: Blue indicator with progress, "Syncing..." text
- **Error**: Orange indicator, "Sync Error" text

**Specifications**:
- **Size**: 24px indicator, compact design
- **Position**: Top-right of screen
- **Animation**: Pulse effect for syncing
- **Accessibility**: Screen reader announcements

#### **SyncProgress Component**
**Purpose**: Show background sync progress

**States**:
- **Hidden**: No sync in progress
- **Progress**: Linear progress bar with percentage
- **Complete**: Success indicator
- **Error**: Error state with retry option

**Specifications**:
- **Height**: 4px progress bar
- **Color**: Blue gradient
- **Animation**: Smooth progress indication
- **Position**: Bottom of screen (mobile)

#### **DataUsageIndicator Component**
**Purpose**: Show mobile data consumption

**States**:
- **Hidden**: No data usage tracking
- **Low**: Green indicator, efficient usage
- **Medium**: Orange indicator, moderate usage
- **High**: Red indicator, high usage warning

**Specifications**:
- **Size**: Small, unobtrusive
- **Position**: Settings or header
- **Format**: "2.3MB used" or percentage
- **Color Coding**: Traffic light system

#### **TouchOptimizedInput Component**
**Purpose**: Large, thumb-friendly input fields

**Specifications**:
- **Height**: 56px minimum
- **Touch Target**: 48px minimum
- **Spacing**: 16px between elements
- **Typography**: 16px minimum (prevents zoom on iOS)
- **Border**: 2px for better visibility
- **Focus**: Large focus ring for accessibility

### 3. Navigation Components

#### **Bottom Navigation (Mobile)**
**Purpose**: Primary navigation for mobile users

**Specifications**:
- **Height**: 80px
- **Items**: 5 maximum
- **Icons**: 24px size
- **Labels**: 12px text below icons
- **Active State**: Color change, slight elevation
- **Accessibility**: Large touch targets, clear labels

#### **Sidebar Navigation (Desktop)**
**Purpose**: Main navigation for desktop users

**Specifications**:
- **Width**: 280px
- **Items**: Hierarchical with expand/collapse
- **Icons**: 20px size
- **Labels**: 14px text
- **Active State**: Background color, border indicator
- **Collapsible**: Can be minimized to icon-only

#### **Floating Action Button**
**Purpose**: Primary action button for mobile

**Specifications**:
- **Size**: 56px diameter
- **Position**: Bottom-right, 16px from edges
- **Elevation**: 8dp
- **Icon**: 24px size
- **Color**: Primary brand color
- **Animation**: Scale on press, ripple effect

### 4. Data Display Components

#### **ModernDataTable Component**
**Purpose**: Display tabular data with advanced features

**Features**:
- **Sorting**: Clickable column headers
- **Filtering**: Search and filter capabilities
- **Pagination**: Page navigation controls
- **Selection**: Row selection with checkboxes
- **Responsive**: Horizontal scroll on mobile

**Specifications**:
- **Header**: 48px height, bold text
- **Rows**: 56px height, alternating colors
- **Borders**: 1px between rows
- **Hover**: Subtle background change
- **Mobile**: Card-based layout

#### **MemberCard Component**
**Purpose**: Display member information in card format

**Content**:
- **Avatar**: 48px circular image
- **Name**: Primary text, 16px
- **Role**: Secondary text, 14px
- **Status**: Badge indicator
- **Actions**: Quick action buttons

**Specifications**:
- **Padding**: 16px
- **Border Radius**: 8px
- **Shadow**: Subtle elevation
- **Touch Target**: Full card area
- **Responsive**: Stack on mobile

### 5. Modal and Overlay Components

#### **ModernModal Component**
**Purpose**: Overlay dialogs and confirmations

**Types**:
- **Confirmation**: Yes/No dialogs
- **Information**: Display-only content
- **Form**: Input forms in modal
- **Fullscreen**: Mobile-optimized full screen

**Specifications**:
- **Backdrop**: Semi-transparent overlay
- **Animation**: Slide in/out, fade effects
- **Close**: X button or backdrop click
- **Accessibility**: Focus trap, escape key
- **Mobile**: Full screen on small devices

#### **ModernToast Component**
**Purpose**: Non-intrusive notifications

**Types**:
- **Success**: Green, checkmark icon
- **Error**: Red, X icon
- **Info**: Blue, info icon
- **Warning**: Orange, warning icon

**Specifications**:
- **Position**: Top-right (desktop), top (mobile)
- **Duration**: 3-5 seconds
- **Animation**: Slide in/out
- **Dismiss**: Auto-dismiss or manual close
- **Stacking**: Multiple toasts stack vertically

---

## 🎨 Theme System Specifications

### 1. Color Palettes

#### **Light Theme (Primary)**
- **Primary**: #6B1B3D (Garnet)
- **Secondary**: #4A90E2 (Blue)
- **Success**: #4CAF50 (Green)
- **Warning**: #FF9800 (Orange)
- **Error**: #F44336 (Red)
- **Background**: #FFFFFF
- **Surface**: #F8F9FA
- **Text**: #212529
- **Text Secondary**: #6C757D

#### **Dark Theme (Garnet Night)**
- **Primary**: #8B4C6B (Light Garnet)
- **Secondary**: #6BB6FF (Light Blue)
- **Success**: #66BB6A (Light Green)
- **Warning**: #FFB74D (Light Orange)
- **Error**: #EF5350 (Light Red)
- **Background**: #121212
- **Surface**: #1E1E1E
- **Text**: #FFFFFF
- **Text Secondary**: #B0B0B0

#### **High Contrast Theme**
- **Primary**: #000000
- **Secondary**: #0000FF
- **Success**: #008000
- **Warning**: #FF8C00
- **Error**: #FF0000
- **Background**: #FFFFFF
- **Surface**: #F0F0F0
- **Text**: #000000
- **Text Secondary**: #333333

### 2. Typography System

#### **Font Families**
- **Primary**: Inter (web-safe fallback: system-ui)
- **Secondary**: Roboto (Material Design)
- **Monospace**: JetBrains Mono (code)

#### **Type Scale**
- **Display**: 32px, 40px, 48px, 56px
- **Headline**: 24px, 28px, 32px
- **Title**: 16px, 20px, 24px
- **Body**: 14px, 16px, 18px
- **Label**: 12px, 14px
- **Caption**: 10px, 12px

#### **Font Weights**
- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **SemiBold**: 600
- **Bold**: 700

### 3. Spacing System

#### **Base Unit**: 8px
- **XS**: 4px
- **S**: 8px
- **M**: 16px
- **L**: 24px
- **XL**: 32px
- **XXL**: 48px
- **XXXL**: 64px

#### **Component Spacing**
- **Padding**: 8px, 16px, 24px
- **Margin**: 8px, 16px, 24px, 32px
- **Gap**: 8px, 16px, 24px (flexbox/grid)

### 4. Elevation System

#### **Shadow Levels**
- **0dp**: No shadow (flat)
- **2dp**: Subtle elevation
- **4dp**: Card elevation
- **8dp**: Floating elements
- **16dp**: Modal overlays
- **24dp**: Maximum elevation

#### **Shadow Specifications**
- **Color**: Black with opacity
- **Blur**: 2px, 4px, 8px, 16px
- **Offset**: 0px, 1px, 2px, 4px
- **Spread**: 0px, 1px, 2px

---

## 📱 Responsive Design Specifications

### 1. Breakpoints

#### **Mobile First Approach**
- **XS**: 320px (small phones)
- **SM**: 375px (standard phones)
- **MD**: 768px (tablets)
- **LG**: 1024px (small desktops)
- **XL**: 1440px (large desktops)
- **XXL**: 1920px (ultra-wide)

#### **Container Widths**
- **Mobile**: 100% width
- **Tablet**: 768px max width
- **Desktop**: 1200px max width
- **Large Desktop**: 1440px max width

### 2. Grid System

#### **Desktop Grid**
- **Columns**: 12
- **Gutter**: 24px
- **Margin**: 24px

#### **Tablet Grid**
- **Columns**: 8
- **Gutter**: 16px
- **Margin**: 16px

#### **Mobile Grid**
- **Columns**: 4
- **Gutter**: 8px
- **Margin**: 8px

### 3. Component Responsive Behavior

#### **Navigation**
- **Desktop**: Sidebar navigation
- **Tablet**: Collapsible sidebar
- **Mobile**: Bottom navigation

#### **Forms**
- **Desktop**: Multi-column layouts
- **Tablet**: Single column with spacing
- **Mobile**: Full-width inputs

#### **Data Tables**
- **Desktop**: Full table view
- **Tablet**: Horizontal scroll
- **Mobile**: Card-based layout

---

## ♿ Accessibility Specifications

### 1. Color Contrast Requirements

#### **WCAG AA Compliance**
- **Normal Text**: 4.5:1 contrast ratio
- **Large Text**: 3:1 contrast ratio
- **UI Components**: 3:1 contrast ratio
- **Focus Indicators**: 3:1 contrast ratio

#### **Color Independence**
- **Status Indicators**: Use shapes and patterns
- **Error States**: Multiple visual cues
- **Success States**: Icons and text
- **Warning States**: Clear visual hierarchy

### 2. Touch Target Specifications

#### **Minimum Sizes**
- **Primary Actions**: 48px minimum
- **Secondary Actions**: 44px minimum
- **Icon Buttons**: 48px minimum
- **Text Links**: 44px minimum

#### **Spacing Requirements**
- **Between Targets**: 8px minimum
- **Edge Spacing**: 16px minimum
- **Thumb Reach**: 48px from edge

### 3. Focus Management

#### **Focus Indicators**
- **Visible Focus**: 2px solid border
- **Focus Color**: High contrast
- **Focus Order**: Logical tab sequence
- **Skip Links**: Hidden until focused

#### **Keyboard Navigation**
- **Tab Order**: Logical sequence
- **Arrow Keys**: List and grid navigation
- **Enter/Space**: Activation
- **Escape**: Close modals

---

## 🎭 Animation and Interaction Specifications

### 1. Micro-Interactions

#### **Button Interactions**
- **Hover**: 0.2s ease-in-out
- **Press**: 0.1s ease-in-out
- **Ripple**: 0.3s ease-out
- **Loading**: Continuous rotation

#### **Form Interactions**
- **Focus**: 0.2s ease-in-out
- **Validation**: 0.3s ease-out
- **Error**: 0.2s ease-in-out
- **Success**: 0.3s ease-out

#### **Navigation Interactions**
- **Page Transitions**: 0.3s ease-in-out
- **Menu Toggle**: 0.2s ease-in-out
- **Tab Switching**: 0.2s ease-in-out
- **Modal Open/Close**: 0.3s ease-in-out

### 2. Loading States

#### **Skeleton Screens**
- **Content**: Gray placeholder shapes
- **Animation**: Shimmer effect
- **Duration**: Continuous until loaded
- **Performance**: 60fps on mid-range devices

#### **Progress Indicators**
- **Linear**: Horizontal progress bar
- **Circular**: Spinning indicator
- **Dots**: Pulsing dots
- **Percentage**: Text with progress

### 3. Gesture Support

#### **Touch Gestures**
- **Swipe**: Left/right for actions
- **Pull-to-Refresh**: Down gesture
- **Pinch**: Zoom functionality
- **Long Press**: Context menus

#### **Haptic Feedback**
- **Success**: Light vibration
- **Error**: Strong vibration
- **Navigation**: Medium vibration
- **Selection**: Light vibration

---

## 📊 Performance Specifications

### 1. Loading Performance

#### **Target Metrics**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.0s
- **Cumulative Layout Shift**: < 0.1

#### **Optimization Strategies**
- **Critical CSS**: Inline above-the-fold
- **Lazy Loading**: Images and components
- **Code Splitting**: Route-based chunks
- **Tree Shaking**: Remove unused code

### 2. Animation Performance

#### **Target Metrics**
- **Frame Rate**: 60fps
- **Animation Duration**: < 300ms
- **Easing**: ease-in-out
- **Hardware Acceleration**: Transform and opacity

#### **Performance Considerations**
- **Reduce Motion**: Respect user preferences
- **Battery Optimization**: Efficient animations
- **Memory Management**: Cleanup unused animations
- **Network Awareness**: Pause animations on slow connections

---

## 🧪 Testing Specifications

### 1. Visual Testing

#### **Cross-Browser Testing**
- **Chrome**: Latest version
- **Safari**: Latest version
- **Firefox**: Latest version
- **Edge**: Latest version

#### **Device Testing**
- **iPhone**: 12, 13, 14 series
- **Android**: Pixel, Samsung Galaxy
- **Tablet**: iPad, Android tablets
- **Desktop**: Various screen sizes

### 2. Accessibility Testing

#### **Screen Reader Testing**
- **NVDA**: Windows
- **JAWS**: Windows
- **VoiceOver**: macOS/iOS
- **TalkBack**: Android

#### **Keyboard Testing**
- **Tab Navigation**: All interactive elements
- **Arrow Keys**: List and grid navigation
- **Enter/Space**: Activation
- **Escape**: Close modals

### 3. Performance Testing

#### **Network Conditions**
- **3G**: Slow connection simulation
- **4G**: Fast connection simulation
- **Offline**: No connection simulation
- **Variable**: Fluctuating connection

#### **Device Performance**
- **Low-End**: 2GB RAM, slow CPU
- **Mid-Range**: 4GB RAM, medium CPU
- **High-End**: 8GB+ RAM, fast CPU

---

## 📋 Implementation Checklist

### 1. Design System Setup
- [ ] Create Figma design system file
- [ ] Set up color palettes (light, dark, high contrast)
- [ ] Define typography scale and weights
- [ ] Create spacing and elevation systems
- [ ] Set up component library structure

### 2. Component Creation
- [ ] Design all ModernButton variants
- [ ] Create ModernInput with all states
- [ ] Design ModernAlert components
- [ ] Create BaseFormCard variants
- [ ] Design Africa-first components

### 3. Layout Design
- [ ] Create dashboard layout
- [ ] Design authentication screens
- [ ] Create organization setup flow
- [ ] Design member management interface
- [ ] Create settings and preferences

### 4. Responsive Design
- [ ] Design mobile-first layouts
- [ ] Create tablet adaptations
- [ ] Design desktop enhancements
- [ ] Test across all breakpoints
- [ ] Optimize for touch targets

### 5. Accessibility Implementation
- [ ] Ensure WCAG AA compliance
- [ ] Test color contrast ratios
- [ ] Design focus indicators
- [ ] Create keyboard navigation
- [ ] Test with screen readers

### 6. Animation and Interaction
- [ ] Define micro-interactions
- [ ] Create loading states
- [ ] Design gesture support
- [ ] Plan haptic feedback
- [ ] Optimize for performance

### 7. Testing and Validation
- [ ] Cross-browser testing
- [ ] Device testing
- [ ] Accessibility testing
- [ ] Performance testing
- [ ] User testing

---

## 🎯 Success Metrics

### 1. Design Quality
- **Consistency**: 100% component consistency
- **Accessibility**: WCAG AA compliance
- **Performance**: 60fps animations
- **Responsiveness**: All breakpoints covered

### 2. User Experience
- **Touch Targets**: 48px minimum
- **Loading Time**: < 3s on 3G
- **Accessibility**: Screen reader compatible
- **Offline Support**: Clear status indicators

### 3. Competitive Advantage
- **Modern Design**: Material Design 3
- **Mobile-First**: Superior mobile experience
- **Africa-Optimized**: Low-bandwidth friendly
- **Accessibility**: Enhanced beyond RockRMS

---

## 🔧 Quasar + Figma Integration Guide

### **Using Quasar Framework with AI Design Tools**

#### **1. Component Mapping Strategy**
When using AI design tools (Figma Make, Moochild.ai), ensure every design element maps to a Quasar component:

**Authentication Components**:
- Login forms → `q-form` + `q-input` + `q-btn`
- Cards → `q-card` with `q-card-section`
- Buttons → `q-btn` with appropriate props (color, size, icon)

**Dashboard Components**:
- Widgets → `q-card` with custom content
- Navigation → `q-drawer` + `q-list` + `q-item`
- Tables → `q-table` with pagination
- Charts → `q-chart` (or third-party with Quasar styling)

**Layout Components**:
- Headers → `q-header` + `q-toolbar`
- Footers → `q-footer` + `q-toolbar`
- Pages → `q-page` with `q-page-container`
- Responsive grids → `q-grid` system (col-xs, col-sm, etc.)

#### **2. Design Token Integration**
Create Figma variables that match Quasar's theming system:

**Colors** (Map to Quasar CSS variables):
```css
--q-primary: #1976D2
--q-secondary: #26A69A
--q-accent: #9C27B0
--q-dark: #1D1D1D
--q-positive: #21BA45
--q-negative: #C10015
--q-info: #31CCEC
--q-warning: #F2C037
```

**Spacing** (Use Quasar's spacing scale):
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 48px

**Typography** (Match Quasar's text classes):
- .text-h1 through .text-h6
- .text-subtitle1, .text-subtitle2
- .text-body1, .text-body2
- .text-caption, .text-overline

#### **3. Responsive Design Tokens**
Use Quasar's breakpoint system in Figma:
- **xs**: 0-599px (Mobile)
- **sm**: 600-1023px (Tablet)
- **md**: 1024-1439px (Small Desktop)
- **lg**: 1440-1919px (Desktop)
- **xl**: 1920px+ (Large Desktop)

#### **4. Component Variants in Figma**
Create component variants that match Quasar props:

**Button Variants**:
- Size: xs, sm, md, lg, xl
- Color: primary, secondary, accent, positive, negative
- Type: filled, outlined, flat, push, glossy
- Shape: rounded, square, fab

**Input Variants**:
- Type: filled, outlined, standout, borderless
- Size: xs, sm, md, lg, xl
- State: default, focused, error, disabled

#### **5. AI Design Tool Prompts**
When using AI design tools, use these specific prompts:

**For Authentication Pages**:
"Create a login page using Material Design 3 components with glass morphism effect, Garnet Night gradient background, centered q-card layout with q-input fields for email/password, primary q-btn for login, and secondary q-btn for Google OAuth"

**For Dashboard**:
"Design a dashboard using Material Design 3 with q-drawer sidebar navigation, q-card widgets in a responsive grid, q-toolbar header with breadcrumbs, and bottom navigation for mobile"

#### **6. Export Guidelines**
When exporting from Figma to development:
- Use consistent naming: `Button/Primary/Large` → `q-btn color="primary" size="lg"`
- Export icons as SVG for `q-icon` components
- Use Figma's design tokens for CSS custom properties
- Maintain component hierarchy that matches Quasar's structure

#### **7. Testing with Quasar**
After AI design generation:
1. Validate all components exist in Quasar Framework
2. Check responsive behavior matches Quasar's grid system
3. Verify color tokens work with Quasar's theming
4. Test accessibility features align with Quasar's a11y support

---

## 🎨 Implementation Notes

This comprehensive design guide ensures that the Figma implementation will create a superior, Africa-first church management system that exceeds RockRMS in user experience, accessibility, and mobile optimization while maintaining the highest design standards and performance requirements.

## 🤖 AI Design Prompts for Each Page Type

### **Authentication Pages Prompts**

#### **Landing Page Prompt**
> "Create a church management landing page using Material Design 3 with Garnet Night gradient background, centered q-card with glassmorphism effect, ChurchAfrica logo (120px), headline 'Church Management Made Simple', subheadline 'Africa's first offline-capable church management system', primary q-btn 'Get Started Free', secondary q-btn 'Watch Demo', and 3-column features section with icons for 'Works Offline', 'Mobile-First', and 'Simple & Powerful'. Use mobile-first responsive design with 375px primary breakpoint."

#### **Login Page Prompt**
> "Design a login page using Material Design 3 with Garnet Night gradient background, centered q-card (400px width), ChurchAfrica logo (64px), 'Welcome Back' title, 'Sign in to your church account' subtitle, q-input for email with validation, q-input for password with toggle visibility, q-checkbox 'Keep me signed in', 'Forgot Password' link, primary q-btn 'Sign In', secondary q-btn with Google icon 'Continue with Google', and footer with 'Don't have an account? Sign up' link. Include offline status indicator."

#### **Registration Page Prompt**
> "Create a registration page using Material Design 3 with Garnet Night gradient background, centered q-card (450px width), ChurchAfrica logo (64px), 'Create Account' title, 'Set up your church management system' subtitle, 2-column form layout with q-input fields for Church Name, Your Name, Email, Phone, Password with strength indicator, Confirm Password with match validation, q-select for Church Size (1-50, 51-200, 201-500, 500+), q-checkbox 'I agree to Terms & Privacy Policy', primary q-btn 'Create Account', and secondary q-btn 'Sign up with Google'. Use mobile-first responsive design."

### **Dashboard Pages Prompts**

#### **Main Dashboard Prompt**
> "Design a church management dashboard using Material Design 3 with q-drawer sidebar (280px), q-toolbar header with breadcrumbs, q-card widgets in responsive grid (4 columns desktop, 2 tablet, 1 mobile), welcome card with 'Good morning, Pastor [Name]' and weather widget, metrics cards showing Total Members (1,247 +12%), Weekly Attendance (89% trending up), New Visitors (3 with photos), Upcoming Events (2 with times), recent activity timeline with 'Sarah Johnson joined (2 hours ago)', quick actions with q-btn for Add Member, Record Attendance, Create Event, Generate Report, and q-chart for weekly attendance trends. Include floating action button for mobile."

#### **Members Directory Prompt**
> "Create a member management interface using Material Design 3 with q-table for desktop (Photo, Name, Phone, Email, Family, Status, Actions columns), q-card layout for mobile with member photos and contact info, q-input search with 'Search members...' placeholder, q-select filter dropdown (All, Adults, Children, Visitors, New), q-btn actions for Add Member, Import, Export, q-dialog for member details with tabs (Personal Info, Family, Notes, Attendance History), and swipe actions for mobile. Include pagination and infinite scroll for mobile."

### **Attendance Pages Prompts**

#### **Attendance Dashboard Prompt**
> "Design an attendance tracking interface using Material Design 3 with split view layout, q-camera for QR scanning with overlay, q-select for service type selection, q-date picker for service date, q-list for checked-in members with photos and timestamps, real-time attendance counter '47 members checked in', q-btn actions for 'Mark All Present', 'Export Attendance', 'End Service', and manual search fallback with q-input. Use mobile-first design with touch-optimized controls and offline capability indicators."

### **Communication Pages Prompts**

#### **Messages Center Prompt**
> "Create a messaging interface using Material Design 3 with q-list for conversations in left sidebar, q-item for each conversation with unread q-badge, q-input for message search, main chat area with message bubbles, q-input for typing with send q-btn, q-btn for file attachments, q-btn for emoji picker, and q-avatar for user photos. Include mobile-first chat interface design with touch-optimized controls."

### **Admin Pages Prompts**

#### **System Settings Prompt**
> "Design an admin settings interface using Material Design 3 with q-card for settings sections, sidebar navigation for categories (General, Security, Notifications, Integrations, Backup), q-form with q-input and q-toggle controls, q-select for dropdowns, q-btn for save/cancel actions, and real-time preview of changes. Include mobile-responsive design with collapsible sidebar."

## 🎨 Quasar + Figma Integration Best Practices

### **1. Component Mapping Strategy**
When using AI design tools, ensure every design element maps to a Quasar component:

**Form Components**:
- Input fields → `q-input` with appropriate props
- Buttons → `q-btn` with color, size, icon props
- Cards → `q-card` with `q-card-section`
- Forms → `q-form` with validation

**Layout Components**:
- Headers → `q-header` with `q-toolbar`
- Sidebars → `q-drawer` with `q-list`
- Pages → `q-page` with `q-page-container`
- Modals → `q-dialog` with `q-card`

**Data Components**:
- Tables → `q-table` with pagination
- Lists → `q-list` with `q-item`
- Charts → `q-chart` or third-party with Quasar styling
- Navigation → `q-tabs` or `q-breadcrumbs`

### **2. Design Token Integration**
Create Figma variables that match Quasar's CSS variables:

**Colors** (Map to Quasar CSS variables):
```css
--q-primary: #1976D2
--q-secondary: #26A69A  
--q-accent: #9C27B0
--q-dark: #1D1D1D
--q-positive: #21BA45
--q-negative: #C10015
--q-info: #31CCEC
--q-warning: #F2C037
```

**Spacing** (Use Quasar's spacing scale):
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 48px

**Typography** (Match Quasar's text classes):
- .text-h1 through .text-h6
- .text-subtitle1, .text-subtitle2
- .text-body1, .text-body2
- .text-caption, .text-overline

### **3. Responsive Design Tokens**
Use Quasar's breakpoint system in Figma:
- **xs**: 0-599px (Mobile)
- **sm**: 600-1023px (Tablet)  
- **md**: 1024-1439px (Small Desktop)
- **lg**: 1440-1919px (Desktop)
- **xl**: 1920px+ (Large Desktop)

### **4. Component Variants in Figma**
Create component variants that match Quasar props:

**Button Variants**:
- Size: xs, sm, md, lg, xl
- Color: primary, secondary, accent, positive, negative
- Type: filled, outlined, flat, push, glossy
- Shape: rounded, square, fab

**Input Variants**:
- Type: filled, outlined, standout, borderless
- Size: xs, sm, md, lg, xl
- State: default, focused, error, disabled

### **5. AI Design Tool Workflow**
1. **Use this guide as input** for AI design generation
2. **Generate initial designs** with Figma Make or Moochild.ai using the specific prompts above
3. **Refine designs** to ensure Quasar component compatibility
4. **Create Figma component library** matching Quasar's structure
5. **Export design tokens** and assets for development implementation
6. **Test responsive behavior** matches Quasar's grid system
7. **Verify color tokens** work with Quasar's theming
8. **Validate accessibility** features align with Quasar's a11y support

### **6. Africa-First Design Considerations**
When using AI design tools, emphasize these Africa-first requirements:

**Mobile Optimization**:
- 48px minimum touch targets (larger than standard 44px)
- Thumb-friendly navigation zones
- One-handed operation for critical tasks
- Large, clear typography (16px minimum)

**Offline-First Visual Feedback**:
- Clear connection status indicators
- Sync progress feedback
- Cached data indicators
- Offline capability badges

**Low-Bandwidth Optimization**:
- Progressive image loading with blur-to-sharp transitions
- Skeleton screens for immediate visual feedback
- Efficient caching strategies
- Minimal data usage indicators

**Outdoor Visibility**:
- High contrast mode for bright sunlight
- Enhanced visibility outdoors
- Color-independent indicators
- Clear focus indicators for accessibility

This comprehensive guide ensures that AI design generation will create pixel-perfect designs that map directly to your Quasar implementation while maintaining Africa-first optimization and competitive advantage over RockRMS.
