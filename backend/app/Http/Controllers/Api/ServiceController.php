<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ServiceRequest;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ServiceController extends Controller
{
    /**
     * Display a listing of services.
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        $organizationId = $user->organization_id;

        $query = Service::where('organization_id', $organizationId);

        // Filter by service type
        if ($request->has('service_type')) {
            $query->where('service_type', $request->service_type);
        }

        // Filter by date range
        if ($request->has('start_date')) {
            $query->whereDate('service_date', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->whereDate('service_date', '<=', $request->end_date);
        }

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Filter by upcoming services
        if ($request->boolean('upcoming')) {
            $query->where('service_date', '>=', Carbon::today());
        }

        // Filter by past services
        if ($request->boolean('past')) {
            $query->where('service_date', '<', Carbon::today());
        }

        // Order by service date
        $orderBy = $request->get('order_by', 'service_date');
        $orderDirection = $request->get('order_direction', 'desc');
        $query->orderBy($orderBy, $orderDirection);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $services = $query->paginate($perPage);

        // Load attendance statistics
        $services->getCollection()->loadCount('attendanceRecords');

        return response()->json([
            'data' => $services->items(),
            'pagination' => [
                'current_page' => $services->currentPage(),
                'last_page' => $services->lastPage(),
                'per_page' => $services->perPage(),
                'total' => $services->total(),
            ],
        ]);
    }

    /**
     * Store a newly created service.
     */
    public function store(ServiceRequest $request): JsonResponse
    {
        $user = Auth::user();
        $organizationId = $user->organization_id;

        $service = Service::create([
            'organization_id' => $organizationId,
            'name' => $request->name,
            'service_date' => $request->service_date,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'service_type' => $request->service_type,
            'is_active' => $request->get('is_active', true),
        ]);

        return response()->json([
            'message' => 'Service created successfully',
            'data' => $service,
        ], 201);
    }

    /**
     * Display the specified service.
     */
    public function show(Service $service): JsonResponse
    {
        $user = Auth::user();
        
        // Check if service belongs to user's organization
        if ($service->organization_id !== $user->organization_id) {
            return response()->json([
                'message' => 'Service not found',
            ], 404);
        }

        // Load relationships and statistics
        $service->loadCount('attendanceRecords');
        $service->load(['organization']);

        return response()->json([
            'data' => $service,
        ]);
    }

    /**
     * Update the specified service.
     */
    public function update(ServiceRequest $request, Service $service): JsonResponse
    {
        $user = Auth::user();
        
        // Check if service belongs to user's organization
        if ($service->organization_id !== $user->organization_id) {
            return response()->json([
                'message' => 'Service not found',
            ], 404);
        }

        $service->update($request->validated());

        return response()->json([
            'message' => 'Service updated successfully',
            'data' => $service,
        ]);
    }

    /**
     * Remove the specified service.
     */
    public function destroy(Service $service): JsonResponse
    {
        $user = Auth::user();
        
        // Check if service belongs to user's organization
        if ($service->organization_id !== $user->organization_id) {
            return response()->json([
                'message' => 'Service not found',
            ], 404);
        }

        // Check if service has attendance records
        if ($service->attendanceRecords()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete service with attendance records',
            ], 422);
        }

        $service->delete();

        return response()->json([
            'message' => 'Service deleted successfully',
        ]);
    }

    /**
     * Get active services for today.
     */
    public function today(): JsonResponse
    {
        $user = Auth::user();
        $organizationId = $user->organization_id;

        $services = Service::where('organization_id', $organizationId)
            ->where('service_date', Carbon::today())
            ->where('is_active', true)
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'data' => $services,
        ]);
    }

    /**
     * Get upcoming services.
     */
    public function upcoming(Request $request): JsonResponse
    {
        $user = Auth::user();
        $organizationId = $user->organization_id;

        $days = $request->get('days', 7);
        $endDate = Carbon::today()->addDays($days);

        $services = Service::where('organization_id', $organizationId)
            ->where('service_date', '>=', Carbon::today())
            ->where('service_date', '<=', $endDate)
            ->where('is_active', true)
            ->orderBy('service_date')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'data' => $services,
        ]);
    }

    /**
     * Get service statistics.
     */
    public function stats(Service $service): JsonResponse
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
            'attendance_by_hour' => $this->getAttendanceByHour($service),
        ];

        return response()->json([
            'data' => $stats,
        ]);
    }

    /**
     * Get attendance breakdown by hour for a service.
     */
    private function getAttendanceByHour(Service $service): array
    {
        $attendance = $service->attendanceRecords()
            ->selectRaw('HOUR(check_in_time) as hour, COUNT(*) as count')
            ->groupBy('hour')
            ->orderBy('hour')
            ->get();

        $hourlyData = [];
        for ($hour = 0; $hour < 24; $hour++) {
            $hourlyData[$hour] = 0;
        }

        foreach ($attendance as $record) {
            $hourlyData[$record->hour] = $record->count;
        }

        return $hourlyData;
    }

    /**
     * Get service types.
     */
    public function types(): JsonResponse
    {
        $types = [
            ['value' => 'sunday_service', 'label' => 'Sunday Service'],
            ['value' => 'midweek', 'label' => 'Midweek Service'],
            ['value' => 'special_event', 'label' => 'Special Event'],
        ];

        return response()->json([
            'data' => $types,
        ]);
    }

    /**
     * Create a service from a service schedule.
     */
    public function createFromSchedule(Request $request): JsonResponse
    {
        $request->validate([
            'schedule_id' => 'required|exists:service_schedules,id',
            'service_date' => 'required|date',
        ]);

        $user = Auth::user();
        $organizationId = $user->organization_id;

        // Get the service schedule
        $schedule = \App\Models\ServiceSchedule::where('id', $request->schedule_id)
            ->where('organization_id', $organizationId)
            ->first();

        if (!$schedule) {
            return response()->json([
                'message' => 'Service schedule not found',
            ], 404);
        }

        // Check if service already exists for this date
        $existingService = Service::where('organization_id', $organizationId)
            ->where('service_date', $request->service_date)
            ->where('service_type', $schedule->service_type)
            ->first();

        if ($existingService) {
            return response()->json([
                'message' => 'Service already exists for this date',
                'data' => $existingService,
            ], 409);
        }

        // Create service from schedule
        $service = Service::create([
            'organization_id' => $organizationId,
            'name' => $schedule->name,
            'service_date' => $request->service_date,
            'start_time' => $schedule->start_time,
            'end_time' => $schedule->end_time,
            'service_type' => $schedule->service_type,
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Service created from schedule successfully',
            'data' => $service,
        ], 201);
    }
}
