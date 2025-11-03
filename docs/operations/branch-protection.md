# Branch Protection Rules

## Overview
This document outlines the branch protection rules and workflow for the ChurchAfrica project, ensuring code quality and proper deployment practices.

## Branch Strategy

### Branch Types
- **`main`**: Production branch - stable, tested code
- **`dev`**: Development branch - integration branch for features
- **`feature/*`**: Feature branches - individual feature development

### Workflow
```
main → feature/feature-name → dev → main
```

## Branch Protection Rules

### Main Branch Protection
- **Require pull request reviews**: 2 reviewers required
- **Dismiss stale reviews**: Yes
- **Require status checks**: All CI/CD checks must pass
- **Require branches to be up to date**: Yes
- **Restrict pushes**: Only via pull requests
- **Allow force pushes**: No
- **Allow deletions**: No

### Dev Branch Protection
- **Require pull request reviews**: 1 reviewer required
- **Dismiss stale reviews**: Yes
- **Require status checks**: All CI/CD checks must pass
- **Require branches to be up to date**: Yes
- **Restrict pushes**: Only via pull requests
- **Allow force pushes**: No
- **Allow deletions**: No

### Feature Branch Protection
- **Require pull request reviews**: 1 reviewer required
- **Dismiss stale reviews**: Yes
- **Require status checks**: All CI/CD checks must pass
- **Require branches to be up to date**: Yes
- **Restrict pushes**: Only via pull requests
- **Allow force pushes**: No
- **Allow deletions**: Yes (after merge)

## Required Status Checks

### Frontend Checks
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Unit Tests**: Test coverage
- **E2E Tests**: End-to-end testing
- **Build**: Production build

### Backend Checks
- **PHP CS Fixer**: Code formatting
- **PHPStan**: Static analysis
- **PHPUnit**: Unit tests
- **Database Migrations**: Migration tests
- **Security Scan**: Vulnerability scanning

### Quality Gates
- **Test Coverage**: > 90% for frontend, > 80% for backend
- **Security Scan**: No critical vulnerabilities
- **Performance**: Build time < 5 minutes
- **Accessibility**: WCAG 2.1 AA compliance

## Workflow Process

### Feature Development
1. **Create feature branch**: `git checkout -b feature/feature-name`
2. **Develop feature**: Make changes and commits
3. **Push to feature branch**: `git push origin feature/feature-name`
4. **Create pull request**: Feature → Dev
5. **Code review**: At least 1 reviewer
6. **Merge to dev**: After approval and CI/CD passes

### Development Integration
1. **Create pull request**: Dev → Main
2. **Code review**: At least 2 reviewers
3. **Merge to main**: After approval and CI/CD passes
4. **Deploy to production**: Automatic deployment

### Hotfix Process
1. **Create hotfix branch**: `git checkout -b hotfix/hotfix-name`
2. **Fix issue**: Make necessary changes
3. **Create pull request**: Hotfix → Main
4. **Emergency review**: Expedited review process
5. **Merge to main**: After approval
6. **Deploy to production**: Immediate deployment

## Code Review Guidelines

### Review Requirements
- **Frontend**: At least 1 reviewer with frontend expertise
- **Backend**: At least 1 reviewer with backend expertise
- **Full-stack**: At least 2 reviewers (1 frontend, 1 backend)
- **Security**: Security review for sensitive changes

### Review Checklist
- [ ] Code follows project standards
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] Security implications considered
- [ ] Performance impact assessed
- [ ] Accessibility requirements met
- [ ] Mobile responsiveness verified

### Review Process
1. **Automated checks**: CI/CD pipeline runs automatically
2. **Manual review**: Human reviewers check code quality
3. **Approval**: Required number of approvals
4. **Merge**: After all checks pass

## Deployment Strategy

### Environment Promotion
- **Feature → Dev**: Automatic deployment to development environment
- **Dev → Main**: Automatic deployment to production environment
- **Hotfix → Main**: Emergency deployment to production

### Deployment Gates
- **Development**: All tests must pass
- **Staging**: Additional integration tests
- **Production**: Full security and performance validation

### Rollback Strategy
- **Automatic rollback**: On critical failures
- **Manual rollback**: Via deployment dashboard
- **Database rollback**: Migration rollback procedures

## Security Considerations

### Access Control
- **Main branch**: Limited to senior developers
- **Dev branch**: Available to all developers
- **Feature branches**: Available to all developers

### Secret Management
- **Environment variables**: Stored in GitHub Secrets
- **API keys**: Rotated regularly
- **Database credentials**: Encrypted and secure

### Audit Trail
- **All changes**: Logged and tracked
- **Review history**: Maintained for compliance
- **Deployment logs**: Available for troubleshooting

## Monitoring and Alerts

### CI/CD Monitoring
- **Build status**: Real-time notifications
- **Test results**: Detailed reporting
- **Security scans**: Vulnerability alerts
- **Performance metrics**: Build time tracking

### Deployment Monitoring
- **Deployment status**: Success/failure notifications
- **Application health**: Post-deployment checks
- **Error tracking**: Real-time error monitoring
- **Performance monitoring**: Application metrics

## Troubleshooting

### Common Issues
- **Build failures**: Check logs and fix issues
- **Test failures**: Update tests or fix code
- **Security failures**: Address vulnerabilities
- **Performance issues**: Optimize code or configuration

### Resolution Process
1. **Identify issue**: Check CI/CD logs
2. **Fix issue**: Make necessary changes
3. **Re-run pipeline**: Trigger new build
4. **Verify fix**: Confirm all checks pass
5. **Deploy**: Proceed with deployment

## Best Practices

### Development
- **Small commits**: Frequent, focused commits
- **Clear messages**: Descriptive commit messages
- **Test coverage**: Maintain high test coverage
- **Code quality**: Follow project standards

### Review
- **Timely reviews**: Review within 24 hours
- **Constructive feedback**: Helpful and specific
- **Approval criteria**: Clear approval requirements
- **Documentation**: Update as needed

### Deployment
- **Staged deployment**: Test in dev before main
- **Monitoring**: Watch deployment closely
- **Rollback plan**: Have rollback strategy ready
- **Communication**: Notify team of deployments

This branch protection strategy ensures code quality, security, and reliable deployments while maintaining development velocity.
