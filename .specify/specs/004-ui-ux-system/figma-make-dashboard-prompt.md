# ChurchAfrica ChMS - Dashboard Wireframe Prompt
**Figma Make Prompt for Main Dashboard Interface**

## 📋 Prerequisites
**IMPORTANT**: Copy and paste the entire `figma-make-master-prompt.md` content first, then add this prompt for dashboard-specific wireframing.

## 🎯 Dashboard Overview

Create a **customizable church dashboard** with drag-and-drop cards, role-based layouts, and mobile-first design. The dashboard serves as the main hub for church administrators, pastors, and staff.

### **Dashboard Layout Structure**
```
Dashboard Page
├── Page Header
│   ├── Church Name + Logo
│   ├── Current Date/Time
│   └── Quick Actions (+ Add Member, Record Attendance)
├── Top Metrics Bar (Always Visible)
│   ├── Total Members Card
│   ├── Weekly Attendance Card
│   ├── Monthly Giving Card
│   └── Active Volunteers Card
├── Main Dashboard Grid (Customizable)
│   ├── Recent Members Card
│   ├── Upcoming Events Card
│   ├── Prayer Requests Card
│   ├── Attendance Trends Chart
│   ├── Giving Trends Chart
│   ├── Ministry Teams Card
│   ├── Recent Activity Feed
│   └── Quick Actions Card
└── Sidebar (Desktop) / Bottom Sheet (Mobile)
    ├── This Week Summary
    ├── This Month Summary
    └── Customize Dashboard Button
```

## 📊 Specific Card Requirements

### **Top Metrics Bar (4 Cards - Always Visible)**

#### **1. Total Members Card**
- **Primary Number**: "1,247" (large, bold)
- **Trend Indicator**: "+12 this month" with green up arrow
- **Icon**: mdi-account-group
- **Background**: Subtle gradient with member icon
- **Size**: 1x1 grid unit

#### **2. Weekly Attendance Card**
- **Primary Number**: "342" (large, bold)
- **Trend Indicator**: "↑ 8% vs last week" with blue arrow
- **Icon**: mdi-calendar-check
- **Progress Bar**: 85% of capacity (visual indicator)
- **Size**: 1x1 grid unit

#### **3. Monthly Giving Card**
- **Primary Number**: "$8,450" (large, bold)
- **Progress Indicator**: "92% of budget" with progress bar
- **Icon**: mdi-currency-usd
- **Trend**: "+5% vs last month" with green indicator
- **Size**: 1x1 grid unit

#### **4. Active Volunteers Card**
- **Primary Number**: "89" (large, bold)
- **Trend Indicator**: "↑ 5 this month" with orange arrow
- **Icon**: mdi-hand-heart
- **Quick Action**: "View All" button
- **Size**: 1x1 grid unit

### **Main Dashboard Grid (8 Customizable Cards)**

#### **1. Recent Members Card (2x1)**
- **Header**: "Recent Members" with "View All" link
- **Content**: 5 member rows with:
  - Profile photo (q-avatar)
  - Name and join date
  - Contact status (email/phone icons)
  - Quick action menu (3 dots)
- **Footer**: "5 new members this week"

#### **2. Upcoming Events Card (2x1)**
- **Header**: "Upcoming Events" with "Add Event" button
- **Content**: 3 events with:
  - Event name and date/time
  - Location and RSVP count
  - Event type icon (service, meeting, social)
  - Quick RSVP button
- **Footer**: "12 events this month"

#### **3. Prayer Requests Card (1x2)**
- **Header**: "Prayer Requests" with "Add Request" button
- **Content**: 3 latest requests with:
  - Request text (truncated)
  - Requester name and date
  - "Pray" button with count
  - Privacy indicator (public/private)
- **Footer**: "23 active requests"

#### **4. Attendance Trends Chart (2x1)**
- **Header**: "Attendance Trends" with time period selector
- **Content**: Line chart showing:
  - 12-week attendance data
  - Multiple service comparison
  - Trend line and percentage change
  - Interactive hover states
- **Footer**: Average and peak attendance

#### **5. Giving Trends Chart (2x1)**
- **Header**: "Giving Trends" with "View Report" link
- **Content**: Bar chart showing:
  - 6-month giving data
  - Budget vs actual comparison
  - Category breakdown (tithes, offerings, special)
  - Goal progress indicators
- **Footer**: YTD total and budget percentage

#### **6. Ministry Teams Card (1x2)**
- **Header**: "Ministry Teams" with "Manage Teams" button
- **Content**: Team list with:
  - Team name and leader
  - Member count and capacity
  - Meeting schedule
  - "Manage" button for each team
- **Footer**: "8 active ministries"

#### **7. Recent Activity Feed (1x2)**
- **Header**: "Recent Activity" with "View All" link
- **Content**: 10 latest activities with:
  - Activity type icon
  - Description and timestamp
  - User who performed action
  - Related record link
- **Footer**: "Show more activities"

#### **8. Quick Actions Card (1x1)**
- **Header**: "Quick Actions"
- **Content**: 4 primary action buttons:
  - "Add Member" (mdi-account-plus)
  - "Record Attendance" (mdi-calendar-check)
  - "Create Event" (mdi-calendar-plus)
  - "Send Announcement" (mdi-bullhorn)
- **Layout**: 2x2 grid of large touch-friendly buttons

## 📱 Mobile Adaptations

### **Mobile Layout (375px width)**
- **Top Metrics**: Horizontal scroll with 4 cards
- **Main Grid**: Single column, stacked cards
- **Card Sizing**: Full width, optimized height
- **Touch Targets**: Minimum 48px for all interactive elements
- **Swipe Gestures**: Horizontal swipe for metrics, vertical scroll for main content

### **Tablet Layout (768px width)**
- **Top Metrics**: 4 cards in single row
- **Main Grid**: 2-column layout
- **Card Sizing**: Responsive grid (1x1, 2x1, 1x2)
- **Sidebar**: Collapsible sidebar with quick stats

## 🎛️ Customization Features

### **Drag-and-Drop Interface**
- **Edit Mode Toggle**: "Customize Dashboard" button
- **Drag Handles**: Visible when in edit mode
- **Drop Zones**: Clear visual indicators
- **Card Sizing**: Resize handles for supported cards
- **Save/Cancel**: Clear action buttons

### **Card Management**
- **Show/Hide Cards**: Toggle visibility for each card
- **Card Library**: Available cards to add
- **Reset to Default**: Restore default layout
- **Role-Based Defaults**: Different layouts for Pastor, Admin, Staff

### **Mobile Priority Settings**
- **Priority Order**: Set which cards appear first on mobile
- **Mobile-Only Cards**: Cards that only show on mobile
- **Collapsed States**: Cards that can be minimized

## 🔧 Technical Requirements

### **Component Specifications**
- **Grid System**: CSS Grid with 12-column layout
- **Card Component**: q-card with consistent padding and shadows
- **Responsive Behavior**: Breakpoint-specific layouts
- **Loading States**: Skeleton screens for each card type
- **Error States**: Fallback content when data fails to load

### **Interaction States**
- **Hover**: Subtle elevation increase for cards
- **Active**: Visual feedback for drag operations
- **Loading**: Shimmer effect for loading cards
- **Empty**: Helpful empty states with action prompts
- **Offline**: Clear indicators when data is cached

### **Accessibility**
- **Keyboard Navigation**: Tab order and focus management
- **Screen Readers**: Proper ARIA labels and descriptions
- **High Contrast**: Ensure readability in all states
- **Touch Accessibility**: Large targets and clear feedback

---

**Use this prompt with the master prompt to create comprehensive dashboard wireframes that align with ChurchAfrica ChMS technical architecture and user needs.**
