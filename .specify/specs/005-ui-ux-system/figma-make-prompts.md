# ChurchAfrica ChMS – Figma Make Prompt Templates
**Wireframing, Structure & Logic-First Design Prompts**

## 🏗️ Technical Architecture

### **Tech Stack**
- **Frontend**: Vue 3 + Composition API + TypeScript + Pinia (state management)
- **UI Framework**: Quasar Framework (Material Design components)
- **Backend**: Laravel 11 + PHP 8.2 + Sanctum (API authentication)
- **Database**: PostgreSQL via Supabase (production) + SQLite (development)
- **Testing**: Vitest (unit) + Playwright (E2E) + PHPUnit (backend)
- **Deployment**: Docker + GitHub Actions CI/CD + Cloudflare Tunnel
- **AI Integration**: Mem0 self-hosted memory system (planned)

### **Design Philosophy: Africa-First**
- **Offline-First**: Core features work without internet connection
- **Mobile-First**: Optimized for Android devices and touch interfaces
- **Low-Bandwidth**: < 500KB bundle size, < 3s load time on 3G
- **Cultural Sensitivity**: Designed for African church contexts and workflows
- **Enterprise-Ready**: Multi-tenant architecture for scalable church networks
- **Accessibility**: WCAG AA compliance with touch-friendly interfaces

## 🧠 Figma Make Philosophy

Figma Make prompts should focus on:
- **Structure First**: Layout logic and component hierarchy before visual design
- **Functionality Focus**: User flows, interactions, and information architecture
- **Rapid Iteration**: Quick wireframing and concept validation
- **Technical Foundation**: Code generation and handoff preparation
- **Responsive Logic**: Layout behavior across devices without visual styling
- **Quasar Mapping**: Components that map directly to Quasar Framework elements

> **🔄 Workflow Integration**: These Make prompts create the structural foundation that [figma-ai-prompts.md](figma-ai-prompts.md) will enhance with visual design and branding.

## 🎯 Core Structural Principles

### Layout Architecture
- **Grid Systems**: 12-column responsive grid with clear breakpoints
- **Component Hierarchy**: Logical nesting and organization
- **Information Architecture**: Clear content prioritization and flow
- **Interaction Patterns**: Consistent navigation and user actions
- **Responsive Behavior**: Layout adaptation logic without visual styling

### Technical Requirements
- **Component Naming**: Semantic naming for easy handoff (`header-nav`, `member-card`, `attendance-form`)
- **Code Generation**: Production-ready HTML/CSS structure
- **Accessibility Structure**: Proper semantic HTML and ARIA labels
- **Performance Logic**: Efficient DOM structure and minimal complexity

### Green Dark Theme Integration
- **Primary Color**: Bright Green (#1CE479) for active states and primary actions
- **Background**: Dark Navy (#0A0A0F) for main backgrounds
- **Cards**: Card Dark (#1A1A20) for elevated surfaces
- **Secondary**: Medium Gray (#2A2A35) for supporting elements
- **Typography**: Archivo font family for modern, clean appearance
- **Glass Morphism**: Subtle transparency effects for depth and modern feel

### Chat Feature Integration
- **Chat Sidebar**: Real-time messaging interface with conversation list
- **Message Components**: Chat bubbles, input fields, user avatars
- **Notification System**: Unread message indicators and badges
- **Mobile Integration**: Chat tab in bottom navigation, floating action button

## 🧼 Prompt Hygiene Checklist

Before writing any Figma Make prompt, ensure:
- [ ] **Semantic component names** (e.g., `form/input/email`, `btn/primary`, `card/member`)
- [ ] **Layout direction and spacing** specified (vertical stack, 24px spacing)
- [ ] **Accessibility notes** included (ARIA labels, semantic HTML)
- [ ] **Screen size or device context** referenced (mobile-first, 375px breakpoint)
- [ ] **Avoid visual styling** unless necessary for structure
- [ ] **Include interaction states** (loading, error, success, empty)
- [ ] **Specify responsive behavior** (how layout adapts across devices)

## 📝 Prompt Syntax Examples

### Basic Syntax Template
```plaintext
Prompt: Create a wireframe for [specific functionality] with:
- [Component 1]: [layout requirements]
- [Component 2]: [interaction behavior]
- [Component 3]: [responsive logic]
- Semantic names: [component/type/variant]
- Accessibility: [ARIA requirements]
- Code output: [HTML/CSS structure needed]
```

### Example: Mobile-First Login
```plaintext
Prompt: Create a wireframe for a mobile-first login screen with:
- ChurchAfrica logo centered at top
- Email and password fields stacked vertically with 16px spacing
- Primary login button with 48px touch target
- "Forgot password" link below button
- Semantic component names: form/input/email, form/input/password, btn/primary
- ARIA labels for screen readers
- Loading state container for form submission
- Error message container below each field
```

### Example: Dashboard Widget Grid
```plaintext
Prompt: Create a wireframe for dashboard widget grid with:
- Responsive grid: 1 column mobile, 2 columns tablet, 3 columns desktop
- Widget containers with consistent internal structure
- Header area, content area, action area for each widget
- Semantic names: widget/metric, widget/chart, widget/activity
- Loading skeleton structure for each widget type
- Empty state containers when no data available
```

## 🔗 Make-to-AI Mapping Table

| Figma Make Component | Figma AI Styling Prompt | Implementation Notes |
|----------------------|-------------------------|---------------------|
| `card/member` | Apply `var/shadow/medium`, `var/radius/large`, member photo placeholder | Member profile cards with status indicators |
| `btn/primary` | Use `var/color/primary` (#1CE479), hover/active states, 48px height | Main CTA buttons with touch-friendly sizing |
| `form/input/email` | Add validation states, `var/spacing/medium`, focus indicators | Accessible form fields with error handling |
| `widget/metric` | Apply dashboard styling, `var/color/accent` (#FFB800) for highlights | Statistics widgets with trend indicators |
| `nav/sidebar` | Use `var/color/card` (#1A1A20), collapsible behavior, active states | Navigation with mobile hamburger pattern |
| `list/member` | Alternating row colors, selection states, bulk action support | Data tables with sorting and filtering |
| `modal/confirm` | Overlay styling, backdrop blur, focus management | Confirmation dialogs with proper focus trap |
| `feed/activity` | Timeline styling, relative timestamps, infinite scroll | Activity streams with real-time updates |

## 🧩 Wireframe Templates

### 📱 Authentication Flow Wireframe

**Prompt:**
Create a wireframe for ChurchAfrica ChMS authentication system focusing on structure and user flow.

**Layout Requirements:**
- **Login Screen**: Centered form container, logo placement, input fields (email, password), primary action button, secondary links
- **Registration Screen**: Multi-step form layout, progress indicator, field grouping logic
- **Password Reset**: Simple single-field form with clear action hierarchy
- **Component Structure**: Reusable form components, consistent button hierarchy, error state containers

**Semantic Component Names:**
- `form/auth/login`, `form/auth/register`, `form/auth/reset`
- `input/email`, `input/password`, `input/confirm-password`
- `btn/primary`, `btn/secondary`, `link/forgot-password`
- `container/error`, `container/loading`, `indicator/progress`

### 💬 Chat System Wireframe (NEW)

**Prompt:**
Create a wireframe for ChurchAfrica ChMS chat system focusing on real-time messaging structure and user interaction flow.

**Layout Requirements:**
- **Chat Sidebar**: Conversation list, search functionality, new message button, user status indicators
- **Message Interface**: Chat bubbles, message input, typing indicators, message status
- **Mobile Integration**: Bottom navigation tab, floating action button for new messages
- **Notification System**: Unread message badges, notification indicators, sound controls

**Semantic Component Names:**
- `chat/sidebar`, `chat/conversation-list`, `chat/message-input`
- `bubble/sent`, `bubble/received`, `bubble/system`
- `avatar/user`, `status/online`, `status/offline`
- `badge/unread`, `notification/sound`, `indicator/typing`
- `btn/new-message`, `btn/attach-file`, `btn/emoji-picker`

**Figma Make Implementation:**
```
Create a ChurchAfrica ChMS chat system wireframe using this hybrid approach:

LAYOUT INTELLIGENCE from: https://www.figma.com/make/KUXX2InwPwj7znvdP3J5ic/Futuristic-Business-Management-Dashboard
- Adopt: Sidebar conversation list with user avatars and status indicators
- Adopt: Message interface with clear conversation flow
- Adopt: Search and filter organization for conversations
- Adopt: User profile integration and quick actions
- Adopt: Notification system with unread message indicators

VISUAL FOUNDATION from: https://www.figma.com/make/cEmpnUsIpqHYZvR7OboEwl/Gambling-Casino-Website
- Adopt: Clean, minimal chat bubble styling
- Adopt: Simple message input and attachment controls
- Adopt: Straightforward user avatar and status indicators
- Adopt: Uncluttered conversation layout with clear message hierarchy

CHURCH CONTEXT ADAPTATIONS:
- Replace business conversations with church communication: Ministry teams, event planning, prayer requests, announcements
- Adapt messaging workflows for church communication: Group chats for ministries, event coordination, prayer request sharing, announcement distribution
- Simplify complex messaging features for church administrator needs: Basic text messaging, file sharing, prayer request coordination, event announcements
- Optimize for mobile usage: Church staff using phones/tablets for real-time communication and coordination

LAYOUT REQUIREMENTS:
- Desktop: 3-column layout (sidebar + main chat + secondary panel)
- Tablet: 2-column layout (collapsible sidebar + main chat)
- Mobile: Single column with bottom navigation and slide-out chat
- Touch targets: Minimum 48px for all interactive elements
- Accessibility: Screen reader compatible message interface with proper ARIA labels

COMPONENT STRUCTURE:
- Chat Sidebar: Conversation list, search, new message button, user status, group categories
- Main Chat: Message bubbles, typing indicators, message input, attachment controls
- Secondary Panel: User profiles, group details, shared files, prayer requests
- Mobile: Bottom navigation with chat, conversations, new message, notifications, more

SEMANTIC NAMING:
- chat/sidebar, chat/conversation-list, chat/message-input, chat/typing-indicator
- bubble/sent, bubble/received, bubble/system, bubble/prayer-request, bubble/announcement
- avatar/user, avatar/group, status/online, status/offline, status/typing
- badge/unread, badge/group, notification/sound, notification/push
- actions/new-message, actions/attach-file, actions/emoji-picker, actions/voice-message
- mobile/chat-tab, mobile/conversation-list, mobile/message-input, mobile/bottom-nav
```

### 🏗️ **Hybrid Dashboard Layout (NEW - Smart UX Adaptation)**

**Prompt:**
Create a ChurchAfrica ChMS dashboard wireframe with SPECIFIC cards and functionality, combining layout intelligence from two proven designs:

**REFERENCE 1 (Layout Structure)**: https://www.figma.com/make/KUXX2InwPwj7znvdP3J5ic/Futuristic-Business-Management-Dashboard
- **Adopt**: 3-column layout structure (sidebar + main + secondary)
- **Adopt**: Card-based information hierarchy and metrics placement
- **Adopt**: Navigation structure and content organization patterns
- **Adopt**: Progressive disclosure and information layering

**REFERENCE 2 (Visual Approach)**: https://www.figma.com/make/cEmpnUsIpqHYZvR7OboEwl/Gambling-Casino-Website
- **Adopt**: Clean, minimal aesthetic approach
- **Adopt**: Simple, readable typography hierarchy
- **Adopt**: Straightforward component styling
- **Adopt**: Uncluttered design philosophy

**SPECIFIC DASHBOARD CARDS (EXACT REQUIREMENTS):**

**Top Metrics Bar (4 cards, always visible):**
1. **Total Members**: Current count + monthly growth percentage
2. **Weekly Attendance**: Last Sunday + trend arrow (up/down/stable)
3. **Monthly Giving**: Current month total + percentage vs. budget
4. **Active Volunteers**: Count of volunteers who served this month

**Main Dashboard Grid (customizable, drag-and-drop):**
1. **Recent Members Card**: Last 5 new members with photos and join dates
2. **Upcoming Events Card**: Next 3 events with dates, times, and RSVP counts
3. **Prayer Requests Card**: Latest 3 prayer requests with "Pray" button
4. **Attendance Trends Chart**: 12-week attendance line chart
5. **Giving Trends Chart**: Monthly giving bar chart (6 months)
6. **Ministry Teams Card**: List of teams with member counts and "Manage" buttons
7. **Recent Activity Feed**: Last 10 actions (new members, events created, etc.)
8. **Quick Actions Card**: "Add Member", "Record Attendance", "Create Event", "Send Announcement"

**Sidebar Quick Stats (always visible):**
- **This Week**: Attendance count, new members, events
- **This Month**: Total giving, volunteer hours, prayer requests
- **Alerts**: Birthdays today, upcoming events, overdue tasks

**CUSTOMIZATION FEATURES:**
- **Drag-and-drop**: Rearrange main grid cards
- **Show/Hide**: Toggle cards on/off
- **Card Sizes**: Small (1x1), Medium (2x1), Large (2x2)
- **Role Defaults**: Pastor sees giving/attendance, Staff sees events/volunteers
- **Mobile Priority**: Choose which 3 cards show first on mobile

**Layout Requirements:**
- **Sidebar (280px)**: Church navigation, user profile, quick stats
- **Main Area (flexible)**: Dashboard cards with church metrics and recent activity
- **Secondary Area (320px)**: Chat system, upcoming events, prayer requests
- **Mobile**: Collapsible sidebar, stacked cards, bottom navigation

**Semantic Component Names:**
- `dashboard/layout`, `dashboard/sidebar`, `dashboard/main-content`, `dashboard/secondary-panel`
- `metrics/total-members`, `metrics/weekly-attendance`, `metrics/upcoming-events`
- `card/metric`, `card/activity`, `card/quick-action`
- `nav/church-menu`, `nav/user-profile`, `nav/quick-stats`
- `chat/conversation-list`, `chat/message-preview`, `chat/notification-badge`

**Figma Make Implementation:**
```
Create ChurchAfrica ChMS dashboard wireframe with EXACT specifications:

LAYOUT REFERENCE: https://www.figma.com/make/KUXX2InwPwj7znvdP3J5ic/Futuristic-Business-Management-Dashboard
- Use: 3-column grid (280px sidebar + flexible main + 320px chat)
- Use: Top metrics bar with 4 KPI cards
- Use: Card-based grid for main content area
- Use: Sidebar navigation structure

VISUAL REFERENCE: https://www.figma.com/make/cEmpnUsIpqHYZvR7OboEwl/Gambling-Casino-Website
- Use: Clean, minimal card styling
- Use: Simple typography hierarchy
- Use: Uncluttered layout approach

EXACT DASHBOARD REQUIREMENTS:

TOP METRICS BAR (4 cards, always visible):
1. Total Members: "1,247" + "+12 this month" + green arrow
2. Weekly Attendance: "342" + "↑ 8% vs last week" + blue arrow
3. Monthly Giving: "$8,450" + "92% of budget" + progress bar
4. Active Volunteers: "89" + "↑ 5 this month" + orange arrow

MAIN DASHBOARD GRID (8 customizable cards):
1. Recent Members Card: 5 member photos + names + join dates
2. Upcoming Events Card: 3 events with dates, times, RSVP counts
3. Prayer Requests Card: 3 latest requests + "Pray" buttons
4. Attendance Trends Chart: 12-week line chart
5. Giving Trends Chart: 6-month bar chart
6. Ministry Teams Card: Team names + member counts + "Manage" buttons
7. Recent Activity Feed: 10 latest actions with timestamps
8. Quick Actions Card: 4 buttons (Add Member, Record Attendance, Create Event, Send Announcement)

SIDEBAR QUICK STATS:
- This Week: Attendance count, new members, events
- This Month: Total giving, volunteer hours, prayer requests
- Alerts: Birthdays today, upcoming events, overdue tasks

CUSTOMIZATION FEATURES:
- Drag-and-drop: Rearrange main grid cards
- Show/Hide: Toggle cards on/off
- Card Sizes: Small (1x1), Medium (2x1), Large (2x2)
- Role Defaults: Pastor sees giving/attendance, Staff sees events/volunteers
- Mobile Priority: Choose which 3 cards show first on mobile

LAYOUT REQUIREMENTS:
- Desktop: 3-column grid (280px + flexible + 320px)
- Tablet: 2-column grid (collapsible sidebar + main content)
- Mobile: Single column with bottom navigation and slide-out panels
- Touch targets: Minimum 48px for all interactive elements
- Accessibility: Screen reader compatible and keyboard navigable

SEMANTIC NAMING:
- dashboard/layout, dashboard/sidebar, dashboard/main-content, dashboard/secondary-panel
- metrics/total-members, metrics/weekly-attendance, metrics/monthly-giving, metrics/active-volunteers
- card/recent-members, card/upcoming-events, card/prayer-requests, card/attendance-trends
- card/giving-trends, card/ministry-teams, card/activity-feed, card/quick-actions
- sidebar/quick-stats, sidebar/alerts, sidebar/this-week, sidebar/this-month
- mobile/bottom-nav, mobile/slide-out, mobile/collapsible-sidebar
```

### 📊 **Church Metrics Dashboard (NEW - Data-Focused Layout)**

**Prompt:**
Create a church metrics dashboard wireframe using proven business dashboard patterns adapted for church management:

**REFERENCE LAYOUT**: https://www.figma.com/make/KUXX2InwPwj7znvdP3J5ic/Futuristic-Business-Management-Dashboard
- **Adopt**: Top metrics bar with key performance indicators
- **Adopt**: Grid-based card layout for data visualization
- **Adopt**: Sidebar navigation with contextual actions
- **Adopt**: Information hierarchy and content prioritization

**CHURCH METRICS FOCUS:**
- **Primary Metrics**: Total members, weekly attendance, monthly giving, active volunteers
- **Trend Data**: Attendance growth, member retention, event participation
- **Quick Actions**: Add new member, record attendance, create event, send announcement
- **Recent Activity**: New members, attendance records, event updates, prayer requests

**Layout Structure:**
- **Header**: Church name, user profile, notifications, search
- **Metrics Bar**: 4 key metrics in prominent cards
- **Main Grid**: 2x2 or 3x2 card layout for detailed metrics and charts
- **Sidebar**: Quick actions, recent activity, upcoming events
- **Mobile**: Stacked layout with collapsible sections

**Semantic Component Names:**
- `metrics/primary-kpi`, `metrics/trend-chart`, `metrics/comparison-card`
- `actions/quick-add`, `actions/record-attendance`, `actions/create-event`
- `activity/recent-members`, `activity/attendance-log`, `activity/event-updates`
- `navigation/church-menu`, `navigation/user-actions`, `navigation/quick-stats`

**Figma Make Implementation:**
```
Create a ChurchAfrica ChMS metrics dashboard wireframe using this data-focused approach:

LAYOUT INTELLIGENCE from: https://www.figma.com/make/KUXX2InwPwj7znvdP3J5ic/Futuristic-Business-Management-Dashboard
- Adopt: Top metrics bar with 4 prominent KPI cards
- Adopt: Grid-based layout for detailed data visualization
- Adopt: Sidebar with contextual actions and quick stats
- Adopt: Information hierarchy with primary, secondary, and tertiary content
- Adopt: Card-based organization for different data types

VISUAL FOUNDATION from: https://www.figma.com/make/cEmpnUsIpqHYZvR7OboEwl/Gambling-Casino-Website
- Adopt: Clean, minimal card styling for data presentation
- Adopt: Simple, readable typography for metrics and labels
- Adopt: Straightforward chart and graph styling
- Adopt: Uncluttered layout with clear data hierarchy

CHURCH METRICS FOCUS:
- Primary Metrics: Total Members (1,247), Weekly Attendance (342), Monthly Giving ($8,450), Active Volunteers (89)
- Trend Data: Attendance growth chart, member retention graph, event participation trends
- Quick Actions: Add New Member, Record Attendance, Create Event, Send Announcement
- Recent Activity: New members list, attendance records, event updates, prayer requests

LAYOUT REQUIREMENTS:
- Desktop: 2-column layout (main content + sidebar)
- Tablet: Stacked layout with collapsible sidebar
- Mobile: Single column with bottom navigation
- Touch targets: Minimum 48px for all interactive elements
- Accessibility: Screen reader compatible data tables and charts

COMPONENT STRUCTURE:
- Header: Church name, user profile, notifications, search, date picker
- Metrics Bar: 4 KPI cards with values, trends, and comparison indicators
- Main Grid: Attendance chart, member growth graph, giving trends, volunteer activity
- Sidebar: Quick actions, recent activity feed, upcoming events, prayer requests
- Mobile: Bottom navigation with metrics, members, events, attendance, more

SEMANTIC NAMING:
- metrics/primary-kpi, metrics/trend-chart, metrics/comparison-card, metrics/growth-indicator
- actions/quick-add-member, actions/record-attendance, actions/create-event, actions/send-announcement
- activity/recent-members, activity/attendance-log, activity/event-updates, activity/prayer-requests
- navigation/church-menu, navigation/user-actions, navigation/quick-stats, navigation/date-filter
- mobile/bottom-nav, mobile/metrics-tab, mobile/collapsible-charts
```

**Technical Specifications:**
- Use semantic HTML structure (form, fieldset, legend elements)
- Include ARIA labels and accessibility attributes
- Generate responsive grid layout (mobile-first approach)

### 🎯 **Hybrid Implementation Strategy (NEW)**

#### **Phase 1: Layout Foundation (Week 1)**
**Goal**: Create wireframes using hybrid prompts with proven UX patterns

**Implementation Tasks:**
- ✅ **Hybrid Dashboard Wireframe**: Use both reference URLs for layout intelligence
- ✅ **Church Metrics Wireframe**: Adapt business dashboard patterns for church context
- ✅ **Chat System Wireframe**: Real-time messaging with church-specific features
- ✅ **Mobile Layout Wireframes**: Responsive adaptations for church staff usage

**Key Benefits:**
- **Proven UX Patterns**: Leverage successful information architecture
- **Church Context**: Adapt business patterns for church management needs
- **Mobile-First**: Optimize for Africa's mobile-first usage patterns
- **Performance-Conscious**: Layout intelligence without visual complexity

#### **Phase 2: Component Development (Weeks 2-3)**
**Goal**: Build Vue components following wireframe structure

**Component Priority:**
1. **Dashboard Layout**: 3-column responsive grid system
2. **Metrics Cards**: Church KPIs with clean data presentation
3. **Navigation Sidebar**: Church-specific menu with user profile
4. **Chat Interface**: Real-time messaging with church context
5. **Mobile Navigation**: Bottom nav and collapsible panels

**Technical Approach:**
- **Quasar Components**: Leverage existing component library
- **Green Theme**: Apply current color system to new layouts
- **Accessibility**: Maintain WCAG AA compliance
- **Performance**: Optimize for low-end devices and slow connections

#### **Phase 3: Content Integration (Week 4)**
**Goal**: Populate layouts with actual church data structures

**Content Strategy:**
- **Real Church Data**: Use actual member, attendance, and event data
- **Information Hierarchy**: Test with church administrator workflows
- **User Testing**: Validate layout with real church staff
- **Performance Testing**: Ensure layouts work on target devices

### 🚀 **Hybrid Prompt Template (NEW)**

#### **Template for Any Church Management Layout:**

```
Create a [SPECIFIC_LAYOUT] wireframe for ChurchAfrica ChMS combining:

LAYOUT INTELLIGENCE from: [FUTURISTIC_DASHBOARD_URL]
- Adopt: [SPECIFIC_LAYOUT_PATTERNS]
- Adopt: [INFORMATION_ARCHITECTURE_PATTERNS]
- Adopt: [NAVIGATION_STRUCTURE_PATTERNS]

VISUAL FOUNDATION from: [CASINO_DESIGN_URL]
- Adopt: [CLEAN_AESTHETIC_APPROACH]
- Adopt: [SIMPLE_TYPOGRAPHY_HIERARCHY]
- Adopt: [STRAIGHTFORWARD_COMPONENT_STYLING]

CHURCH CONTEXT ADAPTATIONS:
- Replace [BUSINESS_METRICS] with [CHURCH_METRICS]
- Adapt [BUSINESS_WORKFLOWS] for [CHURCH_WORKFLOWS]
- Simplify [COMPLEX_FEATURES] for [CHURCH_ADMINISTRATOR_NEEDS]
- Optimize for [MOBILE_USAGE_PATTERNS]

LAYOUT REQUIREMENTS:
- [SPECIFIC_LAYOUT_MEASUREMENTS]
- [RESPONSIVE_BEHAVIOR_PATTERNS]
- [ACCESSIBILITY_REQUIREMENTS]
- [PERFORMANCE_CONSIDERATIONS]
```

#### **Example Usage:**

```
Create a MEMBER MANAGEMENT wireframe for ChurchAfrica ChMS combining:

LAYOUT INTELLIGENCE from: https://www.figma.com/make/KUXX2InwPwj7znvdP3J5ic/Futuristic-Business-Management-Dashboard
- Adopt: Data table layout patterns
- Adopt: Filter and search organization
- Adopt: Action button placement and hierarchy

VISUAL FOUNDATION from: https://www.figma.com/make/cEmpnUsIpqHYZvR7OboEwl/Gambling-Casino-Website
- Adopt: Clean table styling
- Adopt: Simple form layouts
- Adopt: Minimal button designs

CHURCH CONTEXT ADAPTATIONS:
- Replace customer data with member information (name, contact, membership date, attendance status)
- Adapt business workflows for church member management (add member, update info, record attendance, send communications)
- Simplify complex CRM features for church administrator needs (basic member profiles, attendance tracking, communication tools)
- Optimize for mobile usage (church staff using phones/tablets for member check-ins)

LAYOUT REQUIREMENTS:
- Desktop: Full table with filters and actions
- Tablet: Condensed table with swipe actions
- Mobile: Card-based layout with collapsible details
- Accessibility: Screen reader friendly data tables
- Performance: Lazy loading for large member lists
```

### 👥 **Member Management Wireframe (NEW - Hybrid Approach)**

**Figma Make Implementation:**
```
Create a ChurchAfrica ChMS member management wireframe using this hybrid approach:

LAYOUT INTELLIGENCE from: https://www.figma.com/make/KUXX2InwPwj7znvdP3J5ic/Futuristic-Business-Management-Dashboard
- Adopt: Data table layout with sortable columns and filters
- Adopt: Search and filter organization in header area
- Adopt: Action button placement and hierarchy (primary, secondary, tertiary)
- Adopt: Pagination and bulk action patterns
- Adopt: Sidebar with member categories and quick filters

VISUAL FOUNDATION from: https://www.figma.com/make/cEmpnUsIpqHYZvR7OboEwl/Gambling-Casino-Website
- Adopt: Clean, minimal table styling without excessive decoration
- Adopt: Simple form layouts for member information
- Adopt: Straightforward button designs and action patterns
- Adopt: Uncluttered layout with clear data hierarchy

CHURCH CONTEXT ADAPTATIONS:
- Replace customer data with member information: Name, Contact, Membership Date, Attendance Status, Ministry Involvement
- Adapt business workflows for church member management: Add Member, Update Info, Record Attendance, Send Communications, Assign Ministry
- Simplify complex CRM features for church administrator needs: Basic member profiles, attendance tracking, communication tools, ministry assignments
- Optimize for mobile usage: Church staff using phones/tablets for member check-ins and event management

LAYOUT REQUIREMENTS:
- Desktop: Full table with filters, search, and bulk actions
- Tablet: Condensed table with swipe actions and collapsible details
- Mobile: Card-based layout with collapsible member details
- Touch targets: Minimum 48px for all interactive elements
- Accessibility: Screen reader friendly data tables with proper ARIA labels

COMPONENT STRUCTURE:
- Header: Search bar, filter dropdowns, add member button, bulk actions
- Sidebar: Member categories (Active, Inactive, New, Volunteers), quick filters, recent activity
- Main Content: Member table with sortable columns, pagination, member cards (mobile)
- Member Details: Profile information, attendance history, ministry involvement, communication log
- Mobile: Bottom navigation with members, search, add member, filters, more

SEMANTIC NAMING:
- table/member-list, table/sortable-column, table/filter-control, table/pagination
- form/add-member, form/edit-member, form/member-details, form/attendance-record
- actions/add-member, actions/edit-member, actions/delete-member, actions/send-message
- filters/member-status, filters/ministry-involvement, filters/attendance-range, filters/search
- mobile/member-card, mobile/member-details, mobile/swipe-actions, mobile/bottom-nav
```

### 📱 **Mobile-First Hybrid Considerations**

#### **Africa-Specific Adaptations:**
- **Touch Targets**: Minimum 48px for all interactive elements
- **Data Usage**: Optimize for 3G connections and limited bandwidth
- **Device Performance**: Ensure layouts work on low-end Android devices
- **Battery Life**: Efficient layouts that don't drain battery
- **Offline Capability**: Layouts that work with cached data

#### **Church Workflow Optimizations:**
- **Quick Actions**: Prominent buttons for common church tasks
- **Data Entry**: Simplified forms for member information
- **Attendance**: Mobile-optimized check-in interfaces
- **Communication**: Easy access to member contact and messaging
- **Reporting**: Simple data visualization for church metrics

### 🎯 **Quality Assurance for Hybrid Layouts**

#### **Layout Validation Checklist:**
- [ ] **Information Hierarchy**: Clear content prioritization for church administrators
- [ ] **Navigation Flow**: Intuitive paths through church management workflows
- [ ] **Data Presentation**: Church metrics displayed clearly and accessibly
- [ ] **Mobile Optimization**: Touch-friendly interfaces for church staff
- [ ] **Performance**: Layouts load quickly on target devices
- [ ] **Accessibility**: Screen reader compatible and keyboard navigable
- [ ] **Church Context**: Layouts serve actual church management needs
- [ ] **User Testing**: Validated with real church administrators
- Create component naming convention for handoff
- Include loading state containers and error message areas

**Code Output Requirements:**
- HTML structure with semantic elements
- CSS grid/flexbox layout logic
- Component class naming convention
- Accessibility attributes (ARIA, roles, labels)
- Responsive breakpoint structure

### 🏠 Dashboard Layout Wireframe

**Prompt:**
Design a wireframe for the main dashboard focusing on information hierarchy and layout structure.

**Layout Structure:**
- **Header**: Navigation bar with logo, menu items, user profile area
- **Sidebar**: Collapsible navigation menu with main sections
- **Main Content**: Widget grid system, responsive card layout
- **Quick Actions**: Floating action button or fixed action panel

**Semantic Component Names:**
- `header/main`, `nav/sidebar`, `nav/breadcrumb`
- `widget/metric`, `widget/chart`, `widget/activity`
- `btn/fab`, `panel/quick-actions`, `grid/dashboard`
- `container/main`, `container/sidebar`, `container/widget`

**Widget Architecture:**
- **Metric Cards**: Standardized card structure for statistics
- **Chart Containers**: Flexible containers for data visualization
- **Activity Feed**: List structure with consistent item layout
- **Quick Actions Panel**: Button grid with clear hierarchy

**Make-Only Components (Structure First):**
- **Skeleton Loaders**: `skeleton/widget`, `skeleton/chart`, `skeleton/list`
- **Empty States**: `empty/no-data`, `empty/no-members`, `empty/no-activity`
- **Loading States**: `loading/sync`, `loading/refresh`, `loading/infinite-scroll`
- **Error States**: `error/network`, `error/permission`, `error/generic`

**Technical Requirements:**
- CSS Grid layout for dashboard structure
- Flexbox for widget internal layout
- Responsive behavior logic (sidebar collapse, widget stacking)
- Component modularity for easy maintenance
- Performance-optimized DOM structure

### 👥 Member Management Wireframe

**Prompt:**
Create a wireframe for member management system focusing on data organization and user workflows.

**Layout Components:**
- **Member List**: Table/card hybrid layout with filtering and search
- **Member Profile**: Tabbed interface with information sections
- **Add/Edit Forms**: Multi-section form with logical grouping
- **Bulk Actions**: Selection interface with batch operation controls

**Data Architecture:**
- **Search Interface**: Advanced filtering with multiple criteria
- **List Views**: Table and card view options with sorting
- **Detail Views**: Expandable sections with related information
- **Form Structure**: Progressive disclosure and validation feedback

**Interaction Patterns:**
- **Navigation Flow**: Breadcrumb and back button logic
- **State Management**: Loading, empty, error, and success states
- **Bulk Operations**: Multi-select and batch action workflows
- **Mobile Adaptation**: Touch-friendly interactions and simplified views

### 📊 Attendance System Wireframe

**Prompt:**
Design wireframes for attendance tracking system with focus on mobile-first data capture.

**Core Workflows:**
- **QR Code Scanner**: Camera interface with scanning feedback
- **Manual Check-in**: Search and select interface for member lookup
- **Attendance Dashboard**: Real-time statistics and member status
- **Reporting Interface**: Date range selection and export options

**Mobile-First Structure:**
- **Scanner View**: Full-screen camera with overlay instructions
- **Search Interface**: Large touch targets with autocomplete
- **Status Indicators**: Clear visual feedback for attendance states
- **Quick Actions**: Swipe gestures and touch-friendly controls

**Data Flow Logic:**
- **Offline Capability**: Local storage structure and sync indicators
- **Real-time Updates**: Live data refresh and notification system
- **Batch Processing**: Queue management for offline actions
- **Error Handling**: Clear feedback for failed operations

## 🧱 Make-Only Components (Structure First)

These components are best defined in Figma Make before any visual styling:

### **Skeleton Loaders**
- `skeleton/card` - Card loading placeholder structure
- `skeleton/list` - List item loading placeholder
- `skeleton/chart` - Chart loading placeholder with axes
- `skeleton/form` - Form field loading placeholders

### **ARIA Roles and Semantic Tags**
- `role/banner` - Header and navigation areas
- `role/main` - Primary content areas
- `role/complementary` - Sidebar and secondary content
- `role/contentinfo` - Footer information

### **Interaction Flows**
- `modal/open-close` - Modal dialog interaction structure
- `dropdown/expand-collapse` - Dropdown menu behavior
- `tab/switch` - Tab navigation interaction
- `accordion/expand-collapse` - Accordion section behavior

### **State Management Structure**
- `state/loading` - Loading state containers
- `state/error` - Error state containers
- `state/empty` - Empty state containers
- `state/success` - Success feedback containers

## 🔧 Advanced Make Techniques

### 📋 Form Builder Wireframe

**Prompt:**
Create a dynamic form builder wireframe for custom church data collection.

**Builder Interface:**
- **Field Library**: Drag-and-drop component palette
- **Canvas Area**: Form preview with live editing
- **Properties Panel**: Field configuration and validation settings
- **Preview Mode**: Mobile and desktop form preview

**Technical Architecture:**
- **Component System**: Reusable form field components
- **Validation Logic**: Client-side validation structure
- **Data Binding**: Form-to-database mapping interface
- **Export Functionality**: Code generation for production forms

### 📱 Mobile App Navigation Wireframe

**Prompt:**
Design mobile app navigation structure for ChurchAfrica ChMS focusing on thumb-friendly interaction.

**Navigation Patterns:**
- **Bottom Tab Bar**: Primary navigation with 4-5 main sections
- **Hamburger Menu**: Secondary navigation for less frequent actions
- **Floating Action Button**: Context-sensitive primary actions
- **Swipe Gestures**: Horizontal navigation between related screens

**Screen Architecture:**
- **List Screens**: Infinite scroll with pull-to-refresh
- **Detail Screens**: Scrollable content with fixed action bar
- **Form Screens**: Step-by-step with progress indication
- **Dashboard Screens**: Widget-based with customizable layout

### 🔄 Offline Sync Interface Wireframe

**Prompt:**
Create wireframes for offline-first functionality with clear sync status communication.

**Sync Interface Components:**
- **Status Indicators**: Connection state and sync progress
- **Conflict Resolution**: User interface for data conflicts
- **Queue Management**: Pending actions and retry mechanisms
- **Storage Management**: Local data usage and cleanup options

**User Feedback Systems:**
- **Progress Indicators**: Upload/download progress with details
- **Error States**: Clear error messages with resolution steps
- **Success Confirmations**: Completion feedback and next actions
- **Background Sync**: Unobtrusive sync status updates

## 📊 Data Integration Wireframes

### 📈 Analytics Dashboard Wireframe

**Prompt:**
Design analytics dashboard wireframe focusing on data visualization structure and user insights.

**Dashboard Architecture:**
- **Overview Section**: Key metrics with trend indicators
- **Chart Grid**: Flexible layout for various chart types
- **Filter Panel**: Date ranges, categories, and custom filters
- **Export Interface**: Report generation and sharing options

**Data Visualization Structure:**
- **Chart Containers**: Standardized containers for different chart types
- **Legend Systems**: Consistent legend placement and styling
- **Tooltip Structure**: Hover states and detailed information display
- **Responsive Charts**: Mobile-optimized chart layouts

### 🔍 Search Interface Wireframe

**Prompt:**
Create advanced search interface wireframe for comprehensive member and data discovery.

**Search Components:**
- **Search Bar**: Auto-complete with recent searches
- **Filter Sidebar**: Hierarchical filtering with clear/apply actions
- **Results Layout**: List and grid views with sorting options
- **Saved Searches**: Quick access to frequently used searches

**Advanced Features:**
- **Faceted Search**: Category-based filtering with counts
- **Search Suggestions**: Intelligent query completion
- **Result Previews**: Quick preview without full navigation
- **Bulk Actions**: Multi-select from search results

## 📚 Make Prompt Library (Reusable Templates)

### 🚀 Onboarding Flow Templates

#### Church Setup Wizard
```plaintext
Prompt: Create a multi-step church setup wizard with:
- Progress indicator showing 5 steps
- Step navigation (previous/next buttons)
- Form sections: Basic Info, Contact Details, Services, Members, Settings
- Semantic names: wizard/setup, step/basic-info, step/contact, etc.
- Validation feedback containers for each step
- Save draft functionality structure
```

#### Member Onboarding
```plaintext
Prompt: Create a member onboarding flow with:
- Welcome screen with church branding area
- Personal information form with photo upload
- Family connection interface
- Ministry interest selection grid
- Semantic names: onboard/welcome, form/personal, grid/ministry
- Progress saving and resume capability
```

### 📊 Dashboard Templates

#### Executive Dashboard
```plaintext
Prompt: Create an executive dashboard wireframe with:
- KPI metric cards in responsive grid (2x2 mobile, 3x2 tablet, 4x2 desktop)
- Trend charts with time period selector
- Quick action buttons for common tasks
- Recent activity feed with infinite scroll
- Semantic names: dashboard/executive, metric/kpi, chart/trend
- Export functionality for reports
```

#### Ministry Dashboard
```plaintext
Prompt: Create a ministry-specific dashboard with:
- Ministry-specific metrics and goals
- Member engagement tracking interface
- Event planning quick actions
- Communication tools access
- Semantic names: dashboard/ministry, metric/engagement, tool/communication
- Role-based content visibility structure
```

### 🔍 Search Templates

#### Universal Search
```plaintext
Prompt: Create a universal search interface with:
- Global search bar with autocomplete
- Filter sidebar with categories (Members, Events, Documents)
- Results grid with type indicators
- Advanced search toggle with detailed filters
- Semantic names: search/global, filter/category, result/item
- Search history and saved searches
```

#### Member Directory Search
```plaintext
Prompt: Create a member directory search with:
- Search bar with member photo previews
- Filter options (age groups, ministries, status)
- List and card view toggle
- Bulk selection for group actions
- Semantic names: search/member, filter/ministry, view/toggle
- Export selected members functionality
```

### 📝 Modal Templates

#### Confirmation Dialog
```plaintext
Prompt: Create a confirmation dialog wireframe with:
- Clear action description
- Primary and secondary action buttons
- Optional detail expansion area
- Focus management structure
- Semantic names: modal/confirm, btn/primary, btn/cancel
- Keyboard navigation support
```

#### Data Entry Modal
```plaintext
Prompt: Create a data entry modal with:
- Form fields with validation feedback
- Save/cancel action buttons
- Progress indicator for multi-step forms
- Error handling and success feedback
- Semantic names: modal/entry, form/data, feedback/validation
- Auto-save draft functionality
```

### 📱 Mobile-First Templates

#### Mobile Navigation
```plaintext
Prompt: Create mobile navigation structure with:
- Bottom tab bar with 5 main sections
- Hamburger menu for secondary navigation
- Search icon in header
- Profile/settings access
- Semantic names: nav/bottom, nav/hamburger, nav/header
- Gesture support structure (swipe, tap, long-press)
```

#### Mobile Forms
```plaintext
Prompt: Create mobile-optimized forms with:
- Single-column layout with large touch targets
- Input field grouping with clear sections
- Floating action button for save
- Keyboard-aware scrolling structure
- Semantic names: form/mobile, input/touch, btn/floating
- Voice input and camera integration points
```

## 🔗 Integration & Handoff

### 📋 Component Documentation Generator

**Prompt:**
Create a wireframe for component documentation system that generates handoff materials.

**Documentation Interface:**
- **Component Library**: Visual catalog of all components
- **Usage Examples**: Context-specific implementation examples
- **Code Snippets**: Generated HTML/CSS for each component
- **Design Tokens**: Variable documentation and usage guidelines

**Handoff Tools:**
- **Spec Generation**: Automatic spacing and sizing documentation
- **Asset Export**: Organized asset delivery for development
- **Version Control**: Component versioning and change tracking
- **Developer Notes**: Implementation guidelines and best practices

### 🔄 Design System Manager

**Prompt:**
Design wireframes for design system management interface focusing on consistency and scalability.

**System Management:**
- **Token Editor**: Design token creation and modification interface
- **Component Editor**: Component variant management
- **Usage Tracking**: Component usage analytics across projects
- **Update Propagation**: System-wide update management

**Quality Assurance:**
- **Consistency Checker**: Automated design consistency validation
- **Accessibility Audit**: Built-in accessibility compliance checking
- **Performance Monitor**: Component performance impact tracking
- **Documentation Sync**: Automatic documentation updates

## 🎯 Best Practices for Figma Make

### Prompt Optimization
- **Be Specific**: Include exact layout requirements and component structure
- **Focus on Logic**: Emphasize functionality over visual appearance
- **Include Context**: Specify user workflows and interaction patterns
- **Request Code**: Always ask for HTML/CSS structure output
- **Plan for Handoff**: Include component naming and documentation requirements

### Iteration Strategy
- **Start Simple**: Begin with basic wireframes and add complexity
- **Test Early**: Validate user flows before adding visual design
- **Document Decisions**: Capture layout logic and interaction rationale
- **Plan for Scale**: Design component systems that can grow
- **Prepare for AI**: Structure components for easy visual enhancement

## 🔗 Related Documentation

### **Workflow Integration**
- **[Figma AI Prompts](./figma-ai-prompts.md)** - Visual design templates using Make wireframes
- **[Branding Guidelines](./branding-guidelines.md)** - Design tokens for AI application
- **[Design Guide](./figma-design-guide.md)** - Overall design system requirements

### **Implementation Specifications**
- **[Authentication System](../000-authentication-system/spec.md)** - Auth component requirements
- **[Member Management](../002-member-management/spec.md)** - Member management wireframe needs
- **[Dashboard System](../005-dashboard-system/spec.md)** - Dashboard layout requirements

### **Technical Integration**
- **Component Naming**: Use semantic naming for easy handoff to Figma AI
- **Responsive Logic**: Focus on layout behavior rather than visual styling
- **Code Generation**: Request HTML/CSS structure for development handoff
- **Accessibility Foundation**: Include semantic HTML and ARIA structure

## 🛠️ Figma Make Best Practices

### From Figma's Official Guide

#### 1. **Start with Clear Intent**
- Define the specific functionality you want to prototype
- Focus on user workflows rather than visual design
- Include specific interaction requirements in prompts

#### 2. **Use Point and Edit Tool**
- Make quick adjustments to layout and spacing
- Test different component arrangements
- Iterate on functionality without starting over

#### 3. **Leverage Code Tab**
- Access generated code for technical specifications
- Make precise adjustments to behavior and logic
- Export code snippets for development handoff

#### 4. **Integrate Realistic Data**
- Use mock data that represents real church scenarios
- Test with realistic content volumes and edge cases
- Include data import/export functionality in wireframes

#### 5. **Build Handoff Tools**
- Create interfaces that generate production-ready code
- Include component documentation and usage guidelines
- Generate design specifications for development team

### Prompt Structure Template

```
**Objective**: [What you want to build - focus on functionality]
**User Workflow**: [Step-by-step user journey]
**Layout Structure**: [Component hierarchy and organization]
**Interaction Patterns**: [How users interact with elements]
**Technical Requirements**: [Code output and handoff needs]
**Responsive Behavior**: [How layout adapts across devices]
**Accessibility Structure**: [Semantic HTML and ARIA requirements]
```

### Quality Checklist for Make Outputs

#### Structure Validation
- [ ] Clear component hierarchy and nesting
- [ ] Semantic HTML structure with proper elements
- [ ] Logical information architecture
- [ ] Consistent interaction patterns
- [ ] Responsive layout logic defined

#### Technical Readiness
- [ ] Component naming follows semantic conventions (`component/type/variant`)
- [ ] Code output is clean and semantic
- [ ] Accessibility attributes included (ARIA labels, roles)
- [ ] Performance-optimized DOM structure
- [ ] Ready for visual design enhancement

#### User Experience Foundation
- [ ] User workflows are intuitive and logical
- [ ] Error states and edge cases considered
- [ ] Loading states and feedback mechanisms
- [ ] Mobile-first interaction patterns
- [ ] Offline functionality structure included

#### Make-to-AI Readiness
- [ ] Component names map to styling prompts
- [ ] Layout structure supports brand application
- [ ] Interaction states defined for visual enhancement
- [ ] Responsive behavior documented for AI implementation
- [ ] Code foundation ready for design token application

## 🔄 Handoff to Figma AI

### Preparation Checklist
- [ ] Wireframes validated with stakeholders
- [ ] Component structure documented
- [ ] Interaction patterns tested
- [ ] Code output reviewed and approved
- [ ] Ready for visual design application

### Figma AI Integration Notes
- **Component Names**: Use Make's semantic naming in AI prompts
- **Layout Structure**: Reference Make's responsive logic in AI design
- **Interaction States**: Apply Make's state structure to visual design
- **Code Foundation**: Build upon Make's technical foundation
- **Brand Application**: Apply visual design to proven structure

---

**Remember**: Figma Make creates the structural foundation that Figma AI will enhance with visual design. Focus on functionality, user flows, and technical architecture rather than visual aesthetics. This two-phase approach ensures both solid functionality and beautiful design.
