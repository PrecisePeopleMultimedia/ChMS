# Pixel-Perfect Validation Checklist

**Purpose**: Ensure every component, layout, and visual element matches the React prototype exactly.

**⚠️ CRITICAL PRINCIPLE**: The React prototype (`ChMS-by-Make`) is the **SINGLE SOURCE OF TRUTH**. No deviations, no "improvements", no creative interpretations.

---

## Validation Process for Each Component

### Step 1: Analyze React Component
1. Open React component in `ChMS-by-Make/src/components/`
2. Take screenshot of component in default state
3. Document exact measurements:
   - Width, height (if fixed)
   - Padding (top, right, bottom, left)
   - Margins
   - Border radius
   - Box shadow values
   - Font size, weight, line-height, letter-spacing
   - Colors (OKLCH values)
4. Test all interactive states:
   - Hover state
   - Active/pressed state
   - Disabled state
   - Focus state
5. Take screenshots of each state

### Step 2: Implement Vue Component
1. Create Vue component matching React structure
2. Use `docs/migration/REACT_VUE_COMPONENT_MAPPING.md` for exact conversion
3. Apply exact styling from React component
4. Implement all states and variants

### Step 3: Visual Comparison
1. Take screenshot of Vue component in same states
2. Use side-by-side comparison tool
3. Use image diff tool to identify differences
4. Adjust until pixel-perfect match

### Step 4: Measurement Verification
1. Use browser DevTools to measure:
   - Exact pixel dimensions
   - Exact spacing values
   - Exact color values (OKLCH)
   - Exact font properties
2. Compare with React prototype measurements
3. Adjust until exact match

### Step 5: Visual Regression Test
1. Run visual regression test (see `docs/testing/VISUAL_REGRESSION_SETUP.md`)
2. Compare Vue screenshot with React prototype baseline
3. Ensure test passes (no visual differences)

### Step 6: Cross-Browser Verification
1. Test in Chrome 120+
2. Test in Firefox 113+
3. Test in Safari 16.4+
4. Verify OKLCH colors render correctly
5. Verify fallback colors work in older browsers

---

## Component-Specific Validation

### Layout Components

#### PrototypeLayout
- [ ] Left sidebar: **EXACTLY 280px** (measured with DevTools)
- [ ] Right sidebar: **EXACTLY 320px** (measured with DevTools)
- [ ] Main content: Flexible width matches prototype
- [ ] Mobile bottom nav: Always visible, exact styling
- [ ] Sidebar animations: 300ms ease-in-out (exact timing)

#### AppHeader
- [ ] Line 1: **EXACT font-size: 2.4em, line-height: 1, font-weight: 300, margin-bottom: 0.25em**
- [ ] Line 2: **EXACT divider (h-px bg-border mb-1.5), gap-2, text-muted-foreground**
- [ ] Line 3: **EXACT text-sm, text-muted-foreground**
- [ ] Logo: **EXACT positioning and sizing**
- [ ] Progress badge: **EXACT styling (if present)**

#### LeftSidebar
- [ ] Width: **EXACTLY 280px**
- [ ] Background: **EXACT OKLCH color**
- [ ] Church info section: **EXACT styling**
- [ ] Navigation items: **EXACT spacing, icons, active states**
- [ ] User profile section: **EXACT styling**

### UI Components

#### Button
- [ ] All 6 variants match prototype exactly
- [ ] All 4 sizes match prototype exactly
- [ ] Hover state: **EXACT color change, transform, shadow**
- [ ] Active state: **EXACT styling**
- [ ] Disabled state: **EXACT styling**
- [ ] Focus ring: **EXACT color and width**

#### Card
- [ ] Background: **EXACT OKLCH color** (`oklch(0.2046 0 0)`)
- [ ] Border: **EXACT OKLCH color and width**
- [ ] Border radius: **EXACTLY 8px** (`0.5rem`)
- [ ] Padding: **EXACT values** (24px default, 16px compact)
- [ ] Shadow: **EXACT shadow values** from prototype

#### Input
- [ ] Background: **EXACT OKLCH color**
- [ ] Border: **EXACT OKLCH color**
- [ ] Focus ring: **EXACT color and width**
- [ ] Error state: **EXACT styling**
- [ ] Disabled state: **EXACT styling**

---

## Visual Fidelity Checklist

### Colors
- [ ] All OKLCH colors match prototype exactly (use DevTools to verify)
- [ ] Hex/RGB fallbacks match prototype exactly
- [ ] Hover states match prototype exactly
- [ ] Active states match prototype exactly
- [ ] Disabled states match prototype exactly
- [ ] Border colors match prototype exactly

### Typography
- [ ] Geist font loads correctly
- [ ] All headings use **EXACT font-weight: 300** (light)
- [ ] Body text uses **EXACT font-weight: 400** (regular)
- [ ] Font sizes match prototype exactly (15px base)
- [ ] Line heights match prototype exactly
- [ ] Letter spacing: **EXACTLY 0.025em** (normal)
- [ ] Text colors match OKLCH values exactly

### Spacing
- [ ] All padding values match prototype exactly (use DevTools)
- [ ] All margin values match prototype exactly
- [ ] Gap values in flexbox/grid match prototype exactly
- [ ] Component internal spacing matches prototype exactly

### Layout
- [ ] Left sidebar: **EXACTLY 280px** (not 275px, not 285px)
- [ ] Right sidebar: **EXACTLY 320px** (not 315px, not 325px)
- [ ] Header: **EXACTLY 64px height** (if applicable)
- [ ] 3-column layout maintained exactly
- [ ] Responsive breakpoints match prototype exactly
- [ ] Mobile bottom navigation visible and styled exactly

### Borders & Shadows
- [ ] Border radius: **EXACTLY 8px** (`0.5rem`) base
- [ ] Shadow system matches prototype exactly (use DevTools to verify)
- [ ] Border colors match OKLCH values exactly
- [ ] Border widths match prototype exactly

### Animations
- [ ] Sidebar transition: **EXACTLY 300ms ease-in-out**
- [ ] Button hover: **EXACTLY 150ms ease-out**
- [ ] Modal animations: **EXACTLY 200ms ease-out**
- [ ] Page transitions: **EXACTLY 200ms ease-in-out**
- [ ] Respects prefers-reduced-motion

---

## Testing Requirements

### Visual Regression Testing
- [ ] Component screenshot matches React prototype baseline
- [ ] All states (default, hover, active, disabled) match
- [ ] Cross-browser screenshots match
- [ ] Mobile screenshots match

### Measurement Testing
- [ ] Use DevTools to verify exact pixel measurements
- [ ] Compare with React prototype measurements
- [ ] Document any differences (should be zero)

### Color Testing
- [ ] Use DevTools to verify exact OKLCH values
- [ ] Compare with React prototype OKLCH values
- [ ] Test fallback colors in older browsers

---

## Acceptance Criteria

A component is **COMPLETE** only when:

1. ✅ **Visual screenshot matches React prototype exactly** (pixel-perfect)
2. ✅ **All states (default, hover, active, disabled) match exactly**
3. ✅ **All measurements match exactly** (verified with DevTools)
4. ✅ **All colors match exactly** (OKLCH values verified)
5. ✅ **All typography matches exactly** (font, size, weight, spacing)
6. ✅ **All animations match exactly** (timing, easing)
7. ✅ **Visual regression test passes**
8. ✅ **Cross-browser compatible**
9. ✅ **Accessibility requirements met**
10. ✅ **Performance impact acceptable**

---

## Common Pitfalls to Avoid

1. **Color Drift**: Always use exact OKLCH values, test in multiple browsers
2. **Font Issues**: Ensure Geist loads correctly, verify font-weight rendering
3. **Spacing Offsets**: Use exact pixel values, account for border widths
4. **Animation Differences**: Match timing exactly, use same easing functions
5. **Layout Differences**: Verify exact pixel measurements, don't approximate

---

## References

- **Pixel-Perfect Guide**: `docs/migration/PIXEL_PERFECT_IMPLEMENTATION_GUIDE.md`
- **Component Mapping**: `docs/migration/REACT_VUE_COMPONENT_MAPPING.md`
- **Visual Testing**: `docs/testing/VISUAL_REGRESSION_SETUP.md`
- **Design Tokens**: `docs/migration/DESIGN_TOKENS.md`
- **React Prototype**: `ChMS-by-Make/src/components/`

---

**Remember**: The React prototype is law. No deviations, no "improvements", no creative interpretations. Exact replication is the goal.

