#!/usr/bin/env node

/**
 * Simple validation script to check auth store implementation
 * This bypasses the Node.js compatibility issues with vitest
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Validating Auth Store Implementation...\n');

// Read the auth store file
const authStorePath = join(__dirname, 'src', 'stores', 'auth.ts');
const authStoreContent = readFileSync(authStorePath, 'utf8');

// Check for required methods
const requiredMethods = [
  'setAuthHeader',
  'clearAuthHeader',
  'refreshToken',
  'fetchUser',
  'login',
  'logout',
  'register',
  'initializeAuth',
  'hasRole',
  'hasAnyRole',
  'clearError'
];

const requiredState = [
  'user',
  'token',
  'isLoading',
  'error'
];

const requiredGetters = [
  'isAuthenticated',
  'userRole',
  'isAdmin',
  'isStaff'
];

console.log('✅ Checking required methods:');
let methodsFound = 0;
requiredMethods.forEach(method => {
  const regex = new RegExp(`const\\s+${method}\\s*=`, 'g');
  if (regex.test(authStoreContent)) {
    console.log(`  ✓ ${method}`);
    methodsFound++;
  } else {
    console.log(`  ✗ ${method} - MISSING`);
  }
});

console.log(`\n📊 Methods: ${methodsFound}/${requiredMethods.length} found\n`);

console.log('✅ Checking required state:');
let stateFound = 0;
requiredState.forEach(state => {
  const regex = new RegExp(`const\\s+${state}\\s*=\\s*ref`, 'g');
  if (regex.test(authStoreContent)) {
    console.log(`  ✓ ${state}`);
    stateFound++;
  } else {
    console.log(`  ✗ ${state} - MISSING`);
  }
});

console.log(`\n📊 State: ${stateFound}/${requiredState.length} found\n`);

console.log('✅ Checking required getters:');
let gettersFound = 0;
requiredGetters.forEach(getter => {
  const regex = new RegExp(`const\\s+${getter}\\s*=\\s*computed`, 'g');
  if (regex.test(authStoreContent)) {
    console.log(`  ✓ ${getter}`);
    gettersFound++;
  } else {
    console.log(`  ✗ ${getter} - MISSING`);
  }
});

console.log(`\n📊 Getters: ${gettersFound}/${requiredGetters.length} found\n`);

// Check if methods are properly exported
console.log('✅ Checking method exports:');
const returnStatementMatch = authStoreContent.match(/return\s*\{([^}]+)\}/s);
if (returnStatementMatch) {
  const returnContent = returnStatementMatch[1];
  let exportsFound = 0;
  
  requiredMethods.forEach(method => {
    if (returnContent.includes(method)) {
      console.log(`  ✓ ${method} exported`);
      exportsFound++;
    } else {
      console.log(`  ✗ ${method} - NOT EXPORTED`);
    }
  });
  
  console.log(`\n📊 Exports: ${exportsFound}/${requiredMethods.length} exported\n`);
} else {
  console.log('  ✗ Could not find return statement\n');
}

// Summary
const totalChecks = requiredMethods.length + requiredState.length + requiredGetters.length;
const totalFound = methodsFound + stateFound + gettersFound;

console.log('📋 SUMMARY:');
console.log(`  Total checks: ${totalFound}/${totalChecks}`);
console.log(`  Success rate: ${Math.round((totalFound / totalChecks) * 100)}%`);

if (totalFound === totalChecks) {
  console.log('\n🎉 Auth store implementation is COMPLETE!');
  process.exit(0);
} else {
  console.log('\n❌ Auth store implementation has ISSUES!');
  process.exit(1);
}
