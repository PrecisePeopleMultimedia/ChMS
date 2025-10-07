<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MemberAttribute;
use App\Models\Organization;

class MemberAttributeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all organizations
        $organizations = Organization::all();

        foreach ($organizations as $organization) {
            $this->createDefaultAttributes($organization->id);
        }
    }

    /**
     * Create default custom attributes for an organization
     */
    private function createDefaultAttributes(int $organizationId): void
    {
        $defaultAttributes = [
            // Personal Information
            [
                'key' => 'baptism_date',
                'name' => 'Baptism Date',
                'field_type' => 'date',
                'category' => 'Personal',
                'is_required' => false,
                'display_order' => 1,
            ],
            [
                'key' => 'confirmation_date',
                'name' => 'Confirmation Date',
                'field_type' => 'date',
                'category' => 'Personal',
                'is_required' => false,
                'display_order' => 2,
            ],
            [
                'key' => 'marital_status',
                'name' => 'Marital Status',
                'field_type' => 'select',
                'category' => 'Personal',
                'field_options' => [
                    'options' => ['Single', 'Married', 'Divorced', 'Widowed', 'Separated']
                ],
                'is_required' => false,
                'display_order' => 3,
            ],
            [
                'key' => 'occupation',
                'name' => 'Occupation',
                'field_type' => 'text',
                'category' => 'Personal',
                'is_required' => false,
                'display_order' => 4,
            ],

            // Contact Details
            [
                'key' => 'secondary_phone',
                'name' => 'Secondary Phone',
                'field_type' => 'phone',
                'category' => 'Contact',
                'is_required' => false,
                'display_order' => 5,
            ],
            [
                'key' => 'work_phone',
                'name' => 'Work Phone',
                'field_type' => 'phone',
                'category' => 'Contact',
                'is_required' => false,
                'display_order' => 6,
            ],
            [
                'key' => 'work_email',
                'name' => 'Work Email',
                'field_type' => 'email',
                'category' => 'Contact',
                'is_required' => false,
                'display_order' => 7,
            ],

            // Ministry Information
            [
                'key' => 'ministry_involvement',
                'name' => 'Ministry Involvement',
                'field_type' => 'textarea',
                'category' => 'Ministry',
                'is_required' => false,
                'display_order' => 8,
            ],
            [
                'key' => 'spiritual_gifts',
                'name' => 'Spiritual Gifts',
                'field_type' => 'textarea',
                'category' => 'Ministry',
                'is_required' => false,
                'display_order' => 9,
            ],
            [
                'key' => 'volunteer_availability',
                'name' => 'Volunteer Availability',
                'field_type' => 'select',
                'category' => 'Ministry',
                'field_options' => [
                    'options' => ['Weekdays', 'Weekends', 'Evenings', 'Anytime', 'Not Available']
                ],
                'is_required' => false,
                'display_order' => 10,
            ],

            // Emergency Contact
            [
                'key' => 'emergency_contact_name',
                'name' => 'Emergency Contact Name',
                'field_type' => 'text',
                'category' => 'Emergency',
                'is_required' => false,
                'display_order' => 11,
            ],
            [
                'key' => 'emergency_contact_phone',
                'name' => 'Emergency Contact Phone',
                'field_type' => 'phone',
                'category' => 'Emergency',
                'is_required' => false,
                'display_order' => 12,
            ],
            [
                'key' => 'emergency_contact_relationship',
                'name' => 'Emergency Contact Relationship',
                'field_type' => 'text',
                'category' => 'Emergency',
                'is_required' => false,
                'display_order' => 13,
            ],

            // Medical Information
            [
                'key' => 'medical_conditions',
                'name' => 'Medical Conditions',
                'field_type' => 'textarea',
                'category' => 'Medical',
                'is_required' => false,
                'display_order' => 14,
            ],
            [
                'key' => 'allergies',
                'name' => 'Allergies',
                'field_type' => 'textarea',
                'category' => 'Medical',
                'is_required' => false,
                'display_order' => 15,
            ],
            [
                'key' => 'medications',
                'name' => 'Current Medications',
                'field_type' => 'textarea',
                'category' => 'Medical',
                'is_required' => false,
                'display_order' => 16,
            ],

            // Family Details
            [
                'key' => 'anniversary_date',
                'name' => 'Wedding Anniversary',
                'field_type' => 'date',
                'category' => 'Family',
                'is_required' => false,
                'display_order' => 17,
            ],
            [
                'key' => 'spouse_name',
                'name' => 'Spouse Name',
                'field_type' => 'text',
                'category' => 'Family',
                'is_required' => false,
                'display_order' => 18,
            ],
            [
                'key' => 'children_names',
                'name' => 'Children Names',
                'field_type' => 'textarea',
                'category' => 'Family',
                'is_required' => false,
                'display_order' => 19,
            ],

            // Custom Fields
            [
                'key' => 'external_id',
                'name' => 'External ID',
                'field_type' => 'text',
                'category' => 'Custom',
                'is_required' => false,
                'display_order' => 20,
            ],
            [
                'key' => 'notes',
                'name' => 'Additional Notes',
                'field_type' => 'textarea',
                'category' => 'Custom',
                'is_required' => false,
                'display_order' => 21,
            ],
        ];

        foreach ($defaultAttributes as $attributeData) {
            $attributeData['organization_id'] = $organizationId;
            
            // Check if attribute already exists
            $exists = MemberAttribute::where('organization_id', $organizationId)
                ->where('key', $attributeData['key'])
                ->exists();

            if (!$exists) {
                MemberAttribute::create($attributeData);
            }
        }
    }
}
