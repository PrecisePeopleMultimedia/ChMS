# Chrome DevTools MCP Server - Complete Guide

## Table of Contents
1. [Overview](#overview)
2. [Installation & Setup](#installation--setup)
3. [Configuration](#configuration)
4. [Tools Reference](#tools-reference)
5. [Usage Examples](#usage-examples)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)
8. [Advanced Features](#advanced-features)

## Overview

The Chrome DevTools MCP (Model Context Protocol) server is a powerful tool that exposes browser functionality to AI coding agents, allowing them to inspect, debug, and modify web applications through Chrome's DevTools API. Based on the [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) repository, this server provides comprehensive browser automation capabilities.

### Key Features
- **Browser Automation**: Navigate, click, fill forms, and interact with web pages
- **Performance Analysis**: Record and analyze performance traces
- **Network Monitoring**: Inspect network requests and responses
- **Debugging Tools**: Execute JavaScript, take screenshots, and capture snapshots
- **Emulation**: Test different devices, network conditions, and CPU throttling

### Requirements
- **Node.js**: v20.19 or newer (latest maintenance LTS version)
- **Chrome**: Current stable version or newer
- **npm**: For package management

## Installation & Setup

### Basic Installation

Add the following configuration to your MCP client:

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

### MCP Client Specific Setup

#### Claude Code
```bash
claude mcp add chrome-devtools npx chrome-devtools-mcp@latest
```

#### Cline
Follow the [MCP configuration guide](https://docs.cline.bot/mcp/configuring-mcp-servers) using the standard config above.

#### Codex
```bash
codex mcp add chrome-devtools -- npx chrome-devtools-mcp@latest
```

#### Windows 11 Configuration
Update `.codex/config.toml` with the following:

```toml
[mcp_servers.chrome-devtools]
command = "cmd"
args = [
    "/c",
    "npx",
    "-y",
    "chrome-devtools-mcp@latest",
]
env = { SystemRoot="C:\\Windows", PROGRAMFILES="C:\\Program Files" }
startup_timeout_ms = 20_000
```

#### Copilot CLI
1. Start Copilot CLI: `copilot`
2. Add MCP server: `/mcp add`
3. Configure:
   - **Server name**: `chrome-devtools`
   - **Server Type**: `[1] Local`
   - **Command**: `npx`
   - **Arguments**: `-y, chrome-devtools-mcp@latest`

#### VS Code
```bash
code --add-mcp '{"name":"chrome-devtools","command":"npx","args":["chrome-devtools-mcp@latest"]}'
```

#### Cursor
**Click to install**: [Install in Cursor](https://cursor.sh/mcp/chrome-devtools)

Or manually:
1. Go to `Cursor Settings` → `MCP` → `New MCP Server`
2. Use the standard configuration

#### Gemini CLI
**Project wide:**
```bash
gemini mcp add chrome-devtools npx chrome-devtools-mcp@latest
```

**Globally:**
```bash
gemini mcp add -s user chrome-devtools npx chrome-devtools-mcp@latest
```

#### JetBrains AI Assistant & Junie
1. Go to `Settings | Tools | AI Assistant | Model Context Protocol (MCP)` → `Add`
2. Use the standard configuration
3. For Junie: `Settings | Tools | Junie | MCP Settings` → `Add`

#### Visual Studio
**Click to install**: [Install in Visual Studio](https://visualstudio.microsoft.com/mcp/chrome-devtools)

#### Warp
1. Go to `Settings | AI | Manage MCP Servers` → `+ Add`
2. Use the standard configuration

### First Test
To verify installation, run this prompt in your MCP client:

```
Check the performance of https://developers.chrome.com
```

This should open Chrome and record a performance trace.

## Configuration

### Command Line Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--browserUrl`, `-u` | string | - | Connect to running Chrome instance using port forwarding |
| `--headless` | boolean | false | Run in headless (no UI) mode |
| `--executablePath`, `-e` | string | - | Path to custom Chrome executable |
| `--isolated` | boolean | false | Create temporary user-data-dir (auto-cleaned) |
| `--channel` | string | stable | Chrome channel (stable, canary, beta, dev) |
| `--logFile` | string | - | Path to debug log file |
| `--viewport` | string | - | Initial viewport size (e.g., 1280x720) |
| `--proxyServer` | string | - | Proxy server configuration |
| `--acceptInsecureCerts` | boolean | false | Ignore self-signed certificate errors |

### Configuration Examples

#### Basic Configuration
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

#### Advanced Configuration
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest",
        "--channel=canary",
        "--headless=true",
        "--isolated=true",
        "--viewport=1920x1080"
      ]
    }
  }
}
```

#### Connect to Existing Chrome
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest",
        "--browserUrl=http://localhost:9222"
      ]
    }
  }
}
```

## Tools Reference

### Input Automation (7 tools)

#### 1. Click
Click on elements, coordinates, or text.

**Parameters:**
- `element` (string): Human-readable element description
- `ref` (string): Exact target element reference from page snapshot
- `button` (string): Mouse button (left, right, middle)
- `modifiers` (array): Keyboard modifiers (Alt, Control, Meta, Shift)
- `doubleClick` (boolean): Perform double-click

**Example:**
```javascript
// Click a button
click({
  element: "Login button",
  ref: "button[data-testid='login']"
})

// Right-click with modifier
click({
  element: "Submit form",
  ref: "form#contact",
  button: "right",
  modifiers: ["Control"]
})
```

#### 2. Drag
Drag and drop between elements.

**Parameters:**
- `startElement` (string): Source element description
- `startRef` (string): Source element reference
- `endElement` (string): Target element description
- `endRef` (string): Target element reference

**Example:**
```javascript
drag({
  startElement: "File to upload",
  startRef: "div.file-item[data-id='123']",
  endElement: "Drop zone",
  endRef: "div.drop-zone"
})
```

#### 3. Fill
Fill form fields with values.

**Parameters:**
- `element` (string): Target element description
- `ref` (string): Element reference
- `value` (string): Text to fill

**Example:**
```javascript
fill({
  element: "Email input field",
  ref: "input[type='email']",
  value: "user@example.com"
})
```

#### 4. Fill Form
Fill multiple form fields at once.

**Parameters:**
- `fields` (array): Array of field objects

**Field Object:**
- `name` (string): Human-readable field name
- `type` (string): Field type (textbox, checkbox, radio, combobox, slider)
- `ref` (string): Field reference
- `value` (string): Value to fill

**Example:**
```javascript
fillForm({
  fields: [
    {
      name: "Email address",
      type: "textbox",
      ref: "input[name='email']",
      value: "user@example.com"
    },
    {
      name: "Subscribe to newsletter",
      type: "checkbox",
      ref: "input[name='newsletter']",
      value: "true"
    }
  ]
})
```

#### 5. Handle Dialog
Handle browser dialogs (alert, confirm, prompt).

**Parameters:**
- `accept` (boolean): Whether to accept the dialog
- `promptText` (string): Text for prompt dialogs

**Example:**
```javascript
handleDialog({
  accept: true,
  promptText: "My response"
})
```

#### 6. Hover
Hover over elements.

**Parameters:**
- `element` (string): Element description
- `ref` (string): Element reference

**Example:**
```javascript
hover({
  element: "Menu item",
  ref: "li.menu-item[data-id='settings']"
})
```

#### 7. Upload File
Upload files to file input elements.

**Parameters:**
- `paths` (array): Array of file paths to upload

**Example:**
```javascript
uploadFile({
  paths: ["/path/to/file1.pdf", "/path/to/file2.jpg"]
})
```

### Navigation Automation (7 tools)

#### 1. Close Page
Close the current page.

**Example:**
```javascript
closePage()
```

#### 2. List Pages
List all open pages/tabs.

**Example:**
```javascript
const pages = await listPages()
console.log(pages)
```

#### 3. Navigate Page
Navigate to a URL.

**Parameters:**
- `url` (string): URL to navigate to

**Example:**
```javascript
navigatePage({
  url: "https://example.com"
})
```

#### 4. Navigate Page History
Navigate browser history.

**Example:**
```javascript
navigatePageHistory() // Go back
```

#### 5. New Page
Open a new page/tab.

**Example:**
```javascript
newPage()
```

#### 6. Select Page
Switch to a specific page/tab.

**Parameters:**
- `index` (number): Page index

**Example:**
```javascript
selectPage({
  index: 1
})
```

#### 7. Wait For
Wait for conditions or time.

**Parameters:**
- `time` (number): Time to wait in seconds
- `text` (string): Text to wait for
- `textGone` (string): Text to wait for to disappear

**Example:**
```javascript
waitFor({
  text: "Loading complete"
})

waitFor({
  time: 5
})
```

### Emulation (3 tools)

#### 1. Emulate CPU
Throttle CPU performance.

**Parameters:**
- `rate` (number): CPU throttling rate (1 = normal, 4 = 4x slower)

**Example:**
```javascript
emulateCPU({
  rate: 4
})
```

#### 2. Emulate Network
Simulate network conditions.

**Parameters:**
- `offline` (boolean): Simulate offline mode
- `downloadThroughput` (number): Download speed in bytes/sec
- `uploadThroughput` (number): Upload speed in bytes/sec
- `latency` (number): Network latency in milliseconds

**Example:**
```javascript
emulateNetwork({
  offline: false,
  downloadThroughput: 500000, // 500KB/s
  uploadThroughput: 100000,   // 100KB/s
  latency: 100
})
```

#### 3. Resize Page
Resize browser window.

**Parameters:**
- `width` (number): Window width
- `height` (number): Window height

**Example:**
```javascript
resizePage({
  width: 1920,
  height: 1080
})
```

### Performance (3 tools)

#### 1. Performance Analyze Insight
Analyze performance data and provide insights.

**Example:**
```javascript
const insights = await performanceAnalyzeInsight()
console.log(insights)
```

#### 2. Performance Start Trace
Start recording a performance trace.

**Example:**
```javascript
performanceStartTrace()
```

#### 3. Performance Stop Trace
Stop recording and return performance data.

**Example:**
```javascript
const trace = await performanceStopTrace()
console.log(trace)
```

### Network (2 tools)

#### 1. Get Network Request
Get details of a specific network request.

**Parameters:**
- `requestId` (string): Network request ID

**Example:**
```javascript
const request = await getNetworkRequest({
  requestId: "12345"
})
```

#### 2. List Network Requests
List all network requests.

**Example:**
```javascript
const requests = await listNetworkRequests()
console.log(requests)
```

### Debugging (4 tools)

#### 1. Evaluate Script
Execute JavaScript in the page context.

**Parameters:**
- `function` (string): JavaScript function to execute
- `element` (string): Element to execute on (optional)
- `ref` (string): Element reference (optional)

**Example:**
```javascript
const result = await evaluateScript({
  function: "() => document.title"
})

const elementResult = await evaluateScript({
  function: "(element) => element.textContent",
  element: "Header element",
  ref: "h1.title"
})
```

#### 2. List Console Messages
Get console messages from the page.

**Parameters:**
- `onlyErrors` (boolean): Only return error messages

**Example:**
```javascript
const messages = await listConsoleMessages({
  onlyErrors: true
})
```

#### 3. Take Screenshot
Capture a screenshot.

**Parameters:**
- `type` (string): Image format (png, jpeg)
- `filename` (string): File name to save
- `element` (string): Element to screenshot (optional)
- `ref` (string): Element reference (optional)
- `fullPage` (boolean): Capture full page

**Example:**
```javascript
takeScreenshot({
  type: "png",
  filename: "screenshot.png",
  fullPage: true
})
```

#### 4. Take Snapshot
Capture accessibility snapshot.

**Example:**
```javascript
const snapshot = await takeSnapshot()
console.log(snapshot)
```

## Usage Examples

### Basic Web Scraping
```javascript
// Navigate to a page
navigatePage({ url: "https://example.com" })

// Wait for content to load
waitFor({ text: "Welcome" })

// Take a screenshot
takeScreenshot({ filename: "homepage.png" })

// Extract data
const title = await evaluateScript({
  function: "() => document.title"
})

const links = await evaluateScript({
  function: "() => Array.from(document.querySelectorAll('a')).map(a => a.href)"
})
```

### Form Automation
```javascript
// Navigate to form page
navigatePage({ url: "https://example.com/contact" })

// Fill form
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
    },
    {
      name: "Message",
      type: "textbox",
      ref: "textarea[name='message']",
      value: "Hello, this is a test message."
    }
  ]
})

// Submit form
click({
  element: "Submit button",
  ref: "button[type='submit']"
})

// Wait for success message
waitFor({ text: "Thank you" })
```

### Performance Testing
```javascript
// Start performance trace
performanceStartTrace()

// Navigate to page
navigatePage({ url: "https://example.com" })

// Wait for page to load
waitFor({ text: "Content loaded" })

// Stop trace and analyze
const trace = await performanceStopTrace()
const insights = await performanceAnalyzeInsight()

console.log("Performance insights:", insights)
```

### Network Monitoring
```javascript
// Navigate to page
navigatePage({ url: "https://example.com" })

// Wait for page to load
waitFor({ time: 3 })

// Get network requests
const requests = await listNetworkRequests()

// Filter for specific requests
const apiRequests = requests.filter(req => 
  req.url.includes('/api/')
)

console.log("API requests:", apiRequests)
```

### Mobile Testing
```javascript
// Resize to mobile viewport
resizePage({ width: 375, height: 667 })

// Navigate to mobile site
navigatePage({ url: "https://m.example.com" })

// Test mobile interactions
click({
  element: "Mobile menu button",
  ref: "button.mobile-menu"
})

// Take mobile screenshot
takeScreenshot({
  filename: "mobile-view.png",
  fullPage: true
})
```

## Troubleshooting

### Common Issues

#### 1. Chrome Not Starting
**Problem**: Chrome fails to start or crashes immediately.

**Solutions**:
- Update Chrome to the latest version
- Check if Chrome is already running and close it
- Use `--isolated=true` for clean profile
- Try different Chrome channel: `--channel=canary`

#### 2. Permission Errors
**Problem**: Permission denied errors on macOS/Linux.

**Solutions**:
- Disable sandboxing in MCP client settings
- Use `--browserUrl` to connect to existing Chrome instance
- Run with appropriate permissions

#### 3. Network Issues
**Problem**: Cannot connect to remote Chrome instance.

**Solutions**:
- Verify Chrome is running with remote debugging: `chrome --remote-debugging-port=9222`
- Check firewall settings
- Use correct `--browserUrl` parameter

#### 4. Element Not Found
**Problem**: Cannot find elements for interaction.

**Solutions**:
- Use `takeSnapshot()` to see current page state
- Wait for elements to load: `waitFor({ text: "Loading complete" })`
- Use more specific selectors
- Check if element is in iframe

### Debug Mode

Enable verbose logging:

```bash
DEBUG=* npx chrome-devtools-mcp@latest --logFile=debug.log
```

### Performance Issues

If Chrome is slow or unresponsive:

1. Use headless mode: `--headless=true`
2. Reduce viewport size: `--viewport=800x600`
3. Use isolated mode: `--isolated=true`
4. Close unnecessary tabs

## Best Practices

### 1. Element Selection
- Use specific, stable selectors
- Prefer data attributes: `[data-testid="button"]`
- Avoid fragile selectors like nth-child
- Use `takeSnapshot()` to verify element references

### 2. Timing
- Always wait for elements to load
- Use `waitFor()` instead of fixed delays
- Check for loading indicators
- Handle dynamic content properly

### 3. Error Handling
- Check console messages for errors
- Use try-catch blocks for critical operations
- Implement retry logic for flaky operations
- Log detailed error information

### 4. Performance
- Use headless mode for automated testing
- Close unused pages
- Limit concurrent operations
- Monitor memory usage

### 5. Security
- Never share sensitive data
- Use isolated mode for untrusted sites
- Be cautious with file uploads
- Validate all inputs

## Advanced Features

### Custom Chrome Configuration
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest",
        "--executablePath=/path/to/chrome",
        "--channel=canary",
        "--headless=true",
        "--isolated=true",
        "--viewport=1920x1080",
        "--proxyServer=http://proxy:8080"
      ]
    }
  }
}
```

### Multi-Page Workflows
```javascript
// Open multiple pages
const page1 = newPage()
const page2 = newPage()

// Switch between pages
selectPage({ index: 0 })
navigatePage({ url: "https://site1.com" })

selectPage({ index: 1 })
navigatePage({ url: "https://site2.com" })

// Work with both pages
// ... perform operations on each page
```

### Custom JavaScript Execution
```javascript
// Execute complex JavaScript
const result = await evaluateScript({
  function: `
    () => {
      // Complex data processing
      const data = Array.from(document.querySelectorAll('.item'))
        .map(item => ({
          title: item.querySelector('.title').textContent,
          price: item.querySelector('.price').textContent,
          link: item.querySelector('a').href
        }))
      
      return data
    }
  `
})
```

### Performance Monitoring
```javascript
// Start monitoring
performanceStartTrace()

// Perform operations
navigatePage({ url: "https://example.com" })
click({ element: "Button", ref: "button" })
waitFor({ text: "Success" })

// Analyze performance
const trace = await performanceStopTrace()
const insights = await performanceAnalyzeInsight()

// Generate report
console.log("Performance Report:")
console.log("Total time:", trace.duration)
console.log("Insights:", insights)
```

## Conclusion

The Chrome DevTools MCP server provides powerful browser automation capabilities for AI coding agents. With its comprehensive toolset covering input automation, navigation, performance analysis, and debugging, it enables sophisticated web testing and interaction workflows.

For more information, visit the [official repository](https://github.com/ChromeDevTools/chrome-devtools-mcp) or check the [npm package](https://npmjs.org/package/chrome-devtools-mcp).

---

**Note**: Always be cautious when sharing sensitive information with MCP clients. The Chrome DevTools MCP server has access to all browser data and should be used responsibly.
