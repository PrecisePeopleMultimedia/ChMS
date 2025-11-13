<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <label for="country" class="text-sm font-medium">Country *</label>
      <ModernSelect
        id="country"
        v-model="localFormData.country"
        :options="countryOptions"
        placeholder="Select country"
        @update:model-value="updateFormData"
      />
    </div>

    <div class="space-y-2">
      <label for="city" class="text-sm font-medium">City *</label>
      <ModernInput
        id="city"
        v-model="localFormData.city"
        placeholder="e.g., Lagos, Nairobi, Accra"
        @update:model-value="updateFormData"
      />
    </div>

    <div class="space-y-2">
      <label for="address" class="text-sm font-medium">Physical Address *</label>
      <ModernInput
        id="address"
        v-model="localFormData.address"
        placeholder="Street address of main branch"
        @update:model-value="updateFormData"
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <label for="phone" class="text-sm font-medium">Phone Number *</label>
        <ModernInput
          id="phone"
          v-model="localFormData.phone"
          type="tel"
          placeholder="+234 800 000 0000"
          @update:model-value="updateFormData"
        />
      </div>

      <div class="space-y-2">
        <label for="email" class="text-sm font-medium">Email Address *</label>
        <ModernInput
          id="email"
          v-model="localFormData.email"
          type="email"
          placeholder="contact@church.org"
          @update:model-value="updateFormData"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ModernInput from '@/components/ui/ModernInput.vue'
import ModernSelect from '@/components/ui/ModernSelect.vue'

interface Props {
  modelValue: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
}>()

const countryOptions = [
  { label: '🇳🇬 Nigeria', value: 'Nigeria' },
  { label: '🇰🇪 Kenya', value: 'Kenya' },
  { label: '🇬🇭 Ghana', value: 'Ghana' },
  { label: '🇿🇦 South Africa', value: 'South Africa' },
  { label: '🇹🇿 Tanzania', value: 'Tanzania' },
  { label: '🇺🇬 Uganda', value: 'Uganda' },
]

const localFormData = ref({
  country: props.modelValue.country || '',
  city: props.modelValue.city || '',
  address: props.modelValue.address || '',
  phone: props.modelValue.phone || '',
  email: props.modelValue.email || '',
})

watch(() => props.modelValue, (newVal) => {
  localFormData.value = {
    country: newVal.country || '',
    city: newVal.city || '',
    address: newVal.address || '',
    phone: newVal.phone || '',
    email: newVal.email || '',
  }
}, { deep: true })

const updateFormData = () => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...localFormData.value,
  })
}
</script>

