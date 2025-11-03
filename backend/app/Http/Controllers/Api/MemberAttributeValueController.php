<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Models\MemberAttribute;
use App\Models\MemberAttributeValue;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class MemberAttributeValueController extends Controller
{
    /**
     * Get all attribute values for a member
     */
    public function index(Request $request, Member $member): JsonResponse
    {
        // Ensure the member belongs to the user's organization
        if ($member->organization_id !== $request->user()->organization_id) {
            return response()->json(['message' => 'Member not found'], 404);
        }

        $attributesWithValues = $member->getCustomAttributesWithValues();

        return response()->json([
            'data' => $attributesWithValues
        ]);
    }

    /**
     * Update attribute values for a member
     */
    public function update(Request $request, Member $member): JsonResponse
    {
        // Ensure the member belongs to the user's organization
        if ($member->organization_id !== $request->user()->organization_id) {
            return response()->json(['message' => 'Member not found'], 404);
        }

        $validated = $request->validate([
            'attributes' => 'required|array',
            'attributes.*' => 'nullable'
        ]);

        // Get all attributes for the organization
        $organizationAttributes = MemberAttribute::where('organization_id', $member->organization_id)
            ->active()
            ->get()
            ->keyBy('key');

        $errors = [];

        DB::beginTransaction();
        try {
            foreach ($validated['attributes'] as $attributeKey => $value) {
                $attribute = $organizationAttributes->get($attributeKey);
                
                if (!$attribute) {
                    continue; // Skip unknown attributes
                }

                // Validate the value
                $rules = $attribute->getValidationRules();
                $validator = validator([$attributeKey => $value], [$attributeKey => $rules]);

                if ($validator->fails()) {
                    $errors[$attributeKey] = $validator->errors()->first($attributeKey);
                    continue;
                }

                // Format and save the value
                $formattedValue = $attribute->formatValue($value);
                
                if ($formattedValue === null && !$attribute->is_required) {
                    // Remove the attribute value if it's null and not required
                    MemberAttributeValue::where('member_id', $member->id)
                        ->where('attribute_id', $attribute->id)
                        ->delete();
                } else {
                    // Update or create the attribute value
                    MemberAttributeValue::updateOrCreate(
                        [
                            'member_id' => $member->id,
                            'attribute_id' => $attribute->id
                        ],
                        ['value' => $formattedValue]
                    );
                }
            }

            if (!empty($errors)) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $errors
                ], 422);
            }

            DB::commit();

            // Return updated attributes
            $updatedAttributes = $member->getCustomAttributesWithValues();

            return response()->json([
                'message' => 'Member attributes updated successfully',
                'data' => $updatedAttributes
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update member attributes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk update attributes for multiple members
     */
    public function bulkUpdate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'member_ids' => 'required|array',
            'member_ids.*' => 'integer|exists:members,id',
            'attributes' => 'required|array',
            'attributes.*' => 'nullable'
        ]);

        $organizationId = $request->user()->organization_id;
        
        // Ensure all members belong to the user's organization
        $members = Member::whereIn('id', $validated['member_ids'])
            ->where('organization_id', $organizationId)
            ->get();

        if ($members->count() !== count($validated['member_ids'])) {
            return response()->json(['message' => 'Some members not found'], 404);
        }

        // Get all attributes for the organization
        $organizationAttributes = MemberAttribute::where('organization_id', $organizationId)
            ->active()
            ->get()
            ->keyBy('key');

        $errors = [];
        $successCount = 0;

        DB::beginTransaction();
        try {
            foreach ($members as $member) {
                $memberErrors = [];
                
                foreach ($validated['attributes'] as $attributeKey => $value) {
                    $attribute = $organizationAttributes->get($attributeKey);
                    
                    if (!$attribute) {
                        continue; // Skip unknown attributes
                    }

                    // Validate the value
                    $rules = $attribute->getValidationRules();
                    $validator = validator([$attributeKey => $value], [$attributeKey => $rules]);

                    if ($validator->fails()) {
                        $memberErrors[$attributeKey] = $validator->errors()->first($attributeKey);
                        continue;
                    }

                    // Format and save the value
                    $formattedValue = $attribute->formatValue($value);
                    
                    if ($formattedValue === null && !$attribute->is_required) {
                        // Remove the attribute value if it's null and not required
                        MemberAttributeValue::where('member_id', $member->id)
                            ->where('attribute_id', $attribute->id)
                            ->delete();
                    } else {
                        // Update or create the attribute value
                        MemberAttributeValue::updateOrCreate(
                            [
                                'member_id' => $member->id,
                                'attribute_id' => $attribute->id
                            ],
                            ['value' => $formattedValue]
                        );
                    }
                }

                if (empty($memberErrors)) {
                    $successCount++;
                } else {
                    $errors[$member->id] = $memberErrors;
                }
            }

            DB::commit();

            return response()->json([
                'message' => "Successfully updated attributes for {$successCount} members",
                'success_count' => $successCount,
                'errors' => $errors
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to bulk update member attributes',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
