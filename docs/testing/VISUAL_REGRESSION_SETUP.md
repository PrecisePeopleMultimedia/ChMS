# Visual Regression Testing Setup
## Ensuring Pixel-Perfect Prototype Matching

**Purpose**: Complete testing strategy to ensure Vue implementation matches React prototype exactly.

---

## 🧪 Testing Infrastructure

### 1. Playwright Configuration for Visual Testing

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:9000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/*.visual.spec.ts'
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: '**/*.visual.spec.ts'
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: '**/*.visual.spec.ts'
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      testMatch: '**/*.mobile.visual.spec.ts'
    }
  ],
  webServer: {
    command: 'npm run dev:test',
    port: 9000,
    reuseExistingServer: !process.env.CI
  }
});
```

### 2. Visual Test Suite Structure

```
tests/visual/
├── components/
│   ├── buttons.visual.spec.ts
│   ├── cards.visual.spec.ts
│   ├── forms.visual.spec.ts
│   └── navigation.visual.spec.ts
├── pages/
│   ├── dashboard.visual.spec.ts
│   ├── members.visual.spec.ts
│   ├── attendance.visual.spec.ts
│   └── settings.visual.spec.ts
├── responsive/
│   ├── mobile.visual.spec.ts
│   ├── tablet.visual.spec.ts
│   └── desktop.visual.spec.ts
├── interactions/
│   ├── hover-states.visual.spec.ts
│   ├── focus-states.visual.spec.ts
│   └── active-states.visual.spec.ts
└── cross-browser/
    ├── chrome.visual.spec.ts
    ├── firefox.visual.spec.ts
    └── safari.visual.spec.ts
```

### 3. Component Visual Tests

```typescript
// tests/visual/components/buttons.visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Button Component Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-components/buttons');
  });

  test('Button variants match prototype exactly', async ({ page }) => {
    const buttonContainer = page.locator('[data-testid="button-variants"]');

    // Capture all button variants
    await expect(buttonContainer).toHaveScreenshot('button-variants.png', {
      fullPage: false,
      animations: 'disabled'
    });
  });

  test('Button sizes match prototype exactly', async ({ page }) => {
    const buttonContainer = page.locator('[data-testid="button-sizes"]');

    await expect(buttonContainer).toHaveScreenshot('button-sizes.png', {
      fullPage: false,
      animations: 'disabled'
    });
  });

  test('Button states match prototype exactly', async ({ page }) => {
    const buttonContainer = page.locator('[data-testid="button-states"]');

    // Test hover state
    await page.hover('[data-testid="button-default"]');
    await expect(buttonContainer).toHaveScreenshot('button-hover.png', {
      fullPage: false,
      animations: 'disabled'
    });

    // Test focus state
    await page.keyboard.press('Tab');
    await expect(buttonContainer).toHaveScreenshot('button-focus.png', {
      fullPage: false,
      animations: 'disabled'
    });

    // Test active state
    await page.keyboard.press('Enter');
    await expect(buttonContainer).toHaveScreenshot('button-active.png', {
      fullPage: false,
      animations: 'disabled'
    });
  });
});
```

### 4. Page Layout Tests

```typescript
// tests/visual/pages/dashboard.visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard Page Visual Tests', () => {
  test('Desktop layout matches prototype exactly', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/dashboard');

    // Wait for all components to load
    await page.waitForLoadState('networkidle');

    // Capture full dashboard
    await expect(page).toHaveScreenshot('dashboard-desktop.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('Mobile layout matches prototype exactly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('dashboard-mobile.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('Tablet layout matches prototype exactly', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('dashboard-tablet.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });
});
```

---

## 📊 Test Component Creation

### 1. Visual Test Components

Create dedicated test pages to isolate components:

```vue
<!-- src/test-components/ButtonTestPage.vue -->
<template>
  <div class="test-container">
    <!-- Button Variants -->
    <div data-testid="button-variants" class="test-section">
      <h2>Button Variants</h2>
      <div class="button-grid">
        <BaseButton variant="default">Default</BaseButton>
        <BaseButton variant="outline">Outline</BaseButton>
        <BaseButton variant="ghost">Ghost</BaseButton>
        <BaseButton variant="destructive">Destructive</BaseButton>
        <BaseButton variant="secondary">Secondary</BaseButton>
        <BaseButton variant="link">Link</BaseButton>
      </div>
    </div>

    <!-- Button Sizes -->
    <div data-testid="button-sizes" class="test-section">
      <h2>Button Sizes</h2>
      <div class="button-grid">
        <BaseButton size="sm">Small</BaseButton>
        <BaseButton size="default">Default</BaseButton>
        <BaseButton size="lg">Large</BaseButton>
        <BaseButton size="icon">
          <q-icon name="add" />
        </BaseButton>
      </div>
    </div>

    <!-- Button States -->
    <div data-testid="button-states" class="test-section">
      <h2>Button States</h2>
      <div class="button-grid">
        <BaseButton data-testid="button-default">Default</BaseButton>
        <BaseButton disabled>Disabled</BaseButton>
        <BaseButton loading>Loading</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '@/components/ui/BaseButton.vue';
</script>

<style lang="scss" scoped>
.test-container {
  padding: 24px;
  background: var(--background);
  min-height: 100vh;
}

.test-section {
  margin-bottom: 48px;

  h2 {
    font-size: 1.25rem;
    font-weight: 300;
    margin-bottom: 16px;
    color: var(--foreground);
  }
}

.button-grid {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
```

---

## 🔍 Side-by-Side Comparison Tool

### 1. Comparison Page

```vue
<!-- src/test-components/ComparisonPage.vue -->
<template>
  <div class="comparison-container">
    <h1>React vs Vue Component Comparison</h1>

    <div class="comparison-grid">
      <!-- React Prototype (screenshot) -->
      <div class="comparison-item">
        <h2>React Prototype (Reference)</h2>
        <div class="component-preview">
          <img :src="reactScreenshot" alt="React component" />
        </div>
      </div>

      <!-- Vue Implementation -->
      <div class="comparison-item">
        <h2>Vue Implementation</h2>
        <div class="component-preview">
          <component :is="currentComponent" />
        </div>
      </div>
    </div>

    <!-- Component Selector -->
    <div class="component-selector">
      <q-btn
        v-for="comp in components"
        :key="comp.name"
        :color="currentComponent === comp.component ? 'primary' : 'grey'"
        @click="currentComponent = comp.component"
      >
        {{ comp.name }}
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import LeftSidebar from '@/components/layout/LeftSidebar.vue';
import AppHeader from '@/components/layout/AppHeader.vue';

const currentComponent = ref(BaseButton);

const components = [
  { name: 'Button', component: BaseButton },
  { name: 'Card', component: BaseCard },
  { name: 'Sidebar', component: LeftSidebar },
  { name: 'Header', component: AppHeader }
];

// Import screenshots from React prototype
const reactScreenshots = {
  BaseButton: '/screenshots/react/Button.png',
  BaseCard: '/screenshots/react/Card.png',
  LeftSidebar: '/screenshots/react/Sidebar.png',
  AppHeader: '/screenshots/react/Header.png'
};

const reactScreenshot = computed(() => {
  const componentName = components.find(c => c.component === currentComponent.value)?.name;
  return reactScreenshots[componentName] || '';
});
</script>

<style lang="scss" scoped>
.comparison-container {
  padding: 24px;
  background: var(--background);
  min-height: 100vh;
}

h1 {
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 24px;
  color: var(--foreground);
}

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.comparison-item {
  h2 {
    font-size: 1.125rem;
    font-weight: 300;
    margin-bottom: 16px;
    color: var(--foreground);
  }
}

.component-preview {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  min-height: 200px;

  img {
    max-width: 100%;
    height: auto;
  }
}

.component-selector {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
```

---

## ⚡ Automated Visual Testing Pipeline

### 1. GitHub Actions Workflow

```yaml
# .github/workflows/visual-regression.yml
name: Visual Regression Tests

on:
  push:
    branches: [ main, 'feature/figma-prototype-migration' ]
  pull_request:
    branches: [ main ]

jobs:
  visual-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Build application
        run: npm run build

      - name: Start test server
        run: npm run dev:test &
        run: sleep 10

      - name: Run visual tests
        run: npx playwright test tests/visual

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

      - name: Upload screenshots
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: screenshots
          path: tests/visual/screenshots/
          retention-days: 30

      - name: Visual regression report
        if: failure()
        run: |
          echo "## Visual Regression Results" >> $GITHUB_STEP_SUMMARY
          echo "![Comparison](screenshots/comparison.png)" >> $GITHUB_STEP_SUMMARY
```

---

## 📋 Visual Testing Checklist

### Pre-Implementation Setup:
- [ ] Playwright installed and configured
- [ ] Test components created
- [ ] Baseline screenshots captured
- [ ] Comparison page functional
- [ ] CI/CD pipeline configured

### During Implementation:
- [ ] Component visual tests pass
- [ ] Page layout tests pass
- [ ] Responsive tests pass
- [ ] Cross-browser tests pass
- [ ] No visual regressions

### Post-Implementation:
- [ ] All visual tests passing
- [ ] Performance impact measured
- [ ] Accessibility verified
- [ ] User acceptance testing completed

---

## 🎯 Success Criteria

A component is visually complete when:

1. **Pixel-Perfect Match**: Screenshots are identical (or intentionally different)
2. **All States Covered**: Default, hover, focus, active, disabled states match
3. **Responsive Correct**: Mobile, tablet, desktop layouts match
4. **Cross-Browser Compatible**: Chrome, Firefox, Safari all render correctly
5. **Accessible**: Color contrast, keyboard navigation, screen readers work
6. **Performant**: No layout shifts, smooth animations

---

## 🔧 Visual Debugging Tools

### 1. Chrome DevTools
```javascript
// Console commands for debugging
// Measure exact dimensions
document.querySelector('.component').getBoundingClientRect();

// Check computed styles
getComputedStyle(document.querySelector('.component'));

// Compare colors
const element = document.querySelector('.component');
const styles = getComputedStyle(element);
console.log('Background:', styles.backgroundColor);
console.log('Color:', styles.color);
```

### 2. Browser Extensions
- **PerfectPixel**: Overlay design for pixel-perfect comparison
- **ColorZilla**: Exact color picker
- **MeasureIt**: Measure distances on screen
- **Window Resizer**: Test responsive breakpoints

This comprehensive testing strategy ensures your Vue implementation matches the React prototype exactly at the pixel level.