<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MemberAttribute;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class MemberAttributeController extends Controller
{
    /**
     * Display a listing of member attributes
     */
    public function index(Request $request): JsonResponse
    {
        $query = MemberAttribute::where('organization_id', $request->user()->organization_id);

        // Filter by category
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        // Filter by active status
        if ($request->boolean('active_only', true)) {
            $query->active();
        }

        // Search by name or key
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('key', 'LIKE', "%{$search}%");
            });
        }

        $attributes = $query->ordered()->get();

        return response()->json([
            'data' => $attributes,
            'categories' => MemberAttribute::CATEGORIES,
            'field_types' => MemberAttribute::FIELD_TYPES,
        ]);
    }

    /**
     * Store a newly created member attribute
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'key' => [
                'required',
                'string',
                'max:100',
                'regex:/^[a-z0-9_]+$/',
                Rule::unique('member_attributes')->where(function ($query) use ($request) {
                    return $query->where('organization_id', $request->user()->organization_id);
                }),
            ],
            'name' => 'required|string|max:255',
            'field_type' => ['required', Rule::in(array_keys(MemberAttribute::FIELD_TYPES))],
            'category' => ['required', 'string', 'max:100'],
            'field_options' => 'nullable|array',
            'field_options.options' => 'required_if:field_type,select,multi-select|array',
            'field_options.options.*' => 'required_if:field_type,select,multi-select|string|max:255',
            'is_required' => 'boolean',
            'display_order' => 'integer|min:0',
        ]);

        $validated['organization_id'] = $request->user()->organization_id;

        // Validate field options for select and multi-select fields
        if (in_array($validated['field_type'], ['select', 'multi-select'])) {
            if (!isset($validated['field_options']['options']) || empty($validated['field_options']['options'])) {
                return response()->json([
                    'message' => 'Select and multi-select fields must have at least one option',
                    'errors' => ['field_options.options' => ['Select and multi-select fields must have at least one option']]
                ], 422);
            }
        }

        $attribute = MemberAttribute::create($validated);

        return response()->json([
            'message' => 'Custom attribute created successfully',
            'data' => $attribute
        ], 201);
    }

    /**
     * Display the specified member attribute
     */
    public function show(Request $request, MemberAttribute $memberAttribute): JsonResponse
    {
        // Ensure the attribute belongs to the user's organization
        if ($memberAttribute->organization_id !== $request->user()->organization_id) {
            return response()->json(['message' => 'Attribute not found'], 404);
        }

        return response()->json(['data' => $memberAttribute]);
    }

    /**
     * Update the specified member attribute
     */
    public function update(Request $request, MemberAttribute $memberAttribute): JsonResponse
    {
        // Ensure the attribute belongs to the user's organization
        if ($memberAttribute->organization_id !== $request->user()->organization_id) {
            return response()->json(['message' => 'Attribute not found'], 404);
        }

        $validated = $request->validate([
            'key' => [
                'sometimes',
                'string',
                'max:100',
                'regex:/^[a-z0-9_]+$/',
                Rule::unique('member_attributes')->where(function ($query) use ($request) {
                    return $query->where('organization_id', $request->user()->organization_id);
                })->ignore($memberAttribute->id),
            ],
            'name' => 'sometimes|string|max:255',
            'field_type' => ['sometimes', Rule::in(array_keys(MemberAttribute::FIELD_TYPES))],
            'category' => 'sometimes|string|max:100',
            'field_options' => 'nullable|array',
            'field_options.options' => 'required_if:field_type,select,multi-select|array',
            'field_options.options.*' => 'required_if:field_type,select,multi-select|string|max:255',
            'is_required' => 'boolean',
            'display_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        // Validate field options for select and multi-select fields
        if (isset($validated['field_type']) && in_array($validated['field_type'], ['select', 'multi-select'])) {
            if (!isset($validated['field_options']['options']) || empty($validated['field_options']['options'])) {
                return response()->json([
                    'message' => 'Select and multi-select fields must have at least one option',
                    'errors' => ['field_options.options' => ['Select and multi-select fields must have at least one option']]
                ], 422);
            }
        }

        $memberAttribute->update($validated);

        return response()->json([
            'message' => 'Custom attribute updated successfully',
            'data' => $memberAttribute
        ]);
    }

    /**
     * Remove the specified member attribute
     */
    public function destroy(Request $request, MemberAttribute $memberAttribute): JsonResponse
    {
        // Ensure the attribute belongs to the user's organization
        if ($memberAttribute->organization_id !== $request->user()->organization_id) {
            return response()->json(['message' => 'Attribute not found'], 404);
        }

        // Check if attribute has values
        $hasValues = $memberAttribute->attributeValues()->exists();
        
        if ($hasValues) {
            return response()->json([
                'message' => 'Cannot delete attribute that has values. Please remove all values first or deactivate the attribute.',
            ], 422);
        }

        $memberAttribute->delete();

        return response()->json([
            'message' => 'Custom attribute deleted successfully'
        ]);
    }

    /**
     * Get attribute categories
     */
    public function categories(): JsonResponse
    {
        return response()->json([
            'data' => MemberAttribute::CATEGORIES
        ]);
    }

    /**
     * Get field types
     */
    public function fieldTypes(): JsonResponse
    {
        return response()->json([
            'data' => MemberAttribute::FIELD_TYPES
        ]);
    }

    /**
     * Bulk update display order
     */
    public function updateOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'attributes' => 'required|array',
            'attributes.*.id' => 'required|integer|exists:member_attributes,id',
            'attributes.*.display_order' => 'required|integer|min:0',
        ]);

        $organizationId = $request->user()->organization_id;

        foreach ($validated['attributes'] as $attributeData) {
            MemberAttribute::where('id', $attributeData['id'])
                ->where('organization_id', $organizationId)
                ->update(['display_order' => $attributeData['display_order']]);
        }

        return response()->json([
            'message' => 'Attribute order updated successfully'
        ]);
    }
}
