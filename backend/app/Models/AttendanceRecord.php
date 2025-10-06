<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttendanceRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'service_id',
        'member_id',
        'visitor_name',
        'visitor_phone',
        'check_in_time',
        'check_in_method',
        'checked_in_by',
        'notes',
    ];

    protected $casts = [
        'check_in_time' => 'datetime',
    ];

    /**
     * Get the organization that owns the attendance record.
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the service for this attendance record.
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Get the member for this attendance record.
     */
    public function member(): BelongsTo
    {
        return $this->belongsTo(User::class, 'member_id');
    }

    /**
     * Get the user who checked in this record.
     */
    public function checkedInBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'checked_in_by');
    }

    /**
     * Check if this is a member attendance.
     */
    public function isMemberAttendance(): bool
    {
        return !is_null($this->member_id);
    }

    /**
     * Check if this is a visitor attendance.
     */
    public function isVisitorAttendance(): bool
    {
        return is_null($this->member_id) && !is_null($this->visitor_name);
    }

    /**
     * Get the display name for this attendance record.
     */
    public function getDisplayNameAttribute(): string
    {
        if ($this->isMemberAttendance()) {
            return $this->member->name ?? 'Unknown Member';
        }
        
        return $this->visitor_name ?? 'Unknown Visitor';
    }

    /**
     * Scope to get member attendance records.
     */
    public function scopeMembers($query)
    {
        return $query->whereNotNull('member_id');
    }

    /**
     * Scope to get visitor attendance records.
     */
    public function scopeVisitors($query)
    {
        return $query->whereNull('member_id')->whereNotNull('visitor_name');
    }

    /**
     * Scope to get attendance by method.
     */
    public function scopeByMethod($query, $method)
    {
        return $query->where('check_in_method', $method);
    }

    /**
     * Scope to get attendance for a date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('check_in_time', [$startDate, $endDate]);
    }
}
