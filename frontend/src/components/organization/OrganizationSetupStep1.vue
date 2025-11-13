<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <label for="orgName" class="text-sm font-medium">Church Name *</label>
      <ModernInput
        id="orgName"
        v-model="localFormData.orgName"
        placeholder="e.g., Victory Chapel Ministry"
        @update:model-value="updateFormData"
      />
    </div>

    <div class="space-y-2">
      <label for="orgType" class="text-sm font-medium">Organization Type *</label>
      <ModernSelect
        id="orgType"
        v-model="localFormData.orgType"
        :options="[
          { label: 'Independent Church', value: 'independent' },
          { label: 'Denomination', value: 'denomination' },
          { label: 'Church Network', value: 'network' },
        ]"
        placeholder="Select type"
        @update:model-value="updateFormData"
      />
    </div>

    <div class="space-y-2">
      <label for="denomination" class="text-sm font-medium">Denomination (Optional)</label>
      <ModernInput
        id="denomination"
        v-model="localFormData.denomination"
        placeholder="e.g., Pentecostal, Baptist, etc."
        @update:model-value="updateFormData"
      />
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

const localFormData = ref({
  orgName: props.modelValue.orgName || '',
  orgType: props.modelValue.orgType || '',
  denomination: props.modelValue.denomination || '',
})

watch(() => props.modelValue, (newVal) => {
  localFormData.value = {
    orgName: newVal.orgName || '',
    orgType: newVal.orgType || '',
    denomination: newVal.denomination || '',
  }
}, { deep: true })

const updateFormData = () => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...localFormData.value,
  })
}
</script>

