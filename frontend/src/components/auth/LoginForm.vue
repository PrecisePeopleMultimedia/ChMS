<template>
  <BaseFormCard
    title="Welcome to ChurchAfrica"
    subtitle="Sign in to your account"
    class="fade-in-up"
  >
    <template #header>
      <div class="row items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-foreground tracking-tight">
            Welcome to ChurchAfrica
          </h1>
          <p class="text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>
        <div class="col-auto">
          <ThemeSwitcher />
        </div>
      </div>
    </template>
    <template #content>
      <q-form @submit="handleLogin" class="q-gutter-md">
        <!-- Email Field -->
        <q-input
          v-model="form.email"
          type="email"
          label="Email Address"
          outlined
          :rules="emailRules"
          :error="!!fieldErrors.email"
          :error-message="fieldErrors.email"
          class="garnet-input"
        >
          <template v-slot:prepend>
            <q-icon name="email" color="primary" />
          </template>
        </q-input>

        <!-- Password Field -->
        <q-input
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          outlined
          :rules="passwordRules"
          :error="!!fieldErrors.password"
          :error-message="fieldErrors.password"
          class="garnet-input"
        >
          <template v-slot:prepend>
            <q-icon name="lock" color="primary" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              color="grey-5"
              @click="showPassword = !showPassword"
              data-testid="password-toggle"
            />
          </template>
        </q-input>

        <!-- Remember Me -->
        <q-checkbox
          v-model="form.remember"
          label="Remember me"
          color="primary"
          dark
          class="text-grey-3"
        />

        <!-- Error Message -->
        <ModernAlert
          v-if="authStore.error"
          variant="error"
          :message="authStore.error"
          dismissible
        />

        <!-- Debug Info -->
        <ModernAlert
          v-if="debugInfo"
          variant="info"
          title="Debug Information"
          dismissible
        >
          <div class="space-y-1 text-sm">
            <div>API URL: {{ apiUrl }}</div>
            <div>Form Valid: {{ isFormValid }}</div>
            <div>Loading: {{ authStore.isLoading }}</div>
          </div>
        </ModernAlert>

        <!-- Login Button -->
        <ModernButton
          variant="primary"
          size="lg"
          :loading="authStore.isLoading"
          :disabled="!isFormValid"
          class="w-full garnet-btn"
          @click="handleLogin"
        >
          <template v-if="!authStore.isLoading">
            Sign In
          </template>
          <template v-else>
            Signing in...
          </template>
        </ModernButton>

        <!-- Test API Button -->
        <!-- Test API Button - Hidden by default, shown only in development -->
        <ModernButton
          v-if="isDevelopment"
          variant="outline"
          size="sm"
          :loading="isTestingApi"
          class="w-full"
          @click="testApiConnection"
        >
          Test API Connection
        </ModernButton>

        <!-- Divider -->
        <div class="flex items-center my-4">
          <div class="flex-1 border-t border-border"></div>
          <div class="px-3 text-sm text-muted-foreground">or</div>
          <div class="flex-1 border-t border-border"></div>
        </div>

        <!-- Google Login Button -->
        <ModernButton
          variant="outline"
          size="lg"
          :loading="isGoogleLoading"
          class="w-full google-btn"
          @click="handleGoogleLogin"
        >
          <template #icon>
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              class="w-4 h-4 mr-2"
            />
          </template>
          Continue with Google
        </ModernButton>
      </q-form>
    </template>

    <template #footer>
      <div class="text-grey-5">
        <router-link to="/forgot-password" class="text-primary text-decoration-none">
          Forgot your password?
        </router-link>
      </div>
      <div class="text-grey-5 q-mt-xs">
        Don't have an account?
        <router-link to="/register" class="text-primary text-decoration-none">
          Sign up
        </router-link>
      </div>
    </template>
  </BaseFormCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'
import type { LoginCredentials } from '@/types/auth'
import BaseFormCard from '@/components/common/BaseFormCard.vue'
import axios from 'axios'
import ModernButton from '@/components/ui/ModernButton.vue'
import ModernAlert from '@/components/ui/ModernAlert.vue'
import ThemeSwitcher from '@/components/theme/ThemeSwitcher.vue'

// Composables
const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

// Form state
const form = ref<LoginCredentials>({
  email: '',
  password: '',
  remember: false
})

const showPassword = ref(false)
const isGoogleLoading = ref(false)
const isTestingApi = ref(false)
const fieldErrors = ref<Record<string, string>>({})
const debugInfo = ref(false) // Hide debug info in production

// API URL for debugging
const apiUrl = import.meta.env.VITE_API_URL

// Validation rules
const emailRules = [
  (val: string) => !!val || 'Email is required',
  (val: string) => /.+@.+\..+/.test(val) || 'Please enter a valid email'
]

const passwordRules = [
  (val: string) => !!val || 'Password is required',
  (val: string) => val.length >= 6 || 'Password must be at least 6 characters'
]

// Computed
const isDevelopment = computed(() => {
  // Only show test components when explicitly enabled via environment variable
  return import.meta.env.VITE_SHOW_TEST_COMPONENTS === 'true'
})

const isFormValid = computed(() => {
  return form.value.email && 
         form.value.password && 
         /.+@.+\..+/.test(form.value.email) &&
         form.value.password.length >= 6
})

// Methods
const handleLogin = async () => {
  console.log('Login form submitted:', form.value)
  console.log('API URL:', apiUrl)
  
  try {
    fieldErrors.value = {}
    console.log('Calling authStore.login...')
    await authStore.login(form.value)
    
    $q.notify({
      type: 'positive',
      message: 'Welcome back!',
      position: 'top'
    })
    
    router.push('/dashboard')
  } catch (error: any) {
    console.error('Login error:', error)
    
    if (error.response?.data?.errors) {
      fieldErrors.value = error.response.data.errors
    }
    
    $q.notify({
      type: 'negative',
      message: authStore.error || 'Login failed',
      position: 'top'
    })
  }
}

const testApiConnection = async () => {
  isTestingApi.value = true
  try {
    console.log('Testing API connection to:', apiUrl)
    const response = await fetch(`${apiUrl}/health`)
    const data = await response.json()
    
    $q.notify({
      type: 'positive',
      message: `API connected! Status: ${data.status}`,
      position: 'top'
    })
  } catch (error: any) {
    console.error('API test failed:', error)
    $q.notify({
      type: 'negative',
      message: `API test failed: ${error.message}`,
      position: 'top'
    })
  } finally {
    isTestingApi.value = false
  }
}

const handleGoogleLogin = async () => {
  try {
    isGoogleLoading.value = true
    
    // Get Google OAuth redirect URL from backend
    const response = await axios.get('/auth/google')
    const { redirect_url } = response.data
    
    // Redirect to Google OAuth
    window.location.href = redirect_url
  } catch (error: any) {
    console.error('Google OAuth error:', error)
    $q.notify({
      type: 'negative',
      message: 'Google login failed. Please try again.',
      position: 'top'
    })
  } finally {
    isGoogleLoading.value = false
  }
}

// Clear errors when form changes
const clearErrors = () => {
  authStore.clearError()
  fieldErrors.value = {}
}

// Lifecycle
onMounted(() => {
  // Clear any existing errors
  clearErrors()
  
  // Pre-fill form for testing
  form.value.email = 'john@example.com'
  form.value.password = 'password123'
})
</script>

<style lang="sass" scoped>
// All form styling is now handled by BaseFormCard component
// This keeps the LoginForm component clean and focused on logic
  min-height: 100vh
</style>