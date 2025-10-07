<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrganizationController;
use App\Http\Controllers\Api\OrganizationSettingsController;
use App\Http\Controllers\Api\ServiceScheduleController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\MemberAttributeController;

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

// Public authentication routes
Route::prefix('auth')->group(function () {
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

    // Member routes
    Route::apiResource('members', MemberController::class);
    Route::get('/members/options', [MemberController::class, 'options']);
    Route::post('/members/bulk-update', [MemberController::class, 'bulkUpdate']);

    // Member attributes routes
    Route::apiResource('member-attributes', MemberAttributeController::class);
    Route::get('/member-attributes-categories', [MemberAttributeController::class, 'categories']);
    Route::get('/member-attributes-field-types', [MemberAttributeController::class, 'fieldTypes']);
    Route::post('/member-attributes/update-order', [MemberAttributeController::class, 'updateOrder']);
});

// Health check route
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'version' => '1.0.0'
    ]);
});
