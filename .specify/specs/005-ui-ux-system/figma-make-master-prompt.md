# ChurchAfrica ChMS - Figma Make Master Prompt
**Essential Context for All Figma Make Sessions**

## 🏗️ Technical Architecture

### **Tech Stack**
- **Frontend**: Vue 3 + Composition API + TypeScript + Pinia (state management)
- **UI Framework**: Quasar Framework (Material Design 3 components)
- **Backend**: Laravel 11 + PHP 8.2 + Sanctum API authentication
- **Database**: PostgreSQL via Supabase (production) + SQLite (development)
- **Testing**: Vitest (unit) + Playwright (E2E) + PHPUnit (backend)
- **Deployment**: Docker + GitHub Actions CI/CD + Cloudflare Tunnel

### **Africa-First Design Philosophy**
- **Offline-First**: Core features work without internet
- **Mobile-First**: Android optimization, 375px primary breakpoint
- **Low-Bandwidth**: < 500KB bundle, < 3s load on 3G networks
- **Touch-Optimized**: 48px minimum touch targets
- **Cultural Sensitivity**: African church contexts and workflows
- **Enterprise-Ready**: Multi-tenant scalable architecture

## 🎨 Green Dark Theme

### **Color Palette**
- **Primary**: Bright Green (#1CE479) - buttons, links, active states
- **Background**: Dark Navy (#0A0A0F) - main app background
- **Surface**: Card Dark (#1A1A20) - cards, modals, elevated surfaces
- **Secondary**: Medium Gray (#2A2A35) - borders, dividers, secondary text
- **Text Primary**: White (#FFFFFF) - main text
- **Text Secondary**: Light Gray (#B0B0B0) - secondary text

### **Typography**
- **Font Family**: Archivo (modern, clean, readable)
- **Headings**: Archivo Bold (24px, 20px, 18px, 16px)
- **Body**: Archivo Regular (16px, 14px)
- **Captions**: Archivo Regular (12px)

## 🧩 Quasar Framework Component Mapping

### **Essential Components**
- **Buttons**: q-btn (primary, secondary, outline, flat)
- **Cards**: q-card with q-card-section
- **Inputs**: q-input, q-select, q-checkbox, q-radio
- **Tables**: q-table with q-td, q-th
- **Navigation**: q-tabs, q-tab-panels, q-breadcrumbs
- **Layout**: q-page, q-header, q-drawer, q-footer
- **Icons**: q-icon with Material Design Icons (mdi-*)

### **Data Display**
- **Lists**: q-list with q-item, q-item-section
- **Chips**: q-chip for tags and status indicators
- **Badges**: q-badge for notifications and counts
- **Avatars**: q-avatar for user photos
- **Progress**: q-linear-progress, q-circular-progress

### **Feedback**
- **Dialogs**: q-dialog for modals and confirmations
- **Notifications**: q-notify for toast messages
- **Loading**: q-spinner for loading states
- **Tooltips**: q-tooltip for help text

## 📱 Mobile-First Layout Principles

### **Responsive Breakpoints**
- **xs**: < 600px (mobile phones)
- **sm**: 600px - 1023px (tablets)
- **md**: 1024px - 1439px (small laptops)
- **lg**: 1440px - 1919px (laptops)
- **xl**: ≥ 1920px (desktops)

### **Touch Interface Guidelines**
- **Minimum touch target**: 48px × 48px
- **Comfortable spacing**: 16px between interactive elements
- **Thumb zones**: Important actions in bottom 1/3 of screen
- **Swipe gestures**: Support for common mobile interactions

### **Offline Visual Indicators**
- **Connection status**: Green dot (online), red dot (offline)
- **Sync status**: Spinning icon (syncing), checkmark (synced)
- **Cached data**: Subtle gray background or icon
- **Pending actions**: Yellow warning icon with count

## 🎯 Figma Make Instructions

### **Component Naming Convention**
Use semantic, hierarchical naming:
- **Layout**: `layout/header`, `layout/sidebar`, `layout/main`
- **Forms**: `form/login`, `form/member-add`, `form/attendance`
- **Cards**: `card/member`, `card/event`, `card/metric`
- **Buttons**: `btn/primary`, `btn/secondary`, `btn/danger`
- **Navigation**: `nav/main`, `nav/breadcrumb`, `nav/tabs`

### **Layout Structure**
```
App Layout
├── Header (q-header)
│   ├── Logo
│   ├── Navigation (q-tabs)
│   └── User Menu
├── Sidebar (q-drawer) [Desktop]
│   ├── Main Navigation
│   └── Quick Actions
├── Main Content (q-page)
│   ├── Page Header
│   ├── Content Area
│   └── Action Buttons
└── Bottom Navigation (q-footer) [Mobile]
    └── Tab Navigation
```

### **Design Priorities**
1. **Mobile-first**: Design for 375px width first
2. **Touch-friendly**: Large buttons and comfortable spacing
3. **Offline-aware**: Clear visual feedback for connection states
4. **Performance**: Minimal complexity, efficient layouts
5. **Accessibility**: High contrast, clear hierarchy, semantic structure

### **Content Guidelines**
- **Use realistic church data**: "Grace Community Church", "Pastor John Smith"
- **African context**: Names like "Emmanuel", "Grace", "Victory" churches
- **Real metrics**: "247 members", "85% attendance", "$12,450 monthly giving"
- **Practical features**: "Sunday Service", "Bible Study", "Youth Group"

## 🚀 Quick Start Checklist

Before creating any wireframe:
- [ ] Identify target screen size (mobile-first)
- [ ] Choose appropriate Quasar components
- [ ] Use semantic component naming
- [ ] Include offline/connection indicators
- [ ] Design for touch interaction (48px targets)
- [ ] Consider African church context
- [ ] Plan for green dark theme application

## 📋 Output Requirements

### **Wireframe Specifications**
- **Clean, semantic structure** ready for styling
- **Proper component hierarchy** matching Quasar Framework
- **Responsive behavior** documented
- **Interaction states** defined (hover, active, disabled)
- **Accessibility considerations** included (ARIA labels, semantic HTML)

### **Handoff Preparation**
- **Component names** match Quasar conventions
- **Layout logic** clearly defined
- **Spacing system** consistent (8px grid)
- **Content structure** ready for real data
- **Technical constraints** respected

---

**Copy this entire prompt into Figma Make before starting any wireframe creation. This provides the essential context for creating ChurchAfrica ChMS wireframes that align with our technical architecture and design philosophy.**
