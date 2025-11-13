<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <label for="timezone" class="text-sm font-medium">Timezone *</label>
      <ModernSelect
        id="timezone"
        v-model="localFormData.timezone"
        :options="timezoneOptions"
        placeholder="Select timezone"
        @update:model-value="updateFormData"
      />
    </div>

    <div class="space-y-2">
      <label for="currency" class="text-sm font-medium">Default Currency *</label>
      <ModernSelect
        id="currency"
        v-model="localFormData.currency"
        :options="currencyOptions"
        placeholder="Select currency"
        @update:model-value="updateFormData"
      />
    </div>

    <div class="space-y-2">
      <label for="language" class="text-sm font-medium">Primary Language *</label>
      <ModernSelect
        id="language"
        v-model="localFormData.language"
        :options="languageOptions"
        placeholder="Select language"
        @update:model-value="updateFormData"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ModernSelect from '@/components/ui/ModernSelect.vue'

interface Props {
  modelValue: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
}>()

const timezoneOptions = [
  { label: 'West Africa Time (WAT)', value: 'Africa/Lagos' },
  { label: 'East Africa Time (EAT)', value: 'Africa/Nairobi' },
  { label: 'South Africa Time (SAST)', value: 'Africa/Johannesburg' },
  { label: 'Greenwich Mean Time (GMT)', value: 'Africa/Accra' },
]

const currencyOptions = [
  { label: '🇳🇬 Nigerian Naira (NGN)', value: 'NGN' },
  { label: '🇰🇪 Kenyan Shilling (KES)', value: 'KES' },
  { label: '🇬🇭 Ghanaian Cedi (GHS)', value: 'GHS' },
  { label: '🇿🇦 South African Rand (ZAR)', value: 'ZAR' },
  { label: '🇹🇿 Tanzanian Shilling (TZS)', value: 'TZS' },
  { label: '🇺🇬 Ugandan Shilling (UGX)', value: 'UGX' },
  { label: '💵 US Dollar (USD)', value: 'USD' },
]

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Swahili', value: 'sw' },
]

const localFormData = ref({
  timezone: props.modelValue.timezone || '',
  currency: props.modelValue.currency || '',
  language: props.modelValue.language || '',
})

watch(() => props.modelValue, (newVal) => {
  localFormData.value = {
    timezone: newVal.timezone || '',
    currency: newVal.currency || '',
    language: newVal.language || '',
  }
}, { deep: true })

const updateFormData = () => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...localFormData.value,
  })
}
</script>

