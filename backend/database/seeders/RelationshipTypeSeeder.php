<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RelationshipType;

class RelationshipTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            // Family Relationships
            ['name' => 'Spouse', 'slug' => 'spouse', 'category' => 'family', 'is_family' => true, 'is_household' => true, 'is_legal' => false, 'display_order' => 10],
            ['name' => 'Parent', 'slug' => 'parent', 'category' => 'family', 'is_family' => true, 'is_household' => true, 'is_legal' => true, 'display_order' => 20],
            ['name' => 'Child', 'slug' => 'child', 'category' => 'family', 'is_family' => true, 'is_household' => true, 'is_legal' => true, 'display_order' => 30],
            ['name' => 'Sibling', 'slug' => 'sibling', 'category' => 'family', 'is_family' => true, 'is_household' => false, 'is_legal' => false, 'display_order' => 40],
            ['name' => 'Grandparent', 'slug' => 'grandparent', 'category' => 'family', 'is_family' => true, 'is_household' => false, 'is_legal' => false, 'display_order' => 50],
            ['name' => 'Grandchild', 'slug' => 'grandchild', 'category' => 'family', 'is_family' => true, 'is_household' => false, 'is_legal' => false, 'display_order' => 60],
            ['name' => 'Aunt/Uncle', 'slug' => 'aunt-uncle', 'category' => 'family', 'is_family' => true, 'is_household' => false, 'is_legal' => false, 'display_order' => 70],
            ['name' => 'Niece/Nephew', 'slug' => 'niece-nephew', 'category' => 'family', 'is_family' => true, 'is_household' => false, 'is_legal' => false, 'display_order' => 80],
            ['name' => 'Cousin', 'slug' => 'cousin', 'category' => 'family', 'is_family' => true, 'is_household' => false, 'is_legal' => false, 'display_order' => 90],

            // Household Relationships
            ['name' => 'Head of Household', 'slug' => 'head-of-household', 'category' => 'household', 'is_family' => false, 'is_household' => true, 'is_legal' => false, 'display_order' => 100],
            ['name' => 'Resident', 'slug' => 'resident', 'category' => 'household', 'is_family' => false, 'is_household' => true, 'is_legal' => false, 'display_order' => 110],
            ['name' => 'Temporary Resident', 'slug' => 'temporary-resident', 'category' => 'household', 'is_family' => false, 'is_household' => true, 'is_legal' => false, 'display_order' => 120],

            // Legal Relationships
            ['name' => 'Guardian', 'slug' => 'guardian', 'category' => 'legal', 'is_family' => false, 'is_household' => true, 'is_legal' => true, 'display_order' => 130],
            ['name' => 'Ward', 'slug' => 'ward', 'category' => 'legal', 'is_family' => false, 'is_household' => true, 'is_legal' => true, 'display_order' => 140],
            ['name' => 'Foster Parent', 'slug' => 'foster-parent', 'category' => 'legal', 'is_family' => false, 'is_household' => true, 'is_legal' => true, 'display_order' => 150],
            ['name' => 'Foster Child', 'slug' => 'foster-child', 'category' => 'legal', 'is_family' => false, 'is_household' => true, 'is_legal' => true, 'display_order' => 160],

            // Other
            ['name' => 'Other', 'slug' => 'other', 'category' => 'custom', 'is_family' => true, 'is_household' => true, 'is_legal' => false, 'display_order' => 999],
        ];

        foreach ($types as $type) {
            RelationshipType::firstOrCreate(
                ['slug' => $type['slug']],
                array_merge($type, [
                    'description' => $this->getDescription($type['slug']),
                    'organization_id' => null, // System-wide defaults
                ])
            );
        }

        // Set up reciprocal relationships
        $this->setReciprocalRelationships();
    }

    /**
     * Get description for relationship type
     */
    private function getDescription(string $slug): string
    {
        $descriptions = [
            'spouse' => 'Married partner',
            'parent' => 'Biological or adoptive parent',
            'child' => 'Biological or adoptive child',
            'sibling' => 'Brother or sister',
            'grandparent' => 'Grandfather or grandmother',
            'grandchild' => 'Grandson or granddaughter',
            'aunt-uncle' => 'Aunt or uncle',
            'niece-nephew' => 'Niece or nephew',
            'cousin' => 'Cousin',
            'head-of-household' => 'Head of the household',
            'resident' => 'Permanent resident',
            'temporary-resident' => 'Temporary resident',
            'guardian' => 'Legal guardian',
            'ward' => 'Person under guardianship',
            'foster-parent' => 'Foster parent',
            'foster-child' => 'Foster child',
            'other' => 'Other relationship',
        ];

        return $descriptions[$slug] ?? '';
    }

    /**
     * Set up reciprocal relationships
     */
    private function setReciprocalRelationships(): void
    {
        $reciprocals = [
            'spouse' => 'spouse',
            'parent' => 'child',
            'child' => 'parent',
            'grandparent' => 'grandchild',
            'grandchild' => 'grandparent',
            'aunt-uncle' => 'niece-nephew',
            'niece-nephew' => 'aunt-uncle',
            'sibling' => 'sibling',
            'guardian' => 'ward',
            'ward' => 'guardian',
            'foster-parent' => 'foster-child',
            'foster-child' => 'foster-parent',
        ];

        foreach ($reciprocals as $slug => $reciprocalSlug) {
            $type = RelationshipType::where('slug', $slug)->first();
            $reciprocal = RelationshipType::where('slug', $reciprocalSlug)->first();

            if ($type && $reciprocal) {
                $type->update(['reciprocal_type_id' => $reciprocal->id]);
            }
        }
    }
}

