<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'name',
        'service_date',
        'start_time',
        'end_time',
        'service_type',
        'is_active',
    ];

    protected $casts = [
        'service_date' => 'date',
        'start_time' => 'datetime:H:i:s',
        'end_time' => 'datetime:H:i:s',
        'is_active' => 'boolean',
    ];

    /**
     * Get the organization that owns the service.
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the attendance records for the service.
     */
    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class);
    }

    /**
     * Get the total attendance count for this service.
     */
    public function getTotalAttendanceAttribute(): int
    {
        return $this->attendanceRecords()->count();
    }

    /**
     * Get the member attendance count for this service.
     */
    public function getMemberAttendanceAttribute(): int
    {
        return $this->attendanceRecords()
            ->whereNotNull('member_id')
            ->count();
    }

    /**
     * Get the visitor attendance count for this service.
     */
    public function getVisitorAttendanceAttribute(): int
    {
        return $this->attendanceRecords()
            ->whereNull('member_id')
            ->count();
    }

    /**
     * Scope to get active services.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get services for a specific date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('service_date', [$startDate, $endDate]);
    }

    /**
     * Scope to get services by type.
     */
    public function scopeByType($query, $type)
    {
        return $query->where('service_type', $type);
    }
}
