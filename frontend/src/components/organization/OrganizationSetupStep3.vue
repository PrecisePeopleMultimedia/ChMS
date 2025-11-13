<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <label for="adminName" class="text-sm font-medium">Full Name *</label>
      <ModernInput
        id="adminName"
        v-model="localFormData.adminName"
        placeholder="Pastor John Doe"
        @update:model-value="updateFormData"
      />
    </div>

    <div class="space-y-2">
      <label for="adminEmail" class="text-sm font-medium">Email Address *</label>
      <ModernInput
        id="adminEmail"
        v-model="localFormData.adminEmail"
        type="email"
        placeholder="admin@church.org"
        @update:model-value="updateFormData"
      />
      <p class="text-xs text-muted-foreground">
        This will be your login email
      </p>
    </div>

    <div class="space-y-2">
      <label for="adminPhone" class="text-sm font-medium">Phone Number *</label>
      <ModernInput
        id="adminPhone"
        v-model="localFormData.adminPhone"
        type="tel"
        placeholder="+234 800 000 0000"
        @update:model-value="updateFormData"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ModernInput from '@/components/ui/ModernInput.vue'

interface Props {
  modelValue: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
}>()

const localFormData = ref({
  adminName: props.modelValue.adminName || '',
  adminEmail: props.modelValue.adminEmail || '',
  adminPhone: props.modelValue.adminPhone || '',
})

watch(() => props.modelValue, (newVal) => {
  localFormData.value = {
    adminName: newVal.adminName || '',
    adminEmail: newVal.adminEmail || '',
    adminPhone: newVal.adminPhone || '',
  }
}, { deep: true })

const updateFormData = () => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...localFormData.value,
  })
}
</script>

