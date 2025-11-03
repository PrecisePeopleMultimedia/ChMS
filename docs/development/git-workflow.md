# ChMS Git Workflow & Branch Protection

## 🌳 **Branching Strategy**

ChMS follows a **GitFlow-inspired** branching model optimized for continuous delivery and Africa-first development principles.

### **Branch Hierarchy**

```
main (production)
├── dev (staging)
│   ├── feature/auth-system
│   ├── feature/member-management
│   └── feature/attendance-qr
└── hotfix/critical-bug-fix
```

### **Branch Types**

| Branch Type | Purpose | Naming Convention | Lifetime |
|-------------|---------|-------------------|----------|
| `main` | Production-ready code | `main` | Permanent |
| `dev` | Integration and staging | `dev` | Permanent |
| `feature/*` | New features and enhancements | `feature/descriptive-name` | Temporary |
| `hotfix/*` | Critical production fixes | `hotfix/issue-description` | Temporary |
| `bugfix/*` | Non-critical bug fixes | `bugfix/issue-description` | Temporary |

## 🔄 **Development Workflow**

### **1. Feature Development Process**

**ChMS follows: `main → feature → dev → main` workflow**

```bash
# 1. Start from main branch (always start from stable code)
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/member-search-offline

# 3. Develop with frequent commits
git add .
git commit -m "feat: add offline member search functionality"

# 4. Push feature branch
git push origin feature/member-search-offline

# 5. Integrate to dev branch for testing
git checkout dev
git pull origin dev
git merge feature/member-search-offline
git push origin dev

# 6. After testing in dev, merge to main for production
git checkout main
git pull origin main
git merge dev
git push origin main

# 8. Create Pull Request: dev → main (for production release)
# 9. After review and CI passes, merge to main
# 10. Deploy to production automatically
```

### **2. Hotfix Process**

```bash
# 1. Start from main branch
git checkout main
git pull origin main

# 2. Create hotfix branch
git checkout -b hotfix/auth-token-expiry

# 3. Fix the issue
git add .
git commit -m "fix: resolve auth token expiry issue"

# 4. Push hotfix branch
git push origin hotfix/auth-token-expiry

# 5. Create Pull Request: hotfix/auth-token-expiry → main
# 6. After review, merge to main and deploy
# 7. Merge main back to dev to sync changes
```

## 🛡️ **Branch Protection Rules**

### **Main Branch Protection**

- ✅ **Require pull request reviews**: 2 reviewers minimum
- ✅ **Require status checks**: All CI checks must pass
- ✅ **Require branches to be up to date**: Force rebase before merge
- ✅ **Require conversation resolution**: All comments must be resolved
- ✅ **Restrict pushes**: Only admins can push directly
- ✅ **Require signed commits**: GPG signature required

**Required Status Checks:**
- `frontend-tests` - Frontend unit tests and linting
- `backend-tests` - Backend unit tests and code quality
- `e2e-tests` - End-to-end testing
- `security-scan` - Security vulnerability scanning

### **Dev Branch Protection**

- ✅ **Require pull request reviews**: 1 reviewer minimum
- ✅ **Require status checks**: All CI checks must pass
- ✅ **Require branches to be up to date**: Force rebase before merge
- ✅ **Allow force pushes**: For integration fixes
- ✅ **Require conversation resolution**: All comments must be resolved

**Required Status Checks:**
- `frontend-tests` - Frontend unit tests and linting
- `backend-tests` - Backend unit tests and code quality
- `e2e-tests` - End-to-end testing

### **Feature Branch Guidelines**

- ✅ **Require pull request reviews**: 1 reviewer minimum
- ✅ **Require status checks**: Basic CI checks must pass
- ✅ **Allow force pushes**: For development iteration
- ✅ **Delete branch after merge**: Keep repository clean

## 📝 **Commit Message Standards**

### **Conventional Commits Format**

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### **Commit Types**

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add Google OAuth integration` |
| `fix` | Bug fix | `fix(api): resolve CORS issue for mobile clients` |
| `docs` | Documentation | `docs(readme): update installation instructions` |
| `style` | Code style changes | `style(ui): improve button hover animations` |
| `refactor` | Code refactoring | `refactor(store): simplify auth state management` |
| `perf` | Performance improvements | `perf(api): optimize member search query` |
| `test` | Test additions/changes | `test(auth): add unit tests for login flow` |
| `chore` | Maintenance tasks | `chore(deps): update Vue to v3.4.0` |

### **Africa-First Commit Scopes**

| Scope | Description | Example |
|-------|-------------|---------|
| `offline` | Offline functionality | `feat(offline): add member sync queue` |
| `mobile` | Mobile optimizations | `perf(mobile): reduce bundle size by 30%` |
| `3g` | Low bandwidth features | `feat(3g): implement progressive image loading` |
| `pwa` | Progressive Web App | `feat(pwa): add service worker caching` |
| `i18n` | Internationalization | `feat(i18n): add Swahili language support` |

## 🚀 **Release Process**

### **Staging Release (dev → staging)**

1. **Automatic Trigger**: Every push to `dev` branch
2. **CI/CD Pipeline**: Runs full test suite
3. **Deployment**: Automatic deployment to staging environment
4. **Notification**: Slack notification to `#chms-deployments`
5. **Testing**: Manual QA testing on staging

### **Production Release (main → production)**

1. **Manual Trigger**: Pull request from `dev` to `main`
2. **Review Process**: 2 reviewers + all CI checks pass
3. **Deployment**: Automatic deployment to production
4. **Monitoring**: Real-time monitoring and alerting
5. **Rollback Plan**: Immediate rollback capability

### **Release Checklist**

- [ ] All tests pass (unit, integration, E2E)
- [ ] Security scan passes
- [ ] Performance benchmarks met
- [ ] Mobile testing completed
- [ ] Offline functionality verified
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Stakeholder approval received

## 🔧 **CI/CD Pipeline Overview**

### **Pipeline Stages**

1. **Code Quality** (Parallel)
   - ESLint + Prettier (Frontend)
   - PHP-CS-Fixer + PHPStan (Backend)
   - TypeScript type checking

2. **Testing** (Parallel)
   - Unit tests with coverage
   - Integration tests
   - E2E tests with Playwright

3. **Security**
   - Dependency vulnerability scanning
   - SAST (Static Application Security Testing)
   - Container security scanning

4. **Build & Deploy**
   - Build optimization
   - Environment-specific deployment
   - Health checks and monitoring

### **Environment Configuration**

| Environment | Branch | URL | Purpose |
|-------------|--------|-----|---------|
| Development | `feature/*` | Local | Feature development |
| Staging | `dev` | https://chms-staging.vercel.app | Integration testing |
| Production | `main` | https://chms.vercel.app | Live application |

## 📊 **Quality Gates**

### **Code Quality Metrics**

- **Test Coverage**: Minimum 85% for critical paths
- **Code Duplication**: Maximum 3%
- **Cyclomatic Complexity**: Maximum 10 per function
- **Bundle Size**: Maximum 500KB initial load
- **Performance**: Lighthouse score > 90

### **Africa-First Quality Gates**

- **3G Performance**: Page load < 3 seconds on 3G
- **Mobile Score**: Lighthouse mobile score > 85
- **Offline Capability**: 100% core features work offline
- **Bundle Efficiency**: Tree-shaking effectiveness > 80%
- **Accessibility**: WCAG AA compliance

## 🚨 **Emergency Procedures**

### **Production Hotfix**

1. **Immediate Response**: Create hotfix branch from `main`
2. **Fast Track**: Expedited review process (1 reviewer)
3. **Deploy**: Direct deployment to production
4. **Monitor**: Enhanced monitoring for 24 hours
5. **Post-Mortem**: Document incident and prevention measures

### **Rollback Procedure**

1. **Trigger**: Automatic or manual rollback initiation
2. **Revert**: Git revert to last known good commit
3. **Deploy**: Immediate deployment of reverted version
4. **Verify**: Health checks and functionality verification
5. **Communicate**: Immediate stakeholder notification

## 📊 **Current Branch Status**

### **As of Latest Deployment**

| Branch | Status | Purpose | Last Updated |
|--------|--------|---------|--------------|
| `main` | ✅ **Stable** | Production-ready authentication system | Latest commit |
| `dev` | ✅ **Deployed** | Staging environment with all features | Pushed to origin/dev |
| `feature/dashboard-system` | ✅ **Merged** | Dashboard components (merged to main) | Completed |
| `feature/authentication-system` | ✅ **Merged** | Auth system (merged to main) | Completed |

### **Current Stable Features**
- ✅ **Authentication System** - Login, registration, password reset
- ✅ **Garnet Night Theme** - Dark/light theme switching
- ✅ **Mobile-First UI** - Responsive design with Quasar Framework
- ✅ **API Integration** - Laravel Sanctum + Vue 3 working
- ✅ **Testing Framework** - Vitest + Playwright configured
- ✅ **CI/CD Pipeline** - GitHub Actions ready

## 📚 **Resources**

- **GitHub Repository**: https://github.com/PrecisePeopleMultimedia/ChMS
- **CI/CD Dashboard**: GitHub Actions
- **Local Development**: http://localhost:1811 (frontend)
- **Backend API**: http://backend.test/api (Laravel Herd)
- **Documentation**: `/docs` directory
- **Issue Tracking**: GitHub Issues with labels

## 🤝 **Team Collaboration**

### **Code Review Guidelines**

- **Response Time**: 24 hours maximum
- **Review Depth**: Focus on logic, security, and performance
- **Africa-First Focus**: Verify offline and mobile optimization
- **Constructive Feedback**: Suggest improvements, not just problems
- **Knowledge Sharing**: Explain complex decisions

### **Communication Channels**

- **Slack**: `#chms-development` for daily updates
- **GitHub**: Issues and pull request discussions
- **Weekly Sync**: Team standup every Monday
- **Sprint Planning**: Bi-weekly planning sessions
- **Retrospectives**: Monthly improvement discussions
