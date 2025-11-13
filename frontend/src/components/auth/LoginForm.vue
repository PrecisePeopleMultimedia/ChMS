<template>
  <div class="login-form">
    <!-- Error Alert -->
    <div v-if="error" class="error-alert">
      <q-icon name="error_outline" size="16px" />
      <span>{{ error }}</span>
    </div>

    <!-- Google Sign In Button -->
    <q-btn
      flat
      class="google-btn"
      @click="handleGoogleSignIn"
      :loading="googleLoading"
      :disable="loading || googleLoading"
    >
      <template v-if="!googleLoading">
        <svg class="google-icon" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </template>
      <template v-else>
        <q-spinner-dots size="16px" />
        Connecting to Google...
      </template>
    </q-btn>

    <!-- Divider -->
    <div class="divider-container">
      <div class="divider-line"></div>
      <span class="divider-text">Or continue with email</span>
      <div class="divider-line"></div>
    </div>

    <!-- Email/Password Form -->
    <form @submit.prevent="handleSubmit" class="auth-form">
      <!-- Email Field -->
      <div class="form-field">
        <label class="field-label" for="email">Email</label>
        <div class="input-container">
          <q-icon name="mail" class="field-icon" />
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-input"
            placeholder="pastor@church.com"
            :disabled="loading || googleLoading"
            autocomplete="email"
            required
          />
        </div>
      </div>

      <!-- Password Field -->
      <div class="form-field">
        <label class="field-label" for="password">Password</label>
        <div class="input-container">
          <q-icon name="lock" class="field-icon" />
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="form-input"
            placeholder="••••••••"
            :disabled="loading || googleLoading"
            autocomplete="current-password"
            required
          />
          <button
            type="button"
            class="password-toggle"
            @click="showPassword = !showPassword"
          >
            <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" />
          </button>
        </div>
      </div>

      <!-- Forgot Password Link -->
      <div class="form-actions">
        <q-btn
          flat
          dense
          label="Forgot password?"
          class="forgot-link"
          :disable="loading || googleLoading"
          @click="handleForgotPassword"
        />
      </div>

      <!-- Sign In Button -->
      <q-btn
        type="submit"
        color="primary"
        class="signin-btn"
        :loading="loading"
        :disable="loading || googleLoading || !isFormValid"
      >
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </q-btn>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '@/stores/auth';
import type { LoginCredentials } from '@/types/auth';

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

// Form state
const form = ref<LoginCredentials>({
  email: '',
  password: '',
  remember: false
})

// Pre-fill demo credentials if available
if (authStore.demoCredentials) {
  form.value.email = authStore.demoCredentials.email
  form.value.password = authStore.demoCredentials.password
}

const showPassword = ref(false);
const loading = ref(false);
const googleLoading = ref(false);
const error = ref<string | null>(null);

// Computed
const isFormValid = computed(() => {
  return form.value.email && form.value.password &&
         form.value.email.includes('@') && form.value.password.length >= 6;
});

// Methods
const handleSubmit = async () => {
  if (!isFormValid.value) return;

  error.value = null;
  loading.value = true;

  try {
    await authStore.login(form.value);
    $q.notify({
      type: 'positive',
      message: 'Welcome back!',
      position: 'top'
    });

    const redirectPath = router.currentRoute.value.query.redirect as string;
    await router.push(redirectPath || '/dashboard');
  } catch (err: any) {
    console.error('Login error:', err);
    error.value = err.message || 'Invalid email or password';
  } finally {
    loading.value = false;
  }
};

const handleGoogleSignIn = async () => {
  error.value = null;
  googleLoading.value = true;

  try {
    // Implement Google OAuth logic here
    $q.notify({
      type: 'info',
      message: 'Google sign in coming soon!',
      position: 'top'
    });
  } catch (err: any) {
    error.value = 'Google sign in failed';
  } finally {
    googleLoading.value = false;
  }
};

const handleForgotPassword = () => {
  router.push('/forgot-password');
};
</script>

<style lang="scss" scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.error-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: oklch(0.3123 0.0852 29.7877 / 0.1);
  border: 1px solid oklch(0.3123 0.0852 29.7877 / 0.3);
  border-radius: 6px;
  color: oklch(0.3123 0.0852 29.7877);
  font-size: 14px;
  font-weight: 400;
}

.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  padding: 0 16px;
  border: 1px solid oklch(0.2809 0 0);
  border-radius: 6px;
  background: transparent;
  color: oklch(0.9288 0.0126 255.5078);
  font-size: 14px;
  font-weight: 400;
  text-transform: none;
  transition: all 150ms ease-out;

  &:hover {
    background: oklch(0.2246 0 0);
  }

  &:disabled {
    opacity: 0.6;
  }
}

.google-icon {
  width: 16px;
  height: 16px;
}

.divider-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: oklch(0.2809 0 0 / 0.5);
}

.divider-text {
  font-size: 12px;
  font-weight: 400;
  color: oklch(0.7122 0 0);
  text-transform: uppercase;
  background: oklch(0.2046 0 0);
  padding: 0 8px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 14px;
  font-weight: 400;
  color: oklch(0.9288 0.0126 255.5078);
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.field-icon {
  position: absolute;
  left: 12px;
  color: oklch(0.7122 0 0);
  font-size: 16px;
}

.form-input {
  width: 100%;
  height: 44px;
  padding: 0 12px 0 40px;
  border: 1px solid oklch(0.2809 0 0 / 0.5);
  border-radius: 6px;
  background: oklch(0.1822 0 0);
  color: oklch(0.9288 0.0126 255.5078);
  font-size: 14px;
  font-family: 'Geist', system-ui, sans-serif;
  transition: all 150ms ease-out;

  &:focus {
    outline: none;
    border-color: oklch(0.4365 0.1044 156.7556);
    box-shadow: 0 0 0 2px oklch(0.4365 0.1044 156.7556 / 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::placeholder {
    color: oklch(0.7122 0 0);
  }
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: oklch(0.7122 0 0);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 150ms ease-out;

  &:hover {
    color: oklch(0.9288 0.0126 255.5078);
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.forgot-link {
  color: oklch(0.4365 0.1044 156.7556);
  font-size: 14px;
  font-weight: 400;
  text-transform: none;

  &:hover {
    background: oklch(0.4365 0.1044 156.7556 / 0.1);
  }
}

.signin-btn {
  height: 44px;
  border-radius: 6px;
  background: oklch(0.4365 0.1044 156.7556);
  color: oklch(0.098 0 0);
  font-size: 14px;
  font-weight: 400;
  text-transform: none;
  transition: all 150ms ease-out;

  &:hover:not(:disabled) {
    background: oklch(0.4835 0.1152 156.7556);
  }

  &:disabled {
    opacity: 0.6;
  }
}
</style>