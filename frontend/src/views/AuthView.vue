<template>
  <q-page class="auth-page">
    <div class="auth-container">
      <!-- Main Authentication Card -->
      <div class="auth-card">
        <!-- Church Logo and Info -->
        <div class="auth-header">
          <div class="church-logo">
            <div class="logo-circle">
              <q-icon name="church" size="32px" color="white" />
            </div>
          </div>
          <div class="church-info">
            <div class="church-name">{{ organizationStore.organization?.name || 'ChurchAfrica' }}</div>
            <div class="church-subtitle">ChMS</div>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="auth-tabs">
          <q-tabs
            v-model="activeTab"
            dense
            indicator-color="transparent"
            active-color="transparent"
            class="auth-tab-list"
          >
            <q-tab
              name="login"
              label="Sign In"
              class="auth-tab"
              :class="{ 'auth-tab--active': activeTab === 'login' }"
            />
            <q-tab
              name="register"
              label="Sign Up"
              class="auth-tab"
              :class="{ 'auth-tab--active': activeTab === 'register' }"
            />
          </q-tabs>
        </div>

        <q-separator class="auth-separator" />

        <!-- Tab Content -->
        <q-tab-panels v-model="activeTab" animated class="auth-panels">
          <!-- Login Panel -->
          <q-tab-panel name="login" class="auth-panel">
            <LoginForm @success="handleAuthSuccess" />
          </q-tab-panel>

          <!-- Register Panel -->
          <q-tab-panel name="register" class="auth-panel">
            <RegisterForm @success="handleAuthSuccess" @switchToLogin="activeTab = 'login'" />
          </q-tab-panel>
        </q-tab-panels>
      </div>

      <!-- Footer -->
      <div class="auth-footer">
        <div class="footer-text">ChurchAfrica ChMS</div>
        <div class="footer-subtitle">Africa-First Church Management System</div>
      </div>

      <!-- Demo Mode Toggle -->
      <div class="demo-toggle">
        <label class="demo-label">
          <input
            type="checkbox"
            v-model="demoMode"
            class="demo-checkbox"
          />
          <span class="demo-text">Demo Mode</span>
        </label>
        <div class="demo-info">
          Use demo credentials to explore the system
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useOrganizationStore } from '@/stores/organization';
import { useAuthStore } from '@/stores/auth';
import LoginForm from '@/components/auth/LoginForm.vue';
import RegisterForm from '@/components/auth/RegisterForm.vue';

const router = useRouter();
const $q = useQuasar();
const organizationStore = useOrganizationStore();
const authStore = useAuthStore();
const route = useRoute();
const activeTab = ref('login');
const demoMode = ref(false);

// Demo credentials
const demoCredentials = {
  email: 'demo@chms.africa',
  password: 'demo123456',
  name: 'Demo User'
};

// Watch for demo mode changes
watch(demoMode, (newValue) => {
  if (newValue) {
    $q.notify({
      type: 'info',
      message: 'Demo mode enabled. Use demo@chms.africa / demo123456',
      position: 'top',
      timeout: 3000
    });

    // Pre-fill demo credentials
    if (activeTab.value === 'login') {
      authStore.setDemoCredentials(demoCredentials)
    }
  } else {
    // Clear demo credentials
    authStore.setDemoCredentials(null)
  }
});

const handleAuthSuccess = () => {
  const redirectPath = route.query.redirect as string;
  router.push(redirectPath || '/dashboard');
};

// Set initial tab based on route or URL params
onMounted(() => {
  const path = route.path;
  const registerParam = route.query.register;

  if (path.includes('/register') || registerParam === 'true') {
    activeTab.value = 'register';
  } else {
    activeTab.value = 'login';
  }
});
</script>

<style lang="scss" scoped>
.auth-page {
  min-height: 100vh;
  background: oklch(0.1822 0 0);
  font-family: 'Geist', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.5;
  letter-spacing: 0.025em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.auth-container {
  width: 100%;
  max-width: 448px;
  margin: 0 auto;
  padding: 16px;
}

.auth-card {
  background: oklch(0.2046 0 0);
  border: 1px solid oklch(0.2809 0 0 / 0.5);
  border-radius: 12px;
  box-shadow: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 1px 2px -1px hsl(0 0% 0% / 0.17);
  overflow: hidden;
}

.auth-header {
  padding: 32px 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.church-logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-circle {
  width: 64px;
  height: 64px;
  background: oklch(0.4365 0.1044 156.7556);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.church-info {
  text-align: center;
}

.church-name {
  font-size: 18px;
  font-weight: 300;
  color: oklch(0.9288 0.0126 255.5078);
  margin-bottom: 4px;
}

.church-subtitle {
  font-size: 14px;
  font-weight: 400;
  color: oklch(0.7122 0 0);
}

.auth-tabs {
  padding: 0 32px;
}

:deep(.auth-tab-list) {
  background: transparent;
  border: none;
  height: auto;
}

:deep(.auth-tab) {
  background: transparent;
  color: oklch(0.7122 0 0);
  font-weight: 400;
  font-size: 14px;
  text-transform: none;
  padding: 8px 16px;
  margin: 0;
  border-radius: 6px;
  transition: all 150ms ease-out;
  min-width: auto;
  flex: 1;
}

:deep(.auth-tab--active) {
  background: oklch(0.4365 0.1044 156.7556);
  color: oklch(0.098 0 0);
}

:deep(.auth-tab:hover:not(.auth-tab--active)) {
  background: oklch(0.2246 0 0);
}

.auth-separator {
  background: oklch(0.2809 0 0 / 0.5);
  margin: 0;
}

.auth-panels {
  background: transparent;
}

:deep(.auth-panel) {
  background: transparent;
  padding: 24px 32px 32px;
}

.auth-footer {
  margin-top: 24px;
  text-align: center;
}

.footer-text {
  font-size: 14px;
  font-weight: 400;
  color: oklch(0.7122 0 0);
  margin-bottom: 4px;
}

.footer-subtitle {
  font-size: 12px;
  font-weight: 400;
  color: oklch(0.7122 0 0);
}

.demo-toggle {
  margin-top: 24px;
  padding: 16px;
  border: 1px solid oklch(0.2809 0 0 / 0.3);
  border-radius: 6px;
  background: oklch(0.2246 0 0);
}

.demo-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.demo-checkbox {
  width: 16px;
  height: 16px;
  accent-color: oklch(0.4365 0.1044 156.7556);
}

.demo-text {
  font-size: 14px;
  font-weight: 400;
  color: oklch(0.9288 0.0126 255.5078);
}

.demo-info {
  font-size: 12px;
  font-weight: 400;
  color: oklch(0.7122 0 0);
  margin-top: 4px;
  margin-left: 24px;
}

/* Mobile responsiveness */
@media (max-width: 480px) {
  .auth-container {
    padding: 12px;
  }

  .auth-header {
    padding: 24px 24px 20px;
  }

  .auth-tabs {
    padding: 0 24px;
  }

  :deep(.auth-panel) {
    padding: 20px 24px 24px;
  }
}
</style>