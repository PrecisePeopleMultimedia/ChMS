// Simple authentication test script
const https = require('http');

async function testAuth() {
  console.log('🔍 Testing ChMS Authentication System...\n');

  // Test 1: Health Check
  console.log('1. Testing Backend Health...');
  try {
    const healthResponse = await makeRequest('GET', '/api/health');
    console.log('✅ Backend is healthy:', healthResponse.status);
  } catch (error) {
    console.log('❌ Backend health check failed:', error.message);
    return;
  }

  // Test 2: Create Test User
  console.log('\n2. Creating Test User...');
  try {
    const registerResponse = await makeRequest('POST', '/api/auth/register', {
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      password: 'password123',
      password_confirmation: 'password123'
    });
    console.log('✅ Test user created or already exists');
  } catch (error) {
    console.log('⚠️ User creation failed (might already exist):', error.message);
  }

  // Test 3: Login Test
  console.log('\n3. Testing Login...');
  try {
    const loginResponse = await makeRequest('POST', '/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    if (loginResponse.token) {
      console.log('✅ Login successful! Token received:', loginResponse.token.substring(0, 20) + '...');
      
      // Test 4: Authenticated Request
      console.log('\n4. Testing Authenticated Request...');
      const userResponse = await makeRequest('GET', '/api/user', null, loginResponse.token);
      console.log('✅ Authenticated request successful:', userResponse.email);
      
      // Test 5: Logout
      console.log('\n5. Testing Logout...');
      await makeRequest('POST', '/api/auth/logout', null, loginResponse.token);
      console.log('✅ Logout successful');
      
    } else {
      console.log('❌ Login failed: No token received');
    }
  } catch (error) {
    console.log('❌ Login test failed:', error.message);
  }

  console.log('\n🎯 Authentication Test Complete!');
}

function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${response.message || body}`));
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ status: 'ok', body });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${body}`));
          }
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Run the test
testAuth().catch(console.error);
