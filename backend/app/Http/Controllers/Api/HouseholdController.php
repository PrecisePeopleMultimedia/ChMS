<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Household;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class HouseholdController extends Controller
{
    /**
     * Display a listing of households
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user->organization_id) {
            return response()->json([
                'message' => 'No organization found for user',
                'data' => []
            ], 404);
        }

        $query = Household::where('organization_id', $user->organization_id)
            ->with(['headOfHousehold', 'organization']);

        // Filter by active status
        if ($request->boolean('active_only', true)) {
            $query->active();
        }

        // Filter by household type
        if ($request->has('household_type')) {
            $query->byType($request->household_type);
        }

        // Search by name
        if ($request->has('search')) {
            $query->where('name', 'LIKE', "%{$request->search}%");
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $households = $query->orderBy('name')->paginate($perPage);

        return response()->json([
            'message' => 'Households retrieved successfully',
            'data' => $households
        ]);
    }

    /**
     * Store a newly created household
     */
    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user->organization_id) {
            return response()->json([
                'message' => 'No organization found for user'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:255',
            'head_of_household_id' => 'nullable|exists:members,id',
            'home_phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'household_type' => ['nullable', Rule::in(array_keys(Household::HOUSEHOLD_TYPES))],
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verify head of household belongs to organization
        if ($request->has('head_of_household_id')) {
            $headMember = \App\Models\Member::where('id', $request->head_of_household_id)
                ->where('organization_id', $user->organization_id)
                ->first();

            if (!$headMember) {
                return response()->json([
                    'message' => 'Head of household not found or does not belong to your organization'
                ], 404);
            }
        }

        $householdData = $validator->validated();
        $householdData['organization_id'] = $user->organization_id;
        $householdData['household_type'] = $householdData['household_type'] ?? 'primary';

        $household = Household::create($householdData);

        return response()->json([
            'message' => 'Household created successfully',
            'data' => $household->load(['headOfHousehold', 'organization'])
        ], 201);
    }

    /**
     * Display the specified household
     */
    public function show(string $id): JsonResponse
    {
        $user = Auth::user();

        $household = Household::where('id', $id)
            ->where('organization_id', $user->organization_id)
            ->with([
                'headOfHousehold',
                'organization',
                'members',
                'householdMemberships.relationshipType',
                'householdMemberships.member'
            ])
            ->first();

        if (!$household) {
            return response()->json([
                'message' => 'Household not found'
            ], 404);
        }

        return response()->json([
            'message' => 'Household retrieved successfully',
            'data' => $household
        ]);
    }

    /**
     * Update the specified household
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $user = Auth::user();

        $household = Household::where('id', $id)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$household) {
            return response()->json([
                'message' => 'Household not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:255',
            'head_of_household_id' => 'nullable|exists:members,id',
            'home_phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'household_type' => ['nullable', Rule::in(array_keys(Household::HOUSEHOLD_TYPES))],
            'notes' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verify head of household if provided
        if ($request->has('head_of_household_id')) {
            $headMember = \App\Models\Member::where('id', $request->head_of_household_id)
                ->where('organization_id', $user->organization_id)
                ->first();

            if (!$headMember) {
                return response()->json([
                    'message' => 'Head of household not found or does not belong to your organization'
                ], 404);
            }
        }

        $household->update($validator->validated());

        return response()->json([
            'message' => 'Household updated successfully',
            'data' => $household->load(['headOfHousehold', 'organization'])
        ]);
    }

    /**
     * Remove the specified household
     */
    public function destroy(string $id): JsonResponse
    {
        $user = Auth::user();

        $household = Household::where('id', $id)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$household) {
            return response()->json([
                'message' => 'Household not found'
            ], 404);
        }

        $household->delete();

        return response()->json([
            'message' => 'Household deleted successfully'
        ]);
    }

    /**
     * Add a member to household
     */
    public function addMember(Request $request, string $id): JsonResponse
    {
        $user = Auth::user();

        $household = Household::where('id', $id)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$household) {
            return response()->json([
                'message' => 'Household not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'member_id' => 'required|exists:members,id',
            'relationship_type_id' => 'nullable|exists:relationship_types,id',
            'role' => ['nullable', Rule::in(array_keys(HouseholdMember::ROLES))],
            'residency_start_date' => 'nullable|date',
            'residency_end_date' => 'nullable|date|after:residency_start_date',
            'residency_status' => ['nullable', Rule::in(array_keys(HouseholdMember::RESIDENCY_STATUSES))],
            'custody_type' => ['nullable', Rule::in(array_keys(HouseholdMember::CUSTODY_TYPES))],
            'custody_notes' => 'nullable|string',
            'guardian_id' => 'nullable|exists:members,id',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verify member belongs to organization
        $member = \App\Models\Member::where('id', $request->member_id)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$member) {
            return response()->json([
                'message' => 'Member not found or does not belong to your organization'
            ], 404);
        }

        // Check if member is already in household
        $existing = \App\Models\HouseholdMember::where('household_id', $id)
            ->where('member_id', $request->member_id)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Member is already in this household',
                'data' => $existing->load(['member', 'relationshipType'])
            ], 422);
        }

        $membershipData = $validator->validated();
        $membershipData['organization_id'] = $user->organization_id;
        $membershipData['household_id'] = $household->id;
        $membershipData['residency_status'] = $membershipData['residency_status'] ?? 'permanent';
        $membershipData['role'] = $membershipData['role'] ?? 'resident';

        $membership = \App\Models\HouseholdMember::create($membershipData);

        return response()->json([
            'message' => 'Member added to household successfully',
            'data' => $membership->load(['member', 'relationshipType', 'guardian', 'household'])
        ], 201);
    }

    /**
     * Remove a member from household
     */
    public function removeMember(string $id, string $memberId): JsonResponse
    {
        $user = Auth::user();

        $household = Household::where('id', $id)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$household) {
            return response()->json([
                'message' => 'Household not found'
            ], 404);
        }

        $membership = \App\Models\HouseholdMember::where('household_id', $id)
            ->where('member_id', $memberId)
            ->first();

        if (!$membership) {
            return response()->json([
                'message' => 'Member is not in this household'
            ], 404);
        }

        $membership->delete();

        return response()->json([
            'message' => 'Member removed from household successfully'
        ]);
    }

    /**
     * Get household members
     */
    public function members(string $id): JsonResponse
    {
        $user = Auth::user();

        $household = Household::where('id', $id)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$household) {
            return response()->json([
                'message' => 'Household not found'
            ], 404);
        }

        $members = $household->householdMemberships()
            ->with(['member', 'relationshipType', 'guardian'])
            ->get();

        return response()->json([
            'message' => 'Household members retrieved successfully',
            'data' => $members
        ]);
    }
}

