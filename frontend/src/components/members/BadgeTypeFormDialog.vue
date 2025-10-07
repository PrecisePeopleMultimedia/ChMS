<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="full-width">
      <!-- Header -->
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          {{ isEditing ? 'Edit Badge Type' : 'Create Badge Type' }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeDialog" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="saveBadgeType" class="q-gutter-md">
          <!-- Badge Preview -->
          <div class="text-center q-mb-md">
            <div class="text-subtitle2 q-mb-sm">Preview</div>
            <q-chip
              :style="{
                backgroundColor: form.color,
                color: getContrastColor(form.color)
              }"
              size="lg"
              class="q-px-md"
            >
              <q-icon :name="form.icon" class="q-mr-sm" />
              {{ form.name || 'Badge Name' }}
            </q-chip>
          </div>

          <!-- Basic Information -->
          <div class="row q-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.name"
                label="Badge Name *"
                outlined
                :rules="[val => !!val || 'Badge name is required']"
                maxlength="100"
                counter
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.description"
                label="Description"
                outlined
                maxlength="1000"
                counter
              />
            </div>
          </div>

          <!-- Color and Icon -->
          <div class="row q-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.color"
                label="Badge Color *"
                outlined
                :rules="[
                  val => !!val || 'Color is required',
                  val => /^#[a-f0-9]{6}$/i.test(val) || 'Invalid hex color format'
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="palette" />
                </template>
                <template v-slot:append>
                  <q-btn
                    round
                    dense
                    flat
                    :style="{ backgroundColor: form.color }"
                    @click="showColorPicker = true"
                  />
                  <q-popup-proxy v-model="showColorPicker">
                    <q-color
                      v-model="form.color"
                      format-model="hex"
                      @change="showColorPicker = false"
                    />
                  </q-popup-proxy>
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="form.icon"
                :options="iconOptions"
                label="Icon *"
                outlined
                emit-value
                map-options
                :rules="[val => !!val || 'Icon is required']"
              >
                <template v-slot:selected>
                  <div class="row items-center">
                    <q-icon :name="form.icon" class="q-mr-sm" />
                    {{ getIconLabel(form.icon) }}
                  </div>
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-icon :name="scope.opt.value" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>

          <!-- Status -->
          <div class="row">
            <div class="col-12">
              <q-toggle
                v-model="form.is_active"
                label="Active"
                color="primary"
              />
              <div class="text-caption text-grey-6 q-mt-xs">
                Inactive badge types cannot be assigned to members
              </div>
            </div>
          </div>

          <!-- Predefined Colors -->
          <div class="q-mt-md">
            <div class="text-subtitle2 q-mb-sm">Quick Colors</div>
            <div class="row q-gutter-sm">
              <q-btn
                v-for="color in predefinedColors"
                :key="color"
                round
                size="sm"
                :style="{ backgroundColor: color }"
                @click="form.color = color"
                class="color-btn"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn
              label="Cancel"
              flat
              @click="closeDialog"
            />
            <q-btn
              label="Save"
              type="submit"
              color="primary"
              :loading="saving"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useBadgesStore } from '@/stores/badges'

interface BadgeType {
  id?: number
  name: string
  description?: string
  color: string
  icon: string
  is_active: boolean
}

interface Props {
  modelValue: boolean
  badgeType?: BadgeType | null
  availableIcons: Record<string, string>
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
}

const props = withDefaults(defineProps<Props>(), {
  badgeType: null,
  availableIcons: () => ({})
})

const emit = defineEmits<Emits>()

const $q = useQuasar()
const badgesStore = useBadgesStore()

// Reactive data
const saving = ref(false)
const showColorPicker = ref(false)

const form = ref<BadgeType>({
  name: '',
  description: '',
  color: '#007bff',
  icon: 'badge',
  is_active: true
})

// Predefined colors for quick selection
const predefinedColors = [
  '#007bff', // Primary blue
  '#28a745', // Success green
  '#ffc107', // Warning yellow
  '#dc3545', // Danger red
  '#6f42c1', // Purple
  '#20c997', // Teal
  '#fd7e14', // Orange
  '#6c757d', // Gray
  '#e83e8c', // Pink
  '#17a2b8', // Info cyan
]

// Computed properties
const isEditing = computed(() => !!props.badgeType?.id)

const iconOptions = computed(() => {
  return Object.entries(props.availableIcons).map(([value, label]) => ({
    value,
    label
  }))
})

// Methods
const getIconLabel = (iconValue: string): string => {
  return props.availableIcons[iconValue] || iconValue
}

const getContrastColor = (hexColor: string): string => {
  // Remove # if present
  const hex = hexColor.replace('#', '')
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    color: '#007bff',
    icon: 'badge',
    is_active: true
  }
}

const loadBadgeType = () => {
  if (props.badgeType) {
    form.value = { ...props.badgeType }
  } else {
    resetForm()
  }
}

const saveBadgeType = async () => {
  saving.value = true
  try {
    if (isEditing.value) {
      await badgesStore.updateBadgeType(props.badgeType!.id!, form.value)
      $q.notify({
        type: 'positive',
        message: 'Badge type updated successfully'
      })
    } else {
      await badgesStore.createBadgeType(form.value)
      $q.notify({
        type: 'positive',
        message: 'Badge type created successfully'
      })
    }
    
    emit('saved')
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to save badge type'
    })
  } finally {
    saving.value = false
  }
}

const closeDialog = () => {
  emit('update:modelValue', false)
  resetForm()
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    loadBadgeType()
  }
})

watch(() => props.badgeType, () => {
  if (props.modelValue) {
    loadBadgeType()
  }
})
</script>

<style scoped>
.color-btn {
  width: 32px;
  height: 32px;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.color-btn:hover {
  transform: scale(1.1);
}
</style>
