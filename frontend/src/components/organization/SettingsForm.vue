<template>
  <div class="settings-form">
    <div class="text-h6 q-mb-md">Settings & Preferences</div>
    <div class="text-body2 text-grey-6 q-mb-lg">
      Configure additional settings for your church. These are optional and can be updated later.
    </div>

    <q-form @submit="handleSubmit" class="q-gutter-md">
      <!-- Welcome Message -->
      <q-input
        v-model="formData.welcome_message"
        label="Welcome Message"
        outlined
        type="textarea"
        rows="3"
        :error="hasError('welcome_message')"
        :error-message="getError('welcome_message')"
        :loading="loading"
        maxlength="500"
        counter
        class="full-width"
        placeholder="Welcome to our church! We're glad you're here..."
      >
        <template v-slot:prepend>
          <q-icon name="message" />
        </template>
      </q-input>

      <!-- Contact Information -->
      <div class="text-subtitle2 q-mt-lg q-mb-md">Contact Information</div>
      
      <div class="row q-gutter-md">
        <div class="col-12 col-md-6">
          <q-input
            v-model="formData.contact_person"
            label="Primary Contact Person"
            outlined
            :error="hasError('contact_person')"
            :error-message="getError('contact_person')"
            :loading="loading"
            maxlength="255"
            class="full-width"
            placeholder="Pastor John Doe"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-6">
          <q-input
            v-model="formData.emergency_contact"
            label="Emergency Contact"
            outlined
            :error="hasError('emergency_contact')"
            :error-message="getError('emergency_contact')"
            :loading="loading"
            maxlength="255"
            class="full-width"
            placeholder="+234 123 456 7890"
          >
            <template v-slot:prepend>
              <q-icon name="emergency" />
            </template>
          </q-input>
        </div>
      </div>

      <!-- Social Media -->
      <div class="text-subtitle2 q-mt-lg q-mb-md">Social Media (Optional)</div>
      
      <q-input
        v-model="formData.social_media_facebook"
        label="Facebook Page"
        outlined
        :error="hasError('social_media_facebook')"
        :error-message="getError('social_media_facebook')"
        :loading="loading"
        class="full-width"
        placeholder="https://facebook.com/yourchurch"
      >
        <template v-slot:prepend>
          <q-icon name="facebook" />
        </template>
      </q-input>

      <q-input
        v-model="formData.social_media_twitter"
        label="Twitter/X Handle"
        outlined
        :error="hasError('social_media_twitter')"
        :error-message="getError('social_media_twitter')"
        :loading="loading"
        class="full-width"
        placeholder="@yourchurch"
      >
        <template v-slot:prepend>
          <q-icon name="alternate_email" />
        </template>
      </q-input>

      <q-input
        v-model="formData.social_media_instagram"
        label="Instagram Handle"
        outlined
        :error="hasError('social_media_instagram')"
        :error-message="getError('social_media_instagram')"
        :loading="loading"
        class="full-width"
        placeholder="@yourchurch"
      >
        <template v-slot:prepend>
          <q-icon name="camera_alt" />
        </template>
      </q-input>

      <!-- Additional Settings -->
      <div class="text-subtitle2 q-mt-lg q-mb-md">Preferences</div>
      
      <q-select
        v-model="formData.default_language"
        label="Default Language"
        outlined
        :options="languageOptions"
        :error="hasError('default_language')"
        :error-message="getError('default_language')"
        :loading="loading"
        emit-value
        map-options
        class="full-width"
      >
        <template v-slot:prepend>
          <q-icon name="language" />
        </template>
      </q-select>

      <q-select
        v-model="formData.currency"
        label="Currency"
        outlined
        :options="currencyOptions"
        :error="hasError('currency')"
        :error-message="getError('currency')"
        :loading="loading"
        emit-value
        map-options
        class="full-width"
      >
        <template v-slot:prepend>
          <q-icon name="attach_money" />
        </template>
      </q-select>

      <!-- Notification Preferences -->
      <div class="text-subtitle2 q-mt-lg q-mb-md">Notifications</div>
      
      <q-toggle
        v-model="formData.email_notifications"
        label="Enable email notifications"
        color="primary"
        :disable="loading"
        class="q-mb-sm"
      />

      <q-toggle
        v-model="formData.sms_notifications"
        label="Enable SMS notifications"
        color="primary"
        :disable="loading"
        class="q-mb-sm"
      />

      <!-- Form Actions -->
      <div class="row justify-end q-mt-lg">
        <q-btn
          type="submit"
          color="primary"
          label="Save Settings"
          :loading="loading"
          size="md"
          class="q-px-xl"
        />
      </div>
    </q-form>

    <!-- Help Text -->
    <q-banner class="bg-blue-1 text-blue-9 q-mt-md" rounded>
      <template v-slot:avatar>
        <q-icon name="info" color="blue" />
      </template>
      <div class="text-body2">
        <strong>Note:</strong> All these settings are optional and can be configured later. 
        You can skip this step and complete the setup if you prefer to configure these settings later.
      </div>
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  modelValue: {
    welcome_message?: string
    contact_person?: string
    emergency_contact?: string
    social_media_facebook?: string
    social_media_twitter?: string
    social_media_instagram?: string
    default_language?: string
    currency?: string
    email_notifications?: boolean
    sms_notifications?: boolean
  }
  loading?: boolean
  errors?: Record<string, string[]>
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  errors: () => ({}),
  modelValue: () => ({
    welcome_message: '',
    contact_person: '',
    emergency_contact: '',
    social_media_facebook: '',
    social_media_twitter: '',
    social_media_instagram: '',
    default_language: 'en',
    currency: 'NGN',
    email_notifications: true,
    sms_notifications: false
  })
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: Props['modelValue']]
  'submit': []
}>()

// Computed
const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Arabic', value: 'ar' },
  { label: 'Swahili', value: 'sw' },
  { label: 'Hausa', value: 'ha' },
  { label: 'Yoruba', value: 'yo' },
  { label: 'Igbo', value: 'ig' }
]

const currencyOptions = [
  { label: 'Nigerian Naira (₦)', value: 'NGN' },
  { label: 'Kenyan Shilling (KSh)', value: 'KES' },
  { label: 'South African Rand (R)', value: 'ZAR' },
  { label: 'Ghanaian Cedi (₵)', value: 'GHS' },
  { label: 'Egyptian Pound (£)', value: 'EGP' },
  { label: 'Moroccan Dirham (DH)', value: 'MAD' },
  { label: 'US Dollar ($)', value: 'USD' },
  { label: 'Euro (€)', value: 'EUR' }
]

// Methods
const hasError = (field: string): boolean => {
  return !!(props.errors[field] && props.errors[field].length > 0)
}

const getError = (field: string): string => {
  return props.errors[field]?.[0] || ''
}

const handleSubmit = () => {
  emit('submit')
}
</script>

<style lang="sass" scoped>
.settings-form
  max-width: 600px
  margin: 0 auto

.q-input, .q-select
  .q-field__prepend
    .q-icon
      color: var(--q-primary)

@media (max-width: 600px)
  .row.q-gutter-md
    .col-md-6
      margin-bottom: 1rem

  .q-px-xl
    padding-left: 1rem !important
    padding-right: 1rem !important
</style>
