# Contributing to ChMS

Welcome to the ChMS (Church Management System) project! We're building an Africa-first, offline-capable church management solution that empowers churches across the continent.

## 🤝 **Collaboration Philosophy**

ChMS is a **production-grade SaaS** with real-world impact, built with intentional architecture and clear vision. We welcome contributors who want to learn, grow, and help shape the future of church technology in Africa.

### **What This Project Is**
- **Long-haul SaaS product** with enterprise ambitions
- **Spec-driven development** using GitHub Spec-Kit methodology
- **Africa-first design** with mobile-first, offline-first UX
- **Multi-tenant architecture** serving churches across the continent
- **AI-ready infrastructure** for future intelligent insights

### **Current Architecture**
- **Frontend**: Vue 3 + Quasar Framework + TypeScript + Pinia
- **Backend**: Laravel 11 + PHP 8.2 + PostgreSQL
- **Database**: Supabase (production) + SQLite (development)
- **Testing**: Vitest (unit) + Playwright (E2E) + PHPUnit (backend)
- **Deployment**: Docker + GitHub Actions CI/CD
- **AI Integration**: Mem0 self-hosted memory system (planned)

## 🌍 **Project Vision**

ChMS is designed specifically for African churches with enterprise ambitions, focusing on:
- **Offline-first functionality** for unreliable internet connections
- **Mobile-optimized experience** for Android devices
- **Low-bandwidth optimization** for 3G networks
- **Enterprise-ready scalability** for growing organizations
- **Cultural sensitivity** for African church contexts
- **Data sovereignty** with self-hosted deployment options

## 🤝 **Contributor Agreement**

### **Collaboration Terms**
By contributing to ChMS, you agree to:
- **Respect ownership**: Core architecture, design system, and business logic are owned by the project maintainer
- **Collaborate transparently**: Work in good faith with clear communication
- **Maintain confidentiality**: Keep codebase, architecture, and sensitive data private
- **Learn and grow**: Use this as an opportunity for mentorship and skill development

### **What You Can Do**
- ✅ Learn from the codebase and ask questions
- ✅ Suggest improvements and refactor components
- ✅ Contribute to UI, testing, and feature development
- ✅ Use knowledge gained to grow your skills and portfolio
- ✅ Be credited for your contributions

### **What's Protected**
- ❌ No redistribution or reuse of codebase without written consent
- ❌ No sharing of access credentials, deployment keys, or sensitive data
- ❌ No forking or copying of core architecture without permission

## 🚀 **Getting Started**

### **Prerequisites**

- **Node.js** 18+ and npm/yarn
- **PHP** 8.2+ and Composer
- **Git** with proper configuration
- **Docker** (recommended for consistent environment)
- **PostgreSQL** or Docker for database

### **Development Setup**

1. **Get Repository Access**
   ```bash
   # Repository is private - request access from maintainer
   git clone https://github.com/PrecisePeopleMultimedia/ChMS.git
   cd ChMS
   ```

2. **Environment Setup**
   ```bash
   # Copy environment files
   cp .env.example .env

   # Install dependencies
   npm install
   composer install
   ```

3. **Database Setup**
   ```bash
   # Using Docker (recommended)
   docker-compose up -d postgres

   # Or use local PostgreSQL
   createdb chms_development
   ```

4. **Application Setup**
   ```bash
   # Generate application key
   php artisan key:generate

   # Run migrations
   php artisan migrate

   # Seed development data
   php artisan db:seed
   ```

5. **Start Development Servers**
   ```bash
   # Backend (Laravel)
   php artisan serve

   # Frontend (Vue + Quasar) - in new terminal
   npm run dev
   ```

6. **Verify Setup**
   ```bash
   # Run test suites
   npm run test:unit        # Frontend unit tests
   php artisan test         # Backend tests
   npm run test:e2e         # End-to-end tests
   ```

## 📋 **Development Workflow**

### **Spec-Driven Development**
ChMS follows the **GitHub Spec-Kit methodology**:

1. **`/specify`** - Define requirements and user stories
2. **`/clarify`** - Resolve ambiguities and edge cases
3. **`/plan`** - Create technical implementation plans
4. **`/tasks`** - Break down into actionable tasks
5. **`/analyze`** - Validate consistency across artifacts
6. **`/implement`** - Execute the implementation plan

All specifications are in `.specify/specs/` directory.

### **Git Workflow**

#### **Branch Strategy**
```
feat/feature-name → dev → main
```

**NEVER commit directly to main** except for:
- Initial project setup
- Critical hotfixes (with explicit permission)
- Documentation-only changes

#### **1. Choose Your Work**

- Browse [GitHub Issues](https://github.com/PrecisePeopleMultimedia/ChMS/issues)
- Check `.specify/specs/` for current specifications
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to indicate you're working on it

#### **2. Create Feature Branch**

```bash
# Start from main, create feature branch
git checkout main
git pull origin main
git checkout -b feat/your-feature-name
```

#### **3. Development Process**

- **Follow Spec-Kit**: Check relevant spec files in `.specify/specs/`
- **Test-Driven Development**: Write tests first, then implementation
- **Africa-First**: Consider offline functionality and mobile optimization
- **Small, Focused Commits**: Use conventional commit messages
- **Update Task Progress**: Check off completed tasks in `tasks.md` files

#### **4. Testing & Validation**

```bash
# Run all tests before submitting
npm run test:unit        # Frontend unit tests
php artisan test         # Backend tests
npm run test:e2e         # End-to-end tests
npm run lint             # Code quality checks
```

#### **5. Submit Pull Request**

```bash
# Push your feature branch
git push origin feat/your-feature-name

# Create PR via GitHub UI
# Target: feat/your-feature-name → dev (for testing)
# After testing: dev → main (for production)
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

- [Git Workflow](docs/development/git-workflow.md)
- [Testing Guide](frontend/README-TESTING.md)
- [API Documentation](backend/docs/api.md)
- [Deployment Guide](docs/deployment.md)

### **Learning Resources**

#### **Core Technologies**
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Quasar Framework](https://quasar.dev/) - Material Design UI components
- [Laravel 11 Documentation](https://laravel.com/docs/11.x)
- [Supabase Documentation](https://supabase.com/docs)

#### **Testing & Quality**
- [Vitest Testing](https://vitest.dev/) - Unit testing framework
- [Playwright Testing](https://playwright.dev/) - E2E testing
- [PHPUnit Documentation](https://phpunit.de/documentation.html)

#### **Development Methodology**
- [GitHub Spec-Kit](https://github.com/github/spec-kit) - Spec-driven development
- [Conventional Commits](https://conventionalcommits.org/) - Commit message format
- [Africa-First Development Principles](docs/africa-first-principles.md)

### **Community & Support**

#### **Project Communication**
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions, ideas, and general discussion
- **Pull Requests**: Code contributions and reviews
- **Spec Files**: Technical discussions in `.specify/specs/`

#### **Getting Help**
1. **Check Documentation**: Start with README and spec files
2. **Search Issues**: Look for existing solutions
3. **Ask Questions**: Use GitHub Discussions for help
4. **Code Comments**: Implementation-specific questions

#### **Mentorship & Learning**
- **Code Reviews**: Learn from feedback on your contributions
- **Pair Programming**: Available for complex features
- **Architecture Discussions**: Understand design decisions
- **Best Practices**: Learn production-grade development patterns

## 📄 **Legal & Licensing**

### **Contribution License**
By contributing to ChMS, you agree that:
- Your contributions will be licensed under the same license as the project
- You have the right to submit the contributions
- You understand and accept the contributor agreement terms

### **Intellectual Property**
- **Core Architecture**: Owned by project maintainer
- **Your Contributions**: Credited to you, licensed to the project
- **Learning & Growth**: You retain knowledge and skills gained
- **Portfolio Use**: You may reference your contributions in your portfolio

---

## 🙏 **Thank You**

**Thank you for contributing to ChMS!**

Together, we're building technology that empowers African churches to thrive in the digital age. Your contributions help create:

- **Better church management** for pastors and administrators
- **Stronger communities** through improved member engagement
- **Digital transformation** that respects African contexts
- **Open source excellence** that others can learn from

Every line of code, every test, every documentation improvement makes a difference. Welcome to the team! 🚀
