<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Family extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'family_name',
        'head_of_family_id',
        'address',
        'anniversary_date',
    ];

    protected $casts = [
        'anniversary_date' => 'date',
    ];

    /**
     * Get the organization that owns the family
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the head of family member
     */
    public function headOfFamily(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'head_of_family_id');
    }

    /**
     * Get all members in this family
     */
    public function members(): HasMany
    {
        return $this->hasMany(Member::class);
    }

    /**
     * Get active members in this family
     */
    public function activeMembers(): HasMany
    {
        return $this->hasMany(Member::class)->where('is_active', true);
    }

    /**
     * Get the total number of members in this family
     */
    public function getMemberCountAttribute(): int
    {
        return $this->members()->count();
    }

    /**
     * Get the total number of active members in this family
     */
    public function getActiveMemberCountAttribute(): int
    {
        return $this->activeMembers()->count();
    }

    /**
     * Get QR codes for this family.
     */
    public function qrCodes(): HasMany
    {
        return $this->hasMany(MemberQrCode::class);
    }

    /**
     * Get active QR code for this family.
     */
    public function activeQrCode(): HasMany
    {
        return $this->hasMany(MemberQrCode::class)->active()->ofType('family');
    }

    /**
     * Get attendance records for this family.
     */
    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class);
    }
}
