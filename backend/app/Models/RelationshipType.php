<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Builder;

class RelationshipType extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'name',
        'slug',
        'description',
        'category',
        'is_family',
        'is_household',
        'is_legal',
        'display_order',
        'is_active',
        'reciprocal_type_id',
    ];

    protected $casts = [
        'is_family' => 'boolean',
        'is_household' => 'boolean',
        'is_legal' => 'boolean',
        'display_order' => 'integer',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relationship categories
     */
    public const CATEGORIES = [
        'family' => 'Family',
        'household' => 'Household',
        'legal' => 'Legal',
        'custom' => 'Custom',
    ];

    /**
     * Get the organization that owns the relationship type
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the reciprocal relationship type
     */
    public function reciprocalType(): BelongsTo
    {
        return $this->belongsTo(RelationshipType::class, 'reciprocal_type_id');
    }

    /**
     * Get relationships using this type
     */
    public function familyRelationships(): HasMany
    {
        return $this->hasMany(FamilyRelationship::class);
    }

    /**
     * Scope to get active relationship types
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to filter by category
     */
    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    /**
     * Scope to get family relationship types
     */
    public function scopeFamilyTypes(Builder $query): Builder
    {
        return $query->where('is_family', true);
    }

    /**
     * Scope to get household relationship types
     */
    public function scopeHouseholdTypes(Builder $query): Builder
    {
        return $query->where('is_household', true);
    }

    /**
     * Scope to get legal relationship types
     */
    public function scopeLegalTypes(Builder $query): Builder
    {
        return $query->where('is_legal', true);
    }

    /**
     * Scope to order by display order
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('display_order')->orderBy('name');
    }
}

