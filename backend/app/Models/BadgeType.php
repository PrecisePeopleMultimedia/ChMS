<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class BadgeType extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'name',
        'description',
        'color',
        'icon',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Default badge types for Nigerian churches
     */
    public const DEFAULT_BADGES = [
        [
            'name' => 'Member',
            'description' => 'Regular church member',
            'color' => '#007bff',
            'icon' => 'person',
        ],
        [
            'name' => 'Visitor',
            'description' => 'First-time or occasional visitor',
            'color' => '#28a745',
            'icon' => 'person_add',
        ],
        [
            'name' => 'Volunteer',
            'description' => 'Active volunteer in church ministries',
            'color' => '#ffc107',
            'icon' => 'volunteer_activism',
        ],
        [
            'name' => 'Leader',
            'description' => 'Church leadership team member',
            'color' => '#dc3545',
            'icon' => 'admin_panel_settings',
        ],
        [
            'name' => 'VIP',
            'description' => 'Very Important Person - special attention needed',
            'color' => '#6f42c1',
            'icon' => 'star',
        ],
        [
            'name' => 'New Convert',
            'description' => 'Recently accepted Christ',
            'color' => '#20c997',
            'icon' => 'celebration',
        ],
        [
            'name' => 'Youth',
            'description' => 'Youth ministry member',
            'color' => '#fd7e14',
            'icon' => 'school',
        ],
        [
            'name' => 'Elder',
            'description' => 'Church elder or senior member',
            'color' => '#6c757d',
            'icon' => 'elderly',
        ],
        [
            'name' => 'Inactive',
            'description' => 'Member who has been inactive',
            'color' => '#adb5bd',
            'icon' => 'person_off',
        ],
        [
            'name' => 'Follow-up Needed',
            'description' => 'Requires pastoral follow-up',
            'color' => '#e83e8c',
            'icon' => 'follow_the_signs',
        ],
    ];

    /**
     * Available icons for badges
     */
    public const AVAILABLE_ICONS = [
        'person' => 'Person',
        'person_add' => 'Person Add',
        'volunteer_activism' => 'Volunteer',
        'admin_panel_settings' => 'Admin',
        'star' => 'Star',
        'celebration' => 'Celebration',
        'school' => 'School',
        'elderly' => 'Elderly',
        'person_off' => 'Person Off',
        'follow_the_signs' => 'Follow Up',
        'badge' => 'Badge',
        'verified' => 'Verified',
        'priority_high' => 'Priority',
        'favorite' => 'Favorite',
        'group' => 'Group',
        'church' => 'Church',
        'family_restroom' => 'Family',
        'medical_services' => 'Medical',
        'emergency' => 'Emergency',
        'work' => 'Work',
    ];

    /**
     * Get the organization that owns the badge type
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get all member badge assignments for this badge type
     */
    public function memberBadges(): HasMany
    {
        return $this->hasMany(MemberBadge::class);
    }

    /**
     * Get members who have this badge
     */
    public function members()
    {
        return $this->belongsToMany(Member::class, 'member_badges')
            ->withPivot(['assigned_by', 'assigned_at', 'expires_at', 'notes'])
            ->withTimestamps();
    }

    /**
     * Scope to get active badge types only
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order by name
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('name');
    }

    /**
     * Get the count of members with this badge
     */
    public function getMemberCountAttribute(): int
    {
        return $this->memberBadges()->count();
    }

    /**
     * Get the count of active members with this badge
     */
    public function getActiveMemberCountAttribute(): int
    {
        return $this->memberBadges()
            ->whereHas('member', function ($query) {
                $query->where('is_active', true);
            })
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->count();
    }

    /**
     * Check if badge is expired for a specific assignment
     */
    public function isExpired($expiresAt = null): bool
    {
        if (!$expiresAt) {
            return false;
        }

        return now()->isAfter($expiresAt);
    }

    /**
     * Get badge display style
     */
    public function getStyleAttribute(): array
    {
        return [
            'backgroundColor' => $this->color,
            'color' => $this->getContrastColor($this->color),
        ];
    }

    /**
     * Get contrasting text color for badge background
     */
    private function getContrastColor(string $hexColor): string
    {
        // Remove # if present
        $hex = ltrim($hexColor, '#');
        
        // Convert to RGB
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));
        
        // Calculate luminance
        $luminance = (0.299 * $r + 0.587 * $g + 0.114 * $b) / 255;
        
        // Return black for light colors, white for dark colors
        return $luminance > 0.5 ? '#000000' : '#ffffff';
    }

    /**
     * Validate hex color
     */
    public static function isValidHexColor(string $color): bool
    {
        return preg_match('/^#[a-f0-9]{6}$/i', $color);
    }

    /**
     * Create default badge types for an organization
     */
    public static function createDefaultBadges(int $organizationId): void
    {
        foreach (self::DEFAULT_BADGES as $badgeData) {
            $badgeData['organization_id'] = $organizationId;
            
            // Check if badge already exists
            $exists = self::where('organization_id', $organizationId)
                ->where('name', $badgeData['name'])
                ->exists();

            if (!$exists) {
                self::create($badgeData);
            }
        }
    }
}
