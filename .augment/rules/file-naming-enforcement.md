# File Naming Enforcement Rule

## CRITICAL RULE: ALWAYS USE LOWERCASE WITH HYPHENS

**This rule exists because the AI assistant has repeatedly created files with ALL-CAPS names despite explicit instructions.**

---

## ✅ **CORRECT Naming Convention**

### **Documentation Files (.md)**
- `vue-security-performance.md` ✅
- `git-workflow.md` ✅
- `api-documentation.md` ✅
- `organization-summary.md` ✅

### **Configuration Files**
- `docker-compose.yml` ✅
- `package.json` ✅
- `.env.example` ✅

---

## ❌ **INCORRECT Naming (NEVER USE)**

### **ALL-CAPS (Forbidden)**
- `ORGANIZATION-SUMMARY.md` ❌
- `CLAUDE-PROMPT-v2.md` ❌ (Fixed: renamed to `claude-prompt-v2.md`)
- `API-DOCUMENTATION.md` ❌
- `GIT-WORKFLOW.md` ❌

### **camelCase (Avoid for docs)**
- `organizationSummary.md` ❌
- `vueSecurityPerformance.md` ❌
- `apiDocumentation.md` ❌

### **snake_case (Avoid for docs)**
- `organization_summary.md` ❌
- `vue_security_performance.md` ❌
- `api_documentation.md` ❌

---

## 🔧 **ENFORCEMENT MECHANISMS**

### **1. Pre-Creation Check**
Before creating any file, ask yourself:
- ✅ Is it lowercase?
- ✅ Does it use hyphens instead of underscores or camelCase?
- ✅ Is it descriptive and clear?

### **2. Automated Detection**
```bash
# Check for ALL-CAPS files in docs/
find docs/ -name "*.md" | grep -E '[A-Z]' | head -10

# Check for camelCase files
find docs/ -name "*.md" | grep -E '[a-z][A-Z]' | head -10
```

### **3. Fix Script**
```bash
# Rename ALL-CAPS files to lowercase-with-hyphens
# Example: ORGANIZATION-SUMMARY.md → organization-summary.md
for file in $(find docs/ -name "*.md" | grep -E '[A-Z]'); do
  newname=$(echo "$file" | tr '[:upper:]' '[:lower:]' | sed 's/_/-/g')
  echo "Would rename: $file → $newname"
done
```

---

## 📋 **CHECKLIST FOR AI ASSISTANT**

### **Before Creating Any File:**
- [ ] Is the filename lowercase?
- [ ] Does it use hyphens (not underscores or camelCase)?
- [ ] Is it descriptive and professional?
- [ ] Does it follow the project's naming convention?

### **After Creating a File:**
- [ ] Verify the filename is correct
- [ ] Update any references to use the correct filename
- [ ] Check for consistency with existing files

---

## 🚨 **CONSEQUENCES OF VIOLATIONS**

### **User Impact:**
- User has to manually fix filenames
- Breaks consistency in documentation
- Creates confusion in navigation
- Requires updating references

### **Project Impact:**
- Inconsistent file structure
- Harder to find and reference files
- Unprofessional appearance
- Maintenance overhead

---

## 🎯 **EXAMPLES FROM ChMS PROJECT**

### **Recent Fixes:**
1. `CLAUDE-PROMPT-v2.md` → `claude-prompt-v2.md` ✅
2. Updated references in:
   - `docs/README.md`
   - `docs/organization-summary.md`

### **Correct Existing Files:**
- `vue-security-performance.md` ✅
- `git-workflow.md` ✅
- `organization-summary.md` ✅
- `claude-prompt-v2.md` ✅

---

## 💡 **WHY THIS RULE EXISTS**

### **Technical Reasons:**
1. **Cross-platform compatibility** - Works on Windows, Linux, macOS
2. **URL-friendly** - Lowercase-hyphen names work well in URLs
3. **Shell-friendly** - No issues with case-sensitive filesystems
4. **Git-friendly** - Consistent across different Git configurations

### **Professional Reasons:**
1. **Industry standard** - Most documentation follows this pattern
2. **Consistency** - Easier to predict and find files
3. **Maintainability** - Reduces cognitive load
4. **Scalability** - Works well as project grows

---

## 🔄 **ENFORCEMENT WORKFLOW**

### **For AI Assistant:**
1. **Before creating file**: Check naming convention
2. **After creating file**: Verify filename is correct
3. **If mistake made**: Immediately rename and update references
4. **Learn from mistakes**: Update this rule if needed

### **For User:**
1. **Review AI-created files**: Check for naming violations
2. **Provide feedback**: Point out violations to AI
3. **Request fixes**: Ask AI to rename and update references
4. **Update rules**: Add new patterns if needed

---

## 📚 **REFERENCE EXAMPLES**

### **Good Documentation Naming:**
- GitLab: `installation.md`, `api-resources.md`
- GitHub: `code-of-conduct.md`, `security-policy.md`
- Microsoft: `getting-started.md`, `troubleshooting-guide.md`
- AWS: `user-guide.md`, `best-practices.md`

### **ChMS Project Standard:**
- `vue-security-performance.md`
- `postgresql-implementation-summary.md`
- `production-deployment-system.md`
- `member-management-enhancement.md`

---

## ✅ **SUCCESS METRICS**

### **Target Goals:**
- **100% compliance** with lowercase-hyphen naming
- **Zero ALL-CAPS files** in documentation
- **Consistent naming** across all project files
- **No broken references** due to filename changes

### **Current Status:**
- ✅ Fixed: `CLAUDE-PROMPT-v2.md` → `claude-prompt-v2.md`
- ✅ Updated all references
- ✅ Documentation structure is now consistent
- ✅ All files follow lowercase-hyphen convention

---

**REMEMBER**: This rule exists because of repeated violations. Always double-check filename before creating any file!
