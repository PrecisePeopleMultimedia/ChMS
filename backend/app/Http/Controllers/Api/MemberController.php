<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\MemberAttribute;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class MemberController extends Controller
{
    /**
     * Display a listing of members
     */
    public function index(Request $request): JsonResponse
    {
        $query = Member::where('organization_id', $request->user()->organization_id)
            ->with(['family', 'customAttributes']);

        // Filter by active status
        if ($request->boolean('active_only', true)) {
            $query->active();
        }

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->search($search)
                  ->orWhereHas('attributeValues', function ($subQ) use ($search) {
                      $subQ->where('value', 'LIKE', "%{$search}%");
                  });
            });
        }

        // Filter by member type
        if ($request->has('member_type')) {
            $query->byType($request->member_type);
        }

        // Filter by gender
        if ($request->has('gender')) {
            $query->byGender($request->gender);
        }

        // Filter by family
        if ($request->has('family_id')) {
            $query->where('family_id', $request->family_id);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $members = $query->orderBy('first_name')->orderBy('last_name')->paginate($perPage);

        return response()->json($members);
    }

    /**
     * Store a newly created member
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'date_of_birth' => 'nullable|date',
            'gender' => ['nullable', Rule::in(array_keys(Member::GENDERS))],
            'address' => 'nullable|string',
            'member_type' => ['required', Rule::in(array_keys(Member::MEMBER_TYPES))],
            'family_id' => 'nullable|integer|exists:families,id',
            'joined_date' => 'nullable|date',
            'custom_attributes' => 'nullable|array',
        ]);

        $validated['organization_id'] = $request->user()->organization_id;

        // Validate custom attributes if provided
        if (isset($validated['custom_attributes'])) {
            $customAttributeErrors = $this->validateCustomAttributes(
                $validated['custom_attributes'],
                $request->user()->organization_id
            );

            if (!empty($customAttributeErrors)) {
                return response()->json([
                    'message' => 'Custom attribute validation failed',
                    'errors' => ['custom_attributes' => $customAttributeErrors]
                ], 422);
            }
        }

        // Create member
        $customAttributes = $validated['custom_attributes'] ?? [];
        unset($validated['custom_attributes']);

        $member = Member::create($validated);

        // Set custom attributes
        if (!empty($customAttributes)) {
            $member->updateCustomAttributes($customAttributes);
        }

        // Load relationships for response
        $member->load(['family', 'customAttributes']);

        return response()->json([
            'message' => 'Member created successfully',
            'data' => $member
        ], 201);
    }

    /**
     * Display the specified member
     */
    public function show(Request $request, Member $member): JsonResponse
    {
        // Ensure the member belongs to the user's organization
        if ($member->organization_id !== $request->user()->organization_id) {
            return response()->json(['message' => 'Member not found'], 404);
        }

        $member->load(['family', 'customAttributes']);

        // Get custom attributes with values
        $customAttributesWithValues = $member->getCustomAttributesWithValues();

        return response()->json([
            'data' => $member,
            'custom_attributes' => $customAttributesWithValues
        ]);
    }

    /**
     * Update the specified member
     */
    public function update(Request $request, Member $member): JsonResponse
    {
        // Ensure the member belongs to the user's organization
        if ($member->organization_id !== $request->user()->organization_id) {
            return response()->json(['message' => 'Member not found'], 404);
        }

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:100',
            'last_name' => 'sometimes|string|max:100',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'date_of_birth' => 'nullable|date',
            'gender' => ['nullable', Rule::in(array_keys(Member::GENDERS))],
            'address' => 'nullable|string',
            'member_type' => ['sometimes', Rule::in(array_keys(Member::MEMBER_TYPES))],
            'family_id' => 'nullable|integer|exists:families,id',
            'joined_date' => 'nullable|date',
            'is_active' => 'boolean',
            'custom_attributes' => 'nullable|array',
        ]);

        // Validate custom attributes if provided
        if (isset($validated['custom_attributes'])) {
            $customAttributeErrors = $this->validateCustomAttributes(
                $validated['custom_attributes'],
                $request->user()->organization_id
            );

            if (!empty($customAttributeErrors)) {
                return response()->json([
                    'message' => 'Custom attribute validation failed',
                    'errors' => ['custom_attributes' => $customAttributeErrors]
                ], 422);
            }
        }

        // Update member
        $customAttributes = $validated['custom_attributes'] ?? null;
        unset($validated['custom_attributes']);

        $member->update($validated);

        // Update custom attributes if provided
        if ($customAttributes !== null) {
            $member->updateCustomAttributes($customAttributes);
        }

        // Load relationships for response
        $member->load(['family', 'customAttributes']);

        return response()->json([
            'message' => 'Member updated successfully',
            'data' => $member
        ]);
    }

    /**
     * Remove the specified member
     */
    public function destroy(Request $request, Member $member): JsonResponse
    {
        // Ensure the member belongs to the user's organization
        if ($member->organization_id !== $request->user()->organization_id) {
            return response()->json(['message' => 'Member not found'], 404);
        }

        $member->delete();

        return response()->json([
            'message' => 'Member deleted successfully'
        ]);
    }

    /**
     * Get member types and genders for form options
     */
    public function options(): JsonResponse
    {
        return response()->json([
            'member_types' => Member::MEMBER_TYPES,
            'genders' => Member::GENDERS,
        ]);
    }

    /**
     * Bulk update members
     */
    public function bulkUpdate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'member_ids' => 'required|array',
            'member_ids.*' => 'integer|exists:members,id',
            'updates' => 'required|array',
            'updates.member_type' => ['nullable', Rule::in(array_keys(Member::MEMBER_TYPES))],
            'updates.is_active' => 'nullable|boolean',
            'updates.custom_attributes' => 'nullable|array',
        ]);

        $organizationId = $request->user()->organization_id;
        $memberIds = $validated['member_ids'];
        $updates = $validated['updates'];

        // Validate custom attributes if provided
        if (isset($updates['custom_attributes'])) {
            $customAttributeErrors = $this->validateCustomAttributes(
                $updates['custom_attributes'],
                $organizationId
            );

            if (!empty($customAttributeErrors)) {
                return response()->json([
                    'message' => 'Custom attribute validation failed',
                    'errors' => ['custom_attributes' => $customAttributeErrors]
                ], 422);
            }
        }

        $members = Member::whereIn('id', $memberIds)
            ->where('organization_id', $organizationId)
            ->get();

        $customAttributes = $updates['custom_attributes'] ?? null;
        unset($updates['custom_attributes']);

        // Update basic fields
        if (!empty($updates)) {
            Member::whereIn('id', $memberIds)
                ->where('organization_id', $organizationId)
                ->update($updates);
        }

        // Update custom attributes
        if ($customAttributes !== null) {
            foreach ($members as $member) {
                $member->updateCustomAttributes($customAttributes);
            }
        }

        return response()->json([
            'message' => 'Members updated successfully',
            'updated_count' => $members->count()
        ]);
    }

    /**
     * Validate custom attributes
     */
    private function validateCustomAttributes(array $attributes, int $organizationId): array
    {
        $errors = [];

        $memberAttributes = MemberAttribute::where('organization_id', $organizationId)
            ->active()
            ->get()
            ->keyBy('key');

        // Check for missing required attributes
        $requiredAttributes = $memberAttributes->where('is_required', true);
        foreach ($requiredAttributes as $requiredAttribute) {
            if (!array_key_exists($requiredAttribute->key, $attributes)) {
                $errors[$requiredAttribute->key] = 'The ' . strtolower($requiredAttribute->name) . ' field is required.';
            }
        }

        // Validate provided attributes
        foreach ($attributes as $attributeKey => $value) {
            $attribute = $memberAttributes->get($attributeKey);

            if (!$attribute) {
                $errors[$attributeKey] = 'Invalid attribute';
                continue;
            }

            $rules = $attribute->getValidationRules();
            $validator = validator([$attributeKey => $value], [$attributeKey => $rules]);

            if ($validator->fails()) {
                $errors[$attributeKey] = $validator->errors()->first($attributeKey);
            }
        }

        return $errors;
    }
}
