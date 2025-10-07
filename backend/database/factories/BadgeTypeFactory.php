<?php

namespace Database\Factories;

use App\Models\BadgeType;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BadgeType>
 */
class BadgeTypeFactory extends Factory
{
    protected $model = BadgeType::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $colors = [
            '#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1',
            '#20c997', '#fd7e14', '#6c757d', '#e83e8c', '#17a2b8'
        ];

        $icons = array_keys(BadgeType::AVAILABLE_ICONS);

        return [
            'organization_id' => Organization::factory(),
            'name' => $this->faker->unique()->randomElement([
                'Member', 'Visitor', 'Volunteer', 'Leader', 'VIP',
                'New Convert', 'Youth', 'Elder', 'Inactive', 'Follow-up Needed',
                'Deacon', 'Pastor', 'Teacher', 'Usher', 'Choir Member'
            ]),
            'description' => $this->faker->sentence(),
            'color' => $this->faker->randomElement($colors),
            'icon' => $this->faker->randomElement($icons),
            'is_active' => $this->faker->boolean(90), // 90% chance of being active
        ];
    }

    /**
     * Indicate that the badge type is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the badge type is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Create a member badge type.
     */
    public function member(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Member',
            'description' => 'Regular church member',
            'color' => '#007bff',
            'icon' => 'person',
        ]);
    }

    /**
     * Create a visitor badge type.
     */
    public function visitor(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Visitor',
            'description' => 'First-time or occasional visitor',
            'color' => '#28a745',
            'icon' => 'person_add',
        ]);
    }

    /**
     * Create a volunteer badge type.
     */
    public function volunteer(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Volunteer',
            'description' => 'Active volunteer in church ministries',
            'color' => '#ffc107',
            'icon' => 'volunteer_activism',
        ]);
    }

    /**
     * Create a leader badge type.
     */
    public function leader(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Leader',
            'description' => 'Church leadership team member',
            'color' => '#dc3545',
            'icon' => 'admin_panel_settings',
        ]);
    }

    /**
     * Create a VIP badge type.
     */
    public function vip(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'VIP',
            'description' => 'Very Important Person - special attention needed',
            'color' => '#6f42c1',
            'icon' => 'star',
        ]);
    }
}
