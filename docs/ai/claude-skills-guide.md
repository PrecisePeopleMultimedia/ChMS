# Claude Skills Guide: Skills vs Agents vs MCP

## Understanding the Three Concepts

### 1. **Claude Skills** 🎯
**What they are:**
- Specialised instruction sets packaged as markdown files (`SKILL.md`)
- Progressive disclosure: instructions load only when the skill is invoked
- Bundled resources: scripts, templates, references that come with the skill
- Static, reusable patterns for specific workflows

**Example use cases:**
- PDF manipulation (extract text, merge, split)
- Spreadsheet editing (Excel/Google Sheets)
- Document creation (Word docs with formatting)
- Canvas design (posters, visual designs)

**How they work:**
```yaml
Skill Structure:
  my-skill/
  ├── SKILL.md          # Instructions for the AI
  ├── references/       # Supporting docs
  ├── scripts/          # Helper scripts
  └── assets/           # Templates, configs
```

**Invocation:**
- In Claude Code: `Skill("pdf")` tool call
- In OpenSkills: `openskills read pdf` CLI command
- Agent reads the SKILL.md and follows instructions

---

### 2. **Agents** 🤖
**What they are:**
- AI assistants configured with specific roles, rules, and capabilities
- Defined in `AGENTS.md` file (Cursor/VSCode) or `.claude/settings.json` (Claude Code)
- Persistent context and behaviour patterns
- Can use skills, MCP servers, and tools

**Example configuration:**
```markdown
# AGENTS.md
## Senior Backend Developer
You are a Laravel expert specialising in API development.
- Use Laravel best practices
- Write comprehensive tests
- Follow PSR-12 coding standards
```

**How they work:**
- Agent reads AGENTS.md on startup
- Maintains context throughout conversation
- Can invoke skills when needed
- Can use MCP servers for dynamic operations

---

### 3. **MCP Servers** 🔌
**What they are:**
- Model Context Protocol servers (Anthropic's protocol)
- Dynamic, real-time connections to external tools/data
- Server-client architecture (requires running server)
- For live data fetching and operations

**Example use cases:**
- Database connections (PostgreSQL, MySQL)
- API integrations (GitHub, Slack)
- File system operations
- Git operations
- Docker management

**How they work:**
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres@latest"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${DATABASE_URL}"
      }
    }
  }
}
```

---

## Key Differences

| Feature | Skills | Agents | MCP Servers |
|---------|--------|--------|-------------|
| **Purpose** | Static instructions | AI assistant config | Dynamic tool connections |
| **Format** | SKILL.md markdown | AGENTS.md markdown | JSON config |
| **Loading** | Progressive (on-demand) | Persistent (always) | Persistent (always) |
| **Resources** | Bundled files | Context/rules | External services |
| **Server needed** | ❌ No | ❌ No | ✅ Yes |
| **Real-time data** | ❌ No | ✅ Via MCP | ✅ Yes |
| **Reusability** | ✅ High | ⚠️ Project-specific | ✅ High |

---

## Why Skills ≠ MCP?

**Skills are for:**
- ✅ Workflow instructions (how to manipulate PDFs)
- ✅ Bundled resources (scripts, templates)
- ✅ Progressive disclosure (load only when needed)
- ✅ Static, reusable patterns

**MCP is for:**
- ✅ Database connections
- ✅ API integrations
- ✅ Real-time data fetching
- ✅ External service integration

**They complement each other:**
- Agent uses MCP to connect to database
- Agent uses Skill to know how to process PDFs
- Agent uses both together for complete workflows

---

## OpenSkills: Bringing Skills to Cursor/VSCode

### The Problem
- Claude Skills are native to Claude Code CLI
- Other IDEs (Cursor, VSCode, Windsurf) don't have built-in Skills support
- Skills are powerful but locked to one IDE

### The Solution: OpenSkills
**OpenSkills** (`openskills`) is a universal skills loader that:
- ✅ Implements Anthropic's Skills specification
- ✅ Works with any IDE (Cursor, VSCode, Windsurf, Aider)
- ✅ Uses same SKILL.md format as Claude Code
- ✅ Provides CLI for skill management
- ✅ Integrates with AGENTS.md

### How It Works

**1. Installation:**
```bash
npm install -g openskills
```

**2. Install Skills:**
```bash
# Install from Anthropic's official skills repo
openskills install anthropics/skills

# Or install specific skills
openskills install anthropics/skills --select pdf,xlsx,docx
```

**3. Skills Location:**
- Project: `./.claude/skills/` (or `./.agent/skills/` for universal mode)
- Global: `~/.claude/skills/` (or `~/.agent/skills/`)

**4. Integration with AGENTS.md:**
```markdown
# AGENTS.md

## Available Skills

<available_skills>
<skill>
<name>pdf</name>
<description>PDF manipulation toolkit</description>
<location>project</location>
</skill>
<skill>
<name>xlsx</name>
<description>Spreadsheet creation and editing</description>
<location>project</location>
</skill>
</available_skills>

When the user asks about PDFs, use: openskills read pdf
When the user asks about spreadsheets, use: openskills read xlsx
```

**5. Agent Usage:**
When you ask the agent to work with PDFs:
```bash
# Agent runs this command
openskills read pdf

# Returns the SKILL.md content with instructions
# Agent follows those instructions
```

---

## Setting Up OpenSkills for ChMS

### Step 1: Install OpenSkills
```bash
npm install -g openskills
```

### Step 2: Install Useful Skills
```bash
# Install from Anthropic's official repository
openskills install anthropics/skills

# Select skills relevant to ChMS:
# - pdf: For generating reports
# - xlsx: For exporting member data
# - docx: For creating documents
# - skill-creator: For creating custom skills
```

### Step 3: Create AGENTS.md
Create `AGENTS.md` in your project root:

```markdown
# ChMS AI Assistant Configuration

## Available Skills

<available_skills>
<skill>
<name>pdf</name>
<description>PDF manipulation toolkit for generating reports and documents</description>
<location>project</location>
</skill>
<skill>
<name>xlsx</name>
<description>Spreadsheet creation and editing for member data exports</description>
<location>project</location>
</skill>
<skill>
<name>docx</name>
<description>Document creation for church communications</description>
<location>project</location>
</skill>
</available_skills>

## Usage Instructions

When the user asks to:
- Generate PDF reports: Use `openskills read pdf` to load PDF skill instructions
- Export data to Excel: Use `openskills read xlsx` to load spreadsheet skill instructions
- Create documents: Use `openskills read docx` to load document skill instructions

## Project Context

You are working on ChMS (Church Management System):
- Backend: Laravel 11 + PostgreSQL
- Frontend: Vue 3 + Quasar + TypeScript
- Africa-first, offline-capable solution
- Follow spec-driven development principles
```

### Step 4: Sync Skills to AGENTS.md
```bash
# Automatically update AGENTS.md with installed skills
openskills sync
```

### Step 5: Test It
Ask your AI assistant:
- "Generate a PDF report of all members"
- "Export member data to Excel"
- "Create a welcome document for new members"

The agent will:
1. See the skill in `<available_skills>`
2. Run `openskills read pdf` (or xlsx, docx)
3. Follow the instructions from SKILL.md
4. Use bundled scripts/resources as needed

---

## Advanced: Universal Mode

**Problem:** If you use Claude Code + other IDEs with one AGENTS.md, installing to `.claude/skills/` can conflict with Claude Code's marketplace plugins.

**Solution:** Use `--universal` flag:
```bash
openskills install anthropics/skills --universal
```

This installs to `.agent/skills/` instead:
- ✅ Works with all agents via AGENTS.md
- ✅ Doesn't conflict with Claude Code's native plugins
- ✅ Keeps `.claude/` for Claude Code only

**Priority order:**
1. `./.agent/skills/` (project universal)
2. `~/.agent/skills/` (global universal)
3. `./.claude/skills/` (project)
4. `~/.claude/skills/` (global)

---

## Creating Custom Skills for ChMS

### Example: Church Report Skill

Create `.claude/skills/church-report/SKILL.md`:

```markdown
---
name: church-report
description: Generate comprehensive church reports (attendance, members, finances)
---

# Church Report Skill

When the user asks for church reports, follow these steps:

1. **Determine Report Type:**
   - Attendance reports: Use attendance data from database
   - Member reports: Use member management API
   - Financial reports: Use financial data (if available)

2. **Data Collection:**
   - Query Laravel API: `GET /api/reports/{type}`
   - Handle offline mode: Check IndexedDB cache
   - Format data according to report template

3. **Report Generation:**
   - Use PDF skill for PDF reports: `openskills read pdf`
   - Use XLSX skill for Excel exports: `openskills read xlsx`
   - Use templates from `assets/templates/`

4. **Africa-First Considerations:**
   - Optimise file size for low bandwidth
   - Support offline generation
   - Mobile-friendly formats

## Bundled Resources

- `scripts/generate-report.php` - Laravel report generator
- `assets/templates/attendance-report.html` - Report template
- `references/report-specs.md` - Report specifications
```

### Publishing Your Skill
1. Push to GitHub: `your-username/chms-skills`
2. Others install with: `openskills install your-username/chms-skills`

---

## Comparison: Claude Code vs OpenSkills

| Feature | Claude Code | OpenSkills |
|---------|-------------|------------|
| **Invocation** | `Skill("pdf")` tool | `openskills read pdf` CLI |
| **Prompt Format** | `<available_skills>` XML | `<available_skills>` XML (identical) |
| **Folder Structure** | `.claude/skills/` | `.claude/skills/` or `.agent/skills/` |
| **SKILL.md Format** | YAML + markdown | YAML + markdown (identical) |
| **Progressive Disclosure** | ✅ Yes | ✅ Yes |
| **Bundled Resources** | ✅ Yes | ✅ Yes |
| **Marketplace** | Anthropic marketplace | GitHub (anthropics/skills) |
| **IDE Support** | Claude Code only | Any IDE (Cursor, VSCode, etc.) |

**Everything is identical except the invocation method.**

---

## Best Practices for ChMS

### 1. **Organise Skills by Domain**
```
.claude/skills/
├── pdf/              # PDF manipulation
├── xlsx/             # Spreadsheet operations
├── church-report/    # Custom ChMS reports
├── member-export/    # Member data exports
└── attendance-analysis/  # Attendance analytics
```

### 2. **Document Skill Usage**
Add to your project docs:
```markdown
## Available AI Skills

- **pdf**: Generate PDF reports
- **xlsx**: Export member data to Excel
- **church-report**: Custom ChMS reporting (see .claude/skills/church-report/)
```

### 3. **Version Control**
- ✅ Commit `AGENTS.md` (skill references)
- ❌ Don't commit `.claude/skills/` (add to `.gitignore`)
- ✅ Document required skills in README

### 4. **Team Collaboration**
```bash
# Setup script for new team members
npm install -g openskills
openskills install anthropics/skills --select pdf,xlsx,docx
openskills sync
```

---

## Summary

**Claude Skills:**
- Static instruction sets for specific workflows
- Progressive disclosure (load on demand)
- Bundled resources (scripts, templates)
- Native to Claude Code CLI

**OpenSkills:**
- Universal skills loader for any IDE
- Same format as Claude Code
- Works with Cursor, VSCode, Windsurf
- CLI-based invocation

**For ChMS:**
- Use OpenSkills to bring Skills to Cursor
- Combine with MCP servers for dynamic operations
- Create custom skills for church-specific workflows
- Document in AGENTS.md for team consistency

**They work together:**
- Agent (AGENTS.md) provides context and rules
- Skills provide specialised workflows
- MCP servers provide dynamic connections
- All three complement each other

---

## Next Steps

1. **Install OpenSkills:**
   ```bash
   npm install -g openskills
   ```

2. **Install Skills:**
   ```bash
   openskills install anthropics/skills
   ```

3. **Create AGENTS.md:**
   - Add `<available_skills>` section
   - Document skill usage

4. **Test:**
   - Ask AI to generate a PDF report
   - Verify skill loading works

5. **Create Custom Skills:**
   - Church report generation
   - Member data exports
   - Attendance analytics

---

## Resources

- **OpenSkills GitHub:** https://github.com/numman-ali/openskills
- **Anthropic Skills:** https://github.com/anthropics/skills
- **MCP Documentation:** https://modelcontextprotocol.io
- **Claude Code Docs:** https://docs.anthropic.com/claude/docs/claude-code

---

**Last Updated:** 2025-01-XX
**Status:** Ready for Implementation

