<template>
  <div class="church-profile-form">
    <div class="text-h6 q-mb-md">Church Information</div>
    <div class="text-body2 text-grey-6 q-mb-lg">
      Please provide basic information about your church. You can update this later.
    </div>

    <q-form @submit="handleSubmit" class="q-gutter-md">
      <!-- Church Name -->
      <q-input
        v-model="formData.name"
        label="Church Name *"
        outlined
        :error="hasError('name')"
        :error-message="getError('name')"
        :loading="loading"
        maxlength="255"
        counter
        autofocus
        class="full-width"
      >
        <template v-slot:prepend>
          <q-icon name="church" />
        </template>
      </q-input>

      <!-- Address -->
      <q-input
        v-model="formData.address"
        label="Church Address"
        outlined
        type="textarea"
        rows="3"
        :error="hasError('address')"
        :error-message="getError('address')"
        :loading="loading"
        class="full-width"
      >
        <template v-slot:prepend>
          <q-icon name="location_on" />
        </template>
      </q-input>

      <!-- Contact Information Row -->
      <div class="row q-gutter-md">
        <div class="col-12 col-md-6">
          <q-input
            v-model="formData.phone"
            label="Phone Number"
            outlined
            :error="hasError('phone')"
            :error-message="getError('phone')"
            :loading="loading"
            maxlength="50"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="phone" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-6">
          <q-input
            v-model="formData.email"
            label="Email Address"
            outlined
            type="email"
            :error="hasError('email')"
            :error-message="getError('email')"
            :loading="loading"
            maxlength="255"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>
        </div>
      </div>

      <!-- Website -->
      <q-input
        v-model="formData.website"
        label="Website URL"
        outlined
        :error="hasError('website')"
        :error-message="getError('website')"
        :loading="loading"
        maxlength="255"
        class="full-width"
        placeholder="https://www.yourchurch.com"
      >
        <template v-slot:prepend>
          <q-icon name="language" />
        </template>
      </q-input>

      <!-- Timezone -->
      <q-select
        v-model="formData.timezone"
        label="Timezone"
        outlined
        :options="timezoneOptions"
        :error="hasError('timezone')"
        :error-message="getError('timezone')"
        :loading="loading"
        emit-value
        map-options
        class="full-width"
      >
        <template v-slot:prepend>
          <q-icon name="schedule" />
        </template>
      </q-select>

      <!-- Description -->
      <q-input
        v-model="formData.description"
        label="Church Description"
        outlined
        type="textarea"
        rows="4"
        :error="hasError('description')"
        :error-message="getError('description')"
        :loading="loading"
        maxlength="1000"
        counter
        class="full-width"
        placeholder="Tell us about your church, its mission, and community..."
      >
        <template v-slot:prepend>
          <q-icon name="description" />
        </template>
      </q-input>

      <!-- Form Actions -->
      <div class="row justify-end q-mt-lg">
        <q-btn
          type="submit"
          color="primary"
          label="Save & Continue"
          :loading="loading"
          :disable="!isValid"
          size="md"
          class="q-px-xl"
        />
      </div>
    </q-form>

    <!-- Offline Notice -->
    <q-banner
      v-if="!isOnline"
      class="bg-info text-white q-mt-md"
      rounded
    >
      <template v-slot:avatar>
        <q-icon name="info" />
      </template>
      Your information will be saved locally and synced when you're back online.
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

// Props
interface Props {
  modelValue: {
    name: string
    address?: string
    phone?: string
    email?: string
    website?: string
    description?: string
    timezone: string
  }
  loading?: boolean
  errors?: Record<string, string[]>
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  errors: () => ({})
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

const isOnline = computed(() => navigator.onLine)

const isValid = computed(() => {
  return formData.value.name.trim().length > 0
})

const timezoneOptions = [
  { label: 'West Africa Time (Lagos)', value: 'Africa/Lagos' },
  { label: 'Central Africa Time (Kinshasa)', value: 'Africa/Kinshasa' },
  { label: 'East Africa Time (Nairobi)', value: 'Africa/Nairobi' },
  { label: 'South Africa Time (Johannesburg)', value: 'Africa/Johannesburg' },
  { label: 'Egypt Time (Cairo)', value: 'Africa/Cairo' },
  { label: 'Morocco Time (Casablanca)', value: 'Africa/Casablanca' },
  { label: 'UTC', value: 'UTC' }
]

// Methods
const hasError = (field: string): boolean => {
  return !!(props.errors[field] && props.errors[field].length > 0)
}

const getError = (field: string): string => {
  return props.errors[field]?.[0] || ''
}

const handleSubmit = () => {
  if (isValid.value) {
    emit('submit')
  }
}

// Watch for changes and emit updates
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== formData.value) {
      emit('update:modelValue', newValue)
    }
  },
  { deep: true }
)
</script>

<style lang="sass" scoped>
.church-profile-form
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
