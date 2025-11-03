import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotesStore } from '../notes'
import type { MemberNote } from '@/types/notes'

// Mock the API
vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

describe('Notes Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty state', () => {
    const store = useNotesStore()
    
    expect(store.notes).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
    expect(store.filters).toEqual({
      privacy_level: '',
      note_type: '',
      is_alert: null,
      is_pinned: null,
      search: ''
    })
  })

  it('should compute pinned notes correctly', () => {
    const store = useNotesStore()
    
    const mockNotes: MemberNote[] = [
      {
        id: 1,
        member_id: 1,
        author_id: 1,
        title: 'Regular Note',
        content: 'This is a regular note',
        note_type: 'Personal Note',
        privacy_level: 'public',
        is_alert: false,
        is_pinned: false,
        alert_expires_at: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        author: { id: 1, first_name: 'John', last_name: 'Doe' },
        isAlertActive: () => false
      },
      {
        id: 2,
        member_id: 1,
        author_id: 1,
        title: 'Pinned Note',
        content: 'This is a pinned note',
        note_type: 'Personal Note',
        privacy_level: 'public',
        is_alert: false,
        is_pinned: true,
        alert_expires_at: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        author: { id: 1, first_name: 'John', last_name: 'Doe' },
        isAlertActive: () => false
      }
    ]
    
    store.notes = mockNotes
    
    expect(store.pinnedNotes).toHaveLength(1)
    expect(store.pinnedNotes[0].title).toBe('Pinned Note')
  })

  it('should compute alert notes correctly', () => {
    const store = useNotesStore()
    
    const mockNotes: MemberNote[] = [
      {
        id: 1,
        member_id: 1,
        author_id: 1,
        title: 'Alert Note',
        content: 'This is an alert note',
        note_type: 'Emergency',
        privacy_level: 'public',
        is_alert: true,
        is_pinned: false,
        alert_expires_at: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        author: { id: 1, first_name: 'John', last_name: 'Doe' },
        isAlertActive: () => true
      },
      {
        id: 2,
        member_id: 1,
        author_id: 1,
        title: 'Expired Alert',
        content: 'This is an expired alert',
        note_type: 'Emergency',
        privacy_level: 'public',
        is_alert: true,
        is_pinned: false,
        alert_expires_at: '2023-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        author: { id: 1, first_name: 'John', last_name: 'Doe' },
        isAlertActive: () => false
      }
    ]
    
    store.notes = mockNotes
    
    expect(store.alertNotes).toHaveLength(1)
    expect(store.alertNotes[0].title).toBe('Alert Note')
  })

  it('should group notes by type correctly', () => {
    const store = useNotesStore()
    
    const mockNotes: MemberNote[] = [
      {
        id: 1,
        member_id: 1,
        author_id: 1,
        title: 'Personal Note 1',
        content: 'Content 1',
        note_type: 'Personal Note',
        privacy_level: 'public',
        is_alert: false,
        is_pinned: false,
        alert_expires_at: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        author: { id: 1, first_name: 'John', last_name: 'Doe' },
        isAlertActive: () => false
      },
      {
        id: 2,
        member_id: 1,
        author_id: 1,
        title: 'Follow-up Note',
        content: 'Content 2',
        note_type: 'Follow-up',
        privacy_level: 'public',
        is_alert: false,
        is_pinned: false,
        alert_expires_at: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        author: { id: 1, first_name: 'John', last_name: 'Doe' },
        isAlertActive: () => false
      },
      {
        id: 3,
        member_id: 1,
        author_id: 1,
        title: 'Personal Note 2',
        content: 'Content 3',
        note_type: 'Personal Note',
        privacy_level: 'public',
        is_alert: false,
        is_pinned: false,
        alert_expires_at: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        author: { id: 1, first_name: 'John', last_name: 'Doe' },
        isAlertActive: () => false
      }
    ]
    
    store.notes = mockNotes
    
    expect(store.notesByType['Personal Note']).toHaveLength(2)
    expect(store.notesByType['Follow-up']).toHaveLength(1)
  })

  it('should handle fetch notes success', async () => {
    const { api } = await import('@/services/api')
    const store = useNotesStore()
    
    const mockResponse = {
      data: {
        data: [
          {
            id: 1,
            member_id: 1,
            title: 'Test Note',
            content: 'Test content'
          }
        ]
      }
    }
    
    vi.mocked(api.get).mockResolvedValueOnce(mockResponse)
    
    await store.fetchNotes(1)
    
    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
    expect(store.notes).toEqual(mockResponse.data.data)
    expect(api.get).toHaveBeenCalledWith('/members/1/notes', { params: undefined })
  })

  it('should handle fetch notes error', async () => {
    const { api } = await import('@/services/api')
    const store = useNotesStore()
    
    const mockError = {
      response: {
        data: {
          message: 'Failed to fetch notes'
        }
      }
    }
    
    vi.mocked(api.get).mockRejectedValueOnce(mockError)
    
    await store.fetchNotes(1)
    
    expect(store.loading).toBe(false)
    expect(store.error).toBe('Failed to fetch notes')
    expect(store.notes).toEqual([])
  })

  it('should handle create note success', async () => {
    const { api } = await import('@/services/api')
    const store = useNotesStore()
    
    const newNote = {
      title: 'New Note',
      content: 'New content',
      note_type: 'Personal Note',
      privacy_level: 'public'
    }
    
    const mockResponse = {
      data: {
        id: 1,
        ...newNote,
        member_id: 1,
        author_id: 1,
        is_alert: false,
        is_pinned: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    }
    
    vi.mocked(api.post).mockResolvedValueOnce(mockResponse)
    
    await store.createNote(1, newNote)
    
    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
    expect(store.notes).toContainEqual(mockResponse.data)
    expect(api.post).toHaveBeenCalledWith('/members/1/notes', newNote)
  })

  it('should handle update note success', async () => {
    const { api } = await import('@/services/api')
    const store = useNotesStore()
    
    // Set initial note
    store.notes = [{
      id: 1,
      member_id: 1,
      author_id: 1,
      title: 'Original Title',
      content: 'Original content',
      note_type: 'Personal Note',
      privacy_level: 'public',
      is_alert: false,
      is_pinned: false,
      alert_expires_at: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      author: { id: 1, first_name: 'John', last_name: 'Doe' },
      isAlertActive: () => false
    }]
    
    const updatedData = {
      title: 'Updated Title',
      content: 'Updated content'
    }
    
    const mockResponse = {
      data: {
        ...store.notes[0],
        ...updatedData,
        updated_at: '2024-01-02T00:00:00Z'
      }
    }
    
    vi.mocked(api.put).mockResolvedValueOnce(mockResponse)
    
    await store.updateNote(1, 1, updatedData)
    
    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
    expect(store.notes[0].title).toBe('Updated Title')
    expect(store.notes[0].content).toBe('Updated content')
    expect(api.put).toHaveBeenCalledWith('/members/1/notes/1', updatedData)
  })

  it('should handle delete note success', async () => {
    const { api } = await import('@/services/api')
    const store = useNotesStore()
    
    // Set initial notes
    store.notes = [
      {
        id: 1,
        member_id: 1,
        author_id: 1,
        title: 'Note 1',
        content: 'Content 1',
        note_type: 'Personal Note',
        privacy_level: 'public',
        is_alert: false,
        is_pinned: false,
        alert_expires_at: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        author: { id: 1, first_name: 'John', last_name: 'Doe' },
        isAlertActive: () => false
      },
      {
        id: 2,
        member_id: 1,
        author_id: 1,
        title: 'Note 2',
        content: 'Content 2',
        note_type: 'Personal Note',
        privacy_level: 'public',
        is_alert: false,
        is_pinned: false,
        alert_expires_at: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        author: { id: 1, first_name: 'John', last_name: 'Doe' },
        isAlertActive: () => false
      }
    ]
    
    vi.mocked(api.delete).mockResolvedValueOnce({ data: { message: 'Note deleted' } })
    
    await store.deleteNote(1, 1)
    
    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
    expect(store.notes).toHaveLength(1)
    expect(store.notes[0].id).toBe(2)
    expect(api.delete).toHaveBeenCalledWith('/members/1/notes/1')
  })
})
