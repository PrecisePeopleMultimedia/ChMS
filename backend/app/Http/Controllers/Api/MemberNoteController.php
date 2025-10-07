<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\MemberNote;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class MemberNoteController extends Controller
{
    /**
     * Get all notes for a member
     */
    public function index(Request $request, Member $member): JsonResponse
    {
        $user = $request->user();
        
        // Check if user can view member
        if (!$member->canView($user)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $query = $member->notes()->with(['author:id,first_name,last_name']);

        // Filter by privacy level
        if ($request->has('privacy_level')) {
            $query->where('privacy_level', $request->privacy_level);
        }

        // Filter by note type
        if ($request->has('note_type')) {
            $query->where('note_type', $request->note_type);
        }

        // Filter by alert status
        if ($request->has('is_alert')) {
            $query->where('is_alert', $request->boolean('is_alert'));
        }

        // Filter by pinned status
        if ($request->has('is_pinned')) {
            $query->where('is_pinned', $request->boolean('is_pinned'));
        }

        // Search in content
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Order by pinned first, then by created date
        $query->orderBy('is_pinned', 'desc')
              ->orderBy('created_at', 'desc');

        $notes = $query->paginate($request->get('per_page', 15));

        return response()->json($notes);
    }

    /**
     * Create a new note for a member
     */
    public function store(Request $request, Member $member): JsonResponse
    {
        $user = $request->user();
        
        // Check if user can edit member
        if (!$member->canEdit($user)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'required|string',
            'note_type' => ['required', Rule::in(array_keys(MemberNote::NOTE_TYPES))],
            'privacy_level' => ['required', Rule::in(array_keys(MemberNote::PRIVACY_LEVELS))],
            'is_alert' => 'boolean',
            'is_pinned' => 'boolean',
            'alert_expires_at' => 'nullable|date|after:now',
        ]);

        $validated['member_id'] = $member->id;
        $validated['author_id'] = $user->id;

        $note = MemberNote::create($validated);
        $note->load(['author:id,first_name,last_name']);

        return response()->json($note, 201);
    }

    /**
     * Get a specific note
     */
    public function show(Request $request, Member $member, MemberNote $note): JsonResponse
    {
        $user = $request->user();
        
        // Check if note belongs to member
        if ($note->member_id !== $member->id) {
            return response()->json(['error' => 'Note not found'], 404);
        }

        // Check if user can view note
        if (!$note->canView($user)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $note->load(['author:id,first_name,last_name']);

        return response()->json($note);
    }

    /**
     * Update a note
     */
    public function update(Request $request, Member $member, MemberNote $note): JsonResponse
    {
        $user = $request->user();
        
        // Check if note belongs to member
        if ($note->member_id !== $member->id) {
            return response()->json(['error' => 'Note not found'], 404);
        }

        // Check if user can edit note
        if (!$note->canEdit($user)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'required|string',
            'note_type' => ['required', Rule::in(array_keys(MemberNote::NOTE_TYPES))],
            'privacy_level' => ['required', Rule::in(array_keys(MemberNote::PRIVACY_LEVELS))],
            'is_alert' => 'boolean',
            'is_pinned' => 'boolean',
            'alert_expires_at' => 'nullable|date|after:now',
        ]);

        $note->update($validated);
        $note->load(['author:id,first_name,last_name']);

        return response()->json($note);
    }

    /**
     * Delete a note
     */
    public function destroy(Request $request, Member $member, MemberNote $note): JsonResponse
    {
        $user = $request->user();
        
        // Check if note belongs to member
        if ($note->member_id !== $member->id) {
            return response()->json(['error' => 'Note not found'], 404);
        }

        // Check if user can delete note
        if (!$note->canDelete($user)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $note->delete();

        return response()->json(['message' => 'Note deleted successfully']);
    }

    /**
     * Search notes across all members
     */
    public function search(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $query = MemberNote::with(['member:id,first_name,last_name', 'author:id,first_name,last_name'])
            ->whereHas('member', function ($q) use ($user) {
                $q->where('organization_id', $user->organization_id);
            });

        // Filter by privacy level
        if ($request->has('privacy_level')) {
            $query->where('privacy_level', $request->privacy_level);
        }

        // Filter by note type
        if ($request->has('note_type')) {
            $query->where('note_type', $request->note_type);
        }

        // Filter by alert status
        if ($request->has('is_alert')) {
            $query->where('is_alert', $request->boolean('is_alert'));
        }

        // Search in content
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Order by created date
        $query->orderBy('created_at', 'desc');

        $notes = $query->paginate($request->get('per_page', 15));

        return response()->json($notes);
    }

    /**
     * Get note types
     */
    public function noteTypes(): JsonResponse
    {
        return response()->json(MemberNote::NOTE_TYPES);
    }

    /**
     * Get privacy levels
     */
    public function privacyLevels(): JsonResponse
    {
        return response()->json(MemberNote::PRIVACY_LEVELS);
    }
}
