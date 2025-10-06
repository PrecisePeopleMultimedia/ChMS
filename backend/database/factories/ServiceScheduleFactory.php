<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ServiceSchedule>
 */
class ServiceScheduleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startHour = $this->faker->numberBetween(8, 18);
        $endHour = $startHour + $this->faker->numberBetween(1, 3);

        return [
            'organization_id' => \App\Models\Organization::factory(),
            'name' => $this->faker->randomElement([
                'Sunday Morning Service',
                'Sunday Evening Service',
                'Bible Study',
                'Prayer Meeting',
                'Youth Service',
                'Children\'s Service'
            ]),
            'day_of_week' => $this->faker->numberBetween(0, 6),
            'start_time' => sprintf('%02d:00', $startHour),
            'end_time' => sprintf('%02d:00', $endHour),
            'is_active' => $this->faker->boolean(90), // 90% chance of being active
        ];
    }
}
