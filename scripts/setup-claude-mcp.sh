#!/bin/bash

# Claude Code CLI + MCP Server Setup Script
# Run this script to set up Claude Code CLI with MCP servers for your ChMS project

echo "🚀 Setting up Claude Code CLI with MCP servers..."

# Check if Claude Code CLI is installed
echo "📋 Checking Claude Code CLI installation..."
if command -v claude &> /dev/null; then
    claude_version=$(claude --version)
    echo "✅ Claude Code CLI is installed: $claude_version"
else
    echo "❌ Claude Code CLI not found. Installing..."
    npm install -g @anthropic-ai/claude-code
fi

# Check if API key is configured
echo "🔑 Checking API key configuration..."
if claude config get api-key &> /dev/null; then
    api_key=$(claude config get api-key)
    if [ "$api_key" != "null" ] && [ -n "$api_key" ]; then
        echo "✅ API key is configured"
    else
        echo "⚠️  API key not configured. Please run: claude auth login"
        echo "   Or set it manually: claude config set api-key sk-ant-your-key-here"
    fi
else
    echo "⚠️  API key not configured. Please run: claude auth login"
fi

# Add MCP servers
echo "🔧 Adding MCP servers..."

# Add PostgreSQL MCP server
echo "📊 Adding PostgreSQL MCP server..."
if claude mcp add postgres npx @modelcontextprotocol/server-postgres@latest; then
    echo "✅ PostgreSQL MCP server added"
else
    echo "❌ Failed to add PostgreSQL MCP server"
fi

# Add Chrome DevTools MCP server
echo "🌐 Adding Chrome DevTools MCP server..."
if claude mcp add chrome-devtools npx chrome-devtools-mcp@latest; then
    echo "✅ Chrome DevTools MCP server added"
else
    echo "❌ Failed to add Chrome DevTools MCP server"
fi

# List MCP servers
echo "📋 Listing MCP servers..."
if claude mcp list; then
    echo "✅ MCP servers listed successfully"
else
    echo "❌ Failed to list MCP servers"
fi

# Test MCP servers
echo "🧪 Testing MCP servers..."

# Test PostgreSQL MCP
echo "📊 Testing PostgreSQL MCP server..."
if claude mcp test postgres; then
    echo "✅ PostgreSQL MCP server is working"
else
    echo "❌ PostgreSQL MCP server test failed"
fi

# Test Chrome DevTools MCP
echo "🌐 Testing Chrome DevTools MCP server..."
if claude mcp test chrome-devtools; then
    echo "✅ Chrome DevTools MCP server is working"
else
    echo "❌ Chrome DevTools MCP server test failed"
fi

# Generate project analysis
echo "📊 Generating project analysis..."
if claude analyze .; then
    echo "✅ Project analysis completed"
else
    echo "❌ Project analysis failed"
fi

echo "🎉 Setup completed!"
echo "📚 Next steps:"
echo "   1. Get your Anthropic API key from https://console.anthropic.com"
echo "   2. Run: claude auth login"
echo "   3. Test with: claude 'Hello, can you help me with coding?'"
echo "   4. Analyze your project: claude analyze ."
