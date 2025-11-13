#!/bin/bash

# OpenSkills Setup Script for ChMS
# Installs OpenSkills and sets up skills for Cursor/VSCode

echo "🎯 Setting up OpenSkills for ChMS..."

# Check if Node.js is installed
echo "📋 Checking Node.js installation..."
if command -v node &> /dev/null; then
    node_version=$(node --version)
    echo "✅ Node.js is installed: $node_version"
else
    echo "❌ Node.js not found. Please install Node.js 20.6+ first."
    exit 1
fi

# Check if npm is installed
echo "📦 Checking npm installation..."
if command -v npm &> /dev/null; then
    npm_version=$(npm --version)
    echo "✅ npm is installed: $npm_version"
else
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

# Install OpenSkills globally
echo "📥 Installing OpenSkills globally..."
if npm install -g openskills; then
    echo "✅ OpenSkills installed successfully"
else
    echo "❌ Failed to install OpenSkills"
    exit 1
fi

# Verify OpenSkills installation
echo "🔍 Verifying OpenSkills installation..."
if command -v openskills &> /dev/null; then
    openskills_version=$(openskills --version)
    echo "✅ OpenSkills is installed: $openskills_version"
else
    echo "❌ OpenSkills not found after installation"
    exit 1
fi

# Install skills from Anthropic's repository
echo "📚 Installing skills from Anthropic's repository..."
echo "   This will open an interactive menu to select skills."
echo "   Recommended: pdf, xlsx, docx, skill-creator"

if openskills install anthropics/skills; then
    echo "✅ Skills installed successfully"
else
    echo "⚠️  Skill installation had issues. You can install manually later:"
    echo "   openskills install anthropics/skills"
fi

# List installed skills
echo "📋 Listing installed skills..."
if openskills list; then
    echo "✅ Skills listed successfully"
else
    echo "⚠️  Could not list skills"
fi

# Check if AGENTS.md exists
echo "📄 Checking for AGENTS.md..."
agents_path="$(dirname "$0")/../AGENTS.md"
if [ -f "$agents_path" ]; then
    echo "✅ AGENTS.md exists"
    echo "   Run 'openskills sync' to update it with installed skills"
else
    echo "⚠️  AGENTS.md not found"
    echo "   Creating template AGENTS.md..."
    
    cat > "$agents_path" << 'EOF'
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

## Development Guidelines

- Write clean, maintainable code
- Follow PSR-12 (PHP) and ESLint (TypeScript) standards
- Write tests for new features
- Consider offline capabilities
- Optimise for mobile devices
- Keep bundle sizes small (< 500KB)
EOF
    
    echo "✅ Created AGENTS.md template"
fi

# Sync skills to AGENTS.md
echo "🔄 Syncing skills to AGENTS.md..."
echo "   This will open an interactive menu to select which skills to include."
if openskills sync; then
    echo "✅ Skills synced to AGENTS.md"
else
    echo "⚠️  Could not sync skills. You can run manually:"
    echo "   openskills sync"
fi

echo ""
echo "✅ OpenSkills setup complete!"
echo ""
echo "📚 Next steps:"
echo "   1. Review AGENTS.md and customise as needed"
echo "   2. Test skills by asking your AI assistant to generate a PDF report"
echo "   3. Create custom skills for ChMS-specific workflows"
echo ""
echo "📖 Documentation: docs/ai/claude-skills-guide.md"
echo ""

