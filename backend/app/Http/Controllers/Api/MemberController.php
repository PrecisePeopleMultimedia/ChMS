<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class MemberController extends Controller
{
    /**
     * Display a listing of members.
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        $organizationId = $user->organization_id;

        $query = User::where('organization_id', $organizationId);

        // Filter by role
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Search by name or email
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        // Order by name
        $query->orderBy('first_name')->orderBy('last_name');

        // Pagination
        $perPage = $request->get('per_page', 15);
        $members = $query->paginate($perPage);

        return response()->json([
            'data' => $members->items(),
            'pagination' => [
                'current_page' => $members->currentPage(),
                'last_page' => $members->lastPage(),
                'per_page' => $members->perPage(),
                'total' => $members->total(),
            ],
        ]);
    }

    /**
     * Store a newly created member.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:50',
            'role' => 'required|in:admin,staff,member',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string|max:500',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = Auth::user();
        $organizationId = $user->organization_id;

        $member = User::create([
            'organization_id' => $organizationId,
            'name' => $request->first_name . ' ' . $request->last_name,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'role' => $request->role,
            'date_of_birth' => $request->date_of_birth,
            'address' => $request->address,
            'emergency_contact_name' => $request->emergency_contact_name,
            'emergency_contact_phone' => $request->emergency_contact_phone,
            'password' => bcrypt('password123'), // Default password
            'email_verified_at' => now(),
        ]);

        return response()->json([
            'message' => 'Member created successfully',
            'data' => $member,
        ], 201);
    }

    /**
     * Search members by name or email.
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'q' => 'required|string|min:2',
        ]);

        $user = Auth::user();
        $organizationId = $user->organization_id;

        $members = User::where('organization_id', $organizationId)
            ->where(function ($query) use ($request) {
                $query->where('name', 'like', "%{$request->q}%")
                      ->orWhere('email', 'like', "%{$request->q}%")
                      ->orWhere('first_name', 'like', "%{$request->q}%")
                      ->orWhere('last_name', 'like', "%{$request->q}%");
            })
            ->select('id', 'name', 'first_name', 'last_name', 'email', 'phone', 'role')
            ->limit(10)
            ->get();

        return response()->json([
            'data' => $members,
        ]);
    }

    /**
     * Display the specified member.
     */
    public function show(User $member): JsonResponse
    {
        $user = Auth::user();
        
        // Check if member belongs to user's organization
        if ($member->organization_id !== $user->organization_id) {
            return response()->json([
                'message' => 'Member not found',
            ], 404);
        }

        return response()->json([
            'data' => $member,
        ]);
    }

    /**
     * Update the specified member.
     */
    public function update(Request $request, User $member): JsonResponse
    {
        $user = Auth::user();
        
        // Check if member belongs to user's organization
        if ($member->organization_id !== $user->organization_id) {
            return response()->json([
                'message' => 'Member not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $member->id,
            'phone' => 'nullable|string|max:50',
            'role' => 'sometimes|required|in:admin,staff,member',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string|max:500',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $member->update($request->only([
            'first_name', 'last_name', 'email', 'phone', 'role',
            'date_of_birth', 'address', 'emergency_contact_name', 'emergency_contact_phone'
        ]));

        // Update name if first_name or last_name changed
        if ($request->has('first_name') || $request->has('last_name')) {
            $member->name = $member->first_name . ' ' . $member->last_name;
            $member->save();
        }

        return response()->json([
            'message' => 'Member updated successfully',
            'data' => $member,
        ]);
    }

    /**
     * Remove the specified member.
     */
    public function destroy(User $member): JsonResponse
    {
        $user = Auth::user();
        
        // Check if member belongs to user's organization
        if ($member->organization_id !== $user->organization_id) {
            return response()->json([
                'message' => 'Member not found',
            ], 404);
        }

        // Prevent deleting the last admin
        if ($member->role === 'admin') {
            $adminCount = User::where('organization_id', $member->organization_id)
                ->where('role', 'admin')
                ->count();
            
            if ($adminCount <= 1) {
                return response()->json([
                    'message' => 'Cannot delete the last admin member',
                ], 422);
            }
        }

        $member->delete();

        return response()->json([
            'message' => 'Member deleted successfully',
        ]);
    }
}