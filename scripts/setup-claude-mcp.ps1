# Claude Code CLI + MCP Server Setup Script
# Run this script to set up Claude Code CLI with MCP servers for your ChMS project

Write-Host "🚀 Setting up Claude Code CLI with MCP servers..." -ForegroundColor Green

# Check if Claude Code CLI is installed
Write-Host "📋 Checking Claude Code CLI installation..." -ForegroundColor Yellow
try {
    $claudeVersion = claude --version
    Write-Host "✅ Claude Code CLI is installed: $claudeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Claude Code CLI not found. Installing..." -ForegroundColor Red
    npm install -g @anthropic-ai/claude-code
}

# Check if API key is configured
Write-Host "🔑 Checking API key configuration..." -ForegroundColor Yellow
try {
    $apiKey = claude config get api-key
    if ($apiKey -and $apiKey -ne "null") {
        Write-Host "✅ API key is configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  API key not configured. Please run: claude auth login" -ForegroundColor Yellow
        Write-Host "   Or set it manually: claude config set api-key sk-ant-your-key-here" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  API key not configured. Please run: claude auth login" -ForegroundColor Yellow
}

# Add MCP servers
Write-Host "🔧 Adding MCP servers..." -ForegroundColor Yellow

# Add PostgreSQL MCP server
Write-Host "📊 Adding PostgreSQL MCP server..." -ForegroundColor Cyan
try {
    claude mcp add postgres npx @modelcontextprotocol/server-postgres@latest
    Write-Host "✅ PostgreSQL MCP server added" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to add PostgreSQL MCP server" -ForegroundColor Red
}

# Add Chrome DevTools MCP server
Write-Host "🌐 Adding Chrome DevTools MCP server..." -ForegroundColor Cyan
try {
    claude mcp add chrome-devtools npx chrome-devtools-mcp@latest
    Write-Host "✅ Chrome DevTools MCP server added" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to add Chrome DevTools MCP server" -ForegroundColor Red
}

# List MCP servers
Write-Host "📋 Listing MCP servers..." -ForegroundColor Yellow
try {
    claude mcp list
} catch {
    Write-Host "❌ Failed to list MCP servers" -ForegroundColor Red
}

# Test MCP servers
Write-Host "🧪 Testing MCP servers..." -ForegroundColor Yellow

# Test PostgreSQL MCP
Write-Host "📊 Testing PostgreSQL MCP server..." -ForegroundColor Cyan
try {
    claude mcp test postgres
    Write-Host "✅ PostgreSQL MCP server is working" -ForegroundColor Green
} catch {
    Write-Host "❌ PostgreSQL MCP server test failed" -ForegroundColor Red
}

# Test Chrome DevTools MCP
Write-Host "🌐 Testing Chrome DevTools MCP server..." -ForegroundColor Cyan
try {
    claude mcp test chrome-devtools
    Write-Host "✅ Chrome DevTools MCP server is working" -ForegroundColor Green
} catch {
    Write-Host "❌ Chrome DevTools MCP server test failed" -ForegroundColor Red
}

# Generate project analysis
Write-Host "📊 Generating project analysis..." -ForegroundColor Yellow
try {
    claude analyze .
    Write-Host "✅ Project analysis completed" -ForegroundColor Green
} catch {
    Write-Host "❌ Project analysis failed" -ForegroundColor Red
}

Write-Host "🎉 Setup completed!" -ForegroundColor Green
Write-Host "📚 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Get your Anthropic API key from https://console.anthropic.com" -ForegroundColor White
Write-Host "   2. Run: claude auth login" -ForegroundColor White
Write-Host "   3. Test with: claude 'Hello, can you help me with coding?'" -ForegroundColor White
Write-Host "   4. Analyze your project: claude analyze ." -ForegroundColor White
