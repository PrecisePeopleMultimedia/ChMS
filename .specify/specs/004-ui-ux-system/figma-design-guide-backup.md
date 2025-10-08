# ChurchAfrica ChMS - Figma Design Guide
**UI/UX System Design Specifications for Figma Implementation**

## 🎯 Design System Overview

This guide provides comprehensive specifications for designing the ChurchAfrica ChMS UI/UX system in Figma. The design system follows **Material Design 3** principles with **Africa-first mobile optimization** to create a superior alternative to RockRMS.

### Key Design Principles
- **Mobile-First**: Designed for African mobile usage patterns
- **Offline-First**: Clear visual feedback for connection states
- **Accessibility-First**: WCAG AA compliance with enhanced contrast
- **Performance-First**: Optimized for 3G networks and mid-range devices
- **Touch-Optimized**: 48px minimum touch targets, thumb-friendly navigation

---

## 📱 Layout Specifications

### 1. Main Application Layouts

#### **Dashboard Layout (Primary)**
- **Purpose**: Main church management dashboard
- **Breakpoints**: Mobile (375px), Tablet (768px), Desktop (1024px+)
- **Structure**:
  - **Header**: 64px height, contains logo, navigation, user menu, theme switcher
  - **Sidebar**: 280px width (desktop), collapsible, contains main navigation
  - **Main Content**: Flexible width, contains dashboard widgets and data
  - **Bottom Navigation**: 80px height (mobile), contains primary actions
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

This comprehensive design guide ensures that the Figma implementation will create a superior, Africa-first church management system that exceeds RockRMS in user experience, accessibility, and mobile optimization while maintaining the highest design standards and performance requirements.
