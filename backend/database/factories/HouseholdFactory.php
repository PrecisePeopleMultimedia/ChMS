<?php

namespace Database\Factories;

use App\Models\Household;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Household>
 */
class HouseholdFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Household::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'name' => $this->faker->lastName() . ' Household',
            'description' => $this->faker->optional()->sentence(),
            'address' => $this->faker->streetAddress(),
            'city' => $this->faker->city(),
            'state' => $this->faker->stateAbbr(),
            'postal_code' => $this->faker->postcode(),
            'country' => 'US',
            'head_of_household_id' => null, // Will be set after member creation
            'home_phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->safeEmail(),
            'household_type' => $this->faker->randomElement(['primary', 'secondary', 'temporary']),
            'notes' => $this->faker->optional()->sentence(),
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the household is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the household is primary.
     */
    public function primary(): static
    {
        return $this->state(fn (array $attributes) => [
            'household_type' => 'primary',
        ]);
    }

    /**
     * Indicate that the household is secondary.
     */
    public function secondary(): static
    {
        return $this->state(fn (array $attributes) => [
            'household_type' => 'secondary',
        ]);
    }

    /**
     * Indicate that the household is temporary.
     */
    public function temporary(): static
    {
        return $this->state(fn (array $attributes) => [
            'household_type' => 'temporary',
        ]);
    }

    /**
     * Set a specific organization for the household.
     */
    public function forOrganization(Organization $organization): static
    {
        return $this->state(fn (array $attributes) => [
            'organization_id' => $organization->id,
        ]);
    }

    /**
     * Set a specific head of household.
     */
    public function withHeadOfHousehold(int $memberId): static
    {
        return $this->state(fn (array $attributes) => [
            'head_of_household_id' => $memberId,
        ]);
    }
}
