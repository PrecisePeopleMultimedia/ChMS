<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ServiceController extends Controller
{
    /**
     * Display a listing of services
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

        $query = Service::where('organization_id', $user->organization_id)
            ->with(['organization']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by service type
        if ($request->has('service_type')) {
            $query->byType($request->service_type);
        }

        // Filter by date range
        if ($request->has('date_from') && $request->has('date_to')) {
            $query->byDateRange($request->date_from, $request->date_to);
        }

        // Get today's services
        if ($request->boolean('today')) {
            $query->today();
        }

        // Get upcoming services
        if ($request->boolean('upcoming')) {
            $query->upcoming();
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $services = $query->orderBy('scheduled_date', 'desc')
            ->orderBy('start_time', 'asc')
            ->paginate($perPage);

        return response()->json([
            'message' => 'Services retrieved successfully',
            'data' => $services
        ]);
    }

    /**
     * Store a newly created service
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
            'name' => 'required|string|max:255',
            'service_type' => ['required', Rule::in(array_keys(Service::SERVICE_TYPES))],
            'scheduled_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'location' => 'nullable|string|max:255',
            'location_assignment' => 'nullable|string|max:255',
            'capacity' => 'nullable|integer|min:0',
            'ministry_assignments' => 'nullable|array',
            'special_requirements' => 'nullable|array',
            'allow_family_checkin' => 'boolean',
            'require_location_assignment' => 'boolean',
            'enable_child_security' => 'boolean',
            'status' => ['nullable', Rule::in(array_keys(Service::STATUSES))],
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $serviceData = $validator->validated();
        $serviceData['organization_id'] = $user->organization_id;
        $serviceData['status'] = $serviceData['status'] ?? 'scheduled';

        $service = Service::create($serviceData);

        return response()->json([
            'message' => 'Service created successfully',
            'data' => $service->load('organization')
        ], 201);
    }

    /**
     * Display the specified service
     */
    public function show(string $id): JsonResponse
    {
        $user = Auth::user();

        $service = Service::where('id', $id)
            ->where('organization_id', $user->organization_id)
            ->with(['organization', 'attendanceRecords.member', 'attendanceRecords.family'])
            ->first();

        if (!$service) {
            return response()->json([
                'message' => 'Service not found'
            ], 404);
        }

        // Add attendance count
        $service->attendance_count = $service->attendance_count;

        return response()->json([
            'message' => 'Service retrieved successfully',
            'data' => $service
        ]);
    }

    /**
     * Update the specified service
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $user = Auth::user();

        $service = Service::where('id', $id)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$service) {
            return response()->json([
                'message' => 'Service not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'service_type' => ['sometimes', 'required', Rule::in(array_keys(Service::SERVICE_TYPES))],
            'scheduled_date' => 'sometimes|required|date',
            'start_time' => 'sometimes|required|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'location' => 'nullable|string|max:255',
            'location_assignment' => 'nullable|string|max:255',
            'capacity' => 'nullable|integer|min:0',
            'ministry_assignments' => 'nullable|array',
            'special_requirements' => 'nullable|array',
            'allow_family_checkin' => 'boolean',
            'require_location_assignment' => 'boolean',
            'enable_child_security' => 'boolean',
            'status' => ['nullable', Rule::in(array_keys(Service::STATUSES))],
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $service->update($validator->validated());

        return response()->json([
            'message' => 'Service updated successfully',
            'data' => $service->load('organization')
        ]);
    }

    /**
     * Remove the specified service
     */
    public function destroy(string $id): JsonResponse
    {
        $user = Auth::user();

        $service = Service::where('id', $id)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$service) {
            return response()->json([
                'message' => 'Service not found'
            ], 404);
        }

        // Don't allow deletion if there are attendance records
        if ($service->attendanceRecords()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete service with existing attendance records'
            ], 422);
        }

        $service->delete();

        return response()->json([
            'message' => 'Service deleted successfully'
        ]);
    }

    /**
     * Get attendance statistics for a service
     */
    public function attendanceStats(string $id): JsonResponse
    {
        $user = Auth::user();

        $service = Service::where('id', $id)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$service) {
            return response()->json([
                'message' => 'Service not found'
            ], 404);
        }

        $attendanceRecords = $service->attendanceRecords();

        $stats = [
            'total_attendance' => $attendanceRecords->count(),
            'member_attendance' => $attendanceRecords->members()->count(),
            'visitor_attendance' => $attendanceRecords->visitors()->count(),
            'family_checkins' => $attendanceRecords->familyCheckins()->count(),
            'qr_checkins' => $attendanceRecords->whereIn('checkin_method', ['qr_individual', 'qr_family'])->count(),
            'manual_checkins' => $attendanceRecords->where('checkin_method', 'manual_search')->count(),
        ];

        return response()->json([
            'message' => 'Attendance statistics retrieved successfully',
            'data' => $stats
        ]);
    }
}

