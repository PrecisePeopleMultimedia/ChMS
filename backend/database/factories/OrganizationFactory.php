<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Organization>
 */
class OrganizationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->company . ' Church',
            'address' => $this->faker->address,
            'phone' => $this->faker->phoneNumber,
            'email' => $this->faker->unique()->safeEmail,
            'website' => $this->faker->url,
            'description' => $this->faker->paragraph,
            'timezone' => $this->faker->randomElement([
                'Africa/Lagos',
                'Africa/Nairobi',
                'Africa/Johannesburg',
                'Africa/Cairo',
                'Africa/Casablanca'
            ]),
        ];
    }
}
