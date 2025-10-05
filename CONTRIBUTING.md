# Contributing to ChMS

Welcome to the ChMS (Church Management System) project! We're excited to have you contribute to this Africa-first, offline-capable church management solution.

## 🌍 **Project Vision**

ChMS is designed specifically for African churches with enterprise ambitions, focusing on:
- **Offline-first functionality** for unreliable internet connections
- **Mobile-optimized experience** for Android devices
- **Low-bandwidth optimization** for 3G networks
- **Enterprise-ready scalability** for growing organizations

## 🚀 **Getting Started**

### **Prerequisites**

- **Node.js** 18+ and npm
- **PHP** 8.2+ and Composer
- **Git** with GPG signing configured
- **Docker** (optional, for consistent development environment)

### **Development Setup**

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ChMS.git
   cd ChMS
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev
   ```

3. **Setup Backend**
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate
   php artisan serve
   ```

4. **Run Tests**
   ```bash
   # Frontend tests
   cd frontend && npm run test:unit
   
   # Backend tests
   cd backend && php artisan test
   
   # E2E tests
   cd frontend && npm run test:e2e
   ```

## 📋 **Development Workflow**

### **1. Choose an Issue**

- Browse [GitHub Issues](https://github.com/JerryAgenyiInc/ChMS/issues)
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to indicate you're working on it

### **2. Create Feature Branch**

```bash
# Start from dev branch
git checkout dev
git pull origin dev

# Create feature branch
git checkout -b feature/your-feature-name
```

### **3. Development Process**

- **Follow TDD**: Write tests first, then implementation
- **Africa-First**: Consider offline functionality and mobile optimization
- **Small Commits**: Make frequent, focused commits
- **Test Locally**: Ensure all tests pass before pushing

### **4. Submit Pull Request**

```bash
# Push your branch
git push origin feature/your-feature-name

# Create PR via GitHub UI
# Target: feature/your-feature-name → dev
```

## 🎯 **Contribution Guidelines**

### **Code Standards**

#### **Frontend (Vue 3 + TypeScript)**

- **Use Composition API** for all new components
- **TypeScript strict mode** - no `any` types
- **Component structure**:
  ```vue
  <template>
    <!-- Template with semantic HTML -->
  </template>

  <script setup lang="ts">
  // Composition API with TypeScript
  </script>

  <style scoped>
  /* Component-specific styles */
  </style>
  ```

#### **Backend (Laravel 11 + PHP 8.2)**

- **Follow PSR-12** coding standards
- **Use type declarations** for all parameters and return types
- **Repository pattern** for data access
- **Service classes** for business logic

### **Testing Requirements**

#### **Frontend Testing**

- **Unit Tests**: Vitest for components and composables
- **E2E Tests**: Playwright for user workflows
- **Coverage**: Minimum 85% for critical paths

```typescript
// Example unit test
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginForm from '@/components/auth/LoginForm.vue'

describe('LoginForm', () => {
  it('validates email format', async () => {
    const wrapper = mount(LoginForm)
    // Test implementation
  })
})
```

#### **Backend Testing**

- **Feature Tests**: Laravel's testing framework
- **Unit Tests**: PHPUnit for services and utilities
- **API Tests**: Test all endpoints with various scenarios

```php
// Example feature test
class AuthenticationTest extends TestCase
{
    public function test_user_can_login_with_valid_credentials()
    {
        // Test implementation
    }
}
```

### **Africa-First Development**

#### **Performance Requirements**

- **Bundle Size**: Keep JavaScript bundles under 500KB
- **Load Time**: Page load under 3 seconds on 3G
- **Mobile Performance**: 60fps on mid-range Android devices
- **Offline Capability**: Core features work without internet

#### **Mobile Optimization**

- **Touch-Friendly**: Minimum 44px touch targets
- **Responsive Design**: Mobile-first approach
- **Progressive Enhancement**: Works on older devices
- **Accessibility**: WCAG AA compliance

#### **Offline-First Features**

- **Service Workers**: Cache critical resources
- **IndexedDB**: Store data locally
- **Background Sync**: Queue actions for when online
- **Conflict Resolution**: Handle data synchronization

## 📝 **Commit Message Format**

Use [Conventional Commits](https://conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### **Examples**

```bash
feat(auth): add Google OAuth integration
fix(api): resolve CORS issue for mobile clients
docs(readme): update installation instructions
perf(mobile): reduce bundle size by 30%
test(auth): add unit tests for login flow
```

### **Africa-First Scopes**

- `offline`: Offline functionality
- `mobile`: Mobile optimizations
- `3g`: Low bandwidth features
- `pwa`: Progressive Web App features
- `i18n`: Internationalization

## 🔍 **Code Review Process**

### **Before Submitting PR**

- [ ] All tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation updated if needed
- [ ] Mobile testing completed
- [ ] Offline functionality verified
- [ ] Performance impact assessed

### **PR Requirements**

- **Clear Description**: Explain what and why
- **Screenshots**: For UI changes
- **Testing Notes**: How to test the changes
- **Breaking Changes**: Document any breaking changes
- **Performance Impact**: Note any performance implications

### **Review Criteria**

Reviewers will check for:

- **Functionality**: Does it work as expected?
- **Code Quality**: Is it maintainable and readable?
- **Performance**: Does it meet Africa-first requirements?
- **Security**: Are there any security concerns?
- **Testing**: Are tests comprehensive and passing?
- **Documentation**: Is it properly documented?

## 🐛 **Bug Reports**

### **Before Reporting**

1. **Search existing issues** to avoid duplicates
2. **Test on latest version** to ensure it's not already fixed
3. **Reproduce consistently** to provide clear steps

### **Bug Report Template**

```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- OS: [e.g., Android 12]
- Browser: [e.g., Chrome 91]
- Network: [e.g., 3G, WiFi]
- Device: [e.g., Samsung Galaxy A32]

**Screenshots**
Add screenshots if applicable.
```

## 💡 **Feature Requests**

### **Feature Request Template**

```markdown
**Feature Description**
A clear description of the feature.

**Problem Statement**
What problem does this solve for African churches?

**Proposed Solution**
How should this feature work?

**Africa-First Considerations**
- Offline capability needed?
- Mobile optimization required?
- Low bandwidth considerations?
- Accessibility requirements?

**Alternatives Considered**
Other solutions you've considered.
```

## 🏆 **Recognition**

Contributors will be recognized in:

- **README.md**: Contributors section
- **Release Notes**: Feature attribution
- **GitHub**: Contributor badges
- **Community**: Shout-outs in team meetings

## 📚 **Resources**

### **Documentation**

- [Git Workflow](docs/git-workflow.md)
- [Testing Guide](frontend/README-TESTING.md)
- [API Documentation](backend/docs/api.md)
- [Deployment Guide](docs/deployment.md)

### **Learning Resources**

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Laravel 11 Documentation](https://laravel.com/docs/11.x)
- [Quasar Framework](https://quasar.dev/)
- [Playwright Testing](https://playwright.dev/)

### **Community**

- **GitHub Discussions**: Project discussions
- **Issues**: Bug reports and feature requests
- **Pull Requests**: Code contributions
- **Wiki**: Additional documentation

## ❓ **Getting Help**

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Code Comments**: For implementation questions
- **Documentation**: Check existing docs first

## 📄 **License**

By contributing to ChMS, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to ChMS! Together, we're building technology that empowers African churches to thrive in the digital age.** 🙏
