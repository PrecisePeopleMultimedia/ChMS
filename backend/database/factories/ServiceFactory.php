<?php

namespace Database\Factories;

use App\Models\Service;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Service>
 */
class ServiceFactory extends Factory
{
    protected $model = Service::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $serviceTypes = ['sunday_service', 'midweek', 'special_event'];
        $serviceType = $this->faker->randomElement($serviceTypes);
        
        // Generate service date (past, present, or future)
        $serviceDate = $this->faker->dateTimeBetween('-30 days', '+30 days');
        
        // Generate service times based on type
        $startTime = $this->generateStartTime($serviceType);
        $endTime = $this->generateEndTime($startTime, $serviceType);
        
        return [
            'organization_id' => Organization::factory(),
            'name' => $this->generateServiceName($serviceType),
            'service_date' => $serviceDate,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'service_type' => $serviceType,
            'is_active' => $this->faker->boolean(90), // 90% chance of being active
        ];
    }

    /**
     * Generate service name based on type.
     */
    private function generateServiceName(string $serviceType): string
    {
        $names = [
            'sunday_service' => [
                'Sunday Morning Service',
                'Sunday Worship',
                'Sunday Service',
                'Morning Worship',
                'Sunday Celebration',
            ],
            'midweek' => [
                'Wednesday Bible Study',
                'Midweek Service',
                'Wednesday Prayer Meeting',
                'Bible Study',
                'Midweek Gathering',
            ],
            'special_event' => [
                'Easter Service',
                'Christmas Service',
                'Youth Conference',
                'Women\'s Meeting',
                'Men\'s Fellowship',
                'Children\'s Service',
                'Revival Meeting',
            ],
        ];

        return $this->faker->randomElement($names[$serviceType]);
    }

    /**
     * Generate start time based on service type.
     */
    private function generateStartTime(string $serviceType): string
    {
        $times = [
            'sunday_service' => [
                '08:00:00', '09:00:00', '10:00:00', '11:00:00', '12:00:00'
            ],
            'midweek' => [
                '18:00:00', '19:00:00', '20:00:00'
            ],
            'special_event' => [
                '08:00:00', '09:00:00', '10:00:00', '14:00:00', '15:00:00', '18:00:00', '19:00:00'
            ],
        ];

        return $this->faker->randomElement($times[$serviceType]);
    }

    /**
     * Generate end time based on start time and service type.
     */
    private function generateEndTime(string $startTime, string $serviceType): string
    {
        $start = Carbon::createFromFormat('H:i:s', $startTime);
        
        $duration = [
            'sunday_service' => $this->faker->numberBetween(90, 150), // 1.5-2.5 hours
            'midweek' => $this->faker->numberBetween(60, 120), // 1-2 hours
            'special_event' => $this->faker->numberBetween(120, 240), // 2-4 hours
        ];

        $end = $start->addMinutes($duration[$serviceType]);
        return $end->format('H:i:s');
    }

    /**
     * Create a Sunday service.
     */
    public function sundayService(): static
    {
        return $this->state(fn (array $attributes) => [
            'service_type' => 'sunday_service',
            'name' => $this->faker->randomElement([
                'Sunday Morning Service',
                'Sunday Worship',
                'Sunday Service',
            ]),
            'start_time' => $this->faker->randomElement(['09:00:00', '10:00:00', '11:00:00']),
        ]);
    }

    /**
     * Create a midweek service.
     */
    public function midweek(): static
    {
        return $this->state(fn (array $attributes) => [
            'service_type' => 'midweek',
            'name' => $this->faker->randomElement([
                'Wednesday Bible Study',
                'Midweek Service',
                'Wednesday Prayer Meeting',
            ]),
            'start_time' => $this->faker->randomElement(['18:00:00', '19:00:00', '20:00:00']),
        ]);
    }

    /**
     * Create a special event.
     */
    public function specialEvent(): static
    {
        return $this->state(fn (array $attributes) => [
            'service_type' => 'special_event',
            'name' => $this->faker->randomElement([
                'Easter Service',
                'Christmas Service',
                'Youth Conference',
                'Revival Meeting',
            ]),
        ]);
    }

    /**
     * Create an active service.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Create an inactive service.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Create a service for today.
     */
    public function today(): static
    {
        return $this->state(fn (array $attributes) => [
            'service_date' => Carbon::today(),
        ]);
    }

    /**
     * Create a service for a specific date.
     */
    public function forDate(Carbon $date): static
    {
        return $this->state(fn (array $attributes) => [
            'service_date' => $date,
        ]);
    }
}
