<template>
  <q-page class="modern-auth-bg flex flex-center min-h-screen">
    <div class="login-container">
      <!-- Logo/Brand Section -->
      <div class="text-center q-mb-xl">
        <div class="brand-logo q-mb-md">
          <q-icon 
            name="church" 
            size="4rem" 
            color="primary"
            class="brand-icon"
          />
        </div>
        <div class="text-h3 text-white brand-title">
          ChurchAfrica
        </div>
        <div class="text-subtitle1 text-grey-4 brand-subtitle">
          Africa-first Church Management System
        </div>
      </div>

      <!-- Login Form -->
      <LoginForm />

      <!-- Footer -->
      <div class="text-center q-mt-xl">
        <div class="text-grey-6 text-caption">
          © 2025 ChurchAfrica. Built for African churches.
        </div>
        <div class="text-grey-7 text-caption q-mt-xs">
          Offline-first • Mobile-optimized • Secure
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginForm from '@/components/auth/LoginForm.vue'

const router = useRouter()
const authStore = useAuthStore()

// Redirect if already authenticated
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})
</script>

<style scoped>
.modern-auth-bg {
  /* Modern gradient background inspired by shadcn/ui */
  background: linear-gradient(135deg,
    hsl(330, 40%, 8%) 0%,
    hsl(340, 35%, 12%) 25%,
    hsl(330, 30%, 10%) 50%,
    hsl(320, 35%, 8%) 75%,
    hsl(330, 40%, 6%) 100%
  );

  /* Overlay pattern for texture */
  background-image:
    radial-gradient(circle at 25% 25%, rgba(184, 51, 106, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(139, 21, 56, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 50% 0%, rgba(184, 51, 106, 0.05) 0%, transparent 50%);

  /* Subtle noise texture */
  background-attachment: fixed;
  padding: 2rem 1rem;
}

.login-container {
  @apply w-full max-w-md mx-auto flex flex-col items-center space-y-8;
}

.brand-logo {
  @apply relative;
}

.brand-icon {
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4));
  transition: all 0.3s ease;
}

.brand-icon:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 12px 24px rgba(184, 51, 106, 0.3));
}

.brand-title {
  @apply font-bold text-transparent bg-clip-text;
  background: linear-gradient(135deg,
    hsl(0, 0%, 100%) 0%,
    hsl(330, 20%, 90%) 50%,
    hsl(330, 30%, 85%) 100%
  );
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
  letter-spacing: -0.02em;
}

.brand-subtitle {
  @apply font-medium text-muted-foreground;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

/* Responsive design */
@media (max-width: 640px) {
  .modern-auth-bg {
    @apply px-4 py-6;
  }

  .brand-title {
    @apply text-2xl;
  }

  .brand-subtitle {
    @apply text-sm;
  }
}

/* Enhanced animations */
.brand-logo {
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.brand-title {
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

.brand-subtitle {
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
