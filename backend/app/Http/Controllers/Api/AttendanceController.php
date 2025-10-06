<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AttendanceRequest;
use App\Models\AttendanceRecord;
use App\Models\Service;
use App\Models\User;
use App\Models\MemberQrCode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    /**
     * Display a listing of attendance records.
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        $organizationId = $user->organization_id;

        $query = AttendanceRecord::with(['service', 'member', 'checkedInBy'])
            ->where('organization_id', $organizationId);

        // Filter by service
        if ($request->has('service_id')) {
            $query->where('service_id', $request->service_id);
        }

        // Filter by date range
        if ($request->has('start_date')) {
            $query->whereDate('check_in_time', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->whereDate('check_in_time', '<=', $request->end_date);
        }

        // Filter by member
        if ($request->has('member_id')) {
            $query->where('member_id', $request->member_id);
        }

        // Filter by check-in method
        if ($request->has('check_in_method')) {
            $query->where('check_in_method', $request->check_in_method);
        }

        // Filter by member/visitor
        if ($request->has('type')) {
            if ($request->type === 'members') {
                $query->whereNotNull('member_id');
            } elseif ($request->type === 'visitors') {
                $query->whereNull('member_id');
            }
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $attendance = $query->orderBy('check_in_time', 'desc')->paginate($perPage);

        return response()->json([
            'data' => $attendance->items(),
            'pagination' => [
                'current_page' => $attendance->currentPage(),
                'last_page' => $attendance->lastPage(),
                'per_page' => $attendance->perPage(),
                'total' => $attendance->total(),
            ],
        ]);
    }

    /**
     * Store a newly created attendance record.
     */
    public function store(AttendanceRequest $request): JsonResponse
    {
        $user = Auth::user();
        $organizationId = $user->organization_id;

        // Validate service exists and belongs to organization
        $service = Service::where('id', $request->service_id)
            ->where('organization_id', $organizationId)
            ->where('is_active', true)
            ->first();

        if (!$service) {
            return response()->json([
                'message' => 'Service not found or inactive',
            ], 404);
        }

        // Check if member exists (for member check-ins)
        if ($request->has('member_id') && $request->member_id) {
            $member = User::where('id', $request->member_id)
                ->where('organization_id', $organizationId)
                ->first();

            if (!$member) {
                return response()->json([
                    'message' => 'Member not found',
                ], 404);
            }
        }

        // Check for duplicate attendance (same member, same service)
        if ($request->has('member_id') && $request->member_id) {
            $existingAttendance = AttendanceRecord::where('service_id', $request->service_id)
                ->where('member_id', $request->member_id)
                ->first();

            if ($existingAttendance) {
                return response()->json([
                    'message' => 'Member already checked in for this service',
                    'attendance' => $existingAttendance,
                ], 409);
            }
        }

        // Create attendance record
        $attendance = AttendanceRecord::create([
            'organization_id' => $organizationId,
            'service_id' => $request->service_id,
            'member_id' => $request->member_id,
            'visitor_name' => $request->visitor_name,
            'visitor_phone' => $request->visitor_phone,
            'check_in_time' => $request->check_in_time ?? now(),
            'check_in_method' => $request->check_in_method,
            'checked_in_by' => $user->id,
            'notes' => $request->notes,
        ]);

        // Load relationships
        $attendance->load(['service', 'member', 'checkedInBy']);

        return response()->json([
            'message' => 'Attendance recorded successfully',
            'data' => $attendance,
        ], 201);
    }

    /**
     * Display the specified attendance record.
     */
    public function show(AttendanceRecord $attendance): JsonResponse
    {
        $user = Auth::user();
        
        // Check if attendance belongs to user's organization
        if ($attendance->organization_id !== $user->organization_id) {
            return response()->json([
                'message' => 'Attendance record not found',
            ], 404);
        }

        $attendance->load(['service', 'member', 'checkedInBy']);

        return response()->json([
            'data' => $attendance,
        ]);
    }

    /**
     * Update the specified attendance record.
     */
    public function update(AttendanceRequest $request, AttendanceRecord $attendance): JsonResponse
    {
        $user = Auth::user();
        
        // Check if attendance belongs to user's organization
        if ($attendance->organization_id !== $user->organization_id) {
            return response()->json([
                'message' => 'Attendance record not found',
            ], 404);
        }

        // Update attendance record
        $attendance->update($request->validated());

        $attendance->load(['service', 'member', 'checkedInBy']);

        return response()->json([
            'message' => 'Attendance updated successfully',
            'data' => $attendance,
        ]);
    }

    /**
     * Remove the specified attendance record.
     */
    public function destroy(AttendanceRecord $attendance): JsonResponse
    {
        $user = Auth::user();
        
        // Check if attendance belongs to user's organization
        if ($attendance->organization_id !== $user->organization_id) {
            return response()->json([
                'message' => 'Attendance record not found',
            ], 404);
        }

        $attendance->delete();

        return response()->json([
            'message' => 'Attendance record deleted successfully',
        ]);
    }

    /**
     * Check in a member using QR code.
     */
    public function checkInQr(Request $request): JsonResponse
    {
        $request->validate([
            'qr_code_data' => 'required|string',
            'service_id' => 'required|exists:services,id',
        ]);

        $user = Auth::user();
        $organizationId = $user->organization_id;

        // Find QR code
        $qrCode = MemberQrCode::findByData($request->qr_code_data);
        
        if (!$qrCode || !$qrCode->isValid()) {
            return response()->json([
                'message' => 'Invalid or expired QR code',
            ], 400);
        }

        // Validate service
        $service = Service::where('id', $request->service_id)
            ->where('organization_id', $organizationId)
            ->where('is_active', true)
            ->first();

        if (!$service) {
            return response()->json([
                'message' => 'Service not found or inactive',
            ], 404);
        }

        // Check for duplicate attendance
        $existingAttendance = AttendanceRecord::where('service_id', $request->service_id)
            ->where('member_id', $qrCode->member_id)
            ->first();

        if ($existingAttendance) {
            return response()->json([
                'message' => 'Member already checked in for this service',
                'attendance' => $existingAttendance,
            ], 409);
        }

        // Create attendance record
        $attendance = AttendanceRecord::create([
            'organization_id' => $organizationId,
            'service_id' => $request->service_id,
            'member_id' => $qrCode->member_id,
            'check_in_time' => now(),
            'check_in_method' => 'qr_code',
            'checked_in_by' => $user->id,
        ]);

        $attendance->load(['service', 'member', 'checkedInBy']);

        return response()->json([
            'message' => 'Check-in successful',
            'data' => $attendance,
        ], 201);
    }

    /**
     * Get attendance statistics for a service.
     */
    public function serviceStats(Service $service): JsonResponse
    {
        $user = Auth::user();
        
        // Check if service belongs to user's organization
        if ($service->organization_id !== $user->organization_id) {
            return response()->json([
                'message' => 'Service not found',
            ], 404);
        }

        $stats = [
            'total_attendance' => $service->attendanceRecords()->count(),
            'member_attendance' => $service->attendanceRecords()->members()->count(),
            'visitor_attendance' => $service->attendanceRecords()->visitors()->count(),
            'qr_code_checkins' => $service->attendanceRecords()->byMethod('qr_code')->count(),
            'manual_checkins' => $service->attendanceRecords()->byMethod('manual_search')->count(),
            'visitor_checkins' => $service->attendanceRecords()->byMethod('visitor')->count(),
        ];

        return response()->json([
            'data' => $stats,
        ]);
    }

    /**
     * Get attendance summary for date range.
     */
    public function summary(Request $request): JsonResponse
    {
        $user = Auth::user();
        $organizationId = $user->organization_id;

        $startDate = $request->get('start_date', Carbon::now()->subDays(30));
        $endDate = $request->get('end_date', Carbon::now());

        $summary = [
            'total_attendance' => AttendanceRecord::where('organization_id', $organizationId)
                ->whereBetween('check_in_time', [$startDate, $endDate])
                ->count(),
            'member_attendance' => AttendanceRecord::where('organization_id', $organizationId)
                ->whereBetween('check_in_time', [$startDate, $endDate])
                ->members()
                ->count(),
            'visitor_attendance' => AttendanceRecord::where('organization_id', $organizationId)
                ->whereBetween('check_in_time', [$startDate, $endDate])
                ->visitors()
                ->count(),
            'services_held' => Service::where('organization_id', $organizationId)
                ->whereBetween('service_date', [$startDate, $endDate])
                ->where('is_active', true)
                ->count(),
        ];

        return response()->json([
            'data' => $summary,
        ]);
    }
}
