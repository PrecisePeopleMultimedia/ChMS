# OpenSkills Quick Reference

## Installation

```bash
# Install globally
npm install -g openskills

# Verify installation
openskills --version
```

## Common Commands

### Install Skills
```bash
# Install from Anthropic's official repository (interactive)
openskills install anthropics/skills

# Install specific skills only
openskills install anthropics/skills --select pdf,xlsx,docx

# Install globally (shared across projects)
openskills install anthropics/skills --global

# Install to universal location (for multi-IDE setups)
openskills install anthropics/skills --universal
```

### Manage Skills
```bash
# List installed skills
openskills list

# Read a skill (loads instructions)
openskills read pdf

# Remove a skill
openskills remove pdf

# Manage skills interactively
openskills manage
```

### Sync with AGENTS.md
```bash
# Update AGENTS.md with installed skills (interactive)
openskills sync

# Auto-sync without prompts
openskills sync -y
```

## Skill Locations

**Priority Order:**
1. `./.agent/skills/` (project universal)
2. `~/.agent/skills/` (global universal)
3. `./.claude/skills/` (project)
4. `~/.claude/skills/` (global)

## Popular Skills

### From Anthropic's Repository

| Skill | Description | Use Case |
|-------|-------------|----------|
| `pdf` | PDF manipulation | Generate reports, merge/split PDFs |
| `xlsx` | Spreadsheet operations | Export data, create Excel files |
| `docx` | Document creation | Create Word documents |
| `pptx` | Presentation creation | Create PowerPoint slides |
| `canvas-design` | Visual design | Create posters, graphics |
| `mcp-builder` | MCP server creation | Build custom MCP servers |
| `skill-creator` | Skill authoring | Create your own skills |

## Usage in AGENTS.md

```markdown
<available_skills>
<skill>
<name>pdf</name>
<description>PDF manipulation toolkit</description>
<location>project</location>
</skill>
</available_skills>
```

## Workflow Example

1. **Install skills:**
   ```bash
   openskills install anthropics/skills
   ```

2. **Sync to AGENTS.md:**
   ```bash
   openskills sync
   ```

3. **Use in conversation:**
   - Ask AI: "Generate a PDF report of all members"
   - AI runs: `openskills read pdf`
   - AI follows instructions from skill

## Troubleshooting

### Skills not found
```bash
# Check installation location
openskills list

# Reinstall if needed
openskills install anthropics/skills
```

### AGENTS.md not updating
```bash
# Manually sync
openskills sync

# Check AGENTS.md location (should be project root)
```

### Conflicts with Claude Code
```bash
# Use universal mode
openskills install anthropics/skills --universal
```

## Creating Custom Skills

1. **Create skill directory:**
   ```
   .claude/skills/my-skill/
   ├── SKILL.md
   ├── scripts/
   └── assets/
   ```

2. **Write SKILL.md:**
   ```markdown
   ---
   name: my-skill
   description: What this does
   ---
   
   # Instructions
   When user asks for X, do Y...
   ```

3. **Publish to GitHub:**
   - Push to `your-username/my-skill`
   - Others install: `openskills install your-username/my-skill`

## Resources

- **Full Guide**: `docs/ai/claude-skills-guide.md`
- **OpenSkills GitHub**: https://github.com/numman-ali/openskills
- **Anthropic Skills**: https://github.com/anthropics/skills

---

**Quick Setup:**
```bash
npm install -g openskills
openskills install anthropics/skills
openskills sync
```

