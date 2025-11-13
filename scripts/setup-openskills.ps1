# OpenSkills Setup Script for ChMS
# Installs OpenSkills and sets up skills for Cursor/VSCode

Write-Host "🎯 Setting up OpenSkills for ChMS..." -ForegroundColor Green

# Check if Node.js is installed
Write-Host "📋 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 20.6+ first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
Write-Host "📦 Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found. Please install npm first." -ForegroundColor Red
    exit 1
}

# Install OpenSkills globally
Write-Host "📥 Installing OpenSkills globally..." -ForegroundColor Yellow
try {
    npm install -g openskills
    Write-Host "✅ OpenSkills installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install OpenSkills" -ForegroundColor Red
    exit 1
}

# Verify OpenSkills installation
Write-Host "🔍 Verifying OpenSkills installation..." -ForegroundColor Yellow
try {
    $openskillsVersion = openskills --version
    Write-Host "✅ OpenSkills is installed: $openskillsVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ OpenSkills not found after installation" -ForegroundColor Red
    exit 1
}

# Install skills from Anthropic's repository
Write-Host "📚 Installing skills from Anthropic's repository..." -ForegroundColor Yellow
Write-Host "   This will open an interactive menu to select skills." -ForegroundColor Cyan
Write-Host "   Recommended: pdf, xlsx, docx, skill-creator" -ForegroundColor Cyan

try {
    openskills install anthropics/skills
    Write-Host "✅ Skills installed successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Skill installation had issues. You can install manually later:" -ForegroundColor Yellow
    Write-Host "   openskills install anthropics/skills" -ForegroundColor Yellow
}

# List installed skills
Write-Host "📋 Listing installed skills..." -ForegroundColor Yellow
try {
    openskills list
} catch {
    Write-Host "⚠️  Could not list skills" -ForegroundColor Yellow
}

# Check if AGENTS.md exists
Write-Host "📄 Checking for AGENTS.md..." -ForegroundColor Yellow
$agentsPath = Join-Path $PSScriptRoot "..\AGENTS.md"
if (Test-Path $agentsPath) {
    Write-Host "✅ AGENTS.md exists" -ForegroundColor Green
    Write-Host "   Run 'openskills sync' to update it with installed skills" -ForegroundColor Cyan
} else {
    Write-Host "⚠️  AGENTS.md not found" -ForegroundColor Yellow
    Write-Host "   Creating template AGENTS.md..." -ForegroundColor Cyan
    
    $agentsContent = @"
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
"@
    
    Set-Content -Path $agentsPath -Value $agentsContent
    Write-Host "✅ Created AGENTS.md template" -ForegroundColor Green
}

# Sync skills to AGENTS.md
Write-Host "🔄 Syncing skills to AGENTS.md..." -ForegroundColor Yellow
Write-Host "   This will open an interactive menu to select which skills to include." -ForegroundColor Cyan
try {
    openskills sync
    Write-Host "✅ Skills synced to AGENTS.md" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not sync skills. You can run manually:" -ForegroundColor Yellow
    Write-Host "   openskills sync" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ OpenSkills setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Review AGENTS.md and customise as needed" -ForegroundColor White
Write-Host "   2. Test skills by asking your AI assistant to generate a PDF report" -ForegroundColor White
Write-Host "   3. Create custom skills for ChMS-specific workflows" -ForegroundColor White
Write-Host ""
Write-Host "📖 Documentation: docs/ai/claude-skills-guide.md" -ForegroundColor Cyan
Write-Host ""

