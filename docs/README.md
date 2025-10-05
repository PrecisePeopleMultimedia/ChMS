# Chrome DevTools MCP Documentation

Welcome to the comprehensive documentation for the Chrome DevTools MCP (Model Context Protocol) server. This documentation provides everything you need to get started with browser automation using AI coding agents.

## 📚 Documentation Structure

### 🚀 [Quick Start Guide](./chrome-devtools-mcp-quickstart.md)
Get up and running in 5 minutes with basic setup and common usage patterns.

### 📖 [Complete Guide](./chrome-devtools-mcp-guide.md)
Comprehensive documentation covering all features, configuration options, and advanced usage.

### 💡 [Practical Examples](./chrome-devtools-mcp-examples.md)
Real-world use cases and code examples for common scenarios like e-commerce testing, form automation, and performance monitoring.

## 🎯 What is Chrome DevTools MCP?

The Chrome DevTools MCP server is a powerful tool that exposes browser functionality to AI coding agents through Chrome's DevTools API. It enables:

- **Browser Automation**: Navigate, click, fill forms, and interact with web pages
- **Performance Analysis**: Record and analyze performance traces
- **Network Monitoring**: Inspect network requests and responses  
- **Debugging Tools**: Execute JavaScript, take screenshots, and capture snapshots
- **Emulation**: Test different devices, network conditions, and CPU throttling

## 🛠️ Key Features

| Feature | Description | Use Case |
|---------|-------------|----------|
| **Input Automation** | Click, drag, fill forms, handle dialogs | UI testing, form automation |
| **Navigation** | Navigate pages, manage tabs, browser history | Multi-page workflows |
| **Performance** | Record traces, analyze performance metrics | Performance testing |
| **Network** | Monitor requests, analyze network traffic | API testing, debugging |
| **Debugging** | Execute JavaScript, take screenshots | Web scraping, testing |
| **Emulation** | Simulate devices, network conditions | Responsive testing |

## 🚀 Quick Start

### 1. Install
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

### 2. Test
Run this prompt in your MCP client:
```
Check the performance of https://developers.chrome.com
```

### 3. Basic Usage
```javascript
// Navigate to a website
navigatePage({ url: "https://example.com" })

// Take a screenshot
takeScreenshot({ filename: "homepage.png" })

// Fill a form
fillForm({
  fields: [
    {
      name: "Email",
      type: "textbox", 
      ref: "input[type='email']",
      value: "user@example.com"
    }
  ]
})
```

## 📋 Requirements

- **Node.js**: v20.19 or newer (latest maintenance LTS)
- **Chrome**: Current stable version or newer
- **npm**: For package management

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

## 🎯 Common Use Cases

### E-commerce Testing
- Product search and filtering
- Shopping cart functionality
- Checkout process validation
- Payment form testing

### Form Automation
- Contact form submission
- User registration flows
- Data validation testing
- Multi-step form processes

### Performance Monitoring
- Page load time analysis
- Core Web Vitals measurement
- Network request monitoring
- Resource optimization

### Mobile Testing
- Responsive design validation
- Touch interaction testing
- Mobile-specific features
- Cross-device compatibility

## 🛠️ Available Tools

### Input Automation (7 tools)
- `click` - Click elements or coordinates
- `drag` - Drag and drop between elements
- `fill` - Fill form fields
- `fill_form` - Fill multiple form fields
- `handle_dialog` - Handle browser dialogs
- `hover` - Hover over elements
- `upload_file` - Upload files to forms

### Navigation (7 tools)
- `navigate_page` - Navigate to URLs
- `new_page` - Open new tabs
- `close_page` - Close current page
- `select_page` - Switch between tabs
- `list_pages` - List all open pages
- `navigate_page_history` - Browser history navigation
- `wait_for` - Wait for conditions or time

### Performance (3 tools)
- `performance_start_trace` - Start performance recording
- `performance_stop_trace` - Stop and get performance data
- `performance_analyze_insight` - Analyze performance metrics

### Network (2 tools)
- `list_network_requests` - Get all network requests
- `get_network_request` - Get specific request details

### Debugging (4 tools)
- `evaluate_script` - Execute JavaScript
- `take_screenshot` - Capture page screenshots
- `take_snapshot` - Accessibility snapshot
- `list_console_messages` - Get console messages

### Emulation (3 tools)
- `resize_page` - Resize browser window
- `emulate_network` - Simulate network conditions
- `emulate_cpu` - Throttle CPU performance

## 🐛 Troubleshooting

### Common Issues

#### Chrome Won't Start
- Update Chrome to latest version
- Try `--isolated=true` for clean profile
- Use `--channel=canary` for different Chrome version

#### Elements Not Found
- Use `takeSnapshot()` to see current page state
- Wait for elements: `waitFor({ text: "Loading" })`
- Use more specific selectors

#### Performance Issues
- Use `--headless=true` for faster execution
- Close unused pages
- Use `--isolated=true` for clean state

### Debug Mode
Enable verbose logging:
```bash
DEBUG=* npx chrome-devtools-mcp@latest --logFile=debug.log
```

## 🔗 Useful Links

- [GitHub Repository](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [NPM Package](https://npmjs.org/package/chrome-devtools-mcp)
- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/)
- [MCP Protocol](https://modelcontextprotocol.io/)

## 📖 Documentation Navigation

| Document | Purpose | Audience |
|----------|---------|----------|
| [Quick Start](./chrome-devtools-mcp-quickstart.md) | Get started quickly | Beginners |
| [Complete Guide](./chrome-devtools-mcp-guide.md) | Full feature reference | All users |
| [Examples](./chrome-devtools-mcp-examples.md) | Real-world use cases | Developers |

## 🤝 Contributing

Found an issue or have a suggestion? 

1. Check the [GitHub repository](https://github.com/ChromeDevTools/chrome-devtools-mcp) for existing issues
2. Create a new issue with detailed description
3. Follow the contributing guidelines

## 📄 License

This project is licensed under the Apache-2.0 license. See the [LICENSE](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/LICENSE) file for details.

---

**Need help?** Check the troubleshooting section in the [Complete Guide](./chrome-devtools-mcp-guide.md) or visit the [GitHub repository](https://github.com/ChromeDevTools/chrome-devtools-mcp) for support.
