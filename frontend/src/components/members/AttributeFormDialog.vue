<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="attribute-form-dialog">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          {{ isEditing ? 'Edit Attribute' : 'Create New Attribute' }}
        </div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          @click="$emit('update:modelValue', false)"
        />
      </q-card-section>

      <q-form @submit="saveAttribute" class="full-height">
        <q-card-section class="q-pt-none scroll" style="max-height: calc(100vh - 120px)">
          <div class="row q-gutter-md">
            <!-- Left Column -->
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-subtitle1 q-mb-md">Basic Information</div>
                  
                  <q-input
                    v-model="form.name"
                    label="Display Name *"
                    outlined
                    :rules="[val => !!val || 'Name is required']"
                    class="q-mb-md"
                  />

                  <q-input
                    v-model="form.key"
                    label="Field Key *"
                    outlined
                    :rules="[
                      val => !!val || 'Key is required',
                      val => /^[a-z0-9_]+$/.test(val) || 'Key must contain only lowercase letters, numbers, and underscores'
                    ]"
                    hint="Used internally (e.g., baptism_date)"
                    class="q-mb-md"
                  />

                  <q-select
                    v-model="form.field_type"
                    :options="fieldTypeOptions"
                    label="Field Type *"
                    outlined
                    emit-value
                    map-options
                    :rules="[val => !!val || 'Field type is required']"
                    class="q-mb-md"
                  />

                  <q-select
                    v-model="form.category"
                    :options="categoryOptions"
                    label="Category *"
                    outlined
                    emit-value
                    map-options
                    :rules="[val => !!val || 'Category is required']"
                    class="q-mb-md"
                  />
                </q-card-section>
              </q-card>
            </div>

            <!-- Right Column -->
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-subtitle1 q-mb-md">Configuration</div>
                  
                  <q-input
                    v-model.number="form.display_order"
                    label="Display Order"
                    type="number"
                    outlined
                    min="0"
                    hint="Order in which this field appears"
                    class="q-mb-md"
                  />

                  <div class="row q-gutter-md q-mb-md">
                    <q-toggle
                      v-model="form.is_required"
                      label="Required Field"
                      color="primary"
                    />
                    <q-toggle
                      v-model="form.is_active"
                      label="Active"
                      color="positive"
                    />
                  </div>

                  <!-- Select Field Options -->
                  <div v-if="form.field_type === 'select'" class="q-mb-md">
                    <div class="text-subtitle2 q-mb-sm">Select Options</div>
                    <div v-for="(option, index) in selectOptions" :key="index" class="row q-gutter-sm q-mb-sm">
                      <q-input
                        v-model="selectOptions[index]"
                        :label="`Option ${index + 1}`"
                        outlined
                        dense
                        class="col"
                      />
                      <q-btn
                        icon="remove"
                        flat
                        round
                        dense
                        color="negative"
                        @click="removeSelectOption(index)"
                        :disable="selectOptions.length <= 1"
                      />
                    </div>
                    <q-btn
                      icon="add"
                      label="Add Option"
                      flat
                      color="primary"
                      @click="addSelectOption"
                      class="q-mt-sm"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Preview Section -->
          <q-card flat bordered class="q-mt-md">
            <q-card-section>
              <div class="text-subtitle1 q-mb-md">Preview</div>
              <AttributeValueInput
                :attribute="previewAttribute"
                :model-value="previewValue"
                @update:model-value="previewValue = $event"
                readonly
              />
            </q-card-section>
          </q-card>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            flat
            label="Cancel"
            @click="$emit('update:modelValue', false)"
          />
          <q-btn
            type="submit"
            color="primary"
            :label="isEditing ? 'Update' : 'Create'"
            :loading="saving"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAttributesStore } from '@/stores/attributes'
import AttributeValueInput from './AttributeValueInput.vue'

interface Props {
  modelValue: boolean
  attribute?: any
  categories: Record<string, string>
  fieldTypes: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  attribute: null
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'saved': []
}>()

const $q = useQuasar()
const attributesStore = useAttributesStore()

// Reactive data
const saving = ref(false)
const previewValue = ref('')
const selectOptions = ref([''])

const form = ref({
  name: '',
  key: '',
  field_type: 'text',
  category: 'Personal',
  field_options: null,
  is_required: false,
  is_active: true,
  display_order: 0
})

// Computed properties
const isEditing = computed(() => !!props.attribute)

const fieldTypeOptions = computed(() =>
  Object.entries(props.fieldTypes).map(([key, label]) => ({
    label,
    value: key
  }))
)

const categoryOptions = computed(() =>
  Object.entries(props.categories).map(([key, label]) => ({
    label,
    value: key
  }))
)

const previewAttribute = computed(() => ({
  ...form.value,
  field_options: form.value.field_type === 'select' 
    ? { options: selectOptions.value.filter(opt => opt.trim()) }
    : form.value.field_options
}))

// Methods
const resetForm = () => {
  form.value = {
    name: '',
    key: '',
    field_type: 'text',
    category: 'Personal',
    field_options: null,
    is_required: false,
    is_active: true,
    display_order: 0
  }
  selectOptions.value = ['']
  previewValue.value = ''
}

const loadAttributeData = () => {
  if (props.attribute) {
    form.value = { ...props.attribute }
    
    if (props.attribute.field_type === 'select' && props.attribute.field_options?.options) {
      selectOptions.value = [...props.attribute.field_options.options]
    } else {
      selectOptions.value = ['']
    }
  } else {
    resetForm()
  }
}

const addSelectOption = () => {
  selectOptions.value.push('')
}

const removeSelectOption = (index: number) => {
  if (selectOptions.value.length > 1) {
    selectOptions.value.splice(index, 1)
  }
}

const saveAttribute = async () => {
  saving.value = true
  
  try {
    const attributeData = { ...form.value }
    
    // Handle select field options
    if (attributeData.field_type === 'select') {
      const validOptions = selectOptions.value.filter(opt => opt.trim())
      if (validOptions.length === 0) {
        $q.notify({
          type: 'negative',
          message: 'Select fields must have at least one option'
        })
        return
      }
      attributeData.field_options = { options: validOptions }
    } else {
      attributeData.field_options = null
    }

    if (isEditing.value) {
      await attributesStore.updateAttribute(props.attribute.id, attributeData)
      $q.notify({
        type: 'positive',
        message: 'Attribute updated successfully'
      })
    } else {
      await attributesStore.createAttribute(attributeData)
      $q.notify({
        type: 'positive',
        message: 'Attribute created successfully'
      })
    }

    emit('saved')
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to save attribute'
    })
  } finally {
    saving.value = false
  }
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    loadAttributeData()
  }
})

watch(() => form.value.name, (newName) => {
  if (!isEditing.value && newName) {
    // Auto-generate key from name
    form.value.key = newName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
  }
})

// Lifecycle
onMounted(() => {
  if (props.modelValue) {
    loadAttributeData()
  }
})
</script>

<style scoped>
.attribute-form-dialog {
  width: 100%;
  max-width: 1200px;
}

@media (max-width: 768px) {
  .attribute-form-dialog {
    height: 100vh;
  }
}
</style>
