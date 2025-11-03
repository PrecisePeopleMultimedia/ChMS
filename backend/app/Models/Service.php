<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'name',
        'service_type',
        'scheduled_date',
        'start_time',
        'end_time',
        'location',
        'location_assignment',
        'capacity',
        'ministry_assignments',
        'special_requirements',
        'allow_family_checkin',
        'require_location_assignment',
        'enable_child_security',
        'status',
        'notes',
    ];

    protected $casts = [
        'scheduled_date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'ministry_assignments' => 'array',
        'special_requirements' => 'array',
        'allow_family_checkin' => 'boolean',
        'require_location_assignment' => 'boolean',
        'enable_child_security' => 'boolean',
        'capacity' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Service types
     */
    public const SERVICE_TYPES = [
        'sunday_morning' => 'Sunday Morning',
        'sunday_evening' => 'Sunday Evening',
        'midweek' => 'Midweek',
        'special_event' => 'Special Event',
    ];

    /**
     * Service statuses
     */
    public const STATUSES = [
        'scheduled' => 'Scheduled',
        'active' => 'Active',
        'completed' => 'Completed',
        'cancelled' => 'Cancelled',
    ];

    /**
     * Get the organization that owns the service
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get all attendance records for this service
     */
    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class);
    }

    /**
     * Get QR codes associated with this service
     */
    public function qrCodes(): HasMany
    {
        return $this->hasMany(MemberQrCode::class);
    }

    /**
     * Scope to get active services
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to get scheduled services
     */
    public function scopeScheduled(Builder $query): Builder
    {
        return $query->where('status', 'scheduled');
    }

    /**
     * Scope to get completed services
     */
    public function scopeCompleted(Builder $query): Builder
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope to filter by service type
     */
    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('service_type', $type);
    }

    /**
     * Scope to filter by date range
     */
    public function scopeByDateRange(Builder $query, $startDate, $endDate): Builder
    {
        return $query->whereBetween('scheduled_date', [$startDate, $endDate]);
    }

    /**
     * Scope to get services for today
     */
    public function scopeToday(Builder $query): Builder
    {
        return $query->whereDate('scheduled_date', today());
    }

    /**
     * Scope to get upcoming services
     */
    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->where('scheduled_date', '>=', today())
            ->whereIn('status', ['scheduled', 'active']);
    }

    /**
     * Get attendance count for this service
     */
    public function getAttendanceCountAttribute(): int
    {
        return $this->attendanceRecords()->count();
    }

    /**
     * Check if service is currently active
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if service is scheduled
     */
    public function isScheduled(): bool
    {
        return $this->status === 'scheduled';
    }

    /**
     * Check if service is completed
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Get service type name
     */
    public function getServiceTypeNameAttribute(): string
    {
        return self::SERVICE_TYPES[$this->service_type] ?? $this->service_type;
    }
}

