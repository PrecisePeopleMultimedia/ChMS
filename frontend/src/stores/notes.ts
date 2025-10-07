import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MemberNote, NoteFilters, NoteSearchParams } from '@/types/notes'
import { api } from '@/services/api'

export const useNotesStore = defineStore('notes', () => {
  // State
  const notes = ref<MemberNote[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<NoteFilters>({
    privacy_level: '',
    note_type: '',
    is_alert: null,
    is_pinned: null,
    search: ''
  })

  // Computed
  const pinnedNotes = computed(() => 
    notes.value.filter(note => note.is_pinned)
  )

  const alertNotes = computed(() => 
    notes.value.filter(note => note.is_alert && note.isAlertActive())
  )

  const notesByType = computed(() => {
    const grouped: Record<string, MemberNote[]> = {}
    notes.value.forEach(note => {
      if (!grouped[note.note_type]) {
        grouped[note.note_type] = []
      }
      grouped[note.note_type]?.push(note)
    })
    return grouped
  })

  // Actions
  const fetchNotes = async (memberId: number, params?: NoteSearchParams) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/members/${memberId}/notes`, { params })
      notes.value = response.data.data || response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch notes'
      console.error('Error fetching notes:', err)
    } finally {
      loading.value = false
    }
  }

  const createNote = async (memberId: number, noteData: Partial<MemberNote>) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post(`/members/${memberId}/notes`, noteData)
      const newNote = response.data
      notes.value.unshift(newNote)
      return newNote
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create note'
      console.error('Error creating note:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateNote = async (memberId: number, noteId: number, noteData: Partial<MemberNote>) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put(`/members/${memberId}/notes/${noteId}`, noteData)
      const updatedNote = response.data
      const index = notes.value.findIndex(note => note.id === noteId)
      if (index !== -1) {
        notes.value[index] = updatedNote
      }
      return updatedNote
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update note'
      console.error('Error updating note:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteNote = async (memberId: number, noteId: number) => {
    loading.value = true
    error.value = null
    
    try {
      await api.delete(`/members/${memberId}/notes/${noteId}`)
      const index = notes.value.findIndex(note => note.id === noteId)
      if (index !== -1) {
        notes.value.splice(index, 1)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete note'
      console.error('Error deleting note:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchNotes = async (params: NoteSearchParams) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/notes/search', { params })
      return response.data.data || response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to search notes'
      console.error('Error searching notes:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getNoteTypes = async () => {
    try {
      const response = await api.get('/notes/types')
      return response.data
    } catch (err: any) {
      console.error('Error fetching note types:', err)
      return {}
    }
  }

  const getPrivacyLevels = async () => {
    try {
      const response = await api.get('/notes/privacy-levels')
      return response.data
    } catch (err: any) {
      console.error('Error fetching privacy levels:', err)
      return {}
    }
  }

  const setFilters = (newFilters: Partial<NoteFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {
      privacy_level: '',
      note_type: '',
      is_alert: null,
      is_pinned: null,
      search: ''
    }
  }

  const clearNotes = () => {
    notes.value = []
    error.value = null
  }

  return {
    // State
    notes,
    loading,
    error,
    filters,
    
    // Computed
    pinnedNotes,
    alertNotes,
    notesByType,
    
    // Actions
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    getNoteTypes,
    getPrivacyLevels,
    setFilters,
    clearFilters,
    clearNotes
  }
})
