#!/usr/bin/env node

/**
 * Frontend-Backend Connectivity Test
 * 
 * This script tests the connectivity between the frontend and backend
 * by simulating API calls that the frontend would make.
 */

const http = require('http');

// Test configuration
const BACKEND_URL = 'http://127.0.0.1:8000';
const FRONTEND_URL = 'http://127.0.0.1:1811';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    };

    const req = http.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function testFrontendServer() {
  log('\n📡 Testing Frontend Server...', 'cyan');
  try {
    const response = await makeRequest(FRONTEND_URL);
    const hasVite = response.body.toLowerCase().includes('vite') || response.body.includes('@vite');
    const hasApp = response.body.includes('id="app"');

    // Debug output
    if (response.statusCode !== 200) {
      log(`   Debug: Response body length: ${response.body.length}`, 'yellow');
      log(`   Debug: First 200 chars: ${response.body.substring(0, 200)}`, 'yellow');
    }

    if (response.statusCode === 200 && hasVite && hasApp) {
      log('✅ Frontend server is running on port 1811', 'green');
      log('   Vite dev server detected', 'green');
      log('   Vue app container found', 'green');
      return true;
    } else {
      log('❌ Frontend server responded but may not be configured correctly', 'red');
      log(`   Status: ${response.statusCode}, Vite: ${hasVite}, App: ${hasApp}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Frontend server is not accessible: ${error.message}`, 'red');
    return false;
  }
}

async function testBackendHealth() {
  log('\n🏥 Testing Backend Health Endpoint...', 'cyan');
  try {
    const response = await makeRequest(`${BACKEND_URL}/api/health`);
    if (response.statusCode === 200) {
      const data = JSON.parse(response.body);
      log('✅ Backend health check passed', 'green');
      log(`   Status: ${data.status}`, 'green');
      log(`   Service: ${data.service}`, 'green');
      log(`   Database: ${data.database}`, 'green');
      return true;
    } else {
      log(`❌ Backend health check failed with status ${response.statusCode}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Backend health check failed: ${error.message}`, 'red');
    return false;
  }
}

async function testBackendCORS() {
  log('\n🌐 Testing Backend CORS Configuration...', 'cyan');
  try {
    const response = await makeRequest(`${BACKEND_URL}/api/health`, {
      headers: {
        'Origin': FRONTEND_URL,
      },
    });
    
    const corsHeaders = {
      'access-control-allow-origin': response.headers['access-control-allow-origin'],
      'access-control-allow-methods': response.headers['access-control-allow-methods'],
      'access-control-allow-credentials': response.headers['access-control-allow-credentials'],
    };

    if (corsHeaders['access-control-allow-origin']) {
      log('✅ CORS is configured', 'green');
      log(`   Allow-Origin: ${corsHeaders['access-control-allow-origin']}`, 'green');
      if (corsHeaders['access-control-allow-methods']) {
        log(`   Allow-Methods: ${corsHeaders['access-control-allow-methods']}`, 'green');
      }
      return true;
    } else {
      log('⚠️  CORS headers not found (may need to check Laravel CORS config)', 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ CORS test failed: ${error.message}`, 'red');
    return false;
  }
}

async function testBackendLogin() {
  log('\n🔐 Testing Backend Login Endpoint...', 'cyan');
  try {
    const response = await makeRequest(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'wrongpassword',
      },
    });

    if (response.statusCode === 401 || response.statusCode === 422) {
      const data = JSON.parse(response.body);
      log('✅ Login endpoint is responding correctly', 'green');
      log(`   Status: ${response.statusCode}`, 'green');
      log(`   Message: ${data.message || 'Invalid credentials'}`, 'green');
      return true;
    } else {
      log(`⚠️  Login endpoint returned unexpected status: ${response.statusCode}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ Login endpoint test failed: ${error.message}`, 'red');
    return false;
  }
}

async function runTests() {
  log('═══════════════════════════════════════════════════════', 'blue');
  log('  Frontend-Backend Connectivity Test Suite', 'blue');
  log('═══════════════════════════════════════════════════════', 'blue');

  const results = {
    frontend: await testFrontendServer(),
    backendHealth: await testBackendHealth(),
    cors: await testBackendCORS(),
    login: await testBackendLogin(),
  };

  log('\n═══════════════════════════════════════════════════════', 'blue');
  log('  Test Results Summary', 'blue');
  log('═══════════════════════════════════════════════════════', 'blue');

  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;

  log(`\n✅ Passed: ${passed}/${total}`, passed === total ? 'green' : 'yellow');
  log(`Frontend Server:     ${results.frontend ? '✅' : '❌'}`, results.frontend ? 'green' : 'red');
  log(`Backend Health:      ${results.backendHealth ? '✅' : '❌'}`, results.backendHealth ? 'green' : 'red');
  log(`CORS Configuration:  ${results.cors ? '✅' : '⚠️ '}`, results.cors ? 'green' : 'yellow');
  log(`Login Endpoint:      ${results.login ? '✅' : '❌'}`, results.login ? 'green' : 'red');

  if (passed === total) {
    log('\n🎉 All tests passed! Frontend and backend are properly connected.', 'green');
    process.exit(0);
  } else {
    log('\n⚠️  Some tests failed. Please review the results above.', 'yellow');
    process.exit(1);
  }
}

// Run the tests
runTests().catch((error) => {
  log(`\n❌ Test suite failed: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

