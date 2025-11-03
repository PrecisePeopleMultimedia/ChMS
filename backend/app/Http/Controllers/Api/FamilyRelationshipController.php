<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FamilyRelationship;
use App\Models\RelationshipType;
use App\Services\RelationshipAnalysisService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class FamilyRelationshipController extends Controller
{
    /**
     * Display a listing of family relationships
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

        $query = FamilyRelationship::where('organization_id', $user->organization_id)
            ->with(['person1', 'person2', 'relationshipType', 'family']);

        // Filter by family
        if ($request->has('family_id')) {
            $query->where('family_id', $request->family_id);
        }

        // Filter by member (relationships involving this member)
        if ($request->has('member_id')) {
            $query->forMember($request->member_id);
        }

        // Filter by relationship type
        if ($request->has('relationship_type_id')) {
            $query->byType($request->relationship_type_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter active only
        if ($request->boolean('active_only', true)) {
            $query->active();
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $relationships = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'message' => 'Family relationships retrieved successfully',
            'data' => $relationships
        ]);
    }

    /**
     * Store a newly created family relationship
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
            'family_id' => 'required|exists:families,id',
            'person1_id' => 'required|exists:members,id',
            'person2_id' => 'required|exists:members,id|different:person1_id',
            'relationship_type_id' => 'required|exists:relationship_types,id',
            'relationship_details' => 'nullable|array',
            'is_primary' => 'boolean',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'status' => ['nullable', Rule::in(array_keys(FamilyRelationship::STATUSES))],
            'custody_type' => ['nullable', Rule::in(array_keys(FamilyRelationship::CUSTODY_TYPES))],
            'custody_notes' => 'nullable|string',
            'custody_start_date' => 'nullable|date',
            'custody_end_date' => 'nullable|date|after:custody_start_date',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verify family and members belong to organization
        $family = \App\Models\Family::where('id', $request->family_id)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$family) {
            return response()->json([
                'message' => 'Family not found or does not belong to your organization'
            ], 404);
        }

        $person1 = \App\Models\Member::where('id', $request->person1_id)
            ->where('organization_id', $user->organization_id)
            ->first();

        $person2 = \App\Models\Member::where('id', $request->person2_id)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$person1 || !$person2) {
            return response()->json([
                'message' => 'One or both members not found or do not belong to your organization'
            ], 404);
        }

        // Check for duplicate relationship
        $existing = FamilyRelationship::where('person1_id', $request->person1_id)
            ->where('person2_id', $request->person2_id)
            ->where('relationship_type_id', $request->relationship_type_id)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'This relationship already exists',
                'data' => $existing->load(['person1', 'person2', 'relationshipType'])
            ], 422);
        }

        // Check for circular relationships (prevent person being their own relative)
        if ($request->person1_id === $request->person2_id) {
            return response()->json([
                'message' => 'Cannot create relationship with the same person'
            ], 422);
        }

        DB::beginTransaction();
        try {
            $relationshipData = $validator->validated();
            $relationshipData['organization_id'] = $user->organization_id;
            $relationshipData['status'] = $relationshipData['status'] ?? 'active';

            $relationship = FamilyRelationship::create($relationshipData);

            // Optionally create reciprocal relationship if configured
            $relationshipType = RelationshipType::find($request->relationship_type_id);
            if ($relationshipType && $relationshipType->reciprocal_type_id) {
                // Check if reciprocal doesn't already exist
                $reciprocalExists = FamilyRelationship::where('person1_id', $request->person2_id)
                    ->where('person2_id', $request->person1_id)
                    ->where('relationship_type_id', $relationshipType->reciprocal_type_id)
                    ->exists();

                if (!$reciprocalExists) {
                    FamilyRelationship::create([
                        'organization_id' => $user->organization_id,
                        'family_id' => $request->family_id,
                        'person1_id' => $request->person2_id,
                        'person2_id' => $request->person1_id,
                        'relationship_type_id' => $relationshipType->reciprocal_type_id,
                        'status' => $relationshipData['status'],
                        'start_date' => $relationshipData['start_date'] ?? null,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Family relationship created successfully',
                'data' => $relationship->load(['person1', 'person2', 'relationshipType', 'family'])
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create relationship',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified relationship
     */
    public function show(string $id): JsonResponse
    {
        $user = Auth::user();

        $relationship = FamilyRelationship::where('id', $id)
            ->where('organization_id', $user->organization_id)
            ->with(['person1', 'person2', 'relationshipType', 'family'])
            ->first();

        if (!$relationship) {
            return response()->json([
                'message' => 'Relationship not found'
            ], 404);
        }

        return response()->json([
            'message' => 'Relationship retrieved successfully',
            'data' => $relationship
        ]);
    }

    /**
     * Update the specified relationship
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $user = Auth::user();

        $relationship = FamilyRelationship::where('id', $id)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$relationship) {
            return response()->json([
                'message' => 'Relationship not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'relationship_type_id' => 'sometimes|required|exists:relationship_types,id',
            'relationship_details' => 'nullable|array',
            'is_primary' => 'boolean',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'status' => ['nullable', Rule::in(array_keys(FamilyRelationship::STATUSES))],
            'custody_type' => ['nullable', Rule::in(array_keys(FamilyRelationship::CUSTODY_TYPES))],
            'custody_notes' => 'nullable|string',
            'custody_start_date' => 'nullable|date',
            'custody_end_date' => 'nullable|date|after:custody_start_date',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $relationship->update($validator->validated());

        return response()->json([
            'message' => 'Relationship updated successfully',
            'data' => $relationship->load(['person1', 'person2', 'relationshipType', 'family'])
        ]);
    }

    /**
     * Remove the specified relationship
     */
    public function destroy(string $id): JsonResponse
    {
        $user = Auth::user();

        $relationship = FamilyRelationship::where('id', $id)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$relationship) {
            return response()->json([
                'message' => 'Relationship not found'
            ], 404);
        }

        $relationship->delete();

        return response()->json([
            'message' => 'Relationship deleted successfully'
        ]);
    }

    /**
     * Get relationships for a specific member
     */
    public function memberRelationships(string $memberId): JsonResponse
    {
        $user = Auth::user();

        // Verify member belongs to organization
        $member = \App\Models\Member::where('id', $memberId)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$member) {
            return response()->json([
                'message' => 'Member not found'
            ], 404);
        }

        $relationships = FamilyRelationship::forMember($memberId)
            ->where('organization_id', $user->organization_id)
            ->active()
            ->with(['person1', 'person2', 'relationshipType', 'family'])
            ->get();

        return response()->json([
            'message' => 'Member relationships retrieved successfully',
            'data' => $relationships
        ]);
    }

    /**
     * Analyze complex relationships for a member
     */
    public function analyzeComplexRelationships(string $memberId, RelationshipAnalysisService $analysisService): JsonResponse
    {
        $user = Auth::user();

        // Verify member belongs to organization
        $member = \App\Models\Member::where('id', $memberId)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$member) {
            return response()->json([
                'message' => 'Member not found'
            ], 404);
        }

        $analysis = $analysisService->analyzeComplexRelationships($memberId, $user->organization_id);

        return response()->json([
            'message' => 'Complex relationship analysis completed',
            'data' => $analysis
        ]);
    }

    /**
     * Get relationship statistics for a member
     */
    public function relationshipStatistics(string $memberId, RelationshipAnalysisService $analysisService): JsonResponse
    {
        $user = Auth::user();

        // Verify member belongs to organization
        $member = \App\Models\Member::where('id', $memberId)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$member) {
            return response()->json([
                'message' => 'Member not found'
            ], 404);
        }

        $statistics = $analysisService->getRelationshipStatistics($memberId, $user->organization_id);

        return response()->json([
            'message' => 'Relationship statistics retrieved successfully',
            'data' => $statistics
        ]);
    }
}

