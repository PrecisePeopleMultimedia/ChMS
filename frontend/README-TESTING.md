# ChurchAfrica Testing Guide

## Overview

This project follows **Test-Driven Development (TDD)** principles with comprehensive unit and E2E testing for the authentication system. Our testing strategy focuses on **Africa-first** requirements including mobile optimization, low-bandwidth scenarios, and offline capabilities.

## Testing Stack

### Unit Testing
- **Vitest** - Fast unit test runner with native TypeScript support
- **Vue Test Utils** - Official Vue.js testing utilities
- **jsdom** - DOM environment for component testing

### E2E Testing
- **Playwright** - Cross-browser end-to-end testing
- **Mobile Testing** - Africa-first mobile device testing
- **Network Simulation** - Slow 3G connection testing

## Test Structure

```
frontend/
├── src/__tests__/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── ModernButton.spec.ts
│   │   │   ├── ModernInput.spec.ts
│   │   │   └── ModernAlert.spec.ts
│   │   ├── common/
│   │   │   └── BaseFormCard.spec.ts
│   │   └── auth/
│   │       └── LoginForm.spec.ts
│   └── stores/
│       └── auth.spec.ts
├── e2e/
│   ├── auth.spec.ts
│   └── mobile.spec.ts
└── playwright.config.ts
```

## Running Tests

### Unit Tests

```bash
# Run unit tests in watch mode (development)
npm run test:unit

# Run unit tests once (CI/production)
npm run test:unit:run

# Run unit tests with coverage report
npm run test:unit:coverage
```

### E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with browser UI (debugging)
npm run test:e2e:headed

# Run mobile-specific tests
npm run test:e2e:mobile

# Run all tests (unit + E2E)
npm run test:all

# Run CI test suite with coverage
npm run test:ci
```

## Test Coverage

### Unit Tests Cover:
- ✅ **UI Components** - ModernButton, ModernInput, ModernAlert
- ✅ **Form Components** - BaseFormCard, LoginForm
- ✅ **Store Logic** - Auth store with all methods
- ✅ **Props & Events** - Component interfaces
- ✅ **Error Handling** - Network errors, validation errors
- ✅ **Loading States** - Async operation states
- ✅ **Accessibility** - ARIA attributes, keyboard navigation

### E2E Tests Cover:
- ✅ **Authentication Flow** - Login, register, logout
- ✅ **Google OAuth** - OAuth redirect flow
- ✅ **Dashboard** - User profile, system status
- ✅ **Error Scenarios** - Network errors, invalid credentials
- ✅ **Mobile Testing** - Touch interactions, responsive design
- ✅ **Performance** - Load times, 3G simulation

## Africa-First Testing

### Mobile Device Testing
Tests run on devices common in African markets:
- **Pixel 5** - Mid-range Android
- **Galaxy S5** - Lower-end Android (still common)
- **iPhone 12** - iOS testing

### Performance Testing
- **3G Network Simulation** - Tests slow connection scenarios
- **Load Time Requirements** - < 3 seconds on 3G
- **Bundle Size Monitoring** - < 500KB initial load
- **Touch-Friendly UI** - Minimum 44px button heights

### Offline Testing
- **Service Worker** - Offline functionality testing
- **Network Failures** - Graceful degradation testing
- **Data Persistence** - LocalStorage reliability

## Test-Driven Development Workflow

### 1. Write Failing Test
```typescript
test('should login successfully with valid credentials', async () => {
  // Arrange
  const authStore = useAuthStore()
  const credentials = { email: 'test@example.com', password: 'password123' }
  
  // Act
  await authStore.login(credentials)
  
  // Assert
  expect(authStore.isAuthenticated).toBe(true)
  expect(authStore.user).toBeDefined()
})
```

### 2. Write Minimal Code to Pass
```typescript
const login = async (credentials: LoginCredentials) => {
  // Minimal implementation
  user.value = { id: 1, email: credentials.email }
  token.value = 'mock-token'
}
```

### 3. Refactor and Improve
```typescript
const login = async (credentials: LoginCredentials) => {
  try {
    isLoading.value = true
    const response = await axios.post('/auth/login', credentials)
    user.value = response.data.user
    token.value = response.data.token
    // Store in localStorage, set axios headers, etc.
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
  }
}
```

## Component Testing Examples

### Testing Props and Events
```typescript
test('emits click event when button is clicked', async () => {
  const wrapper = mount(ModernButton, {
    slots: { default: 'Click me' }
  })
  
  await wrapper.trigger('click')
  expect(wrapper.emitted('click')).toHaveLength(1)
})
```

### Testing User Interactions
```typescript
test('updates model value on input', async () => {
  const wrapper = mount(ModernInput, {
    props: { modelValue: '' }
  })
  
  await wrapper.find('input').setValue('new value')
  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value'])
})
```

### Testing Error States
```typescript
test('shows error message when error prop is provided', () => {
  const wrapper = mount(ModernInput, {
    props: { 
      modelValue: '',
      error: 'This field is required'
    }
  })
  
  expect(wrapper.text()).toContain('This field is required')
  expect(wrapper.find('input').classes()).toContain('border-destructive')
})
```

## E2E Testing Examples

### Authentication Flow Testing
```typescript
test('should complete full authentication flow', async ({ page }) => {
  // Register new user
  await page.goto('/register')
  await page.fill('input[type="email"]', 'new@example.com')
  await page.fill('input[type="password"]', 'password123')
  await page.click('button:has-text("Create Account")')
  
  // Should redirect to dashboard
  await expect(page).toHaveURL('/dashboard')
  
  // Logout
  await page.click('button:has-text("Logout")')
  await expect(page).toHaveURL('/login')
})
```

### Mobile Testing
```typescript
test('should work on mobile devices', async ({ page }) => {
  // Test touch interactions
  await page.tap('input[type="email"]')
  await page.fill('input[type="email"]', 'mobile@example.com')
  
  // Check button size for touch
  const button = page.locator('button:has-text("Sign In")')
  const box = await button.boundingBox()
  expect(box?.height).toBeGreaterThanOrEqual(44)
})
```

## Debugging Tests

### Unit Test Debugging
```bash
# Run specific test file
npx vitest run src/__tests__/components/ui/ModernButton.spec.ts

# Run tests in debug mode
npx vitest --inspect-brk

# Run with verbose output
npx vitest --reporter=verbose
```

### E2E Test Debugging
```bash
# Run with browser UI
npm run test:e2e:headed

# Run specific test file
npx playwright test e2e/auth.spec.ts

# Debug mode with browser DevTools
npx playwright test --debug

# Generate test report
npx playwright show-report
```

## Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:ci
      - uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

## Best Practices

### Unit Testing
- ✅ Test component behavior, not implementation
- ✅ Mock external dependencies (axios, router)
- ✅ Test error states and edge cases
- ✅ Keep tests focused and isolated
- ✅ Use descriptive test names

### E2E Testing
- ✅ Test complete user workflows
- ✅ Use page object model for complex flows
- ✅ Test on multiple devices and browsers
- ✅ Include performance and accessibility checks
- ✅ Test offline and slow network scenarios

### Africa-First Considerations
- ✅ Test on low-end Android devices
- ✅ Simulate slow 3G connections
- ✅ Verify touch-friendly UI elements
- ✅ Test offline functionality
- ✅ Monitor bundle size and performance

## Troubleshooting

### Common Issues
1. **Tests timing out** - Increase timeout in playwright.config.ts
2. **Component not mounting** - Check for missing global plugins
3. **API mocks not working** - Verify mock setup in beforeEach
4. **E2E tests flaky** - Add proper wait conditions

### Getting Help
- Check test output for detailed error messages
- Use browser DevTools in headed mode for E2E tests
- Review test coverage reports for missing scenarios
- Consult Vitest and Playwright documentation

## Coverage Goals

- **Unit Tests**: 85%+ coverage for critical paths
- **E2E Tests**: 100% coverage for authentication flows
- **Mobile Tests**: All core features tested on mobile
- **Performance**: All pages load < 3s on 3G

This comprehensive testing strategy ensures the ChurchAfrica authentication system is reliable, performant, and optimized for African users.
