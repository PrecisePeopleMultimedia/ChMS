<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card style="min-width: 400px; max-width: 500px">
      <!-- Header -->
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Assign Badge</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeDialog" />
      </q-card-section>

      <q-card-section>
        <q-form @submit="assignBadge" class="q-gutter-md">
          <!-- Badge Selection -->
          <q-select
            v-model="form.badge_type_id"
            :options="badgeOptions"
            label="Select Badge *"
            outlined
            emit-value
            map-options
            :rules="[val => !!val || 'Badge selection is required']"
          >
            <template v-slot:selected>
              <div v-if="selectedBadge" class="row items-center">
                <q-chip
                  :style="{
                    backgroundColor: selectedBadge.color,
                    color: getContrastColor(selectedBadge.color)
                  }"
                  size="sm"
                  class="q-mr-sm"
                >
                  <q-icon :name="selectedBadge.icon" class="q-mr-xs" size="xs" />
                  {{ selectedBadge.name }}
                </q-chip>
              </div>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <q-chip
                    :style="{
                      backgroundColor: scope.opt.color,
                      color: getContrastColor(scope.opt.color)
                    }"
                    size="sm"
                  >
                    <q-icon :name="scope.opt.icon" size="xs" />
                  </q-chip>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- Expiration Date -->
          <q-input
            v-model="form.expires_at"
            label="Expiration Date (Optional)"
            outlined
            type="date"
            :min="minDate"
          >
            <template v-slot:prepend>
              <q-icon name="event" />
            </template>
            <template v-slot:append>
              <q-btn
                v-if="form.expires_at"
                icon="clear"
                flat
                round
                dense
                @click="form.expires_at = ''"
              />
            </template>
          </q-input>

          <!-- Notes -->
          <q-input
            v-model="form.notes"
            label="Notes (Optional)"
            outlined
            type="textarea"
            rows="3"
            maxlength="1000"
            counter
            placeholder="Reason for assignment or additional information..."
          />

          <!-- Preview -->
          <div v-if="selectedBadge" class="q-mt-md">
            <div class="text-subtitle2 q-mb-sm">Preview</div>
            <q-card flat bordered class="q-pa-md text-center">
              <q-chip
                :style="{
                  backgroundColor: selectedBadge.color,
                  color: getContrastColor(selectedBadge.color)
                }"
                size="lg"
                class="q-px-md"
              >
                <q-icon :name="selectedBadge.icon" class="q-mr-sm" />
                {{ selectedBadge.name }}
              </q-chip>
              <div class="text-caption text-grey-6 q-mt-sm">
                {{ selectedBadge.description }}
              </div>
              <div v-if="form.expires_at" class="text-caption text-warning q-mt-xs">
                Expires: {{ formatDate(form.expires_at) }}
              </div>
            </q-card>
          </div>

          <!-- Actions -->
          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn
              label="Cancel"
              flat
              @click="closeDialog"
            />
            <q-btn
              label="Assign Badge"
              type="submit"
              color="primary"
              :loading="assigning"
              :disable="!form.badge_type_id"
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

interface Props {
  modelValue: boolean
  memberId: number
  availableBadges: Array<{
    id: number
    name: string
    description?: string
    color: string
    icon: string
  }>
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'assigned'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const $q = useQuasar()
const badgesStore = useBadgesStore()

// Reactive data
const assigning = ref(false)

const form = ref({
  badge_type_id: null as number | null,
  expires_at: '',
  notes: ''
})

// Computed properties
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const badgeOptions = computed(() => {
  return props.availableBadges.map(badge => ({
    value: badge.id,
    label: badge.name,
    description: badge.description,
    color: badge.color,
    icon: badge.icon
  }))
})

const selectedBadge = computed(() => {
  if (!form.value.badge_type_id) return null
  return props.availableBadges.find(badge => badge.id === form.value.badge_type_id)
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

const resetForm = () => {
  form.value = {
    badge_type_id: null,
    expires_at: '',
    notes: ''
  }
}

const assignBadge = async () => {
  if (!form.value.badge_type_id) return

  assigning.value = true
  try {
    const badgeData: any = {
      badge_type_id: form.value.badge_type_id
    }

    if (form.value.expires_at) {
      badgeData.expires_at = form.value.expires_at
    }

    if (form.value.notes) {
      badgeData.notes = form.value.notes
    }

    await badgesStore.assignMemberBadge(props.memberId, badgeData)
    
    $q.notify({
      type: 'positive',
      message: 'Badge assigned successfully'
    })
    
    emit('assigned')
    closeDialog()
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to assign badge'
    })
  } finally {
    assigning.value = false
  }
}

const closeDialog = () => {
  emit('update:modelValue', false)
  resetForm()
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    resetForm()
  }
})
</script>

<style scoped>
.q-chip {
  font-size: 0.75rem;
}
</style>
