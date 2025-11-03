# ChurchAfrica ChMS - Component Library Wireframe Prompt
**Figma Make Prompt for Reusable UI Components**

## 📋 Prerequisites
**IMPORTANT**: Copy and paste the entire `figma-make-master-prompt.md` content first, then add this prompt for component library wireframing.

## 🧩 Component Library Overview

Create a **comprehensive component library** that maps directly to Quasar Framework components. These components will be used across all ChurchAfrica ChMS interfaces.

## 🔘 Button Components

### **Primary Buttons (q-btn)**
- **Primary Button**: Green (#1CE479) background, white text, 48px height
- **Secondary Button**: Transparent background, green border, green text
- **Danger Button**: Red background, white text, for delete actions
- **Success Button**: Green background, white text, for save actions
- **Disabled Button**: Gray background, gray text, non-interactive

### **Button Sizes**
- **Large**: 48px height, 16px padding, for primary actions
- **Medium**: 40px height, 12px padding, for secondary actions
- **Small**: 32px height, 8px padding, for inline actions
- **Icon Only**: 48px square, for toolbar actions

### **Button States**
- **Default**: Normal appearance
- **Hover**: Slight elevation increase, subtle color change
- **Active**: Pressed appearance with darker color
- **Loading**: Spinner icon with disabled state
- **Focus**: Clear focus ring for keyboard navigation

## 📝 Form Components

### **Input Fields (q-input)**
- **Text Input**: Single line, 48px height, rounded corners
- **Password Input**: With show/hide toggle icon
- **Email Input**: With email validation icon
- **Phone Input**: With country code selector
- **Number Input**: With increment/decrement buttons
- **Search Input**: With search icon and clear button

### **Input States**
- **Default**: Gray border, white background
- **Focus**: Green border, subtle shadow
- **Error**: Red border, error message below
- **Success**: Green border, checkmark icon
- **Disabled**: Gray background, gray text

### **Select Components (q-select)**
- **Dropdown Select**: With chevron down icon
- **Multi-Select**: With chip display for selected items
- **Searchable Select**: With search input inside dropdown
- **Country Select**: With flag icons
- **Date Picker**: With calendar icon

### **Checkbox & Radio (q-checkbox, q-radio)**
- **Checkbox**: Square with checkmark, 24px size
- **Radio Button**: Circle with dot, 24px size
- **Toggle Switch**: Rounded switch, green when active
- **Checkbox Group**: Multiple options with labels
- **Radio Group**: Single selection with labels

## 📊 Data Display Components

### **Cards (q-card)**
- **Basic Card**: White background, subtle shadow, rounded corners
- **Member Card**: Photo, name, contact info, action menu
- **Event Card**: Date, title, location, RSVP button
- **Metric Card**: Large number, trend indicator, icon
- **Activity Card**: Icon, description, timestamp

### **Lists (q-list)**
- **Simple List**: Text items with dividers
- **Avatar List**: Profile photos with names
- **Action List**: Items with trailing action buttons
- **Expandable List**: Collapsible sections
- **Checkbox List**: Selectable items with checkboxes

### **Tables (q-table)**
- **Data Table**: Sortable columns, pagination
- **Member Table**: Photos, names, contact, status
- **Attendance Table**: Dates, services, counts
- **Giving Table**: Dates, amounts, methods
- **Responsive Table**: Mobile-friendly stacked layout

## 🧭 Navigation Components

### **Header Navigation (q-header)**
- **Main Header**: Logo, navigation tabs, user menu
- **Mobile Header**: Logo, hamburger menu, notifications
- **Breadcrumbs**: Page hierarchy navigation
- **Search Bar**: Global search with filters

### **Sidebar Navigation (q-drawer)**
- **Main Sidebar**: Primary navigation menu
- **Collapsible Sidebar**: Expandable/collapsible sections
- **User Profile**: Avatar, name, role, settings
- **Quick Actions**: Frequently used functions

### **Tab Navigation (q-tabs)**
- **Horizontal Tabs**: Desktop navigation
- **Vertical Tabs**: Sidebar-style navigation
- **Bottom Tabs**: Mobile navigation
- **Scrollable Tabs**: When tabs exceed container width

### **Bottom Navigation (Mobile)**
- **Tab Bar**: 4-5 primary navigation items
- **Floating Action Button**: Primary action overlay
- **Badge Indicators**: Notification counts
- **Active States**: Clear visual feedback

## 💬 Feedback Components

### **Notifications (q-notify)**
- **Success Toast**: Green background, checkmark icon
- **Error Toast**: Red background, error icon
- **Warning Toast**: Yellow background, warning icon
- **Info Toast**: Blue background, info icon
- **Loading Toast**: Spinner with progress message

### **Dialogs (q-dialog)**
- **Confirmation Dialog**: Title, message, confirm/cancel buttons
- **Form Dialog**: Input fields with save/cancel actions
- **Info Dialog**: Information display with close button
- **Delete Confirmation**: Warning style with danger button
- **Loading Dialog**: Spinner with progress message

### **Progress Indicators**
- **Linear Progress**: Horizontal progress bar
- **Circular Progress**: Spinning loader
- **Step Progress**: Multi-step process indicator
- **Upload Progress**: File upload with percentage
- **Skeleton Loader**: Content placeholder while loading

## 🏷️ Status Components

### **Badges & Chips (q-badge, q-chip)**
- **Status Badge**: Online/offline, active/inactive
- **Count Badge**: Notification counts, unread messages
- **Role Chip**: User roles (Pastor, Admin, Member)
- **Category Chip**: Event types, ministry categories
- **Removable Chip**: With close button for filters

### **Status Indicators**
- **Connection Status**: Green (online), red (offline), yellow (syncing)
- **Sync Status**: Checkmark (synced), spinner (syncing), warning (error)
- **User Status**: Available, busy, away, offline
- **Data Status**: Fresh, cached, stale, error

## 📱 Mobile-Specific Components

### **Touch-Optimized Elements**
- **Large Touch Targets**: Minimum 48px for all interactive elements
- **Swipe Actions**: Left/right swipe for common actions
- **Pull-to-Refresh**: Standard mobile refresh pattern
- **Infinite Scroll**: Load more content automatically
- **Bottom Sheet**: Modal that slides up from bottom

### **Mobile Navigation**
- **Hamburger Menu**: Collapsible main navigation
- **Tab Bar**: Bottom navigation with icons and labels
- **Floating Action Button**: Primary action overlay
- **Back Button**: Consistent back navigation
- **Search Overlay**: Full-screen search interface

## 🎨 Visual Hierarchy

### **Typography Scale**
- **H1**: 32px, bold, page titles
- **H2**: 24px, bold, section headers
- **H3**: 20px, bold, subsection headers
- **H4**: 18px, bold, card titles
- **Body**: 16px, regular, main content
- **Caption**: 14px, regular, secondary text
- **Small**: 12px, regular, metadata

### **Spacing System**
- **XXS**: 4px - tight spacing
- **XS**: 8px - compact spacing
- **SM**: 12px - small spacing
- **MD**: 16px - default spacing
- **LG**: 24px - large spacing
- **XL**: 32px - extra large spacing
- **XXL**: 48px - section spacing

### **Shadow System**
- **Level 1**: Subtle shadow for cards
- **Level 2**: Medium shadow for modals
- **Level 3**: Strong shadow for floating elements
- **Level 4**: Maximum shadow for overlays

## 🔧 Component Specifications

### **Naming Convention**
- **Layout**: `layout/header`, `layout/sidebar`, `layout/main`
- **Forms**: `form/input`, `form/select`, `form/button`
- **Data**: `data/table`, `data/card`, `data/list`
- **Navigation**: `nav/tabs`, `nav/breadcrumb`, `nav/menu`
- **Feedback**: `feedback/toast`, `feedback/dialog`, `feedback/progress`

### **State Management**
- **Default State**: Normal appearance and behavior
- **Hover State**: Interactive feedback for desktop
- **Active State**: Pressed or selected appearance
- **Focus State**: Keyboard navigation indicator
- **Disabled State**: Non-interactive appearance
- **Loading State**: Progress indication
- **Error State**: Problem indication with recovery options

### **Responsive Behavior**
- **Mobile First**: Design for 375px width first
- **Breakpoint Adaptation**: Adjust for larger screens
- **Touch Optimization**: Larger targets on mobile
- **Content Priority**: Most important content first
- **Progressive Enhancement**: Add features for larger screens

---

**Use this prompt with the master prompt to create a comprehensive component library that serves as the foundation for all ChurchAfrica ChMS interfaces.**
