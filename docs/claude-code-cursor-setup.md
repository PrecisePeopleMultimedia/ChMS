# Claude Code CLI + Cursor Integration Guide

## 🎯 **Overview**

This guide shows you how to use Claude Code CLI alongside Cursor for enhanced AI-powered development workflows.

## 🔑 **API Key Requirements**

### **Why You Need Both:**
- **Cursor**: Uses built-in Claude Sonnet 3.5 (included in subscription)
- **Claude Code CLI**: Requires your own Anthropic API key for advanced features

### **Getting Your Anthropic API Key:**

1. **Visit**: [console.anthropic.com](https://console.anthropic.com)
2. **Sign up/Login** with your account
3. **Navigate** to "API Keys" section
4. **Create** a new API key
5. **Copy** the key (starts with `sk-ant-`)

## 🚀 **Installation & Setup**

### **Step 1: Install Claude Code CLI**
```bash
npm install -g @anthropic-ai/claude-code
```

### **Step 2: Verify Installation**
```bash
claude --version
# Should show: 2.0.8 (Claude Code)
```

### **Step 3: Configure API Key**
```bash
# Method 1: Interactive login
claude auth login

# Method 2: Set API key directly
claude config set api-key sk-ant-your-api-key-here

# Method 3: Environment variable
export ANTHROPIC_API_KEY=sk-ant-your-api-key-here
```

### **Step 4: Test Configuration**
```bash
claude "Hello, can you help me with coding?"
```

## 🔧 **Integration with Cursor**

### **Workflow 1: File Analysis**
```bash
# Analyze your current project
claude analyze frontend/src/

# Get specific file analysis
claude analyze frontend/src/App.vue

# Generate documentation
claude docs frontend/src/components/
```

### **Workflow 2: Code Generation**
```bash
# Generate new components
claude generate component UserProfile --path frontend/src/components/

# Generate tests
claude generate test auth.spec.ts --path frontend/e2e/

# Generate API endpoints
claude generate api user-management --path backend/app/Http/Controllers/
```

### **Workflow 3: Project Management**
```bash
# Add MCP servers
claude mcp add chrome-devtools npx chrome-devtools-mcp@latest

# List MCP servers
claude mcp list

# Test MCP connections
claude mcp test chrome-devtools
```

## 🛠️ **Advanced Features**

### **MCP Server Management**
```bash
# Add Supabase MCP
claude mcp add supabase npx @supabase/mcp-server@latest

# Add Chrome DevTools MCP
claude mcp add chrome-devtools npx chrome-devtools-mcp@latest

# List all MCP servers
claude mcp list

# Test MCP server
claude mcp test supabase
```

### **File Operations**
```bash
# Read and analyze files
claude read frontend/src/App.vue

# Write new files
claude write frontend/src/components/NewComponent.vue "Vue component code here"

# Edit existing files
claude edit frontend/src/App.vue "Add new feature"
```

### **Project Analysis**
```bash
# Analyze entire project
claude analyze .

# Generate project documentation
claude docs .

# Create project summary
claude summary .
```

## 🔄 **Cursor + Claude Code CLI Workflow**

### **Scenario 1: Component Development**
1. **In Cursor**: Use Cursor's AI for real-time coding assistance
2. **In Terminal**: Use Claude Code CLI for complex analysis
   ```bash
   claude analyze frontend/src/components/
   claude generate test ComponentName.spec.ts
   ```

### **Scenario 2: API Development**
1. **In Cursor**: Write API endpoints with Cursor's help
2. **In Terminal**: Use Claude Code CLI for testing and documentation
   ```bash
   claude generate test api.spec.ts
   claude docs backend/app/Http/Controllers/
   ```

### **Scenario 3: MCP Server Integration**
1. **In Cursor**: Develop your application
2. **In Terminal**: Use Claude Code CLI to manage MCP servers
   ```bash
   claude mcp add chrome-devtools npx chrome-devtools-mcp@latest
   claude mcp test chrome-devtools
   ```

## 📁 **Project-Specific Setup**

### **For Your ChMS Project:**
```bash
# Navigate to your project
cd C:\Users\Username\Documents\github\ChMS

# Analyze current state
claude analyze .

# Add MCP servers for your project
claude mcp add supabase npx @supabase/mcp-server@latest
claude mcp add chrome-devtools npx chrome-devtools-mcp@latest

# Generate project documentation
claude docs .

# Create comprehensive project summary
claude summary .
```

## 🎯 **Best Practices**

### **When to Use Cursor:**
- Real-time coding assistance
- Quick code completion
- Immediate error fixing
- Live editing and debugging

### **When to Use Claude Code CLI:**
- Complex project analysis
- MCP server management
- Bulk file operations
- Advanced AI workflows
- Project documentation generation

### **Combined Workflow:**
1. **Start with Cursor** for initial development
2. **Use Claude Code CLI** for analysis and optimization
3. **Return to Cursor** for final implementation
4. **Use Claude Code CLI** for testing and documentation

## 🔧 **Configuration Files**

### **Claude Code CLI Config:**
```json
{
  "apiKey": "sk-ant-your-api-key-here",
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["@supabase/mcp-server@latest"]
    },
    "chrome-devtools": {
      "command": "npx", 
      "args": ["chrome-devtools-mcp@latest"]
    }
  }
}
```

### **Environment Variables:**
```bash
# Add to your .bashrc or .zshrc
export ANTHROPIC_API_KEY=sk-ant-your-api-key-here
export CLAUDE_CONFIG_PATH=~/.claude/config.json
```

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **1. API Key Not Working**
```bash
# Check API key
claude config get api-key

# Reset API key
claude config set api-key sk-ant-your-new-key
```

#### **2. MCP Server Issues**
```bash
# List MCP servers
claude mcp list

# Test specific server
claude mcp test server-name

# Remove problematic server
claude mcp remove server-name
```

#### **3. Permission Issues**
```bash
# Check permissions
ls -la ~/.claude/

# Fix permissions
chmod 755 ~/.claude/
```

## 📚 **Useful Commands**

### **Project Management:**
```bash
claude analyze .                    # Analyze entire project
claude docs .                       # Generate documentation
claude summary .                    # Create project summary
claude generate test .              # Generate all tests
```

### **MCP Server Management:**
```bash
claude mcp list                     # List all MCP servers
claude mcp add <name> <command>     # Add MCP server
claude mcp remove <name>            # Remove MCP server
claude mcp test <name>              # Test MCP server
```

### **File Operations:**
```bash
claude read <file>                  # Read and analyze file
claude write <file> <content>       # Write new file
claude edit <file> <changes>         # Edit existing file
```

## 🎉 **Next Steps**

1. **Get your Anthropic API key** from [console.anthropic.com](https://console.anthropic.com)
2. **Configure Claude Code CLI** with your API key
3. **Add MCP servers** for your project needs
4. **Start using both tools** in your development workflow
5. **Experiment** with different commands and features

## 🔗 **Useful Links**

- [Claude Code CLI Documentation](https://docs.anthropic.com/claude/claude-code)
- [Anthropic Console](https://console.anthropic.com)
- [MCP Protocol Documentation](https://modelcontextprotocol.io/)
- [Cursor Documentation](https://cursor.sh/docs)

---

**Happy coding with Claude Code CLI + Cursor! 🚀**
