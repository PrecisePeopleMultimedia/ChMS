<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Family;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FamilyController extends Controller
{
    /**
     * Display a listing of families.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Family::with(['members', 'headOfFamily', 'organization'])
            ->where('organization_id', auth()->user()->organization_id);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'family_name');
        $sortOrder = $request->get('sort_order', 'asc');

        $allowedSorts = ['family_name', 'created_at'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Pagination
        $perPage = min($request->get('per_page', 20), 100);
        $families = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $families,
            'message' => 'Families retrieved successfully'
        ]);
    }

    /**
     * Store a newly created family.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'family_name' => 'required|string|max:255',
            'head_of_family_id' => 'nullable|exists:members,id',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email',
            'notes' => 'nullable|string',
        ]);

        $validated['organization_id'] = auth()->user()->organization_id;

        $family = Family::create($validated);

        return response()->json([
            'success' => true,
            'data' => $family->load(['members', 'headOfFamily']),
            'message' => 'Family created successfully'
        ], 201);
    }

    /**
     * Display the specified family.
     */
    public function show(Family $family): JsonResponse
    {
        // Ensure family belongs to user's organization
        if ($family->organization_id !== auth()->user()->organization_id) {
            return response()->json([
                'success' => false,
                'message' => 'Family not found'
            ], 404);
        }

        $family->load(['members', 'headOfFamily', 'organization']);

        return response()->json([
            'success' => true,
            'data' => $family,
            'message' => 'Family retrieved successfully'
        ]);
    }

    /**
     * Update the specified family.
     */
    public function update(Request $request, Family $family): JsonResponse
    {
        // Ensure family belongs to user's organization
        if ($family->organization_id !== auth()->user()->organization_id) {
            return response()->json([
                'success' => false,
                'message' => 'Family not found'
            ], 404);
        }

        $validated = $request->validate([
            'family_name' => 'sometimes|required|string|max:255',
            'head_of_family_id' => 'nullable|exists:members,id',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email',
            'notes' => 'nullable|string',
        ]);

        $family->update($validated);

        return response()->json([
            'success' => true,
            'data' => $family->load(['members', 'headOfFamily']),
            'message' => 'Family updated successfully'
        ]);
    }

    /**
     * Remove the specified family.
     */
    public function destroy(Family $family): JsonResponse
    {
        // Ensure family belongs to user's organization
        if ($family->organization_id !== auth()->user()->organization_id) {
            return response()->json([
                'success' => false,
                'message' => 'Family not found'
            ], 404);
        }

        // Check if family has members
        if ($family->members()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete family with existing members. Please remove all members first.'
            ], 422);
        }

        $family->delete();

        return response()->json([
            'success' => true,
            'message' => 'Family deleted successfully'
        ]);
    }
}
