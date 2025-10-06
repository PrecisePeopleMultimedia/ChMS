<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MemberHistory extends Model
{
    /**
     * Indicates if the model should be timestamped.
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'member_id',
        'changed_by_user_id',
        'change_type',
        'field_changes',
        'old_values',
        'new_values',
        'created_at',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'field_changes' => 'array',
        'old_values' => 'array',
        'new_values' => 'array',
        'created_at' => 'datetime',
    ];

    /**
     * Get the member that this history record belongs to.
     */
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Get the user who made the change.
     */
    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by_user_id');
    }

    /**
     * Create a history record for a member change.
     */
    public static function logChange(Member $member, string $changeType, array $oldValues = [], array $newValues = [], ?int $userId = null): self
    {
        $fieldChanges = [];

        // Determine which fields changed
        foreach ($newValues as $field => $newValue) {
            $oldValue = $oldValues[$field] ?? null;
            if ($oldValue !== $newValue) {
                $fieldChanges[] = $field;
            }
        }

        return self::create([
            'member_id' => $member->id,
            'changed_by_user_id' => $userId ?? auth()->id(),
            'change_type' => $changeType,
            'field_changes' => $fieldChanges,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'created_at' => now(),
        ]);
    }
}
