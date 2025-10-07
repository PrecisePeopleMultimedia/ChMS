<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MemberAttributeValue extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'attribute_id',
        'value',
    ];

    /**
     * Get the member that owns this attribute value
     */
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Get the attribute definition for this value
     */
    public function attribute(): BelongsTo
    {
        return $this->belongsTo(MemberAttribute::class, 'attribute_id');
    }

    /**
     * Get the formatted value based on the attribute type
     */
    public function getFormattedValueAttribute()
    {
        if (!$this->attribute) {
            return $this->value;
        }

        return $this->attribute->formatValue($this->value);
    }

    /**
     * Get the display value based on the attribute type
     */
    public function getDisplayValueAttribute(): string
    {
        if (!$this->attribute) {
            return (string) $this->value;
        }

        return $this->attribute->getDisplayValue($this->value);
    }

    /**
     * Scope to get values for a specific attribute
     */
    public function scopeForAttribute($query, int $attributeId)
    {
        return $query->where('attribute_id', $attributeId);
    }

    /**
     * Scope to get values for a specific member
     */
    public function scopeForMember($query, int $memberId)
    {
        return $query->where('member_id', $memberId);
    }

    /**
     * Scope to search by value
     */
    public function scopeSearchValue($query, string $search)
    {
        return $query->where('value', 'LIKE', "%{$search}%");
    }
}
