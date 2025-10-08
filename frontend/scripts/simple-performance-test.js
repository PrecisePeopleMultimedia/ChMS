#!/usr/bin/env node

/**
 * Simple Performance Test for ChMS Frontend
 * Tests bundle sizes and basic performance metrics
 */

import fs from 'fs/promises';
import path from 'path';

// Performance targets for Africa-first development
const TARGETS = {
  // Bundle size targets (KB)
  INITIAL_JS_BUNDLE: 200,
  TOTAL_JS_BUNDLE: 500,
  CSS_BUNDLE: 50,
  TOTAL_BUNDLE_SIZE: 600,
  
  // Load time targets (seconds)
  FIRST_CONTENTFUL_PAINT: 1.5,
  LARGEST_CONTENTFUL_PAINT: 2.5,
  TIME_TO_INTERACTIVE: 3.0,
  TOTAL_LOAD_TIME: 4.0,
};

class SimplePerformanceTest {
  constructor() {
    this.results = {
      bundleSizes: {},
      buildMetrics: {},
      recommendations: []
    };
  }

  async runTests() {
    console.log('🚀 Running Simple Performance Tests for ChMS...\n');
    
    // Test 1: Bundle Size Analysis
    await this.analyzeBundleSizes();
    
    // Test 2: Build Performance
    await this.analyzeBuildPerformance();
    
    // Test 3: Generate Recommendations
    this.generateRecommendations();
    
    // Test 4: Generate Report
    await this.generateReport();
  }

  async analyzeBundleSizes() {
    console.log('📦 Analyzing Bundle Sizes...');
    
    try {
      const distPath = path.join(process.cwd(), 'dist');
      const distExists = await fs.access(distPath).then(() => true).catch(() => false);
      
      if (!distExists) {
        console.log('   ⚠️  No dist folder found. Run "npm run build" first.');
        this.results.bundleSizes = { error: 'No dist folder found' };
        return;
      }

      const files = await fs.readdir(distPath);
      const jsFiles = files.filter(f => f.endsWith('.js'));
      const cssFiles = files.filter(f => f.endsWith('.css'));
      
      let totalJsSize = 0;
      let totalCssSize = 0;
      let initialJsSize = 0;
      
      for (const file of jsFiles) {
        const filePath = path.join(distPath, file);
        const stats = await fs.stat(filePath);
        const sizeKB = stats.size / 1024;
        totalJsSize += sizeKB;
        
        // Assume the largest JS file is the initial bundle
        if (sizeKB > initialJsSize) {
          initialJsSize = sizeKB;
        }
      }
      
      for (const file of cssFiles) {
        const filePath = path.join(distPath, file);
        const stats = await fs.stat(filePath);
        const sizeKB = stats.size / 1024;
        totalCssSize += sizeKB;
      }
      
      this.results.bundleSizes = {
        initialJsSize: Math.round(initialJsSize),
        totalJsSize: Math.round(totalJsSize),
        totalCssSize: Math.round(totalCssSize),
        totalBundleSize: Math.round(totalJsSize + totalCssSize),
        jsFileCount: jsFiles.length,
        cssFileCount: cssFiles.length
      };
      
      console.log(`   📊 Initial JS Bundle: ${this.results.bundleSizes.initialJsSize}KB`);
      console.log(`   📊 Total JS Bundle: ${this.results.bundleSizes.totalJsSize}KB`);
      console.log(`   📊 CSS Bundle: ${this.results.bundleSizes.totalCssSize}KB`);
      console.log(`   📊 Total Bundle: ${this.results.bundleSizes.totalBundleSize}KB`);
      
      // Check against targets
      const initialPass = this.results.bundleSizes.initialJsSize <= TARGETS.INITIAL_JS_BUNDLE;
      const totalPass = this.results.bundleSizes.totalBundleSize <= TARGETS.TOTAL_BUNDLE_SIZE;
      
      console.log(`   ${initialPass ? '✅' : '❌'} Initial JS Bundle: ${initialPass ? 'PASS' : 'FAIL'} (target: ≤${TARGETS.INITIAL_JS_BUNDLE}KB)`);
      console.log(`   ${totalPass ? '✅' : '❌'} Total Bundle: ${totalPass ? 'PASS' : 'FAIL'} (target: ≤${TARGETS.TOTAL_BUNDLE_SIZE}KB)`);
      
    } catch (error) {
      console.error(`   ❌ Error analyzing bundle sizes: ${error.message}`);
      this.results.bundleSizes = { error: error.message };
    }
  }

  async analyzeBuildPerformance() {
    console.log('\n⚡ Analyzing Build Performance...');
    
    try {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
      
      // Check for performance-related dependencies
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      const performanceFeatures = {
        hasVite: !!dependencies.vite,
        hasVue: !!dependencies.vue,
        hasQuasar: !!dependencies.quasar,
        hasPlaywright: !!dependencies['@playwright/test'],
        hasVitest: !!dependencies.vitest,
        hasTypeScript: !!dependencies.typescript,
        hasTailwind: !!dependencies.tailwindcss
      };
      
      this.results.buildMetrics = {
        ...performanceFeatures,
        totalDependencies: Object.keys(dependencies).length,
        hasPerformanceTools: performanceFeatures.hasVite && performanceFeatures.hasPlaywright
      };
      
      console.log(`   📊 Build Tool: ${performanceFeatures.hasVite ? '✅ Vite' : '❌ Not Vite'}`);
      console.log(`   📊 Framework: ${performanceFeatures.hasVue ? '✅ Vue 3' : '❌ Not Vue'}`);
      console.log(`   📊 UI Library: ${performanceFeatures.hasQuasar ? '✅ Quasar' : '❌ Not Quasar'}`);
      console.log(`   📊 Testing: ${performanceFeatures.hasPlaywright ? '✅ Playwright' : '❌ No Playwright'}`);
      console.log(`   📊 Type Safety: ${performanceFeatures.hasTypeScript ? '✅ TypeScript' : '❌ No TypeScript'}`);
      console.log(`   📊 Styling: ${performanceFeatures.hasTailwind ? '✅ Tailwind CSS' : '❌ No Tailwind'}`);
      
    } catch (error) {
      console.error(`   ❌ Error analyzing build performance: ${error.message}`);
      this.results.buildMetrics = { error: error.message };
    }
  }

  generateRecommendations() {
    console.log('\n🚀 Generating Performance Recommendations...');
    
    const recommendations = [];
    
    // Bundle size recommendations
    if (this.results.bundleSizes.initialJsSize > TARGETS.INITIAL_JS_BUNDLE) {
      recommendations.push('📦 Consider code splitting to reduce initial bundle size');
      recommendations.push('🔄 Implement lazy loading for non-critical components');
    }
    
    if (this.results.bundleSizes.totalBundleSize > TARGETS.TOTAL_BUNDLE_SIZE) {
      recommendations.push('🗜️ Optimize bundle size with tree shaking and minification');
      recommendations.push('📱 Consider PWA features for offline functionality');
    }
    
    // Build tool recommendations
    if (!this.results.buildMetrics.hasVite) {
      recommendations.push('⚡ Consider migrating to Vite for faster builds');
    }
    
    if (!this.results.buildMetrics.hasPlaywright) {
      recommendations.push('🧪 Add Playwright for comprehensive testing');
    }
    
    // Africa-first recommendations
    recommendations.push('🌍 Implement service worker for offline functionality');
    recommendations.push('📱 Optimize for mobile-first design (375px viewport)');
    recommendations.push('🌐 Add network-aware loading strategies');
    recommendations.push('⚡ Implement critical CSS inlining');
    
    this.results.recommendations = recommendations;
    
    console.log(`   📋 Generated ${recommendations.length} recommendations`);
    recommendations.forEach(rec => console.log(`      ${rec}`));
  }

  async generateReport() {
    console.log('\n📄 Generating Performance Report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      targets: TARGETS,
      results: this.results,
      summary: this.generateSummary()
    };
    
    // Save JSON report
    const jsonPath = path.join(process.cwd(), 'performance-report.json');
    await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
    
    // Generate markdown report
    const markdownReport = this.generateMarkdownReport(report);
    const markdownPath = path.join(process.cwd(), 'PERFORMANCE_REPORT.md');
    await fs.writeFile(markdownPath, markdownReport);
    
    console.log(`   📄 JSON Report: ${jsonPath}`);
    console.log(`   📄 Markdown Report: ${markdownPath}`);
    
    // Display summary
    console.log('\n📊 Performance Summary:');
    console.log(`   Total Dependencies: ${this.results.buildMetrics.totalDependencies || 'N/A'}`);
    console.log(`   Bundle Size: ${this.results.bundleSizes.totalBundleSize || 'N/A'}KB`);
    console.log(`   Recommendations: ${this.results.recommendations.length}`);
    console.log(`   Status: ${this.getOverallStatus()}`);
  }

  generateSummary() {
    const bundlePass = this.results.bundleSizes.totalBundleSize <= TARGETS.TOTAL_BUNDLE_SIZE;
    const initialPass = this.results.bundleSizes.initialJsSize <= TARGETS.INITIAL_JS_BUNDLE;
    
    return {
      bundleSizePass: bundlePass,
      initialBundlePass: initialPass,
      overallPass: bundlePass && initialPass,
      recommendationsCount: this.results.recommendations.length
    };
  }

  getOverallStatus() {
    const summary = this.generateSummary();
    if (summary.overallPass) {
      return '✅ EXCELLENT - All targets met';
    } else if (summary.bundleSizePass || summary.initialBundlePass) {
      return '⚠️ GOOD - Some targets met, room for improvement';
    } else {
      return '❌ NEEDS IMPROVEMENT - Targets not met';
    }
  }

  generateMarkdownReport(report) {
    return `# ChMS Performance Report

## 📊 Executive Summary

- **Test Date**: ${new Date(report.timestamp).toLocaleDateString()}
- **Overall Status**: ${this.getOverallStatus()}
- **Bundle Size**: ${report.results.bundleSizes.totalBundleSize || 'N/A'}KB
- **Recommendations**: ${report.results.recommendations.length}

## 🎯 Performance Targets

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Initial JS Bundle | ≤ ${TARGETS.INITIAL_JS_BUNDLE}KB | ${report.results.bundleSizes.initialJsSize || 'N/A'}KB | ${report.summary.initialBundlePass ? '✅' : '❌'} |
| Total Bundle Size | ≤ ${TARGETS.TOTAL_BUNDLE_SIZE}KB | ${report.results.bundleSizes.totalBundleSize || 'N/A'}KB | ${report.summary.bundleSizePass ? '✅' : '❌'} |

## 📦 Bundle Analysis

- **Initial JS Bundle**: ${report.results.bundleSizes.initialJsSize || 'N/A'}KB
- **Total JS Bundle**: ${report.results.bundleSizes.totalJsSize || 'N/A'}KB
- **CSS Bundle**: ${report.results.bundleSizes.totalCssSize || 'N/A'}KB
- **Total Bundle**: ${report.results.bundleSizes.totalBundleSize || 'N/A'}KB
- **JS Files**: ${report.results.bundleSizes.jsFileCount || 'N/A'}
- **CSS Files**: ${report.results.bundleSizes.cssFileCount || 'N/A'}

## 🛠️ Build Tools

- **Build Tool**: ${report.results.buildMetrics.hasVite ? '✅ Vite' : '❌ Not Vite'}
- **Framework**: ${report.results.buildMetrics.hasVue ? '✅ Vue 3' : '❌ Not Vue'}
- **UI Library**: ${report.results.buildMetrics.hasQuasar ? '✅ Quasar' : '❌ Not Quasar'}
- **Testing**: ${report.results.buildMetrics.hasPlaywright ? '✅ Playwright' : '❌ No Playwright'}
- **Type Safety**: ${report.results.buildMetrics.hasTypeScript ? '✅ TypeScript' : '❌ No TypeScript'}
- **Styling**: ${report.results.buildMetrics.hasTailwind ? '✅ Tailwind CSS' : '❌ No Tailwind'}

## 🚀 Recommendations

${report.results.recommendations.map(rec => `- ${rec}`).join('\n')}

## 📈 Next Steps

1. **Optimize bundle sizes** if targets are not met
2. **Implement code splitting** for better performance
3. **Add PWA features** for offline functionality
4. **Monitor performance** in production

---
*Generated by ChMS Performance Testing Tool*
`;
  }
}

// Main execution
async function main() {
  const test = new SimplePerformanceTest();
  
  try {
    await test.runTests();
    console.log('\n🎉 Performance testing completed successfully!');
  } catch (error) {
    console.error('❌ Performance testing failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { SimplePerformanceTest, TARGETS };
