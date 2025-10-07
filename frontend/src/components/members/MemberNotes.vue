<template>
  <div class="member-notes">
    <!-- Header with Add Note Button -->
    <div class="notes-header">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Notes
        <span v-if="notesStore.alertNotes.length > 0" class="ml-2">
          <q-badge color="red" :label="notesStore.alertNotes.length" />
        </span>
      </h3>
      <q-btn
        color="primary"
        icon="add"
        label="Add Note"
        @click="showAddNoteDialog = true"
        :loading="notesStore.loading"
      />
    </div>

    <!-- Filters -->
    <div class="notes-filters mb-4">
      <q-card flat bordered>
        <q-card-section>
          <div class="row q-gutter-md">
            <div class="col-12 col-md-3">
              <q-select
                v-model="filters.note_type"
                :options="noteTypeOptions"
                label="Note Type"
                clearable
                emit-value
                map-options
              />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="filters.privacy_level"
                :options="privacyLevelOptions"
                label="Privacy Level"
                clearable
                emit-value
                map-options
              />
            </div>
            <div class="col-12 col-md-2">
              <q-checkbox
                v-model="filters.is_alert"
                label="Alerts Only"
                :true-value="true"
                :false-value="null"
              />
            </div>
            <div class="col-12 col-md-2">
              <q-checkbox
                v-model="filters.is_pinned"
                label="Pinned Only"
                :true-value="true"
                :false-value="null"
              />
            </div>
            <div class="col-12 col-md-2">
              <q-btn
                color="secondary"
                icon="clear"
                label="Clear"
                @click="clearFilters"
                flat
              />
            </div>
          </div>
          <div class="row q-mt-md">
            <div class="col-12">
              <q-input
                v-model="filters.search"
                label="Search notes..."
                clearable
                @update:model-value="onSearchChange"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Alert Notes (if any) -->
    <div v-if="notesStore.alertNotes.length > 0" class="alert-notes mb-4">
      <q-card flat bordered class="bg-red-50 dark:bg-red-900/20">
        <q-card-section>
          <div class="text-red-600 dark:text-red-400 font-semibold mb-2">
            <q-icon name="warning" class="q-mr-sm" />
            Active Alerts
          </div>
          <div class="row q-gutter-sm">
            <div
              v-for="note in notesStore.alertNotes"
              :key="`alert-${note.id}`"
              class="col-12 col-md-6"
            >
              <q-card flat bordered class="bg-white dark:bg-gray-800">
                <q-card-section class="q-pa-sm">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <q-icon name="warning" color="red" class="q-mr-sm" />
                      <span class="font-medium">{{ note.title || 'Alert Note' }}</span>
                    </div>
                    <q-btn
                      icon="edit"
                      size="sm"
                      flat
                      round
                      @click="editNote(note)"
                    />
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {{ note.content.substring(0, 100) }}{{ note.content.length > 100 ? '...' : '' }}
                  </div>
                  <div class="text-xs text-gray-500 mt-2">
                    {{ formatDate(note.created_at) }} • {{ note.author?.first_name }} {{ note.author?.last_name }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Pinned Notes -->
    <div v-if="notesStore.pinnedNotes.length > 0" class="pinned-notes mb-4">
      <q-card flat bordered class="bg-yellow-50 dark:bg-yellow-900/20">
        <q-card-section>
          <div class="text-yellow-600 dark:text-yellow-400 font-semibold mb-2">
            <q-icon name="push_pin" class="q-mr-sm" />
            Pinned Notes
          </div>
          <div class="row q-gutter-sm">
            <div
              v-for="note in notesStore.pinnedNotes"
              :key="`pinned-${note.id}`"
              class="col-12 col-md-6"
            >
              <NoteCard :note="note" @edit="editNote" @delete="deleteNote" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Regular Notes -->
    <div class="regular-notes">
      <div v-if="notesStore.loading" class="text-center q-pa-lg">
        <q-spinner size="40px" color="primary" />
        <div class="q-mt-sm">Loading notes...</div>
      </div>

      <div v-else-if="filteredNotes.length === 0" class="text-center q-pa-lg text-gray-500">
        <q-icon name="note" size="48px" class="q-mb-sm" />
        <div>No notes found</div>
        <div class="text-sm">Add a note to get started</div>
      </div>

      <div v-else class="row q-gutter-md">
        <div
          v-for="note in filteredNotes"
          :key="note.id"
          class="col-12 col-md-6 col-lg-4"
        >
          <NoteCard :note="note" @edit="editNote" @delete="deleteNote" />
        </div>
      </div>
    </div>

    <!-- Add/Edit Note Dialog -->
    <NoteDialog
      v-model="showAddNoteDialog"
      :note="editingNote"
      :member-id="memberId"
      @saved="onNoteSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useNotesStore } from '@/stores/notes'
import { NOTE_TYPES, PRIVACY_LEVELS } from '@/types/notes'
import type { MemberNote, NoteFilters } from '@/types/notes'
import NoteCard from './NoteCard.vue'
import NoteDialog from './NoteDialog.vue'

interface Props {
  memberId: number
}

const props = defineProps<Props>()

const notesStore = useNotesStore()

// State
const showAddNoteDialog = ref(false)
const editingNote = ref<MemberNote | null>(null)
const filters = ref<NoteFilters>({
  privacy_level: '',
  note_type: '',
  is_alert: null,
  is_pinned: null,
  search: ''
})

// Computed
const noteTypeOptions = computed(() => [
  { label: 'All Types', value: '' },
  ...Object.entries(NOTE_TYPES).map(([value, label]) => ({ label, value }))
])

const privacyLevelOptions = computed(() => [
  { label: 'All Privacy Levels', value: '' },
  ...Object.entries(PRIVACY_LEVELS).map(([value, label]) => ({ label, value }))
])

const filteredNotes = computed(() => {
  let filtered = notesStore.notes

  // Filter out pinned and alert notes (they're shown separately)
  filtered = filtered.filter(note => !note.is_pinned && !note.is_alert)

  // Apply filters
  if (filters.value.note_type) {
    filtered = filtered.filter(note => note.note_type === filters.value.note_type)
  }

  if (filters.value.privacy_level) {
    filtered = filtered.filter(note => note.privacy_level === filters.value.privacy_level)
  }

  if (filters.value.is_alert !== null) {
    filtered = filtered.filter(note => note.is_alert === filters.value.is_alert)
  }

  if (filters.value.is_pinned !== null) {
    filtered = filtered.filter(note => note.is_pinned === filters.value.is_pinned)
  }

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(note => 
      note.title?.toLowerCase().includes(search) ||
      note.content.toLowerCase().includes(search)
    )
  }

  return filtered
})

// Methods
const loadNotes = async () => {
  await notesStore.fetchNotes(props.memberId, filters.value)
}

const editNote = (note: MemberNote) => {
  editingNote.value = note
  showAddNoteDialog.value = true
}

const deleteNote = async (note: MemberNote) => {
  if (confirm('Are you sure you want to delete this note?')) {
    try {
      await notesStore.deleteNote(props.memberId, note.id)
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }
}

const onNoteSaved = () => {
  showAddNoteDialog.value = false
  editingNote.value = null
  loadNotes()
}

const clearFilters = () => {
  filters.value = {
    privacy_level: '',
    note_type: '',
    is_alert: null,
    is_pinned: null,
    search: ''
  }
  loadNotes()
}

const onSearchChange = () => {
  // Debounce search
  setTimeout(() => {
    loadNotes()
  }, 300)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Watchers
watch(() => props.memberId, () => {
  loadNotes()
}, { immediate: true })

watch(filters, () => {
  loadNotes()
}, { deep: true })

// Lifecycle
onMounted(() => {
  loadNotes()
})
</script>

<style scoped>
.member-notes {
  @apply space-y-4;
}

.notes-header {
  @apply flex items-center justify-between;
}

.notes-filters {
  @apply bg-gray-50 dark:bg-gray-800 rounded-lg p-4;
}

.alert-notes {
  @apply border-l-4 border-red-500;
}

.pinned-notes {
  @apply border-l-4 border-yellow-500;
}
</style>
