import { FullConfig } from '@playwright/test'
import fs from 'fs'
import path from 'path'

/**
 * Global Teardown for Regression Tests
 * 
 * This runs once after all tests to:
 * - Clean up test data
 * - Generate test reports
 * - Archive test artifacts
 */

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown for regression tests...')

  try {
    // Clean up authentication files
    const authDir = 'test-results/.auth'
    if (fs.existsSync(authDir)) {
      fs.rmSync(authDir, { recursive: true, force: true })
      console.log('✅ Authentication files cleaned up')
    }

    // Archive test results if on CI
    if (process.env.CI) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const archiveDir = `test-results/archive/${timestamp}`
      
      if (!fs.existsSync(archiveDir)) {
        fs.mkdirSync(archiveDir, { recursive: true })
      }

      // Copy important files to archive
      const filesToArchive = [
        'test-results/results.json',
        'test-results/results.xml',
        'playwright-report/index.html'
      ]

      filesToArchive.forEach(file => {
        if (fs.existsSync(file)) {
          const fileName = path.basename(file)
          fs.copyFileSync(file, path.join(archiveDir, fileName))
        }
      })

      console.log(`✅ Test results archived to ${archiveDir}`)
    }

    // Generate summary report
    const summaryPath = 'test-results/regression-summary.txt'
    const summary = `
Regression Test Summary
======================
Timestamp: ${new Date().toISOString()}
Environment: ${process.env.NODE_ENV || 'development'}
CI: ${process.env.CI ? 'Yes' : 'No'}
Base URL: ${process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:1811'}

Test artifacts available in:
- HTML Report: playwright-report/index.html
- JSON Results: test-results/results.json
- JUnit Results: test-results/results.xml
- Screenshots: test-results/ (on failures)
- Videos: test-results/ (on failures)
- Traces: test-results/ (on retries)
`

    fs.writeFileSync(summaryPath, summary)
    console.log('✅ Summary report generated')

  } catch (error) {
    console.error('❌ Global teardown failed:', error)
    // Don't throw error to avoid masking test failures
  }

  console.log('🎉 Global teardown completed')
}

export default globalTeardown
