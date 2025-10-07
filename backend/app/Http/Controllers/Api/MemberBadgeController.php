<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\BadgeType;
use App\Models\MemberBadge;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class MemberBadgeController extends Controller
{
    /**
     * Get badges for a specific member
     */
    public function memberBadges(Request $request, Member $member): JsonResponse
    {
        // Ensure the member belongs to the user's organization
        if ($member->organization_id !== $request->user()->organization_id) {
            return response()->json(['message' => 'Member not found'], 404);
        }

        $badges = $member->memberBadges()
            ->with(['badgeType', 'assignedBy'])
            ->orderBy('assigned_at', 'desc')
            ->get()
            ->map(function ($memberBadge) {
                return $memberBadge->badge_display;
            });

        return response()->json([
            'data' => $badges,
            'summary' => $member->badge_summary
        ]);
    }

    /**
     * Assign a badge to a member
     */
    public function assignBadge(Request $request, Member $member): JsonResponse
    {
        // Ensure the member belongs to the user's organization
        if ($member->organization_id !== $request->user()->organization_id) {
            return response()->json(['message' => 'Member not found'], 404);
        }

        $validated = $request->validate([
            'badge_type_id' => 'required|integer|exists:badge_types,id',
            'expires_at' => 'nullable|date|after:now',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Ensure badge type belongs to the same organization
        $badgeType = BadgeType::where('id', $validated['badge_type_id'])
            ->where('organization_id', $request->user()->organization_id)
            ->first();

        if (!$badgeType) {
            return response()->json(['message' => 'Badge type not found'], 404);
        }

        $expiresAt = isset($validated['expires_at']) 
            ? Carbon::parse($validated['expires_at']) 
            : null;

        $memberBadge = $member->assignBadge(
            $validated['badge_type_id'],
            $request->user()->id,
            $validated['notes'] ?? null,
            $expiresAt
        );

        return response()->json([
            'message' => 'Badge assigned successfully',
            'data' => $memberBadge->badge_display
        ], 201);
    }

    /**
     * Remove a badge from a member
     */
    public function removeBadge(Request $request, Member $member, BadgeType $badgeType): JsonResponse
    {
        // Ensure the member belongs to the user's organization
        if ($member->organization_id !== $request->user()->organization_id) {
            return response()->json(['message' => 'Member not found'], 404);
        }

        // Ensure badge type belongs to the same organization
        if ($badgeType->organization_id !== $request->user()->organization_id) {
            return response()->json(['message' => 'Badge type not found'], 404);
        }

        $removed = $member->removeBadge($badgeType->id);

        if (!$removed) {
            return response()->json(['message' => 'Badge not found on member'], 404);
        }

        return response()->json([
            'message' => 'Badge removed successfully'
        ]);
    }

    /**
     * Update badge assignment (expiration, notes)
     */
    public function updateBadge(Request $request, Member $member, BadgeType $badgeType): JsonResponse
    {
        // Ensure the member belongs to the user's organization
        if ($member->organization_id !== $request->user()->organization_id) {
            return response()->json(['message' => 'Member not found'], 404);
        }

        // Ensure badge type belongs to the same organization
        if ($badgeType->organization_id !== $request->user()->organization_id) {
            return response()->json(['message' => 'Badge type not found'], 404);
        }

        $validated = $request->validate([
            'expires_at' => 'nullable|date|after:now',
            'notes' => 'nullable|string|max:1000',
        ]);

        $memberBadge = MemberBadge::where('member_id', $member->id)
            ->where('badge_type_id', $badgeType->id)
            ->first();

        if (!$memberBadge) {
            return response()->json(['message' => 'Badge assignment not found'], 404);
        }

        $updateData = [];
        
        if (isset($validated['expires_at'])) {
            $updateData['expires_at'] = Carbon::parse($validated['expires_at']);
        }
        
        if (isset($validated['notes'])) {
            $updateData['notes'] = $validated['notes'];
        }

        $memberBadge->update($updateData);

        return response()->json([
            'message' => 'Badge updated successfully',
            'data' => $memberBadge->badge_display
        ]);
    }

    /**
     * Bulk assign badges to multiple members
     */
    public function bulkAssign(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'member_ids' => 'required|array',
            'member_ids.*' => 'integer|exists:members,id',
            'badge_type_id' => 'required|integer|exists:badge_types,id',
            'expires_at' => 'nullable|date|after:now',
            'notes' => 'nullable|string|max:1000',
        ]);

        $organizationId = $request->user()->organization_id;
        $memberIds = $validated['member_ids'];

        // Ensure all members belong to the user's organization
        $members = Member::whereIn('id', $memberIds)
            ->where('organization_id', $organizationId)
            ->get();

        if ($members->count() !== count($memberIds)) {
            return response()->json(['message' => 'Some members not found'], 404);
        }

        // Ensure badge type belongs to the same organization
        $badgeType = BadgeType::where('id', $validated['badge_type_id'])
            ->where('organization_id', $organizationId)
            ->first();

        if (!$badgeType) {
            return response()->json(['message' => 'Badge type not found'], 404);
        }

        $expiresAt = isset($validated['expires_at']) 
            ? Carbon::parse($validated['expires_at']) 
            : null;

        $assignedCount = 0;
        $skippedCount = 0;

        foreach ($members as $member) {
            // Check if member already has this badge
            if ($member->hasBadgeById($badgeType->id)) {
                $skippedCount++;
                continue;
            }

            $member->assignBadge(
                $badgeType->id,
                $request->user()->id,
                $validated['notes'] ?? null,
                $expiresAt
            );

            $assignedCount++;
        }

        return response()->json([
            'message' => 'Bulk badge assignment completed',
            'assigned_count' => $assignedCount,
            'skipped_count' => $skippedCount,
            'total_members' => $members->count()
        ]);
    }

    /**
     * Bulk remove badges from multiple members
     */
    public function bulkRemove(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'member_ids' => 'required|array',
            'member_ids.*' => 'integer|exists:members,id',
            'badge_type_id' => 'required|integer|exists:badge_types,id',
        ]);

        $organizationId = $request->user()->organization_id;
        $memberIds = $validated['member_ids'];

        // Ensure all members belong to the user's organization
        $members = Member::whereIn('id', $memberIds)
            ->where('organization_id', $organizationId)
            ->get();

        if ($members->count() !== count($memberIds)) {
            return response()->json(['message' => 'Some members not found'], 404);
        }

        // Ensure badge type belongs to the same organization
        $badgeType = BadgeType::where('id', $validated['badge_type_id'])
            ->where('organization_id', $organizationId)
            ->first();

        if (!$badgeType) {
            return response()->json(['message' => 'Badge type not found'], 404);
        }

        $removedCount = 0;

        foreach ($members as $member) {
            if ($member->removeBadge($badgeType->id)) {
                $removedCount++;
            }
        }

        return response()->json([
            'message' => 'Bulk badge removal completed',
            'removed_count' => $removedCount,
            'total_members' => $members->count()
        ]);
    }

    /**
     * Get expiring badges for organization
     */
    public function expiringBadges(Request $request): JsonResponse
    {
        $days = $request->get('days', 7);
        $organizationId = $request->user()->organization_id;

        $expiringBadges = MemberBadge::getExpiringBadges($organizationId, $days);

        $badges = $expiringBadges->map(function ($memberBadge) {
            return [
                'id' => $memberBadge->id,
                'member_name' => $memberBadge->member->full_name,
                'member_id' => $memberBadge->member->id,
                'badge_name' => $memberBadge->badgeType->name,
                'badge_color' => $memberBadge->badgeType->color,
                'badge_icon' => $memberBadge->badgeType->icon,
                'expires_at' => $memberBadge->formatted_expires_at,
                'days_until_expiration' => $memberBadge->days_until_expiration,
                'assigned_by' => $memberBadge->assignedBy ? $memberBadge->assignedBy->name : null,
                'notes' => $memberBadge->notes,
            ];
        });

        return response()->json([
            'data' => $badges,
            'total_expiring' => $badges->count()
        ]);
    }

    /**
     * Auto-assign badges to a member
     */
    public function autoAssign(Request $request, Member $member): JsonResponse
    {
        // Ensure the member belongs to the user's organization
        if ($member->organization_id !== $request->user()->organization_id) {
            return response()->json(['message' => 'Member not found'], 404);
        }

        $member->autoAssignBadges();

        return response()->json([
            'message' => 'Auto-assignment completed',
            'badges' => $member->getBadgesWithDisplayInfo()
        ]);
    }
}
