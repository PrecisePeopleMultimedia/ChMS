<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceSchedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ServiceScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();

        if (!$user->organization_id) {
            return response()->json([
                'message' => 'No organization found for user',
                'data' => []
            ], 404);
        }

        $schedules = ServiceSchedule::where('organization_id', $user->organization_id)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'message' => 'Service schedules retrieved successfully',
            'data' => $schedules
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();

        // Only admins and staff can create schedules
        if (!$user->isAdmin() && !$user->isStaff()) {
            return response()->json([
                'message' => 'Unauthorized to create service schedules'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'day_of_week' => 'required|integer|between:0,6',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $scheduleData = $validator->validated();
        $scheduleData['organization_id'] = $user->organization_id;

        $schedule = ServiceSchedule::create($scheduleData);

        return response()->json([
            'message' => 'Service schedule created successfully',
            'data' => $schedule
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $user = Auth::user();

        $schedule = ServiceSchedule::where('id', $id)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$schedule) {
            return response()->json([
                'message' => 'Service schedule not found'
            ], 404);
        }

        return response()->json([
            'message' => 'Service schedule retrieved successfully',
            'data' => $schedule
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $user = Auth::user();

        // Only admins and staff can update schedules
        if (!$user->isAdmin() && !$user->isStaff()) {
            return response()->json([
                'message' => 'Unauthorized to update service schedules'
            ], 403);
        }

        $schedule = ServiceSchedule::where('id', $id)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$schedule) {
            return response()->json([
                'message' => 'Service schedule not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'day_of_week' => 'sometimes|required|integer|between:0,6',
            'start_time' => 'sometimes|required|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $schedule->update($validator->validated());

        return response()->json([
            'message' => 'Service schedule updated successfully',
            'data' => $schedule
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $user = Auth::user();

        // Only admins can delete schedules
        if (!$user->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized to delete service schedules'
            ], 403);
        }

        $schedule = ServiceSchedule::where('id', $id)
            ->where('organization_id', $user->organization_id)
            ->first();

        if (!$schedule) {
            return response()->json([
                'message' => 'Service schedule not found'
            ], 404);
        }

        $schedule->delete();

        return response()->json([
            'message' => 'Service schedule deleted successfully'
        ]);
    }
}
