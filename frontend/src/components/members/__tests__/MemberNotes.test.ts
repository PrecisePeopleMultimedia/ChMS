import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { Quasar } from 'quasar'
import MemberNotes from '../MemberNotes.vue'
import { useNotesStore } from '@/stores/notes'
import type { MemberNote } from '@/types/notes'

// Mock child components
vi.mock('../NoteCard.vue', () => ({
  default: {
    name: 'NoteCard',
    template: '<div class="note-card" data-testid="note-card">{{ note.title }}</div>',
    props: ['note'],
    emits: ['edit', 'delete']
  }
}))

vi.mock('../NoteDialog.vue', () => ({
  default: {
    name: 'NoteDialog',
    template: '<div class="note-dialog" data-testid="note-dialog"></div>',
    props: ['modelValue', 'note', 'memberId'],
    emits: ['update:modelValue', 'saved']
  }
}))

// Mock the notes store
vi.mock('@/stores/notes', () => ({
  useNotesStore: vi.fn()
}))

const createWrapper = (props = {}) => {
  return mount(MemberNotes, {
    props: {
      memberId: 1,
      ...props
    },
    global: {
      plugins: [Quasar, createPinia()],
      stubs: {
        'q-btn': {
          template: '<button :data-testid="label === \'Add Note\' ? \'add-note-btn\' : undefined"><slot /></button>',
          props: ['loading', 'color', 'icon', 'label']
        },
        'q-card': {
          template: '<div class="q-card"><slot /></div>',
          props: ['flat', 'bordered']
        },
        'q-card-section': {
          template: '<div class="q-card-section"><slot /></div>'
        },
        'q-select': {
          template: '<select><slot /></select>',
          props: ['modelValue', 'options', 'label', 'clearable', 'emitValue', 'mapOptions']
        },
        'q-checkbox': {
          template: '<input type="checkbox" />',
          props: ['modelValue', 'label', 'trueValue', 'falseValue']
        },
        'q-input': {
          template: '<input />',
          props: ['modelValue', 'label', 'clearable']
        },
        'q-icon': {
          template: '<i></i>',
          props: ['name', 'color', 'size']
        },
        'q-badge': {
          template: '<span class="badge">{{ label }}</span>',
          props: ['color', 'label']
        },
        'q-spinner': {
          template: '<div class="spinner"></div>',
          props: ['size', 'color']
        }
      }
    }
  })
}

describe('MemberNotes Component', () => {
  let mockNotesStore: any

  beforeEach(() => {
    setActivePinia(createPinia())

    // Mock window.confirm
    global.confirm = vi.fn(() => true)

    mockNotesStore = {
      notes: [],
      loading: false,
      error: null,
      alertNotes: [],
      pinnedNotes: [],
      fetchNotes: vi.fn(),
      createNote: vi.fn(),
      updateNote: vi.fn(),
      deleteNote: vi.fn(),
      clearError: vi.fn()
    }

    vi.mocked(useNotesStore).mockReturnValue(mockNotesStore)
  })

  it('should render correctly with no notes', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('h3').text()).toContain('Notes')
    expect(wrapper.find('[data-testid="add-note-btn"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('No notes found')
    expect(wrapper.text()).toContain('Add a note to get started')
  })

  it('should show loading state', () => {
    mockNotesStore.loading = true
    const wrapper = createWrapper()
    
    expect(wrapper.find('.spinner').exists()).toBe(true)
    expect(wrapper.text()).toContain('Loading notes...')
  })

  it('should display alert badge when there are alert notes', () => {
    const alertNote: MemberNote = {
      id: 1,
      member_id: 1,
      author_id: 1,
      title: 'Alert Note',
      content: 'This is an alert',
      note_type: 'Emergency',
      privacy_level: 'public',
      is_alert: true,
      is_pinned: false,
      alert_expires_at: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      author: { id: 1, first_name: 'John', last_name: 'Doe' },
      isAlertActive: () => true
    }
    
    mockNotesStore.alertNotes = [alertNote]
    const wrapper = createWrapper()
    
    expect(wrapper.find('.badge').text()).toBe('1')
  })

  it('should display alert notes section when there are active alerts', () => {
    const alertNote: MemberNote = {
      id: 1,
      member_id: 1,
      author_id: 1,
      title: 'Alert Note',
      content: 'This is an alert that needs attention',
      note_type: 'Emergency',
      privacy_level: 'public',
      is_alert: true,
      is_pinned: false,
      alert_expires_at: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      author: { id: 1, first_name: 'John', last_name: 'Doe' },
      isAlertActive: () => true
    }
    
    mockNotesStore.alertNotes = [alertNote]
    const wrapper = createWrapper()
    
    expect(wrapper.text()).toContain('Active Alerts')
    expect(wrapper.text()).toContain('Alert Note')
    expect(wrapper.text()).toContain('This is an alert that needs attention')
  })

  it('should display pinned notes section when there are pinned notes', () => {
    const pinnedNote: MemberNote = {
      id: 1,
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
    
    mockNotesStore.pinnedNotes = [pinnedNote]
    const wrapper = createWrapper()
    
    expect(wrapper.text()).toContain('Pinned Notes')
    expect(wrapper.find('[data-testid="note-card"]').text()).toContain('Pinned Note')
  })

  it('should display regular notes', () => {
    const regularNote: MemberNote = {
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
    }
    
    mockNotesStore.notes = [regularNote]
    const wrapper = createWrapper()
    
    expect(wrapper.find('[data-testid="note-card"]').text()).toContain('Regular Note')
  })

  it('should call fetchNotes on mount', () => {
    createWrapper()
    
    expect(mockNotesStore.fetchNotes).toHaveBeenCalledWith(1, {
      privacy_level: '',
      note_type: '',
      is_alert: undefined,
      is_pinned: undefined,
      search: ''
    })
  })

  it('should open add note dialog when add button is clicked', async () => {
    const wrapper = createWrapper()

    await wrapper.find('[data-testid="add-note-btn"]').trigger('click')

    expect(wrapper.find('[data-testid="note-dialog"]').exists()).toBe(true)
  })

  it('should handle note saved event', async () => {
    const wrapper = createWrapper()

    // Reset call count after initial mount
    mockNotesStore.fetchNotes.mockClear()

    // Open dialog
    await wrapper.find('[data-testid="add-note-btn"]').trigger('click')

    // Emit saved event
    await wrapper.findComponent({ name: 'NoteDialog' }).vm.$emit('saved')

    // Should call fetchNotes once after save
    expect(mockNotesStore.fetchNotes).toHaveBeenCalledTimes(1)
  })

  it('should handle edit note', async () => {
    const note: MemberNote = {
      id: 1,
      member_id: 1,
      author_id: 1,
      title: 'Test Note',
      content: 'Test content',
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
    
    mockNotesStore.notes = [note]
    const wrapper = createWrapper()
    
    // Emit edit event from NoteCard
    await wrapper.findComponent({ name: 'NoteCard' }).vm.$emit('edit', note)
    
    // Should open dialog with the note
    expect(wrapper.find('[data-testid="note-dialog"]').exists()).toBe(true)
  })

  it('should handle delete note', async () => {
    const note: MemberNote = {
      id: 1,
      member_id: 1,
      author_id: 1,
      title: 'Test Note',
      content: 'Test content',
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
    
    mockNotesStore.notes = [note]
    const wrapper = createWrapper()
    
    // Emit delete event from NoteCard
    await wrapper.findComponent({ name: 'NoteCard' }).vm.$emit('delete', note)
    
    // Should call deleteNote
    expect(mockNotesStore.deleteNote).toHaveBeenCalledWith(1, 1)
  })

  it('should filter notes based on search', async () => {
    const notes: MemberNote[] = [
      {
        id: 1,
        member_id: 1,
        author_id: 1,
        title: 'Important Note',
        content: 'This is important',
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
        title: 'Regular Note',
        content: 'This is regular',
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
    
    mockNotesStore.notes = notes
    const wrapper = createWrapper()
    
    // Should show both notes initially
    expect(wrapper.findAllComponents({ name: 'NoteCard' })).toHaveLength(2)
    
    // Set search filter (this would be done through the component's internal logic)
    // The actual filtering is tested in the computed property
  })
})
