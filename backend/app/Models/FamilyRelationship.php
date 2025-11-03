<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class FamilyRelationship extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'family_id',
        'person1_id',
        'person2_id',
        'relationship_type_id',
        'relationship_details',
        'is_primary',
        'start_date',
        'end_date',
        'status',
        'custody_type',
        'custody_notes',
        'custody_start_date',
        'custody_end_date',
        'notes',
    ];

    protected $casts = [
        'relationship_details' => 'array',
        'is_primary' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
        'custody_start_date' => 'date',
        'custody_end_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relationship statuses
     */
    public const STATUSES = [
        'active' => 'Active',
        'ended' => 'Ended',
        'pending' => 'Pending',
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
     * Get the organization that owns the relationship
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the family this relationship belongs to
     */
    public function family(): BelongsTo
    {
        return $this->belongsTo(Family::class);
    }

    /**
     * Get the first person in the relationship
     */
    public function person1(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'person1_id');
    }

    /**
     * Get the second person in the relationship
     */
    public function person2(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'person2_id');
    }

    /**
     * Get the relationship type
     */
    public function relationshipType(): BelongsTo
    {
        return $this->belongsTo(RelationshipType::class);
    }

    /**
     * Scope to get active relationships
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to get primary relationships
     */
    public function scopePrimary(Builder $query): Builder
    {
        return $query->where('is_primary', true);
    }

    /**
     * Scope to filter by relationship type
     */
    public function scopeByType(Builder $query, int $relationshipTypeId): Builder
    {
        return $query->where('relationship_type_id', $relationshipTypeId);
    }

    /**
     * Scope to get relationships for a specific member
     */
    public function scopeForMember(Builder $query, int $memberId): Builder
    {
        return $query->where(function ($q) use ($memberId) {
            $q->where('person1_id', $memberId)
              ->orWhere('person2_id', $memberId);
        });
    }

    /**
     * Scope to get relationships with custody information
     */
    public function scopeWithCustody(Builder $query): Builder
    {
        return $query->whereNotNull('custody_type');
    }

    /**
     * Check if relationship is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active' && !$this->end_date;
    }

    /**
     * Check if relationship is ended
     */
    public function isEnded(): bool
    {
        return $this->status === 'ended' || ($this->end_date && $this->end_date->isPast());
    }

    /**
     * Get the other person in the relationship (given one person)
     */
    public function getOtherPerson(int $memberId): ?Member
    {
        if ($this->person1_id === $memberId) {
            return $this->person2;
        }
        if ($this->person2_id === $memberId) {
            return $this->person1;
        }
        return null;
    }
}

