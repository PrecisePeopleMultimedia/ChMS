<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\MemberHistory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class MemberController extends Controller
{
    /**
     * Display a listing of members.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Member::with(['family', 'organization'])
            ->where('organization_id', auth()->user()->organization_id);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        // Filter by member type
        if ($request->has('member_type') && $request->member_type) {
            $query->ofType($request->member_type);
        }

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Filter by family
        if ($request->has('family_id') && $request->family_id) {
            $query->where('family_id', $request->family_id);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'first_name');
        $sortOrder = $request->get('sort_order', 'asc');

        $allowedSorts = ['first_name', 'last_name', 'email', 'join_date', 'created_at'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Pagination
        $perPage = min($request->get('per_page', 20), 100); // Max 100 per page
        $members = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $members,
            'message' => 'Members retrieved successfully'
        ]);
    }

    /**
     * Store a newly created member.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'nullable|email|unique:members,email',
            'phone' => 'nullable|string|max:50',
            'date_of_birth' => 'nullable|date|before:today',
            'gender' => 'nullable|in:male,female,other',
            'address' => 'nullable|string',
            'member_type' => 'required|in:adult,child,youth,visitor',
            'join_date' => 'nullable|date',
            'family_id' => 'nullable|exists:families,id',
            'notes' => 'nullable|string',
        ]);

        // Check for duplicates
        $duplicateCheck = $this->checkForDuplicates($validated);
        if ($duplicateCheck) {
            return response()->json([
                'success' => false,
                'message' => 'Potential duplicate member found',
                'duplicate_member' => $duplicateCheck,
                'suggestion' => 'Please verify this is not a duplicate before proceeding'
            ], 409);
        }

        DB::beginTransaction();
        try {
            // Add organization_id from authenticated user
            $validated['organization_id'] = auth()->user()->organization_id;
            $validated['join_date'] = $validated['join_date'] ?? now()->toDateString();

            $member = Member::create($validated);

            // Log member creation
            MemberHistory::logChange($member, 'created', [], $validated);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $member->load(['family', 'organization']),
                'message' => 'Member created successfully'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create member',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified member.
     */
    public function show(Member $member): JsonResponse
    {
        // Ensure member belongs to user's organization
        if ($member->organization_id !== auth()->user()->organization_id) {
            return response()->json([
                'success' => false,
                'message' => 'Member not found'
            ], 404);
        }

        $member->load(['family', 'organization', 'history.changedBy']);

        return response()->json([
            'success' => true,
            'data' => $member,
            'message' => 'Member retrieved successfully'
        ]);
    }

    /**
     * Update the specified member.
     */
    public function update(Request $request, Member $member): JsonResponse
    {
        // Ensure member belongs to user's organization
        if ($member->organization_id !== auth()->user()->organization_id) {
            return response()->json([
                'success' => false,
                'message' => 'Member not found'
            ], 404);
        }

        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:100',
            'last_name' => 'sometimes|required|string|max:100',
            'email' => [
                'nullable',
                'email',
                Rule::unique('members', 'email')->ignore($member->id)
            ],
            'phone' => 'nullable|string|max:50',
            'date_of_birth' => 'nullable|date|before:today',
            'gender' => 'nullable|in:male,female,other',
            'address' => 'nullable|string',
            'member_type' => 'sometimes|required|in:adult,child,youth,visitor',
            'join_date' => 'nullable|date',
            'family_id' => 'nullable|exists:families,id',
            'is_active' => 'sometimes|boolean',
            'notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            // Store old values for history
            $oldValues = $member->only(array_keys($validated));

            $member->update($validated);

            // Log member update
            MemberHistory::logChange($member, 'updated', $oldValues, $validated);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $member->load(['family', 'organization']),
                'message' => 'Member updated successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update member',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified member (soft delete).
     */
    public function destroy(Member $member): JsonResponse
    {
        // Ensure member belongs to user's organization
        if ($member->organization_id !== auth()->user()->organization_id) {
            return response()->json([
                'success' => false,
                'message' => 'Member not found'
            ], 404);
        }

        DB::beginTransaction();
        try {
            // Store member data for history
            $memberData = $member->toArray();

            $member->delete();

            // Log member deletion
            MemberHistory::logChange($member, 'deleted', $memberData, []);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Member deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete member',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search members with advanced filtering.
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'query' => 'required|string|min:2',
            'member_type' => 'nullable|in:adult,child,youth,visitor',
            'is_active' => 'nullable|boolean',
            'family_id' => 'nullable|exists:families,id',
        ]);

        $query = Member::with(['family', 'organization'])
            ->where('organization_id', auth()->user()->organization_id)
            ->search($request->query);

        // Apply filters
        if ($request->has('member_type')) {
            $query->ofType($request->member_type);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->has('family_id')) {
            $query->where('family_id', $request->family_id);
        }

        $members = $query->limit(50)->get(); // Limit search results

        return response()->json([
            'success' => true,
            'data' => $members,
            'message' => 'Search completed successfully'
        ]);
    }

    /**
     * Check for potential duplicate members.
     */
    private function checkForDuplicates(array $memberData): ?Member
    {
        $query = Member::where('organization_id', auth()->user()->organization_id);

        // Check for exact name match
        $exactMatch = $query->where('first_name', $memberData['first_name'])
                           ->where('last_name', $memberData['last_name'])
                           ->first();

        if ($exactMatch) {
            return $exactMatch;
        }

        // Check for email match if provided
        if (!empty($memberData['email'])) {
            $emailMatch = Member::where('organization_id', auth()->user()->organization_id)
                               ->where('email', $memberData['email'])
                               ->first();
            if ($emailMatch) {
                return $emailMatch;
            }
        }

        // Check for phone match if provided
        if (!empty($memberData['phone'])) {
            $phoneMatch = Member::where('organization_id', auth()->user()->organization_id)
                               ->where('phone', $memberData['phone'])
                               ->first();
            if ($phoneMatch) {
                return $phoneMatch;
            }
        }

        return null;
    }
}
