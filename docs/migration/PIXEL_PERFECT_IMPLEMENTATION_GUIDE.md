# Pixel-Perfect Implementation Guide
## Ensuring Exact Prototype Replication in Vue+Quasar

**Purpose**: This guide ensures the React prototype design is implemented exactly in Vue+Quasar, maintaining visual fidelity to the pixel level.

### 🎯 Critical Success Principle

**The React prototype is the SINGLE SOURCE OF TRUTH for visual design**. Every visual element must match exactly. No creative interpretations allowed.

---

## 📊 Visual Comparison System

### 1. Side-by-Side Component Analysis

For each React component, create a Vue equivalent and document exact measurements:

| React Component | Vue Component | Critical Details | Status |
|----------------|---------------|------------------|---------|
| AppLayout | PrototypeLayout | 3-column: 280px + flex + 320px | ⏳ |
| Sidebar | LeftSidebar | 280px width, specific bg color | ⏳ |
| Header | AppHeader | 64px height, 3-line format | ⏳ |
| Card | BaseCard | #1A1A20 bg, 8px radius | ⏳ |
| Button | BaseButton | 6 variants × 4 sizes | ⏳ |

### 2. Measurement Documentation

For each component, document:

```markdown
## ComponentName - Exact Specifications

### Dimensions
- Width: [exact pixels or flex]
- Height: [exact pixels or auto]
- Padding: [top right bottom left] in pixels
- Margins: [exact spacing]

### Colors
- Background: [OKLCH + hex fallback]
- Text: [OKLCH + hex fallback]
- Border: [OKLCH + hex fallback]
- Hover/Active states: [exact colors]

### Typography
- Font: Geist
- Size: [exact pixels]
- Weight: [100-800]
- Line Height: [exact value]
- Letter Spacing: [exact em value]

### Shadows
- Box-shadow: [exact values]
- Inset shadows (if any)

### Border Radius
- All corners: [exact pixels]
- Individual corners (if different)

### Positioning
- Z-index values
- Position (relative/absolute/fixed)
- Top/Right/Bottom/Left values

### Animations
- Transition duration
- Easing function
- Transform values
```

### 3. Interactive States Documentation

For every interactive element, document all states:

```javascript
// Example: Button States
const buttonStates = {
  default: {
    background: 'oklch(0.4365 0.1044 156.7556)',
    text: 'oklch(0.098 0 0)',
    transform: 'translateY(0)',
    boxShadow: 'var(--shadow-sm)'
  },
  hover: {
    background: 'oklch(0.4835 0.1152 156.7556)', // 10% lighter
    transform: 'translateY(-1px)',
    boxShadow: 'var(--shadow-md)'
  },
  active: {
    transform: 'translateY(0)',
    boxShadow: 'var(--shadow-sm)'
  },
  disabled: {
    background: 'oklch(0.2809 0 0)',
    text: 'oklch(0.512 0 0)',
    cursor: 'not-allowed'
  }
}
```

---

## 🔍 React→Vue Mapping Strategy

### 1. Component Structure Mapping

**React Pattern** → **Vue/Quasar Pattern**:

```jsx
// React - AppLayout
<div className="min-h-screen bg-background">
  <Sidebar />
  <main className="flex-1">
    <Header />
    <Outlet />
  </main>
  <SecondarySidebar />
</div>
```

```vue
<!-- Vue - PrototypeLayout -->
<q-layout class="prototype-layout" view="hHh lpR fFf">
  <q-drawer side="left" :width="280" overlay behavior="desktop">
    <LeftSidebar />
  </q-drawer>

  <q-page-container>
    <AppHeader />
    <router-view />
  </q-page-container>

  <q-drawer side="right" :width="320" overlay behavior="desktop">
    <RightSidebar />
  </q-drawer>
</q-layout>
```

### 2. Styling Mapping

**React/Tailwind** → **Vue/Quasar + Tailwind**:

```jsx
// React with Tailwind
<div className="bg-card border-border/50 rounded-lg p-6 shadow-md">
  <h2 className="text-lg font-light tracking-tight">Title</h2>
</div>
```

```vue
<!-- Vue with Quasar + Tailwind -->
<q-card flat class="prototype-card">
  <q-card-section class="p-6">
    <h2 class="text-lg font-light tracking-tight">Title</h2>
  </q-card-section>
</q-card>

<style lang="scss">
.prototype-card {
  background: var(--card);
  border: 1px solid oklch(0.2809 0 0 / 0.5);
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
}
</style>
```

### 3. State Management Mapping

**React Context/useState** → **Vue Pinia**:

```jsx
// React
const [sidebarOpen, setSidebarOpen] = useState(true);
const { organization } = useOrganization();
```

```vue
<!-- Vue -->
<script setup>
import { storeToRefs } from 'pinia';
import { useLayoutStore } from '@/stores/layout';
import { useOrganizationStore } from '@/stores/organization';

const layoutStore = useLayoutStore();
const { sidebarOpen } = storeToRefs(layoutStore);

const organizationStore = useOrganizationStore();
const { organization } = storeToRefs(organizationStore);
</script>
```

---

## 🎨 Visual Fidelity Checklist

### Colors
- [ ] All OKLCH colors implemented with exact values
- [ ] Hex/RGB fallbacks working in older browsers
- [ ] Hover states match prototype exactly
- [ ] Active/pressed states match
- [ ] Disabled states match
- [ ] Border colors match exactly

### Typography
- [ ] Geist font loaded correctly
- [ ] All headings use light weight (300)
- [ ] Body text uses regular weight (400)
- [ ] Font sizes match exactly (15px base)
- [ ] Line heights match prototype
- [ ] Letter spacing: 0.025em
- [ ] Text colors match OKLCH values

### Spacing
- [ ] All padding values match exactly
- [ ] All margin values match exactly
- [ ] Gap values in flexbox/grid match
- [ ] Component internal spacing matches

### Layout
- [ ] Left sidebar exactly 280px
- [ ] Right sidebar exactly 320px
- [ ] Header exactly 64px height
- [ ] 3-column layout maintained
- [ ] Responsive breakpoints match
- [ ] Mobile bottom navigation visible

### Borders & Shadows
- [ ] Border radius: 8px base (var(--radius))
- [ ] Shadow system implemented exactly
- [ ] Border colors match OKLCH values
- [ ] Border widths match prototype

### Animations
- [ ] Sidebar transition: 300ms ease-in-out
- [ ] Button hover: 150ms ease-out
- [ ] Modal animations: 200ms ease-out
- [ ] Page transitions: 200ms ease-in-out
- [ ] Respect prefers-reduced-motion

---

## 🧪 Visual Testing Strategy

### 1. Automated Visual Regression

```typescript
// tests/visual/components.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Component Visual Regression', () => {
  test('Dashboard Layout matches prototype', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveScreenshot('dashboard-layout.png');
  });

  test('Member List matches prototype', async ({ page }) => {
    await page.goto('/members');
    await expect(page).toHaveScreenshot('member-list.png');
  });

  test('Attendance Kiosk matches prototype', async ({ page }) => {
    await page.goto('/attendance/kiosk');
    await expect(page).toHaveScreenshot('attendance-kiosk.png');
  });
});
```

### 2. Manual Visual Verification Checklist

For each page/component:

#### Desktop (1920x1080)
- [ ] Layout matches prototype exactly
- [ ] All components positioned correctly
- [ ] Typography renders correctly
- [ ] Colors display correctly
- [ ] Interactive states work

#### Mobile (375x667)
- [ ] Bottom navigation visible
- [ ] Content adapts correctly
- [ ] Touch targets are 48px minimum
- [ ] No horizontal scroll

#### Tablet (768x1024)
- [ ] Sidebars behave correctly
- [ ] Content adapts to medium screen

### 3. Cross-Browser Testing

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome 120+ | ✅ Required | Primary development browser |
| Firefox 113+ | ✅ Required | OKLCH support |
| Safari 16.4+ | ✅ Required | OKLCH support |
| Edge 120+ | ✅ Required | Chromium-based |

---

## 📱 Implementation Process

### For Each Component:

1. **Analyze React Component**
   - Open React component in VS Code
   - Screenshot the component
   - Note all Tailwind classes
   - Document exact measurements

2. **Create Vue Equivalent**
   - Create Vue component file
   - Use Quasar base component where applicable
   - Apply custom CSS for exact styling
   - Implement all states and variants

3. **Test Visual Match**
   - Take screenshot of Vue component
   - Compare with React screenshot
   - Use image diff tool if needed
   - Adjust until pixel-perfect

4. **Verify Functionality**
   - Test all interactions
   - Verify state management
   - Check responsive behavior
   - Validate accessibility

---

## 🚨 Critical Validation Points

### Must-Match Elements:

1. **Header Component**
   - Church acronym (line 1)
   - Full name + campus badge (line 2)
   - Address (line 3)
   - Logo on right
   - Exact 64px height

2. **Sidebar Navigation**
   - 280px exact width
   - Church info at top
   - Navigation items with exact icons
   - Active state indicators
   - User profile at bottom

3. **Card Components**
   - #1A1A20 background exactly
   - 8px border radius
   - Specific shadow values
   - Padding: 24px default, 16px compact

4. **Button Variants**
   - All 6 variants implemented
   - All 4 sizes implemented
   - Exact hover/active states
   - Disabled state styling

### Common Pitfalls to Avoid:

1. **Color Drift**
   - Always use OKLCH values
   - Test in multiple browsers
   - Verify fallback colors

2. **Font Issues**
   - Ensure Geist loads correctly
   - Check font-weight rendering
   - Verify fallback fonts

3. **Spacing Offsets**
   - Use exact pixel values
   - Account for border widths
   - Consider box-sizing

4. **Animation Differences**
   - Match timing exactly
   - Use same easing functions
   - Test reduced motion

---

## 📋 Final Acceptance Criteria

A component is "complete" only when:

- [ ] Visual screenshot matches React prototype exactly
- [ ] All states (default, hover, active, disabled) match
- [ ] Responsive behavior matches
- [ ] Accessibility features work
- [ ] Performance impact is acceptable
- [ ] Cross-browser compatible
- [ ] All tests pass

## 🔄 Iteration Process

1. **Implement** component
2. **Screenshot** and compare
3. **Adjust** until pixel-perfect
4. **Test** functionality
5. **Validate** accessibility
6. **Approve** and move to next

Remember: **The React prototype is law**. No deviations, no "improvements", no creative interpretations. Exact replication is the goal.