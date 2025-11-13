<template>
  <div class="register-form">
    <!-- Error Alert -->
    <div v-if="error" class="error-alert">
      <q-icon name="error_outline" size="16px" />
      <span>{{ error }}</span>
    </div>

    <!-- Google Sign Up Button -->
    <q-btn
      flat
      class="google-btn"
      @click="handleGoogleSignUp"
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

    <!-- Registration Form -->
    <form @submit.prevent="handleSubmit" class="auth-form">
      <!-- Name Fields -->
      <div class="form-field">
        <label class="field-label" for="firstName">First Name</label>
        <div class="input-container">
          <q-icon name="person" class="field-icon" />
          <input
            id="firstName"
            v-model="form.first_name"
            type="text"
            class="form-input"
            placeholder="John"
            :disabled="loading || googleLoading"
            autocomplete="given-name"
            required
          />
        </div>
      </div>

      <div class="form-field">
        <label class="field-label" for="lastName">Last Name</label>
        <div class="input-container">
          <q-icon name="person" class="field-icon" />
          <input
            id="lastName"
            v-model="form.last_name"
            type="text"
            class="form-input"
            placeholder="Doe"
            :disabled="loading || googleLoading"
            autocomplete="family-name"
            required
          />
        </div>
      </div>

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
            placeholder="•••••••••"
            :disabled="loading || googleLoading"
            autocomplete="new-password"
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

      <!-- Confirm Password Field -->
      <div class="form-field">
        <label class="field-label" for="confirmPassword">Confirm Password</label>
        <div class="input-container">
          <q-icon name="lock" class="field-icon" />
          <input
            id="confirmPassword"
            v-model="form.password_confirmation"
            :type="showConfirmPassword ? 'text' : 'password'"
            class="form-input"
            placeholder="•••••••••"
            :disabled="loading || googleLoading"
            autocomplete="new-password"
            required
          />
          <button
            type="button"
            class="password-toggle"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <q-icon :name="showConfirmPassword ? 'visibility_off' : 'visibility'" />
          </button>
        </div>
      </div>

      <!-- Password Strength Indicator -->
      <div v-if="form.password" class="password-strength">
        <div class="strength-bar">
          <div
            class="strength-fill"
            :class="passwordStrengthClass"
            :style="{ width: passwordStrengthWidth + '%' }"
          ></div>
        </div>
        <span class="strength-text" :class="passwordStrengthClass">
          {{ passwordStrengthText }}
        </span>
      </div>

      <!-- Terms and Conditions -->
      <div class="terms-field">
        <label class="checkbox-container">
          <input
            type="checkbox"
            v-model="acceptTerms"
            class="checkbox"
            :disabled="loading || googleLoading"
            required
          />
          <span class="checkbox-label">
            I agree to the
            <a href="/terms" class="terms-link" target="_blank">Terms of Service</a>
            and
            <a href="/privacy" class="terms-link" target="_blank">Privacy Policy</a>
          </span>
        </label>
      </div>

      <!-- Sign Up Button -->
      <q-btn
        type="submit"
        color="primary"
        class="signup-btn"
        :loading="loading"
        :disable="loading || googleLoading || !isFormValid"
      >
        {{ loading ? 'Creating account...' : 'Sign Up' }}
      </q-btn>

      <!-- Login Link -->
      <div class="login-link">
        Already have an account?
        <q-btn
          flat
          dense
          label="Sign In"
          class="login-link-btn"
          :disable="loading || googleLoading"
          @click="$emit('switchToLogin')"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '@/stores/auth';
import type { RegisterCredentials } from '@/types/auth';

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

// Form state
const form = ref<RegisterCredentials>({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirmation: '',
  phone: '',
  organization_name: '',
  role: 'member'
});

// Additional form state not part of API
const acceptTerms = ref(false);

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const googleLoading = ref(false);
const error = ref<string | null>(null);

// Emits
const emit = defineEmits<{
  (e: 'success'): void
  (e: 'switchToLogin'): void
}>();

// Computed
const isFormValid = computed(() => {
  return form.value.first_name.trim() &&
         form.value.last_name.trim() &&
         form.value.email &&
         form.value.password &&
         form.value.password_confirmation &&
         acceptTerms.value &&
         form.value.password === form.value.password_confirmation &&
         form.value.email.includes('@') &&
         form.value.password.length >= 6 &&
         form.value.first_name.trim().length >= 2 &&
         form.value.last_name.trim().length >= 2;
});

const passwordStrength = computed(() => {
  const password = form.value.password;
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  return strength;
});

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value;
  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'medium';
  return 'strong';
});

const passwordStrengthWidth = computed(() => {
  return (passwordStrength.value / 6) * 100;
});

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value;
  if (strength <= 2) return 'Weak password';
  if (strength <= 4) return 'Good password';
  return 'Strong password';
});

// Methods
const handleSubmit = async () => {
  if (!isFormValid.value) return;

  error.value = null;
  loading.value = true;

  try {
    await authStore.register(form.value);
    $q.notify({
      type: 'positive',
      message: 'Account created successfully!',
      position: 'top'
    });

    emit('success');
    router.push('/dashboard');
  } catch (err) {
    console.error('Registration error:', err);
    if (err && typeof err === 'object' && 'message' in err) {
      error.value = (err as { message?: string }).message || 'Registration failed';
    } else {
      error.value = 'Registration failed';
    }
  } finally {
    loading.value = false;
  }
};

const handleGoogleSignUp = async () => {
  error.value = null;
  googleLoading.value = true;

  try {
    // Implement Google OAuth logic here
    $q.notify({
      type: 'info',
      message: 'Google sign up coming soon!',
      position: 'top'
    });
  } catch (err) {
    console.error('Google sign up error:', err);
    error.value = 'Google sign up failed';
  } finally {
    googleLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.register-form {
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

.password-strength {
  display: flex;
  align-items: center;
  gap: 8px;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: oklch(0.2809 0 0 / 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: all 300ms ease-out;

  &.weak {
    background: oklch(0.3123 0.0852 29.7877);
  }

  &.medium {
    background: oklch(0.8369 0.1644 84.4286);
  }

  &.strong {
    background: oklch(0.4365 0.1044 156.7556);
  }
}

.strength-text {
  font-size: 12px;
  font-weight: 400;

  &.weak {
    color: oklch(0.3123 0.0852 29.7877);
  }

  &.medium {
    color: oklch(0.8369 0.1644 84.4286);
  }

  &.strong {
    color: oklch(0.4365 0.1044 156.7556);
  }
}

.terms-field {
  margin-top: 4px;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: oklch(0.9288 0.0126 255.5078);
  cursor: pointer;
}

.checkbox {
  margin-top: 2px;
  width: 16px;
  height: 16px;
  accent-color: oklch(0.4365 0.1044 156.7556);
}

.checkbox-label {
  line-height: 1.4;
}

.terms-link {
  color: oklch(0.4365 0.1044 156.7556);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.signup-btn {
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

.login-link {
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: oklch(0.7122 0 0);
  margin-top: 8px;
}

.login-link-btn {
  color: oklch(0.4365 0.1044 156.7556);
  font-size: 14px;
  font-weight: 400;
  text-transform: none;

  &:hover {
    background: oklch(0.4365 0.1044 156.7556 / 0.1);
  }
}
</style>