<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use App\Models\User;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'date_of_birth',
        'gender',
        'address',
        'member_type',
        'family_id',
        'joined_date',
        'is_active',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'joined_date' => 'date',
        'is_active' => 'boolean',
    ];

    /**
     * Member types
     */
    public const MEMBER_TYPES = [
        'member' => 'Member',
        'visitor' => 'Visitor',
        'child' => 'Child',
    ];

    /**
     * Gender options
     */
    public const GENDERS = [
        'male' => 'Male',
        'female' => 'Female',
        'other' => 'Other',
    ];

    /**
     * Get the organization that owns the member
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the family that the member belongs to
     */
    public function family(): BelongsTo
    {
        return $this->belongsTo(Family::class);
    }

    /**
     * Get all custom attribute values for this member
     */
    public function attributeValues(): HasMany
    {
        return $this->hasMany(MemberAttributeValue::class);
    }

    /**
     * Get custom attribute values with their attribute definitions
     */
    public function customAttributes()
    {
        return $this->attributeValues()->with('attribute');
    }

    /**
     * Get all badge assignments for this member
     */
    public function memberBadges(): HasMany
    {
        return $this->hasMany(MemberBadge::class);
    }

    /**
     * Get all notes for this member
     */
    public function notes(): HasMany
    {
        return $this->hasMany(MemberNote::class);
    }

    /**
     * Get pinned notes for this member
     */
    public function pinnedNotes(): HasMany
    {
        return $this->hasMany(MemberNote::class)->where('is_pinned', true);
    }

    /**
     * Get active alert notes for this member
     */
    public function activeAlertNotes(): HasMany
    {
        return $this->hasMany(MemberNote::class)
            ->where('is_alert', true)
            ->where(function ($query) {
                $query->whereNull('alert_expires_at')
                      ->orWhere('alert_expires_at', '>', now());
            });
    }

    /**
     * Get active (non-expired) badge assignments
     */
    public function activeBadges(): HasMany
    {
        return $this->hasMany(MemberBadge::class)->active();
    }

    /**
     * Get badge types assigned to this member
     */
    public function badges()
    {
        return $this->belongsToMany(BadgeType::class, 'member_badges')
            ->withPivot(['assigned_by', 'assigned_at', 'expires_at', 'notes'])
            ->withTimestamps();
    }

    /**
     * Get active badge types for this member
     */
    public function activeBadgeTypes()
    {
        return $this->belongsToMany(BadgeType::class, 'member_badges')
            ->wherePivot(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->withPivot(['assigned_by', 'assigned_at', 'expires_at', 'notes'])
            ->withTimestamps();
    }

    /**
     * Get the full name of the member
     */
    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    /**
     * Get the age of the member
     */
    public function getAgeAttribute(): ?int
    {
        if (!$this->date_of_birth) {
            return null;
        }

        return $this->date_of_birth->age;
    }

    /**
     * Scope to get active members only
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to search members by name, email, or phone
     */
    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('first_name', 'LIKE', "%{$search}%")
              ->orWhere('last_name', 'LIKE', "%{$search}%")
              ->orWhere('email', 'LIKE', "%{$search}%")
              ->orWhere('phone', 'LIKE', "%{$search}%");
        });
    }

    /**
     * Scope to filter by member type
     */
    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('member_type', $type);
    }

    /**
     * Scope to filter by gender
     */
    public function scopeByGender(Builder $query, string $gender): Builder
    {
        return $query->where('gender', $gender);
    }

    /**
     * Scope to search by custom attributes
     */
    public function scopeSearchCustomAttributes(Builder $query, string $search): Builder
    {
        return $query->whereHas('attributeValues', function ($q) use ($search) {
            $q->where('value', 'LIKE', "%{$search}%");
        });
    }

    /**
     * Get a specific custom attribute value
     */
    public function getCustomAttribute(string $attributeKey)
    {
        $attributeValue = $this->attributeValues()
            ->whereHas('attribute', function ($q) use ($attributeKey) {
                $q->where('key', $attributeKey);
            })
            ->with('attribute')
            ->first();

        return $attributeValue ? $attributeValue->formatted_value : null;
    }

    /**
     * Set a custom attribute value
     */
    public function setCustomAttribute(string $attributeKey, $value): void
    {
        $attribute = MemberAttribute::where('organization_id', $this->organization_id)
            ->where('key', $attributeKey)
            ->first();

        if (!$attribute) {
            return;
        }

        $formattedValue = $attribute->formatValue($value);

        $this->attributeValues()->updateOrCreate(
            ['attribute_id' => $attribute->id],
            ['value' => $formattedValue]
        );
    }

    /**
     * Get all custom attributes with their values for this member
     */
    public function getCustomAttributesWithValues()
    {
        $attributes = MemberAttribute::where('organization_id', $this->organization_id)
            ->active()
            ->ordered()
            ->get();

        $attributeValues = $this->attributeValues()
            ->with('attribute')
            ->get()
            ->keyBy('attribute_id');

        return $attributes->map(function ($attribute) use ($attributeValues) {
            $value = $attributeValues->get($attribute->id);

            return [
                'attribute' => $attribute,
                'value' => $value ? $value->value : null,
                'formatted_value' => $value ? $value->formatted_value : null,
                'display_value' => $value ? $value->display_value : '',
            ];
        });
    }

    /**
     * Bulk update custom attributes
     */
    public function updateCustomAttributes(array $attributes): void
    {
        foreach ($attributes as $attributeKey => $value) {
            $this->setCustomAttribute($attributeKey, $value);
        }
    }

    /**
     * Validate custom attributes
     */
    public function validateCustomAttributes(array $attributes): array
    {
        $errors = [];

        $memberAttributes = MemberAttribute::where('organization_id', $this->organization_id)
            ->active()
            ->get()
            ->keyBy('key');

        foreach ($attributes as $attributeKey => $value) {
            $attribute = $memberAttributes->get($attributeKey);

            if (!$attribute) {
                continue;
            }

            $rules = $attribute->getValidationRules();
            $validator = validator([$attributeKey => $value], [$attributeKey => $rules]);

            if ($validator->fails()) {
                $errors[$attributeKey] = $validator->errors()->first($attributeKey);
            }
        }

        return $errors;
    }

    /**
     * Check if member has a specific badge
     */
    public function hasBadge(string $badgeName): bool
    {
        return $this->activeBadgeTypes()
            ->where('name', $badgeName)
            ->exists();
    }

    /**
     * Check if member has a specific badge by ID
     */
    public function hasBadgeById(int $badgeTypeId): bool
    {
        return $this->activeBadges()
            ->where('badge_type_id', $badgeTypeId)
            ->exists();
    }

    /**
     * Assign a badge to this member
     */
    public function assignBadge(int $badgeTypeId, ?int $assignedBy = null, ?string $notes = null, ?\Carbon\Carbon $expiresAt = null): ?MemberBadge
    {
        return MemberBadge::assignBadgeToMember($this->id, $badgeTypeId, $assignedBy, $notes, $expiresAt);
    }

    /**
     * Remove a badge from this member
     */
    public function removeBadge(int $badgeTypeId): bool
    {
        return MemberBadge::removeBadgeFromMember($this->id, $badgeTypeId);
    }

    /**
     * Get all badges with display information
     */
    public function getBadgesWithDisplayInfo()
    {
        return $this->activeBadges()
            ->with(['badgeType', 'assignedBy'])
            ->get()
            ->map(function ($memberBadge) {
                return $memberBadge->badge_display;
            });
    }

    /**
     * Auto-assign badges based on member attributes
     */
    public function autoAssignBadges(): void
    {
        MemberBadge::autoAssignBadges($this);
    }

    /**
     * Scope to filter members by badge
     */
    public function scopeWithBadge(Builder $query, string $badgeName): Builder
    {
        return $query->whereHas('activeBadgeTypes', function ($q) use ($badgeName) {
            $q->where('name', $badgeName);
        });
    }

    /**
     * Scope to filter members by badge ID
     */
    public function scopeWithBadgeId(Builder $query, int $badgeTypeId): Builder
    {
        return $query->whereHas('activeBadges', function ($q) use ($badgeTypeId) {
            $q->where('badge_type_id', $badgeTypeId);
        });
    }

    /**
     * Get member's badge summary
     */
    public function getBadgeSummaryAttribute(): array
    {
        $badges = $this->getBadgesWithDisplayInfo();

        return [
            'total_badges' => $badges->count(),
            'active_badges' => $badges->where('expiration_status', 'active')->count(),
            'expiring_soon' => $badges->where('expiration_status', 'expiring_soon')->count(),
            'expired' => $badges->where('expiration_status', 'expired')->count(),
            'badges' => $badges->toArray(),
        ];
    }

    /**
     * Check if user can view this member
     */
    public function canView(User $user): bool
    {
        return $user->organization_id === $this->organization_id;
    }

    /**
     * Check if user can edit this member
     */
    public function canEdit(User $user): bool
    {
        return $user->organization_id === $this->organization_id;
    }

    /**
     * Check if user can delete this member
     */
    public function canDelete(User $user): bool
    {
        return $user->organization_id === $this->organization_id;
    }

    /**
     * Get attendance records for this member.
     */
    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class);
    }

    /**
     * Get QR codes for this member.
     */
    public function qrCodes(): HasMany
    {
        return $this->hasMany(MemberQrCode::class);
    }

    /**
     * Get active QR code for this member.
     */
    public function activeQrCode(): HasMany
    {
        return $this->hasMany(MemberQrCode::class)->active();
    }
}
