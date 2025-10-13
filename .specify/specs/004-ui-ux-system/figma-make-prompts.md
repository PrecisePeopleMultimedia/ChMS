# ChurchAfrica ChMS – Figma Make Prompt Templates
**Wireframing, Structure & Logic-First Design Prompts**

## 🧠 Figma Make Philosophy

Figma Make prompts should focus on:
- **Structure First**: Layout logic and component hierarchy before visual design
- **Functionality Focus**: User flows, interactions, and information architecture
- **Rapid Iteration**: Quick wireframing and concept validation
- **Technical Foundation**: Code generation and handoff preparation
- **Responsive Logic**: Layout behavior across devices without visual styling

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
| `btn/primary` | Use `var/color/primary`, hover/active states, 48px height | Main CTA buttons with touch-friendly sizing |
| `form/input/email` | Add validation states, `var/spacing/medium`, focus indicators | Accessible form fields with error handling |
| `widget/metric` | Apply dashboard styling, `var/color/accent` for highlights | Statistics widgets with trend indicators |
| `nav/sidebar` | Use `var/color/surface`, collapsible behavior, active states | Navigation with mobile hamburger pattern |
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

**Technical Specifications:**
- Use semantic HTML structure (form, fieldset, legend elements)
- Include ARIA labels and accessibility attributes
- Generate responsive grid layout (mobile-first approach)
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
