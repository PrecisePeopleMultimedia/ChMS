# ChMS - Model Context Protocol (MCP) Setup Guide

## Overview

This guide explains how to set up and use Model Context Protocol (MCP) servers with the ChMS project. MCP enables Claude to interact directly with your development environment, databases, and tools.

## Quick Setup

### Automated Setup (Recommended)

For Windows (PowerShell):
```powershell
.\scripts\setup-claude-mcp.ps1
```

For Linux/macOS (Bash):
```bash
./scripts/setup-claude-mcp.sh
```

### Manual Setup

1. **Install Claude Code CLI** (if not already installed):
```bash
npm install -g @anthropic-ai/claude-code
```

2. **Configure API Key**:
```bash
claude auth login
# Or manually: claude config set api-key sk-ant-your-key-here
```

3. **Add MCP Servers**:
```bash
# Core servers for ChMS development
claude mcp add supabase npx @supabase/mcp-server@latest
claude mcp add chrome-devtools npx chrome-devtools-mcp@latest
claude mcp add filesystem npx @modelcontextprotocol/server-filesystem@latest
claude mcp add git npx @modelcontextprotocol/server-git@latest
claude mcp add postgres npx @modelcontextprotocol/server-postgres@latest
claude mcp add docker npx @modelcontextprotocol/server-docker@latest
```

## Available MCP Servers

### 1. Supabase Server
- **Purpose**: Direct database operations and real-time features
- **Usage**: Database queries, schema management, real-time subscriptions
- **Configuration**: Requires `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`

### 2. Chrome DevTools Server
- **Purpose**: Frontend testing and debugging
- **Usage**: Performance testing, screenshot capture, form automation
- **Configuration**: Requires Chrome browser

### 3. Filesystem Server
- **Purpose**: File operations within the project
- **Usage**: Read/write files, directory operations, code analysis
- **Configuration**: Restricted to ChMS project directories

### 4. Git Server
- **Purpose**: Version control operations
- **Usage**: Commit history, branch management, diff analysis
- **Configuration**: Works with current Git repository

### 5. PostgreSQL Server
- **Purpose**: Direct database operations
- **Usage**: SQL queries, schema inspection, data analysis
- **Configuration**: Requires database connection string

### 6. Docker Server
- **Purpose**: Container management
- **Usage**: Build images, manage containers, environment setup
- **Configuration**: Requires Docker daemon

## Environment Configuration

Create a `.env.mcp` file with required environment variables:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key

# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database

# Project Paths
PROJECT_ROOT=/mnt/c/Users/Username/Documents/github/ChMS
BACKEND_PATH=/mnt/c/Users/Username/Documents/github/ChMS/backend
FRONTEND_PATH=/mnt/c/Users/Username/Documents/github/ChMS/frontend
```

## Usage Examples

### Database Operations
```
Query the members table to show recent registrations
```

### File Operations
```
Show me the Vue components in the frontend/src/components directory
```

### Git Operations
```
Show me the commit history for the member management feature
```

### Testing Operations
```
Take a screenshot of the login page and check for accessibility issues
```

## Troubleshooting

### Common Issues

1. **MCP Server Connection Failed**
   - Check if required dependencies are installed
   - Verify environment variables are set correctly
   - Ensure services (database, Docker) are running

2. **Permission Denied**
   - Check file system permissions
   - Verify allowed directories in filesystem server config

3. **API Key Issues**
   - Verify API key is correctly configured: `claude config get api-key`
   - Re-authenticate: `claude auth login`

### Health Check
```bash
claude mcp list  # Shows all servers and their status
claude mcp test <server-name>  # Test specific server
```

## Security Considerations

- MCP servers have access to your development environment
- Use service keys with minimal required permissions
- Regularly rotate API keys and database credentials
- Review MCP server logs for unusual activity

## Next Steps

1. Test each MCP server with simple commands
2. Configure environment variables for your setup
3. Explore advanced features like real-time database subscriptions
4. Integrate MCP capabilities into your development workflow

For more information, see the [official MCP documentation](https://modelcontextprotocol.io/).
