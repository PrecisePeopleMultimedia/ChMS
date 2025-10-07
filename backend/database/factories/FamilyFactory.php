<?php

namespace Database\Factories;

use App\Models\Family;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Family>
 */
class FamilyFactory extends Factory
{
    protected $model = Family::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $familyNames = [
            'The Adebayo Family',
            'The Okafor Family', 
            'The Nwankwo Family',
            'The Ogbonna Family',
            'The Chukwu Family',
            'The Eze Family',
            'The Okoro Family',
            'The Okonkwo Family',
            'The Emeka Family',
            'The Chioma Family'
        ];

        $nigerianCities = [
            'Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt',
            'Benin City', 'Kaduna', 'Jos', 'Ilorin', 'Enugu'
        ];

        return [
            'organization_id' => Organization::factory(),
            'family_name' => $this->faker->randomElement($familyNames),
            'description' => $this->faker->optional(0.3)->sentence(),
            'address' => $this->faker->optional(0.8)->streetAddress(),
            'city' => $this->faker->randomElement($nigerianCities),
            'state' => $this->faker->optional(0.8)->state(),
            'postal_code' => $this->faker->optional(0.6)->postcode(),
            'country' => 'Nigeria',
            'home_phone' => $this->faker->optional(0.7)->phoneNumber(),
            'email' => $this->faker->optional(0.5)->safeEmail(),
            'notes' => $this->faker->optional(0.2)->paragraph(),
            'is_active' => $this->faker->boolean(95), // 95% chance of being active
        ];
    }

    /**
     * Indicate that the family is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the family is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Create a family with complete contact information.
     */
    public function withCompleteContact(): static
    {
        return $this->state(fn (array $attributes) => [
            'address' => $this->faker->streetAddress(),
            'city' => $this->faker->randomElement(['Lagos', 'Abuja', 'Port Harcourt']),
            'state' => $this->faker->state(),
            'postal_code' => $this->faker->postcode(),
            'home_phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->safeEmail(),
        ]);
    }

    /**
     * Create a large family.
     */
    public function large(): static
    {
        return $this->state(fn (array $attributes) => [
            'description' => 'Large family with multiple members',
            'notes' => 'Active family with many children and extended members',
        ]);
    }

    /**
     * Create a small family.
     */
    public function small(): static
    {
        return $this->state(fn (array $attributes) => [
            'description' => 'Small nuclear family',
        ]);
    }

    /**
     * Create a family in Lagos.
     */
    public function inLagos(): static
    {
        return $this->state(fn (array $attributes) => [
            'city' => 'Lagos',
            'state' => 'Lagos State',
            'country' => 'Nigeria',
        ]);
    }

    /**
     * Create a family in Abuja.
     */
    public function inAbuja(): static
    {
        return $this->state(fn (array $attributes) => [
            'city' => 'Abuja',
            'state' => 'Federal Capital Territory',
            'country' => 'Nigeria',
        ]);
    }
}
