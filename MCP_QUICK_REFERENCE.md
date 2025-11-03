# ChMS - MCP Quick Reference

## 🎉 MCP Setup Complete!

Your ChMS project now has Model Context Protocol (MCP) servers configured and ready to use.

## ✅ What's Been Added

### MCP Servers Configured
- **✅ Supabase** - Database operations and real-time features
- **✅ Chrome DevTools** - Browser automation and testing
- **✅ Filesystem** - File operations within the project
- **✅ Git** - Version control operations
- **✅ PostgreSQL** - Direct database queries
- **✅ Docker** - Container management

### Files Created
- **`mcp-config.json`** - MCP server configuration
- **`.mcp.json`** - Project-specific MCP settings
- **`docs/MCP_SETUP_GUIDE.md`** - Comprehensive setup guide
- **`docs/INDEX.md`** - Documentation index
- **`scripts/test-mcp-servers.sh`** - MCP testing script

### Existing Scripts Enhanced
- **`scripts/setup-claude-mcp.ps1`** - Windows PowerShell setup
- **`scripts/setup-claude-mcp.sh`** - Linux/macOS Bash setup

## 🚀 Quick Commands

### Check MCP Status
```bash
claude mcp list  # Show all configured servers
```

### Test MCP Setup
```bash
./scripts/test-mcp-servers.sh  # Run comprehensive tests
```

### Add New MCP Server
```bash
claude mcp add <name> <command> [args...]
```

### Remove MCP Server
```bash
claude mcp remove <name>
```

## 🔧 Next Steps

### 1. Configure API Key (Required)
```bash
claude auth login
# Or manually: claude config set api-key sk-ant-your-key-here
```

### 2. Set Environment Variables
Create `.env.mcp` with:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
DATABASE_URL=postgresql://user:pass@host:port/db
```

### 3. Test MCP Functionality
Try these commands with Claude:
- "Show me the Vue components in the frontend directory"
- "Query the members table in the database"
- "Take a screenshot of the login page"
- "Show me recent Git commits"

## 📚 Documentation

- **[docs/MCP_SETUP_GUIDE.md](docs/MCP_SETUP_GUIDE.md)** - Complete setup guide
- **[docs/INDEX.md](docs/INDEX.md)** - All documentation index
- **[mcp-config.json](mcp-config.json)** - Server configurations

## 🆘 Troubleshooting

### Common Issues
1. **"MCP server connection failed"**
   - Check if required services are running
   - Verify environment variables are set

2. **"API key not configured"**
   - Run: `claude auth login`
   - Or set manually: `claude config set api-key sk-ant-...`

3. **"Permission denied"**
   - Check file permissions
   - Verify allowed directories in config

### Get Help
- Check [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- Run the test script: `./scripts/test-mcp-servers.sh`
- Review MCP server logs

## 🎯 Usage Examples

### Database Operations
```
"Show me all members registered this month"
"Create a new attendance record for today's service"
"Query the organizations table structure"
```

### File Operations
```
"List all Vue components in the frontend"
"Show me the Laravel models in the backend"
"Find all TypeScript files with 'member' in the name"
```

### Git Operations
```
"Show me the commit history for member management"
"What files were changed in the last commit?"
"Show me the diff for the authentication feature"
```

### Browser Testing
```
"Take a screenshot of the login page"
"Test the member registration form"
"Check the performance of the dashboard page"
```

---

**🎉 Your ChMS project is now MCP-enabled and ready for AI-assisted development!**

For detailed information, see [docs/MCP_SETUP_GUIDE.md](docs/MCP_SETUP_GUIDE.md)
