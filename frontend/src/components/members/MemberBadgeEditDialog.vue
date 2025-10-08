<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card style="min-width: 400px; max-width: 500px">
      <!-- Header -->
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Edit Badge Assignment</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeDialog" />
      </q-card-section>

      <q-card-section v-if="badge">
        <q-form @submit="updateBadge" class="q-gutter-md">
          <!-- Badge Display -->
          <div class="text-center q-mb-md">
            <q-chip
              :style="{
                backgroundColor: badge.color,
                color: getContrastColor(badge.color)
              }"
              size="lg"
              class="q-px-md"
            >
              <q-icon :name="badge.icon" class="q-mr-sm" />
              {{ badge.name }}
            </q-chip>
            <div class="text-caption text-grey-6 q-mt-sm">
              {{ badge.description }}
            </div>
          </div>

          <!-- Current Assignment Info -->
          <q-card flat bordered class="q-pa-md q-mb-md">
            <div class="text-subtitle2 q-mb-sm">Current Assignment</div>
            <div class="text-body2">
              <div><strong>Assigned:</strong> {{ badge.assigned_at }}</div>
              <div v-if="badge.expires_at">
                <strong>Expires:</strong> {{ badge.expires_at }}
                <q-chip
                  v-if="badge.expiration_status === 'expiring_soon'"
                  color="warning"
                  text-color="white"
                  size="sm"
                  class="q-ml-sm"
                >
                  {{ badge.days_until_expiration }} days left
                </q-chip>
                <q-chip
                  v-else-if="badge.expiration_status === 'expired'"
                  color="negative"
                  text-color="white"
                  size="sm"
                  class="q-ml-sm"
                >
                  Expired
                </q-chip>
              </div>
              <div v-else><strong>Expires:</strong> Never</div>
              <div v-if="badge.assigned_by_name">
                <strong>Assigned by:</strong> {{ badge.assigned_by_name }}
              </div>
              <div v-if="badge.notes" class="q-mt-sm">
                <strong>Notes:</strong> {{ badge.notes }}
              </div>
            </div>
          </q-card>

          <!-- Edit Form -->
          <div class="text-subtitle2 q-mb-sm">Update Assignment</div>

          <!-- Expiration Date -->
          <q-input
            v-model="form.expires_at"
            label="Expiration Date"
            outlined
            type="date"
            :min="minDate"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="event" />
            </template>
            <template v-slot:hint>
              Leave empty for no expiration
            </template>
          </q-input>

          <!-- Notes -->
          <q-input
            v-model="form.notes"
            label="Notes"
            outlined
            type="textarea"
            rows="3"
            maxlength="1000"
            counter
            placeholder="Update reason for assignment or additional information..."
          />

          <!-- Preview Changes -->
          <q-card v-if="hasChanges" flat bordered class="q-pa-md bg-blue-1">
            <div class="text-subtitle2 q-mb-sm text-primary">
              <q-icon name="preview" class="q-mr-sm" />
              Preview Changes
            </div>
            <div class="text-body2">
              <div v-if="form.expires_at !== originalExpiresAt">
                <strong>New Expiration:</strong> 
                {{ form.expires_at ? formatDate(form.expires_at) : 'Never' }}
                <span v-if="form.expires_at" class="text-grey-6 q-ml-sm">
                  ({{ getDaysFromNow(form.expires_at) }} days from now)
                </span>
              </div>
              <div v-if="form.notes !== originalNotes" class="q-mt-sm">
                <strong>New Notes:</strong> {{ form.notes || 'None' }}
              </div>
            </div>
          </q-card>

          <!-- Actions -->
          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn
              label="Cancel"
              flat
              @click="closeDialog"
            />
            <q-btn
              label="Update Badge"
              type="submit"
              color="primary"
              :loading="updating"
              :disable="!hasChanges"
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

interface Badge {
  id: number
  member_id?: number // For badge assignment
  badge_type_id?: number // For badge type reference
  name: string
  description?: string
  color: string
  icon: string
  assigned_at: string
  expires_at?: string
  expiration_status: string
  days_until_expiration?: number
  notes?: string
  assigned_by_name?: string
}

interface Props {
  modelValue: boolean
  badge: Badge | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'updated'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const $q = useQuasar()
const badgesStore = useBadgesStore()

// Reactive data
const updating = ref(false)
const originalExpiresAt = ref('')
const originalNotes = ref('')

const form = ref({
  expires_at: '',
  notes: ''
})

// Computed properties
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const hasChanges = computed(() => {
  return form.value.expires_at !== originalExpiresAt.value ||
         form.value.notes !== originalNotes.value
})

// Methods
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

const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const getDaysFromNow = (dateString: string): number => {
  if (!dateString) return 0
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const loadBadgeData = () => {
  if (!props.badge) return

  // Convert expires_at to date format for input
  const expiresAt = props.badge.expires_at
  if (expiresAt) {
    const date = new Date(expiresAt)
    form.value.expires_at = date?.toISOString().split('T')[0] || ''
  } else {
    form.value.expires_at = ''
  }

  form.value.notes = props.badge.notes || ''

  // Store original values for comparison
  originalExpiresAt.value = form.value.expires_at
  originalNotes.value = form.value.notes
}

const resetForm = () => {
  form.value = {
    expires_at: '',
    notes: ''
  }
  originalExpiresAt.value = ''
  originalNotes.value = ''
}

const updateBadge = async () => {
  if (!props.badge || !hasChanges.value) return

  updating.value = true
  try {
    const updateData: any = {}

    if (form.value.expires_at !== originalExpiresAt.value) {
      updateData.expires_at = form.value.expires_at || null
    }

    if (form.value.notes !== originalNotes.value) {
      updateData.notes = form.value.notes || null
    }

    // Note: We need the member ID and badge type ID for the API call
    // This would typically come from the parent component or be stored in the badge object
    // For now, we'll assume the badge object has the necessary IDs
    await badgesStore.updateMemberBadge(
      props.badge.member_id || 0, // This would need to be passed or stored
      props.badge.badge_type_id || 0, // This would need to be passed or stored
      updateData
    )
    
    $q.notify({
      type: 'positive',
      message: 'Badge updated successfully'
    })
    
    emit('updated')
    closeDialog()
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to update badge'
    })
  } finally {
    updating.value = false
  }
}

const closeDialog = () => {
  emit('update:modelValue', false)
  resetForm()
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue && props.badge) {
    loadBadgeData()
  } else if (!newValue) {
    resetForm()
  }
})

watch(() => props.badge, () => {
  if (props.modelValue && props.badge) {
    loadBadgeData()
  }
})
</script>

<style scoped>
.q-chip {
  font-size: 0.75rem;
}
</style>
