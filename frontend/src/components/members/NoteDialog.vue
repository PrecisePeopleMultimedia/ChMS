<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 500px; max-width: 800px">
      <q-card-section>
        <div class="text-h6">
          {{ isEditing ? 'Edit Note' : 'Add Note' }}
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="saveNote" class="q-gutter-md">
          <!-- Note Type -->
          <q-select
            v-model="form.note_type"
            :options="noteTypeOptions"
            label="Note Type *"
            emit-value
            map-options
            :rules="[val => !!val || 'Note type is required']"
          />

          <!-- Title -->
          <q-input
            v-model="form.title"
            label="Title (optional)"
            hint="Brief title for the note"
          />

          <!-- Content -->
          <q-input
            v-model="form.content"
            label="Content *"
            type="textarea"
            rows="4"
            :rules="[val => !!val || 'Content is required']"
          />

          <!-- Privacy Level -->
          <q-select
            v-model="form.privacy_level"
            :options="privacyLevelOptions"
            label="Privacy Level *"
            emit-value
            map-options
            :rules="[val => !!val || 'Privacy level is required']"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- Alert Settings -->
          <div class="row q-gutter-md">
            <div class="col">
              <q-checkbox
                v-model="form.is_alert"
                label="Mark as Alert"
                color="red"
              />
            </div>
            <div class="col">
              <q-checkbox
                v-model="form.is_pinned"
                label="Pin to Top"
                color="yellow"
              />
            </div>
          </div>

          <!-- Alert Expiry -->
          <q-input
            v-if="form.is_alert"
            v-model="form.alert_expires_at"
            label="Alert Expires (optional)"
            type="datetime-local"
            hint="When should this alert stop showing?"
          />

          <!-- Form Actions -->
          <div class="flex justify-end q-gutter-sm">
            <q-btn
              label="Cancel"
              color="secondary"
              @click="closeDialog"
              :disable="loading"
            />
            <q-btn
              type="submit"
              :label="isEditing ? 'Update Note' : 'Create Note'"
              color="primary"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useNotesStore } from '@/stores/notes'
import { NOTE_TYPES, PRIVACY_LEVELS, PRIVACY_LEVEL_DESCRIPTIONS } from '@/types/notes'
import type { MemberNote, NoteFormData } from '@/types/notes'

interface Props {
  modelValue: boolean
  note?: MemberNote | null
  memberId: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: []
}>()

const notesStore = useNotesStore()

// State
const showDialog = ref(props.modelValue)
const loading = ref(false)
const form = ref<NoteFormData>({
  title: '',
  content: '',
  note_type: 'Personal Note',
  privacy_level: 'public',
  is_alert: false,
  is_pinned: false,
  alert_expires_at: ''
})

// Computed
const isEditing = computed(() => !!props.note)

const noteTypeOptions = computed(() => 
  Object.entries(NOTE_TYPES).map(([value, label]) => ({ label, value }))
)

const privacyLevelOptions = computed(() => 
  Object.entries(PRIVACY_LEVELS).map(([value, label]) => ({
    label,
    value,
    description: PRIVACY_LEVEL_DESCRIPTIONS[value as keyof typeof PRIVACY_LEVEL_DESCRIPTIONS]
  }))
)

// Methods
const saveNote = async () => {
  loading.value = true
  
  try {
    if (isEditing.value && props.note) {
      await notesStore.updateNote(props.memberId, props.note.id, form.value)
    } else {
      await notesStore.createNote(props.memberId, form.value)
    }
    
    emit('saved')
    closeDialog()
  } catch (error) {
    console.error('Error saving note:', error)
  } finally {
    loading.value = false
  }
}

const closeDialog = () => {
  showDialog.value = false
  emit('update:modelValue', false)
  resetForm()
}

const resetForm = () => {
  form.value = {
    title: '',
    content: '',
    note_type: 'Personal Note',
    privacy_level: 'public',
    is_alert: false,
    is_pinned: false,
    alert_expires_at: ''
  }
}

const loadNoteData = () => {
  if (props.note) {
    form.value = {
      title: props.note.title || '',
      content: props.note.content,
      note_type: props.note.note_type,
      privacy_level: props.note.privacy_level,
      is_alert: props.note.is_alert,
      is_pinned: props.note.is_pinned,
      alert_expires_at: props.note.alert_expires_at || ''
    }
  } else {
    resetForm()
  }
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  showDialog.value = newValue
  if (newValue) {
    loadNoteData()
  }
})

watch(() => props.note, () => {
  if (showDialog.value) {
    loadNoteData()
  }
})

watch(showDialog, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>
