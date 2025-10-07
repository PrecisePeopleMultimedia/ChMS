<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BadgeType;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class BadgeTypeController extends Controller
{
    /**
     * Display a listing of badge types
     */
    public function index(Request $request): JsonResponse
    {
        $query = BadgeType::where('organization_id', $request->user()->organization_id);

        // Filter by active status
        if ($request->boolean('active_only', true)) {
            $query->active();
        }

        // Search by name or description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        $badgeTypes = $query->ordered()->get();

        // Add member counts
        $badgeTypes->each(function ($badgeType) {
            $badgeType->member_count = $badgeType->member_count;
            $badgeType->active_member_count = $badgeType->active_member_count;
        });

        return response()->json([
            'data' => $badgeTypes,
            'available_icons' => BadgeType::AVAILABLE_ICONS,
        ]);
    }

    /**
     * Store a newly created badge type
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('badge_types')->where(function ($query) use ($request) {
                    return $query->where('organization_id', $request->user()->organization_id);
                }),
            ],
            'description' => 'nullable|string|max:1000',
            'color' => [
                'required',
                'string',
                'regex:/^#[a-f0-9]{6}$/i',
            ],
            'icon' => [
                'required',
                'string',
                'max:50',
                Rule::in(array_keys(BadgeType::AVAILABLE_ICONS)),
            ],
            'is_active' => 'boolean',
        ]);

        $validated['organization_id'] = $request->user()->organization_id;

        $badgeType = BadgeType::create($validated);

        return response()->json([
            'message' => 'Badge type created successfully',
            'data' => $badgeType
        ], 201);
    }

    /**
     * Display the specified badge type
     */
    public function show(Request $request, BadgeType $badgeType): JsonResponse
    {
        // Ensure the badge type belongs to the user's organization
        if ($badgeType->organization_id !== $request->user()->organization_id) {
            return response()->json(['message' => 'Badge type not found'], 404);
        }

        // Load member counts
        $badgeType->member_count = $badgeType->member_count;
        $badgeType->active_member_count = $badgeType->active_member_count;

        return response()->json(['data' => $badgeType]);
    }

    /**
     * Update the specified badge type
     */
    public function update(Request $request, BadgeType $badgeType): JsonResponse
    {
        // Ensure the badge type belongs to the user's organization
        if ($badgeType->organization_id !== $request->user()->organization_id) {
            return response()->json(['message' => 'Badge type not found'], 404);
        }

        $validated = $request->validate([
            'name' => [
                'sometimes',
                'string',
                'max:100',
                Rule::unique('badge_types')->where(function ($query) use ($request) {
                    return $query->where('organization_id', $request->user()->organization_id);
                })->ignore($badgeType->id),
            ],
            'description' => 'nullable|string|max:1000',
            'color' => [
                'sometimes',
                'string',
                'regex:/^#[a-f0-9]{6}$/i',
            ],
            'icon' => [
                'sometimes',
                'string',
                'max:50',
                Rule::in(array_keys(BadgeType::AVAILABLE_ICONS)),
            ],
            'is_active' => 'boolean',
        ]);

        $badgeType->update($validated);

        return response()->json([
            'message' => 'Badge type updated successfully',
            'data' => $badgeType
        ]);
    }

    /**
     * Remove the specified badge type
     */
    public function destroy(Request $request, BadgeType $badgeType): JsonResponse
    {
        // Ensure the badge type belongs to the user's organization
        if ($badgeType->organization_id !== $request->user()->organization_id) {
            return response()->json(['message' => 'Badge type not found'], 404);
        }

        // Check if badge type has assignments
        $hasAssignments = $badgeType->memberBadges()->exists();
        
        if ($hasAssignments) {
            return response()->json([
                'message' => 'Cannot delete badge type that has assignments. Please remove all assignments first or deactivate the badge type.',
            ], 422);
        }

        $badgeType->delete();

        return response()->json([
            'message' => 'Badge type deleted successfully'
        ]);
    }

    /**
     * Get available icons
     */
    public function icons(): JsonResponse
    {
        return response()->json([
            'data' => BadgeType::AVAILABLE_ICONS
        ]);
    }

    /**
     * Create default badge types for organization
     */
    public function createDefaults(Request $request): JsonResponse
    {
        $organizationId = $request->user()->organization_id;
        
        BadgeType::createDefaultBadges($organizationId);

        return response()->json([
            'message' => 'Default badge types created successfully'
        ]);
    }

    /**
     * Get badge statistics
     */
    public function statistics(Request $request): JsonResponse
    {
        $organizationId = $request->user()->organization_id;
        
        $badgeTypes = BadgeType::where('organization_id', $organizationId)
            ->active()
            ->get();

        $statistics = [
            'total_badge_types' => $badgeTypes->count(),
            'total_assignments' => $badgeTypes->sum('member_count'),
            'active_assignments' => $badgeTypes->sum('active_member_count'),
            'badge_distribution' => $badgeTypes->map(function ($badgeType) {
                return [
                    'name' => $badgeType->name,
                    'color' => $badgeType->color,
                    'member_count' => $badgeType->member_count,
                    'active_member_count' => $badgeType->active_member_count,
                ];
            }),
        ];

        return response()->json(['data' => $statistics]);
    }

    /**
     * Bulk update badge types
     */
    public function bulkUpdate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'badge_types' => 'required|array',
            'badge_types.*.id' => 'required|integer|exists:badge_types,id',
            'badge_types.*.is_active' => 'required|boolean',
        ]);

        $organizationId = $request->user()->organization_id;

        foreach ($validated['badge_types'] as $badgeTypeData) {
            BadgeType::where('id', $badgeTypeData['id'])
                ->where('organization_id', $organizationId)
                ->update(['is_active' => $badgeTypeData['is_active']]);
        }

        return response()->json([
            'message' => 'Badge types updated successfully'
        ]);
    }
}
