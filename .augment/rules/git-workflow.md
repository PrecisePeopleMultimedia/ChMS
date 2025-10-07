# Git Workflow Rules - MANDATORY COMPLIANCE

## 🚨 CRITICAL WORKFLOW RULES - NEVER VIOLATE

### **MANDATORY BRANCH FLOW**
```
feat/feature-name → dev → main
```

**NEVER commit directly to main except for:**
- Initial project setup
- Critical hotfixes (with explicit user permission)
- Documentation-only changes (specs, README)

### **BRANCH NAMING CONVENTION**
- **Feature branches**: `feat/feature-name` or `feature/feature-name`
- **Hotfix branches**: `hotfix/issue-description`
- **Release branches**: `release/version-number`

### **MANDATORY WORKFLOW STEPS**

#### 1. **Feature Development**
```bash
# Start from main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feat/feature-name

# Work on feature
# ... make changes ...

# Commit to feature branch
git add .
git commit -m "feat: description"
git push origin feat/feature-name
```

#### 2. **Testing Phase**
```bash
# Merge to dev for testing
git checkout dev
git pull origin dev
git merge feat/feature-name
git push origin dev

# Test thoroughly on dev branch
# Fix any issues on feature branch, then re-merge to dev
```

#### 3. **Production Release**
```bash
# Only after successful testing on dev
git checkout main
git pull origin main
git merge dev
git push origin main

# Clean up feature branch
git branch -d feat/feature-name
git push origin --delete feat/feature-name
```

### **PULL REQUEST WORKFLOW**
1. **feat/feature-name → dev** (for testing)
2. **dev → main** (for production release)

### **NEVER DO THESE**
- ❌ Direct commits to main (except documented exceptions)
- ❌ Direct merges from feat → main (must go through dev)
- ❌ Force pushes to main or dev branches
- ❌ Rewriting history on shared branches
- ❌ Merging untested code to main

### **BRANCH STATUS VERIFICATION**

Before any merge, ALWAYS verify:
```bash
# Check branch status
git branch -a

# Verify main is clean
git log --oneline main -5

# Verify feature branch is ahead of main
git log --oneline main..feat/feature-name

# Verify no unintended commits on main
git log --oneline feat/feature-name..main
```

### **EMERGENCY PROCEDURES**

#### If accidentally committed to main:
1. **STOP immediately**
2. **DO NOT push to origin/main**
3. **Reset main to previous state**:
   ```bash
   git checkout main
   git reset --hard HEAD~1  # or appropriate commit
   ```
4. **Move commits to proper feature branch**
5. **Follow proper workflow**

#### If already pushed to origin/main:
1. **Notify team immediately**
2. **Create hotfix branch from main**
3. **Revert problematic commits**
4. **Follow proper workflow for fixes**

### **DOCUMENTATION REQUIREMENTS**

Every feature branch must include:
- [ ] Updated specs (if applicable)
- [ ] Updated tasks.md with completion status
- [ ] Updated TODO.md (if applicable)
- [ ] Proper commit messages following conventional commits
- [ ] Testing evidence (unit, integration, E2E)

### **COMMIT MESSAGE STANDARDS**

Follow conventional commits:
```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

### **BRANCH PROTECTION RULES**

#### Main Branch Protection:
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Restrict pushes to main
- Require linear history

#### Dev Branch Protection:
- Require pull request reviews (optional)
- Allow direct pushes for testing
- Require status checks for main merges

### **AUTOMATED CHECKS**

Before any commit, verify:
- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] No merge conflicts
- [ ] Branch is up to date with target
- [ ] Proper commit message format

### **COLLABORATION RULES**

#### When working with others:
- Always pull before starting work
- Communicate branch intentions
- Use descriptive branch names
- Keep feature branches focused and small
- Regular commits with clear messages

#### Code Review Requirements:
- All PRs require at least 1 review
- Reviewer must test functionality
- Address all review comments
- Squash commits if requested

### **MONITORING AND COMPLIANCE**

#### Daily Checks:
- Verify main branch integrity
- Check for unauthorized direct commits
- Monitor branch divergence
- Validate workflow compliance

#### Weekly Reviews:
- Clean up merged feature branches
- Update branch protection rules
- Review workflow effectiveness
- Address any violations

### **CONSEQUENCES OF VIOLATIONS**

#### First Violation:
- Warning and workflow review
- Mandatory workflow training
- Supervised next 3 commits

#### Repeated Violations:
- Temporary loss of direct push access
- All commits require review
- Additional training requirements

#### Critical Violations:
- Immediate access restriction
- Mandatory pair programming
- Extended supervision period

## 🎯 SUCCESS METRICS

- **Zero direct commits to main** (except documented exceptions)
- **100% feature branch compliance**
- **All features tested on dev before main**
- **Clean git history with proper workflow**
- **No broken builds on main branch**

## 📚 RESOURCES

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

**REMEMBER: This workflow protects our production code and ensures quality. NEVER bypass these rules without explicit permission and documentation.**
