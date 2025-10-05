# Chrome DevTools MCP - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Install Chrome DevTools MCP
Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

### 2. Test Installation
Run this prompt in your MCP client:
```
Check the performance of https://developers.chrome.com
```

### 3. Basic Usage Examples

#### Navigate and Screenshot
```javascript
// Navigate to a website
navigatePage({ url: "https://example.com" })

// Wait for page to load
waitFor({ text: "Welcome" })

// Take a screenshot
takeScreenshot({ filename: "homepage.png" })
```

#### Fill a Form
```javascript
// Navigate to form
navigatePage({ url: "https://example.com/contact" })

// Fill form fields
fillForm({
  fields: [
    {
      name: "Name",
      type: "textbox",
      ref: "input[name='name']",
      value: "John Doe"
    },
    {
      name: "Email", 
      type: "textbox",
      ref: "input[name='email']",
      value: "john@example.com"
    }
  ]
})

// Submit form
click({
  element: "Submit button",
  ref: "button[type='submit']"
})
```

#### Performance Testing
```javascript
// Start performance trace
performanceStartTrace()

// Navigate and interact
navigatePage({ url: "https://example.com" })
click({ element: "Button", ref: "button" })

// Stop and analyze
const trace = await performanceStopTrace()
const insights = await performanceAnalyzeInsight()
```

## 🛠️ Common Tools

| Tool | Purpose | Example |
|------|---------|---------|
| `navigatePage` | Go to URL | `navigatePage({ url: "https://example.com" })` |
| `click` | Click element | `click({ element: "Button", ref: "button" })` |
| `fill` | Fill input | `fill({ element: "Email", ref: "input[type='email']", value: "test@example.com" })` |
| `takeScreenshot` | Capture page | `takeScreenshot({ filename: "page.png" })` |
| `waitFor` | Wait for condition | `waitFor({ text: "Loading complete" })` |
| `evaluateScript` | Run JavaScript | `evaluateScript({ function: "() => document.title" })` |

## 🔧 Configuration Options

### Basic Configuration
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"]
    }
  }
}
```

### Advanced Configuration
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest",
        "--headless=true",
        "--isolated=true",
        "--viewport=1920x1080"
      ]
    }
  }
}
```

## 🐛 Troubleshooting

### Chrome Won't Start
- Update Chrome to latest version
- Try `--isolated=true` for clean profile
- Use `--channel=canary` for different Chrome version

### Elements Not Found
- Use `takeSnapshot()` to see current page state
- Wait for elements: `waitFor({ text: "Loading" })`
- Use more specific selectors

### Performance Issues
- Use `--headless=true` for faster execution
- Close unused pages
- Use `--isolated=true` for clean state

## 📚 Next Steps

1. **Read the full guide**: [chrome-devtools-mcp-guide.md](./chrome-devtools-mcp-guide.md)
2. **Explore examples**: Try the usage examples above
3. **Check the repository**: [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)
4. **Join the community**: Report issues and get help

## 🔗 Useful Links

- [GitHub Repository](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [NPM Package](https://npmjs.org/package/chrome-devtools-mcp)
- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/)
- [MCP Protocol](https://modelcontextprotocol.io/)

---

**Need help?** Check the troubleshooting section or visit the GitHub repository for support.
