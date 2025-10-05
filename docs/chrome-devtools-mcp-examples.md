# Chrome DevTools MCP - Practical Examples

## 🎯 Real-World Use Cases

### 1. E-commerce Testing
```javascript
// Test product search and purchase flow
navigatePage({ url: "https://shop.example.com" })

// Search for product
fill({
  element: "Search box",
  ref: "input[placeholder='Search products']",
  value: "laptop"
})

click({
  element: "Search button", 
  ref: "button[type='submit']"
})

// Wait for results
waitFor({ text: "Search results" })

// Click on first product
click({
  element: "First product",
  ref: ".product-item:first-child a"
})

// Add to cart
click({
  element: "Add to cart button",
  ref: "button.add-to-cart"
})

// Go to checkout
click({
  element: "Checkout button",
  ref: "a.checkout"
})

// Fill checkout form
fillForm({
  fields: [
    {
      name: "Email",
      type: "textbox",
      ref: "input[name='email']",
      value: "customer@example.com"
    },
    {
      name: "Shipping address",
      type: "textbox", 
      ref: "textarea[name='address']",
      value: "123 Main St, City, State 12345"
    }
  ]
})
```

### 2. Social Media Automation
```javascript
// Login to social media platform
navigatePage({ url: "https://social.example.com/login" })

fillForm({
  fields: [
    {
      name: "Username",
      type: "textbox",
      ref: "input[name='username']",
      value: "myusername"
    },
    {
      name: "Password", 
      type: "textbox",
      ref: "input[name='password']",
      value: "mypassword"
    }
  ]
})

click({
  element: "Login button",
  ref: "button[type='submit']"
})

// Wait for dashboard
waitFor({ text: "Dashboard" })

// Post content
click({
  element: "Create post button",
  ref: "button.create-post"
})

fill({
  element: "Post content",
  ref: "textarea[placeholder='What's on your mind?']",
  value: "Hello from automated testing!"
})

click({
  element: "Post button",
  ref: "button.post"
})

// Wait for success
waitFor({ text: "Post published" })
```

### 3. API Testing with Browser
```javascript
// Test API endpoints through browser
navigatePage({ url: "https://api.example.com/docs" })

// Wait for API documentation to load
waitFor({ text: "API Documentation" })

// Take screenshot of API docs
takeScreenshot({ filename: "api-docs.png" })

// Test API endpoint
navigatePage({ url: "https://api.example.com/users" })

// Check response
const response = await evaluateScript({
  function: "() => document.body.textContent"
})

console.log("API Response:", response)

// Test with different parameters
navigatePage({ url: "https://api.example.com/users?limit=10" })

// Monitor network requests
const requests = await listNetworkRequests()
const apiRequests = requests.filter(req => req.url.includes('/api/'))

console.log("API Requests:", apiRequests)
```

### 4. Performance Monitoring
```javascript
// Monitor website performance
performanceStartTrace()

navigatePage({ url: "https://example.com" })

// Simulate user interactions
click({
  element: "Navigation menu",
  ref: "nav.menu"
})

click({
  element: "About page",
  ref: "a[href='/about']"
})

// Wait for page to load
waitFor({ text: "About Us" })

// Stop performance trace
const trace = await performanceStopTrace()

// Analyze performance
const insights = await performanceAnalyzeInsight()

console.log("Performance Insights:")
console.log("- Load time:", trace.loadTime)
console.log("- First contentful paint:", trace.fcp)
console.log("- Largest contentful paint:", trace.lcp)
console.log("- Cumulative layout shift:", trace.cls)

// Generate performance report
const report = {
  url: "https://example.com",
  timestamp: new Date().toISOString(),
  metrics: trace,
  insights: insights
}

console.log("Performance Report:", JSON.stringify(report, null, 2))
```

### 5. Form Validation Testing
```javascript
// Test form validation
navigatePage({ url: "https://example.com/contact" })

// Test empty form submission
click({
  element: "Submit button",
  ref: "button[type='submit']"
})

// Check for validation errors
const errors = await evaluateScript({
  function: "() => Array.from(document.querySelectorAll('.error')).map(el => el.textContent)"
})

console.log("Validation errors:", errors)

// Test with invalid email
fill({
  element: "Email field",
  ref: "input[name='email']",
  value: "invalid-email"
})

click({
  element: "Submit button", 
  ref: "button[type='submit']"
})

// Check for email validation error
waitFor({ text: "Please enter a valid email" })

// Test with valid data
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
      value: "This is a test message."
    }
  ]
})

click({
  element: "Submit button",
  ref: "button[type='submit']"
})

// Wait for success message
waitFor({ text: "Thank you for your message" })
```

### 6. Mobile Responsiveness Testing
```javascript
// Test mobile responsiveness
resizePage({ width: 375, height: 667 }) // iPhone size

navigatePage({ url: "https://example.com" })

// Take mobile screenshot
takeScreenshot({ 
  filename: "mobile-homepage.png",
  fullPage: true 
})

// Test mobile menu
click({
  element: "Mobile menu button",
  ref: "button.mobile-menu"
})

// Wait for menu to open
waitFor({ text: "Navigation" })

// Test mobile navigation
click({
  element: "About link",
  ref: "a[href='/about']"
})

// Take mobile about page screenshot
takeScreenshot({
  filename: "mobile-about.png",
  fullPage: true
})

// Test tablet size
resizePage({ width: 768, height: 1024 })

takeScreenshot({
  filename: "tablet-homepage.png",
  fullPage: true
})
```

### 7. File Upload Testing
```javascript
// Test file upload functionality
navigatePage({ url: "https://example.com/upload" })

// Upload files
uploadFile({
  paths: [
    "/path/to/document.pdf",
    "/path/to/image.jpg"
  ]
})

// Wait for upload to complete
waitFor({ text: "Upload successful" })

// Check uploaded files
const uploadedFiles = await evaluateScript({
  function: "() => Array.from(document.querySelectorAll('.uploaded-file')).map(el => el.textContent)"
})

console.log("Uploaded files:", uploadedFiles)

// Test file validation
uploadFile({
  paths: ["/path/to/invalid-file.exe"]
})

// Check for validation error
waitFor({ text: "Invalid file type" })
```

### 8. Multi-Page Workflow
```javascript
// Open multiple pages for comparison
const page1 = newPage()
const page2 = newPage()

// Work with first page
selectPage({ index: 0 })
navigatePage({ url: "https://site1.example.com" })
waitFor({ text: "Welcome" })
takeScreenshot({ filename: "site1.png" })

// Work with second page  
selectPage({ index: 1 })
navigatePage({ url: "https://site2.example.com" })
waitFor({ text: "Welcome" })
takeScreenshot({ filename: "site2.png" })

// Compare content
const site1Title = await evaluateScript({
  function: "() => document.title"
})

selectPage({ index: 0 })
const site2Title = await evaluateScript({
  function: "() => document.title"
})

console.log("Site 1 title:", site1Title)
console.log("Site 2 title:", site2Title)
```

### 9. Network Monitoring
```javascript
// Monitor network requests
navigatePage({ url: "https://example.com" })

// Wait for page to load
waitFor({ time: 3 })

// Get all network requests
const requests = await listNetworkRequests()

// Analyze requests
const analysis = {
  totalRequests: requests.length,
  failedRequests: requests.filter(req => req.status >= 400).length,
  slowRequests: requests.filter(req => req.duration > 1000).length,
  resourceTypes: {
    html: requests.filter(req => req.type === 'document').length,
    css: requests.filter(req => req.type === 'stylesheet').length,
    js: requests.filter(req => req.type === 'script').length,
    images: requests.filter(req => req.type === 'image').length
  }
}

console.log("Network Analysis:", analysis)

// Check for specific API calls
const apiCalls = requests.filter(req => 
  req.url.includes('/api/') && req.method === 'GET'
)

console.log("API Calls:", apiCalls)
```

### 10. Accessibility Testing
```javascript
// Test accessibility features
navigatePage({ url: "https://example.com" })

// Take accessibility snapshot
const snapshot = await takeSnapshot()

// Check for accessibility issues
const issues = await evaluateScript({
  function: `
    () => {
      const issues = []
      
      // Check for missing alt text
      const images = document.querySelectorAll('img')
      images.forEach(img => {
        if (!img.alt) {
          issues.push('Missing alt text on image: ' + img.src)
        }
      })
      
      // Check for missing labels
      const inputs = document.querySelectorAll('input')
      inputs.forEach(input => {
        if (!input.labels.length && !input.getAttribute('aria-label')) {
          issues.push('Missing label for input: ' + input.name)
        }
      })
      
      return issues
    }
  `
})

console.log("Accessibility Issues:", issues)

// Test keyboard navigation
// (This would require more complex interaction simulation)
```

## 🔧 Advanced Patterns

### Error Handling
```javascript
async function safeClick(element, ref, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await click({ element, ref })
      return true
    } catch (error) {
      console.log(`Click attempt ${i + 1} failed:`, error.message)
      if (i === maxRetries - 1) throw error
      await waitFor({ time: 1 })
    }
  }
}

// Usage
await safeClick("Submit button", "button[type='submit']")
```

### Conditional Logic
```javascript
// Check if element exists before clicking
const elementExists = await evaluateScript({
  function: "() => document.querySelector('button.submit') !== null"
})

if (elementExists) {
  click({
    element: "Submit button",
    ref: "button.submit"
  })
} else {
  console.log("Submit button not found")
}
```

### Data Extraction
```javascript
// Extract structured data from page
const productData = await evaluateScript({
  function: `
    () => {
      const products = Array.from(document.querySelectorAll('.product'))
      return products.map(product => ({
        name: product.querySelector('.name')?.textContent,
        price: product.querySelector('.price')?.textContent,
        image: product.querySelector('img')?.src,
        link: product.querySelector('a')?.href
      }))
    }
  `
})

console.log("Extracted products:", productData)
```

## 📊 Performance Best Practices

### 1. Use Headless Mode for Automation
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest",
        "--headless=true"
      ]
    }
  }
}
```

### 2. Optimize Wait Conditions
```javascript
// Instead of fixed delays
await waitFor({ time: 5 })

// Use specific conditions
await waitFor({ text: "Loading complete" })
```

### 3. Batch Operations
```javascript
// Instead of multiple individual fills
fillForm({
  fields: [
    { name: "Field 1", type: "textbox", ref: "input[name='field1']", value: "value1" },
    { name: "Field 2", type: "textbox", ref: "input[name='field2']", value: "value2" },
    { name: "Field 3", type: "textbox", ref: "input[name='field3']", value: "value3" }
  ]
})
```

### 4. Clean Up Resources
```javascript
// Close unused pages
const pages = await listPages()
if (pages.length > 1) {
  // Close extra pages
  for (let i = 1; i < pages.length; i++) {
    selectPage({ index: i })
    closePage()
  }
}
```

## 🎯 Testing Strategies

### 1. Page Object Pattern
```javascript
// Create reusable page objects
const LoginPage = {
  async navigate() {
    await navigatePage({ url: "https://example.com/login" })
    await waitFor({ text: "Login" })
  },
  
  async login(username, password) {
    await fillForm({
      fields: [
        { name: "Username", type: "textbox", ref: "input[name='username']", value: username },
        { name: "Password", type: "textbox", ref: "input[name='password']", value: password }
      ]
    })
    await click({ element: "Login button", ref: "button[type='submit']" })
  },
  
  async isLoggedIn() {
    return await evaluateScript({
      function: "() => document.querySelector('.user-menu') !== null"
    })
  }
}

// Usage
await LoginPage.navigate()
await LoginPage.login("user", "pass")
const loggedIn = await LoginPage.isLoggedIn()
```

### 2. Test Data Management
```javascript
// Use test data objects
const testUsers = {
  valid: { username: "testuser", password: "testpass" },
  invalid: { username: "wrong", password: "wrong" }
}

// Test with different data
for (const [type, user] of Object.entries(testUsers)) {
  console.log(`Testing ${type} user...`)
  await LoginPage.navigate()
  await LoginPage.login(user.username, user.password)
  
  if (type === 'valid') {
    await waitFor({ text: "Dashboard" })
  } else {
    await waitFor({ text: "Invalid credentials" })
  }
}
```

This comprehensive examples guide provides practical, real-world use cases for the Chrome DevTools MCP server, demonstrating how to handle common scenarios like e-commerce testing, form validation, performance monitoring, and more.
