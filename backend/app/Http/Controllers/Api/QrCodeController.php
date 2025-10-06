<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MemberQrCode;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class QrCodeController extends Controller
{
    /**
     * Generate a QR code for a member.
     */
    public function generate(Request $request): JsonResponse
    {
        $request->validate([
            'member_id' => 'required|exists:users,id',
            'expiration_days' => 'nullable|integer|min:1|max:365',
        ]);

        $user = Auth::user();
        $organizationId = $user->organization_id;

        // Check if member belongs to the same organization
        $member = User::where('id', $request->member_id)
            ->where('organization_id', $organizationId)
            ->first();

        if (!$member) {
            return response()->json([
                'message' => 'Member not found or does not belong to your organization',
            ], 404);
        }

        // Check if member already has an active QR code
        $existingQrCode = MemberQrCode::where('member_id', $member->id)
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', Carbon::now());
            })
            ->first();

        if ($existingQrCode) {
            return response()->json([
                'message' => 'Member already has an active QR code',
                'data' => $existingQrCode,
            ], 409);
        }

        // Generate new QR code
        $expirationDays = $request->get('expiration_days', 365);
        $qrCode = MemberQrCode::generateForMember($member, $expirationDays);

        return response()->json([
            'message' => 'QR code generated successfully',
            'data' => $qrCode,
        ], 201);
    }

    /**
     * Validate a QR code.
     */
    public function validate(Request $request): JsonResponse
    {
        $request->validate([
            'qr_code_data' => 'required|string',
        ]);

        $qrCode = MemberQrCode::findByData($request->qr_code_data);

        if (!$qrCode) {
            return response()->json([
                'valid' => false,
                'message' => 'QR code not found',
            ], 404);
        }

        if (!$qrCode->isValid()) {
            return response()->json([
                'valid' => false,
                'message' => $qrCode->isExpired() ? 'QR code has expired' : 'QR code is inactive',
            ], 400);
        }

        // Check if member belongs to the same organization
        $user = Auth::user();
        if ($qrCode->member->organization_id !== $user->organization_id) {
            return response()->json([
                'valid' => false,
                'message' => 'QR code does not belong to your organization',
            ], 403);
        }

        return response()->json([
            'valid' => true,
            'message' => 'QR code is valid',
            'data' => [
                'member' => [
                    'id' => $qrCode->member->id,
                    'name' => $qrCode->member->name,
                    'email' => $qrCode->member->email,
                ],
                'qr_code' => [
                    'id' => $qrCode->id,
                    'generated_at' => $qrCode->generated_at,
                    'expires_at' => $qrCode->expires_at,
                ],
            ],
        ]);
    }

    /**
     * Get QR codes for a member.
     */
    public function forMember(User $member): JsonResponse
    {
        $user = Auth::user();
        
        // Check if member belongs to the same organization
        if ($member->organization_id !== $user->organization_id) {
            return response()->json([
                'message' => 'Member not found',
            ], 404);
        }

        $qrCodes = MemberQrCode::where('member_id', $member->id)
            ->orderBy('generated_at', 'desc')
            ->get();

        return response()->json([
            'data' => $qrCodes,
        ]);
    }

    /**
     * Get active QR codes for the organization.
     */
    public function active(Request $request): JsonResponse
    {
        $user = Auth::user();
        $organizationId = $user->organization_id;

        $query = MemberQrCode::with('member')
            ->whereHas('member', function ($q) use ($organizationId) {
                $q->where('organization_id', $organizationId);
            })
            ->where('is_active', true);

        // Filter by expiration status
        if ($request->has('expires_soon')) {
            $expiresSoon = Carbon::now()->addDays(7);
            $query->where('expires_at', '<=', $expiresSoon);
        }

        if ($request->has('never_expires')) {
            $query->whereNull('expires_at');
        }

        $qrCodes = $query->orderBy('generated_at', 'desc')->get();

        return response()->json([
            'data' => $qrCodes,
        ]);
    }

    /**
     * Deactivate a QR code.
     */
    public function deactivate(MemberQrCode $qrCode): JsonResponse
    {
        $user = Auth::user();
        
        // Check if QR code belongs to user's organization
        if ($qrCode->member->organization_id !== $user->organization_id) {
            return response()->json([
                'message' => 'QR code not found',
            ], 404);
        }

        $qrCode->update(['is_active' => false]);

        return response()->json([
            'message' => 'QR code deactivated successfully',
        ]);
    }

    /**
     * Regenerate a QR code.
     */
    public function regenerate(MemberQrCode $qrCode): JsonResponse
    {
        $user = Auth::user();
        
        // Check if QR code belongs to user's organization
        if ($qrCode->member->organization_id !== $user->organization_id) {
            return response()->json([
                'message' => 'QR code not found',
            ], 404);
        }

        // Deactivate current QR code
        $qrCode->update(['is_active' => false]);

        // Generate new QR code
        $newQrCode = MemberQrCode::generateForMember($qrCode->member);

        return response()->json([
            'message' => 'QR code regenerated successfully',
            'data' => $newQrCode,
        ]);
    }

    /**
     * Get QR code statistics.
     */
    public function stats(): JsonResponse
    {
        $user = Auth::user();
        $organizationId = $user->organization_id;

        $stats = [
            'total_qr_codes' => MemberQrCode::whereHas('member', function ($q) use ($organizationId) {
                $q->where('organization_id', $organizationId);
            })->count(),
            'active_qr_codes' => MemberQrCode::whereHas('member', function ($q) use ($organizationId) {
                $q->where('organization_id', $organizationId);
            })->where('is_active', true)->count(),
            'expired_qr_codes' => MemberQrCode::whereHas('member', function ($q) use ($organizationId) {
                $q->where('organization_id', $organizationId);
            })->where('expires_at', '<', Carbon::now())->count(),
            'expiring_soon' => MemberQrCode::whereHas('member', function ($q) use ($organizationId) {
                $q->where('organization_id', $organizationId);
            })->where('expires_at', '<=', Carbon::now()->addDays(7))
              ->where('expires_at', '>', Carbon::now())
              ->count(),
        ];

        return response()->json([
            'data' => $stats,
        ]);
    }

    /**
     * Bulk generate QR codes for multiple members.
     */
    public function bulkGenerate(Request $request): JsonResponse
    {
        $request->validate([
            'member_ids' => 'required|array',
            'member_ids.*' => 'exists:users,id',
            'expiration_days' => 'nullable|integer|min:1|max:365',
        ]);

        $user = Auth::user();
        $organizationId = $user->organization_id;
        $expirationDays = $request->get('expiration_days', 365);

        $generatedCodes = [];
        $errors = [];

        foreach ($request->member_ids as $memberId) {
            try {
                $member = User::where('id', $memberId)
                    ->where('organization_id', $organizationId)
                    ->first();

                if (!$member) {
                    $errors[] = "Member ID {$memberId} not found or does not belong to your organization";
                    continue;
                }

                // Check if member already has an active QR code
                $existingQrCode = MemberQrCode::where('member_id', $member->id)
                    ->where('is_active', true)
                    ->where(function ($query) {
                        $query->whereNull('expires_at')
                              ->orWhere('expires_at', '>', Carbon::now());
                    })
                    ->first();

                if ($existingQrCode) {
                    $errors[] = "Member {$member->name} already has an active QR code";
                    continue;
                }

                $qrCode = MemberQrCode::generateForMember($member, $expirationDays);
                $generatedCodes[] = $qrCode;

            } catch (\Exception $e) {
                $errors[] = "Failed to generate QR code for member ID {$memberId}: " . $e->getMessage();
            }
        }

        return response()->json([
            'message' => 'Bulk QR code generation completed',
            'data' => [
                'generated' => $generatedCodes,
                'errors' => $errors,
                'summary' => [
                    'total_requested' => count($request->member_ids),
                    'successfully_generated' => count($generatedCodes),
                    'errors' => count($errors),
                ],
            ],
        ]);
    }
}
