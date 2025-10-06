<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class MemberQrCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'qr_code_data',
        'generated_at',
        'expires_at',
        'is_active',
    ];

    protected $casts = [
        'generated_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Get the member that owns the QR code.
     */
    public function member(): BelongsTo
    {
        return $this->belongsTo(User::class, 'member_id');
    }

    /**
     * Check if the QR code is expired.
     */
    public function isExpired(): bool
    {
        if (is_null($this->expires_at)) {
            return false; // No expiration date means it never expires
        }
        
        return $this->expires_at->isPast();
    }

    /**
     * Check if the QR code is valid (active and not expired).
     */
    public function isValid(): bool
    {
        return $this->is_active && !$this->isExpired();
    }

    /**
     * Generate a new QR code for a member.
     */
    public static function generateForMember(User $member, int $expirationDays = 365): self
    {
        // Create unique QR code data
        $qrData = 'member_' . $member->id . '_' . time() . '_' . bin2hex(random_bytes(8));
        
        // Calculate expiration date
        $expiresAt = Carbon::now()->addDays($expirationDays);
        
        // Deactivate any existing QR codes for this member
        static::where('member_id', $member->id)
            ->where('is_active', true)
            ->update(['is_active' => false]);
        
        // Create new QR code
        return static::create([
            'member_id' => $member->id,
            'qr_code_data' => $qrData,
            'generated_at' => Carbon::now(),
            'expires_at' => $expiresAt,
            'is_active' => true,
        ]);
    }

    /**
     * Find a valid QR code by its data.
     */
    public static function findByData(string $qrData): ?self
    {
        return static::where('qr_code_data', $qrData)
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', Carbon::now());
            })
            ->first();
    }

    /**
     * Get the display format for the QR code.
     */
    public function getDisplayFormatAttribute(): string
    {
        return "Member: {$this->member->name} (ID: {$this->member->id})";
    }

    /**
     * Scope to get active QR codes.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get non-expired QR codes.
     */
    public function scopeNotExpired($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')
              ->orWhere('expires_at', '>', Carbon::now());
        });
    }

    /**
     * Scope to get valid QR codes (active and not expired).
     */
    public function scopeValid($query)
    {
        return $query->active()->notExpired();
    }

    /**
     * Scope to get QR codes for a specific member.
     */
    public function scopeForMember($query, $memberId)
    {
        return $query->where('member_id', $memberId);
    }
}
