<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class AttendanceRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'service_id',
        'member_id',
        'family_id',
        'checked_in_at',
        'checked_out_at',
        'checkin_method',
        'location_assignment',
        'ministry_assignment',
        'seat_section',
        'is_family_checkin',
        'parent_id',
        'child_security_code',
        'special_needs_notes',
        'visitor_name',
        'visitor_phone',
        'visitor_email',
        'device_info',
        'offline_sync',
        'notes',
        'checked_in_by',
    ];

    protected $casts = [
        'checked_in_at' => 'datetime',
        'checked_out_at' => 'datetime',
        'is_family_checkin' => 'boolean',
        'offline_sync' => 'boolean',
        'device_info' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Check-in methods
     */
    public const CHECKIN_METHODS = [
        'qr_individual' => 'QR Code (Individual)',
        'qr_family' => 'QR Code (Family)',
        'manual_search' => 'Manual Search',
        'visitor_registration' => 'Visitor Registration',
    ];

    /**
     * Get the organization that owns the attendance record
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the service for this attendance record
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Get the member for this attendance record
     */
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Get the family for this attendance record
     */
    public function family(): BelongsTo
    {
        return $this->belongsTo(Family::class);
    }

    /**
     * Get the parent member (for children)
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'parent_id');
    }

    /**
     * Get the user who checked in this record
     */
    public function checkedInBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'checked_in_by');
    }

    /**
     * Scope to filter by service
     */
    public function scopeByService(Builder $query, int $serviceId): Builder
    {
        return $query->where('service_id', $serviceId);
    }

    /**
     * Scope to filter by member
     */
    public function scopeByMember(Builder $query, int $memberId): Builder
    {
        return $query->where('member_id', $memberId);
    }

    /**
     * Scope to filter by family
     */
    public function scopeByFamily(Builder $query, int $familyId): Builder
    {
        return $query->where('family_id', $familyId);
    }

    /**
     * Scope to filter by check-in method
     */
    public function scopeByMethod(Builder $query, string $method): Builder
    {
        return $query->where('checkin_method', $method);
    }

    /**
     * Scope to filter by date range
     */
    public function scopeByDateRange(Builder $query, $startDate, $endDate): Builder
    {
        return $query->whereBetween('checked_in_at', [$startDate, $endDate]);
    }

    /**
     * Scope to get today's attendance
     */
    public function scopeToday(Builder $query): Builder
    {
        return $query->whereDate('checked_in_at', today());
    }

    /**
     * Scope to get visitor check-ins only
     */
    public function scopeVisitors(Builder $query): Builder
    {
        return $query->whereNull('member_id');
    }

    /**
     * Scope to get member check-ins only
     */
    public function scopeMembers(Builder $query): Builder
    {
        return $query->whereNotNull('member_id');
    }

    /**
     * Scope to get family check-ins
     */
    public function scopeFamilyCheckins(Builder $query): Builder
    {
        return $query->where('is_family_checkin', true);
    }

    /**
     * Scope to get offline-synced records
     */
    public function scopeOfflineSynced(Builder $query): Builder
    {
        return $query->where('offline_sync', true);
    }

    /**
     * Check if this is a visitor check-in
     */
    public function isVisitor(): bool
    {
        return is_null($this->member_id);
    }

    /**
     * Check if this is a family check-in
     */
    public function isFamilyCheckin(): bool
    {
        return $this->is_family_checkin;
    }

    /**
     * Get the display name (member name or visitor name)
     */
    public function getDisplayNameAttribute(): string
    {
        if ($this->member_id && $this->member) {
            return $this->member->full_name;
        }

        return $this->visitor_name ?? 'Unknown';
    }
}

