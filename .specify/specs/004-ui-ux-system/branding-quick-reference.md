# ChurchAfrica ChMS - Branding Quick Reference

## 🎨 **Brand Identity**
- **Name**: ChurchAfrica ChMS
- **Tagline**: "Africa-First Church Management Made Simple"
- **Voice**: Warm, Professional, Empowering, Respectful, Supportive

## 🎯 **Color Palette**

### Primary Colors
```css
--garnet-night: #2D1B69;    /* Primary brand color */
--golden-dawn: #FFB800;     /* Accent color */
--pure-white: #FFFFFF;      /* Light backgrounds */
```

### Secondary Colors
```css
--deep-charcoal: #1A1A1A;   /* Dark text */
--soft-gray: #F5F5F5;       /* Light gray */
--success-green: #10B981;   /* Success states */
--warning-amber: #F59E0B;   /* Warning states */
--error-red: #EF4444;       /* Error states */
```

## 📝 **Typography**

### Font Stack
```css
/* UI Text */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Headings */
font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;

/* Code */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

### Hierarchy
- **H1**: Poppins SemiBold 32px
- **H2**: Poppins Medium 24px
- **H3**: Poppins Medium 20px
- **Body**: Inter Regular 16px
- **Small**: Inter Regular 14px

## 📱 **PWA Assets**

### Required Icon Sizes
- **192x192px** - Standard PWA icon
- **512x512px** - High-resolution PWA icon
- **180x180px** - iOS Safari icon
- **32x32px** - Favicon
- **16x16px** - Small favicon

### Web App Manifest
```json
{
  "name": "ChurchAfrica ChMS",
  "short_name": "ChurchAfrica",
  "theme_color": "#2D1B69",
  "background_color": "#1A0F3A",
  "display": "standalone"
}
```

## 🎨 **Component Styles**

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: #2D1B69;
  color: white;
  border-radius: 8px;
  padding: 12px 24px;
}

/* Accent Button */
.btn-accent {
  background: #FFB800;
  color: white;
  border-radius: 8px;
  padding: 12px 24px;
}

/* Secondary Button */
.btn-secondary {
  background: white;
  color: #2D1B69;
  border: 1px solid #2D1B69;
  border-radius: 8px;
  padding: 12px 24px;
}
```

### Cards
```css
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(45, 27, 105, 0.1);
  border: 1px solid #E5E7EB;
  padding: 24px;
}

.card-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

## 🚀 **PWA Install Prompt**

### HTML Structure
```html
<div class="install-prompt">
  <div class="prompt-header">
    <img src="/icons/icon-64x64.png" alt="ChurchAfrica" class="app-icon">
    <div class="app-info">
      <h3>ChurchAfrica ChMS</h3>
      <p>Africa-First Church Management</p>
    </div>
  </div>
  <div class="prompt-actions">
    <button class="install-btn">Install App</button>
    <button class="dismiss-btn">Not Now</button>
  </div>
</div>
```

### JavaScript Implementation
```javascript
// PWA Install Prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallPrompt();
});

function showInstallPrompt() {
  // Show custom install UI
  document.querySelector('.install-prompt').style.display = 'block';
}

function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      deferredPrompt = null;
    });
  }
}
```

## 🎭 **Splash Screen**

### CSS Animation
```css
.splash-screen {
  background: linear-gradient(135deg, #2D1B69 0%, #1A0F3A 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.splash-logo {
  width: 120px;
  height: 120px;
  animation: fadeInScale 0.8s ease-out;
}

.splash-title {
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  font-weight: 600;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## ✅ **Brand Compliance Checklist**

### Logo Usage
- [ ] Using official logo files only
- [ ] Maintaining minimum clear space
- [ ] Appropriate version for context
- [ ] Sufficient contrast with background
- [ ] Proportional scaling

### Color Usage
- [ ] Colors match specifications exactly
- [ ] Minimum 4.5:1 contrast ratio for text
- [ ] Consistent color application
- [ ] Accessibility requirements met

### Typography
- [ ] Correct font families used
- [ ] Proper hierarchy maintained
- [ ] Appropriate line heights
- [ ] Consistent letter spacing

### PWA Assets
- [ ] All required icon sizes created
- [ ] Proper manifest configuration
- [ ] Branded splash screen implemented
- [ ] Custom install prompt styled
- [ ] App icons display correctly

## 🔗 **Resources**

- **Full Guidelines**: [branding-guidelines.md](branding-guidelines.md)
- **Color Palette**: CSS custom properties in guidelines
- **Icon Assets**: `/icons/` directory
- **Font Files**: `/fonts/` directory
- **Templates**: `/templates/` directory

## 📞 **Brand Support**

For questions about brand implementation or asset creation:
1. Review full branding guidelines document
2. Check existing implementations for reference
3. Test on multiple devices and screen sizes
4. Validate accessibility compliance
5. Document any new patterns or components

---

**Remember**: Consistent branding builds trust and recognition. Every touchpoint should reflect our Africa-first, professional, and welcoming brand personality.
