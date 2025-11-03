<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrganizationController;
use App\Http\Controllers\Api\OrganizationSettingsController;
use App\Http\Controllers\Api\ServiceScheduleController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\MemberAttributeController;
use App\Http\Controllers\Api\MemberAttributeValueController;
use App\Http\Controllers\Api\BadgeTypeController;
use App\Http\Controllers\Api\MemberBadgeController;
use App\Http\Controllers\Api\MonitoringController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\HouseholdController;
use App\Http\Controllers\Api\FamilyRelationshipController;
use App\Http\Controllers\Api\RelationshipTypeController;

// Health check endpoint for Docker
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'service' => 'ChMS Laravel API'
    ]);
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// CSRF token endpoint for SPA
Route::get('/csrf-token', function () {
    return response()->json([
        'csrf_token' => csrf_token()
    ]);
});

// Public authentication routes with rate limiting
Route::prefix('auth')->middleware(\App\Http\Middleware\RateLimitMiddleware::class)->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    
    // Google OAuth routes
    Route::get('/google', [AuthController::class, 'googleLogin']);
    Route::get('/google/callback', [AuthController::class, 'googleCallback']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });
    
    // User profile routes
    Route::prefix('profile')->group(function () {
        Route::get('/', [AuthController::class, 'profile']);
        Route::put('/', [AuthController::class, 'updateProfile']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
    });

    // Organization routes
    Route::apiResource('organizations', OrganizationController::class);

    // Organization settings routes
    Route::prefix('organizations/{organization}')->group(function () {
        Route::get('/settings', [OrganizationSettingsController::class, 'index']);
        Route::put('/settings', [OrganizationSettingsController::class, 'update']);
        Route::post('/settings', [OrganizationSettingsController::class, 'store']);
        Route::get('/settings/{key}', [OrganizationSettingsController::class, 'show']);
        Route::delete('/settings/{key}', [OrganizationSettingsController::class, 'destroy']);
    });

    // Service schedule routes
    Route::apiResource('service-schedules', ServiceScheduleController::class);

    // Service routes (individual service instances)
    Route::apiResource('services', ServiceController::class);
    Route::get('/services/{id}/attendance-stats', [ServiceController::class, 'attendanceStats']);

    // Attendance routes
    Route::prefix('attendance')->group(function () {
        Route::get('/', [AttendanceController::class, 'index']);
        Route::post('/', [AttendanceController::class, 'store']);
        Route::post('/qr-checkin', [AttendanceController::class, 'qrCheckin']);
        Route::post('/family-checkin', [AttendanceController::class, 'familyCheckin']);
        Route::get('/reports', [AttendanceController::class, 'reports']);
    });

    // QR Code routes
    Route::prefix('qr-codes')->group(function () {
        Route::get('/members/{member}/generate', [AttendanceController::class, 'generateMemberQrCode']);
        Route::get('/families/{family}/generate', [AttendanceController::class, 'generateFamilyQrCode']);
    });

    // Member routes
    Route::apiResource('members', MemberController::class);
    Route::get('/members/options', [MemberController::class, 'options']);
    Route::post('/members/bulk-update', [MemberController::class, 'bulkUpdate']);
    Route::get('/members/{member}/qr-code', [AttendanceController::class, 'generateMemberQrCode']);
    
    // Member notes routes
    Route::prefix('members/{member}/notes')->group(function () {
        Route::get('/', [App\Http\Controllers\Api\MemberNoteController::class, 'index']);
        Route::post('/', [App\Http\Controllers\Api\MemberNoteController::class, 'store']);
        Route::get('/{note}', [App\Http\Controllers\Api\MemberNoteController::class, 'show']);
        Route::put('/{note}', [App\Http\Controllers\Api\MemberNoteController::class, 'update']);
        Route::delete('/{note}', [App\Http\Controllers\Api\MemberNoteController::class, 'destroy']);
    });
    
    // Notes search and utility routes
    Route::prefix('notes')->group(function () {
        Route::get('/search', [App\Http\Controllers\Api\MemberNoteController::class, 'search']);
        Route::get('/types', [App\Http\Controllers\Api\MemberNoteController::class, 'noteTypes']);
        Route::get('/privacy-levels', [App\Http\Controllers\Api\MemberNoteController::class, 'privacyLevels']);
    });

    // Member attributes routes
    Route::apiResource('member-attributes', MemberAttributeController::class);
    Route::get('/member-attributes-categories', [MemberAttributeController::class, 'categories']);
    Route::get('/member-attributes-field-types', [MemberAttributeController::class, 'fieldTypes']);
    Route::post('/member-attributes/update-order', [MemberAttributeController::class, 'updateOrder']);

    // Member attribute values routes
    Route::get('/members/{member}/attributes', [MemberAttributeValueController::class, 'index']);
    Route::put('/members/{member}/attributes', [MemberAttributeValueController::class, 'update']);
    Route::post('/member-attributes/bulk-update', [MemberAttributeValueController::class, 'bulkUpdate']);

    // Badge type routes
    Route::apiResource('badge-types', BadgeTypeController::class);
    Route::get('/badge-types-icons', [BadgeTypeController::class, 'icons']);
    Route::post('/badge-types/create-defaults', [BadgeTypeController::class, 'createDefaults']);
    Route::get('/badge-types-statistics', [BadgeTypeController::class, 'statistics']);
    Route::post('/badge-types/bulk-update', [BadgeTypeController::class, 'bulkUpdate']);

    // Member badge routes
    Route::get('/members/{member}/badges', [MemberBadgeController::class, 'memberBadges']);
    Route::post('/members/{member}/badges', [MemberBadgeController::class, 'assignBadge']);
    Route::delete('/members/{member}/badges/{badgeType}', [MemberBadgeController::class, 'removeBadge']);
    Route::put('/members/{member}/badges/{badgeType}', [MemberBadgeController::class, 'updateBadge']);
    Route::post('/members/{member}/badges/auto-assign', [MemberBadgeController::class, 'autoAssign']);
    Route::post('/member-badges/bulk-assign', [MemberBadgeController::class, 'bulkAssign']);
    Route::post('/member-badges/bulk-remove', [MemberBadgeController::class, 'bulkRemove']);
    Route::get('/member-badges/expiring', [MemberBadgeController::class, 'expiringBadges']);

    // Household routes
    Route::apiResource('households', HouseholdController::class);
    Route::post('/households/{id}/members', [HouseholdController::class, 'addMember']);
    Route::delete('/households/{id}/members/{memberId}', [HouseholdController::class, 'removeMember']);
    Route::get('/households/{id}/members', [HouseholdController::class, 'members']);

    // Family relationship routes
    Route::apiResource('family-relationships', FamilyRelationshipController::class);
    Route::get('/members/{member}/relationships', [FamilyRelationshipController::class, 'memberRelationships']);

    // Relationship type routes
    Route::apiResource('relationship-types', RelationshipTypeController::class);
    Route::get('/relationship-types-categories', function () {
        return response()->json([
            'data' => \App\Models\RelationshipType::CATEGORIES
        ]);
    });
});

// Monitoring routes
Route::prefix('monitoring')->group(function () {
    Route::get('/health', [MonitoringController::class, 'health']);
    Route::get('/metrics', [MonitoringController::class, 'metrics']);
    Route::get('/logs', [MonitoringController::class, 'logs']);
    Route::get('/performance', [MonitoringController::class, 'performance']);
    Route::get('/security', [MonitoringController::class, 'security']);
});

// Legacy health check route for backward compatibility
Route::get('/health', function () {
    $monitoringService = app(\App\Services\MonitoringService::class);
    $healthData = $monitoringService->checkHealth();
    
    $httpStatus = $healthData['status'] === 'healthy' ? 200 : 503;
    
    return response()->json($healthData, $httpStatus);
});

// Monitoring and observability routes
Route::prefix('monitoring')->group(function () {
    Route::get('/metrics', [App\Http\Controllers\Api\MonitoringController::class, 'metrics']);
    Route::get('/security-alerts', [App\Http\Controllers\Api\MonitoringController::class, 'securityAlerts']);
    Route::get('/health-status', [App\Http\Controllers\Api\MonitoringController::class, 'healthStatus']);
});
