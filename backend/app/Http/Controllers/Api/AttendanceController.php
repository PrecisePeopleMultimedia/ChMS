<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRecord;
use App\Models\Member;
use App\Models\MemberQrCode;
use App\Models\Service;
use App\Models\Family;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    /**
     * Display a listing of attendance records
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user->organization_id) {
            return response()->json([
                'message' => 'No organization found for user',
                'data' => []
            ], 404);
        }

        $query = AttendanceRecord::where('organization_id', $user->organization_id)
            ->with(['service', 'member', 'family', 'checkedInBy']);

        // Filter by service
        if ($request->has('service_id')) {
            $query->byService($request->service_id);
        }

        // Filter by member
        if ($request->has('member_id')) {
            $query->byMember($request->member_id);
        }

        // Filter by family
        if ($request->has('family_id')) {
            $query->byFamily($request->family_id);
        }

        // Filter by check-in method
        if ($request->has('checkin_method')) {
            $query->byMethod($request->checkin_method);
        }

        // Filter by date range
        if ($request->has('date_from') && $request->has('date_to')) {
            $query->byDateRange($request->date_from, $request->date_to);
        }

        // Get today's attendance
        if ($request->boolean('today')) {
            $query->today();
        }

        // Filter visitors only
        if ($request->boolean('visitors_only')) {
            $query->visitors();
        }

        // Filter members only
        if ($request->boolean('members_only')) {
            $query->members();
        }

        // Filter family check-ins
        if ($request->boolean('family_checkins_only')) {
            $query->familyCheckins();
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $attendance = $query->orderBy('checked_in_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'message' => 'Attendance records retrieved successfully',
            'data' => $attendance
        ]);
    }

    /**
     * Store a newly created attendance record (manual check-in)
     */
    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user->organization_id) {
            return response()->json([
                'message' => 'No organization found for user'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'service_id' => 'required|exists:services,id',
            'member_id' => 'nullable|exists:members,id',
            'visitor_name' => 'nullable|string|max:255|required_without:member_id',
            'visitor_phone' => 'nullable|string|max:50',
            'visitor_email' => 'nullable|email|max:255',
            'location_assignment' => 'nullable|string|max:255',
            'ministry_assignment' => 'nullable|string|max:255',
            'seat_section' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
            'checkin_method' => ['nullable', Rule::in(array_keys(AttendanceRecord::CHECKIN_METHODS))],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verify service belongs to organization
        $service = Service::where('id', $request->service_id)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$service) {
            return response()->json([
                'message' => 'Service not found or does not belong to your organization'
            ], 404);
        }

        // Verify member belongs to organization (if provided)
        if ($request->has('member_id')) {
            $member = Member::where('id', $request->member_id)
                ->where('organization_id', $user->organization_id)
                ->first();

            if (!$member) {
                return response()->json([
                    'message' => 'Member not found or does not belong to your organization'
                ], 404);
            }

            // Check for duplicate check-in
            $existingCheckin = AttendanceRecord::where('member_id', $request->member_id)
                ->where('service_id', $request->service_id)
                ->first();

            if ($existingCheckin) {
                return response()->json([
                    'message' => 'Member already checked in for this service',
                    'data' => $existingCheckin->load(['service', 'member'])
                ], 422);
            }
        }

        // Create attendance record
        $attendanceData = $validator->validated();
        $attendanceData['organization_id'] = $user->organization_id;
        $attendanceData['checked_in_by'] = $user->id;
        $attendanceData['checked_in_at'] = now();
        $attendanceData['checkin_method'] = $attendanceData['checkin_method'] ?? 'manual_search';
        $attendanceData['offline_sync'] = $request->boolean('offline_sync', false);

        // Add device info if provided
        if ($request->has('device_info')) {
            $attendanceData['device_info'] = $request->device_info;
        }

        $attendance = AttendanceRecord::create($attendanceData);

        return response()->json([
            'message' => 'Attendance recorded successfully',
            'data' => $attendance->load(['service', 'member', 'family', 'checkedInBy'])
        ], 201);
    }

    /**
     * Process QR code check-in
     */
    public function qrCheckin(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user->organization_id) {
            return response()->json([
                'message' => 'No organization found for user'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'qr_code_data' => 'required|string',
            'service_id' => 'required|exists:services,id',
            'location_assignment' => 'nullable|string|max:255',
            'ministry_assignment' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Validate and decode QR code
        $qrData = MemberQrCode::validateAndDecode($request->qr_code_data);

        if (!$qrData) {
            return response()->json([
                'message' => 'Invalid or expired QR code'
            ], 400);
        }

        // Verify service belongs to organization
        $service = Service::where('id', $request->service_id)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$service) {
            return response()->json([
                'message' => 'Service not found or does not belong to your organization'
            ], 404);
        }

        // Handle individual member QR code
        if ($qrData['type'] === 'member_checkin' && isset($qrData['member_id'])) {
            $member = Member::where('id', $qrData['member_id'])
                ->where('organization_id', $user->organization_id)
                ->first();

            if (!$member) {
                return response()->json([
                    'message' => 'Member not found'
                ], 404);
            }

            // Check for duplicate check-in
            $existingCheckin = AttendanceRecord::where('member_id', $member->id)
                ->where('service_id', $request->service_id)
                ->first();

            if ($existingCheckin) {
                return response()->json([
                    'message' => 'Member already checked in for this service',
                    'data' => $existingCheckin->load(['service', 'member'])
                ], 422);
            }

            // Create attendance record
            $attendance = AttendanceRecord::create([
                'organization_id' => $user->organization_id,
                'service_id' => $request->service_id,
                'member_id' => $member->id,
                'family_id' => $member->family_id,
                'checked_in_by' => $user->id,
                'checked_in_at' => now(),
                'checkin_method' => 'qr_individual',
                'location_assignment' => $request->location_assignment,
                'ministry_assignment' => $request->ministry_assignment,
                'offline_sync' => $request->boolean('offline_sync', false),
            ]);

            return response()->json([
                'message' => 'Member checked in successfully',
                'data' => $attendance->load(['service', 'member', 'family'])
            ], 201);
        }

        // Handle family QR code
        if ($qrData['type'] === 'family_checkin' && isset($qrData['family_id'])) {
            return $this->processFamilyCheckin($qrData, $request, $user, $service);
        }

        return response()->json([
            'message' => 'Invalid QR code type'
        ], 400);
    }

    /**
     * Process family check-in
     */
    private function processFamilyCheckin(array $qrData, Request $request, $user, Service $service): JsonResponse
    {
        $family = Family::where('id', $qrData['family_id'])
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$family) {
            return response()->json([
                'message' => 'Family not found'
            ], 404);
        }

        // Get all active members in the family
        $members = $family->members()->active()->get();

        if ($members->isEmpty()) {
            return response()->json([
                'message' => 'No active members found in family'
            ], 404);
        }

        $memberIds = $members->pluck('id')->toArray();

        // Check for existing check-ins
        $existingCheckins = AttendanceRecord::where('service_id', $request->service_id)
            ->whereIn('member_id', $memberIds)
            ->get();

        if ($existingCheckins->isNotEmpty()) {
            return response()->json([
                'message' => 'Some family members are already checked in',
                'data' => [
                    'existing_checkins' => $existingCheckins->load('member'),
                    'family' => $family,
                ]
            ], 422);
        }

        // Create attendance records for all family members
        $attendanceRecords = [];
        DB::beginTransaction();

        try {
            foreach ($members as $member) {
                // Determine ministry assignment for children
                $ministryAssignment = $request->ministry_assignment;
                if (!$ministryAssignment && $member->age && $member->age < 18) {
                    $ministryAssignment = $this->assignChildMinistry($member, $service);
                }

                // Generate child security code if needed
                $childSecurityCode = null;
                if ($member->age && $member->age < 18 && $service->enable_child_security) {
                    $childSecurityCode = strtoupper(substr(md5($member->id . $service->id . now()), 0, 6));
                }

                $attendance = AttendanceRecord::create([
                    'organization_id' => $user->organization_id,
                    'service_id' => $request->service_id,
                    'member_id' => $member->id,
                    'family_id' => $family->id,
                    'checked_in_by' => $user->id,
                    'checked_in_at' => now(),
                    'checkin_method' => 'qr_family',
                    'is_family_checkin' => true,
                    'location_assignment' => $request->location_assignment,
                    'ministry_assignment' => $ministryAssignment,
                    'parent_id' => $this->getParentMember($member),
                    'child_security_code' => $childSecurityCode,
                    'offline_sync' => $request->boolean('offline_sync', false),
                ]);

                $attendanceRecords[] = $attendance->load('member');
            }

            DB::commit();

            return response()->json([
                'message' => 'Family checked in successfully',
                'data' => [
                    'attendance_records' => $attendanceRecords,
                    'family' => $family,
                    'service' => $service,
                ]
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to check in family',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check in a family manually
     */
    public function familyCheckin(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user->organization_id) {
            return response()->json([
                'message' => 'No organization found for user'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'family_id' => 'required|exists:families,id',
            'service_id' => 'required|exists:services,id',
            'member_ids' => 'nullable|array',
            'member_ids.*' => 'exists:members,id',
            'location_assignment' => 'nullable|string|max:255',
            'ministry_assignment' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verify service and family belong to organization
        $service = Service::where('id', $request->service_id)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$service) {
            return response()->json([
                'message' => 'Service not found'
            ], 404);
        }

        $family = Family::where('id', $request->family_id)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$family) {
            return response()->json([
                'message' => 'Family not found'
            ], 404);
        }

        // Get members to check in
        $members = $request->has('member_ids') && !empty($request->member_ids)
            ? $family->members()->whereIn('id', $request->member_ids)->active()->get()
            : $family->members()->active()->get();

        if ($members->isEmpty()) {
            return response()->json([
                'message' => 'No active members found in family'
            ], 404);
        }

        // Prepare QR data for processing
        $qrData = [
            'type' => 'family_checkin',
            'family_id' => $family->id,
            'member_ids' => $members->pluck('id')->toArray(),
        ];

        return $this->processFamilyCheckin($qrData, $request, $user, $service);
    }

    /**
     * Assign child ministry based on age
     */
    private function assignChildMinistry(Member $member, Service $service): ?string
    {
        if (!$member->date_of_birth || !$member->age) {
            return null;
        }

        $age = $member->age;
        $assignments = $service->ministry_assignments ?? [];

        // Default age-based assignments if not specified in service
        if (empty($assignments)) {
            if ($age < 3) return 'Nursery';
            if ($age < 6) return 'Preschool';
            if ($age < 12) return 'Children';
            if ($age < 18) return 'Youth';
        }

        // Use service-specific assignments
        foreach ($assignments as $assignment) {
            $minAge = $assignment['min_age'] ?? 0;
            $maxAge = $assignment['max_age'] ?? 100;

            if ($age >= $minAge && $age <= $maxAge) {
                return $assignment['ministry_name'] ?? null;
            }
        }

        return null;
    }

    /**
     * Get parent member for a child
     */
    private function getParentMember(Member $member): ?int
    {
        if (!$member->family_id) {
            return null;
        }

        $family = $member->family;
        if (!$family) {
            return null;
        }

        // Find parent in same family (usually older than 18)
        $parent = $family->members()
            ->where('id', '!=', $member->id)
            ->where(function ($q) {
                $q->whereNull('date_of_birth')
                  ->orWhereRaw('YEAR(CURDATE()) - YEAR(date_of_birth) >= 18');
            })
            ->first();

        return $parent ? $parent->id : null;
    }

    /**
     * Get attendance statistics/reports
     */
    public function reports(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user->organization_id) {
            return response()->json([
                'message' => 'No organization found for user'
            ], 404);
        }

        $dateFrom = $request->get('date_from', now()->startOfWeek()->toDateString());
        $dateTo = $request->get('date_to', now()->toDateString());

        $query = AttendanceRecord::where('organization_id', $user->organization_id)
            ->byDateRange($dateFrom, $dateTo);

        // Filter by service if provided
        if ($request->has('service_id')) {
            $query->byService($request->service_id);
        }

        $attendanceRecords = $query->get();

        // Calculate statistics
        $stats = [
            'total_attendance' => $attendanceRecords->count(),
            'member_attendance' => $attendanceRecords->whereNotNull('member_id')->count(),
            'visitor_attendance' => $attendanceRecords->whereNull('member_id')->count(),
            'family_checkins' => $attendanceRecords->where('is_family_checkin', true)->count(),
            'qr_checkins' => $attendanceRecords->whereIn('checkin_method', ['qr_individual', 'qr_family'])->count(),
            'manual_checkins' => $attendanceRecords->where('checkin_method', 'manual_search')->count(),
            'date_range' => [
                'from' => $dateFrom,
                'to' => $dateTo,
            ],
            'daily_breakdown' => $this->getDailyBreakdown($attendanceRecords),
            'service_breakdown' => $this->getServiceBreakdown($attendanceRecords),
        ];

        return response()->json([
            'message' => 'Attendance reports retrieved successfully',
            'data' => $stats
        ]);
    }

    /**
     * Get daily attendance breakdown
     */
    private function getDailyBreakdown($attendanceRecords): array
    {
        return $attendanceRecords->groupBy(function ($record) {
            return $record->checked_in_at->format('Y-m-d');
        })->map(function ($group) {
            return $group->count();
        })->toArray();
    }

    /**
     * Get service type breakdown
     */
    private function getServiceBreakdown($attendanceRecords): array
    {
        return $attendanceRecords->load('service')
            ->groupBy(function ($record) {
                return $record->service->service_type ?? 'unknown';
            })->map(function ($group) {
                return $group->count();
            })->toArray();
    }

    /**
     * Generate QR code for a member
     */
    public function generateMemberQrCode(Request $request, string $memberId): JsonResponse
    {
        $user = Auth::user();

        if (!$user->organization_id) {
            return response()->json([
                'message' => 'No organization found for user'
            ], 404);
        }

        $member = Member::where('id', $memberId)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$member) {
            return response()->json([
                'message' => 'Member not found'
            ], 404);
        }

        $serviceId = $request->get('service_id');
        $qrCode = MemberQrCode::generateForMember($member, $serviceId, $user->organization_id);

        return response()->json([
            'message' => 'QR code generated successfully',
            'data' => [
                'qr_code' => $qrCode,
                'qr_code_data' => $qrCode->qr_code_data,
            ]
        ]);
    }

    /**
     * Generate QR code for a family
     */
    public function generateFamilyQrCode(Request $request, string $familyId): JsonResponse
    {
        $user = Auth::user();

        if (!$user->organization_id) {
            return response()->json([
                'message' => 'No organization found for user'
            ], 404);
        }

        $family = Family::where('id', $familyId)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$family) {
            return response()->json([
                'message' => 'Family not found'
            ], 404);
        }

        $serviceId = $request->get('service_id');
        $qrCode = MemberQrCode::generateForFamily($family, $serviceId, $user->organization_id);

        return response()->json([
            'message' => 'Family QR code generated successfully',
            'data' => [
                'qr_code' => $qrCode,
                'qr_code_data' => $qrCode->qr_code_data,
            ]
        ]);
    }
}

