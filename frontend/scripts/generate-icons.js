#!/usr/bin/env node

/**
 * Generate placeholder PWA icons
 * In production, replace with actual icon files
 */

import fs from 'fs'
import path from 'path'

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
const iconsDir = path.join(process.cwd(), 'public', 'icons')

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

// Create simple SVG icon template
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#1976d2"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.3}" 
        fill="white" text-anchor="middle" dominant-baseline="middle">ChMS</text>
</svg>
`.trim()

// Generate placeholder icons
sizes.forEach(size => {
  const svgContent = createSVGIcon(size)
  const filename = `icon-${size}x${size}.svg`
  const filepath = path.join(iconsDir, filename)
  
  fs.writeFileSync(filepath, svgContent)
  console.log(`Generated ${filename}`)
})

// Also create PNG versions (placeholder - in production use actual PNG files)
sizes.forEach(size => {
  const filename = `icon-${size}x${size}.png`
  const filepath = path.join(iconsDir, filename)
  
  // Create a simple placeholder file (in production, use actual PNG conversion)
  const placeholderContent = `# Placeholder for ${filename}\n# Replace with actual PNG icon`
  fs.writeFileSync(filepath, placeholderContent)
  console.log(`Created placeholder ${filename}`)
})

console.log('\n✅ PWA icons generated successfully!')
console.log('📝 Note: Replace placeholder PNG files with actual icons in production')
