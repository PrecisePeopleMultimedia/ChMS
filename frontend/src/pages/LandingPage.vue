<template>
  <div class="landing-page dark">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <!-- Logo -->
            <div class="logo-container">
              <q-img
                src="/logo-churchafrica.svg"
                alt="ChurchAfrica Logo"
                class="logo"
              />
            </div>
            
            <!-- Headlines -->
            <h1 class="hero-title">
              Church Management Made Simple
            </h1>
            <p class="hero-subtitle">
              Africa's first offline-capable church management system
            </p>
            
            <!-- CTA Buttons -->
            <div class="cta-buttons">
              <ModernButton
                size="lg"
                variant="default"
                class="cta-primary"
                @click="$router.push('/auth/register')"
              >
                <template #icon>
                  <q-icon name="rocket_launch" />
                </template>
                Get Started Free
              </ModernButton>
              <ModernButton
                size="lg"
                variant="outline"
                class="cta-secondary"
                @click="scrollToDemo"
              >
                <template #icon>
                  <q-icon name="play_circle" />
                </template>
                Watch Demo
              </ModernButton>
            </div>
          </div>
          
          <!-- Hero Image/Animation -->
          <div class="hero-image">
            <q-img
              src="/hero-church-management.svg"
              alt="Church Management Dashboard"
              class="hero-img"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            Built for African Churches
          </h2>
          <p class="section-subtitle">
            Everything you need to manage your church, even without internet
          </p>
        </div>
        
        <div class="features-grid">
          <!-- Feature 1: Works Offline -->
          <ModernCard class="feature-card">
            <ModernCardContent class="feature-content">
              <q-icon name="wifi_off" class="feature-icon" />
              <h3 class="feature-title">Works Offline</h3>
              <p class="feature-description">
                Full functionality without internet. Sync when connected.
              </p>
            </ModernCardContent>
          </ModernCard>
          
          <!-- Feature 2: Mobile-First -->
          <ModernCard class="feature-card">
            <ModernCardContent class="feature-content">
              <q-icon name="phone_android" class="feature-icon" />
              <h3 class="feature-title">Mobile-First</h3>
              <p class="feature-description">
                Optimized for Android devices and touch interfaces.
              </p>
            </ModernCardContent>
          </ModernCard>
          
          <!-- Feature 3: Simple & Powerful -->
          <ModernCard class="feature-card">
            <ModernCardContent class="feature-content">
              <q-icon name="bolt" class="feature-icon" />
              <h3 class="feature-title">Simple & Powerful</h3>
              <p class="feature-description">
                Intuitive interface with enterprise-grade features.
              </p>
            </ModernCardContent>
          </ModernCard>
        </div>
      </div>
    </section>

    <!-- Demo Section -->
    <section ref="demoSection" class="demo-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            See ChMS in Action
          </h2>
          <p class="section-subtitle">
            Watch how easy it is to manage your church
          </p>
        </div>
        
        <div class="demo-container">
          <ModernCard class="demo-card">
            <ModernCardContent class="demo-placeholder">
              <q-icon name="play_circle" class="demo-icon" />
              <h4 class="demo-title">Demo Video Coming Soon</h4>
              <p class="demo-description">
                See member management, attendance tracking, and offline sync in action
              </p>
            </ModernCardContent>
          </ModernCard>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">
            Ready to Transform Your Church Management?
          </h2>
          <p class="cta-subtitle">
            Join churches across Africa using ChMS to grow their communities
          </p>
          
          <ModernButton
            size="lg"
            variant="default"
            class="cta-button"
            @click="$router.push('/auth/register')"
          >
            <template #icon>
              <q-icon name="rocket_launch" />
            </template>
            Start Your Free Trial
          </ModernButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ModernButton from '@/components/ui/ModernButton.vue'
import ModernCard from '@/components/ui/ModernCard.vue'
import ModernCardContent from '@/components/ui/ModernCardContent.vue'

// Template refs
const demoSection = ref<HTMLElement>()

// Methods
const scrollToDemo = () => {
  if (demoSection.value) {
    demoSection.value.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped lang="scss">
.landing-page {
  overflow-x: hidden;
  min-height: 100vh;
  background: var(--background);
  color: var(--foreground);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  
  @media (min-width: 768px) {
    padding: 0 24px;
  }
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background);
  background-image: 
    radial-gradient(at 0% 0%, oklch(0.4365 0.1044 156.7556 / 0.1) 0px, transparent 50%), 
    radial-gradient(at 100% 100%, oklch(0.7137 0.1434 254.6240 / 0.1) 0px, transparent 50%);
  padding: 80px 0;
  
  @media (max-width: 768px) {
    min-height: auto;
    padding: 60px 0;
  }
}

.hero-content {
  display: -ms-grid;
  display: grid;
  -ms-grid-columns: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  
  @media (max-width: 968px) {
    -ms-grid-columns: 1fr;
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
}

.hero-text {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  gap: 24px;
}

.logo-container {
  margin-bottom: 8px;
}

.logo {
  height: 120px;
  width: auto;
  
  @media (max-width: 768px) {
    height: 80px;
  }
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 300;
  line-height: 1.1;
  color: var(--foreground);
  margin: 0;
  
  @media (max-width: 968px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.hero-subtitle {
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--muted-foreground);
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
}

.cta-buttons {
  display: -ms-flexbox;
  display: flex;
  gap: 16px;
  margin-top: 8px;
  
  @media (max-width: 768px) {
    -ms-flex-direction: column;
    flex-direction: column;
    align-items: stretch;
  }
}

.cta-primary {
  background: var(--primary);
  color: var(--primary-foreground);
  
  &:hover {
    opacity: 0.9;
  }
}

.cta-secondary {
  border-color: var(--border);
  color: var(--foreground);
  
  &:hover {
    background: var(--accent);
  }
}

.hero-image {
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-img {
  max-width: 500px;
  width: 100%;
  height: auto;
}

/* Features Section */
.features-section {
  padding: 80px 0;
  background: var(--background);
  
  @media (max-width: 768px) {
    padding: 60px 0;
  }
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 300;
  color: var(--foreground);
  margin: 0 0 16px 0;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.section-subtitle {
  font-size: 1.125rem;
  color: var(--muted-foreground);
  margin: 0;
}

.features-grid {
  display: -ms-grid;
  display: grid;
  -ms-grid-columns: repeat(auto-fit, minmax(280px, 1fr));
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  
  @media (max-width: 768px) {
    -ms-grid-columns: 1fr;
    grid-template-columns: 1fr;
  }
}

.feature-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
  }
}

.feature-content {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px 24px;
  gap: 16px;
}

.feature-icon {
  font-size: 64px;
  color: var(--primary);
  margin-bottom: 8px;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 300;
  color: var(--foreground);
  margin: 0;
}

.feature-description {
  font-size: 1rem;
  color: var(--muted-foreground);
  margin: 0;
  line-height: 1.6;
}

/* Demo Section */
.demo-section {
  padding: 80px 0;
  background: var(--muted);
  
  @media (max-width: 768px) {
    padding: 60px 0;
  }
}

.demo-container {
  max-width: 800px;
  margin: 0 auto;
}

.demo-card {
  overflow: hidden;
}

.demo-placeholder {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 48px 24px;
  gap: 16px;
  text-align: center;
}

.demo-icon {
  font-size: 120px;
  color: var(--primary);
  opacity: 0.7;
}

.demo-title {
  font-size: 1.75rem;
  font-weight: 300;
  color: var(--foreground);
  margin: 0;
}

.demo-description {
  font-size: 1rem;
  color: var(--muted-foreground);
  margin: 0;
}

/* CTA Section */
.cta-section {
  padding: 80px 0;
  background: var(--background);
  background-image: 
    radial-gradient(at 0% 0%, oklch(0.4365 0.1044 156.7556 / 0.1) 0px, transparent 50%), 
    radial-gradient(at 100% 100%, oklch(0.7137 0.1434 254.6240 / 0.1) 0px, transparent 50%);
  
  @media (max-width: 768px) {
    padding: 60px 0;
  }
}

.cta-content {
  text-align: center;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 300;
  color: var(--foreground);
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.cta-subtitle {
  font-size: 1.125rem;
  color: var(--muted-foreground);
  margin: 0;
}

.cta-button {
  background: var(--primary);
  color: var(--primary-foreground);
  margin-top: 8px;
  
  &:hover {
    opacity: 0.9;
  }
}
</style>
