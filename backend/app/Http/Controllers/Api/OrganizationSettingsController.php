<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\OrganizationSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class OrganizationSettingsController extends Controller
{
    /**
     * Display organization settings.
     */
    public function index(string $organizationId): JsonResponse
    {
        $user = Auth::user();

        // Users can only view their own organization settings
        if ($user->organization_id != $organizationId) {
            return response()->json([
                'message' => 'Unauthorized to view these settings'
            ], 403);
        }

        $organization = Organization::find($organizationId);

        if (!$organization) {
            return response()->json([
                'message' => 'Organization not found'
            ], 404);
        }

        $settings = $organization->settings()->get()->pluck('setting_value', 'setting_key');

        return response()->json([
            'message' => 'Settings retrieved successfully',
            'data' => $settings
        ]);
    }

    /**
     * Update organization settings.
     */
    public function update(Request $request, string $organizationId): JsonResponse
    {
        $user = Auth::user();

        // Only admins can update settings
        if (!$user->isAdmin() || $user->organization_id != $organizationId) {
            return response()->json([
                'message' => 'Unauthorized to update these settings'
            ], 403);
        }

        $organization = Organization::find($organizationId);

        if (!$organization) {
            return response()->json([
                'message' => 'Organization not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'settings' => 'required|array',
            'settings.*' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $settings = $request->input('settings', []);

        foreach ($settings as $key => $value) {
            $organization->setSetting($key, $value);
        }

        // Return updated settings
        $updatedSettings = $organization->settings()->get()->pluck('setting_value', 'setting_key');

        return response()->json([
            'message' => 'Settings updated successfully',
            'data' => $updatedSettings
        ]);
    }

    /**
     * Get a specific setting.
     */
    public function show(string $organizationId, string $key): JsonResponse
    {
        $user = Auth::user();

        // Users can only view their own organization settings
        if ($user->organization_id != $organizationId) {
            return response()->json([
                'message' => 'Unauthorized to view this setting'
            ], 403);
        }

        $organization = Organization::find($organizationId);

        if (!$organization) {
            return response()->json([
                'message' => 'Organization not found'
            ], 404);
        }

        $value = $organization->getSetting($key);

        return response()->json([
            'message' => 'Setting retrieved successfully',
            'data' => [
                'key' => $key,
                'value' => $value
            ]
        ]);
    }

    /**
     * Store or update a specific setting.
     */
    public function store(Request $request, string $organizationId): JsonResponse
    {
        $user = Auth::user();

        // Only admins can create/update settings
        if (!$user->isAdmin() || $user->organization_id != $organizationId) {
            return response()->json([
                'message' => 'Unauthorized to update settings'
            ], 403);
        }

        $organization = Organization::find($organizationId);

        if (!$organization) {
            return response()->json([
                'message' => 'Organization not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'key' => 'required|string|max:100',
            'value' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $key = $request->input('key');
        $value = $request->input('value');

        $organization->setSetting($key, $value);

        return response()->json([
            'message' => 'Setting saved successfully',
            'data' => [
                'key' => $key,
                'value' => $value
            ]
        ], 201);
    }

    /**
     * Remove a specific setting.
     */
    public function destroy(string $organizationId, string $key): JsonResponse
    {
        $user = Auth::user();

        // Only admins can delete settings
        if (!$user->isAdmin() || $user->organization_id != $organizationId) {
            return response()->json([
                'message' => 'Unauthorized to delete this setting'
            ], 403);
        }

        $organization = Organization::find($organizationId);

        if (!$organization) {
            return response()->json([
                'message' => 'Organization not found'
            ], 404);
        }

        $setting = $organization->settings()->where('setting_key', $key)->first();

        if (!$setting) {
            return response()->json([
                'message' => 'Setting not found'
            ], 404);
        }

        $setting->delete();

        return response()->json([
            'message' => 'Setting deleted successfully'
        ]);
    }
}
