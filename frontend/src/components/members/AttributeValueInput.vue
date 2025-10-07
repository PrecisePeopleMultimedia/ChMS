<template>
  <div class="attribute-value-input">
    <!-- Text Input -->
    <q-input
      v-if="attribute.field_type === 'text'"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :label="attribute.name"
      :outlined="!readonly"
      :readonly="readonly"
      :required="attribute.is_required"
      :rules="validationRules"
      maxlength="255"
      class="full-width"
    >
      <template v-if="attribute.is_required" v-slot:append>
        <q-icon name="star" color="red" size="xs" />
      </template>
    </q-input>

    <!-- Textarea Input -->
    <q-input
      v-else-if="attribute.field_type === 'textarea'"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :label="attribute.name"
      type="textarea"
      :outlined="!readonly"
      :readonly="readonly"
      :required="attribute.is_required"
      :rules="validationRules"
      rows="3"
      maxlength="65535"
      class="full-width"
    >
      <template v-if="attribute.is_required" v-slot:append>
        <q-icon name="star" color="red" size="xs" />
      </template>
    </q-input>

    <!-- Number Input -->
    <q-input
      v-else-if="attribute.field_type === 'number'"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :label="attribute.name"
      type="number"
      :outlined="!readonly"
      :readonly="readonly"
      :required="attribute.is_required"
      :rules="validationRules"
      class="full-width"
    >
      <template v-if="attribute.is_required" v-slot:append>
        <q-icon name="star" color="red" size="xs" />
      </template>
    </q-input>

    <!-- Date Input -->
    <q-input
      v-else-if="attribute.field_type === 'date'"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :label="attribute.name"
      :outlined="!readonly"
      :readonly="readonly"
      :required="attribute.is_required"
      :rules="validationRules"
      class="full-width"
    >
      <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy
            v-if="!readonly"
            cover
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              :model-value="modelValue"
              @update:model-value="$emit('update:modelValue', $event)"
              mask="YYYY-MM-DD"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
      <template v-if="attribute.is_required" v-slot:append>
        <q-icon name="star" color="red" size="xs" />
      </template>
    </q-input>

    <!-- Boolean Input -->
    <div v-else-if="attribute.field_type === 'boolean'" class="q-field">
      <q-toggle
        :model-value="modelValue === 'true' || modelValue === true"
        @update:model-value="$emit('update:modelValue', $event)"
        :label="attribute.name"
        :disable="readonly"
        color="primary"
      />
      <q-icon
        v-if="attribute.is_required"
        name="star"
        color="red"
        size="xs"
        class="q-ml-sm"
      />
    </div>

    <!-- Select Input -->
    <q-select
      v-else-if="attribute.field_type === 'select'"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :options="selectOptions"
      :label="attribute.name"
      :outlined="!readonly"
      :readonly="readonly"
      :required="attribute.is_required"
      :rules="validationRules"
      clearable
      class="full-width"
    >
      <template v-if="attribute.is_required" v-slot:append>
        <q-icon name="star" color="red" size="xs" />
      </template>
    </q-select>

    <!-- Email Input -->
    <q-input
      v-else-if="attribute.field_type === 'email'"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :label="attribute.name"
      type="email"
      :outlined="!readonly"
      :readonly="readonly"
      :required="attribute.is_required"
      :rules="validationRules"
      maxlength="255"
      class="full-width"
    >
      <template v-slot:prepend>
        <q-icon name="email" />
      </template>
      <template v-if="attribute.is_required" v-slot:append>
        <q-icon name="star" color="red" size="xs" />
      </template>
    </q-input>

    <!-- Phone Input -->
    <q-input
      v-else-if="attribute.field_type === 'phone'"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :label="attribute.name"
      type="tel"
      :outlined="!readonly"
      :readonly="readonly"
      :required="attribute.is_required"
      :rules="validationRules"
      maxlength="20"
      class="full-width"
    >
      <template v-slot:prepend>
        <q-icon name="phone" />
      </template>
      <template v-if="attribute.is_required" v-slot:append>
        <q-icon name="star" color="red" size="xs" />
      </template>
    </q-input>

    <!-- Fallback for unknown types -->
    <q-input
      v-else
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :label="attribute.name"
      :outlined="!readonly"
      :readonly="readonly"
      :required="attribute.is_required"
      class="full-width"
    >
      <template v-if="attribute.is_required" v-slot:append>
        <q-icon name="star" color="red" size="xs" />
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  attribute: {
    id: number
    name: string
    field_type: string
    is_required: boolean
    field_options?: {
      options?: string[]
    }
  }
  modelValue: any
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false
})

defineEmits<{
  'update:modelValue': [value: any]
}>()

// Computed properties
const selectOptions = computed(() => {
  if (props.attribute.field_type === 'select' && props.attribute.field_options?.options) {
    return props.attribute.field_options.options
  }
  return []
})

const validationRules = computed(() => {
  const rules: Array<(val: any) => boolean | string> = []

  // Required validation
  if (props.attribute.is_required) {
    rules.push((val: any) => {
      if (props.attribute.field_type === 'boolean') {
        return val !== null && val !== undefined
      }
      return !!val || `${props.attribute.name} is required`
    })
  }

  // Type-specific validation
  switch (props.attribute.field_type) {
    case 'email':
      rules.push((val: string) => {
        if (!val) return true // Allow empty if not required
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(val) || 'Please enter a valid email address'
      })
      break

    case 'number':
      rules.push((val: any) => {
        if (!val && val !== 0) return true // Allow empty if not required
        return !isNaN(Number(val)) || 'Please enter a valid number'
      })
      break

    case 'date':
      rules.push((val: string) => {
        if (!val) return true // Allow empty if not required
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        return dateRegex.test(val) || 'Please enter a valid date (YYYY-MM-DD)'
      })
      break

    case 'phone':
      rules.push((val: string) => {
        if (!val) return true // Allow empty if not required
        const phoneRegex = /^[\d\s\-\+\(\)]+$/
        return phoneRegex.test(val) || 'Please enter a valid phone number'
      })
      break

    case 'select':
      if (selectOptions.value.length > 0) {
        rules.push((val: string) => {
          if (!val) return true // Allow empty if not required
          return selectOptions.value.includes(val) || 'Please select a valid option'
        })
      }
      break
  }

  return rules
})
</script>

<style scoped>
.attribute-value-input {
  width: 100%;
}

.q-field {
  margin-bottom: 16px;
}
</style>
