#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Starting ChMS Test Suite...\n');

// Function to run tests with proper error handling
function runTests() {
  return new Promise((resolve, reject) => {
    console.log('📋 Running Vitest tests...');
    
    const vitest = spawn('npx', ['vitest', 'run', '--reporter=verbose'], {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: true
    });

    vitest.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ All tests passed!');
        resolve();
      } else {
        console.log(`\n❌ Tests failed with exit code ${code}`);
        reject(new Error(`Tests failed with exit code ${code}`));
      }
    });

    vitest.on('error', (error) => {
      console.error('❌ Error running tests:', error.message);
      reject(error);
    });
  });
}

// Function to run specific test file
function runSpecificTest(testFile) {
  return new Promise((resolve, reject) => {
    console.log(`📋 Running specific test: ${testFile}`);
    
    const vitest = spawn('npx', ['vitest', 'run', testFile, '--reporter=verbose'], {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: true
    });

    vitest.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ Test ${testFile} passed!`);
        resolve();
      } else {
        console.log(`\n❌ Test ${testFile} failed with exit code ${code}`);
        reject(new Error(`Test failed with exit code ${code}`));
      }
    });

    vitest.on('error', (error) => {
      console.error('❌ Error running test:', error.message);
      reject(error);
    });
  });
}

// Main execution
async function main() {
  try {
    const args = process.argv.slice(2);
    
    if (args.length > 0) {
      // Run specific test file
      await runSpecificTest(args[0]);
    } else {
      // Run all tests
      await runTests();
    }
    
    console.log('\n🎉 Test execution completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Test execution failed:', error.message);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n⏹️  Test execution interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⏹️  Test execution terminated');
  process.exit(0);
});

// Run the main function
main();
