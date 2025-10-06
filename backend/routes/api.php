<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrganizationController;
use App\Http\Controllers\Api\OrganizationSettingsController;
use App\Http\Controllers\Api\ServiceScheduleController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\QrCodeController;

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

    // Attendance system routes
    Route::prefix('attendance')->group(function () {
        Route::get('/', [AttendanceController::class, 'index']);
        Route::post('/', [AttendanceController::class, 'store']);
        Route::get('/summary', [AttendanceController::class, 'summary']);
        Route::post('/checkin/qr', [AttendanceController::class, 'checkInQr']);
        Route::get('/{attendance}', [AttendanceController::class, 'show']);
        Route::put('/{attendance}', [AttendanceController::class, 'update']);
        Route::delete('/{attendance}', [AttendanceController::class, 'destroy']);
    });

    // Service routes
    Route::prefix('services')->group(function () {
        Route::get('/', [ServiceController::class, 'index']);
        Route::post('/', [ServiceController::class, 'store']);
        Route::get('/today', [ServiceController::class, 'today']);
        Route::get('/upcoming', [ServiceController::class, 'upcoming']);
        Route::get('/types', [ServiceController::class, 'types']);
        Route::post('/from-schedule', [ServiceController::class, 'createFromSchedule']);
        Route::get('/{service}', [ServiceController::class, 'show']);
        Route::put('/{service}', [ServiceController::class, 'update']);
        Route::delete('/{service}', [ServiceController::class, 'destroy']);
        Route::get('/{service}/stats', [ServiceController::class, 'stats']);
    });

    // QR Code routes
    Route::prefix('qr-codes')->group(function () {
        Route::post('/generate', [QrCodeController::class, 'generate']);
        Route::post('/validate', [QrCodeController::class, 'validate']);
        Route::get('/active', [QrCodeController::class, 'active']);
        Route::get('/stats', [QrCodeController::class, 'stats']);
        Route::post('/bulk-generate', [QrCodeController::class, 'bulkGenerate']);
        Route::get('/member/{member}', [QrCodeController::class, 'forMember']);
        Route::delete('/{qrCode}/deactivate', [QrCodeController::class, 'deactivate']);
        Route::post('/{qrCode}/regenerate', [QrCodeController::class, 'regenerate']);
    });
});

// Health check route
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'version' => '1.0.0'
    ]);
});
