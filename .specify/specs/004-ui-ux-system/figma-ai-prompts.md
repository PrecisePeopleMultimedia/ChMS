# ChurchAfrica ChMS – Figma AI Prompt Templates

## 🧠 Prompt Philosophy

Figma AI prompts should be:
- **Explicit**: Avoid subtlety - be specific about layout, spacing, and styling
- **Modular**: Use components and variables for consistency
- **Context-aware**: Reference real designs and brand guidelines
- **Mobile-first**: Optimize for African mobile usage patterns
- **Offline-aware**: Include visual feedback for connection states

## 🔄 Figma Make → Figma AI Workflow Integration

This document works as part of a **modular design pipeline**:

### **Step 1: Figma Make (Structure)**
- Create wireframes using [figma-make-prompts.md](figma-make-prompts.md)
- Focus on layout logic, semantic structure, and user flow
- Establish component hierarchy and interaction patterns
- Generate clean, semantic wireframes ready for styling

### **Step 2: Figma AI (Styling) - THIS DOCUMENT**
- Import wireframes from Figma Make into Figma AI
- Apply visual styling, branding, and polish using prompts below
- Transform structural wireframes into production-ready designs
- Maintain semantic component naming from wireframe stage

### **Step 3: Development (Implementation)**
- Hand off polished designs to development team
- Use component names and structure from wireframe stage
- Implement with minimal translation between design and code

**Key Benefits:**
- ✅ **Separation of concerns** - Structure vs styling decisions
- ✅ **Teachable workflow** - Clear steps for team members
- ✅ **Consistent output** - Systematic approach to design
- ✅ **Efficient handoff** - Minimal design-to-code translation

> **📋 Related Documents**: This prompt system integrates with [branding-guidelines.md](branding-guidelines.md) for design tokens, [branding-quick-reference.md](branding-quick-reference.md) for component snippets, and [spec.md](spec.md) for implementation requirements.

## 📥 Working with Figma Make Wireframes

When styling wireframes imported from Figma Make, follow this systematic approach:

### **Import Preparation**
1. **Preserve component names** - Keep semantic naming from wireframes (e.g., `form/login`, `card/member`)
2. **Maintain layout structure** - Don't alter the wireframe's layout logic
3. **Identify styling targets** - Focus on colors, typography, shadows, and visual polish
4. **Check component hierarchy** - Ensure parent-child relationships are maintained

### **Styling Application Process**
```
PROMPT TEMPLATE for Wireframe Styling:
"Apply ChurchAfrica green dark theme styling to this [COMPONENT_NAME] wireframe:
- Use primary green (#1CE479) for [SPECIFIC_ELEMENTS]
- Apply dark navy background (#0A0A0F)
- Add card styling (#1A1A20) with subtle shadows
- Use Archivo typography with [FONT_SIZES]
- Maintain existing layout and spacing
- Add glass morphism effects for depth
- Ensure 48px touch targets for mobile"
```

### **Quality Checklist for Styled Components**
- [ ] **Color consistency** - All colors match green dark theme palette
- [ ] **Typography hierarchy** - Proper font sizes and weights applied
- [ ] **Spacing preservation** - Original wireframe spacing maintained
- [ ] **Component naming** - Semantic names from wireframe preserved
- [ ] **Mobile optimization** - Touch targets and responsive behavior
- [ ] **Accessibility** - Contrast ratios and screen reader compatibility

## 🎯 Core Design Principles

### ChurchAfrica Brand Identity
- **Primary Color**: Bright Green (#1CE479) - growth, energy, modern technology
- **Background Color**: Dark Navy (#0A0A0F) - professionalism, sophistication
- **Card Color**: Card Dark (#1A1A20) - subtle elevation, modern design
- **Secondary Color**: Medium Gray (#2A2A35) - supporting elements
- **Accent Color**: Golden Dawn (#FFB800) - hope, prosperity, African sunshine
- **Typography**: Archivo for UI, Inter for fallback, Poppins for headings
- **Spacing**: 8px base unit (8px, 16px, 24px, 32px, 48px, 64px)
- **Border Radius**: 4px (small), 8px (medium), 12px (large), 16px (containers)

### Africa-First Design Requirements
- **Touch Targets**: Minimum 48px (larger than standard 44px)
- **Mobile-First**: Design for thumb-friendly navigation
- **Offline Indicators**: Clear visual feedback for connection states
- **Progressive Loading**: Skeleton screens and loading states
- **High Contrast**: Optimized for bright sunlight visibility

## 🧩 Prompt Templates

### 📱 Landing Page Template

**Prompt:**
Design a landing page for ChurchAfrica ChMS using Africa-first principles.

**Layout Structure:**
- **Header**: ChurchAfrica logo (left), navigation menu (right), use auto layout horizontal with 24px spacing
- **Hero Section**: Large headline "Africa-First Church Management", subtext, CTA button "Get Started", centered vertical stack with 32px spacing
- **Features Section**: 3 cards in responsive grid, each card: icon, title, description, use auto layout vertical with 16px spacing
- **Footer**: Logo, social links, contact info, use Dark Navy background with white text

**Design Requirements:**
- Use `var/color/primary` (#1CE479) for primary elements
- Use `var/color/accent` (#FFB800) for CTA buttons and highlights
- Use `var/color/background` (#0A0A0F) for main backgrounds
- Use `var/color/card` (#1A1A20) for card backgrounds
- Apply `var/spacing/large` (24px) between sections
- Use `var/radius/large` (12px) for cards
- Include offline capability indicators
- Include chat feature integration
- Reference: [Framer Botanical Template](https://www.framer.com/marketplace/templates/botanical) for spacing and hierarchy

**Component Naming:**
- `header/navigation`
- `hero/cta-button`
- `card/feature`
- `footer/social-links`

---

### 📊 Dashboard Template

**Prompt:**
Design an admin dashboard for church attendance tracking with offline-first indicators.

**Layout Structure:**
- **Sidebar**: Vertical navigation with icons (Dashboard, Events, Members, Reports), use auto layout vertical with 16px spacing
- **Top Bar**: Search input, notifications, profile avatar, use auto layout horizontal with 24px spacing
- **Main Area**: Grid of attendance cards showing event name, date, check-in count, use auto layout grid with 24px gap
- **Status Bar**: Connection indicator, last sync time, data usage indicator

**Design Requirements:**
- Use `var/color/primary` (#1CE479) for positive metrics and active states
- Use `var/color/accent` (#FFB800) for attention items
- Use `var/color/background` (#0A0A0F) for main background
- Use `var/color/card` (#1A1A20) for card backgrounds
- Apply `var/shadow/medium` for card elevation
- Include offline/online status indicators
- Show sync progress for background operations
- Include chat feature integration
- Reference: [Crypto Exchange Dashboard](https://www.behance.net/gallery/217845423/Crypto-Exchange/modules/1241147449) for data visualization

**Component Naming:**
- `sidebar/nav-item`
- `card/attendance`
- `status/connection`
- `input/search`

---

### 🔐 Authentication Flow Template

**Prompt:**
Design login and registration screens for ChurchAfrica ChMS with mobile-first approach.

**Login Screen:**
- **Header**: ChurchAfrica logo centered, 40px height
- **Form Container**: Card-style with subtle shadow, centered on page
- **Form Fields**: Email input, password input, "Remember me" checkbox
- **Actions**: "Log In" button (primary), "Forgot Password?" link
- **Footer**: "Don't have an account? Register here" with horizontal auto layout

**Registration Screen:**
- **Header**: Same as login
- **Form Container**: Same card style for consistency
- **Form Fields**: Full name, email, password, confirm password
- **Validation**: Real-time validation indicators
- **Actions**: "Register" button (primary), "Already have an account? Log in"

**Design Requirements:**
- Use `var/color/background` (white) for form containers
- Apply `var/radius/medium` (8px) for inputs and buttons
- Use `var/spacing/medium` (16px) between form elements
- Include form validation states (error, success)
- Show loading states for form submission
- Mobile-optimized with 48px touch targets

**Component Naming:**
- `form/input/email`
- `form/input/password`
- `btn/primary`
- `card/auth`

---

### 📱 Mobile App Template

**Prompt:**
Design a mobile-first church management app interface with offline capabilities.

**Layout Structure:**
- **Bottom Navigation**: 4 tabs (Home, Events, Members, Profile) with icons and labels
- **Floating Action Button**: "Add Event" with Golden Dawn background
- **Content Area**: Scrollable with pull-to-refresh gesture
- **Status Indicators**: Connection status, sync progress, data usage

**Design Requirements:**
- Use `var/spacing/large` (24px) for content padding
- Apply `var/radius/large` (12px) for cards
- Include haptic feedback indicators
- Show offline/online status clearly
- Use swipe gestures for actions
- Reference: [Material Design 3](https://m3.material.io/) for mobile patterns

**Component Naming:**
- `nav/bottom-tabs`
- `fab/add-event`
- `card/event-mobile`
- `indicator/connection`

---

### 📋 Event Management Template

**Prompt:**
Design an event management interface with offline-first capabilities.

**Layout Structure:**
- **Header**: "Events" title, filter button, add event button
- **Filter Bar**: Date range, event type, status filters
- **Event List**: Cards showing event details, attendance count, status
- **Empty State**: Illustration and message when no events
- **Offline Indicator**: Show which events are cached vs. need sync

**Design Requirements:**
- Use `var/color/accent` (#FFB800) for upcoming events
- Apply `var/color/success` (#10B981) for completed events
- Use `var/color/warning` (#F59E0B) for pending events
- Include attendance visualization
- Show sync status for each event
- Reference: [Event Management Dashboard](https://dribbble.com/shots/12345678) for layout inspiration

**Component Naming:**
- `card/event`
- `filter/date-range`
- `status/attendance`
- `indicator/sync`

---

### 👥 Member Management Template

**Prompt:**
Design a member management interface with search and filtering capabilities.

**Layout Structure:**
- **Search Bar**: Full-width search with filters
- **Member Grid**: Cards showing member photo, name, contact, status
- **Filter Sidebar**: Status, groups, registration date filters
- **Bulk Actions**: Select multiple members for batch operations
- **Member Detail**: Modal with full member information

**Design Requirements:**
- Use `var/color/primary` (#2D1B69) for active members
- Apply `var/color/warning` (#F59E0B) for inactive members
- Use `var/radius/full` for member avatars
- Include member status indicators
- Show last activity timestamps
- Reference: [Member Management System](https://www.behance.net/gallery/12345678) for user patterns

**Component Naming:**
- `card/member`
- `input/search`
- `filter/status`
- `modal/member-detail`

---

### 📊 Reports Dashboard Template

**Prompt:**
Design a reports and analytics dashboard with data visualization.

**Layout Structure:**
- **Header**: "Reports" title, date range picker, export button
- **Metrics Cards**: Key performance indicators with trend arrows
- **Charts Section**: Attendance trends, demographic breakdowns
- **Table View**: Detailed data with sorting and filtering
- **Export Options**: PDF, Excel, CSV download buttons

**Design Requirements:**
- Use `var/color/success` (#10B981) for positive trends
- Apply `var/color/error` (#EF4444) for negative trends
- Use `var/shadow/large` for chart containers
- Include data loading states
- Show data freshness timestamps
- Reference: [Analytics Dashboard](https://dribbble.com/shots/12345678) for chart layouts

**Component Naming:**
- `card/metric`
- `chart/attendance`
- `table/data`
- `btn/export`

---

## 🔄 Reuse Tips

### Prompt Optimization
- **Save as Snippets**: Store prompts in Notion or markdown files for quick access
- **Batch Screens**: Combine multiple related screens in one prompt when possible
- **Component References**: Always specify auto layout, spacing, and naming conventions
- **Design References**: Include specific design inspiration URLs
- **Variable Usage**: Reference design system variables consistently

### Figma AI Best Practices
- **Be Specific**: Include exact measurements, colors, and spacing
- **Use Variables**: Reference design system variables for consistency
- **Auto Layout**: Always specify auto layout requirements
- **Component Hierarchy**: Use clear naming conventions for components
- **State Variants**: Include different states (hover, active, disabled)

### Common Patterns
- **Card Layouts**: Use consistent card styling with shadows and radius
- **Form Elements**: Standardize input styling and validation states
- **Navigation**: Maintain consistent navigation patterns across screens
- **Status Indicators**: Use consistent colors and icons for states
- **Loading States**: Include skeleton screens and progress indicators

## ⚠️ Limitations & Solutions

### Figma AI Limitations
- **Subtle Design Cues**: May misinterpret subtle design intentions
- **Complex Interactions**: Limited understanding of advanced interaction patterns
- **Brand Consistency**: May not maintain perfect brand consistency
- **Responsive Behavior**: May not handle responsive design perfectly

### Solutions
- **Explicit Instructions**: Be very specific about layout and styling requirements
- **Reference Designs**: Include specific design references and inspiration
- **Component Libraries**: Use established component patterns
- **Iterative Refinement**: Review and refine generated designs
- **Manual Adjustments**: Expect to make manual adjustments after generation

## 🎨 Advanced Prompt Techniques

### Multi-Screen Workflows
```
Design a complete user onboarding flow with 4 screens:
1. Welcome screen with ChurchAfrica branding
2. Feature introduction with 3 key benefits
3. Account creation form
4. Dashboard setup with preferences

Use consistent navigation, spacing, and component patterns across all screens.
```

### Component System Prompts
```
Create a comprehensive button component system with variants:
- Primary button (Garnet Night background)
- Secondary button (white background, Garnet Night border)
- Accent button (Golden Dawn background)
- Ghost button (transparent background)
- Floating action button (circular, Golden Dawn)

Include hover, active, and disabled states for each variant.
```

### Responsive Design Prompts
```
Design a responsive dashboard that works on:
- Mobile (375px width): Single column, bottom navigation
- Tablet (768px width): Two column layout, sidebar navigation
- Desktop (1200px width): Full sidebar, multi-column content

Use auto layout and responsive constraints for smooth scaling.
```

## 📚 Design Reference Library

### Inspiration Sources
- **Material Design 3**: [m3.material.io](https://m3.material.io/)
- **Framer Templates**: [framer.com/marketplace](https://www.framer.com/marketplace)
- **Dribbble**: [dribbble.com](https://dribbble.com) for UI inspiration
- **Behance**: [behance.net](https://www.behance.net) for dashboard designs
- **Church Websites**: Modern church website designs for spiritual context

### Component Libraries
- **Material Design Components**: [material.io/components](https://material.io/components)
- **Ant Design**: [ant.design/components](https://ant.design/components)
- **Chakra UI**: [chakra-ui.com/docs/components](https://chakra-ui.com/docs/components)
- **Tailwind UI**: [tailwindui.com/components](https://tailwindui.com/components)

### Mobile-First References
- **iOS Human Interface Guidelines**: [developer.apple.com/design](https://developer.apple.com/design)
- **Android Material Design**: [material.io/design](https://material.io/design)
- **Progressive Web App Patterns**: [web.dev/progressive-web-apps](https://web.dev/progressive-web-apps)

---

## 🎯 Enhanced Onboarding Flow Example

### Complete Onboarding Flow Prompt

**Prompt:**
Design a comprehensive 5-screen onboarding flow for ChurchAfrica ChMS with Africa-first mobile optimization.

**Screen 1: Welcome & Introduction**
- **Hero Section**: ChurchAfrica logo (120px), "Welcome to ChurchAfrica ChMS" headline, "Africa-First Church Management Made Simple" subtext
- **Feature Highlights**: 3 key benefits with icons (Offline-First, Mobile-Optimized, Community-Focused)
- **CTA**: "Get Started" button (primary), "Learn More" link
- **Background**: Gradient from Garnet Night to lighter purple

**Screen 2: Feature Introduction**
- **Header**: "Why Choose ChurchAfrica?" with church icon
- **Feature Cards**: 3 cards showing offline capability, mobile optimization, community features
- **Progress Indicator**: Step 2 of 5
- **Navigation**: "Next" button (primary), "Back" button (ghost)

**Screen 3: Account Creation**
- **Form Container**: Card-style with shadow, centered
- **Form Fields**: Full name, email, password, confirm password
- **Validation**: Real-time validation with success/error states
- **Terms**: "I agree to terms and conditions" checkbox
- **Actions**: "Create Account" button (primary), "Already have an account? Log in"

**Screen 4: Church Setup**
- **Header**: "Tell us about your church"
- **Form Fields**: Church name, denomination, location, congregation size
- **Optional Fields**: Website, social media links
- **Skip Option**: "Skip for now" link
- **Actions**: "Continue" button (primary)

**Screen 5: Dashboard Setup**
- **Welcome Message**: "Welcome, [Name]! Let's set up your dashboard"
- **Preference Cards**: Choose dashboard layout (Simple, Detailed, Custom)
- **Feature Toggles**: Enable/disable features (Events, Members, Reports, Giving)
- **Get Started**: "Launch Dashboard" button (accent color)

**Design Requirements:**
- Use `var/color/primary` (#2D1B69) for primary actions
- Apply `var/color/accent` (#FFB800) for final CTA
- Use `var/spacing/large` (24px) between sections
- Include progress indicators and step navigation
- Show loading states for form submissions
- Mobile-optimized with 48px touch targets
- Include offline capability indicators

**Component Naming:**
- `screen/welcome`
- `card/feature`
- `form/account-creation`
- `progress/step-indicator`
- `btn/primary`
- `btn/ghost`

**Reference Designs:**
- [Framer Onboarding Templates](https://www.framer.com/marketplace/templates/onboarding)
- [Material Design Onboarding](https://material.io/design/communication/onboarding.html)
- [Mobile Onboarding Patterns](https://dribbble.com/shots/12345678)

---

## 🎨 Advanced Component Prompts

### Button System Prompt
```
Create a comprehensive button component system for ChurchAfrica ChMS:

**Primary Button:**
- Background: var/color/primary (#2D1B69)
- Text: White, Inter Medium 16px
- Padding: 12px 24px
- Border radius: 8px
- States: Default, hover, active, disabled, loading

**Secondary Button:**
- Background: White
- Border: 1px solid var/color/primary
- Text: var/color/primary
- Same padding and radius as primary

**Accent Button:**
- Background: var/color/accent (#FFB800)
- Text: White
- Same styling as primary

**Ghost Button:**
- Background: Transparent
- Border: 1px solid var/color/primary
- Text: var/color/primary
- Hover: var/color/primary background

**Floating Action Button:**
- Circular: 56px diameter
- Background: var/color/accent
- Icon: White, 24px
- Shadow: var/shadow/large

**Component Naming:**
- btn/primary
- btn/secondary
- btn/accent
- btn/ghost
- btn/fab

**States:**
- Default, hover, active, disabled, loading
- Include loading spinner for loading state
- Use consistent spacing and typography
```

### Card System Prompt
```
Design a comprehensive card component system:

**Event Card:**
- Background: White
- Border radius: 12px
- Shadow: var/shadow/medium
- Padding: 24px
- Content: Event title, date, time, location, attendance count
- Status indicator: Upcoming (accent), Past (muted), Cancelled (error)

**Member Card:**
- Same base styling as event card
- Content: Avatar, name, contact, status, last activity
- Status: Active (success), Inactive (warning), Pending (info)

**Dashboard Widget:**
- Background: White with subtle border
- Border radius: 8px
- Padding: 16px
- Content: Metric title, value, trend indicator
- Interactive: Hover effects, click states

**Form Card:**
- Background: White
- Border: 1px solid var/color/border
- Border radius: 8px
- Padding: 24px
- Content: Form fields with proper spacing

**Component Naming:**
- card/event
- card/member
- card/widget
- card/form

**Responsive Behavior:**
- Mobile: Full width, 16px margin
- Tablet: 2-column grid, 24px gap
- Desktop: 3-column grid, 32px gap
```

### Form System Prompt
```
Create a comprehensive form component system:

**Input Fields:**
- Border: 1px solid var/color/border
- Border radius: 8px
- Padding: 12px 16px
- Font: Inter Regular 16px
- Height: 48px (touch-friendly)
- States: Default, focus, error, success, disabled

**Textarea:**
- Same styling as input
- Height: 120px minimum
- Resize: Vertical only

**Select Dropdown:**
- Same base styling as input
- Dropdown arrow: 16px icon
- Options: 48px height each
- Hover states for options

**Checkbox:**
- Size: 20px x 20px
- Border radius: 4px
- States: Unchecked, checked, indeterminate
- Label: 16px from checkbox

**Radio Button:**
- Size: 20px diameter
- Border: 2px solid var/color/primary
- States: Unselected, selected
- Label: 16px from radio

**Form Validation:**
- Error state: Red border, error message below
- Success state: Green border, success message
- Loading state: Spinner in input
- Required indicator: Red asterisk

**Component Naming:**
- input/text
- input/email
- input/password
- input/textarea
- input/select
- input/checkbox
- input/radio
- validation/error
- validation/success
```

---

## 🚀 Getting Started

### Quick Start Checklist
- [ ] Review ChurchAfrica brand guidelines
- [ ] Set up Figma variables for colors, spacing, and typography
- [ ] Create master components for buttons, cards, and forms
- [ ] Test prompts with simple layouts first
- [ ] Iterate and refine based on results
- [ ] Document successful prompt patterns

### Prompt Template Structure
1. **Context**: What you're designing and why
2. **Layout**: Specific structure and components
3. **Styling**: Colors, spacing, typography requirements
4. **Components**: Specific component naming and usage
5. **References**: Design inspiration and examples
6. **Constraints**: Technical or brand limitations

### Advanced Prompt Techniques
- **Multi-Screen Workflows**: Design complete user journeys
- **Component Systems**: Create comprehensive component libraries
- **Responsive Design**: Include mobile, tablet, and desktop variants
- **State Management**: Include all interactive states
- **Accessibility**: Ensure WCAG compliance in prompts

Remember: The key to successful Figma AI prompts is being explicit, consistent, and referencing established design patterns. Start simple and build complexity gradually.

## 🔗 Related Specifications

### **Implementation Specifications Using These Prompts**
- **[SPEC 000 - Authentication System](../000-authentication-system/spec.md)** - Uses authentication flow prompt templates
- **[SPEC 002 - Member Management](../002-member-management/spec.md)** - Uses member management and mobile app prompt templates
- **[SPEC 005 - Dashboard System](../005-dashboard-system/spec.md)** - Uses dashboard and widget prompt templates

### **Design System Documentation**
- **[Branding Guidelines](./branding-guidelines.md)** - Complete design system tokens and component specifications
- **[Branding Quick Reference](./branding-quick-reference.md)** - Prompt-ready snippets and design intent summary
- **[UI/UX System Specification](./spec.md)** - Overall UI/UX system requirements and prompt integration guidelines

### **Implementation Tasks**
- **[Authentication Tasks](../000-authentication-system/tasks.md)** - Authentication component implementation with prompt compliance
- **[Member Management Tasks](../002-member-management/tasks.md)** - Member management component implementation with prompt compliance
- **[Dashboard Tasks](../005-dashboard-system/tasks.md)** - Dashboard component implementation with prompt compliance
