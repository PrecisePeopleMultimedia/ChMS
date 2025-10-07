<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class MemberBadge extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'badge_type_id',
        'assigned_by',
        'assigned_at',
        'expires_at',
        'notes',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    /**
     * Get the member that owns this badge
     */
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Get the badge type for this assignment
     */
    public function badgeType(): BelongsTo
    {
        return $this->belongsTo(BadgeType::class);
    }

    /**
     * Get the user who assigned this badge
     */
    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    /**
     * Scope to get active (non-expired) badges
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')
              ->orWhere('expires_at', '>', now());
        });
    }

    /**
     * Scope to get expired badges
     */
    public function scopeExpired(Builder $query): Builder
    {
        return $query->whereNotNull('expires_at')
            ->where('expires_at', '<=', now());
    }

    /**
     * Scope to get badges for a specific member
     */
    public function scopeForMember(Builder $query, int $memberId): Builder
    {
        return $query->where('member_id', $memberId);
    }

    /**
     * Scope to get badges of a specific type
     */
    public function scopeOfType(Builder $query, int $badgeTypeId): Builder
    {
        return $query->where('badge_type_id', $badgeTypeId);
    }

    /**
     * Scope to get badges assigned by a specific user
     */
    public function scopeAssignedBy(Builder $query, int $userId): Builder
    {
        return $query->where('assigned_by', $userId);
    }

    /**
     * Scope to get badges expiring soon
     */
    public function scopeExpiringSoon(Builder $query, int $days = 7): Builder
    {
        return $query->whereNotNull('expires_at')
            ->whereBetween('expires_at', [now(), now()->addDays($days)]);
    }

    /**
     * Check if this badge is expired
     */
    public function getIsExpiredAttribute(): bool
    {
        if (!$this->expires_at) {
            return false;
        }

        return now()->isAfter($this->expires_at);
    }

    /**
     * Check if this badge is expiring soon
     */
    public function getIsExpiringSoonAttribute(): bool
    {
        if (!$this->expires_at) {
            return false;
        }

        return now()->diffInDays($this->expires_at, false) <= 7 && !$this->is_expired;
    }

    /**
     * Get days until expiration
     */
    public function getDaysUntilExpirationAttribute(): ?int
    {
        if (!$this->expires_at) {
            return null;
        }

        $days = now()->diffInDays($this->expires_at, false);
        return $this->is_expired ? 0 : $days;
    }

    /**
     * Get expiration status
     */
    public function getExpirationStatusAttribute(): string
    {
        if (!$this->expires_at) {
            return 'never';
        }

        if ($this->is_expired) {
            return 'expired';
        }

        if ($this->is_expiring_soon) {
            return 'expiring_soon';
        }

        return 'active';
    }

    /**
     * Get formatted assigned date
     */
    public function getFormattedAssignedAtAttribute(): string
    {
        return $this->assigned_at->format('M j, Y');
    }

    /**
     * Get formatted expiration date
     */
    public function getFormattedExpiresAtAttribute(): ?string
    {
        return $this->expires_at ? $this->expires_at->format('M j, Y') : null;
    }

    /**
     * Get badge display information
     */
    public function getBadgeDisplayAttribute(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->badgeType->name,
            'description' => $this->badgeType->description,
            'color' => $this->badgeType->color,
            'icon' => $this->badgeType->icon,
            'assigned_at' => $this->formatted_assigned_at,
            'expires_at' => $this->formatted_expires_at,
            'is_expired' => $this->is_expired,
            'is_expiring_soon' => $this->is_expiring_soon,
            'expiration_status' => $this->expiration_status,
            'days_until_expiration' => $this->days_until_expiration,
            'notes' => $this->notes,
            'assigned_by_name' => $this->assignedBy ? $this->assignedBy->name : null,
        ];
    }

    /**
     * Auto-assign badges based on member attributes
     */
    public static function autoAssignBadges(Member $member): void
    {
        $organizationId = $member->organization_id;
        
        // Auto-assign based on member type
        $badgeMapping = [
            'visitor' => 'Visitor',
            'member' => 'Member',
        ];

        if (isset($badgeMapping[$member->member_type])) {
            $badgeType = BadgeType::where('organization_id', $organizationId)
                ->where('name', $badgeMapping[$member->member_type])
                ->first();

            if ($badgeType) {
                self::assignBadgeToMember($member->id, $badgeType->id, null, 'Auto-assigned based on member type');
            }
        }

        // Auto-assign "New Convert" badge if joined recently (within 30 days)
        if ($member->joined_date && $member->joined_date->isAfter(now()->subDays(30))) {
            $newConvertBadge = BadgeType::where('organization_id', $organizationId)
                ->where('name', 'New Convert')
                ->first();

            if ($newConvertBadge) {
                self::assignBadgeToMember(
                    $member->id, 
                    $newConvertBadge->id, 
                    null, 
                    'Auto-assigned for new member',
                    now()->addDays(90) // Expires in 90 days
                );
            }
        }
    }

    /**
     * Assign a badge to a member
     */
    public static function assignBadgeToMember(
        int $memberId, 
        int $badgeTypeId, 
        ?int $assignedBy = null, 
        ?string $notes = null,
        ?Carbon $expiresAt = null
    ): ?self {
        // Check if badge already exists
        $existingBadge = self::where('member_id', $memberId)
            ->where('badge_type_id', $badgeTypeId)
            ->first();

        if ($existingBadge) {
            // Update existing badge
            $existingBadge->update([
                'assigned_by' => $assignedBy,
                'assigned_at' => now(),
                'expires_at' => $expiresAt,
                'notes' => $notes,
            ]);

            return $existingBadge;
        }

        // Create new badge assignment
        return self::create([
            'member_id' => $memberId,
            'badge_type_id' => $badgeTypeId,
            'assigned_by' => $assignedBy,
            'assigned_at' => now(),
            'expires_at' => $expiresAt,
            'notes' => $notes,
        ]);
    }

    /**
     * Remove a badge from a member
     */
    public static function removeBadgeFromMember(int $memberId, int $badgeTypeId): bool
    {
        return self::where('member_id', $memberId)
            ->where('badge_type_id', $badgeTypeId)
            ->delete() > 0;
    }

    /**
     * Get expiring badges for an organization
     */
    public static function getExpiringBadges(int $organizationId, int $days = 7): \Illuminate\Database\Eloquent\Collection
    {
        return self::with(['member', 'badgeType', 'assignedBy'])
            ->whereHas('badgeType', function ($query) use ($organizationId) {
                $query->where('organization_id', $organizationId);
            })
            ->expiringSoon($days)
            ->orderBy('expires_at')
            ->get();
    }
}
