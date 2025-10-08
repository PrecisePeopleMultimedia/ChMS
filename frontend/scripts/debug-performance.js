#!/usr/bin/env node

console.log('🚀 Starting Performance Test...');

import fs from 'fs/promises';
import path from 'path';

console.log('📦 Checking bundle sizes...');

try {
  const distPath = path.join(process.cwd(), 'dist');
  const assetsPath = path.join(distPath, 'assets');
  console.log('Dist path:', distPath);
  console.log('Assets path:', assetsPath);
  
  const distExists = await fs.access(distPath).then(() => true).catch(() => false);
  const assetsExists = await fs.access(assetsPath).then(() => true).catch(() => false);
  console.log('Dist exists:', distExists);
  console.log('Assets exists:', assetsExists);
  
  if (!distExists || !assetsExists) {
    console.log('❌ No dist/assets folder found. Run "npm run build" first.');
    process.exit(1);
  }

  const files = await fs.readdir(assetsPath);
  console.log('Files in assets:', files.length);
  
  const jsFiles = files.filter(f => f.endsWith('.js'));
  const cssFiles = files.filter(f => f.endsWith('.css'));
  
  console.log('JS files:', jsFiles.length);
  console.log('CSS files:', cssFiles.length);
  
  let totalJsSize = 0;
  let totalCssSize = 0;
  
  for (const file of jsFiles) {
    const filePath = path.join(assetsPath, file);
    const stats = await fs.stat(filePath);
    const sizeKB = stats.size / 1024;
    totalJsSize += sizeKB;
    console.log(`JS: ${file} - ${sizeKB.toFixed(2)}KB`);
  }
  
  for (const file of cssFiles) {
    const filePath = path.join(assetsPath, file);
    const stats = await fs.stat(filePath);
    const sizeKB = stats.size / 1024;
    totalCssSize += sizeKB;
    console.log(`CSS: ${file} - ${sizeKB.toFixed(2)}KB`);
  }
  
  console.log('\n📊 Performance Results:');
  console.log(`Total JS Size: ${totalJsSize.toFixed(2)}KB`);
  console.log(`Total CSS Size: ${totalCssSize.toFixed(2)}KB`);
  console.log(`Total Bundle Size: ${(totalJsSize + totalCssSize).toFixed(2)}KB`);
  
  // Check against targets
  const TARGET_JS = 500; // 500KB
  const TARGET_CSS = 50;  // 50KB
  const TARGET_TOTAL = 600; // 600KB
  
  const jsPass = totalJsSize <= TARGET_JS;
  const cssPass = totalCssSize <= TARGET_CSS;
  const totalPass = (totalJsSize + totalCssSize) <= TARGET_TOTAL;
  
  console.log('\n🎯 Performance Targets:');
  console.log(`JS Bundle: ${jsPass ? '✅ PASS' : '❌ FAIL'} (${totalJsSize.toFixed(2)}KB / ${TARGET_JS}KB)`);
  console.log(`CSS Bundle: ${cssPass ? '✅ PASS' : '❌ FAIL'} (${totalCssSize.toFixed(2)}KB / ${TARGET_CSS}KB)`);
  console.log(`Total Bundle: ${totalPass ? '✅ PASS' : '❌ FAIL'} (${(totalJsSize + totalCssSize).toFixed(2)}KB / ${TARGET_TOTAL}KB)`);
  
  const overallPass = jsPass && cssPass && totalPass;
  console.log(`\n🏆 Overall Status: ${overallPass ? '✅ EXCELLENT' : '⚠️ NEEDS IMPROVEMENT'}`);
  
  if (!overallPass) {
    console.log('\n🚀 Recommendations:');
    if (!jsPass) {
      console.log('- Consider code splitting to reduce JS bundle size');
      console.log('- Implement lazy loading for non-critical components');
    }
    if (!cssPass) {
      console.log('- Optimize CSS with purging unused styles');
      console.log('- Consider critical CSS inlining');
    }
    if (!totalPass) {
      console.log('- Implement tree shaking to remove unused code');
      console.log('- Consider PWA features for offline functionality');
    }
  }
  
  console.log('\n🎉 Performance test completed!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
