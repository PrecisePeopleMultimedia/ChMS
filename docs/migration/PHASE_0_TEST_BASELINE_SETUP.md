# Phase 0: Test Baseline Setup

**Created**: 2025-11-13  
**Purpose**: Establish comprehensive test baselines before any implementation begins  
**Status**: In Progress

**⚠️ CRITICAL**: This must be completed BEFORE starting Phase 1 implementation. All baselines will be used to validate that the migration doesn't break functionality or regress performance/accessibility.

---

## Overview

Phase 0 establishes four critical baselines:
1. **Visual Regression Baseline** - Screenshots of current UI for comparison
2. **Performance Baseline** - Current performance metrics and bundle sizes
3. **Accessibility Baseline** - Current accessibility state
4. **Functional Test Baseline** - Current functionality test suite

---

## 0.1 Visual Regression Baseline

### Setup Playwright Visual Testing

**Status**: Playwright already installed ✅

**Configuration**:
- Use existing `playwright.config.ts`
- Add visual regression project configuration
- Set up screenshot comparison

**Baseline Screenshots to Capture**:

#### Pages/Views (Full Page)
- [ ] `/` - Landing page
- [ ] `/auth/login` - Login page
- [ ] `/dashboard` - Dashboard view
- [ ] `/members` - Member list view
- [ ] `/members/:id` - Member detail view
- [ ] `/attendance` - Attendance view
- [ ] `/attendance/kiosk` - Kiosk mode
- [ ] `/settings` - Settings page
- [ ] `/profile` - Profile page

#### Components (Isolated)
- [ ] Button component (all variants, all sizes, all states)
- [ ] Card component (all variants)
- [ ] Input component (all states)
- [ ] Badge component (all variants)
- [ ] Navigation sidebar
- [ ] Header component
- [ ] Dashboard widgets
- [ ] Member card component
- [ ] Attendance card component

#### Layouts
- [ ] Dashboard layout (desktop)
- [ ] Dashboard layout (mobile)
- [ ] Auth layout
- [ ] Landing layout

#### Interactive States
- [ ] Button hover states
- [ ] Button active states
- [ ] Button focus states
- [ ] Input focus states
- [ ] Input error states
- [ ] Navigation active states

### Visual Test Structure

```
tests/visual/
├── baseline/
│   ├── pages/
│   │   ├── landing.spec.ts
│   │   ├── login.spec.ts
│   │   ├── dashboard.spec.ts
│   │   ├── members.spec.ts
│   │   └── attendance.spec.ts
│   ├── components/
│   │   ├── buttons.spec.ts
│   │   ├── cards.spec.ts
│   │   ├── forms.spec.ts
│   │   └── navigation.spec.ts
│   └── layouts/
│       ├── dashboard-layout.spec.ts
│       └── auth-layout.spec.ts
└── prototype-comparison/
    └── (will be added during implementation)
```

### Implementation Steps

1. **Create Baseline Test Files**
   - Create test files for each page/component
   - Use Playwright's `toHaveScreenshot()` for baseline capture
   - Disable animations for consistent screenshots

2. **Capture Baseline Screenshots**
   - Run baseline tests to capture current state
   - Store screenshots in `tests/visual/baseline/screenshots/`
   - Commit baseline screenshots to git (for comparison)

3. **Set Up Comparison Tool**
   - Configure Playwright to compare against baseline
   - Set up visual diff tool for side-by-side comparison
   - Configure threshold for acceptable differences

4. **CI/CD Integration**
   - Add visual regression tests to CI/CD pipeline
   - Fail builds if visual differences exceed threshold
   - Generate visual diff reports

---

## 0.2 Performance Baseline

### Setup Lighthouse CI

**Installation**:
```bash
npm install --save-dev @lhci/cli
```

**Configuration**:
- Create `lighthouserc.js` configuration
- Set performance budgets
- Configure CI/CD integration

### Metrics to Measure

#### Bundle Size
- [ ] Initial bundle size (gzipped) - Current: ___ KB
- [ ] Initial bundle size (uncompressed) - Current: ___ KB
- [ ] Total bundle size (gzipped) - Current: ___ KB
- [ ] Total bundle size (uncompressed) - Current: ___ KB
- [ ] Vendor bundle size - Current: ___ KB
- [ ] App bundle size - Current: ___ KB

#### Performance Metrics
- [ ] First Contentful Paint (FCP) - Current: ___ ms
- [ ] Largest Contentful Paint (LCP) - Current: ___ ms
- [ ] Time to Interactive (TTI) - Current: ___ ms
- [ ] Cumulative Layout Shift (CLS) - Current: ___
- [ ] First Input Delay (FID) - Current: ___ ms
- [ ] Total Blocking Time (TBT) - Current: ___ ms
- [ ] Speed Index - Current: ___

#### Network Metrics
- [ ] Total page load time - Current: ___ ms
- [ ] DOM content loaded - Current: ___ ms
- [ ] Resource load time - Current: ___ ms

#### Mobile Performance (3G Simulation)
- [ ] FCP on 3G - Current: ___ ms
- [ ] TTI on 3G - Current: ___ ms
- [ ] Load time on 3G - Current: ___ ms

### Performance Budgets (Targets)

**Bundle Size Budgets**:
- Initial load (gzipped): < 500KB ✅ (Target)
- Initial load (uncompressed): < 1.5MB ✅ (Target)
- Total bundle (gzipped): < 800KB ✅ (Target)

**Performance Budgets**:
- FCP: < 1.5s on 3G ✅ (Target)
- TTI: < 3s on 3G ✅ (Target)
- LCP: < 2.5s on 3G ✅ (Target)
- CLS: < 0.1 ✅ (Target)

### Implementation Steps

1. **Install Lighthouse CI**
   ```bash
   cd frontend
   npm install --save-dev @lhci/cli
   ```

2. **Create Lighthouse Configuration**
   - Create `lighthouserc.js`
   - Configure URLs to test
   - Set performance budgets
   - Configure CI/CD integration

3. **Run Baseline Measurements**
   - Run Lighthouse on all critical pages
   - Document current metrics
   - Store baseline reports

4. **Set Up Performance Monitoring**
   - Add performance tests to CI/CD
   - Fail builds if budgets exceeded
   - Generate performance reports

---

## 0.3 Accessibility Baseline

### Setup axe-core Testing

**Status**: @axe-core/playwright already installed ✅

**Configuration**:
- Use existing Playwright setup
- Configure axe-core rules
- Set up automated accessibility tests

### Accessibility Audit Areas

#### Automated Testing (axe-core)
- [ ] Run axe-core on all pages
- [ ] Document all violations
- [ ] Categorize violations by severity
- [ ] Create accessibility test suite

#### Manual Testing
- [ ] Keyboard navigation (all pages)
- [ ] Screen reader testing (NVDA, VoiceOver)
- [ ] Color contrast verification
- [ ] Focus indicators visibility
- [ ] ARIA labels completeness

#### WCAG 2.1 AA Compliance
- [ ] Perceivable (images, color, text)
- [ ] Operable (keyboard, timing, navigation)
- [ ] Understandable (readable, predictable)
- [ ] Robust (compatible, valid)

### Implementation Steps

1. **Create Accessibility Test Suite**
   - Use @axe-core/playwright
   - Test all pages
   - Test all interactive components

2. **Run Baseline Audit**
   - Run accessibility tests
   - Document all violations
   - Create baseline report

3. **Manual Testing**
   - Keyboard navigation testing
   - Screen reader testing
   - Color contrast verification

4. **Set Up CI/CD Integration**
   - Add accessibility tests to CI/CD
   - Fail builds on new violations
   - Generate accessibility reports

---

## 0.4 Functional Test Baseline

### Current Test Suite Status

**Existing Tests**:
- Unit tests (Vitest) - `tests/unit/`
- E2E tests (Playwright) - `tests/e2e/`
- Regression tests - `tests/e2e/regression/`

### Functional Test Coverage

#### Critical User Flows
- [ ] Authentication flow (login, logout, password reset)
- [ ] Dashboard access and navigation
- [ ] Member management (add, edit, view, delete)
- [ ] Attendance check-in (QR code, manual)
- [ ] Family management
- [ ] Settings access and updates

#### Component Functionality
- [ ] All form components work correctly
- [ ] All navigation components work correctly
- [ ] All interactive components respond correctly
- [ ] All data display components render correctly

#### Offline Functionality
- [ ] Offline data access
- [ ] Offline action queuing
- [ ] Offline sync when online
- [ ] Offline indicators display correctly

### Implementation Steps

1. **Audit Existing Tests**
   - Review all existing tests
   - Document test coverage
   - Identify gaps

2. **Run Full Test Suite**
   - Run all unit tests
   - Run all E2E tests
   - Run all regression tests
   - Document test results

3. **Create Test Baseline Report**
   - Document test coverage
   - Document passing tests
   - Document failing tests (if any)
   - Document test gaps

4. **Ensure All Tests Pass**
   - Fix any failing tests
   - Ensure 100% pass rate before migration
   - Document baseline test results

---

## Baseline Documentation

### Files to Create

1. **Visual Baseline Report**
   - `docs/migration/baseline/VISUAL_BASELINE_REPORT.md`
   - List of all baseline screenshots
   - Screenshot locations
   - Comparison instructions

2. **Performance Baseline Report**
   - `docs/migration/baseline/PERFORMANCE_BASELINE_REPORT.md`
   - Current metrics
   - Performance budgets
   - Comparison targets

3. **Accessibility Baseline Report**
   - `docs/migration/baseline/ACCESSIBILITY_BASELINE_REPORT.md`
   - Current violations
   - Compliance status
   - Improvement targets

4. **Functional Test Baseline Report**
   - `docs/migration/baseline/FUNCTIONAL_BASELINE_REPORT.md`
   - Test coverage
   - Test results
   - Test gaps

---

## Acceptance Criteria

### Visual Regression Baseline
- [ ] Playwright visual testing configured
- [ ] Baseline screenshots captured for all pages
- [ ] Baseline screenshots captured for all components
- [ ] Baseline screenshots captured for all layouts
- [ ] Baseline screenshots committed to git
- [ ] Visual comparison tool configured
- [ ] CI/CD integration set up

### Performance Baseline
- [ ] Lighthouse CI installed and configured
- [ ] Baseline metrics documented for all pages
- [ ] Performance budgets defined
- [ ] Performance monitoring in CI/CD
- [ ] Baseline reports generated

### Accessibility Baseline
- [ ] axe-core tests created for all pages
- [ ] Baseline violations documented
- [ ] Manual testing completed
- [ ] Accessibility test suite in CI/CD
- [ ] Baseline reports generated

### Functional Test Baseline
- [ ] All existing tests reviewed
- [ ] All tests passing
- [ ] Test coverage documented
- [ ] Test gaps identified
- [ ] Baseline test results documented

---

## Next Steps After Baseline Setup

Once Phase 0 is complete:

1. **Begin Phase 1**: Design System Foundation
   - Use baselines to validate no regressions
   - Compare new implementation with baseline
   - Ensure performance doesn't degrade

2. **Continuous Validation**:
   - Run visual regression tests after each component
   - Run performance tests after each phase
   - Run accessibility tests after each component
   - Run functional tests after each change

3. **Comparison with React Prototype**:
   - Compare Vue implementation with React prototype
   - Use visual regression tests for pixel-perfect matching
   - Document any differences (should be zero)

---

**Last Updated**: 2025-11-13  
**Status**: In Progress - Ready for Implementation

