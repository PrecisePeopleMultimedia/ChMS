<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HouseholdMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'household_id',
        'member_id',
        'relationship_type_id',
        'role',
        'residency_start_date',
        'residency_end_date',
        'residency_status',
        'custody_type',
        'custody_notes',
        'guardian_id',
        'notes',
    ];

    protected $casts = [
        'residency_start_date' => 'date',
        'residency_end_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Household roles
     */
    public const ROLES = [
        'head' => 'Head',
        'resident' => 'Resident',
        'temporary' => 'Temporary',
        'guardian' => 'Guardian',
        'other' => 'Other',
    ];

    /**
     * Residency statuses
     */
    public const RESIDENCY_STATUSES = [
        'permanent' => 'Permanent',
        'temporary' => 'Temporary',
        'former' => 'Former',
    ];

    /**
     * Custody types
     */
    public const CUSTODY_TYPES = [
        'full' => 'Full Custody',
        'joint' => 'Joint Custody',
        'partial' => 'Partial Custody',
        'none' => 'No Custody',
    ];

    /**
     * Get the organization that owns the household membership
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the household
     */
    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }

    /**
     * Get the member
     */
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Get the relationship type
     */
    public function relationshipType(): BelongsTo
    {
        return $this->belongsTo(RelationshipType::class);
    }

    /**
     * Get the guardian (if applicable)
     */
    public function guardian(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'guardian_id');
    }

    /**
     * Check if residency is current
     */
    public function isCurrentResident(): bool
    {
        return $this->residency_status === 'permanent' || 
               ($this->residency_status === 'temporary' && 
                (!$this->residency_end_date || $this->residency_end_date->isFuture()));
    }
}

