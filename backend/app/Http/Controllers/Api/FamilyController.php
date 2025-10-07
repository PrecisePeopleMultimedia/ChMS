<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Family;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class FamilyController extends Controller
{
    /**
     * Display a listing of families.
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        $organizationId = $user->organization_id;

        $query = Family::where('organization_id', $organizationId)
            ->with(['head', 'members']);

        // Search by family name
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        // Order by name
        $query->orderBy('name');

        // Pagination
        $perPage = $request->get('per_page', 15);
        $families = $query->paginate($perPage);

        return response()->json([
            'data' => $families->items(),
            'pagination' => [
                'current_page' => $families->currentPage(),
                'last_page' => $families->lastPage(),
                'per_page' => $families->perPage(),
                'total' => $families->total(),
            ],
        ]);
    }

    /**
     * Store a newly created family.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'head_id' => 'required|exists:users,id',
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = Auth::user();
        $organizationId = $user->organization_id;

        // Check if head belongs to the same organization
        $head = User::where('id', $request->head_id)
            ->where('organization_id', $organizationId)
            ->first();

        if (!$head) {
            return response()->json([
                'message' => 'Family head not found or does not belong to your organization',
            ], 404);
        }

        $family = Family::create([
            'organization_id' => $organizationId,
            'name' => $request->name,
            'head_id' => $request->head_id,
            'address' => $request->address,
            'phone' => $request->phone,
            'email' => $request->email,
        ]);

        // Add head as family member
        $family->members()->attach($request->head_id, ['role' => 'head']);

        $family->load(['head', 'members']);

        return response()->json([
            'message' => 'Family created successfully',
            'data' => $family,
        ], 201);
    }

    /**
     * Display the specified family.
     */
    public function show(Family $family): JsonResponse
    {
        $user = Auth::user();
        
        // Check if family belongs to user's organization
        if ($family->organization_id !== $user->organization_id) {
            return response()->json([
                'message' => 'Family not found',
            ], 404);
        }

        $family->load(['head', 'members']);

        return response()->json([
            'data' => $family,
        ]);
    }

    /**
     * Update the specified family.
     */
    public function update(Request $request, Family $family): JsonResponse
    {
        $user = Auth::user();
        
        // Check if family belongs to user's organization
        if ($family->organization_id !== $user->organization_id) {
            return response()->json([
                'message' => 'Family not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'head_id' => 'sometimes|required|exists:users,id',
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // If changing head, validate new head belongs to organization
        if ($request->has('head_id')) {
            $newHead = User::where('id', $request->head_id)
                ->where('organization_id', $user->organization_id)
                ->first();

            if (!$newHead) {
                return response()->json([
                    'message' => 'New family head not found or does not belong to your organization',
                ], 404);
            }
        }

        $family->update($request->only([
            'name', 'head_id', 'address', 'phone', 'email'
        ]));

        $family->load(['head', 'members']);

        return response()->json([
            'message' => 'Family updated successfully',
            'data' => $family,
        ]);
    }

    /**
     * Remove the specified family.
     */
    public function destroy(Family $family): JsonResponse
    {
        $user = Auth::user();
        
        // Check if family belongs to user's organization
        if ($family->organization_id !== $user->organization_id) {
            return response()->json([
                'message' => 'Family not found',
            ], 404);
        }

        $family->delete();

        return response()->json([
            'message' => 'Family deleted successfully',
        ]);
    }

    /**
     * Add a member to the family.
     */
    public function addMember(Request $request, Family $family): JsonResponse
    {
        $request->validate([
            'member_id' => 'required|exists:users,id',
            'role' => 'required|in:head,spouse,child,other',
        ]);

        $user = Auth::user();
        
        // Check if family belongs to user's organization
        if ($family->organization_id !== $user->organization_id) {
            return response()->json([
                'message' => 'Family not found',
            ], 404);
        }

        // Check if member belongs to the same organization
        $member = User::where('id', $request->member_id)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$member) {
            return response()->json([
                'message' => 'Member not found or does not belong to your organization',
            ], 404);
        }

        // Check if member is already in this family
        if ($family->members()->where('user_id', $request->member_id)->exists()) {
            return response()->json([
                'message' => 'Member is already in this family',
            ], 409);
        }

        $family->members()->attach($request->member_id, [
            'role' => $request->role,
        ]);

        $family->load(['head', 'members']);

        return response()->json([
            'message' => 'Member added to family successfully',
            'data' => $family,
        ]);
    }

    /**
     * Remove a member from the family.
     */
    public function removeMember(Request $request, Family $family): JsonResponse
    {
        $request->validate([
            'member_id' => 'required|exists:users,id',
        ]);

        $user = Auth::user();
        
        // Check if family belongs to user's organization
        if ($family->organization_id !== $user->organization_id) {
            return response()->json([
                'message' => 'Family not found',
            ], 404);
        }

        // Check if member is in this family
        if (!$family->members()->where('user_id', $request->member_id)->exists()) {
            return response()->json([
                'message' => 'Member is not in this family',
            ], 404);
        }

        $family->members()->detach($request->member_id);

        $family->load(['head', 'members']);

        return response()->json([
            'message' => 'Member removed from family successfully',
            'data' => $family,
        ]);
    }
}