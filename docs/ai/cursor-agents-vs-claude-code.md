# Cursor Agents vs Claude Code Agents

## How Agents Work in Each IDE

### Claude Code Agents
**Location:** `~/.claude/agents/` (global) or `.claude/agents/` (project)
**Format:** Individual markdown files (one per agent)
**Example:**
```
~/.claude/agents/
├── code-documenter.md
├── code-reviewer.md
├── recursive-coder.md
└── task-manager.md
```

**How it works:**
- Each agent is a separate markdown file
- Claude Code reads from `.claude/agents/` folder
- Agents are selected via UI or command
- Each agent has its own model, color, and instructions

**Agent file format:**
```markdown
---
name: code-documenter
description: Use this agent when...
model: qwen/qwen3-coder
color: cyan
---

You are a Documentation Specialist...
[Agent instructions]
```

---

### Cursor Agents
**Location:** `AGENTS.md` in project root
**Format:** Single markdown file with all agents
**How it works:**
- Cursor reads `AGENTS.md` from project root
- All agents defined in one file
- Agent selected by mentioning name or role
- Format: Markdown sections with agent definitions

**AGENTS.md format:**
```markdown
# Agent Name

You are a [role]...
[Agent instructions]

---

# Another Agent

You are a [role]...
[Agent instructions]
```

---

## Key Differences

| Feature | Claude Code | Cursor |
|---------|-------------|--------|
| **Location** | `.claude/agents/*.md` | `AGENTS.md` (project root) |
| **Format** | One file per agent | All agents in one file |
| **Scope** | Global or project | Project-specific |
| **Selection** | UI dropdown or command | Mention in conversation |
| **Sharing** | Copy files between projects | Commit AGENTS.md to git |

---

## Can Cursor Use Claude Code's Agents?

**Short answer:** Yes, but you need to convert them.

**Why:**
- Claude Code uses individual files with YAML frontmatter
- Cursor uses a single AGENTS.md file with markdown sections
- Different formats, but same content

**How to bridge them:**
1. Read agents from `~/.claude/agents/`
2. Convert YAML frontmatter to markdown headers
3. Combine into single AGENTS.md
4. Adapt format for Cursor

---

## Replicating Claude Code Agents in Cursor

### Step 1: Read Claude Code Agents
Agents are stored in:
- Global: `~/.claude/agents/` (Windows: `C:\Users\Username\.claude\agents\`)
- Project: `.claude/agents/` (if exists)

### Step 2: Convert Format

**Claude Code format:**
```markdown
---
name: code-documenter
description: Use this agent when...
model: qwen/qwen3-coder
color: cyan
---

You are a Documentation Specialist...
```

**Cursor format:**
```markdown
# Code Documenter

**When to use:** Use this agent when you have working code that needs comprehensive documentation.

**Model:** qwen/qwen3-coder

You are a Documentation Specialist...
```

### Step 3: Add to AGENTS.md
Combine all agents into your project's `AGENTS.md` file.

---

## Best Practice: Hybrid Approach

**Option 1: Project-Specific AGENTS.md**
- Create `AGENTS.md` in project root
- Include agents relevant to this project
- Commit to git (team shares same agents)

**Option 2: Reference Global Agents**
- Keep agents in `~/.claude/agents/` (Claude Code)
- Copy/convert to `AGENTS.md` for Cursor
- Update manually when agents change

**Option 3: Symlink (Advanced)**
- Create symlink from project to global agents
- Works if both IDEs support same format
- Not recommended (different formats)

---

## Recommended Setup for ChMS

1. **Create project-specific AGENTS.md** with:
   - ChMS-specific agents (Laravel expert, Vue expert, etc.)
   - Converted Claude Code agents (code-reviewer, etc.)
   - Skills configuration
   - Project context

2. **Keep Claude Code agents separate** in `~/.claude/agents/`
   - Use in Claude Code as-is
   - Convert to Cursor format when needed

3. **Sync manually** when agents are updated
   - Update `AGENTS.md` when Claude Code agents change
   - Or update both when creating new agents

---

## Example: Converting Code Reviewer Agent

**Claude Code format** (`~/.claude/agents/code-reviewer.md`):
```markdown
---
name: code-reviewer
description: Use this agent when you need to review code...
model: mistralai/mixtral-8x7b-instruct
color: yellow
---

You are an expert code reviewer...
```

**Cursor format** (in `AGENTS.md`):
```markdown
# Code Reviewer

**When to use:** Use this agent when you need to review code for quality, correctness, refactoring opportunities, and potential improvements.

**Model:** mistralai/mixtral-8x7b-instruct

You are an expert code reviewer...
```

---

## Summary

- **Claude Code:** Individual files in `.claude/agents/`
- **Cursor:** Single `AGENTS.md` in project root
- **Conversion:** Extract content, convert format, combine into AGENTS.md
- **Best practice:** Maintain both separately, sync manually
- **For ChMS:** Use project-specific AGENTS.md with converted agents

---

**Next Steps:**
1. Review your Claude Code agents
2. Convert them to Cursor format
3. Add to project's AGENTS.md
4. Test in Cursor

