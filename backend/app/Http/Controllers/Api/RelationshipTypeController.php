<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RelationshipType;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class RelationshipTypeController extends Controller
{
    /**
     * Display a listing of relationship types
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();

        $query = RelationshipType::where(function ($q) use ($user) {
            $q->whereNull('organization_id') // System-wide default types
              ->orWhere('organization_id', $user->organization_id); // Organization-specific types
        });

        // Filter by category
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        // Filter family types only
        if ($request->boolean('family_only')) {
            $query->familyTypes();
        }

        // Filter household types only
        if ($request->boolean('household_only')) {
            $query->householdTypes();
        }

        // Filter legal types only
        if ($request->boolean('legal_only')) {
            $query->legalTypes();
        }

        // Active only
        if ($request->boolean('active_only', true)) {
            $query->active();
        }

        $types = $query->ordered()->get();

        return response()->json([
            'message' => 'Relationship types retrieved successfully',
            'data' => $types
        ]);
    }

    /**
     * Store a newly created relationship type
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
            'slug' => 'required|string|max:255|unique:relationship_types,slug',
            'description' => 'nullable|string',
            'category' => ['required', Rule::in(array_keys(RelationshipType::CATEGORIES))],
            'is_family' => 'boolean',
            'is_household' => 'boolean',
            'is_legal' => 'boolean',
            'display_order' => 'nullable|integer|min:0',
            'reciprocal_type_id' => 'nullable|exists:relationship_types,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $typeData = $validator->validated();
        $typeData['organization_id'] = $user->organization_id;
        $typeData['display_order'] = $typeData['display_order'] ?? 0;

        $type = RelationshipType::create($typeData);

        return response()->json([
            'message' => 'Relationship type created successfully',
            'data' => $type
        ], 201);
    }

    /**
     * Display the specified relationship type
     */
    public function show(string $id): JsonResponse
    {
        $type = RelationshipType::with(['reciprocalType', 'organization'])->find($id);

        if (!$type) {
            return response()->json([
                'message' => 'Relationship type not found'
            ], 404);
        }

        return response()->json([
            'message' => 'Relationship type retrieved successfully',
            'data' => $type
        ]);
    }

    /**
     * Update the specified relationship type
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $user = Auth::user();

        $type = RelationshipType::where('id', $id)
            ->where(function ($q) use ($user) {
                $q->whereNull('organization_id')
                  ->orWhere('organization_id', $user->organization_id);
            })
            ->first();

        if (!$type) {
            return response()->json([
                'message' => 'Relationship type not found'
            ], 404);
        }

        // Prevent modification of system-wide types if user doesn't own it
        if (!$type->organization_id || $type->organization_id !== $user->organization_id) {
            return response()->json([
                'message' => 'Cannot modify system-wide relationship types. Create an organization-specific type instead.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:relationship_types,slug,' . $id,
            'description' => 'nullable|string',
            'category' => ['sometimes', 'required', Rule::in(array_keys(RelationshipType::CATEGORIES))],
            'is_family' => 'boolean',
            'is_household' => 'boolean',
            'is_legal' => 'boolean',
            'display_order' => 'nullable|integer|min:0',
            'reciprocal_type_id' => 'nullable|exists:relationship_types,id',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $type->update($validator->validated());

        return response()->json([
            'message' => 'Relationship type updated successfully',
            'data' => $type
        ]);
    }

    /**
     * Remove the specified relationship type
     */
    public function destroy(string $id): JsonResponse
    {
        $user = Auth::user();

        $type = RelationshipType::where('id', $id)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$type) {
            return response()->json([
                'message' => 'Relationship type not found or you do not have permission to delete it'
            ], 404);
        }

        // Check if type is being used
        $inUse = \App\Models\FamilyRelationship::where('relationship_type_id', $id)->exists();
        
        if ($inUse) {
            return response()->json([
                'message' => 'Cannot delete relationship type that is in use'
            ], 422);
        }

        $type->delete();

        return response()->json([
            'message' => 'Relationship type deleted successfully'
        ]);
    }
}

