<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Family extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'name',
        'head_id',
        'address',
        'phone',
        'email',
    ];

    /**
     * Get the organization that owns the family.
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the family head.
     */
    public function head(): BelongsTo
    {
        return $this->belongsTo(User::class, 'head_id');
    }

    /**
     * Get the family members.
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'family_members')
            ->withPivot('role')
            ->withTimestamps();
    }

    /**
     * Get the family size (number of members).
     */
    public function getSizeAttribute(): int
    {
        return $this->members()->count();
    }

    /**
     * Get all family members including the head.
     */
    public function getAllMembersAttribute()
    {
        $members = $this->members;
        $head = $this->head;
        
        if ($head && !$members->contains($head)) {
            $members->prepend($head);
        }
        
        return $members;
    }

    /**
     * Check if a user is a member of this family.
     */
    public function hasMember(User $user): bool
    {
        return $this->members()->where('user_id', $user->id)->exists() || 
               $this->head_id === $user->id;
    }

    /**
     * Get the role of a user in this family.
     */
    public function getMemberRole(User $user): ?string
    {
        if ($this->head_id === $user->id) {
            return 'head';
        }
        
        $member = $this->members()->where('user_id', $user->id)->first();
        return $member ? $member->pivot->role : null;
    }

    /**
     * Scope to get families for a specific organization.
     */
    public function scopeForOrganization($query, $organizationId)
    {
        return $query->where('organization_id', $organizationId);
    }

    /**
     * Scope to search families by name.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where('name', 'like', "%{$search}%");
    }
}