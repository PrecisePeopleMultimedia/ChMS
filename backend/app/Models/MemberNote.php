<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class MemberNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'author_id',
        'title',
        'content',
        'note_type',
        'privacy_level',
        'is_alert',
        'is_pinned',
        'alert_expires_at',
    ];

    protected $casts = [
        'is_alert' => 'boolean',
        'is_pinned' => 'boolean',
        'alert_expires_at' => 'datetime',
    ];

    /**
     * Note types
     */
    public const NOTE_TYPES = [
        'Personal Note' => 'Personal Note',
        'Follow-up' => 'Follow-up',
        'Prayer Request' => 'Prayer Request',
        'Ministry Note' => 'Ministry Note',
        'Administrative' => 'Administrative',
        'Pastoral Care' => 'Pastoral Care',
        'Emergency' => 'Emergency',
    ];

    /**
     * Privacy levels
     */
    public const PRIVACY_LEVELS = [
        'public' => 'Public',
        'private' => 'Private',
        'extreme' => 'Extreme',
    ];

    /**
     * Get the member that owns the note
     */
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Get the user who created the note
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Scope for active alerts (not expired)
     */
    public function scopeActiveAlerts(Builder $query): Builder
    {
        return $query->where('is_alert', true)
            ->where(function ($q) {
                $q->whereNull('alert_expires_at')
                  ->orWhere('alert_expires_at', '>', now());
            });
    }

    /**
     * Scope for pinned notes
     */
    public function scopePinned(Builder $query): Builder
    {
        return $query->where('is_pinned', true);
    }

    /**
     * Scope for notes by privacy level
     */
    public function scopeByPrivacyLevel(Builder $query, string $level): Builder
    {
        return $query->where('privacy_level', $level);
    }

    /**
     * Scope for notes by type
     */
    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('note_type', $type);
    }

    /**
     * Check if the alert is still active
     */
    public function isAlertActive(): bool
    {
        if (!$this->is_alert) {
            return false;
        }

        if (!$this->alert_expires_at) {
            return true;
        }

        return $this->alert_expires_at->isFuture();
    }

    /**
     * Get the formatted alert status
     */
    public function getAlertStatusAttribute(): string
    {
        if (!$this->is_alert) {
            return 'No Alert';
        }

        if ($this->isAlertActive()) {
            return 'Active Alert';
        }

        return 'Expired Alert';
    }

    /**
     * Get the privacy level description
     */
    public function getPrivacyLevelDescriptionAttribute(): string
    {
        return self::PRIVACY_LEVELS[$this->privacy_level] ?? 'Unknown';
    }

    /**
     * Get the note type description
     */
    public function getNoteTypeDescriptionAttribute(): string
    {
        return self::NOTE_TYPES[$this->note_type] ?? 'Unknown';
    }

    /**
     * Check if user can view this note based on privacy level
     */
    public function canView(User $user): bool
    {
        // Author can always view their own notes
        if ($this->author_id === $user->id) {
            return true;
        }

        // Public notes can be viewed by anyone in the organization
        if ($this->privacy_level === 'public') {
            return true;
        }

        // Private notes can be viewed by admins and the member
        if ($this->privacy_level === 'private') {
            return $user->role === 'admin' || $user->id === $this->member->user_id;
        }

        // Extreme privacy - only author and admins
        if ($this->privacy_level === 'extreme') {
            return $user->role === 'admin';
        }

        return false;
    }

    /**
     * Check if user can edit this note
     */
    public function canEdit(User $user): bool
    {
        // Author can always edit their own notes
        if ($this->author_id === $user->id) {
            return true;
        }

        // Admins can edit any note
        return $user->role === 'admin';
    }

    /**
     * Check if user can delete this note
     */
    public function canDelete(User $user): bool
    {
        // Author can delete their own notes
        if ($this->author_id === $user->id) {
            return true;
        }

        // Admins can delete any note
        return $user->role === 'admin';
    }
}
