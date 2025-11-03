<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Builder;

class Household extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'name',
        'description',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'head_of_household_id',
        'home_phone',
        'email',
        'household_type',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Household types
     */
    public const HOUSEHOLD_TYPES = [
        'primary' => 'Primary',
        'secondary' => 'Secondary',
        'temporary' => 'Temporary',
    ];

    /**
     * Get the organization that owns the household
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the head of household member
     */
    public function headOfHousehold(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'head_of_household_id');
    }

    /**
     * Get all members in this household through household_members
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(Member::class, 'household_members')
            ->withPivot([
                'relationship_type_id',
                'role',
                'residency_start_date',
                'residency_end_date',
                'residency_status',
                'custody_type',
                'custody_notes',
                'guardian_id',
                'notes',
            ])
            ->withTimestamps();
    }

    /**
     * Get active household members
     */
    public function activeMembers(): BelongsToMany
    {
        return $this->members()
            ->wherePivot('residency_status', '!=', 'former')
            ->where('members.is_active', true);
    }

    /**
     * Get household memberships (the pivot table records)
     */
    public function householdMemberships(): HasMany
    {
        return $this->hasMany(HouseholdMember::class);
    }

    /**
     * Get the total number of members in this household
     */
    public function getMemberCountAttribute(): int
    {
        return $this->activeMembers()->count();
    }

    /**
     * Scope to get active households
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to filter by household type
     */
    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('household_type', $type);
    }
}

