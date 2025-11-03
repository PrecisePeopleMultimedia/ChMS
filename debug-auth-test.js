// Debug authentication test script
const { chromium } = require('./frontend/node_modules/playwright');

async function debugAuthTest() {
  console.log('🔍 Debugging ChMS Authentication E2E Test...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Step 0: Test API connectivity from browser
    console.log('0. Testing API connectivity from browser...');
    await page.goto('http://localhost:1811');
    const apiTest = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:8000/api/health');
        return {
          status: response.status,
          ok: response.ok,
          text: await response.text()
        };
      } catch (error) {
        return { error: error.message };
      }
    });
    console.log('API connectivity test:', apiTest);

    // Step 1: Navigate to login page
    console.log('\n1. Navigating to login page...');
    await page.goto('http://localhost:1811/auth/login');
    await page.waitForLoadState('networkidle');
    console.log('✅ Login page loaded');

    // Step 2: Check if form elements are present
    console.log('\n2. Checking form elements...');
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const signInButton = page.locator('button:has-text("Sign In")');

    await emailInput.waitFor({ state: 'visible' });
    await passwordInput.waitFor({ state: 'visible' });
    await signInButton.waitFor({ state: 'visible' });
    console.log('✅ All form elements are visible');

    // Step 3: Fill in credentials
    console.log('\n3. Filling in credentials...');
    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');
    console.log('✅ Credentials filled');

    // Step 4: Check if button is enabled
    console.log('\n4. Checking button state...');
    const isButtonEnabled = await signInButton.isEnabled();
    console.log(`Button enabled: ${isButtonEnabled}`);

    if (!isButtonEnabled) {
      console.log('❌ Button is disabled, checking form validation...');
      
      // Check form validation
      const emailValue = await emailInput.inputValue();
      const passwordValue = await passwordInput.inputValue();
      console.log(`Email value: "${emailValue}"`);
      console.log(`Password value: "${passwordValue}"`);
      
      // Check for validation errors
      const emailError = await page.locator('[id*="email"][role="alert"]').textContent().catch(() => null);
      const passwordError = await page.locator('[id*="password"][role="alert"]').textContent().catch(() => null);
      console.log(`Email error: ${emailError}`);
      console.log(`Password error: ${passwordError}`);
    }

    // Step 5: Attempt login
    console.log('\n5. Attempting login...');
    
    // Listen for network requests
    page.on('request', request => {
      if (request.url().includes('/api/auth/login')) {
        console.log(`🌐 Login API request: ${request.method()} ${request.url()}`);
        console.log(`Request body: ${request.postData()}`);
      }
    });

    page.on('response', async response => {
      if (response.url().includes('/api/auth/login')) {
        console.log(`📡 Login API response: ${response.status()} ${response.statusText()}`);
        try {
          const responseBody = await response.text();
          console.log(`Response body: ${responseBody}`);
        } catch (e) {
          console.log('Could not read response body');
        }
      }
    });

    // Click the sign in button
    await signInButton.click();
    
    // Wait for navigation or error
    console.log('\n6. Waiting for response...');
    await page.waitForTimeout(3000);

    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);

    if (currentUrl.includes('/dashboard')) {
      console.log('✅ Successfully redirected to dashboard!');
    } else if (currentUrl.includes('/setup')) {
      console.log('⚠️ Redirected to organization setup');
    } else if (currentUrl.includes('/auth/login')) {
      console.log('❌ Still on login page - login failed');
      
      // Check for error messages
      const errorMessages = await page.locator('[role="alert"], .q-notification').allTextContents();
      console.log('Error messages:', errorMessages);
    }

    // Step 7: Check console errors
    console.log('\n7. Checking console errors...');
    const logs = [];
    page.on('console', msg => {
      logs.push(`${msg.type()}: ${msg.text()}`);
      if (msg.type() === 'error') {
        console.log(`🔴 Console Error: ${msg.text()}`);
      }
    });

    // Listen for page errors
    page.on('pageerror', error => {
      console.log(`🔴 Page Error: ${error.message}`);
    });

    // Listen for request failures
    page.on('requestfailed', request => {
      console.log(`🔴 Request Failed: ${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
    });

    await page.waitForTimeout(2000);
    if (logs.length > 0) {
      console.log('All console messages:');
      logs.forEach(log => console.log(`  ${log}`));
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the debug test
debugAuthTest().catch(console.error);
