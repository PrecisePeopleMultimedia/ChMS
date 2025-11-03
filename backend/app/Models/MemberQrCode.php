<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;
use Carbon\Carbon;

class MemberQrCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'organization_id',
        'qr_code_data',
        'qr_code_type',
        'family_id',
        'generated_at',
        'expires_at',
        'is_active',
        'service_id',
        'verification_token',
        'usage_count',
        'last_used_at',
    ];

    protected $casts = [
        'generated_at' => 'datetime',
        'expires_at' => 'datetime',
        'last_used_at' => 'datetime',
        'is_active' => 'boolean',
        'usage_count' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * QR Code types
     */
    public const QR_CODE_TYPES = [
        'individual' => 'Individual',
        'family' => 'Family',
    ];

    /**
     * Get the member for this QR code
     */
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Get the organization that owns the QR code
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the family for this QR code (if family type)
     */
    public function family(): BelongsTo
    {
        return $this->belongsTo(Family::class);
    }

    /**
     * Get the service for this QR code (if service-specific)
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Scope to get active QR codes
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('expires_at')
                  ->orWhere('expires_at', '>', now());
            });
    }

    /**
     * Scope to get expired QR codes
     */
    public function scopeExpired(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->whereNotNull('expires_at')
            ->where('expires_at', '<=', now());
    }

    /**
     * Scope to filter by QR code type
     */
    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('qr_code_type', $type);
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
     * Generate QR code data for a member
     */
    public static function generateForMember(Member $member, ?int $serviceId = null, ?int $organizationId = null): self
    {
        $organizationId = $organizationId ?? $member->organization_id;

        // Generate QR code data
        $qrData = [
            'type' => 'member_checkin',
            'member_id' => $member->id,
            'organization_id' => $organizationId,
            'service_id' => $serviceId,
            'timestamp' => now()->timestamp,
            'token' => Str::random(32),
        ];

        $qrCodeData = base64_encode(json_encode($qrData));

        // Create or update QR code
        $qrCode = self::updateOrCreate(
            [
                'member_id' => $member->id,
                'organization_id' => $organizationId,
                'service_id' => $serviceId,
                'is_active' => true,
            ],
            [
                'qr_code_data' => $qrCodeData,
                'qr_code_type' => 'individual',
                'verification_token' => $qrData['token'],
                'generated_at' => now(),
                'expires_at' => now()->addYear(), // QR codes expire after 1 year
                'usage_count' => 0,
            ]
        );

        return $qrCode;
    }

    /**
     * Generate QR code data for a family
     */
    public static function generateForFamily(Family $family, ?int $serviceId = null, ?int $organizationId = null): self
    {
        $organizationId = $organizationId ?? $family->organization_id;

        // Get all active members in the family
        $memberIds = $family->members()->active()->pluck('id')->toArray();

        // Generate QR code data
        $qrData = [
            'type' => 'family_checkin',
            'family_id' => $family->id,
            'organization_id' => $organizationId,
            'member_ids' => $memberIds,
            'service_id' => $serviceId,
            'timestamp' => now()->timestamp,
            'token' => Str::random(32),
        ];

        $qrCodeData = base64_encode(json_encode($qrData));

        // Create or update QR code
        $qrCode = self::updateOrCreate(
            [
                'family_id' => $family->id,
                'organization_id' => $organizationId,
                'service_id' => $serviceId,
                'is_active' => true,
            ],
            [
                'qr_code_data' => $qrCodeData,
                'qr_code_type' => 'family',
                'verification_token' => $qrData['token'],
                'generated_at' => now(),
                'expires_at' => now()->addYear(), // QR codes expire after 1 year
                'usage_count' => 0,
            ]
        );

        return $qrCode;
    }

    /**
     * Validate and decode QR code data
     */
    public static function validateAndDecode(string $qrCodeData): ?array
    {
        try {
            $decoded = json_decode(base64_decode($qrCodeData), true);

            if (!$decoded || !isset($decoded['type'])) {
                return null;
            }

            // Verify QR code exists and is active
            $qrCode = self::where('qr_code_data', $qrCodeData)
                ->active()
                ->first();

            if (!$qrCode) {
                return null;
            }

            // Verify token matches
            if (isset($decoded['token']) && $decoded['token'] !== $qrCode->verification_token) {
                return null;
            }

            // Update usage statistics
            $qrCode->increment('usage_count');
            $qrCode->update(['last_used_at' => now()]);

            return $decoded;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Check if QR code is expired
     */
    public function isExpired(): bool
    {
        if (!$this->expires_at) {
            return false;
        }

        return $this->expires_at->isPast();
    }

    /**
     * Check if QR code is valid
     */
    public function isValid(): bool
    {
        return $this->is_active && !$this->isExpired();
    }

    /**
     * Deactivate QR code
     */
    public function deactivate(): void
    {
        $this->update(['is_active' => false]);
    }
}

