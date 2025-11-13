<template>
  <q-page class="landing-page">
    <!-- Hero Section -->
    <section class="hero-section garnet-night-bg">
      <div class="container">
        <div class="row items-center min-h-screen">
          <div class="col-12 col-md-6 text-center">
            <!-- Logo -->
            <div class="logo-container q-mb-lg">
              <q-img
                src="/logo-churchafrica.svg"
                alt="ChurchAfrica Logo"
                style="height: 120px; width: auto"
                class="q-mx-auto"
              />
            </div>
            
            <!-- Headlines -->
            <h1 class="text-h2 text-white q-mb-md font-weight-bold">
              Church Management Made Simple
            </h1>
            <p class="text-h6 text-grey-3 q-mb-xl">
              Africa's first offline-capable church management system
            </p>
            
            <!-- CTA Buttons -->
            <div class="cta-buttons q-gutter-md">
              <q-btn
                size="lg"
                color="primary"
                label="Get Started Free"
                icon="mdi-rocket-launch"
                to="/auth/register"
                class="q-px-xl q-py-md"
                unelevated
              />
              <q-btn
                size="lg"
                color="white"
                text-color="primary"
                label="Watch Demo"
                icon="mdi-play-circle"
                outline
                class="q-px-xl q-py-md"
                @click="scrollToDemo"
              />
            </div>
          </div>
          
          <!-- Hero Image/Animation -->
          <div class="col-12 col-md-6 text-center">
            <div class="hero-image q-mt-lg">
              <q-img
                src="/hero-church-management.svg"
                alt="Church Management Dashboard"
                style="max-width: 500px; width: 100%"
                class="q-mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section q-py-xl">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center q-mb-xl">
            <h2 class="text-h3 text-primary q-mb-md">
              Built for African Churches
            </h2>
            <p class="text-h6 text-grey-7">
              Everything you need to manage your church, even without internet
            </p>
          </div>
        </div>
        
        <div class="row q-gutter-lg justify-center">
          <!-- Feature 1: Works Offline -->
          <div class="col-12 col-md-3">
            <q-card class="feature-card glass-morphism text-center q-pa-lg">
              <q-icon name="mdi-wifi-off" size="64px" color="primary" class="q-mb-md" />
              <h3 class="text-h5 q-mb-md">Works Offline</h3>
              <p class="text-body1 text-grey-7">
                Full functionality without internet. Sync when connected.
              </p>
            </q-card>
          </div>
          
          <!-- Feature 2: Mobile-First -->
          <div class="col-12 col-md-3">
            <q-card class="feature-card glass-morphism text-center q-pa-lg">
              <q-icon name="mdi-phone" size="64px" color="primary" class="q-mb-md" />
              <h3 class="text-h5 q-mb-md">Mobile-First</h3>
              <p class="text-body1 text-grey-7">
                Optimized for Android devices and touch interfaces.
              </p>
            </q-card>
          </div>
          
          <!-- Feature 3: Simple & Powerful -->
          <div class="col-12 col-md-3">
            <q-card class="feature-card glass-morphism text-center q-pa-lg">
              <q-icon name="mdi-lightning-bolt" size="64px" color="primary" class="q-mb-md" />
              <h3 class="text-h5 q-mb-md">Simple & Powerful</h3>
              <p class="text-body1 text-grey-7">
                Intuitive interface with enterprise-grade features.
              </p>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Section -->
    <section ref="demoSection" class="demo-section q-py-xl bg-grey-1">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center q-mb-xl">
            <h2 class="text-h3 text-primary q-mb-md">
              See ChMS in Action
            </h2>
            <p class="text-h6 text-grey-7">
              Watch how easy it is to manage your church
            </p>
          </div>
        </div>
        
        <div class="row justify-center">
          <div class="col-12 col-md-8">
            <q-card class="demo-card">
              <div class="demo-placeholder q-pa-xl text-center">
                <q-icon name="mdi-play-circle" size="120px" color="primary" />
                <h4 class="text-h4 q-mt-md">Demo Video Coming Soon</h4>
                <p class="text-body1 text-grey-7">
                  See member management, attendance tracking, and offline sync in action
                </p>
              </div>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section garnet-night-bg q-py-xl">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center">
            <h2 class="text-h3 text-white q-mb-md">
              Ready to Transform Your Church Management?
            </h2>
            <p class="text-h6 text-grey-3 q-mb-xl">
              Join churches across Africa using ChMS to grow their communities
            </p>
            
            <q-btn
              size="xl"
              color="white"
              text-color="primary"
              label="Start Your Free Trial"
              icon="mdi-rocket-launch"
              to="/auth/register"
              class="q-px-xl q-py-lg"
              unelevated
            />
          </div>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Template refs
const demoSection = ref<HTMLElement>()

// Methods
const scrollToDemo = () => {
  if (demoSection.value) {
    demoSection.value.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.landing-page {
  overflow-x: hidden;
}

.garnet-night-bg {
  background-color: hsl(330, 40%, 10%);
  background-image: 
    radial-gradient(at 0% 0%, hsl(340, 70%, 35%) 0px, transparent 50%), 
    radial-gradient(at 100% 100%, hsl(290, 50%, 30%) 0px, transparent 50%);
}

.glass-morphism {
  background: rgba(255, 255, 255, 0.1);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}

.feature-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.demo-placeholder {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2rem;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-buttons .q-btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>
