<template>
  <BaseFormCard
    class="fade-in-up login-card"
  >
    <template #content>
      <q-form
        @submit="handleLogin"
        class="q-gutter-md"
        role="form"
        aria-label="Sign in form"
        novalidate
      >
        <!-- Email Field -->
        <q-input
          id="login-email"
          ref="emailInputRef"
          v-model="form.email"
          type="email"
          label="Email Address"
          outlined
          dark
          required
          autocomplete="email"
          :rules="emailRules"
          :error="!!fieldErrors.email"
          :error-message="fieldErrors.email"
          :aria-describedby="fieldErrors.email ? 'email-error' : undefined"
          :aria-invalid="!!fieldErrors.email"
          class="garnet-input"
          @focus="announceFieldFocus('Email Address')"
          @input="handleEmailInput"
          @keydown="handleKeyDown"
        >
          <template v-slot:prepend>
            <q-icon name="email" color="primary" aria-hidden="true" />
          </template>
        </q-input>

        <!-- Password Field -->
        <q-input
          id="login-password"
          ref="passwordInputRef"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          outlined
          dark
          required
          autocomplete="current-password"
          :rules="passwordRules"
          :error="!!fieldErrors.password"
          :error-message="fieldErrors.password"
          :aria-describedby="fieldErrors.password ? 'password-error' : undefined"
          :aria-invalid="!!fieldErrors.password"
          class="garnet-input"
          @focus="announceFieldFocus('Password')"
          @input="handlePasswordInput"
          @keydown="handleKeyDown"
        >
          <template v-slot:prepend>
            <q-icon name="lock" color="primary" aria-hidden="true" />
          </template>
          <template v-slot:append>
            <q-btn
              flat
              round
              dense
              :icon="showPassword ? 'visibility_off' : 'visibility'"
              color="grey-5"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              :aria-pressed="showPassword.toString()"
              @click="togglePasswordVisibility"
              data-testid="password-toggle"
              tabindex="0"
            />
          </template>
        </q-input>

        <!-- Remember Me -->
        <q-checkbox
          id="login-remember"
          v-model="form.remember"
          label="Remember me"
          color="primary"
          dark
          class="text-grey-3"
          aria-describedby="remember-help"
        />
        <div id="remember-help" class="text-caption text-grey-5 q-mt-xs">
          Keep me signed in on this device
        </div>

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
          :disabled="!isFormValid || authStore.isLoading"
          class="w-full garnet-btn"
          @click="handleLogin"
          :aria-describedby="!isFormValid ? 'form-validation-help' : undefined"
        >
          <template v-if="!authStore.isLoading">
            Sign In
          </template>
          <template v-else>
            Signing in...
          </template>
        </ModernButton>

        <!-- Form validation help text -->
        <div
          v-if="!isFormValid && (form.email || form.password)"
          id="form-validation-help"
          class="text-caption text-grey-5 q-mt-xs"
        >
          Please fill in all required fields with valid information
        </div>

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
          :disabled="authStore.isLoading || isGoogleLoading"
          class="w-full google-btn"
          @click="handleGoogleLogin"
          :aria-label="isGoogleLoading ? 'Opening Google login...' : 'Continue with Google'"
        >
          <template #icon v-if="!isGoogleLoading">
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              class="w-4 h-4 mr-2"
            />
          </template>
          <template v-if="!isGoogleLoading">
            Continue with Google
          </template>
          <template v-else>
            Opening Google login...
          </template>
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
import { useAccessibility } from '@/composables/useAccessibility'
import type { LoginCredentials } from '@/types/auth'
import BaseFormCard from '@/components/common/BaseFormCard.vue'
import { api } from '@/services/api'
import ModernButton from '@/components/ui/ModernButton.vue'
import ModernAlert from '@/components/ui/ModernAlert.vue'
import ThemeSwitcher from '@/components/theme/ThemeSwitcher.vue'

// Composables
const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()
const { announceToScreenReader } = useAccessibility()

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

// Enhanced validation rules
const emailRules = [
  (val: string) => !!val || 'Email is required',
  (val: string) => {
    // More robust email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(val) || 'Please enter a valid email address'
  },
  (val: string) => {
    // Check for common email format issues
    if (val.includes('..')) return 'Email cannot contain consecutive dots'
    if (val.startsWith('.') || val.endsWith('.')) return 'Email cannot start or end with a dot'
    if (val.length > 254) return 'Email address is too long'
    return true
  }
]

const passwordRules = [
  (val: string) => !!val || 'Password is required',
  (val: string) => val.length >= 6 || 'Password must be at least 6 characters',
  (val: string) => val.length <= 128 || 'Password must be less than 128 characters',
  (val: string) => {
    // Check for common password issues
    if (val.trim() !== val) return 'Password cannot start or end with spaces'
    return true
  }
]

// Computed
const isDevelopment = computed(() => {
  // Only show test components when explicitly enabled via environment variable
  return import.meta.env.VITE_SHOW_TEST_COMPONENTS === 'true'
})

const isFormValid = computed(() => {
  // Check if all fields are filled
  if (!form.value.email || !form.value.password) {
    return false
  }

  // Validate email using the same rules
  const emailValid = emailRules.every(rule => rule(form.value.email) === true)

  // Validate password using the same rules
  const passwordValid = passwordRules.every(rule => rule(form.value.password) === true)

  return emailValid && passwordValid
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

    // Clear any existing field errors
    fieldErrors.value = {}

    // Handle different types of errors
    let errorMessage = 'Login failed. Please try again.'

    if (error.response?.data?.errors) {
      // Validation errors from server
      fieldErrors.value = error.response.data.errors
      errorMessage = 'Please check the form for errors.'
    } else if (error.response?.data?.message) {
      // Specific error message from server
      errorMessage = error.response.data.message
    } else if (error.response?.status === 401) {
      errorMessage = 'Invalid email or password. Please try again.'
    } else if (error.response?.status === 422) {
      errorMessage = 'Please check your input and try again.'
    } else if (error.response?.status >= 500) {
      errorMessage = 'Server error. Please try again later.'
    } else if (error.code === 'NETWORK_ERROR' || !error.response) {
      errorMessage = 'Network error. Please check your connection and try again.'
    } else if (authStore.error) {
      // Use store error if available
      errorMessage = authStore.error
    }

    // Announce error to screen readers
    announceToScreenReader(`Login failed: ${errorMessage}`)

    $q.notify({
      type: 'negative',
      message: errorMessage,
      position: 'top',
      timeout: 5000,
      actions: [
        {
          icon: 'close',
          color: 'white',
          round: true,
          handler: () => {}
        }
      ]
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

    // Check if Google OAuth is configured
    const response = await api.get('/auth/google')
    const { redirect_url, client_id } = response.data

    if (!redirect_url) {
      throw new Error('Google OAuth not configured')
    }

    // Announce to screen readers
    announceToScreenReader('Opening Google login window')

    // Use popup for better UX (fallback to redirect if popup blocked)
    const popup = window.open(
      redirect_url,
      'google-oauth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    )

    if (!popup) {
      // Popup blocked, fallback to redirect
      console.warn('Popup blocked, falling back to redirect')
      window.location.href = redirect_url
      return
    }

    // Monitor popup for completion
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed)
        isGoogleLoading.value = false

        // Check if user was redirected back with auth data
        // This would typically be handled by the OAuth callback
        console.log('Google OAuth popup closed')
      }
    }, 1000)

    // Handle popup messages (if using postMessage pattern)
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
        clearInterval(checkClosed)
        popup.close()
        window.removeEventListener('message', handleMessage)

        // Handle successful OAuth
        handleOAuthSuccess(event.data.token)
      } else if (event.data.type === 'GOOGLE_OAUTH_ERROR') {
        clearInterval(checkClosed)
        popup.close()
        window.removeEventListener('message', handleMessage)

        throw new Error(event.data.error || 'Google OAuth failed')
      }
    }

    window.addEventListener('message', handleMessage)

    // Timeout after 5 minutes
    setTimeout(() => {
      if (!popup.closed) {
        clearInterval(checkClosed)
        popup.close()
        window.removeEventListener('message', handleMessage)
        isGoogleLoading.value = false

        $q.notify({
          type: 'warning',
          message: 'Google login timed out. Please try again.',
          position: 'top'
        })
      }
    }, 300000) // 5 minutes

  } catch (error: any) {
    console.error('Google OAuth error:', error)

    let errorMessage = 'Google login failed. Please try again.'

    if (error.response?.status === 404) {
      errorMessage = 'Google login is not available. Please use email/password login.'
    } else if (error.response?.status === 500) {
      errorMessage = 'Google login is not configured yet. Please use email/password login.'
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message === 'Google OAuth not configured') {
      errorMessage = 'Google login is not set up yet. Please use email/password login.'
    }

    // Announce error to screen readers
    announceToScreenReader(`Google login failed: ${errorMessage}`)

    $q.notify({
      type: 'negative',
      message: errorMessage,
      position: 'top',
      timeout: 5000,
      actions: [
        {
          icon: 'close',
          color: 'white',
          round: true,
          handler: () => {}
        }
      ]
    })
  } finally {
    isGoogleLoading.value = false
  }
}

// Handle successful OAuth callback
const handleOAuthSuccess = async (token: string) => {
  try {
    // Use the token to authenticate with our backend
    await authStore.googleLogin(token)

    $q.notify({
      type: 'positive',
      message: 'Welcome! You have been signed in with Google.',
      position: 'top'
    })

    router.push('/dashboard')
  } catch (error: any) {
    console.error('OAuth success handling error:', error)

    $q.notify({
      type: 'negative',
      message: 'Authentication failed. Please try again.',
      position: 'top'
    })
  }
}

// Clear errors when form changes
const clearErrors = () => {
  authStore.clearError()
  fieldErrors.value = {}
}

// Accessibility methods
const announceFieldFocus = (fieldName: string) => {
  announceToScreenReader(`${fieldName} field focused`)
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
  const message = showPassword.value ? 'Password is now visible' : 'Password is now hidden'
  announceToScreenReader(message)
}

// Focus management
const emailInputRef = ref<HTMLElement>()
const passwordInputRef = ref<HTMLElement>()

// Handle Enter key submission
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && isFormValid.value && !authStore.isLoading) {
    event.preventDefault()
    handleLogin()
  }
}

// Auto-focus next field on valid input
const handleEmailInput = () => {
  // Clear email-specific errors when user starts typing
  if (fieldErrors.value.email) {
    delete fieldErrors.value.email
  }

  // Auto-focus password field when email is valid
  if (form.value.email && emailRules.every(rule => rule(form.value.email) === true)) {
    setTimeout(() => {
      passwordInputRef.value?.focus()
    }, 100)
  }
}

const handlePasswordInput = () => {
  // Clear password-specific errors when user starts typing
  if (fieldErrors.value.password) {
    delete fieldErrors.value.password
  }
}

// Lifecycle
onMounted(() => {
  // Clear any existing errors
  clearErrors()

  // Only pre-fill form in development environment for testing
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_TEST_CREDENTIALS === 'true') {
    form.value.email = 'john@example.com'
    form.value.password = 'password123'
    console.warn('🔒 Test credentials loaded - Development mode only')
  }

  // Focus email field on mount for better UX
  setTimeout(() => {
    emailInputRef.value?.focus()
  }, 100)
})
</script>

<style lang="sass" scoped>
// All form styling is now handled by BaseFormCard component
// This keeps the LoginForm component clean and focused on logic
  min-height: 100vh
</style>