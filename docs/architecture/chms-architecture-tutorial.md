# 🎓 ChMS Architecture Tutorial - How Everything Fits Together

Great question! Here’s a concise, high-signal walkthrough of how our ChMS works end-to-end, with simple analogies and concrete examples you can refer back to anytime.

## 🏗️ The Big Picture: Frontend ↔ Backend

```
┌─────────────────┐    HTTP/API    ┌─────────────────┐
│   FRONTEND      │ ←──────────→   │    BACKEND      │
│   (Vue 3)       │    Requests    │   (Laravel)     │
│                 │                │                 │
│ • Components    │                │ • Controllers   │
│ • Stores        │                │ • Models        │
│ • Pages         │                │ • Routes        │
└─────────────────┘                └─────────────────┘
                                           │
                                           ▼
                                   ┌─────────────────┐
                                   │    DATABASE     │
                                   │  (PostgreSQL)   │
                                   │                 │
                                   │ • Tables        │
                                   │ • Data          │
                                   └─────────────────┘
```

## 🎭 The Restaurant Analogy

- **Frontend (Vue)**: Dining room where users interact
- **Backend (Laravel)**: Kitchen where requests are prepared
- **Database**: Pantry where ingredients (data) live
- **API**: Waiters carrying orders between dining room and kitchen

## 📁 Naming & Structure: Domain-Focused Stores

Why `notes.ts` instead of `member_notes.ts`?

```ts
// Domain-focused (preferred)
frontend/src/stores/notes.ts   // Handles ALL note operations
frontend/src/stores/badges.ts  // Handles ALL badge operations
frontend/src/stores/members.ts // Handles ALL member operations

// Feature-narrow (less reusable)
// frontend/src/stores/member_notes.ts // Only member notes
```

Benefits:
- **Reusable** across domains (members, events, organisations)
- **Cleaner** and avoids duplication
- **Scalable** for future note types

## 🔄 End-to-End Example: “Create Note”

1) User clicks “Add Note” in a Vue component

```vue
<!-- frontend/src/components/members/MemberNotes.vue -->
<template>
  <q-btn @click="showAddNoteDialog = true" label="Add Note" />
  <NoteDialog v-model="showAddNoteDialog" @save="onSave" />
  <div v-for="note in notesStore.notes" :key="note.id">{{ note.title }}</div>
  
</template>
<script setup lang="ts">
import { useNotesStore } from '@/stores/notes'
const notesStore = useNotesStore()
const memberId = 123
const showAddNoteDialog = $ref(false)

function onSave(noteData: any) {
  notesStore.createNote(memberId, noteData)
}
</script>
```

2) Pinia store sends API request and updates state

```ts
// frontend/src/stores/notes.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/utils/api'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<any[]>([])
  const loading = ref(false)

  async function createNote(memberId: number, noteData: any) {
    loading.value = true
    try {
      const res = await api.post(`/members/${memberId}/notes`, noteData)
      notes.value.push(res.data)
    } finally {
      loading.value = false
    }
  }

  return { notes, loading, createNote }
})
```

3) HTTP request (example)

```
POST http://localhost:8000/api/members/123/notes
{
  "title": "Follow up needed",
  "content": "Call member about upcoming event",
  "note_type": "Follow-up"
}
```

4) Laravel route

```php
// backend/routes/api.php
Route::post('/members/{member}/notes', [MemberNoteController::class, 'store']);
```

5) Controller validates and creates record

```php
// backend/app/Http/Controllers/Api/MemberNoteController.php
public function store(Request $request, Member $member): JsonResponse
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'content' => 'required|string',
        'note_type' => 'nullable|string|max:100',
    ]);

    $note = $member->notes()->create($validated);
    return response()->json($note);
}
```

6) Model maps to database table

```php
// backend/app/Models/MemberNote.php
class MemberNote extends Model
{
    protected $fillable = ['title', 'content', 'note_type'];

    public function member() {
        return $this->belongsTo(Member::class);
    }
}
```

7) Migration defines the schema

```php
// backend/database/migrations/2025_10_06_000005_create_member_notes_table.php
Schema::create('member_notes', function (Blueprint $table) {
    $table->id();
    $table->foreignId('member_id')->constrained()->cascadeOnDelete();
    $table->string('title');
    $table->text('content');
    $table->string('note_type')->nullable();
    $table->timestamps();
});
```

## 🧩 Laravel Components Cheatsheet

- **Migration**: The architect (creates/modifies tables)
- **Model**: The data manager (maps PHP objects to rows)
- **Controller**: The chef (handles requests, calls models)
- **Route**: The waiter (maps URL → controller action)

## 🔄 Full Data Flow (at a glance)

```
1) User action → 2) Vue component → 3) Pinia store → 4) API route
   → 5) Controller → 6) Model → 7) Database → 8) Controller response
   → 9) Store updates → 10) Vue re-renders → 11) User sees result
```

## 🎯 Why This Architecture Works

- **Separation of concerns**: UI vs business logic vs data storage
- **Scalability**: Swap frontend tech, add mobile apps, scale backend independently
- **Maintainability**: Single responsibility per file; easy to extend and test

## ✅ Quick Reminders

- Prefer domain-focused stores: `notes.ts`, `badges.ts`, `members.ts`
- Keep controllers thin; put business logic in services/models
- Validate on the backend; don’t trust client inputs
- Return clear JSON responses; keep API contracts stable


