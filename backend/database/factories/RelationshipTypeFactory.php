<?php

namespace Database\Factories;

use App\Models\RelationshipType;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RelationshipType>
 */
class RelationshipTypeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = RelationshipType::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $relationshipTypes = [
            ['name' => 'Spouse', 'slug' => 'spouse', 'category' => 'family'],
            ['name' => 'Parent', 'slug' => 'parent', 'category' => 'family'],
            ['name' => 'Child', 'slug' => 'child', 'category' => 'family'],
            ['name' => 'Sibling', 'slug' => 'sibling', 'category' => 'family'],
            ['name' => 'Guardian', 'slug' => 'guardian', 'category' => 'legal'],
            ['name' => 'Ward', 'slug' => 'ward', 'category' => 'legal'],
            ['name' => 'Roommate', 'slug' => 'roommate', 'category' => 'household'],
            ['name' => 'Friend', 'slug' => 'friend', 'category' => 'social'],
        ];

        $type = $this->faker->randomElement($relationshipTypes);

        return [
            'organization_id' => Organization::factory(),
            'name' => $type['name'],
            'slug' => $type['slug'],
            'category' => $type['category'],
            'description' => $this->faker->optional()->sentence(),
            'is_family' => $type['category'] === 'family',
            'is_household' => $type['category'] === 'household',
            'is_legal' => $type['category'] === 'legal',
            'reciprocal_type_id' => null, // Will be set after creation if needed
            'sort_order' => $this->faker->numberBetween(1, 100),
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the relationship type is for family relationships.
     */
    public function family(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'family',
            'is_family' => true,
            'is_household' => false,
            'is_legal' => false,
        ]);
    }

    /**
     * Indicate that the relationship type is for household relationships.
     */
    public function household(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'household',
            'is_family' => false,
            'is_household' => true,
            'is_legal' => false,
        ]);
    }

    /**
     * Indicate that the relationship type is for legal relationships.
     */
    public function legal(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'legal',
            'is_family' => false,
            'is_household' => false,
            'is_legal' => true,
        ]);
    }

    /**
     * Create a spouse relationship type.
     */
    public function spouse(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Spouse',
            'slug' => 'spouse',
            'category' => 'family',
            'is_family' => true,
        ]);
    }

    /**
     * Create a parent relationship type.
     */
    public function parent(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Parent',
            'slug' => 'parent',
            'category' => 'family',
            'is_family' => true,
        ]);
    }

    /**
     * Create a child relationship type.
     */
    public function child(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Child',
            'slug' => 'child',
            'category' => 'family',
            'is_family' => true,
        ]);
    }

    /**
     * Create a guardian relationship type.
     */
    public function guardian(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Guardian',
            'slug' => 'guardian',
            'category' => 'legal',
            'is_legal' => true,
        ]);
    }

    /**
     * Set a specific organization for the relationship type.
     */
    public function forOrganization(Organization $organization): static
    {
        return $this->state(fn (array $attributes) => [
            'organization_id' => $organization->id,
        ]);
    }

    /**
     * Set a reciprocal relationship type.
     */
    public function withReciprocal(int $reciprocalTypeId): static
    {
        return $this->state(fn (array $attributes) => [
            'reciprocal_type_id' => $reciprocalTypeId,
        ]);
    }
}
